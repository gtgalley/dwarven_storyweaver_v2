// Brassreach browser game engine
// v20 — Visual & RPG Overhaul #3: fixed backpack, quality and relic data,
// equipment comparison, clearer prose, and expanded accessibility feedback.

import { makeWeaver } from './weaver.js';
import { CAMPAIGN_VERSION, CAMPAIGN_CHAPTERS, CAMPAIGN_SCENES, MERCHANTS, ENDINGS } from './campaign.js';

/* ---------- utils ---------- */
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const modFrom=(s)=>Math.floor((s-10)/2);
const pick=a=>a[rnd(0,a.length-1)];
const jitter=(f,amt=0.10)=>f*(1+ (Math.random()*2-1)*amt);
const STORAGE_PREFIX='brassreach:';
const PROJECT_STORAGE_KEYS=['dds_state','intro_seen','dm_on','dm_ep'];
const store={
  get(k,d){
    try{
      const current=localStorage.getItem(STORAGE_PREFIX+k);
      if(current!==null) return JSON.parse(current);

      // One-time compatibility read for saves created before keys were namespaced.
      const legacy=localStorage.getItem(k);
      if(legacy===null) return d;
      const value=JSON.parse(legacy);
      this.set(k,value);
      return value;
    }catch{return d}
  },
  set(k,v){try{localStorage.setItem(STORAGE_PREFIX+k,JSON.stringify(v))}catch{}},
  del(k){
    try{
      localStorage.removeItem(STORAGE_PREFIX+k);
      localStorage.removeItem(k);
    }catch{}
  },
  clearProject(){ PROJECT_STORAGE_KEYS.forEach(k=>this.del(k)); }
};

/* ---------- inventory & equipment ---------- */
const SAVE_VERSION=4;
const BACKPACK_CAPACITY=40;
const EQUIPMENT_SLOTS = [
  ['head','Head'], ['chest','Chest'], ['hands','Hands'], ['legs','Legs'],
  ['feet','Feet'], ['mainHand','Main Hand'], ['offHand','Off Hand'], ['accessory','Accessory']
];
const QUALITY_ORDER=['common','fine','rare','flawless','legendary'];
const QUALITY_LABEL={common:'Common',fine:'Fine',rare:'Rare',flawless:'Flawless',legendary:'Legendary'};
const defineItem=(id,name,slot,glyph,category,quality,stats,requirements,value,mechanic,lore,relic=false)=>({id,name,slot,glyph,category,kind:category,quality,relic,stats,requirements,value,mechanic,lore});
const ITEM_CATALOG = new Map([
  ['torch',defineItem('tool-torch','Torch','offHand','\u2736','Tool','common',{power:0,armor:0,resilience:1},{},3,'Lights dark passages and keeps one hand occupied.','A pitch-wrapped torch made for the damp air below Brassreach.')],
  ['canteen',defineItem('provision-canteen','Canteen','accessory','\u25d6','Provision','common',{power:0,armor:0,resilience:1},{},4,'Carries clean water for a long descent.','Stamped brass marks show that it once belonged to a city survey crew.')],
  ['oil flask',defineItem('provision-oil-flask','Oil Flask','accessory','\u25c7','Provision','fine',{power:0,armor:0,resilience:1},{},8,'Feeds lamps or loosens a seized mechanism.','The dark oil smells of cedar smoke and hot iron.')],
  ['rope coil',defineItem('tool-rope-coil','Rope Coil','accessory','\u221e','Tool','common',{power:0,armor:0,resilience:1},{STR:8},6,'Secures climbs, crossings, and heavy loads.','Forty feet of tarred rope woven in the Warden yards.')],
  ['lockpin',defineItem('tool-lockpin','Lockpin','accessory','\u2020','Tool','fine',{power:0,armor:0,resilience:0},{DEX:10},11,'Opens simple locks and releases old brass catches.','Its narrow teeth can feel a mechanism before the hand can see it.')],
  ['surveyor hood',defineItem('armor-surveyor-hood','Surveyor Hood','head','\u2303','Armor','fine',{power:0,armor:1,resilience:1},{INT:9},18,'Protects the head without muffling echoes.','A close-cut hood reinforced with thin brass listening plates.')],
  ['riveted workcoat',defineItem('armor-riveted-workcoat','Riveted Workcoat','chest','\u25c8','Armor','rare',{power:0,armor:3,resilience:1},{STR:10},42,'A sturdy coat built to turn falling stone and glancing steel.','Small iron scales are sewn beneath soot-dark leather.')],
  ['foundry gloves',defineItem('armor-foundry-gloves','Foundry Gloves','hands','\u2726','Armor','fine',{power:1,armor:1,resilience:0},{STR:9},22,'Improves grip on tools, weapons, and hot mechanisms.','The palms are rough leather; the knuckles are capped in brass.')],
  ['slateweave trousers',defineItem('armor-slateweave-trousers','Slateweave Trousers','legs','\u2161','Armor','rare',{power:0,armor:2,resilience:1},{DEX:10},36,'Flexible leg protection for ladders and narrow ledges.','Overlapping slate fibers move like cloth and harden under impact.')],
  ['cistern boots',defineItem('armor-cistern-boots','Cistern Boots','feet','\u2229','Armor','flawless',{power:0,armor:2,resilience:2},{DEX:11},58,'Keeps steady footing on flooded stone.','Deep-cut soles grip wet channels without scraping loud enough to carry.')],
  ['warden pick',defineItem('weapon-warden-pick','Warden Pick','mainHand','\u2692','Weapon','rare',{power:3,armor:0,resilience:0},{STR:11},48,'A compact war pick suited to armor and cracked masonry.','Wardens carry this balanced tool when repairs may become a fight.')],
  ['echo buckler',defineItem('shield-echo-buckler','Echo Buckler','offHand','\u25c9','Shield','flawless',{power:0,armor:3,resilience:1},{DEX:11},64,'Deflects blows and rings sharply when danger is near.','Concentric channels spread impact into a clear warning note.')],
  ['measure ring',defineItem('relic-measure-ring','Measure Ring','accessory','\u2299','Relic','legendary',{power:1,armor:1,resilience:3},{INT:12},120,'Strengthens the wearer while they carry an unresolved oath.','Its four marks answer to Weight, Tone, Pattern, and Line.',true)],
  ['archive lens',defineItem('tool-archive-lens','Archive Lens','accessory','\u25c9','Tool','rare',{power:0,armor:0,resilience:1},{INT:11},34,'Reveals altered ink, hairline cracks, and worn inscriptions.','Lithen keeps this silver-rimmed lens beside the restricted ledgers.')],
  ['resonance fork',defineItem('tool-resonance-fork','Resonance Fork','mainHand','\u03a8','Tool','flawless',{power:1,armor:0,resilience:2},{INT:11},56,'Tests pressure channels and isolates a clean mechanical tone.','Its twin prongs were tuned for the Gate crews before the lower works closed.')],
  ['saltglass salve',defineItem('provision-saltglass-salve','Saltglass Salve','accessory','\u2725','Provision','fine',{power:0,armor:0,resilience:1},{},16,'A field medicine that seals cuts and cools minor burns.','Pale mineral gel glows briefly when pressed into a wound.')],
  ['stoneback plate',defineItem('armor-stoneback-plate','Stoneback Plate','chest','\u25a3','Armor','legendary',{power:1,armor:4,resilience:2},{STR:12},78,'Heavy natural armor shaped to turn crushing impacts.','The plate still carries the slow mineral warmth of the Depths.')]
]);
const blankEquipment=()=>Object.fromEntries(EQUIPMENT_SLOTS.map(([key])=>[key,null]));
const itemName=value=>typeof value==='string'?value.trim():(value&&typeof value.name==='string'?value.name.trim():'');
function cleanInventory(list){
  const seen=new Set(), clean=[];
  for(const raw of (Array.isArray(list)?list:[])){
    const name=itemName(raw), key=name.toLowerCase();
    if(!name || seen.has(key)) continue;
    seen.add(key); clean.push(name);
  }
  return clean;
}
const slug=value=>String(value||'item').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
function itemMeta(name){
  const clean=itemName(name), known=ITEM_CATALOG.get(clean.toLowerCase());
  return known || defineItem(`legacy-${slug(clean)}`,clean||'Unknown Item','accessory','\u25c7','Curio','common',{power:0,armor:0,resilience:0},{},1,'No reliable use has been recorded.','An uncatalogued object carried into Brassreach.');
}
function normalizeBackpack(backpack,inventory){
  const savedSlots=Array.isArray(backpack?.slots)?backpack.slots:[];
  const savedOverflow=Array.isArray(backpack?.overflow)?backpack.overflow:[];
  const ordered=cleanInventory([...savedSlots,...savedOverflow,...(Array.isArray(inventory)?inventory:[])]);
  const slots=Array(BACKPACK_CAPACITY).fill(null);
  ordered.slice(0,BACKPACK_CAPACITY).forEach((name,index)=>{ slots[index]=name; });
  return {capacity:BACKPACK_CAPACITY,slots,overflow:ordered.slice(BACKPACK_CAPACITY)};
}
const backpackItems=backpack=>cleanInventory([...(backpack?.slots||[]),...(backpack?.overflow||[])]);
function syncInventoryState(S,preserveSavedLayout=false){
  S.backpack=normalizeBackpack(preserveSavedLayout?S.backpack:null,S.character.inventory);
  S.character.inventory=backpackItems(S.backpack);
  S.equipment=normalizeEquipment(S.equipment,S.character.inventory);
}
function meetsRequirements(name,character=Engine.state.character){
  return Object.entries(itemMeta(name).requirements||{}).every(([stat,min])=>(+character?.[stat]||0)>=min);
}
function derivedStats(S=Engine.state){
  const totals={power:Math.max(0,2+modFrom(S.character.STR)),armor:Math.max(0,8+modFrom(S.character.DEX)),resilience:Math.max(0,2+modFrom(S.character.CHA))};
  Object.values(S.equipment||{}).filter(Boolean).forEach(name=>Object.entries(itemMeta(name).stats||{}).forEach(([key,value])=>{ totals[key]=(totals[key]||0)+value; }));
  return totals;
}
function normalizeEquipment(equipment,inventory){
  const owned=new Set(cleanInventory(inventory));
  const next=blankEquipment(), used=new Set();
  for(const [slot] of EQUIPMENT_SLOTS){
    const item=equipment?.[slot];
    if(item && owned.has(item) && !used.has(item) && itemMeta(item).slot===slot){ next[slot]=item; used.add(item); }
  }
  return next;
}

/* ---------- state ---------- */
function defaultCampaign(){
  return {
    version:CAMPAIGN_VERSION, sceneId:'halls-briefing', chapter:'halls', objective:CAMPAIGN_SCENES['halls-briefing'].objective,
    completedScenes:[], completedEncounters:[], enteredScenes:[], discoveries:[], consequences:[], optionalCompleted:[],
    alliances:{wardens:0,lithen:0,mullinen:0}, flags:{}, rerollsUsed:{}, exploration:{}, ending:null, bossPhase:0
  };
}
function defaultJournal(){ return {milestones:[], discoveries:[], consequences:[], optional:[]}; }
function defaults(){
  return {
    saveVersion:SAVE_VERSION, seed:rnd(1,9_999_999), turn:0, scene:'Halls',
    storyBeats:[], transcript:[],
    character:{ name:'Eldan', race:'Dwarf', STR:12,DEX:14,INT:12,CHA:10, HP:14, MaxHP:14, Gold:5, inventory:['Torch','Canteen'] },
    equipment:blankEquipment(),
    backpack:normalizeBackpack(null,['Torch','Canteen']),
    flags:{ rumors:false, keys:[], bossReady:false, bossDealtWith:false },
    campaign:defaultCampaign(), journal:defaultJournal(),
    _choiceHistory:[], _lastChoices:[], _undoStack:[], _arcStep:0, _pendingType:false,
    settings:{ typewriter:true, cps:40, audio:{ master:0.5, ui:0.45, music:0.5, sfx_success:true, sfx_fail:true, sfx_story:true } },
    live:{ on:store.get('dm_on',false), endpoint:store.get('dm_ep','/dm-turn') }
  };
}
const Engine={ el:{}, state: defaults(), inventoryDraft:[], selectedInventoryItem:null, inventoryView:{quality:'all',category:'all',sort:'pack'}, tooltipPinned:false, tooltipItem:null, busy:false, loadedSave:false, pendingFailure:null, activeMerchant:null };
window.Engine=Engine;

// --- Now Playing chip controller (ephemeral) -------------------------
// Called by BGM.crossTo(...) after each successful track swap.
// Shows the chip briefly, then fades it away. Safe to spam.
let _npTimer = null;
window.setNowPlaying = (title)=>{
  try{
    const w = document.getElementById('nowplay');
    if(!w) return;
    const t = document.getElementById('npTitle');
    if(t) t.textContent = title || '';
    // reveal with CSS transition (runtime style already injects the fade)
    w.classList.add('show');
    clearTimeout(_npTimer);
    _npTimer = setTimeout(()=>{ try{ w.classList.remove('show'); }catch{} }, 2400);
  }catch(e){ /* non-fatal */ }
};

/* ---------- background music manager (file-based, crossfades) ---------- */
const BGM = (function(){
  let ctx, bus, cur=[], curGain=null, fadeMs=1400;
  let currentName=null, targetName=null, requestToken=0;
  let unlocked=false, pendingName=null;
  const tracks = {
    intro:    { title:"Lament at the Foundry Hearth", srcs:["./public/audio/intro-hearth-lament.mp3"], layerSrcs:["./public/audio/intro-fire-crackle.ogg"] },
    prelude:  { title:"Prelude to Brass and Shadow", srcs:["./public/audio/8b5955d3-2e28-447b-bc5f-a91bad52e402.m4a"] },
    halls:    { title:"Halls of the Brassreach", srcs:["./public/audio/8b264fe3-26f0-4c6c-9356-60a270d2ef21.mp3"] },
    depths2:  { title:"When the Unfathomer Stirs", srcs:["./public/audio/66bf880d-6cea-470f-8dba-7de081c046fa.mp3"] },
    depths:   { title:"Beneath the Cistern Fields", srcs:["./public/audio/662478af-b29d-4034-a2fc-d2ea9fd75dc4.mp3"] },
    archives: { title:"Whispers of the Archives", srcs:["./public/audio/73a9c81f-6be8-45a2-8338-2b8b7a53d596.mp3"] },
  };
  const cache = new Map();
  function getCtx(){ try{ Sound.ensure(); }catch{}; return (Sound.getCtx? Sound.getCtx() : new (window.AudioContext||window.webkitAudioContext)()); }
  async function load(name){
    if(cache.has(name)) return cache.get(name);
    const t = tracks[name]; if(!t) return null;
    const C = getCtx(); ctx=C; if(!bus){ bus=C.createGain(); bus.gain.value=Engine.state?.settings?.audio?.music ?? 0.5; if(Sound.getMaster){ bus.connect(Sound.getMaster()); } else { bus.connect(C.destination); } }
    for(const url of t.srcs){
      try{
        const res = await fetch(url, {cache:"force-cache"}); if(!res.ok) continue;
        const arr = await res.arrayBuffer();
        const buf = await C.decodeAudioData(arr.slice(0));
        const layers=[];
        for(const layerUrl of (t.layerSrcs||[])){
          try{
            const layerRes=await fetch(layerUrl,{cache:"force-cache"});
            if(layerRes.ok) layers.push(await C.decodeAudioData((await layerRes.arrayBuffer()).slice(0)));
          }catch{}
        }
        const o = {buffers:[buf,...layers]}; cache.set(name,o); return o;
      }catch(e){}
    }
    return null;
  }
  function setBus(v){ if(bus) bus.gain.value=v; }
  async function crossTo(name){
    if(!unlocked){ pendingName=name; return; }
    if(name===targetName || (name===currentName && cur.length)) return;
    targetName=name;
    const token=++requestToken;
    try{
      const data = await load(name);
      if(!data || token!==requestToken){ if(token===requestToken) targetName=currentName; return; }
      const C = ctx || getCtx(); ctx=C; if(!bus){ bus=C.createGain(); bus.gain.value=Engine.state?.settings?.audio?.music ?? 0.5; if(Sound.getMaster){ bus.connect(Sound.getMaster()); } else { bus.connect(C.destination); } }
      // A track may contain synchronized layers (the intro music and its hearth recording).
      const ng = C.createGain(); ng.gain.value=0; ng.connect(bus); const now=C.currentTime;
      const nextSources=data.buffers.map((buffer,index)=>{
        const src=C.createBufferSource(); src.buffer=buffer; src.loop=true;
        const layerGain=C.createGain(); layerGain.gain.value=index===0?1:.34;
        src.connect(layerGain).connect(ng); src.start(now+0.02); return src;
      });
      const fade = Math.max(0.10, fadeMs/1000);
      ng.gain.cancelScheduledValues(now); ng.gain.setValueAtTime(0, now); ng.gain.linearRampToValueAtTime(1, now+fade);
      if(curGain){
        curGain.gain.cancelScheduledValues(now);
        curGain.gain.setValueAtTime(curGain.gain.value, now);
        curGain.gain.linearRampToValueAtTime(0, now+fade);
      }
      const prev = cur;
      cur = nextSources; curGain = ng;
      currentName=name;
      if(prev.length){ setTimeout(()=>prev.forEach(source=>{ try{ source.stop(); }catch{} }), fade*1000+120); }
      const t=tracks[name]; if(t) setNowPlaying(t.title);
    }catch(e){
      if(token===requestToken) targetName=currentName;
      console.error('BGM crossTo error', e);
    }
  }
  function stop(){
    try{
      if(cur.length){
        const sources=cur, gain=curGain, C=ctx||getCtx(), now=C.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.linearRampToValueAtTime(0, now+.25);
        setTimeout(()=>sources.forEach(source=>{ try{source.stop()}catch{} }), 360);
      }
    }catch{}
    cur=[]; curGain=null; currentName=null; targetName=null; pendingName=null; requestToken++;
  }
  function updateForState(S){
    const introOpen = !!(Engine.el?.intro && !Engine.el.intro.classList.contains('hidden'));
    if(introOpen) return crossTo('intro');
    if(S.turn < 2) return crossTo('prelude');
    const chapter=S.campaign?.chapter;
    if(chapter==='archives'||S.scene==='Archives') return crossTo('archives');
    if(['depths','gate','unfathomer','epilogue'].includes(chapter)||S.scene==='Depths'){ if(S.flags?.bossDealtWith || S.flags?.bossReady || chapter==='gate' || chapter==='unfathomer') return crossTo('depths2'); return crossTo('depths'); }
    return crossTo('halls');
  }
  function setNowPlaying(t){ try{ if (window.setNowPlaying) window.setNowPlaying(t); else { const e=document.getElementById('npTitle'); if(e) e.textContent=t; } }catch{} }
  function unlock(){
    if(unlocked) return Sound.resume();
    unlocked=true;
    Sound.ensure();
    Sound.resume();
    const requested=pendingName;
    pendingName=null;
    if(requested) crossTo(requested);
  }
  return {crossTo, stop, updateForState, setLevel:setBus, unlock};
})();

