import puppeteer from "puppeteer-core";
const SHOT=process.argv[2];
const PAGE="http://localhost:4173/landing-pages/meng-to-sketchbook-engagement.html";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless:false,args:["--no-sandbox","--window-size=1500,1000"]});
async function shot(name,{w,h,lang,sel,mobile=false}){
  const p=await b.newPage();
  await p.setViewport({width:w,height:h,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
  await p.goto(PAGE+"?nointro&lang="+lang,{waitUntil:"networkidle0"});
  await p.waitForFunction('document.body.dataset.ready==="1"',{timeout:30000});
  await p.evaluate(s=>document.querySelector(s).scrollIntoView({block:"start"}),sel);
  await new Promise(r=>setTimeout(r,1000));
  await p.screenshot({path:`${SHOT}/${name}.png`});
  await p.close();console.log("shot",name);
}
await shot("ar-details",{w:1440,h:900,lang:"ar",sel:"#details"});
await shot("en-details",{w:1440,h:900,lang:"en",sel:"#details"});
await shot("ar-invite",{w:1440,h:900,lang:"ar",sel:"#about"});
await b.close();
