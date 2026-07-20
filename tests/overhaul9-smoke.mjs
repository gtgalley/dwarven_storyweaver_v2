import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const playwrightRoot=process.env.PLAYWRIGHT_ROOT;
if(!playwrightRoot) throw new Error('PLAYWRIGHT_ROOT is required');
const {chromium}=await import(pathToFileURL(path.join(playwrightRoot,'index.mjs')).href);

let base=process.env.BRASSREACH_URL||'';
let server=null;
if(!base){
  const root=process.cwd();
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.svg':'image/svg+xml'};
  server=http.createServer(async(request,response)=>{
    try{
      const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
      const file=path.resolve(root,relative);
      if(!file.startsWith(root)){ response.writeHead(403).end(); return; }
      const data=await fs.readFile(file);
      response.writeHead(200,{'content-type':mime[path.extname(file).toLowerCase()]||'application/octet-stream'}).end(data);
    }catch{ response.writeHead(404).end('Not found'); }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  base=`http://127.0.0.1:${server.address().port}/`;
}

const output=process.env.BRASSREACH_ARTIFACTS||path.resolve('tests','artifacts','overhaul9');
const executablePath=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output,{recursive:true});
const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const report={intro:{},audio:{},story:{},migration:{},layouts:[],input:{},consoleErrors:[],failedLocalRequests:[]};
const browser=await chromium.launch({headless:true,executablePath,args:['--autoplay-policy=user-gesture-required']});

function monitor(page){
  page.on('console',message=>{ if(message.type()==='error') report.consoleErrors.push(message.text()); });
  page.on('pageerror',error=>report.consoleErrors.push(error.message));
  page.on('requestfailed',request=>{
    const error=request.failure()?.errorText||'failed';
    if(request.url().startsWith(base)&&error!=='net::ERR_ABORTED') report.failedLocalRequests.push(`${request.url()} — ${error}`);
  });
}

async function loadFresh(page){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#intro .book-shell.is-dormant'));
}

const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,acceptDownloads:true});
const page=await context.newPage();
monitor(page);
await loadFresh(page);
await page.evaluate(()=>{ Engine.state.settings.typewriter=false; });

const prompt=page.locator('#introAwaken');
assert((await prompt.textContent()).trim()==='Press any key to begin your journey.','The exact journey prompt is missing');
await page.waitForTimeout(1650);
assert(await page.locator('#intro .book-shell.is-open').count()===0,'The cover auto-opened without a player gesture');
assert(await prompt.isVisible(),'The beginning prompt did not remain visible');
await page.screenshot({path:path.join(output,'01-closed-cover-prompt.png')});

await page.keyboard.press('Tab');
await page.keyboard.press('Escape');
await page.keyboard.down('Control'); await page.keyboard.up('Control');
await page.waitForTimeout(100);
assert(await page.locator('#intro .book-shell.is-awakening').count()===0,'An excluded key opened the chronicle');
await page.evaluate(()=>{
  const input=document.createElement('input'); input.id='introInputProbe'; document.body.appendChild(input); input.focus();
});
await page.keyboard.press('x');
await page.waitForTimeout(80);
assert(await page.locator('#intro .book-shell.is-awakening').count()===0,'Typing in an editable control opened the chronicle');
await page.evaluate(()=>document.querySelector('#introInputProbe')?.remove());

await page.waitForFunction(()=>Engine.getAudioDebug().primed.includes('intro'),null,{timeout:10000});
report.audio.beforeGesture=await page.evaluate(()=>Engine.getAudioDebug());
const activationStart=Date.now();
await page.keyboard.press('a');
await page.waitForTimeout(170);
assert(await page.locator('#intro .book-shell.is-awakening').count()===1,'A non-modifier key did not begin the chronicle');
report.input.nonModifier=true;
await page.screenshot({path:path.join(output,'02-journey-illumination.png')});
await page.waitForFunction(()=>Engine.getAudioDebug().currentName==='intro'&&Engine.getAudioDebug().sources===2,null,{timeout:2500});
report.audio.firstGestureStartMs=Date.now()-activationStart;
report.audio.afterGesture=await page.evaluate(()=>Engine.getAudioDebug());
assert(report.audio.firstGestureStartMs<2500,'Intro music did not begin promptly after the accepted gesture');

await page.waitForTimeout(520);
await page.screenshot({path:path.join(output,'03-cover-opening.png')});
await page.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready'),null,{timeout:3500});
await page.waitForTimeout(480);
assert(await page.locator('#intro .book-shell[role="button"]').count()===0,'The open book retained its closed-cover button role');
assert((await page.locator('#introStatus').textContent()).includes('The City'),'The open-page announcement is missing');
await page.screenshot({path:path.join(output,'04-open-the-city.png')});

