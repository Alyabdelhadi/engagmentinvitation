/* Proves the reply form actually posts, by serving the built page with a
   stub endpoint patched in and recording what arrives. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const ROOT=path.resolve("dist");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".woff2":"font/woff2",".png":"image/png",".jpg":"image/jpeg"};
const received=[];

/* stub sheet */
const stub=http.createServer((q,r)=>{
  let body="";
  q.on("data",c=>body+=c);
  q.on("end",()=>{
    if(q.method==="POST")received.push({url:q.url,ct:q.headers["content-type"]||"",body:body});
    r.writeHead(200,{"content-type":"application/json"});r.end('{"ok":true}');
  });
});
await new Promise(r=>stub.listen(4199,"127.0.0.1",r));

/* the site, with the endpoint pointed at the stub */
const site=http.createServer((q,r)=>{
  const rel=decodeURIComponent(q.url.split("?")[0]);
  const p=path.join(ROOT,rel==="/"?"index.html":rel);
  if(!p.startsWith(ROOT)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){r.writeHead(404);return r.end();}
  let buf=fs.readFileSync(p);
  if(p.endsWith("invitation.js")){
    buf=Buffer.from(buf.toString().replace('endpoint: ""','endpoint: "http://localhost:4199/rsvp"'));
  }
  r.writeHead(200,{"content-type":MIME[path.extname(p)]||"application/octet-stream"});
  r.end(buf);
});
await new Promise(r=>site.listen(4198,"127.0.0.1",r));

const out=[];let fails=0;
const ok=(n,c,d="")=>{out.push(`${c?"PASS":"FAIL"}  ${n}${d?"  — "+d:""}`);if(!c)fails++;};
const URL="http://localhost:4198/landing-pages/meng-to-sketchbook-engagement.html";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"shell",args:["--no-sandbox"]});

/* ---------- english ---------- */
let p=await b.newPage();
await p.setViewport({width:1280,height:900});
await p.goto(URL+"?nointro&lang=en",{waitUntil:"networkidle0"});
await p.waitForFunction('document.body.dataset.ready==="1"');
await p.evaluate(()=>{localStorage.clear();});
await p.reload({waitUntil:"networkidle0"});
await p.waitForFunction('document.body.dataset.ready==="1"');

let f=await p.evaluate(()=>({
  hasForm:!!document.getElementById('rsvpForm'),
  nameLabel:document.querySelector('label[for="rsvpName"]').textContent,
  guestsLabel:document.querySelector('label[for="rsvpGuests"]').textContent,
  btn:document.getElementById('rsvpBtn').textContent.trim(),
  placeholder:document.getElementById('rsvpName').placeholder,
  guests:document.getElementById('rsvpGuests').value,
  minusDisabled:document.getElementById('rsvpMinus').disabled,
  isSubmit:document.getElementById('rsvpBtn').type
}));
ok("form is on the page",f.hasForm);
ok("submit button, not a link",f.isSubmit==="submit",f.isSubmit);
ok("english field labels",f.nameLabel==="Full name"&&f.guestsLabel==="Number of guests",`${f.nameLabel} / ${f.guestsLabel}`);
ok("english button",f.btn==="Confirm Attendance",f.btn);
ok("name placeholder localised",f.placeholder==="Your full name",f.placeholder);
ok("guests starts at 1, minus disabled",f.guests==="1"&&f.minusDisabled,`${f.guests}`);

/* validation: empty name */
await p.click("#rsvpBtn");
await new Promise(r=>setTimeout(r,250));
let v=await p.evaluate(()=>({msg:document.getElementById('rsvpMsg').textContent,
  tone:document.getElementById('rsvpMsg').dataset.tone,
  invalid:document.getElementById('rsvpName').getAttribute('aria-invalid'),
  posted:false}));
ok("empty name is refused",/Please enter your full name/.test(v.msg)&&v.tone==="error",v.msg);
ok("invalid field is flagged",v.invalid==="true");
ok("nothing posted on a refused submit",received.length===0,`${received.length} posts`);

/* stepper clamps */
await p.evaluate(()=>{for(let i=0;i<20;i++)document.getElementById('rsvpPlus').click();});
const hi=await p.evaluate(()=>({v:document.getElementById('rsvpGuests').value,d:document.getElementById('rsvpPlus').disabled}));
ok("stepper clamps at maxGuests",hi.v==="12"&&hi.d,`${hi.v}`);
await p.evaluate(()=>{for(let i=0;i<20;i++)document.getElementById('rsvpMinus').click();});
const lo=await p.evaluate(()=>document.getElementById('rsvpGuests').value);
ok("stepper clamps at 1",lo==="1",lo);

