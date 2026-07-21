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

const output=process.env.BRASSREACH_ARTIFACTS||path.resolve('tests','artifacts','overhaul13');
const executablePath=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output,{recursive:true});
const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const report={intro:{},audio:{},navigation:[],layouts:[],zoomLayouts:[],aspectLayouts:[],input:{},story:{},migration:{},consoleErrors:[],failedLocalRequests:[]};
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

async function currentState(page){
  return page.evaluate(()=>({
    folio:Number(document.querySelector('#intro .book-shell').dataset.folio||0),
    passage:Number(document.querySelector('#intro .book-shell').dataset.passage||0),
    label:document.querySelector('#introAdvance')?.innerText.trim(),
    action:document.querySelector('#introAdvance')?.dataset.action,
    art:document.querySelector('#introArtLayer')?.getAttribute('src'),
    turning:document.querySelector('#intro .book-shell')?.classList.contains('is-turning')
  }));
}

async function waitForState(page,folio,passage){
  await page.waitForFunction(([f,p])=>{
    const shell=document.querySelector('#intro .book-shell');
    return Number(shell?.dataset.folio)===f&&Number(shell?.dataset.passage)===p&&!shell.classList.contains('is-turning');
  },[folio,passage],{timeout:1800});
  const state=await currentState(page);
  report.navigation.push(state);
  const fit=await page.locator('#intro .intro-passage.active').evaluate(element=>({scrollHeight:element.scrollHeight,clientHeight:element.clientHeight,text:element.textContent.trim().slice(0,42)}));
  assert(fit.scrollHeight<=fit.clientHeight+2,`Passage does not fit: ${fit.text}`);
  return state;
}

const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();
monitor(page);
await loadFresh(page);
await page.evaluate(()=>{ Engine.state.settings.typewriter=false; });

const prompt=page.locator('#introAwaken');
assert((await prompt.textContent()).trim()==='Press any key to begin your journey.','The exact journey prompt is missing');
await page.waitForTimeout(1000);
assert(await page.locator('#intro .book-shell.is-open').count()===0,'The cover opened without a player gesture');
await page.screenshot({path:path.join(output,'01-closed-cover.png')});

const plateInfo=await page.evaluate(()=>{
  const cover=document.querySelector('.intro-cover-plate'),open=document.querySelector('.intro-base-plate');
  const sample=image=>{ const canvas=document.createElement('canvas'); canvas.width=image.naturalWidth; canvas.height=image.naturalHeight; const ctx=canvas.getContext('2d'); ctx.drawImage(image,0,0); return [[0,0],[canvas.width-1,0],[0,canvas.height-1],[canvas.width-1,canvas.height-1]].map(([x,y])=>Array.from(ctx.getImageData(x,y,1,1).data.slice(0,3))); };
  return {cover:[cover.naturalWidth,cover.naturalHeight],open:[open.naturalWidth,open.naturalHeight],coverCorners:sample(cover),openCorners:sample(open)};
});
assert(plateInfo.cover.join('x')==='1672x941'&&plateInfo.open.join('x')==='1672x941','Photographic plate dimensions changed');
for(const rgb of [...plateInfo.coverCorners,...plateInfo.openCorners]) assert(Math.max(...rgb)<8,`A plate corner is not true black: ${rgb}`);
report.intro.trueBlackCorners=true;

await page.keyboard.press('Tab');
await page.keyboard.press('Escape');
assert(await page.locator('#intro .book-shell.is-awakening').count()===0,'An excluded key opened the chronicle');
await page.waitForFunction(()=>Engine.getAudioDebug().primed.includes('intro'),null,{timeout:10000});
const openingStart=await page.evaluate(()=>performance.now());
await page.keyboard.press('a');
await page.waitForTimeout(700);
const charge=await page.evaluate(()=>(
  {
    bloom:Number(getComputedStyle(document.querySelector('.intro-golden-bloom')).opacity),
    blackout:Number(getComputedStyle(document.querySelector('.intro-blackout')).opacity),
    wordFilter:getComputedStyle(document.querySelector('#introAwaken strong')).filter,
    charging:document.querySelector('#intro').classList.contains('intro-charging'),
    lanternAnimation:getComputedStyle(document.querySelector('.intro-lantern-light')).animationName
  }));
