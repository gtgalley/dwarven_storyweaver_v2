// Brassreach browser game engine
// v28 — Cinematic living-book framing, charged opening, and rebalanced intro audio.

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
const SAVE_VERSION=7;
const BACKPACK_CAPACITY=40;
const OPENING_GROUP_ID='opening-journey';
const OPENING_GROUP_TITLE='The Journey Begins';
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
  ['measure ring',defineItem('relic-measure-ring','Measure Ring','accessory','\u2299','Relic','legendary',{power:1,armor:1,resilience:3},{INT:12},120,'Strengthens the wearer while they carry an unresolved civic duty.','Its three old marks preserve Weight, Tone, and Pattern; the unmarked center is left for living choice.',true)],
  ['archive lens',defineItem('tool-archive-lens','Archive Lens','accessory','\u25c9','Tool','rare',{power:0,armor:0,resilience:1},{INT:11},34,'Reveals altered ink, hairline cracks, and worn inscriptions.','Lithen keeps this silver-rimmed lens beside the restricted ledgers.')],
  ['resonance fork',defineItem('tool-resonance-fork','Resonance Fork','mainHand','\u03a8','Tool','flawless',{power:1,armor:0,resilience:2},{INT:11},56,'Tests pressure channels and isolates a clean mechanical tone.','Its twin prongs were tuned for the Gate crews before the lower works closed.')],
  ['saltglass salve',defineItem('provision-saltglass-salve','Saltglass Salve','accessory','\u2725','Provision','fine',{power:0,armor:0,resilience:1},{},16,'A field medicine that seals cuts and cools minor burns.','Pale mineral gel glows briefly when pressed into a wound.')],
  ['surveyor’s chalk',defineItem('tool-surveyors-chalk','Surveyor’s Chalk','accessory','\u25eb','Tool','common',{power:0,armor:0,resilience:1},{INT:8},5,'Marks tested masonry, load paths, and a safe return route.','Dorrin issues each stick against a written public purpose.')],
  ['thread ledger',defineItem('quest-thread-ledger','Thread Ledger','accessory','\u2261','Quest','rare',{power:0,armor:0,resilience:2},{INT:9},0,'Preserves witnessed findings and makes later alterations visible.','Thin brass leaves bind testimony, physical evidence, decisions, and consequences into one public record.',true)],
  ['deep writ seal',defineItem('quest-deep-writ-seal','Deep Writ Seal','accessory','\u25c8','Quest','flawless',{power:0,armor:1,resilience:2},{},0,'Proves lawful access to restricted public works without granting command over their people.','Captain Brunna fixed the seal beside your probationary mark after your first joined account.',true)],
  ['piera’s route map',defineItem('tool-pieras-route-map','Piera’s Route Map','accessory','\u2318','Tool','fine',{power:0,armor:0,resilience:1},{INT:9},14,'Reveals lived routes omitted from modern civic plans.','Stitched delivery scraps turn official blanks into useful, almost-true geography.')],
  ['mender’s clamp',defineItem('tool-menders-clamp','Mender’s Clamp','accessory','\u2293','Tool','fine',{power:1,armor:0,resilience:1},{STR:9},18,'Holds a brace, gate, or housing at a controlled temporary setting.','Tangles repair crews favor this plain clamp over ornamental emergency gear.')],
  ['salt-hound whistle',defineItem('tool-salt-hound-whistle','Salt-Hound Whistle','accessory','\u223f','Tool','fine',{power:0,armor:0,resilience:1},{CHA:9},12,'Carries a low handler call through drainage passages.','Its note is quiet to dwarven ears and clear to animals raised near resonant stone.')],
  ['first register rubbing',defineItem('quest-first-register-rubbing','First Register Rubbing','accessory','\u25a4','Quest','legendary',{power:0,armor:0,resilience:2},{INT:10},0,'Carries the recovered founder calibration without risking the original record.','The pressure rubbing preserves the relationship among Stone, Brass, Echo, and living choice.',true)],
  ['echo key',defineItem('quest-echo-key','Echo Key','accessory','\u25ce','Quest','legendary',{power:0,armor:0,resilience:3},{INT:11},0,'Provides a stable reference for Pattern, memory, and trustworthy return.','Archive custody keeps citywide history beyond the reach of any single office.',true)],
  ['stone key',defineItem('quest-stone-key','Stone Key','accessory','\u25c6','Quest','legendary',{power:0,armor:2,resilience:2},{STR:10},0,'Makes load, burden, and structural consequence legible.','Mullinen custody binds the instrument to the public purpose of the works.',true)],
  ['brass key',defineItem('quest-brass-key','Brass Key','accessory','\u25c7','Quest','legendary',{power:1,armor:0,resilience:2},{INT:10},0,'Carries a coherent tonal relationship through connected systems.','Choir and Works witness prevent the instrument from becoming one expert’s private command.',true)],
  ['bent lockpin',defineItem('curio-bent-lockpin','Bent Lockpin','accessory','\u2020','Curio','common',{power:0,armor:0,resilience:0},{},2,'Documents the force required to stop the fused Brassworks flywheel.','The bent teeth are more useful as evidence than as a tool.')],
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
    version:CAMPAIGN_VERSION, sceneId:'tutorial-commission', chapter:'tutorial', objective:CAMPAIGN_SCENES['tutorial-commission'].objective,
    completedScenes:[], completedEncounters:[], enteredScenes:[], discoveries:[], evidence:[], testimony:[], repairs:[], consequences:[], optionalCompleted:[], routes:[],
    alliances:{wardens:0,worksfolk:0,piera:0,lithen:0,orra:0,choir:0,sella:0},
    reputation:{accuracy:0,compassion:0,courage:0,humility:0},
    authority:'Uncommissioned',writ:'none',flags:{},rerollsUsed:{},exploration:{},ending:null,bossPhase:0
  };
}
function isProtectedInventoryItem(name){ const meta=itemMeta(name); return !!meta.relic||['Key','Quest'].includes(meta.category); }
function defaultJournal(){ return {milestones:[],discoveries:[],evidence:[],testimony:[],repairs:[],consequences:[],optional:[]}; }
function defaults(){
  return {
    saveVersion:SAVE_VERSION, seed:rnd(1,9_999_999), turn:0, scene:'Halls',
    storyBeats:[], transcript:[], storyGroupSeq:0,
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
const Engine={ el:{}, state: defaults(), inventoryDraft:[], selectedInventoryItem:null, inventoryView:{quality:'all',category:'all',sort:'pack'}, tooltipPinned:false, tooltipItem:null, busy:false, loadedSave:false, pendingFailure:null, activeMerchant:null, activeMerchantChoice:null, activeStoryGroup:null, pendingScrollGroupId:null, resetStoryScroll:false };
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
const INTRO_MIX_GAIN=1.15;
const INTRO_FIRE_GAIN=.22*INTRO_MIX_GAIN*1.15;
const BGM = (function(){
  let ctx, bus, cur=[], curGain=null, fadeMs=1400;
  let currentName=null, targetName=null, requestToken=0;
  let unlocked=false, pendingName=null;
  const tracks = {
    intro:    { title:"Lament at the Foundry Hearth", srcs:["./public/audio/intro-hearth-lament.mp3"], layerSrcs:["./public/audio/intro-fireplace-loop.wav"], layerGains:[INTRO_MIX_GAIN,INTRO_FIRE_GAIN] },
    prelude:  { title:"Prelude to Brass and Shadow", srcs:["./public/audio/8b5955d3-2e28-447b-bc5f-a91bad52e402.m4a"] },
    halls:    { title:"Halls of the Brassreach", srcs:["./public/audio/8b264fe3-26f0-4c6c-9356-60a270d2ef21.mp3"] },
    depths2:  { title:"When the Unfathomer Stirs", srcs:["./public/audio/66bf880d-6cea-470f-8dba-7de081c046fa.mp3"] },
    depths:   { title:"Beneath the Cistern Fields", srcs:["./public/audio/662478af-b29d-4034-a2fc-d2ea9fd75dc4.mp3"] },
    archives: { title:"Whispers of the Archives", srcs:["./public/audio/73a9c81f-6be8-45a2-8338-2b8b7a53d596.mp3"] },
  };
  const cache = new Map(), loads=new Map();
  function getCtx(){ try{ Sound.ensure(); }catch{}; return (Sound.getCtx? Sound.getCtx() : new (window.AudioContext||window.webkitAudioContext)()); }
  async function load(name){
    if(cache.has(name)) return cache.get(name);
    if(loads.has(name)) return loads.get(name);
    const t = tracks[name]; if(!t) return null;
    const pending=(async()=>{
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
    })();
    loads.set(name,pending);
    try{ return await pending; }finally{ loads.delete(name); }
  }
  function prime(name){ return load(name).catch(()=>null); }
  function setBus(v){ if(bus) bus.gain.value=v; }
  async function crossTo(name){
    if(!unlocked){ pendingName=name; prime(name); return false; }
    if(name===targetName || (name===currentName && cur.length)) return;
    targetName=name;
    const token=++requestToken;
    try{
      const data = await load(name);
      if(!data || token!==requestToken){ if(token===requestToken) targetName=currentName; return; }
      const track=tracks[name];
      const C = ctx || getCtx(); ctx=C; if(!bus){ bus=C.createGain(); bus.gain.value=Engine.state?.settings?.audio?.music ?? 0.5; if(Sound.getMaster){ bus.connect(Sound.getMaster()); } else { bus.connect(C.destination); } }
      // A track may contain synchronized layers (the intro music and its hearth recording).
      const ng = C.createGain(); ng.gain.value=0; ng.connect(bus); const now=C.currentTime;
      const nextSources=data.buffers.map((buffer,index)=>{
        const src=C.createBufferSource(); src.buffer=buffer; src.loop=true;
           const layerGain=C.createGain(); layerGain.gain.value=track?.layerGains?.[index]??(index===0?1:.34);
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
      if(track) setNowPlaying(track.title);
      return true;
    }catch(e){
      if(token===requestToken) targetName=currentName;
      console.error('BGM crossTo error', e);
      return false;
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
    if(chapter==='brassworks') return crossTo('depths');
    if(['depths','gate','choice','epilogue'].includes(chapter)||S.scene==='Depths'){
      if(S.flags?.bossDealtWith || chapter==='gate' || chapter==='choice') return crossTo('depths2');
      return crossTo('depths');
    }
    return crossTo('halls');
  }
  function setNowPlaying(t){ try{ if (window.setNowPlaying) window.setNowPlaying(t); else { const e=document.getElementById('npTitle'); if(e) e.textContent=t; } }catch{} }
  async function unlock(name=null){
    if(name) pendingName=name;
    const requested=pendingName;
    if(requested) prime(requested);
    Sound.ensure();
    await Sound.resume();
    const C=Sound.getCtx?.();
    if(C?.state!=='running') return false;
    unlocked=true;
    pendingName=null;
    if(requested) await crossTo(requested);
    return true;
  }
  function attempt(name){ return unlock(name).catch(()=>false); }
  function debugState(){ return {unlocked,currentName,targetName,pendingName,primed:[...cache.keys()],sources:cur.length,contextState:ctx?.state||null,layerGains:tracks[currentName]?.layerGains||null}; }
  return {crossTo, stop, updateForState, setLevel:setBus, unlock, attempt, prime, debugState};
})();

/* ---------- sound @ ~20 BPM base ---------- */

const Sound = (()=>{
  let ctx, master, ui;
  const introHistory=[];
  const rememberIntro=kind=>{ introHistory.push({kind,at:performance.now()}); if(introHistory.length>40) introHistory.shift(); };
  const audioBuffers=new Map();
  const inventoryUrls={pickup:'./public/audio/inventory-pickup.wav',place:'./public/audio/inventory-place.wav',reject:'./public/audio/inventory-reject.wav'};
  const introUrls={
    cover:'./public/audio/book-cover-open.wav',
    page:'./public/audio/book-page-turn.wav',
    settle:'./public/audio/book-page-settle.ogg',
    passage:'./public/audio/book-page-settle.ogg'
  };
  const ensure = ()=>{
    if (ctx) return ctx;
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = Engine.state.settings.audio.master; master.connect(ctx.destination);
    ui = ctx.createGain(); ui.gain.value = Engine.state.settings.audio.ui; ui.connect(master);
    return ctx;
  };
  const setLevels = ()=>{ if(!ctx) return; master.gain.value = Engine.state.settings.audio.master; ui.gain.value = Engine.state.settings.audio.ui; };
  const resume = ()=>{ ensure(); return ctx.state==='suspended'?ctx.resume().catch(()=>false):Promise.resolve(true); };
  const loadBuffer=url=>{
    if(audioBuffers.has(url)) return audioBuffers.get(url);
    ensure();
    const pending=fetch(url,{cache:'force-cache'}).then(response=>{
      if(!response.ok) throw new Error(`Audio unavailable: ${url}`);
      return response.arrayBuffer();
    }).then(data=>ctx.decodeAudioData(data.slice(0)));
    audioBuffers.set(url,pending);
    pending.catch(()=>audioBuffers.delete(url));
    return pending;
  };
  const primeIntro=()=>Promise.allSettled(Object.values(introUrls).map(loadBuffer));
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
      const buffer=await loadBuffer(inventoryUrls[soundKind]);
      const source=ctx.createBufferSource(), gain=ctx.createGain();
      source.buffer=buffer; gain.gain.value=kind==='reject'?.42:kind==='swap'?.68:.58;
      source.connect(gain).connect(ui); source.start();
    }catch{ sfx(kind==='reject'?'fail':'story'); }
  };
  const intro=async(kind,{gain:gainOverride=null,pan=0,playbackRate=1,lowpass=null}={})=>{
    const sa=Engine.state.settings.audio||{};
    if(sa.sfx_story===false||!introUrls[kind]) return false;
    rememberIntro(kind);
    ensure(); await resume();
    try{
      const buffer=await loadBuffer(introUrls[kind]);
      const source=ctx.createBufferSource(), gain=ctx.createGain();
      const levels={cover:.62,page:.483,settle:.23,passage:.098};
      source.buffer=buffer; source.playbackRate.value=playbackRate;
      gain.gain.value=gainOverride??levels[kind]??(.3*INTRO_MIX_GAIN);
      let output=source;
      if(lowpass){ const filter=ctx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=lowpass; source.connect(filter); output=filter; }
      output.connect(gain);
      if(ctx.createStereoPanner){
        const panner=ctx.createStereoPanner(); panner.pan.value=clamp(pan,-.18,.18); gain.connect(panner).connect(ui);
      }else gain.connect(ui);
      source.start();
      return true;
    }catch{ return false; }
  };
  const journey=()=>{
    const sa=Engine.state.settings.audio||{};
    if(sa.sfx_story===false) return false;
    rememberIntro('journey');
    ensure(); resume();
    const t=ctx.currentTime;

    // A compressed orchestral impact gives way to a descending synthesized
    // fundamental. The second harmonic keeps the fall audible on small
    // speakers while the true low voice supplies weight on headphones.
    const compressor=ctx.createDynamicsCompressor();
    compressor.threshold.value=-15;
    compressor.knee.value=18;
    compressor.ratio.value=5;
    compressor.attack.value=.006;
    compressor.release.value=.24;
    const journeyBus=ctx.createGain();
    journeyBus.gain.value=INTRO_MIX_GAIN;
    journeyBus.connect(compressor).connect(ui);

    const impact=ctx.createGain();
    impact.gain.setValueAtTime(.0001,t);
    impact.gain.exponentialRampToValueAtTime(.78,t+.018);
    impact.gain.exponentialRampToValueAtTime(.32,t+.22);
    impact.gain.exponentialRampToValueAtTime(.0001,t+1.02);
    impact.connect(journeyBus);
    [[92,44,'sine',.82],[138,61,'triangle',.68]].forEach(([start,end,type,duration])=>{
      const oscillator=ctx.createOscillator();
      oscillator.type=type;
      oscillator.frequency.setValueAtTime(start,t);
      oscillator.frequency.exponentialRampToValueAtTime(end,t+duration);
      oscillator.connect(impact);
      oscillator.start(t);
      oscillator.stop(t+1.06);
    });

    const noiseBuffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.42),ctx.sampleRate);
    const samples=noiseBuffer.getChannelData(0);
    for(let i=0;i<samples.length;i++) samples[i]=(Math.random()*2-1)*(1-(i/samples.length));
    const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),noiseGain=ctx.createGain();
    noise.buffer=noiseBuffer; filter.type='lowpass'; filter.frequency.value=145;
    noiseGain.gain.setValueAtTime(.24,t); noiseGain.gain.exponentialRampToValueAtTime(.0001,t+.4);
    noise.connect(filter).connect(noiseGain).connect(journeyBus); noise.start(t); noise.stop(t+.43);

    const drop=ctx.createGain(),dropStart=t+.08;
    drop.gain.setValueAtTime(.0001,dropStart);
    drop.gain.exponentialRampToValueAtTime(.22,dropStart+.18);
    drop.gain.exponentialRampToValueAtTime(.56,dropStart+1.04);
    drop.gain.exponentialRampToValueAtTime(.0001,dropStart+1.67);
    drop.connect(journeyBus);
    [[96,36,'sine'],[148,58,'triangle']].forEach(([start,end,type],index)=>{
      const oscillator=ctx.createOscillator();
      oscillator.type=type;
      oscillator.frequency.setValueAtTime(start,dropStart);
      oscillator.frequency.exponentialRampToValueAtTime(end,dropStart+(index?1.46:1.6));
      oscillator.connect(drop);
      oscillator.start(dropStart);
      oscillator.stop(dropStart+1.7);
    });
    return true;
  };
  const ambOn = ()=>ensure(); // for legacy calls
  return {click, sfx, gong, inventory, intro, journey, primeIntro, ambOn, setLevels, resume, ensure, getCtx:()=>ensure(), getMaster:()=>master, debugIntro:()=>introHistory.map(entry=>({...entry}))};
})();

