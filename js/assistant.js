// ============================================================
// ASSISTANT — Tab "Assistente AI" della PWA Dieta 16:8 di coppia
// Chat con il coach via NVIDIA build, attraverso il proxy del Worker
// (POST /api/coach, stesso dominio → niente CORS). La key vive SOLO
// nel Worker (env.NVIDIA_API_KEY), mai nel client.
// Vanilla JS, nessuna dipendenza. Espone solo window.AssistantTab.
// Dati letti (in modo difensivo) da:
//   window.DIET_DATA · window.RECIPES · window.TIPS
// ============================================================

(function () {
  'use strict';

  // ---------- Costanti ----------
  var LS_MODEL = 'dieta_ai_model';
  var LS_CHAT = 'dieta_ai_chat';

  var API_URL = '/api/coach';   // proxy nel Worker, stesso dominio
  var MAX_TOKENS = 1024;
  var TEMPERATURE = 0.3;
  var HISTORY_SENT = 12;   // ultimi N messaggi inviati all'API
  var HISTORY_SAVED = 30;  // ultimi N messaggi persistiti in localStorage

  var MODELS = [
    { id: 'moonshotai/kimi-k2.6', label: 'Kimi K2.6 (default)' },
    { id: 'z-ai/glm-5.1', label: 'GLM-5.1' }
  ];
  var DEFAULT_MODEL = 'moonshotai/kimi-k2.6';

  var CHIPS = [
    'Cosa mangio oggi?',
    'Alternative al pasto 2 di oggi',
    'Posso sgarrare stasera?',
    'Ricetta veloce con quello che ho',
    'Promemoria integratori'
  ];

  // ---------- Stato ----------
  var mounted = false;
  var rootEl = null;
  var msgsEl = null;
  var inputEl = null;
  var sendBtn = null;
  var chipsEl = null;
  var bodyEl = null;
  var pending = false;
  var messages = [];            // { role: 'user'|'assistant'|'error', content }
  var cachedSystemPrompt = null;

  // ---------- Utility ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function getModel() {
    var m = '';
    try { m = localStorage.getItem(LS_MODEL) || ''; } catch (e) {}
    return MODELS.some(function (x) { return x.id === m; }) ? m : DEFAULT_MODEL;
  }
  function setModel(v) {
    // valida contro la whitelist, fallback al default
    if (!MODELS.some(function (x) { return x.id === v; })) v = DEFAULT_MODEL;
    try { localStorage.setItem(LS_MODEL, v); } catch (e) {}
  }

  function loadChat() {
    try {
      var raw = localStorage.getItem(LS_CHAT);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.filter(function (m) {
        return m && typeof m.content === 'string' &&
          (m.role === 'user' || m.role === 'assistant' || m.role === 'error');
      });
    } catch (e) { return []; }
  }
  function saveChat() {
    try { localStorage.setItem(LS_CHAT, JSON.stringify(messages.slice(-HISTORY_SAVED))); } catch (e) {}
  }

  function truncate(s, n) {
    s = String(s || '').replace(/\s+/g, ' ').trim();
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }

  // ---------- Markdown minimale e sicuro ----------
  // Escape HTML PRIMA, poi solo: **bold**, *italic*, `code`, liste "-", titoli ##, a capo.
  function mdInline(safe) {
    return safe
      .replace(/`([^`]+)`/g, '<code class="ai-code">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  }

  function mdToHtml(src) {
    var lines = escapeHtml(src).split(/\r?\n/);
    var html = '';
    var inList = false;
    function closeList() { if (inList) { html += '</ul>'; inList = false; } }
    for (var i = 0; i < lines.length; i++) {
      var t = lines[i].trim();
      if (/^[-*•]\s+/.test(t)) {
        if (!inList) { html += '<ul class="ai-ul">'; inList = true; }
        html += '<li>' + mdInline(t.replace(/^[-*•]\s+/, '')) + '</li>';
      } else if (/^#{1,4}\s+/.test(t)) {
        closeList();
        html += '<div class="ai-h">' + mdInline(t.replace(/^#{1,4}\s+/, '')) + '</div>';
      } else if (t === '') {
        closeList();
        html += '<div class="ai-sp"></div>';
      } else {
        closeList();
        html += '<p class="ai-p">' + mdInline(t) + '</p>';
      }
    }
    closeList();
    return html;
  }

  // ---------- System prompt (statico, cacheable, costruito una volta) ----------
  function buildSystemPrompt() {
    if (cachedSystemPrompt) return cachedSystemPrompt;

    var D = (typeof window !== 'undefined' && window.DIET_DATA) || {};
    var R = Array.isArray(window.RECIPES) ? window.RECIPES : [];
    var T = Array.isArray(window.TIPS) ? window.TIPS : [];
    var L = [];

    // (1) Ruolo
    L.push('Sei l\'assistente nutrizionale personale di una coppia che segue un piano alimentare 16:8 (digiuno intermittente) progettato su misura da un nutrizionista, con vincoli clinici precisi. Vivono con orari notturni: sveglia ~12:00, sonno ~04:00. Conosci a memoria il loro piano settimanale, le ricette alternative e le regole cliniche riportate qui sotto: rispondi SOLO basandoti su questi dati.');
    L.push('');

    // (2) Profili e vincoli assoluti
    var lui = (D.persone && D.persone.lui) || {};
    var lei = (D.persone && D.persone.lei) || {};
    L.push('## PROFILI');
    L.push('- LUI, ' + (lui.eta || 35) + ' anni: ' + ((lui.condizioni || ['Narcolessia', 'ADHD']).join(' + ')) + '. Lavora spesso di notte.');
    L.push('- LEI, ' + (lei.eta || 32) + ' anni: ' + ((lei.condizioni || ['Ipotiroidismo', 'Sovrappeso', 'Parodontite']).join(' + ')) + '. In cura parodontale: serve cibo morbido e ZERO semi.');
    L.push('');

    L.push('## FINESTRA ALIMENTARE (uguale ogni giorno)');
    (D.finestra || []).forEach(function (f) {
      L.push('- ' + (f.ora || '') + ' ' + (f.evento || '') + (f.dettaglio ? ' — ' + f.dettaglio : ''));
    });
    L.push('');

    L.push('## DIVIETI ASSOLUTI (non proporre MAI questi alimenti, nemmeno come variante)');
    L.push('LUI:');
    ((D.divieti && D.divieti.lui) || []).forEach(function (v) { L.push('- ' + v); });
    L.push('LEI:');
    ((D.divieti && D.divieti.lei) || []).forEach(function (v) { L.push('- ' + v); });
    L.push('Frutta consentita a LEI (lista chiusa): banana, melone, mango, pesca sbucciata, albicocca sbucciata, pera sbucciata morbida.');
    L.push('');

    L.push('## ALTERNATIVE AL POMODORO PER LEI');
    (D.pomodoroAlternative || []).forEach(function (a) { L.push('- ' + a); });
    L.push('');

    // (3) Target macro
    var tg = D.target || {};
    L.push('## TARGET GIORNALIERI');
    if (tg.lui) L.push('- LUI: proteine ' + tg.lui.proteine + ' · carbo ' + tg.lui.carboidrati + ' · grassi ' + tg.lui.grassi + ' · ' + tg.lui.calorie);
    if (tg.lei) L.push('- LEI: proteine ' + tg.lei.proteine + ' · carbo ' + tg.lei.carboidrati + ' · grassi ' + tg.lei.grassi + ' · ' + tg.lei.calorie + (tg.lei.notaCalorie ? ' (' + tg.lei.notaCalorie + ')' : ''));
    L.push('');

    // (4) Integratori
    L.push('## INTEGRATORI E TIMING');
    (D.integratori || []).forEach(function (s) {
      L.push('- ' + (s.nome || '') + ' (' + (s.persona || 'entrambi') + '): ' + (s.timing || '') + ' — ' + truncate(s.note, 140));
    });
    if (D.integratoriSoluzione) L.push('Regola pratica: ' + D.integratoriSoluzione);
    L.push('');

    // (5) Piano settimanale completo, compatto
    L.push('## PIANO SETTIMANALE (porzioni "lui / lei")');
    (D.giorni || []).forEach(function (g) {
      L.push('### ' + (g.nome || g.id || '') + (g.sottotitolo ? ' — ' + g.sottotitolo : ''));
      (g.pasti || []).forEach(function (p) {
        L.push('P' + (p.n || '?') + ' ' + (p.ora || '') + ' — ' + (p.titolo || ''));
        (p.items || []).forEach(function (it) {
          L.push('- ' + (it.alimento || '') + ': lui ' + (it.lui || '—') + ' / lei ' + (it.lei || '—'));
        });
        if (p.nota) L.push('Nota: ' + truncate(p.nota, 130));
      });
    });
    L.push('');

    // (6) Ricettario alternative
    L.push('## RICETTE ALTERNATIVE DISPONIBILI (' + R.length + ')');
    L.push('Tutte rispettano i vincoli della coppia. Se l\'utente chiede una ricetta per nome, descrivila in dettaglio (ingredienti con porzioni lui/lei e passaggi sono nel ricettario dell\'app: puoi ricostruirli in modo coerente con i vincoli).');
    R.forEach(function (r) {
      var momento = Array.isArray(r.momento) ? r.momento.join('/') : '';
      var chi = r.persona && r.persona !== 'entrambi' ? ' · solo ' + r.persona : '';
      L.push('- ' + (r.nome || '') + ' [' + momento + ', ' + (r.tempoMin || '?') + ' min' + chi + '] — ' + truncate(r.descrizione, 110));
    });
    L.push('');

    // (7) Regole cliniche chiave (da ricerca) + biohacking
    L.push('## REGOLE CLINICHE CHIAVE (sintesi ricerca)');
    L.push('- LEVOTIROXINA (lei, se prescritta): a stomaco vuoto, stessa ora ogni giorno (ideale ore 12:00 appena sveglia con sola acqua). Regola memorizzabile: "pillola tiroide → 1 ora niente caffè, 4 ore niente calcio/ferro/zinco/magnesio/soia". Il caffè riduce l\'assorbimento del 27–36%. Soia e pasti molto ricchi di fibre interferiscono.');
    L.push('- Ipotiroidismo + 16:8: ok se ben controllato e con calorie adeguate; MAI sotto 1.400 kcal per lei (la restrizione eccessiva abbassa la T3 e rallenta la tiroide).');
    L.push('- Brassicacee (broccoli, cavolfiore, verza) per lei: SOLO ben cotte ≥70° (i goitrogeni si inattivano col calore). Mai crude.');
    L.push('- Narcolessia (lui): i picchi glicemici inibiscono l\'orexina → sonnolenza. Proteine per prime al Pasto 1 (tirosina → dopamina), mai carboidrati raffinati da soli, camminata 15 min post-pranzo. Ultimo caffè entro le 17–18 (emivita caffeina 5–6 ore, dorme alle 04:00).');
    L.push('- Parodontite (lei): risciacquo con bicarbonato (½ cucchiaino in acqua tiepida) dopo OGNI pasto, poi attendere 30 min prima di spazzolare. Omega-3, CoQ10, vit. C e D sono supporto adiuvante, non sostituiscono il dentista.');
    L.push('- Zinco (lei): il calcio dei latticini ne riduce l\'assorbimento ~50% → prenderlo nel pasto SENZA formaggi (di solito P3) e separato ≥4h dalla levotiroxina. Magnesio la sera (~23:00), separato dallo zinco.');
    L.push('- D3+K2, Omega-3, CoQ10: liposolubili → con il pasto grasso delle 13:00.');
    L.push('');
    L.push('## ABITUDINI BIOHACKING DEL PIANO');
    var bh = D.biohacking || {};
    (bh.lui || []).forEach(function (b) { L.push('- LUI: ' + (b.abitudine || '') + ' (' + (b.quando || '') + ') — ' + truncate(b.perche, 90)); });
    (bh.lei || []).forEach(function (b) { L.push('- LEI: ' + (b.abitudine || '') + ' (' + (b.quando || '') + ') — ' + truncate(b.perche, 90)); });
    L.push('');

    // Tips disponibili (titoli compatti per categoria, per richiamarli)
    if (T.length) {
      L.push('## CONSIGLI PRATICI GIA\' NELL\'APP (richiamali quando pertinenti)');
      var byCat = {};
      T.forEach(function (t) {
        var c = t.categoria || 'altro';
        (byCat[c] = byCat[c] || []).push(t.titolo || '');
      });
      Object.keys(byCat).forEach(function (c) {
        L.push('- ' + c + ': ' + byCat[c].join(' · '));
      });
      L.push('');
    }

    // (8) Comportamento
    L.push('## COME DEVI COMPORTARTI');
    L.push('- Rispondi SEMPRE in italiano, in modo conciso, pratico e diretto. Usa elenchi puntati quando aiutano. Formattazione: solo **grassetto**, *corsivo*, `codice`, elenchi con "-" e titoli "##".');
    L.push('- Rispetta SEMPRE i divieti: MAI proporre semi, cibi duri/croccanti, pomodoro fresco intero o frutta vietata a LEI; MAI uova non ben cotte, tonno, salmone, yogurt o ricotta a LUI. Vale anche per varianti, ristoranti e sgarri.');
    L.push('- Quando l\'utente vuole variare un pasto, proponi alternative compatibili con i vincoli di ENTRAMBI (o specifica per chi vale), attingendo prima dal ricettario e dal piano.');
    L.push('- Se ti chiedono "cosa mangio oggi/adesso", usa il giorno e l\'ora correnti (forniti nel contesto runtime) per indicare il pasto giusto del piano.');
    L.push('- Sgarri: tono comprensivo, mai colpevolizzante. Uno sgarro isolato è rumore statistico: NON suggerire mai di compensare digiunando di più o scendendo sotto le calorie minime. Se una cena finisce dopo le 21, suggerisci di spostare la finestra, non di romperla.');
    L.push('- Domande mediche (dosi di farmaci, sintomi, modifiche cliniche, TSH, terapie): NON rispondere con prescrizioni; rimanda con gentilezza a medico/endocrinologo/parodontologo. Puoi spiegare i principi generali già nel piano.');
    L.push('- Tono: incoraggiante, da coach alleato della coppia. Quando utile distingui le risposte "per lui" e "per lei".');
    if (D.disclaimer) L.push('- Ricorda: ' + D.disclaimer);

    cachedSystemPrompt = L.join('\n');
    return cachedSystemPrompt;
  }

  // Contesto dinamico: blocco SEPARATO, appeso al system prompt a ogni invio.
  function buildRuntimeContext() {
    var giorni = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    var mesi = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    return 'Contesto runtime: oggi è ' + giorni[now.getDay()] + ' ' + now.getDate() + ' ' + mesi[now.getMonth()] + ' ' + now.getFullYear() + ', ore ' + hh + ':' + mm + ' (ora locale). Usalo per capire qual è il giorno del piano e quale pasto è il prossimo.';
  }

  // ---------- Storia per l'API: ultimi 12, ruoli alternati, primo = user ----------
  function buildHistory() {
    var filtered = messages.filter(function (m) { return m.role === 'user' || m.role === 'assistant'; });
    var alt = [];
    filtered.forEach(function (m) {
      if (alt.length && alt[alt.length - 1].role === m.role) {
        // unisci messaggi consecutivi con lo stesso ruolo (es. user dopo un errore)
        alt[alt.length - 1] = { role: m.role, content: alt[alt.length - 1].content + '\n\n' + m.content };
      } else {
        alt.push({ role: m.role, content: m.content });
      }
    });
    var hist = alt.slice(-HISTORY_SENT);
    while (hist.length && hist[0].role !== 'user') hist.shift();
    return hist;
  }

  // Costruisce l'array OpenAI completo: system + runtime + storico alternato.
  function buildApiMessages() {
    var out = [
      { role: 'system', content: buildSystemPrompt() + '\n\n' + buildRuntimeContext() }
    ];
    buildHistory().forEach(function (m) { out.push(m); });
    return out;
  }

  // ---------- Chiamata API (proxy Worker, formato OpenAI) ----------
  function callApi() {
    var body = {
      model: getModel(),
      messages: buildApiMessages(),
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE
    };

    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        // Errore esplicito dal Worker / upstream
        var errMsg = data && data.error;
        if (errMsg || !res.ok) {
          var raw = typeof errMsg === 'string' ? errMsg : (errMsg && errMsg.message) || ('Errore ' + res.status);
          // Key non configurata nel Worker → messaggio dedicato
          if (/NVIDIA_API_KEY|non configurata|non ancora configurat/i.test(raw)) {
            throw new Error('Coach non ancora configurato (manca NVIDIA_API_KEY nel Worker).');
          }
          throw new Error('Coach non disponibile: ' + raw);
        }
        var choice = data && Array.isArray(data.choices) && data.choices[0];
        var text = choice && choice.message && typeof choice.message.content === 'string'
          ? choice.message.content
          : '';
        return text.trim() || 'Risposta vuota dal modello. Riprova.';
      });
    }, function () {
      throw new Error('Coach non disponibile: connessione assente o bloccata. Controlla la rete e riprova.');
    });
  }

  // ---------- Stili ----------
  function injectStyles() {
    if (document.getElementById('ai-assistant-style')) return;
    var css = '' +
      '.ai-root{display:flex;flex-direction:column;min-height:100%;font-family:var(--font);color:var(--text);position:relative;}' +
      '.ai-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--bg);z-index:5;}' +
      '.ai-head-title{font-weight:700;font-size:16px;flex:1;display:flex;align-items:center;gap:8px;}' +
      '.ai-dot{width:8px;height:8px;border-radius:50%;background:var(--ok);flex:none;}' +
      '.ai-iconbtn{min-width:44px;min-height:44px;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:var(--radius-sm);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;}' +
      '.ai-iconbtn:active{background:var(--surface-2);}' +
      '.ai-body{flex:1 1 auto;display:flex;flex-direction:column;}' +
      // Messaggi
      '.ai-msgs{flex:1 1 auto;display:flex;flex-direction:column;gap:10px;padding:14px 12px 8px;}' +
      '.ai-bubble{max-width:86%;padding:10px 14px;border-radius:var(--radius);font-size:15px;line-height:1.45;box-shadow:var(--shadow);overflow-wrap:break-word;}' +
      '.ai-bubble-user{align-self:flex-end;background:var(--accent);color:var(--accent-ink);border-bottom-right-radius:4px;}' +
      '.ai-bubble-ai{align-self:flex-start;background:var(--surface);border:1px solid var(--border);border-bottom-left-radius:4px;}' +
      '.ai-bubble-err{align-self:flex-start;background:color-mix(in srgb,var(--danger) 12%,var(--surface));border:1px solid var(--danger);color:var(--text);}' +
      '.ai-bubble-err::before{content:"⚠️ ";}' +
      '.ai-p{margin:0 0 2px;}.ai-sp{height:6px;}' +
      '.ai-h{font-weight:700;margin:6px 0 2px;font-size:15px;}' +
      '.ai-ul{margin:2px 0 4px;padding-left:18px;}.ai-ul li{margin:2px 0;}' +
      '.ai-code{background:var(--surface-2);border:1px solid var(--border);border-radius:4px;padding:0 4px;font-size:13px;}' +
      '.ai-bubble-user .ai-code{background:rgba(0,0,0,.12);border-color:transparent;color:inherit;}' +
      // Typing
      '.ai-typing{align-self:flex-start;display:flex;gap:5px;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);border-bottom-left-radius:4px;}' +
      '.ai-typing i{width:7px;height:7px;border-radius:50%;background:var(--text-dim);animation:ai-blink 1.2s infinite;}' +
      '.ai-typing i:nth-child(2){animation-delay:.2s;}.ai-typing i:nth-child(3){animation-delay:.4s;}' +
      '@keyframes ai-blink{0%,80%,100%{opacity:.25;transform:translateY(0);}40%{opacity:1;transform:translateY(-3px);}}' +
      '.ai-typing-label{align-self:flex-start;font-size:12px;color:var(--text-dim);margin:-4px 0 0 6px;}' +
      // Chips
      '.ai-chips{display:flex;flex-wrap:wrap;gap:8px;padding:6px 12px 8px;}' +
      '.ai-chip{min-height:44px;padding:8px 14px;border-radius:999px;background:var(--surface);border:1px solid var(--border);color:var(--text);font-size:14px;cursor:pointer;font-family:var(--font);}' +
      '.ai-chip:active{background:var(--surface-2);border-color:var(--accent);}' +
      // Input bar (sticky bottom dentro la tab, non fixed)
      '.ai-inputbar{position:sticky;bottom:0;z-index:6;background:var(--bg);border-top:1px solid var(--border);padding:8px 12px calc(8px + env(safe-area-inset-bottom,0px));display:flex;gap:8px;align-items:flex-end;}' +
      '.ai-input{flex:1;min-height:44px;max-height:120px;resize:none;padding:11px 14px;border-radius:var(--radius);border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:16px;font-family:var(--font);line-height:1.35;outline:none;}' +
      '.ai-input:focus{border-color:var(--accent);}' +
      '.ai-send{min-width:48px;min-height:44px;border-radius:var(--radius);border:none;background:var(--accent);color:var(--accent-ink);font-size:18px;cursor:pointer;flex:none;}' +
      '.ai-send:disabled{opacity:.45;cursor:default;}' +
      // Setup / impostazioni
      '.ai-setup{max-width:480px;margin:0 auto;padding:28px 16px;display:flex;flex-direction:column;gap:14px;}' +
      '.ai-setup-emoji{font-size:40px;text-align:center;}' +
      '.ai-setup h2{margin:0;font-size:20px;text-align:center;}' +
      '.ai-setup-desc{color:var(--text-dim);font-size:14px;line-height:1.5;margin:0;text-align:center;}' +
      '.ai-field{display:flex;flex-direction:column;gap:6px;}' +
      '.ai-label{font-size:13px;font-weight:600;color:var(--text-dim);}' +
      '.ai-select{min-height:44px;padding:10px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:15px;font-family:var(--font);}' +
      '.ai-btn{min-height:46px;border-radius:var(--radius);border:none;background:var(--accent);color:var(--accent-ink);font-size:16px;font-weight:600;cursor:pointer;font-family:var(--font);}' +
      '.ai-btn:disabled{opacity:.45;}' +
      '.ai-btn-ghost{background:var(--surface);color:var(--text);border:1px solid var(--border);}' +
      '.ai-privacy{font-size:12.5px;color:var(--text-dim);line-height:1.5;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;margin:0;}' +
      // Vuoto
      '.ai-empty{text-align:center;color:var(--text-dim);font-size:14px;padding:26px 20px 8px;line-height:1.5;}' +
      '.ai-empty b{color:var(--text);}';
    var style = document.createElement('style');
    style.id = 'ai-assistant-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---------- UI: impostazioni (solo scelta modello) ----------
  function renderSettings() {
    bodyEl.textContent = '';
    var wrap = el('div', 'ai-setup');

    wrap.appendChild(el('div', 'ai-setup-emoji', '🤖'));
    wrap.appendChild(el('h2', null, 'Impostazioni assistente'));

    var desc = el('p', 'ai-setup-desc');
    desc.textContent = 'Scegli il modello che il coach userà per rispondere. Conosce a memoria il vostro piano 16:8, i divieti di entrambi, le ricette e gli integratori.';
    wrap.appendChild(desc);

    // Selettore modello
    var fieldModel = el('div', 'ai-field');
    fieldModel.appendChild(el('label', 'ai-label', 'Modello'));
    var select = document.createElement('select');
    select.className = 'ai-select';
    MODELS.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.label;
      select.appendChild(opt);
    });
    select.value = getModel();
    fieldModel.appendChild(select);
    wrap.appendChild(fieldModel);

    // Salva
    var save = el('button', 'ai-btn', 'Salva impostazioni');
    save.type = 'button';
    save.addEventListener('click', function () {
      setModel(select.value);
      renderChat();
    });
    wrap.appendChild(save);

    var back = el('button', 'ai-btn ai-btn-ghost', 'Annulla');
    back.type = 'button';
    back.addEventListener('click', function () { renderChat(); });
    wrap.appendChild(back);

    var privacy = el('p', 'ai-privacy');
    privacy.textContent = '🔒 Privacy: le domande passano dal vostro Worker su Cloudflare e da lì al modello selezionato. Nessuna chiave è salvata su questo dispositivo. La cronologia resta solo qui (localStorage).';
    wrap.appendChild(privacy);

    bodyEl.appendChild(wrap);
  }

  // ---------- UI: chat ----------
  function renderChat() {
    bodyEl.textContent = '';

    msgsEl = el('div', 'ai-msgs');
    // Live region: le risposte dell'assistente (appese in redrawMessages) vengono
    // annunciate dagli screen reader. Contenitore stabile (creato una sola volta),
    // così l'annuncio non si rompe quando i messaggi vengono ridisegnati.
    msgsEl.setAttribute('aria-live', 'polite');
    msgsEl.setAttribute('aria-atomic', 'false');
    bodyEl.appendChild(msgsEl);

    chipsEl = el('div', 'ai-chips');
    CHIPS.forEach(function (c) {
      var chip = el('button', 'ai-chip', c);
      chip.type = 'button';
      chip.addEventListener('click', function () { sendMessage(c); });
      chipsEl.appendChild(chip);
    });
    bodyEl.appendChild(chipsEl);

    var bar = el('div', 'ai-inputbar');
    inputEl = document.createElement('textarea');
    inputEl.className = 'ai-input';
    inputEl.rows = 1;
    inputEl.placeholder = 'Chiedi qualcosa sul piano…';
    inputEl.setAttribute('enterkeyhint', 'send');
    inputEl.addEventListener('input', autoGrow);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value);
      }
    });
    sendBtn = el('button', 'ai-send', '➤');
    sendBtn.type = 'button';
    sendBtn.setAttribute('aria-label', 'Invia');
    sendBtn.addEventListener('click', function () { sendMessage(inputEl.value); });
    bar.appendChild(inputEl);
    bar.appendChild(sendBtn);
    bodyEl.appendChild(bar);

    redrawMessages();
  }

  function autoGrow() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
  }

  function bubbleFor(m) {
    var b;
    if (m.role === 'user') {
      b = el('div', 'ai-bubble ai-bubble-user');
      b.textContent = m.content;
    } else if (m.role === 'error') {
      b = el('div', 'ai-bubble ai-bubble-err');
      b.textContent = m.content;
    } else {
      b = el('div', 'ai-bubble ai-bubble-ai');
      b.innerHTML = mdToHtml(m.content); // contenuto già escapato dentro mdToHtml
    }
    return b;
  }

  function redrawMessages() {
    msgsEl.textContent = '';
    if (!messages.length) {
      var empty = el('div', 'ai-empty');
      empty.innerHTML = 'Ciao! Sono l\'assistente del vostro piano <b>16:8</b>.<br>Conosco pasti, divieti, ricette e integratori di entrambi.<br>Tocca un suggerimento o scrivi una domanda. 👇';
      msgsEl.appendChild(empty);
    } else {
      messages.forEach(function (m) { msgsEl.appendChild(bubbleFor(m)); });
    }
    updateChips();
    scrollToBottom();
  }

  function updateChips() {
    if (chipsEl) chipsEl.style.display = messages.length ? 'none' : 'flex';
  }

  function scrollToBottom() {
    if (!msgsEl || !msgsEl.lastElementChild) return;
    var reduce = false;
    try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    try { msgsEl.lastElementChild.scrollIntoView({ block: 'end', behavior: reduce ? 'auto' : 'smooth' }); } catch (e) {}
  }

  var typingEl = null;
  function showTyping() {
    hideTyping();
    typingEl = el('div');
    var t = el('div', 'ai-typing');
    t.appendChild(el('i')); t.appendChild(el('i')); t.appendChild(el('i'));
    typingEl.appendChild(t);
    typingEl.appendChild(el('div', 'ai-typing-label', 'sta scrivendo…'));
    msgsEl.appendChild(typingEl);
    scrollToBottom();
  }
  function hideTyping() {
    if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
    typingEl = null;
  }

  function sendMessage(text) {
    text = String(text || '').trim();
    if (!text || pending) return;

    pending = true;
    sendBtn.disabled = true;
    inputEl.value = '';
    autoGrow();

    messages.push({ role: 'user', content: text });
    saveChat();
    redrawMessages();
    showTyping();

    callApi().then(function (reply) {
      messages.push({ role: 'assistant', content: reply });
    }).catch(function (err) {
      messages.push({ role: 'error', content: (err && err.message) || 'Errore imprevisto. Riprova.' });
    }).then(function () {
      pending = false;
      sendBtn.disabled = false;
      hideTyping();
      saveChat();
      redrawMessages();
    });
  }

  function newChat() {
    if (pending) return;
    messages = [];
    try { localStorage.removeItem(LS_CHAT); } catch (e) {}
    renderChat();
  }

  // ---------- Mount ----------
  function mount(container) {
    if (!container || mounted) return;
    mounted = true;
    injectStyles();

    messages = loadChat();

    rootEl = el('div', 'ai-root');

    var head = el('div', 'ai-head');
    var title = el('div', 'ai-head-title');
    title.appendChild(el('span', 'ai-dot'));
    title.appendChild(document.createTextNode('Assistente AI'));
    head.appendChild(title);

    var newBtn = el('button', 'ai-iconbtn', '🗑');
    newBtn.type = 'button';
    newBtn.title = 'Nuova chat';
    newBtn.setAttribute('aria-label', 'Nuova chat');
    newBtn.addEventListener('click', newChat);
    head.appendChild(newBtn);

    var gearBtn = el('button', 'ai-iconbtn', '⚙️');
    gearBtn.type = 'button';
    gearBtn.title = 'Cambia modello';
    gearBtn.setAttribute('aria-label', 'Impostazioni: cambia modello');
    gearBtn.addEventListener('click', function () { renderSettings(); });
    head.appendChild(gearBtn);

    rootEl.appendChild(head);

    bodyEl = el('div', 'ai-body');
    rootEl.appendChild(bodyEl);

    container.appendChild(rootEl);

    renderChat();
  }

  window.AssistantTab = { mount: mount };
})();