const expectedArt=['intro_city_baked.png','intro_gate_baked.png','intro_unfathomer_baked.png'];
const art=await page.locator('#intro .intro-art').evaluateAll(images=>images.map(image=>({src:image.getAttribute('src'),fit:getComputedStyle(image).objectFit,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight})));
expectedArt.forEach((name,index)=>{
  assert(art[index].src.endsWith(name),`Intro slide ${index+1} does not use ${name}`);
  assert(art[index].fit==='contain',`Intro slide ${index+1} does not preserve its complete artwork`);
  assert(art[index].naturalWidth>0&&art[index].naturalHeight>0,`Intro slide ${index+1} did not load`);
});
report.intro.art=art;
report.intro.folios=await page.locator('#intro .folio-mark strong').allTextContents();
assert(report.intro.folios.join('|')==='The City|The Threadbearers|The First Commission','Intro folio labels are incorrect');

for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000});
  await page.waitForTimeout(80);
  const metric=await page.evaluate(()=>{
    const stage=document.querySelector('#intro .book-stage').getBoundingClientRect();
    const gutter=document.querySelector('#intro .book-gutter').getBoundingClientRect();
    const slide=document.querySelector('#intro .slide.active');
    const art=slide.querySelector('.pic').getBoundingClientRect();
    const copy=slide.querySelector('.copy').getBoundingClientRect();
    return {width:innerWidth,stageCenter:stage.left+stage.width/2,gutterCenter:gutter.left+gutter.width/2,artRight:art.right,copyLeft:copy.left,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert(Math.abs(metric.stageCenter-width/2)<1.5,`Open book is not centered at ${width}px`);
  assert(Math.abs(metric.gutterCenter-width/2)<2,`Book gutter is not centered at ${width}px`);
  assert(metric.artRight<=width/2+2,`Intro art crosses the gutter at ${width}px`);
  assert(metric.copyLeft>=width/2-2,`Intro copy crosses the gutter at ${width}px`);
  assert(metric.overflow<=0,`Intro creates horizontal overflow at ${width}px`);
  report.layouts.push(metric);
}
await page.setViewportSize({width:1440,height:1000});

const brassTerm=page.locator('#intro .slide.s1 .gloss',{hasText:'Brassreach'});
await brassTerm.focus();
await page.waitForTimeout(80);
const glossaryState=await page.evaluate(()=>({active:document.activeElement?.textContent,tipClass:document.querySelector('.gloss-tip')?.className,tipVisibility:getComputedStyle(document.querySelector('.gloss-tip')).visibility,tipText:document.querySelector('.gloss-tip')?.textContent}));
assert(await page.locator('.gloss-tip.on').isVisible(),`Intro glossary tooltip is not keyboard accessible: ${JSON.stringify(glossaryState)}`);

await page.locator('#intro .s1 .intro-next').click();
await page.waitForTimeout(390);
assert(await page.locator('#intro .slide.s2.active').count()===1,'The next page was not mounted after content faded out');
assert(await page.locator('#intro .book-shell.content-out').count()===1,'The turning page exposed incoming content too early');
await page.screenshot({path:path.join(output,'05-blank-page-turn.png')});
await page.waitForFunction(()=>document.querySelector('#intro .slide.s2.active')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2500});
await page.screenshot({path:path.join(output,'06-open-the-threadbearers.png')});

await page.locator('#intro .s2 .intro-next').click();
await page.waitForTimeout(1230);
assert(await page.locator('#intro .slide.s3.active .copy.ink-settling').count()===1,'The visible ink-settling effect did not run on the incoming page');
await page.screenshot({path:path.join(output,'07-ink-appearing.png')});
await page.waitForFunction(()=>document.querySelector('#intro .slide.s3.active')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:1800});
await page.screenshot({path:path.join(output,'08-open-first-commission.png')});

const sourcesAfterTurns=await page.evaluate(()=>Engine.getAudioDebug().sources);
assert(sourcesAfterTurns===2,'Page interactions duplicated the intro music layers');
await page.locator('#intro .intro-begin').click();
await page.waitForFunction(()=>document.querySelector('#intro').classList.contains('hidden')&&Engine.state.storyBeats.length>0);
await page.waitForTimeout(180);
if(await page.locator('#modalEdit:not(.hidden)').count()) await page.locator('#btnEditCancel').click();
const opening=page.locator('#story .story-group-opening');
assert(await opening.count()===1,'The initial story passage does not have exactly one opening bracket');
assert((await opening.locator('.story-choice-caption').textContent()).includes('The Journey Begins'),'The opening bracket title is incorrect');
assert((await opening.textContent()).includes('Morning rain wets the upper terraces'),'The opening scene content changed or escaped its bracket');
assert((await opening.textContent()).includes('Thread Ledger'),'The opening item feedback is not contained by the opening bracket');
report.story.openingBracket=true;
await page.screenshot({path:path.join(output,'09-the-journey-begins-bracket.png'),fullPage:true});

await page.locator('[data-choice-id="tutorial-accept"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-quartermaster');
assert(await page.locator('#story .story-group').count()===2,'The first choice did not follow the opening bracket as a separate group');
assert(await page.locator('#story .story-group-opening').count()===1,'The opening bracket duplicated after a choice');

const savedCount=await page.locator('#story .story-group').count();
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#story'));
assert(await page.locator('#story .story-group').count()===savedCount,'Story groups did not persist after reload');
assert(await page.locator('#story .story-group-opening').count()===1,'The persisted opening bracket duplicated or disappeared');

