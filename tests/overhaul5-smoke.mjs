import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const playwrightRoot=process.env.PLAYWRIGHT_ROOT;
if(!playwrightRoot) throw new Error('PLAYWRIGHT_ROOT is required');
const {chromium}=await import(pathToFileURL(path.join(playwrightRoot,'index.mjs')).href);

const base=process.env.BRASSREACH_URL||'http://127.0.0.1:4173/';
const output=process.env.BRASSREACH_ARTIFACTS||path.resolve('tests','artifacts','overhaul5');
const executablePath=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output,{recursive:true});

const results={intro:[],layouts:[],campaign:{},failureCampaign:{},migration:{},liveGuard:{},consoleErrors:[],failedLocalRequests:[]};
const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const browser=await chromium.launch({headless:true,executablePath});

function observe(page){
  page.on('console',message=>{ if(message.type()==='error') results.consoleErrors.push(message.text()); });
  page.on('pageerror',error=>results.consoleErrors.push(error.message));
  page.on('requestfailed',request=>{ if(request.url().startsWith(base)) results.failedLocalRequests.push(`${request.url()} — ${request.failure()?.errorText||'failed'}`); });
}
async function ready(page){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#intro'));
}
async function acceptFailureIfShown(page){
  const lost=page.locator('#modalLost:not(.hidden)');
  if(!await lost.count()) return false;
  await lost.locator('[data-lost-action="accept"]').click();
  await page.waitForTimeout(60);
  return true;
}

const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage(); observe(page); await ready(page);
await page.evaluate(()=>{
  Engine.state.settings.typewriter=false;
  Engine.state.character.Gold=80;
  localStorage.setItem('brassreach:dds_state',JSON.stringify(Engine.state));
  localStorage.removeItem('brassreach:intro_seen');
});
await page.reload({waitUntil:'networkidle'}); await page.waitForFunction(()=>document.querySelector('#intro .slide.active .pic'));

const introText=await page.locator('#intro').innerText();
assert(!/Unfathomer|Gate of Measures|Three Keys/.test(introText),'Intro reveals late-game lore before investigation');
for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000}); await page.waitForTimeout(60);
  const metric=await page.evaluate(()=>{
    const slide=document.querySelector('#intro .slide.active'),pic=slide.querySelector('.pic'),scroll=slide.querySelector('.scroll');
    const sr=slide.getBoundingClientRect(),pr=pic.getBoundingClientRect(),tr=scroll.getBoundingClientRect(),before=getComputedStyle(slide,'::before'),after=getComputedStyle(slide,'::after');
    return {width:innerWidth,viewportCenter:innerWidth/2,lineCenter:sr.left+parseFloat(before.left),jewelCenter:sr.left+parseFloat(after.left),leftGap:innerWidth/2-pr.right,rightGap:tr.left-innerWidth/2,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert(Math.abs(metric.lineCenter-metric.viewportCenter)<.1,`Intro divider is off-center at ${width}px`);
  assert(Math.abs(metric.jewelCenter-metric.viewportCenter)<.1,`Intro jewel is off-center at ${width}px`);
  assert(Math.abs(metric.leftGap-metric.rightGap)<.1,`Intro panes are asymmetric at ${width}px`);
  assert(metric.overflow<=0,`Intro overflow at ${width}px`); results.intro.push(metric);
}
await page.setViewportSize({width:1440,height:1000});
await page.screenshot({path:path.join(output,'01-intro.png'),fullPage:true});
await page.locator('.intro-next').first().click(); await page.locator('#intro .slide.active .intro-next').click(); await page.locator('#intro .slide.active .intro-begin').click();
await page.locator('#modalEdit:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'02-character-editor.png'),fullPage:true});
assert(await page.locator('#edInvList .inventory-edit-chip.protected').count()===1,'Quest item is removable in the character editor');
await page.locator('.stepper-arrow').first().focus();
const stepperOutline=await page.locator('.stepper-arrow').first().evaluate(element=>getComputedStyle(element).outlineStyle);
assert(stepperOutline==='none','Character stepper still shows an outline');
await page.keyboard.press('e'); assert(await page.locator('#modalInventory.hidden').count()===1,'E opened inventory over character editor');
await page.locator('#edName').fill('Eldan Forgeward'); await page.locator('#btnEditSave').click();
assert(await page.locator('#charHeaderName').innerText()==='Eldan Forgeward','Character header did not update');

for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000}); await page.waitForTimeout(60);
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scene:Engine.state.campaign.sceneId,objective:Engine.state.campaign.objective}));
  assert(layout.scrollWidth<=width,`Main screen overflow at ${width}px`); results.layouts.push(layout);
}
await page.setViewportSize({width:1440,height:1000}); await page.screenshot({path:path.join(output,'03-main-tutorial.png'),fullPage:true});
assert((await page.locator('#objectivePanel').innerText()).includes('probationary commission'),'Opening objective is not the probationary commission');
assert(!(await page.locator('body').innerText()).includes('Unfathomer'),'Main screen names the Unfathomer before Lithen');