/* ---------- weaver ---------- */
const Weaver = makeWeaver(store,
  (msg)=>Engine.state.storyBeats.push({text:`[log] ${msg}`}),
  (tag)=>{ const t=$('#engineTag'); if(t) t.textContent=tag; Engine.state.live.on=(tag==='Live'); }
);
// --- Global glossary (fallback for .gloss without data-def) ----------
window.GLOSS = Object.assign({
  "brassreach": "A layered dwarven city whose living works join water, stone, brass, skilled labor, and public care.",
  "threadbearers": "Civic investigators trained to follow a failure from physical cause through testimony, decision, and consequence.",
  "thread-bearers": "Civic investigators trained to follow a failure from physical cause through testimony, decision, and consequence.",
  "thread ledger": "A tamper-evident field record. Every sealed account, correction, and later alteration remains visible.",
  "deep writ": "Hard-earned authority to inspect restricted works and cross-office records, without command over workers or residents.",
  "unfathomer": "Lithen’s careful name for the immense, continuous living resonance spread through the oldest water, stone, and brass.",
  "halls": "Upper civic corridors and inspection works forming the threshold to the old city below.",
  "archives": "The repository of civic law, testimony, engineering history, Threadbearer records, and the Echo Key.",
  "depths": "Flooded foundations, pressure stairs, and cistern galleries beneath the public works.",
  "gate of measures": "A founder-era calibration mechanism, constitutional safeguard, teaching instrument, and passage into the deepest network.",
  "keys": "Stone, Brass, and Echo are institutional calibration instruments. Divided custody prevents one office from making a citywide change alone.",
  "brass key": "The calibration instrument for Tone: active resonance and relationships among systems.",
  "echo key": "The calibration instrument for Pattern: memory, change, and trustworthy return.",
  "stone key": "The calibration instrument for Weight: load, burden, foundation, and consequence.",
  "measures": "Weight, Tone, and Pattern make the old works legible; living Choice supplies a responsible direction.",
  "weight": "What a structure, institution, or decision must carry, and who bears the consequence.",
  "tone": "The working relationship among voices, materials, mechanisms, and resonant systems.",
  "pattern": "What returns across time, including memory, maintenance, precedent, and change.",
  "founding covenant": "Brassreach’s first civic constitution, joining stewardship, public record, shared duty, and limits on inherited power.",
  "tangles": "A densely settled district of workshops, homes, and improvised bridges.",
  "probationary writ": "Limited authority for a new Threadbearer to investigate public hazards under Captain Brunna’s supervision.",
  "lantern constables": "Officers of the Lantern Constabulary who patrol public districts, investigate crimes, make lawful arrests, and protect residents from violence. They are separate from Threadbearers and public-works Wardens."
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
  }else{
    Sound.primeIntro();
  }

  /* ambience removed */ BGM.updateForState(Engine.state);
  BGM.attempt();
  Engine.getAudioDebug=()=>BGM.debugState();
  Engine.getIntroSoundDebug=()=>Sound.debugIntro();
  Engine.el.fxMainCtl=FX.start('fx');

  // Browsers may require a deliberate gesture before a suspended AudioContext can play.
  const releaseAudioListeners=()=>{
    window.removeEventListener('pointerdown',unlockAudio);
    window.removeEventListener('keydown',unlockAudio);
  };
  const unlockAudio=e=>{
    if(e?.type==='keydown'){
      const target=e.target;
      if(e.key==='Tab'||e.key==='Escape'||['Shift','Control','Alt','Meta','CapsLock'].includes(e.key)||e.ctrlKey||e.altKey||e.metaKey) return;
      if(target?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
    }
    BGM.unlock().then(ok=>{ if(ok) releaseAudioListeners(); });
  };
  window.addEventListener('pointerdown',unlockAudio);
  window.addEventListener('keydown',unlockAudio);
  
  // Dev convenience: Alt+I marks the intro as seen (persisted)
  window.addEventListener('keydown', (e)=>{
    if (e.altKey && (e.key||'').toLowerCase()==='i'){
      try{ store.set('intro_seen', true); }catch{}
      if (typeof toast === 'function') toast('Intro will be skipped next load');
    }
  });
} // <-- end boot()



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
    tip.id = 'glossTip';
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
    if(pinned&&pinned!==t) return;
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

  root.addEventListener('focusin',(e)=>{
    const term=e.target.closest?.('.gloss');
    if(!term) return;
    const def=resolveDef(term);
    if(!def) return;
    overTerm=term;
    term.setAttribute('aria-describedby',tip.id);
    tip.textContent=def;
    tip.style.visibility='visible';
    tip.classList.add('on');
    const rect=term.getBoundingClientRect();
    place(rect.left+(rect.width/2),rect.bottom);
  });
  root.addEventListener('focusout',(e)=>{
    const term=e.target.closest?.('.gloss');
    if(!term) return;
    term.removeAttribute('aria-describedby');
    if(pinned===term) return;
    overTerm=null;
    tip.classList.remove('on');
    tip.style.visibility='hidden';
  });

  const hidePinned=()=>{
    tip.classList.remove('on');
    tip.style.visibility='hidden';
    tip.style.pointerEvents='none';
    pinned=null;
    hideAt=Date.now();
  };

  // ALT remains a keyboard pin shortcut. Click/touch also pins a definition
  // without preventing normal text selection or focus behavior.
  root.addEventListener('keydown', (e)=>{
    if (e.altKey && overTerm){
      pinned = overTerm;
      tip.style.pointerEvents = 'auto';
    }else if(e.key==='Escape'&&pinned){
      hidePinned();
    }
  });

  root.addEventListener('click',e=>{
    const term=e.target.closest?.('.gloss');
    if(!term){ if(pinned) hidePinned(); return; }
    if(pinned===term){ hidePinned(); return; }
    const def=resolveDef(term);
    if(!def) return;
    pinned=term;
    overTerm=term;
    tip.textContent=def;
    tip.style.visibility='visible';
    tip.style.pointerEvents='auto';
    tip.classList.add('on');
    const rect=term.getBoundingClientRect();
    place(rect.left+(rect.width/2),rect.bottom);
  });
}

// ----------------------------------------------------------------

// --- COMPLETE, DROP-IN INTRO ------------------------------------

function tuneIntroLayout(){
  const intro = document.getElementById('intro');
  if (!intro) return;
  intro.classList.add('two-pane');
}

