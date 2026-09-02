import puppeteer from "puppeteer-core";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"shell",args:["--no-sandbox"]});
for(const [name,vp,lang] of [
  ["phone portrait EN",{width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:3},"en"],
  ["phone portrait AR",{width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:3},"ar"],
  ["desktop        EN",{width:1440,height:900},"en"]]){
  const p=await b.newPage();
  await p.setViewport(vp);
  await p.goto(`http://localhost:4173/landing-pages/meng-to-sketchbook-engagement.html?nointro&lang=${lang}`,{waitUntil:"networkidle0"});
  await p.waitForFunction('document.body.dataset.ready==="1"');
  await new Promise(r=>setTimeout(r,400));
  const m=await p.evaluate(()=>{
    const bk=document.getElementById('sbBook').getBoundingClientRect();
    const scale=bk.width/1760;
    const img=document.querySelector('.sb-full img');
    const narrow=/\.narrow\.png$/.test(img?img.getAttribute('src'):'');
    const base=narrow?{body:62,kick:30,big:76}:{body:31,kick:22,big:82};
    return {src:(img?img.getAttribute('src'):'').split('/').pop(),
      bookW:Math.round(bk.width), scale:scale.toFixed(3),
      body:(base.body*scale).toFixed(1), kicker:(base.kick*scale).toFixed(1),
      heading:(base.big*scale).toFixed(1),
      ox:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  });
  console.log(`${name}  ${m.src}\n   book ${m.bookW}px  scale ${m.scale}  |  body ${m.body}px  kicker ${m.kicker}px  heading ${m.heading}px  |  overflow ${m.ox}px`);
  await p.close();
}
await b.close();
