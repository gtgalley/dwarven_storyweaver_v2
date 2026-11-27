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
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg','.wav':'audio/wav','.svg':'image/svg+xml'};
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
const output=process.env.BRASSREACH_ARTIFACTS||path.resolve('tests','artifacts','overhaul8');
const executablePath=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output,{recursive:true});

const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const report={intro:{},story:{},migration:{},layouts:[],consoleErrors:[],failedLocalRequests:[]};
const browser=await chromium.launch({headless:true,executablePath});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,acceptDownloads:true});
const page=await context.newPage();
page.on('console',message=>{ if(message.type()==='error') report.consoleErrors.push(message.text()); });
page.on('pageerror',error=>report.consoleErrors.push(error.message));
page.on('requestfailed',request=>{
  const error=request.failure()?.errorText||'failed';
  if(request.url().startsWith(base)&&error!=='net::ERR_ABORTED') report.failedLocalRequests.push(`${request.url()} — ${error}`);
});

await page.goto(base,{waitUntil:'networkidle'});
await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#intro .book-shell'));
await page.evaluate(()=>{
  Engine.state.settings.typewriter=false;
  localStorage.setItem('brassreach:dds_state',JSON.stringify(Engine.state));
  localStorage.removeItem('brassreach:intro_seen');
});
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>document.querySelector('#intro .book-shell.is-dormant'));
await page.screenshot({path:path.join(output,'01-intro-closed-book.png')});
await page.locator('#introAwaken').click();
await page.waitForTimeout(520);
await page.screenshot({path:path.join(output,'02-intro-book-opening.png')});
await page.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready'),null,{timeout:3000});
await page.waitForTimeout(470);
await page.screenshot({path:path.join(output,'03-intro-open-city.png')});

const expectedArt=['art-city.png','art-archives.png','art-unfathomer.png'];
report.intro.art=await page.locator('#intro .slide').evaluateAll(slides=>slides.map(s=>s.dataset.art));
expectedArt.forEach((name,index)=>assert(report.intro.art[index]?.endsWith(name),'Missing illustrated folio '+name));
for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000});
  const metric=await page.evaluate(()=>({width:innerWidth,copyLeft:document.querySelector('.slide.active .copy').getBoundingClientRect().left,overflow:document.documentElement.scrollWidth-innerWidth}));
  assert(metric.copyLeft>=width/2-2&&metric.overflow<=0,'Folio spilled across its page at '+width); report.layouts.push(metric);
}

await page.setViewportSize({width:1440,height:1000});
const brassTerm=page.locator('#intro .slide.s1 .gloss',{hasText:'Brassreach'});
await brassTerm.focus();
await page.waitForTimeout(50);
assert(await page.locator('.gloss-tip.on').isVisible(),'Intro glossary tooltip is not keyboard accessible');
assert((await page.locator('.gloss-tip').textContent()).includes('water, stone, brass, and sound'),'Approved Brassreach glossary definition is missing');

for(const [folio,nPassages] of [[1,2],[2,3],[3,2]]){
 for(let n=1;n<=nPassages;n++){
  const active=page.locator('#intro .s'+folio+'.active [data-passage="'+n+'"].active');
  await active.waitFor();
  await page.waitForFunction(()=>!document.querySelector('#introAdvance').disabled);
  assert(await page.locator('#introArtLayer').evaluate((img,i)=>img.complete&&img.naturalWidth>0&&img.src.endsWith(i),expectedArt[folio-1]),'Wrong illustration for folio '+folio);
  if(folio===3&&n===nPassages)break;
  await page.click('#introAdvance');
 }
}
assert(await page.locator('#introPrevious').isVisible(),'The final page lost its back button');

await page.locator('#intro .intro-begin').click();
await page.waitForFunction(()=>document.querySelector('#intro').classList.contains('hidden')&&Engine.state.storyBeats.length>0);
await page.waitForTimeout(180);
if(await page.locator('#modalEdit:not(.hidden)').count()) await page.locator('#btnEditCancel').click();
assert(await page.locator('#freeText,#btnAct,#btnCont,#weaveStatus').count()===0,'Removed free-action controls are still mounted');
assert((await page.locator('#story').textContent()).includes('You find Captain Brunna beneath the Public Bell'),'Approved opening scene was not installed');
await page.screenshot({path:path.join(output,'04-main-story-initial.png'),fullPage:true});

await page.locator('[data-choice-id="tutorial-accept"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-quartermaster');
let groups=page.locator('#story .story-group');
assert(await groups.count()===2,'The first player choice did not follow the opening story group');
assert((await groups.last().locator('.story-choice-caption').textContent()).includes('Ask Brunna for the quickest way'),'The chosen option is not preserved in its group');
assert((await groups.last().textContent()).includes('Quartermaster Dorrin'),'The resulting scene is not contained by the first choice group');

