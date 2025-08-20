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
    flags:{ rumors:true, seals:[], bossReady:false, bossDealtWith:false },
    _choiceHistory:[], _lastChoices:[], _arcStep:0, _pendingType:false,
    settings:{ typewriter:true, cps:40, audio:{ master:0.5, ui:0.45, amb:0.5, drums:0.52 } },
    live:{ on:store.get('dm_on',false), endpoint:store.get('dm_ep','/dm-turn') }
  };
}
const Engine={ el:{}, state: defaults() };

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
  insertIntro(); // overlay every load
  const seen = store.get('intro_seen', false);
  if (seen) { if (Engine.el.intro) Engine.el.intro.classList.add('hidden'); if (!Engine.state.storyBeats.length) beginTale(); mountScrollFab(); }
  Sound.ambOn();
}

/* ---------- Intro slideshow ---------- */
function insertIntro(){
  if (Engine.el && Engine.el.intro) return;

  const slidesHTML = getIntroSlidesHTML();
  document.body.insertAdjacentHTML('afterbegin', slidesHTML);

  Engine.el.intro    = $('#intro');
  Engine.el.slides   = $$('.slide', Engine.el.intro);
  Engine.el.nextBtns = $$('.intro-next', Engine.el.intro);
  Engine.el.beginBtn = $('.intro-begin', Engine.el.intro);

  // inject tooltips once
  attachGlossTips(Engine.el.intro);

  let idx=0;
  const show = (i)=>{
    idx = Math.max(0, Math.min(Engine.el.slides.length-1, i));
    Engine.el.slides.forEach((s,k)=>{
      s.classList.toggle('active', k===idx);
      const img=$('.img',s); if(img){ img.style.animation='none'; img.offsetHeight; img.style.animation='introZoom 22s ease-in-out forwards'; }
      const p=$('.scroll p',s);
      if(p && !p.dataset.typed){ p.dataset.typed='1'; typewriteRich(p, Engine.state.settings.cps); }
    });
  };

  // edge-aware nudging for glossary tips (coarse but safe)
  Engine.el.intro.addEventListener('mouseenter', ev=>{
    const g = ev.target.closest?.('.gloss'); if(!g) return;
    const tip=g.querySelector('.tip'); if(!tip) return;
    tip.style.left='0'; tip.style.right='auto';
    const r=g.getBoundingClientRect(), vw=innerWidth||document.documentElement.clientWidth, pad=24;
    if (r.left < pad) { tip.style.left = `${pad - r.left}px`; tip.style.right='auto'; }
    if (vw - r.right < 280) { tip.style.left='auto'; tip.style.right = `${pad - (vw - r.right)}px`; }
  }, true);

  Engine.el.nextBtns.forEach(b=>b.addEventListener('click',()=>{ Sound.sfx('story'); show(idx+1); }));
  $('#introBack2')?.addEventListener('click', ()=>{ Sound.click(); show(idx-1); });
  $('#introBack3')?.addEventListener('click', ()=>{ Sound.click(); show(idx-1); });
  $('#introSkip1')?.addEventListener('click', ()=>{ Sound.click(); Engine.el.beginBtn.click(); });

  if (Engine.el.beginBtn){
    Engine.el.beginBtn.onclick=()=>{
      Sound.click();
      Engine.el.intro.classList.add('hidden');
      store.set('intro_seen', true);
      if (!Engine.state.storyBeats.length) beginTale();
      // open editor immediately and mount scroll icon
      setTimeout(()=>{ Engine.el.btnEdit.click(); mountScrollFab(); }, 120);
    // Robust, delegated clicks for all intro buttons
  Engine.el.intro.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.classList.contains('intro-next')) {       // Continue ▸
      Sound.sfx('story'); show(idx + 1);
    } else if (b.classList.contains('intro-begin')) { // Begin Story
      Sound.click();
      Engine.el.intro.classList.add('hidden');
      store.set('intro_seen', true);
      if (!Engine.state.storyBeats.length) beginTale();
      setTimeout(() => { Engine.el.btnEdit.click(); mountScrollFab(); }, 120);
    } else if (b.id === 'introBack2' || b.id === 'introBack3') {
      Sound.click(); show(idx - 1);
    } else if (b.id === 'introSkip1') {
      Sound.click();
      // behave like "Begin Story"
      Engine.el.intro.classList.add('hidden');
      store.set('intro_seen', true);
      if (!Engine.state.storyBeats.length) beginTale();
      setTimeout(() => { Engine.el.btnEdit.click(); mountScrollFab(); }, 120);
    }
  });
    };
  }
  show(0);
}

