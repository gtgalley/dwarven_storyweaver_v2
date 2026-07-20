import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const playwrightRoot=process.env.PLAYWRIGHT_ROOT;
if(!playwrightRoot) throw new Error('PLAYWRIGHT_ROOT is required');
const {chromium}=await import(pathToFileURL(path.join(playwrightRoot,'index.mjs')).href);

const base=process.env.BRASSREACH_URL||'http://127.0.0.1:4173/';
const output=process.env.BRASSREACH_ARTIFACTS||path.resolve('tests','artifacts','overhaul7');
const executablePath=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output,{recursive:true});

const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const results={intro:[],scenes:[],endings:{},failure:{},consoleErrors:[],failedLocalRequests:[]};
const browser=await chromium.launch({headless:true,executablePath});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();
page.on('console',message=>{ if(message.type()==='error') results.consoleErrors.push(message.text()); });
page.on('pageerror',error=>results.consoleErrors.push(error.message));
page.on('requestfailed',request=>{
  const error=request.failure()?.errorText||'failed';
  if(request.url().startsWith(base)&&error!=='net::ERR_ABORTED') results.failedLocalRequests.push(`${request.url()} — ${error}`);
});

async function ready(){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#intro'));
}

async function seedScene(sceneId,{items=[],prepared=false}={}){
  await page.evaluate(({sceneId,items,prepared})=>{
    const S=Engine.state;
    S.settings.typewriter=false;
    S.campaign.sceneId=sceneId;
    S.campaign.chapter=sceneId.split('-')[0];
    S.campaign.objective='';
    S.campaign.authority=prepared?'Threadbearer under Deep Writ':'Probationary Threadbearer';
    S.campaign.writ=prepared?'deep':'probationary';
    S.campaign.completedScenes=[];
    S.campaign.ending=null;
    S.storyBeats=[];
    S.transcript=[];
    S.flags.keys=prepared?['Echo','Stone','Brass']:S.flags.keys||[];
    S.campaign.evidence=prepared?Array.from({length:10},(_,index)=>`Evidence ${index+1}`):S.campaign.evidence||[];
    S.campaign.testimony=prepared?Array.from({length:6},(_,index)=>`Testimony ${index+1}`):S.campaign.testimony||[];
    S.campaign.repairs=prepared?Array.from({length:8},(_,index)=>`Repair ${index+1}`):S.campaign.repairs||[];
    S.campaign.alliances=prepared?{lithen:2,orra:2,choir:2,worksfolk:2,wardens:2}:S.campaign.alliances||{};
    S.campaign.flags={...(S.campaign.flags||{}),unfathomerNamed:true,keysKnown:true,fullRecord:prepared,networkImproved:prepared};
    S.character.inventory=[...new Set(['Torch','Canteen','Thread Ledger',...(prepared?['Echo Key','Stone Key','Brass Key']:[]),...items])];
    localStorage.setItem('brassreach:dds_state',JSON.stringify(S));
    localStorage.setItem('brassreach:intro_seen','true');
  },{sceneId,items,prepared});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(id=>Engine.state.campaign.sceneId===id&&Engine.state.storyBeats.length>0,sceneId);
}

await ready();
await page.evaluate(()=>{
  Engine.state.settings.typewriter=false;
  localStorage.setItem('brassreach:dds_state',JSON.stringify(Engine.state));
  localStorage.removeItem('brassreach:intro_seen');
});
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>document.querySelector('#intro .book-shell.is-dormant'));
const introText=await page.locator('#intro').textContent();
assert(introText.includes('Threadbearer'),'The intro no longer establishes the player’s role');
assert(!/Unfathomer|Gate of Measures|Three Keys/.test(introText),'The intro reveals late-game discoveries');
await page.keyboard.press('Enter');
await page.waitForFunction(()=>document.querySelector('#intro .book-shell.is-ready'));
for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000});
  await page.waitForTimeout(50);
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
  assert(metric.artRight<=width/2+2,`Intro artwork crosses the gutter at ${width}px`);
  assert(metric.copyLeft>=width/2-2,`Intro copy crosses the gutter at ${width}px`);
  assert(metric.overflow<=0,`Horizontal overflow at ${width}px`);
  results.intro.push(metric);
}
await page.setViewportSize({width:1440,height:1000});
await page.screenshot({path:path.join(output,'01-intro.png'),fullPage:true});

