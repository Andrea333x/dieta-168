// ============================================================
// Dieta 16:8 — App principale (vanilla JS, zero dipendenze)
// 7 sezioni: Oggi · Settimana · Ricette · Tips · Prep · Spesa · AI
// Stato in localStorage con prefisso "dieta_".
// ============================================================
'use strict';

(function () {

  var D = window.DIET_DATA || {};
  var RECIPES = window.RECIPES || [];
  var TIPS = window.TIPS || [];

  // ---------------------------------------------------------
  // Utility
  // ---------------------------------------------------------
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slug(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function getState(key, fallback) {
    try {
      var v = localStorage.getItem('dieta_' + key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function setState(key, val) {
    try { localStorage.setItem('dieta_' + key, JSON.stringify(val)); }
    catch (e) {
      // quota piena: avvisa l'utente invece di perdere dati in silenzio
      if (e && (e.name === 'QuotaExceededError' || e.code === 22 || /quota/i.test(String(e)))) {
        toast('Memoria piena: alcuni dati potrebbero non essere salvati. Esporta un backup e libera spazio.', 'warn');
      }
    }
  }

  // ---------------------------------------------------------
  // Toast non invasivo (role=status, aria-live, auto-dismiss)
  // Safe se il DOM non è ancora pronto (setState parte presto).
  // ---------------------------------------------------------
  var toastTimer = null;
  function toast(msg, kind) {
    if (!document || !document.body) return;
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.className = (kind === 'warn' ? 'warn' : '');
    el.textContent = String(msg == null ? '' : msg);
    // forza reflow per riattivare la transizione anche su toast ripetuti
    void el.offsetWidth;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 5000);
  }

  function pad2(n) { return String(n).padStart(2, '0'); }
  function todayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function dayIndex(d) { d = d || new Date(); return (d.getDay() + 6) % 7; } // lun=0 ... dom=6
  function weekDates() {
    var now = new Date();
    var mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayIndex(now));
    var out = [];
    for (var i = 0; i < 7; i++) out.push(new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i));
    return out;
  }
  function toMin(hhmm) {
    var m = /^(\d{1,2})[:.](\d{2})/.exec(String(hhmm || '').trim());
    return m ? (+m[1]) * 60 + (+m[2]) : null;
  }

  // ---------------------------------------------------------
  // Tracking giornaliero  (chiave: dieta_track_YYYY-MM-DD)
  // ---------------------------------------------------------
  function getTrack(k) { return getState('track_' + (k || todayKey()), {}) || {}; }
  function setTrack(t, k) { setState('track_' + (k || todayKey()), t); }
  function isChecked(id) { return !!getTrack()[id]; }
  function toggleCheck(id) {
    var t = getTrack();
    if (t[id]) delete t[id]; else t[id] = true;
    setTrack(t);
  }

  // ---------------------------------------------------------
  // Persona globale
  // ---------------------------------------------------------
  var persona = getState('persona', 'entrambi');
  if (persona !== 'lui' && persona !== 'lei' && persona !== 'entrambi') persona = 'entrambi';
  function attivi() { return persona === 'entrambi' ? ['lui', 'lei'] : [persona]; }
  function personaEmoji(p) { return p === 'lui' ? '👦' : '👩'; }

  function syncPersonaUI() {
    $$('.seg [data-p]').forEach(function (b) {
      var on = b.dataset.p === persona;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function setPersona(p) {
    persona = p;
    setState('persona', p);
    syncPersonaUI();
    dirtyAll();
    render(activeTab);
  }

  // ---------------------------------------------------------
  // Tema (dark first, override manuale persistito, auto = sistema)
  // ---------------------------------------------------------
  var mqLight = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  var theme = getState('theme', 'auto');

  function effLight() {
    if (theme === 'light') return true;
    if (theme === 'dark') return false;
    return !!(mqLight && mqLight.matches);
  }
  function applyTheme() {
    document.documentElement.classList.toggle('theme-light', effLight());
    var m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', effLight() ? '#f2f3f6' : '#0c0f14');
  }
  function setTheme(t) { theme = t; setState('theme', t); applyTheme(); }
  if (mqLight && mqLight.addEventListener) {
    mqLight.addEventListener('change', function () { if (theme === 'auto') applyTheme(); });
  }

  // ---------------------------------------------------------
  // Navigazione tab
  // ---------------------------------------------------------
  var activeTab = 'oggi';
  var dirty = {};
  var TABS = ['oggi', 'settimana', 'ricette', 'tips', 'prep', 'spesa', 'diario'];

  function dirtyAll() { TABS.forEach(function (t) { dirty[t] = true; }); }
  dirtyAll();

  var RENDERERS = {};

  function render(id) {
    var fn = RENDERERS[id];
    if (!fn) return;
    try { fn(); } catch (e) {
      var el = $('#tab-' + id);
      if (el) el.innerHTML = '<div class="card"><p class="sub">Errore di rendering. Riapri la sezione.</p></div>';
      if (window.console) console.error('render ' + id, e);
    }
    dirty[id] = false;
  }

  function showTab(id) {
    activeTab = id;
    $$('.tab-pane').forEach(function (el) {
      el.classList.toggle('active', el.id === 'tab-' + id);
    });
    $$('.tabbar button').forEach(function (b) {
      var on = b.dataset.tab === id;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (id === 'ai') {
      mountAI();
    } else if (dirty[id] !== false) {
      render(id);
    }
    window.scrollTo(0, 0);
  }

  // Contratto con l'assistente AI: mount al primo accesso alla tab.
  function mountAI() {
    var el = document.getElementById('tab-ai');
    if (!el) return;
    if (window.AssistantTab && !el.dataset.mounted) {
      try {
        window.AssistantTab.mount(el);
        el.dataset.mounted = '1';
      } catch (e) { if (window.console) console.error('AssistantTab.mount', e); }
    } else if (!window.AssistantTab && !el.dataset.mounted && !el.childElementCount) {
      el.innerHTML = '<div class="card empty">🤖 L\'assistente non è disponibile in questa build.<br>Riprova dopo un aggiornamento dell\'app.</div>';
    }
  }

  // ---------------------------------------------------------
  // Bottom sheet modale
  // ---------------------------------------------------------
  var sheetTrigger = null; // elemento che ha aperto lo sheet, per ripristinare il focus

  function openSheet(html, label) {
    var b = $('#sheet-backdrop'), s = $('#sheet');
    if (!b || !s) return;
    sheetTrigger = document.activeElement;
    $('#sheet-body').innerHTML = html;
    s.setAttribute('aria-label', label || 'Dettaglio');
    b.hidden = false; s.hidden = false;
    requestAnimationFrame(function () { b.classList.add('show'); s.classList.add('show'); });
    document.body.classList.add('no-scroll');
    $('#sheet-body').scrollTop = 0;
    var close = s.querySelector('.sheet-close');
    if (close) close.focus();
  }
  function closeSheet() {
    var b = $('#sheet-backdrop'), s = $('#sheet');
    if (!b || !s || s.hidden) return;
    b.classList.remove('show'); s.classList.remove('show');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { b.hidden = true; s.hidden = true; $('#sheet-body').innerHTML = ''; }, 220);
    if (sheetTrigger && typeof sheetTrigger.focus === 'function' && document.contains(sheetTrigger)) {
      try { sheetTrigger.focus(); } catch (e) { /* noop */ }
    }
    sheetTrigger = null;
  }

  // tieni il focus dentro lo sheet finché è aperto (focus trap leggero)
  document.addEventListener('focusin', function (e) {
    var s = $('#sheet');
    if (!s || s.hidden) return;
    if (!s.contains(e.target)) {
      var close = s.querySelector('.sheet-close');
      if (close) close.focus();
    }
  });

  // ---------------------------------------------------------
  // OGGI
  // ---------------------------------------------------------
  function getOrari() {
    var f = D.finestra || [];
    function find(ev) {
      for (var i = 0; i < f.length; i++) {
        if (String(f[i].evento || '').toUpperCase().indexOf(ev) >= 0) return f[i].ora;
      }
      return null;
    }
    return {
      sveglia: find('SVEGLIA') || '12:00',
      p1: find('PASTO 1') || '13:00',
      digiuno: find('INIZIO DIGIUNO') || '21:00'
    };
  }

  function statusInfo() {
    var now = new Date();
    var min = now.getHours() * 60 + now.getMinutes();
    var g = (D.giorni || [])[dayIndex()];
    var o = getOrari();
    var sveglia = toMin(o.sveglia) != null ? toMin(o.sveglia) : 720;
    var p1 = toMin(o.p1) != null ? toMin(o.p1) : 780;
    var dig = toMin(o.digiuno) != null ? toMin(o.digiuno) : 1260;

    var meals = ((g && g.pasti) || []).map(function (p) {
      return { n: p.n, ora: toMin(p.ora), oraS: p.ora, titolo: p.titolo, emoji: p.emoji };
    }).filter(function (m) { return m.ora != null; });

    function cd(target) {
      var d = target - min; if (d < 0) d += 1440;
      var h = Math.floor(d / 60), m = d % 60;
      return h > 0 ? h + ' h ' + m + ' min' : m + ' min';
    }

    var stato, sub, klass;
    if (min < sveglia) {
      stato = '🌙 Digiuno'; klass = 'fast';
      sub = 'Acqua e caffè nero dalle ' + esc(o.sveglia) + ' · Pasto 1 tra ' + cd(p1);
    } else if (min < p1) {
      stato = '💧 Solo acqua / caffè'; klass = 'water';
      sub = '500ml d\'acqua + caffè o tè senza zucchero · Pasto 1 tra ' + cd(p1);
    } else if (min < dig) {
      stato = '🟢 Finestra aperta'; klass = 'open';
      var next = null;
      for (var i = 0; i < meals.length; i++) { if (meals[i].ora > min) { next = meals[i]; break; } }
      sub = next
        ? (next.emoji || '🍽️') + ' Pasto ' + next.n + ' · ' + esc(next.titolo || '') + ' alle ' + esc(next.oraS) + ' — tra ' + cd(next.ora)
        : 'Ultimo pasto fatto? Il digiuno inizia alle ' + esc(o.digiuno) + ' — tra ' + cd(dig);
    } else {
      stato = '🌙 Digiuno iniziato'; klass = 'fast';
      sub = 'Finestra chiusa fino alle ' + esc(o.p1) + ' di domani · solo acqua e tisane';
    }
    var dateS = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
    return { klass: klass, html: '<p class="label">' + esc(dateS) + '</p><h2 class="stato">' + stato + '</h2><p class="sub">' + sub + '</p>' };
  }

  function updateStatusCard() {
    var card = $('#status-card');
    if (!card) return;
    var s = statusInfo();
    card.className = 'card status-card ' + s.klass;
    card.innerHTML = s.html;
  }

  // Voci spuntabili di oggi (per il recap)
  function todoIds() {
    var ids = [];
    var g = (D.giorni || [])[dayIndex()];
    attivi().forEach(function (per) {
      ((g && g.pasti) || []).forEach(function (p) { ids.push('p' + p.n + '_' + per); });
      (D.integratori || []).forEach(function (it) {
        if (it.persona === 'entrambi' || it.persona === per) ids.push('int_' + slug(it.nome) + '_' + per);
      });
      ids.push('camm_' + per);
    });
    if (attivi().indexOf('lei') >= 0) ids.push('risc_0', 'risc_1', 'risc_2');
    return ids;
  }

  function weekFullDays() {
    var dates = weekDates();
    var now = new Date();
    var full = 0;
    dates.forEach(function (d) {
      if (d > now) return;
      var t = getState('track_' + todayKey(d), {}) || {};
      var ok = attivi().every(function (per) {
        return [1, 2, 3].every(function (n) { return !!t['p' + n + '_' + per]; });
      });
      if (ok) full++;
    });
    return full;
  }

  function ringHtml(pct) {
    var r = 30, c = 2 * Math.PI * r;
    var off = c * (1 - Math.min(100, Math.max(0, pct)) / 100);
    return '<svg class="ring" viewBox="0 0 72 72" role="img" aria-label="Completato il ' + pct + '% di oggi">' +
      '<circle cx="36" cy="36" r="' + r + '" class="ring-bg"/>' +
      '<circle cx="36" cy="36" r="' + r + '" class="ring-fg" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '<text x="36" y="41" text-anchor="middle" aria-hidden="true">' + pct + '%</text></svg>';
  }

  function checkBtn(id, per, labelOn, labelOff) {
    var on = isChecked(id);
    var cls = per === 'lui' || per === 'lei' ? per : 'neutro';
    var emo = per === 'lui' ? '👦 ' : per === 'lei' ? '👩 ' : '';
    return '<button type="button" class="check ' + cls + (on ? ' on' : '') + '" data-track="' + esc(id) + '" aria-pressed="' + on + '">' +
      emo + (on ? (labelOn || 'Fatto ✓') : (labelOff || 'Da fare')) + '</button>';
  }

  function checkItem(id, txtHtml, sideHtml) {
    var on = isChecked(id);
    return '<li><button type="button" class="checkitem' + (on ? ' on' : '') + '" data-track="' + esc(id) + '" aria-pressed="' + on + '">' +
      '<span class="box">✓</span><span class="txt">' + txtHtml + '</span>' +
      (sideHtml ? '<span class="side">' + sideHtml + '</span>' : '') + '</button></li>';
  }

  function itemsTable(items, opts) {
    items = items || [];
    opts = opts || {};
    var head, rows;
    if (persona === 'entrambi') {
      head = '<tr><th>' + (opts.firstCol || 'Alimento') + '</th><th class="c-lui">👦 Lui</th><th class="c-lei">👩 Lei</th></tr>';
      rows = items.map(function (it) {
        return '<tr><td>' + esc(it.alimento || it.nome || '') + '</td><td class="c-lui">' + esc(it.lui || '—') + '</td><td class="c-lei">' + esc(it.lei || '—') + '</td></tr>';
      }).join('');
    } else {
      head = '<tr><th>' + (opts.firstCol || 'Alimento') + '</th><th class="' + (persona === 'lui' ? 'c-lui' : 'c-lei') + '">' + personaEmoji(persona) + ' ' + (persona === 'lui' ? 'Lui' : 'Lei') + '</th></tr>';
      rows = items.map(function (it) {
        var v = it[persona];
        if (!v || v === '—') return '';
        return '<tr><td>' + esc(it.alimento || it.nome || '') + '</td><td>' + esc(v) + '</td></tr>';
      }).join('');
    }
    if (!rows) rows = '<tr><td colspan="3" class="muted">Nessuna voce per questa persona.</td></tr>';
    return '<div class="tbl-wrap"><table class="tbl"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
  }

  function currentSeason() {
    var m = new Date().getMonth();
    if (m >= 5 && m <= 7) return 'estate';
    if (m === 11 || m <= 1) return 'inverno';
    if (m >= 2 && m <= 4) return 'primavera';
    return 'autunno';
  }

  // Stima macro del pasto per persona (da DIET_DATA.macroByMeal, chiave "<id>-<n>")
  function mealMacro(dayId, n) {
    var map = D.macroByMeal || {};
    return (dayId && map[dayId + '-' + n]) || null;
  }
  function macroRowHtml(dayId, n) {
    var mm = mealMacro(dayId, n);
    if (!mm) return '';
    var chips = attivi().map(function (per) {
      var x = mm[per]; if (!x) return '';
      var lbl = per === 'lui' ? '👦' : '👩';
      return '<span class="macro-chip">' + lbl + ' ' + esc(x.kcal) + ' kcal · ' + esc(x.pro) + 'g</span>';
    }).join('');
    return chips ? '<div class="macro-row" aria-label="Stima calorie e proteine del pasto">' + chips + '</div>' : '';
  }

  // Target macro per il confronto giornaliero (dai range del piano)
  var MACRO_TARGET = {
    lui: { kcalMin: 1900, kcalMax: 2100, proMin: 130, proMax: 150, floor: null },
    lei: { kcalMin: 1450, kcalMax: 1600, proMin: 100, proMax: 120, floor: 1400 }
  };
  function dayMacroTotals(dayId) {
    var map = D.macroByMeal || {};
    if (!dayId) return null;
    var tot = { lui: { kcal: 0, pro: 0, has: false }, lei: { kcal: 0, pro: 0, has: false } };
    [1, 2, 3].forEach(function (n) {
      var mm = map[dayId + '-' + n]; if (!mm) return;
      ['lui', 'lei'].forEach(function (per) {
        if (mm[per]) { tot[per].kcal += +mm[per].kcal || 0; tot[per].pro += +mm[per].pro || 0; tot[per].has = true; }
      });
    });
    return tot;
  }
  function macroStatus(per, x) {
    var t = MACRO_TARGET[per]; if (!t || !x.has) return '';
    if (t.floor != null && x.kcal < t.floor) return '<span class="macro-flag">⚠️ sotto il minimo di ' + t.floor + ' kcal</span>';
    var msgs = [];
    if (x.kcal < t.kcalMin) msgs.push('⬇️ calorie basse'); else if (x.kcal > t.kcalMax) msgs.push('⬆️ calorie alte');
    if (x.pro < t.proMin) msgs.push('proteine sotto target');
    return msgs.length ? '<span class="macro-flag">' + esc(msgs.join(' · ')) + '</span>' : '<span class="macro-ok">✓ nel range</span>';
  }
  function dayMacroCardHtml(dayId) {
    var tot = dayMacroTotals(dayId); if (!tot) return '';
    var rows = attivi().map(function (per) {
      var x = tot[per]; if (!x.has) return '';
      var t = MACRO_TARGET[per];
      var lbl = per === 'lui' ? '👦 LUI' : '👩 LEI';
      return '<div class="macro-day-row"><span><b>' + lbl + '</b> ' + x.kcal + ' kcal · ' + x.pro + 'g proteine ' +
        '<small>(obiettivo ' + t.kcalMin + '–' + t.kcalMax + ' kcal · ' + t.proMin + '–' + t.proMax + 'g)</small></span> ' +
        macroStatus(per, x) + '</div>';
    }).join('');
    if (!rows) return '';
    return '<div class="card macro-day"><h2>🔢 Stima macro del giorno</h2>' + rows +
      '<p class="sub small mt">Stime indicative dalle porzioni del piano (non pesate al grammo): una bussola, soprattutto per non scendere sotto il minimo calorico di lei.</p></div>';
  }

  function mealCardHtml(p, interactive, dayId) {
    if (!p) return '';
    var checks = interactive
      ? '<div class="checkrow">' + attivi().map(function (per) {
          return checkBtn('p' + p.n + '_' + per, per);
        }).join('') + '</div>'
      : '';
    var nota = p.nota ? '<p class="nota">' + esc(p.nota) + '</p>' : '';
    // Mini-tab "Varianti & rotazione" (alternative + stagionalità): <details> nativo, cliccabile
    var varianti = '';
    if (p.varianti && p.varianti.length) {
      var season = currentSeason();
      var vlis = p.varianti.map(function (v) {
        var inSeason = v.stagione && v.stagione !== 'sempre' && v.stagione === season;
        var badge = inSeason ? ' <span class="v-now">consigliata ora</span>' : '';
        return '<li><b>' + esc(v.emoji || '🔄') + ' ' + esc(v.nome) + '</b>' + badge +
          (v.dettaglio ? ' — ' + esc(v.dettaglio) : '') + '</li>';
      }).join('');
      varianti = '<details class="mini varianti"><summary>🔄 Varianti & rotazione · ' + p.varianti.length + '</summary><ul class="dots">' + vlis + '</ul></details>';
    }
    var prep = '';
    if (p.prep) {
      var passi = (p.prep.passi || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
      prep = '<details class="mini"><summary>🍳 Preparazione · ~' + esc(p.prep.tempoMin != null ? p.prep.tempoMin : '?') + ' min attivi</summary><ul class="dots">' + passi + '</ul></details>';
    }
    // Pasto 1: badge "ordine del piatto" + come rompere il digiuno (anti-picco / anti-sonnolenza)
    var p1extra = '';
    if (p.n === 1) {
      p1extra =
        '<div class="order-badge" aria-label="Ordine consigliato del piatto: prima verdure, poi proteine, carboidrati per ultimi">' +
        '<span class="ob-step"><b>1</b> 🥗 Verdure</span><span class="ob-arrow" aria-hidden="true">→</span>' +
        '<span class="ob-step"><b>2</b> 🍗 Proteine</span><span class="ob-arrow" aria-hidden="true">→</span>' +
        '<span class="ob-step"><b>3</b> 🍞 Carbo</span></div>' +
        '<details class="mini rompo"><summary>🍽️ Come rompere il digiuno (meno crollo, meno picco)</summary><ul class="dots">' +
        '<li>Prima <b>verdura cotta + proteine + grassi buoni</b> (uova ben cotte, formaggi della lista, avocado), poi i carboidrati.</li>' +
        '<li><b>Carboidrati per ultimi</b> = glicemia più stabile. 👦 meno sonnolenza pomeridiana · 👩 gengive e peso ringraziano.</li>' +
        '<li>Mangia con calma; se è “fame nervosa”, prima un bicchiere d\'acqua e aspetta 10 minuti.</li>' +
        '</ul></details>';
    }
    return '<article class="card meal">' +
      '<div class="meal-head"><span class="meal-emoji">' + esc(p.emoji || '🍽️') + '</span>' +
      '<div><p class="label">Pasto ' + esc(p.n) + ' · ' + esc(p.ora || '') + '</p><h3>' + esc(p.titolo || '') + '</h3></div></div>' +
      macroRowHtml(dayId, p.n) +
      itemsTable(p.items) + p1extra + nota + varianti + prep + checks +
      '</article>';
  }

  function spesaCount() {
    var done = getState('spesa', {}) || {};
    var tot = 0, fatti = 0;
    (D.spesa || []).forEach(function (cat) {
      (cat.items || []).forEach(function (it) {
        tot++;
        if (done[slug(cat.categoria) + '|' + slug(it.prodotto)]) fatti++;
      });
    });
    return { fatti: fatti, tot: tot };
  }

  function renderOggi() {
    var el = $('#tab-oggi');
    if (!el) return;
    var g = (D.giorni || [])[dayIndex()];
    var s = statusInfo();

    // recap
    var ids = todoIds();
    var done = ids.filter(isChecked).length;
    var pct = ids.length ? Math.round(done / ids.length * 100) : 0;
    var full = weekFullDays();

    // pasti
    var mealsHtml = ((g && g.pasti) || []).map(function (p) { return mealCardHtml(p, true, g && g.id); }).join('');

    // integratori
    var ints = (D.integratori || []).filter(function (it) {
      if (persona === 'entrambi') return true;
      return it.persona === 'entrambi' || it.persona === persona;
    });
    var intHtml = ints.map(function (it) {
      var who = it.persona === 'entrambi' ? attivi() : (attivi().indexOf(it.persona) >= 0 ? [it.persona] : []);
      var warn = it.valutazione === 'attenzione';
      var badge = warn ? '<span class="badge warn">⚠️ attenzione</span>' : (it.persona !== 'entrambi' ? '<span class="badge ' + esc(it.persona) + '">' + personaEmoji(it.persona) + ' solo ' + esc(it.persona) + '</span>' : '');
      return who.map(function (per) {
        var tag = persona === 'entrambi' && it.persona === 'entrambi' ? ' <span class="badge ' + per + '">' + personaEmoji(per) + '</span>' : '';
        return checkItem('int_' + slug(it.nome) + '_' + per,
          '<b>' + esc(it.nome) + '</b>' + tag + '<small>' + esc(it.timing || '') + (warn ? ' — ' + esc(it.note || '') : '') + '</small>',
          badge);
      }).join('');
    }).join('');

    // reminder
    var rem = '';
    if (attivi().indexOf('lei') >= 0) {
      rem += ['P1', 'P2', 'P3'].map(function (lbl, i) {
        return checkItem('risc_' + i, '<b>🦷 Risciacquo bicarbonato</b><small>dopo il pasto ' + lbl + ' — protegge le gengive</small>', '<span class="badge lei">👩</span>');
      }).join('');
    }
    attivi().forEach(function (per) {
      var min = per === 'lui' ? 15 : 20;
      rem += checkItem('camm_' + per, '<b>🚶 Camminata ' + min + ' min</b><small>dopo il Pasto 1 (~13:45)</small>', '<span class="badge ' + per + '">' + personaEmoji(per) + '</span>');
    });

    var sc = spesaCount();

    el.innerHTML =
      coachBanner() +
      '<div id="status-card" class="card status-card ' + s.klass + '">' + s.html + '</div>' +

      '<div class="card"><div class="progress-flex"><span id="oggi-ring">' + ringHtml(pct) + '</span>' +
      '<div id="oggi-recap"><h2>Recap di oggi</h2><p class="sub">' + done + ' su ' + ids.length + ' voci spuntate</p>' +
      '<p class="sub small mt">' + full + '/7 giorni con tutti i pasti questa settimana — è una bussola, non un voto 🙂</p></div>' +
      '</div></div>' +

      moodWaterCard() +

      '<div class="section-title"><h2>🍽️ I pasti di ' + esc((g && g.nome) || 'oggi') + '</h2>' +
      ((g && g.sottotitolo) ? '<span class="label">' + esc(g.sottotitolo) + '</span>' : '') + '</div>' +
      (mealsHtml || '<div class="card empty">Nessun pasto trovato per oggi.</div>') +
      dayMacroCardHtml(g && g.id) +

      '<div class="card"><h2>💊 Integratori</h2>' +
      '<p class="sub small">' + esc(D.integratoriSoluzione || '') + '</p>' +
      '<ul class="checklist mt">' + (intHtml || '<li class="empty">Nessun integratore per questa persona.</li>') + '</ul></div>' +

      '<div class="card"><h2>🔁 Routine quotidiane</h2><ul class="checklist mt">' + rem + '</ul></div>' +

      '<div class="grid2">' +
      '<button type="button" class="card shortcut" data-tab="prep"><span class="ico">🍳</span><b>Meal Prep</b><small>Timeline domenica, batch e checklist</small></button>' +
      '<button type="button" class="card shortcut" data-tab="spesa"><span class="ico">🛒</span><b>Spesa</b><small>' + sc.fatti + '/' + sc.tot + ' prodotti presi</small></button>' +
      '</div>';
  }

  // Aggiorna SOLO anello + recap di Oggi senza ricostruire la sezione
  // (evita jank, lampeggio dell'anello e perdita dello scroll).
  function updateOggiProgress() {
    var ids = todoIds();
    var done = ids.filter(isChecked).length;
    var pct = ids.length ? Math.round(done / ids.length * 100) : 0;
    var full = weekFullDays();

    var r = $('#oggi-ring');
    if (r) r.innerHTML = ringHtml(pct);

    var recap = $('#oggi-recap');
    if (recap) {
      recap.innerHTML =
        '<h2>Recap di oggi</h2><p class="sub">' + done + ' su ' + ids.length + ' voci spuntate</p>' +
        '<p class="sub small mt">' + full + '/7 giorni con tutti i pasti questa settimana — è una bussola, non un voto 🙂</p>';
    }
  }

  // ---------------------------------------------------------
  // SETTIMANA
  // ---------------------------------------------------------
  var selDay = dayIndex();

  function renderSettimana() {
    var el = $('#tab-settimana');
    if (!el) return;
    var giorni = D.giorni || [];
    if (selDay < 0 || selDay >= giorni.length) selDay = 0;
    var g = giorni[selDay];

    var chips = giorni.map(function (gg, i) {
      var cls = 'chip' + (i === selDay ? ' on' : '') + (i === dayIndex() ? ' today' : '');
      return '<button type="button" class="' + cls + '" data-day="' + i + '" aria-pressed="' + (i === selDay) + '">' + esc((gg.nome || '').slice(0, 3)) + '</button>';
    }).join('');

    var meals = ((g && g.pasti) || []).map(function (p) { return mealCardHtml(p, false, g && g.id); }).join('');

    var gridRows = giorni.map(function (gg, i) {
      var cells = [1, 2, 3].map(function (n) {
        var p = (gg.pasti || []).find(function (x) { return x.n === n; });
        return '<td>' + (p ? esc(p.emoji || '') + ' ' + esc(p.titolo || '') : '—') + '</td>';
      }).join('');
      var name = i === dayIndex() ? '<b>' + esc(gg.nome) + ' ←</b>' : esc(gg.nome);
      return '<tr><td>' + name + '</td>' + cells + '</tr>';
    }).join('');

    el.innerHTML =
      '<div class="section-title"><h2>🗓️ Piano settimanale</h2></div>' +
      '<div class="chips scroll" role="group" aria-label="Scegli il giorno">' + chips + '</div>' +
      '<div class="count-line"><h3>' + esc((g && g.nome) || '') + (g && g.sottotitolo ? ' · <span class="muted small">' + esc(g.sottotitolo) + '</span>' : '') + '</h3>' +
      (g && g.tempoTotaleMin != null ? '<span class="pill">⏱ ~' + esc(g.tempoTotaleMin) + ' min in cucina</span>' : '') + '</div>' +
      (meals || '<div class="card empty">Nessun dato per questo giorno.</div>') +
      '<details class="acc"><summary>👀 Tutta la settimana a colpo d\'occhio</summary><div class="acc-body tbl-wrap">' +
      '<table class="tbl"><thead><tr><th>Giorno</th><th>P1 · 13:00</th><th>P2 · 17:00</th><th>P3 · 20:30</th></tr></thead><tbody>' + gridRows + '</tbody></table>' +
      '</div></details>';
  }

  // ---------------------------------------------------------
  // RICETTE
  // ---------------------------------------------------------
  var rf = { momento: {}, persona: null, tempo: null, diff: null, prep: false, fav: false, tags: {}, q: '' };
  var RECIPE_TAGS = ['veloce', 'proteico', 'morbido', 'pro-gengive', 'anti-infiammatorio', 'comfort', 'forno', 'padella', 'legumi', 'pesce', 'estiva', 'invernale', 'dolce', 'curcuma', 'anti-spreco'];

  function setSize(obj) { return Object.keys(obj).length; }

  // preferiti ricette (chiave dieta_fav)
  function favGet() { return getState('fav', {}) || {}; }
  function favOn(id) { return !!favGet()[id]; }
  function favToggle(id) { var f = favGet(); if (f[id]) delete f[id]; else f[id] = true; setState('fav', f); }
  function syncFavButtons(id) {
    var on = favOn(id);
    $$('[data-fav="' + id + '"]').forEach(function (b) {
      b.classList.toggle('on', on);
      if (b.classList.contains('fav-star')) b.textContent = on ? '⭐' : '☆';
      else b.textContent = on ? '⭐ Nei preferiti' : '☆ Aggiungi ai preferiti';
      b.setAttribute('aria-label', on ? 'Togli dai preferiti' : 'Aggiungi ai preferiti');
    });
  }

  function recipeMatches(r) {
    if (!r) return false;
    if (rf.fav && !favOn(r.id)) return false;
    if (setSize(rf.momento) && !(r.momento || []).some(function (m) { return rf.momento[m]; })) return false;
    if (rf.persona && (r.persona || 'entrambi') !== rf.persona) return false;
    if (rf.tempo) {
      var t = r.tempoMin || 0;
      if (rf.tempo === 'le10' && t > 10) return false;
      if (rf.tempo === 'le20' && t > 20) return false;
      if (rf.tempo === 'gt20' && t <= 20) return false;
    }
    if (rf.diff && r.difficolta !== rf.diff) return false;
    if (rf.prep && !r.mealPrep) return false;
    var tags = Object.keys(rf.tags);
    if (tags.length && !tags.every(function (t2) { return (r.tags || []).indexOf(t2) >= 0; })) return false;
    if (rf.q) {
      var q = rf.q.toLowerCase();
      var hay = (String(r.nome || '') + ' ' + String(r.descrizione || '') + ' ' +
        (r.ingredienti || []).map(function (i) { return i.nome || ''; }).join(' ')).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }

  function chip(group, val, label, on) {
    return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-filter="' + group + ':' + esc(val) + '" aria-pressed="' + !!on + '">' + label + '</button>';
  }

  function recipeCardHtml(r) {
    var grad = (r.gradient && r.gradient.length === 2) ? r.gradient : ['#334155', '#1e293b'];
    var solo = (r.persona === 'lui') ? '<span class="pill" style="color:var(--lui)">👦 solo lui</span>' :
               (r.persona === 'lei') ? '<span class="pill" style="color:var(--lei)">👩 solo lei</span>' : '';
    return '<button type="button" class="recipe-card" data-recipe="' + esc(r.id) + '">' +
      '<span class="fav-star' + (favOn(r.id) ? ' on' : '') + '" data-fav="' + esc(r.id) + '" role="button" aria-label="' + (favOn(r.id) ? 'Togli dai preferiti' : 'Aggiungi ai preferiti') + '">' + (favOn(r.id) ? '⭐' : '☆') + '</span>' +
      '<span class="recipe-hero" style="background:linear-gradient(135deg,' + esc(grad[0]) + ',' + esc(grad[1]) + ')" aria-hidden="true">' + esc(r.emoji || '🍽️') + '</span>' +
      '<span class="recipe-body"><b>' + esc(r.nome || '') + '</b>' +
      '<span class="recipe-meta"><span class="pill">⏱ ' + esc(r.tempoMin || '?') + '′</span>' +
      '<span class="pill">' + esc(r.difficolta || '') + '</span>' +
      '<span class="pill">' + (r.momento || []).map(esc).join('·') + '</span>' +
      (r.mealPrep ? '<span class="pill">🥡 prep</span>' : '') + solo + '</span></span></button>';
  }

  function updateRicetteResults() {
    var box = $('#ricette-results');
    var cnt = $('#ricette-count');
    if (!box) return;
    var list = RECIPES.filter(recipeMatches);
    if (cnt) cnt.textContent = list.length + (list.length === 1 ? ' ricetta' : ' ricette');
    box.innerHTML = list.length
      ? list.map(recipeCardHtml).join('')
      : '<div class="empty" style="grid-column:1/-1">Nessuna ricetta con questi filtri 🤷<br>Prova a toglierne qualcuno.</div>';
  }

  function renderRicette() {
    var el = $('#tab-ricette');
    if (!el) return;
    var chipsHtml =
      '<div class="chips scroll" aria-label="Filtra per momento">' +
        ['P1', 'P2', 'P3'].map(function (m) { return chip('momento', m, m + ' · ' + (m === 'P1' ? '13:00' : m === 'P2' ? '17:00' : '20:30'), rf.momento[m]); }).join('') +
        chip('persona', 'entrambi', '👫 entrambi', rf.persona === 'entrambi') +
        chip('persona', 'lui', '👦 solo lui', rf.persona === 'lui') +
        chip('fav', '1', '⭐ preferite', rf.fav) +
      '</div>' +
      '<div class="chips scroll" aria-label="Filtra per tempo e difficoltà">' +
        chip('tempo', 'le10', '⚡ ≤10 min', rf.tempo === 'le10') +
        chip('tempo', 'le20', '⏱ ≤20 min', rf.tempo === 'le20') +
        chip('tempo', 'gt20', '🕰 >20 min', rf.tempo === 'gt20') +
        chip('diff', 'facile', '😌 facile', rf.diff === 'facile') +
        chip('diff', 'media', '🧑‍🍳 media', rf.diff === 'media') +
        chip('prep', '1', '🥡 meal prep', rf.prep) +
      '</div>' +
      '<div class="chips scroll" aria-label="Filtra per tag">' +
        RECIPE_TAGS.map(function (t) { return chip('tags', t, '#' + t, rf.tags[t]); }).join('') +
      '</div>';

    el.innerHTML =
      '<div class="section-title"><h2>🍽️ Ricettario</h2><span class="label" id="ricette-count"></span></div>' +
      '<input type="search" id="ricette-q" class="search" placeholder="Cerca per nome o ingrediente…" value="' + esc(rf.q) + '" aria-label="Cerca ricette">' +
      chipsHtml +
      '<div id="ricette-results" class="recipe-grid mt"></div>';
    updateRicetteResults();
  }

  function applyRecipeFilter(group, val) {
    if (group === 'momento') { if (rf.momento[val]) delete rf.momento[val]; else rf.momento[val] = true; }
    else if (group === 'tags') { if (rf.tags[val]) delete rf.tags[val]; else rf.tags[val] = true; }
    else if (group === 'prep') { rf.prep = !rf.prep; }
    else if (group === 'fav') { rf.fav = !rf.fav; }
    else { rf[group] = rf[group] === val ? null : val; }
    renderRicette();
  }

  function openRecipe(id) {
    var r = RECIPES.find(function (x) { return x.id === id; });
    if (!r) return;
    var grad = (r.gradient && r.gradient.length === 2) ? r.gradient : ['#334155', '#1e293b'];
    var macros = r.macros || {};
    var html =
      '<div class="sheet-hero" style="background:linear-gradient(135deg,' + esc(grad[0]) + ',' + esc(grad[1]) + ')" aria-hidden="true">' + esc(r.emoji || '🍽️') + '</div>' +
      '<h2>' + esc(r.nome || '') + '</h2>' +
      '<div class="badges mt">' +
        '<span class="badge accent">' + (r.momento || []).map(esc).join(' · ') + '</span>' +
        '<span class="badge">⏱ ' + esc(r.tempoMin || '?') + ' min</span>' +
        '<span class="badge">' + esc(r.difficolta || '') + '</span>' +
        (r.mealPrep ? '<span class="badge ok">🥡 meal prep</span>' : '') +
        (r.persona === 'lui' ? '<span class="badge lui">👦 solo lui</span>' : r.persona === 'lei' ? '<span class="badge lei">👩 solo lei</span>' : '<span class="badge">👫 entrambi</span>') +
      '</div>' +
      '<p class="sub mt">' + esc(r.descrizione || '') + '</p>' +
      '<button type="button" class="btn fav-btn' + (favOn(r.id) ? ' on' : '') + '" data-fav="' + esc(r.id) + '" style="margin-top:10px" aria-label="' + (favOn(r.id) ? 'Togli dai preferiti' : 'Aggiungi ai preferiti') + '">' + (favOn(r.id) ? '⭐ Nei preferiti' : '☆ Aggiungi ai preferiti') + '</button>' +
      (macros.kcalLui || macros.kcalLei ? '<div class="badges mt">' +
        (macros.kcalLui ? '<span class="badge lui">👦 ' + esc(macros.kcalLui) + ' kcal</span>' : '') +
        (macros.kcalLei ? '<span class="badge lei">👩 ' + esc(macros.kcalLei) + ' kcal</span>' : '') +
        (macros.proteine ? '<span class="badge">proteine: ' + esc(macros.proteine) + '</span>' : '') + '</div>' : '') +
      (r.sicurezzaLui ? '<div class="safety lui"><b>👦 Sicurezza lui:</b> ' + esc(r.sicurezzaLui) + '</div>' : '') +
      (r.sicurezzaLei ? '<div class="safety lei"><b>👩 Sicurezza lei:</b> ' + esc(r.sicurezzaLei) + '</div>' : '') +
      '<h3 class="mt">🧺 Ingredienti</h3>' + itemsTable(r.ingredienti, { firstCol: 'Ingrediente' }) +
      '<h3 class="mt">👨‍🍳 Passaggi</h3><ol class="steps">' +
        (r.passaggi || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
      (r.tips ? '<div class="tipbox">💡 ' + esc(r.tips) + '</div>' : '');
    openSheet(html, 'Ricetta: ' + (r.nome || ''));
  }

  // ---------------------------------------------------------
  // TIPS
  // ---------------------------------------------------------
  var tipCat = null;   // null = tutte
  var tipPer = null;   // null = tutti

  var TIP_CAT_LABELS = {
    'digiuno': 'Digiuno', 'lui': 'Lui', 'lei': 'Lei', 'cucina': 'Cucina', 'spesa': 'Spesa',
    'alternative': 'Alternative', 'idratazione': 'Idratazione', 'sonno': 'Sonno',
    'movimento': 'Movimento', 'eating-out': 'Mangiare fuori'
  };

  function tipCategories() {
    var seen = {}, out = [];
    TIPS.forEach(function (t) {
      if (t.categoria && !seen[t.categoria]) {
        seen[t.categoria] = true;
        out.push({ id: t.categoria, icona: t.icona || '💡' });
      }
    });
    return out;
  }

  function updateTipsList() {
    var box = $('#tips-list');
    if (!box) return;
    var list = TIPS.filter(function (t) {
      if (tipCat && t.categoria !== tipCat) return false;
      if (tipPer && t.persona !== tipPer && t.persona !== 'entrambi') return false;
      return true;
    });
    box.innerHTML = list.length ? list.map(function (t) {
      var per = t.persona === 'lui' ? '<span class="badge lui">👦 lui</span>' :
                t.persona === 'lei' ? '<span class="badge lei">👩 lei</span>' :
                '<span class="badge">👫</span>';
      return '<article class="card tip-card"><div class="tip-head"><span class="tip-ico">' + esc(t.icona || '💡') + '</span>' +
        '<div style="flex:1"><h3>' + esc(t.titolo || '') + '</h3></div>' + per + '</div>' +
        '<p class="txt">' + esc(t.testo || '') + '</p></article>';
    }).join('') : '<div class="empty">Nessun tip per questi filtri.</div>';
  }

  function updatePorzioni(q) {
    var tb = $('#porzioni-body');
    if (!tb) return;
    q = String(q || '').toLowerCase();
    var rows = (D.porzioni || []).filter(function (p) {
      return !q || (String(p.alimento) + ' ' + String(p.unita) + ' ' + String(p.equivale)).toLowerCase().indexOf(q) >= 0;
    }).map(function (p) {
      return '<tr><td>' + esc(p.alimento) + '</td><td>' + esc(p.unita) + '</td><td>' + esc(p.equivale) + '</td></tr>';
    }).join('');
    tb.innerHTML = rows || '<tr><td colspan="3" class="muted">Nessun alimento trovato.</td></tr>';
  }

  function bioTable(list) {
    return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Abitudine</th><th>Quando</th><th>Perché</th></tr></thead><tbody>' +
      (list || []).map(function (b) {
        return '<tr><td>' + esc(b.abitudine) + '</td><td>' + esc(b.quando) + '</td><td class="muted">' + esc(b.perche) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function renderTips() {
    var el = $('#tab-tips');
    if (!el) return;

    var catChips = '<button type="button" class="chip' + (tipCat === null ? ' on' : '') + '" data-tipcat="">Tutti</button>' +
      tipCategories().map(function (c) {
        return '<button type="button" class="chip' + (tipCat === c.id ? ' on' : '') + '" data-tipcat="' + esc(c.id) + '">' +
          esc(c.icona) + ' ' + esc(TIP_CAT_LABELS[c.id] || c.id) + '</button>';
      }).join('');

    var perChips =
      '<button type="button" class="chip' + (tipPer === null ? ' on' : '') + '" data-tipper="">👫 Tutti</button>' +
      '<button type="button" class="chip lui' + (tipPer === 'lui' ? ' on' : '') + '" data-tipper="lui">👦 Lui</button>' +
      '<button type="button" class="chip lei' + (tipPer === 'lei' ? ' on' : '') + '" data-tipper="lei">👩 Lei</button>';

    var target = D.target || {};
    var targetHtml = ['lui', 'lei'].map(function (per) {
      var t = target[per]; if (!t) return '';
      return '<div class="card" style="border-left:3px solid var(--' + per + ')"><h3>' + personaEmoji(per) + ' ' + (per === 'lui' ? 'Lui' : 'Lei') + '</h3>' +
        '<div class="tbl-wrap"><table class="tbl"><tbody>' +
        '<tr><td>Calorie</td><td>' + esc(t.calorie || '') + '</td></tr>' +
        '<tr><td>Proteine</td><td>' + esc(t.proteine || '') + '</td></tr>' +
        '<tr><td>Carboidrati</td><td>' + esc(t.carboidrati || '') + '</td></tr>' +
        '<tr><td>Grassi</td><td>' + esc(t.grassi || '') + '</td></tr>' +
        '</tbody></table></div>' +
        (t.notaCalorie ? '<p class="nota">⚠️ ' + esc(t.notaCalorie) + '</p>' : '') + '</div>';
    }).join('');

    var divieti = D.divieti || {};
    var divietiHtml = ['lui', 'lei'].map(function (per) {
      var list = divieti[per] || [];
      return '<div class="card danger-card"><h3>🚫 Divieti ' + personaEmoji(per) + ' ' + (per === 'lui' ? 'Lui' : 'Lei') + '</h3>' +
        '<ul class="dots mt">' + list.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul></div>';
    }).join('');

    var pomodoro = '<ul class="dots">' + (D.pomodoroAlternative || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>';

    var antiSpreco = (D.antiSpreco || []).map(function (a) {
      return '<div class="card"><h3>' + esc(a.emoji || '♻️') + ' ' + esc(a.titolo || '') + '</h3><p class="sub">' + esc(a.testo || '') + '</p></div>';
    }).join('');

    var bio = D.biohacking || {};

    el.innerHTML =
      '<div class="section-title"><h2>💡 Tips & regole</h2></div>' +
      '<div class="chips scroll" aria-label="Categorie">' + catChips + '</div>' +
      '<div class="chips" aria-label="Persona">' + perChips + '</div>' +
      '<div id="tips-list" class="mt"></div>' +

      '<div class="section-title"><h2>📚 Regole del piano</h2></div>' +
      '<details class="acc"><summary>🚫 Divieti — cosa evitare sempre</summary><div class="acc-body">' + divietiHtml + '</div></details>' +
      '<details class="acc"><summary>🍅 Alternative al pomodoro (per lei)</summary><div class="acc-body">' + pomodoro + '</div></details>' +
      '<details class="acc"><summary>🧬 Biohacking · 👦 Lui</summary><div class="acc-body">' + bioTable(bio.lui) + '</div></details>' +
      '<details class="acc"><summary>🧬 Biohacking · 👩 Lei</summary><div class="acc-body">' + bioTable(bio.lei) + '</div></details>' +
      '<details class="acc"><summary>♻️ Logica anti-spreco</summary><div class="acc-body">' + antiSpreco + '</div></details>' +
      '<details class="acc"><summary>✋ Guida porzioni facili</summary><div class="acc-body">' +
        '<input type="search" id="porzioni-q" class="search" placeholder="Cerca alimento…" aria-label="Cerca nella guida porzioni">' +
        '<div class="tbl-wrap mt"><table class="tbl"><thead><tr><th>Alimento</th><th>Unità</th><th>Equivale a</th></tr></thead><tbody id="porzioni-body"></tbody></table></div>' +
      '</div></details>' +
      '<details class="acc"><summary>🎯 Target calorici e macro</summary><div class="acc-body">' + targetHtml + '</div></details>';

    updateTipsList();
    updatePorzioni('');
  }

  // ---------------------------------------------------------
  // PREP (Meal Prep)
  // ---------------------------------------------------------
  function prepChecklistHtml(groupKey, title, list) {
    var done = getState('prep', {}) || {};
    var items = (list || []).map(function (txt, i) {
      var id = groupKey + '|' + i;
      var on = !!done[id];
      return '<li><button type="button" class="checkitem' + (on ? ' on' : '') + '" data-prep="' + esc(id) + '" aria-pressed="' + on + '">' +
        '<span class="box">✓</span><span class="txt">' + esc(txt) + '</span></button></li>';
    }).join('');
    var fatti = (list || []).filter(function (_, i) { return done[groupKey + '|' + i]; }).length;
    return '<details class="acc"><summary>' + title + ' <span class="pill" style="margin-left:auto">' + fatti + '/' + (list || []).length + '</span></summary>' +
      '<div class="acc-body"><ul class="checklist">' + items + '</ul></div></details>';
  }

  function consTable(list) {
    return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Cosa</th><th>Durata</th></tr></thead><tbody>' +
      (list || []).map(function (c) {
        var badge = c.ok ? '✅' : (/^no\b/i.test(String(c.durata || '')) ? '❌' : '⚠️');
        return '<tr><td>' + badge + '</td><td>' + esc(c.item) + '</td><td class="muted">' + esc(c.durata) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function renderPrep() {
    var el = $('#tab-prep');
    if (!el) return;
    var mp = D.mealPrep || {};

    var timeline = '<ol class="stepper">' + (mp.timelineDomenica || []).map(function (s) {
      return '<li><span class="label">' + esc(s.orario || '') + '</span><b>' + esc(s.titolo || '') + '</b>' +
        '<ul class="dots mt">' + (s.attivita || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></li>';
    }).join('') + '</ol>';

    var batches = (mp.batches || []).map(function (b) {
      return '<details class="acc"><summary>🍱 Batch ' + esc(b.n) + ' · ' + esc(b.nome || '') + '</summary><div class="acc-body">' +
        '<p class="sub">' + esc(b.dettaglio || '') + '</p>' +
        (b.conservazione ? '<p class="nota mt">🧊 ' + esc(b.conservazione) + '</p>' : '') + '</div></details>';
    }).join('');

    var contenitori = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tipo</th><th>Capienza</th><th>Utilizzo</th></tr></thead><tbody>' +
      (mp.contenitori || []).map(function (c) {
        return '<tr><td>' + esc(c.tipo) + '</td><td class="muted">' + esc(c.capienza) + '</td><td class="muted">' + esc(c.utilizzo) + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    var etichette = '<div class="badges mt">' + (D.etichette || []).map(function (e2) {
      return '<span class="pill">' + esc(e2.colore) + ' ' + esc(e2.significato) + '</span>';
    }).join('') + '</div>';

    var cons = mp.conservazione || {};
    var hacks = (mp.hacks || []).map(function (h) {
      return '<div class="card"><h3>🪄 ' + esc(h.titolo || '') + '</h3><p class="sub">' + esc(h.testo || '') + '</p></div>';
    }).join('');

    var cl = mp.checklist || {};
    var checklists =
      prepChecklistHtml('kit', '🧰 Prima di partire (kit)', cl.primaDiPartire) +
      prepChecklistHtml('dom-mattina', '🌅 Domenica mattina', cl.domenicaMattina) +
      prepChecklistHtml('dom-pomeriggio', '🌇 Domenica pomeriggio (batch)', cl.domenicaPomeriggio) +
      prepChecklistHtml('lun-sab', '📆 Lunedì → Sabato', cl.lunSab);

    var ris = mp.risparmio || {};
    function rispTable(rows, cols) {
      return '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
        (rows || []).map(function (r) {
          return '<tr><td>' + esc(r.voce || r.metrica || '') + '</td><td class="muted">' + esc(r.senza || '') + '</td><td class="muted">' + esc(r.con || '') + '</td><td>' + esc(r.risparmio || '') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }

    var tempi = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Giorno</th><th>Minuti</th><th>Tipo</th></tr></thead><tbody>' +
      (mp.tempoGiorni || []).map(function (t) {
        return '<tr><td>' + esc(t.giorno) + '</td><td>' + esc(t.minuti) + '′</td><td class="muted">' + esc(t.tipo) + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    var perche = '<ul class="dots">' + (mp.percheFunziona || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>';

    // Tempo attivo settimanale derivato dalla riga TOTALE di tempoGiorni
    var tot = (mp.tempoGiorni || []).filter(function (t) { return /totale/i.test(String(t.giorno || '')); })[0];
    var tempoAttivo = '~6h 35′';
    if (tot && tot.minuti != null) {
      var tm = +tot.minuti;
      tempoAttivo = '~' + Math.floor(tm / 60) + 'h ' + pad2(tm % 60) + '′';
    }

    el.innerHTML =
      '<div class="section-title"><h2>🍳 Meal Prep</h2><span class="label">batch cooking</span></div>' +
      '<div class="card"><h3>La strategia</h3><p class="sub">' + esc(mp.strategia || '') + '</p>' +
      (mp.tempoSettimanale ? '<p class="nota mt">⏱ ' + esc(mp.tempoSettimanale) + '</p>' : '') + '</div>' +

      '<div class="grid2">' +
      '<div class="card"><p class="label">Risparmio</p><h3>' + esc(ris.settimanale || '—') + '/sett.</h3><small class="muted">' + esc(ris.annuale || '') + '/anno</small></div>' +
      '<div class="card"><p class="label">Tempo attivo</p><h3>' + esc(tempoAttivo) + '</h3><small class="muted">a settimana, prep compreso</small></div>' +
      '</div>' +

      '<div class="section-title"><h2>⏰ Timeline della domenica</h2></div>' +
      '<div class="card">' + timeline + '</div>' +

      '<div class="section-title"><h2>🍱 Gli 8 batch</h2></div>' + batches +

      '<div class="section-title"><h2>📦 Contenitori & etichette</h2></div>' +
      '<div class="card">' + contenitori + etichette + '</div>' +

      '<div class="section-title"><h2>🧊 Conservazione</h2></div>' +
      '<details class="acc" open><summary>🧊 Frigo (0–4°C)</summary><div class="acc-body">' + consTable(cons.frigo) + '</div></details>' +
      '<details class="acc"><summary>❄️ Freezer (−18°C)</summary><div class="acc-body">' + consTable(cons.freezer) + '</div></details>' +
      '<details class="acc"><summary>🍌 Fresco (consumo giornaliero)</summary><div class="acc-body">' + consTable(cons.fresco) + '</div></details>' +

      '<div class="section-title"><h2>🪄 I 7 hack</h2></div>' + hacks +

      '<div class="section-title"><h2>✅ Checklist</h2>' +
      '<button type="button" class="btn warn-btn" data-action="reset-prep" style="margin-left:auto">Reset settimana</button></div>' +
      checklists +

      '<div class="section-title"><h2>💶 Risparmio & tempi</h2></div>' +
      '<details class="acc"><summary>💶 Risparmio settimanale</summary><div class="acc-body">' + rispTable(ris.confrontoSettimanale, ['Voce', 'Senza', 'Con prep', 'Risparmio']) + '</div></details>' +
      '<details class="acc"><summary>📊 Confronto mensile</summary><div class="acc-body">' + rispTable(ris.confrontoMensile, ['Metrica', 'Senza', 'Con prep', 'Guadagno']) + '</div></details>' +
      '<details class="acc"><summary>⏱ Tempo in cucina per giorno</summary><div class="acc-body">' + tempi +
        (mp.tempoNota ? '<p class="nota mt">' + esc(mp.tempoNota) + '</p>' : '') + '</div></details>' +
      '<details class="acc"><summary>🎯 Perché funziona per voi</summary><div class="acc-body">' + perche + '</div></details>';
  }

  // ---------------------------------------------------------
  // SPESA
  // ---------------------------------------------------------
  var spesaHide = false;

  function renderSpesa() {
    var el = $('#tab-spesa');
    if (!el) return;
    var done = getState('spesa', {}) || {};
    var totale = spesaCount();
    var pct = totale.tot ? Math.round(totale.fatti / totale.tot * 100) : 0;

    var cats = (D.spesa || []).map(function (cat) {
      var allItems = (cat.items || []);
      var fatti = allItems.filter(function (it) { return done[slug(cat.categoria) + '|' + slug(it.prodotto)]; }).length;
      var visible = spesaHide ? allItems.filter(function (it) { return !done[slug(cat.categoria) + '|' + slug(it.prodotto)]; }) : allItems;
      if (spesaHide && !visible.length) return ''; // categoria completata: nascondi
      var rows = visible.map(function (it) {
        var id = slug(cat.categoria) + '|' + slug(it.prodotto);
        var on = !!done[id];
        return '<li><button type="button" class="checkitem' + (on ? ' on' : '') + '" data-spesa="' + esc(id) + '" aria-pressed="' + on + '">' +
          '<span class="box">✓</span><span class="txt"><b>' + esc(it.prodotto) + '</b> · ' + esc(it.quantita || '') +
          (it.note ? '<small>' + esc(it.note) + '</small>' : '') + '</span></button></li>';
      }).join('');
      return '<details class="acc" open><summary>' + esc(cat.categoria || '') +
        ' <span class="pill cat-count" data-cat="' + esc(slug(cat.categoria)) + '" style="margin-left:auto">' + fatti + '/' + allItems.length + '</span></summary>' +
        '<div class="acc-body"><ul class="checklist">' + rows + '</ul></div></details>';
    }).join('');

    var st = D.spesaTiming || {};
    function lista(arr) { return '<ul class="dots">' + (arr || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }

    el.innerHTML =
      '<div class="section-title"><h2>🛒 Spesa settimanale</h2></div>' +
      '<div class="card"><div class="count-line" style="margin:0 0 8px">' +
      '<span class="pill" id="spesa-count">🧺 ' + totale.fatti + '/' + totale.tot + ' presi · ' + pct + '%</span>' +
      '<button type="button" class="btn' + (spesaHide ? ' on-soft' : '') + '" data-action="spesa-hide">' + (spesaHide ? '👁️ Mostra tutti' : '🛍️ Nascondi presi') + '</button>' +
      '<button type="button" class="btn warn-btn" data-action="reset-spesa">Reset</button></div>' +
      '<div class="pbar"><span id="spesa-bar" style="width:' + pct + '%"></span></div></div>' +
      (spesaHide && totale.fatti === totale.tot && totale.tot ? '<div class="card empty">🎉 Spesa completata! Tutti i prodotti presi.</div>' : '') +
      cats +
      '<div class="section-title"><h2>📅 Quando comprare cosa</h2></div>' +
      '<details class="acc"><summary>🛍️ Freschi — domenica (giorno spesa)</summary><div class="acc-body">' + lista(st.freschiDomenica) + '</div></details>' +
      '<details class="acc"><summary>📆 Durante la settimana</summary><div class="acc-body">' + lista(st.perGiorno) + '</div></details>' +
      '<details class="acc"><summary>🗃️ Scorta ogni 2–3 settimane</summary><div class="acc-body">' + lista(st.fissa2_3settimane) + '</div></details>';
  }

  // Aggiorna SOLO barra %, contatore totale e pillola della categoria
  // toccata, senza ricostruire la lista (preserva scroll e details aperti).
  function updateSpesaProgress(catSlug) {
    var done = getState('spesa', {}) || {};
    var totale = spesaCount();
    var pct = totale.tot ? Math.round(totale.fatti / totale.tot * 100) : 0;

    var bar = $('#spesa-bar');
    if (bar) bar.style.width = pct + '%';
    var cnt = $('#spesa-count');
    if (cnt) cnt.textContent = '🧺 ' + totale.fatti + '/' + totale.tot + ' presi · ' + pct + '%';

    var cat = (D.spesa || []).filter(function (c) { return slug(c.categoria) === catSlug; })[0];
    if (cat) {
      var all = cat.items || [];
      var fatti = all.filter(function (it) { return done[catSlug + '|' + slug(it.prodotto)]; }).length;
      var pill = $('.cat-count[data-cat="' + catSlug + '"]');
      if (pill) pill.textContent = fatti + '/' + all.length;
    }
  }

  // ---------------------------------------------------------
  // DIARIO — tracking personale (umore, peso, idratazione,
  // regolarità, ciclo, note pre-visita) + storico/streak.
  // Tutte le chiavi sono dieta_* → incluse nell'export backup.
  // ---------------------------------------------------------
  var MOODS = [
    { v: 'top', e: '😄', l: 'Top' },
    { v: 'bene', e: '🙂', l: 'Bene' },
    { v: 'ok', e: '😐', l: 'OK' },
    { v: 'giu', e: '😴', l: 'Stanco/a' },
    { v: 'ko', e: '😣', l: 'In difficoltà' }
  ];
  var WATER_TARGET = { lui: 10, lei: 8 };
  var COACH = [
    '🚀 Giorno 1 — si parte! La prima settimana è la più dura: il corpo si abitua alla finestra 12–21. Sii gentile con te.',
    '💧 La fame dei primi giorni è soprattutto abitudine e sete: bevi un bicchiere d\'acqua e aspetta 10 minuti.',
    '🍳 Rompi il digiuno con proteine e verdura, i carboidrati per ultimi: meno crollo di energia dopo pranzo.',
    '🧠 La fame “di testa” (edonica) è massima ora e poi cala da sola: è scienza, non mancanza di volontà.',
    '⏰ La costanza degli orari conta più della perfezione: stesso risveglio, stesso Pasto 1.',
    '💪 Le proteine sono la vera leva contro la fame: se hai fame a fine giornata, di solito sono proteine basse.',
    '🌙 Magnesio la sera e niente caffè dopo le 18 aiutano il sonno: il riposo è metà del lavoro.',
    '🎉 Una settimana fatta! La fase più difficile è alle spalle. Da qui diventa routine.',
    '🔁 Ora è abitudine: continua così e usa il Diario per vedere i tuoi progressi.',
    '⭐ 10 giorni: sei dentro il ritmo. Il resto è costanza gentile, un giorno alla volta.'
  ];

  function parseDate(dk) {
    var m = /(\d{4})-(\d{2})-(\d{2})/.exec(String(dk || ''));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date();
  }
  function daysSince(dk) {
    var a = parseDate(dk); a.setHours(0, 0, 0, 0);
    var b = new Date(); b.setHours(0, 0, 0, 0);
    return Math.round((b - a) / 86400000);
  }
  function startDate() {
    var s = getState('start', null);
    if (!s) { s = todayKey(); setState('start', s); }
    return s;
  }

  // umore / energia
  function moodGet(dk) { return getState('mood_' + (dk || todayKey()), {}) || {}; }
  function moodSet(per, v) {
    var m = moodGet();
    if (m[per] === v) delete m[per]; else m[per] = v;
    setState('mood_' + todayKey(), m);
  }
  function moodObj(v) { for (var i = 0; i < MOODS.length; i++) if (MOODS[i].v === v) return MOODS[i]; return null; }

  // idratazione
  function waterGet(dk) { return getState('water_' + (dk || todayKey()), {}) || {}; }
  function waterAdd(per, delta) {
    var w = waterGet();
    w[per] = Math.max(0, Math.min(30, (w[per] || 0) + delta));
    setState('water_' + todayKey(), w);
  }

  // peso
  function weightGet() { var w = getState('weight', null); return (w && typeof w === 'object') ? w : { lui: [], lei: [] }; }
  function weightAdd(per, kg) {
    var w = weightGet(); if (!w[per]) w[per] = [];
    var dk = todayKey();
    w[per] = w[per].filter(function (e) { return e.date !== dk; });
    w[per].push({ date: dk, kg: kg });
    w[per].sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    setState('weight', w);
  }

  // orari (per regolarità)
  function timesGet(dk) { return getState('times_' + (dk || todayKey()), {}) || {}; }
  function timesSet(per, field, val) {
    var t = timesGet(); if (!t[per]) t[per] = {};
    if (val) t[per][field] = val; else delete t[per][field];
    setState('times_' + todayKey(), t);
  }
  function regularity(per) {
    var fields = [{ k: 'sveglia', l: 'Sveglia', ic: '⏰' }, { k: 'pasto1', l: 'Pasto 1', ic: '🍽️' }, { k: 'sonno', l: 'Sonno', ic: '😴' }];
    var bucket = { sveglia: [], pasto1: [], sonno: [] };
    for (var i = 0; i < 14; i++) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var pt = (timesGet(todayKey(d))[per]) || {};
      fields.forEach(function (f) { var mn = toMin(pt[f.k]); if (mn != null) bucket[f.k].push(mn); });
    }
    return fields.map(function (f) {
      var arr = bucket[f.k];
      if (arr.length < 3) return { l: f.l, ic: f.ic, n: arr.length, status: 'na' };
      var spread = Math.max.apply(null, arr) - Math.min.apply(null, arr);
      return { l: f.l, ic: f.ic, n: arr.length, spread: spread, status: spread <= 45 ? 'ok' : spread <= 90 ? 'mid' : 'bad' };
    });
  }

  // ciclo (lei)
  function cycleGet() { return getState('cycle', {}) || {}; }
  function cycleInfo() {
    var c = cycleGet(); if (!c.lastStart) return null;
    var len = +c.len || 28; if (len < 20 || len > 40) len = 28;
    var since = daysSince(c.lastStart); if (since < 0) since = 0;
    var day = (since % len) + 1;
    var phase, soft = false;
    if (day <= 5) { phase = 'Mestruale'; soft = true; }
    else if (day <= 13) phase = 'Follicolare';
    else if (day <= 16) phase = 'Ovulatoria';
    else if (day >= len - 4) { phase = 'Premestruale'; soft = true; }
    else phase = 'Luteale';
    return { day: day, len: len, phase: phase, soft: soft };
  }

  // note / diario pre-visita
  function notesGet() { var n = getState('notes', []); return Array.isArray(n) ? n : []; }
  function noteAdd(per, text) {
    var n = notesGet();
    n.unshift({ date: todayKey(), persona: per, text: text });
    setState('notes', n.slice(0, 300));
  }
  function noteDel(i) { var n = notesGet(); n.splice(i, 1); setState('notes', n); }

  // completamento giornata (per streak/heatmap) — usa i pasti del giorno della settimana
  function dayMeals(dateKey) { var g = (D.giorni || [])[dayIndex(parseDate(dateKey))]; return (g && g.pasti) || []; }
  function dayCompletion(dateKey) {
    var t = getState('track_' + dateKey, {}) || {};
    var meals = dayMeals(dateKey); if (!meals.length) return 0;
    var total = 0, done = 0;
    attivi().forEach(function (per) { meals.forEach(function (p) { total++; if (t['p' + p.n + '_' + per]) done++; }); });
    return total ? done / total : 0;
  }
  function currentStreak() {
    var today = new Date(), n = 0, off = 0;
    if (dayCompletion(todayKey(today)) < 0.5) off = 1; // oggi può essere ancora in corso
    for (var i = off; i < 400; i++) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      if (dayCompletion(todayKey(d)) >= 0.5) n++; else break;
    }
    return n;
  }
  function heatmapHtml() {
    var today = new Date(), weeks = 10, ti = dayIndex(today);
    var startMon = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ti - (weeks - 1) * 7);
    var cols = '';
    for (var w = 0; w < weeks; w++) {
      var cells = '';
      for (var d = 0; d < 7; d++) {
        var date = new Date(startMon.getFullYear(), startMon.getMonth(), startMon.getDate() + w * 7 + d);
        var dk = todayKey(date), lvl;
        if (date > today) lvl = 'f';
        else { var p = dayCompletion(dk); lvl = p <= 0 ? '0' : p < 0.34 ? '1' : p < 0.67 ? '2' : p < 1 ? '3' : '4'; }
        cells += '<span class="hm-cell hm-' + lvl + '" title="' + dk + '"></span>';
      }
      cols += '<span class="hm-col">' + cells + '</span>';
    }
    return '<div class="heatmap" role="img" aria-label="Calendario aderenza ultime 10 settimane">' + cols + '</div>';
  }
  function sparkline(points) {
    if (!points || points.length < 2) return '';
    var vals = points.map(function (p) { return p.kg; });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), range = (max - min) || 1;
    var W = 260, H = 56, pad = 6, step = (W - 2 * pad) / (points.length - 1);
    var path = points.map(function (p, i) {
      var x = pad + i * step, y = H - pad - ((p.kg - min) / range) * (H - 2 * pad);
      return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }).join(' ');
    var last = points[points.length - 1];
    var lx = pad + (points.length - 1) * step, ly = H - pad - ((last.kg - min) / range) * (H - 2 * pad);
    return '<svg class="spark" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + path + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="3.5" fill="var(--accent)"/></svg>';
  }

  function coachBanner() {
    var day = daysSince(startDate());
    if (day < 0 || day > COACH.length - 1) return '';
    var msg = COACH[Math.min(day, COACH.length - 1)];
    return '<div class="card coach"><span class="coach-day">Giorno ' + (day + 1) + '/10</span>' +
      '<p>' + esc(msg) + '</p></div>';
  }

  // mini-card umore + idratazione per la tab Oggi
  function moodWaterCard() {
    var rows = attivi().map(function (per) {
      var cur = moodGet()[per];
      var buttons = MOODS.map(function (m) {
        return '<button type="button" class="mood-btn' + (cur === m.v ? ' on' : '') + '" data-mood="' + per + ':' + m.v + '" aria-label="' + esc(m.l) + '" aria-pressed="' + (cur === m.v) + '">' + m.e + '</button>';
      }).join('');
      var w = waterGet()[per] || 0, tgt = WATER_TARGET[per] || 8;
      return '<div class="mw-row">' +
        '<div class="mw-head"><span class="badge ' + per + '">' + personaEmoji(per) + (persona === 'entrambi' ? '' : (per === 'lui' ? ' Lui' : ' Lei')) + '</span></div>' +
        '<div class="mood-row">' + buttons + '</div>' +
        '<div class="water-row"><button type="button" class="wbtn" data-water="' + per + ':-1" aria-label="Meno acqua">−</button>' +
        '<span class="water-val">💧 ' + w + '/' + tgt + '</span>' +
        '<button type="button" class="wbtn" data-water="' + per + ':1" aria-label="Più acqua">+</button>' +
        '<small class="muted">bicchieri</small></div>' +
        '</div>';
    }).join('');
    return '<div class="card"><h2>🌤️ Come stai oggi</h2>' +
      '<p class="sub small">Un tap al giorno: energia e idratazione. La sete spesso si traveste da fame.</p>' +
      rows + '</div>';
  }

  function renderDiario() {
    var el = $('#tab-diario');
    if (!el) return;
    var streak = currentStreak();

    // STORICO + streak
    var storico =
      '<div class="card"><div class="progress-flex">' +
      '<div class="streak-badge"><b>' + streak + '</b><small>giorni<br>di fila</small></div>' +
      '<div><h2>Costanza</h2><p class="sub">' + (streak > 0 ? 'Sei in carreggiata da ' + streak + ' giorn' + (streak === 1 ? 'o' : 'i') + ' (≥ metà spunte) 🔥' : 'Spunta i pasti in “Oggi” per avviare lo streak 🙂') + '</p>' +
      '<p class="sub small mt">Conta i giorni con almeno metà delle spunte: è una bussola gentile, non un voto.</p></div>' +
      '</div>' +
      '<div class="mt"><p class="label">Aderenza · ultime 10 settimane</p>' + heatmapHtml() +
      '<div class="hm-legend"><span>meno</span><span class="hm-cell hm-0"></span><span class="hm-cell hm-1"></span><span class="hm-cell hm-2"></span><span class="hm-cell hm-3"></span><span class="hm-cell hm-4"></span><span>più</span></div></div></div>';

    // UMORE storico (7 giorni)
    var moodHist = attivi().map(function (per) {
      var cells = '';
      for (var i = 6; i >= 0; i--) {
        var d = new Date(); d.setDate(d.getDate() - i);
        var v = (moodGet(todayKey(d))[per]); var mo = moodObj(v);
        var dn = d.toLocaleDateString('it-IT', { weekday: 'short' }).slice(0, 2);
        cells += '<div class="mh-cell"><span class="mh-emo">' + (mo ? mo.e : '·') + '</span><small>' + esc(dn) + '</small></div>';
      }
      return '<div class="mh-row"><span class="badge ' + per + '">' + personaEmoji(per) + '</span><div class="mh-cells">' + cells + '</div></div>';
    }).join('');
    var moodCard = '<div class="card"><h2>🌤️ Energia & umore</h2>' +
      '<p class="sub small">Imposta l\'umore di oggi dalla tab “Oggi”. Qui vedi l\'andamento.</p>' + moodHist + '</div>';

    // PESO
    var pesoCard = '<div class="card"><h2>⚖️ Peso & andamento</h2>' +
      '<p class="sub small">Per lei è il KPI clinico da rivalutare ogni 4–6 settimane con esami. Pesati sempre alla stessa ora.</p>' +
      attivi().map(function (per) {
        var arr = (weightGet()[per] || []);
        var last = arr.length ? arr[arr.length - 1] : null;
        var first = arr.length ? arr[0] : null;
        var delta = (last && first && arr.length > 1) ? (last.kg - first.kg) : null;
        var deltaS = delta == null ? '' : '<span class="pill ' + (delta <= 0 ? 'ok' : '') + '">' + (delta > 0 ? '+' : '') + delta.toFixed(1) + ' kg dall\'inizio</span>';
        return '<div class="weight-block">' +
          '<div class="mw-head"><span class="badge ' + per + '">' + personaEmoji(per) + (per === 'lui' ? ' Lui' : ' Lei') + '</span>' +
          (last ? '<b class="weight-now">' + last.kg.toFixed(1) + ' kg</b>' : '<small class="muted">nessun dato</small>') + deltaS + '</div>' +
          (arr.length > 1 ? sparkline(arr) : '') +
          '<div class="weight-input"><input type="number" inputmode="decimal" step="0.1" min="20" max="250" id="w-' + per + '" class="search" placeholder="kg di oggi…" aria-label="Peso di oggi ' + per + '">' +
          '<button type="button" class="btn" data-wsave="' + per + '">Salva</button></div>' +
          '</div>';
      }).join('') + '</div>';

    // REGOLARITÀ + orari di oggi
    var o = getOrari();
    var regCard = '<div class="card"><h2>🕰️ Regolarità degli orari</h2>' +
      '<p class="sub small">La costanza di sveglia, Pasto 1 e sonno è l\'ancora che aiuta tiroide, ADHD e narcolessia. Registra gli orari di oggi:</p>' +
      attivi().map(function (per) {
        var pt = (timesGet()[per]) || {};
        var inputs = [{ k: 'sveglia', l: '⏰ Sveglia', ph: o.sveglia }, { k: 'pasto1', l: '🍽️ Pasto 1', ph: o.p1 }, { k: 'sonno', l: '😴 Sonno', ph: '04:00' }].map(function (f) {
          return '<label class="time-field"><span>' + f.l + '</span><input type="time" data-time="' + per + ':' + f.k + '" value="' + esc(pt[f.k] || '') + '" aria-label="' + esc(f.l) + ' ' + per + '"></label>';
        }).join('');
        var reg = regularity(per).map(function (r) {
          var ic = r.status === 'ok' ? '🟢' : r.status === 'mid' ? '🟡' : r.status === 'bad' ? '🔴' : '⚪';
          var txt = r.status === 'na' ? 'pochi dati' : '±' + Math.round(r.spread / 2) + ' min';
          return '<span class="pill">' + r.ic + ' ' + esc(r.l) + ' ' + ic + ' <small>' + txt + '</small></span>';
        }).join('');
        return '<div class="reg-block"><div class="mw-head"><span class="badge ' + per + '">' + personaEmoji(per) + (per === 'lui' ? ' Lui' : ' Lei') + '</span></div>' +
          '<div class="time-row">' + inputs + '</div>' +
          '<div class="badges mt">' + reg + '</div></div>';
      }).join('') + '</div>';

    // CICLO (solo se lei attiva)
    var cicloCard = '';
    if (attivi().indexOf('lei') >= 0) {
      var ci = cycleInfo();
      var c = cycleGet();
      var info = ci ? '<div class="badges mt"><span class="pill lei-pill">👩 Giorno ' + ci.day + '/' + ci.len + ' · ' + esc(ci.phase) + '</span></div>' +
        (ci.soft ? '<div class="nota mt">🌙 Fase ' + esc(ci.phase.toLowerCase()) + ': considera una <b>finestra morbida (14:10)</b> e non scendere sotto le 1.400 kcal. Il digiuno rigido ora può alzare il cortisolo. <small>[da validare col medico]</small></div>' : '') : '';
      cicloCard = '<div class="card"><h2>🌸 Ciclo (solo lei · solo locale)</h2>' +
        '<p class="sub small">Privato, resta sul dispositivo. Aiuta ad ammorbidire il digiuno nei giorni giusti per non stressare tiroide e ormoni.</p>' +
        '<div class="cycle-input"><label class="time-field"><span>Inizio ultimo ciclo</span><input type="date" id="cycle-start" value="' + esc(c.lastStart || '') + '"></label>' +
        '<label class="time-field"><span>Durata media (gg)</span><input type="number" id="cycle-len" min="20" max="40" step="1" value="' + esc(c.len || 28) + '" inputmode="numeric"></label>' +
        '<button type="button" class="btn" data-cycle-save>Salva</button></div>' + info + '</div>';
    }

    // NOTE / DIARIO pre-visita
    var notes = notesGet();
    var noteList = notes.length ? notes.slice(0, 40).map(function (nt, i) {
      var who = nt.persona === 'lui' ? '👦' : nt.persona === 'lei' ? '👩' : '👫';
      return '<li class="note-item"><div><b>' + who + ' ' + esc(nt.date) + '</b><p>' + esc(nt.text) + '</p></div>' +
        '<button type="button" class="note-del" data-note-del="' + i + '" aria-label="Elimina nota">🗑️</button></li>';
    }).join('') : '<li class="empty">Nessuna nota. Annota sintomi, energia, domande per le visite.</li>';
    var perOpts = '<select id="note-per" class="note-per" aria-label="Per chi è la nota">' +
      '<option value="lui">👦 Lui</option><option value="lei">👩 Lei</option><option value="entrambi">👫 Entrambi</option></select>';
    var notesCard = '<div class="card"><h2>📝 Diario & note per le visite</h2>' +
      '<p class="sub small">Sintomi, energia, domande per endocrinologo/neurologo/dentista/nutrizionista. Incluse nel backup.</p>' +
      '<div class="note-form"><textarea id="note-text" class="note-text" rows="2" placeholder="Es. molta stanchezza nel pomeriggio, gengive meglio…" aria-label="Nuova nota"></textarea>' +
      '<div class="note-actions">' + perOpts + '<button type="button" class="btn" data-note-add>Aggiungi</button></div></div>' +
      '<ul class="note-list mt">' + noteList + '</ul></div>';

    el.innerHTML =
      '<div class="section-title"><h2>📔 Diario</h2><span class="label">solo sul tuo dispositivo</span></div>' +
      storico + moodCard + pesoCard + regCard + cicloCard + notesCard +
      '<p class="sub small" style="text-align:center;margin-top:14px">⚠️ Strumento di auto-osservazione, non diagnostico. Porta questi dati ai tuoi curanti.</p>';
  }

  function rerenderActive() {
    if (activeTab === 'diario') renderDiario();
    else if (activeTab === 'oggi') { dirty.oggi = true; renderOggi(); }
  }

  // ---------------------------------------------------------
  // Impostazioni / menu "Altro"
  // ---------------------------------------------------------
  function openMenu() {
    var html =
      '<h2>⚙️ Altro & impostazioni</h2>' +
      '<div class="menu-list">' +
      '<button type="button" class="menu-btn" data-action="go:prep"><span class="ico">🍳</span><span>Meal Prep<small>Timeline domenica, batch, conservazione</small></span></button>' +
      '<button type="button" class="menu-btn" data-action="go:spesa"><span class="ico">🛒</span><span>Lista della spesa<small>Checklist e timing acquisti</small></span></button>' +
      '</div>' +
      '<h3 class="mt">🎨 Tema</h3>' +
      '<div class="seg-theme">' +
      '<button type="button" class="chip' + (theme === 'auto' ? ' on' : '') + '" data-action="theme:auto">Auto</button>' +
      '<button type="button" class="chip' + (theme === 'dark' ? ' on' : '') + '" data-action="theme:dark">🌙 Scuro</button>' +
      '<button type="button" class="chip' + (theme === 'light' ? ' on' : '') + '" data-action="theme:light">☀️ Chiaro</button>' +
      '</div>' +
      '<h3 class="mt">💾 Backup dati</h3>' +
      '<p class="sub small">Safari può cancellare i dati locali se l\'app non viene usata a lungo: esporta un backup ogni tanto.</p>' +
      '<div class="menu-list">' +
      '<button type="button" class="menu-btn" data-action="export"><span class="ico">📤</span><span>Esporta backup<small>Scarica un file JSON con spunte e preferenze</small></span></button>' +
      '<button type="button" class="menu-btn" data-action="import"><span class="ico">📥</span><span>Importa backup<small>Ripristina da un file esportato</small></span></button>' +
      '</div>';
    openSheet(html, 'Impostazioni');
  }

  function exportBackup() {
    var data = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        // la chiave API non lascia mai il dispositivo (promessa privacy della tab AI)
        if (k && k.indexOf('dieta_') === 0 && k !== 'dieta_ai_key') data[k] = localStorage.getItem(k);
      }
    } catch (e) { /* noop */ }
    var payload = { app: 'dieta-168', exported: new Date().toISOString(), data: data };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dieta-backup-' + todayKey() + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }

  function importBackup(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var payload = JSON.parse(String(reader.result || ''));
        var data = payload && payload.data;
        if (!data || typeof data !== 'object') throw new Error('formato non valido');
        var skipped = 0;
        Object.keys(data).forEach(function (k) {
          if (k.indexOf('dieta_') === 0 && k !== 'dieta_ai_key' && typeof data[k] === 'string') {
            // valida che il valore sia JSON parsabile prima di scriverlo:
            // un backup manomesso non deve poter rompere getState
            try { JSON.parse(data[k]); }
            catch (eVal) { skipped++; return; }
            try { localStorage.setItem(k, data[k]); } catch (e) { /* noop */ }
          }
        });
        alert('Backup importato ✅' +
          (skipped > 0 ? ' — ' + skipped + ' voce/i ignorata/e perché non valida/e.' : '') +
          ' — l\'app verrà ricaricata.');
        location.reload();
      } catch (e) {
        alert('File non valido: ' + e.message);
      }
    };
    reader.readAsText(file);
  }

  // ---------------------------------------------------------
  // Eventi (delegation globale)
  // ---------------------------------------------------------
  function handleAction(action) {
    var parts = action.split(':');
    var verb = parts[0], arg = parts[1];
    if (verb === 'close-sheet') closeSheet();
    else if (verb === 'reload-app') location.reload();
    else if (verb === 'go') { closeSheet(); showTab(arg); }
    else if (verb === 'theme') { setTheme(arg); openMenu(); }
    else if (verb === 'export') exportBackup();
    else if (verb === 'import') { var f = $('#import-file'); if (f) f.click(); }
    else if (verb === 'spesa-hide') { spesaHide = !spesaHide; renderSpesa(); }
    else if (verb === 'reset-spesa') {
      if (confirm('Azzerare tutte le spunte della spesa?')) { setState('spesa', {}); spesaHide = false; renderSpesa(); }
    }
    else if (verb === 'reset-prep') {
      if (confirm('Azzerare le checklist del meal prep per la nuova settimana?')) { setState('prep', {}); renderPrep(); }
    }
  }

  document.addEventListener('click', function (e) {
    if (!e.target || typeof e.target.closest !== 'function') return;
    var t = e.target.closest(
      '[data-track],[data-tab],[data-p],[data-day],[data-recipe],[data-spesa],[data-prep],[data-filter],[data-tipcat],[data-tipper],[data-action],' +
      '[data-fav],[data-mood],[data-water],[data-wsave],[data-cycle-save],[data-note-add],[data-note-del]'
    );
    if (!t) return;
    var ds = t.dataset;

    if (ds.action != null) { handleAction(ds.action); return; }
    if (ds.tab != null) { showTab(ds.tab); return; }
    if (ds.p != null) { setPersona(ds.p); return; }

    if (ds.track != null) {
      toggleCheck(ds.track);
      dirty.oggi = true; // coerenza al prossimo render completo
      var on = isChecked(ds.track);
      // aggiorna in-place SOLO il bottone toccato...
      t.classList.toggle('on', on);
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
      // ...e, per i pulsanti pasto (.check), aggiorna anche l'etichetta
      if (t.classList.contains('check')) {
        var emo = t.classList.contains('lui') ? '👦 ' : t.classList.contains('lei') ? '👩 ' : '';
        t.textContent = emo + (on ? 'Fatto ✓' : 'Da fare');
      }
      // ...poi solo anello + recap, senza ricostruire la sezione
      updateOggiProgress();
      return;
    }
    if (ds.day != null) { selDay = +ds.day || 0; renderSettimana(); return; }
    if (ds.recipe != null) { openRecipe(ds.recipe); return; }
    if (ds.filter != null) {
      var i = ds.filter.indexOf(':');
      applyRecipeFilter(ds.filter.slice(0, i), ds.filter.slice(i + 1));
      return;
    }
    if (ds.tipcat != null) {
      tipCat = ds.tipcat || null;
      $$('#tab-tips [data-tipcat]').forEach(function (b) { b.classList.toggle('on', (b.dataset.tipcat || null) === tipCat); });
      updateTipsList();
      return;
    }
    if (ds.tipper != null) {
      tipPer = ds.tipper || null;
      $$('#tab-tips [data-tipper]').forEach(function (b) { b.classList.toggle('on', (b.dataset.tipper || null) === tipPer); });
      updateTipsList();
      return;
    }
    if (ds.spesa != null) {
      var sp = getState('spesa', {}) || {};
      if (sp[ds.spesa]) delete sp[ds.spesa]; else sp[ds.spesa] = true;
      setState('spesa', sp);
      dirty.oggi = true; // la shortcut di Oggi mostra il conteggio spesa
      if (spesaHide) {
        // in modalità "nascondi presi" l'item può sparire: render completo
        renderSpesa();
      } else {
        var on = !!sp[ds.spesa];
        t.classList.toggle('on', on);
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
        updateSpesaProgress(String(ds.spesa).split('|')[0]);
      }
      return;
    }
    if (ds.prep != null) {
      var pr = getState('prep', {}) || {};
      if (pr[ds.prep]) delete pr[ds.prep]; else pr[ds.prep] = true;
      setState('prep', pr);
      // aggiorna in place senza chiudere i details
      var open = $$('#tab-prep details.acc').map(function (d) { return d.open; });
      renderPrep();
      $$('#tab-prep details.acc').forEach(function (d, i2) { if (open[i2] != null) d.open = open[i2]; });
      return;
    }
    if (ds.fav != null) {
      favToggle(ds.fav);
      syncFavButtons(ds.fav);
      if (rf.fav && activeTab === 'ricette') updateRicetteResults();
      return;
    }
    if (ds.mood != null) {
      var mp = ds.mood.split(':'); moodSet(mp[0], mp[1]); rerenderActive(); return;
    }
    if (ds.water != null) {
      var wp = ds.water.split(':'); waterAdd(wp[0], +wp[1] || 0); rerenderActive(); return;
    }
    if (ds.wsave != null) {
      var wi = $('#w-' + ds.wsave);
      var kg = wi ? parseFloat(String(wi.value).replace(',', '.')) : NaN;
      if (!isNaN(kg) && kg > 0) { weightAdd(ds.wsave, Math.round(kg * 10) / 10); renderDiario(); }
      else if (wi) { wi.focus(); }
      return;
    }
    if (ds.cycleSave != null) {
      var cs = $('#cycle-start'), cl = $('#cycle-len');
      var cyc = cycleGet();
      if (cs && cs.value) cyc.lastStart = cs.value;
      if (cl && cl.value) cyc.len = +cl.value || 28;
      setState('cycle', cyc); renderDiario(); return;
    }
    if (ds.noteAdd != null) {
      var ntx = $('#note-text'), npe = $('#note-per');
      var txt = ntx ? ntx.value.trim() : '';
      if (txt) { noteAdd(npe ? npe.value : 'entrambi', txt); renderDiario(); }
      else if (ntx) { ntx.focus(); }
      return;
    }
    if (ds.noteDel != null) {
      if (confirm('Eliminare questa nota?')) { noteDel(+ds.noteDel || 0); renderDiario(); }
      return;
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'ricette-q') {
      rf.q = e.target.value.trim();
      updateRicetteResults();
    } else if (e.target && e.target.id === 'porzioni-q') {
      updatePorzioni(e.target.value.trim());
    }
  });

  document.addEventListener('change', function (e) {
    if (!e.target) return;
    if (e.target.id === 'import-file') {
      var f = e.target.files && e.target.files[0];
      if (f) importBackup(f);
      e.target.value = '';
    } else if (e.target.dataset && e.target.dataset.time != null) {
      var tp = String(e.target.dataset.time).split(':');
      timesSet(tp[0], tp[1], e.target.value);
      if (activeTab === 'diario') renderDiario();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
  });

  var bd = $('#sheet-backdrop');
  if (bd) bd.addEventListener('click', closeSheet);

  var btnTheme = $('#btn-theme');
  if (btnTheme) btnTheme.addEventListener('click', function () { setTheme(effLight() ? 'dark' : 'light'); });
  var btnMenu = $('#btn-menu');
  if (btnMenu) btnMenu.addEventListener('click', openMenu);

  // ---------------------------------------------------------
  // PWA: service worker + storage persistente
  // ---------------------------------------------------------
  var updateBannerShown = false;
  function showUpdateBanner() {
    if (updateBannerShown || !document.body) return;
    updateBannerShown = true;
    var b = document.createElement('div');
    b.id = 'update-banner';
    b.setAttribute('role', 'status');
    b.innerHTML = '<span>✨ Aggiornamento pronto</span>' +
      '<button type="button" class="btn" data-action="reload-app">Ricarica</button>';
    document.body.appendChild(b);
    // forza reflow per attivare la transizione di entrata
    void b.offsetWidth;
    b.classList.add('show');
  }

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
    // c'era già un controller all'avvio? allora un controllerchange = aggiornamento
    var hadController = !!navigator.serviceWorker.controller;
    try {
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (hadController) showUpdateBanner(); // non sulla prima installazione
      });
    } catch (e) { /* noop */ }
    try {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline-first opzionale */ });
    } catch (e) { /* noop */ }
  }

  var persistAsked = false;
  window.addEventListener('pointerdown', function () {
    if (persistAsked) return;
    persistAsked = true;
    try {
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(function () { /* Safari può rifiutare */ });
      }
    } catch (e) { /* noop */ }
  }, { once: true, passive: true });

  // ---------------------------------------------------------
  // Aggiornamento periodico stato finestra + cambio giorno
  // ---------------------------------------------------------
  var lastDay = todayKey();
  setInterval(function () {
    if (todayKey() !== lastDay) {
      lastDay = todayKey();
      selDay = dayIndex();
      dirtyAll();
      if (activeTab !== 'ai') render(activeTab);
      return;
    }
    if (activeTab === 'oggi') updateStatusCard();
  }, 30000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && activeTab === 'oggi') updateStatusCard();
  });

  // ---------------------------------------------------------
  // Avvio
  // ---------------------------------------------------------
  RENDERERS.oggi = renderOggi;
  RENDERERS.settimana = renderSettimana;
  RENDERERS.ricette = renderRicette;
  RENDERERS.tips = renderTips;
  RENDERERS.prep = renderPrep;
  RENDERERS.spesa = renderSpesa;
  RENDERERS.diario = renderDiario;

  function init() {
    applyTheme();
    syncPersonaUI();
    var foot = $('#app-footer');
    if (foot) foot.textContent = D.disclaimer || '';
    showTab('oggi');
    registerSW();
  }

  // ---------------------------------------------------------
  // FASE 6.1 — Riassunto log per l'assistente AI (contesto proattivo)
  // Espone window.DietLogs.contextSummary(): stringa compatta dei log
  // recenti (aderenza pasti, umore, peso, idratazione, orari, ciclo) che
  // assistant.js appende al contesto runtime del system prompt, così il
  // coach può dare spunti proattivi e personalizzati. Solo lettura,
  // difensivo, nessuna nuova chiave localStorage.
  // ---------------------------------------------------------
  function personaNome(per) { return per === 'lui' ? 'LUI' : per === 'lei' ? 'LEI' : per; }

  function lastMoodInfo(per) {
    for (var i = 0; i < 4; i++) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var v = moodGet(todayKey(d))[per];
      if (v) { var mo = moodObj(v); return { l: mo ? mo.l : v, daysAgo: i }; }
    }
    return null;
  }

  function adherence7() {
    var sum = 0, n = 0;
    for (var i = 1; i <= 7; i++) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var dk = todayKey(d);
      var t = getState('track_' + dk, {}) || {};
      if (!Object.keys(t).length) continue; // giorno non tracciato → non conteggiare
      sum += dayCompletion(dk); n++;
    }
    return n ? Math.round((sum / n) * 100) : null;
  }

  function weightTrend(per) {
    var arr = (weightGet()[per]) || [];
    if (!arr.length) return null;
    var last = arr[arr.length - 1];
    var out = { kg: last.kg, delta: null };
    if (arr.length >= 2) out.delta = Math.round((last.kg - arr[arr.length - 2].kg) * 10) / 10;
    return out;
  }

  function contextSummary() {
    try {
      var lines = [];
      var who = attivi();
      var ds = daysSince(startDate());
      var head = 'Giorno ' + (ds + 1) + ' del piano.';
      var adh = adherence7();
      if (adh != null) head += ' Aderenza pasti ultimi 7gg: ' + adh + '%.';
      var streak = currentStreak();
      if (streak > 0) head += ' Streak attuale: ' + streak + (streak === 1 ? ' giorno.' : ' giorni.');
      lines.push(head);

      var gd = (D.giorni || [])[dayIndex()];
      var todayTot = gd ? dayMacroTotals(gd.id) : null;

      who.forEach(function (per) {
        var parts = [];
        if (todayTot && todayTot[per] && todayTot[per].has) {
          var tg = MACRO_TARGET[per];
          var fl = (tg.floor != null && todayTot[per].kcal < tg.floor) ? ' ⚠️ sotto il minimo ' + tg.floor + ' kcal' : '';
          parts.push('kcal piano oggi ~' + todayTot[per].kcal + ' / ' + todayTot[per].pro + 'g pro (obiettivo ' + tg.kcalMin + '–' + tg.kcalMax + ' kcal)' + fl);
        }
        var mood = lastMoodInfo(per);
        if (mood) parts.push('umore ' + mood.l + (mood.daysAgo === 0 ? ' (oggi)' : ' (' + mood.daysAgo + 'gg fa)'));
        var water = (waterGet()[per]) || 0;
        var wt = WATER_TARGET[per] || 8;
        if (water > 0) parts.push('acqua oggi ' + water + '/' + wt + ' bicchieri');
        var wtr = weightTrend(per);
        if (wtr) parts.push('peso ' + wtr.kg + 'kg' + (wtr.delta != null ? ' (' + (wtr.delta >= 0 ? '+' : '') + wtr.delta + 'kg dall\'ultima misura)' : ''));
        var irreg = regularity(per).filter(function (r) { return r.status === 'bad'; }).map(function (r) { return r.l.toLowerCase(); });
        if (irreg.length) parts.push('orari poco regolari: ' + irreg.join(', '));
        if (parts.length) lines.push('- ' + personaNome(per) + ': ' + parts.join(' · '));
      });

      if (who.indexOf('lei') !== -1) {
        var ci = cycleInfo();
        if (ci) lines.push('- LEI ciclo: giorno ' + ci.day + ' (' + ci.phase + (ci.soft ? ', fase delicata' : '') + ')');
      }
      return lines.join('\n');
    } catch (e) { return ''; }
  }

  window.DietLogs = { contextSummary: contextSummary };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
