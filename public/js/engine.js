// public/js/engine.js
// v0.5 — ambience melody + “drums in the deep”; italicized user input;
// evolving two-choice set (one new per turn + retire after 4); semantic anti-repetition;
// seals display fix; Live DM toggle persistence; Settings modal (typewriter + audio);
// typewriter reveal with smoke cursor; success/fail glow; death & last-stand.

import { makeWeaver } from './weaver.js';

/* ---------- tiny utilities ---------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const modFromScore = s => Math.floor((s - 10) / 2);
const rnd = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const choice = arr => arr[rnd(0, arr.length-1)];

/* ---------- simple persistent store ---------- */
const store = {
  get(k, def){ try{ const v = localStorage.getItem(k); return v?JSON.parse(v):def; }catch{return def;} },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} },
  del(k){ try{ localStorage.removeItem(k); }catch{} }
};

/* ---------- engine state ---------- */
const Engine = {
  el: {},
  state: {
    seed: rnd(1, 9_999_999),
    turn: 0,
    scene: 'Halls',
    log: [],
    storyBeats: [],            // {text, rollInfo?, tone?, userText?}
    transcript: [],
    lastStandUsed: false,
    buffs: { nextDexBonus: 0 },
    _lastChoices: [],
    _choiceHistory: [],        // recent choice ids to retire
    opts: {                    // Settings
      typewriter: true,
      cps: 40,
      smoke: true,
      mix: { master: 0.6, amb: 0.35, sfx: 0.7 }
    },
    character: {
      name: 'Eldan',
      STR: 12, DEX: 14, INT: 12, CHA: 10,
      HP: 14, Gold: 5,
      inventory: ['Torch', 'Canteen']
    },
    flags: {
      rumors: false,
      seals: [],               // 'Brass','Echo','Stone'
      bossReady: false,
      bossDealtWith: false,
      bossCooldown: 0
    }
  }
};

/* ---------- Weaver bridge ---------- */
const Weaver = makeWeaver(
  store,
  (msg)=>Engine.state.log.push(msg),
  (tag)=>{ const t = $('#engineTag'); if (t) t.textContent = tag; }
);

/* ---------- Sound (procedural; no files) ---------- */
const Sound = (() => {
  let ctx, master, ui, amb, flames;
  let bass, bassGain, bassTimer = null, dripTimer = null, drumTimer = null;

  function init(){
    if (ctx) return;
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = Engine.state.opts.mix.master; master.connect(ctx.destination);
    ui     = ctx.createGain(); ui.gain.value = Engine.state.opts.mix.sfx; ui.connect(master);
    amb    = ctx.createGain(); amb.gain.value = 0.0; amb.connect(master);
    flames = ctx.createGain(); flames.gain.value = 0.0; flames.connect(master);

    // Base room-tone
    const o1=ctx.createOscillator(); o1.type='sine';     o1.frequency.value=110;
    const g1=ctx.createGain(); g1.gain.value=0.02; o1.connect(g1).connect(amb); o1.start();
    const o2=ctx.createOscillator(); o2.type='triangle'; o2.frequency.value=165;
    const g2=ctx.createGain(); g2.gain.value=0.015; o2.connect(g2).connect(amb); o2.start();
    const l1=ctx.createOscillator(); const lg1=ctx.createGain(); l1.type='sine'; l1.frequency.value=0.08; lg1.gain.value=0.012; l1.connect(lg1).connect(g1.gain); l1.start();

    // Flames for death
    const noise=ctx.createBuffer(1, ctx.sampleRate*2, ctx.sampleRate);
    const data=noise.getChannelData(0); for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*0.08;
    const ns2=ctx.createBufferSource(); ns2.buffer=noise; ns2.loop=true;
    const bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1000; bp.Q.value=0.6;
    const fg=ctx.createGain(); fg.gain.value=0.0; ns2.connect(bp).connect(fg).connect(flames); ns2.start();
    const l2=ctx.createOscillator(); const lg2=ctx.createGain(); l2.type='sine'; l2.frequency.value=0.2; lg2.gain.value=0.3; l2.connect(lg2).connect(fg.gain); l2.start();
  }

  // walking bass + dripping + distant drums
  function startMelody(){
    if (!ctx) init();
    if (bassTimer) return;

    bass = ctx.createOscillator(); bass.type='sawtooth';
    const filt = ctx.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=240; filt.Q.value=0.6;
    bassGain = ctx.createGain(); bassGain.gain.value=0.03;
    bass.connect(filt).connect(bassGain).connect(amb);
    bass.start();

    const notes = [110, 98, 123, 92, 82, 110];
    const step = (i=0) => {
      if (!bass) return;
      const f = notes[i % notes.length] * (1 + (Math.random()-0.5)*0.02);
      bass.frequency.setTargetAtTime(f, ctx.currentTime, 0.05);
      bassTimer = setTimeout(()=>step(i+1), 2400 + Math.floor(Math.random()*1200));
    };
    step(0);

    // upward “drip”
    const dripTick = () => {
      dripTimer = setTimeout(()=>{
        const t = ctx.currentTime;
        const o = ctx.createOscillator(); o.type='sine';
        o.frequency.setValueAtTime(480, t);
        o.frequency.exponentialRampToValueAtTime(880, t+0.35); // ascend
        const g=ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.10, t+0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t+0.55);
        o.connect(g).connect(amb); o.start(t); o.stop(t+0.6);
        dripTick();
      }, 4000 + Math.random()*8000);
    };
    dripTick();

    // “drums in the deep” — soft low thumps
    const drum = () => {
      drumTimer = setTimeout(()=>{
        const t = ctx.currentTime;
        const o = ctx.createOscillator(); o.type='sine';
        o.frequency.setValueAtTime(70, t);
        o.frequency.exponentialRampToValueAtTime(52, t+0.25);
        const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.22, t+0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t+0.35);
        o.connect(g).connect(amb); o.start(t); o.stop(t+0.36);
        // occasionally a triple-beat
        if (Math.random()<0.33){
          for (let i=1;i<=2;i++){
            const tt=t+0.45*i;
            const oo=ctx.createOscillator(); oo.type='sine'; oo.frequency.setValueAtTime(64, tt);
            const gg=ctx.createGain(); gg.gain.setValueAtTime(0.0001, tt);
            gg.gain.exponentialRampToValueAtTime(0.18, tt+0.02);
            gg.gain.exponentialRampToValueAtTime(0.0001, tt+0.26);
            oo.connect(gg).connect(amb); oo.start(tt); oo.stop(tt+0.28);
          }
        }
        drum();
      }, 6000 + Math.random()*9000);
    };
    drum();
  }
  function stopMelody(){
    if (bassTimer){ clearTimeout(bassTimer); bassTimer=null; }
    if (dripTimer){ clearTimeout(dripTimer); dripTimer=null; }
    if (drumTimer){ clearTimeout(drumTimer); drumTimer=null; }
    if (bass){ try{ bass.stop(); }catch{} bass.disconnect(); bass=null; }
  }

  function toggleAmb(on=true){
    init(); if(ctx.state==='suspended') ctx.resume();
    amb.gain.cancelScheduledValues(ctx.currentTime);
    amb.gain.linearRampToValueAtTime(on?Engine.state.opts.mix.amb:0, ctx.currentTime+0.6);
    if (on) startMelody(); else stopMelody();
    return on;
  }
  function flamesOn(on=true){
    init(); if(ctx.state==='suspended') ctx.resume();
    flames.gain.cancelScheduledValues(ctx.currentTime);
    flames.gain.linearRampToValueAtTime(on?0.25:0, ctx.currentTime+0.4);
  }

  // Lower-pitched “wood thunk”
  function uiClick(){
    if(!ctx) return;
    const t=ctx.currentTime;
    const o=ctx.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(140, t+0.08);
    const g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(0.28, t+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t+0.18);
    const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=420;
    o.connect(lp).connect(g).connect(ui); o.start(t); o.stop(t+0.2);
  }

  // Gentle dice thunk-roll
  function dice(){
    if(!ctx) return; const t=ctx.currentTime;
    const o=ctx.createOscillator(); o.type='square';
    o.frequency.setValueAtTime(340,t);
    o.frequency.exponentialRampToValueAtTime(160,t+0.14);
    const g=ctx.createGain(); g.gain.value=0.0001;
    g.gain.exponentialRampToValueAtTime(0.32, t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t+0.26);
    const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=500;
    o.connect(lp).connect(g).connect(ui); o.start(t); o.stop(t+0.28);
  }

  function uiHover(){
    if(!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(990, t);
    o.frequency.exponentialRampToValueAtTime(660, t+0.06);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t+0.12);
    o.connect(g).connect(ui); o.start(t); o.stop(t+0.14);
  }

  function setMix({master: M, amb: A, sfx: S}){
    if (!ctx) init();
    if (typeof M==='number') master.gain.value = clamp(M, 0, 1);
    if (typeof A==='number') amb.gain.value    = clamp(A, 0, 1);
    if (typeof S==='number') ui.gain.value     = clamp(S, 0, 1);
  }

  return { toggleAmb, flamesOn, uiClick, uiHover, dice, ensure:init, setMix };
})();

