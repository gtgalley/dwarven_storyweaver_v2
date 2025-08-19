// public/js/engine.js
// Stable build: rotating two choices (+ Continue), seals display, typewriter reveal,
// ambient bass + deep drums, wood-thunk click & up-chirp droplet, Settings modal,
// Live DM toggle (persisted), ESC/overlay to close modals.

import { makeWeaver } from './weaver.js';

/* ---------- utils ---------- */
const $ = (s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const modFrom=(s)=>Math.floor((s-10)/2);
const choice=a=>a[rnd(0,a.length-1)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}},del(k){try{localStorage.removeItem(k)}catch{}}};

/* ---------- state ---------- */
const Engine={ el:{}, state:{
  seed:rnd(1,9_999_999), turn:0, scene:'Halls',
  storyBeats:[], transcript:[],
  character:{ name:'Eldan', STR:12,DEX:14,INT:12,CHA:10, HP:14, Gold:5, inventory:['Torch','Canteen'] },
  flags:{ rumors:true, seals:[], bossReady:false, bossDealtWith:false },
  _choiceHistory:[], _lastChoices:[], settings:{ typewriter:true, cps:40, audio: {master:0.15,ui:0.2,amb:0.25,drums:0.25} },
  live:{ on:store.get('dm_on',false), endpoint:store.get('dm_ep','/dm-turn') }
}};

/* ---------- sound ---------- */
const Sound=(()=>{
  let ctx, master, ui, amb, drums;
  const ensure=()=>{ if(ctx) return; ctx=new (window.AudioContext||window.webkitAudioContext)(); master=ctx.createGain(); master.gain.value=Engine.state.settings.audio.master; master.connect(ctx.destination);
    ui=ctx.createGain(); ui.gain.value=Engine.state.settings.audio.ui; ui.connect(master);
    amb=ctx.createGain(); amb.gain.value=Engine.state.settings.audio.amb; amb.connect(master);
    drums=ctx.createGain(); drums.gain.value=Engine.state.settings.audio.drums; drums.connect(master);
    // bassline
    const b=ctx.createOscillator(); const bg=ctx.createGain(); b.type='sawtooth'; b.frequency.value=55; bg.gain.value=.02;
    const seq=[55,55,73.42,61.74,55,82.41,61.74,55]; let i=0;
    setInterval(()=>{ if(!ctx) return; b.frequency.linearRampToValueAtTime(seq[i%seq.length],ctx.currentTime+.3); i++; }, 1200);
    b.connect(bg).connect(amb); b.start();
    // deep drums
    setInterval(()=>{ if(!ctx) return; const t=ctx.currentTime; const o=ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(90,t); o.frequency.exponentialRampToValueAtTime(40,t+.35);
      const g=ctx.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.12,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.5);
      o.connect(g).connect(drums); o.start(t); o.stop(t+.55);
    }, 7000);
  };
  const setLevels=()=>{ if(!ctx) return; master.gain.value=Engine.state.settings.audio.master; ui.gain.value=Engine.state.settings.audio.ui; amb.gain.value=Engine.state.settings.audio.amb; drums.gain.value=Engine.state.settings.audio.drums; };
  const click=()=>{ ensure(); const t=ctx.currentTime; const o=ctx.createOscillator(); o.type='square'; o.frequency.setValueAtTime(340,t); o.frequency.exponentialRampToValueAtTime(120,t+.08);
    const g=ctx.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.25,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+.12);
    o.connect(g).connect(ui); o.start(t); o.stop(t+.14); };
  const drop=()=>{ ensure(); const t=ctx.currentTime; const o=ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(420,t); o.frequency.exponentialRampToValueAtTime(880,t+.09);
    const g=ctx.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.18,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+.16);
    o.connect(g).connect(ui); o.start(t); o.stop(t+.18); };
  const ambOn=()=>ensure();
  return {click,drop,ambOn,setLevels,ensure};
})();

/* ---------- weaver ---------- */
const Weaver = makeWeaver(store,
  (msg)=>Engine.state.storyBeats.push({text:`[log] ${msg}`}),
  (tag)=>{ const t=$('#engineTag'); if(t) t.textContent=Engine.state.live.on?'Live':'Local'; }
);

