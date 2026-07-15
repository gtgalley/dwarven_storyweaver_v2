import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const playwrightRoot=process.env.PLAYWRIGHT_ROOT;
if(!playwrightRoot) throw new Error('PLAYWRIGHT_ROOT is required');
const {chromium}=await import(pathToFileURL(path.join(playwrightRoot,'index.mjs')).href);

const base=process.env.BRASSREACH_URL||'http://127.0.0.1:4173/';
const output=process.env.BRASSREACH_ARTIFACTS||path.resolve('tests','artifacts','overhaul6');
const executablePath=process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output,{recursive:true});

const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const results={layouts:[],merchant:{},bonuses:{},effects:{},arrivals:{},inventory:{},consoleErrors:[],failedLocalRequests:[]};
const browser=await chromium.launch({headless:true,executablePath});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();
page.on('console',message=>{ if(message.type()==='error') results.consoleErrors.push(message.text()); });
page.on('pageerror',error=>results.consoleErrors.push(error.message));
page.on('requestfailed',request=>{ if(request.url().startsWith(base)) results.failedLocalRequests.push(`${request.url()} — ${request.failure()?.errorText||'failed'}`); });

async function ready(){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.Engine?.state&&document.querySelector('#intro'));
}
async function seedScene(sceneId,{items=[],equipment={},gold=80,story='Test route prepared.'}={}){
  await page.evaluate(({sceneId,items,equipment,gold,story})=>{
    const S=Engine.state;
    S.settings.typewriter=false;
    S.campaign.sceneId=sceneId;
    S.campaign.chapter=sceneId.split('-')[0]==='tutorial'?'tutorial':sceneId.split('-')[0];
    S.scene=sceneId;
    S.campaign.objective='Test objective';
    S.storyBeats=[];
    S.transcript=[];
    S.character.Gold=gold;
    S.character.inventory=[...new Set(['Torch','Canteen','Thread Ledger',...items])];
    S.equipment={head:null,chest:null,hands:null,legs:null,feet:null,mainHand:null,offHand:null,accessory:null,...equipment};
    localStorage.setItem('brassreach:dds_state',JSON.stringify(S));
    localStorage.setItem('brassreach:intro_seen','true');
  },{sceneId,items,equipment,gold,story});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(id=>Engine.state.campaign.sceneId===id&&document.querySelectorAll('#choices .choice-btn').length>0,sceneId);
}

await ready();
await page.evaluate(()=>{ Engine.state.settings.typewriter=false; localStorage.setItem('brassreach:dds_state',JSON.stringify(Engine.state)); localStorage.removeItem('brassreach:intro_seen'); });
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>document.querySelectorAll('#intro .gloss').length>=5);
await page.screenshot({path:path.join(output,'01-intro.png'),fullPage:true});
const introDefinitions=await page.locator('#intro .gloss').evaluateAll(nodes=>nodes.map(node=>node.dataset.def));
assert(introDefinitions.length>=5,`Intro glossary terms are missing (${introDefinitions.length} found)`);
assert(introDefinitions.every(text=>text.length<=150),'An intro glossary definition is too dense');

await page.evaluate(()=>{ Engine.state.settings.typewriter=false; localStorage.setItem('brassreach:dds_state',JSON.stringify(Engine.state)); localStorage.setItem('brassreach:intro_seen','true'); });
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>Engine.state.storyBeats.length>0);
for(const width of [1920,1440,1280,1024]){
  await page.setViewportSize({width,height:1000}); await page.waitForTimeout(60);
  const metric=await page.evaluate(currentWidth=>({width:currentWidth,scrollWidth:document.documentElement.scrollWidth,scene:Engine.state.campaign.sceneId}),width);
  assert(metric.scrollWidth<=width,`Horizontal overflow at ${width}px`); results.layouts.push(metric);
}
await page.setViewportSize({width:1440,height:1000});
await page.screenshot({path:path.join(output,'02-main-opening.png'),fullPage:true});

await seedScene('tutorial-quartermaster',{items:['Surveyor’s Chalk'],gold:100,story:'Dorrin checks the public issue list.'});
await page.locator('[data-choice-id="tutorial-dorrin-shop"]').click();
await page.locator('#modalMerchant:not(.hidden)').waitFor();
await page.locator('[data-buy="Rope Coil"]').click();
const merchantStory=await page.locator('#story').innerText();
assert(merchantStory.includes('You bought the Rope Coil from Quartermaster Dorrin for'),'Purchase prose does not name the purchased item');
assert(!/bought it|sells it/i.test(merchantStory),'Purchase prose uses a vague pronoun');
results.merchant={sentence:merchantStory.split('\n').find(line=>line.includes('You bought the Rope Coil'))};
await page.screenshot({path:path.join(output,'03-merchant-purchase.png'),fullPage:true});
await page.keyboard.press('Escape');

