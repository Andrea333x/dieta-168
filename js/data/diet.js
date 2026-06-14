// ============================================================
// DIET_DATA — Piano Nutrizionale Avanzato Digiuno Intermittente 16:8
// Biohacking clinico · Coppia · Stile di vita nottambulo
// Lui (35a) Narcolessia + ADHD · Lei (32a) Ipotiroidismo + Sovrappeso + Parodontite
// Generato fedelmente dai file sorgente (versione definitiva + Meal Prep Edition)
// Vanilla JS — incluso via <script src>, espone window.DIET_DATA
// ============================================================

const DIET_DATA = {

  // ---------- PERSONE ----------
  persone: {
    lui: { eta: 35, condizioni: ['Narcolessia', 'ADHD'], emoji: '👦' },
    lei: { eta: 32, condizioni: ['Ipotiroidismo', 'Sovrappeso', 'Parodontite'], emoji: '👩' }
  },

  // ---------- FINESTRA ALIMENTARE ----------
  finestra: [
    { ora: '12:00', evento: 'Sveglia', dettaglio: 'Solo acqua 500ml + caffè/tè nero (no zucchero)' },
    { ora: '13:00', evento: 'PASTO 1', dettaglio: 'Principale, ricco di proteine' },
    { ora: '17:00', evento: 'PASTO 2', dettaglio: 'Medio, bilanciato' },
    { ora: '20:30', evento: 'PASTO 3', dettaglio: 'Leggero/digestivo (lei) · Energetico (lui se lavora)' },
    { ora: '21:00', evento: 'INIZIO DIGIUNO', dettaglio: '' },
    { ora: '04:00', evento: 'Sonno', dettaglio: '' }
  ],

  // ---------- TARGET CALORICI E MACRO ----------
  target: {
    lui: {
      proteine: '130–150g',
      carboidrati: '180–200g',
      grassi: '70–80g',
      calorie: '~1.900–2.100 kcal'
    },
    lei: {
      proteine: '100–120g',
      carboidrati: '130–150g',
      grassi: '55–65g',
      calorie: '~1.450–1.600 kcal',
      notaCalorie: 'mai sotto 1.400 con ipotiroidismo'
    }
  },

  // ---------- INTEGRATORI (timing pranzo) ----------
  // Premessa: prendere tutto insieme a pranzo (Pasto 1 ore 13:00) è accettabile ✅ con una nota importante
  integratoriPremessa: 'Prendere tutto insieme a pranzo (Pasto 1 ore 13:00) è accettabile ✅ con una nota importante.',
  integratori: [
    { nome: 'Omega-3', timing: 'Pranzo (Pasto 1, 13:00)', valutazione: 'ottimo', note: 'Con il pasto grasso, assorbimento massimo', persona: 'entrambi' },
    { nome: 'Vitamina C', timing: 'Pranzo (Pasto 1, 13:00)', valutazione: 'ottimo', note: 'Con cibo, nessun problema', persona: 'entrambi' },
    { nome: 'CoQ10', timing: 'Pranzo (Pasto 1, 13:00)', valutazione: 'ok', note: 'Ideale a mattino ma pranzo è la seconda scelta migliore', persona: 'entrambi' },
    { nome: 'Vitamina D3+K2', timing: 'Pranzo (Pasto 1, 13:00)', valutazione: 'ottimo', note: 'Vuole grassi per assorbirsi — pranzo perfetto', persona: 'entrambi' },
    { nome: 'Selenio', timing: 'Pranzo (Pasto 1, 13:00)', valutazione: 'ok', note: 'Con cibo va bene', persona: 'lei' },
    { nome: 'Zinco', timing: 'Pasto 2 o 3 (senza latticini)', valutazione: 'attenzione', note: 'Lo zinco compete con il calcio → se il pasto 1 contiene mozzarella/formaggi, spostare lo zinco al Pasto 2 o 3 (senza latticini) per assorbimento ottimale', persona: 'lei' },
    { nome: 'Magnesio', timing: 'Sera', valutazione: 'ottimo', note: 'Già corretto — calmante pre-sonno (✅ Perfetto)', persona: 'entrambi' }
  ],
  integratoriSoluzione: 'Soluzione pratica: tutto a pranzo tranne zinco lei (Pasto 2 o 3 senza formaggi).',

  // ---------- GUIDA ALLE PORZIONI FACILI ----------
  porzioni: [
    { alimento: 'Uovo', unita: '1 uovo', equivale: '1 uovo' },
    { alimento: 'Pane', unita: '1 fetta', equivale: '~40–50g (fetta standard da filone)' },
    { alimento: 'Pasta/riso crudo', unita: '1 pugno chiuso', equivale: '~80–90g (lui) · ¾ pugno (lei)' },
    { alimento: 'Farro/legumi secchi', unita: '1 pugno', equivale: '~80g' },
    { alimento: 'Carne/pesce', unita: '1 palmo della mano aperta (senza dita)', equivale: '~130–150g (lui) · poco meno (lei)' },
    { alimento: 'Verdura cotta', unita: '1 ciotola media', equivale: '~150–200g' },
    { alimento: 'Formaggio morbido (mozzarella)', unita: '1 pallina piccola', equivale: '~100g · ¾ pallina lei' },
    { alimento: 'Parmigiano/scamorza/provola', unita: '2 dita di spessore su fetta', equivale: '~30–40g' },
    { alimento: 'Avocado', unita: '½ frutto', equivale: '~75g' },
    { alimento: 'Olio EVO', unita: '1 cucchiaio', equivale: '~10ml' },
    { alimento: 'Miele', unita: '1 cucchiaino raso', equivale: '~10g' },
    { alimento: 'Noci (solo lui)', unita: '1 piccola manciata', equivale: '~25g (≈ 4–5 noci intere)' },
    { alimento: 'Banana', unita: '1 banana media', equivale: '~120g' },
    { alimento: 'Pesca/albicocca', unita: '1 frutto medio', equivale: '~120–150g' },
    { alimento: 'Melone', unita: '1 fetta media', equivale: '~200g' },
    { alimento: 'Lenticchie/legumi cotti', unita: '1 mestolo', equivale: '~120–130g' }
  ],

  // ---------- PIANO SETTIMANALE — 7 GIORNI ----------
  giorni: [

    // ===== LUNEDÌ =====
    {
      id: 'lun',
      nome: 'Lunedì',
      pasti: [
        {
          n: 1, ora: '13:00', titolo: 'Uova strapazzate + spinaci', emoji: '🍳',
          items: [
            { alimento: 'Uova', lui: '3 uova intere, ben strapazzate in padella', lei: '2 uova intere + 1 albume, ben strapazzate' },
            { alimento: 'Spinaci', lui: '1 ciotola freschi saltati in olio EVO', lei: '1 ciotola freschi saltati in olio EVO' },
            { alimento: 'Parmigiano', lui: '2 dita grattugiate sopra le uova', lei: '—' },
            { alimento: 'Pane', lui: '2 fette integrale (tostato morbido, non bruciato)', lei: '1 fetta e ½ integrale morbido' },
            { alimento: 'Avocado', lui: '½ avocado a fette con limone', lei: '½ avocado a fette con limone' },
            { alimento: 'Frutta', lui: '—', lei: '1 banana media' },
            { alimento: 'Olio EVO', lui: '1 cucchiaio per padella', lei: '1 cucchiaio per padella' }
          ],
          nota: '🔬 Biohack lui: le uova ben cotte (strapazzate sode) a inizio finestra alimentare forniscono tirosina → precursore della dopamina, attiva la veglia e la concentrazione entro 60–90 min.',
          prep: {
            fonte: 'misto',
            passi: [
              'Friggere 3 uova lui + 2 uova + 1 albume lei in padella (5 min)',
              'Aggiungere spinaci già cotti domenica dal frigo (30 sec riscaldare)',
              'Pane 2 fette lui / 1,5 fette lei → tostare al momento',
              'Avocado ½ fresco a fette (al momento per freschezza)'
            ],
            tempoMin: 8
          }
        },
        {
          n: 2, ora: '17:00', titolo: 'Mozzarella + pane', emoji: '🥗',
          items: [
            { alimento: 'Mozzarella', lui: '1 pallina intera (125g)', lei: '¾ pallina (~100g)' },
            { alimento: 'Pane', lui: '1 fetta e ½ integrale', lei: '1 fetta integrale morbido' },
            { alimento: 'Pomodori', lui: '2 pomodori medi a fette', lei: '4 cucchiai di passata con olio EVO (o peperoni arrostiti sbucciati)' },
            { alimento: 'Olive', lui: '1 cucchiaio (≈10 olive)', lei: '—' },
            { alimento: 'Frutta', lui: '1 banana', lei: '1 pesca sbucciata morbida' },
            { alimento: 'Olio EVO', lui: '1 cucchiaino', lei: '1 cucchiaino' }
          ],
          nota: '⚠️ Lei – Zinco: se lo prende qui, va bene perché la mozzarella è poca.',
          prep: {
            fonte: 'fresco',
            passi: [
              'Estrarre mozzarella dal frigo',
              'Aprire scatola pomodori → lui 2 fette fresche · lei passata 4 cucchiai',
              'Frutta fresca banana/pesca al momento'
            ],
            tempoMin: 3
          }
        },
        {
          n: 3, ora: '20:30', titolo: 'Pasta al pomodoro + pollo', emoji: '🍽️',
          items: [
            { alimento: 'Pasta integrale', lui: '1 pugno (≈90g cruda)', lei: '¾ pugno (≈70g cruda)' },
            { alimento: 'Sugo', lui: 'Pomodoro fresco 2 pomodori + basilico + aglio', lei: '4 cucchiai passata + basilico + aglio' },
            { alimento: 'Parmigiano', lui: '2 cucchiaini grattuggiato', lei: '1 cucchiaino' },
            { alimento: 'Pollo', lui: '1 palmo petto alla piastra ben cotto', lei: '1 palmo petto in umido (morbido)' },
            { alimento: 'Zucchine', lui: '1 ciotola al vapore', lei: '1 ciotola al vapore' },
            { alimento: 'Olio EVO', lui: '1 cucchiaio', lei: '1 cucchiaio' }
          ],
          nota: '',
          prep: {
            fonte: 'misto',
            passi: [
              'Cuocere pasta 90g lui / 70g lei in acqua (10 min)',
              'Riscaldare pollo petto prep\'d domenica (2 min microonde o padella)',
              'Aggiungere sugo passata 4 cucchiai',
              'Zucchine già cotte prep\'d dal frigo (1 min riscaldare)'
            ],
            tempoMin: 15
          }
        }
      ],
      tempoTotaleMin: 26
    },

    // ===== MARTEDÌ =====
    {
      id: 'mar',
      nome: 'Martedì',
      pasti: [
        {
          n: 1, ora: '13:00', titolo: 'French Toast integrale', emoji: '🍳',
          items: [
            { alimento: 'Fette di pane integrale', lui: '2 fette', lei: '1 fetta e ½' },
            { alimento: 'Uova nell\'impasto', lui: '2 uova intere', lei: '1 uovo + 1 albume' },
            { alimento: 'Latte', lui: '½ tazza (100ml) intero', lei: '½ tazza (80ml) p. scremato' },
            { alimento: 'Cannella', lui: 'q.b.', lei: 'q.b.' },
            { alimento: 'Topping', lui: 'Miele 1 cucchiaino + 4–5 noci spezzate + 1 banana a fette', lei: 'Miele 1 cucchiaino + 1 banana a fette + 1 pesca sbucciata' }
          ],
          nota: 'Ingredienti base (entrambi usano lo stesso preparato, porzioni diverse): sbattere uova + latte + cannella in una ciotola → inzuppare le fette di pane → cuocere in padella antiaderente con ½ cucchiaino EVO.',
          prep: {
            fonte: 'fresco',
            passi: [
              'Sbattere 2 uova + latte + cannella (2 min)',
              'Inzuppare pane e cuocere (6 min)',
              'Banana fresca + topping (2 min)'
            ],
            tempoMin: 10
          }
        },
        {
          n: 2, ora: '17:00', titolo: 'Uova ben cotte + frutta', emoji: '🥗',
          items: [
            { alimento: 'Uova', lui: '2 uova in padella, ben cotte (non liquide) con olio EVO', lei: '2 uova in padella, ben cotte' },
            { alimento: 'Parmigiano', lui: '2 dita a scaglie', lei: '—' },
            { alimento: 'Pane', lui: '1 fetta integrale', lei: '1 fetta morbida' },
            { alimento: 'Frutta', lui: '1 banana + 1 pesca', lei: '1 banana + 2 albicocche sbucciate' }
          ],
          nota: '',
          prep: {
            fonte: 'fresco',
            passi: [
              '2 uova lui ben cotte in padella + parmigiano (5 min)',
              '2 uova lei ben cotte senza parmigiano (5 min)',
              'Pane tostato',
              'Frutta fresca banana/pesca'
            ],
            tempoMin: 12
          }
        },
        {
          n: 3, ora: '20:30', titolo: 'Pesce al forno + patate al vapore', emoji: '🍽️',
          items: [
            { alimento: 'Orata (filetto)', lui: '1 filetto grande (≈200g, 1 palmo abbondante)', lei: '1 filetto medio (≈160g)' },
            { alimento: 'Patate', lui: '2 patate medie al vapore', lei: '1 patata e ½ al vapore' },
            { alimento: 'Verdura', lui: '1 ciotola carote+zucchine al vapore', lei: '1 ciotola carote+zucchine al vapore' },
            { alimento: 'Condimento', lui: 'Olio EVO 1 cucchiaio + limone + rosmarino', lei: 'Olio EVO 1 cucchiaio + limone' }
          ],
          nota: '♻️ Anti-spreco: cucinare il pesce per entrambi nella stessa teglia, separati. Usare la stessa acqua del vapore per patate e verdure.',
          prep: {
            fonte: 'misto',
            passi: [
              'Orata filetto prep\'d (martedì → lo cuoci fresco al forno 12 min con limone)',
              'Patate già cotte al vapore domenica (3 min riscaldare)',
              'Carote/zucchine prep\'d (1 min riscaldare)',
              'Il pesce è l\'unico piatto che cucini fresco per qualità'
            ],
            tempoMin: 18
          }
        }
      ],
      tempoTotaleMin: 40
    },

    // ===== MERCOLEDÌ =====
    {
      id: 'mer',
      nome: 'Mercoledì',
      pasti: [
        {
          n: 1, ora: '13:00', titolo: 'Frittata al forno con formaggio', emoji: '🍳',
          items: [
            { alimento: 'Uova', lui: '3 uova intere', lei: '2 uova + 1 albume' },
            { alimento: 'Verdure', lui: '½ peperone + 1 zucchina piccola a dadini', lei: '1 zucchina + 1 carota piccola grattugiata' },
            { alimento: 'Formaggio dentro', lui: 'Scamorza 2 fette sottili (≈40g)', lei: 'Mozzarella 2 fette (≈40g)' },
            { alimento: 'Cottura', lui: 'Forno 180° per 15 min', lei: 'Stessa teglia, stesso tempo' },
            { alimento: 'Pane', lui: '2 fette integrale tostato', lei: '1 fetta e ½ morbida' },
            { alimento: 'Frutta', lui: '—', lei: '1 fetta melone (≈200g, grande come il palmo)' },
            { alimento: 'Olio EVO', lui: '½ cucchiaino per teglia', lei: '½ cucchiaino' }
          ],
          nota: 'Cuocere in teglia piccola da forno (entrambi usano la stessa teglia, quantità separate o divisa a metà).',
          prep: {
            fonte: 'prepd',
            passi: [
              'PRE-BATCH domenica 12:30: fare 2 frittate piccole (1 lui, 1 lei) in tegliette, cuocerle al forno, mettere in frigo. Mercoledì estrai e servi fredda o riscaldata 1 min.',
              'Frittata già prep\'d → dal frigo al piatto',
              'Pane fresco tostato',
              'Melone fresco ½ lei'
            ],
            tempoMin: 3
          }
        },
        {
          n: 2, ora: '17:00', titolo: 'Formaggi + verdure', emoji: '🥗',
          items: [
            { alimento: 'Formaggio', lui: 'Scamorza 2 fette (≈50g)', lei: 'Provola 2 fette (≈50g)' },
            { alimento: 'Pane', lui: '1 fetta e ½ integrale', lei: '1 fetta morbida' },
            { alimento: 'Verdura', lui: '2 pomodori a fette + olive 1 cucchiaio', lei: 'Peperoni arrostiti sbucciati 1 ciotola piccola (in alternativa a pomodori)' },
            { alimento: 'Frutta', lui: '1 banana', lei: '1 banana' }
          ],
          nota: '',
          prep: {
            fonte: 'misto',
            passi: [
              'Scamorza/provola direttamente dal frigo',
              'Pane fresco',
              'Peperoni arrostiti prep\'d domenica (invece pomodori per lei) → dal frigo',
              'Banana fresca'
            ],
            tempoMin: 2
          }
        },
        {
          n: 3, ora: '20:30', titolo: 'Pollo in umido + riso basmati', emoji: '🍽️',
          items: [
            { alimento: 'Pollo', lui: '1 coscia disossata (≈180g)', lei: '1 petto piccolo (≈140g) in umido morbido' },
            { alimento: 'Riso basmati', lui: '1 pugno (≈90g crudo)', lei: '¾ pugno (≈65g crudo)' },
            { alimento: 'Sugo umido', lui: '2 mestoli', lei: '2 mestoli passati (più lisci per lei)' },
            { alimento: 'Finocchi', lui: '1 ciotola al vapore', lei: '1 ciotola al vapore' },
            { alimento: 'Olio EVO', lui: 'nel tegame comune', lei: 'nel tegame comune' }
          ],
          nota: 'Cuocere il pollo in umido per entrambi nello stesso tegame (stessa preparazione, porzioni diverse): pomodoro passato + cipolla + carota + sedano + poco olio EVO → sobbollire 35 min.',
          prep: {
            fonte: 'prepd',
            passi: [
              'Pollo cosce prep\'d + sugo umido prep\'d → scaldare 3 min microonde',
              'Riso basmati prep\'d → scaldare 2 min microonde',
              'Finocchi al vapore prep\'d → scaldare 1 min'
            ],
            tempoMin: 7
          }
        }
      ],
      tempoTotaleMin: 12
    },

    // ===== GIOVEDÌ =====
    {
      id: 'gio',
      nome: 'Giovedì',
      pasti: [
        {
          n: 1, ora: '13:00', titolo: 'Avocado toast + uova ben cotte', emoji: '🍳',
          items: [
            { alimento: 'Uova', lui: '3 uova in padella, ben cotte (tipo fried egg completamente cotto)', lei: '2 uova ben cotte in padella' },
            { alimento: 'Pane', lui: '2 fette integrale', lei: '1 fetta e ½ morbida' },
            { alimento: 'Avocado', lui: '½ avocado schiacciato con forchetta + limone', lei: '½ avocado schiacciato + limone' },
            { alimento: 'Extra', lui: '4–5 noci spezzate + parmigiano 2 dita', lei: '½ mango a fette (≈100g)' },
            { alimento: 'Olio EVO', lui: '1 cucchiaino', lei: '1 cucchiaino' }
          ],
          nota: '',
          prep: {
            fonte: 'fresco',
            passi: [
              '3 uova lui ben cotte in padella (5 min)',
              '2 uova lei ben cotte (5 min)',
              'Avocado ½ fresco schiacciato su pane',
              'Noci lui / mango lei fresco'
            ],
            tempoMin: 12
          }
        },
        {
          n: 2, ora: '17:00', titolo: 'Frutta + formaggio', emoji: '🥗',
          items: [
            { alimento: 'Formaggio', lui: 'Parmigiano 2 dita spesse a scaglie (≈30g)', lei: 'Provola 2 fette (≈50g)' },
            { alimento: 'Frutta', lui: '1 banana + 1 pesca', lei: '1 banana + 1 pera sbucciata morbida' },
            { alimento: 'Pane', lui: '1 fetta integrale', lei: '1 fetta morbida' }
          ],
          nota: '',
          prep: {
            fonte: 'fresco',
            passi: [
              'Formaggio direttamente dal frigo',
              'Frutta fresca (banana + pesca/pera)',
              'Pane'
            ],
            tempoMin: 2
          }
        },
        {
          n: 3, ora: '20:30', titolo: 'Crema di lenticchie rosse', emoji: '🍽️',
          items: [
            { alimento: 'Lenticchie rosse secche', lui: '1 pugno (≈80g)', lei: '¾ pugno (≈65g)' },
            { alimento: 'Acqua/brodo', lui: '3 volte il volume', lei: '3 volte il volume' },
            { alimento: 'Condimento', lui: 'Olio EVO 1 cucchiaio + rosmarino + curcuma + pepe', lei: 'Olio EVO 1 cucchiaio + curcuma + pepe nero (attiva curcumina ×20)' },
            { alimento: 'Pane', lui: '2 fette tostate per fare "crostoni"', lei: '1 fetta morbida spezzata' },
            { alimento: 'Spinaci', lui: '1 ciotola saltati in padella', lei: '1 ciotola al vapore' }
          ],
          nota: 'Le lenticchie rosse decorticate NON hanno bisogno di ammollo e si disfano naturalmente in crema — stesso tegame per entrambi. 🔬 Biohack curcuma + pepe nero: la piperina del pepe aumenta la biodisponibilità della curcumina del 2000%. Effetto anti-infiammatorio clinicamente rilevante per lei (tiroide) e lui (neuroinfiammazione ADHD).',
          prep: {
            fonte: 'prepd',
            passi: [
              'Lenticchie prep\'d + curcuma + pepe nero → scaldare 2 min',
              'Spinaci al vapore prep\'d lei → scaldare 1 min (lui salta in padella ricaldo)',
              'Pane fresco (lui tostato, lei morbido)'
            ],
            tempoMin: 5
          }
        }
      ],
      tempoTotaleMin: 19
    },

    // ===== VENERDÌ =====
    {
      id: 'ven',
      nome: 'Venerdì',
      pasti: [
        {
          n: 1, ora: '13:00', titolo: 'Pancakes integrali', emoji: '🍳',
          items: [
            { alimento: 'Farina integrale', lui: '6 cucchiai (≈80g)', lei: '4 cucchiai (≈55g)' },
            { alimento: 'Uova nell\'impasto', lui: '2 uova', lei: '1 uovo + 1 albume' },
            { alimento: 'Latte', lui: '½ tazza intero', lei: '½ tazza p. scremato' },
            { alimento: 'Lievito', lui: '½ cucchiaino', lei: '½ cucchiaino' },
            { alimento: 'Topping', lui: 'Miele 1 cucchiaino + 4 noci + 1 banana', lei: 'Miele 1 cucchiaino + 1 banana + 1 pesca sbucciata a fette' }
          ],
          nota: 'Preparazione unica per entrambi, stessa ciotola — dividere l\'impasto: farina integrale + uova + latte + lievito (senza semi) → cuocere in padella antiaderente senza olio.',
          prep: {
            fonte: 'fresco',
            passi: [
              'Sbattere ingredienti (2 min)',
              'Cuocere pancakes (8 min)',
              'Topping banana + noci/pesca (2 min)'
            ],
            tempoMin: 12
          }
        },
        {
          n: 2, ora: '17:00', titolo: 'Uova ben cotte + mozzarella', emoji: '🥗',
          items: [
            { alimento: 'Uova', lui: '2 uova ben cotte in padella con olio EVO', lei: '2 uova ben cotte' },
            { alimento: 'Mozzarella', lui: '½ pallina (≈60g)', lei: '½ pallina (≈60g)' },
            { alimento: 'Pane', lui: '1 fetta integrale', lei: '1 fetta morbida' },
            { alimento: 'Verdura/frutta', lui: '2 pomodori + olive 1 cucchiaio', lei: 'Peperoni arrostiti sbucciati + 1 fetta melone' }
          ],
          nota: '',
          prep: {
            fonte: 'fresco',
            passi: [
              '2 uova lui ben cotte (5 min) + mozzarella',
              '2 uova lei ben cotte (5 min) + mozzarella',
              'Pane fresco',
              'Verdure/frutta'
            ],
            tempoMin: 12
          }
        },
        {
          n: 3, ora: '20:30', titolo: 'Sgombro al forno + purè', emoji: '🍽️',
          items: [
            { alimento: 'Sgombro', lui: '1 filetto grande (≈180g) o 2 piccoli', lei: '1 filetto medio (≈140g)' },
            { alimento: 'Purè', lui: '2 patate medie schiacciate con olio EVO + latte', lei: '1 patata e ½ con latte p.s. + olio EVO' },
            { alimento: 'Broccoli', lui: '1 ciotola ben cotti al vapore (non crudi!)', lei: '1 ciotola ben cotti, morbidi' },
            { alimento: 'Condimento', lui: 'Olio EVO 1 cucchiaio + limone + aglio', lei: 'Olio EVO 1 cucchiaio + limone' }
          ],
          nota: 'Stessa teglia per entrambi — lo sgombro fresco o surgelato di qualità ha più omega-3 del salmone.',
          prep: {
            fonte: 'misto',
            passi: [
              'Sgombro cuocere fresco al forno con limone (12 min)',
              'Patate prep\'d + latte + olio → schiacciare/mescolare (3 min)',
              'Broccoli prep\'d → riscaldare (1 min)'
            ],
            tempoMin: 18
          }
        }
      ],
      tempoTotaleMin: 42
    },

    // ===== SABATO =====
    {
      id: 'sab',
      nome: 'Sabato',
      pasti: [
        {
          n: 1, ora: '13:00', titolo: 'Uova scrambled con formaggio filante', emoji: '🍳',
          items: [
            { alimento: 'Uova', lui: '3 uova ben cotte (scrambled densi, non bavosi)', lei: '2 uova + 1 albume — cottura lenta e morbida' },
            { alimento: 'Formaggio', lui: 'Provola 2 fette (≈50g) → aggiunta a fine cottura', lei: 'Scamorza 2 fette (≈40g) → sciolta dentro' },
            { alimento: 'Latte in cottura', lui: '1 cucchiaio (dà cremosità senza renderle liquide)', lei: '2 cucchiai (più morbide per lei)' },
            { alimento: 'Pane', lui: '2 fette integrale', lei: '1 fetta e ½ morbida' },
            { alimento: 'Frutta', lui: '1 banana', lei: '1 pera sbucciata morbida + ½ banana' }
          ],
          nota: '',
          prep: {
            fonte: 'fresco',
            passi: [
              '3 uova lui scrambled con provola (7 min)',
              '2 uova + albume lei scrambled con scamorza (7 min)',
              'Pane fresco',
              'Frutta fresca'
            ],
            tempoMin: 16
          }
        },
        {
          n: 2, ora: '17:00', titolo: 'Farro con verdure e formaggio', emoji: '🥗',
          items: [
            { alimento: 'Farro perlato secco', lui: '1 pugno (≈80g)', lei: '¾ pugno (≈60g)' },
            { alimento: 'Verdure', lui: '1 zucchina + 1 carota grigliate/a vapore', lei: '1 zucchina + 1 carota al vapore (morbide)' },
            { alimento: 'Formaggio', lui: 'Scamorza 2 fette a cubetti (≈50g)', lei: 'Mozzarella ½ pallina a pezzi (≈60g)' },
            { alimento: 'Condimento', lui: 'Olio EVO 1 cucchiaio + erbe', lei: 'Olio EVO 1 cucchiaio + erbe' }
          ],
          nota: 'Cuocere il farro in abbondante acqua per entrambi — stessa pentola.',
          prep: {
            fonte: 'misto',
            passi: [
              'Cuocere farro 80g lui / 60g lei in acqua (40 min — fai un batch per entrambi)',
              'Zucchine + carote prep\'d dal frigo',
              'Formaggio fresco',
              'Puoi farla mentre fai altro, non attiva'
            ],
            tempoMin: 45
          }
        },
        {
          n: 3, ora: '20:30', titolo: 'PIZZA FATTA IN CASA', emoji: '🍽️',
          items: [
            { alimento: 'Impasto a testa', lui: 'metà teglia (≈180g impasto)', lei: 'metà teglia (≈150g impasto)' },
            { alimento: 'Pomodoro', lui: 'Passata 4 cucchiai', lei: 'Passata 4 cucchiai (già senza semi ✅)' },
            { alimento: 'Mozzarella', lui: '1 pallina intera (125g) + scamorza 2 fette', lei: '¾ pallina (100g)' },
            { alimento: 'Extra lui', lui: 'Olive + origano', lei: '—' },
            { alimento: 'Extra lei', lui: 'Origano + filo EVO', lei: 'Bordi non croccanti — togliere dal forno leggermente prima' }
          ],
          nota: 'Impasto unico per entrambi, ben lievitato (almeno 2–3h o più): farina integrale 2 pugni (≈160g) + farina 0 1 pugno (≈80g) per morbidezza · lievito di birra secco ½ bustina + acqua tiepida + sale + olio EVO · stendere sottile → cuocere 220° per 12–15 min.',
          prep: {
            fonte: 'misto',
            passi: [
              'Estrai impasto pizza congelato prep\'d domenica',
              'Lascia risalire temperatura 4 ore prima (oppure sul radiatore 2h)',
              'Stendi e cuoci → 12 min forno 220°',
              'Topping mozzarella + pomodoro passata',
              'Tempo attivo in cucina 15 min (il resto è lievitazione)'
            ],
            tempoMin: 15
          }
        }
      ],
      tempoTotaleMin: 76
    },

    // ===== DOMENICA =====
    {
      id: 'dom',
      nome: 'Domenica',
      sottotitolo: 'Pasto libero modulato',
      pasti: [
        {
          n: 1, ora: '13:00', titolo: 'Brunch libero', emoji: '🍳',
          items: [
            { alimento: 'Suggerimento', lui: 'Uova in qualsiasi forma ben cotta + pane + avocado', lei: 'Uova morbide ben cotte + frutta consentita + pane' },
            { alimento: 'Porzione', lui: 'Come gli altri giorni', lei: 'Come gli altri giorni' }
          ],
          nota: '',
          prep: {
            fonte: 'prepd',
            passi: [
              'Assemblare con quello che trovi in frigo dai prep'
            ],
            tempoMin: 10
          }
        },
        {
          n: 2, ora: '17:00', titolo: 'Frutta e/o formaggio', emoji: '🥗',
          items: [
            { alimento: 'Frutta', lui: 'Libera', lei: 'Solo consentita: banana, melone, mango, pesca, albicocca, pera sbucciata' },
            { alimento: 'Formaggio', lui: '2–3 dita parmigiano o provola', lei: 'Mozzarella ½ pallina' }
          ],
          nota: '',
          prep: null // il file Meal Prep non riporta istruzioni per il P2 della domenica
        },
        {
          n: 3, ora: '20:30', titolo: 'Risotto cremoso + proteina', emoji: '🍽️',
          items: [
            { alimento: 'Riso Carnaroli secco', lui: '1 pugno (≈90g)', lei: '¾ pugno (≈65g)' },
            { alimento: 'Base', lui: 'Brodo di pollo home made + cipolla + olio EVO', lei: 'Uguale' },
            { alimento: 'Variante', lui: 'Zucca surgelata 1 mestolo + parmigiano 2 cucchiai a fine cottura', lei: 'Funghi 1 ciotola piccola + parmigiano 1 cucchiaio' },
            { alimento: 'Proteina', lui: 'Pollo/coniglio in umido 1 palmo (avanzo di settimana ✅)', lei: 'Pollo in umido 1 palmo (morbido)' }
          ],
          nota: 'Risotto preparato con brodo fatto dalla carcassa del pollo di inizio settimana → zero sprechi ♻️. Subito dopo cena → inizio batch cooking prossima settimana (3h).',
          prep: {
            fonte: 'misto',
            passi: [
              'Brodo prep\'d domenica scorsa → scaldare',
              'Cuocere riso 15 min aggiungendo brodo gradualmente',
              'Proteina (avanzi pollo/coniglio prep\'d) → riscaldare'
            ],
            tempoMin: 20
          }
        }
      ],
      tempoTotaleMin: 180 // riepilogo settimanale: domenica = 180 min (batch cooking concentrato)
    }
  ],

  // ---------- RIEPILOGO DIVIETI ----------
  divieti: {
    lui: [
      'Tonno, salmone, yogurt, ricotta',
      'Uova crude/baveuse/morbide → solo ben cotte',
      'Formaggi non in lista (ok solo: parmigiano, mozzarella, scamorza, provola)',
      'Insaccati e salumi (massimo 1 volta/settimana)',
      'Carboidrati semplici senza proteine abbinate',
      'Caffeina dopo le 18:00'
    ],
    lei: [
      'Semi di qualsiasi tipo',
      'Pomodori freschi interi → sostituire sempre con passata/pelati passati/alternative',
      'Frutta con semi: fragole, kiwi, lamponi, more, fichi, melograno, uva con semi',
      'Cibi duri: grissini, taralli, crackers secchi, mandorle intere crude',
      'Brassicacee crude (ok solo ben cotte)',
      'Soia in eccesso',
      'Succhi industriali zuccherati'
    ]
  },

  // ---------- ALTERNATIVE AL POMODORO PER LEI ----------
  // Dato che i pomodori freschi hanno molti semi, usare:
  pomodoroAlternative: [
    'Passata di pomodoro in bottiglia → già senza semi ✅ (la più semplice)',
    'Pomodori pelati in scatola schiacciati e passati → semi rimossi con passino ✅',
    'Pomodori datterini cotti in padella e passati → piccoli, meno semi ✅',
    'Alternative di colore/freschezza: peperoni arrostiti e sbucciati, zucchine grigliate, carote stufate',
    'Nei condimenti freddi: cetriolo sbucciato e senza parte centrale, peperoni crudi sbucciati',
    '💡 Regola pratica: tutto il pomodoro di lei viene cotto e passato o viene usata direttamente passata in bottiglia. Solo lui usa pomodori freschi a fette.'
  ],

  // ---------- LOGICA ANTI-SPRECO ----------
  antiSpreco: [
    { emoji: '🐔', titolo: 'Pollo intero o tagliato', testo: 'Acquistare 1 pollo intero a settimana → petto usato in umido/griglia + cosce per il risotto domenica → brodo con la carcassa per risotto/zuppe' },
    { emoji: '🥚', titolo: 'Uova', testo: 'Usate ogni giorno in varie forme — nessuno spreco possibile' },
    { emoji: '🥦', titolo: 'Verdure', testo: 'Zucchine e carote comprate in sacchetto grande (1kg), usate su più giorni' },
    { emoji: '🍌', titolo: 'Banane a mazzo', testo: 'Da 6–7: mature al punto giusto ogni giorno' },
    { emoji: '🧀', titolo: 'Scamorza/provola', testo: 'Compra 1 pezzo intero, si conserva bene in frigo per tutta la settimana' },
    { emoji: '🐟', titolo: 'Pesce', testo: 'Sgombro e orata/merluzzo comprati lo stesso giorno (venerdì mercato fresco o surgelato in qualità) → cucinati martedì e venerdì · il surgelato non spreca mai' },
    { emoji: '🍅', titolo: 'Pomodori per lei', testo: 'Alternative senza semi (vedi sezione dedicata)' }
  ],

  // ---------- LISTA DELLA SPESA SETTIMANALE — OTTIMIZZATA ANTI-SPRECO ----------
  // 💡 I quantitativi sono calcolati per coprire esattamente 7 giorni per 2 persone senza avanzi inutili.
  spesa: [
    {
      categoria: '🥚 Proteine animali',
      items: [
        { prodotto: 'Uova fresche', quantita: '28–30 uova (2 cartoni da 15 o 1 da 30)', note: 'Ogni giorno, base del piano' },
        { prodotto: 'Pollo intero (o pezzi misti)', quantita: '1 pollo intero ~1,5kg oppure 800g petto + 4 cosce', note: 'Lun (petto), Mer (cosce), Dom (avanzo risotto) + carcassa per brodo' },
        { prodotto: 'Orata o branzino (filetti)', quantita: '2 filetti grandi (~400g totali)', note: 'Martedì' },
        { prodotto: 'Merluzzo o nasello (filetti)', quantita: '2 filetti medi (~350g totali)', note: 'Martedì alternativa' },
        { prodotto: 'Sgombro (fresco o surgelato qualità)', quantita: '2 filetti (~350g totali)', note: 'Venerdì' },
        { prodotto: 'Coniglio (facoltativo domenica)', quantita: '300g già pulito', note: 'Domenica (alternativa al pollo)' }
      ]
    },
    {
      categoria: '🧀 Latticini e formaggi',
      items: [
        { prodotto: 'Mozzarella fiordilatte', quantita: '5 palline da 125g', note: 'Lun, Mar, Ven, Sab, Pizza' },
        { prodotto: 'Parmigiano Reggiano', quantita: '1 pezzo da 200g (si conserva settimane)', note: 'Grattugiato + scaglie, quasi ogni giorno lui' },
        { prodotto: 'Scamorza', quantita: '1 pezzo da 250g', note: 'Mer frittata, Sab scrambled, Farro sab, Pizza lui' },
        { prodotto: 'Provola', quantita: '1 pezzo da 200g', note: 'Gio p2, Sab scrambled lui, Mer p2 lei' },
        { prodotto: 'Latte intero', quantita: '1L', note: 'French toast + pancakes lui + scrambled' },
        { prodotto: 'Latte parzialmente scremato', quantita: '1L', note: 'Stesse preparazioni lei + purè lei' }
      ]
    },
    {
      categoria: '🥦 Verdure',
      items: [
        { prodotto: 'Spinaci freschi (busta)', quantita: '500g', note: 'Lun p1, Gio p3' },
        { prodotto: 'Zucchine', quantita: '1,2kg (≈6 zucchine medie)', note: 'Lun, Mer, Ven, Sab' },
        { prodotto: 'Carote', quantita: '700g (≈6–7 carote)', note: 'Mar, Mer, Gio, Sab' },
        { prodotto: 'Patate', quantita: '1,5kg', note: 'Mar + Ven (vapore e purè)' },
        { prodotto: 'Peperoni (rossi/gialli)', quantita: '3 pezzi', note: 'Mer frittata + alternativa pomodoro lei' },
        { prodotto: 'Finocchi', quantita: '2 bulbi', note: 'Mer p3' },
        { prodotto: 'Broccoli', quantita: '1 cespo medio (~500g)', note: 'Ven p3' },
        { prodotto: 'Cipolla', quantita: '3–4 cipolle', note: 'Soffritti e umidi' },
        { prodotto: 'Aglio', quantita: '1 testa', note: 'Condimenti vari' },
        { prodotto: 'Sedano', quantita: '2 coste', note: 'Brodo + umido mercoledì' },
        { prodotto: 'Funghi (freschi o surgelati)', quantita: '300g', note: 'Domenica risotto lei' },
        { prodotto: 'Zucca (surgelata a dadini)', quantita: '400g', note: 'Domenica risotto lui' }
      ]
    },
    {
      categoria: '🍌 Frutta',
      items: [
        { prodotto: 'Banane', quantita: '2 mazzi da 6 (~12 banane)', note: 'Ogni giorno per entrambi' },
        { prodotto: 'Pesche o nettarine', quantita: '6', note: 'Sbucciare sempre per lei' },
        { prodotto: 'Melone', quantita: '1 intero', note: 'Mer + Ven lei' },
        { prodotto: 'Mango', quantita: '2 maturi', note: 'Gio + Dom lei' },
        { prodotto: 'Albicocche', quantita: '8–10', note: 'Mar + Gio lei' },
        { prodotto: 'Pere', quantita: '4 (morbide, tipo Abate)', note: 'Gio + Sab + Dom lei' },
        { prodotto: 'Avocado', quantita: '4 (comprarne 2 maturi + 2 da maturare)', note: 'Lun, Gio, Ven' },
        { prodotto: 'Limoni', quantita: '6', note: 'Pesce, condimenti, risciacquo lei' }
      ]
    },
    {
      categoria: '🌾 Cereali, legumi e dispensa',
      items: [
        { prodotto: 'Pane integrale morbido senza semi', quantita: '2 filoni (o 1 filone + 1 confezione affettato)', note: 'Ogni giorno — verificare etichetta: ZERO semi' },
        { prodotto: 'Pasta integrale', quantita: '500g', note: 'Lunedì' },
        { prodotto: 'Riso basmati', quantita: '500g', note: 'Mercoledì' },
        { prodotto: 'Riso Carnaroli/Arborio', quantita: '500g', note: 'Domenica risotto' },
        { prodotto: 'Farro perlato', quantita: '400g', note: 'Sabato' },
        { prodotto: 'Lenticchie rosse decorticate', quantita: '400g', note: 'Giovedì (no ammollo!)' },
        { prodotto: 'Farina integrale', quantita: '500g', note: 'Pancakes + pizza' },
        { prodotto: 'Farina tipo 0', quantita: '300g', note: 'Pizza (morbidezza impasto)' },
        { prodotto: 'Lievito di birra secco', quantita: '2 bustine', note: 'Pizza sab + pancakes ven' },
        { prodotto: 'Noci sgusciate', quantita: '200g', note: 'Solo lui · Lun, Mar, Gio, Ven' },
        { prodotto: 'Olive in salamoia', quantita: '1 vasetto piccolo (200g)', note: 'Solo lui' },
        { prodotto: 'Passata di pomodoro', quantita: '2 bottiglie da 700ml', note: 'Lei sempre + sughi comuni' },
        { prodotto: 'Miele', quantita: '1 barattolo 250g', note: 'Pancakes, french toast' },
        { prodotto: 'Olio EVO', quantita: '750ml', note: 'Base di tutto' },
        { prodotto: 'Curcuma in polvere', quantita: '1 bustina/barattolo 50g', note: 'Giovedì + abitudine quotidiana' },
        { prodotto: 'Pepe nero', quantita: 'q.b.', note: 'Con curcuma — obbligatorio' },
        { prodotto: 'Cannella', quantita: 'q.b.', note: 'French toast' },
        { prodotto: 'Rosmarino, basilico, origano', quantita: 'q.b. (freschi o secchi)', note: 'Aromi' },
        { prodotto: 'Brodo vegetale/dado naturale', quantita: '1L o 2 dadi (senza glutammato)', note: 'Risotto domenica' },
        { prodotto: 'Bicarbonato di sodio', quantita: '1 confezione', note: 'Risciacquo orale lei dopo ogni pasto' }
      ]
    }
  ],

  // ---------- TIMING DI ACQUISTO (dal file Meal Prep) ----------
  spesaTiming: {
    freschiDomenica: [
      // Ortofrutta (compra il giorno stesso)
      'Spinaci 500g',
      'Zucchine 1,2kg',
      'Carote 700g',
      'Patate 1,5kg',
      'Peperoni 3 pezzi',
      'Finocchi 2 bulbi',
      'Broccoli 1 cespo',
      'Cipolla 4 pezzi',
      'Aglio 1 testa',
      'Sedano 2 coste',
      'Funghi 300g (surgelati ok)',
      'Zucca surgelata 400g',
      // Proteine FRESCHE (compra stesso giorno)
      'Pollo intero 1,5kg (migliore qualità, non confezionato da giorni)',
      'Sgombro 2 filetti 350g',
      'Orata/merluzzo 400g',
      // Latticini (compra settimana — durano)
      'Mozzarella 5 palline (latticini: durano la settimana)',
      'Scamorza/provola pezzo intero (latticini: durano la settimana)',
      'Parmigiano 200g (latticini: durano la settimana)'
    ],
    perGiorno: [
      'Lunedì: Avocado 1 (fresco da mangiare lun), preparane 3 altri domenica come backup',
      'Martedì: Orata/merluzzo 400g FRESCA',
      'Venerdì: Sgombro già prep\'d o leggermente freddo da forno',
      'Uova: compra il martedì/mercoledì se domenica non è freschissimo (durano 3 settimane comunque)'
    ],
    fissa2_3settimane: [
      'Pane integrale (compra fresco, congela le fette se eccesso)',
      'Cereali (riso, farro, pasta) in sacchi grandi',
      'Legumi (lenticchie) in buste',
      'Olio EVO (1 bottiglia dura mesi)',
      'Miele (barattolo dura mesi)',
      'Spezie (curcuma, pepe, cannella)',
      'Noci (sacchetto grande, congela)',
      'Latte (compra al bisogno, 1L dura 2–3 giorni)'
    ]
  },

  // ---------- PROTOCOLLI BIOHACKING PRATICI ----------
  biohacking: {
    lui: [
      { abitudine: 'Acqua 500ml appena sveglio', quando: 'Ore 12:00', perche: 'Reidrata dopo 8h + attiva cortisolo naturale' },
      { abitudine: 'Luce intensa (finestra o lampada)', quando: 'Primi 15 min sveglio', perche: 'Stimola neuroni orexinergici' },
      { abitudine: 'Caffè nero SOLO con Pasto 1 e Pasto 2', quando: '13:00 e max 17:00', perche: 'MAI dopo le 18:00 — non compromettere ulteriormente il sonno' },
      { abitudine: 'Proteine SEMPRE per prime al Pasto 1', quando: '13:00', perche: 'Tirosina → dopamina → veglia e focus' },
      { abitudine: 'Camminata 15 min dopo Pasto 1', quando: '~13:45', perche: 'Riduce sonnolenza post-prandiale, migliora glicemia' },
      { abitudine: 'No carboidrati pesanti da soli la sera', quando: '20:30', perche: 'Picco glucosio → inibisce orexina → attacchi sonno' }
    ],
    lei: [
      { abitudine: 'Risciacquo bicarbonato + acqua tiepida', quando: 'Dopo ogni pasto', perche: 'Protegge gengive, neutralizza acidi' },
      { abitudine: 'Curcuma + pepe nero ogni giorno', quando: 'Pasto 3', perche: 'Riduce infiammazione tiroidea' },
      { abitudine: 'Broccoli/cavolfiore SOLO ben cotti', quando: 'Ven', perche: 'Goitrogeni inattivati dal calore ≥70°' },
      { abitudine: 'No soia, no tofu', quando: 'Sempre', perche: 'Interferisce con assorbimento levotiroxina se assunta' },
      { abitudine: 'Camminata 20 min', quando: 'Dopo Pasto 1', perche: 'Il movimento lieve è il miglior booster metabolico con ipotiroidismo' },
      { abitudine: 'Zinco separato dai latticini', quando: 'Pasto 2 o 3 senza formaggi', perche: 'Calcio e zinco competono per assorbimento' }
    ]
  },

  // ---------- MEAL PREP EDITION (Batch Cooking) ----------
  mealPrep: {
    strategia: 'La chiave è separare: piatti che si preparan bene in anticipo (carni, verdure, riso, legumi) vs componenti freschi/da assemblare al momento (uova, formaggi freschi, frutta, pane).',
    tempoSettimanale: 'Domenica: 3–3,5 ore di batch cooking concentrato · Dal lunedì al sabato: 5–10 min di riassemblaggi + cottura uova fresche · Sabato sera pizza: 30 min (impasto pure lo puoi fare domenica e surgelare)',

    contenitori: [
      { tipo: 'Lunch box piccola (400ml)', capienza: 'Porzioni singole proteina', utilizzo: '4 uova cotte / porzione carne' },
      { tipo: 'Lunch box media (700ml)', capienza: 'Proteina + carboidrato', utilizzo: 'Riso + pollo + olio' },
      { tipo: 'Lunch box grande (1L)', capienza: 'Pasto completo freddo', utilizzo: 'Pasta, insalate miste' },
      { tipo: 'Contenitore vetro rettangolare (2L)', capienza: 'Batch grande', utilizzo: 'Lenticchie/riso/zuppa in comune' },
      { tipo: 'Freezer bag', capienza: 'Proteina congelabile', utilizzo: 'Carni porzioni, sugo, brodo' },
      { tipo: 'Busta carta + etichetta', capienza: '—', utilizzo: 'Nome contenuto + data' }
    ],

    timelineDomenica: [
      {
        orario: '13:00–13:30', titolo: 'Preparazione ingredienti',
        attivita: [
          'Lavare/sbucciare verdure (zucchine, carote, patate, peperoni)',
          'Tagliarle in pezzi uniformi',
          'Mettere in ciotole separate per cottura'
        ]
      },
      {
        orario: '13:30–14:00', titolo: 'Avvio cotture lunghe',
        attivita: [
          'Accendere 2 forni a temperature diverse (180° e 220°)',
          'Accendere pentola grande acqua per riso/lenticchie',
          'Mettere pollo intero + verdure in una teglia → forno 180° per 55 min',
          'Mettere sgombro in teglia → forno (lo finisci dopo)'
        ]
      },
      {
        orario: '14:00–14:30', titolo: 'Cotture parallele',
        attivita: [
          'Mentre il pollo cuoce: cuocere riso + lenticchie rosse (li finisci contemporaneamente)',
          'Saltare spinaci e altri soffritti in padella',
          'Far rosolare verdure al vapore se serve (vanno parzialmente cotte)'
        ]
      },
      {
        orario: '14:30–15:15', titolo: 'Assemblaggio e confezionamento',
        attivita: [
          'Tirar fuori il pollo dal forno, lasciare raffreddare 10 min',
          'Disossare il pollo intero: petto da un lato, cosce dall\'altro, risparmiare la carcassa per brodo',
          'Porzioni uguali di riso + lenticchie in contenitori',
          'Verdure già cotte in contenitori (fredde)',
          'Sugo umido per mercoledì (pomodoro + verdure) in contenitore'
        ]
      },
      {
        orario: '15:15–16:00', titolo: 'Ultimi piatti e brodo',
        attivita: [
          'Preparare il brodo: mettere carcassa pollo + verdure (scarto carota, sedano, cipolla) in pentola, 90 min',
          'Mentre il brodo cuoce: assemblare pizza impasto x2 (congelore diviso 1 per sabato)',
          'Sgombro già cotto → divisione porzioni lui/lei in contenitori'
        ]
      },
      {
        orario: '16:00–16:30', titolo: 'Etichettatura e stoccaggio',
        attivita: [
          'Etichettare TUTTO con data e contenuto',
          'Frigo (3–4 giorni max): riso, lenticchie, verdure cotte, carni grigliate, sughi',
          'Freezer: porzioni di carne in eccesso, brodo, impasto pizza'
        ]
      }
    ],

    batches: [
      {
        n: 1, nome: 'Proteine grigliate',
        dettaglio: '1 pollo intero (~1,5kg) → disossare e dividere: petto (400g) → diviso: 150g lui lun p3 + 150g lei mer p3 · cosce (600g) → 180g lui mer p3 + 150g lei mer p3 · carcassa → BRODO. Sgombro 2 filetti (350g) → 180g lui ven p3 + 140g lei ven p3.',
        conservazione: 'Frigo 3 giorni max. Congelare se avanzi.'
      },
      {
        n: 2, nome: 'Riso basmati',
        dettaglio: 'Riso basmati secco: 360g (cotto ≈ 1kg) → diviso in 5 porzioni uguali. Mercoledì p3: 90g lui + 65g lei (già pesato). Giovedì (se manca): avanzo. Freschezza: cotto domenica sera, usare entro mercoledì sera. Tip anti-spreco: se avanzi riso, usarlo mercoledì p2 "fried rice veloce" (saltare in padella con uova fresche).',
        conservazione: 'Cotto domenica sera, usare entro mercoledì sera.'
      },
      {
        n: 3, nome: 'Lenticchie rosse',
        dettaglio: 'Lenticchie rosse secche: 145g (cotto ≈ 350g). Giovedì p3: 80g lui + 65g lei (già pesato + curcuma/pepe).',
        conservazione: 'Frigo 4 giorni, freezer 1 mese.'
      },
      {
        n: 4, nome: 'Verdure cotte al vapore',
        dettaglio: 'Zucchine (700g) → al vapore 8 min → divise in 6 contenitori · carote (400g) → al vapore 10 min → divise in 5 contenitori · broccoli (350g) → ben cotti al vapore 12 min → 2 contenitori. Ognuno con filo di olio EVO già aggiunto. Uso: accompagnamento a carne tutta la settimana.',
        conservazione: 'Frigo 4 giorni.'
      },
      {
        n: 5, nome: 'Sugo umido pomodoro',
        dettaglio: 'Passata di pomodoro: 300ml · cipolla piccola + sedano + aglio → soffritto · simmerato 20 min. Porzioni: mercoledì p3 (pollo umido): 150ml lui + 150ml lei · giovedì p3 (lenticchie): 80ml lui + 80ml lei.',
        conservazione: 'Frigo 5 giorni, freezer 2 mesi.'
      },
      {
        n: 6, nome: 'Brodo di pollo fatto in casa',
        dettaglio: 'Carcassa pollo + verdure (scarto carota, sedano, cipolla) · bollire 90 min. Risultato: ~1,2L brodo gelificato. Uso: domenica p3 (risotto): 600ml · riserva frigo per altri piatti oppure freezer.',
        conservazione: 'Frigo 5 giorni, freezer 3 mesi.'
      },
      {
        n: 7, nome: 'Spinaci saltati',
        dettaglio: 'Spinaci freschi 500g → salare leggermente, scolare liquido · saltare 2 min in olio EVO + aglio. Divisione: lunedì p1: 2 porzioni (una ciascuno) · giovedì p3 lui: 1 porzione · giovedì p3 lei (vapore): 1 porzione.',
        conservazione: 'Frigo 3 giorni max.'
      },
      {
        n: 8, nome: 'Impasto pizza (congelato)',
        dettaglio: 'Preparare impasto per 2 pizze sabato sera. Ingredienti: farina integrale 160g + tipo 0 80g · lievito ½ bustina + acqua tiepida 120ml · olio EVO 1 cucchiaio + sale. Dividere in 2 palle → mettere in freezer bag separati · congelare dopo 2h lievitazione. Sabato: togliere 4h prima e far risalire temperatura.',
        conservazione: 'Freezer (congelare dopo 2h lievitazione).'
      }
    ],

    conservazione: {
      frigo: [ // FRIGO (0–4°C)
        { item: 'Carni cotte', durata: '3 giorni max', ok: true },
        { item: 'Verdure cotte', durata: '4 giorni', ok: true },
        { item: 'Riso/cereali cotti', durata: '3 giorni', ok: true },
        { item: 'Legumi cotti', durata: '4 giorni', ok: true },
        { item: 'Sugo/umido', durata: '5 giorni', ok: true },
        { item: 'Brodo', durata: '5 giorni', ok: true },
        { item: 'Frittata', durata: '3 giorni max (controlla freschezza)', ok: false }
      ],
      freezer: [ // FREEZER (−18°C)
        { item: 'Carni crude/cotte', durata: '3 mesi', ok: true },
        { item: 'Brodo', durata: '3 mesi', ok: true },
        { item: 'Impasto pizza', durata: '2 mesi', ok: true },
        { item: 'Verdure cotte (se necessario avanzo)', durata: '3 mesi', ok: true },
        { item: 'Legumi cotti ⚠️', durata: '1 mese (perde texture)', ok: true },
        { item: 'Frutta fresca', durata: 'NO (diventa poltiglia)', ok: false },
        { item: 'Verdure crude', durata: 'NO (perde croccantezza)', ok: false }
      ],
      fresco: [ // FRUTTA/VERDURA FRESCA (non prep — consumo giornaliero)
        { item: 'Banane', durata: 'Maturano progressivamente, niente frigo', ok: true },
        { item: 'Pesche/pere', durata: 'In frigo 5–7 giorni', ok: true },
        { item: 'Melone', durata: 'Intero 2 settimane, tagliato 3 giorni in frigo', ok: true },
        { item: 'Avocado', durata: 'Matura a temperatura ambiente, frigo last 2–3 giorni da maturo', ok: true },
        { item: 'Limoni', durata: 'Frigo 3–4 settimane', ok: true }
      ]
    },

    hacks: [
      { titolo: 'Double batch involontario', testo: 'Quando cuoci il pollo per lunedì/mercoledì, puoi cuocerne il 30% in più → congelato per emergenze/appetito extra' },
      { titolo: 'Riso fried rice rescue', testo: 'Se avanzi riso dal mercoledì, giovedì p2 → saltalo in padella con 2 uova fresche + curcuma e pepe nero o un goccio di brodo (5 min) = pasto ad hoc salvavita. ⚠️ Niente salsa di soia: la soia è vietata per lei (interferisce con la levotiroxina)' },
      { titolo: 'Congelamento strategico di pane', testo: 'Compra pane intero, congela le fette subito → escono dal freezer già parzialmente scongelate e perfette per tostare senza bruciare' },
      { titolo: 'Brodo di scarto', testo: 'Non buttare mai: carota, sedano, cipolla avanzati → sacchetto freezer "scarti brodo" → domenica aggiungi carcassa pollo e fai brodo gratis' },
      { titolo: 'Pesce surgelato = batch cook', testo: 'Sgombro e orata SURGELATI di qualità costano meno e non vanno a male se non li cuoci. Tira fuori dal freezer martedì sera, cuoce fresco mercoledì' },
      { titolo: 'Giorno "pulisci frigo"', testo: 'Giovedì p2 o p3 = "pulisci frigo" con gli avanzi prep\'d. Se ci sono resti, li mescoli (es. zucchine + carote + formaggio = mini insalatona)' },
      { titolo: 'Etichette intelligenti', testo: 'Usa etichette adesive colorate: 🔵 blu = contenitore LUI · 🔴 rosso = contenitore LEI · 🟡 giallo = in comune. Zero confusione, velocissimo riconoscimento.' }
    ],

    checklist: {
      primaDiPartire: [
        'Acquistare contenitori vetro (8–10 pezzi graduati con coperchio)',
        'Freezer bag (pacchetto 50 pezzi)',
        'Etichette adesive colorate + pennarello',
        'Coltello chef buono + tagliere grande',
        'Timer cucina (per non bruciare nulla)'
      ],
      domenicaMattina: [
        'Fare 2 frittate piccole (lui + lei) → frigo',
        'Preparare impasto pizza × 2 → freezer dopo lievitazione 2h'
      ],
      domenicaPomeriggio: [
        'Pulire/preparare tutte le verdure',
        'Accendere forni + pentole',
        'Cuocere pollo intero',
        'Disossare e dividere porzioni',
        'Cuocere riso + lenticchie',
        'Fare verdure al vapore',
        'Preparare sugo umido',
        'Fare brodo carcassa',
        'Etichettare TUTTO con data'
      ],
      lunSab: [
        'Estrai pasti dal frigo + eventuale microonde',
        'Cuoci proteine fresche quando indicato (martedì orata, venerdì sgombro, giovedì/sabato uova)',
        'Ricicla avanzi creando "pulisci frigo" giovedì'
      ]
    },

    risparmio: {
      settimanale: '€30–45',
      annuale: '€1.560–2.340',
      // Tabella risparmio economico settimanale con meal prep
      confrontoSettimanale: [
        { voce: 'Sprechi alimentari', senza: '~15% degli acquisti', con: '~2% degli acquisti', risparmio: '€15–20/settimana' },
        { voce: 'Pesce/carne da fresco', senza: 'Tutti i giorni', con: 'Comprati in bulk', risparmio: '€10–15/settimana' },
        { voce: 'Verdure', senza: 'Piccoli acquisti ripetuti', con: '1 acquisto grande', risparmio: '€3–5/settimana' },
        { voce: 'Oli/condimenti', senza: 'Usato male', con: 'Dosato precisamente', risparmio: '€2–4/settimana' },
        { voce: 'TOTALE', senza: '—', con: '—', risparmio: '€30–45/settimana ✅' }
      ],
      // Confronto tempo/costi risparmiati mensile
      confrontoMensile: [
        { metrica: 'Ore cucina/mese', senza: '28h', con: '26,4h', risparmio: '1,6h' },
        { metrica: 'Stress decisione cosa mangiare', senza: 'Alto', con: 'Quasi zero', risparmio: 'Priceless ✅' },
        { metrica: 'Sprechi alimentari', senza: '€60–80', con: '€8–16', risparmio: '€52–64/mese' },
        { metrica: 'Tempo "cosa preparo adesso?"', senza: '15 min × 21 pasti = 5,25h', con: '0', risparmio: '5h risparmiata' },
        { metrica: 'Rispetto piano alimentare', senza: '60% (deviazioni)', con: '95% (pronto, non scappi)', risparmio: 'Risultati 3× migliori' }
      ]
    },

    tempoGiorni: [
      { giorno: 'Lunedì', minuti: 26, tipo: 'Veloce' },
      { giorno: 'Martedì', minuti: 40, tipo: 'Medio' },
      { giorno: 'Mercoledì', minuti: 12, tipo: 'Velocissimo' },
      { giorno: 'Giovedì', minuti: 19, tipo: 'Veloce' },
      { giorno: 'Venerdì', minuti: 42, tipo: 'Medio' },
      { giorno: 'Sabato', minuti: 76, tipo: 'Lungo ma sparso' },
      { giorno: 'Domenica', minuti: 180, tipo: 'Batch cooking concentrato' },
      { giorno: 'TOTALE/SETTIMANA', minuti: 395, tipo: '6h 35 min (comprese le 3h concentrate di prep)' }
    ],
    tempoNota: '💡 Senza meal prep: ~1 ora al giorno × 7 giorni = 7 ore. Con meal prep: 6h35. Vantaggio: meno stress durante la settimana, pasti sempre pronti, zero improvvisazione.',

    percheFunziona: [
      'Lui narcolettico: pasti sempre pronti = non salta (salti ≠ crollano dopamina)',
      'Lei ipotiroidea: porzioni calibrate = niente eccessi, dieta precisa = tiroide stabile',
      'Coppia sedentaria: menu già stabilito = zero tentazioni dolciumi/fast food',
      'Tempo: 3h domenica vs 1h ogni giorno = meno fatica distribuita, più disciplina concentrata',
      'Costi: −€40/settimana = −€2.080/anno = vacanza pagata ✅'
    ]
  },

  // ---------- ETICHETTE COLORATE CONTENITORI ----------
  etichette: [
    { colore: '🔵', significato: 'contenitore LUI' },
    { colore: '🔴', significato: 'contenitore LEI' },
    { colore: '🟡', significato: 'in comune' }
  ],

  // ---------- DISCLAIMER CLINICO ----------
  disclaimer: '⚠️ Piano indicativo ad alto contenuto clinico. Non sostituisce endocrinologo, neurologo, parodontologo e nutrizionista clinico. Rivalutare ogni 4–6 settimane in base a esami del sangue (TSH, fT3, fT4, glicemia, lipidi).'
};

window.DIET_DATA = DIET_DATA;