/* ---------- build UI ---------- */
export function boot(){
  buildUI();
  hydrate();
  bind();
  renderAll();
  if(!Engine.state.storyBeats.length) beginTale();
  Sound.ambOn();
}

/* ---------- DOM ---------- */
function buildUI(){
  document.body.innerHTML = `
  <div class="app">
    <div class="masthead">
      <div class="brand-title">Dwarven Deco Storyweaver</div>
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
          <button id="btnLive" class="btn">Live DM: <span id="liveTxt">Off</span></button>
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
        <div class="card"><h3>Character</h3><div id="charPanel"></div></div>
        <div class="card"><h3>Flags & Seals</h3><div id="flagPanel"></div></div>
        <div class="card"><h3>Session</h3><div>Seed: <span id="seedVal"></span></div><div>Turn: <span id="turnVal"></span></div><div>Scene: <span id="sceneVal"></span></div></div>
      </aside>
    </div>
  </div>

  <div id="shade" class="shade hidden"></div>

  <div id="modalEdit" class="modal hidden">
    <header><div>Edit Character</div><div id="xEdit" class="closeX">✕</div></header>
    <div class="content">
      <label>Name <input id="edName"></label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <label>STR <input id="edSTR" type="number" min="6" max="18"></label>
        <label>DEX <input id="edDEX" type="number" min="6" max="18"></label>
        <label>INT <input id="edINT" type="number" min="6" max="18"></label>
        <label>CHA <input id="edCHA" type="number" min="6" max="18"></label>
        <label>HP  <input id="edHP"  type="number" min="4" max="30"></label>
        <label>Gold<input id="edGold"type="number" min="0" max="999"></label>
      </div>
      <label>Inventory (comma separated) <input id="edInv"></label>
      <div style="display:flex;gap:8px;margin-top:6px">
        <button id="btnEditSave" class="btn gold">Save</button>
        <button id="btnEditCancel" class="btn">Cancel</button>
      </div>
    </div>
  </div>

  <div id="modalSet" class="modal hidden">
    <header><div>Settings</div><div id="xSet" class="closeX">✕</div></header>
    <div class="content">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <h4>Typewriter</h4>
          <label><input type="checkbox" id="twOn"> Enable</label><br>
          <label>Chars/sec <input type="number" id="twCps" min="10" max="120" step="5"></label>
        </div>
        <div>
          <h4>Audio</h4>
          <label>Master <input type="range" id="aMaster" min="0" max="0.6" step="0.01"></label><br>
          <label>UI <input type="range" id="aUi" min="0" max="0.6" step="0.01"></label><br>
          <label>Ambience <input type="range" id="aAmb" min="0" max="0.6" step="0.01"></label><br>
          <label>Drums <input type="range" id="aDrums" min="0" max="0.6" step="0.01"></label>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <label style="flex:1">Live DM endpoint <input id="dmEndpoint" placeholder="/dm-turn" /></label>
        <button id="btnLiveToggle" class="btn">Toggle Live DM</button>
      </div>
    </div>
  </div>
  `;

  // cache refs
  Engine.el.story=$('#story'); Engine.el.choiceList=$('#choices'); Engine.el.choicesBox=$('.choices');
  Engine.el.freeText=$('#freeText'); Engine.el.btnAct=$('#btnAct'); Engine.el.btnCont=$('#btnCont');
  Engine.el.charPanel=$('#charPanel'); Engine.el.flagPanel=$('#flagPanel');
  Engine.el.seedVal=$('#seedVal'); Engine.el.turnVal=$('#turnVal'); Engine.el.sceneVal=$('#sceneVal');
  Engine.el.btnEdit=$('#btnEdit'); Engine.el.btnAuto=$('#btnAuto'); Engine.el.btnBegin=$('#btnBegin'); Engine.el.btnEnd=$('#btnEnd');
  Engine.el.btnUndo=$('#btnUndo'); Engine.el.btnSave=$('#btnSave'); Engine.el.btnLoad=$('#btnLoad'); Engine.el.btnExport=$('#btnExport');
  Engine.el.btnLive=$('#btnLive'); Engine.el.liveTxt=$('#liveTxt'); Engine.el.btnSettings=$('#btnSettings');
  Engine.el.shade=$('#shade');
  Engine.el.modalEdit=$('#modalEdit'); Engine.el.xEdit=$('#xEdit');
  Engine.el.edName=$('#edName'); Engine.el.edSTR=$('#edSTR'); Engine.el.edDEX=$('#edDEX'); Engine.el.edINT=$('#edINT'); Engine.el.edCHA=$('#edCHA'); Engine.el.edHP=$('#edHP'); Engine.el.edGold=$('#edGold'); Engine.el.edInv=$('#edInv');
  Engine.el.btnEditSave=$('#btnEditSave'); Engine.el.btnEditCancel=$('#btnEditCancel');
  Engine.el.modalSet=$('#modalSet'); Engine.el.xSet=$('#xSet'); Engine.el.twOn=$('#twOn'); Engine.el.twCps=$('#twCps');
  Engine.el.aMaster=$('#aMaster'); Engine.el.aUi=$('#aUi'); Engine.el.aAmb=$('#aAmb'); Engine.el.aDrums=$('#aDrums');
  Engine.el.dmEndpoint=$('#dmEndpoint'); Engine.el.btnLiveToggle=$('#btnLiveToggle');
}