assert(charge.charging&&charge.bloom<.08&&charge.blackout<.08,'The Journey bloom began before the word charge completed');
assert(charge.wordFilter!=='none'&&charge.lanternAnimation==='introLanternCharge','The word or lantern did not react during charge-up');
await page.screenshot({path:path.join(output,'02-journey-charge.png')});
await page.waitForTimeout(380);
const transition=await page.evaluate(()=>({
  bloom:Number(getComputedStyle(document.querySelector('.intro-golden-bloom')).opacity),
  blackout:Number(getComputedStyle(document.querySelector('.intro-blackout')).opacity),
  awakening:document.querySelector('.book-shell').classList.contains('is-awakening')
}));
assert(transition.awakening&&transition.bloom>.55,'Golden journey bloom did not follow the word charge');
assert(transition.blackout>.2,'The concealed black transition did not begin behind the golden bloom');
await page.screenshot({path:path.join(output,'02-golden-opening.png')});

await page.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2800});
const openingDuration=await page.evaluate(start=>performance.now()-start,openingStart);
assert(openingDuration>=1650&&openingDuration<=2150,`Opening duration drifted outside the 1.75-second target: ${openingDuration}`);
report.intro.openingDuration=Math.round(openingDuration);
await page.waitForFunction(()=>Engine.getAudioDebug().currentName==='intro'&&Engine.getAudioDebug().sources===2,null,{timeout:5000});
assert(await page.locator('#intro .book-shell[role="button"]').count()===0,'Open book retained its closed-cover button role');
assert((await page.locator('#introStatus').textContent()).includes('passage 1 of 2'),'Opening announcement omits passage position');
assert(await page.locator('#intro .slide.s1 .intro-passage').count()===2,'Folio I passage count is incorrect');
assert(await page.locator('#intro .slide.s2 .intro-passage').count()===3,'Folio II passage count is incorrect');
assert(await page.locator('#intro .slide.s3 .intro-passage').count()===2,'Folio III passage count is incorrect');
report.intro.passages=[2,3,2];

const fireInfo=await page.evaluate(async()=>{
  const response=await fetch('public/audio/intro-fireplace-loop.wav');
  const data=await response.arrayBuffer();
  const ctx=new AudioContext();
  const buffer=await ctx.decodeAudioData(data.slice(0));
  await ctx.close();
  return {bytes:data.byteLength,duration:buffer.duration,channels:buffer.numberOfChannels};
});
assert(fireInfo.bytes>1_000_000&&fireInfo.duration>28&&fireInfo.channels===1,'Replacement fireplace ambience is not the expected long mono recording');
report.audio.fireplace=fireInfo;
const coverInfo=await page.evaluate(async()=>{
  const response=await fetch('public/audio/book-cover-open.wav');
  const data=await response.arrayBuffer();
  const ctx=new AudioContext();
  const buffer=await ctx.decodeAudioData(data.slice(0));
  await ctx.close();
  return {bytes:data.byteLength,duration:buffer.duration,channels:buffer.numberOfChannels};
});
assert(coverInfo.bytes>250_000&&coverInfo.duration>1.45&&coverInfo.channels===2,'The longer clean cover-opening recording is missing');
report.audio.cover=coverInfo;
const audioDebug=await page.evaluate(()=>Engine.getAudioDebug());
report.audio.layers=audioDebug.sources;
report.audio.layerGains=audioDebug.layerGains;
assert(Math.abs(audioDebug.layerGains[0]-1.15)<.001&&Math.abs(audioDebug.layerGains[1]-.29095)<.001,'The compounded intro and fireplace gains are incorrect');
const openingSounds=await page.evaluate(()=>Engine.getIntroSoundDebug().map(entry=>entry.kind));
assert(openingSounds.includes('journey')&&openingSounds.includes('cover')&&openingSounds.includes('page')&&!openingSounds.includes('binding'),'Opening does not use the clean cover-then-page sequence');
report.audio.openingSounds=openingSounds;