const captures=[
  ['tutorial-bell-stair','02-tutorial-bell-stair.png','central support'],
  ['archives-record-well','03-archives-record-well.png','Record Well'],
  ['depths-platform','04-ninth-platform.png','Ninth Platform'],
  ['brassworks-choir','05-brassworks.png','Sella'],
  ['gate-counter','06-gate-counter.png','Counter'],
  ['choice-contact','07-unfathomer-contact.png','No face waits in the water']
];
for(const [sceneId,file,needle] of captures){
  await seedScene(sceneId,{prepared:true});
  const text=await page.locator('#story').innerText();
  assert(text.includes(needle),`${sceneId} did not render its revised scene text`);
  assert(text.length>900,`${sceneId} rendered an abbreviated scene (${text.length} characters)`);
  await page.screenshot({path:path.join(output,file),fullPage:true});
  results.scenes.push({sceneId,textLength:text.length});
}

await seedScene('brassworks-crawler',{prepared:true,items:['Foundry Gloves','Stoneback Plate','Resonance Fork','Mender’s Clamp','Cistern Boots']});
await page.keyboard.press('e');
await page.locator('#modalInventory:not(.hidden)').waitFor();
await page.locator('#inventoryItems [data-item="Foundry Gloves"]').hover();
await page.locator('#itemTooltip:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'08-inventory-tooltip.png'),fullPage:true});
await page.keyboard.press('Escape');

await seedScene('tutorial-bell-stair',{items:['Rope Coil']});
await page.evaluate(()=>{ Math.random=()=>0; });
await page.locator('[data-choice-id="stair-brace"]').click();
await page.locator('#modalLost:not(.hidden)').waitFor();
const lostText=await page.locator('#modalLost').innerText();
assert(/accept the consequence/i.test(lostText),'Failure recovery lacks a fail-forward option');
assert(/gold|item/i.test(lostText),'Failure recovery lacks a reroll cost');
await page.screenshot({path:path.join(output,'09-failure-recovery.png'),fullPage:true});
results.failure={text:lostText.split('\n').filter(Boolean).slice(0,8)};
await page.locator('[data-lost-action="accept"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-tangles');

for(const id of ['concord','channel','bind','banish','hold']){
  await seedScene('choice-decision',{prepared:true});
  const button=page.locator(`[data-choice-id="ending-${id}"]`);
  assert(await button.count()===1,`${id} ending choice is missing`);
  assert(await button.isEnabled(),`${id} ending choice is not reachable with full preparation`);
  await button.click();
  await page.locator('#modalEpi:not(.hidden)').waitFor();
  const ending=await page.evaluate(()=>Engine.state.campaign.ending);
  const epilogue=await page.locator('#epiContent').innerText();
  assert(ending.id===id,`${id} did not resolve to the selected ending`);
  assert(ending.quality==='strong',`${id} did not recognize full preparation`);
  assert(epilogue.length>1200,`${id} epilogue is too abbreviated (${epilogue.length} characters)`);
  assert(epilogue.includes('Counter record:'),`${id} epilogue lacks its preparation record`);
  assert(await page.locator('#btnEpiRestart').isVisible(),`${id} epilogue hides the New Run control`);
  results.endings[id]={quality:ending.quality,textLength:epilogue.length};
  if(id==='concord') await page.screenshot({path:path.join(output,'10-concord-ending.png'),fullPage:true});
  if(id==='banish') await page.screenshot({path:path.join(output,'11-banish-ending.png'),fullPage:true});
  await page.locator('#xEpi').click();
}

assert(results.consoleErrors.length===0,`Console errors: ${results.consoleErrors.join(' | ')}`);
assert(results.failedLocalRequests.length===0,`Failed local requests: ${results.failedLocalRequests.join(' | ')}`);
await browser.close();
console.log(JSON.stringify(results,null,2));