function hydrate(){
  const s=store.get('dds_state',null); if(s) Engine.state=s;
}

function bind(){
  const S=Engine.state;
  const modalOpen=m=>{ Engine.el.shade.classList.remove('hidden'); m.classList.remove('hidden'); };
  const modalClose=m=>{ m.classList.add('hidden'); Engine.el.shade.classList.add('hidden'); };

  Engine.el.btnEdit.onclick=()=>{ const C=S.character;
    Engine.el.edName.value=C.name; Engine.el.edSTR.value=C.STR; Engine.el.edDEX.value=C.DEX; Engine.el.edINT.value=C.INT; Engine.el.edCHA.value=C.CHA; Engine.el.edHP.value=C.HP; Engine.el.edGold.value=C.Gold; Engine.el.edInv.value=C.inventory.join(', ');
    modalOpen(Engine.el.modalEdit); };
  Engine.el.btnEditSave.onclick=()=>{ const C=S.character; C.name=Engine.el.edName.value||C.name; C.STR=+Engine.el.edSTR.value||C.STR; C.DEX=+Engine.el.edDEX.value||C.DEX; C.INT=+Engine.el.edINT.value||C.INT; C.CHA=+Engine.el.edCHA.value||C.CHA; C.HP=+Engine.el.edHP.value||C.HP; C.Gold=+Engine.el.edGold.value||C.Gold;
    C.inventory=Engine.el.edInv.value.split(',').map(x=>x.trim()).filter(Boolean); modalClose(Engine.el.modalEdit); renderAll(); };
  Engine.el.btnEditCancel.onclick=()=>modalClose(Engine.el.modalEdit);

  Engine.el.btnSettings.onclick=()=>{ Engine.el.twOn.checked=S.settings.typewriter; Engine.el.twCps.value=S.settings.cps;
    Engine.el.aMaster.value=S.settings.audio.master; Engine.el.aUi.value=S.settings.audio.ui; Engine.el.aAmb.value=S.settings.audio.amb; Engine.el.aDrums.value=S.settings.audio.drums;
    Engine.el.dmEndpoint.value=S.live.endpoint; Engine.el.btnLiveToggle.textContent=S.live.on?'Turn Live DM Off':'Turn Live DM On';
    modalOpen(Engine.el.modalSet); };
  Engine.el.xSet.onclick=()=>modalClose(Engine.el.modalSet);
  Engine.el.twOn.onchange=()=>{S.settings.typewriter=Engine.el.twOn.checked; store.set('dds_state',S);};
  Engine.el.twCps.onchange=()=>{S.settings.cps=clamp(+Engine.el.twCps.value||40,10,120); store.set('dds_state',S);};
  [Engine.el.aMaster,Engine.el.aUi,Engine.el.aAmb,Engine.el.aDrums].forEach(sl=>sl.oninput=()=>{S.settings.audio.master=+Engine.el.aMaster.value; S.settings.audio.ui=+Engine.el.aUi.value; S.settings.audio.amb=+Engine.el.aAmb.value; S.settings.audio.drums=+Engine.el.aDrums.value; Sound.setLevels(); store.set('dds_state',S);});
  Engine.el.dmEndpoint.onchange=()=>{S.live.endpoint=Engine.el.dmEndpoint.value.trim()||'/dm-turn'; store.set('dm_ep',S.live.endpoint);};
  Engine.el.btnLiveToggle.onclick=()=>{ S.live.on=!S.live.on; store.set('dm_on',S.live.on); Engine.el.liveTxt.textContent=S.live.on?'On':'Off'; };
  Engine.el.shade.onclick=()=>{ [Engine.el.modalEdit,Engine.el.modalSet].forEach(m=>m.classList.add('hidden')); Engine.el.shade.classList.add('hidden'); };
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') Engine.el.shade.onclick(); });

  Engine.el.btnAuto.onclick=autoGen;
  Engine.el.btnBegin.onclick=beginTale;
  Engine.el.btnEnd.onclick=endTale;
  Engine.el.btnUndo.onclick=undoTurn;
  Engine.el.btnSave.onclick=()=>{ store.set('dds_state',S); toast('Saved'); };
  Engine.el.btnLoad.onclick=()=>{ const s=store.get('dds_state',null); if(s){ Engine.state=s; renderAll(); toast('Loaded'); }};
  Engine.el.btnExport.onclick=exportTranscript;
  Engine.el.btnAct.onclick=()=>freeText();
  Engine.el.freeText.addEventListener('keydown',e=>{ if(e.key==='Enter') freeText(); });
  Engine.el.btnCont.onclick=()=>doNarrate({ sentence:'Continue — the camera lingers; time moves.' });
}