const beforeMerchant=await groups.count();
await page.locator('[data-choice-id="tutorial-dorrin-shop"]').click();
await page.locator('#modalMerchant:not(.hidden)').waitFor();
assert(await page.locator('#story .story-group').count()===beforeMerchant,'Opening a merchant created an empty story group');
await page.locator('[data-buy="Rope Coil"]').click();
assert(await page.locator('#story .story-group').count()===beforeMerchant+1,'A completed purchase did not create a story group');
assert((await page.locator('#story .story-group').last().textContent()).includes('You bought the Rope Coil'),'Purchase prose does not name the purchased item');
await page.locator('#xMerchant').click();

await page.locator('[data-choice-id="tutorial-dorrin-ready"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-bell-stair');
groups=page.locator('#story .story-group');
const latest=groups.last();
assert((await latest.locator('.story-choice-caption').textContent()).includes('Take the listening hood'),'Latest story group lost its selected choice');
assert((await latest.textContent()).includes('The steps beneath the keepers are intact.'),'Latest story group does not contain the full new scene');
assert(!(await latest.textContent()).includes('ADD A GLOSSARY'),'The Lantern Constables author note leaked into the story');
report.story.groups=await groups.count();
await page.waitForTimeout(750);
report.story.latestScroll=await page.evaluate(()=>{ const story=document.querySelector('#story'),latest=story.querySelector('.story-group.latest'),storyRect=story.getBoundingClientRect(),latestRect=latest.getBoundingClientRect(); return {actual:story.scrollTop,groupInset:latestRect.top-storyRect.top}; });
assert(Math.abs(report.story.latestScroll.groupInset-18)<30,`Story did not scroll to the start of the latest group: ${JSON.stringify(report.story.latestScroll)}`);
await page.screenshot({path:path.join(output,'05-story-choice-groups.png')});
await page.locator('#story').screenshot({path:path.join(output,'06-story-bracket-detail.png')});
const lantern=latest.locator('.gloss',{hasText:'Lantern Constables'});
assert(await lantern.count()===1,'Lantern Constables is not rendered as a glossary term');
await lantern.focus();
assert((await page.locator('.gloss-tip').textContent()).includes('Lantern Constabulary'),'Lantern Constables definition is missing');

await page.locator('#btnSettings').click();
const downloadPromise=page.waitForEvent('download');
await page.locator('#btnExport').click();
const download=await downloadPromise;
const transcriptPath=path.join(output,'brassreach_transcript.html');
await download.saveAs(transcriptPath);
const transcript=await fs.readFile(transcriptPath,'utf8');
assert(transcript.includes('class="turn"')&&transcript.includes('Chosen course'),'Exported transcript does not preserve story grouping');
await page.locator('#xSet').click();

const savedGroupCount=await page.locator('#story .story-group').count();
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#story'));
assert(await page.locator('#story .story-group').count()===savedGroupCount,'Story groups did not survive save and reload');
report.migration.groupedSave=true;

await page.evaluate(()=>{
  const S=JSON.parse(localStorage.getItem('brassreach:dds_state'));
  S.saveVersion=5;
  delete S.storyGroupSeq;
  S.storyBeats=(S.storyBeats||[]).filter(beat=>beat.kind!=='choice').map(beat=>{ const next={...beat}; delete next.groupId; return next; });
  localStorage.setItem('brassreach:dds_state',JSON.stringify(S));
});
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>window.Engine?.state&&Engine.state.storyBeats.length>0);
assert(await page.locator('#story .story-group').count()===1,'Legacy migration should restore only the verified opening group');
assert(await page.locator('#story p.beat').count()>0,'Legacy story beats failed to render');
report.migration.legacySave=true;

for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000});
  await page.waitForTimeout(50);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Main layout overflows horizontally at ${width}px`);
}

const reducedContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const reducedPage=await reducedContext.newPage();
await reducedPage.goto(base,{waitUntil:'networkidle'});
await reducedPage.evaluate(()=>{ localStorage.clear(); });
await reducedPage.reload({waitUntil:'networkidle'});
await reducedPage.waitForFunction(()=>document.querySelector('#intro .book-shell.is-dormant'));
await reducedPage.keyboard.press('Enter');
await reducedPage.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready')&&!document.querySelector('#intro .book-shell.is-turning'));
assert(await reducedPage.evaluate(()=>{
  const value=getComputedStyle(document.querySelector('#intro .book-shell')).transitionDuration.split(',')[0].trim();
  const seconds=value.endsWith('ms')?parseFloat(value)/1000:parseFloat(value);
  return seconds<=.001;
}),'Reduced-motion mode does not suppress the book transition');
report.intro.reducedMotion=true;
await reducedContext.close();

assert(report.consoleErrors.length===0,`Console errors: ${report.consoleErrors.join(' | ')}`);
assert(report.failedLocalRequests.length===0,`Failed local requests: ${report.failedLocalRequests.join(' | ')}`);
await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
await new Promise(resolve=>server?server.close(resolve):resolve());