await page.keyboard.press('e'); await page.locator('#modalInventory:not(.hidden)').waitFor(); await page.screenshot({path:path.join(output,'04-inventory.png'),fullPage:true});
const ledgerItem=page.locator('#inventoryItems [data-item="Thread Ledger"]'); assert(await ledgerItem.count()===1,'Thread Ledger was not granted with a reason');
await ledgerItem.hover(); await page.locator('#itemTooltip:not(.hidden)').waitFor(); await page.screenshot({path:path.join(output,'05-item-tooltip.png'),fullPage:true});
await ledgerItem.click(); await page.locator('#inventoryItems .empty').first().click(); assert(await page.locator('#itemTooltip.hidden').count()===1,'Pinned tooltip did not close from an empty slot');
await page.locator('#inventoryItems [data-item="Torch"]').click(); await page.keyboard.press('q');
assert(await page.evaluate(()=>Engine.state.equipment.offHand==='Torch'),'Q did not quick-equip a compatible item');
await page.locator('#inventoryItems [data-item="Canteen"]').dragTo(page.locator('.equip-slot[data-slot="accessory"]'));
assert(await page.evaluate(()=>Engine.state.equipment.accessory==='Canteen'),'Drag-and-drop did not equip the accessory');
await page.keyboard.press('Escape'); await page.locator('#modalInventory').waitFor({state:'hidden'});

await page.keyboard.press('j'); await page.locator('#modalJournal:not(.hidden)').waitFor();
const journalOpening=await page.locator('#journalContent').innerText(); await page.screenshot({path:path.join(output,'06-journal.png'),fullPage:true});
const journalLower=journalOpening.toLowerCase();
assert(journalLower.includes('evidence')&&journalLower.includes('completed repairs')&&journalLower.includes('authority'),`Journal lacks civic progression sections: ${journalOpening}`); await page.keyboard.press('j');

await page.locator('#freeText').focus(); await page.keyboard.press('e'); assert(await page.locator('#modalInventory.hidden').count()===1,'E opened inventory while typing');
const beforeExplore=await page.evaluate(()=>({scene:Engine.state.campaign.sceneId,beats:Engine.state.storyBeats.length}));
await page.locator('#freeText').fill('inspect the public bell foundation'); await page.locator('#btnAct').click();
const afterExplore=await page.evaluate(()=>({scene:Engine.state.campaign.sceneId,beats:Engine.state.storyBeats.length,text:Engine.state.storyBeats.at(-1)?.text}));
assert(afterExplore.scene===beforeExplore.scene&&afterExplore.beats===beforeExplore.beats+1,'Free action skipped the authored objective');
assert(!/Unfathomer/i.test(afterExplore.text),'Local free action revealed the Unfathomer too early');

