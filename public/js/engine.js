// public/js/engine.js
// v13c — intro right-pane + chevrons; animated motes (fX); fixed Scroll modal; removed Highlight Terms;
// edit modal blue+gold fields; now-playing fade; vignette fade; story box bottom line fixed;
// glossary '?' suppressed; roll glyphs gold/crimson with hover bloom.
// Built from your attached engine.js + prior merged foundation. Date: 2025-08-21

// public/js/engine.js
// v13b — toolbar trimmed (End / Settings), brand "Brassreach", floating SVG Scroll,
// Ledger panel (Inventory + revealed keys/rumors/gate/boss), 20 BPM ambience,
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
const store={ get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}},
              set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}},
              del(k){try{localStorage.removeItem(k)}catch{}} };

/* ---------- state ---------- */
function defaults(){
  return {
    seed:rnd(1,9_999_999), turn:0, scene:'Halls',
    storyBeats:[], transcript:[],
    character:{ name:'Eldan', race:'Dwarf', STR:12,DEX:14,INT:12,CHA:10, HP:14, Gold:5, inventory:['Torch','Canteen'] },
    flags:{ rumors:false, seals:[], bossReady:false, bossDealtWith:false },
    _choiceHistory:[], _lastChoices:[], _arcStep:0, _pendingType:false,
    settings:{ typewriter:true, cps:40, audio:{ master:0.5, ui:0.45, amb:0.5, drums:0.52, sfx_success:true, sfx_fail:true, sfx_story:true } },
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
  let ctx, bus, cur = null, nextGain=null, curGain=null, fadeMs=1400;
  const tracks = {
    intro:    { title:"Overture of the Foundry", srcs:["./public/audio/034842c5-ddc2-4b5c-abc3-bff6ab9c455f.mp3"] },
    prelude:  { title:"Prelude to Brass and Shadow", srcs:["./public/audio/8b5955d3-2e28-447b-bc5f-a91bad52e402.m4a","./public/audio/8b5955d3-2e28-447b-bc5f-a91bad52e402.mp3"] },
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
    const C = getCtx(); ctx=C; if(!bus){ bus=C.createGain(); bus.gain.value=Engine.state?.settings?.audio?.amb ?? 0.5; if(Sound.getMaster){ bus.connect(Sound.getMaster()); } else { bus.connect(C.destination); } }
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
    try{
      const data = await load(name); if(!data) return;
      const C = ctx || getCtx(); ctx=C; if(!bus){ bus=C.createGain(); bus.gain.value=Engine.state?.settings?.audio?.amb ?? 0.5; if(Sound.getMaster){ bus.connect(Sound.getMaster()); } else { bus.connect(C.destination); } }
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
      if(prev){ setTimeout(()=>{ try{ prev.stop(); }catch{} }, fade*1000+120); }
      const t=tracks[name]; if(t) setNowPlaying(t.title);
    }catch(e){ console.error('BGM crossTo error', e); }
  }
  function stop(){ try{ if(cur){ const C=ctx||getCtx(); const now=C.currentTime; curGain.gain.cancelScheduledValues(now); curGain.gain.linearRampToValueAtTime(0, now+.25); setTimeout(()=>{ try{cur.stop()}catch{} }, 360);} }catch{} }
  function updateForState(S){
    const introOpen = !!(Engine.el?.intro && !Engine.el.intro.classList.contains('hidden'));
    if(introOpen) return crossTo('intro');
    if(S.turn < 2) return crossTo('prelude');
    if(S.scene==='Archives') return crossTo('archives');
    if(S.scene==='Depths'){ if(S.flags?.bossDealtWith || S.flags?.bossReady) return crossTo('depths2'); return crossTo('depths'); }
    return crossTo('halls');
  }
  function attachWidget(){
    const mute=document.getElementById('npMute'); if(mute){ mute.onclick=()=>{ const v=bus?bus.gain.value:1; const nv=(v>0)?0:(Engine.state?.settings?.audio?.amb ?? .5); setBus(nv); mute.textContent = nv>0 ? 'Mute' : 'Unmute'; }; }
  }
  function setNowPlaying(t){ try{ if (window.setNowPlaying) window.setNowPlaying(t); else { const e=document.getElementById('npTitle'); if(e) e.textContent=t; } }catch{} }
  return {crossTo, stop, updateForState, attachWidget};
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
  return {click, sfx, gong, ambOn, setLevels, ensure, getCtx:()=>{ ensure(); return ctx; }, getMaster:()=>master};
})();

/* ---------- weaver ---------- */
const Weaver = makeWeaver(store,
  (msg)=>Engine.state.storyBeats.push({text:`[log] ${msg}`}),
  (tag)=>{ const t=$('#engineTag'); if(t) t.textContent=Engine.state.live.on?'Live':'Local'; }
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
  "brass key": "Weight & hinge; opens mechanical aspects of the Gate.",
  "echo key": "Pattern & return; opens the tuning lattice.",
  "stone key": "Foundation & oath; opens the oath seats.",
  "measures": "Weight/Stone, Tone/Brass, Pattern/Echo, Line/Thread—the city’s primitives.",
  "weight": "Oath, burden, consequence (Stone).",
  "tone": "Resonance and harmony (Brass).",
  "pattern": "Memory and law (Echo).",
  "line": "Decision that binds a path (Thread)."
}, window.GLOSS||{});