function renderAll(){
  const s=Engine.state, C=s.character, F=s.flags;
  $('#seedVal').textContent=s.seed; $('#turnVal').textContent=s.turn; $('#sceneVal').textContent=s.scene;
  Engine.el.liveTxt.textContent=s.live.on?'On':'Off';

  Engine.el.charPanel.innerHTML = `
    <div><b>${esc(C.name)}</b></div>
    <div>STR ${C.STR} (${fmt(modFrom(C.STR))}) — DEX ${C.DEX} (${fmt(modFrom(C.DEX))})</div>
    <div>INT ${C.INT} (${fmt(modFrom(C.INT))}) — CHA ${C.CHA} (${fmt(modFrom(C.CHA))})</div>
    <div>HP ${C.HP} — Gold ${C.Gold}</div>
    <div>Bag: ${C.inventory.join(', ')||'—'}</div>`;

  Engine.el.flagPanel.innerHTML = `
    <div>Rumors heard: ${F.rumors?'yes':'no'}</div>
    <div>Seals: ${F.seals.join(', ')||'—'}</div>
    <div>Gate ready: ${F.bossReady?'yes':'no'}</div>
    <div>Unfathomer dealt with: ${F.bossDealtWith?'yes':'no'}</div>`;

  Engine.el.story.innerHTML='';
  for(const beat of s.storyBeats){
    const p=document.createElement('p');
    p.innerHTML=beat.html?beat.html:esc(beat.text);
    if(beat.roll){ const g=document.createElement('span'); g.className='rollglyph'; g.textContent=' ⟡'; g.title=beat.roll; p.appendChild(g); }
    if(beat.kind==='success') p.classList.add('glow-success');
    if(beat.kind==='fail') p.classList.add('glow-fail');
    Engine.el.story.appendChild(p);
  }
  Engine.el.story.scrollTop=Engine.el.story.scrollHeight;
}

/* ---------- flow ---------- */
function beginTale(){
  const S=Engine.state;
  S.turn=0; S.scene='Halls'; S.storyBeats=[]; S.transcript=[]; S._choiceHistory=[]; S._lastChoices=[];
  S.flags={rumors:true,seals:[],bossReady:false,bossDealtWith:false};
  appendBeat("Lanterns throw steady light across carved lintels and iron mosaics. Word passes of a slow, otherworldly tide called the Unfathomer, pooling in the buried cisterns. You wait at the mouth of the Halls, where corridors open like patient books.");
  renderChoices(makeChoiceSet(S.scene));
  S.turn++; renderAll();
}

