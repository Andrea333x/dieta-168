# Changelog

## [Unreleased]

## [1.2.0] — 2026-06-14
### Aggiunto
- **Banner "Aggiornamento pronto · Ricarica"** (FASE 5.3): dopo un nuovo deploy, se l'app era già installata, compare un banner in cima con un pulsante per ricaricare e prendere subito la versione nuova (niente reload automatico, mostrato una sola volta). Sfrutta `controllerchange` del service worker (che già fa `skipWaiting`+`clients.claim`).
- **Avviso "memoria piena"** (FASE 5.2): se il salvataggio in localStorage fallisce per quota esaurita, ora compare un **toast** non invasivo (`role="status"`, `aria-live="polite"`) invece di ingoiare l'errore in silenzio — niente più perdita dati silenziosa.
- **Micro-animazione "pop"** sulla spunta di pasti/integratori/spesa (solo CSS, disattivata con `prefers-reduced-motion`).

### Modificato
- **Toggle in-place** (FASE 5.1): spuntare un pasto/integratore in **Oggi** o un prodotto in **Spesa** non ricostruisce più tutta la sezione — aggiorna solo il bottone toccato, l'anello/recap (Oggi) o la barra/contatori (Spesa). Niente più "lampeggio" dell'anello né salto dello scroll.
- **Import backup più robusto** (FASE 5.5): ogni valore viene validato come JSON prima di essere scritto; le chiavi non valide vengono saltate e segnalate nell'avviso finale (un backup manomesso non può più iniettare dati malformati). API key sempre esclusa.
- **Accessibilità WCAG** (FASE 5.4): `aria-hidden` sul `%` dell'anello (niente doppia lettura screen reader); `aria-pressed` sui 3 selettori persona 👦👫👩; `aria-live="polite"` sul contenitore delle risposte dell'assistente AI (annuncio progressivo).
- **Meal Prep**: il "tempo attivo" mostrato (~6h 35′) è ora derivato da `DIET_DATA` invece di hardcoded (FASE 5.7).
- Service worker: cache `dieta-v5`.

### Verificato (nessuna modifica necessaria)
- **Model id AI** (FASE 5.6): `claude-opus-4-8`, `claude-sonnet-4-6`, `claude-haiku-4-5` sono tutti id validi serviti dall'API; `claude-haiku-4-5` è l'**alias ufficiale** (la forma raccomandata, senza suffisso di data). Confermato via skill `claude-api`.

### Note
- Collaudo browser reale (Playwright): toggle in-place Oggi (anello 0%→4% senza re-render), persona, mount AI, Diario, Spesa → **zero errori/warning console**.
- Orchestrazione con 2 subagent a ownership disgiunta (frontend: app.js/css/index.html/sw.js · AI: assistant.js). Nessuna nuova chiave localStorage; API key resta esclusa dall'export.

## [1.1.0] — 2026-06-14
### Aggiunto
- **Nuova tab 📔 Diario** (`#tab-diario`) — diario di salute personale, tutto in locale e incluso nei backup:
  - **Storico & streak gentile**: giorni consecutivi con ≥ metà spunte + **heatmap aderenza** delle ultime 10 settimane (calcolata dai `track_*` già esistenti, zero nuovi dati)
  - **Energia & umore**: 1 tap/giorno per persona, con storico a 7 giorni
  - **Peso & andamento**: log per persona con **sparkline SVG** del trend e delta dall'inizio (KPI clinico di lei)
  - **Regolarità degli orari**: registrazione di sveglia/Pasto 1/sonno + indicatore 🟢🟡🔴 della costanza (ancora circadiana comune a tiroide, ADHD, narcolessia)
  - **Ciclo (solo lei, solo locale)**: giorno/fase del ciclo e suggerimento "finestra morbida 14:10" nelle fasi premestruale/mestruale (validare col medico)
  - **Diario & note per le visite**: note datate per persona (endocrinologo/neurologo/dentista/nutrizionista)
- **Oggi**: card "🌤️ Come stai oggi" (umore + **idratazione** con contatore bicchieri e tip fame/sete), **banner coaching prima settimana** (Giorno 1→10), badge **"ordine del piatto" (Verdure → Proteine → Carbo)** e mini-guida **"come rompo il digiuno"** sul Pasto 1 (anti-picco/anti-sonnolenza)
- **Ricette**: **preferiti ⭐** (stella su card e nel dettaglio, filtro "preferite"), nuovi filtri tag clinici **#pro-gengive** e **#anti-infiammatorio**, set di chip tag rivisto (morbido, legumi, pesce, invernale…), aggiunto chip filtro "solo lei" mancante
- **15 nuove ricette compliant r29–r43** (`recipes.js`, totale **43**): parmigiana bianca, gnocchi morbidi, porridge salato, clafoutis, spezzatino in bianco, mug-cake, nicecream, sformatini, creme fredde, crostini di cannellini, polpettone di pollo, platessa, coniglio, zuppa ceci-farro, toast in carrozza — nuove proteine (cannellini/ceci/lenticchie verdi, platessa/nasello, coniglio) e varianti stagionali; tutte verificate contro i divieti di entrambi (incluso zero-tahin per lei)
- **Spesa**: barra di progresso % e toggle **"nascondi presi"** per l'uso al supermercato (1.2)

### Modificato
- Service worker: cache `dieta-v4`
- `docs/research.md`: **sezione 8 (research v2)** — sequenza del piatto, nappuccino, regolarità circadiana, caffeina dose×distanza, mio-inositolo+selenio, floor 1.400 kcal, nitrati pro-gengive, protein leverage, fasting ciclo-consapevole, elettroliti, luce+movimento al risveglio (fonti PubMed/PMC)
- `ROADMAP.md`: riscritta con posizionamento competitor + 6 fasi prioritizzate; le voci di questa release marcate come fatte

