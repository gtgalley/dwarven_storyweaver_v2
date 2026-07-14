import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const playwrightRoot=process.env.PLAYWRIGHT_ROOT;
if(!playwrightRoot) throw new Error('PLAYWRIGHT_ROOT is required');
const { chromium }=await import(pathToFileURL(path.join(playwrightRoot,'index.mjs')).href);

const base=process.env.BRASSREACH_URL||'http://127.0.0.1:4173/';
const output=process.env.BRASSREACH_ARTIFACTS||path.resolve('tests','artifacts','overhaul4');
const executablePath=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output,{recursive:true});

const results={intro:[],layouts:[],campaign:{},migration:{},consoleErrors:[],failedLocalRequests:[]};
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
  if(await lost.count()){
    if(!results.lostCaptured){ await page.screenshot({path:path.join(output,'07-lost-encounter.png'),fullPage:true}); results.lostCaptured=true; }
    await lost.locator('[data-lost-action="accept"]').click();
    await page.waitForTimeout(80);
    return true;
  }
  return false;
}

const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage(); observe(page);
await ready(page);
await page.evaluate(()=>{
  Engine.state.settings.typewriter=false;
  localStorage.setItem('brassreach:dds_state',JSON.stringify(Engine.state));
  localStorage.removeItem('brassreach:intro_seen');
});
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>document.querySelector('#intro .slide.active .pic'));

for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000}); await page.waitForTimeout(80);
  const metric=await page.evaluate(()=>{
    const slide=document.querySelector('#intro .slide.active'),pic=slide.querySelector('.pic'),scroll=slide.querySelector('.scroll');
    const sr=slide.getBoundingClientRect(),pr=pic.getBoundingClientRect(),tr=scroll.getBoundingClientRect();
    const before=getComputedStyle(slide,'::before'),after=getComputedStyle(slide,'::after');
    const lineCenter=sr.left+parseFloat(before.left);
    const jewelCenter=sr.left+parseFloat(after.left);
    return {width:innerWidth,viewportCenter:innerWidth/2,lineCenter,jewelCenter,leftGap:innerWidth/2-pr.right,rightGap:tr.left-innerWidth/2,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert(Math.abs(metric.lineCenter-metric.viewportCenter)<0.1,`Intro divider is off-center at ${width}px`);
  assert(Math.abs(metric.jewelCenter-metric.viewportCenter)<0.1,`Intro center jewel is off-center at ${width}px`);
  assert(Math.abs(metric.leftGap-metric.rightGap)<0.1,`Intro panes are asymmetric at ${width}px`);
  assert(metric.overflow<=0,`Intro has horizontal overflow at ${width}px`);
  results.intro.push(metric);
}

await page.setViewportSize({width:1440,height:1000});
await page.screenshot({path:path.join(output,'01-intro.png'),fullPage:true});
await page.locator('.intro-next').first().click();
await page.locator('#intro .slide.active .intro-next').click();
await page.locator('#intro .slide.active .intro-begin').click();
await page.locator('#modalEdit:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'02-character-editor.png'),fullPage:true});
await page.keyboard.press('e'); assert(await page.locator('#modalInventory.hidden').count()===1,'E opened inventory over the character modal');
await page.locator('#edName').fill('Eldan Forgeward');
await page.locator('#btnEditSave').click();
await page.locator('#modalEdit').waitFor({state:'hidden'});
assert(await page.locator('#charHeaderName').innerText()==='Eldan Forgeward','Character name did not update the card header');

for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000}); await page.waitForTimeout(80);
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scene:Engine.state.campaign.sceneId,objective:Engine.state.campaign.objective}));
  assert(layout.scrollWidth<=width,`Main screen has horizontal overflow at ${width}px`); results.layouts.push(layout);
}
await page.setViewportSize({width:1440,height:1000});
await page.screenshot({path:path.join(output,'03-main-story.png'),fullPage:true});

