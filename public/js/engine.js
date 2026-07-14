// public/js/engine.js
// v13c — intro right-pane + chevrons; animated motes (fX); fixed Scroll modal; removed Highlight Terms;
// edit modal blue+gold fields; now-playing fade; vignette fade; story box bottom line fixed;
// glossary '?' suppressed; roll glyphs gold/crimson with hover bloom.
// Built from your attached engine.js + prior merged foundation. Date: 2025-08-21

// public/js/engine.js
// v13b — toolbar trimmed (End / Settings), brand "Brassreach", floating SVG Scroll,
// Ledger panel (Inventory + revealed keys/rumors/gate/boss), scene-based BGM,
// per-slide intro typewriter, success/fail/story SFX, silent continue, death modal,
// injected glossary tooltips with edge-aware positioning.

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

/* ---------- state ---------- */
function defaults(){
  return {
    seed:rnd(1,9_999_999), turn:0, scene:'Halls',
    storyBeats:[], transcript:[],
    character:{ name:'Eldan', race:'Dwarf', STR:12,DEX:14,INT:12,CHA:10, HP:14, Gold:5, inventory:['Torch','Canteen'] },
    flags:{ rumors:false, keys:[], bossReady:false, bossDealtWith:false },
    _choiceHistory:[], _lastChoices:[], _undoStack:[], _arcStep:0, _pendingType:false,
    settings:{ typewriter:true, cps:40, audio:{ master:0.5, ui:0.45, music:0.5, sfx_success:true, sfx_fail:true, sfx_story:true } },
    live:{ on:store.get('dm_on',false), endpoint:store.get('dm_ep','/dm-turn') }
  };
}
const Engine={ el:{}, state: defaults() };
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
  let ctx, bus, cur=null, curGain=null, fadeMs=1400;
  let currentName=null, targetName=null, requestToken=0;
  let unlocked=false, pendingName=null;
  const tracks = {
    intro:    { title:"Overture of the Foundry", srcs:["./public/audio/034842c5-ddc2-4b5c-abc3-bff6ab9c455f.mp3"] },
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
        const o = {buffer: buf}; cache.set(name,o); return o;
      }catch(e){}
    }
    return null;
  }
  function setBus(v){ if(bus) bus.gain.value=v; }
  async function crossTo(name){
    if(!unlocked){ pendingName=name; return; }
    if(name===targetName || (name===currentName && cur)) return;
    targetName=name;
    const token=++requestToken;
    try{
      const data = await load(name);
      if(!data || token!==requestToken){ if(token===requestToken) targetName=currentName; return; }
      const C = ctx || getCtx(); ctx=C; if(!bus){ bus=C.createGain(); bus.gain.value=Engine.state?.settings?.audio?.music ?? 0.5; if(Sound.getMaster){ bus.connect(Sound.getMaster()); } else { bus.connect(C.destination); } }
      // next source
      const src = C.createBufferSource(); src.buffer=data.buffer; src.loop=true;
      const ng = C.createGain(); ng.gain.value=0; src.connect(ng).connect(bus); const now=C.currentTime;
      src.start(now+0.02);
      const fade = Math.max(0.10, fadeMs/1000);
      ng.gain.cancelScheduledValues(now); ng.gain.setValueAtTime(0, now); ng.gain.linearRampToValueAtTime(1, now+fade);
      if(curGain){
        curGain.gain.cancelScheduledValues(now);
        curGain.gain.setValueAtTime(curGain.gain.value, now);
        curGain.gain.linearRampToValueAtTime(0, now+fade);
      }
      const prev = cur;
      cur = src; curGain = ng;
      currentName=name;
      if(prev){ setTimeout(()=>{ try{ prev.stop(); }catch{} }, fade*1000+120); }
      const t=tracks[name]; if(t) setNowPlaying(t.title);
    }catch(e){
      if(token===requestToken) targetName=currentName;
      console.error('BGM crossTo error', e);
    }
  }
  function stop(){
    try{
      if(cur){
        const source=cur, gain=curGain, C=ctx||getCtx(), now=C.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.linearRampToValueAtTime(0, now+.25);
        setTimeout(()=>{ try{source.stop()}catch{} }, 360);
      }
    }catch{}
    cur=null; curGain=null; currentName=null; targetName=null; pendingName=null; requestToken++;
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
  const ambOn = ()=>ensure(); // for legacy calls
  return {click, sfx, gong, ambOn, setLevels, resume, ensure, getCtx:()=>{ ensure(); return ctx; }, getMaster:()=>master};
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

    // V…8190 tokens truncated… vent.",
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
    character:S.character, flags:S.flags,
    _choiceHistory:S._choiceHistory, _lastChoices:S._lastChoices,
    _arcStep:S._arcStep, _pendingType:false
  }));
}
function snapshotState(){ const S=Engine.state; return {character:S.character, flags:S.flags, scene:S.scene, turn:S.turn}; }
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
  C.name=pick(n); C.race=pick(['Dwarf','Human','Elf','Gnome','Halfling','Orc']); C.STR=rnd(8,18); C.DEX=rnd(8,18); C.INT=rnd(8,18); C.CHA=rnd(8,18); C.HP=rnd(8,20); C.Gold=rnd(0,25); C.inventory=['Torch','Canteen','Oil Flask','Rope Coil','Lockpin'].sort(()=>Math.random()-.5).slice(0,rnd(1,3)); renderAll(); }
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
          <p><b>Story cadence:</b> Tune → Name → Measure → Decide.</p>
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

/* ---------- cinematic focus (letterbox) ---------- */
function cinematicFocus(){
  const lb = document.getElementById('letterbox'); if(!lb) return;
  lb.classList.remove('hidden'); lb.style.opacity='1';
  setTimeout(()=>{ lb.style.opacity='0'; setTimeout(()=> lb.classList.add('hidden'), 480); }, 1220);
}
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

