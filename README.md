# 🧬 Dieta AI — PWA Privata

Web app privata installabile su iPhone ("Aggiungi a schermata Home") che organizza il piano
nutrizionale **Digiuno Intermittente 16:8** della coppia, con meal prep, ricette, tips e assistente AI.

## Per chi è
- **LUI (35a)** — Narcolessia + ADHD · ~1.900–2.100 kcal/die
- **LEI (32a)** — Ipotiroidismo + Sovrappeso + Parodontite · ~1.450–1.600 kcal/die

## Tab dell'app
| Tab | Contenuto |
|---|---|
| 📅 **Oggi** | I 3 pasti del giorno con porzioni lui/lei, reminder integratori, check-list, recap giornaliero |
| 🗓️ **Settimana** | Piano completo Lun–Dom navigabile |
| 🍳 **Meal Prep** | Batch cooking domenica, timeline, contenitori, conservazione |
| 🍽️ **Ricette** | Ricette dettagliate con immagine, divise per momento, con filtri |
| 💡 **Tips** | Tips, tricks, alternative ragionate, biohacking |
| 🛒 **Spesa** | Lista spesa settimanale anti-spreco, spuntabile, con barra di progresso e "nascondi presi" |
| 📔 **Diario** | Storico aderenza + streak, heatmap, umore/energia, peso con grafico, regolarità orari, ciclo (lei), note per le visite — tutto solo sul dispositivo |
| 🤖 **AI** | Assistente AI che conosce tutta la dieta (serve API key Anthropic) |

La tab **Oggi** include anche: card "Come stai oggi" (umore + idratazione), coaching della prima settimana,
badge "ordine del piatto" e guida "come rompo il digiuno" sul Pasto 1. Le **Ricette** (43) hanno preferiti ⭐
e filtri clinici (#pro-gengive, #anti-infiammatorio).

## Installazione su iPhone (hosting protetto)
L'app contiene dati sanitari personali: va pubblicata **solo con accesso protetto**.
Segui **[docs/deploy.md](docs/deploy.md)** — guida passo-passo per:
- ⭐ **Cloudflare Pages + Access** (consigliata): login per email specifica, solo voi due
- 🔑 **Vercel + password condivisa**: il cancello è già pronto (`middleware.js` + variabile `APP_PASSWORD`)
- ⚠️ GitHub Pages: **non usarlo** — non si può proteggere
- Supabase: non è un hosting; utile in futuro per sincronizzare i dati tra dispositivi

Poi su iPhone: apri l'URL in **Safari** → login → **Condividi → Aggiungi a schermata Home**.
L'app funziona **offline** dopo la prima apertura.

### Test rapido in locale (PC)
**Doppio click su `serve.cmd`**: apre da solo il browser su http://localhost:8080.

A mano (l'errore tipico è non essere nella cartella giusta):
```powershell
cd "C:\Users\Andrea\Desktop\dieta ai"   # prima entra QUI (virgolette obbligatorie)
py -m http.server 8080                  # oppure: python -m http.server 8080
```
Se la porta è occupata, usa 8081. In locale non c'è password (sei solo tu sul PC).

## Assistente AI (coach)
La tab 🤖 AI è un coach che conosce a memoria piano settimanale, porzioni, divieti, integratori,
meal prep e ricette, e risponde nel rispetto dei vincoli clinici di entrambi. Dal pulsante ⚙️ si
sceglie il **modello**: **Kimi K2.6** (default) o **GLM-5.1**, entrambi via NVIDIA build.

**Niente API key da inserire sul telefono.** Le richieste passano dal vostro Worker Cloudflare
(`worker.js`, rotta `/api/coach`) che le inoltra a NVIDIA con la chiave tenuta **solo lato server**
come secret `NVIDIA_API_KEY` (vedi `docs/deploy.md`). Questo serve perché NVIDIA non accetta chiamate
dirette dal browser. La cronologia della chat resta solo sul dispositivo.

## Struttura progetto
```
index.html, manifest.webmanifest, sw.js, icons/
css/app.css
js/app.js, js/assistant.js
js/data/diet.js, js/data/recipes.js, js/data/tips.js
docs/research.md
ORCHESTRATOR.md  ← memoria fissa dell'orchestratore
```

## Aggiornare l'app (regola fissa)
A ogni modifica dei file dell'app, **incrementare la costante `CACHE` in `sw.js`**
(`dieta-v2` → `dieta-v3` → …): è ciò che fa arrivare la nuova versione ai dispositivi
già installati. Il service worker è network-first, quindi online gli aggiornamenti
arrivano comunque; il bump garantisce pulizia della cache vecchia.

Dalla **v1.2.0**, quando arriva una versione nuova mentre l'app è aperta compare in cima
un banner **"Aggiornamento pronto · Ricarica"**: un tap ricarica e applica la versione nuova
(i dati locali non si perdono). Per il flusso di deploy/aggiornamento vedi `docs/deploy.md`.

## Note privacy e dati
- Tutti i dati (spunte, preferenze, chat) vivono solo in localStorage sul dispositivo
- La API key Anthropic resta sul dispositivo e **non è inclusa nei backup esportati**
- Safari può cancellare i dati locali dopo ~7 giorni di non utilizzo: usa **Esporta backup** dal menu ⚙️ ogni tanto

> ⚠️ L'app è uno strumento organizzativo: non sostituisce endocrinologo, neurologo,
> parodontologo o nutrizionista. Rivalutare il piano ogni 4–6 settimane con esami.
>
> 📌 Da segnalare al nutrizionista: il file sorgente "Meal Prep Edition" suggerisce
> salsa di soia nell'hack fried rice, in contraddizione con il divieto di soia per lei.
> Nell'app è già stato corretto.
