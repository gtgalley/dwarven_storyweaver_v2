import {CAMPAIGN_VERSION,CAMPAIGN_CHAPTERS,CAMPAIGN_SCENES,ENDINGS} from '../public/js/campaign.js';

const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const scenes=Object.values(CAMPAIGN_SCENES);
const ids=new Set(Object.keys(CAMPAIGN_SCENES));
const choiceIds=new Set();

assert(CAMPAIGN_VERSION===2,'Unexpected campaign schema version');
assert(ids.has('tutorial-commission'),'Missing campaign start');
assert(scenes.length>=34,`Campaign is too short: ${scenes.length} scenes`);
assert(Object.keys(CAMPAIGN_CHAPTERS).length===7,'Campaign must contain seven acts');
assert(Object.keys(ENDINGS).sort().join('|')==='banish|bind|channel|concord|hold','Ending set does not match canon');

for(const scene of scenes){
  assert(scene.id&&scene.title&&scene.chapter&&scene.objective&&scene.story,`Incomplete scene data: ${scene.id||'unknown'}`);
  assert(scene.story.length>=180,`Scene is too slight to carry its story beat: ${scene.id}`);
  assert(Array.isArray(scene.choices)&&scene.choices.length>0,`Scene has no choices: ${scene.id}`);
  assert(CAMPAIGN_CHAPTERS[scene.chapter],`Unknown chapter on ${scene.id}`);
  for(const choice of scene.choices){
    assert(!choiceIds.has(choice.id),`Duplicate choice id: ${choice.id}`); choiceIds.add(choice.id);
    assert(choice.label&&choice.type,`Incomplete choice in ${scene.id}`);
    for(const next of [choice.next,choice.nextSuccess,choice.nextFail].filter(Boolean)) assert(ids.has(next),`Broken edge ${scene.id} -> ${next}`);
    if(choice.type==='check'){
      assert(['STR','DEX','INT','CHA'].includes(choice.stat),`Invalid stat on ${choice.id}`);
      assert(Number.isInteger(choice.dc)&&choice.dc>=8&&choice.dc<=18,`Invalid DC on ${choice.id}`);
      assert(choice.success&&choice.failure,`Check lacks fail-forward prose: ${choice.id}`);
    }
    if(choice.type==='ending'){
      assert(!('dc' in choice),`Final living Choice must not use a random roll: ${choice.id}`);
      assert(ENDINGS[choice.ending],`Unknown ending on ${choice.id}`);
    }
  }
}

const reached=new Set(),queue=['tutorial-commission'];
while(queue.length){
  const id=queue.shift(); if(reached.has(id)) continue; reached.add(id);
  for(const choice of CAMPAIGN_SCENES[id].choices){
    for(const next of [choice.next,choice.nextSuccess,choice.nextFail].filter(Boolean)) if(!reached.has(next)) queue.push(next);
  }
}
assert(reached.size===scenes.length,`Unreachable scenes: ${[...ids].filter(id=>!reached.has(id)).join(', ')}`);

const visibleText=scenes.map(scene=>[scene.id,scene.title,scene.objective,scene.story,...scene.choices.flatMap(choice=>[choice.label,choice.success,choice.failure,choice.outcome])].filter(Boolean).join(' '));
const forbidden=[/Fourth Measure/i,/Line Measure/i,/stolen (?:record|register|covenant)/i,/Gate (?:was|is) built to (?:bind|imprison|control)/i,/Unfathomer.{0,45}(?:says|said|asks|asked|speaks|spoke|whispers|replies)/i];
for(const [id,...parts] of visibleText){
  const text=parts.join(' ');
  for(const pattern of forbidden) assert(!pattern.test(text),`Superseded lore in ${id}: ${pattern}`);
}

const beforeNaming=scenes.filter(scene=>['tutorial','halls'].includes(scene.chapter)||['archives-entry','archives-record-well'].includes(scene.id));
for(const scene of beforeNaming){
  const text=[scene.story,...scene.choices.flatMap(choice=>[choice.label,choice.success,choice.failure,choice.outcome])].filter(Boolean).join(' ');
  assert(!/\bUnfathomer\b/i.test(text),`The Unfathomer is named too early in ${scene.id}`);
}

const keyScenes={Echo:'archives-echo-key',Stone:'depths-stone-key',Brass:'brassworks-brass-key'};
for(const [key,id] of Object.entries(keyScenes)) assert(CAMPAIGN_SCENES[id].enter?.key===key,`${key} Key is not institutionally awarded in ${id}`);

console.log(JSON.stringify({campaignVersion:CAMPAIGN_VERSION,scenes:scenes.length,choices:choiceIds.size,reachable:reached.size,endings:Object.keys(ENDINGS)},null,2));
