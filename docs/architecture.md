# Architettura & Procedure — Dieta AI

> Documentazione tecnica della PWA. Aggiornata a **v1.2.0 (2026-06-14)**.
> Per i vincoli clinici e i ruoli orchestratore/subagent vedi `ORCHESTRATOR.md`.
> Per i razionali clinici delle feature vedi `docs/research.md`.

---

## 1. Principi architetturali (non negoziabili)
- **PWA statica vanilla**: HTML + CSS + JS puro, **zero build step**, **zero dipendenze di rete/runtime**.
- **Offline-first**: service worker (`sw.js`) network-first con fallback cache; tutti i dati embedded in JS.
- **Privacy locale**: ogni dato utente (spunte, diario, cronologia chat) vive solo in `localStorage` sul dispositivo. L'unica logica server è il **proxy `/api/coach`** dentro lo stesso Worker che ospita l'app (`worker.js`): inoltra le richieste del coach a NVIDIA tenendo la key lato server (`NVIDIA_API_KEY`). Non è un backend dati: non persiste nulla, è solo un passaggio necessario perché NVIDIA non accetta chiamate dirette dal browser (CORS). Tutto è dietro Cloudflare Access.
- **Mobile-first iOS**: installabile via Safari → "Aggiungi a schermata Home"; safe-area, dark-first.
- **Dati sanitari**: l'app va pubblicata **solo dietro accesso protetto** (vedi `docs/deploy.md`).

## 2. Mappa dei file
```
index.html              shell: header (persona/tema/menu), <section> per tab, tabbar, sheet modale
manifest.webmanifest    PWA manifest (display standalone, id, icone, maskable)
sw.js                   service worker — costante CACHE da bumpare a ogni release
middleware.js           cancello password per Vercel (Edge) — alternativa a Cloudflare Access
serve.cmd               server locale di test (doppio click → http://localhost:8080)
css/app.css             design system (token :root + theme-light) e stili componenti
js/app.js               cuore app: router tab, render, tracking, Diario, eventi (IIFE, 'use strict')
js/assistant.js         tab AI (window.AssistantTab) — coach via POST /api/coach (formato OpenAI)
worker.js               Worker Cloudflare: serve gli asset + proxy /api/coach → NVIDIA (key = secret NVIDIA_API_KEY)
wrangler.jsonc          config deploy Worker (main=worker.js, binding asset ASSETS)
.assetsignore           file NON serviti come sito (worker.js, config, *.md con dettagli clinici)
js/data/diet.js         window.DIET_DATA — piano, porzioni, integratori, spesa, meal prep, biohacking
js/data/recipes.js      window.RECIPES — 43 ricette con filtri
js/data/tips.js         window.TIPS — 42 tips in 10 categorie
icons/                  icon-180/192/512 PNG per iOS
docs/                   deploy.md · research.md · architecture.md (questo file)
README · CHANGELOG · ROADMAP · ORCHESTRATOR.md
```
Ordine di caricamento script (in `index.html`): `diet.js → recipes.js → tips.js → assistant.js → app.js`.
I file dati espongono globali (`DIET_DATA`, `RECIPES`, `TIPS`); `app.js` li legge con fallback (`window.X || ...`).

## 3. Sistema di render
- `app.js` è una **IIFE** unica: tutte le funzioni e lo stato sono privati (niente leak nel global).
- Una `<section id="tab-NOME">` per tab; solo quella con classe `.active` è visibile.
- `RENDERERS = { oggi, settimana, ricette, tips, prep, spesa, diario }` mappa tab → funzione di render.
- `TABS` elenca le tab tracciate da `dirty{}` (lazy re-render: si rirenderizza solo se "sporca").
- `showTab(id)` attiva la section, aggiorna la tabbar, monta l'AI al primo accesso, scrolla in alto.
- **Pattern di render**: ogni `renderX()` costruisce `innerHTML` con concatenazione di stringhe. **Tutto l'input
  dinamico passa da `esc()`** (escape HTML anti-XSS). Mai inserire testo non-escapato nell'HTML.