const layerState=await page.evaluate(()=>({
  imagePointer:getComputedStyle(document.querySelector('.intro-base-plate')).pointerEvents,
  copyPointer:getComputedStyle(document.querySelector('.intro-passage.active')).pointerEvents,
  copySelect:getComputedStyle(document.querySelector('.intro-passage.active')).userSelect,
  moteZ:getComputedStyle(document.querySelector('#fxIntro')).zIndex,
  pageZ:getComputedStyle(document.querySelector('.intro-page-content')).zIndex,
  lanternAnimation:getComputedStyle(document.querySelector('.intro-lantern-light')).animationName,
  lanternFrames:document.querySelector('.intro-lantern-light').getAnimations()[0]?.effect.getKeyframes().map(frame=>Number(frame.opacity)).filter(Number.isFinite)||[],
  hazePointer:getComputedStyle(document.querySelector('.intro-edge-haze')).pointerEvents,
  hazePosition:getComputedStyle(document.querySelector('.intro-edge-haze')).position,
  hazeRect:(()=>{const r=document.querySelector('.intro-edge-haze').getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]})(),
  topFrame:(()=>{const e=document.querySelector('.intro-frame-top'),r=e.getBoundingClientRect();return {position:getComputedStyle(e).position,pointer:getComputedStyle(e).pointerEvents,rect:[r.left,r.top,r.right,r.bottom]}})(),
  bottomFrame:(()=>{const e=document.querySelector('.intro-frame-bottom'),r=e.getBoundingClientRect();return {position:getComputedStyle(e).position,pointer:getComputedStyle(e).pointerEvents,rect:[r.left,r.top,r.right,r.bottom]}})(),
  stageRect:(()=>{const r=document.querySelector('.intro-stage').getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]})(),
  navRect:(()=>{const r=document.querySelector('.intro-nav').getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]})(),
  bloomBlend:getComputedStyle(document.querySelector('.intro-golden-bloom')).mixBlendMode,
  blackoutPosition:getComputedStyle(document.querySelector('.intro-blackout')).position,
  titleTransform:getComputedStyle(document.querySelector('.folio-mark')).transform,
  titleBorder:[getComputedStyle(document.querySelector('.folio-mark')).borderTopWidth,getComputedStyle(document.querySelector('.folio-mark')).borderBottomWidth],
  navDisplay:getComputedStyle(document.querySelector('.intro-nav')).display,
  buttonClip:getComputedStyle(document.querySelector('.intro-tab')).clipPath
}));
assert(layerState.imagePointer==='none'&&layerState.copyPointer==='auto'&&layerState.copySelect==='text','The photographic plate still captures text interaction');
assert(Number(layerState.moteZ)>Number(layerState.pageZ)&&layerState.hazePointer==='none','Foreground atmosphere has the wrong layer or captures input');
assert(layerState.lanternAnimation==='introLanternPulse','Mechanical lantern pulse is missing');
assert(Math.max(...layerState.lanternFrames)-Math.min(...layerState.lanternFrames)>=.2,'Mechanical lantern pulse does not have the stronger brightness range');
assert(layerState.hazePosition==='fixed'&&Math.abs(layerState.hazeRect[0])<1&&Math.abs(layerState.hazeRect[2]-1440)<1&&Math.abs(layerState.hazeRect[3]-1000)<1,'Smoke is not anchored across the lower viewport');
assert(layerState.hazeRect[1]<=layerState.navRect[1]+10,'Smoke does not rise to the navigation controls');
assert(layerState.topFrame.position==='fixed'&&layerState.bottomFrame.position==='fixed'&&layerState.topFrame.pointer==='none'&&layerState.bottomFrame.pointer==='none','Viewport frames are not fixed non-interactive ornament');
assert(Math.abs(layerState.stageRect[1]-layerState.topFrame.rect[3])<1.5&&Math.abs(layerState.stageRect[3]-layerState.bottomFrame.rect[1])<1.5,'Lantern and lectern stage does not lock between the viewport frames');
assert(layerState.bloomBlend==='normal'&&layerState.blackoutPosition==='fixed','Golden transition exposes the photographic stage boundary');
assert(layerState.titleTransform!=='none'&&layerState.titleBorder.every(value=>value==='0px'),'Folio title perspective or outline cleanup is missing');
assert(layerState.navDisplay==='flex'&&(layerState.buttonClip==='none'||layerState.buttonClip===''),'Bottom navigation is not a rectangular centered row');