/* a real reply */
await p.type("#rsvpName","Rami Khoury");
await p.evaluate(()=>{document.getElementById('rsvpPlus').click();document.getElementById('rsvpPlus').click();});
await p.click("#rsvpBtn");
await p.waitForFunction('document.getElementById("rsvpForm").classList.contains("sent")',{timeout:8000});
const done=await p.evaluate(()=>({msg:document.getElementById('rsvpMsg').textContent,
  tone:document.getElementById('rsvpMsg').dataset.tone,
  fieldsHidden:getComputedStyle(document.querySelector('.field')).display,
  again:!!document.getElementById('rsvpAgain'),
  stored:localStorage.getItem('inv-rsvp')}));
ok("reply reached the endpoint",received.length===1,`${received.length} posts`);
if(received.length){
  let body={};try{body=JSON.parse(received[0].body);}catch(e){}
  ok("payload carries name and guests",body.name==="Rami Khoury"&&body.guests===3,JSON.stringify(body));
  ok("posted as a simple request",/text\/plain/.test(received[0].ct),received[0].ct);
}
ok("thank-you replaces the fields",/your seat is saved/i.test(done.msg)&&done.fieldsHidden==="none",done.msg);
ok("offers a way to reply again",done.again);
ok("reply remembered on this device",/Rami Khoury/.test(done.stored||""),done.stored);

/* it comes back on reload */
await p.reload({waitUntil:"networkidle0"});
await p.waitForFunction('document.body.dataset.ready==="1"');
const back=await p.evaluate(()=>({sent:document.getElementById('rsvpForm').classList.contains('sent'),
  name:document.getElementById('rsvpName').value}));
ok("already-replied state restored",back.sent&&back.name==="Rami Khoury",back.name);

/* ---------- arabic ---------- */
await p.evaluate(()=>{localStorage.clear();});
await p.reload({waitUntil:"networkidle0"});
await p.waitForFunction('document.body.dataset.ready==="1"');
await p.click('.lang[data-lang="ar"]');
await p.waitForFunction('document.documentElement.dir==="rtl"');
await new Promise(r=>setTimeout(r,300));
const ar=await p.evaluate(()=>({
  nameLabel:document.querySelector('label[for="rsvpName"]').textContent,
  guestsLabel:document.querySelector('label[for="rsvpGuests"]').textContent,
  btn:document.getElementById('rsvpBtn').textContent.trim(),
  placeholder:document.getElementById('rsvpName').placeholder,
  align:getComputedStyle(document.querySelector('.field')).textAlign,
  inputDir:getComputedStyle(document.getElementById('rsvpName')).direction,
  ox:document.documentElement.scrollWidth-document.documentElement.clientWidth
}));
ok("arabic field labels",ar.nameLabel==="الاسم الكامل"&&ar.guestsLabel==="عدد الحضور",`${ar.nameLabel} / ${ar.guestsLabel}`);
ok("arabic button",ar.btn==="تأكيد الحضور",ar.btn);
ok("arabic placeholder",ar.placeholder==="اسمكم الكامل",ar.placeholder);
ok("fields align right in rtl",ar.align==="right"||ar.align==="start",ar.align);
ok("inputs inherit rtl",ar.inputDir==="rtl",ar.inputDir);
ok("no overflow with the form in rtl",ar.ox<=0,`${ar.ox}px`);

await p.type("#rsvpName","سامر الحاج");
await p.click("#rsvpBtn");
await p.waitForFunction('document.getElementById("rsvpForm").classList.contains("sent")',{timeout:8000});
const arDone=await p.evaluate(()=>document.getElementById('rsvpMsg').textContent);
ok("arabic reply posts",received.length===2,`${received.length} posts`);
if(received.length>1){
  let bb={};try{bb=JSON.parse(received[1].body);}catch(e){}
  ok("arabic name survives the wire",bb.name==="سامر الحاج"&&bb.lang==="ar",JSON.stringify(bb));
}
ok("arabic thank-you",/شكراً/.test(arDone),arDone);

await b.close();stub.close();site.close();
console.log(out.join("\n"));
console.log(`\n${out.length-fails}/${out.length} checks passed`);
process.exit(fails?1:0);
