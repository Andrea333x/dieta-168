# 🚀 Guida deploy — hosting privato e protetto

L'app contiene **dati sanitari personali** (condizioni cliniche, farmaci, dieta). Regole d'oro:

1. **Mai** caricarla su un hosting pubblico senza protezione: un URL "nascosto" NON è sicurezza.
2. Se usi Git, la **repository deve essere PRIVATA**.
3. La protezione deve stare **davanti a tutti i file** (anche `js/data/diet.js` contiene i dati).

Qui sotto: prima il **setup reale in produzione** (quello live), poi le alternative storiche.

---

## ✅ Setup ATTUALE in produzione (canonico)
> Questo è ciò che è configurato e funziona oggi. Le "Opzioni A/B/C" più sotto sono alternative storiche, tenute come riferimento.

- **Hosting**: Cloudflare **Worker** (non Pages) collegato alla **repo GitHub privata** `dieta-168`. `worker.js` serve la PWA come sito statico **e** fa da proxy `/api/coach` per il coach AI. Config in `wrangler.jsonc` (`main: worker.js`, binding asset `ASSETS`).
- **Aggiornamenti**: ogni `git push` su `main` → Cloudflare ribuilda con **deploy command `npx wrangler deploy`** (build command vuoto). Nessun upload manuale.
- **Dominio**: dominio custom **`https://dieta333ai.uk`** (Cloudflare Registrar, a costo). `*.workers.dev` e i preview URL sono **spenti** (`workers_dev:false`, `preview_urls:false`).
- **Login (la protezione vera)**: Cloudflare **Zero Trust → Access**, applicazione self-hosted sull'host `dieta333ai.uk`, policy **Allow → Emails** (le due email della coppia), **One-time PIN**, sessione **1 mese**.
- **`.assetsignore`**: esclude dai file *serviti* `worker.js`, la config e **tutti i `.md`** (i documenti con dettagli clinici non sono scaricabili).
- **Coach AI**: secret Worker **`NVIDIA_API_KEY`** (vedi sezione dedicata sotto), modelli Kimi K2.6 / GLM-5.1 via proxy.

### Rifare il setup da zero (promemoria)
1. Repo GitHub **privata** → `git push`.
2. Cloudflare → **Workers & Pages → Create**: collega la repo. Deploy command `npx wrangler deploy`, build command vuoto.
3. (Opzionale) **Custom Domain** sul Worker: con Cloudflare Registrar compra un dominio a costo → Worker → Settings → Domains & Routes → **Add Custom Domain**.
4. **Zero Trust → Access → Applications → Add** (Self-hosted / Workers): host = il dominio, policy **Allow → Emails** (le due), **One-time PIN**.
5. Imposta il secret **`NVIDIA_API_KEY`** (Worker → Settings → Variables and Secrets — possibile **solo dopo** che il Worker ha `worker.js`, cioè dopo il primo push del proxy).
6. Installa la PWA su iPhone via Safari → login → **Aggiungi a Home**.

> ⚠️ **Ogni volta che cambi l'URL/dominio**: ri-aggiungi l'host in **Access** (un dominio nuovo NON eredita il login → resterebbe pubblico) **e reinstalla** la PWA sui telefoni (l'icona vecchia punta all'URL morto).

---

## 📦 Alternative storiche (riferimento)

## ⭐ Opzione A — Cloudflare Pages + Cloudflare Access

**Login vero per persone specifiche**: tu e lei entrate con la vostra email (codice OTP via mail). Nessuno fuori dalla lista entra, neanche conoscendo l'URL. **Gratis** (Access è free fino a 50 utenti).