/* ---------- UI boot ---------- */
export function boot() {
  buildUI();
  if (Engine.el.modalShade) Engine.el.modalShade.classList.add('hidden');
  hydrateFromStorage();
  bindHandlers();

  // error visibility
  window.addEventListener('error', e => { appendBeat(`[script error] ${e.message}`); renderAll(); });
  window.addEventListener('unhandledrejection', e => { appendBeat(`[promise error] ${e.reason}`); renderAll(); });

  // Default: audio ON after first gesture
  document.addEventListener('pointerdown', ()=>{ Sound.ensure(); Sound.toggleAmb(true); }, { once:true });

  // apply persisted mix
  Sound.setMix(Engine.state.opts.mix);

  renderAll();
  .state.storyBeats.length === 0) beginTale();
}

/* ---------- UI construction ---------- */
function buildUI() {
  const root = document.body;
  root.innerHTML = `
  <div id="app" class="app">
    <div class="masthead">
      <h1 class="brand-title">Dwarven Deco Storyweaver</h1>
      <div class="toolbar cardish">
        <div class="controls">
          <button id="btnEdit" class="btn">Edit Character</button>
          <button id="btnAuto" class="btn">Auto-generate</button>
          <button id="btnBegin" class="btn">Begin Tale</button>
          <button id="btnEnd" class="btn">End the Story</button>
          <button id="btnUndo" class="btn">Undo</button>
          <button id="btnSave" class="btn">Save</button>
          <button id="btnLoad" class="btn">Load</button>
          <button id="btnExport" class="btn">Export</button>
          <button id="btnLive" class="btn">Live DM: Off</button>
          <button id="btnDMConfig" class="btn">Settings</button>
          <span class="tag">Engine: <b id="engineTag">Local</b></span>
        </div>
      </div>
    </div>

    <main class="main">
      <section class="story">
        <div id="storyScroll" class="story-scroll"></div>

        <div class="choices cardish">
          <div id="choices"></div>
          <div class="free">
            <input id="freeText" type="text" placeholder="Write your own action (e.g., search the alcove, read the tablet)"/>
            <button id="btnAct" class="btn btn-act">ACT</button>
            <button id="btnContinue" class="btn btn-continue">Continue story</button>
          </div>
        </div>
      </section>

      <aside class="side">
        <div class="panel cardish">
          <h3>Character</h3>
          <div id="charPanel"></div>
        </div>
        <div class="panel cardish">
          <h3>Flags & Seals</h3>
          <div id="flagPanel"></div>
        </div>
        <div class="panel cardish">
          <h3>Session</h3>
          <div>Seed: <span id="seedVal"></span></div>
          <div>Turn: <span id="turnVal"></span></div>
          <div>Scene: <span id="sceneVal"></span></div>
        </div>
      </aside>
    </main>
  </div>

  <div id="modalShade" class="shade hidden"></div>

  <div id="modalEdit" class="modal hidden">
    <div class="inner">
      <header><div>Edit Character</div><div class="closeX" id="xEdit">✕</div></header>
      <div class="content">
        <label>Name <input id="edName" /></label>
        <div class="grid2">
          <label>STR <input id="edSTR" type="number" min="6" max="18"/></label>
          <label>DEX <input id="edDEX" type="number" min="6" max="18"/></label>
          <label>INT <input id="edINT" type="number" min="6" max="18"/></label>
          <label>CHA <input id="edCHA" type="number" min="6" max="18"/></label>
          <label>HP  <input id="edHP"  type="number" min="4" max="30"/></label>
          <label>Gold<input id="edGold"type="number" min="0" max="999"/></label>
        </div>
        <label>Inventory (comma separated) <input id="edInv" /></label>
        <div class="modal-actions">
          <button id="btnEditSave" class="btn">Save</button>
          <button id="btnEditCancel" class="btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div id="modalDM" class="modal hidden">
    <div class="inner">
      <header><div>Settings</div><div class="closeX" id="xDM">✕</div></header>
      <div class="content settings-grid">
        <section>
          <h4>Typewriter</h4>
          <label><input type="checkbox" id="optTW"> Enable typewriter</label>
          <label>Speed <input type="range" id="optCPS" min="10" max="80" step="1"></label>
          <label><input type="checkbox" id="optSmoke"> Smoke cursor</label>
        </section>
        <section>
          <h4>Audio</h4>
          <label>Master <input type="range" id="mixMaster" min="0" max="1" step="0.01"></label>
          <label>Ambience <input type="range" id="mixAmb" min="0" max="1" step="0.01"></label>
          <label>Effects <input type="range" id="mixSFX" min="0" max="1" step="0.01"></label>
        </section>
        <section>
          <h4>Live DM</h4>
          <label>Endpoint <input id="dmEndpoint" placeholder="/dm-turn"/></label>
          <div class="btn-row">
            <button id="btnSaveDM" class="btn">Save</button>
            <button id="btnCancelDM" class="btn">Close</button>
          </div>
        </section>
      </div>
    </div>
  </div>

  <div id="modalDeath" class="modal hidden">
    <div class="inner">
      <header><div>Fallen in the Halls</div><div class="closeX" id="xDeath">✕</div></header>
      <div class="content">
        <p>Your strength fails. Darkness presses close around the lamps.</p>
        <div id="deathOptions" class="btn-row"></div>
      </div>
    </div>
  </div>
  `;

  // cache refs
  Engine.el.storyScroll = $('#storyScroll');
  Engine.el.choicesBox  = $('.choices');
  Engine.el.choiceList  = $('#choices');

  Engine.el.charPanel = $('#charPanel');
  Engine.el.flagPanel = $('#flagPanel');

  Engine.el.seedVal = $('#seedVal');
  Engine.el.turnVal = $('#turnVal');
  Engine.el.sceneVal = $('#sceneVal');

  Engine.el.btnEdit = $('#btnEdit');
  Engine.el.btnAuto = $('#btnAuto');
  Engine.el.btnBegin = $('#btnBegin');
  Engine.el.btnEnd = $('#btnEnd');
  Engine.el.btnUndo = $('#btnUndo');
  Engine.el.btnSave = $('#btnSave');
  Engine.el.btnLoad = $('#btnLoad');
  Engine.el.btnExport = $('#btnExport');
  Engine.el.btnLive = $('#btnLive');
  Engine.el.btnDMConfig = $('#btnDMConfig');

  Engine.el.btnAct = $('#btnAct');
  Engine.el.btnContinue = $('#btnContinue');
  Engine.el.freeText = $('#freeText');

  Engine.el.modalShade = $('#modalShade');

  Engine.el.modalEdit = $('#modalEdit');
  Engine.el.edName = $('#edName'); Engine.el.edSTR = $('#edSTR'); Engine.el.edDEX = $('#edDEX');
  Engine.el.edINT = $('#edINT'); Engine.el.edCHA = $('#edCHA'); Engine.el.edHP = $('#edHP'); Engine.el.edGold = $('#edGold'); Engine.el.edInv = $('#edInv');
  Engine.el.btnEditSave = $('#btnEditSave'); Engine.el.btnEditCancel = $('#btnEditCancel'); Engine.el.xEdit = $('#xEdit');

  Engine.el.modalDM = $('#modalDM'); Engine.el.dmEndpoint = $('#dmEndpoint');
  Engine.el.btnSaveDM = $('#btnSaveDM'); Engine.el.btnCancelDM = $('#btnCancelDM'); Engine.el.xDM = $('#xDM');
  Engine.el.optTW = $('#optTW'); Engine.el.optCPS = $('#optCPS'); Engine.el.optSmoke = $('#optSmoke');
  Engine.el.mixMaster = $('#mixMaster'); Engine.el.mixAmb = $('#mixAmb'); Engine.el.mixSFX = $('#mixSFX');

  Engine.el.modalDeath = $('#modalDeath'); Engine.el.deathOptions = $('#deathOptions'); Engine.el.xDeath = $('#xDeath');
}