- **Aggiornamento in-place (v1.2.0)**: dopo una spunta NON si rifà tutto il render. In Oggi si togglea il bottone
  toccato (`.on`/`aria-pressed`) e si chiama `updateOggiProgress()` che sostituisce solo `#oggi-ring` e `#oggi-recap`;
  in Spesa `updateSpesaProgress(catSlug)` aggiorna solo `#spesa-bar`, `#spesa-count` e la `.cat-count[data-cat]`
  (eccezione: con `spesaHide` attivo si rifà il render completo perché l'item spuntato deve sparire).
- **Componenti UI di sistema (v1.2.0)**: `toast(msg, kind)` → `#toast` (`role=status`/`aria-live`, auto-dismiss),
  usato da `setState` sul fallimento quota; `#update-banner` (azione `reload-app`) mostrato su `controllerchange`
  solo se esisteva già un controller (aggiornamento, non prima installazione).
- La tab **AI** non è in `RENDERERS`: è montata da `window.AssistantTab.mount(el)` (contratto in `assistant.js`).

## 4. Gestione eventi (event delegation)
Un solo `document.addEventListener('click', …)` con `e.target.closest('[data-*]')`. I `data-*` attivi:

| Attributo | Azione |
|---|---|
| `data-tab` | cambia tab · `data-p` | cambia persona · `data-action` | azioni menu/sheet (`go:`, `theme:`, `export`, `import`, `spesa-hide`, `reset-spesa`, `reset-prep`, `close-sheet`, `reload-app`) |
| `data-track` | toggle spunta pasto/integratore/routine (Oggi) |
| `data-spesa` / `data-prep` | toggle checklist spesa / meal prep |
| `data-day` | giorno in Settimana · `data-recipe` | apre ricetta · `data-filter` | filtro ricette (`group:val`) |
| `data-tipcat` / `data-tipper` | filtri Tips |
| `data-fav` | toggle preferito ricetta (sta dentro la card: `closest` lo intercetta **prima** di `data-recipe`, così la stella non apre la ricetta) |
| `data-mood` (`per:val`) · `data-water` (`per:±1`) · `data-wsave` · `data-cycle-save` · `data-note-add` · `data-note-del` | controlli Diario/Oggi |

Input testuali via `input`/`change`: `#ricette-q`, `#porzioni-q`, `#import-file`, e `input[data-time]` (`per:campo`, salva orario).
Helper `rerenderActive()` rirenderizza Oggi **o** Diario dopo mutazioni di umore/acqua (la card vive in entrambe le superfici).

## 5. Contratto dati — chiavi localStorage (prefisso `dieta_`)
Tutte serializzate JSON via `getState/setState`. **Tutte incluse nell'export backup TRANNE `dieta_ai_key`.**

| Chiave | Tipo | Significato |
|---|---|---|
| `persona` | `'lui'\|'lei'\|'entrambi'` | persona attiva (filtro porzioni) |
| `theme` | `'auto'\|'dark'\|'light'` | tema |
| `start` | `'YYYY-MM-DD'` | data inizio protocollo (coaching prima settimana) |
| `track_<YYYY-MM-DD>` | `{ [id]: true }` | spunte del giorno: `p<n>_<per>`, `int_<slug>_<per>`, `camm_<per>`, `risc_0..2` |
| `spesa` | `{ [catSlug\|prodSlug]: true }` | prodotti presi |
| `prep` | `{ [groupKey\|i]: true }` | checklist meal prep |
| `fav` | `{ [recipeId]: true }` | ricette preferite |
| `mood_<YYYY-MM-DD>` | `{ lui, lei }` | umore/energia (valori `top\|bene\|ok\|giu\|ko`) |
| `water_<YYYY-MM-DD>` | `{ lui:n, lei:n }` | bicchieri d'acqua |
| `weight` | `{ lui:[{date,kg}], lei:[...] }` | log peso (uno per giorno, sostituibile) |
| `times_<YYYY-MM-DD>` | `{ lui:{sveglia,pasto1,sonno}, lei:{…} }` | orari per indicatore regolarità |
| `cycle` | `{ lastStart:'YYYY-MM-DD', len:Number }` | ciclo (solo lei, solo locale) |
| `notes` | `[{date,persona,text}]` | diario/note per le visite (max 300) |
| `ai_model` | string | modello coach selezionato (`moonshotai/kimi-k2.6` \| `z-ai/glm-5.1`) |
| `ai_chat` | array | cronologia chat AI (solo locale) |

> ⚠️ Da **v1.3.0** non esiste più `ai_key`: la chiave del coach è un **secret del Worker** (`NVIDIA_API_KEY`), non vive sul dispositivo. (Storicamente `dieta_ai_key` conteneva la API key Anthropic ed era esclusa da export/import — ora è proprio rimossa.)

Derivati (non persistiti): streak/heatmap calcolati al volo dai `track_*`; `spesaHide` (toggle UI runtime).

## 6. Schemi dati embedded (contratto tra `app.js` e i file dati)
- `DIET_DATA = { persone, finestra[{ora,evento,dettaglio}], target{lui,lei}, integratori[{nome,timing,valutazione,note,persona}], porzioni[], giorni[{id,nome,sottotitolo,pasti[{n,ora,titolo,emoji,items[{alimento,lui,lei}],nota,prep{passi[],tempoMin}}]}], divieti{lui[],lei[]}, pomodoroAlternative[], spesa[{categoria,items[{prodotto,quantita,note}]}], spesaTiming, antiSpreco[], biohacking{lui[],lei[]}, mealPrep{…}, disclaimer }`
- `RECIPES = [{ id, nome, emoji, gradient[2], momento[], persona, tempoMin, difficolta, mealPrep, tags[], descrizione, ingredienti[{nome,lui,lei}], passaggi[], tips, sicurezzaLei, sicurezzaLui, macros{kcalLui,kcalLei,proteine} }]`
  - `momento` ∈ `P1,P2,P3` · `persona` ∈ `entrambi,lui` · `difficolta` ∈ `facile,media`
  - tag clinici: `pro-gengive` (verdure a foglia cotte/barbabietola), `anti-infiammatorio` (curcuma+pepe / pesce bianco / legumi a basso IG)
- `TIPS = [{ id, categoria, icona, titolo, testo, persona }]`

⚠️ **Non cambiare uno schema senza aggiornare tutti i consumatori** (app.js + eventuali altri file dati).

## 7. Procedura: aggiungere una feature
1. **Dati**: se servono nuovi campi → aggiornali nel file dati pertinente (`diet.js`/`recipes.js`/`tips.js`) e qui (§6).
2. **Stato**: nuova chiave? Aggiungila al contratto (§5) col prefisso `dieta_`; verrà auto-esportata (a meno che sia segreta come la API key → escludila in `exportBackup`/`importBackup`).
3. **Render**: aggiungi/estendi una `renderX()`. Usa **sempre `esc()`** sull'input dinamico. Riusa i componenti CSS esistenti (card, chip, badge, checkitem, pill, ring).
4. **Eventi**: aggiungi i `data-*` necessari **alla lista del selettore `closest(...)`** e una branch nel handler. Per controlli annidati dentro un `<button>`, usa uno `<span role="button">` con `data-*` (il `closest` lo intercetta prima del bottone padre).
5. **Nuova tab**: aggiungi `<section id="tab-X">` e il bottone tabbar in `index.html`, `'X'` in `TABS`, e `RENDERERS.X`.
6. **CSS**: stili nuovi prima del blocco `motion/a11y`; usa i token (`--surface`, `--accent`, `--lui`, `--lei`, `--ok`…). Mantieni tap target ≥44px e contrasti WCAG ≥4.5.

## 8. Procedura: validazione (prima di chiudere)
1. **Parse JS**: `node -e "for(const f of ['js/app.js','js/data/recipes.js','js/data/diet.js','js/data/tips.js']){new Function(require('fs').readFileSync(f,'utf8'));console.log('OK',f)}"`
2. **Runtime browser**: avvia `serve.cmd` (o `py -m http.server`), carica con Playwright/DevTools, naviga le tab toccate, **controlla console: 0 errori/0 warning**.
3. **Accessibilità**: VoiceOver/contrasti per i nuovi componenti; verifica `aria-pressed`/`aria-label`.
4. **Persistenza**: ricarica la pagina e verifica che le nuove chiavi sopravvivano; prova export/import.

## 9. Procedura: release
1. Bump **`CACHE`** in `sw.js` (`dieta-vN` → `dieta-vN+1`). **Obbligatorio** a ogni modifica dei file app.
2. Aggiorna **`CHANGELOG.md`** (nuova versione, Aggiunto/Modificato/Note) e **`ROADMAP.md`** (voci fatte).
3. Aggiorna **`README.md`** se cambia l'esperienza utente, e **`ORCHESTRATOR.md`** se cambiano stato/schemi/decisioni.
4. Aggiorna la **memoria** `~/.claude/.../memory/project-dieta-app.md` + `MEMORY.md` se cambia lo stato del progetto.
5. Deploy protetto (Cloudflare Pages + Access consigliato) — vedi `docs/deploy.md`.

## 10. Cose da NON fare (limiti piattaforma / scelte deliberate)
- **Web Push / notifiche locali schedulate**: richiedono backend o non sono affidabili su iOS PWA → fuori scope. Per i reminder reali, futura via `.ics` Calendario (roadmap 1.4).
- **Badging API** (`setAppBadge`): non supportata su iOS.
- **Swipe orizzontale tra tab**: conflitto con le chip a scroll orizzontale.
- **File System Access** per sync iCloud automatico: non supportata su iOS Safari.
- **Reintrodurre la API key in export/import**: promessa privacy — resta esclusa.
- **Aggiungere integratori nuovi di default** (es. mio-inositolo): solo come "da discutere col medico".