/* ---------- sound @ ~20 BPM base ---------- */

const Sound = (()=>{
  let ctx, master, ui;
  const inventoryBuffers=new Map();
  const inventoryUrls={pickup:'./public/audio/inventory-pickup.wav',place:'./public/audio/inventory-place.wav',reject:'./public/audio/inventory-reject.wav'};
  const ensure = ()=>{
    if (ctx) return;
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = Engine.state.settings.audio.master; master.connect(ctx.destination);
    ui = ctx.createGain(); ui.gain.value = Engine.state.settings.audio.ui; ui.connect(master);
  };
  const setLevels = ()=>{ if(!ctx) return; master.gain.value = Engine.state.settings.audio.master; ui.gain.value = Engine.state.settings.audio.ui; };
  const resume = ()=>{ if(ctx?.state==='suspended') return ctx.resume().catch(()=>{}); };
  const click = ()=>{ ensure(); const t=ctx.currentTime; const o=ctx.createOscillator(); o.type='square';
    o.frequency.setValueAtTime(300,t); o.frequency.exponentialRampToValueAtTime(120,t+.09);
    const g=ctx.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.28,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+.16);
    o.connect(g).connect(ui); o.start(t); o.stop(t+.18);
  };
  const sfx=(kind)=>{
    const sa=Engine.state.settings.audio||{};
    if((kind==='success' && sa.sfx_success===false) || (kind==='fail' && sa.sfx_fail===false) || (kind==='story' && sa.sfx_story===false)) return;
    ensure(); const t=ctx.currentTime; const o=ctx.createOscillator(), g=ctx.createGain(); o.type='sine';
    const a = kind==='success' ? [520, 880, .18, .24] : kind==='fail' ? [180,  90, .28, .26] : [320, 440, .22, .20];
    o.frequency.setValueAtTime(a[0],t); o.frequency.exponentialRampToValueAtTime(a[1],t+a[2]*.9);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(a[3],t+.015); g.gain.exponentialRampToValueAtTime(.0001,t+a[2]);
    o.connect(g).connect(ui); o.start(t); o.stop(t+a[2]+.05);
  };
  const gong = ()=>{
  ensure(); const t=ctx.currentTime;
  // detuned oscillators + long decay for a gong-ish swell
  const o1=ctx.createOscillator(), o2=ctx.createOscillator(), g=ctx.createGain();
  o1.type='sine'; o2.type='sine';
  o1.frequency.setValueAtTime(196, t);     // ~G3
  o2.frequency.setValueAtTime(147, t);     // ~D3 (a fifth below)
  o2.detune.setValueAtTime(-8, t);         // slight beating
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(.7, t+.05);
  g.gain.exponentialRampToValueAtTime(.0001, t+3.2); // long tail
  o1.connect(g); o2.connect(g); g.connect(ui);
  o1.start(t); o2.start(t); o1.stop(t+3.3); o2.stop(t+3.3);
};
  const inventory=async(kind)=>{
    ensure(); resume();
    try{
      const soundKind=kind==='swap'?'place':kind;
      let buffer=inventoryBuffers.get(soundKind);
      if(!buffer){
        const response=await fetch(inventoryUrls[soundKind],{cache:'force-cache'});
        if(!response.ok) throw new Error('inventory audio unavailable');
        buffer=await ctx.decodeAudioData((await response.arrayBuffer()).slice(0));
        inventoryBuffers.set(soundKind,buffer);
      }
      const source=ctx.createBufferSource(), gain=ctx.createGain();
      source.buffer=buffer; gain.gain.value=kind==='reject'?.42:kind==='swap'?.68:.58;
      source.connect(gain).connect(ui); source.start();
    }catch{ sfx(kind==='reject'?'fail':'story'); }
  };
  const ambOn = ()=>ensure(); // for legacy calls
  return {click, sfx, gong, inventory, ambOn, setLevels, resume, ensure, getCtx:()=>{ ensure(); return ctx; }, getMaster:()=>master};
})();

/* ---------- weaver ---------- */
const Weaver = makeWeaver(store,
  (msg)=>Engine.state.storyBeats.push({text:`[log] ${msg}`}),
  (tag)=>{ const t=$('#engineTag'); if(t) t.textContent=tag; Engine.state.live.on=(tag==='Live'); }
);
// --- Global glossary (fallback for .gloss without data-def) ----------
window.GLOSS = Object.assign({
  "brassreach": "A dwarven city built in terraces above tuned caverns. Public deeds become part of its law.",
  "unfathomer": "A deliberate underground tide that learns rhythms and presses against weak parts of the city.",
  "halls": "Brassreach's upper civic tunnels and the first district you explore.",
  "archives": "The city's record halls, where ledgers, oaths, and engineering charts are guarded.",
  "depths": "Flooded galleries, sluice walks, and sealed Warden tunnels beneath the city.",
  "gate of measures": "An ancient machine and covenant chamber where the Unfathomer can be confronted.",
  "keys": "Stone, Brass, and Echo. Two awaken the Gate; all three unlock more possible outcomes.",
  "brass key": "The Key of Tone and resonance. It activates the Gate's tuned mechanisms.",
  "echo key": "The Key of Pattern and return. It activates the Gate's memory lattice.",
  "stone key": "The Key of Weight, foundation, and oath. It activates the Gate's oath seats.",
  "measures": "Four principles used to understand the city: Weight, Tone, Pattern, and Line.",
  "weight": "Stone's Measure: oath, burden, foundation, and consequence.",
  "tone": "Brass's Measure: resonance, harmony, and relationships between sounds.",
  "pattern": "Echo's Measure: memory, return, law, and recurrence.",
  "line": "Thread's Measure: a decision that fixes the direction of a path."
}, window.GLOSS||{});

/* ---------- boot ---------- */
let booted=false;
export function boot(){
  if(booted) return;
  booted=true;
  buildUI(); hydrate(); bind(); renderAll();
  attachGlossTips();
  if(Engine.state.storyBeats.length) renderChoices(makeChoiceSet(Engine.state.scene));

  insertIntro(); // overlay every load
  tuneIntroLayout();
  mountScrollFab();

  const seen = store.get('intro_seen', false);
  if (seen){
    if (Engine.el.intro) Engine.el.intro.classList.add('hidden');
    try{ Engine.el.fxIntroCtl?.stop?.(); }catch{}
    document.getElementById('fxIntro')?.remove();
    if (!Engine.state.storyBeats.length) beginTale(Engine.loadedSave);
  }

  /* ambience removed */ BGM.updateForState(Engine.state);
  Engine.el.fxMainCtl=FX.start('fx');

  // Browsers require a gesture before a suspended AudioContext may play.
  const unlockAudio=()=>BGM.unlock();
  window.addEventListener('pointerdown',unlockAudio,{once:true});
  window.addEventListener('keydown',unlockAudio,{once:true});
  
  // Dev convenience: Alt+I marks the intro as seen (persisted)
  window.addEventListener('keydown', (e)=>{
    if (e.altKey && (e.key||'').toLowerCase()==='i'){
      try{ store.set('intro_seen', true); }catch{}
      if (typeof toast === 'function') toast('Intro will be skipped next load');
    }
  });
} // <-- end boot()



/* ------------------------------ fonts guard ------------------------------ */
/* Ensures Cinzel / Josefin Sans are present even if the <head> link is missing */
(function ensureFonts(){
  if (document.querySelector('link[href*="fonts.googleapis.com"]')) return;
  const p1 = document.createElement('link'); p1.rel='preconnect'; p1.href='https://fonts.googleapis.com';
  const p2 = document.createElement('link'); p2.rel='preconnect'; p2.href='https://fonts.gstatic.com'; p2.crossOrigin='';
  const lf = document.createElement('link'); lf.rel='stylesheet';
  lf.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Josefin+Sans:wght@400;600;700&display=swap';
  document.head.append(p1, p2, lf);
})();



/* ---------------------------- glossary tooltips --------------------------- */
/* Single shared tooltip; data-def > title > GLOSS[word] fallback; fade only */
let glossTipsBound=false;
function attachGlossTips(){
  if(glossTipsBound) return;
  glossTipsBound=true;
  const root=document;
  // Create a single shared tip if needed
  let tip = document.querySelector('.gloss-tip');
  if (!tip){
    tip = document.createElement('div');
    tip.className = 'gloss-tip';
    tip.setAttribute('role','tooltip');
    document.body.appendChild(tip);
  }

  // Small debounce to prevent flutter while reading
  let hideAt = 0, pinned = null, overTerm = null;

  // Helper: resolve definition
  const resolveDef = (el)=>{
    // priority: data-def -> title -> GLOSS[word] fallback (if exists)
    const explicit = el.getAttribute('data-def') || el.dataset?.def || el.getAttribute('title') || el.title;
    if (explicit) return explicit;
    const key = (el.textContent || '').trim().toLowerCase();
    if (window.GLOSS && window.GLOSS[key]) return window.GLOSS[key];
    return ''; // nothing found; we’ll just not show a card
  };

  // Helper: position near cursor, keep on-screen
  const place = (x, y)=>{
    const pad = 16;
    const vw = innerWidth, vh = innerHeight;
    const rect = tip.getBoundingClientRect();
    // prefer right/below the cursor; clamp to viewport
    let left = Math.min(vw - rect.width - pad, Math.max(pad, x + 14));
    let top  = Math.min(vh - rect.height - pad, Math.max(pad, y + 18));
    tip.style.left = left + 'px';
    tip.style.top  = top  + 'px';
  };

  // Mouse move: track when visible
  root.addEventListener('mousemove', (e)=>{
    if (pinned || !overTerm || tip.style.visibility !== 'visible') return;
    place(e.clientX, e.clientY);
  });

  // Enter/leave handling via delegation
  root.addEventListener('pointerover', (e)=>{
    const t = e.target.closest('.gloss');
    if (!t) return;
    overTerm = t;

    const def = resolveDef(t);
    if (!def){ // nothing to show
      tip.classList.remove('on');
      tip.style.visibility = 'hidden';
      return;
    }
    tip.textContent = def;               // text only, no "?"
    tip.style.visibility = 'visible';
    tip.classList.add('on');             // CSS handles fade only
    place(e.clientX, e.clientY);
  });

  root.addEventListener('pointerout', (e)=>{
    const leaving = e.target.closest('.gloss');
    if (!leaving || (pinned && overTerm === leaving)) return;
    overTerm = null;
    tip.classList.remove('on');
    tip.style.visibility = 'hidden';
    hideAt = Date.now();
  });

  // ALT to pin; click anywhere to unpin
  root.addEventListener('keydown', (e)=>{
    if (e.altKey && overTerm){
      pinned = tip; // keep the same element pinned
      tip.style.pointerEvents = 'auto';
    }
  });

  window.addEventListener('click', ()=>{
    if (pinned){
      tip.classList.remove('on');
      tip.style.visibility = 'hidden';
      pinned = null;
      hideAt = Date.now();
    }
  }, true);
}

// ----------------------------------------------------------------

// --- COMPLETE, DROP-IN INTRO ------------------------------------

function tuneIntroLayout(){
  const intro = document.getElementById('intro');
  if (!intro) return;
  intro.classList.add('two-pane');
}

// Local helper: set the slide's image (safe even if .pic/.img aren't present)
function setSlideImage(index, url){
  const sl = Engine.el.slides?.[index];
  if (!sl) return;

  let pic = sl.querySelector('.pic');
  if (!pic){
    pic = document.createElement('div');
    pic.className = 'pic';
    const copy = sl.querySelector('.copy');
    sl.insertBefore(pic, copy || sl.firstChild);
  }

  let img = pic.querySelector('.img');
  if (!img){
    img = document.createElement('div');
    img.className = 'img';
    pic.appendChild(img);
  }

  // apply background
  img.style.backgroundImage = `url("${url}")`;
  img.style.backgroundSize = 'cover';
  img.style.backgroundPosition = 'center';
  img.style.backgroundRepeat = 'no-repeat';
}

function insertIntro(){
  // DOM-aware guard so we never stack duplicate intros
  const existing = document.getElementById('intro');
  if (existing){
    Engine.el.intro  = existing;
    Engine.el.slides = Array.from(existing.querySelectorAll('.slide'));
    return;
  }

  // Build and inject the overlay
  const slidesHTML = getIntroSlidesHTML(); // your existing factory
  document.body.insertAdjacentHTML('afterbegin', slidesHTML);

  // Cache refs
  Engine.el.intro    = document.getElementById('intro');
  Engine.el.intro.classList.add('two-pane');
  Engine.el.slides   = Array.from(Engine.el.intro.querySelectorAll('.slide'));
  Engine.el.nextBtns = Array.from(Engine.el.intro.querySelectorAll('.intro-next'));
  Engine.el.beginBtn = Engine.el.intro.querySelector('.intro-begin');
  
  // Normalize every baked slide to .pic > .img.
(function ensureIntroCutout(){
  const slides = Engine.el.slides || Array.from(document.querySelectorAll('#intro .slide'));
  slides.forEach(sl=>{
    // 1) ensure container
    let pic = sl.querySelector('.pic');
    if(!pic){
      pic = document.createElement('div');
      pic.className = 'pic';
      const copy = sl.querySelector('.copy');
      sl.insertBefore(pic, copy || sl.firstChild);
    }

    // 2) unify the .img
    let imgInPic = pic.querySelector('.img');
    const strayImg = sl.querySelector(':scope > .img'); // direct child of slide
    if(!imgInPic && strayImg){
      pic.appendChild(strayImg);
      imgInPic = strayImg;
    } else if(!imgInPic){
      imgInPic = document.createElement('div');
      imgInPic.className = 'img';
      pic.appendChild(imgInPic);
    } else if(strayImg && strayImg !== imgInPic){
      // prefer the stray (likely the authored one), remove duplicate
      pic.removeChild(imgInPic);
      pic.appendChild(strayImg);
      imgInPic = strayImg;
    }

    // Visible placeholder if no image has been assigned yet.
    const cs = getComputedStyle(imgInPic);
    const hasBG = cs.backgroundImage && cs.backgroundImage !== 'none';
    if(!hasBG){
      imgInPic.style.backgroundImage =
        "linear-gradient(135deg, rgba(213,168,74,.28), rgba(22,16,10,.28))";
      imgInPic.style.backgroundSize = 'cover';
      imgInPic.style.backgroundPosition = 'center';
    }
  });
})();
  

  // Title at top of slides with double underline
if (!Engine.el.intro.querySelector('.intro-title')){
  const t = document.createElement('div');
  t.className = 'intro-title u-double-underline';
  t.innerHTML = '<span class="title-left">BRASS</span><span class="title-gap"></span><span class="title-right">REACH</span>';
  Engine.el.intro.appendChild(t);
}
  // One-at-a-time slides + per-slide typewriter
  let idx = 0;
  const show = (i)=>{
    idx = Math.max(0, Math.min(Engine.el.slides.length - 1, i));
    Engine.el.slides.forEach((s, k)=>{
      const active = (k === idx);
      s.classList.toggle('active', active);
      if (!active) return;

      // trigger typewriter once per slide
      const p = s.querySelector('.scroll p');
      if (p && !p.dataset.typed){
        p.dataset.typed = '1';
        if(Engine.state.settings.typewriter) typewriteRich(p, Engine.state.settings.cps);
      }
    });
  };

  // Button wiring
  Engine.el.nextBtns.forEach(b => b.addEventListener('click', ()=>{
    Sound.sfx('story'); show(idx + 1);
  }));
  const back2 = Engine.el.intro.querySelector('#introBack2');
  const back3 = Engine.el.intro.querySelector('#introBack3');
  const skip1 = Engine.el.intro.querySelector('#introSkip1');

  back2 && back2.addEventListener('click', ()=>{ Sound.click(); show(idx - 1); });
  back3 && back3.addEventListener('click', ()=>{ Sound.click(); show(idx - 1); });
  skip1 && skip1.addEventListener('click', ()=>{ Sound.click(); Engine.el.beginBtn?.click(); });

  if (Engine.el.beginBtn){
    Engine.el.beginBtn.onclick = ()=>{
      BGM.crossTo('prelude');
      Sound.gong();
  
      // stop/remove intro embers so only main-screen embers remain
      try { Engine.el.fxIntroCtl && Engine.el.fxIntroCtl.stop && Engine.el.fxIntroCtl.stop(); } catch {}
      const fxIntro = document.getElementById('fxIntro'); if (fxIntro) fxIntro.remove();
  
      Engine.el.intro.classList.add('hidden');
      store.set('intro_seen', true);
      if (!Engine.state.storyBeats.length) beginTale(Engine.loadedSave);
  
      // open editor and mount scroll icon
      setTimeout(()=>{ Engine.el.btnEdit.click(); mountScrollFab(); }, 120);
    };
  }
  
// ---- Intro embers layer (behind panels, above crest) ----
if (!document.getElementById('fxIntro')){
  const fx = document.createElement('div');
  fx.id = 'fxIntro';
  fx.setAttribute('aria-hidden','true');
  Object.assign(fx.style, {
    position:'fixed', inset:'0', pointerEvents:'none', zIndex:'1'
  });
  // put embers behind everything in the intro stack
  Engine.el.intro.prepend(fx);
}
// start intro embers and keep a handle to stop later
Engine.el.fxIntroCtl = FX.start('fxIntro');
// --- Assign baked-edge intro art (no veil mask) ---
(function(){
  // IMPORTANT: use relative paths so GH Pages serves from the project root
  const ART = {
    0: 'public/img/intro/intro_city_baked.png',
    1: 'public/img/intro/intro_unfathomer_baked.png',
    2: 'public/img/intro/intro_gate_baked.png'
  };

  Object.entries(ART).forEach(([i, url])=>{
    const idx = +i;
    const sl  = Engine.el.slides?.[idx];
    if (!sl) return;
    sl.classList.add('baked');          // hide veil via CSS
    setSlideImage(idx, url);            // (replaces missing setIntroImage)
  });
})();
  
  // Start at the first slide
  show(0);
  tuneIntroLayout();
}