await page.evaluate(()=>{
  window.__brassreachFetch=window.fetch;
  window.fetch=(url,options)=>String(url).includes('/dm-turn')?Promise.resolve(new Response(JSON.stringify({story_paragraph:'The Unfathomer says that the Fourth Measure is hidden below.'}),{status:200,headers:{'Content-Type':'application/json'}})):window.__brassreachFetch(url,options);
  Engine.state.live.on=true; localStorage.setItem('brassreach:dm_on','true');
});
await page.locator('#freeText').fill('listen at the stair'); await page.locator('#btnAct').click(); await page.waitForTimeout(80);
const guarded=await page.evaluate(()=>Engine.state.storyBeats.at(-1)?.text||'');
assert(!/Unfathomer|Fourth Measure/i.test(guarded),'Live narration guard accepted superseded lore');
results.liveGuard={acceptedFallback:true,text:guarded};
await page.evaluate(()=>{ window.fetch=window.__brassreachFetch; Engine.state.live.on=false; localStorage.setItem('brassreach:dm_on','false'); });

while(await page.evaluate(()=>Engine.state.campaign.sceneId)!=='tutorial-bell-stair'){
  await page.locator('#choices .choice-btn:not(.choice-merchant):not([disabled])').first().click(); await page.waitForTimeout(40);
}
await page.evaluate(()=>{ window.__brassreachRandom=Math.random; Math.random=()=>0; });
await page.locator('#choices .choice-btn:not(.choice-merchant)').first().click(); await page.locator('#modalLost:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'07-lost-encounter.png'),fullPage:true});
const goldBefore=await page.evaluate(()=>Engine.state.character.Gold); await page.evaluate(()=>{ Math.random=()=>.999999; }); await page.locator('[data-lost-action="gold"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-tangles');
assert(await page.evaluate(()=>Engine.state.character.Gold)<goldBefore,'Gold reroll did not charge the player');

let steps=3,failures=1,namingCaptured=false,gateCaptured=false;
await page.evaluate(()=>{ Math.random=()=>.999999; });
while(steps<55){
  const state=await page.evaluate(()=>({scene:Engine.state.campaign.sceneId,ending:Engine.state.campaign.ending,named:Engine.state.campaign.flags.unfathomerNamed}));
  if(state.ending) break;
  if(state.scene==='archives-lithen'&&!namingCaptured){ await page.screenshot({path:path.join(output,'08-lithen-names-the-deep.png'),fullPage:true}); namingCaptured=true; }
  if(state.scene==='gate-counter'&&!gateCaptured){ await page.screenshot({path:path.join(output,'09-gate-counter.png'),fullPage:true}); gateCaptured=true; }
  const action=page.locator('#choices .choice-btn:not(.choice-merchant):not([disabled])').first(); assert(await action.count()===1,`No available campaign action at ${state.scene}`);
  await action.click(); await page.waitForTimeout(55); if(await acceptFailureIfShown(page)) failures++; steps++;
}
const campaign=await page.evaluate(()=>({scene:Engine.state.campaign.sceneId,ending:Engine.state.campaign.ending,keys:Engine.state.flags.keys,completedScenes:Engine.state.campaign.completedScenes.length,completedEncounters:Engine.state.campaign.completedEncounters.length,evidence:Engine.state.campaign.evidence.length,testimony:Engine.state.campaign.testimony.length,repairs:Engine.state.campaign.repairs.length,alliances:Engine.state.campaign.alliances,journal:Engine.state.journal,items:Engine.state.character.inventory}));
assert(campaign.ending?.id==='concord','Prepared campaign did not reach the Concord ending');
assert(campaign.ending.quality==='strong','Fully prepared campaign did not earn a strong ending');
assert(campaign.keys.length===3,'Campaign did not earn all three institutional Keys');
assert(campaign.completedScenes>=34,'Too few campaign scenes completed');
assert(campaign.evidence>=9&&campaign.repairs>=7,'Campaign preparation did not accumulate');
assert(campaign.items.includes('Echo Key')&&campaign.items.includes('Stone Key')&&campaign.items.includes('Brass Key'),'Key items are missing from inventory');
assert(await page.locator('#modalLost:not(.hidden)').count()===0,'Final living Choice triggered a lost encounter roll');
results.campaign={...campaign,steps,failures}; await page.screenshot({path:path.join(output,'10-concord-epilogue.png'),fullPage:true});
await page.locator('#xEpi').click(); await page.keyboard.press('e'); await page.locator('#modalInventory:not(.hidden)').waitFor(); await page.screenshot({path:path.join(output,'11-inventory-populated.png'),fullPage:true}); await page.keyboard.press('e');

await page.reload({waitUntil:'networkidle'}); await page.waitForFunction(()=>Engine.state.saveVersion===5);
const persisted=await page.evaluate(()=>({ending:Engine.state.campaign.ending?.id,keys:Engine.state.flags.keys,repairs:Engine.state.campaign.repairs.length,scene:Engine.state.campaign.sceneId}));
assert(persisted.ending==='concord'&&persisted.keys.length===3&&persisted.repairs>=7,'Campaign state did not persist after reload');

const failureContext=await browser.newContext({viewport:{width:1280,height:900}});
const failurePage=await failureContext.newPage(); observe(failurePage); await ready(failurePage);
await failurePage.evaluate(()=>{
  Engine.state.settings.typewriter=false; localStorage.setItem('brassreach:dds_state',JSON.stringify(Engine.state)); localStorage.setItem('brassreach:intro_seen','true');
});
await failurePage.reload({waitUntil:'networkidle'}); await failurePage.waitForFunction(()=>Engine.state.storyBeats.length>0);
await failurePage.evaluate(()=>{ Math.random=()=>0; });
let failureSteps=0,acceptedFailures=0;
while(failureSteps<60){
  const state=await failurePage.evaluate(()=>({scene:Engine.state.campaign.sceneId,ending:Engine.state.campaign.ending}));
  if(state.ending) break;
  if(state.scene==='choice-decision'){
    const hold=failurePage.locator('[data-choice-id="ending-hold"]:not([disabled])'); assert(await hold.count()===1,'Hold was unavailable after a fail-forward run'); await hold.click();
  }else{
    const action=failurePage.locator('#choices .choice-btn:not(.choice-merchant):not([disabled])').first(); assert(await action.count()===1,`Fail-forward run stalled at ${state.scene}`); await action.click();
  }
  await failurePage.waitForTimeout(25); if(await acceptFailureIfShown(failurePage)) acceptedFailures++; failureSteps++;
}
const failureCampaign=await failurePage.evaluate(()=>({ending:Engine.state.campaign.ending,scene:Engine.state.campaign.sceneId,keys:Engine.state.flags.keys,consequences:Engine.state.campaign.consequences,repairs:Engine.state.campaign.repairs,evidence:Engine.state.campaign.evidence}));
assert(failureCampaign.ending?.id==='hold','Fail-forward campaign did not reach the chosen Hold ending');
assert(acceptedFailures>=15&&failureCampaign.consequences.length>0,'Failure consequences did not accumulate');
assert(await failurePage.locator('#modalLost:not(.hidden)').count()===0,'Deterministic Hold ending opened a lost encounter');
results.failureCampaign={...failureCampaign,steps:failureSteps,acceptedFailures}; await failurePage.screenshot({path:path.join(output,'12-hold-epilogue.png'),fullPage:true}); await failureContext.close();

const migrationContext=await browser.newContext({viewport:{width:1280,height:900}});
const migrationPage=await migrationContext.newPage(); observe(migrationPage); await ready(migrationPage);
await migrationPage.evaluate(()=>{
  const inventory=[...Array.from({length:45},(_,index)=>`Legacy Item ${index+1}`),'Legacy Item 1','',null];
  const legacy={saveVersion:4,turn:19,scene:'Archives',storyBeats:[{text:'Legacy progress remains.'}],transcript:['Legacy progress remains.'],character:{name:'Migration Test',race:'Dwarf',STR:12,DEX:12,INT:12,CHA:12,HP:10,MaxHP:14,Gold:7,inventory},equipment:{head:'Legacy Item 1',mainHand:'Missing Item'},flags:{keys:['Echo']},campaign:{version:1,sceneId:'archives-lithen',discoveries:['Old finding'],ending:null},settings:{typewriter:false,audio:{master:.5,ui:.4,music:.4}}};
  localStorage.setItem('brassreach:dds_state',JSON.stringify(legacy)); localStorage.setItem('brassreach:intro_seen','true');
});
await migrationPage.reload({waitUntil:'networkidle'}); await migrationPage.waitForFunction(()=>Engine.state.saveVersion===5);
const migration=await migrationPage.evaluate(()=>({version:Engine.state.saveVersion,name:Engine.state.character.name,inventory:Engine.state.character.inventory.length,slots:Engine.state.backpack.slots.filter(Boolean).length,overflow:Engine.state.backpack.overflow.length,head:Engine.state.equipment.head,mainHand:Engine.state.equipment.mainHand,scene:Engine.state.campaign.sceneId,chapter:Engine.state.campaign.chapter,keys:Engine.state.flags.keys,story:Engine.state.storyBeats[0]?.text,named:Engine.state.campaign.flags.unfathomerNamed,writ:Engine.state.campaign.writ}));
assert(migration.name==='Migration Test'&&migration.inventory===45,'Legacy items or character were lost');
assert(migration.slots===40&&migration.overflow===5,'Overflow migration failed');
assert(migration.head===null&&migration.mainHand===null,'Malformed equipment was not normalized');
assert(migration.scene==='archives-lithen'&&migration.chapter==='archives','Old campaign scene did not map to canonical graph');
assert(migration.keys.includes('Echo')&&migration.story==='Legacy progress remains.','Legacy progression was lost');
assert(migration.named&&migration.writ==='deep','Lore discovery or authority did not normalize');

await migrationPage.evaluate(()=>{
  const preEquipment={saveVersion:1,turn:2,scene:'Halls',storyBeats:[{text:'An older expedition.'}],transcript:['An older expedition.'],character:{name:'Old Save',race:'Dwarf',STR:11,DEX:10,INT:13,CHA:9,HP:8,Gold:3,inventory:['Torch','Oil Flask']},flags:{seals:['Stone']},settings:{typewriter:false,audio:{master:.4,ui:.3,amb:.2}}};
  localStorage.setItem('brassreach:dds_state',JSON.stringify(preEquipment));
});
await migrationPage.reload({waitUntil:'networkidle'}); await migrationPage.waitForFunction(()=>Engine.state.character.name==='Old Save');
const preEquipment=await migrationPage.evaluate(()=>({version:Engine.state.saveVersion,items:Engine.state.character.inventory,equipment:Object.values(Engine.state.equipment),keys:Engine.state.flags.keys,music:Engine.state.settings.audio.music,maxHP:Engine.state.character.MaxHP,scene:Engine.state.campaign.sceneId}));
assert(preEquipment.version===5&&preEquipment.items.join('|')==='Torch|Oil Flask','Pre-equipment inventory did not migrate');
assert(preEquipment.equipment.every(item=>item===null)&&preEquipment.keys.includes('Stone'),'Old equipment or seals migration failed');
assert(preEquipment.music===.2&&preEquipment.maxHP===8&&preEquipment.scene==='tutorial-commission','Old preferences, HP, or start migration failed');
results.migration={overhaul4:migration,preEquipment}; await migrationContext.close();

await page.evaluate(()=>{ Math.random=window.__brassreachRandom; });
assert(results.consoleErrors.length===0,`Console errors: ${results.consoleErrors.join(' | ')}`);
assert(results.failedLocalRequests.length===0,`Failed local requests: ${results.failedLocalRequests.join(' | ')}`);
await fs.writeFile(path.join(output,'smoke-results.json'),JSON.stringify(results,null,2));
await context.close(); await browser.close(); console.log(JSON.stringify(results,null,2));
