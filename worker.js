// ============================================================
// Cloudflare Worker — PWA "Dieta 16:8"
// - Proxy /api/coach -> NVIDIA build (integrate.api.nvidia.com)
//   (NVIDIA non supporta CORS dal browser: si passa di qui, stesso dominio)
// - Tutto il resto -> asset statici (binding ASSETS)
// La NVIDIA_API_KEY vive SOLO come secret del Worker (env), mai nel client.
// ============================================================

const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

// Modelli consentiti (whitelist). Qualsiasi altro -> 400.
const ALLOWED_MODELS = new Set([
  'moonshotai/kimi-k2.6',
  'z-ai/glm-5.1'
]);

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'content-type': 'application/json' }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ---- Endpoint coach: solo POST /api/coach ----
    if (url.pathname === '/api/coach') {
      if (request.method !== 'POST') {
        return json({ error: 'metodo non consentito' }, 405);
      }

      // Key mancante: errore chiaro e riconoscibile dal client.
      if (!env.NVIDIA_API_KEY) {
        return json({ error: 'NVIDIA_API_KEY non configurata nel Worker' }, 500);
      }

      // Parse del body.
      let payload;
      try {
        payload = await request.json();
      } catch (e) {
        return json({ error: 'body JSON non valido' }, 400);
      }

      // Validazione modello (whitelist).
      const model = payload && payload.model;
      if (!ALLOWED_MODELS.has(model)) {
        return json({ error: 'modello non consentito' }, 400);
      }

      // Validazione minimale messaggi.
      if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
        return json({ error: 'messages mancanti' }, 400);
      }

      // Body SANITIZZATO: solo i campi previsti, niente passthrough cieco.
      const sanitized = {
        model: model,
        messages: payload.messages,
        max_tokens: Number.isFinite(payload.max_tokens) ? payload.max_tokens : 1024,
        temperature: Number.isFinite(payload.temperature) ? payload.temperature : 0.3,
        stream: false
      };

      // Inoltro a NVIDIA.
      let upstream;
      try {
        upstream = await fetch(NVIDIA_URL, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.NVIDIA_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(sanitized)
        });
      } catch (e) {
        return json({ error: 'upstream non raggiungibile' }, 502);
      }

      const text = await upstream.text();

      // Se NVIDIA non risponde ok, inoltra status + testo come errore leggibile.
      if (!upstream.ok) {
        return json(
          { error: 'NVIDIA ' + upstream.status + ': ' + text },
          upstream.status
        );
      }

      // Passthrough del JSON di NVIDIA così com'è.
      return new Response(text, {
        status: upstream.status,
        headers: { 'content-type': 'application/json' }
      });
    }

    // ---- Asset statici: solo GET (e HEAD) ----
    if (request.method === 'GET' || request.method === 'HEAD') {
      return env.ASSETS.fetch(request);
    }

    return json({ error: 'metodo non consentito' }, 405);
  }
};