/* ---------- storage ---------- */
function hydrateFromStorage() {
  const saved = store.get('dds_state', null);
  if (saved) Engine.state = saved;

  const live = store.get('dds_live', false);
  Weaver.setMode(live ? 'live' : 'local');
  if (live) $('#engineTag').textContent = 'Live';

  const ep = store.get('dds_endpoint', '/dm-turn');
  Weaver.setEndpoint(ep);
}

/* ---------- handlers ---------- */
function bindHandlers() {
  Engine.el.btnEdit.onclick = openEdit;
  Engine.el.btnAuto.onclick = autoGen;
  Engine.el.btnBegin.onclick = beginTale;
  Engine.el.btnEnd.onclick = endTale;
  Engine.el.btnUndo.onclick = undoTurn;
  Engine.el.btnSave.onclick = () => { store.set('dds_state', Engine.state); toast('Saved'); };
  Engine.el.btnLoad.onclick = () => { const s = store.get('dds_state', null); if (s) { Engine.state = s; renderAll(); toast('Loaded'); } };
  Engine.el.btnExport.onclick = exportTranscript;

  Engine.el.btnLive.onclick = () => {
    const toLive = (Weaver.mode !== 'live');
    Weaver.setMode(toLive ? 'live' : 'local');
    Engine.el.btnLive.textContent = toLive ? 'Live DM: On' : 'Live DM: Off';
    store.set('dds_live', toLive);
  };

  Engine.el.btnDMConfig.onclick = () => {
    try {
      // hydrate settings controls
      Engine.el.optTW.checked  = !!Engine.state.opts.typewriter;
      Engine.el.optCPS.value   = Engine.state.opts.cps;
      Engine.el.optSmoke.checked = !!Engine.state.opts.smoke;

      Engine.el.mixMaster.value = Engine.state.opts.mix.master;
      Engine.el.mixAmb.value    = Engine.state.opts.mix.amb;
      Engine.el.mixSFX.value    = Engine.state.opts.mix.sfx;

      Engine.el.dmEndpoint.value = Weaver.endpoint || '/dm-turn';
      openModal(Engine.el.modalDM);
    } catch (e) { appendBeat(`[Settings] ${e.message}`); renderAll(); }
  };
  Engine.el.btnSaveDM.onclick   = () => {
    Engine.state.opts.typewriter = !!Engine.el.optTW.checked;
    Engine.state.opts.cps        = +Engine.el.optCPS.value || 40;
    Engine.state.opts.smoke      = !!Engine.el.optSmoke.checked;

    Engine.state.opts.mix.master = +Engine.el.mixMaster.value;
    Engine.state.opts.mix.amb    = +Engine.el.mixAmb.value;
    Engine.state.opts.mix.sfx    = +Engine.el.mixSFX.value;
    Sound.setMix(Engine.state.opts.mix);

    const ep = Engine.el.dmEndpoint.value.trim() || '/dm-turn';
    Weaver.setEndpoint(ep);
    store.set('dds_endpoint', ep);

    store.set('dds_state', Engine.state);
    closeModal(Engine.el.modalDM);
    toast('Settings saved');
  };
  Engine.el.btnCancelDM.onclick = () => closeModal(Engine.el.modalDM);
  Engine.el.xDM.onclick         = () => closeModal(Engine.el.modalDM);

  Engine.el.btnEditSave.onclick = saveEdit;
  Engine.el.btnEditCancel.onclick = () => closeModal(Engine.el.modalEdit);
  Engine.el.xEdit.onclick         = () => closeModal(Engine.el.modalEdit);

  Engine.el.btnAct.onclick = () => freeTextAct();
  Engine.el.freeText.addEventListener('keydown', (e)=>{ if (e.key==='Enter') freeTextAct(); });

  Engine.el.btnContinue.onclick = () => { Sound.uiClick(); continueStory(); };

  // Close modals
  if (!Engine._escWired) {
    Engine._escWired = true;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' &&
          Engine.el.modalShade &&
          !Engine.el.modalShade.classList.contains('hidden')) {
        const open = document.querySelector('.modal:not(.hidden)');
        if (open) closeModal(open);
      }
    });
  }
  if (Engine.el.modalShade && !Engine.el.modalShade._wired) {
    Engine.el.modalShade._wired = true;
    Engine.el.modalShade.onclick = () => {
      const open = document.querySelector('.modal:not(.hidden)');
      if (open) closeModal(open);
    };
  }
}

