// ============================================================
// Edge Middleware (Vercel) — cancello di accesso con password
// per l'intera app. Senza il cookie giusto, ogni richiesta
// riceve la pagina di login.
//
// SETUP (vedi docs/deploy.md):
//   1. Deploy del progetto su Vercel
//   2. Dashboard → Settings → Environment Variables →
//      APP_PASSWORD = la password che sceglierete voi due
//   3. Redeploy
//
// Note: questo file è usato SOLO da Vercel. In locale e su
// altri hosting viene ignorato. Icone e manifest restano
// pubblici (non contengono dati personali) per non rompere
// l'installazione su iOS.
// ============================================================
'use strict';

export const config = {
  // proteggi tutto tranne icone e manifest (nessun dato sensibile lì)
  matcher: '/((?!icons/|manifest\\.webmanifest).*)',
};

const COOKIE_NAME = 'dieta_gate';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 anno: si fa il login una volta per dispositivo

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// risposta "continua verso il file statico" (equivalente di next() di @vercel/edge)
function passThrough() {
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}

function loginPage(errore) {
  const html = '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
    '<title>Dieta 16:8 — Accesso</title>' +
    '<style>' +
    ':root{color-scheme:dark}' +
    'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
    'background:#0c0f14;color:#eef1f6;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}' +
    '.box{width:min(92vw,360px);background:#161a22;border:1px solid #272e3b;border-radius:18px;padding:28px 22px;text-align:center;}' +
    '.e{font-size:40px;margin-bottom:8px;}h1{font-size:20px;margin:0 0 6px;}' +
    'p{margin:0 0 18px;color:#9aa4b5;font-size:14px;line-height:1.5;}' +
    'input{width:100%;box-sizing:border-box;min-height:48px;padding:12px 14px;border-radius:12px;' +
    'border:1px solid #272e3b;background:#0c0f14;color:#eef1f6;font-size:16px;outline:none;}' +
    'input:focus{border-color:#f0a64a;}' +
    'button{width:100%;min-height:48px;margin-top:12px;border:none;border-radius:12px;' +
    'background:#f0a64a;color:#251604;font-size:16px;font-weight:700;cursor:pointer;}' +
    '.err{color:#f87171;font-size:13.5px;margin:10px 0 0;}' +
    '</style></head><body><div class="box">' +
    '<div class="e">🔐</div><h1>Dieta 16:8</h1>' +
    '<p>App privata. Inserisci la password per entrare.<br>Si fa una volta sola per dispositivo.</p>' +
    '<form method="POST" action="/__login">' +
    '<input type="password" name="pw" placeholder="Password" autofocus autocomplete="current-password" required>' +
    '<button type="submit">Entra</button>' +
    (errore ? '<p class="err">Password sbagliata, riprova.</p>' : '') +
    '</form></div></body></html>';
  return new Response(html, {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export default async function middleware(request) {
  const password = (typeof process !== 'undefined' && process.env && process.env.APP_PASSWORD) || '';
  if (!password) {
    return new Response('Configura la variabile APP_PASSWORD nelle impostazioni del progetto Vercel e fai un redeploy.', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  // il cookie contiene un hash della password (mai la password in chiaro)
  const expected = await sha256Hex(password + '|dieta-168-gate');
  const cookies = (request.headers.get('cookie') || '').split(/;\s*/);
  if (cookies.indexOf(COOKIE_NAME + '=' + expected) >= 0) {
    return passThrough(); // autorizzato
  }

  const url = new URL(request.url);

  // tentativo di login dal form
  if (request.method === 'POST' && url.pathname === '/__login') {
    let tentativo = '';
    try {
      const form = await request.formData();
      tentativo = String(form.get('pw') || '');
    } catch (e) { /* body non valido → resta vuoto */ }
    if (tentativo === password) {
      return new Response(null, {
        status: 303,
        headers: {
          'location': '/',
          'set-cookie': COOKIE_NAME + '=' + expected +
            '; Path=/; Max-Age=' + COOKIE_MAX_AGE + '; HttpOnly; Secure; SameSite=Lax',
        },
      });
    }
    return loginPage(true);
  }

  return loginPage(false);
}