function endTale(){
  const S=Engine.state, C=S.character;
  const ep = `Epilogue — You carry ${C.Gold} gold and ${C.inventory.length} keepsakes. Seals gained: ${S.flags.seals.join(', ')||'none'}. ` +
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
  const history=Engine.state._choiceHistory;
  const pool=[...choices];
  const fresh=pool.filter(c=>!history.includes(c.id));
  let picked=[];
  if(fresh.length){ picked.push(choice(fresh)); const rest=pool.filter(c=>c.id!==picked[0].id); picked.push(choice(rest)); }
  else { picked=[choice(pool), choice(pool.filter(c=>c.id!==picked[0]?.id||true))]; }
  history.push(...picked.map(c=>c.id)); while(history.length>8) history.shift();
  const prev=Engine.state._lastChoices||[]; if(picked.map(c=>c.sentence).join('|')===prev.join('|')) picked = modulateChoices(picked);
  Engine.state._lastChoices=picked.map(c=>c.sentence);

  list.innerHTML='';
  picked.forEach(ch=>{
    const btn=document.createElement('button'); btn.className='choice-btn'; btn.textContent=ch.sentence;
    btn.onclick=()=>{ Sound.click(); resolveChoice(ch); };
    btn.addEventListener('mouseenter',()=>Sound.drop(),{once:false});
    list.appendChild(btn);
  });
}

function modulateChoices(arr){
  const suffix=[' — carefully',' — quickly',' — with a steady breath',' — in a roundabout way'];
  return arr.map(c=>({ ...c, sentence: c.sentence.replace(/\s+—.*$/,'') + suffix[rnd(0,suffix.length-1)] }));
}

function freeText(){
  const text=(Engine.el.freeText.value||'').trim(); if(!text) return;
  Engine.el.freeText.value='';
  const italic=`<em>${esc(text)}</em>`;
  doNarrate({ sentence:`${italic} — then the scene follows…` });
}

function doNarrate(ch){
  const payload={ action:ch.sentence, source:'narrate', stat:null, dc:null, passed:null, game_state:snapshotState(), history:recentHistory() };
  Promise.resolve(Weaver.turn(payload, localTurn)).then(resp=>applyTurn(resp,null)).catch(()=>applyTurn(localTurn(payload),null));
}

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
  if(resp?.scene) S.scene=resp.scene;
  if(!S.flags.bossReady && S.flags.seals.length>=2) S.flags.bossReady=true;

  const kind = roll ? (roll.total>=roll.dc ? 'success':'fail') : null;
  const html = resp?.story_paragraph_html || null;
  appendBeat(resp?.story_paragraph || '(silence)', roll?`d20 ${roll.r} ${fmt(roll.mod)} vs DC ${roll.dc} ⇒ ${roll.total}`:null, kind, html);

  const next = (resp?.next_choices && resp.next_choices.length) ? resp.next_choices : makeChoiceSet(S.scene);
  renderChoices(next);
  S.turn++; renderAll();
}

/* ---------- local DM ---------- */
function localTurn(payload){
  const {action,passed,stat,game_state}=payload; const S=game_state; const seals=S.flags.seals||[]; const have=new Set(seals);
  let award=null; if(passed && have.size<3 && rnd(1,6)===1){ const pool=['Brass','Echo','Stone'].filter(x=>!have.has(x)); if(pool.length) award=choice(pool); }
  const text = makeBeat(action, passed, stat, award);
  const flags_patch={}; if(award) flags_patch.seals=[...seals, award];
  return { story_paragraph:text, flags_patch, inventory_delta:{add:[],remove:[]}, gold_delta:0, next_choices: makeChoiceSet(S.scene) };
}

function makeBeat(action,passed,stat,award){
  const s = action.replace(/<[^>]+>/g,''); // strip any italics html from choice sentence
  const success={STR:"You shoulder through.", DEX:"You move with quiet balance.", INT:"You reason through the pattern.", CHA:"You speak with steady poise."}[stat||'INT'];
  const fail={STR:"The metal complains and does not yield.", DEX:"A heel kisses grit; someone listens.", INT:"Two claims cancel; your guess goes wide.", CHA:"Your tone misfires; the window closes for now."}[stat||'INT'];
  const tag = passed ? success : fail;
  const seal = award ? ` A sigil warms at your wrist — the Seal of ${award}.` : "";
  const rumor = " Rumors still point downward; the cisterns hold the clearer answer.";
  return `${s} ${tag}${seal}${rumor}`;
}

