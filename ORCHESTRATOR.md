# 🧠 MEMORIA ORCHESTRATORE — Progetto "Dieta AI"

> Questo file è la memoria locale FISSA dell'orchestratore. Viene letto all'inizio di ogni sessione
> e aggiornato solo quando cambiano decisioni strutturali. NON cancellare.

## Scopo del progetto
Web app **privata** installabile su iOS (PWA, "Aggiungi a schermata Home") per la coppia:
- **LUI (35a)** — Narcolessia + ADHD · target ~1.900–2.100 kcal · 130–150g proteine
- **LEI (32a)** — Ipotiroidismo + Sovrappeso + Parodontite · target ~1.450–1.600 kcal (mai <1.400) · 100–120g proteine

Tutto il contenuto deriva dai due file sorgente (NON modificarli mai):
- `Dieta Intermittente Biohacking – Coppia (35M_32F) — Versione Definitiva.md`
- `Meal Prep Edition – Digiuno Intermittente (Batch Cooking).md`

## Vincoli clinici chiave (sempre validi)
- Finestra alimentare 12:00–21:00 · Pasti 13:00 / 17:00 / 20:30 · Sonno 04:00
- LUI: uova SOLO ben cotte · no tonno/salmone/yogurt/ricotta · no caffeina dopo 18:00 · formaggi ok solo parmigiano/mozzarella/scamorza/provola
- LEI: ZERO semi · pomodoro solo passato/cotto · no cibi duri · brassicacee solo ben cotte · no soia · zinco separato dai latticini · risciacquo bicarbonato dopo ogni pasto
- Integratori: tutto a pranzo TRANNE zinco lei (Pasto 2/3 senza formaggi) · magnesio sera

## Architettura decisa (v1)
- **PWA statica vanilla** (HTML+CSS+JS, zero build step) → hostabile ovunque (GitHub Pages/Netlify) o servibile in locale
- **Offline-first**: service worker cache-all, dati embedded in JS, immagini ricette = card illustrate (emoji+gradiente+SVG), zero dipendenze di rete
- **Persistenza utente**: localStorage (check pasti/integratori, recap, API key AI)
- **Tab**: Oggi · Settimana · Meal Prep · Ricette (con filtri) · Tips · Spesa · AI Assistant
- **AI Assistant**: chiama l'API Anthropic direttamente dal client con key inserita dall'utente (salvata in localStorage), system prompt costruito dai dati della dieta. L'utente fornirà il token dopo.

## Struttura file
```
index.html            → shell app + tab (Oggi/Settimana/Ricette/Tips/Diario/AI in tabbar)
manifest.webmanifest  → PWA manifest
sw.js                 → service worker offline (CACHE da bumpare a ogni release)
middleware.js         → cancello password Vercel (alternativa a Cloudflare Access)
icons/                → icona app (PNG per iOS apple-touch-icon)
css/app.css           → design system, dark mode, mobile-first
js/app.js             → router tab + logica UI + tracking localStorage + tab Diario
js/assistant.js       → tab AI (Anthropic API)
js/data/diet.js       → DIET_DATA (piano, porzioni, integratori, divieti, spesa, biohacking, meal prep)
js/data/recipes.js    → RECIPES (43 ricette con filtri momento/persona/tempo/tag clinici)
js/data/tips.js       → TIPS (tips/tricks/alternative ragionate)
docs/architecture.md  → 📘 doc tecnica: architettura, contratto dati localStorage, procedure dev/validazione/release
docs/research.md      → ricerche di supporto (sez. 1-7 v1, sez. 8 research v2)
docs/deploy.md        → guida deploy protetto
README.md · CHANGELOG.md · ROADMAP.md
```

## Squadra subagent (ruoli fissi)
1. **Data engineer** → estrazione MD → `js/data/diet.js` (schema sotto)
2. **Content/recipes** → ricette + tips/alternative → `js/data/recipes.js`, `js/data/tips.js`
3. **Researcher** → ricerche web utili alla causa → `docs/research.md`
4. **Frontend/UX** → shell PWA, design system, tab, mobile iOS
5. **AI integration** → tab assistente
6. **QA/Audit** → test completo, responsive, PWA, accessibilità

