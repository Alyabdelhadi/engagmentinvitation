import puppeteer from "puppeteer-core";
const SHOT=process.argv[2];
const PAGE="http://localhost:4173/landing-pages/meng-to-sketchbook-engagement.html";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless:false,args:["--no-sandbox","--window-size=1500,1000"]});
async function shot(name,{w,h,lang,scroll=0,mobile=false,plate=null}){
  const p=await b.newPage();
  await p.setViewport({width:w,height:h,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
  await p.goto(PAGE+"?nointro&lang="+lang,{waitUntil:"networkidle0"});
  await p.waitForFunction('document.body.dataset.ready==="1"',{timeout:30000});
  if(plate!==null) await p.evaluate(i=>{goTo(i);},plate);
  await new Promise(r=>setTimeout(r,1500));
  if(scroll) await p.evaluate(y=>window.scrollTo(0,y),scroll);
  await new Promise(r=>setTimeout(r,900));
  await p.screenshot({path:`${SHOT}/${name}.png`});
  await p.close();
  console.log("shot",name);
}
await shot("desktop-en",{w:1440,h:900,lang:"en"});
await shot("desktop-ar",{w:1440,h:900,lang:"ar"});
await shot("desktop-ar-story",{w:1440,h:900,lang:"ar",plate:4});
await shot("desktop-ar-lower",{w:1440,h:900,lang:"ar",scroll:1700});
await shot("desktop-en-lower",{w:1440,h:900,lang:"en",scroll:1700});
await shot("mobile-ar",{w:390,h:844,lang:"ar",mobile:true});
await shot("mobile-en",{w:390,h:844,lang:"en",mobile:true});
await b.close();
