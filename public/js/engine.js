// Brassreach browser game engine
// v19 — Visual Overhaul #2: mirrored intro, field harness, equipment persistence,
// realistic material treatments, and layered foundry-hearth intro music.

import { makeWeaver } from './weaver.js';

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
const EQUIPMENT_SLOTS = [
  ['head','Head'], ['chest','Chest'], ['hands','Hands'], ['legs','Legs'],
  ['feet','Feet'], ['mainHand','Main Hand'], ['offHand','Off Hand'], ['accessory','Accessory']
];
const ITEM_CATALOG = new Map([
  ['torch',              {slot:'offHand',   glyph:'\u2736', kind:'Tool'}],
  ['canteen',            {slot:'accessory', glyph:'\u25d6', kind:'Provision'}],
  ['oil flask',          {slot:'accessory', glyph:'\u25c7', kind:'Provision'}],
  ['rope coil',          {slot:'accessory', glyph:'\u221e', kind:'Tool'}],
  ['lockpin',            {slot:'accessory', glyph:'\u2020', kind:'Tool'}],
  ['surveyor hood',      {slot:'head',      glyph:'\u2303', kind:'Armor'}],
  ['riveted workcoat',   {slot:'chest',     glyph:'\u25c8', kind:'Armor'}],
  ['foundry gloves',     {slot:'hands',     glyph:'\u2726', kind:'Armor'}],
  ['slateweave trousers',{slot:'legs',      glyph:'\u2161', kind:'Armor'}],
  ['cistern boots',      {slot:'feet',      glyph:'\u2229', kind:'Armor'}],
  ['warden pick',        {slot:'mainHand',  glyph:'\u2692', kind:'Weapon'}],
  ['echo buckler',       {slot:'offHand',   glyph:'\u25c9', kind:'Shield'}],
  ['measure ring',       {slot:'accessory', glyph:'\u2299', kind:'Relic'}]
]);
const blankEquipment=()=>Object.fromEntries(EQUIPMENT_SLOTS.map(([key])=>[key,null]));
const cleanInventory=list=>[...new Set((Array.isArray(list)?list:[]).map(x=>String(x).trim()).filter(Boolean))];
function itemMeta(name){ return ITEM_CATALOG.get(String(name||'').toLowerCase()) || {slot:'accessory',glyph:'\u25c7',kind:'Curio'}; }
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
function defaults(){
  return {
    seed:rnd(1,9_999_999), turn:0, scene:'Halls',
    storyBeats:[], transcript:[],
    character:{ name:'Eldan', race:'Dwarf', STR:12,DEX:14,INT:12,CHA:10, HP:14, Gold:5, inventory:['Torch','Canteen'] },
    equipment:blankEquipment(),
    flags:{ rumors:false, keys:[], bossReady:false, bossDealtWith:false },
    _choiceHistory:[], _lastChoices:[], _undoStack:[], _arcStep:0, _pendingType:false,
    settings:{ typewriter:true, cps:40, audio:{ master:0.5, ui:0.45, music:0.5, sfx_success:true, sfx_fail:true, sfx_story:true } },
    live:{ on:store.get('dm_on',false), endpoint:store.get('dm_ep','/dm-turn') }
  };
}
const Engine={ el:{}, state: defaults(), inventoryDraft:[], selectedInventoryItem:null };
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
    if(S.scene==='Archives') return crossTo('archives');
    if(S.scene==='Depths'){ if(S.flags?.bossDealtWith || S.flags?.bossReady) return crossTo('depths2'); return crossTo('depths'); }
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
      let buffer=inventoryBuffers.get(kind);
      if(!buffer){
        const response=await fetch(inventoryUrls[kind],{cache:'force-cache'});
        if(!response.ok) throw new Error('inventory audio unavailable');
        buffer=await ctx.decodeAudioData((await response.arrayBuffer()).slice(0));
        inventoryBuffers.set(kind,buffer);
      }
      const source=ctx.createBufferSource(), gain=ctx.createGain();
      source.buffer=buffer; gain.gain.value=kind==='reject'?.42:.58;
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
  "brassreach": "Terraced city of tuned caverns; stories become law.",
  "unfathomer": "A tide of intent beneath the city resisted by Tune and bound by Decide.",
  "halls": "Upper civic spaces; first area of play.",
  "archives": "Stacks and reading wells; ledger authority.",
  "depths": "Sluice catwalks and vault doors; warden tunnels.",
  "gate of measures": "Ritual aperture—part machinery, part covenant—where the Unfathomer is faced.",
  "keys": "Three canonical Keys: Brass, Echo, Stone; two make the Gate ready, three broaden outcomes.",
  "brass key": "Tone and resonance; opens the Gate's tuned mechanisms.",
  "echo key": "Pattern and return; opens the tuning lattice.",
  "stone key": "Weight, foundation, and oath; opens the oath seats.",
  "measures": "Weight/Stone, Tone/Brass, Pattern/Echo, Line/Thread—the city’s primitives.",
  "weight": "Oath, burden, consequence (Stone).",
  "tone": "Resonance and harmony (Brass).",
  "pattern": "Memory and law (Echo).",
  "line": "Decision that binds a path (Thread)."
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
    if (!Engine.state.storyBeats.length) beginTale();
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
        typewriteRich(p, Engine.state.settings.cps); // your existing typed routine
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
      if (!Engine.state.storyBeats.length) beginTale();
  
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
        <span class="brand-motto">Stories are woven into law</span>
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
          <h3><span>Character</span><button id="btnEdit" class="btn mini">Edit</button></h3>
          <div id="charPanel" class="character-rig"></div>
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
    <header><div><span class="modal-kicker">Brassreach Field Harness</span><strong id="inventoryTitle">Inventory &amp; Equipment</strong></div><button id="xInventory" class="closeX" aria-label="Close inventory">&#10005;</button></header>
    <div class="content inventory-layout">
      <section class="owned-items">
        <div class="inventory-section-heading"><span>Pack Contents</span><small>Drag an item to a highlighted mount</small></div>
        <div id="inventoryItems" class="inventory-items"></div>
        <p class="inventory-help">Select an item, then choose its matching slot. Equipped items remain in your pack.</p>
      </section>
      <section class="equipment-board frame" aria-label="Equipment harness">
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
      </section>
    </div>
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
  </div>
  `;

  // cache
  document.querySelectorAll('.frame').forEach(el=>{['tl','tr','bl','br'].forEach(pos=>{const s=document.createElement('span'); s.className='chev '+pos; el.appendChild(s);});});
  Engine.el.story=$('#story'); Engine.el.choiceList=$('#choices'); Engine.el.choicesBox=$('.choices');
  if(!document.getElementById('storyBottomLine')){ const line=document.createElement('div'); line.id='storyBottomLine'; Object.assign(line.style,{position:'absolute',left:'0',right:'0',bottom:'0',height:'2px',boxShadow:'inset 0 -2px 0 0 rgba(213,168,74,.75)'}); Engine.el.story.appendChild(line);}
  Engine.el.freeText=$('#freeText'); Engine.el.btnAct=$('#btnAct'); Engine.el.btnCont=$('#btnCont');

  Engine.el.btnEnd=$('#btnEnd'); Engine.el.btnSettings=$('#btnSettings'); Engine.el.keysArc=$('#keysArc'); Engine.el.sceneHeading=$('#sceneHeading');

  Engine.el.charPanel=$('#charPanel'); Engine.el.hotbarPanel=$('#hotbarPanel'); Engine.el.ledgerPanel=$('#ledgerPanel');
  Engine.el.seedVal=$('#seedVal'); Engine.el.turnVal=$('#turnVal'); Engine.el.keysVal=$('#keysVal');
  Engine.el.btnEdit=$('#btnEdit');
  Engine.el.btnInventory=$('#btnInventory');
  Engine.el.shade=$('#shade'); Engine.el.nowplay=$('#nowplay'); Engine.el.npTitle=$('#npTitle');

  // character modal refs
  Engine.el.modalEdit=$('#modalEdit'); Engine.el.xEdit=$('#xEdit');
  Engine.el.edName=$('#edName'); Engine.el.edRace=$('#edRace');
  Engine.el.edSTR=$('#edSTR'); Engine.el.edDEX=$('#edDEX'); Engine.el.edINT=$('#edINT'); Engine.el.edCHA=$('#edCHA');
  Engine.el.edHP=$('#edHP'); Engine.el.edGold=$('#edGold'); Engine.el.edInvAdd=$('#edInvAdd'); Engine.el.edInvList=$('#edInvList'); Engine.el.btnInvAdd=$('#btnInvAdd');
  Engine.el.btnAuto=$('#btnAuto'); Engine.el.btnEditSave=$('#btnEditSave'); Engine.el.btnEditCancel=$('#btnEditCancel');

  Engine.el.modalInventory=$('#modalInventory'); Engine.el.xInventory=$('#xInventory'); Engine.el.inventoryItems=$('#inventoryItems');
  Engine.el.equipSlots=$$('.equip-slot');

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
  Engine.state = {
    ...d, ...saved,
    character:{...d.character, ...(saved.character||{}), inventory:cleanInventory(saved.character?.inventory||d.character.inventory)},
    equipment:normalizeEquipment(saved.equipment,saved.character?.inventory||d.character.inventory),
    flags:{...d.flags, ...savedFlags},
    settings:{...d.settings, ...(saved.settings||{}), audio:{...d.settings.audio, ...savedAudio}},
    live:{...d.live, ...(saved.live||{})},
    _choiceHistory:Array.isArray(saved._choiceHistory)?saved._choiceHistory:[],
    _lastChoices:Array.isArray(saved._lastChoices)?saved._lastChoices:[],
    _undoStack:Array.isArray(saved._undoStack)?saved._undoStack:[],
    _arcStep:saved._arcStep||0
  };
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
  Engine.el.modalInventory.querySelector('.inventory-item, .equip-slot, .closeX')?.focus();
}
function closeInventory(){ Engine.selectedInventoryItem=null; closeModal(Engine.el.modalInventory); }
function equipItem(item,slot){
  const S=Engine.state, owned=S.character.inventory.includes(item), valid=itemMeta(item).slot===slot;
  if(!owned || !valid){ Sound.inventory('reject'); toast(`That item does not fit the ${EQUIPMENT_SLOTS.find(([key])=>key===slot)?.[1]||'mount'}.`); return false; }
  for(const [key] of EQUIPMENT_SLOTS) if(S.equipment[key]===item) S.equipment[key]=null;
  S.equipment[slot]=item; Engine.selectedInventoryItem=null;
  store.set('dds_state',S); Sound.inventory('place'); renderAll(); return true;
}
function unequipSlot(slot){
  if(!Engine.state.equipment[slot]) return;
  Engine.state.equipment[slot]=null; Engine.selectedInventoryItem=null;
  store.set('dds_state',Engine.state); Sound.inventory('place'); renderAll();
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
    C.HP=+Engine.el.edHP.value||C.HP; C.Gold=+Engine.el.edGold.value||C.Gold;
    C.inventory=cleanInventory(Engine.inventoryDraft);
    S.equipment=normalizeEquipment(S.equipment,C.inventory);
    store.set('dds_state',S);
    close(Engine.el.modalEdit); renderAll();
  };
  Engine.el.btnEditCancel.onclick=()=>close(Engine.el.modalEdit);
  Engine.el.xEdit.onclick=()=>close(Engine.el.modalEdit);

  // field kit and equipment harness
  Engine.el.btnInventory.onclick=openInventory;
  Engine.el.hotbarPanel.addEventListener('click',openInventory);
  Engine.el.xInventory.onclick=closeInventory;
  Engine.el.inventoryItems.addEventListener('click',e=>{
    const item=e.target.closest('[data-item]'); if(!item) return;
    Engine.selectedInventoryItem=item.dataset.item; Sound.inventory('pickup'); renderInventory();
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
  });

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
  Engine.el.btnSave.onclick=()=>{ store.set('dds_state',S); toast('Game saved'); };
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
  Engine.el.shade.onclick=()=>{ [Engine.el.modalEdit,Engine.el.modalInventory,Engine.el.modalSet,Engine.el.modalScroll,Engine.el.modalEpi].forEach(m=>m.classList.add('hidden')); Engine.el.shade.classList.add('hidden'); Engine.selectedInventoryItem=null; };
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ Engine.el.shade.onclick(); return; }
    if(e.key.toLowerCase()==='e' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget(e.target)){
      e.preventDefault(); inventoryOpen()?closeInventory():openInventory();
    }
  });

  // main actions
  Engine.el.btnCont.onclick=()=>{ if(!Engine.state.storyBeats || !Engine.state.storyBeats.length){ beginTale(); return; } doNarrate({ sentence:'' }); }; // silent advance
  Engine.el.btnAct.onclick=()=>freeText();
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
function renderInventory(){
  const S=Engine.state, items=cleanInventory(S.character.inventory), E=S.equipment||blankEquipment();
  const equipped=new Set(Object.values(E).filter(Boolean));
  if(Engine.el.hotbarPanel){
    Engine.el.hotbarPanel.classList.toggle('has-overflow',items.length>6);
    Engine.el.hotbarPanel.innerHTML=items.length
      ? items.map((item,index)=>{ const meta=itemMeta(item); return `<button class="hotbar-slot${equipped.has(item)?' equipped':''}" title="${esc(item)}"><span class="hotbar-index">${index+1}</span><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><span>${esc(item)}</span></button>`; }).join('')
      : '<div class="inventory-empty">Your field kit is empty.</div>';
  }
  if(!Engine.el.inventoryItems) return;
  Engine.el.inventoryItems.innerHTML=items.length
    ? items.map(item=>{ const meta=itemMeta(item), selected=Engine.selectedInventoryItem===item; return `<button class="inventory-item${selected?' selected':''}${equipped.has(item)?' equipped':''}" draggable="true" data-item="${esc(item)}" aria-pressed="${selected}"><span class="item-glyph" aria-hidden="true">${meta.glyph}</span><span class="item-copy"><strong>${esc(item)}</strong><small>${meta.kind} \u00b7 ${EQUIPMENT_SLOTS.find(([key])=>key===meta.slot)?.[1]||'Accessory'}</small></span>${equipped.has(item)?'<span class="equipped-mark">Mounted</span>':''}</button>`; }).join('')
      : '<div class="inventory-empty">Nothing has been packed yet.</div>';
  Engine.el.equipSlots.forEach(slot=>{
    const key=slot.dataset.slot, label=EQUIPMENT_SLOTS.find(([name])=>name===key)?.[1]||key, item=E[key];
    const selected=Engine.selectedInventoryItem, compatible=selected && itemMeta(selected).slot===key;
    slot.classList.toggle('compatible',!!compatible); slot.classList.toggle('incompatible',!!selected&&!compatible);
    slot.classList.toggle('occupied',!!item);
    slot.innerHTML=`<span class="slot-label">${label}</span><strong>${item?esc(item):'Empty mount'}</strong>`;
    slot.title=item?'Select to unequip':compatible?`Equip ${selected}`:`${label} equipment slot`;
  });
}

function renderAll(){
  const s=Engine.state, C=s.character, F=s.flags;
  $('#seedVal').textContent=s.seed; $('#turnVal').textContent=s.turn;
  Engine.el.keysVal.textContent=`${(F.keys||[]).length} / 3`;
  Engine.el.sceneHeading.textContent=s.scene;

  const mounted=EQUIPMENT_SLOTS.filter(([key])=>s.equipment?.[key]).slice(0,4);
  Engine.el.charPanel.innerHTML = `
    <div class="identity"><b>${esc(C.name)}</b><span>${esc(C.race)}</span></div>
    <div class="rig-stage" aria-label="Live equipment view">
      <div class="rig-silhouette" aria-hidden="true"><span class="rig-head"></span><span class="rig-torso"></span><span class="rig-arm left"></span><span class="rig-arm right"></span><span class="rig-leg left"></span><span class="rig-leg right"></span></div>
      <div class="rig-readout">${mounted.length?mounted.map(([key,label])=>`<span><small>${label}</small>${esc(s.equipment[key])}</span>`).join(''):'<span class="unmounted"><small>Harness</small>No equipment mounted</span>'}</div>
    </div>
    <div class="stat-grid">
      <div><span>STR</span><strong>${C.STR}</strong><small>${fmt(modFrom(C.STR))}</small></div>
      <div><span>DEX</span><strong>${C.DEX}</strong><small>${fmt(modFrom(C.DEX))}</small></div>
      <div><span>INT</span><strong>${C.INT}</strong><small>${fmt(modFrom(C.INT))}</small></div>
      <div><span>CHA</span><strong>${C.CHA}</strong><small>${fmt(modFrom(C.CHA))}</small></div>
    </div>
    <div class="vitals"><span>HP <b>${C.HP}</b></span><span>Gold <b>${C.Gold}</b></span></div>`;

  renderInventory();

  // The ledger records discoveries; possessions live in the field kit.
  const lines = [];
  if (F.rumors) lines.push(`<div class="ledger-line"><span>Rumors heard</span><b>Yes</b></div>`);
  if ((F.keys||[]).length) lines.push(`<div class="ledger-line"><span>Keys</span><b>${(F.keys||[]).map(esc).join(', ')}</b></div>`);
  if (F.bossReady) lines.push(`<div class="ledger-line"><span>Gate ready</span><b>Yes</b></div>`);
  if (F.bossDealtWith) lines.push(`<div class="ledger-line"><span>Unfathomer dealt with</span><b>Yes</b></div>`);
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

/* ---------- flow ---------- */
function beginTale(){
  const S=Engine.state;
  S.turn=0; S.scene='Halls'; S.storyBeats=[]; S.transcript=[]; S._choiceHistory=[]; S._lastChoices=[]; S._undoStack=[]; S._arcStep=0;
  S.flags={rumors:false,keys:[],bossReady:false,bossDealtWith:false};
  appendBeat("Lanterns throw steady light across carved lintels and iron mosaics. Word passes of a slow, otherworldly tide called the Unfathomer, pooling in the buried cisterns. You wait at the mouth of the Halls, where corridors open like patient books.");
  renderChoices(makeChoiceSet(S.scene));
  S.turn++; renderAll(); BGM.updateForState(Engine.state);
}
function endTale(){
  const S=Engine.state, C=S.character;
  const ep = `Epilogue — You carry ${C.Gold} gold and ${C.inventory.length} keepsakes. Keys gained: ${S.flags.keys.join(', ')||'none'}. ` +
    (S.flags.bossDealtWith?'The Unfathomer is quiet; people sleep deeply this week.':'The Unfathomer still turns beneath the streets. Quiet talk in ale-halls carries your name.');
  appendBeat(ep); renderChoices([]); renderAll();
  Engine.el.epiTitle.textContent='Epilogue';
  Engine.el.epiContent.textContent=ep;
  openModal(Engine.el.modalEpi);
}
function undoTurn(){
  const S=Engine.state, previous=S._undoStack?.pop();
  if(!previous){ toast('Nothing to undo'); return; }
  Object.assign(S,previous,{_undoStack:S._undoStack});
  renderChoices(makeChoiceSet(S.scene)); renderAll(); BGM.updateForState(S);
}

function hardResetRun(){
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
function renderChoices(choices){
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
  const suffix=[' — carefully',' — quickly',' — with a steady breath',' — in a roundabout way'];
  return arr.map(c=>({ ...c, sentence: c.sentence.replace(/\s+—.*$/,'') + suffix[rnd(0,suffix.length-1)] }));
}

/* ---------- narration ---------- */
function freeText(){
  const text=(Engine.el.freeText.value||'').trim(); if(!text) return;
  Engine.el.freeText.value='';
  const italic=`<em>${esc(text)}</em>`;
  doNarrate({ sentence:`${italic} — the scene follows…` });
}
function doNarrate(ch){
  const payload={ action:ch.sentence, source:'narrate', stat:null, dc:null, passed:null, game_state:snapshotState(), history:recentHistory() };
  Promise.resolve(Weaver.turn(payload, localTurn)).then(resp=>applyTurn(resp,null)).catch(()=>applyTurn(localTurn(payload),null));
}

/* ---------- resolve ---------- */
function resolveChoice(ch){
  const S=Engine.state, C=S.character;
  const stat=ch.stat||'INT', mod=modFrom(C[stat]||10); const dc=clamp(11+rnd(-1,3),8,18); const r=rnd(1,20); const total=r+mod; const passed=(total>=dc);
  const payload={ action:ch.sentence, source:'choice', stat, dc, passed, game_state:snapshotState(), history:recentHistory() };
  Promise.resolve(Weaver.turn(payload, localTurn)).then(resp=>applyTurn(resp,{r,mod,dc,total})).catch(()=>applyTurn(localTurn(payload),{r,mod,dc,total}));
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
    S.equipment=normalizeEquipment(S.equipment,S.character.inventory);
  }
  if(typeof resp?.gold_delta==='number'){ S.character.Gold=Math.max(0,S.character.Gold+resp.gold_delta); }
  if(typeof resp?.hp_delta==='number'){ S.character.HP=Math.max(0,S.character.HP+resp.hp_delta); }
  if(resp?.scene) S.scene=resp.scene;
  if(!S.flags.bossReady && S.flags.keys.length>=2) S.flags.bossReady=true;

  const kind = roll ? (roll.total>=roll.dc ? 'success':'fail') : 'story';
  const html = resp?.story_paragraph_html ? sanitizeRichHTML(resp.story_paragraph_html) : null;
  appendBeat(resp?.story_paragraph || '(silence)', roll?`d20 ${roll.r} ${fmt(roll.mod)} vs DC ${roll.dc} ⇒ ${roll.total}`:null, kind, html);
  Sound.sfx(kind);

  if (S.character.HP<=0){
    // modal epilogue
    const dead = "Your pulse falters; the lantern’s ring dims. Companions—if any—carry a line back to daylight. The Unfathomer keeps its quiet measure.";
    Engine.el.epiTitle.textContent = 'Fallen Line';
    Engine.el.epiContent.textContent = dead;
    openModal(Engine.el.modalEpi);
    renderChoices([]);
    S.turn++; renderAll(); BGM.updateForState(Engine.state); return;
  }

  const next=(resp?.next_choices && resp.next_choices.length)?resp.next_choices:makeChoiceSet(S.scene);
  renderChoices(next); S.turn++; renderAll(); BGM.updateForState(Engine.state);
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
        "You mark the older chisel-strokes, finding where surveyors left anchors yet to be used. The pitch carries true here; you set a chalk ring and breathe in the clean echo.",
        "A map resolves out of rumor: a side stair gritted with salt, a culvert where lantern smoke drifts sideways. Threads tug toward a ledger kept below.",
        "A Warden’s chalk note matches an Archivist’s inked correction. Together they point to the same door—its hinges cold, its lock polite."
      ];
      const seg = steps[Math.min(Engine.state._arcStep, steps.length-1)];
      story = aText ? `${aText} ${seg}` : seg;
      Engine.state._arcStep++; if(Engine.state._arcStep>=3){ scene='Archives'; }
    }else if(scene==='Archives'){
      const steps=[
        "Stacks breathe like organ pipes. You copy a cadence table that names three safe rests and a forbidden vent.",
        "Lithen’s notes mention a trial in the cistern fields. The page is thin where the quill pressed—care and doubt in the same line.",
        "A key-drawing shows a gate with three collars—Stone, Brass, Echo—engraved with simple measures."
      ];
      const seg = steps[Math.min(Engine.state._arcStep-3, steps.length-1)];
      story = aText ? `${aText} ${seg}` : seg;
      Engine.state._arcStep++; if(Engine.state._arcStep>=6){ scene='Depths'; }
    }else if(scene==='Depths'){
      const steps=[
        "The air cools. Water speaks in steady pulses. You test the floor: firm enough to bear a bargain.",
        "Two channels meet; one is silted. You clear a lip and the room answers with a kinder ring.",
        "The Gate of Measures waits a gallery away, its collars dark, its hand-wheel heavy."
      ];
      const seg = steps[Math.min(Engine.state._arcStep-6, steps.length-1)];
      story = aText ? `${aText} ${seg}` : seg;
      Engine.state._arcStep++;
      if(!S.flags.bossReady && (keys.length>=2)) flags_patch.bossReady=true;
      if(Engine.state._arcStep>=9 && (S.flags.bossReady || (flags_patch.bossReady===true))) story+=" You stand where a choice will count double.";
    }else{
      const seg = "The corridor opens on decisions that won’t wait long.";
      story = aText ? `${aText} ${seg}` : seg;
    }
  }

  if(!story){
    const success={STR:"You shoulder through.", DEX:"You move with quiet balance.", INT:"You reason through the pattern.", CHA:"You speak with steady poise."}[stat||'INT'];
    const fail={STR:"The metal creaks but holds.", DEX:"Grit shifts; a lantern notices.", INT:"Two claims cancel; your guess goes wide.", CHA:"Your tone misfires; the window closes for now."}[stat||'INT'];
    const tail=award?` A sigil warms at your wrist — the ${award} Key.`:"";
    const rumor=" The cisterns answer more clearly than the streets."; flags_patch.rumors = true;
    story=`${stripHTML(action||'')}${action?' ':''}${passed?success:fail}${tail}${rumor}`;
  }

  const next_choices=makeChoiceSet(scene);
  return { story_paragraph:story, flags_patch, inventory_delta:inv, gold_delta, hp_delta, scene, next_choices };
}

/* ---------- choice pools ---------- */
function makeChoiceSet(scene){
  const sets={
    Halls:[
      {id:'h-int', sentence:'Read the tide’s measure for a safe rhythm (INT)', stat:'INT'},
      {id:'h-str', sentence:'Hold your ground when the water swells (STR)', stat:'STR'},
      {id:'h-cha', sentence:'Ask the clerk for restricted volumes (CHA)', stat:'CHA'},
      {id:'h-dex', sentence:'Slip between patrols to the culvert maps (DEX)', stat:'DEX'}
    ],
    Depths:[
      {id:'d-str', sentence:'Brace the gate and work it half-wide (STR)', stat:'STR'},
      {id:'d-int', sentence:'Name the measure and keep it steady (INT)', stat:'INT'},
      {id:'d-cha', sentence:'Name what it wants and speak plainly (CHA)', stat:'CHA'}
    ],
    Archives:[
      {id:'a-int', sentence:'Study ledger marks for a shipping pattern (INT)', stat:'INT'},
      {id:'a-dex', sentence:'Climb to the high stacks, lightly (DEX)', stat:'DEX'}
    ]
  };
  return (sets[scene]||sets.Halls).slice(0);
}

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
    character:S.character, equipment:S.equipment, flags:S.flags,
    _choiceHistory:S._choiceHistory, _lastChoices:S._lastChoices,
    _arcStep:S._arcStep, _pendingType:false
  }));
}
function snapshotState(){ const S=Engine.state; return {character:S.character, equipment:S.equipment, flags:S.flags, scene:S.scene, turn:S.turn}; }
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
  C.name=pick(n); C.race=pick(['Dwarf','Human','Elf','Gnome','Halfling','Orc']); C.STR=rnd(8,18); C.DEX=rnd(8,18); C.INT=rnd(8,18); C.CHA=rnd(8,18); C.HP=rnd(8,20); C.Gold=rnd(0,25); C.inventory=['Torch','Canteen','Oil Flask','Rope Coil','Lockpin'].sort(()=>Math.random()-.5).slice(0,rnd(1,3)); Engine.state.equipment=blankEquipment(); renderAll(); }
function toast(txt){ const t=document.createElement('div'); t.textContent=txt; Object.assign(t.style,{position:'fixed',bottom:'14px',left:'14px',background:'#1e1e28',color:'#fff',padding:'8px 10px',border:'1px solid #3a3a48',borderRadius:'6px',opacity:'0.96',zIndex:9999}); document.body.appendChild(t); setTimeout(()=>t.remove(),1200); }
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
    if(!p.isConnected){ cursor.remove(); return; }
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
        <p>Lanterns wake the terraces of <span class="gloss" data-def="A dwarven hill-city cut in tiers above vast cisterns and service vaults.">Brassreach</span>, a place built atop tuned caverns the forebears called the <span class="gloss" data-def="The engineered maze beneath Brassreach: ribs of stone, collars of brass, and echoing channels.">under-works</span>. Stone remembers weight; brass remembers oath; echo remembers pattern. In this city, stories are woven into law, and those who carry the thread are named <span class="gloss" data-def="A delver who ties deeds to record so the city can ‘feel’ where it’s weak or strong.">thread-bearers</span>. You arrive at the <span class="gloss" data-def="The first tier of tunnels where rumor makes rough maps and first tests of nerve are set.">Halls</span>, where water breathes under the floor and old marks point downward toward the <span class="gloss" data-def="Sunless reservoirs that feed the city and carry sound like wire.">cisterns</span>. The Wardens clap the walls and listen; the Archivists wet their quills. The city waits for a steady hand—and a steady voice.</p>
      </div></div>
      <div class="nav"><button class="btn secondary" id="introSkip1">Skip</button><button class="btn gold intro-next">Continue ▸</button></div>
      <div class="mist" aria-hidden="true"></div>
    </section>

    <section class="slide s2" data-side="img-left" aria-label="Slide 2">
      <div class="img" aria-hidden="true"></div>
      <div class="copy"><div class="scroll">
        <p>Deep below gathers the <span class="gloss" data-def="A slow, deliberate tide that learns rhythm and pushes where the city is out of tune.">Unfathomer</span>, a standing <span class="gloss" data-def="Many tones sounding as one; where channels agree it stands firm, where they argue it reaches through.">chorus</span> taught by centuries of bells. Once, the <span class="gloss" data-def="The old rule that kept channels, bells, and gates in tune so the chorus rested.">Cadence Law</span> held it calm. Now cheap metal and careless renovations have pulled the city off pitch. Brassreach answers with the <span class="gloss" data-def="Three instruments of authority: Stone, Brass, and Echo.">Three Keys</span>—<span class="gloss" data-def="The Stone Key embodies Weight: foundation, oath, burden, and consequence.">Stone</span>, <span class="gloss" data-def="The Brass Key embodies Tone: resonance, harmony, and tuned relation.">Brass</span>, and <span class="gloss" data-def="The Echo Key embodies Pattern: memory, return, law, and recurrence.">Echo</span>. In the stacks, <span class="gloss" data-def="Archivist of the Lower Stacks; believes the chorus can be bargained with using true measures.">Lithen the Wise</span> argues for treaty. In the foundries, <span class="gloss" data-def="Warden of the Brassworks; would retune the city by force and throttle the culverts.">Mullinen the Stout</span> argues for clamps and spikes. Between them stands your line in the dark.</p>
      </div></div>
      <div class="nav"><button class="btn secondary" id="introBack2">◂ Back</button><button class="btn gold intro-next">Continue ▸</button></div>
      <div class="mist" aria-hidden="true"></div>
    </section>

    <section class="slide s3" data-side="img-left" aria-label="Slide 3">
      <div class="img" aria-hidden="true"></div>
      <div class="copy"><div class="scroll">
        <p>Rumor says the <span class="gloss" data-def="An ancient tuning engine that once set the city’s measures with a single motion.">Gate of Measures</span> still turns in the cistern fields. To reach it you must map the <span class="gloss" data-def="The rumor-rich threshold where first paths are tried.">Halls</span>, steal or earn keys in the <span class="gloss" data-def="The deep library where ledgers, oaths, and tuning charts are kept.">Archives</span>, and descend into the <span class="gloss" data-def="The drowned, resonant galleries where the Unfathomer stands strongest.">Depths</span>. At places of clean <span class="gloss" data-def="A chamber’s agreement of tone where speech carries without drowning.">resonance</span> you may <span class="gloss" data-def="Quiet the chorus with truthful measures and working channels.">bind</span>, or <span class="gloss" data-def="Match cadence and make terms the city can keep.">bargain</span>, or—if all else fails—<span class="gloss" data-def="Drive the chorus back at a cost the city must bear.">banish</span>. Gather Keys, keep the ledger honest, and mark your way. The Unfathomer listens. The city remembers. Your choices decide which one the streets will follow.</p>
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
      <h4>Codex: Keys & Measures</h4>
      <div class="grid2">
        <div>
          <h5>Three Keys</h5>
          <ul>
            <li><b>Stone Key</b> — Weight: foundation, oath, burden, and consequence.</li>
            <li><b>Brass Key</b> — Tone: resonance, harmony, and tuned relation.</li>
            <li><b>Echo Key</b> — Pattern: memory, return, law, and recurrence.</li>
          </ul>
          <p><em>Two</em> Keys wake the Gate; <em>all three</em> open the richest endings.</p>
        </div>
        <div>
          <h5>Four Measures</h5>
          <ul>
            <li><b>Weight / Stone</b> — Oath, burden, foundation, and consequence.</li>
            <li><b>Tone / Brass</b> — Resonance, harmony, and tuned relation.</li>
            <li><b>Pattern / Echo</b> — Memory, return, law, and recurrence.</li>
            <li><b>Line / Thread</b> — Decision, direction, and the path made binding.</li>
          </ul>
          <p>The city answers to four old Measures, but no path through them is predetermined.</p>
        </div>
      </div>
      <h5>Complications (Examples)</h5>
      <ul><li>Flood pulse forces a detour</li><li>Warden patrol crosses your path</li><li>Old mechanism shifts the floor plates</li></ul>
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