## Schemi dati (contratto tra agenti — NON cambiare senza aggiornare tutti)
> Documentazione completa di schemi, chiavi localStorage e procedure in **`docs/architecture.md`** (§5-§9).
- `DIET_DATA = { finestra[], giorni[{id,nome,pasti[{n,ora,titolo,items[{alimento,lui,lei}],nota}]}], integratori[], porzioni[], target{lui,lei}, divieti{lui[],lei[]}, pomodoroAlternative[], spesa[{categoria,items[{prodotto,quantita,note}]}], antiSpreco[], biohacking{lui[],lei[]}, mealPrep{...} }`
- `RECIPES = [{id,nome,emoji,gradient,momento[],persona,tempoMin,difficolta,mealPrep,tags[],descrizione,ingredienti[{nome,lui,lei}],passaggi[],tips,sicurezzaLei,sicurezzaLui,macros{kcalLui,kcalLei,proteine}}]` · tag clinici: `pro-gengive`, `anti-infiammatorio`
- `TIPS = [{id,categoria,icona,titolo,testo,persona}]`
- **Chiavi localStorage** (prefisso `dieta_`, tutte nell'export TRANNE `ai_key`): `persona, theme, start, track_<data>, spesa, prep, fav, mood_<data>, water_<data>, weight, times_<data>, cycle, notes, ai_key, ai_model, ai_chat`

## Stato: v1.2.0 consegnata (2026-06-14)
- **FASE 5 (debiti tecnici) chiusa.** Toggle **in-place** in Oggi/Spesa (niente più re-render integrale: helper `updateOggiProgress()` e `updateSpesaProgress()`; in renderOggi l'anello è in `#oggi-ring` e il recap in `#oggi-recap`; in renderSpesa contatore `#spesa-count`, barra `#spesa-bar`, pillole categoria `.cat-count[data-cat]`). Caso noto: con `spesaHide` attivo la Spesa fa render completo (l'item spuntato deve sparire).
- **Toast** `toast(msg,kind)` (`#toast`, `role=status`/`aria-live`) usato da `setState` per avvisare su **quota localStorage** esaurita (niente più perdita dati silenziosa). **Banner aggiornamento** (`#update-banner`, `data-action="reload-app"`) su `controllerchange` solo se c'era già un controller (no prima install, no reload-loop).
- **A11y**: `aria-hidden` sul `%` dell'anello, `aria-pressed` sui 3 `[data-p]` (aggiornato in `syncPersonaUI`), `aria-live="polite"` sul contenitore messaggi AI (`ai-msgs` in assistant.js).
- **Import** valida ogni valore come JSON prima di scrivere (chiavi non valide saltate+segnalate). Pop CSS sulle spunte (rispetta reduced-motion). Tempo Meal Prep derivato da `DIET_DATA`.
- **Model id AI verificati** (skill `claude-api`): `claude-opus-4-8`/`claude-sonnet-4-6`/`claude-haiku-4-5` validi; `claude-haiku-4-5` è l'**alias** corretto (NON appendere suffissi di data). Nessuna modifica ad `assistant.js` lato model id.
- Nessuna nuova chiave localStorage. CACHE `dieta-v5`. Collaudo Playwright: 0 errori/0 warning.

### Stato precedente: v1.1.0 consegnata (2026-06-14)
- Nuova tab **Diario** (`#tab-diario`, renderer `renderDiario`): storico+streak+heatmap, umore (`mood_*`), idratazione (`water_*`), peso (`weight` con sparkline), regolarità orari (`times_*`), ciclo lei (`cycle`), note visite (`notes`). Tabbar ora a 6 voci (Oggi/Settimana/Ricette/Tips/Diario/AI). Tutte le nuove chiavi `dieta_*` sono nell'export; API key resta esclusa.
- Oggi: card umore+idratazione, banner coaching prima settimana (chiave `start`), badge "ordine del piatto" + "come rompo il digiuno" su Pasto 1 (in `mealCardHtml` per `p.n===1`).
- Ricette: preferiti `fav` (stella su card via `data-fav` — closest evita l'apertura ricetta; pulsante nel sheet), filtri tag clinici `pro-gengive`/`anti-infiammatorio`. 43 ricette (r29–r43 aggiunte). Spesa: barra progresso + toggle `spesaHide`.
- Collaudato in browser (Playwright): zero errori console. CACHE `dieta-v4`.
- research.md ha sezione 8 (research v2) con i razionali clinici di queste feature.

### Stato precedente: v1.0.1 (2026-06-12)
- Deploy: guida in docs/deploy.md — raccomandata Cloudflare Pages+Access (email-based); per Vercel esiste `middleware.js` (password in env `APP_PASSWORD`, cookie hash 1 anno, icone/manifest esclusi dal gate)
- `index.html` ha `crossorigin="use-credentials"` sul manifest: NON rimuoverlo (serve dietro login)
- GitHub Pages è vietato per questo progetto (nessuna protezione possibile, dati sanitari)
- Test locale: `serve.cmd` (doppio click)

- App completa, collaudata in browser (zero errori console) e auditata (QA: riserve tutte risolte)
- Regola release: a ogni modifica dei file app → bump `CACHE` in sw.js + aggiornare CHANGELOG
- La API key è esclusa da export/import backup (promessa privacy) — non reintrodurla
- Contraddizione nota nel sorgente Meal Prep (salsa di soia, riga ~514): corretta nell'app, da segnalare al nutrizionista
- Tema chiaro: accent #8a5510 e lui #026da6 sono valori calcolati per contrasto WCAG ≥4.5 — non schiarirli

## Regole operative orchestratore
- Le richieste dell'utente passano SEMPRE da me (orchestratore); io delego agli specialisti
- **Ownership dei file per evitare conflitti**: quando deleghi in parallelo, assegna a ciascun subagent file disgiunti (es. ricette → `recipes.js` a un agente; tutto il frontend coeso di `app.js`+`css` a un solo owner). `app.js` è un file unico grande: NON spezzarlo tra più agenti in scrittura simultanea.
- **Procedura di validazione (sempre, prima di chiudere)**: parse JS con `node` (new Function su ogni file) **e** collaudo runtime in browser (serve.cmd + Playwright/DevTools) con **0 errori/0 warning console**. Dettagli in `docs/architecture.md` §8.
- **Release**: bump `CACHE` in `sw.js` ad ogni modifica dei file app; aggiornare CHANGELOG, ROADMAP, README, questo file e la memoria. Dettagli in `docs/architecture.md` §9.
- Per aggiungere feature/tab/chiavi seguire `docs/architecture.md` §7 (input dinamico SEMPRE via `esc()`; nuovi `data-*` vanno aggiunti al selettore `closest`).
- Ogni novità → aggiornare CHANGELOG.md e, se cambia direzione, ROADMAP.md
- I file sorgente .md della dieta sono READ-ONLY
- L'app non dà consigli medici sostitutivi: disclaimer sempre presente
