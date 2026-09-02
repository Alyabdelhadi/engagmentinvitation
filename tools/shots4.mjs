import puppeteer from "puppeteer-core";
const SHOT=process.argv[2];
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless:false,args:["--no-sandbox","--window-size=520,1000"]});
async function shot(name,lang,plate){
  const p=await b.newPage();
  await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2});
  await p.goto(`http://localhost:4173/landing-pages/meng-to-sketchbook-engagement.html?nointro&lang=${lang}`,{waitUntil:"networkidle0"});
  await p.waitForFunction('document.body.dataset.ready==="1"');
  if(plate!=null)await p.evaluate(i=>goTo(i),plate);
  await new Promise(r=>setTimeout(r,1300));
  await p.screenshot({path:`${SHOT}/${name}.png`});
  await p.close();console.log("shot",name);
}
await shot("m2-en-cover","en",0);
await shot("m2-en-story","en",4);
await shot("m2-ar-celebration","ar",3);
await shot("m2-ar-story","ar",4);
await b.close();
