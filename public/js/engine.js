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

/* ---------- sound @ ~20 BPM base ---------- */
const Sound=(()=>{
  let ctx, master, ui, amb, drums;
  const ensure=()=>{ if(ctx) return;
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain(); master.gain.value=Engine.state.settings.audio.master; master.connect(ctx.destination);
    ui=ctx.createGain(); ui.gain.value=Engine.state.settings.audio.ui; ui.connect(master);
    amb=ctx.createGain(); amb.gain.value=Engine.state.settings.audio.amb; amb.connect(master);
    drums=ctx.createGain(); drums.gain.value=Engine.state.settings.audio.drums; drums.connect(master);

    // Harmonic motion: longer ostinato w/ implied chords + contrary motion
    const beat = 3000; // ≈20 BPM
    const notesA = [55, 73.42, 61.74, 82.41, 65.41, 55, 92.5, 61.74];   // A/D/B/E/F/A/Bb/B
    const notesB = [49, 65.41, 58.27, 77.78, 61.74, 49, 87.31, 58.27];  // counter line
    const bass = ctx.createOscillator(); bass.type='sawtooth';
    const pad  = ctx.createOscillator(); pad.type='triangle';
    const g1=ctx.createGain(), g2=ctx.createGain(); g1.gain.value=.020; g2.gain.value=.012;
    bass.connect(g1).connect(amb); pad.connect(g2).connect(amb);
    let i=0; bass.start(); pad.start();
    setInterval(()=>{ if(!ctx) return;
      const a = notesA[i%notesA.length], b = notesB[i%notesB.length], fifth = a*1.5;
      const t=ctx.currentTime;
      bass.frequency.linearRampToValueAtTime(a, t+.6);
      pad.frequency.linearRampToValueAtTime((i%3===0? fifth : b), t+.7);
      i++;
    }, beat);

    // Drums: low hits on 1 & 3; ghosted 16ths/32nds before downbeats
    const bar=beat*4, sixteenth=beat/4, thirty=beat/8;
    setInterval(()=>{
      if(!ctx) return; const t=ctx.currentTime;

      hit(t, 72, 34, .24, .24);                        // beat 1
      ghost(t + (sixteenth/1000)*3, 700,.05);          // 16th pickup
      ghost(t + (thirty/1000)*7,   820,.04);           // 32nd pickup

      hit(t+2*beat/1000, 68, 32, .22, .22);            // beat 3
      ghost(t + 2*beat/1000 - sixteenth/1000*1, 620,.05);
      ghost(t + 4*beat/1000 - thirty/1000*1,   760,.04);

      function hit(at,f1,f2,dur,amp){
        const o=ctx.createOscillator(); o.type='sine';
        const g=ctx.createGain(); g.gain.setValueAtTime(.0001,at);
        g.gain.exponentialRampToValueAtTime(amp, at+.02);
        g.gain.exponentialRampToValueAtTime(.0001, at+dur);
        o.frequency.setValueAtTime(f1,at);
        o.frequency.exponentialRampToValueAtTime(f2,at+dur*.85);
        o.connect(g).connect(drums); o.start(at); o.stop(at+dur+.02);
      }
      function ghost(at,f,dur){
        const o=ctx.createOscillator(); o.type='triangle';
        const g=ctx.createGain(); g.gain.setValueAtTime(.0001,at);
        g.gain.exponentialRampToValueAtTime(.06, at+.01);
        g.gain.exponentialRampToValueAtTime(.0001, at+dur);
        o.frequency.setValueAtTime(f,at);
        o.connect(g).connect(drums); o.start(at); o.stop(at+dur+.02);
      }
    }, bar);
  };
  const setLevels=()=>{ if(!ctx) return;
    master.gain.value=Engine.state.settings.audio.master;
    ui.gain.value=Engine.state.settings.audio.ui;
    amb.gain.value=Engine.state.settings.audio.amb;
    drums.gain.value=Engine.state.settings.audio.drums;
  };
  const click=()=>{ ensure(); const t=ctx.currentTime;
    const o=ctx.createOscillator(); o.type='square';
    o.frequency.setValueAtTime(jitter(300),t);
    o.frequency.exponentialRampToValueAtTime(jitter(120),t+.09);
    const g=ctx.createGain(); g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(.28, t+.01);
    g.gain.exponentialRampToValueAtTime(.0001, t+.16);
    o.connect(g).connect(ui); o.start(t); o.stop(t+.18);
  };
  const sfx=(kind)=>{ // success / fail / story
    const sa=Engine.state.settings.audio||{};
    if((kind==='success' && sa.sfx_success===false) || (kind==='fail' && sa.sfx_fail===false) || (kind==='story' && sa.sfx_story===false)) return;
    ensure(); const t=ctx.currentTime;
    const o=ctx.createOscillator(), g=ctx.createGain(); o.type='sine';
    const a = kind==='success' ? [jitter(520,0.06), jitter(880,0.06), .18, .24]
              : kind==='fail' ? [jitter(180,0.06), jitter(90,0.06), .28, .26]
              : [jitter(320,0.06), jitter(440,0.06), .22, .20];
    o.frequency.setValueAtTime(a[0],t);
    o.frequency.exponentialRampToValueAtTime(a[1],t+a[2]*.9);
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(a[3],t+.015);
    g.gain.exponentialRampToValueAtTime(.0001,t+a[2]);
    o.connect(g).connect(ui); o.start(t); o.stop(t+a[2]+.05);
  };
  const ambOn=()=>ensure();
  return {click, sfx, ambOn, setLevels, ensure};
})();