const paragraph=page.locator('#intro .intro-passage.active');
const box=await paragraph.boundingBox();
assert(box,'Active intro passage has no bounding box');
const topElement=await page.evaluate(([x,y])=>document.elementFromPoint(x,y)?.closest?.('.intro-passage')?.classList.contains('active')||false,[box.x+20,box.y+16]);
assert(topElement,'The photographed plate is still above the passage hit target');
const selectionPoints=await paragraph.evaluate(element=>{
  const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    if((node.textContent||'').trim().length<55) continue;
    const point=offset=>{ const range=document.createRange(); range.setStart(node,offset); range.setEnd(node,offset+1); const rect=range.getBoundingClientRect(); return {x:rect.left+(rect.width/2),y:rect.top+(rect.height/2)}; };
    return {start:point(2),end:point(48)};
  }
  return null;
});
assert(selectionPoints,'Could not identify visible text positions for selection testing');
await page.mouse.move(selectionPoints.start.x,selectionPoints.start.y);
await page.mouse.down();
await page.mouse.move(selectionPoints.end.x,selectionPoints.end.y,{steps:12});
await page.mouse.up();
const selection=await page.evaluate(()=>getSelection()?.toString().trim()||'');
assert(selection.length>3,'Click-and-drag did not select intro text');
report.intro.selection=selection.slice(0,40);
await page.evaluate(()=>getSelection()?.removeAllRanges());

const brassTerm=page.locator('#intro .slide.s1 .intro-passage.active .gloss',{hasText:'Brassreach'});
await brassTerm.hover();
await page.waitForTimeout(80);
assert(await page.locator('.gloss-tip.on').isVisible(),'Glossary hover does not display the definition');
const tooltipRect=await page.locator('.gloss-tip.on').boundingBox();
assert(tooltipRect&&tooltipRect.x>=0&&tooltipRect.y>=0&&tooltipRect.x+tooltipRect.width<=1440&&tooltipRect.y+tooltipRect.height<=1000,'Glossary tooltip left the viewport');
await page.screenshot({path:path.join(output,'03-folio-i-glossary.png')});
await brassTerm.click();
assert(await page.locator('.gloss-tip.on').isVisible(),'Glossary click did not pin the definition');
await brassTerm.click();
assert(await page.locator('.gloss-tip.on').count()===0,'A second glossary click did not close the definition');
await page.locator('#introAdvance').focus();
await brassTerm.focus();
assert(await page.locator('.gloss-tip.on').isVisible(),'Glossary focus does not display the definition');
await page.keyboard.press('Escape');
report.intro.glossary=true;

let state=await currentState(page);
assert(state.folio===1&&state.passage===1&&state.label.includes('TURN PAGE'),`Initial passage controls are wrong: ${JSON.stringify(state)}`);
const cityArt=state.art;
const intraSoundStart=await page.evaluate(()=>Engine.getIntroSoundDebug().length);
await page.evaluate(()=>{ const button=document.querySelector('#introAdvance'); button.click(); button.click(); });
state=await waitForState(page,1,2);
assert(state.art===cityArt&&state.label==='NEXT ›','Rapid input skipped a passage or changed City art');
const intraSounds=await page.evaluate(start=>Engine.getIntroSoundDebug().slice(start).map(entry=>entry.kind),intraSoundStart);
assert(intraSounds.includes('passage')&&!intraSounds.includes('page'),'Intra-Folio passage change played a page-turn sound');
await page.screenshot({path:path.join(output,'04-folio-i-next.png')});

