import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CAMPAIGN_CHAPTERS,CAMPAIGN_SCENES,MERCHANTS} from '../public/js/campaign.js';

const workbookPath=new URL('../docs/BRASSREACH_AUTHOR_REWRITE_WORKBOOK.md',import.meta.url);
const workbook=fs.readFileSync(workbookPath,'utf8');
const engine=fs.readFileSync(new URL('../public/js/engine.js',import.meta.url),'utf8');
const campaignSource=fs.readFileSync(new URL('../public/js/campaign.js',import.meta.url),'utf8');
const blocks=[];
const pattern=/^\*\*[^\r\n]+\*\*\s*\r?\n(?:\r?\n)?Text ID: `([^`]+)`.*?```text\r?\n(.*?)\r?\n```/gms;
for(const match of workbook.matchAll(pattern)){
  const line=workbook.slice(0,match.index).split('\n').length;
  blocks.push({id:match[1],text:match[2],line});
}
const byId=new Map(blocks.map(block=>[block.id,block]));
const clean=value=>String(value??'').replace(/\r\n/g,'\n').replace(/[ \t]+$/gm,'').trim();
const visible=value=>clean(value).replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

const allChoices=Object.values(CAMPAIGN_SCENES).flatMap(scene=>scene.choices||[]);
const choiceById=new Map(allChoices.map(choice=>[choice.id,choice]));
function runtimeValue(id){
  const parts=id.split(':');
  if(parts[0]==='chapter') return CAMPAIGN_CHAPTERS[parts[1]]?.[parts[2]==='title'?'label':parts[2]];
  if(parts[0]==='merchant') return MERCHANTS[parts[1]]?.[parts[2]];
  if(parts[0]==='scene'){
    const scene=CAMPAIGN_SCENES[parts[1]];
    if(parts[2]==='title'||parts[2]==='objective'||parts[2]==='story') return scene?.[parts[2]];
    const path=parts.slice(2).filter((part,index,array)=>!(part==='enter'&&index>0&&array[index-1]==='enter'));
    return path.reduce((value,key)=>value?.[key],scene);
  }
  if(parts[0]==='choice'){
    const choice=choiceById.get(parts[1]);
    if(parts[2]==='label'||parts[2]==='outcome') return choice?.[parts[2]];
    const path=parts.slice(2).filter((part,index,array)=>!(part==='effects'&&index>0&&array[index-1]==='effects'));
    return path.reduce((value,key)=>value?.[key],choice);
  }
  return undefined;
}

const approved=blocks.filter(block=>block.line<=571||block.id==='merchant:dorrin:greeting');
const campaignApproved=approved.filter(block=>/^(?:chapter|scene|choice|merchant):/.test(block.id));
for(const block of campaignApproved){
  let expected=block.text;
  if(block.id==='scene:tutorial-bell-stair:story') expected=expected.replace(/ \(ADD A GLOSSARY DEFINITION AND HIGHLIGHTABLE TEXT FOR LANTERN CONSTABLES USING THE SAME LOGIC AS THE INTRO SLIDE MODALS!!!\)/,'');
  assert.equal(clean(runtimeValue(block.id)),clean(expected),`Approved workbook text is not installed exactly: ${block.id}`);
}

const introHTML=engine.match(/function getIntroSlidesHTML\(\)\{\s*return `([\s\S]*?)`;\s*\}/)?.[1]||'';
const fieldBriefHTML=engine.match(/function getIntroScrollHTML\(\)\{\s*return `([\s\S]*?)`;\s*\}/)?.[1]||'';
const introVisible=visible(introHTML);
const fieldBriefVisible=visible(fieldBriefHTML);
for(const block of approved.filter(block=>/^intro:slide-\d+:paragraph-/.test(block.id))) assert(introVisible.includes(visible(block.text)),`Approved intro paragraph is missing: ${block.id}`);
for(const block of approved.filter(block=>/^intro:field-brief:/.test(block.id))) assert(fieldBriefVisible.includes(visible(block.text)),`Approved field-brief text is missing: ${block.id}`);
for(const block of approved.filter(block=>/^intro:slide-\d+:glossary:/.test(block.id))) assert(engine.includes(clean(block.text)),`Approved intro glossary definition is missing: ${block.id}`);

const firstExcluded=byId.get('choice:stair-brace:success');
assert(firstExcluded&&firstExcluded.line>571,'Workbook cutoff fixture moved unexpectedly');
assert.notEqual(clean(runtimeValue(firstExcluded.id)),clean(firstExcluded.text),'Text beyond the approved cutoff was installed');
assert.equal(clean(MERCHANTS.dorrin.greeting),clean(byId.get('merchant:dorrin:greeting').text),'Dorrin merchant exception was not installed');
assert(!engine.includes('ADD A GLOSSARY DEFINITION')&&!campaignSource.includes('ADD A GLOSSARY DEFINITION'),'Author note leaked into runtime source');
assert.match(engine,/Lantern Constables[\s\S]*class="gloss"|class="gloss"[\s\S]*Lantern Constables/,'Lantern Constables lacks runtime glossary markup');

console.log(JSON.stringify({approvedBlocks:approved.length,campaignBlocks:campaignApproved.length,introParagraphs:approved.filter(block=>/:paragraph-/.test(block.id)).length,fieldBriefBlocks:approved.filter(block=>/^intro:field-brief:/.test(block.id)).length,cutoff:571,merchantException:true},null,2));
