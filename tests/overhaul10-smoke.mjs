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
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav'};
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

const output=process.env.BRASSREACH_ARTIFACTS||path.resolve('tests','artifacts','overhaul10');
const executablePath=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output,{recursive:true});
const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const report={intro:{},audio:{},story:{},layouts:[],input:{},consoleErrors:[],failedLocalRequests:[]};
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
assert((await prompt.textContent()).trim()==='Press any key to begin your adventure.','The exact adventure prompt is missing');
await page.waitForTimeout(1200);
assert(await page.locator('#intro .book-shell.is-open').count()===0,'The cover opened without a player gesture');
assert(await prompt.isVisible(),'The beginning prompt did not remain visible');

const plates=await page.evaluate(()=>{
  const cover=document.querySelector('.intro-cover-plate'),open=document.querySelector('.intro-base-plate');
  return {cover:[cover.naturalWidth,cover.naturalHeight,cover.currentSrc],open:[open.naturalWidth,open.naturalHeight,open.currentSrc]};
});
assert(plates.cover[0]===1672&&plates.cover[1]===941,'Closed cover plate has unexpected dimensions');
assert(plates.open[0]===1672&&plates.open[1]===941,'Open base plate has unexpected dimensions');
await page.screenshot({path:path.join(output,'01-closed-cover.png')});

await page.keyboard.press('Tab');
await page.keyboard.press('Escape');
await page.waitForTimeout(80);
assert(await page.locator('#intro .book-shell.is-awakening').count()===0,'An excluded key opened the chronicle');
await page.evaluate(()=>{ const input=document.createElement('input'); input.id='introInputProbe'; document.body.appendChild(input); input.focus(); });
await page.keyboard.press('x');
assert(await page.locator('#intro .book-shell.is-awakening').count()===0,'Typing in an input opened the chronicle');
await page.evaluate(()=>document.querySelector('#introInputProbe')?.remove());

await page.waitForFunction(()=>Engine.getAudioDebug().primed.includes('intro'),null,{timeout:10000});
const startedAt=Date.now();
await page.keyboard.press('a');
await page.waitForTimeout(170);
assert(await page.locator('#intro .book-shell.is-awakening').count()===1,'A normal key did not begin the chronicle');
await page.screenshot({path:path.join(output,'02-adventure-sparkle.png')});
await page.waitForFunction(()=>Engine.getAudioDebug().currentName==='intro'&&Engine.getAudioDebug().sources===2,null,{timeout:2500});
report.audio.firstGestureStartMs=Date.now()-startedAt;

await page.waitForFunction(()=>document.querySelector('#intro .book-shell.is-black'));
await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('#intro .intro-blackout')).opacity)>.94,null,{timeout:500});
const black=await page.locator('#intro .intro-blackout').evaluate(element=>Number(getComputedStyle(element).opacity));
assert(black>.94,`Opening did not reach true black (opacity ${black})`);
await page.screenshot({path:path.join(output,'03-true-black-swap.png')});

await page.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2800});
assert(await page.locator('#intro .book-shell[role="button"]').count()===0,'Open book retained its closed-cover button role');
assert((await page.locator('#introStatus').textContent()).includes('The City'),'Open-page announcement is missing');
assert((await page.locator('#introArtLayer').getAttribute('src')).endsWith('art-city.png'),'City overlay is not active');
await page.screenshot({path:path.join(output,'04-city-spread.png')});

for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000});
  await page.waitForTimeout(80);
  const metric=await page.evaluate(()=>{
    const stage=document.querySelector('#intro .intro-stage').getBoundingClientRect();
    const basePlate=document.querySelector('#intro .intro-base-plate').getBoundingClientRect();
    const art=document.querySelector('#introArtLayer').getBoundingClientRect();
    const copy=document.querySelector('#intro .slide.active .copy').getBoundingClientRect();
    return {
      width:innerWidth,stageLeft:stage.left,stageWidth:stage.width,stageCenter:stage.left+stage.width/2,
      base:[basePlate.left,basePlate.top,basePlate.width,basePlate.height],
      art:[art.left,art.top,art.width,art.height],copy:[copy.left,copy.top,copy.right,copy.bottom],
      overflow:document.documentElement.scrollWidth-innerWidth
    };
  });
  assert(Math.abs(metric.stageCenter-width/2)<1.5,`Photographic stage is not centered at ${width}px`);
  assert(metric.art[0]+metric.art[2]<=metric.stageCenter+1,`Left-page painting crosses the spine at ${width}px`);
  assert(metric.copy[0]>=metric.stageCenter,`HTML copy crosses the spine at ${width}px`);
  assert(metric.copy[2]<=metric.stageLeft+metric.stageWidth*.84,`HTML copy leaves the photographed right page at ${width}px`);
  assert(metric.overflow<=0,`Intro creates horizontal overflow at ${width}px`);
  report.layouts.push(metric);
}
await page.setViewportSize({width:1440,height:1000});

const brassTerm=page.locator('#intro .slide.s1 .gloss',{hasText:'Brassreach'});
await brassTerm.focus();
await page.waitForTimeout(80);
assert(await page.locator('.gloss-tip.on').isVisible(),'Intro glossary is not keyboard accessible');
report.intro.glossary=true;