### Passi
1. **Account**: crea un account su [dash.cloudflare.com](https://dash.cloudflare.com) (gratuito).
2. **Carica l'app**: menu **Workers & Pages → Create → Pages → Upload assets** (drag & drop della cartella `dieta ai`, escludi pure i file `.md` di docs se vuoi). Dai un nome al progetto, es. `dieta-168`. Ottieni un URL tipo `https://dieta-168.pages.dev`.
   - In alternativa collega una repo GitHub **privata** (deploy automatico a ogni push).
3. **Proteggi con Access**: dalla dashboard → **Zero Trust** (richiede di scegliere un nome team, piano Free) → **Access → Applications → Add an application → Self-hosted**:
   - *Application name*: Dieta 16:8
   - *Application domain*: `dieta-168.pages.dev` (path vuoto = tutto protetto)
   - *Session Duration*: **1 mese** (così il login si ripete raramente)
   - *Policy*: Action **Allow** → Include → **Emails** → inserisci la tua email e la sua (solo queste due).
   - Login method: lascia **One-time PIN** (codice via email, zero configurazione).
4. **Blocca l'accesso diretto a Pages*** *(consigliato)*: in Zero Trust → Access → Applications, verifica che l'app copra anche `*.dieta-168.pages.dev` (i deploy di anteprima hanno sottodomini propri).
5. **Test**: apri l'URL da una finestra in incognito → deve chiedere l'email → codice → app visibile. Con un'email non in lista deve rifiutare.

### Installazione su iPhone con Access
1. Apri l'URL in **Safari**, fai il login OTP.
2. **Condividi → Aggiungi a schermata Home**.
3. L'app funziona normalmente; quando la sessione scade (1 mese) ricompare la pagina di login Access: rifai l'OTP e torna tutto come prima. I dati locali (spunte, chat, API key) **non si perdono**: vivono nel dispositivo.

---

## 🔑 Opzione B — Vercel + password condivisa (file già pronto)

Nel progetto c'è già **`middleware.js`**: un cancello che chiede una password (una sola, condivisa tra voi due) prima di servire qualunque file. Il cookie dura 1 anno: si fa il login una volta per dispositivo. Gratis sul piano Hobby.

### Passi
1. **Account**: [vercel.com](https://vercel.com) → Sign up (gratuito).
2. **Deploy** (due strade):
   - **Da terminale** (più semplice, niente Git): apri PowerShell nella cartella e lancia:
     ```powershell
     npx vercel
     ```
     Rispondi alle domande (login via email, nome progetto, conferme con Invio). Per pubblicare in produzione: `npx vercel --prod`.
   - **Da Git**: pusha la cartella su una repo GitHub **PRIVATA** → vercel.com → Add New → Project → importa la repo → Framework preset: **Other** → Deploy.
3. **Imposta la password**: dashboard Vercel → progetto → **Settings → Environment Variables**:
   - Name: `APP_PASSWORD` · Value: la password che scegliete · Environment: Production
4. **Redeploy** (Deployments → ⋯ → Redeploy, oppure `npx vercel --prod` di nuovo).
5. **Test**: apri l'URL in incognito → pagina 🔐 → password giusta entra, sbagliata no.

### Note
- La password viene confrontata sul server (edge); nel browser resta solo un cookie con un hash, mai la password.
- Icone e manifest restano pubblici (nessun dato personale lì) per non rompere l'installazione iOS.
- Differenza con l'Opzione A: qui la password è **unica e condivisa** — se la dai a qualcuno, entra. Con Cloudflare Access l'accesso è **per email specifica** e revocabile a persona.

---

## ⚠️ Opzione C — GitHub Pages: NON adatta

GitHub Pages **non supporta alcuna protezione** sul piano gratuito (e nemmeno su Pro): anche con repository privata, il sito pubblicato è **pubblico per chiunque abbia l'URL**. Il controllo accessi su Pages esiste solo su GitHub Enterprise Cloud.

→ Per quest'app **non usare GitHub Pages**. GitHub va benissimo come **repository privata** che alimenta Cloudflare Pages o Vercel (opzioni A e B).

---

## 🗄️ E Supabase?

Supabase non è un hosting di siti statici: è un backend (database, autenticazione, storage). Non è lo strumento giusto per *pubblicare* questa PWA.

Dove tornerà utile: se in futuro vorrete la **sincronizzazione dei dati tra i vostri due iPhone** (spunte condivise, recap unico), Supabase è il candidato ideale come backend con login — è già segnato nella ROADMAP come idea v1.1+.

---

## Confronto rapido

| | Cloudflare Pages + Access (A) | Vercel + password (B) | GitHub Pages (C) |
|---|---|---|---|
| Costo | Gratis | Gratis | Gratis |
| Tipo protezione | Login per email specifica (OTP) | Password unica condivisa | ❌ Nessuna |
| Revoca a persona | ✅ Sì | ❌ No (cambi password per tutti) | — |
| Setup | ~15 min | ~10 min | — |
| PWA iOS | ✅ (rilogin ~mensile) | ✅ (login 1 volta/anno per dispositivo) | — |
| Adatta a dati sanitari | ✅✅ | ✅ | ❌ |

**Raccomandazione**: Opzione **A** se vuoi la sicurezza migliore, Opzione **B** se vuoi fare prima e una password condivisa vi basta.

---

## Test in locale sul PC (senza deploy)

**Doppio click su `serve.cmd`** nella cartella del progetto: apre il browser su `http://localhost:8080` da solo. Chiudi la finestra nera per fermare il server.

Se preferisci il comando manuale, l'errore più comune è lanciarlo dalla cartella sbagliata. Fai così:

```powershell
cd "C:\Users\Andrea\Desktop\dieta ai"   # PRIMA entra nella cartella (virgolette: il nome ha uno spazio)
py -m http.server 8080                  # oppure: python -m http.server 8080
```

Poi apri `http://localhost:8080` nel browser. Se dice "porta occupata", usa un altro numero (es. 8081). In locale il middleware Vercel non è attivo: nessuna password, ma sei solo tu sul tuo PC.

---

## 🤖 Coach AI — chiave NVIDIA (secret del Worker)

Da v1.3.0 il coach usa i modelli **Kimi K2.6 / GLM-5.1** via NVIDIA build, attraverso un proxy nel
Worker (`worker.js`, rotta `/api/coach`). La chiave **non** va nel codice né sul telefono: è un
**secret del Worker**.

1. Prendi una API key su **build.nvidia.com** (formato `nvapi-…`). Consiglio: impostaci un limite di spesa.
2. Imposta il secret (una volta sola), in uno dei due modi:
   - **Dashboard**: Cloudflare → il tuo Worker `dieta-168` → **Settings → Variables and Secrets → Add → Secret** → Name `NVIDIA_API_KEY`, Value `nvapi-…` → Save.
   - **Terminale**: dalla cartella del progetto → `npx wrangler secret put NVIDIA_API_KEY` → incolla la chiave.
3. Il coach funziona subito (il proxy legge `env.NVIDIA_API_KEY`). Se manca, l'app mostra
   "⚠️ Coach non ancora configurato (manca NVIDIA_API_KEY nel Worker)".

Il proxy è **dietro Cloudflare Access**: solo gli utenti autorizzati possono usarlo, quindi la chiave
non è sfruttabile da estranei. La key non compare mai nel repo, nei backup o nel browser.

## Promemoria sicurezza
- La **API key Anthropic** resta nel localStorage del dispositivo e non è mai nei backup esportati né nei file deployati.
- A ogni modifica dei file dell'app prima di un nuovo deploy: **bump di `CACHE` in `sw.js`** (vedi README).
- Se un giorno l'URL o la password "scappano": Opzione A → rimuovi l'email/ruota la policy; Opzione B → cambia `APP_PASSWORD` e redeploy (tutti i dispositivi dovranno rifare il login).