await page.locator('#introPrevious').click();
await page.waitForTimeout(90);
const intraFade=await page.evaluate(()=>({art:Number(getComputedStyle(document.querySelector('#introArtLayer')).opacity),title:Number(getComputedStyle(document.querySelector('.slide.active .folio-mark')).opacity),copy:Number(getComputedStyle(document.querySelector('.slide.active .copy')).opacity)}));
assert(intraFade.art>.9&&intraFade.title>.95&&intraFade.copy<.85,'Intra-Folio transition did not leave the painting and title stationary while fading only the passage');
await waitForState(page,1,1);
await page.locator('#introAdvance').click();
await waitForState(page,1,2);
const folioSoundStart=await page.evaluate(()=>Engine.getIntroSoundDebug().length);
await page.locator('#introAdvance').click();
await page.waitForTimeout(100);
assert(await page.locator('#intro .book-shell.content-visible').count()===0,'Cross-Folio transition did not fade the whole spread content');
state=await waitForState(page,2,1);
assert(state.art.endsWith('art-archives.png')&&state.label.includes('TURN PAGE'),'NEXT did not enter the Archives at passage one');
const folioSounds=await page.evaluate(start=>Engine.getIntroSoundDebug().slice(start).map(entry=>entry.kind),folioSoundStart);
assert(folioSounds.includes('page')&&folioSounds.includes('settle'),'Cross-Folio transition lost its restrained page audio');
await page.screenshot({path:path.join(output,'05-folio-ii.png')});

await page.locator('#introAdvance').click();
await waitForState(page,2,2);
await page.locator('#introAdvance').click();
state=await waitForState(page,2,3);
assert(state.label==='NEXT ›'&&state.art.endsWith('art-archives.png'),'Folio II final passage state is wrong');
await page.locator('#introAdvance').click();
state=await waitForState(page,3,1);
assert(state.art.endsWith('art-unfathomer.png'),'Folio III did not load the Unfathomer painting');
await page.locator('#introAdvance').click();
state=await waitForState(page,3,2);
assert(state.label==='BEGIN STORY'&&state.action==='begin','Final passage does not expose Begin Story');
await page.screenshot({path:path.join(output,'06-folio-iii-begin.png')});

await page.locator('#introPrevious').click();
await waitForState(page,3,1);
await page.locator('#introPrevious').click();
state=await waitForState(page,2,3);
assert(state.art.endsWith('art-archives.png'),'Previous did not cross back to Folio II final passage');
assert(await page.evaluate(()=>Engine.getAudioDebug().sources)===2,'Passage navigation duplicated the intro audio layers');