/* ---------- render ---------- */
function renderAll() {
  const s = Engine.state;
  Engine.el.seedVal.textContent = s.seed;
  Engine.el.turnVal.textContent = s.turn;
  Engine.el.sceneVal.textContent = s.scene;

  // character panel
  const C = s.character;
  Engine.el.charPanel.innerHTML = `
    <div><b>${escapeHTML(C.name)}</b></div>
    <div>STR ${C.STR} (${fmtMod(modFromScore(C.STR))}) — DEX ${C.DEX} (${fmtMod(modFromScore(C.DEX))})</div>
    <div>INT ${C.INT} (${fmtMod(modFromScore(C.INT))}) — CHA ${C.CHA} (${fmtMod(modFromScore(C.CHA))})</div>
    <div>HP ${C.HP} — Gold ${C.Gold}</div>
    <div>Bag: ${C.inventory.join(', ') || '—'}</div>
  `;

  // flags panel (fix: ensure seals array is respected)
  const F = s.flags;
  Engine.el.flagPanel.innerHTML = `
    <div>Rumors heard: ${F.rumors ? 'yes' : 'no'}</div>
    <div>Seals: ${Array.isArray(F.seals) && F.seals.length ? F.seals.join(', ') : '—'}</div>
    <div>Gate ready: ${F.bossReady ? 'yes' : 'no'}</div>
    <div>Unfathomer dealt with: ${F.bossDealtWith ? 'yes' : 'no'}</div>
  `;

  // story area (with optional italic user input + glow/typewriter)
  Engine.el.storyScroll.innerHTML = '';
  Engine.state.storyBeats.forEach((beat, i) => {
    const p = document.createElement('p');
    p.className = 'beat';
    if (beat.userText){
      const em = document.createElement('em');
      em.textContent = beat.userText;
      p.appendChild(em);
      p.appendChild(document.createTextNode(' — '));
    }
    const span = document.createElement('span');
    span.textContent = beat.text;
    p.appendChild(span);

    if (beat.rollInfo) {
      const g = document.createElement('span');
      g.className = 'rollglyph'; g.textContent = ' ⟡';
      g.title = beat.rollInfo;
      p.appendChild(g);
    }
    if (beat.tone) p.classList.add(beat.tone === 'good' ? 'beat-good' : beat.tone === 'bad' ? 'beat-bad' : 'beat-neutral');

    Engine.el.storyScroll.appendChild(p);

    // typewriter only on last beat
    if (i === Engine.state.storyBeats.length-1 && Engine.state.opts.typewriter){
      typewrite(span, {
        cps: Engine.state.opts.cps,
        smoke: Engine.state.opts.smoke
      });
    }
  });
  Engine.el.storyScroll.scrollTop = Engine.el.storyScroll.scrollHeight;

  // hover/click polish
  $$('.controls .btn, .choice-btn, .btn-act, .btn-continue').forEach(b => {
    if (!b._hoverWired) { b._hoverWired = true; b.addEventListener('mouseenter', () => Sound.uiHover()); }
    if (!b._pulseWired) { b._pulseWired = true; b.addEventListener('click', ()=>{ b.classList.add('pulse'); setTimeout(()=>b.classList.remove('pulse'), 180); }); }
  });
}

/* ---------- typewriter ---------- */
function typewrite(targetSpan, {cps=40, smoke=true}={}){
  const full = targetSpan.textContent;
  targetSpan.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = smoke ? 'smoke-cursor' : 'cursor-hidden';
  targetSpan.after(cursor);

  const tick = () => {
    if (i >= full.length){ cursor.remove(); return; }
    const ch = full[i++];
    targetSpan.textContent += ch;

    let delay = 1000 / cps;
    if (/[,;:]/.test(ch)) delay += 120;
    if (/[.!?]/.test(ch)) delay += 260;

    setTimeout(tick, delay);
  };
  tick();
}