/* ---------- choice pools ---------- */
function makeChoiceSet(scene){
  const sets={
    Halls:[
      {id:'h-int', sentence:'Read the cadence of the tide around the pillars — carefully (INT)', stat:'INT'},
      {id:'h-str', sentence:'Hold your ground when the water swells — carefully (STR)', stat:'STR'},
      {id:'h-cha', sentence:'Talk the clerk into showing restricted volumes (CHA)', stat:'CHA'},
      {id:'h-dex', sentence:'Crosscheck culvert maps and margin notes (DEX)', stat:'DEX'}
    ],
    Depths:[
      {id:'d-str', sentence:'Brace against the gate and force it half-wide (STR)', stat:'STR'},
      {id:'d-int', sentence:'Read the tide’s cadence for a safe rhythm (INT)', stat:'INT'},
      {id:'d-cha', sentence:'Name what it wants and speak plainly (CHA)', stat:'CHA'}
    ],
    Archives:[
      {id:'a-int', sentence:'Study the ledger marks for a shipping pattern (INT)', stat:'INT'},
      {id:'a-dex', sentence:'Climb to the high stacks, lightly (DEX)', stat:'DEX'}
    ]
  };
  return (sets[scene]||sets.Halls).slice(0); // copy
}

/* ---------- helpers ---------- */
function appendBeat(text, roll, kind=null, html=null){
  const entry = html ? {html, roll, kind} : {text, roll, kind};
  Engine.state.storyBeats.push(entry); Engine.state.transcript.push(html?strip(html):text);
  // typewriter reveal
  if(Engine.state.settings.typewriter){
    const p=Engine.el.story.lastElementChild; if(p){ const t=p.textContent; p.textContent=''; p.classList.add('reveal');
      const cps=Engine.state.settings.cps; let i=0;
      const cursor=document.createElement('span'); cursor.className='cursor'; p.appendChild(cursor);
      const tick=()=>{ const step=Math.max(1,Math.round(cps/10)); for(let k=0;k<step;k++){ if(i>=t.length){ cursor.remove(); return; }
          const span=document.createElement('span'); span.className='ch on'; span.textContent=t[i++]; p.insertBefore(span,cursor);
          if(/[\.!\?]/.test(span.textContent)) break; }
        cursor.innerHTML='<span class="smoke"></span>'; setTimeout(tick, 1000/Math.max(10,cps)); };
      tick();
    }
  }
}
function snapshotState(){ const S=Engine.state; return {character:S.character, flags:S.flags, scene:S.scene, turn:S.turn}; }
function recentHistory(){ const T=Engine.state.transcript; return T.slice(Math.max(0,T.length-10)); }
function fmt(n){ return (n>=0?'+':'')+n; }
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[c])); }
function strip(html){ const d=document.createElement('div'); d.innerHTML=html; return d.textContent||''; }
function autoGen(){ const n=['Eldan','Brassa','Keled','Varek','Moriah','Thrain','Ysolda','Kael']; const C=Engine.state.character;
  C.name=choice(n); C.STR=rnd(8,18); C.DEX=rnd(8,18); C.INT=rnd(8,18); C.CHA=rnd(8,18); C.HP=rnd(8,20); C.Gold=rnd(0,25); C.inventory=['Torch','Canteen','Oil Flask'].slice(0,rnd(1,3)); renderAll(); }
function toast(txt){ const t=document.createElement('div'); t.textContent=txt; Object.assign(t.style,{position:'fixed',bottom:'14px',left:'14px',background:'#1e1e28',color:'#fff',padding:'8px 10px',border:'1px solid #3a3a48',borderRadius:'6px',opacity:'0.96',zIndex:9999}); document.body.appendChild(t); setTimeout(()=>t.remove(),1200); }
function exportTranscript(){ const S=Engine.state; const html=`<!doctype html><meta charset="utf-8"><title>Story Transcript</title><style>body{font:16px Georgia,serif;margin:32px;color:#222}h1{font:700 22px system-ui,Segoe UI,Roboto,sans-serif}.meta{color:#555;margin-bottom:14px}p{line-height:1.55}</style><h1>Dwarven Deco Storyweaver — Transcript</h1><div class="meta">Engine: ${S.live.on?'Live':'Local'} · Seed ${S.seed} · Turns ${S.turn}</div>${S.transcript.map(t=>`<p>${esc(t)}</p>`).join('')}`; const blob=new Blob([html],{type:'text/html'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='storyweaver_transcript.html'; a.click(); URL.revokeObjectURL(url); }