await page.locator('#btnSettings').click();
const transcriptDownload=page.waitForEvent('download');
await page.locator('#btnExport').click();
const transcriptFile=await transcriptDownload;
const transcriptPath=path.join(output,'brassreach_transcript.html');
await transcriptFile.saveAs(transcriptPath);
const transcript=await fs.readFile(transcriptPath,'utf8');
assert(transcript.includes('Opening record')&&transcript.includes('The Journey Begins'),'The exported transcript lost the opening story group');
await page.locator('#xSet').click();
report.story.transcriptOpeningGroup=true;

await page.evaluate(()=>{
  const S=JSON.parse(localStorage.getItem('brassreach:dds_state'));
  S.saveVersion=6;
  S.storyBeats=(S.storyBeats||[]).filter(beat=>beat.kind!=='opening').map(beat=>{
    const next={...beat};
    if(next.groupId==='opening-journey') delete next.groupId;
    return next;
  });
  localStorage.setItem('brassreach:dds_state',JSON.stringify(S));
});
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>window.Engine?.state?.saveVersion===7&&document.querySelector('#story'));
assert(await page.locator('#story .story-group-opening').count()===1,'A version 6 save did not regain its opening bracket safely');
assert(await page.locator('#story .story-group').count()===savedCount,'Opening migration changed later choice groups');
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#story'));
assert(await page.locator('#story .story-group-opening').count()===1,'Opening migration is not idempotent');
report.migration.version6=true;

const inputContext=await browser.newContext({viewport:{width:1280,height:900}});
for(const mode of ['Space','Enter','click']){
  const probe=await inputContext.newPage();
  await loadFresh(probe);
  if(mode==='click') await probe.locator('#introAwaken').click(); else await probe.keyboard.press(mode);
  await probe.waitForFunction(()=>document.querySelector('#intro .book-shell.is-awakening')||document.querySelector('#intro .book-shell.is-open'));
  report.input[mode.toLowerCase()]=true;
  await probe.close();
}
await inputContext.close();

const blockedAudioContext=await browser.newContext({viewport:{width:1280,height:900}});
await blockedAudioContext.addInitScript(()=>{
  const NativeContext=window.AudioContext||window.webkitAudioContext;
  let allowed=false;
  class GatedAudioContext extends NativeContext{
    get state(){ return allowed?super.state:'suspended'; }
    resume(){ return allowed?super.resume():Promise.resolve(false); }
  }
  window.AudioContext=GatedAudioContext;
  window.webkitAudioContext=GatedAudioContext;
  const allow=()=>{ allowed=true; };
  window.addEventListener('keydown',allow,{capture:true,once:true});
  window.addEventListener('pointerdown',allow,{capture:true,once:true});
});
const blockedPage=await blockedAudioContext.newPage();
monitor(blockedPage);
await loadFresh(blockedPage);
await blockedPage.waitForFunction(()=>Engine.getAudioDebug().primed.includes('intro'),null,{timeout:10000});
report.audio.blockedBeforeGesture=await blockedPage.evaluate(()=>Engine.getAudioDebug());
assert(report.audio.blockedBeforeGesture.unlocked===false&&report.audio.blockedBeforeGesture.pendingName==='intro','The simulated autoplay block did not retain the primed intro request');
await blockedPage.keyboard.press('a');
await blockedPage.waitForFunction(()=>Engine.getAudioDebug().unlocked&&Engine.getAudioDebug().currentName==='intro'&&Engine.getAudioDebug().sources===2,null,{timeout:2500});
report.audio.blockedAfterGesture=await blockedPage.evaluate(()=>Engine.getAudioDebug());
await blockedAudioContext.close();

const reducedContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const reducedPage=await reducedContext.newPage();
await loadFresh(reducedPage);
await reducedPage.waitForTimeout(500);
assert(await reducedPage.locator('#intro .book-shell.is-open').count()===0,'Reduced motion bypassed the deliberate beginning gesture');
await reducedPage.keyboard.press('Enter');
await reducedPage.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:1200});
await reducedPage.locator('#intro .s1 .intro-next').click();
await reducedPage.waitForTimeout(500);
const reducedState=await reducedPage.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,shell:document.querySelector('#intro .book-shell').className,active:document.querySelector('#intro .slide.active')?.className}));
assert(reducedState.active?.includes('s2')&&!reducedState.shell.includes('is-turning'),`Reduced-motion crossfade did not finish cleanly: ${JSON.stringify(reducedState)}`);
assert(await reducedPage.locator('#intro .page-turn').evaluate(element=>getComputedStyle(element).display)==='none','Reduced-motion mode retained the physical page turn');
report.intro.reducedMotion=true;
await reducedContext.close();

assert(report.consoleErrors.length===0,`Console errors: ${report.consoleErrors.join(' | ')}`);
assert(report.failedLocalRequests.length===0,`Failed local requests: ${report.failedLocalRequests.join(' | ')}`);
await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await context.close();
await browser.close();
await new Promise(resolve=>server?server.close(resolve):resolve());
