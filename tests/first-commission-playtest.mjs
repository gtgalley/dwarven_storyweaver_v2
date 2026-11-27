import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const {chromium}=await import(pathToFileURL(path.join(process.env.PLAYWRIGHT_ROOT,'index.mjs')).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const base=process.env.BRASSREACH_URL||'http://127.0.0.1:4173/';
const dir=path.resolve('tests/artifacts/first-commission');
await fs.mkdir(dir,{recursive:true});
const errors=[];
async function run(name,fn){
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  try{
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
    page.on('response',r=>{if(r.url().startsWith(base) && r.status()>=400) errors.push(r.url());});
    await page.addInitScript(()=>{
      // A pilot must neither read nor overwrite an existing normal or legacy run.
      if(!localStorage.getItem('brassreach:dds_state')) localStorage.setItem('brassreach:dds_state','{"normal":"untouched"}');
      if(!localStorage.getItem('dds_state')) localStorage.setItem('dds_state','{"legacy":"untouched"}');
      window.bellNotes=[];
      const start=OscillatorNode.prototype.start;
      OscillatorNode.prototype.start=function(...args){window.bellNotes.push([this.frequency.value,...args]);return start.apply(this,args);};
    });
    await page.goto(base+'?playtest=first-commission');
    const pick=id=>page.locator('[data-choice-id="'+id+'"]');
    await pick('tutorial-accept').waitFor();
    await page.evaluate(()=>{Engine.state.settings.typewriter=false;});
    const at=async id=>page.waitForFunction(id=>Engine.state.campaign.sceneId===id,id);
    const click=async id=>pick(id).click();
    await fn({page,click,at,pick});
    assert.equal(await page.evaluate(()=>Engine.state.campaign.sceneId),'tutorial-salt-hounds');
    assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('brassreach:dds_state'),localStorage.getItem('dds_state')]),['{"normal":"untouched"}','{"legacy":"untouched"}']);
    await fs.writeFile(path.join(dir,name+'.txt'),await page.evaluate(()=>Engine.state.transcript.join('\n\n')));
    console.log('PASS',name);
  }finally{await context.close();}
}
try{
  await run('rope-and-cellar',async({page,click,pick,at})=>{
    await click('tutorial-people'); await click('tutorial-dorrin-rope'); await at('tutorial-bell-stair');
    const notes=await page.evaluate(()=>bellNotes.filter(n=>n[0]===294 || n[0]===112));
    assert.equal(notes.length,3); assert(notes[1][1]-notes[0][1]>.9);
    await click('stair-gallery'); await at('tutorial-tangles'); assert.equal(await pick('piera-pipe').count(),0);
    await page.reload(); await click('piera-cellar'); await at('tutorial-dye-cellar');
    assert(await page.evaluate(()=>Engine.state.character.inventory.includes('Rope Coil')));
    await page.screenshot({path:path.join(dir,'cellar.png')});
    await page.reload(); await click('cellar-hatch');
  });
  await run('hood-and-pipe',async({page,click,pick,at})=>{
    await click('tutorial-question'); await click('tutorial-dorrin-ready'); await at('tutorial-bell-stair');
    assert.equal(await pick('stair-gallery').count(),0);
    assert.doesNotMatch(await pick('stair-listen').innerText(),/Equipped:/i);
    await page.waitForFunction(()=>{const s=document.querySelector('#story'),g=s.querySelector('.latest');return Math.abs(g.getBoundingClientRect().top-s.getBoundingClientRect().top-18)<25;});
    const before=await page.locator('#story').evaluate(s=>s.scrollTop);
    await page.keyboard.press('e');
    const hood=page.locator('#inventoryItems [data-item="Surveyor Hood"]');
    await hood.dblclick(); await page.keyboard.press('Escape');
    assert.match(await pick('stair-listen').innerText(),/Equipped: Surveyor Hood \+2/i);
    assert(Math.abs(await page.locator('#story').evaluate(s=>s.scrollTop)-before)<30,'Equipping moved the reader away from the stair');
    await page.screenshot({path:path.join(dir,'stair.png')});
    // Default DEX 14 (+2): a six plus the worn hood just reaches DC 10.
    await page.evaluate(()=>{Math.random=()=>.26;});
    await click('stair-listen'); await at('tutorial-tangles');
    assert.match(await page.locator('#story').textContent(),/Through the hood you hear two knocks/);
    assert.equal(await pick('piera-cellar').count(),0);
    await page.reload(); await click('piera-pipe');
  });
  await run('injury-and-households',async({page,click,pick,at})=>{
    await click('tutorial-accept');
    await page.evaluate(()=>{Engine.state.settings.audio.sfx_story=false;});
    await click('tutorial-dorrin-ready'); await at('tutorial-bell-stair');
    assert.equal(await page.evaluate(()=>bellNotes.filter(n=>n[0]===294).length),0);
    const hp=await page.evaluate(()=>Engine.state.character.HP);
    await page.evaluate(()=>{Math.random=()=>0;});
    await click('stair-brace'); await page.locator('[data-lost-action="accept"]').click(); await at('tutorial-tangles');
    assert.equal(await page.evaluate(()=>Engine.state.character.HP),hp-1);
    assert.equal(await pick('piera-cellar').count(),0); assert.equal(await pick('piera-pipe').count(),0);
    await page.evaluate(()=>{Math.random=()=>.99;});
    await click('piera-residents');
  });
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
