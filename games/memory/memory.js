(function () {
  const M = window.Mellis;
  const ALBUM_KEY = 'mellis.memory.calendar';   // { 'month-sticker': 1 | 2 (golden) }

  // Each item becomes one pair: a picture card ↔ a word card in a random language.
  // season: the scene (background + music) switches to it when the pair is found.
  const SEASONS = [
    { pic: '❄️', ca: 'hivern', es: 'invierno', en: 'winter', season: 'winter' },
    { pic: '🌸', ca: 'primavera', es: 'primavera', en: 'spring', season: 'spring' },
    { pic: '☀️', ca: 'estiu', es: 'verano', en: 'summer', season: 'summer' },
    { pic: '🍂', ca: 'tardor', es: 'otoño', en: 'autumn', season: 'autumn' },
  ];
  const MONTH_SEASON = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
  const MONTHS = [
    { pic: '👑', ca: 'gener', es: 'enero', en: 'January' },          // Reis
    { pic: '🎭', ca: 'febrer', es: 'febrero', en: 'February' },      // Carnaval
    { pic: '🌱', ca: 'març', es: 'marzo', en: 'March' },
    { pic: '🌹', ca: 'abril', es: 'abril', en: 'April' },            // Sant Jordi
    { pic: '🌼', ca: 'maig', es: 'mayo', en: 'May' },
    { pic: '🔥', ca: 'juny', es: 'junio', en: 'June' },              // Sant Joan
    { pic: '🏖️', ca: 'juliol', es: 'julio', en: 'July' },
    { pic: '🍉', ca: 'agost', es: 'agosto', en: 'August' },
    { pic: '🎒', ca: 'setembre', es: 'septiembre', en: 'September' }, // back to school
    { pic: '🎃', ca: 'octubre', es: 'octubre', en: 'October' },
    { pic: '🌰', ca: 'novembre', es: 'noviembre', en: 'November' },   // Castanyada
    { pic: '🎄', ca: 'desembre', es: 'diciembre', en: 'December' },
  ].map((m, i) => ({ ...m, num: i + 1, month: i, season: MONTH_SEASON[i] }));
  // Days: the old names come from the sky (dilluns = Lluna, dimarts = Mart…)
  const DAYS = [
    { pic: '🌙', ca: 'dilluns', es: 'lunes', en: 'Monday' },
    { pic: '🔴', ca: 'dimarts', es: 'martes', en: 'Tuesday' },
    { pic: '🪽', ca: 'dimecres', es: 'miércoles', en: 'Wednesday' },
    { pic: '⚡', ca: 'dijous', es: 'jueves', en: 'Thursday' },
    { pic: '💖', ca: 'divendres', es: 'viernes', en: 'Friday' },
    { pic: '🛝', ca: 'dissabte', es: 'sábado', en: 'Saturday' },
    { pic: '☀️', ca: 'diumenge', es: 'domingo', en: 'Sunday' },
  ].map((d, i) => ({ ...d, num: i + 1, day: true }));

  const LEVELS = {
    // stars: mismatches allowed for ⭐⭐⭐ / ⭐⭐ (Memory has no hearts: flipping is the game)
    easy: { items: () => SEASONS, hint: true, stars: [2, 5] },
    days: { items: () => DAYS, hint: false, stars: [4, 9] },
    medium: { items: () => shuffle(MONTHS.slice()).slice(0, 8), hint: false, stars: [6, 12] },
    hard: { items: () => MONTHS, hint: false, stars: [9, 18] },
  };

  // El meu calendari: 3 stickers per month
  const STICKERS = [
    ['👑', '⛄', '🎿'], ['🎭', '🥞', '💌'], ['🌱', '🪁', '🐣'], ['🌹', '📚', '☔'],
    ['🌼', '🐝', '🍓'], ['🔥', '🎆', '🍒'], ['🏖️', '🍦', '🏊'], ['🍉', '⛱️', '🌻'],
    ['🎒', '🍇', '✏️'], ['🎃', '🍄', '🦇'], ['🌰', '🍠', '🍂'], ['🎄', '🎁', '⭐'],
  ];

  const TEXT = {
    title: { ca: 'Memory dels mesos', es: 'Memory de los meses', en: 'Months Memory' },
    ask: { ca: 'Tria un nivell!', es: '¡Elige un nivel!', en: 'Pick a level!' },
    easy: { ca: 'Fàcil', es: 'Fácil', en: 'Easy' },
    easySub: { ca: '4 estacions', es: '4 estaciones', en: '4 seasons' },
    days: { ca: 'Dies', es: 'Días', en: 'Days' },
    daysSub: { ca: '7 dies de la setmana', es: '7 días de la semana', en: '7 days of the week' },
    medium: { ca: 'Mitjà', es: 'Medio', en: 'Medium' },
    mediumSub: { ca: '8 mesos', es: '8 meses', en: '8 months' },
    hard: { ca: 'Difícil', es: 'Difícil', en: 'Hard' },
    hardSub: { ca: 'Tots 12 mesos', es: 'Los 12 meses', en: 'All 12 months' },
    win: { ca: 'Totes les glans trobades!', es: '¡Todas las bellotas encontradas!', en: 'All the acorns found!' },
    album: { ca: 'El meu calendari', es: 'Mi calendario', en: 'My calendar' },
    prize: { ca: 'Adhesiu nou per al calendari!', es: '¡Pegatina nueva para el calendario!', en: 'A new sticker for the calendar!' },
    prizeGold: { ca: 'Adhesius daurats per al calendari!', es: '¡Pegatinas doradas para el calendario!', en: 'Golden stickers for the calendar!' },
  };
  // Nou the forgetful squirrel: never says where a card is (no hints)
  const NOU = {
    helloShort: { ca: 'Ajuda’m a trobar les glans!', es: '¡Ayúdame a encontrar las bellotas!', en: 'Help me find my acorns!' },
    hello: { ca: "Sóc la Nou! He amagat les glans i no recordo on… M'ajudes?", es: '¡Soy Nou! He escondido las bellotas y no recuerdo dónde… ¿Me ayudas?', en: "I'm Nou! I hid my acorns and I can't remember where… Will you help?" },
    match: [
      { ca: 'Ara me’n recordo!', es: '¡Ahora me acuerdo!', en: 'Now I remember!' },
      { ca: 'Una gla trobada!', es: '¡Una bellota encontrada!', en: 'One acorn found!' },
      { ca: 'Quina memòria!', es: '¡Qué memoria!', en: 'What a memory!' },
      { ca: 'Nyam, nyam!', es: '¡Ñam, ñam!', en: 'Yum, yum!' },
    ],
    miss: [
      { ca: 'Hmm… aquí no era.', es: 'Hmm… aquí no era.', en: "Hmm… not here." },
      { ca: 'Ui, m’he despistat!', es: '¡Uy, me he despistado!', en: 'Oops, I forgot!' },
      { ca: 'On era, on era…?', es: '¿Dónde era, dónde era…?', en: 'Where was it…?' },
    ],
    win: { ca: 'Gràcies! Ara tinc menjar per a tot l’hivern!', es: '¡Gracias! ¡Ahora tengo comida para todo el invierno!', en: 'Thank you! Now I have food for the whole winter!' },
  };
  const FALLING = { winter: '❄️', spring: '🌸', summer: '🦋', autumn: '🍂' };

  const $ = (id) => document.getElementById(id);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Nou the squirrel ----------
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
  function nouSay(line, speak, shown) {
    const el = $('nou-say');
    el.textContent = M.t(shown || line);
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    if (speak) M.speak(M.t(line), M.lang);
  }
  function nouMove(cls) {
    const el = $('nou');
    el.classList.remove('hop', 'think'); void el.offsetWidth; el.classList.add(cls);
  }

  // ---------- Seasons: background, falling things, music ----------
  function realSeason() {
    return MONTH_SEASON[new Date().getMonth()];
  }
  let season = null;
  function setSeason(s) {
    if (s === season) return;
    season = s;
    document.body.classList.remove('winter', 'spring', 'summer', 'autumn');
    document.body.classList.add(s);
    $('falling').innerHTML = Array.from({ length: 10 }, (_, i) =>
      `<span style="left:${(i * 10 + Math.random() * 8).toFixed(0)}%;animation-delay:${(-Math.random() * 12).toFixed(1)}s;animation-duration:${(9 + Math.random() * 6).toFixed(1)}s">${FALLING[s]}</span>`).join('');
    M.music.play(s);
  }

  // ---------- Calendar album ----------
  function album() {
    try { return JSON.parse(localStorage.getItem(ALBUM_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveAlbum(a) {
    try { localStorage.setItem(ALBUM_KEY, JSON.stringify(a)); } catch (e) { /* private mode */ }
  }
  // One sticker per round (two, golden, on ⭐⭐⭐), from a month of the round, missing ones first.
  function award(months, gold) {
    const a = album();
    const got = [];
    for (let n = 0; n < (gold ? 2 : 1); n++) {
      const slots = [];
      months.forEach((m) => STICKERS[m].forEach((_, s) => slots.push(`${m}-${s}`)));
      const missing = slots.filter((k) => !a[k]);
      const notGold = slots.filter((k) => a[k] !== 2);
      const k = missing.length ? pick(missing) : gold && notGold.length ? pick(notGold) : pick(slots);
      a[k] = Math.max(a[k] || 0, gold ? 2 : 1);
      got.push(k);
    }
    saveAlbum(a);
    return got;
  }
  const monthName = (m) => cap(MONTHS[m][M.lang]);
  function openAlbum() {
    const a = album();
    const have = Object.keys(a).length;
    $('album-count').textContent = `${have} / 36`;
    $('cal-grid').innerHTML = MONTHS.map((mo, m) => `
      <div class="cal-month ${mo.season}">
        <span class="cal-name">${monthName(m)}</span>
        <span class="cal-stickers">${STICKERS[m].map((st, s) => {
          const v = a[`${m}-${s}`];
          return v ? `<button class="sticker${v === 2 ? ' gold' : ''}" data-m="${m}">${st}</button>` : '<span class="sticker empty">·</span>';
        }).join('')}</span>
      </div>`).join('');
    $('album').hidden = false;
  }
  $('cal-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.sticker[data-m]');
    if (!b) return;
    b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle');
    M.sounds.pop();
    M.speak(monthName(+b.dataset.m), M.lang);
  });
  $('album-btn').addEventListener('click', () => { M.sounds.pop(); openAlbum(); });
  $('album-close').addEventListener('click', () => { M.sounds.pop(); $('album').hidden = true; });

  // ---------- Text & language ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    $('ask').textContent = M.t(TEXT.ask);
    ['easy', 'days', 'medium', 'hard'].forEach((l) => {
      $(l + '-name').textContent = M.t(TEXT[l]);
      $(l + '-sub').textContent = M.t(TEXT[l + 'Sub']);
    });
    $('win-text').textContent = M.t(TEXT.win);
    $('album-title').textContent = M.t(TEXT.album);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  renderText();
  ['nou-levels', 'nou', 'nou-win'].forEach((id) => { $(id).innerHTML = NOU_SVG; });
  M.music.button($('music'));
  M.music.button($('music-levels'));
  setSeason(realSeason());

  // ---------- Game state ----------
  let level = 'easy';
  let cards = [];
  let open = [];      // indexes of face-up, unmatched cards (max 2)
  let locked = false;
  let found = 0;
  let misses = 0;

  function start(lvl) {
    level = lvl;
    const conf = LEVELS[lvl];
    const items = conf.items();
    cards = [];
    items.forEach((item, pairId) => {
      const lang = M.LANGS[Math.floor(Math.random() * M.LANGS.length)];
      cards.push({ pairId, item, kind: 'pic' });
      cards.push({ pairId, item, kind: 'word', lang, hint: conf.hint });
    });
    shuffle(cards);
    open = [];
    locked = false;
    found = 0;
    misses = 0;
    $('levels').hidden = true;
    $('win').hidden = true;
    $('play').hidden = false;
    setSeason(realSeason());
    renderAcorns();
    nouSay(NOU.hello, true, NOU.helloShort);
    renderBoard();
  }
  function renderAcorns() { $('acorns').textContent = `🌰 ${found}/${cards.length / 2}`; }

  function faceHTML(c) {
    if (c.kind === 'pic') {
      const week = c.item.day
        ? `<span class="week">${DAYS.map((d, i) => `<i class="${i === c.item.num - 1 ? 'on' : ''}${i > 4 ? ' we' : ''}"></i>`).join('')}</span>` : '';
      return `${c.item.num ? `<span class="num">${c.item.num}</span>` : ''}<span class="pic">${c.item.pic}</span>${week}`;
    }
    const word = cap(c.item[c.lang]);
    return `<span class="badge ${c.lang}">${c.lang.toUpperCase()}</span>` +
      `<span class="word" style="--wf:min(calc(var(--cw) * 0.21), calc(var(--cw) * 1.3 / ${word.length}))">${word}</span>` +
      (c.hint ? `<span class="hint">${c.item.pic}</span>` : '');
  }

  function renderBoard() {
    const board = $('board');
    board.innerHTML = cards.map((c, i) => `
      <button class="card" data-i="${i}" aria-label="card">
        <span class="card-inner">
          <span class="face back"><span class="acorn-back">🌰</span></span>
          <span class="face front">${faceHTML(c)}</span>
        </span>
      </button>`).join('');
    layout();
  }

  // Pick the column count that gives the biggest cards for this screen.
  function layout() {
    const n = cards.length;
    if (!n || $('play').hidden) return;
    const gap = n > 16 ? 6 : 10;
    const top = $('board').getBoundingClientRect().top;
    const W = Math.min(innerWidth - 24, 900);
    const H = innerHeight - top - 12;
    const ratio = n > 16 ? 1 : 1.25; // height / width
    let best = { cw: 0, cols: 4 };
    for (let cols = 2; cols <= n; cols++) {
      const rows = Math.ceil(n / cols);
      if (n % cols && n !== 14) continue; // only full rows (14 cards: 4 + 4 + 4 + 2 is fine too)
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
    if (!el || locked) return;
    const i = +el.dataset.i;
    if (el.classList.contains('open')) return;

    el.classList.add('open');
    M.sounds.flip();
    open.push(i);
    if (open.length < 2) return;

    locked = true;
    const [a, b] = open;
    const els = open.map((k) => $('board').children[k]);
    if (cards[a].pairId === cards[b].pairId) {
      setTimeout(() => {
        els.forEach((x) => x.classList.add('matched'));
        M.sounds.match();
        showToast(cards[a].item);
        nouSay(pick(NOU.match));
        nouMove('hop');
        if (cards[a].item.season) setSeason(cards[a].item.season);
        open = [];
        locked = false;
        found++;
        renderAcorns();
        if (found === cards.length / 2) setTimeout(win, 900);
      }, 350);
    } else {
      misses++;
      setTimeout(() => {
        els.forEach((x) => x.classList.add('shake'));
        M.sounds.miss();
        nouSay(pick(NOU.miss));
        nouMove('think');
      }, 500);
      setTimeout(() => {
        els.forEach((x) => x.classList.remove('open', 'shake'));
        open = [];
        locked = false;
      }, 1300);
    }
  });

  let toastTimer;
  function showToast(item) {
    const t = $('toast');
    t.innerHTML = `<span class="t-pic">${item.pic}</span><span class="t-words">` +
      M.LANGS.map((l) => `<span data-l="${l.toUpperCase()}">${cap(item[l])}</span>`).join('') + '</span>';
    t.hidden = false;
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
  }

  function win() {
    const [three, two] = LEVELS[level].stars;
    const stars = misses <= three ? 3 : misses <= two ? 2 : 1;
    $('win-stars').innerHTML = M.starsHTML(stars);
    // stickers from the months of this board (seasons: their months; days: any month)
    const items = [...new Set(cards.map((c) => c.item))];
    const months = level === 'days' ? MONTHS.map((m) => m.month)
      : level === 'easy' ? MONTH_SEASON.map((s, m) => (items.some((it) => it.season === s) ? m : -1)).filter((m) => m >= 0)
        : items.map((it) => it.month);
    const got = award(months, stars === 3);
    const a = album();
    $('prize').innerHTML = `<p>${M.t(stars === 3 ? TEXT.prizeGold : TEXT.prize)}</p>` +
      `<div class="prize-stickers">${got.map((k) => {
        const [m, s] = k.split('-').map(Number);
        return `<span class="prize-one"><span class="sticker big${a[k] === 2 ? ' gold' : ''}">${STICKERS[m][s]}</span>${monthName(m)}</span>`;
      }).join('')}</div>`;
    $('toast').hidden = true;
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    M.speak(M.t(NOU.win), M.lang);
  }

  function showLevels() {
    $('play').hidden = true;
    $('win').hidden = true;
    $('levels').hidden = false;
  }

  document.querySelectorAll('.level').forEach((b) =>
    b.addEventListener('click', () => { M.sounds.pop(); start(b.dataset.level); }));
  $('again').addEventListener('click', () => { M.sounds.pop(); start(level); });
  $('other').addEventListener('click', () => { M.sounds.pop(); showLevels(); });

  // test hook
  window.__memory = () => ({ cards, found, misses, level, season });
})();