for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000});
  for(const [folio,count] of [[0,2],[1,3],[2,2]]){
    for(let passage=0;passage<count;passage++){
      await page.evaluate(([f,p])=>Engine.introController.show(f,p,false),[folio,passage]);
      const metric=await page.evaluate(()=>{
        const stage=document.querySelector('#intro .intro-stage').getBoundingClientRect();
        const topFrame=document.querySelector('#intro .intro-frame-top').getBoundingClientRect();
        const bottomFrame=document.querySelector('#intro .intro-frame-bottom').getBoundingClientRect();
        const copy=document.querySelector('#intro .slide.active .copy').getBoundingClientRect();
        const title=document.querySelector('#intro .slide.active .folio-mark').getBoundingClientRect();
        const nav=document.querySelector('#intro .intro-nav').getBoundingClientRect();
        const passage=document.querySelector('#intro .intro-passage.active');
        return {width:innerWidth,folio:Number(document.querySelector('.book-shell').dataset.folio),passage:Number(document.querySelector('.book-shell').dataset.passage),stage:[stage.left,stage.top,stage.right,stage.bottom],stageCenter:stage.left+stage.width/2,copy:[copy.left,copy.top,copy.right,copy.bottom],title:[title.left,title.top,title.right,title.bottom],nav:[nav.left,nav.top,nav.right,nav.bottom],frames:[topFrame.bottom,bottomFrame.top],fits:passage.scrollHeight<=passage.clientHeight+2,overflow:document.documentElement.scrollWidth-innerWidth};
      });
      assert(Math.abs(metric.stageCenter-width/2)<1.5,`Stage is not centered at ${width}px`);
      const stageWidth=metric.stage[2]-metric.stage[0];
      assert((metric.copy[0]-metric.stage[0])/stageWidth<.535&&((metric.copy[2]-metric.stage[0])/stageWidth)<.75,`Copy approaches the right-page rules at ${width}px`);
      assert((metric.title[1]-metric.stage[1])/(metric.stage[3]-metric.stage[1])>.335,`Folio title was not lowered at ${width}px`);
      assert(Math.abs(metric.stage[1]-metric.frames[0])<1.5&&Math.abs(metric.stage[3]-metric.frames[1])<1.5,`Stage lost its frame anchors at ${width}px`);
      assert(metric.nav[1]>metric.copy[3],`Navigation is not beneath the right page at ${width}px`);
      assert(metric.fits,`Folio ${metric.folio}, passage ${metric.passage} clips at ${width}px`);
      assert(metric.overflow<=0,`Intro creates horizontal overflow at ${width}px`);
      report.layouts.push(metric);
    }
  }
}

const captureResponsiveMetric=async(label)=>page.evaluate(label=>{
  const stage=document.querySelector('#intro .intro-stage').getBoundingClientRect();
  const copy=document.querySelector('#intro .slide.active .copy').getBoundingClientRect();
  const nav=document.querySelector('#intro .intro-nav').getBoundingClientRect();
  const top=document.querySelector('#intro .intro-frame-top').getBoundingClientRect();
  const bottom=document.querySelector('#intro .intro-frame-bottom').getBoundingClientRect();
  const passage=document.querySelector('#intro .intro-passage.active');
  return {label,viewport:[innerWidth,innerHeight],stage:[stage.left,stage.top,stage.right,stage.bottom],copy:[copy.left,copy.top,copy.right,copy.bottom],nav:[nav.left,nav.top,nav.right,nav.bottom],frames:[top.bottom,bottom.top],fits:passage.scrollHeight<=passage.clientHeight+2,overflow:document.documentElement.scrollWidth-innerWidth};
},label);

await page.evaluate(()=>Engine.introController.show(1,1,false));
for(const [zoom,width,height] of [[80,1800,1125],[100,1440,900],[125,1152,720],[150,960,600]]){
  await page.setViewportSize({width,height});
  const metric=await captureResponsiveMetric(`${zoom}% equivalent`);
  assert(Math.abs(metric.stage[1]-metric.frames[0])<1.5&&Math.abs(metric.stage[3]-metric.frames[1])<1.5,`Frame anchoring failed at ${zoom}% zoom equivalent`);
  assert(metric.copy[0]>=0&&metric.copy[2]<=width&&metric.nav[0]>=0&&metric.nav[2]<=width,`Page content left the viewport at ${zoom}% zoom equivalent`);
  assert(metric.fits&&metric.overflow<=0,`Content clipped or overflowed at ${zoom}% zoom equivalent`);
  report.zoomLayouts.push(metric);
  if(zoom===150) await page.screenshot({path:path.join(output,'08-zoom-150.png')});
}

for(const [label,width,height] of [['ultrawide',2100,700],['narrow-tall',1100,1000]]){
  await page.setViewportSize({width,height});
  await page.evaluate(()=>Engine.introController.show(0,0,false));
  const metric=await captureResponsiveMetric(label);
  assert(Math.abs(metric.stage[1]-metric.frames[0])<1.5&&Math.abs(metric.stage[3]-metric.frames[1])<1.5,`Frame anchoring failed for ${label}`);
  assert(metric.copy[0]>=0&&metric.copy[2]<=width&&metric.nav[0]>=0&&metric.nav[2]<=width,`Controlled side cropping hid controls for ${label}`);
  assert(metric.fits&&metric.overflow<=0,`Content clipped or overflowed for ${label}`);
  report.aspectLayouts.push(metric);
  await page.screenshot({path:path.join(output,`09-${label}.png`)});
}
await page.setViewportSize({width:1440,height:1000});
await page.evaluate(()=>Engine.introController.show(2,1,false));

