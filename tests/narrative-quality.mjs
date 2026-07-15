import fs from 'node:fs/promises';
import {CAMPAIGN_SCENES,MERCHANTS,ENDINGS} from '../public/js/campaign.js';

const assert=(condition,message)=>{ if(!condition) throw new Error(message); };
const engine=await fs.readFile(new URL('../public/js/engine.js',import.meta.url),'utf8');
const campaign=await fs.readFile(new URL('../public/js/campaign.js',import.meta.url),'utf8');
const scenes=Object.values(CAMPAIGN_SCENES);

assert(!/\bSelka\b/.test(`${campaign}\n${engine}`),'Selka remains in player-facing source; use Sella');
assert(!/\b(?:bought|sold) it\b|sells it to you/i.test(engine),'Merchant copy still hides the item name');
assert(engine.includes('You bought the ${name} from ${Engine.activeMerchant.name} for ${price} gold.'),'Purchase sentence does not name item, merchant, and price');
assert(engine.includes('You sold the ${name} to ${Engine.activeMerchant.name} for ${price} gold.'),'Sale sentence does not name item, merchant, and price');
assert(!/equipment power/i.test(campaign),'Ambiguous equipment-power label remains');

const itemNames=new Set([...engine.matchAll(/defineItem\('[^']+','([^']+)'/g)].map(match=>match[1]));
assert(itemNames.size>=25,`Item catalog could not be inspected (${itemNames.size} names found)`);
const itemReferences=[];
let equippedBonuses=0;
let ownedBonuses=0;
let injuryEffects=0;

for(const scene of scenes){
  assert(scene.story.split(/\n\n+/).every(paragraph=>paragraph.trim().length>0),`Empty narrative paragraph in ${scene.id}`);
  for(const choice of scene.choices){
    assert(choice.label.length<=180,`Choice label is too dense in ${choice.id}`);
    assert(!/[.!?]\s+[A-Z]/.test(choice.label.replace(/\([A-Z]{3}\)$/,'')),`Choice contains multiple commands instead of one integrated action: ${choice.id}`);
    if(choice.type==='check'){
      for(const bonus of choice.bonuses||[]){
        for(const key of ['item','equipped']) if(bonus[key]) itemReferences.push([bonus[key],`${choice.id}.${key}`]);
        for(const key of ['owned','ownedAny','equippedAny']) for(const item of bonus[key]||[]) itemReferences.push([item,`${choice.id}.${key}`]);
        if(bonus.equipped||bonus.equippedAny) equippedBonuses++;
        if(bonus.item||bonus.owned||bonus.ownedAny) ownedBonuses++;
      }
      for(const result of [choice.effects?.success,choice.effects?.failure]){
        if(result?.item?.name) itemReferences.push([result.item.name,`${choice.id}.reward`]);
        if((result?.hp||0)<0){ injuryEffects++; assert(result.hpReason,`Health loss has no visible reason in ${choice.id}`); }
      }
    }
    if(choice.effects?.item?.name) itemReferences.push([choice.effects.item.name,`${choice.id}.reward`]);
  }
  if(scene.enter?.item?.name) itemReferences.push([scene.enter.item.name,`${scene.id}.enter`]);
}

for(const [item,source] of itemReferences) assert(itemNames.has(item),`Unknown item reference ${item} at ${source}`);
assert(equippedBonuses>=6,`Too few checks react to equipped gear (${equippedBonuses})`);
assert(ownedBonuses>=20,`Too few checks react to owned tools or quest items (${ownedBonuses})`);
assert(injuryEffects>=10,`Too few explicit injury outcomes found (${injuryEffects})`);

const reactiveScenes=scenes.filter(scene=>{
  const keys=Object.keys(scene.arrivals||{});
  return keys.some(key=>key.endsWith(':success'))&&keys.some(key=>key.endsWith(':failure'));
});
assert(reactiveScenes.length>=5,`Too few scenes acknowledge prior success and failure (${reactiveScenes.length})`);

const dialogueScenes=['tutorial-commission','tutorial-quartermaster','tutorial-tangles','halls-deep-writ','halls-comptroller','archives-entry','archives-lithen','depths-descent','depths-lower-watch','brassworks-threshold','brassworks-sella','brassworks-choir','gate-tone'];
for(const id of dialogueScenes) assert(/[“”]/.test(CAMPAIGN_SCENES[id]?.story||''),`Key character scene lacks direct dialogue: ${id}`);

assert(MERCHANTS.sella?.name.startsWith('Sella '),'Sella merchant identity is inconsistent');
assert(Object.keys(ENDINGS).length===5,'Ending count changed during prose edit');

const glossaryDefinitions=[...engine.matchAll(/data-def="([^"]+)"/g)].map(match=>match[1]);
assert(glossaryDefinitions.length>=5,'Intro glossary definitions were lost');
for(const definition of glossaryDefinitions) assert(definition.length<=150,`Intro glossary definition is too dense: ${definition}`);

assert(/bonus\.equipped|bonus\.equippedAny/.test(engine),'Engine does not calculate equipped-item bonuses');
assert(/Owned:/.test(engine)&&/Equipped:/.test(engine),'Bonus labels do not distinguish owned from equipped items');
assert(!/bonus\.item[\s\S]{0,180}\+\s*1/.test(engine),'Owned-item bonus appears to contain a hidden equipped bonus');

console.log(JSON.stringify({
  scenes:scenes.length,
  items:itemNames.size,
  itemReferences:itemReferences.length,
  ownedBonuses,
  equippedBonuses,
  injuryEffects,
  reactiveScenes:reactiveScenes.map(scene=>scene.id),
  dialogueScenes:dialogueScenes.length,
  glossaryDefinitions:glossaryDefinitions.length
},null,2));