/* ---------- Modals ---------- */
function openModal(m){ try{ Engine.el.modalShade?.classList.remove('hidden'); m?.classList.remove('hidden'); }catch(e){ appendBeat(`[modal error] ${e.message}`); renderAll(); } }
function closeModal(m){ try{ Engine.el.modalShade?.classList.add('hidden');   m?.classList.add('hidden');   }catch(e){ appendBeat(`[modal error] ${e.message}`); renderAll(); } }
function toast(txt){
  const t = document.createElement('div');
  t.textContent = txt;
  Object.assign(t.style, {position:'fixed', bottom:'14px', left:'14px', background:'#1e1e28', color:'#fff', padding:'8px 10px', border:'1px solid #3a3a48', borderRadius:'6px', opacity:'0.96', zIndex:9999});
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 1200);
}

/* ---------- Character ---------- */
function openEdit(){
  const C = Engine.state.character;
  Engine.el.edName.value = C.name;
  Engine.el.edSTR.value = C.STR;
  Engine.el.edDEX.value = C.DEX;
  Engine.el.edINT.value = C.INT;
  Engine.el.edCHA.value = C.CHA;
  Engine.el.edHP.value = C.HP;
  Engine.el.edGold.value = C.Gold;
  Engine.el.edInv.value = C.inventory.join(', ');
  openModal(Engine.el.modalEdit);
}
function saveEdit(){
  const C = Engine.state.character;
  C.name = Engine.el.edName.value.trim() || C.name;
  C.STR = clamp(+Engine.el.edSTR.value||C.STR, 6, 18);
  C.DEX = clamp(+Engine.el.edDEX.value||C.DEX, 6, 18);
  C.INT = clamp(+Engine.el.edINT.value||C.INT, 6, 18);
  C.CHA = clamp(+Engine.el.edCHA.value||C.CHA, 6, 18);
  C.HP  = clamp(+Engine.el.edHP.value ||C.HP , 4, 30);
  C.Gold= clamp(+Engine.el.edGold.value||C.Gold, 0, 999);
  C.inventory = Engine.el.edInv.value.split(',').map(s=>s.trim()).filter(Boolean);
  closeModal(Engine.el.modalEdit);
  renderAll();
}
function autoGen(){
  const names = ['Eldan','Brassa','Keled','Varek','Moriah','Thrain','Ysolda','Kael'];
  const C = Engine.state.character;
  C.name = choice(names);
  C.STR = rnd(8,18); C.DEX = rnd(8,18); C.INT = rnd(8,18); C.CHA = rnd(8,18);
  C.HP = rnd(8,20); C.Gold = rnd(0,25);
  const pool = ['Torch','Canteen','Oil Flask','Bandage','Brass Key'];
  C.inventory = Array.from({length:rnd(1,3)}, ()=>choice(pool)).filter((v,i,self)=>self.indexOf(v)===i);
  renderAll();
}

/* ---------- Game flow ---------- */
function beginTale(){
  const S = Engine.state;
  S.turn = 0;
  S.scene = 'Halls';
  S.storyBeats = [];
  S.transcript = [];
  S.lastStandUsed = false;
  S.buffs = { nextDexBonus: 0 };
  S._lastChoices = [];
  S._choiceHistory = [];
  S.flags = { rumors: true, seals: [], bossReady: false, bossDealtWith: false, bossCooldown: 0 };

  appendBeat(
    "Lanterns throw steady light across carved lintels and iron mosaics. Word passes of a slow, otherworldly tide called the Unfathomer, pooling in the buried cisterns. You wait at the mouth of the Halls, corridors opening like patient books.",
    null, 'neutral'
  );

  renderChoices(makeChoiceSet(S.scene));
  S.turn++;
  renderAll();
}

function endTale(){
  const S = Engine.state, C = S.character;
  const seals = S.flags.seals.join(', ') || 'none';
  const dealt = S.flags.bossDealtWith ? 'The Unfathomer is answered. Its pressure eases from the bones of the city.' : 'The Unfathomer still turns beneath the streets.';
  const ep = `Epilogue — You carry ${C.Gold} gold and ${C.inventory.length} keepsakes. Seals gained: ${seals}. ${dealt} Quiet talk in ale-halls carries your name.`;
  appendBeat(ep, null, 'neutral');
  renderChoices([]); renderAll();
}

function undoTurn(){
  if (Engine.state.turn <= 1) return;
  Engine.state.storyBeats.pop();
  Engine.state.transcript.pop();
  Engine.state.turn = Math.max(0, Engine.state.turn - 1);
  renderChoices(makeChoiceSet(Engine.state.scene));
  renderAll();
}

/* ---------- Choices & actions ---------- */
function renderChoices(choices, maybeBoss){
  const list = Engine.el.choiceList || Engine.el.choicesBox;
  if (!list) return;

  // ensure one fresh option vs recent history (retire after 4 turns)
  const history = Engine.state._choiceHistory;
  const pool = [...choices];
  const fresh = pool.filter(c => !history.includes(c.id));
  let picked = [];

  if (fresh.length){
    picked.push(choice(fresh));
    const rest = pool.filter(c => c.id !== picked[0].id);
    picked.push(choice(rest));
  }else{
    // everything was seen recently — still pick two, but modulate text
    picked = [choice(pool), choice(pool.filter(c=>c.id!==picked[0]?.id))];
  }

  // retire bookkeeping
  history.push(...picked.map(c=>c.id));
  while (history.length > 8) history.shift(); // retire after ~4 turns

  // vary surface text vs last turn
  const prev = Engine.state._lastChoices || [];
  if (sameChoiceSet(prev, picked)) picked = modulateChoices(picked);
  Engine.state._lastChoices = picked.map(c => c.sentence);

  list.innerHTML = '';

  const addBtn = (ch) => {
    if (!ch || !ch.sentence) return;
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.sentence;
    btn.onclick = () => {
      Sound.uiClick();
      if (ch.narrate) return doNarrate(ch);
      resolveChoice(ch);
    };
    btn.addEventListener('mouseenter', () => Sound.uiHover(), { once:false });
    list.appendChild(btn);
  };

  picked.forEach(addBtn);
  if (maybeBoss) addBtn(maybeBoss);
  if (Engine.el.choicesBox) Engine.el.choicesBox.style.display = 'block';
}
function sameChoiceSet(a, b){
  const A = (a||[]).map(x=>typeof x==='string'?x:(x.sentence||'')).join('||');
  const B = (b||[]).map(x=>typeof x==='string'?x:(x.sentence||'')).join('||');
  return A === B;
}
function modulateChoices(arr){
  const t = Engine.state.turn, scene = Engine.state.scene;
  const tweak = (s) => {
    const body = s.replace(/\s*\((STR|DEX|INT|CHA)\)\s*$/,'');
    const stat = (s.match(/\((STR|DEX|INT|CHA)\)$/)||[])[1];
    let out = body;
    if (/\bStudy\b/i.test(out)) out = out.replace(/Study/i, (t%2? 'Re-examine' : 'Trace'));
    else if (/\bSlip\b/i.test(out)) out = out.replace(/Slip/i, (t%2? 'Skirt' : 'Move past'));
    else if (/\bCrosscheck\b/i.test(out)) out = out.replace(/Crosscheck/i, (t%2? 'Compare' : 'Recheck'));
    else if (/\bTalk\b/i.test(out)) out = out.replace(/Talk/i, (t%2? 'Coax' : 'Press'));
    out += (scene==='Halls' ? ' — quickly' : ' — carefully');
    return stat ? `${out} (${stat})` : out;
  };
  return arr.map(c => ({...c, sentence: tweak(c.sentence)}));
}

