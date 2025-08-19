// Minimal pass-through "weaver" with Live/Local switch.
// You can later plug your server endpoint at S.live.endpoint.

export function makeWeaver(store, log, setTag){
  async function turn(payload, local){
    const liveOn = store.get('dm_on', false);
    setTag(liveOn ? 'Live' : 'Local');

    if (!liveOn) return local(payload);

    try{
      const ep = store.get('dm_ep', '/dm-turn');
      const res = await fetch(ep, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error('bad status');
      const data = await res.json();
      return data;
    }catch(err){
      log(`Live DM failed (${err?.message||'error'}) — falling back to local.`);
      return local(payload);
    }
  }

  return { turn };
}