/* ---------- boot ---------- */
export function boot(){
  buildUI(); hydrate(); bind(); renderAll(); BGM.attachWidget();
  attachGlossTips(document.body);

  // Enable tooltips for dynamically injected story content
  const story = document.getElementById('story');
  if (story){
    const obs = new MutationObserver(muts=>{
      for (const m of muts){
        if (m.addedNodes && m.addedNodes.length){
          attachGlossTips(story);
          break;
        }
      }
    });
    obs.observe(story, { childList:true, subtree:true });
  }

  insertIntro(); // overlay every load
  tuneIntroLayout();
  mountScrollFab();

  const seen = store.get('intro_seen', false);
  if (seen){
    if (Engine.el.intro) Engine.el.intro.classList.add('hidden');
    if (!Engine.state.storyBeats.length) beginTale();
  }

  /* ambience removed */ BGM.updateForState(Engine.state);
  FX.start('fx');
  
  // Dev convenience: Alt+I marks the intro as seen (persisted)
  window.addEventListener('keydown', (e)=>{
    if (e.altKey && (e.key||'').toLowerCase()==='i'){
      try{ store.set('intro_seen', true); }catch{}
      if (typeof toast === 'function') toast('Intro will be skipped next load');
    }
  });
} // <-- end boot()



/* ------------------------- runtime style patches ------------------------- */
/* Kept outside boot() so they apply once at module load and avoid brace mix-ups */
(function applyRuntimePatches(){
  if (document.getElementById('runtime-patches')) return;
  const st = document.createElement('style');
  st.id = 'runtime-patches';
  st.textContent = `
/* runtime style patches */
#modalEdit input[type="text"], #modalEdit input[type="number"], #modalEdit select {
  background:#0d141a !important; color:#D5A84A !important;
  border:1px solid #8c6b2c !important; outline:1px solid rgba(213,168,74,.18);
}
#modalEdit input::placeholder { color: rgba(213,168,74,.66) !important; }
#nowplay{
  position: fixed; left: 50%; transform: translateX(-50%); bottom: 16px;
  opacity: 0; transition: opacity .35s ease; pointer-events: none;
}
#nowplay.show{ opacity: 1; }
#letterbox{ transition: opacity .45s ease; }
#letterbox.hidden{ opacity: 0; }
#story{ overflow-y:auto; overflow-x:hidden; position:relative; }
.glow-success:hover, .glow-fail:hover {
  text-shadow: 0 0 10px rgba(213,168,74,.85), 0 0 18px rgba(213,168,74,.45);
}
.gloss::after { content: '' !important; } /* suppress ? icon */
`;
  document.head.appendChild(st);
})();



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
function attachGlossTips(root=document){
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
    if (window.GLOSS && GLOSS[key]) return GLOSS[key];
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

  // Two-pane mode for the intro wrapper
  intro.classList.add('two-pane');

  // Right-side container (holds the text block)
  intro.querySelectorAll('.slide .copy').forEach(copy=>{
    Object.assign(copy.style, {
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      // push text farther from the center seam
      padding: '10vh 6vw 4vh 8vw'   // (top right bottom left)
    });
  });

  // The scrolling text column itself
  intro.querySelectorAll('.slide .copy .scroll').forEach(sc=>{
    Object.assign(sc.style, {
      width: '34vw',
      maxWidth: '34vw',
      textAlign: 'left',      // CSS can override to 'justify' if desired
      fontSize: '1.32em',
      lineHeight: '1.85',
      marginTop: '1.5vh',
      marginLeft: 'auto',
      marginRight: '6vw'
    });

    // Paragraph tweaks (no chevrons)
    sc.querySelectorAll('p').forEach(p=>{
      p.style.position = 'relative';
      p.style.paddingLeft = '0';
    });
  });
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
  if(Engine.el.intro) Engine.el.intro.classList.add('two-pane');
  if(Engine.el.intro) Engine.el.intro.classList.add('two-pane');
  Engine.el.intro.classList.add('two-pane');
  Engine.el.slides   = Array.from(Engine.el.intro.querySelectorAll('.slide'));
  Engine.el.nextBtns = Array.from(Engine.el.intro.querySelectorAll('.intro-next'));
  Engine.el.beginBtn = Engine.el.intro.querySelector('.intro-begin');
  
  // Ensure cutout structure (.pic > .img) and veil on every slide
Engine.el.slides.forEach(sl=>{
  // make sure .pic exists (prepend before copy if not present)
  let pic = sl.querySelector('.pic');
  if (!pic){
    pic = document.createElement('div');
    pic.className = 'pic';
    const copy = sl.querySelector('.copy');
    sl.insertBefore(pic, copy || sl.firstChild);
  }
  // make sure .img exists inside .pic
  let img = pic.querySelector('.img');
  if (!img){
    img = document.createElement('div');
    img.className = 'img';        // styled via CSS mask to reveal through the tear
    pic.appendChild(img);
  }
  // add the torn veil if missing
  if (!pic.querySelector('.veil')){
    const v = document.createElement('div');
    v.className = 'veil';
    pic.appendChild(v);
  }
});

// Simple API for wiring slide images later
window.setIntroImage = function slideImage(index, url){
  try{
    const slide = Engine.el.slides?.[index];
    if(!slide) return;
    const img = slide.querySelector('.pic .img');
    if(!img) return; // structure guard (shouldn't happen after the ensure block above)
    img.style.backgroundImage = `url('${url}')`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center center';
  }catch{}
};
  

  // Title at top of slides with double underline
if (!Engine.el.intro.querySelector('.intro-title')){
  const t = document.createElement('div');
  t.className = 'intro-title u-double-underline';
  t.innerHTML = '<span class="title-left">BRASS</span><span class="title-gap"></span><span class="title-right">REACH</span>';
  Engine.el.intro.appendChild(t);
}
  // Glossary tooltips (edge-aware)
  attachGlossTips(Engine.el.intro);

  // One-at-a-time slides + per-slide typewriter & zoom reset
  let idx = 0;
  const show = (i)=>{
    idx = Math.max(0, Math.min(Engine.el.slides.length - 1, i));
    Engine.el.slides.forEach((s, k)=>{
      const active = (k === idx);
      s.classList.toggle('active', active);
      if (!active) return;

      // restart zoom animation on the active image
      const img = s.querySelector('.img');
      if (img){ img.style.animation = 'none'; img.offsetHeight; img.style.animation = 'introZoom 22s ease-in-out forwards'; }

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
    <div id="letterbox" class="letterbox hidden">
      <div class="bar top"></div><div class="bar bottom"></div>
    </div>
    <div class="masthead">
      <div class="brand-title u-double-underline">
        <span class="title-left">BRASS</span><span class="title-gap"></span><span class="title-right">REACH</span>
      </div>
      <div class="toolbar cardish frame">
        <div class="controls">
          <svg id="sealsRing" viewBox="0 0 100 100" aria-label="Seals">
            <circle class="bg" cx="50" cy="50" r="40" />
            <circle id="sealsArc" class="arc" cx="50" cy="50" r="40" />
          </svg>
          <button id="btnEnd" class="btn">End the Story</button>
          <button id="btnSettings" class="btn">Settings</button>
          <button id="btnSnap" class="btn">Snapshot</button>
          <span class="tag">Engine: <b id="engineTag">Local</b></span>
        </div>
      </div>
    </div>

    <div class="pacing" id="pacing"><div class="chip" data-i="0">Explore</div><div class="chip" data-i="1">Light Check</div><div class="chip" data-i="2">Explore</div><div class="chip" data-i="3">Risk Choice</div></div>

    <div class="main">
      <section class="storywrap">
        <div id="story" class="story-scroll frame"></div>
        <div class="choices frame">
          <div id="choices"></div>
          <div class="free">
            <input id="freeText" placeholder="Write your own action (e.g., search the alcove, read the tablet)" />
            <button id="btnAct" class="btn gold">ACT</button>
            <button id="btnCont" class="btn">Continue story</button>
          </div>
        </div>
      </section>

      <aside class="side">
        <div class="card deco frame">
          <h3 style="text-align:center;">Character <button id="btnEdit" class="btn mini">Edit</button></h3>
          <div id="charPanel" class="centered"></div>
        </div>
        <div class="card deco frame">
          <h3 style="text-align:center;">Ledger</h3>
          <div id="ledgerPanel" class="centered"></div>
        </div>
        <div class="card deco frame">
          <h3 style="text-align:center;">Session</h3>
          <div class="centered" style="line-height:1.6">
            <div>Seed: <span id="seedVal"></span></div>
            <div>Turn: <span id="turnVal"></span></div>
            <div>Scene: <span id="sceneVal"></span></div>
          </div>
        </div>
      </aside>
    
    <div id="nowplay" class="nowplay frame">
      <div class="np-inner">
        <span class="np-dot" aria-hidden="true"></span>
        <span class="np-label">Now Playing:</span>
        <span id="npTitle">—</span>
        <button id="npMute" class="btn mini" style="margin-left:auto;">Mute</button>
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
      <label>Inventory (comma separated) <input id="edInv"></label>
      <div class="modal-actions">
        <button id="btnAuto" class="btn">Auto-generate</button>
        <span style="flex:1"></span>
        <button id="btnEditSave" class="btn gold">Save</button>
        <button id="btnEditCancel" class="btn">Cancel</button>
      </div>
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
          <label>Ambience <input type="range" id="aAmb" min="0" max="0.8" step="0.01"></label><br>
          <label>Drums <input type="range" id="aDrums" min="0" max="0.8" step="0.01"></label><br>
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
  `;

  // cache
  document.querySelectorAll('.frame').forEach(el=>{['tl','tr','bl','br'].forEach(pos=>{const s=document.createElement('span'); s.className='chev '+pos; el.appendChild(s);});});
  Engine.el.story=$('#story'); Engine.el.choiceList=$('#choices'); Engine.el.choicesBox=$('.choices');
  if(!document.getElementById('storyBottomLine')){ const line=document.createElement('div'); line.id='storyBottomLine'; Object.assign(line.style,{position:'absolute',left:'0',right:'0',bottom:'0',height:'2px',boxShadow:'inset 0 -2px 0 0 rgba(213,168,74,.75)'}); Engine.el.story.appendChild(line);}
  Engine.el.freeText=$('#freeText'); Engine.el.btnAct=$('#btnAct'); Engine.el.btnCont=$('#btnCont');

  Engine.el.btnEnd=$('#btnEnd'); Engine.el.btnSettings=$('#btnSettings'); Engine.el.btnGloss=$('#btnGloss'); Engine.el.btnSnap=$('#btnSnap'); Engine.el.sealsArc=$('#sealsArc'); Engine.el.pacing=$('#pacing');

  Engine.el.charPanel=$('#charPanel'); Engine.el.ledgerPanel=$('#ledgerPanel');
  Engine.el.seedVal=$('#seedVal'); Engine.el.turnVal=$('#turnVal'); Engine.el.sceneVal=$('#sceneVal');
  Engine.el.btnEdit=$('#btnEdit');
  Engine.el.shade=$('#shade'); Engine.el.nowplay=$('#nowplay'); Engine.el.npTitle=$('#npTitle'); Engine.el.npMute=$('#npMute');

  // character modal refs
  Engine.el.modalEdit=$('#modalEdit'); Engine.el.xEdit=$('#xEdit');
  Engine.el.edName=$('#edName'); Engine.el.edRace=$('#edRace');
  Engine.el.edSTR=$('#edSTR'); Engine.el.edDEX=$('#edDEX'); Engine.el.edINT=$('#edINT'); Engine.el.edCHA=$('#edCHA');
  Engine.el.edHP=$('#edHP'); Engine.el.edGold=$('#edGold'); Engine.el.edInv=$('#edInv');
  Engine.el.btnAuto=$('#btnAuto'); Engine.el.btnEditSave=$('#btnEditSave'); Engine.el.btnEditCancel=$('#btnEditCancel');

  
  // settings
  if(Engine.el.btnGloss){ Engine.el.btnGloss.onclick=()=>{ document.body.classList.add('show-gloss'); setTimeout(()=>document.body.classList.remove('show-gloss'), 3200); }; }
  if(Engine.el.btnSnap){ Engine.el.btnSnap.onclick=()=>{ exportSnapshot(); }; }
  if(Engine.el.hcMode){ Engine.el.hcMode.onchange=()=>{ document.body.classList.toggle('hc', Engine.el.hcMode.checked); }; }
  if(Engine.el.btnGloss){
    Engine.el.btnGloss.onclick=()=>{
      document.body.classList.add('show-gloss');
      setTimeout(()=>document.body.classList.remove('show-gloss'), 3200);
    };
  }
  if(Engine.el.btnSnap){
    Engine.el.btnSnap.onclick=()=>{ exportSnapshot(); };
  }
  if(Engine.el.hcMode){
    Engine.el.hcMode.onchange=()=>{
      document.body.classList.toggle('hc', Engine.el.hcMode.checked);
    };
  }
Engine.el.modalSet=$('#modalSet'); Engine.el.xSet=$('#xSet');
  Engine.el.twOn=$('#twOn'); Engine.el.twCps=$('#twCps');
  Engine.el.aMaster=$('#aMaster'); Engine.el.aUi=$('#aUi'); Engine.el.aAmb=$('#aAmb'); Engine.el.aDrums=$('#aDrums'); Engine.el.sfxSuccess=$('#sfxSuccess'); Engine.el.sfxFail=$('#sfxFail'); Engine.el.sfxStory=$('#sfxStory');
  Engine.el.dmEndpoint=$('#dmEndpoint'); Engine.el.btnLiveToggle=$('#btnLiveToggle');
  Engine.el.btnSave=$('#btnSave'); Engine.el.btnLoad=$('#btnLoad'); Engine.el.btnExport=$('#btnExport'); Engine.el.btnUndo=$('#btnUndo');
  Engine.el.btnRestart=$('#btnRestart'); Engine.el.btnResetAll=$('#btnResetAll'); Engine.el.hcMode=$('#hcMode');

  // scroll modal
  Engine.el.modalScroll=$('#modalScroll'); Engine.el.xScroll=$('#xScroll'); Engine.el.scrollContent=$('#scrollContent');

  // epilogue modal
  Engine.el.modalEpi=$('#modalEpi'); Engine.el.xEpi=$('#xEpi'); Engine.el.epiTitle=$('#epiTitle'); Engine.el.epiContent=$('#epiContent'); Engine.el.btnEpiRestart=$('#btnEpiRestart');
}
// runtime cleanup: remove deprecated Highlight Terms button
try{ const g=document.getElementById('btnGloss'); if(g) g.remove(); }catch{};


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
    attachGlossTips(Engine.el.modalScroll);
    openModal(Engine.el.modalScroll);
  });
}

/* ---------- storage ---------- */
function hydrate(){
  const saved=store.get('dds_state',null); if(!saved) return;
  const d=defaults();
  Engine.state = {
    ...d, ...saved,
    character:{...d.character, ...(saved.character||{})},
    flags:{...d.flags, ...(saved.flags||{})},
    settings:{...d.settings, ...(saved.settings||{}), audio:{...d.settings.audio, ...((saved.settings||{}).audio||{})}},
    live:{...d.live, ...(saved.live||{})},
    _choiceHistory:Array.isArray(saved._choiceHistory)?saved._choiceHistory:[],
    _lastChoices:Array.isArray(saved._lastChoices)?saved._lastChoices:[],
    _arcStep:saved._arcStep||0
  };
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
    Engine.el.edHP.value=C.HP; Engine.el.edGold.value=C.Gold; Engine.el.edInv.value=C.inventory.join(', ');
    open(Engine.el.modalEdit);
  };
  Engine.el.btnAuto.onclick=()=>{ autoGen(); Engine.el.btnEdit.onclick(); };
  Engine.el.btnEditSave.onclick=()=>{ const C=S.character;
    C.name=Engine.el.edName.value||C.name; C.race=Engine.el.edRace.value||C.race;
    C.STR=+Engine.el.edSTR.value||C.STR; C.DEX=+Engine.el.edDEX.value||C.DEX; C.INT=+Engine.el.edINT.value||C.INT; C.CHA=+Engine.el.edCHA.value||C.CHA;
    C.HP=+Engine.el.edHP.value||C.HP; C.Gold=+Engine.el.edGold.value||C.Gold;
    C.inventory=Engine.el.edInv.value.split(',').map(x=>x.trim()).filter(Boolean);
    close(Engine.el.modalEdit); renderAll();
  };
  Engine.el.btnEditCancel.onclick=()=>close(Engine.el.modalEdit);

  // settings
  if(Engine.el.btnGloss){ Engine.el.btnGloss.onclick=()=>{ document.body.classList.add('show-gloss'); setTimeout(()=>document.body.classList.remove('show-gloss'), 3200); }; }
  if(Engine.el.btnSnap){ Engine.el.btnSnap.onclick=()=>{ exportSnapshot(); }; }
  if(Engine.el.hcMode){ Engine.el.hcMode.onchange=()=>{ document.body.classList.toggle('hc', Engine.el.hcMode.checked); }; }
  Engine.el.btnSettings.onclick=()=>{ Engine.el.twOn.checked=S.settings.typewriter; Engine.el.twCps.value=S.settings.cps; if(Engine.el.hcMode) Engine.el.hcMode.checked=document.body.classList.contains('hc');
    Engine.el.aMaster.value=S.settings.audio.master; Engine.el.aUi.value=S.settings.audio.ui; Engine.el.aAmb.value=S.settings.audio.amb; Engine.el.aDrums.value=S.settings.audio.drums;
    Engine.el.dmEndpoint.value=S.live.endpoint; Engine.el.btnLiveToggle.textContent=S.live.on?'Turn Live DM Off':'Turn Live DM On';
    Engine.el.sfxSuccess.checked = (S.settings.audio.sfx_success!==false);
    Engine.el.sfxFail.checked    = (S.settings.audio.sfx_fail!==false);
    Engine.el.sfxStory.checked   = (S.settings.audio.sfx_story!==false);
    open(Engine.el.modalSet); };
  Engine.el.xSet.onclick=()=>close(Engine.el.modalSet);
  Engine.el.twOn.onchange=()=>{S.settings.typewriter=Engine.el.twOn.checked; store.set('dds_state',S);};
  Engine.el.twCps.onchange=()=>{S.settings.cps=clamp(+Engine.el.twCps.value||40,10,120); store.set('dds_state',S);};
  [Engine.el.aMaster,Engine.el.aUi,Engine.el.aAmb,Engine.el.aDrums].forEach(sl=>sl.oninput=()=>{S.settings.audio.master=+Engine.el.aMaster.value; S.settings.audio.ui=+Engine.el.aUi.value; S.settings.audio.amb=+Engine.el.aAmb.value; S.settings.audio.drums=+Engine.el.aDrums.value; Sound.setLevels(); store.set('dds_state',S);});
  Engine.el.dmEndpoint.onchange=()=>{S.live.endpoint=Engine.el.dmEndpoint.value.trim()||'/dm-turn'; store.set('dm_ep',S.live.endpoint);};
  Engine.el.btnLiveToggle.onclick=()=>{ S.live.on=!S.live.on; store.set('dm_on',S.live.on); };
  Engine.el.sfxSuccess.onchange=()=>{S.settings.audio.sfx_success=Engine.el.sfxSuccess.checked; store.set('dds_state',S);};
  Engine.el.sfxFail.onchange=()=>{S.settings.audio.sfx_fail=Engine.el.sfxFail.checked; store.set('dds_state',S);};
  Engine.el.sfxStory.onchange=()=>{S.settings.audio.sfx_story=Engine.el.sfxStory.checked; store.set('dds_state',S);};
  Engine.el.btnRestart.onclick=()=>{ close(Engine.el.modalSet); beginTale(); };
  Engine.el.btnResetAll.onclick=()=>{ close(Engine.el.modalSet); localStorage.clear(); location.reload(); };

  // scroll modal
  Engine.el.xScroll.onclick=()=>close(Engine.el.modalScroll);

  // epilogue modal
  Engine.el.xEpi.onclick=()=>close(Engine.el.modalEpi);
  Engine.el.btnEpiRestart.onclick=()=>{ close(Engine.el.modalEpi); beginTale(); };

  // global overlay close
  Engine.el.shade.onclick=()=>{ [Engine.el.modalEdit,Engine.el.modalSet,Engine.el.modalScroll,Engine.el.modalEpi].forEach(m=>m.classList.add('hidden')); Engine.el.shade.classList.add('hidden'); };
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') Engine.el.shade.onclick(); });

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
function renderAll(){
  const s=Engine.state, C=s.character, F=s.flags;
  $('#seedVal').textContent=s.seed; $('#turnVal').textContent=s.turn; $('#sceneVal').textContent=s.scene;

  // Character (no Bag here; moved to Ledger)
  Engine.el.charPanel.innerHTML = `
    <div><b>${esc(C.name)}</b></div>
    <div>${esc(C.race)}</div>
    <div>STR ${C.STR} (${fmt(modFrom(C.STR))}) — DEX ${C.DEX} (${fmt(modFrom(C.DEX))})</div>
    <div>INT ${C.INT} (${fmt(modFrom(C.INT))}) — CHA ${C.CHA} (${fmt(modFrom(C.CHA))})</div>
    <div>HP ${C.HP} — Gold ${C.Gold}</div>`;

  // Ledger — inventory always visible; other lines appear only when relevant
  const lines = [];
  lines.push(`<div>Inventory: ${C.inventory.join(', ')||'—'}</div>`);
  if (F.rumors) lines.push(`<div>Rumors heard: yes</div>`);
  if ((F.seals||[]).length) lines.push(`<div>Keys: ${(F.seals||[]).join(', ')}</div>`);
  if (F.bossReady) lines.push(`<div>Gate ready: yes</div>`);
  if (F.bossDealtWith) lines.push(`<div>Unfathomer dealt with: yes</div>`);
  Engine.el.ledgerPanel.innerHTML = lines.join('');


  // Seals ring arc
  try{
    const sealsCt = (F.seals||[]).length; const circ = 2*Math.PI*40; const frac = Math.min(1, sealsCt/3); 
    const dash = Math.max(0.0001, circ*frac);
    if(Engine.el.sealsArc){ Engine.el.sealsArc.setAttribute('stroke-dasharray', `${dash} ${circ-dash}`); }
  }catch{}
  // Pacing chips
  try{
    if(Engine.el.pacing){ const k = s.turn % 4; Array.from(Engine.el.pacing.children).forEach((c,i)=>c.classList.toggle('on', i===k)); }
  }catch{}

  // Story

  Engine.el.story.innerHTML='';
  for(const beat of s.storyBeats){
    const p=document.createElement('p');
    p.classList.add('beat');
    p.innerHTML=beat.html?beat.html:esc(beat.text);
    if(beat.roll){ const g=document.createElement('span'); g.className='rollglyph'; g.textContent=' ⟡'; g.title=beat.roll; p.appendChild(g); }
    if(beat.kind==='success'){ p.classList.add('glow-success'); const rg=p.querySelector('.rollglyph'); if(rg) rg.style.color='#D5A84A'; }
    if(beat.kind==='fail'){ p.classList.add('glow-fail'); const rg=p.querySelector('.rollglyph'); if(rg) rg.style.color='#A12525'; }
    if(beat.kind==='story') p.classList.add('glow-story');
    Engine.el.story.appendChild(p);
  }
  Engine.el.story.scrollTop=Engine.el.story.scrollHeight;

  if (s.settings.typewriter && s._pendingType){
    const p=Engine.el.story.lastElementChild;
    if (p && !p.dataset.typed){ p.dataset.typed='1'; typewrite(p, p.textContent, s.settings.cps); }
    s._pendingType=false;
  }
}

/* ---------- flow ---------- */
function beginTale(){
  const S=Engine.state;
  S.turn=0; S.scene='Halls'; S.storyBeats=[]; S.transcript=[]; S._choiceHistory=[]; S._lastChoices=[]; S._arcStep=0;
  S.flags={rumors:false,seals:[],bossReady:false,bossDealtWith:false};
  appendBeat("Lanterns throw steady light across carved lintels and iron mosaics. Word passes of a slow, otherworldly tide called the Unfathomer, pooling in the buried cisterns. You wait at the mouth of the Halls, where corridors open like patient books.");
  renderChoices(makeChoiceSet(S.scene));
  S.turn++; renderAll(); BGM.updateForState(Engine.state);
}
function endTale(){
  const S=Engine.state, C=S.character;
  const ep = `Epilogue — You carry ${C.Gold} gold and ${C.inventory.length} keepsakes. Keys gained: ${S.flags.seals.join(', ')||'none'}. ` +
    (S.flags.bossDealtWith?'The Unfathomer is quiet; people sleep deeply this week.':'The Unfathomer still turns beneath the streets. Quiet talk in ale-halls carries your name.');
  appendBeat(ep); renderChoices([]); renderAll();
}
function undoTurn(){
  const S=Engine.state; if(S.turn<=1) return;
  S.storyBeats.pop(); S.transcript.pop(); S.turn=Math.max(0,S.turn-1);
  renderChoices(makeChoiceSet(S.scene)); renderAll();
}

/* ---------- choices ---------- */
function renderChoices(choices){
  const list=Engine.el.choiceList; if(!list) return;

  if (!Array.isArray(Engine.state._choiceHistory)) Engine.state._choiceHistory=[];
  if (!Array.isArray(Engine.state._lastChoices))   Engine.state._lastChoices=[];

  const hist=Engine.state._choiceHistory, pool=[...(choices||[])];
  const fresh=pool.filter(c=>!hist.includes(c.id));
  let picked=[];
  if(fresh.length){ picked.push(pick(fresh)); const rest=pool.filter(c=>c.id!==picked[0].id); if(rest.length) picked.push(pick(rest)); }
  else{ picked=[pick(pool)]; const second=pool.filter(c=>c.id!==picked[0]?.id); if(second.length) picked.push(pick(second)); }
  hist.push(...picked.map(c=>c.id)); while(hist.length>10) hist.shift();

  const prev=Engine.state._lastChoices;
  if(picked.map(c=>c.sentence).join('|')===prev.join('|')) picked=modulateChoices(picked);
  Engine.state._lastChoices=picked.map(c=>c.sentence);

  list.innerHTML='';
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
  if(resp?.flags_patch) Object.assign(S.flags, resp.flags_patch);
  if(resp?.inventory_delta){ const add=resp.inventory_delta.add||[], rem=resp.inventory_delta.remove||[]; S.character.inventory=S.character.inventory.filter(x=>!rem.includes(x)).concat(add); }
  if(typeof resp?.gold_delta==='number'){ S.character.Gold=Math.max(0,S.character.Gold+resp.gold_delta); }
  if(typeof resp?.hp_delta==='number'){ S.character.HP=Math.max(0,S.character.HP+resp.hp_delta); }
  if(resp?.scene) S.scene=resp.scene;
  if(!S.flags.bossReady && S.flags.seals.length>=2) S.flags.bossReady=true;

  const kind = roll ? (roll.total>=roll.dc ? 'success':'fail') : 'story';
  const html = resp?.story_paragraph_html || null;
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

  if(kind==='story'){ cinematicFocus(); }
  const next=(resp?.next_choices && resp.next_choices.length)?resp.next_choices:makeChoiceSet(S.scene);
  renderChoices(next); S.turn++; renderAll(); BGM.updateForState(Engine.state);
}

/* ---------- local DM with four-beat spine ---------- */
function localTurn(payload){
  const {action,passed,stat,source,game_state}=payload; const S=game_state;
  const seals=S.flags.seals||[]; const have=new Set(seals);
  let story=''; let flags_patch={}; let inv={add:[],remove:[]}; let gold_delta=0, hp_delta=0; let scene=S.scene;

  if(source==='choice'){
    if(passed){ if(rnd(1,10)<=4) gold_delta+=rnd(1,3); if(rnd(1,10)===1) hp_delta+=1; if(rnd(1,10)<=2) inv.add.push(pick(['Oil Flask','Lockpin','Rope Coil','Canteen'])); }
    else{ hp_delta-= (rnd(1,10)<=7?1:2); if(rnd(1,10)<=2) gold_delta-=rnd(0,2); }
  }

  let award=null; if(source==='choice' && passed && have.size<3 && rnd(1,6)===1){ const pool=['Brass','Echo','Stone'].filter(x=>!have.has(x)); if(pool.length) award=pick(pool); }
  if(award) flags_patch.seals=[...seals, award];

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
      if(!S.flags.bossReady && (seals.length>=2)) flags_patch.bossReady=true;
      if(Engine.state._arcStep>=9 && (S.flags.bossReady || (flags_patch.bossReady===true))) story+=" You stand where a choice will count double.";
    }else{
      const seg = "The corridor opens on decisions that won’t wait long.";
      story = aText ? `${aText} ${seg}` : seg;
    }
  }

  if(!story){
    const success={STR:"You shoulder through.", DEX:"You move with quiet balance.", INT:"You reason through the pattern.", CHA:"You speak with steady poise."}[stat||'INT'];
    const fail={STR:"The metal creaks but holds.", DEX:"Grit shifts; a lantern notices.", INT:"Two claims cancel; your guess goes wide.", CHA:"Your tone misfires; the window closes for now."}[stat||'INT'];
    const tail=award?` A sigil warms at your wrist — the Seal of ${award}.`:"";
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
  const entry= html?{html,roll,kind}:{text,roll,kind};
  Engine.state.storyBeats.push(entry);
  Engine.state.transcript.push(html?strip(html):text);
  Engine.state._pendingType=true;
}
function snapshotState(){ const S=Engine.state; return {character:S.character, flags:S.flags, scene:S.scene, turn:S.turn}; }
function recentHistory(){ const T=Engine.state.transcript; return T.slice(Math.max(0,T.length-10)); }
function fmt(n){ return (n>=0?'+':'')+n; }
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[c])); }
function strip(html){ const d=document.createElement('div'); d.innerHTML=html; return d.textContent||''; }
function stripHTML(s){ const d=document.createElement('div'); d.innerHTML=s; return d.textContent||''; }
function autoGen(){ const n=['Eldan','Brassa','Keled','Varek','Moriah','Thrain','Ysolda','Kael']; const C=Engine.state.character;
  C.name=pick(n); C.race=pick(['Dwarf','Human','Elf','Gnome','Halfling','Orc']); C.STR=rnd(8,18); C.DEX=rnd(8,18); C.INT=rnd(8,18); C.CHA=rnd(8,18); C.HP=rnd(8,20); C.Gold=rnd(0,25); C.inventory=['Torch','Canteen','Oil Flask','Rope Coil','Lockpin'].sort(()=>Math.random()-.5).slice(0,rnd(1,3)); renderAll(); }
function toast(txt){ const t=document.createElement('div'); t.textContent=txt; Object.assign(t.style,{position:'fixed',bottom:'14px',left:'14px',background:'#1e1e28',color:'#fff',padding:'8px 10px',border:'1px solid #3a3a48',borderRadius:'6px',opacity:'0.96',zIndex:9999}); document.body.appendChild(t); setTimeout(()=>t.remove(),1200); }
function exportTranscript(){ const S=Engine.state; const html=`<!doctype html><meta charset="utf-8"><title>Story Transcript</title><style>body{font:16px Georgia,serif;margin:32px;color:#222}h1{font:700 22px system-ui,Segoe UI,Roboto,sans-serif}.meta{color:#555;margin-bottom:14px}p{line-height:1.55}</style><h1>Brassreach — Transcript</h1><div class="meta">Engine: ${S.live.on?'Live':'Local'} · Seed ${S.seed} · Turns ${S.turn}</div>${S.transcript.map(t=>`<p>${esc(t)}</p>`).join('')}`; const blob=new Blob([html],{type:'text/html'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='brassreach_transcript.html'; a.click(); URL.revokeObjectURL(url); }

/* ---------- typewriter (story) ---------- */
function typewrite(node, text, cps=40, ondone){
  node.textContent=''; node.classList.add('reveal');
  const cursor=document.createElement('span'); cursor.className='cursor'; node.appendChild(cursor);
  cursor.innerHTML = '<span class="smoke"></span>';
  let i=0;
  const tick=()=>{
    const step=Math.max(1,Math.round(cps/10));
    for(let k=0;k<step;k++){
      if(i>=text.length){ cursor.remove(); ondone&&ondone(); return; }
      const ch=document.createElement('span'); ch.className='ch on'; ch.textContent=text[i++];
      node.insertBefore(ch, cursor);
      if(/[\.!\?]/.test(ch.textContent)) break;
    }
    cursor.innerHTML='<span class="smoke"></span>';
    setTimeout(tick, 1000/Math.max(10,cps));
  };
  setTimeout(tick, 60);
}

/* ---------- typewriter (intro, preserves <span class="gloss">) ---------- */
function typewriteRich(p, cps=40){
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
        <p>Deep below gathers the <span class="gloss" data-def="A slow, deliberate tide that learns rhythm and pushes where the city is out of tune.">Unfathomer</span>, a standing <span class="gloss" data-def="Many tones sounding as one; where channels agree it stands firm, where they argue it reaches through.">chorus</span> taught by centuries of bells. Once, the <span class="gloss" data-def="The old rule that kept channels, bells, and gates in tune so the chorus rested.">Cadence Law</span> held it calm. Now cheap metal and careless renovations have pulled the city off pitch. Brassreach answers with the <span class="gloss" data-def="Ancient instruments of authority that bind by place, right, and pattern.">Three Seals</span>—<span class="gloss" data-def="Binds by weight and place; makes passages remember resistance.">Stone</span>, <span class="gloss" data-def="Binds by right; enforces oaths on gates and devices.">Brass</span>, and <span class="gloss" data-def="Binds by pattern; holds a spoken cadence after the voice is gone.">Echo</span>. In the stacks, <span class="gloss" data-def="Archivist of the Lower Stacks; believes the chorus can be bargained with using true measures.">Lithen the Wise</span> argues for treaty. In the foundries, <span class="gloss" data-def="Warden of the Brassworks; would retune the city by force and throttle the culverts.">Mullinen the Stout</span> argues for clamps and spikes. Between them stands your line in the dark.</p>
      </div></div>
      <div class="nav"><button class="btn secondary" id="introBack2">◂ Back</button><button class="btn gold intro-next">Continue ▸</button></div>
      <div class="mist" aria-hidden="true"></div>
    </section>

    <section class="slide s3" data-side="img-left" aria-label="Slide 3">
      <div class="img" aria-hidden="true"></div>
      <div class="copy"><div class="scroll">
        <p>Rumor says the <span class="gloss" data-def="An ancient tuning engine that once set the city’s measures with a single motion.">Gate of Measures</span> still turns in the cistern fields. To reach it you must map the <span class="gloss" data-def="The rumor-rich threshold where first paths are tried.">Halls</span>, steal or earn keys in the <span class="gloss" data-def="The deep library where ledgers, oaths, and tuning charts are kept.">Archives</span>, and descend into the <span class="gloss" data-def="The drowned, resonant galleries where the Unfathomer stands strongest.">Depths</span>. At places of clean <span class="gloss" data-def="A chamber’s agreement of tone where speech carries without drowning.">resonance</span> you may <span class="gloss" data-def="Quiet the chorus with truthful measures and working channels.">bind</span>, or <span class="gloss" data-def="Match cadence and make terms the city can keep.">bargain</span>, or—if all else fails—<span class="gloss" data-def="Drive the chorus back at a cost the city must bear.">banish</span>. Gather Seals, keep the ledger honest, and mark your way. The Unfathomer listens. The city remembers. Your choices decide which one the streets will follow.</p>
      </div></div>
      <div class="nav"><button class="btn secondary" id="introBack3">◂ Back</button><button class="btn gold intro-begin">Begin Story</button></div>
      <div class="mist" aria-hidden="true"></div>
    </section>
  </div>`;
}

function getQuickTablesHTML(){
  return `
    <hr class="sep"/>
    <div class="quick-tables">
      <h4>Codex: Keys & Measures</h4>
      <div class="grid2">
        <div>
          <h5>Three Seals (Keys)</h5>
          <ul>
            <li><b>Stone</b> — Authority of the makers.</li>
            <li><b>Brass</b> — Trade, craft, and oaths.</li>
            <li><b>Echo</b> — Memory of the waters.</li>
          </ul>
          <p><em>Two</em> Seals wake the Gate; <em>all three</em> open the richest endings.</p>
        </div>
        <div>
          <h5>Four Measures</h5>
          <ul>
            <li><b>Tune</b> — Align yourself to a rhythm; listen and adapt.</li>
            <li><b>Name</b> — Call a thing truly; identify patterns and forces.</li>
            <li><b>Measure</b> — Quantify and map; compare, test, and verify.</li>
            <li><b>Decide</b> — Commit and act; accept consequences with resolve.</li>
          </ul>
        </div>
      </div>
      <h5>Complications (Examples)</h5>
      <ul><li>Flood pulse forces a detour</li><li>Warden patrol crosses your path</li><li>Old mechanism shifts the floor plates</li></ul>
    </div>`;
}

function getIntroScrollHTML(){
  return `
    <hr class="sep"/>
    <div class="quick-tables">
      <h4>Codex: Keys & Measures</h4>
      <div class="grid2">
        <div>
          <h5>Three Seals (Keys)</h5>
          <ul>
            <li><b>Stone</b> — Authority of the makers.</li>
            <li><b>Brass</b> — Trade, craft, and oaths.</li>
            <li><b>Echo</b> — Memory of the waters.</li>
          </ul>
          <p><em>Two</em> Seals wake the Gate; <em>all three</em> open the richest endings.</p>
        </div>
        <div>
          <h5>Four Measures</h5>
          <ul>
            <li><b>Tune</b> — Align yourself to a rhythm; listen and adapt.</li>
            <li><b>Name</b> — Call a thing truly; identify patterns and forces.</li>
            <li><b>Measure</b> — Quantify and map; compare, test, and verify.</li>
            <li><b>Decide</b> — Commit and act; accept consequences with resolve.</li>
          </ul>
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
/* ---------- snapshot export ---------- */
function exportSnapshot(){
  try{
    const canvas = document.createElement('canvas'); const W=1200,H=675; canvas.width=W; canvas.height=H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle='#0c0f12'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#715322'; ctx.globalAlpha=.28; ctx.lineWidth=6;
    ctx.beginPath(); ctx.arc(W/2, H/2-20, 180, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha=1; ctx.fillStyle='#f1e6bb'; ctx.font='700 42px Cinzel, serif'; ctx.textAlign='center';
    ctx.fillText('BRASSREACH', W/2, 70);
    const seals=(Engine.state.flags.seals||[]).join(', ')||'—';
    ctx.font='18px Josefin Sans, sans-serif'; ctx.fillText('Keys: '+seals, W/2, 105);
    const lines=Engine.state.transcript.slice(-6); ctx.textAlign='left'; ctx.font='20px Georgia, serif'; let y=170; const x=90;
    for(const line of lines){ const words=line.split(' '); let cur=''; for(const w of words){ const t=cur+w+' '; if(ctx.measureText(t).width>W-180){ ctx.fillText(cur,x,y); y+=30; cur=w+' '; } else cur=t; } if(cur){ ctx.fillText(cur,x,y); y+=36; } if(y>H-80) break; }
    ctx.font='16px Josefin Sans, sans-serif'; ctx.textAlign='right'; ctx.fillText(`Turn ${Engine.state.turn} · Scene ${Engine.state.scene}`, W-40, H-30);
    canvas.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='brassreach_snapshot.png'; a.click(); URL.revokeObjectURL(a.href); }, 'image/png', .92);
  }catch(e){ console.error(e); }
}

/* ---------- embers (JS-only; no CSS animations) ---------- */
(function(){
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

  function spawnOne(host){
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
    const host = ensureLayer(id);
    for (let i=0; i<seed; i++) setTimeout(()=>spawnOne(host), i*180);
    const h = setInterval(()=>spawnOne(host), 650);
    return { stop(){ clearInterval(h); } };
  }

  window.FX = { start };
})();