await page.locator('#introAdvance').click();
await page.waitForFunction(()=>document.querySelector('#intro.hidden')&&Engine.state.storyBeats.length>0);
await page.waitForTimeout(180);
assert(await page.locator('#modalEdit:not(.hidden)').count()===1,'Beginning the story no longer opens the character editor');
await page.locator('#btnEditCancel').click();
const opening=page.locator('#story .story-group-opening');
assert(await opening.count()===1&&(await opening.textContent()).includes('The Journey Begins'),'Opening story bracket regressed');
await page.screenshot({path:path.join(output,'07-the-journey-begins.png'),fullPage:true});
report.story.openingBracket=true;

await page.locator('[data-choice-id="tutorial-accept"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-quartermaster');
const groupCount=await page.locator('#story .story-group').count();
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#story'));
assert(await page.locator('#intro.hidden').count()===1,'Seen-intro persistence was lost');
assert(await page.locator('#story .story-group').count()===groupCount,'Story groups did not persist after reload');
report.story.persistence=true;

const inputContext=await browser.newContext({viewport:{width:1280,height:900}});
for(const mode of ['Space','click','Enter']){
  const probe=await inputContext.newPage();
  await loadFresh(probe);
  if(mode==='click') await probe.locator('#introAwaken').click(); else await probe.keyboard.press(mode);
  await probe.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2600});
  report.input[mode.toLowerCase()]=true;
  await probe.close();
}
const skipProbe=await inputContext.newPage();
await loadFresh(skipProbe);
await skipProbe.keyboard.press('Enter');
await skipProbe.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2600});
await skipProbe.locator('#introSkip').click();
await skipProbe.waitForFunction(()=>document.querySelector('#intro.hidden')&&Engine.state.storyBeats.length>0);
report.input.skip=true;
await skipProbe.close();
await inputContext.close();

const touchContext=await browser.newContext({viewport:{width:1280,height:900},hasTouch:true});
const touchPage=await touchContext.newPage();
await loadFresh(touchPage);
await touchPage.locator('#introAwaken').tap();
await touchPage.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2600});
report.input.tap=true;
await touchContext.close();

const migrationContext=await browser.newContext({viewport:{width:1280,height:900}});
const migrationPage=await migrationContext.newPage();
monitor(migrationPage);
await loadFresh(migrationPage);
await migrationPage.evaluate(()=>{
  const inventory=[...Array.from({length:45},(_,index)=>`Legacy Item ${index+1}`),'Legacy Item 1','',null];
  const legacy={saveVersion:4,turn:19,scene:'Archives',storyBeats:[{text:'Legacy progress remains.'}],transcript:['Legacy progress remains.'],character:{name:'Migration Test',race:'Dwarf',STR:12,DEX:12,INT:12,CHA:12,HP:10,MaxHP:14,Gold:7,inventory},equipment:{head:'Legacy Item 1',mainHand:'Missing Item'},flags:{keys:['Echo']},campaign:{version:1,sceneId:'archives-lithen',discoveries:['Old finding'],ending:null},settings:{typewriter:false,audio:{master:.5,ui:.4,music:.4}}};
  localStorage.setItem('brassreach:dds_state',JSON.stringify(legacy));
  localStorage.setItem('brassreach:intro_seen','true');
});
await migrationPage.reload({waitUntil:'networkidle'});
await migrationPage.waitForFunction(()=>Engine.state.saveVersion===7);
const migrated=await migrationPage.evaluate(()=>({version:Engine.state.saveVersion,name:Engine.state.character.name,inventory:Engine.state.character.inventory.length,slots:Engine.state.backpack.slots.filter(Boolean).length,overflow:Engine.state.backpack.overflow.length,head:Engine.state.equipment.head,mainHand:Engine.state.equipment.mainHand,scene:Engine.state.campaign.sceneId,keys:Engine.state.flags.keys,story:Engine.state.storyBeats[0]?.text}));
assert(migrated.name==='Migration Test'&&migrated.inventory===45,'Legacy character or inventory was lost');
assert(migrated.slots===40&&migrated.overflow===5,'Legacy overflow migration failed');
assert(migrated.head===null&&migrated.mainHand===null,'Malformed legacy equipment was not normalized');
assert(migrated.scene==='archives-lithen'&&migrated.keys.includes('Echo')&&migrated.story==='Legacy progress remains.','Legacy campaign progression was lost');

