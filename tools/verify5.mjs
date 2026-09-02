import puppeteer from "puppeteer-core";
const URL="http://localhost:4173/landing-pages/meng-to-sketchbook-engagement.html";
const out=[];let fails=0;
const ok=(n,c,d="")=>{out.push(`${c?"PASS":"FAIL"}  ${n}${d?"  — "+d:""}`);if(!c)fails++;};
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless:false,args:["--no-sandbox","--window-size=1440,940"]});

const cap=p=>p.evaluate(()=>document.querySelector('.sb-caption')?.textContent.trim());
const at =p=>p.evaluate(()=>[...document.querySelectorAll('.plate')].findIndex(e=>e.getAttribute('aria-current')==='true'));

async function open(vp,lang){
  const p=await b.newPage();
  await p.setViewport(vp);
  await p.goto(`${URL}?nointro&lang=${lang}`,{waitUntil:"networkidle0"});
  await p.waitForFunction('document.body.dataset.ready==="1"');
  await new Promise(r=>setTimeout(r,400));
  return p;
}

/* ---------- desktop: scroll through the whole book ---------- */
let p=await open({width:1440,height:900},"en");
const geo=await p.evaluate(()=>{
  const h=document.getElementById('sketchbook');
  return {trackH:h.offsetHeight,vh:innerHeight,runway:h.offsetHeight-innerHeight,pin:getComputedStyle(document.querySelector('.hero-pin')).position};
});
ok("stage is pinned across the track",geo.pin==="sticky",geo.pin);
ok("track has runway for every plate",geo.runway>geo.vh*3,`runway ${geo.runway}px over ${geo.vh}px viewport`);

const seen=[];
for(let i=0;i<=9;i++){
  await p.evaluate(y=>scrollTo(0,y), Math.round(geo.runway*(i+0.5)/9));
  await new Promise(r=>setTimeout(r,700));
  seen.push(await at(p));
}
ok("scrolling walks every plate in order",
   JSON.stringify(seen.slice(0,9))===JSON.stringify([0,1,2,3,4,5,6,7,8]),
   seen.join(","));

/* past the end the page keeps going, it does not stick */
await p.evaluate(()=>scrollTo(0,document.body.scrollHeight));
await new Promise(r=>setTimeout(r,700));
const endState=await p.evaluate(()=>({
  y:Math.round(scrollY),
  bottom:Math.round(document.body.scrollHeight-innerHeight),
  rsvpSeen:document.getElementById('rsvp').getBoundingClientRect().top<innerHeight
}));
ok("the page scrolls past the book to the end",endState.y>=endState.bottom-4,`${endState.y}/${endState.bottom}`);
ok("the RSVP is reachable below the book",endState.rsvpSeen);

/* scrolling back up walks it backwards */
await p.evaluate(y=>scrollTo(0,y), Math.round(geo.runway*0.5/9));
await new Promise(r=>setTimeout(r,900));
ok("scrolling back up returns to the first plate",await at(p)===0,`plate ${await at(p)+1}`);
await p.close();

/* ---------- phone: a finger does the same, nothing intercepted ---------- */
p=await open({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2},"ar");
const g2=await p.evaluate(()=>{const h=document.getElementById('sketchbook');
  return {runway:h.offsetHeight-innerHeight,ta:getComputedStyle(document.querySelector('.sb-stage')).touchAction};});
ok("touch scrolling is never blocked",g2.ta.includes("pan-y"),g2.ta);
const seenM=[];
for(const i of [0,3,6,8]){
  await p.evaluate(y=>scrollTo(0,y), Math.round(g2.runway*(i+0.5)/9));
  await new Promise(r=>setTimeout(r,800));
  seenM.push(await at(p));
}
ok("phone: scrolling walks the plates",JSON.stringify(seenM)===JSON.stringify([0,3,6,8]),seenM.join(","));
const arCap=await cap(p);
ok("phone rtl: lands on the closing plate",arCap==="مع الحب",arCap);
const ox=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
ok("no horizontal overflow on the track",ox<=0,`${ox}px`);
await p.close();

/* ---------- the index still drives it ---------- */
p=await open({width:1440,height:900},"en");
await p.evaluate(()=>document.querySelectorAll('.plate')[5].click());
await new Promise(r=>setTimeout(r,2000));
ok("index jumps scroll the track to that plate",await at(p)===5,`plate ${await at(p)+1}`);
await p.close();
await b.close();
console.log(out.join("\n"));
console.log(`\n${out.length-fails}/${out.length} checks passed`);
process.exit(fails?1:0);