/* ---------- DOM ---------- */
function enhanceCharacterSteppers(){
  $$('#modalEdit input[type="number"]').forEach(input=>{
    if(input.parentElement?.classList.contains('number-stepper')) return;
    const wrap=document.createElement('span'); wrap.className='number-stepper'; input.parentNode.insertBefore(wrap,input); wrap.appendChild(input);
    const controls=document.createElement('span'); controls.className='stepper-controls';
    const label=input.id.replace(/^ed/,'')||'value';
    [['up','Increase'],['down','Decrease']].forEach(([direction,verb])=>{
      const button=document.createElement('button'); button.type='button'; button.className=`stepper-arrow ${direction}`; button.textContent=direction==='up'?'▲':'▼'; button.setAttribute('aria-label',`${verb} ${label}`);
      button.addEventListener('click',()=>{ direction==='up'?input.stepUp():input.stepDown(); input.dispatchEvent(new Event('input',{bubbles:true})); input.focus(); }); controls.appendChild(button);
    });
    wrap.appendChild(controls);
  });
}
function buildUI(){
  document.body.innerHTML = `
  <div class="app">
    <div class="crest" aria-hidden="true"></div>
    <div id="glow" aria-hidden="true"></div>
    <div id="fx" aria-hidden="true"></div>
    <header class="masthead">
      <div class="masthead-rivet rail-left" aria-hidden="true"></div>
      <div class="brand-lockup">
        <span class="brand-kicker">The Dwarven Storyweaver</span>
        <div class="brand-title u-double-underline" aria-label="Brassreach">
          <span class="title-left">BRASS</span><span class="title-gap"></span><span class="title-right">REACH</span>
        </div>
      </div>
      <div class="toolbar cardish frame" aria-label="Story controls">
        <div class="controls">
          <div class="keys-meter" title="Keys acquired">
            <svg id="keysRing" viewBox="0 0 100 100" aria-label="Keys acquired">
              <circle class="ticks" cx="50" cy="50" r="46" />
              <circle class="bg" cx="50" cy="50" r="40" />
              <circle id="keysArc" class="arc" cx="50" cy="50" r="40" />
              <circle class="hub" cx="50" cy="50" r="24" />
            </svg>
            <span class="keys-copy"><small>Relic circuit</small><strong>Keys</strong></span>
          </div>
          <div class="command-actions">
            <button id="btnEnd" class="btn">End the Story</button>
            <button id="btnSettings" class="btn">Settings</button>
          </div>
        </div>
      </div>
      <div class="masthead-rivet rail-right" aria-hidden="true"></div>
    </header>

    <div class="main">
      <section class="storywrap">
        <div class="panel-heading story-heading">
          <span id="sceneHeading" class="panel-kicker scene-title">Halls</span>
          <span class="panel-rule" aria-hidden="true"></span>
          <span class="panel-mark" aria-hidden="true">◆</span>
        </div>
        <div id="story" class="story-scroll frame" role="log" aria-live="polite" aria-label="Story transcript"></div>
        <div class="choices frame">
          <div class="panel-heading choice-heading">
            <span class="panel-kicker">Choose Your Measure</span>
            <span class="panel-rule" aria-hidden="true"></span>
            <span id="weaveStatus" class="weave-status" role="status">Ready</span>
          </div>
          <div id="choices"></div>
          <div class="free">
            <input id="freeText" aria-label="Write your own action" placeholder="Write your own action — search the alcove, read the tablet…" />
            <button id="btnAct" class="btn gold">ACT</button>
            <button id="btnCont" class="btn">Continue story</button>
          </div>
        </div>
      </section>

      <aside class="side">
        <div class="card deco frame character-card">
          <h3 class="character-heading"><span class="character-title"><strong id="charHeaderName">Eldan</strong><small id="charHeaderRace">Dwarf</small></span><button id="btnEdit" class="btn mini">Edit</button></h3>
          <div id="charPanel" class="character-rig"></div>
        </div>
        <div class="card deco frame objective-card">
          <h3><span>Current Objective</span><kbd>J</kbd></h3>
          <div id="objectivePanel" class="objective-panel"></div>
          <button id="btnJournal" class="inventory-open">Open quest journal <span>J</span></button>
        </div>
        <div class="card deco frame hotbar-card">
          <h3><span>Field Kit</span><kbd>E</kbd></h3>
          <div id="hotbarPanel" class="hotbar" aria-label="Owned items"></div>
          <button id="btnInventory" class="inventory-open">Open full inventory <span>E</span></button>
        </div>
        <div class="card deco frame">
          <h3><span>Ledger</span></h3>
          <div id="ledgerPanel" class="centered"></div>
        </div>
        <div class="card deco frame">
          <h3><span>Session</span></h3>
          <div class="centered session-grid">
            <div><span>Seed</span><strong id="seedVal"></strong></div>
            <div><span>Turn</span><strong id="turnVal"></strong></div>
            <div><span>Keys</span><strong id="keysVal"></strong></div>
          </div>
          <div id="saveStatus" class="save-status" role="status"><span aria-hidden="true"></span> Stored locally</div>
        </div>
      </aside>
    </div>

    <div id="nowplay" class="nowplay frame">
      <div class="np-inner">
        <span class="np-dot" aria-hidden="true"></span>
        <span class="np-label">Now Playing:</span>
        <span id="npTitle">—</span>
      </div>
    </div>

  <div id="shade"  class="shade hidden"></div>

  <!-- Character modal -->
  <div id="modalEdit" class="modal hidden">
    <header><div>Edit Character</div><div id="xEdit" class="closeX">✕</div></header>
    <div class="content">
      <div class="grid2">
        <label>Name <input id="edName"></label>
        <label>Race
          <select id="edRace">
            <option>Dwarf</option><option>Human</option><option>Elf</option>
            <option>Gnome</option><option>Halfling</option><option>Orc</option>
          </select>
        </label>
        <label>STR <input id="edSTR" type="number" min="6" max="18"></label>
        <label>DEX <input id="edDEX" type="number" min="6" max="18"></label>
        <label>INT <input id="edINT" type="number" min="6" max="18"></label>
        <label>CHA <input id="edCHA" type="number" min="6" max="18"></label>
        <label>HP  <input id="edHP"  type="number" min="4" max="30"></label>
        <label>Gold<input id="edGold"type="number" min="0" max="999"></label>
      </div>
      <div class="inventory-editor">
        <label for="edInvAdd">Inventory</label>
        <div class="inventory-add-row"><input id="edInvAdd" placeholder="Add item"><button id="btnInvAdd" class="btn">Add item</button></div>
        <div id="edInvList" class="inventory-edit-list" aria-live="polite"></div>
      </div>
      <div class="modal-actions">
        <button id="btnAuto" class="btn modal-auto">Auto-generate</button>
        <div class="modal-confirm">
          <button id="btnEditSave" class="btn gold">Save</button>
          <button id="btnEditCancel" class="btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Equipment inventory -->
  <div id="modalInventory" class="modal inventory-modal hidden" role="dialog" aria-modal="true" aria-labelledby="inventoryTitle">
    <header><div><span class="modal-kicker">Brassreach Field Harness</span><strong id="inventoryTitle">Adventurer's Field Case</strong></div><button id="xInventory" class="closeX" aria-label="Close inventory">&#10005;</button></header>
    <div class="content inventory-layout">
      <section class="equipment-board frame" aria-label="Equipment harness and character outline">
        <div class="inventory-section-heading"><span>Equipment Harness</span><small>Drag, double-click, or select an item and choose a slot</small></div>
        <div class="equipment-figure" aria-hidden="true">
          <span class="figure-halo"></span><span class="figure-head"></span><span class="figure-body"></span><span class="figure-arm left"></span><span class="figure-arm right"></span><span class="figure-leg left"></span><span class="figure-leg right"></span>
        </div>
        <button class="equip-slot slot-head" data-slot="head"></button>
        <button class="equip-slot slot-chest" data-slot="chest"></button>
        <button class="equip-slot slot-hands" data-slot="hands"></button>
        <button class="equip-slot slot-legs" data-slot="legs"></button>
        <button class="equip-slot slot-feet" data-slot="feet"></button>
        <button class="equip-slot slot-main" data-slot="mainHand"></button>
        <button class="equip-slot slot-off" data-slot="offHand"></button>
        <button class="equip-slot slot-accessory" data-slot="accessory"></button>
        <div id="equipmentStats" class="equipment-stats" aria-label="Equipment bonuses"></div>
      </section>
      <section class="backpack-panel frame" aria-label="Backpack">
        <div class="inventory-section-heading"><span>Backpack</span><small id="capacityMeter">0 / 40 slots</small></div>
        <div class="inventory-toolbar">
          <label>Quality <select id="qualityFilter"><option value="all">All qualities</option><option value="common">Common</option><option value="fine">Fine</option><option value="rare">Rare</option><option value="flawless">Flawless</option><option value="legendary">Legendary</option><option value="relic">Relics</option></select></label>
          <label>Category <select id="categoryFilter"><option value="all">All categories</option></select></label>
          <label>Order <select id="inventorySort"><option value="pack">Pack order</option><option value="name">Name</option><option value="quality">Quality</option><option value="value">Value</option></select></label>
        </div>
        <div class="rarity-legend" aria-label="Item quality legend"><span class="quality-common">Common</span><span class="quality-fine">Fine</span><span class="quality-rare">Rare</span><span class="quality-flawless">Flawless</span><span class="quality-legendary">Legendary</span><span class="relic-legend">Relic seal</span></div>
        <div id="inventoryItems" class="backpack-grid" role="grid" aria-label="Backpack slots"></div>
        <div id="inventoryOverflow" class="inventory-overflow" aria-live="polite"></div>
        <p class="inventory-help">Equipped items stay in the pack and carry a slot mark. Hover or press Enter to inspect; press Q or double-click to equip or remove.</p>
      </section>
    </div>
  </div>
  <aside id="itemTooltip" class="item-tooltip hidden" role="dialog" aria-live="polite"></aside>

  <!-- Quest journal -->
  <div id="modalJournal" class="modal journal-modal hidden" role="dialog" aria-modal="true" aria-labelledby="journalTitle">
    <header><div id="journalTitle">Quest Journal</div><button id="xJournal" class="closeX" aria-label="Close quest journal">&#10005;</button></header>
    <div id="journalContent" class="content journal-content"></div>
  </div>

  <!-- Merchant -->
  <div id="modalMerchant" class="modal merchant-modal hidden" role="dialog" aria-modal="true" aria-labelledby="merchantTitle">
    <header><div><span class="modal-kicker" id="merchantKicker">Field Exchange</span><strong id="merchantTitle">Merchant</strong></div><button id="xMerchant" class="closeX" aria-label="Close merchant">&#10005;</button></header>
    <div id="merchantContent" class="content merchant-content"></div>
  </div>

  <!-- Failure recovery -->
  <div id="modalLost" class="modal lost-modal hidden" role="alertdialog" aria-modal="true" aria-labelledby="lostTitle" aria-describedby="lostSummary">
    <header><div><span class="modal-kicker">Encounter Lost</span><strong id="lostTitle">The Measure Turns</strong></div></header>
    <div id="lostContent" class="content lost-content"></div>
  </div>

  <!-- Settings modal -->
  <div id="modalSet" class="modal hidden">
    <header><div>Settings</div><div id="xSet" class="closeX">✕</div></header>
    <div class="content">
      <div class="grid2">
        <div>
          <h4>Accessibility</h4>
          <label><input type="checkbox" id="hcMode"> High-contrast mode</label>
        </div>
        <div>
          <h4>Typewriter</h4>
          <label><input type="checkbox" id="twOn"> Enable</label><br>
          <label>Chars/sec <input type="number" id="twCps" min="10" max="120" step="5"></label>
        </div>
        <div>
          <h4>Audio</h4>
          <label>Master <input type="range" id="aMaster" min="0" max="0.8" step="0.01"></label><br>
          <label>UI <input type="range" id="aUi" min="0" max="0.8" step="0.01"></label><br>
          <label>Music <input type="range" id="aMusic" min="0" max="0.8" step="0.01"></label><br>
          <label><input type="checkbox" id="sfxSuccess"> Success SFX</label><br>
          <label><input type="checkbox" id="sfxFail"> Fail SFX</label><br>
          <label><input type="checkbox" id="sfxStory"> Story SFX</label>
        </div>
      </div>

      <hr class="sep"/>

      <div class="grid2">
        <div>
          <h4>Live DM</h4>
          <p class="settings-note">Live narration enriches written free actions. Campaign decisions and rewards remain authored.</p>
          <label>Endpoint <input id="dmEndpoint" placeholder="/dm-turn" /></label><br>
          <button id="btnLiveToggle" class="btn">Toggle Live DM</button>
        </div>
        <div>
          <h4>Session</h4>
          <div class="btnrow">
            <button id="btnSave"   class="btn">Save</button>
            <button id="btnLoad"   class="btn">Load</button>
            <button id="btnExport" class="btn">Export</button>
            <button id="btnUndo"   class="btn">Undo</button>
            <button id="btnRestart" class="btn">Restart Run</button>
            <button id="btnResetAll" class="btn red">Reset Everything</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Lore scroll modal -->
  <div id="modalScroll" class="modal hidden">
    <header><div>The Weaver’s Scroll</div><div id="xScroll" class="closeX">✕</div></header>
    <div class="content" id="scrollContent"></div>
  </div>

  <!-- Epilogue / Game Over -->
  <div id="modalEpi" class="modal hidden">
    <header><div id="epiTitle">Epilogue</div><div id="xEpi" class="closeX">✕</div></header>
    <div class="content" id="epiContent"></div>
    <div class="modal-actions"><button id="btnEpiRestart" class="btn gold">New Run</button></div>
  </div>
  <div id="toastRegion" class="toast-region" aria-live="polite" aria-atomic="true"></div>
  </div>
  `;

  // cache
  document.querySelectorAll('.frame').forEach(el=>{['tl','tr','bl','br'].forEach(pos=>{const s=document.createElement('span'); s.className='chev '+pos; el.appendChild(s);});});
  Engine.el.story=$('#story'); Engine.el.choiceList=$('#choices'); Engine.el.choicesBox=$('.choices');
  Engine.el.freeText=$('#freeText'); Engine.el.btnAct=$('#btnAct'); Engine.el.btnCont=$('#btnCont');

  Engine.el.btnEnd=$('#btnEnd'); Engine.el.btnSettings=$('#btnSettings'); Engine.el.keysArc=$('#keysArc'); Engine.el.sceneHeading=$('#sceneHeading');

  Engine.el.charPanel=$('#charPanel'); Engine.el.charHeaderName=$('#charHeaderName'); Engine.el.charHeaderRace=$('#charHeaderRace'); Engine.el.hotbarPanel=$('#hotbarPanel'); Engine.el.ledgerPanel=$('#ledgerPanel'); Engine.el.objectivePanel=$('#objectivePanel'); Engine.el.btnJournal=$('#btnJournal');
  Engine.el.seedVal=$('#seedVal'); Engine.el.turnVal=$('#turnVal'); Engine.el.keysVal=$('#keysVal');
  Engine.el.saveStatus=$('#saveStatus'); Engine.el.weaveStatus=$('#weaveStatus'); Engine.el.toastRegion=$('#toastRegion');
  Engine.el.btnEdit=$('#btnEdit');
  Engine.el.btnInventory=$('#btnInventory');
  Engine.el.shade=$('#shade'); Engine.el.nowplay=$('#nowplay'); Engine.el.npTitle=$('#npTitle');

  // character modal refs
  Engine.el.modalEdit=$('#modalEdit'); Engine.el.xEdit=$('#xEdit');
  Engine.el.edName=$('#edName'); Engine.el.edRace=$('#edRace');
  Engine.el.edSTR=$('#edSTR'); Engine.el.edDEX=$('#edDEX'); Engine.el.edINT=$('#edINT'); Engine.el.edCHA=$('#edCHA');
  Engine.el.edHP=$('#edHP'); Engine.el.edGold=$('#edGold'); Engine.el.edInvAdd=$('#edInvAdd'); Engine.el.edInvList=$('#edInvList'); Engine.el.btnInvAdd=$('#btnInvAdd');
  Engine.el.btnAuto=$('#btnAuto'); Engine.el.btnEditSave=$('#btnEditSave'); Engine.el.btnEditCancel=$('#btnEditCancel');

  Engine.el.modalInventory=$('#modalInventory'); Engine.el.xInventory=$('#xInventory'); Engine.el.inventoryItems=$('#inventoryItems'); Engine.el.inventoryOverflow=$('#inventoryOverflow');
  Engine.el.qualityFilter=$('#qualityFilter'); Engine.el.categoryFilter=$('#categoryFilter'); Engine.el.inventorySort=$('#inventorySort'); Engine.el.capacityMeter=$('#capacityMeter'); Engine.el.itemTooltip=$('#itemTooltip'); Engine.el.equipmentStats=$('#equipmentStats');
  Engine.el.equipSlots=$$('.equip-slot');
  Engine.el.modalJournal=$('#modalJournal'); Engine.el.xJournal=$('#xJournal'); Engine.el.journalContent=$('#journalContent');
  Engine.el.modalMerchant=$('#modalMerchant'); Engine.el.xMerchant=$('#xMerchant'); Engine.el.merchantTitle=$('#merchantTitle'); Engine.el.merchantKicker=$('#merchantKicker'); Engine.el.merchantContent=$('#merchantContent');
  Engine.el.modalLost=$('#modalLost'); Engine.el.lostContent=$('#lostContent');

Engine.el.modalSet=$('#modalSet'); Engine.el.xSet=$('#xSet');
  Engine.el.twOn=$('#twOn'); Engine.el.twCps=$('#twCps');
  Engine.el.aMaster=$('#aMaster'); Engine.el.aUi=$('#aUi'); Engine.el.aMusic=$('#aMusic'); Engine.el.sfxSuccess=$('#sfxSuccess'); Engine.el.sfxFail=$('#sfxFail'); Engine.el.sfxStory=$('#sfxStory');
  Engine.el.dmEndpoint=$('#dmEndpoint'); Engine.el.btnLiveToggle=$('#btnLiveToggle');
  Engine.el.btnSave=$('#btnSave'); Engine.el.btnLoad=$('#btnLoad'); Engine.el.btnExport=$('#btnExport'); Engine.el.btnUndo=$('#btnUndo');
  Engine.el.btnRestart=$('#btnRestart'); Engine.el.btnResetAll=$('#btnResetAll'); Engine.el.hcMode=$('#hcMode');

  // scroll modal
  Engine.el.modalScroll=$('#modalScroll'); Engine.el.xScroll=$('#xScroll'); Engine.el.scrollContent=$('#scrollContent');

  // epilogue modal
  Engine.el.modalEpi=$('#modalEpi'); Engine.el.xEpi=$('#xEpi'); Engine.el.epiTitle=$('#epiTitle'); Engine.el.epiContent=$('#epiContent'); Engine.el.btnEpiRestart=$('#btnEpiRestart');
  enhanceCharacterSteppers();
}