### Note
- Collaudo browser reale (Playwright): tab Diario, umore, idratazione, peso, preferiti, filtri clinici, badge Pasto 1 → **zero errori/warning console**
- Tutte le nuove chiavi `dieta_*` (mood/water/weight/times/cycle/notes/fav/start) sono incluse nell'export e **la API key resta esclusa** (promessa privacy invariata)

### Sessione di ricerca (origine della release)
- Orchestrazione con 4 subagent in parallelo: competitor analysis, ricerca clinica evidence-based 2024-2026, audit tecnico/UX, progettazione ricette

## [1.0.1] — 2026-06-12
### Aggiunto
- `docs/deploy.md` — guida deploy con accesso protetto: Cloudflare Pages + Access (login per email, consigliata), Vercel + password condivisa, perché GitHub Pages NON va usato, ruolo futuro di Supabase
- `middleware.js` — cancello password per Vercel (Edge Middleware): pagina di login, cookie con hash (1 anno), password in variabile d'ambiente `APP_PASSWORD`; icone/manifest esclusi per non rompere l'installazione iOS
- `serve.cmd` — avvio del server locale col doppio click (fix del problema "python -m http.server non parte": era questione di cartella di lavoro)

### Modificato
- `index.html`: manifest con `crossorigin="use-credentials"` (necessario dietro login con cookie)
- README: sezione installazione/hosting riscritta con focus sicurezza dati sanitari
- Service worker: cache `dieta-v3`

## [1.0.0] — 2026-06-12
### Aggiunto
- **App completa**: `index.html`, `css/app.css` (design system dark-first, tema chiaro, variabili contratto), `js/app.js` (tab Oggi/Settimana/Ricette/Tips/Prep/Spesa, tracking pasti+integratori per persona, recap con anello di progresso, countdown finestra alimentare, export/import backup), `sw.js`, `manifest.webmanifest`, icone PNG 180/192/512
- **Tab AI Assistant** (`js/assistant.js`): chat con API Anthropic diretta dal dispositivo, API key in localStorage, selettore modello (Opus 4.8 default / Sonnet 4.6 / Haiku 4.5), system prompt ~7.4k token con tutto il piano+vincoli (cacheable), 5 suggerimenti rapidi, cronologia persistente, markdown sicuro anti-XSS
- Collaudo browser reale (Playwright, viewport iPhone): tutte le tab funzionanti, zero errori console
- Audit QA completo: verdetto "pronta con riserve" → tutte le riserve risolte (vedi sotto)

### Corretto (da audit QA)
- **[ALTO]** Hack "fried rice rescue": rimossa la salsa di soia (vietata per lei — interferenza levotiroxina); il sorgente Meal Prep .md riga ~514 contiene la stessa contraddizione → da segnalare al nutrizionista
- **[ALTO]** Contrasto WCAG chat AI: testo su accent ora usa `--accent-ink` (8.6:1 dark)
- **[MEDIO]** Tema chiaro: accent scurito a #8a5510 e blu lui a #026da6 (contrasti ≥4.5:1)
- **[MEDIO]** La API key NON viene più inclusa nell'export backup né accettata dall'import (promessa privacy)
- **[MEDIO]** Service worker: da cache-first a network-first con fallback cache (gli aggiornamenti arrivano subito), cache `dieta-v2`
- **[MEDIO]** Bottom sheet: focus sul pulsante chiudi all'apertura, focus trap leggero, ripristino focus alla chiusura
- **[BASSO]** Tap target ≥44px (chip filtri, chiudi sheet), manifest con `id` e icona maskable, scroll chat rispetta `prefers-reduced-motion`, chiavi spesa basate su slug categoria (non più indice), ARIA tablist corretto, nota di validazione clinica sul tip crema di mandorle

## [0.2.0] — 2026-06-12
### Aggiunto
- `js/data/diet.js` — estrazione completa e fedele del piano: 7 giorni, 21 pasti, 96 righe lui/lei, 7 integratori, guida porzioni (16 voci), lista spesa (5 categorie, 52 prodotti), meal prep completo (8 batch, timeline, conservazione, hack, checklist, risparmio), biohacking, divieti, anti-spreco, alternative pomodoro
- `js/data/recipes.js` — 28 ricette nuove compliant (9 P1, 8 P2, 8 P3, 3 jolly; 4 comfort, 4 estive fredde), tutte verificate contro i vincoli clinici di entrambi
- `js/data/tips.js` — 42 tips in 10 categorie (digiuno, lui, lei, cucina, spesa, 8 sostituzioni concrete, idratazione, sonno, movimento, eating-out)
- `docs/research.md` — ricerca con fonti su: 16:8+ipotiroidismo, timing levotiroxina (regola "1h caffè / 4h minerali"), narcolessia/ADHD e alimentazione, parodontite e nutrizione, interazioni integratori, limiti PWA iOS (storage.persist, regola 7 giorni Safari), best practice UI meal tracking

## [0.1.0] — 2026-06-12
### Aggiunto
- Avvio progetto: lettura completa dei due file sorgente della dieta
- `ORCHESTRATOR.md` — memoria locale fissa dell'orchestratore (vincoli clinici, architettura, schemi dati, ruoli subagent)
- README, CHANGELOG, ROADMAP iniziali
- Architettura decisa: PWA statica vanilla, offline-first, tab multiple, AI assistant client-side
