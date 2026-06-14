// ============================================================
// TIPS — Consigli pratici specifici per la coppia e per questo piano
// Dieta 16:8 · LUI (narcolessia+ADHD) · LEI (ipotiroidismo+parodontite)
// Categorie: digiuno, lui, lei, cucina, spesa, alternative,
//            idratazione, sonno, movimento, eating-out
// Vanilla JS — caricato via <script>, esposto su window.TIPS
// ============================================================

const TIPS = [

  // ── DIGIUNO (4) ─────────────────────────────────────────────

  {
    id: 't01',
    categoria: 'digiuno',
    icona: '⏰',
    titolo: 'La fame delle 11:30 è quasi sempre sete',
    testo: 'Nell\'ultima ora prima delle 13:00 la "fame" è spesso disidratazione dopo 8 ore di sonno. Bevi i 500ml d\'acqua della sveglia e aspetta 15 minuti: nella maggior parte dei casi passa. Se non passa, caffè nero o tè senza zucchero spezzano l\'attesa senza rompere il digiuno.',
    persona: 'entrambi'
  },
  {
    id: 't02',
    categoria: 'digiuno',
    icona: '🥚',
    titolo: 'Rompi il digiuno con le proteine, mai con i carbo da soli',
    testo: 'Il primo cibo dopo 16 ore di digiuno detta la curva glicemica di tutta la giornata. Inizia il Pasto 1 sempre dalla parte proteica (uova) e solo dopo pane e frutta: glicemia più stabile per entrambi, e per lui significa meno sonnolenza post-prandiale alle 14.',
    persona: 'entrambi'
  },
  {
    id: 't03',
    categoria: 'digiuno',
    icona: '🔄',
    titolo: 'Lo sgarro non si recupera digiunando di più',
    testo: 'Se una sera sfori (cena fuori, festa), NON allungare il digiuno il giorno dopo per "compensare": per lei scendere sotto le 1.400 kcal rallenta la tiroide, per lui saltare pasti destabilizza dopamina e veglia. Si riprende semplicemente il piano normale dal pasto successivo. Uno sgarro isolato è rumore statistico.',
    persona: 'entrambi'
  },
  {
    id: 't04',
    categoria: 'digiuno',
    icona: '🌙',
    titolo: 'Le 21:00 sono un confine netto: usa la routine, non la forza di volontà',
    testo: 'La voglia di spiluccare dopo le 21 si vince con un rituale fisso, non resistendo: lei fa subito il risciacquo col bicarbonato e lava i denti, lui prepara la tisana (no caffeina). Denti puliti e bocca "chiusa" sono un segnale psicologico potentissimo che la cucina è finita.',
    persona: 'entrambi'
  },

  // ── LUI — narcolessia + ADHD (5) ───────────────────────────

  {
    id: 't05',
    categoria: 'lui',
    icona: '☕',
    titolo: 'Ultimo caffè alle 17:00, non alle 18:00',
    testo: 'La regola dice "no caffeina dopo le 18", ma la caffeina ha emivita di 5–6 ore: un caffè alle 18 è ancora mezzo attivo a mezzanotte. Con sonno già fragile da narcolessia, ancorare l\'ultimo caffè al Pasto 2 delle 17:00 è il compromesso perfetto: spinta per la serata lavorativa, zero interferenza alle 4 quando vai a dormire.',
    persona: 'lui'
  },
  {
    id: 't06',
    categoria: 'lui',
    icona: '🧠',
    titolo: 'Tirosina a inizio finestra: le uova sono il tuo "farmaco" alimentare',
    testo: 'Uova, pollo e parmigiano sono ricchi di tirosina, il precursore della dopamina — il neurotrasmettitore carente in ADHD e coinvolto nella veglia. Mangiarli alle 13:00 a stomaco "pulito" dal digiuno massimizza l\'assorbimento: la finestra 13–15 è quella in cui dovresti pianificare il lavoro che richiede più concentrazione.',
    persona: 'lui'
  },
  {
    id: 't07',
    categoria: 'lui',
    icona: '💡',
    titolo: 'Luce forte nei primi 15 minuti, anche se ti svegli a mezzogiorno',
    testo: 'I neuroni orexinergici (quelli difettosi nella narcolessia) rispondono alla luce intensa. Appena sveglio: tapparelle su, balcone o lampada potente in faccia per 10–15 minuti, PRIMA del telefono. Con orari notturni, la luce è l\'unico segnale di "mattina" che il tuo cervello riceve: non saltarlo.',
    persona: 'lui'
  },
  {
    id: 't08',
    categoria: 'lui',
    icona: '😴',
    titolo: 'Sonnolenza post-pranzo: riduci il pane, non aggiungere caffè',
    testo: 'Se alle 14:30 crolli regolarmente, prima di aumentare la caffeina prova a togliere mezza fetta di pane dal Pasto 1 e spostarla al Pasto 2: meno carboidrati in un colpo solo = picco glicemico più basso = meno inibizione dell\'orexina. La camminata di 15 minuti dopo pranzo amplifica l\'effetto.',
    persona: 'lui'
  },
  {
    id: 't09',
    categoria: 'lui',
    icona: '🍽️',
    titolo: 'Mai saltare il Pasto 2: è la tua assicurazione anti-crollo',
    testo: 'Con ADHD è facile "dimenticarsi di mangiare" quando sei iperfocalizzato. Ma per te saltare il pasto delle 17 significa crollo di energia e dopamina in piena serata lavorativa, e poi abbuffata alle 20:30. Metti una sveglia fissa alle 16:50: il Pasto 2 è programmato apposta per essere veloce (2–12 minuti).',
    persona: 'lui'
  },

  // ── LEI — ipotiroidismo + parodontite (6) ──────────────────

  {
    id: 't10',
    categoria: 'lei',
    icona: '💊',
    titolo: 'Levotiroxina: 30–60 minuti prima di qualsiasi cibo, sempre',
    testo: 'Se prendi levotiroxina, l\'orario ideale con la finestra 16:8 è appena sveglia (es. 12:00) con sola acqua, così alle 13:00 il pasto non ne blocca l\'assorbimento. Caffè, latte e formaggi sono i peggiori interferenti: tieni SEMPRE almeno 30–60 minuti tra pastiglia e qualsiasi cosa che non sia acqua. Conferma lo schema esatto col tuo endocrinologo.',
    persona: 'lei'
  },
  {
    id: 't11',
    categoria: 'lei',
    icona: '🧂',
    titolo: 'Zinco lontano dai formaggi: il momento giusto è il Pasto 3 senza latticini',
    testo: 'Il calcio dei latticini compete con lo zinco per l\'assorbimento, e lo zinco serve sia alla tiroide sia alle gengive. Guarda il piano: prendilo nel pasto della giornata SENZA formaggi (di solito il P3 a base di pesce o lenticchie). Il selenio invece va bene a pranzo con tutto il resto.',
    persona: 'lei'
  },
  {
    id: 't12',
    categoria: 'lei',
    icona: '🦷',
    titolo: 'Risciacquo al bicarbonato: dopo OGNI pasto, non solo la sera',
    testo: 'Mezzo cucchiaino di bicarbonato in mezzo bicchiere di acqua tiepida, sciacqua 30 secondi e sputa. Neutralizza gli acidi che infiammano le gengive e va fatto dopo tutti e 3 i pasti, non solo prima di dormire. Aspetta poi 30 minuti prima di spazzolare: lo smalto appena "attaccato" dagli acidi del pasto si graffia.',
    persona: 'lei'
  },
  {
    id: 't13',
    categoria: 'lei',
    icona: '🥦',
    titolo: 'Brassicacee: ben cotte sono amiche della tiroide, crude no',
    testo: 'Broccoli, cavolfiore e verza crudi contengono goitrogeni che interferiscono con la tiroide, ma la cottura sopra i 70° (vapore 12+ minuti, come nel piano) li inattiva quasi del tutto. Quindi: broccoli ben cotti sì e fanno bene, insalata di cavolo cappuccio cruda mai. Bonus: ben cotti sono anche morbidi per le gengive.',
    persona: 'lei'
  },
  {
    id: 't14',
    categoria: 'lei',
    icona: '📉',
    titolo: 'La bilancia con ipotiroidismo si guarda al mese, non al giorno',
    testo: 'Il metabolismo rallentato fa perdere peso più lentamente e con più fluttuazioni da ritenzione: pesarti ogni giorno è solo frustrazione. Pesati 1 volta a settimana, stessa ora, e valuta la TENDENZA su 4 settimane. Mai tagliare sotto le 1.400 kcal per "accelerare": ottieni l\'effetto opposto, la tiroide rallenta ancora.',
    persona: 'lei'
  },
  {
    id: 't15',
    categoria: 'lei',
    icona: '🪥',
    titolo: 'Spazzolino morbido e cibi morbidi non sono per sempre',
    testo: 'I cibi morbidi del piano servono a non traumatizzare le gengive DURANTE la cura parodontale, non a vita. Usa spazzolino a setole morbide, filo o scovolino come indicato dal parodontologo, e segna i controlli ogni 3–4 mesi. Man mano che le gengive guariscono, il parodontologo ti dirà quando reintrodurre consistenze più dure.',
    persona: 'lei'
  },

  // ── CUCINA (5) ──────────────────────────────────────────────

  {
    id: 't16',
    categoria: 'cucina',
    icona: '🍳',
    titolo: 'Uova ben cotte ma NON gommose: il segreto è il fuoco basso',
    testo: 'Per lui le uova devono essere completamente rapprese, ma cotte a fuoco alto diventano suole. Il trucco: fuoco medio-basso e 1–2 minuti in più. Strapazzate: mescola continuamente finché non c\'è più parte lucida/bavosa. Sode: 10 minuti esatti da quando bolle, poi acqua fredda subito (si sbucciano meglio e niente anello verde).',
    persona: 'entrambi'
  },
  {
    id: 't17',
    categoria: 'cucina',
    icona: '🍗',
    titolo: 'Pollo morbido per lei: cottura coperta e mai oltre',
    testo: 'Il petto di pollo diventa stopposo (impossibile per le gengive) se supera la cottura. Per lei: cuoci in umido o in padella coperta con un dito di brodo/passata, 12–15 minuti, e taglia SEMPRE contropelo a fette sottili. Per lui invece griglia pure: a lui il croccante è concesso.',
    persona: 'entrambi'
  },
  {
    id: 't18',
    categoria: 'cucina',
    icona: '⏲️',
    titolo: 'Il batch della domenica: prima le cotture lunghe, poi le mani',
    testo: 'L\'errore classico è iniziare tagliando verdure per un\'ora. Inverti: PRIMA accendi forno (pollo) e pentole (riso, lenticchie, brodo), POI mentre tutto cuoce fai tagli e contenitori. Le 3 ore diventano 2 e mezza. E raffredda sempre i contenitori aperti prima di chiuderli in frigo: la condensa accorcia la conservazione.',
    persona: 'entrambi'
  },
  {
    id: 't19',
    categoria: 'cucina',
    icona: '🌶️',
    titolo: 'Curcuma: sempre con pepe nero E un grasso, mai da sola',
    testo: 'La curcumina si assorbe pochissimo da sola. La combinazione del piano è scientificamente sensata: curcuma + pepe nero macinato fresco (la piperina ne aumenta enormemente la biodisponibilità) + olio EVO o altro grasso nel piatto. Aggiungila a fine cottura, non a inizio: il calore prolungato la degrada.',
    persona: 'entrambi'
  },
  {
    id: 't20',
    categoria: 'cucina',
    icona: '🧀',
    titolo: 'Mozzarella in cottura: scolala 30 minuti prima',
    testo: 'Pizza in padella, bruschettoni, frittate: se la mozzarella entra bagnata, il piatto annega. Tagliala e lasciala su carta assorbente o in un colino 30 minuti prima di usarla. Per la pizza del sabato, ancora meglio: spezzettala e tienila in frigo scoperta dal mattino.',
    persona: 'entrambi'
  },

  // ── SPESA (4) ───────────────────────────────────────────────

  {
    id: 't21',
    categoria: 'spesa',
    icona: '🐟',
    titolo: 'Pesce surgelato di qualità batte il fresco mediocre',
    testo: 'Merluzzo, orata e sgombro surgelati subito dopo la pesca conservano gli omega-3 meglio di un "fresco" che ha viaggiato 4 giorni. Costano il 30–40% in meno e azzerano lo spreco: li scongeli solo quando li cucini. Tieni sempre 2 filetti di merluzzo in freezer: sono la cena di emergenza del piano.',
    persona: 'entrambi'
  },
  {
    id: 't22',
    categoria: 'spesa',
    icona: '🏷️',
    titolo: 'Etichetta del pane: la parola da cercare è "semi"',
    testo: 'Molti pani integrali industriali aggiungono sesamo, lino o girasole in superficie o nell\'impasto — vietati per lei. Leggi SEMPRE l\'ingrediente, anche se il pane sembra liscio: "può contenere semi di sesamo" in produzione condivisa va valutato caso per caso. La soluzione più sicura: pane integrale del panettiere chiedendo esplicitamente senza semi, e congelarlo a fette.',
    persona: 'lei'
  },
  {
    id: 't23',
    categoria: 'spesa',
    icona: '📅',
    titolo: 'Frutta consentita: compra a maturazione scalare',
    testo: 'Il trucco del piano per banane (2 mazzi: uno maturo, uno verde) vale per tutto: avocado 2 maturi + 2 duri, pere 2 pronte + 2 da maturare, pesche idem. Così hai frutta al punto giusto OGNI giorno senza buttarne. La frutta troppo matura ha sempre un destino: pancake banana-uovo o frullato.',
    persona: 'entrambi'
  },
  {
    id: 't24',
    categoria: 'spesa',
    icona: '💶',
    titolo: 'I 3 acquisti che reggono tutto il piano: uova, passata, lenticchie rosse',
    testo: 'Sono i tre alimenti più usati e più economici del piano: comprali sempre in formato grande (30 uova, 2–3 bottiglie di passata, 1kg di lenticchie rosse). Costano poco, durano molto e con loro in dispensa esiste SEMPRE un pasto compliant possibile, anche a frigo vuoto.',
    persona: 'entrambi'
  },

  // ── ALTERNATIVE — sostituzioni intelligenti (8) ─────────────

  {
    id: 't25',
    categoria: 'alternative',
    icona: '🍅',
    titolo: 'Manca la passata? Peperoni arrostiti frullati',
    testo: 'Il "sugo rosso" di emergenza per lei: peperoni arrostiti, sbucciati e PULITI dai semi, frullati con olio EVO e basilico. Dolce, cremoso, senza semi, e condisce pasta e bruschette esattamente come la passata. Funziona anche metà passata + metà peperoni per variare.',
    persona: 'lei'
  },
  {
    id: 't26',
    categoria: 'alternative',
    icona: '🐠',
    titolo: 'Niente tonno in scatola per lui? Sgombro in scatola al naturale',
    testo: 'Il tonno è vietato, ma lo sgombro in filetti al naturale o all\'olio d\'oliva è il sostituto perfetto in scatola: stessa praticità, più omega-3, e già presente nel piano del venerdì. Per insalate di riso/farro veloci è il salva-pasto da tenere in dispensa.',
    persona: 'lui'
  },
  {
    id: 't27',
    categoria: 'alternative',
    icona: '🥜',
    titolo: 'Lei non può le mandorle intere? Crema 100% frutta secca (liscia)',
    testo: 'La frutta secca intera è vietata per le gengive, ma una crema di mandorle o nocciole 100% LISCIA (zero zuccheri, zero pezzi, controlla "senza pezzi" in etichetta) dà gli stessi grassi buoni in formato morbido: 1 cucchiaino raso sul pancake o nella banana schiacciata. Le noci intere restano solo per lui. ⚠️ Prima di introdurla, falla approvare da nutrizionista/parodontologo (il piano vieta i "semi di qualsiasi tipo": la crema liscia è una deroga ragionevole ma va validata).',
    persona: 'lei'
  },
  {
    id: 't28',
    categoria: 'alternative',
    icona: '🍚',
    titolo: 'Finito il riso? Le lenticchie rosse cuociono in 10 minuti',
    testo: 'Se il batch di riso è finito a metà settimana, non serve ricuocerlo: le lenticchie rosse decorticate sono il carboidrato+proteina più veloce della dispensa (10 minuti, no ammollo). Stessa logica al contrario: finite le lenticchie, il riso basmati cuoce in 12 minuti.',
    persona: 'entrambi'
  },
  {
    id: 't29',
    categoria: 'alternative',
    icona: '🧀',
    titolo: 'Niente yogurt per lui: la "crema" si fa con banana e latte',
    testo: 'Dove una ricetta chiederebbe yogurt (vietato per lui), frulla banana matura + latte + cannella: stessa cremosità dolce per colazioni e merende. In versione salata, l\'avocado schiacciato con limone sostituisce yogurt e ricotta in ogni toast o salsa.',
    persona: 'lui'
  },
  {
    id: 't30',
    categoria: 'alternative',
    icona: '🍐',
    titolo: 'Frutta vietata a lei? La mappa delle sostituzioni 1:1',
    testo: 'Fragole/lamponi → pesca sbucciata (stessa freschezza acidula). Kiwi → fetta di melone (vitamina C). Fichi/uva → pera morbida sbucciata (dolcezza). Melograno → mango (colore e dolce). Regola unica: se il dubbio è "avrà semi?", la risposta è banana, melone, mango, pesca, albicocca o pera sbucciata. Stop.',
    persona: 'lei'
  },
  {
    id: 't31',
    categoria: 'alternative',
    icona: '🍞',
    titolo: 'Grissini e crackers vietati? Pane tostato morbido o crostini di frittata',
    testo: 'Per la voglia di "qualcosa da sgranocchiare" di lei: pane integrale appena tostato e tagliato a quadrotti mentre è tiepido (croccante fuori, cede subito), oppure cubetti di frittata al forno fredda. Per lui invece grissini e taralli senza semi sono ok, purché accompagnati da formaggio o uova.',
    persona: 'entrambi'
  },
  {
    id: 't32',
    categoria: 'alternative',
    icona: '🥛',
    titolo: 'No soia per lei: il latte resta vaccino, le proteine veg restano legumi',
    testo: 'Latte di soia, tofu ed edamame interferiscono con la levotiroxina e sono esclusi. Le alternative compliant: latte vaccino parzialmente scremato (già nel piano), e come proteina vegetale le lenticchie rosse decorticate. Se serve un latte vegetale per gusto: avena senza zuccheri aggiunti, MAI bevanda di soia.',
    persona: 'lei'
  },

  // ── IDRATAZIONE (2) ─────────────────────────────────────────

  {
    id: 't33',
    categoria: 'idratazione',
    icona: '💧',
    titolo: 'La regola 500+500+500: ancorare l\'acqua ai pasti',
    testo: 'Con la finestra ristretta è facile bere poco: ancorare l\'acqua a momenti fissi risolve. 500ml appena svegli (già nel piano), 500ml tra Pasto 1 e Pasto 2, 500ml tra Pasto 2 e le 21:00. Più quello che bevi ai pasti, arrivi a ~2 litri senza pensarci. Bottiglia graduata sulla scrivania = il promemoria migliore.',
    persona: 'entrambi'
  },
  {
    id: 't34',
    categoria: 'idratazione',
    icona: '🍵',
    titolo: 'Le ore di digiuno serale si "bevono": tisane sì, attenti ai tè',
    testo: 'Dalle 21:00 in poi: acqua, camomilla, finocchio, melissa — tutte ok e non rompono il digiuno. Attenzione di lui: tè verde e tè nero CONTENGONO caffeina, quindi dopo le 18 sono vietati quanto il caffè. La tisana calda della sera ha anche un effetto "chiusura cucina" psicologico potente.',
    persona: 'entrambi'
  },

  // ── SONNO (3) ───────────────────────────────────────────────

  {
    id: 't35',
    categoria: 'sonno',
    icona: '🛏️',
    titolo: 'Magnesio: l\'ultimo gesto prima del rituale del sonno',
    testo: 'Il magnesio serale del piano va preso verso le 23:00–23:30 (1 ora prima di iniziare a rallentare verso il sonno delle 04:00), con un bicchiere d\'acqua: favorisce rilassamento muscolare e nervoso. Evita di prenderlo insieme allo zinco di lei: si assorbono meglio separati.',
    persona: 'entrambi'
  },
  {
    id: 't36',
    categoria: 'sonno',
    icona: '📵',
    titolo: 'Per la narcolessia, la regolarità batte la quantità',
    testo: 'Andare a dormire SEMPRE alle 04:00 e svegliarsi SEMPRE alle 12:00 vale più di una notte da 10 ore ogni tanto: il sistema orexinergico fragile si aggrappa alla regolarità. Weekend compresi: spostare il sonno di 2–3 ore il sabato è un mini jet-lag che paghi con più attacchi di sonno lunedì.',
    persona: 'lui'
  },
  {
    id: 't37',
    categoria: 'sonno',
    icona: '🌡️',
    titolo: 'Cena leggera = sonno migliore (e tiroide più contenta)',
    testo: 'Il P3 leggero di lei non è solo per le calorie: digerire un pasto pesante alza la temperatura corporea proprio quando dovrebbe scendere per dormire. Se dopo cena senti pesantezza, anticipa la parte più ricca del P3 al P2 e tieni la sera su vellutate e pesce. Il sonno profondo è anche il momento in cui gli ormoni tiroidei lavorano meglio.',
    persona: 'lei'
  },

  // ── MOVIMENTO (2) ───────────────────────────────────────────

  {
    id: 't38',
    categoria: 'movimento',
    icona: '🚶',
    titolo: 'La camminata delle 13:45: l\'abitudine con il miglior rapporto sforzo/risultato',
    testo: 'I 15–20 minuti di camminata dopo il Pasto 1 abbassano il picco glicemico post-prandiale in modo misurabile: per lui significa meno sonnolenza alle 14:30, per lei è il booster metabolico più efficace che esista con ipotiroidismo. Fatela INSIEME subito dopo pranzo, prima di sedervi: una volta seduti, non si esce più.',
    persona: 'entrambi'
  },
  {
    id: 't39',
    categoria: 'movimento',
    icona: '🌆',
    titolo: 'Seconda camminata dopo il P2: luce + movimento per il ritmo circadiano',
    testo: 'Una seconda camminata breve (10 minuti) dopo il pasto delle 17:00 sfrutta l\'ultima luce naturale del giorno: per lui è un segnale circadiano che aiuta a tenere la veglia serale senza caffeina extra; per lei sono altri 40–50 kcal e gambe meno gonfie. Se piove: 10 minuti di faccende in piedi contano comunque.',
    persona: 'entrambi'
  },

  // ── EATING-OUT (3) ──────────────────────────────────────────

  {
    id: 't40',
    categoria: 'eating-out',
    icona: '🍕',
    titolo: 'In pizzeria: margherita per entrambi, con due accortezze',
    testo: 'La pizza è già nel piano del sabato, quindi in pizzeria si ordina sereni: margherita (mozzarella ok per entrambi). Lui evita pizze con salumi (jolly insaccato magari già speso) e uovo poco cotto sopra. Lei chiede "bordo basso e ben cotta ma non croccante", lascia il cornicione se è duro, e NIENTE pomodorini freschi sopra. Acqua, niente bibite zuccherate.',
    persona: 'entrambi'
  },
  {
    id: 't41',
    categoria: 'eating-out',
    icona: '🍝',
    titolo: 'Al ristorante: la griglia di domande che salva il piano',
    testo: 'Tre filtri rapidi sul menu. Lui: "il pesce è tonno o salmone?" (no), "l\'uovo è ben cotto?" (carbonara e uova in camicia no, frittata sì). Lei: "ci sono semi, pomodoro fresco o frutta vietata?" e preferisce piatti morbidi: risotti, pesce al forno, pasta ben cotta con passata. Scelte sempre sicure per entrambi: risotto, orata/branzino al forno con patate, pasta al pomodoro (passata) — e si chiede senza problemi: i ristoranti sono abituati.',
    persona: 'entrambi'
  },
  {
    id: 't42',
    categoria: 'eating-out',
    icona: '🕐',
    titolo: 'Invito a cena alle 21:30? Sposta la finestra, non romperla',
    testo: 'Se la cena fuori finisce oltre le 21:00, la mossa giusta è SPOSTARE tutta la finestra del giorno: primo pasto alle 14:00–15:00 invece che alle 13:00, così le 16 ore di digiuno restano intere. Alleggerisci P1 e P2 (non saltarli!) per fare spazio calorico alla cena. Il digiuno 16:8 è una finestra mobile, non una gabbia fissa.',
    persona: 'entrambi'
  }

];

// Esposizione globale per la PWA (vanilla JS, no moduli)
window.TIPS = TIPS;