/* ---------- floating Scroll button (SVG) ---------- */
function mountScrollFab(){
  if ($('#scrollFab')) return;
  const btn=document.createElement('button');
  btn.id='scrollFab';
  btn.className='scroll-btn';
  btn.style.display='block';
  btn.innerHTML = `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 8h36a6 6 0 0 1 6 6v30a6 6 0 0 1-6 6H22l-8 6v-6h-2a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z" />
      <path d="M18 18h28M18 28h22M18 38h26" />
    </svg>`;
  document.body.appendChild(btn);
  btn.addEventListener('click', ()=>{
    Engine.el.scrollContent.innerHTML = getIntroScrollHTML();
    openModal(Engine.el.modalScroll);
  });
}

/* ---------- storage ---------- */
const uniqueText=list=>[...new Set((Array.isArray(list)?list:[]).filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim()))];
function inferCampaignScene(saved){
  if(saved?.flags?.bossDealtWith) return 'unfathomer-decision';
  if(saved?.flags?.bossReady) return 'gate-approach';
  if(saved?.scene==='Depths') return 'depths-mullinen';
  if(saved?.scene==='Archives') return 'archives-lithen';
  return 'halls-briefing';
}
function normalizeCampaign(savedCampaign,saved){
  const d=defaultCampaign(), raw=savedCampaign||{}, sceneId=CAMPAIGN_SCENES[raw.sceneId]?raw.sceneId:inferCampaignScene(saved);
  return {
    ...d,...raw,version:CAMPAIGN_VERSION,sceneId,chapter:CAMPAIGN_SCENES[sceneId].chapter,objective:raw.objective||CAMPAIGN_SCENES[sceneId].objective,
    completedScenes:uniqueText(raw.completedScenes),completedEncounters:uniqueText(raw.completedEncounters),enteredScenes:uniqueText(raw.enteredScenes),
    discoveries:uniqueText(raw.discoveries),consequences:uniqueText(raw.consequences),optionalCompleted:uniqueText(raw.optionalCompleted),
    alliances:{...d.alliances,...(raw.alliances||{})},flags:{...d.flags,...(raw.flags||{})},rerollsUsed:{...(raw.rerollsUsed||{})},exploration:{...(raw.exploration||{})}
  };
}
function normalizeJournal(savedJournal,campaign){
  const raw=savedJournal||{};
  return {
    milestones:uniqueText(raw.milestones),
    discoveries:uniqueText([...(raw.discoveries||[]),...(campaign.discoveries||[])]),
    consequences:uniqueText([...(raw.consequences||[]),...(campaign.consequences||[])]),
    optional:uniqueText([...(raw.optional||[]),...(campaign.optionalCompleted||[])])
  };
}
function hydrate(){
  const saved=store.get('dds_state',null); if(!saved) return;
  const d=defaults();
  const savedFlags={...(saved.flags||{})};
  if(!Array.isArray(savedFlags.keys) && Array.isArray(savedFlags.seals)) savedFlags.keys=savedFlags.seals;
  delete savedFlags.seals;
  const savedAudio={...((saved.settings||{}).audio||{})};
  if(typeof savedAudio.music!=='number' && typeof savedAudio.amb==='number') savedAudio.music=savedAudio.amb;
  delete savedAudio.amb;
  delete savedAudio.drums;
  const legacyInventory=cleanInventory(saved.character?.inventory||d.character.inventory);
  const backpack=normalizeBackpack(saved.backpack,legacyInventory);
  const migratedInventory=backpackItems(backpack);
  const campaign=normalizeCampaign(saved.campaign,saved);
  Engine.state = {
    ...d, ...saved,
    saveVersion:SAVE_VERSION,
    character:{...d.character, ...(saved.character||{}), inventory:migratedInventory},
    backpack,
    equipment:normalizeEquipment(saved.equipment,migratedInventory),
    flags:{...d.flags, ...savedFlags},
    campaign,
    journal:normalizeJournal(saved.journal,campaign),
    settings:{...d.settings, ...(saved.settings||{}), audio:{...d.settings.audio, ...savedAudio}},
    live:{...d.live, ...(saved.live||{})},
    _choiceHistory:Array.isArray(saved._choiceHistory)?saved._choiceHistory:[],
    _lastChoices:Array.isArray(saved._lastChoices)?saved._lastChoices:[],
    _undoStack:Array.isArray(saved._undoStack)?saved._undoStack:[],
    _arcStep:saved._arcStep||0
  };
  Engine.state.character.MaxHP=Math.max(4,+saved.character?.MaxHP||+saved.character?.HP||d.character.MaxHP);
  Engine.state.scene=CAMPAIGN_SCENES[campaign.sceneId].title;
  Engine.loadedSave=true;
  store.set('dds_state',Engine.state);
}

function persistState(message='Progress stored'){
  Engine.state.saveVersion=SAVE_VERSION;
  syncInventoryState(Engine.state,true);
  store.set('dds_state',Engine.state);
  if(Engine.el.saveStatus){
    Engine.el.saveStatus.classList.add('saving');
    Engine.el.saveStatus.innerHTML='<span aria-hidden="true"></span> '+esc(message);
    clearTimeout(Engine.saveTimer);
    Engine.saveTimer=setTimeout(()=>Engine.el.saveStatus?.classList.remove('saving'),700);
  }
}
function setBusy(busy){
  Engine.busy=busy;
  [Engine.el.btnAct,Engine.el.btnCont].forEach(button=>{ if(button) button.disabled=busy; });
  if(Engine.el.weaveStatus){ Engine.el.weaveStatus.textContent=busy?'Weaving…':'Ready'; Engine.el.weaveStatus.classList.toggle('active',busy); }
}

function renderEditorInventory(){
  if(!Engine.el.edInvList) return;
  Engine.el.edInvList.innerHTML=Engine.inventoryDraft.length
    ? Engine.inventoryDraft.map((item,index)=>`<span class="inventory-edit-chip"><span>${esc(item)}</span><button type="button" data-remove-item="${index}" aria-label="Remove ${esc(item)}">&#10005;</button></span>`).join('')
    : '<span class="inventory-empty">No items in the field kit.</span>';
}
function addEditorItem(){
  const value=(Engine.el.edInvAdd.value||'').trim(); if(!value) return;
  if(!Engine.inventoryDraft.some(item=>item.toLowerCase()===value.toLowerCase())) Engine.inventoryDraft.push(value);
  Engine.el.edInvAdd.value=''; renderEditorInventory(); Engine.el.edInvAdd.focus();
}
function isTypingTarget(target){ return !!target?.closest?.('input, textarea, select, [contenteditable="true"]'); }
function inventoryOpen(){ return !!Engine.el.modalInventory && !Engine.el.modalInventory.classList.contains('hidden'); }
function openInventory(){
  if(!Engine.el.modalInventory || (Engine.el.intro && !Engine.el.intro.classList.contains('hidden'))) return;
  if($$('.modal:not(.hidden)').some(modal=>modal!==Engine.el.modalInventory)) return;
  Engine.selectedInventoryItem=null; renderInventory(); openModal(Engine.el.modalInventory);
  Engine.el.modalInventory.querySelector('.backpack-slot:not(.empty), .equip-slot, .closeX')?.focus();
}
function closeInventory(){ Engine.selectedInventoryItem=null; hideItemTooltip(true); closeModal(Engine.el.modalInventory); }
function equipItem(item,slot){
  const S=Engine.state, owned=S.character.inventory.includes(item), valid=itemMeta(item).slot===slot;
  if(!owned || !valid){ Sound.inventory('reject'); toast(`That item does not fit the ${EQUIPMENT_SLOTS.find(([key])=>key===slot)?.[1]||'equipment slot'}.`,'warning'); return false; }
  if(!meetsRequirements(item)){ Sound.inventory('reject'); toast(`You do not meet ${itemMeta(item).name}'s requirements.`,'warning'); return false; }
  const displaced=S.equipment[slot];
  for(const [key] of EQUIPMENT_SLOTS) if(S.equipment[key]===item) S.equipment[key]=null;
  S.equipment[slot]=item; Engine.selectedInventoryItem=null;
  hideItemTooltip(true); persistState(displaced?`${item} swapped into place`:`${item} equipped`); Sound.inventory(displaced?'swap':'place'); renderAll(); return true;
}
function unequipSlot(slot){
  if(!Engine.state.equipment[slot]) return;
  const item=Engine.state.equipment[slot];
  Engine.state.equipment[slot]=null; Engine.selectedInventoryItem=null; hideItemTooltip(true);
  persistState(`${item} returned to the pack`); Sound.inventory('place'); renderAll();
}

/* ---------- bind ---------- */
function bind(){
  const S=Engine.state;
  const open=m=>{ Engine.el.shade.classList.remove('hidden'); m.classList.remove('hidden'); };
  const close=m=>{ m.classList.add('hidden'); Engine.el.shade.classList.add('hidden'); };

  // character modal
  Engine.el.btnEdit.onclick=()=>{ const C=S.character;
    Engine.el.edName.value=C.name; Engine.el.edRace.value=C.race||'Dwarf';
    Engine.el.edSTR.value=C.STR; Engine.el.edDEX.value=C.DEX; Engine.el.edINT.value=C.INT; Engine.el.edCHA.value=C.CHA;
    Engine.el.edHP.value=C.HP; Engine.el.edGold.value=C.Gold;
    Engine.inventoryDraft=[...C.inventory]; Engine.el.edInvAdd.value=''; renderEditorInventory();
    open(Engine.el.modalEdit);
  };
  Engine.el.btnAuto.onclick=()=>{ autoGen(); Engine.el.btnEdit.onclick(); };
  Engine.el.btnInvAdd.onclick=addEditorItem;
  Engine.el.edInvAdd.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); addEditorItem(); } });
  Engine.el.edInvList.addEventListener('click',e=>{ const button=e.target.closest('[data-remove-item]'); if(!button) return; Engine.inventoryDraft.splice(+button.dataset.removeItem,1); renderEditorInventory(); });
  Engine.el.btnEditSave.onclick=()=>{ const C=S.character;
    C.name=Engine.el.edName.value||C.name; C.race=Engine.el.edRace.value||C.race;
    C.STR=+Engine.el.edSTR.value||C.STR; C.DEX=+Engine.el.edDEX.value||C.DEX; C.INT=+Engine.el.edINT.value||C.INT; C.CHA=+Engine.el.edCHA.value||C.CHA;
    C.HP=+Engine.el.edHP.value||C.HP; C.MaxHP=Math.max(C.HP,+C.MaxHP||C.HP); C.Gold=+Engine.el.edGold.value||C.Gold;
    C.inventory=cleanInventory(Engine.inventoryDraft);
    syncInventoryState(S);
    persistState('Character updated');
    close(Engine.el.modalEdit); renderAll();
  };
  Engine.el.btnEditCancel.onclick=()=>close(Engine.el.modalEdit);
  Engine.el.xEdit.onclick=()=>close(Engine.el.modalEdit);

  // field kit and equipment harness
  Engine.el.btnInventory.onclick=openInventory;
  Engine.el.hotbarPanel.addEventListener('click',openInventory);
  Engine.el.hotbarPanel.addEventListener('mouseover',e=>{ const item=e.target.closest('[data-item]'); if(item&&!Engine.tooltipPinned) showItemTooltip(item.dataset.item,item); });
  Engine.el.hotbarPanel.addEventListener('mouseout',()=>hideItemTooltip());
  Engine.el.hotbarPanel.addEventListener('focusin',e=>{ const item=e.target.closest('[data-item]'); if(item) showItemTooltip(item.dataset.item,item); });
  Engine.el.hotbarPanel.addEventListener('focusout',()=>hideItemTooltip());
  Engine.el.xInventory.onclick=closeInventory;
  Engine.el.qualityFilter.onchange=()=>{ Engine.inventoryView.quality=Engine.el.qualityFilter.value; renderInventory(); };
  Engine.el.categoryFilter.onchange=()=>{ Engine.inventoryView.category=Engine.el.categoryFilter.value; renderInventory(); };
  Engine.el.inventorySort.onchange=()=>{ Engine.inventoryView.sort=Engine.el.inventorySort.value; renderInventory(); };
  Engine.el.inventoryItems.addEventListener('click',e=>{
    const item=e.target.closest('[data-item]');
    if(!item){ Engine.selectedInventoryItem=null; Engine.tooltipSuppressedItem=null; hideItemTooltip(true); renderInventory(); return; }
    const name=item.dataset.item,now=performance.now();
    if(Engine.lastInventoryClick?.item===name&&now-Engine.lastInventoryClick.time<420){ Engine.lastInventoryClick=null; Engine.tooltipSuppressedItem=name; quickEquip(name); return; }
    Engine.lastInventoryClick={item:name,time:now};
    if(Engine.tooltipPinned&&Engine.tooltipItem===name){ Engine.selectedInventoryItem=null; Engine.tooltipSuppressedItem=name; hideItemTooltip(true); renderInventory(); return; }
    Engine.tooltipSuppressedItem=null; Engine.selectedInventoryItem=name; Engine.tooltipPinned=true; Sound.inventory('pickup'); renderInventory();
    const fresh=Engine.el.inventoryItems.querySelector(`[data-item="${CSS.escape(name)}"]`); fresh?.focus(); showItemTooltip(name,fresh||item,true);
  });
  Engine.el.inventoryItems.addEventListener('dblclick',e=>e.preventDefault());
  Engine.el.inventoryItems.addEventListener('mouseover',e=>{ const item=e.target.closest('[data-item]'); if(item&&!Engine.tooltipPinned&&Engine.tooltipSuppressedItem!==item.dataset.item) showItemTooltip(item.dataset.item,item); });
  Engine.el.inventoryItems.addEventListener('mouseout',e=>{ Engine.tooltipSuppressedItem=null; if(!e.relatedTarget?.closest?.('.item-tooltip')) hideItemTooltip(); });
  Engine.el.inventoryItems.addEventListener('focusin',e=>{ const item=e.target.closest('[data-item]'); if(item) showItemTooltip(item.dataset.item,item); });
  Engine.el.inventoryItems.addEventListener('focusout',()=>hideItemTooltip());
  Engine.el.inventoryItems.addEventListener('keydown',e=>{
    const current=e.target.closest('[data-grid-index]'); if(!current) return;
    const index=+current.dataset.gridIndex, columns=10;
    const nextIndex={ArrowLeft:index-1,ArrowRight:index+1,ArrowUp:index-columns,ArrowDown:index+columns,Home:0,End:BACKPACK_CAPACITY-1}[e.key];
    if(Number.isInteger(nextIndex)){ e.preventDefault(); const next=Engine.el.inventoryItems.querySelector(`[data-grid-index="${clamp(nextIndex,0,BACKPACK_CAPACITY-1)}"]`); if(next){ current.tabIndex=-1; next.tabIndex=0; next.focus(); if(!next.dataset.item){ Engine.selectedInventoryItem=null; hideItemTooltip(true); renderInventory(); Engine.el.inventoryItems.querySelector(`[data-grid-index="${clamp(nextIndex,0,BACKPACK_CAPACITY-1)}"]`)?.focus(); } } return; }
    const item=current.dataset.item;
    if(item&&(e.key==='q'||e.key==='Q')){ e.preventDefault(); quickEquip(item); }
    if(item&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); if(Engine.tooltipPinned&&Engine.tooltipItem===item){ Engine.selectedInventoryItem=null; hideItemTooltip(true); renderInventory(); return; } Engine.selectedInventoryItem=item; Engine.tooltipPinned=true; Sound.inventory('pickup'); renderInventory(); const fresh=Engine.el.inventoryItems.querySelector(`[data-item="${CSS.escape(item)}"]`); fresh?.focus(); showItemTooltip(item,fresh||current,true); }
  });
  Engine.el.inventoryItems.addEventListener('dragstart',e=>{
    const item=e.target.closest('[data-item]'); if(!item) return;
    Engine.selectedInventoryItem=item.dataset.item; e.dataTransfer.setData('text/plain',item.dataset.item); e.dataTransfer.effectAllowed='move'; Sound.inventory('pickup');
    Engine.el.equipSlots.forEach(slot=>{
      const compatible=itemMeta(Engine.selectedInventoryItem).slot===slot.dataset.slot;
      slot.classList.toggle('compatible',compatible); slot.classList.toggle('incompatible',!compatible);
    });
  });
  Engine.el.inventoryItems.addEventListener('dragend',()=>renderInventory());
  Engine.el.equipSlots.forEach(slot=>{
    slot.addEventListener('click',()=>{
      const key=slot.dataset.slot;
      if(Engine.selectedInventoryItem) equipItem(Engine.selectedInventoryItem,key); else unequipSlot(key);
    });
    slot.addEventListener('dragover',e=>{
      const item=Engine.selectedInventoryItem; if(!item) return;
      e.preventDefault();
      const compatible=itemMeta(item).slot===slot.dataset.slot;
      e.dataTransfer.dropEffect=compatible?'move':'none'; slot.classList.toggle('drag-ready',compatible);
    });
    slot.addEventListener('dragleave',()=>slot.classList.remove('drag-ready'));
    slot.addEventListener('drop',e=>{ e.preventDefault(); slot.classList.remove('drag-ready'); equipItem(e.dataTransfer.getData('text/plain')||Engine.selectedInventoryItem,slot.dataset.slot); });
    slot.addEventListener('mouseenter',()=>{ const item=Engine.state.equipment?.[slot.dataset.slot]; if(item&&!Engine.tooltipPinned) showItemTooltip(item,slot); });
    slot.addEventListener('mouseleave',()=>hideItemTooltip());
    slot.addEventListener('focus',()=>{ const item=Engine.state.equipment?.[slot.dataset.slot]; if(item) showItemTooltip(item,slot); });
    slot.addEventListener('blur',()=>hideItemTooltip());
  });
  Engine.el.inventoryOverflow.addEventListener('click',e=>{ const item=e.target.closest('[data-item]'); if(!item){ hideItemTooltip(true); return; } const name=item.dataset.item; if(Engine.tooltipPinned&&Engine.tooltipItem===name){ Engine.selectedInventoryItem=null; hideItemTooltip(true); return; } Engine.selectedInventoryItem=name; Engine.tooltipPinned=true; showItemTooltip(name,item,true); });

  Engine.el.btnJournal.onclick=openJournal; Engine.el.xJournal.onclick=()=>closeModal(Engine.el.modalJournal);
  Engine.el.xMerchant.onclick=()=>closeModal(Engine.el.modalMerchant);
  Engine.el.merchantContent.addEventListener('click',e=>{ const buy=e.target.closest('[data-buy]'),sell=e.target.closest('[data-sell]'); if(buy) buyMerchantItem(buy.dataset.buy); if(sell) sellMerchantItem(sell.dataset.sell); });
  Engine.el.lostContent.addEventListener('click',e=>{ const action=e.target.closest('[data-lost-action]')?.dataset.lostAction; if(action==='accept') acceptFailure(); else if(action==='gold'||action==='item') rerollFailure(action); });

  // settings
  if(Engine.el.hcMode){ Engine.el.hcMode.onchange=()=>{ document.body.classList.toggle('hc', Engine.el.hcMode.checked); }; }
  Engine.el.btnSettings.onclick=()=>{ Engine.el.twOn.checked=S.settings.typewriter; Engine.el.twCps.value=S.settings.cps; if(Engine.el.hcMode) Engine.el.hcMode.checked=document.body.classList.contains('hc');
    Engine.el.aMaster.value=S.settings.audio.master; Engine.el.aUi.value=S.settings.audio.ui; Engine.el.aMusic.value=S.settings.audio.music;
    Engine.el.dmEndpoint.value=S.live.endpoint; Engine.el.btnLiveToggle.textContent=S.live.on?'Turn Live DM Off':'Turn Live DM On';
    Engine.el.sfxSuccess.checked = (S.settings.audio.sfx_success!==false);
    Engine.el.sfxFail.checked    = (S.settings.audio.sfx_fail!==false);
    Engine.el.sfxStory.checked   = (S.settings.audio.sfx_story!==false);
    open(Engine.el.modalSet); };
  Engine.el.xSet.onclick=()=>close(Engine.el.modalSet);
  Engine.el.twOn.onchange=()=>{S.settings.typewriter=Engine.el.twOn.checked; store.set('dds_state',S);};
  Engine.el.twCps.onchange=()=>{S.settings.cps=clamp(+Engine.el.twCps.value||40,10,120); store.set('dds_state',S);};
  [Engine.el.aMaster,Engine.el.aUi,Engine.el.aMusic].forEach(sl=>sl.oninput=()=>{S.settings.audio.master=+Engine.el.aMaster.value; S.settings.audio.ui=+Engine.el.aUi.value; S.settings.audio.music=+Engine.el.aMusic.value; Sound.setLevels(); BGM.setLevel(S.settings.audio.music); store.set('dds_state',S);});
  Engine.el.dmEndpoint.onchange=()=>{S.live.endpoint=Engine.el.dmEndpoint.value.trim()||'/dm-turn'; store.set('dm_ep',S.live.endpoint);};
  Engine.el.btnLiveToggle.onclick=()=>{ S.live.on=!S.live.on; store.set('dm_on',S.live.on); Engine.el.btnLiveToggle.textContent=S.live.on?'Turn Live DM Off':'Turn Live DM On'; const tag=$('#engineTag'); if(tag) tag.textContent=S.live.on?'Live':'Local'; };
  Engine.el.sfxSuccess.onchange=()=>{S.settings.audio.sfx_success=Engine.el.sfxSuccess.checked; store.set('dds_state',S);};
  Engine.el.sfxFail.onchange=()=>{S.settings.audio.sfx_fail=Engine.el.sfxFail.checked; store.set('dds_state',S);};
  Engine.el.sfxStory.onchange=()=>{S.settings.audio.sfx_story=Engine.el.sfxStory.checked; store.set('dds_state',S);};
  Engine.el.btnSave.onclick=()=>{ persistState('Game saved'); toast('Game saved'); };
  Engine.el.btnLoad.onclick=()=>{ if(store.get('dds_state',null)) location.reload(); else toast('No saved game'); };
  Engine.el.btnExport.onclick=exportTranscript;
  Engine.el.btnUndo.onclick=()=>{ undoTurn(); close(Engine.el.modalSet); };
  Engine.el.btnRestart.onclick=()=>{ close(Engine.el.modalSet); hardResetRun(); };
  Engine.el.btnResetAll.onclick=()=>{ close(Engine.el.modalSet); store.clearProject(); location.reload(); };

  // scroll modal
  Engine.el.xScroll.onclick=()=>close(Engine.el.modalScroll);

  // epilogue modal
  Engine.el.xEpi.onclick=()=>close(Engine.el.modalEpi);
  Engine.el.btnEpiRestart.onclick=()=>{ close(Engine.el.modalEpi); hardResetRun(); };

  // global overlay close
  Engine.el.shade.onclick=()=>{ if(Engine.el.modalLost&&!Engine.el.modalLost.classList.contains('hidden')) return; [Engine.el.modalEdit,Engine.el.modalInventory,Engine.el.modalJournal,Engine.el.modalMerchant,Engine.el.modalSet,Engine.el.modalScroll,Engine.el.modalEpi].forEach(m=>m?.classList.add('hidden')); Engine.el.shade.classList.add('hidden'); Engine.selectedInventoryItem=null; hideItemTooltip(true); };
  document.addEventListener('pointerdown',e=>{ if(!Engine.tooltipPinned||e.target.closest('[data-item],.item-tooltip')) return; Engine.selectedInventoryItem=null; hideItemTooltip(true); if(inventoryOpen()) renderInventory(); });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ if(Engine.el.modalLost&&!Engine.el.modalLost.classList.contains('hidden')){ toast('Choose a recovery option to continue','warning'); return; } Engine.el.shade.onclick(); return; }
    if(e.key.toLowerCase()==='q'&&inventoryOpen()&&!isTypingTarget(e.target)&&Engine.selectedInventoryItem){ e.preventDefault(); quickEquip(Engine.selectedInventoryItem); return; }
    if(e.key.toLowerCase()==='j'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!isTypingTarget(e.target)){ e.preventDefault(); Engine.el.modalJournal.classList.contains('hidden')?openJournal():closeModal(Engine.el.modalJournal); return; }
    if(e.key.toLowerCase()==='e' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget(e.target)){
      e.preventDefault(); inventoryOpen()?closeInventory():openInventory();
    }
  });

  // main actions
  Engine.el.btnCont.onclick=()=>{ if(Engine.busy) return; if(!Engine.state.storyBeats || !Engine.state.storyBeats.length){ beginTale(Engine.loadedSave); return; } const recommended=makeChoiceSet().find(choice=>choice.type!=='merchant')||makeChoiceSet()[0]; if(recommended) resolveChoice(recommended); };
  Engine.el.btnAct.onclick=()=>{ if(!Engine.busy) freeText(); };
  Engine.el.freeText.addEventListener('keydown',e=>{ if(e.key==='Enter') freeText(); });

  Engine.el.btnEnd.onclick=endTale;
  document.addEventListener('keydown', (e)=>{
  if (e.shiftKey && e.key.toLowerCase() === 'd'){
    const t = document.getElementById('npTitle')?.textContent || '—';
    alert(`BGM: ${t}`);
  }
});
}

