# Changelog

## [Unreleased]
### Infrastruttura / deploy (non è una nuova versione dell'app)
- Progetto messo sotto **git** e collegato a **Cloudflare Workers**: deploy ad ogni `git push` (`npx wrangler deploy`).
- Online sul dominio custom **https://dieta333ai.uk** (Cloudflare Registrar) dietro **Cloudflare Access** (login per email, solo la coppia). URL `*.workers.dev` e preview URL **spenti** (`workers_dev:false`, `preview_urls:false`).
- Coach AI configurato in produzione: secret del Worker `NVIDIA_API_KEY`.
- `.gitignore` esclude dal repo i dati sensibili non-runtime; `.assetsignore` impedisce di servire `*.md`/config/`worker.js`.
- `docs/deploy.md` riscritto con il **setup reale** (§"Setup ATTUALE in produzione"); le vecchie opzioni Pages/Vercel restano come alternative storiche.

## [1.5.0] — 2026-06-25
### Aggiunto
- **Stima macro per pasto e per giorno**: ogni pasto mostra una riga con **kcal e proteine** stimate per lui/lei; in **Oggi** una card **"🔢 Stima macro del giorno"** somma i 3 pasti e li confronta con i target, con **alert se LEI scende sotto il minimo di 1.400 kcal** o se le proteine sono sotto target. Nuova mappa `DIET_DATA.macroByMeal` (21 pasti, stime CREA/USDA validate dal nutrizionista: tutti i giorni nei range, LEI mai <1.400). Helper `dayMacroTotals()` in `app.js`.
- **AI proattiva con consapevolezza calorica**: lo "STATO RECENTE" passato al coach ora include le **kcal/proteine pianificate per oggi** vs obiettivo, così può avvisare es. «occhio: oggi LEI è sul minimo calorico, aggiungiamo una fonte proteica morbida».
- **Mini-tab "🔄 Varianti & rotazione"** sulle card dei pasti (elemento `<details>` cliccabile): mostra alternative e **rotazione stagionale**. La variante in stagione (estate/inverno) è marcata **"consigliata ora"** via `currentSeason()`. Popolato su: smoothie (4 combinazioni di frutta consentita), giorno seitan (tempeh per lui / crema di lenticchie d'inverno), insalata di mare (sgombro al forno d'inverno), sgombro (giorno veg / orata-merluzzo).

### Cambiato
- **Omega-3 ripristinato con lo sgombro**: il **venerdì** torna **Sgombro al forno + verdure** (NIENTE patate; alternative orata/merluzzo) come fonte settimanale di omega-3. Il **tempeh** non è più un giorno fisso ma una **variante** del giorno seitan (proteina veg "per mixare"). **Tolte le cozze** dall'insalata di mare (resta polpo/calamari/gamberi; salmone opzionale solo per lei). Spesa, batch, timing e anti-spreco riallineati; tempi giornalieri aggiornati (totale 349′/sett).
- Service worker: cache **`dieta-v8`**.

### Collaudo
- `node --check` su tutti i JS: OK. Browser (Playwright) 0 errori/0 warning: verificati le 3 righe macro per pasto, la card macro del giorno (giovedì veg: LUI 1980/118g, LEI 1460/90g con flag "proteine sotto target"), i mini-tab varianti, lo sgombro al venerdì e le kcal pianificate nel contesto AI.

## [1.4.0] — 2026-06-25
### Cambiato (piano settimanale rivisto su richiesta della coppia)
Tutte le modifiche validate contro i vincoli clinici da una squadra di subagent dedicati (nutrizionista + recipe-finder + biohacker con ricerca web e cross-check reciproco). I conflitti clinici sono stati risolti, non eseguiti alla cieca:
- **Martedì P1**: tolto il **French Toast** → **Bowl fredda con avocado** (proteine da mozzarella + pollo freddo, **niente uova** → realizza la richiesta "uova 1 volta in meno a settimana").
- **Martedì P3**: tolto **pesce + patate** (orata) → **Insalata di mare fatta in casa**. ⚠️ **Salmone VIETATO a LUI** (è nei suoi divieti): la sua porzione è polpo/calamari/gamberi/cozze; il salmone è opzionale **solo per lei**. Molluschi **brasati a lungo finché teneri** per la parodontite di lei (niente gommoso/croccante).
- **Mercoledì P3**: tolto il **riso basmati** → **Pollo con verdure miste** in umido (sovracoscia morbida per lei). Così il **riso resta 1 volta a settimana** (risotto della domenica), come la pasta.
- **Giovedì P2**: **Smoothie di frutta** (1 di 2). **Sabato P2**: **Smoothie di frutta** (2 di 2). Solo frutta della lista consentita di lei (banana/mango/pesca/melone/pera), **niente semi**; base latte (no yogurt per lui, **no bevanda di soia** per lei).
- **Giovedì P3**: tolta la **crema di lenticchie** (stagione estiva) → **Seitan con verdure miste** (il seitan è glutine, **non soia** → ok anche per lei) + un cucchiaio di legumi per completare la lisina. D'inverno la crema di lenticchie può tornare.
- **Venerdì P3**: tolto **pesce + patate** (sgombro/purè) → giorno proteico-vegetale **Tempeh (lui) / Seitan (lei)**. ⚠️ **Tempeh VIETATO a LEI** (è soia → interferisce con la levotiroxina): la sua versione usa **seitan**.
- **Omega-3**: rimosse le due cene di pesce grasso, la copertura resta affidata all'integratore Omega-3 di pranzo (già nel piano) + cozze dell'insalata di mare. Nota aggiunta in anti-spreco/biohacking; punto da confermare col nutrizionista.

