# Roadmap — Dieta AI

> Documento vivo. Aggiornato 2026-06-14 dopo sessione di ricerca approfondita (competitor, clinica
> evidence-based 2024-2026, audit tecnico/UX, nuove ricette). Le priorità seguono il criterio
> **impatto per QUESTA coppia ÷ sforzo in PWA vanilla offline-first**. Legenda complessità:
> 🟢 bassa (UI + localStorage) · 🟡 media (logica/grafici/calcoli) · 🔴 alta (limiti piattaforma).

---

## ✅ Fatto

### v0.1 — Fondamenta (2026-06-12)
- [x] Lettura sorgenti, memoria orchestratore, docs di progetto, architettura PWA definita

### v1.0 / v1.0.1 — App completa (2026-06-12)
- [x] Dati strutturati dal piano (`diet.js`): 7 giorni, 21 pasti, integratori, porzioni, spesa, meal prep, biohacking, divieti
- [x] 28 ricette compliant con filtri (`recipes.js`) · 42 tips in 10 categorie (`tips.js`)
- [x] Shell PWA: tab Oggi/Settimana/Meal Prep/Ricette/Tips/Spesa/AI · design mobile-first iOS · dark/light
- [x] Tracking locale: check pasti + integratori per persona, recap con anello, countdown finestra
- [x] Service worker offline (network-first) + manifest + icona iOS · export/import backup
- [x] Tab AI Assistant (API key utente, system prompt con tutta la dieta)
- [x] Audit QA completo (responsive, accessibilità, PWA) + collaudo browser reale → riserve risolte
- [x] Deploy protetto documentato (`docs/deploy.md`): Cloudflare Pages + Access / Vercel + password

### Sessione di ricerca (2026-06-14)
- [x] Analisi competitor (fasting/nutrizione/condizioni cliniche) → lacune di mercato e feature-gap
- [x] Ricerca clinica evidence-based 2024-2026 → `docs/research.md` sez. 8 (research v2)
- [x] Audit tecnico/UX dell'app esistente → debiti e proposte mirate
- [x] Progettate 15 nuove ricette compliant (r29–r43), pronte da integrare

### v1.1.0 — Diario, tracking & nuove ricette ✅ (2026-06-14)
Implementate in questa release (vedi CHANGELOG): **1.2** spesa con barra/nascondi presi · **1.3** Storico+streak+heatmap ·
**2.2** peso+sparkline · **2.4** umore · **2.5** regolarità orari · **2.6** idratazione · **2.7** diario note ·
**3.1** badge ordine del piatto · **3.2** card rompo il digiuno · **3.6** coaching prima settimana · **3.9** ciclo+finestra morbida ·
**4.1** 15 ricette r29–r43 · **4.2** tag pro-gengive/anti-infiammatorio · **4.3** preferiti · **4.4** varianti stagionali.
Nuova tab 📔 **Diario** come contenitore del tracking personale.

---