/* ---------- render ---------- */
function qualityClass(meta){ return `quality-${QUALITY_ORDER.includes(meta.quality)?meta.quality:'common'}`; }
function equippedSlotFor(item,E=Engine.state.equipment){ return EQUIPMENT_SLOTS.find(([key])=>E?.[key]===item)?.[0]||null; }
function compareStats(meta,current){
  const keys=['power','armor','resilience'];
  return keys.map(key=>{ const value=meta.stats?.[key]||0, old=current?.stats?.[key]||0, delta=value-old; return `<span class="comparison ${delta>0?'up':delta<0?'down':'same'}"><small>${key}</small><b>${value}</b><em>${delta===0?'same':`${delta>0?'+':''}${delta}`}</em></span>`; }).join('');
}
function tooltipHTML(item){
  const meta=itemMeta(item), slotLabel=EQUIPMENT_SLOTS.find(([key])=>key===meta.slot)?.[1]||'Accessory';
  const currentName=Engine.state.equipment?.[meta.slot], current=currentName&&currentName!==item?itemMeta(currentName):null;
  const req=Object.entries(meta.requirements||{});
  return `<div class="tooltip-rail ${qualityClass(meta)}"></div><div class="tooltip-heading"><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><div><strong>${esc(meta.name)}</strong><span>${QUALITY_LABEL[meta.quality]||'Common'} ${esc(meta.category)}</span></div>${meta.relic?'<b class="relic-seal" title="Relic provenance">RELIC</b>':''}</div>
    <div class="tooltip-tags"><span>${slotLabel}</span><span>${meta.value} gold</span>${equippedSlotFor(item)?'<span>Equipped</span>':''}</div>
    <div class="tooltip-stats">${compareStats(meta,current)}</div>
    ${current?`<p class="tooltip-compare">Compared with <strong>${esc(currentName)}</strong></p>`:''}
    <p class="tooltip-mechanic">${esc(meta.mechanic)}</p><p class="tooltip-lore">${esc(meta.lore)}</p>
    <div class="tooltip-requirements"><strong>Requirements</strong> ${req.length?req.map(([stat,min])=>`<span class="${(+Engine.state.character[stat]||0)>=min?'met':'unmet'}">${stat} ${min}</span>`).join(''):'<span class="met">None</span>'}</div>
    <div class="tooltip-state">${!meetsRequirements(item)?'Requirements not met':equippedSlotFor(item)?'Equipped and ready':`Fits the ${slotLabel.toLowerCase()} slot`}</div>`;
}
function positionItemTooltip(anchor){
  const tip=Engine.el.itemTooltip; if(!tip||!anchor) return;
  const rect=anchor.getBoundingClientRect(), margin=12, width=tip.offsetWidth||330, height=tip.offsetHeight||360;
  let left=rect.right+margin, top=rect.top;
  if(left+width>innerWidth-margin) left=rect.left-width-margin;
  if(left<margin) left=Math.max(margin,innerWidth-width-margin);
  top=clamp(top,margin,Math.max(margin,innerHeight-height-margin));
  tip.style.left=`${left}px`; tip.style.top=`${top}px`;
}
function showItemTooltip(item,anchor,pinned=false){
  if(!item||!Engine.el.itemTooltip) return;
  Engine.tooltipPinned=pinned||Engine.tooltipPinned; Engine.tooltipItem=item; Engine.el.itemTooltip.innerHTML=tooltipHTML(item); Engine.el.itemTooltip.classList.remove('hidden'); positionItemTooltip(anchor);
}
function hideItemTooltip(force=false){ if(!Engine.el.itemTooltip||(!force&&Engine.tooltipPinned)) return; Engine.tooltipPinned=false; Engine.tooltipItem=null; Engine.el.itemTooltip.classList.add('hidden'); }
function quickEquip(item){ const slot=itemMeta(item).slot; if(Engine.state.equipment?.[slot]===item) unequipSlot(slot); else equipItem(item,slot); }
function renderInventory(){
  const S=Engine.state, E=S.equipment||blankEquipment(), pack=normalizeBackpack(S.backpack,S.character.inventory), equipped=new Set(Object.values(E).filter(Boolean));
  S.backpack=pack; S.character.inventory=backpackItems(pack);
  const items=S.character.inventory;
  if(Engine.el.hotbarPanel){
    const quick=items.slice(0,6);
    Engine.el.hotbarPanel.classList.toggle('has-overflow',items.length>6);
    Engine.el.hotbarPanel.innerHTML=Array.from({length:6},(_,index)=>{ const item=quick[index]; if(!item) return `<button class="hotbar-slot empty" aria-label="Empty field kit slot ${index+1}"><span class="hotbar-index">${index+1}</span></button>`; const meta=itemMeta(item); return `<button class="hotbar-slot ${qualityClass(meta)}${equipped.has(item)?' equipped':''}" data-item="${esc(item)}" aria-label="${esc(item)}, ${QUALITY_LABEL[meta.quality]}${equipped.has(item)?', equipped':''}"><span class="hotbar-index">${index+1}</span><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><span>${esc(item)}</span>${meta.relic?'<i class="relic-pip" aria-label="Relic">R</i>':''}</button>`; }).join('');
  }
  if(!Engine.el.inventoryItems) return;
  const categories=[...new Set(items.map(item=>itemMeta(item).category))].sort();
  const categoryValue=Engine.inventoryView.category;
  Engine.el.categoryFilter.innerHTML='<option value="all">All categories</option>'+categories.map(category=>`<option value="${esc(category)}">${esc(category)}</option>`).join('');
  Engine.el.categoryFilter.value=categories.includes(categoryValue)?categoryValue:'all'; Engine.inventoryView.category=Engine.el.categoryFilter.value;
  Engine.el.qualityFilter.value=Engine.inventoryView.quality; Engine.el.inventorySort.value=Engine.inventoryView.sort;
  let ordered=pack.slots.map((item,index)=>({item,index}));
  const visible=entry=>!entry.item||(Engine.inventoryView.quality==='all'||(Engine.inventoryView.quality==='relic'?itemMeta(entry.item).relic:itemMeta(entry.item).quality===Engine.inventoryView.quality))&&(Engine.inventoryView.category==='all'||itemMeta(entry.item).category===Engine.inventoryView.category);
  if(Engine.inventoryView.sort!=='pack'){
    const occupied=ordered.filter(entry=>entry.item&&visible(entry));
    occupied.sort((a,b)=>{ const A=itemMeta(a.item),B=itemMeta(b.item); if(Engine.inventoryView.sort==='name') return A.name.localeCompare(B.name); if(Engine.inventoryView.sort==='quality') return QUALITY_ORDER.indexOf(B.quality)-QUALITY_ORDER.indexOf(A.quality)||A.name.localeCompare(B.name); return B.value-A.value||A.name.localeCompare(B.name); });
    ordered=[...occupied,...Array(Math.max(0,BACKPACK_CAPACITY-occupied.length)).fill(null).map((_,index)=>({item:null,index:occupied.length+index}))];
  }
  Engine.el.inventoryItems.innerHTML=ordered.map((entry,displayIndex)=>{ const item=entry.item, filtered=item&&!visible(entry); if(!item||filtered) return `<button class="backpack-slot empty${filtered?' filtered':''}" role="gridcell" data-grid-index="${displayIndex}" aria-label="${filtered?'Filtered item':'Empty backpack slot'} ${displayIndex+1}" tabindex="${displayIndex===0?'0':'-1'}">${filtered?'<span aria-hidden="true">·</span>':''}</button>`; const meta=itemMeta(item), selected=Engine.selectedInventoryItem===item; return `<button class="backpack-slot ${qualityClass(meta)}${selected?' selected':''}${equipped.has(item)?' equipped':''}${meta.relic?' relic':''}" role="gridcell" draggable="true" data-item="${esc(item)}" data-grid-index="${displayIndex}" aria-label="${esc(item)}, ${QUALITY_LABEL[meta.quality]} ${esc(meta.category)}${equipped.has(item)?', equipped':''}${meta.relic?', relic':''}" aria-pressed="${selected}" tabindex="${displayIndex===0?'0':'-1'}"><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><small>${esc(item)}</small>${equipped.has(item)?'<b class="equipped-mark" aria-label="Equipped slot">S</b>':''}${meta.relic?'<i class="relic-pip" aria-hidden="true">R</i>':''}</button>`; }).join('');
  const used=pack.slots.filter(Boolean).length;
  Engine.el.capacityMeter.textContent=`${used} / ${BACKPACK_CAPACITY} slots${pack.overflow.length?` · ${pack.overflow.length} overflow`:''}`;
  Engine.el.capacityMeter.classList.toggle('near-limit',used>=BACKPACK_CAPACITY-4);
  Engine.el.inventoryOverflow.innerHTML=pack.overflow.length?`<strong>Overflow tray · ${pack.overflow.length}</strong><div>${pack.overflow.map(item=>{const meta=itemMeta(item);return `<button class="overflow-item ${qualityClass(meta)}" data-item="${esc(item)}">${meta.glyph} ${esc(item)}</button>`;}).join('')}</div><p>Nothing is lost. Clear a backpack slot before adding more items.</p>`:'';
  Engine.el.equipSlots.forEach(slot=>{
    const key=slot.dataset.slot, label=EQUIPMENT_SLOTS.find(([name])=>name===key)?.[1]||key, item=E[key], meta=item&&itemMeta(item);
    const selected=Engine.selectedInventoryItem, compatible=selected&&itemMeta(selected).slot===key&&meetsRequirements(selected);
    slot.className=`equip-slot slot-${key==='mainHand'?'main':key==='offHand'?'off':key}${item?` occupied ${qualityClass(meta)}`:''}${compatible?' compatible':''}${selected&&!compatible?' incompatible':''}`;
    slot.innerHTML=`<span class="slot-label">${label}</span>${item?`<span class="item-glyph" aria-hidden="true">${meta.glyph}</span><strong>${esc(item)}</strong>${meta.relic?'<i class="relic-pip" aria-hidden="true">R</i>':''}`:'<strong>Empty slot</strong>'}`;
    slot.setAttribute('aria-label',item?`${label}: ${item}. Select to unequip.`:compatible?`${label}: equip ${selected}`:`${label}: empty`);
  });
  const stats=derivedStats(S);
  Engine.el.equipmentStats.innerHTML=`<span><small>Power</small><strong>${stats.power}</strong></span><span><small>Armor</small><strong>${stats.armor}</strong></span><span><small>Resilience</small><strong>${stats.resilience}</strong></span>`;
}