await migrationPage.evaluate(()=>{
  const legacy={saveVersion:1,turn:2,scene:'Halls',storyBeats:[{text:'An older expedition.'}],transcript:['An older expedition.'],character:{name:'Old Save',race:'Dwarf',STR:11,DEX:10,INT:13,CHA:9,HP:8,Gold:3,inventory:['Torch','Oil Flask']},flags:{seals:['Stone']},settings:{typewriter:false,audio:{master:.4,ui:.3,amb:.2}}};
  localStorage.setItem('brassreach:dds_state',JSON.stringify(legacy));
});
await migrationPage.reload({waitUntil:'networkidle'});
await migrationPage.waitForFunction(()=>Engine.state.character.name==='Old Save');
const preEquipment=await migrationPage.evaluate(()=>({version:Engine.state.saveVersion,items:Engine.state.character.inventory,equipment:Object.values(Engine.state.equipment),keys:Engine.state.flags.keys,music:Engine.state.settings.audio.music,maxHP:Engine.state.character.MaxHP,scene:Engine.state.campaign.sceneId}));
assert(preEquipment.version===7&&preEquipment.items.join('|')==='Torch|Oil Flask','Pre-equipment inventory did not migrate');
assert(preEquipment.equipment.every(item=>item===null)&&preEquipment.keys.includes('Stone'),'Pre-equipment slots or seals did not migrate');
assert(preEquipment.music===.2&&preEquipment.maxHP===8&&preEquipment.scene==='tutorial-commission','Legacy preferences, HP, or start scene did not migrate');
report.migration={legacy:migrated,preEquipment};
await migrationContext.close();

const reducedContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const reducedPage=await reducedContext.newPage();
await loadFresh(reducedPage);
await reducedPage.keyboard.press('Enter');
await reducedPage.waitForTimeout(850);
const reducedTransition=await reducedPage.evaluate(()=>({lantern:getComputedStyle(document.querySelector('.intro-lantern-light')).animationDuration,bloomName:getComputedStyle(document.querySelector('.intro-golden-bloom')).animationName,bloomTransform:getComputedStyle(document.querySelector('.intro-golden-bloom')).transform}));
assert(parseFloat(reducedTransition.lantern)<.1&&reducedTransition.bloomName==='introGoldenBloomReduced','Reduced motion does not use the restrained opacity-only opening');
await reducedPage.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready.content-visible')&&!document.querySelector('#intro .book-shell.is-turning'),null,{timeout:2000});
await reducedPage.locator('#introAdvance').click();
await reducedPage.waitForFunction(()=>document.querySelector('.book-shell').dataset.passage==='2'&&!document.querySelector('.book-shell').classList.contains('is-turning'),null,{timeout:600});
report.intro.reducedMotion=true;
await reducedContext.close();

assert(report.consoleErrors.length===0,`Console errors: ${report.consoleErrors.join(' | ')}`);
assert(report.failedLocalRequests.length===0,`Failed local requests: ${report.failedLocalRequests.join(' | ')}`);
await fs.writeFile(path.join(output,'report.json'),JSON.stringify({...report,plateInfo},null,2));
console.log(JSON.stringify({...report,plateInfo},null,2));
await context.close();
await browser.close();
await new Promise(resolve=>server?server.close(resolve):resolve());
