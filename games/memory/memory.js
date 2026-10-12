(function () {
  const M = window.Mellis;

  // Each item becomes one pair: a picture card ↔ a word card in a random language.
  const SEASONS = [
    { pic: '❄️', ca: 'hivern', es: 'invierno', en: 'winter' },
    { pic: '🌸', ca: 'primavera', es: 'primavera', en: 'spring' },
    { pic: '☀️', ca: 'estiu', es: 'verano', en: 'summer' },
    { pic: '🍂', ca: 'tardor', es: 'otoño', en: 'autumn' },
  ];
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
  ].map((m, i) => ({ ...m, num: i + 1 }));

  const LEVELS = {
    easy: { items: () => SEASONS, hint: true },
    medium: { items: () => shuffle(MONTHS.slice()).slice(0, 8), hint: false },
  };

  const TEXT = {
    title: { ca: 'Memory dels mesos', es: 'Memory de los meses', en: 'Months Memory' },
    ask: { ca: 'Tria un nivell!', es: '¡Elige un nivel!', en: 'Pick a level!' },
    easy: { ca: 'Fàcil', es: 'Fácil', en: 'Easy' },
    easySub: { ca: '4 estacions', es: '4 estaciones', en: '4 seasons' },
    medium: { ca: 'Mitjà', es: 'Medio', en: 'Medium' },
    mediumSub: { ca: '8 mesos', es: '8 meses', en: '8 months' },
    win: { ca: 'Molt bé! 🎉', es: '¡Muy bien! 🎉', en: 'Well done! 🎉' },
  };
  const BACK_COLORS = ['var(--pink)', 'var(--teal)', 'var(--orange)', 'var(--blue)', 'var(--purple)'];

  const $ = (id) => document.getElementById(id);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Text & language ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    $('ask').textContent = M.t(TEXT.ask);
    $('easy-name').textContent = M.t(TEXT.easy);
    $('easy-sub').textContent = M.t(TEXT.easySub);
    $('medium-name').textContent = M.t(TEXT.medium);
    $('medium-sub').textContent = M.t(TEXT.mediumSub);
    $('win-text').textContent = M.t(TEXT.win);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  renderText();
  $('mascots-levels').innerHTML = M.mascotsSVG('wave');
  $('mascots-win').innerHTML = M.mascotsSVG('cheer');

  // ---------- Game state ----------
  let level = 'easy';
  let cards = [];
  let open = [];      // indexes of face-up, unmatched cards (max 2)
  let locked = false;
  let found = 0;

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
    $('levels').hidden = true;
    $('win').hidden = true;
    $('play').hidden = false;
    renderBoard();
  }

  function faceHTML(c) {
    if (c.kind === 'pic') {
      return `${c.item.num ? `<span class="num">${c.item.num}</span>` : ''}<span class="pic">${c.item.pic}</span>`;
    }
    const word = cap(c.item[c.lang]);
    return `<span class="badge ${c.lang}">${c.lang.toUpperCase()}</span>` +
      `<span class="word" style="--wf:calc(var(--cw) * ${word.length > 8 ? 0.15 : word.length > 6 ? 0.18 : 0.21})">${word}</span>` +
      (c.hint ? `<span class="hint">${c.item.pic}</span>` : '');
  }

  function renderBoard() {
    const board = $('board');
    board.innerHTML = cards.map((c, i) => `
      <button class="card" data-i="${i}" aria-label="card">
        <span class="card-inner">
          <span class="face back" style="--back:${BACK_COLORS[i % BACK_COLORS.length]}">🧪</span>
          <span class="face front">${faceHTML(c)}</span>
        </span>
      </button>`).join('');
    layout();
  }

  // Pick the column count that gives the biggest cards for this screen.
  function layout() {
    const n = cards.length;
    if (!n || $('play').hidden) return;
    const gap = 10;
    const top = $('play').getBoundingClientRect().top;
    const W = Math.min(innerWidth - 24, 900);
    const H = innerHeight - top - 16;
    const ratio = 1.25; // height / width
    let best = { cw: 0, cols: 4 };
    for (let cols = 2; cols <= n; cols++) {
      const rows = Math.ceil(n / cols);
      if (n % cols) continue; // only full rows
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
        open = [];
        locked = false;
        if (++found === cards.length / 2) setTimeout(win, 700);
      }, 350);
    } else {
      setTimeout(() => {
        els.forEach((x) => x.classList.add('shake'));
        M.sounds.miss();
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
    $('toast').hidden = true;
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
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
})();