await page.keyboard.press('e'); await page.locator('#modalInventory:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'04-inventory-light.png'),fullPage:true});
const firstItem=page.locator('#inventoryItems [data-item]').first();
await firstItem.hover(); await page.locator('#itemTooltip:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'05-item-tooltip.png'),fullPage:true});
const itemName=await firstItem.getAttribute('data-item');
await firstItem.click(); assert(await page.locator('#itemTooltip:not(.hidden)').count()===1,'Click did not pin tooltip');
await page.locator(`#inventoryItems [data-item="${itemName}"]`).click(); assert(await page.locator('#itemTooltip.hidden').count()===1,'Second click did not close tooltip');
assert(await page.evaluate(name=>Object.values(Engine.state.equipment).includes(name),itemName),'Double-click sequence did not equip the item');
await page.locator(`#inventoryItems [data-item="${itemName}"]`).click();
await page.locator('#inventoryItems .empty').first().click(); assert(await page.locator('#itemTooltip.hidden').count()===1,'Empty slot did not close tooltip');
await page.waitForTimeout(450);
await page.locator(`#inventoryItems [data-item="${itemName}"]`).click(); await page.keyboard.press('q');
assert(!await page.evaluate(name=>Object.values(Engine.state.equipment).includes(name),itemName),'Q did not quick-remove the selected equipped item');
await page.waitForTimeout(450);
await page.locator(`#inventoryItems [data-item="${itemName}"]`).click();
await page.waitForTimeout(80);
await page.locator(`#inventoryItems [data-item="${itemName}"]`).click();
assert(await page.evaluate(name=>Object.values(Engine.state.equipment).includes(name),itemName),'Double-click sequence did not equip the item');
await page.keyboard.press('Escape'); await page.locator('#modalInventory').waitFor({state:'hidden'});

await page.keyboard.press('j'); await page.locator('#modalJournal:not(.hidden)').waitFor();
assert((await page.locator('#journalContent').innerText()).includes('Report to Quartermaster'),'Journal did not show the current objective');
await page.keyboard.press('j'); await page.locator('#modalJournal').waitFor({state:'hidden'});

await page.locator('#freeText').focus(); await page.keyboard.press('e'); assert(await page.locator('#modalInventory.hidden').count()===1,'E opened inventory while typing');
const beforeExplore=await page.evaluate(()=>({scene:Engine.state.campaign.sceneId,beats:Engine.state.storyBeats.length}));
await page.locator('#freeText').fill('inspect the nearest survey marks'); await page.locator('#btnAct').click();
const afterExplore=await page.evaluate(()=>({scene:Engine.state.campaign.sceneId,beats:Engine.state.storyBeats.length}));
assert(afterExplore.scene===beforeExplore.scene&&afterExplore.beats===beforeExplore.beats+1,'Free action did not add contextual story without skipping the objective');

await page.evaluate(()=>{ window.__brassreachRandom=Math.random; Math.random=()=>0; });
await page.locator('#choices .choice-btn:not(.choice-merchant)').first().click(); await page.locator('#modalLost:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'07-lost-encounter.png'),fullPage:true}); results.lostCaptured=true;
const goldBeforeReroll=await page.evaluate(()=>Engine.state.character.Gold); await page.evaluate(()=>{ Math.random=()=>.999999; }); await page.locator('[data-lost-action="gold"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='halls-quartermaster');
assert(await page.evaluate(()=>Engine.state.character.Gold)<goldBeforeReroll,'Gold reroll did not charge the player');
await page.evaluate(()=>{ Math.random=window.__brassreachRandom; });
await page.locator('#choices .choice-merchant').click(); await page.locator('#modalMerchant:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'06-merchant.png'),fullPage:true});
const sell=page.locator('[data-sell="Canteen"]:not([disabled])'); assert(await sell.count()===1,'Ordinary item was not sellable'); await sell.click();
assert(!await page.evaluate(()=>Engine.state.character.inventory.includes('Canteen')),'Sale did not remove the item');
const buy=page.locator('[data-buy]:not([disabled])').first(); assert(await buy.count()===1,'Merchant had no affordable item');
const buyName=await buy.getAttribute('data-buy'),goldBeforeBuy=await page.evaluate(()=>Engine.state.character.Gold); await buy.click();
assert(await page.evaluate(name=>Engine.state.character.inventory.includes(name),buyName),'Purchase did not add the item');
assert(await page.evaluate(()=>Engine.state.character.Gold)<goldBeforeBuy,'Purchase did not spend gold');
await page.locator('#xMerchant').click();
await page.locator('#btnCont').click(); await page.waitForFunction(()=>Engine.state.campaign.sceneId==='halls-floodgate');
const itemsBeforeSacrifice=await page.evaluate(()=>[...Engine.state.character.inventory]); await page.evaluate(()=>{ Math.random=()=>0; });
await page.locator('#choices .choice-btn:not(.choice-merchant)').first().click(); await page.locator('#modalLost:not(.hidden)').waitFor(); await page.evaluate(()=>{ Math.random=()=>.999999; }); await page.locator('[data-lost-action="item"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='halls-culvert');
const itemsAfterSacrifice=await page.evaluate(()=>[...Engine.state.character.inventory]); assert(itemsBeforeSacrifice.some(item=>!itemsAfterSacrifice.includes(item)),'Item reroll did not sacrifice an eligible item'); await page.evaluate(()=>{ Math.random=window.__brassreachRandom; });

let steps=2,failures=2;
while(steps<30){
  const state=await page.evaluate(()=>({scene:Engine.state.campaign.sceneId,ending:Engine.state.campaign.ending}));
  if(state.ending) break;
  const action=page.locator('#choices .choice-btn:not(.choice-merchant)').first(); assert(await action.count()===1,`No campaign action at ${state.scene}`);
  await action.click(); await page.waitForTimeout(90); if(await acceptFailureIfShown(page)) failures++; steps++;
}
const campaign=await page.evaluate(()=>({scene:Engine.state.campaign.sceneId,ending:Engine.state.campaign.ending,keys:Engine.state.flags.keys,completedScenes:Engine.state.campaign.completedScenes.length,completedEncounters:Engine.state.campaign.completedEncounters.length,items:Engine.state.character.inventory,journal:Engine.state.journal}));
assert(campaign.ending,'Campaign did not reach an ending'); assert(campaign.keys.length>=2,'Campaign reached the Gate without two Keys'); assert(campaign.completedScenes>=18,'Too few campaign scenes completed');
results.campaign={...campaign,steps,failures};
await page.screenshot({path:path.join(output,'07-epilogue.png'),fullPage:true});
if(await page.locator('#modalEpi:not(.hidden)').count()) await page.locator('#xEpi').click();
await page.keyboard.press('e'); await page.locator('#modalInventory:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'08-inventory-populated.png'),fullPage:true});
await page.keyboard.press('e');

const migrationContext=await browser.newContext({viewport:{width:1280,height:900}});
const migrationPage=await migrationContext.newPage(); observe(migrationPage); await migrationPage.goto(base,{waitUntil:'networkidle'}); await migrationPage.waitForFunction(()=>window.Engine?.state);
await migrationPage.evaluate(()=>{
  const inventory=[...Array.from({length:45},(_,index)=>`Legacy Item ${index+1}`),'Legacy Item 1','',null];
  const legacy={saveVersion:3,turn:9,scene:'Archives',storyBeats:[{text:'Legacy progress remains.'}],transcript:['Legacy progress remains.'],character:{name:'Migration Test',race:'Dwarf',STR:12,DEX:12,INT:12,CHA:12,HP:10,MaxHP:14,Gold:7,inventory},equipment:{head:'Legacy Item 1',mainHand:'Missing Item'},flags:{keys:['Echo']},settings:{typewriter:false,audio:{master:.5,ui:.4,music:.4}}};
  localStorage.setItem('brassreach:dds_state',JSON.stringify(legacy)); localStorage.setItem('brassreach:intro_seen','true');
});
await migrationPage.reload({waitUntil:'networkidle'}); await migrationPage.waitForFunction(()=>Engine.state.saveVersion===4);
const migration=await migrationPage.evaluate(()=>({version:Engine.state.saveVersion,name:Engine.state.character.name,inventory:Engine.state.character.inventory.length,slots:Engine.state.backpack.slots.filter(Boolean).length,overflow:Engine.state.backpack.overflow.length,head:Engine.state.equipment.head,mainHand:Engine.state.equipment.mainHand,scene:Engine.state.campaign.sceneId,keys:Engine.state.flags.keys,story:Engine.state.storyBeats[0]?.text}));
assert(migration.name==='Migration Test','Character did not migrate'); assert(migration.inventory===45,'Legacy or unknown items were lost or duplicated'); assert(migration.slots===40&&migration.overflow===5,'Overflow migration failed'); assert(migration.head===null&&migration.mainHand===null,'Invalid equipment was not normalized'); assert(migration.scene==='archives-lithen','Legacy scene did not map to the authored campaign'); assert(migration.keys.includes('Echo'),'Legacy key was lost'); assert(migration.story==='Legacy progress remains.','Story progress was lost'); results.migration=migration;
await migrationPage.evaluate(()=>{
  const preEquipment={saveVersion:1,turn:2,scene:'Halls',storyBeats:[{text:'An older expedition.'}],transcript:['An older expedition.'],character:{name:'Old Save',race:'Dwarf',STR:11,DEX:10,INT:13,CHA:9,HP:8,Gold:3,inventory:['Torch','Oil Flask']},flags:{seals:['Stone']},settings:{typewriter:false,audio:{master:.4,ui:.3,amb:.2}}};
  localStorage.setItem('brassreach:dds_state',JSON.stringify(preEquipment));
});
await migrationPage.reload({waitUntil:'networkidle'}); await migrationPage.waitForFunction(()=>Engine.state.character.name==='Old Save');
const preEquipment=await migrationPage.evaluate(()=>({version:Engine.state.saveVersion,items:Engine.state.character.inventory,equipment:Object.values(Engine.state.equipment),keys:Engine.state.flags.keys,music:Engine.state.settings.audio.music,maxHP:Engine.state.character.MaxHP,scene:Engine.state.campaign.sceneId}));
assert(preEquipment.version===4&&preEquipment.items.join('|')==='Torch|Oil Flask','Pre-equipment inventory did not migrate'); assert(preEquipment.equipment.every(item=>item===null),'Pre-equipment save did not receive safe empty slots'); assert(preEquipment.keys.includes('Stone'),'Legacy seals did not migrate to Keys'); assert(preEquipment.music===.2,'Legacy ambience preference did not migrate to music'); assert(preEquipment.maxHP===8,'Legacy HP did not normalize to MaxHP'); results.migration={overflow:migration,preEquipment};
await migrationContext.close();

assert(results.consoleErrors.length===0,`Console errors: ${results.consoleErrors.join(' | ')}`);
assert(results.failedLocalRequests.length===0,`Failed local requests: ${results.failedLocalRequests.join(' | ')}`);
await fs.writeFile(path.join(output,'smoke-results.json'),JSON.stringify(results,null,2));
await context.close(); await browser.close();
console.log(JSON.stringify(results,null,2));