function renderAll(){
  const s=Engine.state, C=s.character, F=s.flags;
  $('#seedVal').textContent=s.seed; $('#turnVal').textContent=s.turn;
  Engine.el.keysVal.textContent=`${(F.keys||[]).length} / 3`;
  Engine.el.sceneHeading.textContent=s.scene;
  Engine.el.charHeaderName.textContent=C.name;
  Engine.el.charHeaderRace.textContent=C.race;
  if(Engine.el.objectivePanel){
    const chapter=CAMPAIGN_CHAPTERS[s.campaign?.chapter]||CAMPAIGN_CHAPTERS.halls;
    Engine.el.objectivePanel.innerHTML=`<span>${chapter.act} · ${chapter.label}</span><strong>${esc(s.campaign?.objective||'Awaiting a new commission.')}</strong>`;
  }

  const mounted=EQUIPMENT_SLOTS.filter(([key])=>s.equipment?.[key]);
  const gearQuality=slot=>s.equipment?.[slot]?qualityClass(itemMeta(s.equipment[slot])):'';
  const stats=derivedStats(s), hpMax=Math.max(4,+C.MaxHP||+C.HP||4), hpPct=clamp(Math.round((C.HP/hpMax)*100),0,100);
  const condition=hpPct>70?'Steady':hpPct>35?'Wounded':hpPct>0?'Critical':'Fallen';
  Engine.el.charPanel.innerHTML = `
    <div class="rig-stage" aria-label="Live equipment view">
      <div class="rig-silhouette" aria-hidden="true"><span class="rig-head ${gearQuality('head')}"></span><span class="rig-torso ${gearQuality('chest')}"></span><span class="rig-arm left ${gearQuality('mainHand')}"></span><span class="rig-arm right ${gearQuality('offHand')}"></span><span class="rig-leg left ${gearQuality('legs')}"></span><span class="rig-leg right ${gearQuality('feet')}"></span></div>
      <div class="rig-readout">${mounted.length?mounted.slice(0,5).map(([key,label])=>`<span><small>${label}</small>${esc(s.equipment[key])}</span>`).join(''):'<span class="unmounted"><small>Harness</small>No gear equipped</span>'}</div>
    </div>
    <div class="stat-grid">
      <div><span>STR</span><strong>${C.STR}</strong><small>${fmt(modFrom(C.STR))}</small></div>
      <div><span>DEX</span><strong>${C.DEX}</strong><small>${fmt(modFrom(C.DEX))}</small></div>
      <div><span>INT</span><strong>${C.INT}</strong><small>${fmt(modFrom(C.INT))}</small></div>
      <div><span>CHA</span><strong>${C.CHA}</strong><small>${fmt(modFrom(C.CHA))}</small></div>
    </div>
    <div class="derived-summary"><span><small>Power</small><b>${stats.power}</b></span><span><small>Armor</small><b>${stats.armor}</b></span><span><small>Resilience</small><b>${stats.resilience}</b></span></div>
    <div class="hp-readout"><div><span>Condition: ${condition}</span><b>${C.HP} HP</b></div><span class="hp-track"><i style="width:${hpPct}%"></i></span></div>
    <div class="vitals"><span>Gold <b>${C.Gold}</b></span><span>Gear <b>${mounted.length} / 8</b></span></div>`;

  renderInventory();

  // The ledger records discoveries; possessions live in the field kit.
  const lines = [];
  if (F.rumors) lines.push(`<div class="ledger-line"><span>Rumors heard</span><b>Yes</b></div>`);
  if ((F.keys||[]).length) lines.push(`<div class="ledger-line"><span>Keys</span><b>${(F.keys||[]).map(esc).join(', ')}</b></div>`);
  if (F.bossReady) lines.push(`<div class="ledger-line"><span>Gate ready</span><b>Yes</b></div>`);
  if (F.bossDealtWith) lines.push(`<div class="ledger-line"><span>Unfathomer resolved</span><b>${esc(s.campaign?.ending?.title||'Yes')}</b></div>`);
  (s.campaign?.discoveries||[]).slice(-2).forEach(discovery=>lines.push(`<div class="ledger-line"><span>Discovery</span><b>${esc(discovery)}</b></div>`));
  Engine.el.ledgerPanel.innerHTML = lines.join('') || '<div class="ledger-empty">No discoveries inscribed.</div>';


  // Keys ring arc
  try{
    const keysCt = (F.keys||[]).length; const circ = 2*Math.PI*40; const frac = Math.min(1, keysCt/3);
    const dash = Math.max(0.0001, circ*frac);
    if(Engine.el.keysArc){ Engine.el.keysArc.setAttribute('stroke-dasharray', `${dash} ${circ-dash}`); }
  }catch{}
  // Story

  Engine.el.story.innerHTML='';
  for(const beat of s.storyBeats){
    const p=document.createElement('p');
    p.classList.add('beat');
    p.innerHTML=beat.html?sanitizeRichHTML(beat.html):esc(beat.text);
    if(beat.roll){ const g=document.createElement('span'); g.className='rollglyph'; g.textContent=' ⟡'; g.title=beat.roll; p.appendChild(g); }
    if(beat.kind==='success'){ p.classList.add('glow-success'); const rg=p.querySelector('.rollglyph'); if(rg) rg.style.color='#D5A84A'; }
    if(beat.kind==='fail'){ p.classList.add('glow-fail'); const rg=p.querySelector('.rollglyph'); if(rg) rg.style.color='#A12525'; }
    if(beat.kind==='story') p.classList.add('glow-story');
    Engine.el.story.appendChild(p);
  }
  Engine.el.story.scrollTop=Engine.el.story.scrollHeight;

  if (s.settings.typewriter && s._pendingType){
    const p=Engine.el.story.lastElementChild;
    if (p && !p.dataset.typed){ p.dataset.typed='1'; typewriteRich(p, s.settings.cps); }
    s._pendingType=false;
  }
}

/* ---------- legacy prototype flow retained for save archaeology ---------- */
function legacyBeginTale(preserveProgress=false){
  const S=Engine.state;
  S.turn=0; S.scene='Halls'; S.storyBeats=[]; S.transcript=[]; S._choiceHistory=[]; S._lastChoices=[]; S._undoStack=[]; S._arcStep=0;
  if(!preserveProgress) S.flags={rumors:false,keys:[],bossReady:false,bossDealtWith:false};
  else S.flags={rumors:false,keys:[],bossReady:false,bossDealtWith:false,...S.flags};
  appendBeat("Lanterns cast steady light across carved lintels and iron mosaics. Wardens report that the Unfathomer is rising through the buried cisterns. You stand at the entrance to the Halls, where three marked corridors lead deeper into Brassreach.");
  renderChoices(makeChoiceSet(S.scene));
  S.turn++; renderAll(); persistState('Journey begun'); BGM.updateForState(Engine.state);
}
function legacyEndTale(){
  const S=Engine.state, C=S.character;
  const ep = `Epilogue — You leave with ${C.Gold} gold and ${C.inventory.length} items. Keys recovered: ${S.flags.keys.join(', ')||'none'}. ` +
    (S.flags.bossDealtWith?'The Unfathomer has fallen silent. For the first time in weeks, Brassreach sleeps without tremors.':'The Unfathomer still moves below the streets. In the ale halls, people speak of your descent and wonder whether you will return.');
  appendBeat(ep); renderChoices([]); renderAll();
  Engine.el.epiTitle.textContent='Epilogue';
  Engine.el.epiContent.textContent=ep;
  openModal(Engine.el.modalEpi);
}
function legacyUndoTurn(){
  const S=Engine.state, previous=S._undoStack?.pop();
  if(!previous){ toast('Nothing to undo'); return; }
  Object.assign(S,previous,{_undoStack:S._undoStack});
  renderChoices(makeChoiceSet(S.scene)); renderAll(); BGM.updateForState(S);
}

function legacyHardResetRun(){
  const S=Engine.state, fresh=defaults();
  fresh.settings={...fresh.settings,...S.settings,audio:{...fresh.settings.audio,...S.settings.audio}};
  fresh.live={...fresh.live,...S.live};
  Object.keys(S).forEach(k=>delete S[k]);
  Object.assign(S,fresh);
  beginTale();
  store.set('dds_state',S);
  toast('New run started');
}

/* ---------- choices ---------- */
function legacyRenderChoices(choices){
  const list=Engine.el.choiceList; if(!list) return;

  if (!Array.isArray(Engine.state._choiceHistory)) Engine.state._choiceHistory=[];
  if (!Array.isArray(Engine.state._lastChoices))   Engine.state._lastChoices=[];

  const hist=Engine.state._choiceHistory, pool=[...(choices||[])];
  list.innerHTML='';
  if(!pool.length){ Engine.state._lastChoices=[]; return; }
  const fresh=pool.filter(c=>!hist.includes(c.id));
  let picked=[];
  if(fresh.length){ picked.push(pick(fresh)); const rest=pool.filter(c=>c.id!==picked[0].id); if(rest.length) picked.push(pick(rest)); }
  else{ picked=[pick(pool)]; const second=pool.filter(c=>c.id!==picked[0]?.id); if(second.length) picked.push(pick(second)); }
  hist.push(...picked.map(c=>c.id)); while(hist.length>10) hist.shift();

  const prev=Engine.state._lastChoices;
  if(picked.map(c=>c.sentence).join('|')===prev.join('|')) picked=modulateChoices(picked);
  Engine.state._lastChoices=picked.map(c=>c.sentence);

  picked.forEach(ch=>{
    const btn=document.createElement('button'); btn.className='choice-btn'; btn.textContent=ch.sentence;
    btn.onclick=()=>{ Sound.click(); resolveChoice(ch); };
    list.appendChild(btn);
  });
}
function modulateChoices(arr){
  const suffix=[' — carefully',' — quickly',' — without drawing attention',' — by a safer route'];
  return arr.map(c=>({ ...c, sentence: c.sentence.replace(/\s+—.*$/,'') + suffix[rnd(0,suffix.length-1)] }));
}

/* ---------- narration ---------- */
function legacyFreeText(){
  const text=(Engine.el.freeText.value||'').trim(); if(!text) return;
  Engine.el.freeText.value='';
  const italic=`<em>${esc(text)}</em>`;
  doNarrate({ sentence:`You attempt this action: ${italic}.` });
}
function legacyDoNarrate(ch){
  if(Engine.busy) return; setBusy(true);
  const payload={ action:ch.sentence, source:'narrate', stat:null, dc:null, passed:null, game_state:snapshotState(), history:recentHistory() };
  Promise.resolve(Weaver.turn(payload, localTurn)).then(resp=>applyTurn(resp,null)).catch(()=>applyTurn(localTurn(payload),null)).finally(()=>setBusy(false));
}

/* ---------- resolve ---------- */
function legacyResolveChoice(ch){
  if(Engine.busy) return; setBusy(true);
  const S=Engine.state, C=S.character;
  const stat=ch.stat||'INT', mod=modFrom(C[stat]||10); const dc=clamp(11+rnd(-1,3),8,18); const r=rnd(1,20); const total=r+mod; const passed=(total>=dc);
  const payload={ action:ch.sentence, source:'choice', stat, dc, passed, game_state:snapshotState(), history:recentHistory() };
  Promise.resolve(Weaver.turn(payload, localTurn)).then(resp=>applyTurn(resp,{r,mod,dc,total})).catch(()=>applyTurn(localTurn(payload),{r,mod,dc,total})).finally(()=>setBusy(false));
}
function applyTurn(resp,roll){
  const S=Engine.state;
  S._undoStack=S._undoStack||[];
  S._undoStack.push(captureRunState(S));
  while(S._undoStack.length>20) S._undoStack.shift();
  if(resp?.flags_patch){
    const patch={...resp.flags_patch};
    if(!Array.isArray(patch.keys) && Array.isArray(patch.seals)) patch.keys=patch.seals;
    delete patch.seals;
    Object.assign(S.flags,patch);
  }
  if(!Array.isArray(S.flags.keys)) S.flags.keys=[];
  if(resp?.inventory_delta){
    const add=resp.inventory_delta.add||[], rem=resp.inventory_delta.remove||[];
    S.character.inventory=cleanInventory(S.character.inventory.filter(x=>!rem.includes(x)).concat(add));
    syncInventoryState(S);
  }
  if(typeof resp?.gold_delta==='number'){ S.character.Gold=Math.max(0,S.character.Gold+resp.gold_delta); }
  if(typeof resp?.hp_delta==='number'){ S.character.HP=clamp(S.character.HP+resp.hp_delta,0,S.character.MaxHP||S.character.HP); }
  if(resp?.scene) S.scene=resp.scene;
  if(!S.flags.bossReady && S.flags.keys.length>=2) S.flags.bossReady=true;

  const kind = roll ? (roll.total>=roll.dc ? 'success':'fail') : 'story';
  const html = resp?.story_paragraph_html ? sanitizeRichHTML(resp.story_paragraph_html) : null;
  appendBeat(resp?.story_paragraph || '(silence)', roll?`d20 ${roll.r} ${fmt(roll.mod)} vs DC ${roll.dc} ⇒ ${roll.total}`:null, kind, html);
  Sound.sfx(kind);

  if (S.character.HP<=0){
    // modal epilogue
    const dead = "Your strength fails, and your lantern falls dark. Word of your last stand reaches the upper city, but the Unfathomer continues to move below.";
    Engine.el.epiTitle.textContent = 'Fallen in the Depths';
    Engine.el.epiContent.textContent = dead;
    openModal(Engine.el.modalEpi);
    renderChoices([]);
    S.turn++; renderAll(); persistState('Turn stored'); BGM.updateForState(Engine.state); return;
  }

  const next=(resp?.next_choices && resp.next_choices.length)?resp.next_choices:makeChoiceSet(S.scene);
  renderChoices(next); S.turn++; renderAll(); persistState('Turn stored'); BGM.updateForState(Engine.state);
}

/* ---------- local DM with four-beat spine ---------- */
function localTurn(payload){
  const {action,passed,stat,source,game_state}=payload; const S=game_state;
  const keys=S.flags.keys||[]; const have=new Set(keys);
  let story=''; let flags_patch={}; let inv={add:[],remove:[]}; let gold_delta=0, hp_delta=0; let scene=S.scene;

  if(source==='choice'){
    if(passed){ if(rnd(1,10)<=4) gold_delta+=rnd(1,3); if(rnd(1,10)===1) hp_delta+=1; if(rnd(1,10)<=2) inv.add.push(pick(['Oil Flask','Lockpin','Rope Coil','Canteen'])); }
    else{ hp_delta-= (rnd(1,10)<=7?1:2); if(rnd(1,10)<=2) gold_delta-=rnd(0,2); }
  }

  let award=null; if(source==='choice' && passed && have.size<3 && rnd(1,6)===1){ const pool=['Brass','Echo','Stone'].filter(x=>!have.has(x)); if(pool.length) award=pick(pool); }
  if(award) flags_patch.keys=[...keys, award];

  if(source==='narrate'){
    const aText = stripHTML(action||'').trim();
    if(scene==='Halls'){
      const steps=[
        "You examine the oldest chisel marks and find unused survey anchors. A clear echo confirms that the wall ahead is hollow, so you mark it with chalk.",
        "You compare local rumors and draw a usable route: take the salt-covered stair, then follow the culvert where lantern smoke pulls sideways. A maintenance ledger should be waiting below.",
        "A Warden's chalk note matches an Archivist's correction. Both records point to a cold iron door at the end of the lower passage."
      ];
      const seg = steps[Math.min(Engine.state._arcStep, steps.length-1)];
      story = aText ? `${aText} ${seg}` : seg;
      Engine.state._arcStep++; if(Engine.state._arcStep>=3){ scene='Archives'; }
    }else if(scene==='Archives'){
      const steps=[
        "Air moves through the tall shelves with a low whistle. You copy a cadence chart that marks three safe chambers and one dangerous ventilation shaft.",
        "Lithen's notes describe a trial in the cistern fields. Her warning is clear: enter with a working channel map and never answer a voice you cannot locate.",
        "A technical drawing shows three collars on the Gate of Measures. Each is labeled for one Key: Stone, Brass, or Echo."
      ];
      const seg = steps[Math.min(Engine.state._arcStep-3, steps.length-1)];
      story = aText ? `${aText} ${seg}` : seg;
      Engine.state._arcStep++; if(Engine.state._arcStep>=6){ scene='Depths'; }
    }else if(scene==='Depths'){
      const steps=[
        "The air grows cold, and water strikes the channel walls in steady pulses. You test the stone ahead and confirm that it can bear your weight.",
        "Two water channels meet here, but silt blocks the left branch. You clear the obstruction, and the machinery below resumes a steady hum.",
        "The Gate of Measures stands in the next gallery. Its three collars are dark, and its iron handwheel has not moved in years."
      ];
      const seg = steps[Math.min(Engine.state._arcStep-6, steps.length-1)];
      story = aText ? `${aText} ${seg}` : seg;
      Engine.state._arcStep++;
      if(!S.flags.bossReady && (keys.length>=2)) flags_patch.bossReady=true;
      if(Engine.state._arcStep>=9 && (S.flags.bossReady || (flags_patch.bossReady===true))) story+=" The Gate is ready. Your next decision may determine the fate of the city.";
    }else{
      const seg = "The corridor ends at a junction. Water is rising, so you must choose a route quickly.";
      story = aText ? `${aText} ${seg}` : seg;
    }
  }

  if(!story){
    const success={STR:"You force the obstacle aside and clear the route.", DEX:"You cross without making enough noise to draw attention.", INT:"You identify the pattern and choose the correct mechanism.", CHA:"Your direct argument wins cooperation."}[stat||'INT'];
    const fail={STR:"The mechanism holds, and the effort leaves you exposed.", DEX:"Loose grit slides under your boot and alerts a nearby patrol.", INT:"You follow the wrong sequence and trigger a warning bell.", CHA:"Your argument fails, and the other party ends the discussion."}[stat||'INT'];
    const tail=award?` The ${award} Key unlocks and warms in your hand.`:"";
    const rumor=" You also learn that the strongest disturbances come from the eastern cisterns."; flags_patch.rumors = true;
    story=`${stripHTML(action||'')}${action?' ':''}${passed?success:fail}${tail}${rumor}`;
  }

  const next_choices=makeChoiceSet(scene);
  return { story_paragraph:story, flags_patch, inventory_delta:inv, gold_delta, hp_delta, scene, next_choices };
}

