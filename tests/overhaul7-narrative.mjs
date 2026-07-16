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

assert.equal(scenes.length,36,'The authored campaign scene count changed unexpectedly');
assert.equal(choices.length,85,'The authored campaign choice count changed unexpectedly');
assert(checks.some(({choice})=>choice.id==='platform-rigging'&&choice.stat==='DEX'),'The Ninth Platform lacks its rigging solution');

for(const scene of scenes){
  assert(scene.story.length>=1000,`${scene.id} is too abbreviated for the atmospheric campaign (${scene.story.length} characters)`);
  assert(scene.story.split(/\n\s*\n/).length>=3,`${scene.id} does not have a complete multi-paragraph scene arc`);
  assert(scene.objective&&scene.objective.length>=12,`${scene.id} lacks a clear objective`);
}

for(const outcome of outcomes){
  assert.equal(typeof outcome.text,'string',`${outcome.scene}/${outcome.choice} has no ${outcome.kind} narrative`);
  assert(outcome.text.length>=300,`${outcome.scene}/${outcome.choice} has an abbreviated ${outcome.kind} narrative (${outcome.text.length} characters)`);
}

for(const [id,ending] of Object.entries(ENDINGS)){
  assert(ending.address.length>=500,`${id} lacks a developed player address`);
  assert(ending.strong.length>=500,`${id} lacks a developed strong resolution`);
  assert(ending.strained.length>=500,`${id} lacks a developed strained resolution`);
  assert(ending.address.split(/\n\s*\n/).length>=2,`${id} address is not staged in readable paragraphs`);
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