/* ---------- DOM ---------- */
function buildUI(){
  document.body.innerHTML = `
  <div class="app">
    <div class="masthead">
      <div class="brand-title">Brassreach</div>
      <div class="toolbar cardish">
        <div class="controls">
          <button id="btnEnd" class="btn">End the Story</button>
          <button id="btnSettings" class="btn">Settings</button>
          <span class="tag">Engine: <b id="engineTag">Local</b></span>
        </div>
      </div>
    </div>

    <div class="main">
      <section class="storywrap">
        <div id="story" class="story-scroll"></div>
        <div class="choices">
          <div id="choices"></div>
          <div class="free">
            <input id="freeText" placeholder="Write your own action (e.g., search the alcove, read the tablet)" />
            <button id="btnAct" class="btn gold">ACT</button>
            <button id="btnCont" class="btn">Continue story</button>
          </div>
        </div>
      </section>

      <aside class="side">
        <div class="card deco">
          <h3 style="text-align:center;">Character <button id="btnEdit" class="btn mini">Edit</button></h3>
          <div id="charPanel" class="centered"></div>
        </div>
        <div class="card deco">
          <h3 style="text-align:center;">Ledger</h3>
          <div id="ledgerPanel" class="centered"></div>
        </div>
        <div class="card deco">
          <h3 style="text-align:center;">Session</h3>
          <div class="centered" style="line-height:1.6">
            <div>Seed: <span id="seedVal"></span></div>
            <div>Turn: <span id="turnVal"></span></div>
            <div>Scene: <span id="sceneVal"></span></div>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <div id="shade" class="shade hidden"></div>

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
          <h4>Typewriter</h4>
          <label><input type="checkbox" id="twOn"> Enable</label><br>
          <label>Chars/sec <input type="number" id="twCps" min="10" max="120" step="5"></label>
        </div>
        <div>
          <h4>Audio</h4>
          <label>Master <input type="range" id="aMaster" min="0" max="0.8" step="0.01"></label><br>
          <label>UI <input type="range" id="aUi" min="0" max="0.8" step="0.01"></label><br>
          <label>Ambience <input type="range" id="aAmb" min="0" max="0.8" step="0.01"></label><br>
          <label>Drums <input type="range" id="aDrums" min="0" max="0.8" step="0.01"></label>
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
            <button id="btnReplayIntro" class="btn">Replay Intro</button>
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
  Engine.el.story=$('#story'); Engine.el.choiceList=$('#choices'); Engine.el.choicesBox=$('.choices');
  Engine.el.freeText=$('#freeText'); Engine.el.btnAct=$('#btnAct'); Engine.el.btnCont=$('#btnCont');

  Engine.el.btnEnd=$('#btnEnd'); Engine.el.btnSettings=$('#btnSettings');

  Engine.el.charPanel=$('#charPanel'); Engine.el.ledgerPanel=$('#ledgerPanel');
  Engine.el.seedVal=$('#seedVal'); Engine.el.turnVal=$('#turnVal'); Engine.el.sceneVal=$('#sceneVal');
  Engine.el.btnEdit=$('#btnEdit');
  Engine.el.shade=$('#shade');

  // character modal refs
  Engine.el.modalEdit=$('#modalEdit'); Engine.el.xEdit=$('#xEdit');
  Engine.el.edName=$('#edName'); Engine.el.edRace=$('#edRace');
  Engine.el.edSTR=$('#edSTR'); Engine.el.edDEX=$('#edDEX'); Engine.el.edINT=$('#edINT'); Engine.el.edCHA=$('#edCHA');
  Engine.el.edHP=$('#edHP'); Engine.el.edGold=$('#edGold'); Engine.el.edInv=$('#edInv');
  Engine.el.btnAuto=$('#btnAuto'); Engine.el.btnEditSave=$('#btnEditSave'); Engine.el.btnEditCancel=$('#btnEditCancel');

  // settings modal
  Engine.el.modalSet=$('#modalSet'); Engine.el.xSet=$('#xSet');
  Engine.el.twOn=$('#twOn'); Engine.el.twCps=$('#twCps');
  Engine.el.aMaster=$('#aMaster'); Engine.el.aUi=$('#aUi'); Engine.el.aAmb=$('#aAmb'); Engine.el.aDrums=$('#aDrums');
  Engine.el.dmEndpoint=$('#dmEndpoint'); Engine.el.btnLiveToggle=$('#btnLiveToggle');
  Engine.el.btnSave=$('#btnSave'); Engine.el.btnLoad=$('#btnLoad'); Engine.el.btnExport=$('#btnExport'); Engine.el.btnUndo=$('#btnUndo');
  Engine.el.btnReplayIntro=$('#btnReplayIntro'); Engine.el.btnRestart=$('#btnRestart'); Engine.el.btnResetAll=$('#btnResetAll');

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
  btn.className='scroll-fab';
  btn.innerHTML = `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 8h36a6 6 0 0 1 6 6v30a6 6 0 0 1-6 6H22l-8 6v-6h-2a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z" />
      <path d="M18 18h28M18 28h22M18 38h26" />
    </svg>`;
  document.body.appendChild(btn);
  btn.addEventListener('click', ()=>{
    Engine.el.scrollContent.innerHTML=getIntroScrollHTML();
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
  Engine.el.btnSettings.onclick=()=>{ Engine.el.twOn.checked=S.settings.typewriter; Engine.el.twCps.value=S.settings.cps;
    Engine.el.aMaster.value=S.settings.audio.master; Engine.el.aUi.value=S.settings.audio.ui; Engine.el.aAmb.value=S.settings.audio.amb; Engine.el.aDrums.value=S.settings.audio.drums;
    Engine.el.dmEndpoint.value=S.live.endpoint; Engine.el.btnLiveToggle.textContent=S.live.on?'Turn Live DM Off':'Turn Live DM On';
    open(Engine.el.modalSet); };
  Engine.el.xSet.onclick=()=>close(Engine.el.modalSet);
  Engine.el.twOn.onchange=()=>{S.settings.typewriter=Engine.el.twOn.checked; store.set('dds_state',S);};
  Engine.el.twCps.onchange=()=>{S.settings.cps=clamp(+Engine.el.twCps.value||40,10,120); store.set('dds_state',S);};
  [Engine.el.aMaster,Engine.el.aUi,Engine.el.aAmb,Engine.el.aDrums].forEach(sl=>sl.oninput=()=>{S.settings.audio.master=+Engine.el.aMaster.value; S.settings.audio.ui=+Engine.el.aUi.value; S.settings.audio.amb=+Engine.el.aAmb.value; S.settings.audio.drums=+Engine.el.aDrums.value; Sound.setLevels(); store.set('dds_state',S);});
  Engine.el.dmEndpoint.onchange=()=>{S.live.endpoint=Engine.el.dmEndpoint.value.trim()||'/dm-turn'; store.set('dm_ep',S.live.endpoint);};
  Engine.el.btnLiveToggle.onclick=()=>{ S.live.on=!S.live.on; store.set('dm_on',S.live.on); };
  Engine.el.btnReplayIntro.onclick=()=>{ close(Engine.el.modalSet); store.set('intro_seen', false); insertIntro(); $('#intro').classList.remove('hidden'); $('#scrollFab')?.remove(); };
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
  Engine.el.btnCont.onclick=()=>doNarrate({ sentence:'' }); // silent advance
  Engine.el.btnAct.onclick=()=>freeText();
  Engine.el.freeText.addEventListener('keydown',e=>{ if(e.key==='Enter') freeText(); });

  Engine.el.btnEnd.onclick=endTale;
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

  // Story
  Engine.el.story.innerHTML='';
  for(const beat of s.storyBeats){
    const p=document.createElement('p');
    p.classList.add('beat');
    p.innerHTML=beat.html?beat.html:esc(beat.text);
    if(beat.roll){ const g=document.createElement('span'); g.className='rollglyph'; g.textContent=' ⟡'; g.title=beat.roll; p.appendChild(g); }
    if(beat.kind==='success') p.classList.add('glow-success');
    if(beat.kind==='fail') p.classList.add('glow-fail');
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
  S.flags={rumors:true,seals:[],bossReady:false,bossDealtWith:false};
  appendBeat("Lanterns throw steady light across carved lintels and iron mosaics. Word passes of a slow, otherworldly tide called the Unfathomer, pooling in the buried cisterns. You wait at the mouth of the Halls, where corridors open like patient books.");
  renderChoices(makeChoiceSet(S.scene));
  S.turn++; renderAll();
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
  appendBeat(resp?.story_paragraph || '(silence)', roll?`d20 ${roll.r} ${fmt(roll.mod)} vs DC ${roll.dc} ⇒ ${roll.total}`:null, (kind==='success'?'success':(kind==='fail'?'fail':null)), html);
  Sound.sfx(kind);

  if (S.character.HP<=0){
    // modal epilogue
    const dead = "Your pulse falters; the lantern’s ring dims. Companions—if any—carry a line back to daylight. The Unfathomer keeps its quiet measure.";
    Engine.el.epiTitle.textContent = 'Fallen Line';
    Engine.el.epiContent.textContent = dead;
    openModal(Engine.el.modalEpi);
    renderChoices([]);
    S.turn++; renderAll(); return;
  }

  const next=(resp?.next_choices && resp.next_choices.length)?resp.next_choices:makeChoiceSet(S.scene);
  renderChoices(next); S.turn++; renderAll();
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
    const rumor=" The cisterns answer more clearly than the streets.";
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

/* ---------- glossary tip injector ---------- */
function attachGlossTips(root){
  (root||document).querySelectorAll('.gloss').forEach(el=>{
    if (el.querySelector('.tip')) return;
    const tip=document.createElement('span');
    tip.className='tip';
    tip.textContent = el.getAttribute('data-def') || '';
    el.appendChild(tip);

    el.addEventListener('mouseenter', ()=>{
      // reset positioning; CSS fades it in
      tip.style.left='0'; tip.style.right='auto';
      const r=el.getBoundingClientRect(), vw=innerWidth||document.documentElement.clientWidth, pad=24;
      if (r.left < pad) { tip.style.left = `${pad - r.left}px`; tip.style.right='auto'; }
      if (vw - r.right < 280) { tip.style.left='auto'; tip.style.right = `${pad - (vw - r.right)}px`; }
    });
  });
}