await seedScene('tutorial-salt-hounds',{items:['Foundry Gloves']});
let cartModifier=await page.locator('[data-choice-id="hounds-cart"] small').innerText();
assert(!cartModifier.includes('Equipped: Foundry Gloves'),'Unequipped gloves produced an equipped bonus');
assert(!cartModifier.includes('secure gloves'),'Unequipped gloves produced a hidden situational bonus');
await seedScene('tutorial-salt-hounds',{items:['Foundry Gloves'],equipment:{hands:'Foundry Gloves'}});
cartModifier=await page.locator('[data-choice-id="hounds-cart"] small').innerText();
assert(cartModifier.toLowerCase().includes('equipped: foundry gloves +2'),`Equipped gloves did not produce an explicit bonus: ${cartModifier}`);
results.bonuses={equipped:cartModifier};

await page.keyboard.press('e'); await page.locator('#modalInventory:not(.hidden)').waitFor();
const glove=page.locator('#inventoryItems [data-item="Foundry Gloves"]');
await glove.hover(); await page.locator('#itemTooltip:not(.hidden)').waitFor();
const tooltipText=await page.locator('#itemTooltip').innerText();
assert(tooltipText.includes('Equipped and ready'),'Tooltip does not reflect equipped state');
results.inventory={tooltip:tooltipText.split('\n').slice(0,5)};
await page.screenshot({path:path.join(output,'04-inventory-tooltip.png'),fullPage:true});
await page.keyboard.press('Escape');

await seedScene('tutorial-report',{items:['Surveyor’s Chalk'],story:'Brunna opens the wet field ledger.'});
await page.evaluate(()=>{ Math.random=()=>.999999; });
await page.locator('[data-choice-id="report-precise"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='halls-deep-writ');
const effectText=(await page.locator('#story .effect-summary').allInnerTexts()).join('\n');
assert(effectText.toLowerCase().includes('int +1'),`Attribute gain is not shown clearly: ${effectText}`);
assert(effectText.toLowerCase().includes('evidence recorded'),`Evidence gain is not shown clearly: ${effectText}`);
results.effects={summary:effectText};
await page.screenshot({path:path.join(output,'05-consequence-feedback.png'),fullPage:true});

await seedScene('tutorial-bell-stair',{items:['Rope Coil'],story:'You reach the cracked landing.'});
await page.evaluate(()=>{ Math.random=()=>.999999; });
await page.locator('[data-choice-id="stair-brace"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-tangles');
const successText=await page.locator('#story').innerText();
assert(successText.includes('With the stair-keepers safe'),'Success route did not receive its connective arrival');

await seedScene('tutorial-bell-stair',{items:['Rope Coil'],story:'You reach the cracked landing.'});
await page.evaluate(()=>{ Math.random=()=>0; });
await page.locator('[data-choice-id="stair-brace"]').click();
await page.locator('#modalLost:not(.hidden)').waitFor();
await page.screenshot({path:path.join(output,'06-failure-choice.png'),fullPage:true});
await page.locator('[data-lost-action="accept"]').click();
await page.waitForFunction(()=>Engine.state.campaign.sceneId==='tutorial-tangles');
const failureText=await page.locator('#story').innerText();
assert(failureText.includes('The closed stair forces you down a service lane'),'Failure route did not receive its connective arrival');
assert(failureText.toLowerCase().includes('health -1'),`Health loss is not shown clearly: ${failureText}`);
assert(failureText.toLowerCase().includes('bruised by falling stone'),'Health loss does not name its cause');
results.arrivals={success:true,failure:true};

await seedScene('brassworks-threshold',{items:['Resonance Fork'],story:'The party enters the silent Brassworks.'});
const sellaText=await page.locator('body').innerText();
assert(sellaText.includes('Sella Flintwake'),'Sella is not named consistently in the Brassworks');
assert(!/\bSelka\b/.test(sellaText),'Selka remains in the rendered Brassworks');
await page.screenshot({path:path.join(output,'07-sella-brassworks.png'),fullPage:true});

await seedScene('gate-counter',{items:['Echo Key','Stone Key','Brass Key'],story:'The final witnesses seal the ledger.'});
const gateText=await page.locator('#story').innerText();
assert(gateText.includes('The Counter is not a judge, and it does not speak.'),'Counter explanation lost its literal framing');
await page.screenshot({path:path.join(output,'08-gate-counter.png'),fullPage:true});

assert(results.consoleErrors.length===0,`Console errors: ${results.consoleErrors.join(' | ')}`);
assert(results.failedLocalRequests.length===0,`Failed local requests: ${results.failedLocalRequests.join(' | ')}`);
await browser.close();
console.log(JSON.stringify(results,null,2));