## 👈 Prossimo passo per l'utente (azioni non di codice)
- [x] **Deploy protetto** fatto: online su **https://dieta333ai.uk** (Cloudflare Worker) dietro **Cloudflare Access** (login per email). Aggiornamenti via `git push`. Vedi `docs/deploy.md` §"Setup ATTUALE in produzione".
- [x] **Coach AI** configurato: secret Worker `NVIDIA_API_KEY` (modelli Kimi K2.6 / GLM-5.1). Consiglio: tenere un **limite di spesa** sulla key NVIDIA come rete di sicurezza.
- [ ] **Installare la PWA** su entrambi gli iPhone dal nuovo URL (Safari → login → Aggiungi a schermata Home)
- [ ] **Segnalare al nutrizionista** la contraddizione del sorgente Meal Prep (salsa di soia nell'hack fried rice vs divieto soia di LEI)
- [ ] Decidere con i curanti i punti [MEDICO]/[DENTISTA] emersi nella research v2 (timing pillola, floor calorico, eventuale mio-inositolo+selenio, frequenza bicarbonato)

---

## 🎯 Posizionamento strategico (sintesi competitor)
Il vantaggio difendibile **non** è "più feature dei competitor", ma essere **l'unica app costruita per questi due
utenti specifici**. Nessun competitor combina: **gestione coppia** (due profili clinici distinti) + **condizioni
multiple** (ipotiroidismo+parodontite / narcolessia+ADHD) + **privacy locale/offline** + **zero abbonamenti**.
I competitor monetizzano dietro paywall aggressivi (Zero ~70-100$/anno), trattano un solo profilo e una sola
condizione, e soffrono database inaffidabili e regressioni da update. Le prossime feature devono **rafforzare**
questi differenziatori, non inseguire funzioni generiche.

---

## 🚀 FASE 1 — Quick wins ad alto impatto (sforzo basso/medio)
Catturano ~80% del valore percepito dei competitor senza tradire i vincoli. Da fare per prime.

### 1.1 — Timer/stato finestra alimentare LIVE 🟢 · ALTA
**Cosa:** trasformare la finestra statica 12–21 in un countdown vivo ("digiuno: 14h 20m" / "mangi tra 1h 40m"),
con stato visivo. È LA feature regina di Zero/Simple.
**Perché per loro:** ancoraggio temporale chiaro nella giornata — prezioso per ADHD/narcolessia con orari atipici.
**Note:** calcolo da `Date.now()` vs orari già in `DIET_DATA.finestra`; refresh al minuto. Nessun nuovo dato.

### 1.2 — Lista spesa interattiva spuntabile 🟢 · ALTA
**Cosa:** rendere la lista spesa checkabile per riga, con stato in localStorage e reset settimanale.
**Perché:** oggi è statica; spuntabile diventa davvero usabile al supermercato (pattern Mealime/Eat This Much).
**Note:** riuso del pattern check già esistente per i pasti; chiavi basate su slug categoria (già fatto).

### 1.3 — Vista "Storico" + streak morbido 🟡 · ALTA — *massimo valore latente già presente*
**Cosa:** mini-vista che legge i `dieta_track_YYYY-MM-DD` **già salvati** ma oggi invisibili oltre la settimana:
streak giorni consecutivi, heatmap mensile (griglia 7×N con intensità = % spunte), trend aderenza.
**Perché:** motivazione e costanza; per ADHD lo streak "morbido" (premia il presentarsi, stile Finch, non punisce
i giorni saltati) sostiene meglio dei sistemi punitivi. Tutto lo storico è già persistito → zero nuovi schemi dati.

### 1.4 — "Aggiungi al Calendario" (.ics) per reminder REALI 🟢 · ALTA
**Cosa:** generare un file `.ics` (Blob `text/calendar`) con eventi ricorrenti — pasti 13/17/20:30, integratori,
risciacqui — che il Calendario iOS notifica nativamente.
**Perché:** è l'**unico** modo di avere reminder affidabili **senza backend** (vedi "Cose da NON fare" sui push).
Aggira il limite piattaforma mantenendo privacy e offline.

### 1.5 — Onboarding one-shot 🟢 · ALTA
**Cosa:** overlay di 2-3 card al primo avvio (flag `dieta_onboarded`): spiega selettore persona 👦👫👩,
spunte pasti/integratori, tab AI, e invita a "Aggiungi a Home Screen".
**Perché:** oggi l'app si apre su "Oggi" senza spiegare che il selettore persona filtra le porzioni; un utente
nuovo non lo capisce.

### 1.6 — Prompt "Aggiungi a Home Screen" + persistenza dati 🟢 · ALTA
**Cosa:** banner informativo che spiega che installare in Home Screen è ciò che protegge i dati dall'eviction.
**Perché:** la "regola dei 7 giorni" di Safari **non** si applica alle PWA installate; `storage.persist()` su iOS
ritorna quasi sempre `false` finché non si installa. Va comunicato, non solo invocato silenziosamente.

---

## 📊 FASE 2 — Tracking & insight (cuore differenziante)
Sfrutta i dati clinici per dare valore che nessun competitor può replicare.

### 2.1 — Conteggio proteine giornaliero vs target ("anello proteine") 🟡 · ALTA
**Cosa:** sommare le proteine dei pasti spuntati e mostrare "112/120g" con anello prominente, **più visibile del
conteggio kcal**. Front-load ai pasti 1-2.
**Perché:** "protein leverage" — la fame persiste se le proteine sono basse, anche a calorie adeguate. È la vera
leva anti-abbandono. Più potente di MyFitnessPal perché i pasti sono predefiniti: niente ricerca cibi.
**Dipendenza:** richiede un campo proteine stimato per item nei dati (lavoro **Data engineer** su `DIET_DATA`).

### 2.2 — Tracking peso con mini-grafico trend 🟡 · ALTA
**Cosa:** array `{data, peso}` in localStorage + sparkline SVG a mano (niente librerie, come l'anello esistente).
**Perché:** per LEI (sovrappeso + ipotiroidismo) il trend peso è il KPI clinico principale, da rivalutare ogni
4-6 settimane come dice il disclaimer; per LUI utile per massa/proteine.

### 2.3 — Alert "soglia minima 1.400 kcal" per LEI 🟡 · ALTA (sicurezza)
**Cosa:** se l'introito stimato di LEI scende sotto 1.400 kcal per ≥2 giorni, avviso morbido "stai mangiando
troppo poco: rischio per tiroide ed energia".
**Perché:** il floor calorico è un **limite di sicurezza attivo** (T3/cortisolo/ciclo), non un obiettivo. Da
collegare al recap mostrabile al medico. *Dipende da una stima kcal per pasto.*

### 2.4 — Log mood/energia giornaliero (lui/lei) 🟡 · MEDIA
**Cosa:** 1 tap/giorno su scala icone (Ottimo/Bene/OK/Stanco/In difficoltà), con storico.
**Perché:** per narcolessia+ADHD l'energia/sonnolenza è cruciale; per ipotiroidismo stanchezza/umore sono sintomi
chiave da osservare nel tempo e portare in visita.

### 2.5 — Indicatore "regolarità" (sveglia · pasto 1 · sonno) 🟡 · MEDIA-ALTA
**Cosa:** varianza settimanale degli orari chiave per profilo; verde se entro ±30-45 min.
**Perché:** la **regolarità degli orari** è il denominatore comune che migliora TUTTE le loro condizioni
(narcolessia, ADHD, ipotiroidismo, fasting femminile) — metrica ad alto impatto e basso costo.

### 2.6 — Anello idratazione + distinzione fame/sete 🟢 · MEDIA
**Cosa:** contatore bicchieri/giorno con reminder nella fascia di digiuno e tip "prima di rompere il digiuno, bevi:
spesso è sete".
**Perché:** sete e disidratazione si mascherano da fame e affaticamento; aiuta vigilanza di LUI e aderenza di LEI.

### 2.7 — Diario sintomi + note pre-visita (esportabile) 🟡 · MEDIA
**Cosa:** form note datato, incluso nell'export backup esistente; raccoglie anche il flag "da segnalare al
nutrizionista".
**Perché:** hanno **4 curanti** (endocrinologo, neurologo, parodontologo, nutrizionista): un log esportabile rende
le visite più produttive (modello ThyForLife/Paloma, ma multi-condizione).

### 2.8 — Grafici aderenza SVG (30 giorni) 🟡 · MEDIA
**Cosa:** sparkline/barre % completamento, stesso approccio "SVG a mano" dell'anello. Nessuna libreria.

---

## 🩺 FASE 3 — Feature clinic-aware (uniche, da research v2)
Micro-funzioni che traducono l'evidenza in azione. Sempre con disclaimer; i punti integratori restano "da discutere".

### 3.1 — Badge "ordine del piatto": verdure → proteine → carbo 🟢 · ALTA
**Cosa:** badge a 3 step sulle card pasto + micro-tip "carbo per ultimi = meno crollo dopo pranzo".
**Perché:** doppio beneficio — anti-sonnolenza per LUI (meno picco glicemico/orexina) e anti-picco/anti-biofilm per
LEI (gengive). Razionale comune a 3 patologie.

### 3.2 — Card "come rompo il digiuno" sul pasto 1 🟢 · MEDIA
**Cosa:** ordine consigliato (proteine+grassi+verdura, carbo dopo) + 2-3 esempi conformi ai loro vincoli.
**Perché:** dopo il digiuno la sensibilità al glucosio è alta e il primo boccone determina il picco.

### 3.3 — Reminder risciacquo (due livelli) + post-pasto LEI 🟢 · MEDIA
**Cosa:** promemoria post-pasto: **acqua sempre**, **bicarbonato** solo dopo pasti segnalati come acidi/dolci; tip
"non spazzolare nei 30 min dopo cibi acidi".
**Perché:** vincolo clinico unico di LEI (parodontite) che nessun competitor potrà mai avere. ⚠️ [DENTISTA] conferma.

### 3.4 — Reminder integratori con orario + logica clinica 🟡 · MEDIA
**Cosa:** la checklist integratori (già esistente) mostra orario suggerito e nota clinica per riga (zinco LEI
separato dai latticini, magnesio sera, tutto a pranzo, ≥4h dalla levotiroxina).
**Perché:** i vincoli sono complessi e facili da sbagliare; ridurre errori. *Dati già in `DIET_DATA.integratori`.*

### 3.5 — Semaforo caffeina dose-dipendente (LUI) 🟢 · MEDIA
**Cosa:** verde fino a ~18:00, giallo 18-19 (solo dose piccola), rosso dopo; tip "tazza grande/doppia → anticipa".
**Perché:** raffina il vincolo esistente con la regola dose × distanza dal sonno (target 04:00).

### 3.6 — Coaching "prima settimana" 🟢 · MEDIA
**Cosa:** durante i primi 7-10 giorni di protocollo, messaggi che spiegano che la fame iniziale è transitoria.
**Perché:** la fame edonica è massima all'inizio e poi si adatta: saperlo aumenta l'aderenza.

### 3.7 — Reminder "luce + movimento entro 30-60 min dal risveglio" 🟡 · MEDIA
**Cosa:** reminder agganciato all'**ora di sveglia reale** (non a un'ora fissa), con avvertenza sulla luce serale.
**Perché:** riduce l'inerzia del sonno di LUI. ⚠️ Rimappato sul cronotipo (sveglia ~12:00), non sull'alba.

### 3.8 — Tracker pisolino / "nappuccino" (LUI) 🟢 · BASSA
**Cosa:** finestra suggerita (~2-4 h dopo il risveglio) + tracker pisolino sì/no+durata da mostrare al medico.

### 3.9 — Tracker ciclo discreto + "finestra morbida" (LEI) 🟡 · BASSA-MEDIA · solo locale
**Cosa:** in fase premestruale/mestruale suggerisce finestra 14:10 e disattiva nudge di restrizione.
**Perché:** fasting non ciclo-consapevole può alzare cortisolo e disturbare ciclo/tiroide. ⚠️ [MEDICO]. Privacy: solo localStorage.

---

## 🍽️ FASE 4 — Contenuti (Content/recipes)

### 4.1 — Integrare 15 nuove ricette r29–r43 🟢 · ALTA
**Cosa:** aggiungere all'array `RECIPES` le ricette già progettate e verificate (5 P1, 5 P2, 4 P3, 1 jolly).
Nuove proteine: cannellini, ceci, lenticchie verdi, platessa/nasello, coniglio. Nuovi formati: parmigiana bianca,
gnocchi morbidi, porridge salato, clafoutis, polpettone di pollo, zuppa ceci-farro, nicecream, mug-cake.
**Perché:** varietà = aderenza; coperte tutte le fasce e le stagioni; tutte rispettano i divieti (verifica esplicita
fatta per ognuna, incluso lo **zero-tahin** nella crema di legumi di LEI).
**Nota:** per r34 (mug-cake) e r43 (toast in carrozza) la sicurezza uovo di LUI dipende dalla cottura effettiva →
inserita verifica "asciutto/dorato, non bavoso"; valutare col nutrizionista se imporre il forno.

### 4.2 — Tag ricette "pro-gengive (nitrati)" e "anti-infiammatorio" 🟢 · BASSA
**Cosa:** etichettare le ricette con verdure a foglia cotte / barbabietola e quelle a basso carico glicemico.
**Perché:** aiuta LEI a scegliere piatti che supportano le gengive; collega contenuto e clinica.

### 4.3 — Preferiti ricette ⭐ 🟢 · MEDIA
**Cosa:** stella su `recipe-card`, filtro "preferite", chiave `dieta_fav`.
**Perché:** con 40+ ricette ritrovare le buone diventa faticoso.

### 4.4 — Più varianti stagionali estate/inverno 🟢 · BASSA
**Cosa:** continuare ad ampliare il set bilanciando piatti freddi estivi e caldi invernali.

---

## 🔧 FASE 5 — Qualità tecnica & robustezza ✅ (v1.2.0, 2026-06-14)
Debiti emersi dall'audit. Tutti chiusi nella v1.2.0 (vedi CHANGELOG): 5.1 toggle in-place · 5.2 warning quota
(toast) · 5.3 banner aggiornamento SW · 5.4 a11y (anello/persona/aria-live AI) · 5.5 validazione import · 5.6
model id AI **verificati** (nessuna modifica: `claude-haiku-4-5` è l'alias corretto) · 5.7 tempi derivati + pop CSS.

### 5.1 — Toggle in-place invece di re-render integrale 🟡 · ALTA
**Cosa:** `renderOggi/renderPrep/renderSpesa` ricostruiscono tutto l'`innerHTML` a ogni spunta (es. `app.js:988`).
Aggiornare solo il bottone toccato + recap + anello (come già fatto per `renderPrep` con `details.open`).
**Perché:** riduce jank e il "lampeggio" dell'anello; preserva la posizione di scroll.

### 5.2 — Warning visibile su quota localStorage fallita 🟢 · MEDIA
**Cosa:** `setState` oggi ingoia in silenzio l'errore quota (`app.js:36`) → potenziale perdita dati silenziosa.
Mostrare avviso + proporre pruning dei `track_*` più vecchi di N mesi.

### 5.3 — Banner "aggiornamento pronto · Ricarica" (SW) 🟢 · MEDIA
**Cosa:** su `controllerchange` mostrare un banner di reload.
**Perché:** dopo un deploy i client aperti restano su asset misti finché non si chiude del tutto la PWA.

### 5.4 — Accessibilità: rifiniture WCAG 🟢 · MEDIA
**Cosa:** `aria-hidden="true"` sul `<text>` della % nell'anello (oggi letto due volte); `aria-live="polite"` sulle
risposte AI; `aria-pressed` sui 3 bottoni persona (oggi solo classe `.on`).

### 5.5 — Import backup: validazione valori 🟢 · BASSA
**Cosa:** l'import fa `setItem` diretto senza validare i valori; un backup manomesso può iniettare JSON malformato.
Rischio basso (file scelto dall'utente) ma da irrobustire.

### 5.6 — Verificare i model id AI al deploy 🟢 · BASSA
**Cosa:** confermare che `claude-opus-4-8` / `claude-sonnet-4-6` / `claude-haiku-4-5` siano gli id realmente serviti
dall'API (vedi skill `claude-api`); un id inesistente dà 400/404 gestito genericamente.

### 5.7 — Micro-debiti 🟢 · BASSA
**Cosa:** tempi hardcoded in `app.js:822` (~6h 35′, ~180 min) da derivare da `DIET_DATA`; micro-animazione "pop"
sulla spunta (`navigator.vibrate` è ignorato su iOS → solo CSS); Web Share API per condividere ricetta/spesa.

---

## 🤖 FASE 6 — Evoluzione AI & architettura

### 6.1 — AI proattiva contestuale 🟡 · MEDIA
**Cosa:** iniettare i log (mood/peso/aderenza/proteine) nel system prompt così l'assistente dà spunti
("LEI sotto 1.400 kcal da 3 giorni: attenzione").
**Perché:** differenzia da tutte le AI generiche dei competitor; riusa l'infrastruttura `assistant.js` esistente.

### 6.2 — Sync tra i 2 device — Opzione A (export/import con merge) 🟡 · MEDIA · realistica
**Cosa:** migliorare l'export con **merge intelligente** all'import (unione dei `track` per data, non sovrascrittura)
così i due si scambiano backup via AirDrop/iMessage e fondono i dati. **Funziona su iOS.**
**Perché:** dà l'80% del valore "condividiamo i progressi" senza backend, mantenendo privacy e offline intatti.

### 6.3 — Sync real-time — Opzione C (Supabase) 🔴 · FASE 2 condizionata
**Cosa:** backend leggero con tabella `tracking (coppia_id, data, persona, voci jsonb)`, **Row Level Security**
stretta, dati pseudonimizzati (nessun PII clinico), localStorage come cache offline-first con sync best-effort.
**Perché / trade-off:** rompe "zero backend" e introduce dati sanitari su server terzo (GDPR) → **solo con consenso
esplicito della coppia**. La API key resta comunque solo client. Progetto a sé, non prima delle Fasi 1-2.

---

## 🚫 Cose da NON fare (vincoli di piattaforma / scelte deliberate)
- **Web Push nativo / notifiche schedulate locali**: su iOS richiedono PWA installata **e un server push+VAPID** →
  incompatibili con "zero backend / offline-first". Le notifiche locali schedulate affidabili non esistono su iOS.
  → usare invece il `.ics` Calendario (1.4).
- **Badging API** (`setAppBadge`): non supportata su iOS Safari/PWA. Non prometterla.
- **Swipe orizzontale tra tab**: conflitto con le chip a scroll orizzontale (Ricette/Tips/Settimana).
- **File System Access API** per sync automatico su iCloud: non supportata su iOS Safari.
- **Reintrodurre la API key nell'export/import**: promessa privacy — resta esclusa.
- **Aggiungere integratori nuovi di default** (es. mio-inositolo): sempre e solo come "da discutere col medico".

---

## 🩹 Sicurezza & disclaimer (sempre validi)
L'app è uno strumento **organizzativo**, non sostituisce endocrinologo, neurologo, parodontologo o nutrizionista.
Rivalutare il piano ogni 4-6 settimane con esami (TSH, fT3, fT4). Tutti i punti [MEDICO]/[DENTISTA] della
`docs/research.md` (sez. 2, 5, 8) vanno confermati con i curanti prima di tradurli in feature attive.
