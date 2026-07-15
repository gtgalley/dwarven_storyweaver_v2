// public/js/weaver.js
// Minimal pass-through "weaver" with Live/Local switch.
// You can later plug your server endpoint at S.live.endpoint.

export function makeWeaver(store, log, setTag){
  async function turn(payload, local){
    const liveOn = store.get('dm_on', false);
    setTag(liveOn ? 'Live' : 'Local');

    if (!liveOn) return local(payload);

    try{
      const ep = store.get('dm_ep', '/dm-turn');
      const canon=payload?.canon_context;
      const requestBody=canon?{
        ...payload,
        narration_constraints:`Brassreach canon ${canon.canon_version}. ${canon.rules.join(' ')}`
      }:payload;
      const res = await fetch(ep, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(requestBody)
      });
      if(!res.ok) throw new Error('bad status');
      const data = await res.json();
      return data;
    }catch(err){
      log(`Live DM connection failed (${err?.message||'error'}). The local story engine will continue this turn.`);
      return local(payload);
    }
  }

  return { turn };
}
