// Memory de la Nou: classic pairs. In most decks the two cards of a pair show the same
// thing in two ways (7 + 5 ↔ 12, a clock ↔ its time…), so she has to work it out.
// No hearts (Memory exception of the Mellis rule): stars come from memory slips.
(function () {
  const M = window.Mellis;
  const { pick, shuffle } = M;
  const $ = (id) => document.getElementById(id);
  const L = (ca, es, en) => ({ ca, es, en });
  const PANTRY_KEY = 'mellis.memory.pantry';   // { 'deck-i': 1 | 2 (golden) }, 8 decks × 5 jars
  const OPTS_KEY = 'mellis.memory.opts';       // { size: 6 | 8 | 10, players: 1 | 2 }
  const JARS = 5;
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  // ---------- Telling the time (o'clock and the quarters, as in Rellotgeria Tic-Tac) ----------
  const HOURS = {
    ca: ['dotze', 'una', 'dues', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou', 'deu', 'onze', 'dotze'],
    es: ['doce', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'],
    en: ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
  };
  const caArt = (h) => (h === 1 ? 'la una' : 'les ' + HOURS.ca[h]);
  const caDe = (h) => (h === 1 || h === 11 ? "d'" : 'de ') + HOURS.ca[h];
  const esArt = (h) => (h === 1 ? 'la una' : 'las ' + HOURS.es[h]);
  const TIME = {
    ca: [(h) => `${caArt(h)} en punt`, (h, n) => `un quart ${caDe(n)}`, (h, n) => `dos quarts ${caDe(n)}`, (h, n) => `tres quarts ${caDe(n)}`],
    es: [(h) => `${esArt(h)} en punto`, (h) => `${esArt(h)} y cuarto`, (h) => `${esArt(h)} y media`, (h, n) => `${esArt(n)} menos cuarto`],
    en: [(h) => `${HOURS.en[h]} o'clock`, (h) => `quarter past ${HOURS.en[h]}`, (h) => `half past ${HOURS.en[h]}`, (h, n) => `quarter to ${HOURS.en[n]}`],
  };
  const timeWords = (h, m) => TIME[M.lang][m / 15](h, h % 12 + 1);
  function clockSVG(h, m) {
    const hand = (deg, len, w) => {
      const r = deg * Math.PI / 180;
      return `<line x1="50" y1="50" x2="${(50 + Math.sin(r) * len).toFixed(1)}" y2="${(50 - Math.cos(r) * len).toFixed(1)}" stroke="#3a3a5c" stroke-width="${w}" stroke-linecap="round"/>`;
    };
    const ticks = Array.from({ length: 12 }, (_, i) => `<line x1="50" y1="8" x2="50" y2="${i % 3 ? 12 : 15}" stroke="#3a3a5c" stroke-width="${i % 3 ? 2 : 3.5}" transform="rotate(${i * 30} 50 50)"/>`).join('');
    const nums = [[12, 50, 29], [3, 79, 55.5], [6, 50, 83], [9, 21, 55.5]].map(([n, x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="15" font-weight="700" fill="#9b5de5">${n}</text>`).join('');
    return `<svg class="clock" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#3a3a5c" stroke-width="5"/>${ticks}${nums}` +
      hand((h % 12 + m / 60) * 30, 22, 6) + hand(m * 6, 34, 4) + '<circle cx="50" cy="50" r="4.5" fill="#ff6fb5" stroke="#3a3a5c" stroke-width="2"/></svg>';
  }

  // ---------- Money (as in La botiga de la Guardiola; amounts in cents) ----------
  const MONEY = {
    10: ['c10', '10c'], 20: ['c20', '20c'], 50: ['c50', '50c'], 100: ['e1', '1€'], 200: ['e2', '2€'],
    500: ['note n5', '5€'], 1000: ['note n10', '10€'], 2000: ['note n20', '20€'],
  };
  const AMOUNTS = [30, 60, 70, 80, 120, 150, 170, 250, 300, 400, 600, 700, 900, 1200, 1500, 2500, 3500];
  function coinsOf(cents) {
    const out = [];
    [2000, 1000, 500, 200, 100, 50, 20, 10].forEach((v) => { while (cents >= v) { out.push(v); cents -= v; } });
    return out;
  }
  function priceText(cents) {
    const e = Math.floor(cents / 100), c = cents % 100;
    if (!e) return `${c} c`;
    if (!c) return `${e} €`;
    const cc = String(c).padStart(2, '0');
    return M.lang === 'en' ? `€${e}.${cc}` : `${e},${cc} €`;
  }

  // ---------- Decks ----------
  // make(n, used) → n pairs [faceA, faceB]. `used`: bare numbers already on the board, so
  // two cards never show the same number (matters in the mix deck).
  const CLASSIC = ['🦊', '🦉', '🐿️', '🦔', '🐞', '🦋', '🐌', '🐸', '🐝', '🦆', '🍄', '🌻', '🌈', '⭐', '🌙', '🎈', '🚲', '🪁', '🎨', '⚽', '🧸', '🪀', '🎺', '🚀'];
  const ENGLISH = [
    ['🍎', 'apple'], ['🐶', 'dog'], ['🐱', 'cat'], ['📖', 'book'], ['✏️', 'pencil'], ['🎒', 'schoolbag'], ['☀️', 'sun'], ['🌧️', 'rain'],
    ['❄️', 'snow'], ['🥛', 'milk'], ['🍞', 'bread'], ['🧀', 'cheese'], ['🐟', 'fish'], ['🐦', 'bird'], ['🌳', 'tree'], ['🌼', 'flower'],
    ['👟', 'shoes'], ['🧦', 'socks'], ['🧢', 'cap'], ['👗', 'dress'], ['🏠', 'house'], ['🪑', 'chair'], ['🥚', 'egg'], ['🍌', 'banana'],
  ];
  const FRIENDS = [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5], [10, 90], [20, 80], [30, 70], [40, 60], [50, 50]];
  const num = (v) => ({ t: 'num', v: String(v) });
  const take = (list, n) => shuffle(list.slice()).slice(0, n);

  const DECKS = [
    {
      id: 'classic', icon: '🌰', color: '#c8733a', name: L('Clàssic', 'Clásico', 'Classic'),
      task: L('Troba els dibuixos iguals!', '¡Encuentra los dibujos iguales!', 'Find the two pictures that are the same!'),
      foods: ['🌰', '🥜', '🍄', '🫐', '🍯'],
      make: (n) => take(CLASSIC, n).map((e) => [{ t: 'pic', v: e }, { t: 'pic', v: e }]),
    },
    {
      id: 'sums', icon: '➕', color: '#ff9f1c', name: L('Sumes i restes', 'Sumas y restas', 'Sums'),
      task: L('Uneix cada operació amb el resultat!', '¡Une cada operación con su resultado!', 'Match each sum with its answer!'),
      foods: ['🍎', '🍐', '🍊', '🍋', '🍇'],
      make: (n, used) => take(range(5, 20).filter((r) => !used.has(r)), n).map((r) => {
        used.add(r);
        if (r <= 14 && Math.random() < 0.4) { const b = rand(2, Math.min(9, 20 - r)); return [num(`${r + b} − ${b}`), num(r)]; }
        const a = rand(2, r - 2);
        return [num(`${a} + ${r - a}`), num(r)];
      }),
    },
    {
      id: 'friends', icon: '🔟', color: '#2ec4b6', name: L('Amics del 10', 'Amigos del 10', 'Friends of 10'),
      task: L('Troba les parelles que fan 10 o 100!', '¡Encuentra las parejas que suman 10 o 100!', 'Find the pairs that make 10 or 100!'),
      foods: ['🍓', '🍒', '🍑', '🥝', '🍌'],
      make: (n, used) => take(FRIENDS.filter(([a, b]) => !used.has(a) && !used.has(b)), n).map(([a, b]) => {
        used.add(a); used.add(b);
        return [num(a), num(b)];
      }),
    },
    {
      id: 'doubles', icon: '🪞', color: '#9b5de5', name: L('Dobles', 'Dobles', 'Doubles'),
      task: L('Uneix cada número amb el seu doble!', '¡Une cada número con su doble!', 'Match each number with its double!'),
      foods: ['🥕', '🌽', '🥦', '🎃', '🫛'],
      make: (n, used) => take([2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 50].filter((v) => !used.has(v * 2)), n).map((v) => {
        used.add(v * 2);
        return [{ t: 'double', v }, num(v * 2)];
      }),
    },
    {
      id: 'clock', icon: '🕰️', color: '#3a86ff', name: L('Rellotges', 'Relojes', 'Clocks'),
      task: L('Uneix cada rellotge amb la seva hora!', '¡Une cada reloj con su hora!', 'Match each clock with its time!'),
      foods: ['🧀', '🥖', '🥐', '🥨', '🧇'],
      make: (n) => take(range(0, 47), n).map((k) => {
        const h = Math.floor(k / 4) + 1, m = (k % 4) * 15;
        return [{ t: 'clock', h, m }, { t: 'time', h, m }];
      }),
    },
    {
      id: 'money', icon: '💶', color: '#3fb36b', name: L('Diners', 'Dinero', 'Money'),
      task: L('Uneix les monedes amb el preu!', '¡Une las monedas con el precio!', 'Match the coins with the price!'),
      foods: ['🍪', '🍩', '🧁', '🍫', '🍬'],
      make: (n) => take(AMOUNTS, n).map((c) => [{ t: 'coins', c }, { t: 'price', c }]),
    },
    {
      id: 'english', icon: '🇬🇧', color: '#e5383b', name: L('English', 'English', 'English'),
      task: L('Uneix el dibuix amb la paraula en anglès!', '¡Une el dibujo con la palabra en inglés!', 'Match the picture with its word!'),
      foods: ['🥞', '🍰', '🥧', '🍮', '🍭'],
      make: (n) => take(ENGLISH, n).map(([e, w]) => [{ t: 'pic', v: e }, { t: 'word', v: w }]),
    },
    {
      id: 'mix', icon: '🎲', color: '#ff6fb5', name: L('Barreja', 'Mezcla', 'Mix'),
      task: L('Hi ha de tot! Mira el senyal de cada carta.', '¡Hay de todo! Mira la señal de cada carta.', 'A bit of everything! Look at the sign on each card.'),
      foods: ['🍉', '🍍', '🥥', '🥭', '🍈'],
      // one pair from each of the other decks, then a second from some of them
      make: (n, used) => {
        const order = shuffle(DECKS.filter((d) => d.id !== 'mix'));
        const count = order.map((_, i) => Math.floor(n / order.length) + (i < n % order.length ? 1 : 0));
        return order.flatMap((d, i) => d.make(count[i], used).map((p) => p.map((f) => ({ ...f, badge: d.icon }))));
      },
    },
  ];
  function range(a, b) { return Array.from({ length: b - a + 1 }, (_, i) => a + i); }
  const deckOf = (id) => DECKS.find((d) => d.id === id);

  const TEXT = {
    title: L('Memory de la Nou', 'Memory de Nou', "Nou's Memory"),
    ask: L('Tria un joc!', '¡Elige un juego!', 'Pick a game!'),
    pairs: L('parelles', 'parejas', 'pairs'),
    double: L('el doble de', 'el doble de', 'double'),
    win: L('Totes les parelles trobades!', '¡Todas las parejas encontradas!', 'All the pairs found!'),
    pantry: L('El rebost de la Nou', 'La despensa de Nou', "Nou's pantry"),
    prize: L('Menjar nou per al rebost!', '¡Comida nueva para la despensa!', 'New food for the pantry!'),
    prizeGold: L('Un pot daurat per al rebost!', '¡Un bote dorado para la despensa!', 'A golden jar for the pantry!'),
    prizeFull: L('Aquest prestatge ja és ple! Amb ⭐⭐⭐ els pots es tornen daurats.', '¡Este estante ya está lleno! Con ⭐⭐⭐ los botes se vuelven dorados.', 'This shelf is full! ⭐⭐⭐ turns the jars golden.'),
    prizeAllGold: L('Tot el prestatge és daurat!', '¡Todo el estante es dorado!', 'The whole shelf is golden!'),
  };
  // Nou the forgetful squirrel: never says where a card is (no hints)
  const NOU = {
    match: [
      L('Ara me’n recordo!', '¡Ahora me acuerdo!', 'Now I remember!'), L('Cap al rebost!', '¡A la despensa!', 'Off to the pantry!'),
      L('Quina memòria!', '¡Qué memoria!', 'What a memory!'), L('Nyam, nyam!', '¡Ñam, ñam!', 'Yum, yum!'),
    ],
    miss: [
      L('Hmm… aquí no era.', 'Hmm… aquí no era.', 'Hmm… not here.'), L('Ui, m’he despistat!', '¡Uy, me he despistado!', 'Oops, I forgot!'),
      L('On era, on era…?', '¿Dónde era, dónde era…?', 'Where was it…?'),
    ],
    win: L('Gràcies! Ara tinc el rebost ple per a tot l’hivern!', '¡Gracias! ¡Ahora tengo la despensa llena para todo el invierno!', 'Thank you! Now my pantry is full for the whole winter!'),
  };

  const NOU_SVG = `<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g class="tail"><path d="M70 96 C104 98 120 70 108 44 C98 22 72 22 70 42 C68 56 88 54 90 66 C92 80 76 84 70 96 Z" fill="#c8733a" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
      <path d="M96 40 C104 50 104 64 96 72" fill="none" stroke="#e9a46a" stroke-width="5" stroke-linecap="round"/></g>
    <ellipse cx="52" cy="80" rx="22" ry="24" fill="#d9864a" stroke="#3a3a5c" stroke-width="3"/>
    <ellipse cx="52" cy="86" rx="12" ry="15" fill="#fbe3c8"/>
    <path d="M32 32 l-4 -16 l12 9 z M64 30 l6 -15 l4 15 z" fill="#d9864a" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="50" cy="44" r="22" fill="#d9864a" stroke="#3a3a5c" stroke-width="3"/>
    <ellipse cx="50" cy="52" rx="12" ry="9" fill="#fbe3c8"/>
    <g class="eyes"><circle cx="42" cy="42" r="4.5" fill="#3a3a5c"/><circle cx="58" cy="42" r="4.5" fill="#3a3a5c"/>
      <circle cx="43.5" cy="40.5" r="1.6" fill="#fff"/><circle cx="59.5" cy="40.5" r="1.6" fill="#fff"/></g>
    <ellipse cx="50" cy="50" rx="3.5" ry="2.5" fill="#3a3a5c"/>
    <path d="M45 55 q5 4 10 0" fill="none" stroke="#3a3a5c" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="47" y="56" width="6" height="5" rx="1" fill="#fff" stroke="#3a3a5c" stroke-width="1.5"/>
    <circle cx="36" cy="51" r="4" fill="#ff9ec7" opacity=".7"/><circle cx="64" cy="51" r="4" fill="#ff9ec7" opacity=".7"/>
    <g class="acorn"><ellipse cx="52" cy="78" rx="8" ry="10" fill="#b5651d" stroke="#3a3a5c" stroke-width="2.5"/>
      <path d="M43 72 q9 -9 18 0 z" fill="#6b3f2a" stroke="#3a3a5c" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M52 63 v-4" stroke="#3a3a5c" stroke-width="2.5" stroke-linecap="round"/></g>
    <path d="M38 74 q6 6 14 4 M66 74 q-6 6 -14 4" fill="none" stroke="#3a3a5c" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
  function nouSay(line, speak) {
    const el = $('nou-say');
    el.textContent = M.t(line);
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    if (speak) M.speak(M.t(line), M.lang);
  }
  // the shared host dances on a match by itself; a miss has no shared trigger outside Mellis.round
  function nouOops() {
    const el = $('nou');
    el.classList.remove('m-oops'); void el.offsetWidth; el.classList.add('m-oops');
    setTimeout(() => el.classList.remove('m-oops'), 700);
  }

  // ---------- Pantry ----------
  const pantry = () => M.store.get(PANTRY_KEY, {});
  // One jar per game, from the deck's shelf: a missing food first; on ⭐⭐⭐ it is golden,
  // and when nothing is missing ⭐⭐⭐ turns one jar golden. → { key, text }
  function award(deck, gold) {
    const p = pantry();
    const slots = deck.foods.map((_, i) => `${deck.id}-${i}`);
    const missing = slots.filter((k) => !p[k]);
    const notGold = slots.filter((k) => p[k] !== 2);
    if (missing.length || (gold && notGold.length)) {
      const key = pick(missing.length ? missing : notGold);
      p[key] = gold ? 2 : 1;
      M.store.set(PANTRY_KEY, p);
      return { key, text: gold ? TEXT.prizeGold : TEXT.prize };
    }
    return { key: null, text: notGold.length ? TEXT.prizeFull : TEXT.prizeAllGold };
  }
  const jarHTML = (deck, i, v, cls) => (v
    ? `<button class="jar${v === 2 ? ' gold' : ''} ${cls || ''}">${deck.foods[i]}</button>`
    : `<span class="jar empty ${cls || ''}"></span>`);
  function openPantry() {
    const p = pantry();
    $('pantry-count').textContent = `${Object.keys(p).length} / ${DECKS.length * JARS}`;
    $('shelves').innerHTML = DECKS.map((d) => `
      <div class="shelf" style="--c:${d.color}">
        <span class="shelf-icon">${d.icon}</span>
        ${d.foods.map((_, i) => jarHTML(d, i, p[`${d.id}-${i}`])).join('')}
      </div>`).join('');
    $('pantry').hidden = false;
  }
  $('shelves').addEventListener('click', (e) => {
    const b = e.target.closest('button.jar');
    if (!b) return;
    b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle');
    M.sounds.pop();
  });
  $('pantry-btn').addEventListener('click', () => { M.sounds.pop(); openPantry(); });
  $('pantry-close').addEventListener('click', () => { M.sounds.pop(); $('pantry').hidden = true; });

  // ---------- Picker ----------
  const opts = Object.assign({ size: 6, players: 1 }, M.store.get(OPTS_KEY, {}));
  if (![6, 8, 10].includes(opts.size)) opts.size = 6;
  if (opts.players !== 2) opts.players = 1;
  function renderOpts() {
    document.querySelectorAll('#size-seg button').forEach((b) => b.classList.toggle('on', +b.dataset.size === opts.size));
    document.querySelectorAll('#players-seg button').forEach((b) => b.classList.toggle('on', +b.dataset.players === opts.players));
  }
  function setOpt(name, value) {
    opts[name] = value;
    M.store.set(OPTS_KEY, opts);
    M.sounds.pop();
    renderOpts();
  }
  $('size-seg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setOpt('size', +b.dataset.size); });
  $('players-seg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setOpt('players', +b.dataset.players); });
  function renderDecks() {
    const p = pantry();
    $('decks').innerHTML = DECKS.map((d) => {
      const jars = d.foods.map((_, i) => p[`${d.id}-${i}`] || 0);
      const have = jars.filter(Boolean).length;
      return `<button class="deck" data-deck="${d.id}" style="background:${d.color}">
        <span class="deck-icon">${d.icon}</span>
        <span class="deck-name">${M.t(d.name)}</span>
        <span class="deck-jars${jars.every((v) => v === 2) ? ' gold' : ''}">🫙 ${have}/${JARS}</span>
      </button>`;
    }).join('');
  }
  $('decks').addEventListener('click', (e) => {
    const b = e.target.closest('.deck');
    if (b) { M.sounds.pop(); start(b.dataset.deck); }
  });

  // ---------- Game state ----------
  let deck = DECKS[0];
  let cards = [];        // { pairId, face }
  let open = [];         // indexes of face-up, unmatched cards (max 2)
  let seen = new Set();  // indexes she has already looked at
  let locked = false;
  let found = 0;
  let slips = 0;         // mismatches she could have avoided (a card she had already seen)
  let turn = 0;          // 2 players: whose turn it is (0 | 1)

  function start(id) {
    deck = deckOf(id);
    cards = [];
    deck.make(opts.size, new Set()).forEach((pair, pairId) => pair.forEach((face) => cards.push({ pairId, face })));
    shuffle(cards);
    open = []; seen = new Set(); locked = false; found = 0; slips = 0; turn = 0;
    $('levels').hidden = true;
    $('win').hidden = true;
    $('play').hidden = false;
    renderStatus();
    nouSay(deck.task, true);
    $('board').innerHTML = cards.map((c, i) => `
      <button class="card" data-i="${i}" aria-label="card">
        <span class="card-inner">
          <span class="face back"><span class="acorn-back">🌰</span></span>
          <span class="face front">${faceHTML(c.face)}</span>
        </span>
      </button>`).join('');
    layout();
  }
  function renderStatus() {
    $('acorns').textContent = `🌰 ${found}/${cards.length / 2}`;
    const t = $('turn');
    t.hidden = opts.players !== 2;
    t.textContent = turn + 1;
    t.className = 'turn p' + (turn + 1);
    $('board').className = 'board' + (opts.players === 2 ? ' p' + (turn + 1) : '');
  }

  // font size for one line of `len` characters that must fit the card
  const fit = (len, max) => `--f:min(calc(var(--cw) * ${max}), calc(var(--cw) * 1.45 / ${Math.max(len, 1)}))`;
  function faceHTML(f) {
    const badge = f.badge ? `<span class="badge">${f.badge}</span>` : '';
    if (f.t === 'pic') return badge + `<span class="pic">${f.v}</span>`;
    if (f.t === 'num') return badge + `<span class="txt" style="${fit(f.v.length, 0.46)}">${f.v}</span>`;
    if (f.t === 'word') return badge + `<span class="txt" style="${fit(f.v.length, 0.3)}">${f.v}</span>`;
    if (f.t === 'double') return badge + `<span class="small">${M.t(TEXT.double)}</span><span class="txt" style="${fit(String(f.v).length, 0.42)}">${f.v}</span>`;
    if (f.t === 'clock') return badge + clockSVG(f.h, f.m);
    if (f.t === 'time') return badge + `<span class="phrase">${timeWords(f.h, f.m)}</span>`;
    if (f.t === 'price') { const s = priceText(f.c); return badge + `<span class="txt" style="${fit(s.length, 0.34)}">${s}</span>`; }
    const coins = coinsOf(f.c);
    return badge + `<span class="coins">${coins.map((v) => `<i class="coin ${MONEY[v][0]}">${MONEY[v][1]}</i>`).join('')}</span>`;
  }

  // Pick the column count that gives the biggest cards for this screen.
  function layout() {
    const n = cards.length;
    if (!n || $('play').hidden) return;
    const gap = n > 12 ? 6 : 10;
    const top = $('board').getBoundingClientRect().top + scrollY;
    const W = Math.min(innerWidth - 24, 900);
    const H = innerHeight - top - 12;
    const ratio = n > 16 ? 1.05 : 1.2; // height / width
    let best = { cw: 0, cols: 4 };
    for (let cols = 2; cols <= n; cols++) {
      if (n % cols) continue; // only full rows
      const rows = n / cols;
      const cw = Math.min((W - gap * (cols - 1)) / cols, ((H - gap * (rows - 1)) / rows) / ratio);
      if (cw > best.cw) best = { cw, cols };
    }
    const cw = Math.floor(Math.min(best.cw, 170));
    const board = $('board');
    board.style.gridTemplateColumns = `repeat(${best.cols}, ${cw}px)`;
    board.style.setProperty('--cw', cw + 'px');
    board.style.setProperty('--ch', Math.floor(cw * ratio) + 'px');
    board.style.setProperty('--gap', gap + 'px');
  }
  addEventListener('resize', layout);

  // ---------- Playing ----------
  $('board').addEventListener('click', (e) => {
    const el = e.target.closest('.card');
    if (!el || locked || el.classList.contains('open')) return;
    const i = +el.dataset.i;
    el.classList.add('open');
    M.sounds.flip();
    if (cards[i].face.t === 'word') M.speak(cards[i].face.v, 'en');   // English words are always read in English
    open.push(i);
    if (open.length < 2) return;

    locked = true;
    const [a, b] = open;
    const els = open.map((k) => $('board').children[k]);
    if (cards[a].pairId === cards[b].pairId) {
      setTimeout(() => {
        els.forEach((x) => x.classList.add('matched'));
        M.sounds.match();
        nouSay(pick(NOU.match));
        M.fly(els[1], $('acorns'), { html: '🌰', size: 30, scale: 0.7 });
        open = [];
        locked = false;
        found++;
        renderStatus();
        if (found === cards.length / 2) setTimeout(win, 900);
      }, 350);
    } else {
      // A slip only when she could have known: she had seen the 2nd card, or the 1st card's partner.
      const partner = cards.findIndex((c, k) => k !== a && c.pairId === cards[a].pairId);
      if (seen.has(b) || seen.has(partner)) slips++;
      seen.add(a); seen.add(b);
      setTimeout(() => {
        els.forEach((x) => x.classList.add('shake'));
        M.sounds.miss();
        nouSay(pick(NOU.miss));
        nouOops();
      }, 500);
      setTimeout(() => {
        els.forEach((x) => x.classList.remove('open', 'shake'));
        open = [];
        locked = false;
        if (opts.players === 2) { turn = 1 - turn; renderStatus(); }
      }, 1400);
    }
  });

  function stars() {
    const pairs = cards.length / 2;
    return slips <= pairs / 2 ? 3 : slips <= pairs ? 2 : 1;
  }
  function win() {
    const n = stars();
    $('win-stars').innerHTML = M.starsHTML(n);
    const got = award(deck, n === 3);
    const i = got.key ? +got.key.split('-')[1] : -1;
    $('prize').innerHTML = `<p>${M.t(got.text)}</p>` + (got.key ? `<div class="prize-jar">${jarHTML(deck, i, pantry()[got.key], 'big')}</div>` : '');
    $('win').hidden = false;
    M.sounds.win();
    M.confetti(['🌰', deck.icon, ...(got.key ? [deck.foods[i]] : [])]);
    M.speak(M.t(NOU.win), M.lang);
  }

  function showPicker() {
    $('play').hidden = true;
    $('win').hidden = true;
    $('levels').hidden = false;
    renderDecks();
  }
  $('again').addEventListener('click', () => { M.sounds.pop(); start(deck.id); });
  $('other').addEventListener('click', () => { M.sounds.pop(); showPicker(); });
  $('back').addEventListener('click', () => { M.sounds.pop(); showPicker(); });

  // ---------- Text & language ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    $('ask').textContent = M.t(TEXT.ask);
    $('pairs-label').textContent = M.t(TEXT.pairs);
    $('win-text').textContent = M.t(TEXT.win);
    $('pantry-title').textContent = M.t(TEXT.pantry);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    renderDecks();
    // cards on the table: times, prices and "double" follow the language
    cards.forEach((c, i) => { const el = $('board').children[i]; if (el) el.querySelector('.front').innerHTML = faceHTML(c.face); });
    if (!$('play').hidden) $('nou-say').textContent = M.t(deck.task);
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  ['nou-levels', 'nou', 'nou-win'].forEach((id) => { $(id).innerHTML = NOU_SVG; });
  M.music.button($('music-levels'));
  M.music.play('autumn');
  renderOpts();
  renderText();

  // test hook
  window.__memory = () => ({ cards, found, slips, deck: deck.id, opts, turn, stars: stars() });
})();
