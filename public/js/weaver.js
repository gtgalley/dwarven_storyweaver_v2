// public/js/weaver.js
// v0.5 — live/local bridge with reactive getters and persistence-friendly API.

export function makeWeaver(store, log, setTag){
  let mode = 'local';
  let endpoint = '/dm-turn';

  const api = {
    setMode(m){
      mode = (m === 'live') ? 'live' : 'local';
      setTag && setTag(mode==='live' ? 'Live' : 'Local');
    },
    setEndpoint(url){
      endpoint = url || '/dm-turn';
    },
    async turn(payload, localFallback){
      if (mode !== 'live') return localFallback(payload);
      try{
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      }catch(e){
        log && log(`Live DM error: ${e.message}. Falling back.`);
        api.setMode('local');
        return localFallback(payload);
      }
    }
  };

  // reactive getters so Weaver.mode / Weaver.endpoint reflect current values
  Object.defineProperty(api, 'mode',     { get: () => mode });
  Object.defineProperty(api, 'endpoint', { get: () => endpoint });

  return api;
}
