// public/js/weaver.js
// Minimal live/local weaver bridge (no placeholders).
export function makeWeaver(store, log, setTag){
  let mode = store.get('dm_mode','local'); // 'local' | 'live'
  let endpoint = store.get('dm_ep','/dm-turn');

  function setMode(m){
    mode = m;
    store.set('dm_mode', mode);
    setTag && setTag(mode==='live' ? 'Live' : 'Local');
  }
  function setEndpoint(u){
    endpoint = u || '/dm-turn';
    store.set('dm_ep', endpoint);
  }

  async function turn(payload, fallback){
    if (mode !== 'live') return fallback(payload);
    try{
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('live endpoint returned '+res.status);
      return await res.json();
    }catch(err){
      log && log('live DM error: '+err.message);
      return fallback(payload);
    }
  }

  return { mode, endpoint, setMode, setEndpoint, turn };
}