function doNarrate(ch){
  const payload = {
    action: ch.sentence,
    source: 'narrate',
    stat: null, dc: null, passed: null,
    game_state: snapshotState(),
    history: recentHistory()
  };
  Promise.resolve(Weaver.turn(payload, localTurn))
    .then(resp => applyTurnResult(resp, null, { userAction: ch.sentence }))
    .catch(()=>applyTurnResult(localTurn(payload), null, { userAction: ch.sentence }));
}

function resolveChoice(choice){
  const S = Engine.state, C = S.character;
  const stat = choice.stat;
  if (!stat) return doNarrate(choice);

  // compute roll
  let mod = modFromScore(C[stat]);
  if (stat==='DEX' && S.buffs.nextDexBonus){ mod += S.buffs.nextDexBonus; S.buffs.nextDexBonus = 0; }
  const baseDC = 10 + rnd(-1, +3);
  const dc = clamp(baseDC, 8, 18);
  const r = rnd(1,20);
  const total = r + mod;
  const passed = (total >= dc);

  Sound.dice();

  const payload = {
    action: choice.sentence.replace(/\s*\((STR|DEX|INT|CHA)\)\s*$/,'').trim(),
    source: 'choice',
    stat, dc, passed,
    game_state: snapshotState(),
    history: recentHistory()
  };

  Promise.resolve(Weaver.turn(payload, localTurn))
    .then(resp => applyTurnResult(resp, { r, mod, dc, total, passed }))
    .catch(() => applyTurnResult(localTurn(payload), { r, mod, dc, total, passed }));
}

function freeTextAct(){
  const text = (Engine.el.freeText.value || '').trim();
  if (!text) return;
  Engine.el.freeText.value = '';

  const stat = inferStat(text);
  if (stat === 'NARRATE'){
    doNarrate({ sentence: text, narrate:true });
    return;
  }

  const S = Engine.state, C = S.character;
  let mod = modFromScore(C[stat]);
  if (stat==='DEX' && S.buffs.nextDexBonus){ mod += S.buffs.nextDexBonus; S.buffs.nextDexBonus = 0; }

  const dc = clamp(10 + rnd(-1,+3), 8, 18);
  const r = rnd(1,20);
  const total = r + mod;
  const passed = (total >= dc);

  Sound.uiClick(); Sound.dice();

  const payload = {
    action: text,
    source: 'freeText',
    stat, dc, passed,
    game_state: snapshotState(),
    history: recentHistory()
  };

  Promise.resolve(Weaver.turn(payload, localTurn))
    .then(resp => applyTurnResult(resp, { r, mod, dc, total, passed }, { userAction: text }))
    .catch(()=>applyTurnResult(localTurn(payload), { r, mod, dc, total, passed }, { userAction: text }));
}

function continueStory(){
  doNarrate({ sentence:'Continue', narrate:true });
}

function applyTurnResult(resp, roll, meta){
  const S = Engine.state;
  const C = S.character;

  // --- flags/state patches ---
  if (resp?.flags_patch){
    if (Array.isArray(resp.flags_patch.seals)) S.flags.seals = resp.flags_patch.seals; // explicit fix
    Object.assign(S.flags, resp.flags_patch);
  }
  if (resp?.inventory_delta) {
    const add = resp.inventory_delta.add || [];
    const remove = resp.inventory_delta.remove || [];
    C.inventory = C.inventory.filter(x => !remove.includes(x)).concat(add.filter(x => !C.inventory.includes(x)));
  }
  if (typeof resp?.gold_delta === 'number') C.Gold = Math.max(0, C.Gold + resp.gold_delta);
  if (typeof resp?.hp_delta === 'number')   C.HP   = Math.max(0, C.HP   + resp.hp_delta);
  if (resp?.buffs && typeof resp.buffs.nextDexBonus === 'number') S.buffs.nextDexBonus = resp.buffs.nextDexBonus;

  // --- tone for glow ---
  let tone = 'neutral';
  if (roll && typeof roll.passed === 'boolean') tone = roll.passed ? 'good' : 'bad';

  // --- beat ---
  const rollInfo = roll ? `d20 ${roll.r} ${fmtMod(roll.mod)} vs DC ${roll.dc} ⇒ ${roll.total}` : null;
  appendBeat(resp?.story_paragraph || '(silence)', rollInfo, tone, meta?.userAction || null);

  // --- scene & gates ---
  if (resp?.scene) S.scene = resp.scene;
  if (!S.flags.bossReady && S.flags.seals.length >= 2) S.flags.bossReady = true;
  if (S.flags.bossCooldown > 0) S.flags.bossCooldown--;

  // --- next choices ---
  const maybeBoss = resp?.maybe_boss_option || null;
  const next = (resp?.next_choices && resp.next_choices.length) ? resp.next_choices : makeChoiceSet(S.scene);
  renderChoices(next, maybeBoss);

  S.turn++;
  renderAll();

  if (C.HP <= 0) showDeath();
}