/* ---------- choice pools ---------- */
function legacyMakeChoiceSet(scene){
  const sets={
    Halls:[
      {id:'h-int', sentence:'Study the water pulses and find a safe crossing (INT)', stat:'INT'},
      {id:'h-str', sentence:'Brace the flood gate while the water rises (STR)', stat:'STR'},
      {id:'h-cha', sentence:'Persuade the clerk to release restricted maps (CHA)', stat:'CHA'},
      {id:'h-dex', sentence:'Slip past the patrol and reach the culvert maps (DEX)', stat:'DEX'}
    ],
    Depths:[
      {id:'d-str', sentence:'Force the gate open far enough to pass (STR)', stat:'STR'},
      {id:'d-int', sentence:'Set the correct Measure on the gate controls (INT)', stat:'INT'},
      {id:'d-cha', sentence:'Address the Unfathomer and offer clear terms (CHA)', stat:'CHA'}
    ],
    Archives:[
      {id:'a-int', sentence:'Compare the ledgers and trace the missing shipment (INT)', stat:'INT'},
      {id:'a-dex', sentence:'Climb quietly to the sealed upper shelves (DEX)', stat:'DEX'}
    ]
  };
  return (sets[scene]||sets.Halls).slice(0);
}

/* ---------- authored campaign flow (overrides the legacy prototype above) ---------- */
function currentScene(){ return CAMPAIGN_SCENES[Engine.state.campaign?.sceneId]||CAMPAIGN_SCENES['halls-briefing']; }
function addJournal(kind,text){
  if(!text) return;
  const C=Engine.state.campaign,J=Engine.state.journal,campaignKey=kind==='optional'?'optionalCompleted':kind;
  if(Array.isArray(C[campaignKey])&&!C[campaignKey].includes(text)) C[campaignKey].push(text);
  if(Array.isArray(J[kind])&&!J[kind].includes(text)) J[kind].push(text);
}
function grantItem(name,reason){
  if(!name) return false;
  const S=Engine.state;
  if(S.character.inventory.some(item=>item.toLowerCase()===name.toLowerCase())) return false;
  S.character.inventory=cleanInventory([...S.character.inventory,name]); syncInventoryState(S);
  appendBeat(`${reason||'You add it to your field case'} Item acquired: ${name}.`,null,'story');
  toast(`${name} added to the field case`); return true;
}
function applyEffects(effect={}){
  const S=Engine.state,C=S.campaign;
  if(typeof effect.gold==='number'){ S.character.Gold=Math.max(0,S.character.Gold+effect.gold); if(effect.gold) toast(`${effect.gold>0?'+':''}${effect.gold} gold`); }
  if(typeof effect.hp==='number'){ S.character.HP=clamp(S.character.HP+effect.hp,1,S.character.MaxHP||S.character.HP); if(effect.hp<0) toast(`${Math.abs(effect.hp)} HP lost`,'warning'); }
  if(effect.item) grantItem(effect.item.name||effect.item,effect.item.reason);
  (effect.items||[]).forEach(item=>grantItem(item.name||item,item.reason));
  if(effect.key){
    S.flags.keys=uniqueText([...(S.flags.keys||[]),effect.key]);
    if(effect.keyReason) appendBeat(`${effect.keyReason} Key acquired: ${effect.key}.`,null,'story');
    toast(`${effect.key} Key recovered`);
  }
  if(effect.flag) C.flags[effect.flag]=true;
  Object.entries(effect.flags||{}).forEach(([key,value])=>{ C.flags[key]=value; });
  Object.entries(effect.alliance||{}).forEach(([key,value])=>{ C.alliances[key]=(C.alliances[key]||0)+value; });
  addJournal('discoveries',effect.discovery); addJournal('consequences',effect.consequence); addJournal('optional',effect.optional); addJournal('milestones',effect.milestone);
  S.flags.bossReady=(S.flags.keys||[]).length>=2;
}
function pushUndo(){
  const S=Engine.state; S._undoStack=S._undoStack||[]; S._undoStack.push(captureRunState(S));
  while(S._undoStack.length>24) S._undoStack.shift();
}
function enterScene(sceneId,{appendStory=true}={}){
  const S=Engine.state,C=S.campaign,next=CAMPAIGN_SCENES[sceneId]; if(!next) return;
  const previous=C.sceneId;
  if(previous&&previous!==sceneId&&!C.completedScenes.includes(previous)) C.completedScenes.push(previous);
  C.sceneId=sceneId; C.chapter=next.chapter; C.objective=next.objective; S.scene=next.title;
  const firstEntry=!C.enteredScenes.includes(sceneId);
  if(appendStory) appendBeat(next.story,null,'story');
  if(firstEntry){ C.enteredScenes.push(sceneId); applyEffects(next.enter||{}); }
  renderChoices(next.choices); S.turn++; renderAll(); persistState('Objective updated'); BGM.updateForState(S);
}
function beginTale(preserveProgress=false){
  const S=Engine.state;
  S.turn=0; S.storyBeats=[]; S.transcript=[]; S._choiceHistory=[]; S._lastChoices=[]; S._undoStack=[]; S._arcStep=0;
  if(!preserveProgress){ S.flags={rumors:false,keys:[],bossReady:false,bossDealtWith:false}; S.campaign=defaultCampaign(); S.journal=defaultJournal(); }
  else{ S.flags={rumors:false,keys:[],bossReady:false,bossDealtWith:false,...S.flags}; S.campaign=normalizeCampaign(S.campaign,S); S.journal=normalizeJournal(S.journal,S.campaign); }
  enterScene(S.campaign.sceneId||'halls-briefing');
}
function endTale(){
  const S=Engine.state,C=S.character,ending=S.campaign.ending;
  const ep=ending?.text||`You return from ${currentScene().title} with ${C.Gold} gold, ${C.inventory.length} carried items, and ${(S.flags.keys||[]).length} recovered Keys. The expedition remains unfinished, and the Unfathomer still waits below Brassreach.`;
  if(!ending) appendBeat(ep,null,'story'); renderChoices([]); renderAll();
  Engine.el.epiTitle.textContent=ending?.title||'Expedition Retired'; Engine.el.epiContent.textContent=ep; openModal(Engine.el.modalEpi);
}
function undoTurn(){
  const S=Engine.state,previous=S._undoStack?.pop(); if(!previous){ toast('Nothing to undo'); return; }
  Object.assign(S,previous,{_undoStack:S._undoStack}); renderChoices(makeChoiceSet()); renderAll(); persistState('Turn restored'); BGM.updateForState(S);
}
function hardResetRun(){
  const S=Engine.state,fresh=defaults(); fresh.settings={...fresh.settings,...S.settings,audio:{...fresh.settings.audio,...S.settings.audio}}; fresh.live={...fresh.live,...S.live};
  Object.keys(S).forEach(key=>delete S[key]); Object.assign(S,fresh); beginTale(); store.set('dds_state',S); toast('New run started');
}

function choiceBonusBreakdown(ch){
  const S=Engine.state,C=S.character,campaign=S.campaign,owned=new Set(C.inventory),equipped=new Set(Object.values(S.equipment||{}).filter(Boolean));
  const parts=[]; let total=ch.stat?modFrom(C[ch.stat]||10):0;
  if(ch.stat) parts.push({label:ch.stat,value:total,base:true});
  for(const bonus of (ch.bonuses||[])){
    let active=false,value=bonus.bonus||0,label=bonus.label||bonus.item||'advantage';
    if(bonus.item&&owned.has(bonus.item)){ active=true; if(equipped.has(bonus.item)){ value+=1; label+=', equipped'; } }
    if(bonus.derived&&derivedStats(S)[bonus.derived]>=bonus.threshold) active=true;
    if(bonus.flag&&campaign.flags?.[bonus.flag]) active=true;
    if(bonus.alliance&&(campaign.alliances?.[bonus.alliance]||0)>0) active=true;
    if(bonus.keys&&(S.flags.keys||[]).length>=bonus.keys) active=true;
    if(active){ total+=value; parts.push({label,value}); }
  }
  return {total,parts};
}
function modifierText(ch){
  if(ch.type!=='check'&&ch.type!=='ending') return ch.type==='merchant'?'Merchant · buy and sell':'No roll';
  const active=choiceBonusBreakdown(ch).parts.map(part=>`${part.label} ${fmt(part.value)}`); return `DC ${ch.dc} · ${active.join(' · ')}`;
}
function renderChoices(choices){
  const list=Engine.el.choiceList; if(!list) return; list.innerHTML='';
  const pool=Array.isArray(choices)?choices:[]; Engine.state._lastChoices=pool.map(ch=>ch.id);
  pool.forEach((ch,index)=>{
    const btn=document.createElement('button'); btn.className=`choice-btn choice-${ch.type||'check'}${index===0?' recommended':''}`;
    btn.innerHTML=`<span class="choice-label">${esc(ch.label||ch.sentence)}</span><small>${esc(modifierText(ch))}</small>`;
    btn.dataset.choiceId=ch.id; btn.onclick=()=>{ Sound.click(); resolveChoice(ch); }; list.appendChild(btn);
  });
}

function freeText(){ const text=(Engine.el.freeText.value||'').trim(); if(!text) return; Engine.el.freeText.value=''; doNarrate({sentence:text}); }
function campaignExplorationText(ch){
  const S=Engine.state,scene=currentScene(),count=S.campaign.exploration[scene.id]||0;
  const context={
    halls:['You find fresh boot marks leading toward the lower route, but no safer passage than the one already marked.','The nearby masonry is damp but stable. The next pressure pulse will arrive soon.'],
    archives:['The shelves confirm the same transfer route recorded in the active objective. Nothing here changes the immediate danger.','A marginal note supports Lithen’s account and warns against delaying near the open shaft.'],
    depths:['Cold water carries the Gate’s four-beat pulse through the floor. Your chosen route remains the only usable way forward.','You secure a loose strap and mark the return path. The hazard ahead has not moved.'],
    gate:['The Gate answers with a low mechanical note. Its controls still await the decision named in your objective.'],
    unfathomer:['The vast presence listens, but the current Measure remains unanswered.']
  };
  const lines=context[scene.chapter]||context.halls,line=lines[count%lines.length]; S.campaign.exploration[scene.id]=count+1;
  return `You ${ch.sentence.replace(/^you\s+/i,'')}. ${line}`;
}
function commitExploration(text,html=null){ appendBeat(text,null,'story',html); Engine.state.turn++; renderAll(); persistState('Exploration stored'); }
function doNarrate(ch){
  if(Engine.busy) return; setBusy(true); pushUndo();
  const fallbackText=campaignExplorationText(ch);
  if(!Engine.state.live.on){ commitExploration(fallbackText); setBusy(false); return; }
  const payload={action:ch.sentence,source:'narrate',stat:null,dc:null,passed:null,game_state:snapshotState(),history:recentHistory()};
  const fallback=()=>({story_paragraph:fallbackText});
  Promise.resolve(Weaver.turn(payload,fallback)).then(resp=>{
    const text=resp?.story_paragraph||fallbackText,html=resp?.story_paragraph_html?sanitizeRichHTML(resp.story_paragraph_html):null;
    commitExploration(stripHTML(text),html);
  }).catch(()=>commitExploration(fallbackText)).finally(()=>setBusy(false));
}

function resolveChoice(ch){
  if(Engine.busy||!ch) return;
  if(ch.type==='merchant'){ openMerchant(ch.merchant); return; }
  pushUndo();
  if(ch.type==='advance'){ appendBeat(ch.outcome||'You move on.',null,'story'); applyEffects(ch.effects||{}); enterScene(ch.next); return; }
  setBusy(true);
  const bonus=choiceBonusBreakdown(ch),roll=rnd(1,20),total=roll+bonus.total,result={roll,total,dc:ch.dc,bonus,passed:total>=ch.dc};
  if(!result.passed){ openLostEncounter(ch,result); setBusy(false); return; }
  completeCheckedChoice(ch,result,true); setBusy(false);
}
function markEncounter(ch){
  const id=ch.encounter||ch.id,C=Engine.state.campaign;
  if(id&&!C.completedEncounters.includes(id)) C.completedEncounters.push(id);
  if(ch.bossPhase) C.bossPhase=Math.max(C.bossPhase,ch.bossPhase);
}
function rollLabel(result){
  const extras=result.bonus.parts.slice(1).map(part=>`${part.label} ${fmt(part.value)}`).join(', ');
  return `d20 ${result.roll} ${fmt(result.bonus.parts[0]?.value||0)}${extras?` + ${extras}`:''} vs DC ${result.dc} = ${result.total}`;
}
function completeCheckedChoice(ch,result,passed){
  markEncounter(ch); appendBeat(passed?(ch.success||'The attempt succeeds.'):(ch.failure||'The attempt fails, but the expedition continues.'),rollLabel(result),passed?'success':'fail');
  const effects=ch.effects?(ch.effects[passed?'success':'failure']||{}):{}; applyEffects(effects); Sound.sfx(passed?'success':'fail');
  if(ch.type==='ending'){ finalizeEnding(ch.ending,passed,result); return; }
  enterScene(passed?(ch.nextSuccess||ch.next):(ch.nextFail||ch.next));
}
function eligibleSacrifices(){
  const equipped=new Set(Object.values(Engine.state.equipment||{}).filter(Boolean));
  return Engine.state.character.inventory.filter(name=>{ const meta=itemMeta(name); return !equipped.has(name)&&!meta.relic&&!['Key','Quest'].includes(meta.category); });
}
function failureCost(){ const order=['halls','archives','depths','gate','unfathomer'],index=Math.max(0,order.indexOf(Engine.state.campaign.chapter)); return 4+(index*2); }
function openLostEncounter(ch,result){
  const id=ch.encounter||ch.id,used=!!Engine.state.campaign.rerollsUsed[id],cost=failureCost(),items=eligibleSacrifices(); Engine.pendingFailure={ch,result,id,cost};
  Engine.el.lostContent.innerHTML=`<p id="lostSummary">${esc(ch.failure||'The attempt fails, but the expedition can continue.')}</p><div class="lost-roll"><span>Result</span><strong>${esc(rollLabel(result))}</strong></div><p class="lost-copy">Accept the consequence, or pay once to make a new attempt. Keys, relics, quest items, and equipped gear are protected.</p><div class="lost-options"><button class="btn gold" data-lost-action="gold" ${used||Engine.state.character.Gold<cost?'disabled':''}>Spend ${cost} gold<br><small>${used?'Reroll already used':`${Engine.state.character.Gold} available`}</small></button><button class="btn" data-lost-action="item" ${used||!items.length?'disabled':''}>Risk a random item<br><small>${items.length} eligible</small></button><button class="btn red" data-lost-action="accept">Accept consequence<br><small>The story moves forward</small></button></div>`;
  openModal(Engine.el.modalLost); Engine.el.modalLost.querySelector('button:not([disabled])')?.focus();
}
function closeLost(){ Engine.pendingFailure=null; closeModal(Engine.el.modalLost); }
function acceptFailure(){ const pending=Engine.pendingFailure; if(!pending) return; closeLost(); completeCheckedChoice(pending.ch,pending.result,false); }
function rerollFailure(method){
  const pending=Engine.pendingFailure; if(!pending) return; const S=Engine.state; if(S.campaign.rerollsUsed[pending.id]) return; let payment='';
  if(method==='gold'){ if(S.character.Gold<pending.cost) return; S.character.Gold-=pending.cost; payment=`You pay ${pending.cost} gold for another attempt.`; }
  else{ const eligible=eligibleSacrifices(); if(!eligible.length) return; const lost=pick(eligible); S.character.inventory=S.character.inventory.filter(item=>item!==lost); syncInventoryState(S); payment=`You abandon ${lost} to recover your position and try again.`; }
  S.campaign.rerollsUsed[pending.id]=true; appendBeat(payment,null,'story');
  const bonus=choiceBonusBreakdown(pending.ch),roll=rnd(1,20),total=roll+bonus.total+1,result={roll,total,dc:pending.ch.dc,bonus:{...bonus,parts:[...bonus.parts,{label:'resolve',value:1}]},passed:total>=pending.ch.dc},ch=pending.ch;
  closeLost(); completeCheckedChoice(ch,result,result.passed);
}
function finalizeEnding(id,passed,result){
  const S=Engine.state,ending=ENDINGS[id]||ENDINGS.bind,keys=(S.flags.keys||[]).length; let text=passed?ending.success:ending.failure;
  text+=keys===3?' With all three Keys intact, the Gate records the decision clearly and leaves no hidden clause.':' Two Keys were enough to decide the crisis, but the missing Tone circuit leaves part of the old mechanism unreadable.';
  S.campaign.ending={id,title:ending.title,text,passed,roll:rollLabel(result)}; S.flags.bossDealtWith=true; S.campaign.objective='The expedition is complete.';
  addJournal('milestones',ending.title); appendBeat(text,rollLabel(result),passed?'success':'fail'); renderChoices([]); S.turn++; renderAll(); persistState('Epilogue stored');
  Engine.el.epiTitle.textContent=ending.title; Engine.el.epiContent.textContent=text; openModal(Engine.el.modalEpi); BGM.updateForState(S);
}