function insertIntro(){
  const existing = document.getElementById('intro');
  if (existing){
    Engine.el.intro  = existing;
    Engine.el.slides = Array.from(existing.querySelectorAll('.slide'));
    return;
  }

  document.body.insertAdjacentHTML('afterbegin', getIntroSlidesHTML());
  Engine.el.intro    = document.getElementById('intro');
  Engine.el.intro.classList.add('two-pane');
  Engine.el.slides   = Array.from(Engine.el.intro.querySelectorAll('.slide'));
  Engine.el.beginBtn = Engine.el.intro.querySelector('#introAdvance');

  Engine.el.slides.forEach(sl=>{
    sl.setAttribute('aria-hidden','true');
    sl.classList.add('baked');
    sl.querySelectorAll('.intro-passage').forEach(passage=>{
      passage.hidden=true;
      passage.setAttribute('aria-hidden','true');
    });
  });

  const shell=Engine.el.intro.querySelector('.book-shell');
  const stage=Engine.el.intro.querySelector('.intro-stage');
  const awaken=Engine.el.intro.querySelector('#introAwaken');
  const status=Engine.el.intro.querySelector('#introStatus');
  const art=Engine.el.intro.querySelector('#introArtLayer');
  const previous=Engine.el.intro.querySelector('#introPrevious');
  const advance=Engine.el.intro.querySelector('#introAdvance');
  const skip=Engine.el.intro.querySelector('#introSkip');
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const wait=ms=>new Promise(resolve=>window.setTimeout(resolve,ms));
  let folioIndex=0,passageIndex=0,turning=false,started=false;

  Engine.el.intro.querySelectorAll('img').forEach(image=>{
    image.draggable=false;
    image.addEventListener('dragstart',event=>event.preventDefault());
  });

  // Decode the three interchangeable paintings early. The cover and blank
  // spread are separately preloaded in index.html because they form the first
  // transition and must be available before the initial gesture.
  [...new Set(Engine.el.slides.map(slide=>slide.dataset.art).filter(Boolean))].forEach(src=>{
    const image=new Image(); image.decoding='async'; image.src=src;
  });
  const closeGloss=()=>{
    const tip=document.querySelector('.gloss-tip');
    if(tip){ tip.classList.remove('on'); tip.style.visibility='hidden'; }
    document.activeElement?.closest?.('#intro .gloss')?.blur?.();
  };
  const announce=message=>{ if(status) status.textContent=message; };
  const passagesFor=folio=>Array.from(Engine.el.slides[folio]?.querySelectorAll('.intro-passage')||[]);
  const isFirst=()=>folioIndex===0&&passageIndex===0;
  const isLast=()=>folioIndex===Engine.el.slides.length-1&&passageIndex===passagesFor(folioIndex).length-1;
  const describePosition=()=>{
    const slide=Engine.el.slides[folioIndex];
    const title=slide?.querySelector('.folio-mark strong')?.textContent||'Chronicle';
    return `${title}, passage ${passageIndex+1} of ${passagesFor(folioIndex).length}; Folio ${folioIndex+1} of ${Engine.el.slides.length}.`;
  };
  const updateControls=()=>{
    if(previous) previous.hidden=isFirst();
    if(!advance) return;
    const finalPassage=passageIndex===passagesFor(folioIndex).length-1;
    const finalFolio=folioIndex===Engine.el.slides.length-1;
    const label=finalPassage?(finalFolio?'Begin Story':'Next'):'Turn Page';
    advance.dataset.action=finalPassage?(finalFolio?'begin':'next-folio'):'next-passage';
    advance.classList.toggle('intro-begin',finalPassage&&finalFolio);
    advance.classList.toggle('intro-next',!(finalPassage&&finalFolio));
    advance.innerHTML=`<span>${label}</span>${finalPassage&&finalFolio?'':' <span aria-hidden="true">›</span>'}`;
    advance.setAttribute('aria-label',finalPassage&&finalFolio?'Begin the Brassreach story':`${label}: ${describePosition()}`);
  };
  const revealInk=slide=>{
    if(!slide||reduced) return;
    const p=slide.querySelector('.intro-passage.active'),copy=slide.querySelector('.copy');
    [p,copy].forEach(element=>{
      if(!element) return;
      element.classList.remove(element===p?'ink-revealing':'ink-settling');
      void element.offsetWidth;
      element.classList.add(element===p?'ink-revealing':'ink-settling');
    });
    window.setTimeout(()=>{ p?.classList.remove('ink-revealing'); copy?.classList.remove('ink-settling'); },1100);
  };
  const activate=(folio,passage,{reveal=true,updateArt=true}={})=>{
    folioIndex=Math.max(0,Math.min(Engine.el.slides.length-1,folio));
    const folioPassages=passagesFor(folioIndex);
    passageIndex=Math.max(0,Math.min(folioPassages.length-1,passage));
    Engine.el.slides.forEach((slide,k)=>{
      const active=k===folioIndex;
      slide.classList.toggle('active',active);
      slide.setAttribute('aria-hidden',String(!active));
      slide.querySelectorAll('.intro-passage').forEach((entry,j)=>{
        const passageActive=active&&j===passageIndex;
        entry.classList.toggle('active',passageActive);
        entry.hidden=!passageActive;
        entry.setAttribute('aria-hidden',String(!passageActive));
      });
      if(active&&reveal) revealInk(slide);
    });
    if(art&&updateArt){
      art.src=Engine.el.slides[folioIndex]?.dataset.art||'';
      art.dataset.slide=String(folioIndex+1);
    }
    shell.dataset.folio=String(folioIndex+1);
    shell.dataset.passage=String(passageIndex+1);
    updateControls();
  };
  const show=async(folio,passage=0,animate=true)=>{
    const targetFolio=Math.max(0,Math.min(Engine.el.slides.length-1,folio));
    const targetPassages=passagesFor(targetFolio);
    const targetPassage=Math.max(0,Math.min(targetPassages.length-1,passage));
    if(targetFolio===folioIndex&&targetPassage===passageIndex&&shell?.classList.contains('is-ready')){
      activate(targetFolio,targetPassage);
      return;
    }
    if(turning) return;
    if(!animate||!shell?.classList.contains('is-ready')){ activate(targetFolio,targetPassage); return; }
    turning=true;
    const crossFolio=targetFolio!==folioIndex;
    const direction=targetFolio>folioIndex||(targetFolio===folioIndex&&targetPassage>passageIndex)?'forward':'back';
    closeGloss();
    shell.classList.add('is-turning');
    if(crossFolio){
      shell.classList.add('is-folio-turning');
      shell.classList.remove('content-visible');
      Sound.intro('page',{pan:direction==='forward'?.08:-.08});
      await wait(reduced?20:190);
      activate(targetFolio,targetPassage,{reveal:false,updateArt:true});
      await wait(reduced?15:55);
      shell.classList.add('content-visible');
      revealInk(Engine.el.slides[folioIndex]);
      await wait(reduced?20:230);
      Sound.intro('settle',{pan:direction==='forward'?-.05:.05});
    }else{
      shell.classList.add('is-passage-turning');
      Sound.intro('passage',{pan:direction==='forward'?.025:-.025});
      await wait(reduced?15:165);
      activate(targetFolio,targetPassage,{reveal:false,updateArt:false});
      await wait(reduced?10:22);
      shell.classList.remove('is-passage-turning');
      revealInk(Engine.el.slides[folioIndex]);
      await wait(reduced?15:170);
    }
    announce(describePosition());
    shell.classList.remove('is-turning','is-folio-turning','is-passage-turning');
    turning=false;
  };

  const finishIntro=()=>{
    if(turning) return;
    BGM.unlock('prelude');
    Sound.gong();
    window.removeEventListener('keydown',onIntroKey);
    try{ Engine.el.fxIntroCtl?.stop?.(); }catch{}
    document.getElementById('fxIntro')?.remove();
    Engine.el.intro.classList.add('hidden');
    store.set('intro_seen',true);
    if(!Engine.state.storyBeats.length) beginTale(Engine.loadedSave);
    setTimeout(()=>{ Engine.el.btnEdit.click(); mountScrollFab(); },120);
  };

  advance?.addEventListener('click',()=>{
    if(turning) return;
    const passages=passagesFor(folioIndex);
    if(isLast()){ finishIntro(); return; }
    if(passageIndex<passages.length-1) show(folioIndex,passageIndex+1);
    else show(folioIndex+1,0);
  });
  previous?.addEventListener('click',()=>{
    if(turning||isFirst()) return;
    if(passageIndex>0) show(folioIndex,passageIndex-1);
    else show(folioIndex-1,passagesFor(folioIndex-1).length-1);
  });
  skip?.addEventListener('click',()=>{ if(turning) return; Sound.click(); finishIntro(); });

  const beginOpening=async()=>{
    if(started||shell?.classList.contains('is-ready')) return false;
    const openingStartedAt=performance.now();
    started=true; turning=true;
    shell.classList.remove('is-dormant');
    shell.classList.add('is-awakening','is-turning');
    Engine.el.intro.classList.add('intro-charging');
    shell.classList.remove('content-visible');
    shell.setAttribute('aria-busy','true');
    awaken?.setAttribute('aria-disabled','true');
    announce('The Brassreach chronicle is opening.');
    BGM.unlock('intro');
    Sound.journey();
    window.setTimeout(()=>Sound.intro('cover',{pan:-.04,playbackRate:.92,lowpass:4200}),720);
    window.setTimeout(()=>Sound.intro('page',{pan:.05}),1040);
    await wait(980);
    shell.classList.add('is-black');
    await wait(220);
    activate(0,0,{reveal:false});
    shell.classList.add('is-open','is-ready');
    shell.removeAttribute('role');
    shell.removeAttribute('tabindex');
    shell.removeAttribute('aria-describedby');
    shell.setAttribute('aria-label','The open Brassreach chronicle');
    shell.setAttribute('aria-busy','false');
    awaken?.setAttribute('aria-hidden','true');
    await wait(120);
    shell.classList.remove('is-black');
    await wait(Math.max(0,1750-(performance.now()-openingStartedAt)));
    shell.classList.add('content-visible');
    revealInk(Engine.el.slides[0]);
    shell.classList.remove('is-turning','is-awakening');
    Engine.el.intro.classList.remove('intro-charging');
    turning=false;
    announce(`The chronicle is open. ${describePosition()}`);
    advance?.focus({preventScroll:true});
    return true;
  };
  const appropriateBeginKey=e=>{
    if(e.repeat||e.ctrlKey||e.altKey||e.metaKey) return false;
    if(['Tab','Escape','Shift','Control','Alt','Meta','CapsLock','NumLock','ScrollLock'].includes(e.key)) return false;
    if(e.target?.matches?.('input,textarea,select,[contenteditable="true"]')) return false;
    return e.key==='Enter'||e.key===' '||e.key.length===1;
  };
  const onIntroKey=e=>{
    if(!appropriateBeginKey(e)||started||Engine.el.intro.classList.contains('hidden')) return;
    if(e.key===' ') e.preventDefault();
    beginOpening();
  };
  awaken?.addEventListener('click',event=>{ event.stopPropagation(); beginOpening(); });
  stage?.addEventListener('click',event=>{ if(!event.target.closest('.nav')) beginOpening(); });
  window.addEventListener('keydown',onIntroKey);
  Engine.introController={
    start:beginOpening,
    show,
    get index(){return folioIndex;},
    get folioIndex(){return folioIndex;},
    get passageIndex(){return passageIndex;},
    get turning(){return turning;}
  };

  if(!document.getElementById('fxIntro')){
    const fx=document.createElement('div');
    fx.id='fxIntro';
    fx.setAttribute('aria-hidden','true');
    Object.assign(fx.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:'40'});
    Engine.el.intro.prepend(fx);
  }
  Engine.el.fxIntroCtl=FX.start('fxIntro');
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
          <div class="keys-meter" title="Field authority">
            <svg id="keysRing" viewBox="0 0 100 100" aria-label="Field authority progress">
              <circle class="ticks" cx="50" cy="50" r="46" />
              <circle class="bg" cx="50" cy="50" r="40" />
              <circle id="keysArc" class="arc" cx="50" cy="50" r="40" />
              <circle class="hub" cx="50" cy="50" r="24" />
            </svg>
            <span class="keys-copy"><small id="meterKicker">Field authority</small><strong id="meterLabel">Writ</strong></span>
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
            <span class="panel-kicker">Choose Your Course</span>
            <span class="panel-rule" aria-hidden="true"></span>
          </div>
          <div id="choices"></div>
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
          <h3><span>Thread Ledger</span></h3>
          <div id="ledgerPanel" class="centered"></div>
        </div>
        <div class="card deco frame">
          <h3><span>Session</span></h3>
          <div class="centered session-grid">
            <div><span>Seed</span><strong id="seedVal"></strong></div>
            <div><span>Turn</span><strong id="turnVal"></strong></div>
            <div><span id="sessionProgressLabel">Writ</span><strong id="keysVal"></strong></div>
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
    <header><div><span class="modal-kicker">Attempt Failed</span><strong id="lostTitle">Choose the Cost</strong></div></header>
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
    <header><div>Threadbearer Field Brief</div><div id="xScroll" class="closeX">✕</div></header>
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

  Engine.el.btnEnd=$('#btnEnd'); Engine.el.btnSettings=$('#btnSettings'); Engine.el.keysArc=$('#keysArc'); Engine.el.meterKicker=$('#meterKicker'); Engine.el.meterLabel=$('#meterLabel'); Engine.el.sceneHeading=$('#sceneHeading');

  Engine.el.charPanel=$('#charPanel'); Engine.el.charHeaderName=$('#charHeaderName'); Engine.el.charHeaderRace=$('#charHeaderRace'); Engine.el.hotbarPanel=$('#hotbarPanel'); Engine.el.ledgerPanel=$('#ledgerPanel'); Engine.el.objectivePanel=$('#objectivePanel'); Engine.el.btnJournal=$('#btnJournal');
  Engine.el.seedVal=$('#seedVal'); Engine.el.turnVal=$('#turnVal'); Engine.el.keysVal=$('#keysVal'); Engine.el.sessionProgressLabel=$('#sessionProgressLabel');
  Engine.el.saveStatus=$('#saveStatus'); Engine.el.toastRegion=$('#toastRegion');
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
function normalizeStoryBeats(beats){
  return (Array.isArray(beats)?beats:[]).filter(beat=>beat&&typeof beat==='object').map(beat=>{
    const next={...beat};
    if(typeof next.text!=='string'&&typeof next.html!=='string') next.text='';
    if(next.groupId!==undefined&&next.groupId!==null) next.groupId=String(next.groupId);
    else delete next.groupId;
    if(next.kind==='effects') next.effects=(Array.isArray(next.effects)?next.effects:[]).filter(effect=>effect?.label).map(effect=>({tone:String(effect.tone||'info'),label:String(effect.label),detail:String(effect.detail||'')}));
    return next;
  });
}
function migrateOpeningStoryGroup(beats){
  const normalized=normalizeStoryBeats(beats);
  if(!normalized.length||normalized.some(beat=>beat.groupId===OPENING_GROUP_ID)) return normalized;
  const working=normalized.filter(beat=>beat.kind!=='opening');
  const scene=CAMPAIGN_SCENES['tutorial-commission'];
  const expected=String(scene.story||'').split(/\n\s*\n/).map(text=>text.trim()).filter(Boolean);
  const readable=beat=>String(beat?.html?stripHTML(beat.html):beat?.text||'').trim();
  if(!expected.length||expected.some((text,index)=>readable(working[index])!==text)) return normalized;

  const migrated=working.map(beat=>({...beat}));
  let end=expected.length;
  for(let index=0;index<expected.length;index++) migrated[index].groupId=OPENING_GROUP_ID;
  const itemReason=String(scene.enter?.item?.reason||'').trim();
  if(itemReason&&readable(migrated[end])===itemReason){ migrated[end].groupId=OPENING_GROUP_ID; end++; }
  if(migrated[end]?.kind==='effects'){
    const labels=(migrated[end].effects||[]).map(effect=>effect.label);
    if(labels.some(label=>label==='Authority updated'||label==='Item gained')) migrated[end].groupId=OPENING_GROUP_ID;
  }
  return [{kind:'opening',text:OPENING_GROUP_TITLE,groupId:OPENING_GROUP_ID},...migrated];
}
function storyGroupSequence(beats){
  return normalizeStoryBeats(beats).reduce((highest,beat)=>{
    const match=String(beat.groupId||'').match(/(\d+)$/);
    return match?Math.max(highest,+match[1]||0):highest;
  },0);
}
function inferCampaignScene(saved){
  const legacyScene=saved?.campaign?.sceneId||'';
  const migrated={
    'halls-briefing':'tutorial-commission','halls-quartermaster':'tutorial-quartermaster','halls-floodgate':'tutorial-floodgate','halls-culvert':'halls-omitted-route',
    'archives-entry':'archives-entry','archives-lithen':'archives-lithen','archives-ledgers':'archives-first-register','archives-guardian':'archives-restoration','archives-vault':'archives-echo-key',
    'depths-descent':'depths-descent','depths-mullinen':'depths-lower-watch','depths-crossing':'depths-cistern-crossing','depths-salvager':'brassworks-sella','depths-crawler':'brassworks-crawler','depths-shrine':'depths-foundation','depths-brassworks':'brassworks-anchor',
    'gate-approach':'gate-approach','gate-alignment':'gate-weight','unfathomer-weight':'gate-weight','unfathomer-tone':'gate-tone','unfathomer-pattern':'gate-pattern','unfathomer-decision':'choice-decision'
  };
  if(migrated[legacyScene]) return migrated[legacyScene];
  if(saved?.flags?.bossDealtWith) return 'choice-decision';
  if(saved?.flags?.bossReady) return 'gate-approach';
  if(saved?.scene==='Depths') return 'depths-descent';
  if(saved?.scene==='Archives') return 'archives-entry';
  return 'tutorial-commission';
}
function normalizeCampaign(savedCampaign,saved){
  const d=defaultCampaign(), raw=savedCampaign||{}, currentVersion=raw.version===CAMPAIGN_VERSION;
  const sceneId=currentVersion&&CAMPAIGN_SCENES[raw.sceneId]?raw.sceneId:inferCampaignScene({...saved,campaign:raw});
  const oldEnding=raw.ending;
  const migratedEnding=oldEnding&&oldEnding.id==='bargain'?{...oldEnding,id:'channel',title:'Channel — Migrated Resolution'}:oldEnding;
  const chapter=CAMPAIGN_SCENES[sceneId].chapter,legacyFlags={...d.flags,...(raw.flags||{})};
  const inferredDeep=!['tutorial'].includes(chapter),migratedWrit=raw.writ||(inferredDeep?'deep':'probationary'),migratedAuthority=raw.authority||(inferredDeep?'Threadbearer under Deep Writ':'Probationary Threadbearer');
  if(['depths','brassworks','gate','choice'].includes(chapter)){ legacyFlags.unfathomerNamed=true; legacyFlags.keysKnown=true; }
  if(chapter==='archives'&&(sceneId==='archives-lithen'||sceneId==='archives-first-register'||sceneId==='archives-restoration'||sceneId==='archives-echo-key')){ legacyFlags.unfathomerNamed=true; legacyFlags.keysKnown=true; }
  return {
    ...d,...raw,version:CAMPAIGN_VERSION,sceneId,chapter,objective:currentVersion&&raw.objective?raw.objective:CAMPAIGN_SCENES[sceneId].objective,
    completedScenes:uniqueText(raw.completedScenes),completedEncounters:uniqueText(raw.completedEncounters),enteredScenes:uniqueText(raw.enteredScenes),
    discoveries:uniqueText(raw.discoveries),evidence:uniqueText(raw.evidence),testimony:uniqueText(raw.testimony),repairs:uniqueText(raw.repairs),
    consequences:uniqueText(raw.consequences),optionalCompleted:uniqueText(raw.optionalCompleted),routes:uniqueText(raw.routes),
    alliances:{...d.alliances,...(raw.alliances||{})},reputation:{...d.reputation,...(raw.reputation||{})},
    authority:migratedAuthority,writ:migratedWrit,flags:legacyFlags,
    rerollsUsed:{...(raw.rerollsUsed||{})},exploration:{...(raw.exploration||{})},ending:migratedEnding||null
  };
}
function normalizeJournal(savedJournal,campaign){
  const raw=savedJournal||{};
  return {
    milestones:uniqueText(raw.milestones),
    discoveries:uniqueText([...(raw.discoveries||[]),...(campaign.discoveries||[])]),
    evidence:uniqueText([...(raw.evidence||[]),...(campaign.evidence||[])]),
    testimony:uniqueText([...(raw.testimony||[]),...(campaign.testimony||[])]),
    repairs:uniqueText([...(raw.repairs||[]),...(campaign.repairs||[])]),
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
  const storyBeats=migrateOpeningStoryGroup(saved.storyBeats);
  Engine.state = {
    ...d, ...saved,
    saveVersion:SAVE_VERSION,
    storyBeats,
    transcript:Array.isArray(saved.transcript)?saved.transcript.map(entry=>String(entry)):[],
    storyGroupSeq:Math.max(+saved.storyGroupSeq||0,storyGroupSequence(storyBeats)),
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
  Engine.pendingScrollGroupId=[...storyBeats].reverse().find(beat=>beat.groupId)?.groupId||null;
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
  $$('#choices button').forEach(button=>{ button.disabled=busy||button.dataset.locked==='true'; });
}

function renderEditorInventory(){
  if(!Engine.el.edInvList) return;
  Engine.el.edInvList.innerHTML=Engine.inventoryDraft.length
    ? Engine.inventoryDraft.map((item,index)=>`<span class="inventory-edit-chip${isProtectedInventoryItem(item)?' protected':''}"><span>${esc(item)}</span>${isProtectedInventoryItem(item)?'<i>Recorded</i>':`<button type="button" data-remove-item="${index}" aria-label="Remove ${esc(item)}">&#10005;</button>`}</span>`).join('')
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
  Engine.el.edInvList.addEventListener('click',e=>{ const button=e.target.closest('[data-remove-item]'); if(!button) return; const index=+button.dataset.removeItem; if(isProtectedInventoryItem(Engine.inventoryDraft[index])) return; Engine.inventoryDraft.splice(index,1); renderEditorInventory(); });
  Engine.el.btnEditSave.onclick=()=>{ const C=S.character;
    C.name=Engine.el.edName.value||C.name; C.race=Engine.el.edRace.value||C.race;
    C.STR=+Engine.el.edSTR.value||C.STR; C.DEX=+Engine.el.edDEX.value||C.DEX; C.INT=+Engine.el.edINT.value||C.INT; C.CHA=+Engine.el.edCHA.value||C.CHA;
    C.HP=+Engine.el.edHP.value||C.HP; C.MaxHP=Math.max(C.HP,+C.MaxHP||C.HP); C.Gold=+Engine.el.edGold.value||C.Gold;
    C.inventory=cleanInventory([...Engine.inventoryDraft,...C.inventory.filter(isProtectedInventoryItem)]);
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

function renderStoryBeat(beat,parent){
  if(beat.kind==='effects'){
    const panel=document.createElement('div');
    panel.className='effect-summary';
    panel.setAttribute('role','status');
    panel.innerHTML=(beat.effects||[]).map(effect=>`<span class="effect-entry ${esc(effect.tone||'info')}"><b>${esc(effect.label)}</b>${effect.detail?`<small>${esc(effect.detail)}</small>`:''}</span>`).join('');
    parent.appendChild(panel);
    return null;
  }
  const p=document.createElement('p');
  p.classList.add('beat');
  p.dataset.beatKind=beat.kind||'story';
  p.innerHTML=beat.html?sanitizeRichHTML(beat.html):esc(beat.text);
  if(beat.roll){ const g=document.createElement('span'); g.className='rollglyph'; g.textContent=' ⟡'; g.title=beat.roll; p.appendChild(g); }
  if(beat.kind==='success'){ p.classList.add('glow-success'); const rg=p.querySelector('.rollglyph'); if(rg) rg.style.color='#D5A84A'; }
  if(beat.kind==='fail'){ p.classList.add('glow-fail'); const rg=p.querySelector('.rollglyph'); if(rg) rg.style.color='#A12525'; }
  if(beat.kind==='story') p.classList.add('glow-story');
  parent.appendChild(p);
  return p;
}

function renderAll(){
  const s=Engine.state, C=s.character, F=s.flags;
  $('#seedVal').textContent=s.seed; $('#turnVal').textContent=s.turn;
  const keysKnown=!!s.campaign?.flags?.keysKnown;
  Engine.el.keysVal.textContent=keysKnown?`${(F.keys||[]).length} / 3`:(s.campaign?.writ==='deep'?'Deep Writ':'Probationary');
  if(Engine.el.sessionProgressLabel) Engine.el.sessionProgressLabel.textContent=keysKnown?'Keys':'Writ';
  if(Engine.el.meterKicker) Engine.el.meterKicker.textContent=keysKnown?'Calibration':'Field authority';
  if(Engine.el.meterLabel) Engine.el.meterLabel.textContent=keysKnown?'Keys':(s.campaign?.writ==='deep'?'Deep Writ':'Writ');
  const meter=Engine.el.keysArc?.closest('.keys-meter'),ring=Engine.el.keysArc?.closest('svg');
  if(meter) meter.title=keysKnown?'Calibration Keys recovered':'Field authority';
  if(ring) ring.setAttribute('aria-label',keysKnown?'Calibration Keys recovered':'Field authority progress');
  Engine.el.sceneHeading.textContent=s.scene;
  Engine.el.charHeaderName.textContent=C.name;
  Engine.el.charHeaderRace.textContent=C.race;
  if(Engine.el.objectivePanel){
    const chapter=CAMPAIGN_CHAPTERS[s.campaign?.chapter]||CAMPAIGN_CHAPTERS.tutorial;
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
  lines.push(`<div class="ledger-line"><span>Authority</span><b>${esc(s.campaign?.authority||'Uncommissioned')}</b></div>`);
  if((s.campaign?.evidence||[]).length) lines.push(`<div class="ledger-line"><span>Evidence</span><b>${s.campaign.evidence.length} joined entries</b></div>`);
  if((s.campaign?.repairs||[]).length) lines.push(`<div class="ledger-line"><span>Repairs</span><b>${s.campaign.repairs.length} completed</b></div>`);
  if(keysKnown&&(F.keys||[]).length) lines.push(`<div class="ledger-line"><span>Keys</span><b>${(F.keys||[]).map(esc).join(', ')}</b></div>`);
  if(F.bossDealtWith) lines.push(`<div class="ledger-line"><span>Resolution</span><b>${esc(s.campaign?.ending?.title||'Recorded')}</b></div>`);
  (s.campaign?.discoveries||[]).slice(-1).forEach(discovery=>lines.push(`<div class="ledger-line"><span>Finding</span><b>${esc(discovery)}</b></div>`));
  Engine.el.ledgerPanel.innerHTML = lines.join('') || '<div class="ledger-empty">No discoveries inscribed.</div>';


  // Keys ring arc
  try{
    const keysCt=(F.keys||[]).length,writProgress=s.campaign?.writ==='deep'?1:s.campaign?.writ==='probationary'?.45:0;
    const circ = 2*Math.PI*40; const frac = keysKnown?Math.min(1,keysCt/3):writProgress;
    const dash = Math.max(0.0001, circ*frac);
    if(Engine.el.keysArc){ Engine.el.keysArc.setAttribute('stroke-dasharray', `${dash} ${circ-dash}`); }
  }catch{}
  // Story

  Engine.el.story.innerHTML='';
  const groups=new Map();
  let latestTextElement=null;
  for(const beat of s.storyBeats){
    let parent=Engine.el.story;
    if(beat.groupId){
      let group=groups.get(beat.groupId);
      if(!group){
        group=document.createElement('section');
        group.className='story-group';
        group.dataset.storyGroup=beat.groupId;
        group.setAttribute('aria-label','Player choice and its result');
        const caption=document.createElement('div');
        caption.className='story-choice-caption';
        caption.innerHTML='<span>Chosen course</span><strong>Recorded choice</strong>';
        const content=document.createElement('div');
        content.className='story-group-content';
        group.append(caption,content);
        groups.set(beat.groupId,group);
        Engine.el.story.appendChild(group);
      }
      if(beat.kind==='choice'){
        const caption=group.querySelector('.story-choice-caption');
        caption.innerHTML=`<span>Chosen course</span><strong>${esc(beat.text||'Recorded choice')}</strong>`;
        continue;
      }
      if(beat.kind==='opening'){
        group.classList.add('story-group-opening');
        group.setAttribute('aria-label','Opening story passage: The Journey Begins');
        const caption=group.querySelector('.story-choice-caption');
        caption.innerHTML=`<span>Opening record</span><strong>${esc(beat.text||OPENING_GROUP_TITLE)}</strong>`;
        continue;
      }
      parent=group.querySelector('.story-group-content');
    }else if(beat.kind==='choice'){
      continue;
    }
    const rendered=renderStoryBeat(beat,parent);
    if(rendered) latestTextElement=rendered;
  }
  const renderedGroups=$$('.story-group',Engine.el.story);
  renderedGroups.at(-1)?.classList.add('latest');

  if (s.settings.typewriter && s._pendingType){
    const p=latestTextElement;
    if(p&&!p.dataset.typed){ p.dataset.typed='1'; typewriteRich(p,s.settings.cps); }
    s._pendingType=false;
  }
  if(Engine.resetStoryScroll){
    Engine.el.story.scrollTop=0;
    Engine.resetStoryScroll=false;
  }else if(Engine.pendingScrollGroupId){
    const groupId=String(Engine.pendingScrollGroupId);
    const target=Engine.el.story.querySelector(`[data-story-group="${CSS.escape(groupId)}"]`);
    Engine.pendingScrollGroupId=null;
    if(target) requestAnimationFrame(()=>{
      const storyRect=Engine.el.story.getBoundingClientRect();
      const targetRect=target.getBoundingClientRect();
      const top=Math.max(0,Engine.el.story.scrollTop+(targetRect.top-storyRect.top)-18);
      Engine.el.story.scrollTo({top,behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
  }
}

/* ---------- authored campaign flow ---------- */
function currentScene(){ return CAMPAIGN_SCENES[Engine.state.campaign?.sceneId]||CAMPAIGN_SCENES['tutorial-commission']; }
function beginStoryGroup(choice,labelOverride=''){
  const S=Engine.state;
  S.storyGroupSeq=(+S.storyGroupSeq||0)+1;
  const groupId=`story-${S.storyGroupSeq}`;
  const label=String(labelOverride||choice?.label||choice?.sentence||'Recorded choice').trim();
  Engine.activeStoryGroup=groupId;
  Engine.pendingScrollGroupId=groupId;
  S.storyBeats.push({kind:'choice',text:label,choiceId:choice?.id||null,groupId});
  S.transcript.push(`Choice — ${label}`);
  return groupId;
}
function ensureStoryGroup(choice,labelOverride=''){
  return Engine.activeStoryGroup||beginStoryGroup(choice,labelOverride);
}
function endStoryGroup(){ Engine.activeStoryGroup=null; }
function authoredPassageHTML(text){
  const source=String(text||'');
  const term='Lantern Constables';
  if(!source.includes(term)) return null;
  const definition=window.GLOSS?.['lantern constables']||'';
  return esc(source).split(term).join(`<span class="gloss" tabindex="0" data-def="${esc(definition)}">${term}</span>`);
}
function appendPassage(text,kind='story'){
  String(text||'').split(/\n\s*\n/).map(part=>part.trim()).filter(Boolean).forEach(part=>appendBeat(part,null,kind,authoredPassageHTML(part)));
}
function appendEffectSummary(effects){
  const clean=(effects||[]).filter(effect=>effect?.label);
  if(!clean.length) return;
  Engine.state.storyBeats.push({kind:'effects',effects:clean,...(Engine.activeStoryGroup?{groupId:Engine.activeStoryGroup}:{})});
  Engine.state.transcript.push(clean.map(effect=>`${effect.label}${effect.detail?` — ${effect.detail}`:''}`).join(' | '));
  Engine.state._pendingType=false;
}
function addJournal(kind,text){
  if(!text) return;
  const C=Engine.state.campaign,J=Engine.state.journal,campaignKey=kind==='optional'?'optionalCompleted':kind;
  if(Array.isArray(C[campaignKey])&&!C[campaignKey].includes(text)) C[campaignKey].push(text);
  if(Array.isArray(J[kind])&&!J[kind].includes(text)) J[kind].push(text);
}
function grantItem(name,reason,{narrate=true}={}){
  if(!name) return false;
  const S=Engine.state;
  if(S.character.inventory.some(item=>item.toLowerCase()===name.toLowerCase())) return false;
  S.character.inventory=cleanInventory([...S.character.inventory,name]); syncInventoryState(S);
  if(narrate) appendPassage(reason||`You add ${name} to your field case.`);
  toast(`${name} added to the field case`); return true;
}
function applyEffects(effect={},context={}){
  const S=Engine.state,C=S.campaign,feedback=[];
  const source=context.source||effect.reason||'';
  const add=(tone,label,detail='')=>feedback.push({tone,label,detail});
  if(typeof effect.gold==='number'&&effect.gold){
    const before=S.character.Gold; S.character.Gold=Math.max(0,before+effect.gold); const delta=S.character.Gold-before;
    if(delta){ toast(`${delta>0?'+':''}${delta} gold`); add(delta>0?'gain':'loss',`Gold ${delta>0?'+':''}${delta}`,effect.goldReason||source); }
  }
  if(typeof effect.hp==='number'&&effect.hp){
    const before=S.character.HP; S.character.HP=clamp(before+effect.hp,1,S.character.MaxHP||before); const delta=S.character.HP-before;
    if(delta){ if(delta<0) toast(`${Math.abs(delta)} HP lost`,'warning'); add(delta>0?'gain':'loss',`Health ${delta>0?'+':''}${delta}`,effect.hpReason||source); }
  }
  const attributeChanges=[];
  Object.entries(effect.attributes||{}).forEach(([stat,value])=>{
    if(!['STR','DEX','INT','CHA'].includes(stat)||!value) return;
    const before=+S.character[stat]||10; S.character[stat]=clamp(before+value,6,18); const delta=S.character[stat]-before;
    if(delta) attributeChanges.push(`${stat} ${delta>0?'+':''}${delta}`);
  });
  if(attributeChanges.length) add('gain','Attribute improved',attributeChanges.join(' · '));
  const gained=[];
  if(effect.item&&grantItem(effect.item.name||effect.item,effect.item.reason,{narrate:!context.suppressItemNarrative})) gained.push(effect.item.name||effect.item);
  (effect.items||[]).forEach(item=>{ if(grantItem(item.name||item,item.reason,{narrate:!context.suppressItemNarrative})) gained.push(item.name||item); });
  if(effect.key){
    S.flags.keys=uniqueText([...(S.flags.keys||[]),effect.key]);
    if(grantItem(`${effect.key} Key`,effect.keyReason||`You secure the ${effect.key} Key in its travel cradle.`)) gained.push(`${effect.key} Key`);
    toast(`${effect.key} Key recovered`);
  }
  if(gained.length) add('gain','Item gained',gained.join(' · '));
  if(effect.authority&&effect.authority!==C.authority){ C.authority=effect.authority; add('gain','Authority updated',effect.authority); }
  if(effect.writ) C.writ=effect.writ;
  if(effect.flag) C.flags[effect.flag]=true;
  Object.entries(effect.flags||{}).forEach(([key,value])=>{ C.flags[key]=value; });
  const allied=[],standing=[];
  Object.entries(effect.alliance||{}).forEach(([key,value])=>{ C.alliances[key]=(C.alliances[key]||0)+value; if(value) allied.push(`${key} ${value>0?'+':''}${value}`); });
  Object.entries(effect.reputation||{}).forEach(([key,value])=>{ C.reputation[key]=(C.reputation[key]||0)+value; if(value) standing.push(`${key} ${value>0?'+':''}${value}`); });
  if(allied.length) add('support','Support changed',allied.join(' · '));
  if(standing.length) add('standing','Standing changed',standing.join(' · '));
  if(effect.route&&!C.routes.includes(effect.route)) C.routes.push(effect.route);
  addJournal('discoveries',effect.discovery); addJournal('evidence',effect.evidence); addJournal('testimony',effect.testimony); addJournal('repairs',effect.repair);
  addJournal('consequences',effect.consequence); addJournal('optional',effect.optional); addJournal('milestones',effect.milestone);
  if(effect.evidence) add('record','Evidence recorded',effect.evidence);
  if(effect.testimony) add('record','Testimony recorded',effect.testimony);
  if(effect.repair) add('repair','Repair completed',effect.repair);
  if(effect.consequence) add('loss','Consequence recorded',effect.consequence);
  if(effect.discovery) add('record','Discovery recorded',effect.discovery);
  appendEffectSummary(feedback);
  S.flags.bossReady=(S.flags.keys||[]).length>=2;
}
function pushUndo(){
  const S=Engine.state; S._undoStack=S._undoStack||[]; S._undoStack.push(captureRunState(S));
  while(S._undoStack.length>24) S._undoStack.shift();
}
function enterScene(sceneId,{appendStory=true,arrivalKey=null}={}){
  const S=Engine.state,C=S.campaign,next=CAMPAIGN_SCENES[sceneId]; if(!next) return;
  const previous=C.sceneId;
  if(previous&&previous!==sceneId&&!C.completedScenes.includes(previous)) C.completedScenes.push(previous);
  C.sceneId=sceneId; C.chapter=next.chapter; C.objective=next.objective; S.scene=next.title;
  const firstEntry=!C.enteredScenes.includes(sceneId);
  if(appendStory){
    const arrival=arrivalKey&&next.arrivals?.[arrivalKey];
    if(arrival) appendPassage(arrival);
    appendPassage(next.story);
  }
  if(firstEntry){ C.enteredScenes.push(sceneId); applyEffects(next.enter||{},{source:`Entered ${next.title}`}); }
  renderChoices(next.choices); S.turn++; renderAll(); persistState('Objective updated'); BGM.updateForState(S);
}
function beginTale(preserveProgress=false){
  const S=Engine.state;
  S.turn=0; S.storyBeats=[]; S.transcript=[]; S.storyGroupSeq=0; S._choiceHistory=[]; S._lastChoices=[]; S._undoStack=[]; S._arcStep=0;
  Engine.activeStoryGroup=null; Engine.pendingScrollGroupId=null; Engine.resetStoryScroll=true;
  if(!preserveProgress){ S.flags={rumors:false,keys:[],bossReady:false,bossDealtWith:false}; S.campaign=defaultCampaign(); S.journal=defaultJournal(); }
  else{ S.flags={rumors:false,keys:[],bossReady:false,bossDealtWith:false,...S.flags}; S.campaign=normalizeCampaign(S.campaign,S); S.journal=normalizeJournal(S.journal,S.campaign); }
  const sceneId=S.campaign.sceneId||'tutorial-commission';
  if(sceneId==='tutorial-commission'){
    Engine.activeStoryGroup=OPENING_GROUP_ID;
    S.storyBeats.push({kind:'opening',text:OPENING_GROUP_TITLE,groupId:OPENING_GROUP_ID});
    S.transcript.push(`Opening — ${OPENING_GROUP_TITLE}`);
    try{ enterScene(sceneId); }finally{ endStoryGroup(); }
  }else enterScene(sceneId);
}
function renderEpilogueText(text){
  Engine.el.epiContent.innerHTML=String(text||'').split(/\n\s*\n/).map(paragraph=>{
    const clean=paragraph.trim(),counter=clean.startsWith('Counter record:');
    return `<p class="${counter?'epilogue-counter':''}">${esc(clean)}</p>`;
  }).join('');
}
function endTale(){
  const S=Engine.state,C=S.character,ending=S.campaign.ending;
  const unresolved=S.campaign.flags?.unfathomerNamed?'The Unfathomer’s rise remains unresolved below Brassreach.':'The connected failures below Brassreach remain unexplained.';
  const ep=ending?.text||`You retire the expedition at ${currentScene().title} with ${C.Gold} gold and ${C.inventory.length} carried items. ${unresolved}`;
  if(!ending) appendBeat(ep,null,'story'); renderChoices([]); renderAll();
  Engine.el.epiTitle.textContent=ending?.title||'Expedition Retired'; renderEpilogueText(ep); openModal(Engine.el.modalEpi);
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
  if(ch.stat) parts.push({label:`Attribute: ${ch.stat}`,value:total,base:true,source:'attribute'});
  for(const bonus of (ch.bonuses||[])){
    let active=false,value=bonus.bonus||0,label=bonus.label||'situational advantage',source='situation',matchedItem=null;
    const ownedItem=bonus.owned||bonus.item;
    if(ownedItem&&owned.has(ownedItem)){ active=true; matchedItem=ownedItem; source='owned'; label=`Owned: ${ownedItem}`; }
    if(bonus.ownedAny){ matchedItem=bonus.ownedAny.find(item=>owned.has(item))||null; if(matchedItem){ active=true; source='owned'; label=`Owned: ${matchedItem}`; } }
    if(bonus.equipped&&equipped.has(bonus.equipped)){ active=true; matchedItem=bonus.equipped; source='equipped'; label=`Equipped: ${bonus.equipped}`; }
    if(bonus.equippedAny){ matchedItem=bonus.equippedAny.find(item=>equipped.has(item))||null; if(matchedItem){ active=true; source='equipped'; label=`Equipped: ${matchedItem}`; } }
    if(bonus.derived&&derivedStats(S)[bonus.derived]>=bonus.threshold){ active=true; source='rating'; label=`${bonus.derived[0].toUpperCase()+bonus.derived.slice(1)} rating`; }
    if(bonus.flag&&campaign.flags?.[bonus.flag]){ active=true; source='preparation'; label=bonus.label||'Prepared route'; }
    if(bonus.alliance&&(campaign.alliances?.[bonus.alliance]||0)>0){ active=true; source='support'; label=bonus.label||`Support: ${bonus.alliance}`; }
    if(bonus.reputation&&(campaign.reputation?.[bonus.reputation]||0)>=(bonus.threshold||1)){ active=true; source='standing'; label=bonus.label||`Standing: ${bonus.reputation}`; }
    if(bonus.evidence&&campaign.evidence?.includes(bonus.evidence)){ active=true; source='evidence'; label=bonus.label||'Relevant evidence'; }
    if(bonus.testimony&&campaign.testimony?.includes(bonus.testimony)){ active=true; source='testimony'; label=bonus.label||'Witnessed account'; }
    if(bonus.repair&&campaign.repairs?.includes(bonus.repair)){ active=true; source='repair'; label=bonus.label||'Earlier repair'; }
    if(bonus.keys&&(S.flags.keys||[]).length>=bonus.keys){ active=true; source='key'; label=bonus.label||`${bonus.keys} Keys`; }
    if(active){ total+=value; parts.push({label,value,source,item:matchedItem}); }
  }
  return {total,parts};
}
function campaignMetrics(){
  const C=Engine.state.campaign;
  return {
    keys:(Engine.state.flags.keys||[]).length,
    evidence:C.evidence?.length||0,
    testimony:C.testimony?.length||0,
    repairs:C.repairs?.length||0,
    alliances:Object.values(C.alliances||{}).filter(value=>value>0).length,
    reputation:Object.values(C.reputation||{}).reduce((sum,value)=>sum+(+value||0),0)
  };
}
function requirementStatus(ch){
  const metrics=campaignMetrics(),requirements=ch.requirements||{};
  const missing=Object.entries(requirements).filter(([key,value])=>(metrics[key]||0)<value).map(([key,value])=>`${key} ${metrics[key]||0}/${value}`);
  return {ok:missing.length===0,missing,metrics};
}
function modifierText(ch){
  if(ch.type==='ending'){
    const requirement=requirementStatus(ch);
    return requirement.ok?'Living Choice · outcome reflects your preparation':(ch.requirementText||`Missing: ${requirement.missing.join(', ')}`);
  }
  if(ch.type!=='check') return ch.type==='merchant'?'Merchant · buy and sell':'No roll';
  const active=choiceBonusBreakdown(ch).parts.map(part=>`${part.label} ${fmt(part.value)}`); return `DC ${ch.dc}${active.length?` · ${active.join(' · ')}`:''}`;
}
function renderChoices(choices){
  const list=Engine.el.choiceList; if(!list) return; list.innerHTML='';
  const pool=Array.isArray(choices)?choices:[]; Engine.state._lastChoices=pool.map(ch=>ch.id);
  pool.forEach((ch,index)=>{
    const requirement=ch.type==='ending'?requirementStatus(ch):{ok:true};
    const btn=document.createElement('button'); btn.className=`choice-btn choice-${ch.type||'check'}${index===0?' recommended':''}`;
    btn.innerHTML=`<span class="choice-label">${esc(ch.label||ch.sentence)}</span><small>${esc(modifierText(ch))}</small>`;
    btn.dataset.choiceId=ch.id; btn.dataset.locked=String(!requirement.ok); btn.disabled=!requirement.ok; btn.setAttribute('aria-disabled',String(!requirement.ok));
    btn.onclick=()=>{ Sound.click(); resolveChoice(ch); }; list.appendChild(btn);
  });
}

function campaignExplorationText(ch){
  const S=Engine.state,scene=currentScene(),count=S.campaign.exploration[scene.id]||0;
  const context={
    tutorial:['Your inspection reveals fresh strain around the immediate hazard, but no new cause. You mark the safest return route, add the observation to your ledger, and turn back before curiosity becomes delay.','You hold still until nearby footsteps fade. The same low overtone enters the stone beneath your hand, lingers after the visible mechanism grows quiet, and disappears before you can find its source. You record the limit as carefully as the sound.'],
    halls:['Beneath soot and newer paint, you uncover a maintenance mark pointing beyond the border of the modern plan. It confirms that the route once continued, but your current objective remains the strongest way to learn where it went.','Water beads along the lower masonry, cold and metallic against your fingers. The wall remains stable for now. You enter the damp line in your ledger without pretending it explains the wider failure.'],
    archives:['A dated note in the margin supports the sequence already assembled in your ledger. It changes no conclusion by itself, but Lithen nods when you preserve it beside the source that gave it meaning.','Three neighboring shelves preserve three different explanations for the same old collapse. You record the disagreement, the authors, and the evidence each possessed before returning to the comparison Lithen can actually test.'],
    depths:['Cold water presses through the floor in one broad movement and makes every loose chain answer together. You secure the return line, wait for the pressure to pass, and continue without mistaking survival for discovery.','A scarred Warden mark identifies the next brace that still carries weight. You verify it before trusting your rope to the stone. The larger rise does not slow for this brief inspection.'],
    brassworks:['Behind a polished modern housing, you find another careful worker patch bearing years of heat without recognition. Its workmanship supports the shared repair plan; it cannot replace the next coordinated step.','A faint interference beat persists beneath the silent machines. You follow it across two floor plates, mark the timing, and return to Sella before testing anything alone.'],
    gate:['The Gate reveals another layer of load, repair, and consequence. The image is vast enough to invite speculation, but the active instrument still awaits the concrete calibration named in your objective.'],
    choice:['Pressure changes around you with the stable interval, and the cerulean lights turn as one. No words form in the water. The living Choice still depends upon the preparation measured by the Counter.']
  };
  const lines=context[scene.chapter]||context.tutorial,line=lines[count%lines.length]; S.campaign.exploration[scene.id]=count+1;
  return `You ${ch.sentence.replace(/^you\s+/i,'')}. ${line}`;
}
function commitExploration(text,html=null){ appendBeat(text,null,'story',html); Engine.state.turn++; renderAll(); persistState('Exploration stored'); }
function liveCanonContext(){
  const C=Engine.state.campaign,named=!!C.flags?.unfathomerNamed;
  return {
    canon_version:'master-lore-v1',scene_id:C.sceneId,chapter:C.chapter,unfathomer_name_known:named,
    known_evidence:(C.evidence||[]).slice(-6),completed_repairs:(C.repairs||[]).slice(-6),current_objective:C.objective,
    rules:[
      'Narrate only the submitted exploratory action; do not advance the authored scene, award items, change stats, or resolve the objective.',
      named?'The Unfathomer is continuous living resonance and cannot speak complex language.':'Do not use the name Unfathomer or reveal a hidden entity; the player knows only connected failures and a low overtone.',
      'Do not introduce a Fourth Measure, Line Measure, stolen constitutional record, magical command, or speaking boss.',
      'Use present-tense, atmospheric high-fantasy prose with a clear actor, object, physical setting, and visible result. Rich detail must establish scale, danger, character, or causality.',
      'Historical facts must come from a named speaker, document, inscription, or other source available in the current scene.',
      'Preserve each character voice: Brunna is concise, Dorrin practical, Lithen learned but explicit about uncertainty, Orra direct, and Sella dry and technically observant.',
      'Never invent item ownership, equipment, bonuses, injuries, gold changes, reputation changes, or other game-state changes.',
      'Let the beat move from physical impression through action or discovery to a clear turn, while remaining understandable on one attentive reading. Preserve uncertainty where the record is incomplete.'
    ]
  };
}
function liveNarrationIsCanonical(text){
  const value=String(text||'');
  const alwaysForbidden=[/Fourth Measure/i,/Line Measure/i,/stolen (?:register|record|covenant)/i,/command(?:ed|ing)? the Unfathomer/i,/Gate (?:was|is) built to (?:bind|imprison|control)/i,/Orra.{0,40}(?:badge|stole|theft)/i,/Unfathomer.{0,45}(?:says|said|asks|asked|speaks|spoke|whispers|replies)/i];
  if(alwaysForbidden.some(pattern=>pattern.test(value))) return false;
  if(!Engine.state.campaign.flags?.unfathomerNamed&&/\bUnfathomer\b/i.test(value)) return false;
  return true;
}
function doNarrate(ch){
  if(Engine.busy) return; setBusy(true); pushUndo();
  const fallbackText=campaignExplorationText(ch);
  if(!Engine.state.live.on){ commitExploration(fallbackText); setBusy(false); return; }
  const payload={action:ch.sentence,source:'narrate',stat:null,dc:null,passed:null,game_state:snapshotState(),history:recentHistory(),canon_context:liveCanonContext()};
  const fallback=()=>({story_paragraph:fallbackText});
  Promise.resolve(Weaver.turn(payload,fallback)).then(resp=>{
    const text=resp?.story_paragraph||fallbackText,html=resp?.story_paragraph_html?sanitizeRichHTML(resp.story_paragraph_html):null;
    if(!liveNarrationIsCanonical(`${text} ${stripHTML(html||'')}`)){ toast('Live narration conflicted with the established record; the local account was used.','warning'); commitExploration(fallbackText); return; }
    commitExploration(stripHTML(text),html);
  }).catch(()=>commitExploration(fallbackText)).finally(()=>setBusy(false));
}

function resolveChoice(ch){
  if(Engine.busy||!ch) return;
  if(ch.type==='merchant'){ openMerchant(ch.merchant,ch); return; }
  if(ch.type==='ending'){
    const requirement=requirementStatus(ch);
    if(!requirement.ok){ toast(`That course is not yet supported: ${requirement.missing.join(', ')}.`,'warning'); return; }
    pushUndo(); beginStoryGroup(ch); try{ finalizeEnding(ch.ending); }finally{ endStoryGroup(); } return;
  }
  pushUndo();
  if(ch.type==='advance'){
    beginStoryGroup(ch);
    try{ appendPassage(ch.outcome||'You move on.'); applyEffects(ch.effects||{},{source:ch.label}); enterScene(ch.next,{arrivalKey:ch.id}); }
    finally{ endStoryGroup(); }
    return;
  }
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
  ensureStoryGroup(ch);
  markEncounter(ch);
  const resultText=passed?(ch.success||'The attempt succeeds.'):(ch.failure||'The attempt fails, but the expedition continues.');
  const paragraphs=String(resultText).split(/\n\s*\n/).map(part=>part.trim()).filter(Boolean);
  paragraphs.forEach((paragraph,index)=>appendBeat(paragraph,index===paragraphs.length-1?rollLabel(result):null,index===paragraphs.length-1?(passed?'success':'fail'):'story'));
  const effects=ch.effects?(ch.effects[passed?'success':'failure']||{}):{}; applyEffects(effects,{source:ch.label}); Sound.sfx(passed?'success':'fail');
  enterScene(passed?(ch.nextSuccess||ch.next):(ch.nextFail||ch.next),{arrivalKey:`${ch.id}:${passed?'success':'failure'}`});
  endStoryGroup();
}
function eligibleSacrifices(){
  const equipped=new Set(Object.values(Engine.state.equipment||{}).filter(Boolean));
  return Engine.state.character.inventory.filter(name=>!equipped.has(name)&&!isProtectedInventoryItem(name));
}
function failureCost(){ const order=['tutorial','halls','archives','depths','brassworks','gate','choice'],index=Math.max(0,order.indexOf(Engine.state.campaign.chapter)); return 4+(index*2); }
function openLostEncounter(ch,result){
  const id=ch.encounter||ch.id,used=!!Engine.state.campaign.rerollsUsed[id],cost=failureCost(),items=eligibleSacrifices(); Engine.pendingFailure={ch,result,id,cost};
  Engine.el.lostContent.innerHTML=`<p id="lostSummary">${esc(ch.failure||'The attempt fails, but the expedition can continue.')}</p><div class="lost-roll"><span>Result</span><strong>${esc(rollLabel(result))}</strong></div><p class="lost-copy">The moment cannot be erased. You may accept its consequence, pay once for emergency labor and replacement material, or surrender an ordinary carried item to create one more opening. Keys, relics, quest records, and equipped gear remain protected.</p><div class="lost-options"><button class="btn gold" data-lost-action="gold" ${used||Engine.state.character.Gold<cost?'disabled':''}>Spend ${cost} gold<br><small>${used?'Second attempt already used':`${Engine.state.character.Gold} available`}</small></button><button class="btn" data-lost-action="item" ${used||!items.length?'disabled':''}>Sacrifice a random item<br><small>${items.length} eligible</small></button><button class="btn red" data-lost-action="accept">Accept the consequence<br><small>The story continues from it</small></button></div>`;
  openModal(Engine.el.modalLost); Engine.el.modalLost.querySelector('button:not([disabled])')?.focus();
}
function closeLost(){ Engine.pendingFailure=null; closeModal(Engine.el.modalLost); }
function acceptFailure(){ const pending=Engine.pendingFailure; if(!pending) return; closeLost(); completeCheckedChoice(pending.ch,pending.result,false); }
function rerollFailure(method){
  const pending=Engine.pendingFailure; if(!pending) return; const S=Engine.state; if(S.campaign.rerollsUsed[pending.id]) return; let payment='';
  if(method==='gold'){
    if(S.character.Gold<pending.cost) return;
    ensureStoryGroup(pending.ch);
    payment=`You pay ${pending.cost} gold for emergency help, replacement material, and one more attempt.`;
    appendPassage(payment); applyEffects({gold:-pending.cost,goldReason:'funded a second attempt'},{source:'Encounter recovery'});
  }else{
    const eligible=eligibleSacrifices(); if(!eligible.length) return; const lost=pick(eligible);
    ensureStoryGroup(pending.ch);
    S.character.inventory=S.character.inventory.filter(item=>item!==lost); syncInventoryState(S);
    payment=`You leave the ${lost} behind to recover your position and try again.`; appendPassage(payment); appendEffectSummary([{tone:'loss',label:'Item lost',detail:lost}]);
  }
  S.campaign.rerollsUsed[pending.id]=true;
  const bonus=choiceBonusBreakdown(pending.ch),roll=rnd(1,20),total=roll+bonus.total+1,result={roll,total,dc:pending.ch.dc,bonus:{...bonus,parts:[...bonus.parts,{label:'resolve',value:1}]},passed:total>=pending.ch.dc},ch=pending.ch;
  closeLost(); completeCheckedChoice(ch,result,result.passed);
}
function finalizeEnding(id){
  const S=Engine.state,ending=ENDINGS[id]||ENDINGS.hold,metrics=campaignMetrics();
  const strongByEnding={
    concord:metrics.keys===3&&metrics.evidence>=9&&metrics.repairs>=7&&metrics.alliances>=4&&S.campaign.flags.fullRecord&&S.campaign.flags.networkImproved,
    channel:metrics.keys===3&&metrics.evidence>=6&&metrics.repairs>=5,
    bind:metrics.repairs>=5&&metrics.evidence>=5,
    banish:metrics.evidence>=5&&metrics.testimony>=3,
    hold:metrics.repairs>=4&&metrics.alliances>=3
  };
  const quality=strongByEnding[id]?'strong':'strained';
  const counter=`Counter record: ${metrics.keys} Keys, ${metrics.evidence} evidence entries, ${metrics.testimony} witnessed accounts, ${metrics.repairs} completed repairs, and ${metrics.alliances} allied groups.`;
  const narrative=[ending.address,ending[quality]].filter(Boolean).join('\n\n');
  const text=`${narrative}\n\n${counter}`;
  S.campaign.ending={id,title:ending.title,text,quality,metrics}; S.flags.bossDealtWith=true; S.campaign.objective='The expedition is complete.';
  addJournal('milestones',ending.title); appendPassage(narrative); appendEffectSummary([{tone:'record',label:'Counter record',detail:`${metrics.keys} Keys · ${metrics.evidence} evidence · ${metrics.testimony} accounts · ${metrics.repairs} repairs · ${metrics.alliances} allies`}]); renderChoices([]); S.turn++; renderAll(); persistState('Epilogue stored');
  Engine.el.epiTitle.textContent=ending.title; renderEpilogueText(text); openModal(Engine.el.modalEpi); BGM.updateForState(S);
}

function openMerchant(id,choice=null){ Engine.activeMerchant=MERCHANTS[id]; Engine.activeMerchantChoice=choice; if(!Engine.activeMerchant) return; renderMerchant(); openModal(Engine.el.modalMerchant); }
function merchantBuyPrice(name){ return Math.max(1,Math.ceil(itemMeta(name).value*.65)); }
function merchantSellPrice(name){ return Math.max(1,Math.floor(itemMeta(name).value*.45)); }
function canSell(name){ return !Object.values(Engine.state.equipment||{}).includes(name)&&!isProtectedInventoryItem(name); }
function renderMerchant(){
  const merchant=Engine.activeMerchant;if(!merchant) return; const S=Engine.state; Engine.el.merchantTitle.textContent=merchant.name; Engine.el.merchantKicker.textContent=merchant.title;
  const stock=merchant.stock.map(name=>{ const meta=itemMeta(name),price=merchantBuyPrice(name),owned=S.character.inventory.includes(name); return `<article class="trade-item ${qualityClass(meta)}"><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><div><strong>${esc(name)}</strong><small>${QUALITY_LABEL[meta.quality]} ${esc(meta.category)} · ${price} gold</small><p>${esc(meta.mechanic)}</p></div><button class="btn mini" data-buy="${esc(name)}" ${owned||S.character.Gold<price?'disabled':''}>${owned?'Owned':'Buy'}</button></article>`; }).join('');
  const sellable=S.character.inventory.map(name=>{ const meta=itemMeta(name),allowed=canSell(name); return `<article class="trade-item ${qualityClass(meta)}"><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><div><strong>${esc(name)}</strong><small>${merchantSellPrice(name)} gold</small></div><button class="btn mini" data-sell="${esc(name)}" ${allowed?'':'disabled'}>${allowed?'Sell':'Protected'}</button></article>`; }).join('')||'<p class="merchant-empty">Your field case is empty.</p>';
  Engine.el.merchantContent.innerHTML=`<div class="merchant-intro"><p>${esc(merchant.greeting)}</p><strong>${S.character.Gold} gold</strong></div><div class="trade-columns"><section><h4>For Sale</h4>${stock}</section><section><h4>Your Field Case</h4>${sellable}</section></div>`;
}
function buyMerchantItem(name){
  const price=merchantBuyPrice(name),S=Engine.state;if(S.character.Gold<price||S.character.inventory.includes(name)) return;
  beginStoryGroup(Engine.activeMerchantChoice,`Buy ${name} from ${Engine.activeMerchant.name}.`);
  try{
    appendPassage(`You bought the ${name} from ${Engine.activeMerchant.name} for ${price} gold.`);
    applyEffects({gold:-price,goldReason:`bought ${name}`,item:{name}},{source:`Purchase from ${Engine.activeMerchant.name}`,suppressItemNarrative:true});
    persistState('Purchase stored'); renderAll(); renderMerchant(); Sound.inventory('place');
  }finally{ endStoryGroup(); }
}
function sellMerchantItem(name){
  if(!canSell(name)) return; const S=Engine.state,price=merchantSellPrice(name);
  beginStoryGroup(Engine.activeMerchantChoice,`Sell ${name} to ${Engine.activeMerchant.name}.`);
  try{
    S.character.inventory=S.character.inventory.filter(item=>item!==name); S.character.Gold+=price; syncInventoryState(S);
    appendPassage(`You sold the ${name} to ${Engine.activeMerchant.name} for ${price} gold.`);
    appendEffectSummary([{tone:'gain',label:`Gold +${price}`,detail:`sold ${name}`},{tone:'loss',label:'Item sold',detail:name}]);
    persistState('Sale stored'); renderAll(); renderMerchant(); Sound.inventory('pickup');
  }finally{ endStoryGroup(); }
}
function renderJournal(){
  const C=Engine.state.campaign,J=Engine.state.journal,scene=currentScene(),chapter=CAMPAIGN_CHAPTERS[C.chapter]||CAMPAIGN_CHAPTERS.tutorial,metrics=campaignMetrics();
  const section=(title,items,empty)=>`<section><h4>${title}</h4>${items.length?`<ol>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ol>`:`<p class="journal-empty">${empty}</p>`}</section>`;
  const standing=Object.entries(C.reputation||{}).map(([name,value])=>`<span><small>${esc(name)}</small><b>${value}</b></span>`).join('');
  Engine.el.journalContent.innerHTML=`<div class="journal-current"><span>${chapter.act} · ${chapter.label}</span><h3>${esc(scene.title)}</h3><p>${esc(C.objective)}</p><div class="journal-summary"><span><small>Authority</small><b>${esc(C.authority)}</b></span><span><small>Evidence</small><b>${metrics.evidence}</b></span><span><small>Repairs</small><b>${metrics.repairs}</b></span><span><small>Allies</small><b>${metrics.alliances}</b></span></div><div class="journal-standing">${standing}</div></div><div class="journal-grid">${section('Milestones',J.milestones,'No milestones recorded yet.')}${section('Evidence',J.evidence,'No evidence joined yet.')}${section('Witnessed Accounts',J.testimony,'No testimony recorded yet.')}${section('Completed Repairs',J.repairs,'No repairs completed yet.')}${section('Discoveries',J.discoveries,'No discoveries recorded yet.')}${section('Consequences',J.consequences,'No lasting consequences yet.')}</div>`;
}
function openJournal(){ renderJournal(); openModal(Engine.el.modalJournal); }
function makeChoiceSet(){ return currentScene().choices||[]; }

/* ---------- helpers ---------- */
function appendBeat(text, roll, kind=null, html=null){
  const group=Engine.activeStoryGroup?{groupId:Engine.activeStoryGroup}:{};
  const entry=html?{html:sanitizeRichHTML(html),roll,kind,...group}:{text,roll,kind,...group};
  Engine.state.storyBeats.push(entry);
  Engine.state.transcript.push(html?strip(html):text);
  Engine.state._pendingType=true;
}
function captureRunState(S){
  return JSON.parse(JSON.stringify({
    seed:S.seed, turn:S.turn, scene:S.scene,
    storyBeats:S.storyBeats, transcript:S.transcript,
    storyGroupSeq:S.storyGroupSeq,
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
      el.setAttribute('tabindex','0');
    }
    el.appendChild(children);
    return el;
  };

  const output=document.createElement('div');
  source.content.childNodes.forEach(node=>output.appendChild(clean(node)));
  return output.innerHTML;
}
function autoGen(){ const n=['Eldan','Brassa','Keled','Varek','Moriah','Thrain','Ysolda','Kael']; const C=Engine.state.character;
  const protectedItems=C.inventory.filter(isProtectedInventoryItem);
  C.name=pick(n); C.race=pick(['Dwarf','Human','Elf','Gnome','Halfling','Orc']); C.STR=rnd(8,18); C.DEX=rnd(8,18); C.INT=rnd(8,18); C.CHA=rnd(8,18); C.HP=rnd(8,20); C.MaxHP=C.HP; C.Gold=rnd(0,25); C.inventory=cleanInventory([...['Torch','Canteen','Oil Flask','Rope Coil','Lockpin'].sort(()=>Math.random()-.5).slice(0,rnd(1,3)),...protectedItems]); Engine.state.equipment=blankEquipment(); syncInventoryState(Engine.state); renderAll(); }
function toast(txt,tone='info'){ const region=Engine.el.toastRegion||document.body; while(region.children.length>=4) region.firstElementChild?.remove(); const t=document.createElement('div'); t.className=`toast ${tone}`; t.textContent=txt; region.appendChild(t); requestAnimationFrame(()=>t.classList.add('show')); setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),240); },2400); }
function exportTranscript(){
  const S=Engine.state;
  let body='',openGroup=null;
  for(const beat of S.storyBeats){
    const group=beat.groupId||null;
    if(group!==openGroup){
      if(openGroup) body+='</section>';
      if(group) body+='<section class="turn">';
      openGroup=group;
    }
    if(beat.kind==='opening'){ body+=`<h2><span>Opening record</span>${esc(beat.text||OPENING_GROUP_TITLE)}</h2>`; continue; }
    if(beat.kind==='choice'){ body+=`<h2><span>Chosen course</span>${esc(beat.text||'Recorded choice')}</h2>`; continue; }
    if(beat.kind==='effects'){
      body+=`<ul class="effects">${(beat.effects||[]).map(effect=>`<li><b>${esc(effect.label)}</b>${effect.detail?` — ${esc(effect.detail)}`:''}</li>`).join('')}</ul>`;
      continue;
    }
    body+=`<p>${esc(beat.html?stripHTML(beat.html):beat.text||'')}</p>`;
  }
  if(openGroup) body+='</section>';
  const html=`<!doctype html><meta charset="utf-8"><title>Story Transcript</title><style>body{max-width:850px;font:16px/1.58 Georgia,serif;margin:32px auto;padding:0 24px;color:#25201a}h1{font:700 24px system-ui,Segoe UI,sans-serif}.meta{color:#655c50;margin-bottom:24px}.turn{position:relative;margin:28px 0;padding:18px 24px 18px 34px;border-left:3px solid #a36d2e;border-top:1px solid #d2b078;border-bottom:1px solid #d2b078}.turn h2{margin:0 0 18px;font:600 17px/1.4 system-ui,Segoe UI,sans-serif;color:#593618}.turn h2 span{display:block;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#8b704c}.effects{padding:10px 14px 10px 30px;background:#f2eadc;color:#4c4033}p{margin:0 0 1.1em}</style><h1>Brassreach — Transcript</h1><div class="meta">Engine: ${S.live.on?'Live':'Local'} · Seed ${S.seed} · Turns ${S.turn}</div>${body}`;
  const blob=new Blob([html],{type:'text/html'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='brassreach_transcript.html'; a.click(); URL.revokeObjectURL(url);
}

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
    <div class="intro-stage">
      <div class="book-shell is-dormant" role="button" tabindex="0" aria-label="Open the Brassreach chronicle" aria-describedby="introBeginPrompt" aria-busy="false">
        <div class="intro-plates" aria-hidden="true">
          <img class="intro-cover-plate" src="public/img/intro/living-book/closed-cover.webp" alt="" draggable="false">
          <div class="intro-open-plate">
            <img class="intro-base-plate" src="public/img/intro/living-book/open-base.webp" alt="" draggable="false">
            <img class="intro-art-layer" id="introArtLayer" src="public/img/intro/living-book/art-city.png" alt="" draggable="false">
          </div>
        </div>
        <div class="intro-lantern-light" aria-hidden="true"></div>
        <div class="intro-page-content">

          <section class="slide s1 active" data-art="public/img/intro/living-book/art-city.png" aria-label="Folio I, The City">
            <div class="folio-mark"><span>Folio I</span><strong>The City</strong></div>
            <div class="copy"><span class="ink-trace" aria-hidden="true"></span><div class="scroll">
              <p class="intro-passage active" data-passage="1">The labyrinth of towers, alleyways, stairwells, and terraces of <span class="gloss" tabindex="0" data-def="A layered dwarven city whose unique constructions join water, stone, brass, and sound.">Brassreach</span> glows beneath a thousand mechanical lanterns. Metal gears turn with impossible ease everywhere you look. The city itself seems alive, and by design; centuries of work dating back to the Founders brought to life a city whose metal heartbeat whirrs, clicks, and hums in perfect harmony. At least, it once did.</p>
              <p class="intro-passage" data-passage="2" hidden>In recent decades, neglect born of greed, vanity, and contested authority renders the once flawless machinery of Brassreach frail and shuddering. Gone is the pealing chorus of perfectly tuned bells, while superficially lavish towers loom imperiously above ever-worsening squalor. Factions have arisen, some with eyes only for gold and jewels, others for political gain, and all the while fewer and fewer remain who remember the concord of a youthful Brassreach.</p>
            </div></div>
          </section>

          <section class="slide s2" data-art="public/img/intro/living-book/art-archives.png" aria-label="Folio II, The Threadbearers">
            <div class="folio-mark"><span>Folio II</span><strong>The Threadbearers</strong></div>
            <div class="copy"><span class="ink-trace" aria-hidden="true"></span><div class="scroll">
              <p class="intro-passage active" data-passage="1">The stone and metal maze of Brassreach's surface holds civic workshops, dwellings, towers, and the Halls where elected officials and hereditary power struggle over the city's course. Beneath them, however, layer by Brass-wrought layer, the Undercity opens into sprawling Founder-made reservoirs and vaulted public works, lit by golden seams that fade a little more each year.</p>
              <p class="intro-passage" data-passage="2" hidden>Deeper still lie the Archives, where the memory of Brassreach survives in etched metal tablets of witness accounts, work inspections, and repair orders. To and from those galleries travel <span class="gloss" tabindex="0" data-def="Civic investigators trained to seek truth by following mechanical failures to their source, uncovering hidden patterns and decoding mystery along the way.">Threadbearers</span>. The first of these truth-seekers returned from long journeys with accounts woven by needle and thread; modern bearers carry their findings in a <span class="gloss" tabindex="0" data-def="A Threadbearer's field record whose firsthand accounts are vital.">Thread Ledger</span>, and seldom venture as far as their predecessors.</p>
              <p class="intro-passage" data-passage="3" hidden>Most now work near the public Halls, while a trusted few earn the <span class="gloss" tabindex="0" data-def="A hard-earned seal of authority to inspect restricted work, cross-office records, and the deepest reaches of the Undercity.">Deep Writ</span> and descend toward the Cistern Fields, where high vaults, dark reservoirs, and the very foundations of Brassreach are legendary.</p>
            </div></div>
          </section>

          <section class="slide s3" data-art="public/img/intro/living-book/art-unfathomer.png" aria-label="Folio III, The First Commission">
            <div class="folio-mark"><span>Folio III</span><strong>The First Commission</strong></div>
            <div class="copy"><span class="ink-trace" aria-hidden="true"></span><div class="scroll">
              <p class="intro-passage active" data-passage="1">The Founders shaped the Cistern Fields chamber by chamber, guiding sound through water, stone, and brass until the deepest works rang true enough to birth a city. That foundational accord has weakened. Water has risen for years through neglected channels, and repair orders miles from one another hint at the same strange, pulsing undertone. A cracked stairwell near the public Halls, flooded neighborhoods in the <span class="gloss" tabindex="0" data-def="A densely settled district of workshops, homes, and improvised bridges.">Tangles</span>, and animals driven from a drainage den below the Markets should have nothing in common...</p>
              <p class="intro-passage" data-passage="2" hidden>You begin as a recent Institute graduate under a <span class="gloss" tabindex="0" data-def="Limited authority for a new Threadbearer to investigate public hazards under Captain Brunna's supervision.">probationary writ</span>. Your attributes, equipment, testimony, repairs, and alliances will shape what follows; failures come at a cost, while successes follow in your footsteps as you explore deeper and deeper. Though you are but a recent Initiate, it is up to you to follow your intuition and uncover what might otherwise spell the end of Brassreach.</p>
            </div></div>
          </section>

          <nav class="nav intro-nav" aria-label="Chronicle navigation">
            <button class="intro-tab secondary" id="introSkip" type="button">Skip</button>
            <button class="intro-tab secondary" id="introPrevious" type="button" hidden><span aria-hidden="true">‹</span> <span>Previous</span></button>
            <button class="intro-tab primary intro-next" id="introAdvance" type="button"><span>Turn Page</span> <span aria-hidden="true">›</span></button>
          </nav>
        </div>
        <div class="intro-blackout" aria-hidden="true"></div>
        <div class="intro-golden-bloom" aria-hidden="true"></div>
      </div>
      <button class="intro-awaken" id="introAwaken" type="button"><span id="introBeginPrompt">Press any key to begin your <strong>journey</strong>.</span></button>
      <p class="sr-only" id="introStatus" aria-live="polite"></p>
    </div>
    <div class="intro-viewport-frame intro-frame-top" aria-hidden="true"><span></span></div>
    <div class="intro-viewport-frame intro-frame-bottom" aria-hidden="true"><span></span></div>
    <div class="intro-edge-haze" aria-hidden="true"></div>
  </div>`;
}

function getIntroScrollHTML(){
  return `
    <hr class="sep"/>
    <div class="quick-tables">
      <h4>Threadbearer Institute Field Briefing</h4>
      <div class="grid2">
        <div>
          <h5>Captain Brunna's Office</h5>
          <ul>
            <li><b>Investigate</b> — Follow the evidence as far as it leads.</li>
            <li><b>Witness</b> — Record the firsthand accounts of those affected.</li>
            <li><b>Connect</b> — Where possible, connect pieces of seemingly unrelated and circumstantial evidence to paint a picture of cause to effect.</li>
          </ul>
          <p>A Threadbearer follows the line from failing mechanism through the people, decisions, and neglected duties that left vulnerabilities to such failure. Your Probationary Writ grants access to witness and account- use it well.</p>
        </div>
        <div>
          <h5>Your Record</h5>
          <ul>
            <li><b>Evidence</b> — Your observations and deductions that begin to form a network of cause and effect.</li>
            <li><b>Testimony</b> — Firsthand accounts recorded regardless of caste, duty, authority, or wealth.</li>
            <li><b>Repairs</b> — By directing or initiating a proper chain of repair duties, the very failures you investigate can be righted as you explore.</li>
            <li><b>Consequences</b> — Your failures will leave their mark in gold, gathered items, or the relationships you form through your journeys.</li>
          </ul>
          <p>Your Thread Ledger keeps safe these strands of evidence and testimony, preserving the truth in perpetuity.</p>
        </div>
      </div>
      <h5>First Commission</h5>
      <ul><li>Examine and secure the cracked stairwell, keeping an ear out for unusual resonance.</li><li>Compare dated city plans with the routes you find in use in the Tangles.</li><li>Protect residents and animals displaced by the rising water.</li><li>Return to Captain Brunna with your findings across Brassreach- and the potential for strange connections between them.</li></ul>
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
