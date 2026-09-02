import puppeteer from "puppeteer-core";
const CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PAGE="http://localhost:4173/landing-pages/meng-to-sketchbook-engagement.html";
const APP ="http://localhost:4173/";
const out=[];let fails=0;
const ok=(n,c,d="")=>{out.push(`${c?"PASS":"FAIL"}  ${n}${d?"  — "+d:""}`);if(!c)fails++;};
const b=await puppeteer.launch({executablePath:CHROME,headless:false,args:["--no-sandbox","--window-size=1440,900"],defaultViewport:{width:1440,height:900}});

/* ---- drag the page to turn ---- */
let p=await b.newPage();
await p.goto(PAGE+"?nointro&lang=en",{waitUntil:"networkidle0"});
await p.waitForFunction('document.body.dataset.ready==="1"');
await p.evaluate(()=>sessionStorage.clear());
const cap0=await p.evaluate(()=>document.querySelector('.sb-caption').textContent.trim());
const bk=await p.evaluate(()=>{const r=document.getElementById('sbBook').getBoundingClientRect();
  return{x:r.left,y:r.top,w:r.width,h:r.height};});
await p.mouse.move(bk.x+bk.w*0.80, bk.y+bk.h*0.5);
await p.mouse.down();
for(let i=1;i<=12;i++){await p.mouse.move(bk.x+bk.w*(0.80-0.055*i), bk.y+bk.h*0.5);await new Promise(r=>setTimeout(r,16));}
const mid=await p.evaluate(()=>({curl:!!document.querySelector('.curl'),tt:document.getElementById('sb3d').style.getPropertyValue('--tt')}));
await p.mouse.up();
await new Promise(r=>setTimeout(r,1400));
const cap1=await p.evaluate(()=>document.querySelector('.sb-caption').textContent.trim());
ok("drag builds the curling leaf",mid.curl&&parseFloat(mid.tt)>10,`--tt=${mid.tt}`);
ok("drag past threshold commits the turn",cap1!==cap0,`${cap0} -> ${cap1}`);

/* ---- drag the magnifier ---- */
const l0=await p.evaluate(()=>document.getElementById('loupe').style.transform);
const lb=await p.evaluate(()=>{const r=document.getElementById('loupe').getBoundingClientRect();
  return{x:r.left+r.width/2,y:r.top+r.height/2};});
await p.mouse.move(lb.x,lb.y);
await p.mouse.down();
for(let i=1;i<=10;i++){await p.mouse.move(lb.x-14*i, lb.y-9*i);await new Promise(r=>setTimeout(r,16));}
await p.mouse.up();
await new Promise(r=>setTimeout(r,300));
const lz=await p.evaluate(()=>({tf:document.getElementById('loupe').style.transform,
  zoomOpacity:document.getElementById('zoomWrap').style.opacity,
  zoomHasCopy:document.getElementById('zoomInner').children.length>0}));
ok("magnifier can be dragged",lz.tf!==l0,`${l0} -> ${lz.tf}`);
ok("magnified copy is live under the glass",lz.zoomHasCopy&&parseFloat(lz.zoomOpacity)>0.5,`opacity ${lz.zoomOpacity}`);

/* ---- keyboard ---- */
const k0=await p.evaluate(()=>document.querySelector('.sb-caption').textContent.trim());
await p.keyboard.press("ArrowRight");
await new Promise(r=>setTimeout(r,1400));
const k1=await p.evaluate(()=>document.querySelector('.sb-caption').textContent.trim());
ok("keyboard ArrowRight turns",k1!==k0,`${k0} -> ${k1}`);

/* ---- index jumps to a plate ---- */
await p.evaluate(()=>document.querySelectorAll('.plate')[7].click());
await new Promise(r=>setTimeout(r,1500));
const jump=await p.evaluate(()=>document.querySelector('.sb-caption').textContent.trim());
ok("index jumps to its plate",jump==="RSVP",jump);
await p.close();

/* ---- the React wrapper injects typography into the frame ---- */
p=await b.newPage();
await p.goto(APP,{waitUntil:"networkidle0"});
await new Promise(r=>setTimeout(r,3500));
const app=await p.evaluate(()=>{
  const f=document.querySelector('iframe');
  const d=f&&f.contentDocument;
  const wrap=document.querySelector('.landing-page-frame');
  if(!d)return{noFrame:true};
  const cs=d.defaultView.getComputedStyle(d.querySelector('.top .name'));
  return{
    state:wrap.getAttribute('data-state'),
    src:f.getAttribute('src'),
    injected:!!d.querySelector('style[data-threeui],style'),
    styleCount:d.querySelectorAll('style').length,
    nameFont:cs.fontFamily, nameWeight:cs.fontWeight,
    ink:d.defaultView.getComputedStyle(d.documentElement).getPropertyValue('--ink').trim(),
    dir:d.documentElement.dir,
    ready:d.body.dataset.ready
  };
});
ok("app mounts the frame",!app.noFrame&&app.state==="ready",app.state);
ok("frame url carries the language props",/lang=en/.test(app.src||"")&&/langs=en%2Car|langs=en,ar/.test(app.src||""),app.src);
ok("invitation booted inside the frame",app.ready==="1",String(app.ready));
ok("typography injected into the frame",app.styleCount>1,`${app.styleCount} <style> tags`);
ok("primaryColor reached the page",app.ink==="#2b2721",app.ink);
ok("heading font applied",/Instrument Serif/.test(app.nameFont||""),app.nameFont);
await p.close();
await b.close();
console.log(out.join("\n"));
console.log(`\n${out.length-fails}/${out.length} checks passed`);
process.exit(fails?1:0);