function openMerchant(id){ Engine.activeMerchant=MERCHANTS[id]; if(!Engine.activeMerchant) return; renderMerchant(); openModal(Engine.el.modalMerchant); }
function merchantBuyPrice(name){ return Math.max(1,Math.ceil(itemMeta(name).value*.65)); }
function merchantSellPrice(name){ return Math.max(1,Math.floor(itemMeta(name).value*.45)); }
function canSell(name){ const meta=itemMeta(name); return !Object.values(Engine.state.equipment||{}).includes(name)&&!meta.relic&&!['Key','Quest'].includes(meta.category); }
function renderMerchant(){
  const merchant=Engine.activeMerchant;if(!merchant) return; const S=Engine.state; Engine.el.merchantTitle.textContent=merchant.name; Engine.el.merchantKicker.textContent=merchant.title;
  const stock=merchant.stock.map(name=>{ const meta=itemMeta(name),price=merchantBuyPrice(name),owned=S.character.inventory.includes(name); return `<article class="trade-item ${qualityClass(meta)}"><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><div><strong>${esc(name)}</strong><small>${QUALITY_LABEL[meta.quality]} ${esc(meta.category)} · ${price} gold</small><p>${esc(meta.mechanic)}</p></div><button class="btn mini" data-buy="${esc(name)}" ${owned||S.character.Gold<price?'disabled':''}>${owned?'Owned':'Buy'}</button></article>`; }).join('');
  const sellable=S.character.inventory.map(name=>{ const meta=itemMeta(name),allowed=canSell(name); return `<article class="trade-item ${qualityClass(meta)}"><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><div><strong>${esc(name)}</strong><small>${merchantSellPrice(name)} gold</small></div><button class="btn mini" data-sell="${esc(name)}" ${allowed?'':'disabled'}>${allowed?'Sell':'Protected'}</button></article>`; }).join('')||'<p class="merchant-empty">Your field case is empty.</p>';
  Engine.el.merchantContent.innerHTML=`<div class="merchant-intro"><p>${esc(merchant.greeting)}</p><strong>${S.character.Gold} gold</strong></div><div class="trade-columns"><section><h4>For Sale</h4>${stock}</section><section><h4>Your Field Case</h4>${sellable}</section></div>`;
}
function buyMerchantItem(name){ const price=merchantBuyPrice(name),S=Engine.state;if(S.character.Gold<price||S.character.inventory.includes(name)) return; S.character.Gold-=price; grantItem(name,`${Engine.activeMerchant.name} sells it to you for ${price} gold.`); persistState('Purchase stored'); renderAll(); renderMerchant(); Sound.inventory('place'); }
function sellMerchantItem(name){ if(!canSell(name)) return; const S=Engine.state,price=merchantSellPrice(name); S.character.inventory=S.character.inventory.filter(item=>item!==name); S.character.Gold+=price; syncInventoryState(S); appendBeat(`${Engine.activeMerchant.name} buys ${name} for ${price} gold.`,null,'story'); persistState('Sale stored'); renderAll(); renderMerchant(); Sound.inventory('pickup'); }
function renderJournal(){
  const C=Engine.state.campaign,J=Engine.state.journal,scene=currentScene(),chapter=CAMPAIGN_CHAPTERS[C.chapter]||CAMPAIGN_CHAPTERS.halls;
  const section=(title,items,empty)=>`<section><h4>${title}</h4>${items.length?`<ol>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ol>`:`<p class="journal-empty">${empty}</p>`}</section>`;
  Engine.el.journalContent.innerHTML=`<div class="journal-current"><span>${chapter.act} · ${chapter.label}</span><h3>${esc(scene.title)}</h3><p>${esc(C.objective)}</p></div><div class="journal-grid">${section('Milestones',J.milestones,'No milestones recorded yet.')}${section('Discoveries',J.discoveries,'No discoveries recorded yet.')}${section('Consequences',J.consequences,'No lasting consequences yet.')}${section('Optional Work',J.optional,'No optional work recorded yet.')}</div>`;
}
function openJournal(){ renderJournal(); openModal(Engine.el.modalJournal); }
function makeChoiceSet(){ return currentScene().choices||[]; }

/* ---------- helpers ---------- */
function appendBeat(text, roll, kind=null, html=null){
  const entry= html?{html:sanitizeRichHTML(html),roll,kind}:{text,roll,kind};
  Engine.state.storyBeats.push(entry);
  Engine.state.transcript.push(html?strip(html):text);
  Engine.state._pendingType=true;
}
function captureRunState(S){
  return JSON.parse(JSON.stringify({
    seed:S.seed, turn:S.turn, scene:S.scene,
    storyBeats:S.storyBeats, transcript:S.transcript,
    character:S.character, backpack:S.backpack, equipment:S.equipment, flags:S.flags, campaign:S.campaign, journal:S.journal,
    _choiceHistory:S._choiceHistory, _lastChoices:S._lastChoices,
    _arcStep:S._arcStep, _pendingType:false
  }));
}
function snapshotState(){ const S=Engine.state; return {character:S.character, backpack:S.backpack, equipment:S.equipment, flags:S.flags, campaign:S.campaign, journal:S.journal, scene:S.scene, turn:S.turn}; }
function recentHistory(){ const T=Engine.state.transcript; return T.slice(Math.max(0,T.length-10)); }
function fmt(n){ return (n>=0?'+':'')+n; }
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[c])); }
function strip(html){ const d=document.createElement('div'); d.innerHTML=html; return d.textContent||''; }
function stripHTML(s){ const d=document.createElement('div'); d.innerHTML=s; return d.textContent||''; }
function sanitizeRichHTML(html){
  const source=document.createElement('template');
  source.innerHTML=String(html||'');
  const allowed=new Set(['EM','STRONG','B','I','SPAN','BR']);

  const clean=node=>{
    if(node.nodeType===Node.TEXT_NODE) return document.createTextNode(node.textContent||'');
    if(node.nodeType!==Node.ELEMENT_NODE) return document.createDocumentFragment();

    const children=document.createDocumentFragment();
    node.childNodes.forEach(child=>children.appendChild(clean(child)));
    if(!allowed.has(node.tagName)) return children;

    const el=document.createElement(node.tagName.toLowerCase());
    if(node.tagName==='SPAN' && node.classList.contains('gloss')){
      el.className='gloss';
      const def=node.getAttribute('data-def');
      if(def) el.setAttribute('data-def',def);
    }
    el.appendChild(children);
    return el;
  };

  const output=document.createElement('div');
  source.content.childNodes.forEach(node=>output.appendChild(clean(node)));
  return output.innerHTML;
}
function autoGen(){ const n=['Eldan','Brassa','Keled','Varek','Moriah','Thrain','Ysolda','Kael']; const C=Engine.state.character;
  C.name=pick(n); C.race=pick(['Dwarf','Human','Elf','Gnome','Halfling','Orc']); C.STR=rnd(8,18); C.DEX=rnd(8,18); C.INT=rnd(8,18); C.CHA=rnd(8,18); C.HP=rnd(8,20); C.MaxHP=C.HP; C.Gold=rnd(0,25); C.inventory=['Torch','Canteen','Oil Flask','Rope Coil','Lockpin'].sort(()=>Math.random()-.5).slice(0,rnd(1,3)); Engine.state.equipment=blankEquipment(); syncInventoryState(Engine.state); renderAll(); }
function toast(txt,tone='info'){ const region=Engine.el.toastRegion||document.body; while(region.children.length>=4) region.firstElementChild?.remove(); const t=document.createElement('div'); t.className=`toast ${tone}`; t.textContent=txt; region.appendChild(t); requestAnimationFrame(()=>t.classList.add('show')); setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),240); },2400); }
function exportTranscript(){ const S=Engine.state; const html=`<!doctype html><meta charset="utf-8"><title>Story Transcript</title><style>body{font:16px Georgia,serif;margin:32px;color:#222}h1{font:700 22px system-ui,Segoe UI,Roboto,sans-serif}.meta{color:#555;margin-bottom:14px}p{line-height:1.55}</style><h1>Brassreach — Transcript</h1><div class="meta">Engine: ${S.live.on?'Live':'Local'} · Seed ${S.seed} · Turns ${S.turn}</div>${S.transcript.map(t=>`<p>${esc(t)}</p>`).join('')}`; const blob=new Blob([html],{type:'text/html'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='brassreach_transcript.html'; a.click(); URL.revokeObjectURL(url); }

/* ---------- rich typewriter (preserves glossary and roll markup) ---------- */
function typewriteRich(p, cps=40){
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const clone = p.cloneNode(true);
  p.textContent=''; p.classList.add('reveal');
  const cursor=document.createElement('span'); cursor.className='cursor'; p.appendChild(cursor);
  cursor.innerHTML = '<span class="smoke"></span>';
  const queue=[];
  clone.childNodes.forEach(n=>{
    if(n.nodeType===3){
      const t=n.textContent||'';
      for(const ch of t) queue.push({kind:'ch', ch});
    }else if(n.nodeType===1){
      queue.push({kind:'el', el:n});
    }
  });

  let idx=0;
  const tick=()=>{
    if(!p.isConnected||cursor.parentNode!==p){ cursor.remove(); return; }
    const step=Math.max(1,Math.round(cps/10));
    for(let k=0;k<step;k++){
      if(idx>=queue.length){ cursor.remove(); return; }
      const item=queue[idx++];
      if(item.kind==='ch'){
        const s=document.createElement('span'); s.className='ch on'; s.textContent=item.ch;
        p.insertBefore(s, cursor);
        if(/[\.!\?]/.test(s.textContent)) break;
      }else{
        p.insertBefore(item.el, cursor);
      }
    }
    cursor.innerHTML='<span class="smoke"></span>';
    setTimeout(tick, 1000/Math.max(10,cps));
  };
  setTimeout(tick, 80);
}

/* ---------- intro content helpers ---------- */
function getIntroSlidesHTML(){
  return `
  <div id="intro" class="intro">
    <section class="slide s1 active" data-side="img-left" aria-label="Slide 1">
      <div class="img" aria-hidden="true"></div>
      <div class="copy"><div class="scroll">
        <p>Lanterns burn across the terraces of <span class="gloss" data-def="A tiered dwarven city built above reservoirs and service vaults.">Brassreach</span>. Beneath the streets lies the <span class="gloss" data-def="Service tunnels and machines beneath Brassreach.">under-works</span>, a network of tuned caverns built by the city's founders. Dwarves record important deeds as law, and the delvers who carry those records are called <span class="gloss" data-def="Delvers who record important deeds for the city.">thread-bearers</span>. You enter the <span class="gloss" data-def="The upper civic tunnels where new expeditions begin.">Halls</span>. Water moves beneath the floor, and old survey marks lead toward the <span class="gloss" data-def="Underground reservoirs that supply Brassreach.">cisterns</span>. Wardens test the walls for faults while Archivists record every warning. Brassreach needs someone willing to descend.</p>
      </div></div>
      <div class="nav"><button class="btn secondary" id="introSkip1">Skip</button><button class="btn gold intro-next">Continue ▸</button></div>
      <div class="mist" aria-hidden="true"></div>
    </section>

    <section class="slide s2" data-side="img-left" aria-label="Slide 2">
      <div class="img" aria-hidden="true"></div>
      <div class="copy"><div class="scroll">
        <p>Far below, the <span class="gloss" data-def="A powerful presence moving through the water and stone below the city.">Unfathomer</span> gathers in the dark. It behaves like a <span class="gloss" data-def="Many tones acting together as one force.">chorus</span> trained by centuries of bells. The <span class="gloss" data-def="The old law that kept the city’s channels and gates in tune.">Cadence Law</span> once kept it quiet, but poor repairs have broken the city's harmony. Three ancient instruments may restore control: the <span class="gloss" data-def="Stone, Brass, and Echo activate different parts of the Gate.">Three Keys</span>—<span class="gloss" data-def="Stone governs Weight, burden, and consequence.">Stone</span>, <span class="gloss" data-def="Brass governs Tone and harmony.">Brass</span>, and <span class="gloss" data-def="Echo governs Pattern, memory, and return.">Echo</span>. <span class="gloss" data-def="A Lower Stacks Archivist who believes honest terms can prevent conflict.">Lithen the Wise</span> wants a treaty. <span class="gloss" data-def="A Brassworks Warden who favors strong repairs and sealed channels.">Mullinen the Stout</span> wants iron clamps and decisive force. You must choose which counsel to trust.</p>
      </div></div>
      <div class="nav"><button class="btn secondary" id="introBack2">◂ Back</button><button class="btn gold intro-next">Continue ▸</button></div>
      <div class="mist" aria-hidden="true"></div>
    </section>

    <section class="slide s3" data-side="img-left" aria-label="Slide 3">
      <div class="img" aria-hidden="true"></div>
      <div class="copy"><div class="scroll">
        <p>Rumor places the <span class="gloss" data-def="An ancient engine and covenant chamber in the cistern fields.">Gate of Measures</span> in the cistern fields. Your route leads through the <span class="gloss" data-def="The upper tunnels where expeditions begin.">Halls</span>, into the <span class="gloss" data-def="A guarded library of records, oaths, and engineering charts.">Archives</span>, and down to the <span class="gloss" data-def="Flooded galleries where the Unfathomer is strongest.">Depths</span>. At chambers with clear <span class="gloss" data-def="A stable harmony between voices or machines.">resonance</span>, you may <span class="gloss" data-def="Restrain the Unfathomer with a repaired covenant.">bind</span> the Unfathomer, <span class="gloss" data-def="Make terms that both sides agree to honor.">bargain</span> with it, or <span class="gloss" data-def="Drive it away and accept the damage left behind.">banish</span> it. Gather the Keys, record what you learn, and watch your footing. Your decisions will determine what survives below Brassreach.</p>
      </div></div>
      <div class="nav"><button class="btn secondary" id="introBack3">◂ Back</button><button class="btn gold intro-begin">Begin Story</button></div>
      <div class="mist" aria-hidden="true"></div>
    </section>
  </div>`;
}

function getIntroScrollHTML(){
  return `
    <hr class="sep"/>
    <div class="quick-tables">
      <h4>Field Codex: Keys and Measures</h4>
      <div class="grid2">
        <div>
          <h5>Three Keys</h5>
          <ul>
            <li><b>Stone Key</b> — Controls Weight: foundations, burdens, oaths, and consequences.</li>
            <li><b>Brass Key</b> — Controls Tone: resonance and harmony between mechanisms.</li>
            <li><b>Echo Key</b> — Controls Pattern: memory, repetition, law, and return.</li>
          </ul>
          <p><em>Two</em> Keys wake the Gate; <em>all three</em> open the richest endings.</p>
        </div>
        <div>
          <h5>Four Measures</h5>
          <ul>
            <li><b>Weight / Stone</b> — What a structure, oath, or decision must carry.</li>
            <li><b>Tone / Brass</b> — How voices and mechanisms work together.</li>
            <li><b>Pattern / Echo</b> — What repeats, returns, or becomes law.</li>
            <li><b>Line / Thread</b> — The direction fixed by a binding decision.</li>
          </ul>
          <p>The city answers to four old Measures, but no path through them is predetermined.</p>
        </div>
      </div>
      <h5>Known Hazards</h5>
      <ul><li>A flood pulse can block a route without warning.</li><li>Warden patrols may challenge unauthorized delvers.</li><li>Old mechanisms can shift floors and open sealed channels.</li></ul>
    </div>`;
}


/* ---------- modal helpers ---------- */
function openModal(m){ if(!m) return; Engine.el.shade.classList.remove('hidden'); m.classList.remove('hidden'); }
function closeModal(m){ if(!m) return; m.classList.add('hidden'); Engine.el.shade.classList.add('hidden'); }

  // --- Asset base for GitHub Pages (project path safe) ---
(() => {
  // Resolve to the directory holding index.html (works on GH Pages subpaths)
  const base = (document.querySelector('base')?.href) ||
               (location.origin + location.pathname.replace(/\/[^/]*$/, '/') );
  document.documentElement.style.setProperty('--ASSET', base + 'public/img/');
})();

/* ---------- embers (JS-only; no CSS animations) ---------- */
(function(){
  const controllers=new Map();
  function ensureLayer(id){
    let host = document.getElementById(id);
    if(!host){
      host = document.createElement('div');
      host.id = id;
      host.setAttribute('aria-hidden','true');
      document.body.appendChild(host);
    }
    host.style.position = 'fixed';
    host.style.inset = '0';
    host.style.pointerEvents = 'none';
    host.style.zIndex = '1';
    return host;
  }

  function r(min, max){ return min + Math.random()*(max - min); }

  function spawnOne(host,isActive){
    if(!isActive()) return;
    // Use the *visual* viewport so mobile chrome/safe areas don’t shift spawn math
    const vv = window.visualViewport;
    const vx = vv?.offsetLeft ?? 0;
    const vy = vv?.offsetTop  ?? 0;
    const vw = vv?.width      ?? window.innerWidth;
    const vh = vv?.height     ?? window.innerHeight;

    const dot = document.createElement('span');
    dot.className = 'ember';
    const size   = r(2.5, 6.5);
    const amp    = r(10, 22);
    const period = r(1000, 1600);
    const dur    = r(28000, 38000); // ⟵ cap max speed to 1/2 of former maximum
    const born   = performance.now();

    dot.style.position='fixed';
    dot.style.left='0';
    dot.style.top='0';
    dot.style.width=size+'px';
    dot.style.height=size+'px';
    dot.style.borderRadius='50%';
    dot.style.background='radial-gradient(circle at 50% 50%, rgba(255,200,140,.95), rgba(255,200,140,0) 66%)';
    dot.style.filter='brightness(1.3)';
    dot.style.opacity='0';
    dot.style.transition='opacity .3s ease-out';
    dot.style.willChange='transform, opacity';
    host.appendChild(dot);

    // GUARANTEED off-screen spawn below the bottom edge
    const startX = r(vx, vx + vw);
    const startY = vy + vh + r(160, 360);   // deeper buffer to eliminate any pop-in
    const travel = vh + 360;                // clear the top well past the bezel

    function tick(t){
      if(!isActive() || !dot.isConnected){ dot.remove(); return; }
      const s = Math.min(1, (t - born) / dur);
      const eased = s < .12 ? Math.pow(s / 0.12, 1.4) : s;
      const x = startX + Math.sin((t - born) / period) * amp;
      const y = startY - eased * travel;
      dot.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      dot.style.opacity = (s < .08 ? s * 10 : 1 - (s - .08) / .92);
      if (s < 1) { requestAnimationFrame(tick); }
      else { dot.style.opacity = '0'; setTimeout(()=> dot.remove(), 240); }
    }
    requestAnimationFrame(tick);
  }

  function start(id='fx', seed=28){
    if(controllers.has(id)) return controllers.get(id);
    const host = ensureLayer(id);
    let active=!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const isActive=()=>active;
    const timers=[];
    if(active){
      for(let i=0;i<seed;i++) timers.push(setTimeout(()=>spawnOne(host,isActive),i*180));
    }
    const interval=active ? setInterval(()=>spawnOne(host,isActive),650) : null;
    const controller={
      stop(){
        if(!active && !controllers.has(id)) return;
        active=false;
        if(interval) clearInterval(interval);
        timers.forEach(clearTimeout);
        host.querySelectorAll('.ember').forEach(dot=>dot.remove());
        controllers.delete(id);
      }
    };
    controllers.set(id,controller);
    return controller;
  }

  window.FX = { start };
})();

// --- DEBUG: cutout presence & outlines ---
window.reportCutout = function(){
  const slides = Array.from(document.querySelectorAll('#intro .slide'));
  return slides.map((sl, i)=>({
    slide: i,
    hasPic: !!sl.querySelector('.pic'),
    hasImg: !!sl.querySelector('.pic .img'),
    imgRect: sl.querySelector('.pic .img')?.getBoundingClientRect()
  }));
};

window.debugCutout = function(on=true){
  const id='cutout-debug-style';
  let st=document.getElementById(id);
  if(on && !st){
    st=document.createElement('style'); st.id=id;
    st.textContent = `
      #intro .slide .pic{ outline:2px dashed #0ff !important; min-height:30vh; }
      #intro .slide .pic .img{ outline:2px solid #f0f !important; min-height:28vh; }
    `;
    document.head.appendChild(st);
  } else if(!on && st){
    st.remove();
  }
};
