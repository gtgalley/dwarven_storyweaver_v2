// Play the shipped choices from a fresh save. No scene or route flags are seeded.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(path.join(process.env.PLAYWRIGHT_ROOT,'index.mjs')));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const dir=path.resolve('tests/artifacts/whole-campaign'),errors=[];
await fs.mkdir(dir,{recursive:true});
const preferred='tutorial-question tutorial-dorrin-rope stair-gallery piera-cellar cellar-hatch hounds-lure relief-balance report-precise deep-writ-workers map-layers comptroller-chain archives-follow well-pattern lithen-city register-lens echo-full-record echo-copy orra-status platform-counterload stone-calculate stone-send-word cistern-pump works-hear-sella sella-anchor choir-plan anchor-retune crawler-signal whole-floor-hold gate-weight-public gate-tone-coherent gate-pattern-full'.split(' ');
const runs=[
  ['concord','orra-reinforce','pump-homes','brass-relief'],
  ['banish','orra-evacuate','ward-stair','brass-gate'],
  ['channel','orra-evacuate','ward-search','brass-hose'],
  ['bind','orra-reinforce','pump-stair','brass-relief'],
  ['hold','orra-evacuate','ward-search','brass-message']
];
try{
 for(const [ending,assignment,job,follow] of runs){
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  try{
   const page=await context.newPage(); page.setDefaultTimeout(7000);
   page.on('pageerror',err=>errors.push(err.message));
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
   await page.goto(process.env.BRASSREACH_URL+'?playtest=whole-campaign');
   await page.locator('[data-choice-id="tutorial-accept"]').waitFor();
   const configure=()=>page.evaluate(()=>{Engine.state.settings.typewriter=false; Math.random=()=>.99;});
   await configure();
   if(ending==='concord'){
    await page.click('#btnEdit');
    for(const race of ['Dwarf','Human','Elf','Gnome','Halfling','Orc']){
     await page.selectOption('#edRace',race);
     for(const form of ['male','female']){await page.selectOption('#edPortrait',form);assert(await page.locator('#editorPortrait').evaluate(e=>e.style.backgroundPosition&&getComputedStyle(e).backgroundImage.includes('field-portraits')));}
    }
    await page.selectOption('#edRace','Elf');await page.selectOption('#edPortrait','male');await page.click('#btnEditSave');
    await page.reload();await page.locator('[data-choice-id="tutorial-accept"]').waitFor();await configure();
    assert.deepEqual(await page.evaluate(()=>[Engine.state.character.race,Engine.state.character.portrait]),['Elf','male']);
   }
   const visited=[];let failures=0;
   for(let i=0;i<46;i++){
    const scene=await page.evaluate(()=>Engine.state.campaign.sceneId); visited.push(scene);
    const ids=await page.locator('[data-choice-id]:enabled').evaluateAll(ns=>ns.map(n=>n.dataset.choiceId));
    if(scene==='tutorial-quartermaster'){
     assert.match(await page.locator('#story').innerText(),/brass plates? to your ear|brass plates? against your ear/i);
    }
    if(scene==='depths-foundation'){
     await page.reload();await page.locator('[data-choice-id="stone-strip"]').waitFor();await configure();
     assert(await page.evaluate(route=>!!Engine.state.campaign.flags[route],assignment==='orra-reinforce'?'worksFirst':'wardFirst'));
    }
    if(scene==='brassworks-brass-key') assert(!ids.includes(assignment==='orra-reinforce'?'brass-hose':'brass-relief'));
    if(ending==='bind'&&scene==='brassworks-sella'){
     await page.click('[data-choice-id="sella-shop"]');await page.click('[data-buy="Foundry Gloves"]');await page.click('#xMerchant');
    }
    if(ending==='bind'&&scene==='brassworks-anchor'){
     assert(!ids.includes('anchor-gloves'),'Carrying gloves is not wearing them');
     await page.keyboard.press('e');await page.locator('#inventoryItems [data-item="Foundry Gloves"]').dblclick();await page.keyboard.press('Escape');
     await page.locator('[data-choice-id="anchor-gloves"]').waitFor();ids.push('anchor-gloves');
     assert.equal(await page.locator('.field-pin[title*="Foundry Gloves"]').count(),1);
    }
    if(ending==='concord'&&['archives-record-well','depths-platform','choice-contact'].includes(scene)){
     const view=page.locator('.field-view');await view.locator('summary').click();
     await page.waitForFunction(()=>document.querySelector('.field-view img')?.naturalWidth>0);
     if(scene==='archives-record-well')await page.waitForFunction(()=>Engine.getAudioDebug().currentName==='archives');
     if(scene==='choice-contact')assert.equal(await page.evaluate(()=>Engine.getAudioDebug().currentName),null);
     await page.screenshot({path:path.join(dir,scene+'.png')});await view.locator('summary').click();
    }
    const ranked=[...(ending==='banish'?['tutorial-dorrin-ready','stair-brace','piera-residents']:[]),...(ending==='bind'?['anchor-gloves']:[]),assignment,job,follow,'ending-'+ending,...preferred];
    const id=ranked.find(id=>ids.includes(id))||ids.find(id=>!id.endsWith('-shop'));
    assert(id,'No playable choice at '+scene);
    if(ending==='banish'&&['tutorial-bell-stair','depths-lower-watch'].includes(scene))await page.evaluate(()=>{Math.random=()=>0;});
    await page.locator('[data-choice-id="'+id+'"]').click();
    const accept=page.locator('[data-lost-action="accept"]');if(await accept.isVisible()){await accept.click();failures++;}
    await configure();
    if(scene==='choice-decision')break;
    await page.waitForFunction(old=>Engine.state.campaign.sceneId!==old,scene);
   }
   const state=await page.evaluate(()=>({end:Engine.state.campaign.ending,keys:Engine.state.flags.keys,transcript:Engine.state.transcript.join('\n\n')}));
   assert.equal(state.end.id,ending);assert.deepEqual([...state.keys].sort(),['Brass','Echo','Stone']);
   assert(visited.includes(assignment==='orra-reinforce'?'depths-reserve-pump':'depths-door-list'));
   if(ending==='banish'){assert(failures>=1);assert.equal(state.end.quality,'strained');assert.match(state.end.text,/lower homes remain closed/);}
   if(['concord','channel'].includes(ending)){assert.equal(state.end.quality,'strong');assert.match(state.end.text,/All six households are accounted for/);assert.match(state.end.text,/reserve pump is drawing water out/);}
   if(job==='pump-stair')assert.match(state.end.text,/escape stair is dry/);
   await fs.writeFile(path.join(dir,ending+'.txt'),state.transcript);await page.reload();
   await page.waitForFunction(()=>!!window.Engine?.state?.campaign?.ending);
   assert.equal(await page.evaluate(()=>Engine.state.campaign.ending.text),state.end.text);
   assert.equal(await page.locator('[data-choice-id]').count(),0);
   console.log('PASS',ending,state.end.quality,visited.length+' scenes',failures+' accepted failures');
  }finally{await context.close();}
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