/* ---------- Local fallback DM ---------- */
function localTurn(payload){
  const { action, passed, stat, source, game_state } = payload;
  const S = game_state;
  const seals = S.flags?.seals || [];
  const have = new Set(seals);

  // award seals sometimes on success
  let awardSeal = null;
  if (passed && have.size < 3 && rnd(1,5) === 1) {
    const pool = ['Brass','Echo','Stone'].filter(x=>!have.has(x));
    if (pool.length) { awardSeal = choice(pool); }
  }

  // loot sometimes on narration
  const maybeLoot = (source==='narrate' && rnd(1,6)===1) ? choice(['Bandage','Oil Flask','Brass Key']) : null;

  // simple HP consequences by stat bucket
  const hpFailRanges = { STR:[0,3], DEX:[0,2], INT:[0,1], CHA:[0,1] };
  let hp_delta = 0, gold_delta = 0;
  if (typeof passed === 'boolean') {
    if (passed) gold_delta = rnd(0,6);
    else if (stat && hpFailRanges[stat]) { const [a,b]=hpFailRanges[stat]; hp_delta = -rnd(a,b); }
  }

  const invAdd = []; if (maybeLoot) invAdd.push(maybeLoot);

  // narrative with variation
  const beat = craftBeat({ action, passed, stat, awardSeal, maybeLoot, source, scene:S.scene });

  // boss offering & result with cooldown
  let maybe_boss_option = null, flags_patch = {};
  const sealsCount = (awardSeal ? (seals.length+1) : seals.length);
  const ready = (S.flags?.bossReady || sealsCount >= 2) && (S.flags?.bossCooldown||0)===0;
  if (ready && (S.scene==='Depths' || /confront|unfathomer/i.test(action||''))) {
    maybe_boss_option = { sentence: 'Confront the Unfathomer (CHA)', stat: 'CHA', scene: 'Depths', id:'boss-confront' };
  }
  if (/confront.*unfathomer/i.test(action||'')) {
    if (typeof passed==='boolean') {
      if (passed) flags_patch = { bossDealtWith:true };
      else { flags_patch = { bossCooldown: 2 }; hp_delta += -rnd(1,3); }
    }
  }

  // scene drift for narration
  let nextScene = S.scene;
  if (source==='narrate') {
    if (S.scene==='Halls' && rnd(1,3)===1) nextScene = 'Archives';
    if (S.scene==='Archives' && rnd(1,3)===1) nextScene = 'Depths';
  }

  const next_choices = makeChoiceSet(nextScene);

  return {
    story_paragraph: beat,
    flags_patch: (awardSeal ? { ...flags_patch, seals: [...seals, awardSeal] } : flags_patch),
    inventory_delta: { add: invAdd, remove: [] },
    gold_delta, hp_delta,
    buffs: {},
    scene: nextScene,
    next_choices,
    maybe_boss_option
  };
}

function craftBeat({action, passed, stat, awardSeal, maybeLoot, source, scene}){
  const opens = [
    'Boots ring once on the tiles',
    'Lamplight searches the carvings',
    'Cold air moves along the arch',
    'Dust hangs in a quiet braid',
    'Stone answers with a low note'
  ];
  let open = choice(opens);
  const last = Engine.state.transcript.slice(-2);
  let tries = 0;
  while (tries++ < 5 && last.some(t => tooSimilar(open, t))) open = choice(opens);

  if (source==='narrate' || !stat){
    const t = {
      Halls: [
        `${open}. Benches and brasswork repeat like a measured chorus. A narrow door to the east bears scratches: recent, deliberate.`,
        `A worker’s alcove holds a ledger of deliveries. Several entries end with the same sigil — three nested waves.`,
        `Footprints braid and fade. One set trails a scent of lamp oil toward grates that breathe in and out with the city.`
      ],
      Archives: [
        `${open}. Stacks rise like organ pipes; notes in the margins argue with each other. A map of culverts is stitched with red thread.`,
        `Clerks have abandoned their stools in a hurry. A seal stamp lies on the floor, slick with wax, impressed with the word “ECHO”.`,
        `A chalk diagram shows a spiral into the cisterns. A second hand has underlined a single word: Unfathomer.`
      ],
      Depths: [
        `${open}. Water knocks against old pillars and returns in patient rhythm. The air smells like iron and rain.`,
        `The cistern rim glistens; faint shapes move below, as if something breathes through the stone.`,
        `Ropes and hooks sway, unattended. A lantern burns low, its flame bending toward the central pit.`
      ]
    };
    let base = choice(t[scene] || t.Halls);
    tries = 0; while (tries++ < 5 && last.some(m => tooSimilar(base, m))) base = choice(t[scene] || t.Halls);
    if (awardSeal) base += ` A sigil warms at your wrist — the Seal of ${awardSeal}.`;
    if (maybeLoot) base += ` Tucked behind a brace you find a ${maybeLoot}.`;
    if (scene!=='Depths') base += ` Rumors point downward; the cisterns hold the clearer answer.`;
    return base;
  }

  const successBy = {
    STR: [
      `You lean into the task and the bar gives; a dull crack opens the way.`,
      `Bracing well, you shift the weight; the mechanism concedes a notch.`
    ],
    DEX: [
      `Careful hands move cleanly; the catch slips without a sound.`,
      `You find the blind angle and pass through before the torch swings back.`
    ],
    INT: [
      `Symbols resolve; the pattern tells you where pressure has been and where it will be.`,
      `Two notes align in your head; the diagram yields a plain route.`
    ],
    CHA: [
      `Your words land steady; faces relax and a gatekeeper shares what they know.`,
      `You give them room to speak; a path appears in their explanation.`
    ]
  };
  const failBy = {
    STR: `The grate creaks under your weight and refuses; its rust smiles in defiance.`,
    DEX: `A shoe scuffs grit; light angles your way and a watcher tenses.`,
    INT: `Details won’t settle; two claims cancel and your guess goes wide.`,
    CHA: `Your tone misfires; expressions harden and the window closes for now.`
  };
  const tail = awardSeal ? ` A sigil warms at your wrist — the Seal of ${awardSeal}.` : '';

  const line = passed ? choice(successBy[stat]) + '.' + tail : `${failBy[stat]}.`;
  return line;
}