/* ---------- weaver ---------- */
const Weaver = makeWeaver(store,
  (msg)=>Engine.state.storyBeats.push({text:`[log] ${msg}`}),
  (tag)=>{ const t=$('#engineTag'); if(t) t.textContent=Engine.state.live.on?'Live':'Local'; }
);

/* ---------- boot ---------- */
export function boot(){
  buildUI(); hydrate(); bind(); renderAll();
  attachGlossTips(document.body);
  insertIntro(); // overlay every load
  const seen = store.get('intro_seen', false);
  if (seen) { if (Engine.el.intro) Engine.el.intro.classList.add('hidden'); if (!Engine.state.storyBeats.length) beginTale(); }
  mountScrollFab();
  /* ambience removed */
}

// --- Edge-aware glossary tooltips -------------------------------

function attachGlossTips(root){
  const MARGIN = 12;                // keep tips off the edges
  const SHOW_DELAY = 100;           // ms
  let showTimer = null, rearmTimer = null;

  function ensureTip(term){
    let tip = term.querySelector('.gloss-tip');
    if (!tip){
      tip = document.createElement('span');
      tip.className = 'gloss-tip';
      term.appendChild(tip);
    }
    // refresh text every time in case the DOM was rebuilt
    tip.textContent = term.getAttribute('data-def') || term.dataset.def || '';
    tip.style.position = 'fixed';
    tip.style.left = '0'; tip.style.top = '0';
    tip.style.maxWidth = 'min(28rem, calc(100vw - 32px))';
    tip.style.pointerEvents = 'none';
    tip.style.opacity = '0';
    tip.style.visibility = 'hidden';
    tip.style.transform = 'translate3d(-9999px,-9999px,0)';
    return tip;
  }

  function placeNear(term, tip){
    const r = term.getBoundingClientRect();
    const vw = innerWidth, vh = innerHeight;
    // measure first
    tip.style.transform = 'translate3d(-9999px,-9999px,0)';
    tip.style.visibility = 'hidden';
    tip.style.opacity = '0';
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const nx = Math.min(vw - w - MARGIN, Math.max(MARGIN, r.right + 14));
    const ny = Math.min(vh - h - MARGIN, Math.max(MARGIN, r.bottom + 8));
    tip.style.transform = `translate3d(${nx}px,${ny}px,0)`;
    tip.style.visibility = 'visible';
    requestAnimationFrame(()=>{ tip.style.opacity = '1'; tip.classList.add('on'); });
  }

  root.addEventListener('mouseenter', (ev)=>{
    const term = ev.target.closest('.gloss');
    if (!term) return;
    const tip = ensureTip(term);
    clearTimeout(showTimer);
    showTimer = setTimeout(()=> placeNear(term, tip), SHOW_DELAY);
  }, true);

  // prevent the prior "swoop": ignore mousemove while tip is visible
  root.addEventListener('mousemove', (ev)=>{}, true);

  root.addEventListener('mouseleave', (ev)=>{
    const term = ev.target.closest('.gloss');
    if (!term) return;
    clearTimeout(showTimer);
    const tip = term.querySelector('.gloss-tip');
    if (tip){
      tip.classList.remove('on'); tip.style.opacity = '0'; tip.style.visibility = 'hidden';
    }
  }, true);
}
/* ---------- typewriter (story) ---------- */
function typewrite(node, text, cps=40, ondone){
  node.textContent=''; node.classList.add('reveal');
  const cursor=document.createElement('span'); cursor.className='cursor'; node.appendChild(cursor);
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

    <section class="slide s2" data-side="img-right" aria-label="Slide 2">
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
function getIntroScrollHTML(){
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

  return `
    <div class="scroll">
      ${$('#intro .s1 .scroll')?.innerHTML||''}
      ${$('#intro .s2 .scroll')?.innerHTML||''}
      ${$('#intro .s3 .scroll')?.innerHTML||''}
    </div>`;
}

/* ---------- modal helpers ---------- */
function openModal(m){ if(!m) return; Engine.el.shade.classList.remove('hidden'); m.classList.remove('hidden'); }
function closeModal(m){ if(!m) return; m.classList.add('hidden'); Engine.el.shade.classList.add('hidden'); }