### Aggiunto
- **6 nuove ricette** (`recipes.js`, r44–r49): Insalata di mare · Seitan con verdure · Tempeh/Seitan con verdure · Pollo con verdure · Smoothie di frutta consentita · Bowl fredda con avocado. Ricettario da 43 → **49 ricette**.
- **FASE 6.1 — Assistente AI proattivo e contestuale**: il coach ora riceve nel contesto runtime uno **STATO RECENTE** dai log del Diario (aderenza pasti 7gg, streak, umore, idratazione, peso+trend, regolarità orari, ciclo di lei) e lo usa per spunti su misura («LEI indietro con l'acqua oggi», «aderenza in calo: ripartiamo dal Pasto 1»), con tatto e senza mostrare numeri grezzi. Nuovo `window.DietLogs.contextSummary()` in `app.js` (solo lettura, difensivo, **nessuna nuova chiave localStorage**), agganciato da `assistant.js` in `buildRuntimeContext()`.
- **7 subagent dedicati di progetto** (`.claude/agents/`): `dieta-nutrizionista`, `dieta-biohacker`, `dieta-recipe-finder`, `dieta-deep-search` (ricerca web condivisa con cross-verifica), `dieta-frontend`, `dieta-ai-coach`, `dieta-qa`.

### Modificato
- `diet.js`: lista **spesa** ricalibrata (via misto mare/salmone-solo-lei/seitan/tempeh/legumi; più peperoni e avocado; meno patate; via basmati-cena e farro), **batch meal prep**, **anti-spreco** e **hack** allineati ai nuovi piatti, tempi giornalieri aggiornati (totale 347′/settimana), **divieti di lei** rafforzati sulla soia (tempeh/tofu/edamame/salsa/latte di soia).
- Service worker: cache **`dieta-v7`**.

### Collaudo
- `node --check` su tutti i file JS: OK. Collaudo browser (Playwright) su Oggi/Settimana/Ricette/Tips/Diario/AI: **0 errori, 0 warning**. Verificati: 49 ricette caricate, i 7 slot aggiornati, french toast/lenticchie rimossi, riso 1x, `contextSummary()` produce il riassunto proattivo da log seminati.

## [1.3.0] — 2026-06-15
### Cambiato (assistente AI: da Claude a coach NVIDIA, con proxy)
- L'assistente non usa più Anthropic/Claude. Ora è un **coach via NVIDIA build**, con **due modelli selezionabili**: **Kimi K2.6** (`moonshotai/kimi-k2.6`, default) e **GLM-5.1** (`z-ai/glm-5.1`).
- **Nuova architettura — proxy nel Worker**: NVIDIA non supporta le chiamate dirette dal browser (niente CORS), quindi il Worker Cloudflare ora espone una rotta interna **`/api/coach`** (`worker.js`) che inoltra a `https://integrate.api.nvidia.com/v1/chat/completions`. Il browser chiama la rotta sullo stesso dominio → nessun problema CORS; tutto resta **dietro Cloudflare Access** (solo gli utenti autorizzati possono usare il coach).
- **La API key non è più sul dispositivo**: vive come **secret del Worker** `NVIDIA_API_KEY` (mai nel codice, nel repo o nel browser). Rimosso del tutto il campo "inserisci API key" e la chiave `dieta_ai_key`. Il pulsante ⚙️ ora serve solo a **cambiare modello** (`dieta_ai_model`). La cronologia (`dieta_ai_chat`) resta solo in locale.
- Whitelist modelli lato Worker (rifiuta richieste con modelli non previsti). Sanitizzazione markdown anti-XSS e `aria-live` sulle risposte invariati.

### Aggiunto
- `worker.js` — Worker che serve il sito **e** fa da proxy `/api/coach` (key da `env.NVIDIA_API_KEY`).
- `.assetsignore` — esclude dai file *serviti* worker.js, config e **tutti i `.md`** (così i documenti con dettagli clinici non sono scaricabili nemmeno dietro Access).

### Modificato
- `wrangler.jsonc`: aggiunto `main: "worker.js"` e binding asset `ASSETS`.
- Service worker: cache `dieta-v6`.

### Note privacy
- Le domande al coach (che includono il piano e i vincoli clinici) passano dal vostro Worker e da lì al modello scelto su NVIDIA: come prima con Claude, un LLM in cloud vede il prompt — cambia solo il fornitore. La key sta nel vostro account Cloudflare (privato, dietro Access), non più sul telefono.
- Collaudo browser: tab AI con nuovo selettore (Kimi/GLM), nessun campo key, invio con errore amichevole (in locale `/api/coach` dà 501 perché il server statico non esegue il Worker — in produzione il Worker risponde). Zero crash.

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