const baseBefore=await page.locator('.intro-base-plate').getAttribute('src');
await page.locator('#intro .s1 .intro-next').click();
await page.waitForTimeout(120);
assert(await page.locator('#intro .book-shell.content-visible').count()===0,'Outgoing art and copy did not fade together');
assert(await page.locator('#introArtLayer').evaluate(element=>Number(getComputedStyle(element).opacity))<.55,'Outgoing painting remained visible during the fade');
await page.waitForFunction(()=>document.querySelector('#intro .slide.s2.active')&&document.querySelector('#intro .book-shell.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:1500});
assert((await page.locator('#introArtLayer').getAttribute('src')).endsWith('art-archives.png'),'Archives overlay did not replace the City');
assert(await page.locator('.intro-base-plate').getAttribute('src')===baseBefore,'The immutable open-book base changed between pages');
await page.screenshot({path:path.join(output,'05-archives-spread.png')});

await page.locator('#intro .s2 .intro-next').click();
await page.waitForFunction(()=>document.querySelector('#intro .slide.s3.active')&&document.querySelector('#intro .book-shell.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:1500});
assert((await page.locator('#introArtLayer').getAttribute('src')).endsWith('art-unfathomer.png'),'Unfathomer overlay did not replace the Archives');
assert(await page.locator('#intro .slide.s3 .copy.ink-settling').count()===1,'Ink-settling effect did not run');
await page.screenshot({path:path.join(output,'06-unfathomer-spread.png')});

await page.locator('#introBack3').click();
await page.waitForFunction(()=>document.querySelector('#intro .slide.s2.active')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:1500});
assert((await page.locator('#introArtLayer').getAttribute('src')).endsWith('art-archives.png'),'Previous did not restore the Archives page');
await page.locator('#intro .s2 .intro-next').click();
await page.waitForFunction(()=>document.querySelector('#intro .slide.s3.active')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:1500});
assert(await page.evaluate(()=>Engine.getAudioDebug().sources)===2,'Page changes duplicated the intro music layers');

await page.locator('#intro .intro-begin').click();
await page.waitForFunction(()=>document.querySelector('#intro').classList.contains('hidden')&&Engine.state.storyBeats.length>0);
await page.waitForTimeout(180);
assert(await page.locator('#modalEdit:not(.hidden)').count()===1,'Beginning the story no longer opens the character editor');
await page.locator('#btnEditCancel').click();
const opening=page.locator('#story .story-group-opening');
assert(await opening.count()===1,'Opening passage does not have exactly one bracket');
assert((await opening.textContent()).includes('The Journey Begins'),'Opening bracket title changed');
assert((await opening.textContent()).includes('Morning rain wets the upper terraces'),'Opening story content changed');
report.story.openingBracket=true;
await page.screenshot({path:path.join(output,'07-the-journey-begins.png'),fullPage:true});

await page.locator('[data-choice-id="tutorial-accept"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-quartermaster');
const groupCount=await page.locator('#story .story-group').count();
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#story'));
assert(await page.locator('#intro.hidden').count()===1,'Seen-intro persistence was lost');
assert(await page.locator('#story .story-group').count()===groupCount,'Story groups did not persist after reload');
report.story.persistence=true;

const inputContext=await browser.newContext({viewport:{width:1280,height:900}});
for(const mode of ['Space','click']){
  const probe=await inputContext.newPage();
  await loadFresh(probe);
  if(mode==='click') await probe.locator('#introAwaken').click(); else await probe.keyboard.press(mode);
  await probe.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2500});
  report.input[mode.toLowerCase()]=true;
  await probe.close();
}
const skipProbe=await inputContext.newPage();
await loadFresh(skipProbe);
await skipProbe.keyboard.press('Enter');
await skipProbe.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2500});
await skipProbe.locator('#introSkip1').click();
await skipProbe.waitForFunction(()=>document.querySelector('#intro.hidden')&&Engine.state.storyBeats.length>0);
report.input.skip=true;
await skipProbe.close();
await inputContext.close();

const reducedContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const reducedPage=await reducedContext.newPage();
await loadFresh(reducedPage);
assert(await reducedPage.locator('#intro .book-shell.is-open').count()===0,'Reduced motion bypassed the beginning gesture');
await reducedPage.keyboard.press('Enter');
await reducedPage.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:1200});
await reducedPage.locator('#intro .s1 .intro-next').click();
await reducedPage.waitForFunction(()=>document.querySelector('#intro .slide.s2.active')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:600});
report.intro.reducedMotion=true;
await reducedContext.close();

assert(report.consoleErrors.length===0,`Console errors: ${report.consoleErrors.join(' | ')}`);
assert(report.failedLocalRequests.length===0,`Failed local requests: ${report.failedLocalRequests.join(' | ')}`);
await fs.writeFile(path.join(output,'report.json'),JSON.stringify({...report,plates},null,2));
console.log(JSON.stringify({...report,plates},null,2));
await context.close();
await browser.close();
await new Promise(resolve=>server?server.close(resolve):resolve());