/* ---------- Choice generation (IDs + deeper pools) ---------- */
function makeChoiceSet(scene){
  const sets = {
    Halls: [
      { id:'h-int-1', sentence: 'Study the floor mosaics for wear patterns (INT)', stat: 'INT' },
      { id:'h-dex-1', sentence: 'Slip past the patrol routes you marked earlier (DEX)', stat: 'DEX' },
      { id:'h-str-1', sentence: 'Test the old grate for give (STR)', stat:'STR' },
      { id:'h-cha-1', sentence: 'Ask a porter what changed this week (CHA)', stat:'CHA' },
      { id:'h-nar-1', sentence: 'Walk the galleries and listen for repeating drafts', narrate: true }
    ],
    Archives: [
      { id:'a-int-1', sentence: 'Crosscheck culvert maps and margin notes (INT)', stat: 'INT' },
      { id:'a-cha-1', sentence: 'Talk the clerk into showing restricted volumes (CHA)', stat: 'CHA' },
      { id:'a-dex-1', sentence: 'Climb to a dusted ledge for overlooked boxes (DEX)', stat: 'DEX' },
      { id:'a-nar-1', sentence: 'Walk the stacks; log each echo and draft', narrate: true }
    ],
    Depths: [
      { id:'d-str-1', sentence: 'Hold your ground when the water swells (STR)', stat: 'STR' },
      { id:'d-int-1', sentence: 'Read the cadence of the tide around the pillars (INT)', stat: 'INT' },
      { id:'d-dex-1', sentence: 'Skirt the slick edge and test the footing (DEX)', stat: 'DEX' },
      { id:'d-nar-1', sentence: 'Watch the surface and mark where it bends toward the pit', narrate: true }
    ]
  };
  const pool = sets[scene] || sets.Halls;
  // only return checks here; narration is offered via "Continue story" button
  const checks = pool.filter(p=>p.stat);
  // random two; IDs will be used to keep variety
  const two = shuffle(checks).slice(0,2);
  return two;
}

/* ---------- Death / Last Stand ---------- */
function showDeath(){
  const D = Engine.el.deathOptions;
  if (!D) return;
  D.innerHTML = '';
  Sound.flamesOn(true);

  const bNew = document.createElement('button');
  bNew.className='btn'; bNew.textContent='New Run'; bNew.onclick=()=>{ Sound.uiClick(); closeModal(Engine.el.modalDeath); beginTale(); };
  D.appendChild(bNew);

  const bLoad = document.createElement('button');
  bLoad.className='btn'; bLoad.textContent='Load'; bLoad.onclick=()=>{ Sound.uiClick(); const s=store.get('dds_state',null); if(s){Engine.state=s; renderAll();} closeModal(Engine.el.modalDeath); };
  D.appendChild(bLoad);

  const C=Engine.state.character;
  if (C.inventory.includes('Bandage')){
    const bBand = document.createElement('button');
    bBand.className='btn'; bBand.textContent='Use Bandage (+2 HP)';
    bBand.onclick=()=>{ Sound.uiClick(); C.HP=Math.max(1,C.HP+2); C.inventory=C.inventory.filter(i=>i!=='Bandage'); Sound.flamesOn(false); closeModal(Engine.el.modalDeath); renderAll(); };
    D.appendChild(bBand);
  }

  if (!Engine.state.lastStandUsed){
    const bLS = document.createElement('button');
    bLS.className='btn'; bLS.textContent='Last Stand';
    bLS.onclick=()=>{ Sound.dice(); const r=rnd(1,20); if (r>=12){ Engine.state.character.HP=1; appendBeat('You find purchase on the very edge of the fall and breathe once, steady.', `d20 ${r} vs 12`, 'good'); } else { appendBeat('Strength leaves your hands; the dark accepts you.', `d20 ${r} vs 12`, 'bad'); } Engine.state.lastStandUsed=true; Sound.flamesOn(false); closeModal(Engine.el.modalDeath); renderAll(); if (Engine.state.character.HP<=0) showDeath(); };
    D.appendChild(bLS);
  }

  openModal(Engine.el.modalDeath);
}

/* ---------- Helpers ---------- */
function tooSimilar(a,b){
  if (!a || !b) return false;
  const A = a.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/).filter(Boolean);
  const B = b.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/).filter(Boolean);
  const setA = new Set(A), setB = new Set(B);
  const inter = [...setA].filter(w => setB.has(w)).length;
  const ratio = inter / Math.max(6, setA.size, setB.size);
  return ratio > 0.6;
}

function appendBeat(text, rollInfo, tone='neutral', userText=null){
  Engine.state.storyBeats.push({text, rollInfo, tone, userText});
  Engine.state.transcript.push((userText?`${userText} — `:'') + text);
}
function snapshotState(){
  const S = Engine.state;
  return { character: S.character, flags: S.flags, scene: S.scene, turn: S.turn };
}
function recentHistory(){ const T = Engine.state.transcript; return T.slice(Math.max(0, T.length - 10)); }
function inferStat(text){
  const t = text.toLowerCase();
  if (/\b(push|lift|break|smash|force|hold|shove|drag)\b/.test(t)) return 'STR';
  if (/\b(sneak|hide|slip|dodge|climb|balance|steal|pick)\b/.test(t)) return 'DEX';
  if (/\b(look|inspect|study|analyze|read|recall|solve|decipher|investigate)\b/.test(t)) return 'INT';
  if (/\b(speak|persuade|charm|intimidate|perform|negotiate|parley)\b/.test(t)) return 'CHA';
  return 'NARRATE';
}
function fmtMod(m){ return (m>=0?'+':'') + m; }
function shuffle(a){ const b=[...a]; for (let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; }
function escapeHTML(s){ return s.replace(/[&<>"']/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- Export transcript ---------- */
function exportTranscript(){
  const S = Engine.state;
  const html = `<!doctype html><meta charset="utf-8">
  <title>Story Transcript</title>
  <style>
    body{font:16px Georgia,serif; margin:32px; color:#222;}
    h1{font:700 22px system-ui,Segoe UI,Roboto,sans-serif}
    .meta{color:#555; margin-bottom:14px}
    p{line-height:1.55}
    em{color:#555}
  </style>
  <h1>Dwarven Deco Storyweaver — Transcript</h1>
  <div class="meta">Engine: ${Weaver.mode==='live'?'Live':'Local'} · Seed ${S.seed} · Turns ${S.turn}</div>
  ${Engine.state.storyBeats.map(b=>{
    const user = b.userText?`<em>${escapeHTML(b.userText)}</em> — `:''; 
    return `<p>${user}${escapeHTML(b.text)}</p>`;
  }).join('')}
  `;
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'storyweaver_transcript.html';
  a.click();
  URL.revokeObjectURL(url);
}
