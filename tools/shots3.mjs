import puppeteer from "puppeteer-core";
const SHOT=process.argv[2];
const PAGE="http://localhost:4173/landing-pages/meng-to-sketchbook-engagement.html";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless:false,args:["--no-sandbox","--window-size=1500,1000"]});
async function shot(name,{w,h,lang,mobile=false}){
  const p=await b.newPage();
  await p.setViewport({width:w,height:h,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
  await p.goto(PAGE+"?nointro&lang="+lang,{waitUntil:"networkidle0"});
  await p.waitForFunction('document.body.dataset.ready==="1"');
  await p.evaluate(()=>{localStorage.clear();document.getElementById('rsvp').scrollIntoView({block:'center'});});
  await new Promise(r=>setTimeout(r,900));
  await p.screenshot({path:`${SHOT}/${name}.png`});
  await p.close();console.log("shot",name);
}
await shot("form-en",{w:1280,h:820,lang:"en"});
await shot("form-ar",{w:1280,h:820,lang:"ar"});
await shot("form-ar-mobile",{w:390,h:844,lang:"ar",mobile:true});
await b.close();
