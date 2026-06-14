// ============================================================
// RECIPES — Ricettario varianti & alternative ai pasti del piano
// Dieta 16:8 di coppia · LUI (narcolessia+ADHD) · LEI (ipotiroidismo+parodontite)
// Tutte le ricette rispettano i vincoli clinici di entrambi
// (o dichiarano persona: 'lui' / 'lei' con motivazione).
// Vanilla JS — caricato via <script>, esposto su window.RECIPES
// ============================================================

const RECIPES = [

  // ══════════════════════════════════════════════
  // P1 — PASTO PRINCIPALE 13:00 (9 ricette)
  // ══════════════════════════════════════════════

  {
    id: 'r01',
    nome: 'Frittata di patate e provola al forno',
    emoji: '🥔',
    gradient: ['#f59e0b', '#d97706'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 30,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['forno', 'proteico', 'meal-prep', 'senza-semi', 'comfort'],
    descrizione: 'La frittata "che sazia davvero": patate già lessate dal batch della domenica + uova + provola filante. Si prepara in teglia, si porziona e dura 3 giorni in frigo.',
    ingredienti: [
      { nome: 'Uova', lui: '3 intere', lei: '2 + 1 albume' },
      { nome: 'Patate lessate a fette', lui: '1 patata media', lei: '1 patata piccola' },
      { nome: 'Provola a cubetti', lui: '40g', lei: '30g' },
      { nome: 'Olio EVO', lui: '1 cucchiaio', lei: '1 cucchiaio' },
      { nome: 'Rosmarino + pepe nero', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Sbatti le uova in una ciotola con un pizzico di sale e pepe nero.',
      'Disponi le fette di patata già lessata sul fondo di una teglia piccola oliata.',
      'Versa le uova sbattute sopra le patate e distribuisci i cubetti di provola.',
      'Inforna a 180° per 18–20 minuti: deve risultare completamente rappresa al centro (prova stecchino asciutto).',
      'Lascia intiepidire 5 minuti prima di tagliare: si porziona meglio.'
    ],
    tips: 'Fai una teglia doppia la domenica: metà si mangia subito, metà va in frigo porzionata per un P1 lampo da 2 minuti. In frigo regge 3 giorni.',
    sicurezzaLei: 'Senza semi ✅ · morbidissima ✅ · formaggio consentito ✅',
    sicurezzaLui: 'Uova ben cotte al forno ✅ · provola in lista ✅ · carbo (patate) sempre con proteine ✅',
    macros: { kcalLui: '~480', kcalLei: '~380', proteine: 'alte' }
  },

  {
    id: 'r02',
    nome: 'Crepes integrali salate zucchine e mozzarella',
    emoji: '🫓',
    gradient: ['#84cc16', '#22c55e'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 20,
    difficolta: 'media',
    mealPrep: true,
    tags: ['comfort', 'padella', 'senza-semi', 'morbido'],
    descrizione: 'Comfort food compliant: crepes sottili di farina integrale farcite con zucchine saltate e mozzarella. Morbidissime per lei, proteiche per lui.',
    ingredienti: [
      { nome: 'Farina integrale', lui: '5 cucchiai (~70g)', lei: '4 cucchiai (~55g)' },
      { nome: 'Uova nell\'impasto', lui: '2 intere', lei: '1 + 1 albume' },
      { nome: 'Latte', lui: '150ml intero', lei: '130ml p. scremato' },
      { nome: 'Zucchine a julienne saltate', lui: '1 zucchina', lei: '1 zucchina' },
      { nome: 'Mozzarella ben scolata', lui: '½ pallina (60g)', lei: '½ pallina (60g)' },
      { nome: 'Olio EVO', lui: '1 cucchiaino', lei: '1 cucchiaino' }
    ],
    passaggi: [
      'Frulla o sbatti bene farina, uova e latte fino a pastella liscia senza grumi. Riposo 10 min se hai tempo.',
      'Salta le zucchine a julienne in padella con olio EVO finché morbide (5–6 min).',
      'Cuoci le crepes in padella antiaderente calda: 1 mestolo scarso, 2 minuti per lato — la pastella con uovo deve essere ben cotta, non bavosa.',
      'Farcisci ogni crepe con zucchine e mozzarella, piega a metà e rimetti in padella 1 minuto coperta: la mozzarella fila e il ripieno si scalda.',
      'Servi calde, eventualmente con una spolverata di parmigiano per lui.'
    ],
    tips: 'Le crepes vuote si congelano benissimo separate da carta forno: ne fai 10 la domenica e le farcisci al momento in 3 minuti.',
    sicurezzaLei: 'Senza semi ✅ · morbide e facili da masticare ✅',
    sicurezzaLui: 'Uovo nell\'impasto completamente cotto ✅ · carbo+proteine insieme ✅',
    macros: { kcalLui: '~520', kcalLei: '~400', proteine: 'medie-alte' }
  },

  {
    id: 'r03',
    nome: 'Uova in purgatorio con pane integrale',
    emoji: '🍅',
    gradient: ['#ef4444', '#b91c1c'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 15,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['veloce', 'proteico', 'padella', 'senza-semi', 'curcuma'],
    descrizione: 'Uova cotte direttamente nella passata di pomodoro che sobbolle: piatto unico napoletano, una padella sola, perfetto con passata che è già senza semi per lei.',
    ingredienti: [
      { nome: 'Passata di pomodoro', lui: '200ml', lei: '180ml' },
      { nome: 'Uova', lui: '3 intere', lei: '2 intere' },
      { nome: 'Pane integrale (senza semi)', lui: '2 fette', lei: '1 fetta e ½ morbida' },
      { nome: 'Aglio + basilico', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Olio EVO', lui: '1 cucchiaio', lei: '1 cucchiaio' },
      { nome: 'Parmigiano', lui: '1 cucchiaio', lei: '1 cucchiaino' }
    ],
    passaggi: [
      'Scalda olio e aglio in padella, versa la passata, sala e fai sobbollire 5 minuti con basilico.',
      'Rompi le uova direttamente nel sugo, distanziate tra loro.',
      'Copri con coperchio e cuoci 8–10 minuti: il tuorlo deve risultare COMPLETAMENTE rappreso (vincolo di lui — niente tuorlo liquido).',
      'Spolvera di parmigiano e servi nella padella con il pane: lui tostato per la scarpetta, lei morbido spezzato dentro.'
    ],
    tips: 'Se il tuorlo fatica a rapprendersi, bucalo delicatamente con la forchetta a metà cottura: si cuoce uniforme senza seccare l\'albume.',
    sicurezzaLei: 'Passata = pomodoro già senza semi ✅ · piatto morbidissimo ✅',
    sicurezzaLui: 'Tuorlo ben rappreso obbligatorio (10 min coperto) ✅ · pane sempre con proteine ✅',
    macros: { kcalLui: '~490', kcalLei: '~370', proteine: 'alte' }
  },

  {
    id: 'r04',
    nome: 'Pancakes salati al parmigiano e spinaci',
    emoji: '🥞',
    gradient: ['#10b981', '#047857'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 20,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['proteico', 'padella', 'senza-semi', 'anti-spreco', 'pro-gengive'],
    descrizione: 'La versione salata dei pancakes del venerdì: spinaci saltati frullati nell\'impasto, parmigiano dentro. Verdure nascoste e tanta sazietà.',
    ingredienti: [
      { nome: 'Farina integrale', lui: '5 cucchiai (~70g)', lei: '4 cucchiai (~55g)' },
      { nome: 'Uova', lui: '2 intere', lei: '1 + 1 albume' },
      { nome: 'Spinaci saltati e strizzati', lui: '2 manciate', lei: '2 manciate' },
      { nome: 'Parmigiano grattugiato', lui: '2 cucchiai', lei: '1 cucchiaio' },
      { nome: 'Latte', lui: '100ml intero', lei: '80ml p. scremato' },
      { nome: 'Lievito istantaneo salato', lui: '½ cucchiaino', lei: '½ cucchiaino' }
    ],
    passaggi: [
      'Frulla spinaci già cotti, uova e latte fino a crema verde liscia.',
      'Incorpora farina, parmigiano e lievito: pastella densa ma colabile.',
      'Cuoci in padella antiaderente a fuoco medio-basso: 2–3 minuti per lato, devono essere asciutti dentro (uovo ben cotto).',
      'Servi con ½ avocado a fette e un filo di olio EVO.'
    ],
    tips: 'Riciclo perfetto degli spinaci del batch domenicale. I pancakes salati si conservano 2 giorni in frigo e si rigenerano 30 secondi in padella.',
    sicurezzaLei: 'Senza semi ✅ · soffici e morbidi ✅ · spinaci ok (non brassicacea)',
    sicurezzaLui: 'Uovo cotto dentro l\'impasto ✅ · carbo+proteine+verdure insieme ✅',
    macros: { kcalLui: '~510', kcalLei: '~390', proteine: 'medie-alte' }
  },

  {
    id: 'r05',
    nome: 'Riso saltato uova e zucchine alla curcuma',
    emoji: '🍛',
    gradient: ['#eab308', '#ca8a04'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 12,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['veloce', 'anti-spreco', 'curcuma', 'senza-semi', 'wok', 'anti-infiammatorio'],
    descrizione: 'Riso basmati del batch saltato con uova strapazzate sode, zucchine e curcuma+pepe nero. Pranzo completo in una padella in 12 minuti.',
    ingredienti: [
      { nome: 'Riso basmati già cotto', lui: '1 porzione (~220g cotto)', lei: '¾ porzione (~170g cotto)' },
      { nome: 'Uova', lui: '3 intere', lei: '2 intere' },
      { nome: 'Zucchine a dadini', lui: '1 zucchina', lei: '1 zucchina' },
      { nome: 'Curcuma + pepe nero', lui: '1 cucchiaino + macinata', lei: '1 cucchiaino + macinata' },
      { nome: 'Olio EVO', lui: '1 cucchiaio', lei: '1 cucchiaio' }
    ],
    passaggi: [
      'Salta le zucchine a dadini in padella grande con olio EVO, 5 minuti.',
      'Sposta le zucchine sul bordo, strapazza le uova nello spazio libero finché sono SODE e in pezzi asciutti.',
      'Aggiungi il riso freddo del frigo, curcuma e pepe nero: salta tutto a fuoco vivo 3–4 minuti.',
      'Aggiusta di sale e servi caldo. Per lui: parmigiano a scaglie sopra.'
    ],
    tips: 'Il riso del giorno prima è PERFETTO per saltare (chicco asciutto, non scuoce). Biohack: la curcuma con pepe nero e il grasso dell\'olio raggiunge il massimo assorbimento.',
    sicurezzaLei: 'Senza semi ✅ · chicchi morbidi saltati, non duri ✅',
    sicurezzaLui: 'Uova strapazzate sode ✅ · riso mai da solo: sempre con uova ✅',
    macros: { kcalLui: '~530', kcalLei: '~410', proteine: 'medie-alte' }
  },

  {
    id: 'r06',
    nome: 'French toast salato con scamorza',
    emoji: '🍞',
    gradient: ['#f97316', '#ea580c'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 12,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['veloce', 'comfort', 'padella', 'senza-semi'],
    descrizione: 'Il gemello salato del french toast del martedì: pane integrale inzuppato nell\'uovo, cotto bene in padella e chiuso a "toast" con scamorza che fonde.',
    ingredienti: [
      { nome: 'Pane integrale (senza semi)', lui: '2 fette', lei: '1 fetta e ½' },
      { nome: 'Uova sbattute', lui: '2 intere', lei: '1 + 1 albume' },
      { nome: 'Latte', lui: '50ml', lei: '40ml p. scremato' },
      { nome: 'Scamorza a fette', lui: '2 fette (~40g)', lei: '1 fetta e ½ (~30g)' },
      { nome: 'Olio EVO', lui: '1 cucchiaino', lei: '1 cucchiaino' },
      { nome: 'Origano', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Sbatti uova, latte, sale e origano in un piatto fondo.',
      'Inzuppa bene le fette di pane su entrambi i lati: devono assorbire tutto l\'uovo.',
      'Cuoci in padella a fuoco medio 3 minuti per lato: l\'uovo deve essere asciutto anche al centro del pane.',
      'Appoggia la scamorza su una fetta, chiudi a toast e lascia 1 minuto coperto: fonde senza bruciare il pane.',
      'Per lei: cuoci a fuoco più dolce, resta più morbido.'
    ],
    tips: 'Se il pane è del giorno prima è ancora meglio: assorbe più uovo. Accompagna con frutta consentita per chiudere il pasto.',
    sicurezzaLei: 'Pane senza semi ✅ · consistenza morbida imbevuta ✅',
    sicurezzaLui: 'Uovo completamente rappreso nel pane ✅ · scamorza in lista ✅',
    macros: { kcalLui: '~450', kcalLei: '~350', proteine: 'medie-alte' }
  },

  {
    id: 'r07',
    nome: 'Insalata di riso estiva pollo e avocado',
    emoji: '🥗',
    gradient: ['#06b6d4', '#0891b2'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 10,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['estiva', 'fredda', 'veloce', 'senza-semi', 'anti-spreco'],
    descrizione: 'Pranzo freddo d\'estate: riso basmati del batch, pollo sfilacciato avanzato, avocado e zucchine grigliate. Zero fornelli a mezzogiorno d\'agosto.',
    ingredienti: [
      { nome: 'Riso basmati cotto freddo', lui: '1 porzione (~220g)', lei: '¾ porzione (~170g)' },
      { nome: 'Pollo cotto sfilacciato', lui: '1 palmo (~140g)', lei: '1 palmo scarso (~120g)' },
      { nome: 'Avocado a cubetti', lui: '½ frutto', lei: '½ frutto' },
      { nome: 'Zucchine grigliate a striscioline', lui: '1 zucchina', lei: '1 zucchina (ben morbide)' },
      { nome: 'Limone + olio EVO', lui: '½ limone + 1 cucchiaio', lei: '½ limone + 1 cucchiaio' },
      { nome: 'Olive (solo lui)', lui: '1 cucchiaio', lei: '—' }
    ],
    passaggi: [
      'In una ciotola grande unisci riso freddo, pollo sfilacciato e zucchine grigliate.',
      'Aggiungi l\'avocado a cubetti per ultimo, irrorato subito di limone (non annerisce).',
      'Condisci con olio EVO, sale e una macinata di pepe nero. Lui aggiunge le olive.',
      'Lascia 10 minuti in frigo prima di servire: i sapori si amalgamano.'
    ],
    tips: 'Preparala la sera prima senza avocado in lunch box: la mattina aggiungi solo avocado e limone. Perfetta anche da portare fuori casa.',
    sicurezzaLei: 'Senza semi ✅ (niente pomodorini, niente mais) · tutto morbido ✅',
    sicurezzaLui: 'Riso sempre accompagnato da pollo (proteine) ✅',
    macros: { kcalLui: '~560', kcalLei: '~440', proteine: 'alte' }
  },

  {
    id: 'r08',
    nome: 'Frittatine muffin in stampo (verdure e provola)',
    emoji: '🧁',
    gradient: ['#a855f7', '#7c3aed'],
    momento: ['P1', 'P2'],
    persona: 'entrambi',
    tempoMin: 25,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['meal-prep', 'forno', 'proteico', 'senza-semi', 'porzionabile'],
    descrizione: 'Mini frittate cotte in stampo da muffin: porzioni già pronte e contate, perfette dal frigo per un P1 immediato o un P2 proteico. Il meal prep delle uova per eccellenza.',
    ingredienti: [
      { nome: 'Uova', lui: '3 per porzione (3 stampini)', lei: '2 + 1 albume (3 stampini)' },
      { nome: 'Zucchine + carote grattugiate', lui: '½ tazza', lei: '½ tazza' },
      { nome: 'Provola a dadini', lui: '30g', lei: '25g' },
      { nome: 'Parmigiano', lui: '1 cucchiaio', lei: '1 cucchiaino' },
      { nome: 'Olio EVO per stampi', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Sbatti le uova con sale, pepe e parmigiano.',
      'Unisci le verdure grattugiate crude (zucchine ben strizzate) e la provola a dadini.',
      'Versa negli stampini da muffin oliati riempiendo a ¾.',
      'Inforna a 180° per 18–20 minuti: gonfie e ben rapprese al centro.',
      'Sforma da tiepide. In frigo 3 giorni in contenitore chiuso.'
    ],
    tips: 'Etichetta i contenitori col sistema colori del meal prep: blu lui (3 muffin), rosso lei (3 muffin). Si mangiano anche fredde, ottime fuori casa.',
    sicurezzaLei: 'Senza semi ✅ · sofficissime ✅ · verdure dolci non brassicacee ✅',
    sicurezzaLui: 'Cottura al forno = uovo sempre ben cotto ✅',
    macros: { kcalLui: '~380 (3 pz)', kcalLei: '~300 (3 pz)', proteine: 'alte' }
  },

  {
    id: 'r09',
    nome: 'Farrotto cremoso zucchine e parmigiano',
    emoji: '🌾',
    gradient: ['#d97706', '#92400e'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 35,
    difficolta: 'media',
    mealPrep: true,
    tags: ['comfort', 'meal-prep', 'senza-semi', 'una-pentola'],
    descrizione: 'Il farro del sabato in versione "risottata": cremoso, caldo, mantecato col parmigiano. Una pentola sola e una consistenza che lei mastica senza pensieri.',
    ingredienti: [
      { nome: 'Farro perlato secco', lui: '1 pugno (~80g)', lei: '¾ pugno (~60g)' },
      { nome: 'Zucchine a dadini piccoli', lui: '1 zucchina', lei: '1 zucchina' },
      { nome: 'Brodo (anche di carcassa prep\'d)', lui: '~500ml', lei: '~400ml' },
      { nome: 'Parmigiano', lui: '2 cucchiai', lei: '1 cucchiaio' },
      { nome: 'Cipolla + olio EVO', lui: '¼ cipolla + 1 cucchiaio', lei: '¼ cipolla + 1 cucchiaio' },
      { nome: 'Uovo sodo a spicchi (per completare le proteine)', lui: '2 uova', lei: '1 uovo' }
    ],
    passaggi: [
      'Soffriggi la cipolla tritata fine in olio EVO, aggiungi il farro e tostalo 1 minuto.',
      'Aggiungi brodo caldo poco alla volta come un risotto, mescolando ogni tanto, 25–30 minuti.',
      'A metà cottura unisci le zucchine a dadini: si disfano leggermente e legano.',
      'Spegni e manteca con parmigiano: deve risultare cremoso, all\'onda.',
      'Servi con uova sode a spicchi sopra (rassodate 10 minuti: tuorlo compatto).'
    ],
    tips: 'Cuoci doppio farro: quello avanzato diventa l\'insalata fredda di farro per il P2 del giorno dopo. Con brodo di carcassa prep\'d è anche gratis.',
    sicurezzaLei: 'Chicco cotto a lungo = morbido ✅ · senza semi ✅',
    sicurezzaLui: 'Uova sode 10 min ✅ · cereale sempre con proteine ✅',
    macros: { kcalLui: '~550', kcalLei: '~420', proteine: 'medie-alte' }
  },

  {
    id: 'r29',
    nome: 'Parmigiana bianca di zucchine al forno',
    emoji: '🧀',
    gradient: ['#84cc16', '#facc15'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 40,
    difficolta: 'media',
    mealPrep: true,
    tags: ['forno', 'comfort', 'meal-prep', 'senza-semi', 'morbido'],
    descrizione: 'Parmigiana senza pomodoro: strati di zucchine grigliate, besciamella leggera e provola che fonde. Bianca, delicata, morbidissima per le gengive di lei e proteica per lui.',
    ingredienti: [
      { nome: 'Zucchine a fette (grigliate, non fritte)', lui: '2 zucchine', lei: '2 zucchine' },
      { nome: 'Besciamella leggera (latte, poca farina, EVO)', lui: '~200ml', lei: '~200ml' },
      { nome: 'Provola a fette', lui: '70g', lei: '60g' },
      { nome: 'Parmigiano grattugiato', lui: '3 cucchiai', lei: '2 cucchiai' },
      { nome: 'Uovo sodo a fette per gli strati (quota proteica)', lui: '2 uova', lei: '1 uovo' },
      { nome: 'Olio EVO + noce moscata', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Griglia le fette di zucchina su piastra o padella finché morbide (niente frittura): falle asciugare su carta.',
      'Prepara una besciamella leggera con latte, un cucchiaio di farina e olio EVO, profumata di noce moscata.',
      'In una pirofila alterna strati: zucchine, velo di besciamella, provola, fette di uovo sodo e parmigiano.',
      'Chiudi con besciamella e parmigiano. Inforna a 180° per 20–25 minuti finché dorata e gonfia.',
      'Lascia riposare 10 minuti prima di tagliare: gli strati si compattano e si porziona pulito.'
    ],
    tips: 'La parmigiana bianca migliora il giorno dopo: preparala in teglia doppia e porzionala per 3 P1 lampo. Le zucchine grigliate in batch la domenica dimezzano i tempi.',
    sicurezzaLei: 'Zucchine grigliate morbide, niente frittura ✅ · senza semi ✅ · niente pomodoro acido ✅',
    sicurezzaLui: 'Uovo sodo + formaggi = proteine complete ✅ · cottura al forno ben fatta ✅',
    macros: { kcalLui: '~510', kcalLei: '~400', proteine: 'alte' }
  },

  {
    id: 'r30',
    nome: 'Gnocchi di patate morbidi al burro di parmigiano',
    emoji: '🥟',
    gradient: ['#fbbf24', '#d97706'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 35,
    difficolta: 'media',
    mealPrep: false,
    tags: ['comfort', 'senza-semi', 'morbido', 'invernale'],
    descrizione: 'Gnocchi di patate fatti in casa, conditi solo con un velo di burro fuso e parmigiano: il comfort food più morbido che esista, masticazione minima per lei, accompagnato da uovo sodo per la quota proteica.',
    ingredienti: [
      { nome: 'Patate lessate e schiacciate', lui: '300g', lei: '250g' },
      { nome: 'Farina (quanta ne assorbe l\'impasto)', lui: '~90g', lei: '~75g' },
      { nome: 'Tuorlo come legante', lui: '1', lei: '1' },
      { nome: 'Burro', lui: '15g', lei: '10g' },
      { nome: 'Parmigiano grattugiato', lui: '3 cucchiai', lei: '2 cucchiai' },
      { nome: 'Uovo sodo a spicchi (quota proteica)', lui: '2 uova', lei: '1 uovo' }
    ],
    passaggi: [
      'Schiaccia le patate ancora calde, unisci tuorlo e farina poco alla volta: impasto morbido, non lavorarlo troppo.',
      'Forma rotolini e taglia gli gnocchi: non serve rigarli, lisci restano più teneri.',
      'Tuffali in acqua bollente salata: sono pronti quando salgono a galla (1–2 minuti).',
      'Scolali e saltali un attimo nel burro fuso con un mestolo di acqua di cottura: si crea una cremina.',
      'Manteca con parmigiano fuori dal fuoco e servi con uovo sodo a spicchi accanto.'
    ],
    tips: 'Patate vecchie e farinose = gnocchi migliori (meno farina, più morbidi). Gli gnocchi crudi si congelano su un vassoio infarinato e si cuociono direttamente da surgelati.',
    sicurezzaLei: 'Morbidissimi, quasi senza masticazione ✅ · senza semi ✅ · niente sughi acidi ✅',
    sicurezzaLui: 'Carbo delle patate sempre con uovo sodo + parmigiano (proteine) ✅',
    macros: { kcalLui: '~540', kcalLei: '~420', proteine: 'medie' }
  },

  {
    id: 'r31',
    nome: 'Porridge salato di avena, uovo e parmigiano',
    emoji: '🥣',
    gradient: ['#d6d3d1', '#a8a29e'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 12,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['veloce', 'comfort', 'morbido', 'senza-semi', 'invernale', 'una-pentola'],
    descrizione: 'L\'avena in versione salata e cremosa: cotta nel brodo come un risotto veloce, mantecata con parmigiano e completata da un uovo in camicia ben rappreso. Caldo, morbido, saziante.',
    ingredienti: [
      { nome: 'Fiocchi d\'avena', lui: '60g', lei: '45g' },
      { nome: 'Brodo vegetale o di pollo prep\'d', lui: '~300ml', lei: '~250ml' },
      { nome: 'Uova', lui: '2 intere', lei: '1 intera' },
      { nome: 'Parmigiano grattugiato', lui: '2 cucchiai', lei: '1 cucchiaio' },
      { nome: 'Zucchine grattugiate (facoltative)', lui: '½ zucchina', lei: '½ zucchina' },
      { nome: 'Olio EVO + pepe nero', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Versa l\'avena nel brodo caldo e cuoci 6–8 minuti mescolando: diventa una crema densa.',
      'A metà cottura unisci le zucchine grattugiate, che si sciolgono nel porridge.',
      'Manteca fuori dal fuoco con parmigiano e un filo di olio EVO.',
      'A parte cuoci le uova ben rapprese (sode o strapazzate sode: niente tuorlo liquido per lui) e adagiale sopra.',
      'Finisci con pepe nero macinato e servi subito, bello caldo.'
    ],
    tips: 'È il "risotto dei pigri": una pentola, niente mestolatura continua. L\'avena salata sazia per ore, perfetta prima di un turno di notte per lui.',
    sicurezzaLei: 'Cremoso e morbido ✅ · senza semi ✅ · niente acidità ✅',
    sicurezzaLui: 'Uovo ben cotto (mai tuorlo liquido) ✅ · carbo dell\'avena con uovo e parmigiano ✅',
    macros: { kcalLui: '~470', kcalLei: '~360', proteine: 'medie-alte' }
  },

  {
    id: 'r32',
    nome: 'Clafoutis salato di zucchine e provola',
    emoji: '🍮',
    gradient: ['#a3e635', '#16a34a'],
    momento: ['P1'],
    persona: 'entrambi',
    tempoMin: 35,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['forno', 'proteico', 'meal-prep', 'senza-semi', 'morbido'],
    descrizione: 'Via di mezzo tra una frittata e un flan: pastella morbida di uova, latte e poca farina con zucchine e provola, cotta al forno. Consistenza budino salato, tenerissima per lei.',
    ingredienti: [
      { nome: 'Uova', lui: '3 intere', lei: '2 + 1 albume' },
      { nome: 'Latte', lui: '120ml intero', lei: '100ml p. scremato' },
      { nome: 'Farina', lui: '2 cucchiai', lei: '2 cucchiai' },
      { nome: 'Zucchine a rondelle sottili', lui: '1 zucchina', lei: '1 zucchina' },
      { nome: 'Provola a dadini', lui: '50g', lei: '40g' },
      { nome: 'Parmigiano + olio EVO', lui: '2 cucchiai + q.b.', lei: '1 cucchiaio + q.b.' }
    ],
    passaggi: [
      'Sbatti uova, latte, farina, parmigiano, sale e pepe fino a pastella liscia senza grumi.',
      'Salta le zucchine a rondelle 4–5 minuti in padella finché morbide.',
      'Distribuisci zucchine e provola in una pirofila oliata e versa sopra la pastella.',
      'Inforna a 180° per 25–30 minuti: deve gonfiare e rapprendersi al centro (prova stecchino asciutto).',
      'Lascia intiepidire qualche minuto: si taglia meglio e resta cremoso dentro.'
    ],
    tips: 'Si mangia tiepido o freddo, ottimo anche per il P2 o da portare fuori casa. In frigo regge 3 giorni e si rigenera in padella coperta.',
    sicurezzaLei: 'Consistenza budino, morbidissima ✅ · senza semi ✅',
    sicurezzaLui: 'Uovo completamente rappreso al forno ✅ · carbo+proteine+verdure insieme ✅',
    macros: { kcalLui: '~480', kcalLei: '~370', proteine: 'alte' }
  },

  {
    id: 'r33',
    nome: 'Spezzatino di pollo cremoso con patate (in bianco)',
    emoji: '🍲',
    gradient: ['#fcd34d', '#b45309'],
    momento: ['P1', 'P3'],
    persona: 'entrambi',
    tempoMin: 45,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['comfort', 'meal-prep', 'senza-semi', 'morbido', 'invernale', 'una-pentola'],
    descrizione: 'Bocconcini di pollo brasati a lungo con patate in un fondo bianco cremoso al rosmarino: la carne si sfalda, le patate si sciolgono. Cena-coccola da fare in anticipo, buona sia a pranzo che a cena.',
    ingredienti: [
      { nome: 'Petto/sovracoscia di pollo a bocconcini', lui: '180g', lei: '150g' },
      { nome: 'Patate a tocchetti', lui: '2 medie', lei: '1 e ½' },
      { nome: 'Brodo di pollo prep\'d', lui: '~400ml', lei: '~350ml' },
      { nome: 'Cipolla + carota', lui: '½ + 1', lei: '½ + 1' },
      { nome: 'Rosmarino + alloro + pepe nero', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Olio EVO + parmigiano a fine cottura', lui: '1 cucchiaio + 1 cucchiaio', lei: '1 cucchiaio + 1 cucchiaino' }
    ],
    passaggi: [
      'Rosola i bocconcini di pollo nell\'olio con cipolla e carota tritate, 5 minuti.',
      'Aggiungi le patate a tocchetti, il rosmarino e l\'alloro, copri di brodo caldo.',
      'Cuoci coperto a fuoco dolce 30–35 minuti: il pollo deve sfaldarsi e le patate cedere alla forchetta.',
      'Negli ultimi minuti scoperchia e lascia restringere: il fondo diventa cremoso grazie all\'amido delle patate.',
      'Manteca con parmigiano e un filo di EVO a crudo. Pollo SEMPRE ben cotto al centro.'
    ],
    tips: 'Lo spezzatino in bianco migliora il giorno dopo: cuoci doppia dose e congela in porzioni. La sovracoscia resta più morbida del petto nelle cotture lunghe (ideale per lei).',
    sicurezzaLei: 'Pollo brasato che si sfalda + patate morbide ✅ · senza semi ✅ · niente pomodoro acido ✅',
    sicurezzaLui: 'Pollo ben cotto a lungo ✅ · carbo delle patate sempre con la carne (proteine) ✅',
    macros: { kcalLui: '~530', kcalLei: '~420', proteine: 'alte' }
  },

  // ══════════════════════════════════════════════
  // P2 — PASTO MEDIO 17:00 (8 ricette)
  // ══════════════════════════════════════════════

  {
    id: 'r10',
    nome: 'Pancakes 2 ingredienti banana e uovo',
    emoji: '🍌',
    gradient: ['#facc15', '#f59e0b'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 10,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['veloce', 'dolce', 'senza-semi', '2-ingredienti'],
    descrizione: 'Banana matura schiacciata + uovo = pancake dolce naturale senza zucchero né farina. La merenda dolce più veloce e compliant che esista.',
    ingredienti: [
      { nome: 'Banana matura', lui: '1 grande', lei: '1 media' },
      { nome: 'Uova', lui: '2 intere', lei: '1 + 1 albume' },
      { nome: 'Cannella', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Miele (facoltativo)', lui: '1 cucchiaino', lei: '—' },
      { nome: 'Olio EVO per padella', lui: '½ cucchiaino', lei: '½ cucchiaino' }
    ],
    passaggi: [
      'Schiaccia la banana con la forchetta fino a crema.',
      'Incorpora le uova sbattute e la cannella: pastella fluida.',
      'Cuoci mini-pancakes piccoli (più facili da girare) a fuoco medio-basso, 2–3 minuti per lato: devono essere asciutti dentro.',
      'Servi caldi. Lui può aggiungere 1 cucchiaino di miele.'
    ],
    tips: 'Più la banana è matura (buccia macchiata) più il pancake è dolce senza aggiungere nulla. Le banane troppo mature del mazzo finiscono qui invece che nella spazzatura.',
    sicurezzaLei: 'Banana = frutta consentita ✅ · morbidissimo ✅ · zero zuccheri aggiunti ✅',
    sicurezzaLui: 'Uovo ben cotto nella pastella ✅ · carbo della banana legato alle proteine dell\'uovo ✅',
    macros: { kcalLui: '~310', kcalLei: '~230', proteine: 'medie' }
  },

  {
    id: 'r11',
    nome: 'Frullato denso mango, banana e latte',
    emoji: '🥭',
    gradient: ['#fb923c', '#f59e0b'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 5,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['estiva', 'fredda', 'veloce', 'senza-semi', 'dolce'],
    descrizione: 'Smoothie cremoso con sola frutta consentita e latte: fresco d\'estate, zero masticazione (gengive ringraziano), niente succhi industriali.',
    ingredienti: [
      { nome: 'Mango maturo', lui: '½ frutto', lei: '½ frutto' },
      { nome: 'Banana', lui: '1 media', lei: '½' },
      { nome: 'Latte freddo', lui: '200ml intero', lei: '180ml p. scremato' },
      { nome: 'Parmigiano a scaglie a parte (quota proteica)', lui: '30g', lei: '20g' },
      { nome: 'Ghiaccio', lui: '3 cubetti', lei: '3 cubetti' }
    ],
    passaggi: [
      'Frulla mango, banana, latte e ghiaccio fino a crema densa (1 minuto).',
      'Versa in bicchiere grande: deve reggere il cucchiaino.',
      'Accompagna con le scaglie di parmigiano a parte: la quota proteico-grassa frena il picco glicemico della frutta.'
    ],
    tips: 'Congela il mango maturo a cubetti quando è in offerta: frullato istantaneo senza ghiaccio tutto l\'anno. Per lui: mai il frullato da solo, sempre con la quota di formaggio.',
    sicurezzaLei: 'Mango e banana = frutta consentita ✅ · liquido = zero stress gengivale ✅ · non è un succo zuccherato ✅',
    sicurezzaLui: 'Carbo semplici della frutta SEMPRE con parmigiano (grassi+proteine) ✅',
    macros: { kcalLui: '~390', kcalLei: '~280', proteine: 'medie' }
  },

  {
    id: 'r12',
    nome: 'Bruschettone morbido passata e mozzarella',
    emoji: '🍕',
    gradient: ['#ef4444', '#f97316'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 10,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['veloce', 'comfort', 'forno', 'senza-semi'],
    descrizione: 'Voglia di pizza alle 17? Pane integrale con passata, mozzarella e origano, 5 minuti sotto il grill. Pizza-feeling senza impasto e senza sgarro.',
    ingredienti: [
      { nome: 'Pane integrale (senza semi)', lui: '2 fette spesse', lei: '1 fetta e ½' },
      { nome: 'Passata di pomodoro', lui: '4 cucchiai', lei: '3 cucchiai' },
      { nome: 'Mozzarella ben scolata', lui: '½ pallina (60g)', lei: '½ pallina (60g)' },
      { nome: 'Origano + olio EVO', lui: 'q.b. + 1 cucchiaino', lei: 'q.b. + 1 cucchiaino' }
    ],
    passaggi: [
      'Condisci la passata a crudo con sale, origano e olio EVO.',
      'Spalma sulla superficie del pane, copri con mozzarella a fettine ben scolata.',
      'Grill o fornetto a 220° per 5–6 minuti: mozzarella fusa e bordi appena dorati.',
      'Per lei: tienila 1 minuto in meno, il pane resta morbido sotto la passata calda.'
    ],
    tips: 'Scola la mozzarella su carta assorbente 5 minuti prima: niente acquetta che inzuppa il pane. La passata è già la "salsa pizza" perfetta senza cottura.',
    sicurezzaLei: 'Passata senza semi ✅ · pane ammorbidito dal pomodoro caldo ✅',
    sicurezzaLui: 'Pane (carbo) sempre con mozzarella (proteine+grassi) ✅',
    macros: { kcalLui: '~340', kcalLei: '~270', proteine: 'medie' }
  },

  {
    id: 'r13',
    nome: 'Rotolini di frittata e mozzarella',
    emoji: '🌯',
    gradient: ['#fbbf24', '#f87171'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 12,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['proteico', 'finger-food', 'senza-semi', 'meal-prep'],
    descrizione: 'Frittatina sottile arrotolata con dentro mozzarella e basilico, tagliata a girelle: merenda proteica elegante che si prepara anche il giorno prima.',
    ingredienti: [
      { nome: 'Uova', lui: '2 intere', lei: '2 intere' },
      { nome: 'Mozzarella ben scolata a listarelle', lui: '50g', lei: '40g' },
      { nome: 'Basilico fresco', lui: '4 foglie', lei: '4 foglie' },
      { nome: 'Parmigiano', lui: '1 cucchiaio', lei: '—' },
      { nome: 'Olio EVO', lui: '1 cucchiaino', lei: '1 cucchiaino' }
    ],
    passaggi: [
      'Sbatti le uova (con parmigiano per lui) e versa in padella antiaderente larga: frittatina sottile.',
      'Cuoci bene 3 minuti, gira con l\'aiuto di un piatto e cuoci altri 2: niente parti bavose.',
      'Appoggia su un tagliere, farcisci con mozzarella e basilico sul lato lungo.',
      'Arrotola stretto da tiepida, lascia riposare 5 minuti e taglia a girelle di 3 cm.'
    ],
    tips: 'Fatti la sera prima e tenuti in frigo, i rotolini si compattano e si tagliano ancora meglio: merenda da frigo pronta in 0 minuti.',
    sicurezzaLei: 'Morbido ✅ · senza semi ✅ · si mangia quasi senza masticare',
    sicurezzaLui: 'Frittata cotta su entrambi i lati ✅ · formaggi in lista ✅',
    macros: { kcalLui: '~300', kcalLei: '~250', proteine: 'alte' }
  },

  {
    id: 'r14',
    nome: 'Pera cotta alla cannella con scaglie di parmigiano',
    emoji: '🍐',
    gradient: ['#a3e635', '#65a30d'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 15,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['dolce', 'morbido', 'senza-semi', 'invernale'],
    descrizione: '"Al contadino non far sapere…": pera cotta morbidissima e calda, profumata di cannella, con parmigiano che fa da contrappunto salato e quota proteica.',
    ingredienti: [
      { nome: 'Pere (sbucciate e private del torsolo)', lui: '1 grande', lei: '1 media' },
      { nome: 'Cannella', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Miele', lui: '1 cucchiaino', lei: '½ cucchiaino' },
      { nome: 'Parmigiano a scaglie', lui: '30g', lei: '25g' },
      { nome: 'Pane integrale', lui: '1 fetta', lei: '—' }
    ],
    passaggi: [
      'Sbuccia le pere, tagliale a metà ed elimina COMPLETAMENTE torsolo e semi.',
      'Cuoci in padella con 2 dita d\'acqua, coperte, 10–12 minuti: devono cedere alla forchetta.',
      'Spolvera di cannella e vela di miele a fine cottura.',
      'Servi tiepida con le scaglie di parmigiano accanto: il contrasto dolce-salato è il piatto.'
    ],
    tips: 'Cuoci 3–4 pere insieme: in frigo durano 4 giorni e sono pronte anche fredde. Ottimo modo per recuperare pere troppo dure per lei: cotte diventano perfette.',
    sicurezzaLei: 'Pera sbucciata, semi e torsolo RIMOSSI ✅ · cotta = morbidissima per le gengive ✅',
    sicurezzaLui: 'Frutta (carbo semplice) sempre abbinata a parmigiano ✅',
    macros: { kcalLui: '~280', kcalLei: '~200', proteine: 'medie' }
  },

  {
    id: 'r15',
    nome: 'Crema fredda di avocado e banana al cacao',
    emoji: '🍫',
    gradient: ['#78350f', '#4d7c0f'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 5,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['dolce', 'estiva', 'fredda', 'senza-semi', 'no-cottura'],
    descrizione: '"Mousse al cioccolato" sana: avocado maturo, banana e cacao amaro frullati. Dolcezza naturale, grassi buoni, consistenza da dessert senza esserlo.',
    ingredienti: [
      { nome: 'Avocado maturo', lui: '½ frutto', lei: '½ frutto' },
      { nome: 'Banana matura', lui: '1', lei: '½' },
      { nome: 'Cacao amaro in polvere', lui: '1 cucchiaio', lei: '1 cucchiaio' },
      { nome: 'Latte', lui: '50ml', lei: '50ml p. scremato' },
      { nome: 'Miele (solo se serve)', lui: '½ cucchiaino', lei: '—' }
    ],
    passaggi: [
      'Frulla tutto fino a mousse liscia e lucida: 1–2 minuti, raschiando i bordi.',
      'Assaggia: se la banana è matura non serve miele.',
      'Frigo 30 minuti se vuoi l\'effetto "mousse da cucchiaino" fredda.',
      'Attenzione lui: il cacao contiene poca caffeina/teobromina — ok alle 17:00, non più tardi.'
    ],
    tips: 'È il destino perfetto degli avocado che maturano tutti insieme. Una macinata di sale esalta il cacao (trucco da pasticceria).',
    sicurezzaLei: 'Frutta consentita ✅ · zero masticazione ✅ · non è un dolce industriale ✅',
    sicurezzaLui: 'Grassi dell\'avocado rallentano gli zuccheri della banana ✅ · cacao entro le 18:00 ✅',
    macros: { kcalLui: '~320', kcalLei: '~220', proteine: 'basse (abbinare formaggio se è l\'unico P2)' }
  },

  {
    id: 'r16',
    nome: 'Insalata fredda di farro con provola e peperoni arrostiti',
    emoji: '🫑',
    gradient: ['#f59e0b', '#dc2626'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 10,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['estiva', 'fredda', 'meal-prep', 'senza-semi', 'anti-spreco'],
    descrizione: 'Il farro avanzato del sabato diventa insalata fredda con peperoni arrostiti sbucciati (l\'alternativa al pomodoro di lei) e provola a cubetti.',
    ingredienti: [
      { nome: 'Farro cotto freddo', lui: '1 porzione (~180g)', lei: '¾ porzione (~140g)' },
      { nome: 'Peperoni arrostiti, sbucciati e puliti dai semi', lui: '½ ciotola', lei: '½ ciotola' },
      { nome: 'Provola a cubetti', lui: '50g', lei: '40g' },
      { nome: 'Basilico + olio EVO', lui: 'q.b. + 1 cucchiaio', lei: 'q.b. + 1 cucchiaio' },
      { nome: 'Olive (solo lui)', lui: '1 cucchiaio', lei: '—' }
    ],
    passaggi: [
      'Pulisci i peperoni arrostiti da OGNI semino e filamento, poi tagliali a striscioline.',
      'Unisci farro freddo, peperoni, provola a cubetti piccoli e basilico spezzato.',
      'Condisci con olio EVO e sale, mescola e lascia insaporire 10 minuti.',
      'Per lei: verifica che il farro sia ben cotto e morbido (se è al dente, scaldalo 1 minuto con un goccio d\'acqua).'
    ],
    tips: 'I peperoni arrostiti si fanno in batch la domenica (forno 220°, 25 min, poi chiusi in un sacchetto: la pelle viene via da sola). In frigo sott\'olio durano 5 giorni.',
    sicurezzaLei: 'Peperoni sbucciati e privati dei semi ✅ · farro ben cotto morbido ✅ · niente pomodoro fresco ✅',
    sicurezzaLui: 'Cereale con formaggio (proteine) ✅',
    macros: { kcalLui: '~380', kcalLei: '~300', proteine: 'medie' }
  },

  {
    id: 'r17',
    nome: 'Toast melone e crudo con scaglie',
    emoji: '🍈',
    gradient: ['#fb923c', '#fda4af'],
    momento: ['P2'],
    persona: 'lui',
    tempoMin: 5,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['estiva', 'veloce', 'jolly-settimanale', 'no-cottura'],
    descrizione: 'Prosciutto e melone in versione merenda: il jolly insaccato della settimana di lui (max 1 volta!), con pane e parmigiano per completare. Lei lo replica con la variante sotto.',
    ingredienti: [
      { nome: 'Melone a fette', lui: '1 fetta grande (~200g)', lei: '(variante: stessa fetta)' },
      { nome: 'Prosciutto crudo sgrassato', lui: '60g (jolly 1×/settimana)', lei: '— (variante: provola 40g)' },
      { nome: 'Pane integrale', lui: '1 fetta', lei: '1 fetta morbida' },
      { nome: 'Parmigiano a scaglie', lui: '20g', lei: '—' }
    ],
    passaggi: [
      'Taglia il melone a fette e priva COMPLETAMENTE dei semi centrali.',
      'Componi il piatto: melone, crudo appoggiato sopra, pane e scaglie di parmigiano.',
      'Variante LEI (senza insaccati non necessari ma soprattutto più morbida): melone + provola a fettine + pane morbido.',
      'Servi freddo di frigo: d\'estate è una merenda da bar, ma compliant.'
    ],
    tips: 'Segna sul piano quando lui usa il "jolly insaccato": uno a settimana, non di più. Il crudo sgrassato è la scelta migliore tra gli insaccati (solo carne e sale).',
    sicurezzaLei: 'Variante lei: melone (consentito, senza semi centrali) + provola, tutto morbido ✅',
    sicurezzaLui: 'Insaccato = max 1 volta/settimana, questo È il jolly ⚠️ · melone (carbo) con crudo e parmigiano (proteine) ✅',
    macros: { kcalLui: '~350', kcalLei: '~280 (variante)', proteine: 'medie-alte' }
  },

  {
    id: 'r34',
    nome: 'Mug-cake proteica banana e parmigiano (microonde)',
    emoji: '☕',
    gradient: ['#facc15', '#ca8a04'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 5,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['veloce', 'dolce', 'senza-semi', 'morbido', '2-ingredienti'],
    descrizione: 'Tortino in tazza pronto in 2 minuti al microonde: banana schiacciata, uovo e un velo di parmigiano per la quota proteica. Sofficissimo, dolce naturale, zero forno.',
    ingredienti: [
      { nome: 'Banana matura schiacciata', lui: '1 media', lei: '1 piccola' },
      { nome: 'Uovo', lui: '1 intero', lei: '1 intero' },
      { nome: 'Fiocchi d\'avena o farina', lui: '2 cucchiai', lei: '2 cucchiai' },
      { nome: 'Parmigiano grattugiato (quota proteica)', lui: '1 cucchiaio', lei: '1 cucchiaino' },
      { nome: 'Cannella + lievito istantaneo', lui: '1 pizzico ciascuno', lei: '1 pizzico ciascuno' }
    ],
    passaggi: [
      'Schiaccia la banana in una tazza grande adatta al microonde.',
      'Unisci uovo, avena (o farina), parmigiano, cannella e un pizzico di lievito: mescola bene.',
      'Microonde a piena potenza 1,5–2 minuti: gonfia e si rapprende (uovo ben cotto, non bavoso).',
      'Lascia intiepidire 1 minuto prima di mangiare: si compatta e si stacca dalla tazza.'
    ],
    tips: 'La merenda dolce più rapida del piano quando manca tempo. Più la banana è matura, più è dolce senza zuccheri aggiunti. Controlla che sia ben cotta al centro per il vincolo uovo di lui.',
    sicurezzaLei: 'Sofficissima, zero masticazione difficile ✅ · senza semi ✅ · zero zuccheri aggiunti ✅',
    sicurezzaLui: 'Uovo ben cotto nel microonde ✅ · carbo della banana legato a uovo e parmigiano ✅',
    macros: { kcalLui: '~280', kcalLei: '~220', proteine: 'medie' }
  },

  {
    id: 'r35',
    nome: 'Nicecream alla banana e mango',
    emoji: '🍦',
    gradient: ['#fde047', '#fb923c'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 5,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['dolce', 'estiva', 'fredda', 'senza-semi', 'no-cottura'],
    descrizione: 'Il "gelato" che è solo frutta: banana e mango congelati frullati fino a crema mantecata. Freschissimo d\'estate, zero masticazione (gengive felici), niente zuccheri industriali.',
    ingredienti: [
      { nome: 'Banana matura congelata a rondelle', lui: '1 grande', lei: '1 media' },
      { nome: 'Mango congelato a cubetti', lui: '½ frutto', lei: '½ frutto' },
      { nome: 'Latte (quanto basta per frullare)', lui: '2 cucchiai', lei: '2 cucchiai p. scremato' },
      { nome: 'Parmigiano a scaglie a parte (quota proteica)', lui: '30g', lei: '20g' },
      { nome: 'Cannella (facoltativa)', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Frulla la frutta congelata con pochissimo latte in un frullatore potente: parti a impulsi.',
      'Raschia i bordi e continua finché diventa una crema liscia tipo soft-serve.',
      'Servi subito nella coppetta: ha la consistenza del gelato mantecato.',
      'Accompagna con le scaglie di parmigiano a parte: la quota proteico-grassa frena il picco glicemico.'
    ],
    tips: 'Tieni sempre banane mature a rondelle e mango a cubetti in freezer: gelato sano pronto in 3 minuti tutto l\'anno. Niente gelatiera, niente zucchero.',
    sicurezzaLei: 'Frutta consentita, cremosa, zero masticazione ✅ · senza semi ✅ · non è un gelato industriale ✅',
    sicurezzaLui: 'Carbo semplici della frutta SEMPRE con parmigiano (grassi+proteine) ✅',
    macros: { kcalLui: '~330', kcalLei: '~240', proteine: 'medie' }
  },

  {
    id: 'r36',
    nome: 'Sformatini di patate e scamorza',
    emoji: '🧈',
    gradient: ['#fbbf24', '#f59e0b'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 30,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['forno', 'comfort', 'meal-prep', 'senza-semi', 'morbido', 'porzionabile'],
    descrizione: 'Purè di patate arricchito con uovo e scamorza, cotto in stampini fino a gratinarsi: cuore filante, superficie dorata. Merenda salata già porzionata, morbida e proteica.',
    ingredienti: [
      { nome: 'Patate lessate e schiacciate', lui: '250g', lei: '200g' },
      { nome: 'Uovo (legante)', lui: '1 intero', lei: '1 intero' },
      { nome: 'Scamorza a cubetti', lui: '50g', lei: '40g' },
      { nome: 'Parmigiano grattugiato', lui: '2 cucchiai', lei: '1 cucchiaio' },
      { nome: 'Latte + noce moscata', lui: '2 cucchiai + q.b.', lei: '2 cucchiai + q.b.' },
      { nome: 'Olio EVO per gli stampi', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Schiaccia le patate calde con uovo, latte, parmigiano, noce moscata, sale e pepe: purè denso.',
      'Incorpora i cubetti di scamorza che fonderanno nel cuore.',
      'Riempi gli stampini oliati (o pirottini) livellando la superficie.',
      'Inforna a 190° per 18–20 minuti: superficie dorata e cuore filante.',
      'Sforma da tiepidi. In frigo durano 3 giorni e si rigenerano al forno o in padella.'
    ],
    tips: 'Si fanno con il purè avanzato della cena. Già porzionati, sono perfetti per il P2 dal frigo o da portare fuori casa. Etichetta col sistema colori (blu lui, rosso lei).',
    sicurezzaLei: 'Morbidissimi, cuore cremoso ✅ · senza semi ✅',
    sicurezzaLui: 'Uovo cotto al forno + formaggi = proteine ✅ · carbo delle patate mai da solo ✅',
    macros: { kcalLui: '~360', kcalLei: '~290', proteine: 'medie' }
  },

  {
    id: 'r37',
    nome: 'Crema fredda di pesca e banana con scaglie',
    emoji: '🍑',
    gradient: ['#fda4af', '#fbbf24'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 5,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['dolce', 'estiva', 'fredda', 'senza-semi', 'no-cottura'],
    descrizione: 'Vellutata fredda di frutta: pesca sbucciata e banana frullate fino a crema densa da cucchiaino. Dolce, fresca, liscissima — niente da masticare per lei — con parmigiano per la quota proteica.',
    ingredienti: [
      { nome: 'Pesca matura sbucciata', lui: '1 grande', lei: '1 media' },
      { nome: 'Banana', lui: '1 media', lei: '½' },
      { nome: 'Latte freddo', lui: '60ml intero', lei: '50ml p. scremato' },
      { nome: 'Parmigiano a scaglie a parte (quota proteica)', lui: '30g', lei: '20g' },
      { nome: 'Ghiaccio + cannella', lui: '2 cubetti', lei: '2 cubetti' }
    ],
    passaggi: [
      'Sbuccia bene la pesca ed elimina completamente il nocciolo.',
      'Frulla pesca, banana, latte e ghiaccio fino a crema densa e liscia (1 minuto).',
      'Versa in coppetta: deve reggere il cucchiaino.',
      'Accompagna con le scaglie di parmigiano a parte e una spolverata di cannella.'
    ],
    tips: 'Recupero perfetto delle pesche troppo mature: frullate diventano una crema da dessert. Per lui mai la frutta da sola, sempre con la quota di formaggio.',
    sicurezzaLei: 'Pesca sbucciata e snocciolata ✅ · liscia, zero masticazione ✅ · senza semi ✅',
    sicurezzaLui: 'Carbo semplici della frutta SEMPRE con parmigiano (grassi+proteine) ✅',
    macros: { kcalLui: '~310', kcalLei: '~220', proteine: 'medie' }
  },

  {
    id: 'r38',
    nome: 'Crostini morbidi con crema di cannellini e provola',
    emoji: '🫘',
    gradient: ['#e7e5e4', '#84cc16'],
    momento: ['P2'],
    persona: 'entrambi',
    tempoMin: 12,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['legumi', 'proteico', 'senza-semi', 'morbido', 'anti-infiammatorio'],
    descrizione: 'Hummus all\'italiana: cannellini frullati con olio EVO e rosmarino, spalmati su pane morbido e completati da provola fusa. Merenda proteica vegetale, cremosa, a basso carico glicemico.',
    ingredienti: [
      { nome: 'Cannellini lessati (anche in barattolo)', lui: '120g', lei: '100g' },
      { nome: 'Pane integrale (senza semi)', lui: '2 fette', lei: '1 fetta e ½ morbida' },
      { nome: 'Provola a fettine', lui: '40g', lei: '30g' },
      { nome: 'Olio EVO + limone + rosmarino', lui: '1 cucchiaio + q.b.', lei: '1 cucchiaio + q.b.' },
      { nome: 'Pepe nero + un goccio d\'acqua per frullare', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Frulla i cannellini con olio EVO, qualche goccia di limone, rosmarino e un goccio d\'acqua fino a crema liscia.',
      'Spalma la crema generosamente sul pane.',
      'Appoggia le fettine di provola sopra e passa 3–4 minuti sotto il grill finché fonde.',
      'Per lei: pane morbido non tostato, crema abbondante per ammorbidirlo. Finisci con pepe nero.'
    ],
    tips: 'La crema di cannellini si conserva 3 giorni in frigo (coperta da un filo d\'olio): pronta per crostini lampo. I legumi danno proteine vegetali a basso indice glicemico.',
    sicurezzaLei: 'Crema liscia + pane morbido ✅ · senza semi ✅ · legumi ben cotti frullati ✅',
    sicurezzaLui: 'Legumi (proteine vegetali) + provola sul pane (carbo mai da solo) ✅',
    macros: { kcalLui: '~360', kcalLei: '~280', proteine: 'medie-alte' }
  },

  // ══════════════════════════════════════════════
  // P3 — CENA 20:30 (8 ricette)
  // ══════════════════════════════════════════════

  {
    id: 'r18',
    nome: 'Polpette di pollo al forno in salsa morbida',
    emoji: '🍡',
    gradient: ['#dc2626', '#9a3412'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 35,
    difficolta: 'media',
    mealPrep: true,
    tags: ['comfort', 'forno', 'meal-prep', 'senza-semi', 'morbido'],
    descrizione: 'Polpette di petto di pollo macinato, ammorbidite con pane al latte, cotte al forno e finite nella passata: morbidissime per lei, proteiche e sazianti per lui.',
    ingredienti: [
      { nome: 'Petto di pollo macinato', lui: '150g', lei: '120g' },
      { nome: 'Pane integrale ammollato nel latte', lui: '1 fetta', lei: '1 fetta' },
      { nome: 'Uovo (legante)', lui: '½ uovo sbattuto', lei: '½ uovo sbattuto' },
      { nome: 'Parmigiano', lui: '1 cucchiaio', lei: '1 cucchiaio' },
      { nome: 'Passata di pomodoro', lui: '150ml', lei: '150ml' },
      { nome: 'Olio EVO + aglio + basilico', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Impasta pollo macinato, pane strizzato dal latte, uovo, parmigiano, sale e pepe.',
      'Forma polpette piccole (più piccole = più morbide e cotte uniformi).',
      'Inforna a 200° per 15 minuti su carta forno: si rosolano senza friggere.',
      'Scalda la passata in padella con aglio e olio, tuffaci le polpette e sobbolli 10 minuti coperte.',
      'Servi con pane per la scarpetta (lui tostato, lei morbido) e verdure prep\'d.'
    ],
    tips: 'Tripla dose la domenica: le polpette già cotte in sugo si congelano perfettamente in porzioni e si rigenerano in 5 minuti. La cena di emergenza definitiva.',
    sicurezzaLei: 'Morbidissime (pane al latte) ✅ · passata senza semi ✅',
    sicurezzaLui: 'Pollo e uovo ben cotti al forno + sugo ✅ · niente insaccati, è macinato fresco ✅',
    macros: { kcalLui: '~480', kcalLei: '~390', proteine: 'alte' }
  },

  {
    id: 'r19',
    nome: 'Vellutata di zucca e carote con curcuma e parmigiano',
    emoji: '🎃',
    gradient: ['#f97316', '#eab308'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 30,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['vellutata', 'morbido', 'curcuma', 'senza-semi', 'invernale', 'leggera', 'anti-infiammatorio'],
    descrizione: 'Cena-coccola serale: vellutata liscia di zucca e carote con curcuma+pepe nero, crostini morbidi e parmigiano. Digestiva per lei, con uovo sodo per la quota proteica di lui.',
    ingredienti: [
      { nome: 'Zucca a dadini (anche surgelata)', lui: '300g', lei: '250g' },
      { nome: 'Carote', lui: '2', lei: '2' },
      { nome: 'Cipolla + brodo', lui: '½ + 400ml', lei: '½ + 350ml' },
      { nome: 'Curcuma + pepe nero', lui: '1 cucchiaino + macinata', lei: '1 cucchiaino + macinata' },
      { nome: 'Parmigiano + olio EVO a crudo', lui: '2 cucchiai + 1 cucchiaio', lei: '1 cucchiaio + 1 cucchiaio' },
      { nome: 'Uova sode', lui: '2', lei: '1' },
      { nome: 'Pane integrale', lui: '1 fetta e ½', lei: '1 fetta morbida a pezzetti' }
    ],
    passaggi: [
      'Soffriggi la cipolla, aggiungi zucca e carote a pezzi e copri di brodo.',
      'Cuoci 20 minuti finché tutto si schiaccia con la forchetta.',
      'Frulla a immersione fino a crema PERFETTAMENTE liscia (importante per lei).',
      'Manteca con curcuma, pepe nero macinato fresco, parmigiano e olio EVO a crudo.',
      'Servi con uova sode a spicchi dentro la vellutata e pane (lei: spezzato dentro, si ammorbidisce).'
    ],
    tips: 'La zucca surgelata a dadini costa poco e azzera la pulizia. La vellutata si congela in porzioni: scorta perfetta per le sere no.',
    sicurezzaLei: 'Frullata liscia = zero masticazione ✅ · zucca pulita da semi e filamenti ✅ · curcuma quotidiana ✅',
    sicurezzaLui: 'Uova sode = ben cotte ✅ · carbo della zucca con proteine di uova e parmigiano ✅',
    macros: { kcalLui: '~450', kcalLei: '~340', proteine: 'medie' }
  },

  {
    id: 'r20',
    nome: 'Merluzzo in umido alla mediterranea',
    emoji: '🐟',
    gradient: ['#0ea5e9', '#1d4ed8'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 25,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['pesce', 'padella', 'senza-semi', 'leggera', 'omega3', 'anti-infiammatorio'],
    descrizione: 'Filetto di merluzzo che cuoce direttamente nella passata con aglio e basilico: si disfa morbido, zero spine, zero semi. La cena di pesce più sicura per entrambi.',
    ingredienti: [
      { nome: 'Filetto di merluzzo (anche surgelato)', lui: '~200g', lei: '~160g' },
      { nome: 'Passata di pomodoro', lui: '200ml', lei: '180ml' },
      { nome: 'Aglio + basilico + origano', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Olive (solo lui)', lui: '1 cucchiaio', lei: '—' },
      { nome: 'Patate al vapore (prep\'d)', lui: '1 e ½', lei: '1' },
      { nome: 'Olio EVO', lui: '1 cucchiaio', lei: '1 cucchiaio' }
    ],
    passaggi: [
      'Scalda olio e aglio, versa la passata e sobbolli 5 minuti con origano.',
      'Adagia i filetti di merluzzo nel sugo, copri e cuoci 12–15 minuti a fuoco dolce.',
      'A metà cottura aggiungi le olive (solo dal lato di lui, se cucinate in padella unica usa due metà).',
      'Servi con patate al vapore schiacciate grossolanamente nel sughetto.'
    ],
    tips: 'Il merluzzo surgelato si cuoce anche SENZA scongelare: +5 minuti coperto e via. Cena improvvisabile sempre, tenendone 2 filetti fissi in freezer.',
    sicurezzaLei: 'Pesce morbido senza spine ✅ · passata ✅ · niente olive (nocciolo duro)',
    sicurezzaLui: 'Pesce consentito (no tonno/salmone) ✅ · ben cotto ✅',
    macros: { kcalLui: '~430', kcalLei: '~340', proteine: 'alte' }
  },

  {
    id: 'r21',
    nome: 'Risotto zucchine e provola al brodo di carcassa',
    emoji: '🍚',
    gradient: ['#22c55e', '#15803d'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 30,
    difficolta: 'media',
    mealPrep: false,
    tags: ['comfort', 'anti-spreco', 'una-pentola', 'senza-semi', 'morbido'],
    descrizione: 'Variante del risotto domenicale: zucchine che si sciolgono nella mantecatura e provola filante, sul brodo fatto con la carcassa del pollo. Cremoso, caldo, zero sprechi.',
    ingredienti: [
      { nome: 'Riso Carnaroli', lui: '1 pugno (~90g)', lei: '¾ pugno (~65g)' },
      { nome: 'Zucchine a dadini piccoli', lui: '1', lei: '1' },
      { nome: 'Brodo di pollo prep\'d', lui: '~500ml', lei: '~400ml' },
      { nome: 'Provola a dadini', lui: '40g', lei: '30g' },
      { nome: 'Parmigiano', lui: '1 cucchiaio', lei: '1 cucchiaino' },
      { nome: 'Pollo avanzato sfilacciato (quota proteica)', lui: '~100g', lei: '~80g' },
      { nome: 'Cipolla + olio EVO', lui: '¼ + 1 cucchiaio', lei: '¼ + 1 cucchiaio' }
    ],
    passaggi: [
      'Soffriggi cipolla in olio, tosta il riso 1 minuto, poi brodo caldo a mestoli.',
      'Dopo 8 minuti unisci le zucchine a dadini: si cuociono insieme al riso e si sfaldano.',
      'A 2 minuti dalla fine incorpora il pollo sfilacciato per scaldarlo.',
      'Spegni e manteca con provola e parmigiano: filante e all\'onda.',
      'Riposo 2 minuti coperto prima di servire: la consistenza diventa perfetta.'
    ],
    tips: 'Risotto = il modo migliore per finire il pollo della settimana e il brodo prep\'d. Per lui niente bis di riso senza proteine: il pollo dentro c\'è apposta.',
    sicurezzaLei: 'Cremoso e morbido ✅ · senza semi ✅',
    sicurezzaLui: 'Riso MAI da solo: pollo+formaggi dentro al piatto ✅ · cena energetica per chi lavora di notte ✅',
    macros: { kcalLui: '~560', kcalLei: '~430', proteine: 'medie-alte' }
  },

  {
    id: 'r22',
    nome: 'Pasta e lenticchie rosse cremosa',
    emoji: '🍝',
    gradient: ['#ea580c', '#b91c1c'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 25,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['una-pentola', 'legumi', 'curcuma', 'senza-semi', 'comfort', 'economica', 'anti-infiammatorio'],
    descrizione: 'Le lenticchie rosse del giovedì incontrano la pasta: si disfano in crema e avvolgono i ditalini. Piatto unico proteico-vegetale da una pentola sola, costa pochissimo.',
    ingredienti: [
      { nome: 'Pasta corta integrale (ditalini)', lui: '70g', lei: '55g' },
      { nome: 'Lenticchie rosse decorticate', lui: '50g', lei: '40g' },
      { nome: 'Passata di pomodoro', lui: '3 cucchiai', lei: '3 cucchiai' },
      { nome: 'Cipolla + carota a dadini', lui: '¼ + ½', lei: '¼ + ½' },
      { nome: 'Curcuma + pepe nero + rosmarino', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Olio EVO + parmigiano', lui: '1 cucchiaio + 1 cucchiaio', lei: '1 cucchiaio + 1 cucchiaino' }
    ],
    passaggi: [
      'Soffriggi cipolla e carota in olio EVO, aggiungi le lenticchie rosse e la passata.',
      'Copri con acqua calda (3 volte il volume) e cuoci 10 minuti: le lenticchie iniziano a disfarsi.',
      'Butta la pasta DIRETTAMENTE nella pentola con altra acqua calda se serve, risottandola.',
      'Cuoci finché la pasta è morbida e il fondo è cremoso (per lei: 1–2 minuti oltre il dente).',
      'Manteca con curcuma, pepe nero, parmigiano e un filo di EVO a crudo.'
    ],
    tips: 'Le lenticchie rosse decorticate non hanno bisogno di ammollo e fanno da "crema" naturale. Doppia dose di base lenticchie = vellutata pronta per il giorno dopo.',
    sicurezzaLei: 'Pasta ben cotta morbida ✅ · lenticchie decorticate in crema ✅ · curcuma quotidiana ✅',
    sicurezzaLui: 'Carbo della pasta + proteine dei legumi nello stesso piatto ✅',
    macros: { kcalLui: '~520', kcalLei: '~400', proteine: 'medie-alte' }
  },

  {
    id: 'r23',
    nome: 'Orata al cartoccio con patate e limone',
    emoji: '🦈',
    gradient: ['#38bdf8', '#0e7490'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 30,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['pesce', 'forno', 'leggera', 'senza-semi', 'zero-pulizie', 'anti-infiammatorio'],
    descrizione: 'Il pesce del martedì in versione cartoccio: tutto chiuso nella carta forno, si cuoce nel suo vapore, resta umido e morbido. E la teglia resta pulita.',
    ingredienti: [
      { nome: 'Filetto di orata', lui: '~200g', lei: '~160g' },
      { nome: 'Patate a fette sottili (precotte 5 min)', lui: '1 e ½', lei: '1' },
      { nome: 'Zucchine a rondelle', lui: '½', lei: '½' },
      { nome: 'Limone + rosmarino + aglio', lui: 'q.b.', lei: 'q.b. (senza scorze dure)' },
      { nome: 'Olio EVO', lui: '1 cucchiaio', lei: '1 cucchiaio' }
    ],
    passaggi: [
      'Sbollenta le fette di patata 5 minuti (così nel cartoccio finiscono di cuocere).',
      'Su un foglio grande di carta forno: letto di patate e zucchine, filetto sopra, olio, fette di limone, rosmarino.',
      'Chiudi il cartoccio a caramella sigillando bene i bordi.',
      'Forno 200° per 18–20 minuti: il pesce cuoce a vapore nel suo sughetto.',
      'Apri il cartoccio nel piatto: il profumo è metà del piacere.'
    ],
    tips: 'Fai un cartoccio a testa con le porzioni già differenziate: zero discussioni, zero bilance a tavola. Funziona identico con merluzzo e nasello.',
    sicurezzaLei: 'Pesce al vapore = morbidissimo ✅ · attenzione solo a eventuali lische: il filetto è la scelta giusta',
    sicurezzaLui: 'Orata consentita ✅ · ben cotta al forno ✅',
    macros: { kcalLui: '~440', kcalLei: '~350', proteine: 'alte' }
  },

  {
    id: 'r24',
    nome: 'Pizza in padella veloce (senza forno)',
    emoji: '🍕',
    gradient: ['#ef4444', '#f59e0b'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 25,
    difficolta: 'media',
    mealPrep: true,
    tags: ['comfort', 'padella', 'senza-semi', 'pizza'],
    descrizione: 'Voglia di pizza ma non è sabato? Impasto rapido senza lievitazione lunga, cotto in padella con coperchio: base morbida, mozzarella filante, pronta in mezz\'ora.',
    ingredienti: [
      { nome: 'Farina integrale + farina 0', lui: '60g + 40g', lei: '50g + 30g' },
      { nome: 'Lievito istantaneo per torte salate', lui: '½ cucchiaino', lei: '½ cucchiaino' },
      { nome: 'Acqua tiepida + olio EVO', lui: '~60ml + 1 cucchiaino', lei: '~50ml + 1 cucchiaino' },
      { nome: 'Passata di pomodoro', lui: '4 cucchiai', lei: '3 cucchiai' },
      { nome: 'Mozzarella ben scolata', lui: '¾ pallina (90g)', lei: '½ pallina (60g)' },
      { nome: 'Origano + olive (solo lui)', lui: 'q.b. + 1 cucchiaio', lei: 'origano q.b.' }
    ],
    passaggi: [
      'Impasta farine, lievito istantaneo, acqua, olio e sale: palla liscia in 5 minuti, riposo 10.',
      'Stendi sottile direttamente nella padella antiaderente fredda e leggermente oliata.',
      'Fuoco medio con coperchio 7–8 minuti: la base si cuoce e gonfia.',
      'Condisci con passata e mozzarella, coperchio altri 5–6 minuti finché fila.',
      'Per lei: spegni appena la mozzarella fonde, il bordo resta morbido (vincolo parodontite).'
    ],
    tips: 'La mozzarella scolata mezz\'ora prima su carta assorbente non rilascia acqua. La quota proteica del pasto è proprio mozzarella: per lui aggiungere parmigiano se serve.',
    sicurezzaLei: 'Bordo morbido non croccante ✅ · passata senza semi ✅ · niente olive',
    sicurezzaLui: 'Carbo dell\'impasto con formaggio (proteine) ✅ · niente caffeina, niente problemi serali ✅',
    macros: { kcalLui: '~580', kcalLei: '~440', proteine: 'medie' }
  },

  {
    id: 'r25',
    nome: 'Hamburger di pollo in pane integrale morbido',
    emoji: '🍔',
    gradient: ['#f59e0b', '#78350f'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 20,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['comfort', 'proteico', 'padella', 'senza-semi'],
    descrizione: '"Fast food" di casa: burger di petto di pollo macinato ben cotto, scamorza fusa sopra, crema di avocado al posto delle salse. Soddisfa la voglia di panino senza uscire dal piano.',
    ingredienti: [
      { nome: 'Petto di pollo macinato', lui: '150g', lei: '120g' },
      { nome: 'Pane integrale morbido SENZA semi (no sesamo!)', lui: '2 fette o 1 panino', lei: '1 panino piccolo morbido' },
      { nome: 'Scamorza', lui: '1 fetta (25g)', lei: '1 fetta (25g)' },
      { nome: 'Avocado schiacciato con limone', lui: '¼ frutto', lei: '¼ frutto' },
      { nome: 'Zucchine grigliate', lui: '½ zucchina', lei: '½ zucchina (ben morbide)' },
      { nome: 'Olio EVO', lui: '1 cucchiaino', lei: '1 cucchiaino' }
    ],
    passaggi: [
      'Impasta il macinato di pollo con sale, pepe e un filo d\'olio; forma burger non troppo spessi.',
      'Cuoci in padella 5–6 minuti per lato: il pollo va SEMPRE ben cotto al centro (taglia e verifica: niente rosa).',
      'Nell\'ultimo minuto appoggia la scamorza sul burger e copri: fonde.',
      'Spalma l\'avocado al limone sul pane, componi con burger e zucchine grigliate.',
      'Per lei: pane non tostato, burger più sottile = morso più morbido.'
    ],
    tips: 'Forma 4–6 burger crudi e congelali separati da carta forno: cena pronta in 12 minuti dal freezer. Controlla l\'etichetta del pane: zero semi in superficie.',
    sicurezzaLei: 'Tutto morbido (pane, burger, avocado) ✅ · pane verificato senza semi ✅',
    sicurezzaLui: 'Pollo ben cotto verificato ✅ · niente salse industriali zuccherate ✅',
    macros: { kcalLui: '~540', kcalLei: '~420', proteine: 'alte' }
  },

  {
    id: 'r39',
    nome: 'Polpettone di pollo morbido al forno',
    emoji: '🍖',
    gradient: ['#dc2626', '#7c2d12'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 45,
    difficolta: 'media',
    mealPrep: true,
    tags: ['forno', 'comfort', 'meal-prep', 'senza-semi', 'morbido', 'proteico'],
    descrizione: 'Polpettone di petto di pollo macinato ammorbidito con pane al latte e ricotta, cotto al forno con cuore filante di provola. Si affetta tenero, ottimo caldo e ancora meglio il giorno dopo.',
    ingredienti: [
      { nome: 'Petto di pollo macinato', lui: '180g', lei: '150g' },
      { nome: 'Pane integrale ammollato nel latte', lui: '1 fetta e ½', lei: '1 fetta' },
      { nome: 'Ricotta (per morbidezza)', lui: '2 cucchiai', lei: '2 cucchiai' },
      { nome: 'Uovo + parmigiano (legante)', lui: '1 uovo + 2 cucchiai', lei: '1 uovo + 1 cucchiaio' },
      { nome: 'Provola a bastoncino per il cuore', lui: '40g', lei: '30g' },
      { nome: 'Patate a spicchi come contorno', lui: '2 medie', lei: '1 e ½' }
    ],
    passaggi: [
      'Impasta pollo macinato, pane strizzato dal latte, ricotta, uovo, parmigiano, sale e pepe.',
      'Stendi l\'impasto su carta forno, metti la provola al centro e arrotola sigillando bene (cuore filante).',
      'Adagia in teglia con le patate a spicchi condite con olio e rosmarino.',
      'Inforna a 190° per 30–35 minuti: il pollo va SEMPRE ben cotto al centro (verifica con termometro o taglio: niente rosa).',
      'Lascia riposare 10 minuti prima di affettare: resta compatto e non si sbriciola.'
    ],
    tips: 'Il polpettone freddo affettato è perfetto anche per un P1 del giorno dopo. Ricotta e pane al latte sono il segreto della morbidezza: niente carne stopposa per lei.',
    sicurezzaLei: 'Morbidissimo (ricotta + pane al latte) ✅ · senza semi ✅ · niente pomodoro acido ✅',
    sicurezzaLui: 'Pollo e uovo ben cotti al forno ✅ · macinato fresco, niente insaccati ✅',
    macros: { kcalLui: '~520', kcalLei: '~410', proteine: 'alte' }
  },

  {
    id: 'r40',
    nome: 'Platessa dorata in padella con purè',
    emoji: '🐠',
    gradient: ['#7dd3fc', '#0284c7'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 25,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['pesce', 'padella', 'senza-semi', 'leggera', 'morbido', 'anti-infiammatorio'],
    descrizione: 'Filetto di platessa passato in un velo di farina e dorato in padella, servito su purè morbido al parmigiano. Pesce bianco delicato senza spine, cena leggera e tenerissima.',
    ingredienti: [
      { nome: 'Filetto di platessa (anche surgelato)', lui: '~200g', lei: '~160g' },
      { nome: 'Farina per infarinare', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Patate per il purè', lui: '2 medie', lei: '1 e ½' },
      { nome: 'Latte + parmigiano per il purè', lui: '~80ml + 2 cucchiai', lei: '~70ml + 1 cucchiaio' },
      { nome: 'Limone + prezzemolo', lui: '½ limone + q.b.', lei: '½ limone + q.b.' },
      { nome: 'Olio EVO', lui: '1 cucchiaio', lei: '1 cucchiaio' }
    ],
    passaggi: [
      'Prepara il purè: schiaccia le patate lessate con latte caldo, parmigiano e un filo d\'olio fino a crema liscia.',
      'Infarina leggermente i filetti di platessa, scuotendo la farina in eccesso.',
      'Dorali in padella con poco olio EVO, 2–3 minuti per lato: il pesce è cotto quando si sfalda al tocco.',
      'Sfuma con un goccio di limone e prezzemolo a fine cottura.',
      'Servi i filetti adagiati sul letto di purè morbido.'
    ],
    tips: 'La platessa è uno dei pesci più digeribili e senza spine: ideale per lei. Surgelata si cuoce direttamente, basta tamponarla bene prima di infarinarla.',
    sicurezzaLei: 'Pesce morbido senza spine + purè cremoso ✅ · senza semi ✅',
    sicurezzaLui: 'Pesce bianco consentito (no tonno/salmone) ✅ · ben cotto ✅',
    macros: { kcalLui: '~450', kcalLei: '~360', proteine: 'alte' }
  },

  {
    id: 'r41',
    nome: 'Coniglio in bianco con olive e patate',
    emoji: '🍗',
    gradient: ['#d6d3d1', '#78716c'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 50,
    difficolta: 'media',
    mealPrep: true,
    tags: ['comfort', 'meal-prep', 'senza-semi', 'morbido', 'invernale'],
    descrizione: 'Coniglio brasato a lungo in bianco con vino sfumato, rosmarino e patate: carne magra che si stacca dall\'osso. Olive solo nel piatto di lui (nocciolo duro), tutto morbido per lei.',
    ingredienti: [
      { nome: 'Coniglio a pezzi (preferire le parti polpose)', lui: '2 pezzi', lei: '2 pezzi (disossati)' },
      { nome: 'Patate a tocchetti', lui: '2 medie', lei: '1 e ½' },
      { nome: 'Brodo + vino bianco (sfumato a inizio)', lui: '~350ml + ½ bicchiere', lei: '~300ml + ½ bicchiere' },
      { nome: 'Olive denocciolate (solo lui)', lui: '1 cucchiaio', lei: '—' },
      { nome: 'Rosmarino + salvia + aglio', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Olio EVO', lui: '1 cucchiaio', lei: '1 cucchiaio' }
    ],
    passaggi: [
      'Rosola i pezzi di coniglio nell\'olio con aglio ed erbe finché dorati su tutti i lati.',
      'Sfuma con il vino bianco e lascialo evaporare completamente (l\'alcol va via).',
      'Aggiungi le patate e il brodo caldo, copri e brasa a fuoco dolce 35–40 minuti: la carne deve staccarsi dall\'osso.',
      'Aggiungi le olive SOLO nella porzione di lui negli ultimi 10 minuti.',
      'Per lei: scegli e disossa i pezzi più polposi, verifica che non restino schegge d\'osso.'
    ],
    tips: 'Il coniglio è una carne magra e digeribile, perfetta di sera. Brasato a lungo diventa tenerissimo. Doppia dose: il giorno dopo è ancora più saporito.',
    sicurezzaLei: 'Carne morbida disossata + patate ✅ · niente olive (nocciolo) ✅ · senza semi ✅',
    sicurezzaLui: 'Carne magra ben cotta ✅ · olive ok solo per lui ✅ · carbo delle patate con la carne ✅',
    macros: { kcalLui: '~490', kcalLei: '~390', proteine: 'alte' }
  },

  {
    id: 'r42',
    nome: 'Zuppa di ceci e farro con curcuma',
    emoji: '🥘',
    gradient: ['#d97706', '#78350f'],
    momento: ['P3'],
    persona: 'entrambi',
    tempoMin: 35,
    difficolta: 'facile',
    mealPrep: true,
    tags: ['legumi', 'curcuma', 'comfort', 'meal-prep', 'senza-semi', 'invernale', 'una-pentola', 'anti-infiammatorio'],
    descrizione: 'Zuppa calda e densa di ceci e farro profumata di curcuma+pepe nero e rosmarino: proteine vegetali e cereale in un piatto solo. Per lei una parte si frulla in passata morbida.',
    ingredienti: [
      { nome: 'Ceci lessati (anche in barattolo)', lui: '120g', lei: '100g' },
      { nome: 'Farro perlato', lui: '50g', lei: '40g' },
      { nome: 'Passata di pomodoro (poca)', lui: '2 cucchiai', lei: '2 cucchiai' },
      { nome: 'Cipolla + carota + sedano', lui: '¼ + ½ + ½', lei: '¼ + ½ + ½' },
      { nome: 'Curcuma + pepe nero + rosmarino', lui: 'q.b.', lei: 'q.b.' },
      { nome: 'Olio EVO + parmigiano a crudo', lui: '1 cucchiaio + 1 cucchiaio', lei: '1 cucchiaio + 1 cucchiaino' }
    ],
    passaggi: [
      'Soffriggi cipolla, carota e sedano in olio EVO, aggiungi il farro e tostalo 1 minuto.',
      'Unisci ceci, passata e abbondante brodo o acqua calda; cuoci 25–30 minuti finché il farro è morbido.',
      'Manteca con curcuma, pepe nero macinato fresco e rosmarino: il pepe attiva la curcuma.',
      'Per lei: preleva una parte e frullala a passata liscia, poi riuniscila per una consistenza più morbida (o servila tutta frullata).',
      'Finisci ogni piatto con parmigiano e un filo di EVO a crudo.'
    ],
    tips: 'Ceci + farro = proteine vegetali e cereale completi a basso costo. La curcuma con pepe nero e l\'olio raggiunge il massimo assorbimento. Si congela in porzioni.',
    sicurezzaLei: 'Parte frullata morbida ✅ · legumi e farro ben cotti ✅ · curcuma quotidiana ✅ · senza semi ✅',
    sicurezzaLui: 'Legumi + cereale (proteine vegetali + carbo) nello stesso piatto ✅ · curcuma+pepe anti-infiammatori ✅',
    macros: { kcalLui: '~500', kcalLei: '~390', proteine: 'medie-alte' }
  },

  // ══════════════════════════════════════════════
  // JOLLY — Salvavita & svuota-frigo (3 ricette)
  // ══════════════════════════════════════════════

  {
    id: 'r26',
    nome: 'Fried rice rescue (riso avanzato + uova)',
    emoji: '🥡',
    gradient: ['#fbbf24', '#16a34a'],
    momento: ['P1', 'P2', 'P3'],
    persona: 'entrambi',
    tempoMin: 8,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['jolly', 'anti-spreco', 'veloce', 'senza-semi', 'salvavita'],
    descrizione: 'IL piatto salvavita del piano: qualunque riso/farro avanzato + 2 uova fresche + qualunque verdura cotta del frigo = pasto completo in 8 minuti. Impossibile sbagliare.',
    ingredienti: [
      { nome: 'Riso/farro/basmati avanzato', lui: '1 porzione (~200g)', lei: '¾ porzione (~150g)' },
      { nome: 'Uova', lui: '2–3 intere', lei: '2 intere' },
      { nome: 'Verdure cotte avanzate (zucchine, carote, spinaci...)', lui: '1 manciata', lei: '1 manciata' },
      { nome: 'Olio EVO + curcuma + pepe', lui: '1 cucchiaio + q.b.', lei: '1 cucchiaio + q.b.' },
      { nome: 'Parmigiano (facoltativo)', lui: '1 cucchiaio', lei: '—' }
    ],
    passaggi: [
      'Padella grande ben calda con olio EVO.',
      'Strapazza le uova finché sono SODE e sbriciolate, mettile da parte nel bordo.',
      'Butta riso freddo e verdure avanzate: fuoco vivo, 3–4 minuti saltando.',
      'Riunisci tutto, curcuma + pepe nero, aggiusta di sale. Fine.',
      'Regola d\'oro: prima le uova ben cotte, poi il resto — mai uova bavose nel salto finale.'
    ],
    tips: 'Funziona con QUALSIASI avanzo compliant del frigo. Se c\'è pollo avanzato, dentro anche quello. Questo piatto da solo azzera gli sprechi della settimana.',
    sicurezzaLei: 'Solo avanzi già compliant = sicuro per definizione ✅ · tutto morbido e saltato ✅',
    sicurezzaLui: 'Uova strapazzate sode ✅ · carbo mai da soli: le uova ci sono sempre ✅',
    macros: { kcalLui: '~480', kcalLei: '~370', proteine: 'medie-alte' }
  },

  {
    id: 'r27',
    nome: 'Frittata svuota-frigo del giovedì',
    emoji: '♻️',
    gradient: ['#10b981', '#0d9488'],
    momento: ['P1', 'P3'],
    persona: 'entrambi',
    tempoMin: 15,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['jolly', 'anti-spreco', 'proteico', 'senza-semi'],
    descrizione: 'Il rito anti-spreco: tutte le verdure cotte e i formaggi a fine corsa del frigo finiscono in una frittata al forno. Ogni settimana è diversa, ogni settimana è buona.',
    ingredienti: [
      { nome: 'Uova', lui: '3 intere', lei: '2 + 1 albume' },
      { nome: 'Verdure cotte avanzate (qualsiasi, purché compliant)', lui: '1 ciotola', lei: '1 ciotola' },
      { nome: 'Ritagli di formaggi in lista (scamorza/provola/mozzarella)', lui: '~40g', lei: '~30g' },
      { nome: 'Parmigiano (anche la crosta grattata)', lui: '1 cucchiaio', lei: '1 cucchiaino' },
      { nome: 'Olio EVO', lui: '1 cucchiaino', lei: '1 cucchiaino' }
    ],
    passaggi: [
      'Inventario frigo: verdure cotte, formaggi in lista aperti da finire, eventuali patate lesse.',
      'Taglia tutto a pezzetti uniformi e distribuisci in teglia oliata.',
      'Versa le uova sbattute con parmigiano sopra il "mosaico" di avanzi.',
      'Forno 180° per 15–18 minuti: ben rappresa, gonfia, dorata.',
      'Servi con pane: lui tostato, lei morbido. Frigo svuotato, cena fatta.'
    ],
    tips: 'Filtro mentale prima di buttare dentro: è nella lista di entrambi? Niente pomodoro fresco, niente broccoli crudi, solo formaggi consentiti. Tutto il resto è benvenuto.',
    sicurezzaLei: 'Solo ingredienti già verificati del piano ✅ · cottura forno = morbida uniforme ✅',
    sicurezzaLui: 'Uova al forno ben cotte ✅ · formaggi solo dalla lista ✅',
    macros: { kcalLui: '~420', kcalLei: '~330', proteine: 'alte' }
  },

  {
    id: 'r28',
    nome: 'Piatto freddo di emergenza (zero cottura)',
    emoji: '🧊',
    gradient: ['#60a5fa', '#6366f1'],
    momento: ['P2', 'P3'],
    persona: 'entrambi',
    tempoMin: 5,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['jolly', 'estiva', 'veloce', 'no-cottura', 'senza-semi', 'salvavita'],
    descrizione: 'Troppo stanchi per cucinare (succede, con narcolessia e turni notturni): piatto componibile dal frigo in 5 minuti che resta dentro il piano. Meglio questo che ordinare.',
    ingredienti: [
      { nome: 'Mozzarella o provola', lui: '1 pallina / 60g', lei: '¾ pallina / 50g' },
      { nome: 'Uova sode (tenerne sempre 4 pronte in frigo)', lui: '2', lei: '1' },
      { nome: 'Pane integrale', lui: '2 fette', lei: '1 fetta e ½ morbida' },
      { nome: 'Avocado o peperoni arrostiti prep\'d', lui: '½ avocado', lei: '½ avocado o peperoni' },
      { nome: 'Frutta consentita', lui: '1 banana', lei: '1 pesca sbucciata o ½ melone a cubetti' },
      { nome: 'Olio EVO + limone', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Apri il frigo e componi: formaggio + uova sode + pane + grasso buono + frutta consentita.',
      'Condisci con olio EVO e limone, sale solo sul necessario.',
      'Regola delle uova sode di scorta: ogni 2–3 giorni rassodane 4 (10 minuti esatti da bollore) e tienile in frigo col guscio: durano 4 giorni.',
      'Mangia, lavati i denti (lei: risciacquo bicarbonato) e a letto senza sensi di colpa.'
    ],
    tips: 'Questo piatto esiste per le sere in cui l\'alternativa sarebbe il delivery. Tenere SEMPRE in casa: uova sode pronte, 1 mozzarella, pane congelato a fette, 1 avocado maturo.',
    sicurezzaLei: 'Tutto morbido e senza semi se componi dalla lista ✅',
    sicurezzaLui: 'Uova sode 10 min ✅ · pane sempre con formaggio/uova ✅ · zero caffeina serale ✅',
    macros: { kcalLui: '~520', kcalLei: '~400', proteine: 'alte' }
  },

  {
    id: 'r43',
    nome: 'Toast filante / mozzarella in carrozza compliant',
    emoji: '🥪',
    gradient: ['#fbbf24', '#f97316'],
    momento: ['P2', 'P3'],
    persona: 'entrambi',
    tempoMin: 12,
    difficolta: 'facile',
    mealPrep: false,
    tags: ['jolly', 'veloce', 'comfort', 'padella', 'senza-semi', 'salvavita'],
    descrizione: 'La mozzarella in carrozza senza frittura: pane integrale con mozzarella dentro, passato nell\'uovo e dorato in padella. Filante e croccante per lui, morbido per lei. Jolly svuota-frigo buono a merenda o a cena.',
    ingredienti: [
      { nome: 'Pane integrale morbido (senza semi)', lui: '4 fette', lei: '3 fette' },
      { nome: 'Mozzarella ben scolata (o provola)', lui: '1 pallina / 80g', lei: '¾ pallina / 60g' },
      { nome: 'Uova per la "carrozza"', lui: '2 intere', lei: '1 + 1 albume' },
      { nome: 'Latte', lui: '40ml', lei: '40ml p. scremato' },
      { nome: 'Olio EVO per la padella', lui: '1 cucchiaino', lei: '1 cucchiaino' },
      { nome: 'Origano (facoltativo)', lui: 'q.b.', lei: 'q.b.' }
    ],
    passaggi: [
      'Componi i toast: mozzarella ben scolata tra due fette di pane, pressando bene i bordi per sigillarli.',
      'Sbatti uova e latte con un pizzico di sale in un piatto fondo; inzuppa i toast su entrambi i lati.',
      'Cuoci in padella antiaderente con un velo d\'olio, 3 minuti per lato: l\'uovo deve essere ben rappreso e la mozzarella fila dentro.',
      'Per lui: lascialo dorare di più (croccante). Per lei: fuoco più dolce, resta morbido sotto.',
      'Taglia in diagonale e servi caldo, filante.'
    ],
    tips: 'Versione sana del fritto da rosticceria: stessa goduria, zero frittura. Svuota-frigo perfetto per i fondi di mozzarella o provola della settimana.',
    sicurezzaLei: 'Pane morbido senza semi ✅ · cottura dolce = morbido ✅ · uovo ben cotto nella panatura ✅',
    sicurezzaLui: 'Uovo della "carrozza" completamente rappreso ✅ · pane (carbo) con mozzarella (proteine) ✅',
    macros: { kcalLui: '~470', kcalLei: '~360', proteine: 'alte' }
  }

];

// Esposizione globale per la PWA (vanilla JS, no moduli)
window.RECIPES = RECIPES;
