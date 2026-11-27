import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CAMPAIGN_SCENES,ENDINGS} from '../public/js/campaign.js';

const scenes=Object.values(CAMPAIGN_SCENES);
const choices=scenes.flatMap(scene=>(scene.choices||[]).map(choice=>({scene,choice})));
const checks=choices.filter(({choice})=>choice.type==='check');
const outcomes=checks.flatMap(({scene,choice})=>[
  {scene:scene.id,choice:choice.id,kind:'success',text:choice.success},
  {scene:scene.id,choice:choice.id,kind:'failure',text:choice.failure}
]);

assert.equal(scenes.length,39,'Check the route inventory when adding scenes');
assert.equal(choices.length,98,'Check the route inventory when adding choices');
for(const [order,station] of [['orra-reinforce','depths-reserve-pump'],['orra-evacuate','depths-door-list']]){
  const choice=CAMPAIGN_SCENES['depths-lower-watch'].choices.find(c=>c.id===order);
  assert.equal(choice.nextSuccess,station); assert.equal(choice.nextFail,station);
}
assert(checks.some(({choice})=>choice.id==='platform-rigging'&&choice.stat==='DEX'),'The Ninth Platform lacks its rigging solution');

for(const scene of scenes){
  assert(scene.story.trim() && scene.choices.length,`${scene.id} lacks a playable passage`);
  assert(scene.objective&&scene.objective.length>=12,`${scene.id} lacks a clear objective`);
}

for(const outcome of outcomes){
  assert.equal(typeof outcome.text,'string',`${outcome.scene}/${outcome.choice} has no ${outcome.kind} narrative`);
  assert(outcome.text.trim(),`${outcome.scene}/${outcome.choice} has no visible outcome`);
}

for(const [id,ending] of Object.entries(ENDINGS)){
  assert(ending.address.trim()&&ending.strong.trim()&&ending.strained.trim(),`${id} lacks an address or outcome`);
  assert.notEqual(ending.strong,ending.strained,`${id} preparation makes no difference`);
}

const campaignText=[
  ...scenes.flatMap(scene=>[scene.story,...(scene.choices||[]).flatMap(choice=>[choice.success,choice.failure,choice.outcome].filter(Boolean))]),
  ...Object.values(ENDINGS).flatMap(ending=>[ending.address,ending.strong,ending.strained])
].join('\n');

assert.match(CAMPAIGN_SCENES['tutorial-commission'].story,/Threadbearer Institute/,'The player is not established as a newly graduated Threadbearer');
assert.match(CAMPAIGN_SCENES['archives-record-well'].story,/needle and thread/,'The physical origin of Threadbearing records is missing');
assert.match(CAMPAIGN_SCENES['archives-lithen'].story,/For now, I call it the Unfathomer/,'Lithen does not coin the term from evidence');
assert.doesNotMatch(scenes.slice(0,11).map(scene=>scene.story).join('\n'),/Unfathomer/,'The public-facing early campaign names the Unfathomer before Lithen');
assert.doesNotMatch(campaignText,/Unfathomer\s+(?:said|says|spoke|speaks|whispered|whispers|commanded|commands)/i,'The Unfathomer is given complex speech');
assert.match(CAMPAIGN_SCENES['choice-contact'].story,/No face waits in the water\. No hidden voice explains/,'The final contact lacks explicit nonverbal framing');
assert.match(CAMPAIGN_SCENES['gate-counter'].story,/cannot be restored tonight/i,'The Gate overpromises an immediate cure');

const docs=fs.readFileSync(new URL('../docs/BRASSREACH_MASTER_LORE_BIBLE.md',import.meta.url),'utf8');
assert.match(docs,/Threadbearer Institute/,'The master lore bible does not establish the Threadbearer Institute');
assert.match(docs,/needle and thread/i,'The master lore bible does not preserve the woven-record origin');
assert.match(docs,/Halvek/,'The master lore bible does not retain the current Works Comptroller');
assert.match(docs,/Sella/,'The master lore bible does not retain Sella’s Brassworks role');

console.log(JSON.stringify({
  scenes:scenes.length,
  choices:choices.length,
  checks:checks.length,
  outcomes:outcomes.length,
  shortestScene:Math.min(...scenes.map(scene=>scene.story.length)),
  shortestOutcome:Math.min(...outcomes.map(outcome=>outcome.text.length)),
  endings:Object.keys(ENDINGS)
},null,2));
