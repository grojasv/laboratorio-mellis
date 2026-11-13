// La botiga de la Guardiola: pay the exact price with euro coins and notes, then
// run the shop and give the change. All amounts are in cents.
(function () {
  const M = window.Mellis;
  const { pick, shuffle } = M;
  const $ = (id) => document.getElementById(id);
  const ROUND = 8;                 // purchases per round
  const MAX_TRAY = 10;             // coins/notes that fit on the tray
  const ALBUM_KEY = 'mellis.shop.items'; // { '🍎': 1 bought | 2 golden }
  const L = (ca, es, en) => ({ ca, es, en });

  // Coins and notes: value in cents, CSS class, label
  const MONEY = {
    10: ['c10', '10c'], 20: ['c20', '20c'], 50: ['c50', '50c'],
    100: ['e1', '1€'], 200: ['e2', '2€'],
    500: ['note n5', '5€'], 1000: ['note n10', '10€'], 2000: ['note n20', '20€'],
  };
  // What she can pay with on each level
  const WALLET = { 1: [100, 200, 500], 2: [10, 20, 50, 100, 200], 3: [100, 200, 500, 1000, 2000], 4: [100, 200, 500] };

  // Things for sale, with their article ("I'd like …")
  const CHEAP = [
    { e: '🍎', ...L('una poma', 'una manzana', 'an apple') },
    { e: '🍌', ...L('un plàtan', 'un plátano', 'a banana') },
    { e: '🥐', ...L('un croissant', 'un cruasán', 'a croissant') },
    { e: '🍪', ...L('una galeta', 'una galleta', 'a cookie') },
    { e: '🧃', ...L('un suc', 'un zumo', 'a juice') },
    { e: '🍭', ...L('una piruleta', 'una piruleta', 'a lollipop') },
    { e: '🥕', ...L('una pastanaga', 'una zanahoria', 'a carrot') },
    { e: '🍓', ...L('unes maduixes', 'unas fresas', 'some strawberries') },
    { e: '🧀', ...L('un formatge', 'un queso', 'a cheese') },
    { e: '🥖', ...L('una barra de pa', 'una barra de pan', 'a loaf of bread') },
    { e: '✏️', ...L('un llapis', 'un lápiz', 'a pencil') },
    { e: '🎈', ...L('un globus', 'un globo', 'a balloon') },
  ];
  const DEAR = [
    { e: '🧸', ...L('un osset', 'un osito', 'a teddy bear') },
    { e: '⚽', ...L('una pilota', 'una pelota', 'a ball') },
    { e: '🎒', ...L('una motxilla', 'una mochila', 'a backpack') },
    { e: '📖', ...L('un conte', 'un cuento', 'a storybook') },
    { e: '🛴', ...L('un patinet', 'un patinete', 'a scooter') },
    { e: '🎨', ...L('unes pintures', 'unas pinturas', 'a paint set') },
    { e: '🧩', ...L('un trencaclosques', 'un puzle', 'a puzzle') },
    { e: '🪁', ...L('un estel', 'una cometa', 'a kite') },
    { e: '👟', ...L('unes sabatilles', 'unas zapatillas', 'some trainers') },
    { e: '🎧', ...L('uns auriculars', 'unos auriculares', 'some headphones') },
    { e: '🪀', ...L('un io-io', 'un yoyó', 'a yo-yo') },
    { e: '🧢', ...L('una gorra', 'una gorra', 'a cap') },
  ];
  const ITEMS = CHEAP.concat(DEAR);
  const CUSTOMERS = ['🐻', '🐰', '🦊', '🐸', '🐱', '🐶', '🐼', '🐨', '🐭', '🦁'];

  const TEXT = {
    title: L('La botiga de la Guardiola', 'La tienda de Hucha', "Penny's Shop"),
    ask: L('Tria un nivell!', '¡Elige un nivel!', 'Pick a level!'),
    l1: L('Monedes', 'Monedas', 'Coins'),
    l2: L('Cèntims', 'Céntimos', 'Cents'),
    l3: L('Bitllets', 'Billetes', 'Notes'),
    l4: L('El canvi', 'El cambio', 'Change'),
    payTask: L('Paga just!', '¡Paga justo!', 'Pay the exact amount!'),
    changeTask: L('Ara la botiga és teva! Torna el canvi.', '¡Ahora la tienda es tuya! Devuelve el cambio.', 'The shop is yours now! Give the change.'),
    pay: L('Pagar', 'Pagar', 'Pay'),
    give: L('Tornar el canvi', 'Dar el cambio', 'Give change'),
    want: L('Vull {item}.', 'Quiero {item}.', "I'd like {item}."),
    with: L('Pago amb', 'Pago con', 'I pay with'),
    win: L('Compra feta!', '¡Compra hecha!', 'Shopping done!'),
    album: L('El meu cistell', 'Mi cesta', 'My basket'),
    reveal: L('Era així!', '¡Era así!', 'It was like this!'),
  };
  // Guardiola the piggy-bank shopkeeper and the customers: funny, never a hint
  const SAY = {
    yes: [L('Clinc, clinc!', '¡Clin, clin!', 'Ka-ching!'), L('Gràcies!', '¡Gracias!', 'Thank you!'), L('Just, just!', '¡Justo, justo!', 'Spot on!'), L('Oinc! Perfecte!', '¡Oinc! ¡Perfecto!', 'Oink! Perfect!')],
    no: [L('Oinc? Oinc?', '¿Oinc? ¿Oinc?', 'Oink? Oink?'), L('Ui, ui, ui!', '¡Uy, uy, uy!', 'Uh, uh, uh!'), L('La caixa fa piiip!', '¡La caja hace piiip!', 'The till goes beep!')],
  };

  const PIG_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22 30 l-6 -20 l22 8 z M78 30 l6 -20 l-22 8 z" fill="#ff9ec7" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="50" cy="54" r="38" fill="#ffb8d6" stroke="#3a3a5c" stroke-width="3"/>
    <rect x="40" y="19" width="20" height="5" rx="2.5" fill="#3a3a5c"/>
    <circle cx="62" cy="14" r="7" fill="#ffd23f" stroke="#3a3a5c" stroke-width="2.5"/>
    <g class="eyes"><ellipse cx="36" cy="46" rx="4" ry="5.5" fill="#3a3a5c"/><ellipse cx="64" cy="46" rx="4" ry="5.5" fill="#3a3a5c"/>
    <circle cx="37.4" cy="44" r="1.5" fill="#fff"/><circle cx="65.4" cy="44" r="1.5" fill="#fff"/></g>
    <ellipse cx="50" cy="64" rx="15" ry="11" fill="#ff8fbd" stroke="#3a3a5c" stroke-width="3"/>
    <ellipse cx="44.5" cy="64" rx="2.4" ry="4" fill="#3a3a5c"/><ellipse cx="55.5" cy="64" rx="2.4" ry="4" fill="#3a3a5c"/>
    <path d="M40 80 q10 7 20 0" fill="none" stroke="#3a3a5c" stroke-width="3" stroke-linecap="round"/>
    <circle cx="24" cy="62" r="5" fill="#ff8fbd" opacity=".7"/><circle cx="76" cy="62" r="5" fill="#ff8fbd" opacity=".7"/>
  </svg>`;

  // ---------- Money ----------
  // "3 €", "1,30 €" (en: "€1.30"), "50 c"
  function priceText(cents) {
    const e = Math.floor(cents / 100), c = cents % 100;
    if (!e) return `${c} c`;
    if (!c) return `${e} €`;
    const cc = String(c).padStart(2, '0');
    return M.lang === 'en' ? `€${e}.${cc}` : `${e},${cc} €`;
  }
  // The same amount for the voice: "1 euro amb 30", "50 cèntims"
  function priceSpoken(cents) {
    const e = Math.floor(cents / 100), c = cents % 100;
    const euros = `${e} ${e === 1 ? 'euro' : 'euros'}`;
    const centsWord = { ca: 'cèntims', es: 'céntimos', en: 'cents' }[M.lang];
    if (!e) return `${c} ${centsWord}`;
    if (!c) return euros;
    return `${euros} ${{ ca: 'amb', es: 'con', en: '' }[M.lang]} ${c}`.replace('  ', ' ');
  }
  const moneyHTML = (v, tag) => `<${tag || 'button'} class="money ${MONEY[v][0]}" data-v="${v}">${MONEY[v][1]}</${tag || 'button'}>`;
  // Fewest coins and notes of this level that make the amount (shown on the 2nd miss)
  function fewest(cents, lvl) {
    const out = [];
    WALLET[lvl].slice().sort((a, b) => b - a).forEach((v) => { while (cents >= v) { out.push(v); cents -= v; } });
    return out;
  }

  // ---------- Questions ----------
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  // { item, target (what she must put on the tray), price, paid? (level 4), who?, key }
  function makeQuestion(lvl) {
    if (lvl === 1) { const p = rand(1, 10) * 100; return { item: pick(CHEAP), price: p, target: p, key: '1:' + p }; }
    if (lvl === 2) { const p = rand(0, 2) * 100 + rand(1, 9) * 10; return { item: pick(CHEAP), price: p, target: p, key: '2:' + p }; }
    if (lvl === 3) { const p = rand(11, 50) * 100; return { item: pick(DEAR), price: p, target: p, key: '3:' + p }; }
    const paid = pick([500, 1000, 1000, 2000]);
    const price = paid === 500 ? rand(1, 4) * 100 : paid - rand(1, 9) * 100;
    return { item: pick(paid === 2000 ? DEAR : CHEAP), price, paid, target: paid - price, who: pick(CUSTOMERS), key: `4:${paid}-${price}` };
  }

  // ---------- Album ----------
  const album = () => M.store.get(ALBUM_KEY, {});
  const itemOf = (e) => ITEMS.find((i) => i.e === e);
  const ownedCount = () => ITEMS.filter((i) => album()[i.e]).length;

  // ---------- State ----------
  let level = 1, done = 0, current = null, busy = false, tray = [], seen = new Set(), bought = [];
  const round = M.round({ heartsEl: $('hearts'), onOut: () => start(level) });

  function say(line, speak) {
    $('line').textContent = line;
    if (speak) M.speak(speak.replace(/[¡!¿]/g, ''), M.lang);
  }
  function bob(cls) {
    const el = $('who');
    el.classList.remove('hop', 'oops'); void el.offsetWidth; el.classList.add(cls);
  }
  function itemLine(q) {
    const name = M.t(q.item);
    return q.paid ? M.t(TEXT.want).replace('{item}', name) : name.charAt(0).toUpperCase() + name.slice(1);
  }

  function renderQuestion(speak) {
    const q = current;
    $('who').innerHTML = q.paid ? q.who : PIG_SVG;
    $('item').textContent = q.item.e;
    $('price').textContent = priceText(q.price);
    $('paid').hidden = !q.paid;
    if (q.paid) $('paid').innerHTML = `${M.t(TEXT.with)} ${moneyHTML(q.paid, 'span')}`;
    $('task').textContent = M.t(q.paid ? TEXT.changeTask : TEXT.payTask);
    $('pay-label').textContent = M.t(q.paid ? TEXT.give : TEXT.pay);
    const spoken = `${itemLine(q)}${q.paid ? '' : ':'} ${priceSpoken(q.price)}.` + (q.paid ? ` ${M.t(TEXT.with)} ${priceSpoken(q.paid)}.` : '');
    say(itemLine(q), speak ? spoken : null);
  }
  function renderTray(total) {
    $('tray').innerHTML = tray.map((v) => moneyHTML(v)).join('')
      + (total ? `<span class="total">= ${priceText(current.target)}</span>` : '');
    $('pay').disabled = !tray.length || busy;
  }

  function start(lvl) {
    level = lvl; done = 0; seen = new Set(); bought = [];
    round.start();
    $('levels').hidden = true; $('win').hidden = true; $('album').hidden = true; $('play').hidden = false;
    $('progress').innerHTML = '<span></span>'.repeat(ROUND);
    $('wallet').innerHTML = WALLET[lvl].map((v) => moneyHTML(v)).join('');
    next();
  }

  function next() {
    let q;
    do { q = makeQuestion(level); } while (seen.has(q.key) || bought.includes(q.item.e));
    seen.add(q.key);
    current = q; tray = []; busy = false;
    renderQuestion(true);
    renderTray();
  }

  $('wallet').addEventListener('click', (e) => {
    const b = e.target.closest('.money');
    if (!b || busy) return;
    if (tray.length >= MAX_TRAY) { M.sounds.miss(); return; }
    tray.push(+b.dataset.v);
    M.sounds.whoosh();
    renderTray();
    // the coin jumps from the wallet onto the tray and lands with a clink
    const landed = $('tray').children[tray.length - 1];
    landed.style.visibility = 'hidden';
    M.fly(b, landed, { ms: 380, lift: 40, spin: 360 }).then(() => { landed.style.visibility = ''; M.sounds.clink(); });
  });
  // tap a coin on the tray to take it back
  $('tray').addEventListener('click', (e) => {
    const b = e.target.closest('.money');
    if (!b || busy) return;
    tray.splice([...$('tray').children].indexOf(b), 1);
    M.sounds.pop();
    renderTray();
  });

  $('pay').addEventListener('click', () => {
    if (busy || !tray.length) return;
    busy = true;
    $('pay').disabled = true;
    if (tray.reduce((a, b) => a + b, 0) === current.target) { sold(); return; }
    const t = $('tray');
    t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake');
    say(M.t(pick(SAY.no)));
    bob('oops');
    round.wrong(current.key).then(({ reveal }) => {
      if (!reveal) { busy = false; say(itemLine(current)); renderTray(); return; }
      // 2nd miss: lay out the right coins with their total, then move on
      tray = fewest(current.target, level);
      renderTray(true);
      say(M.t(TEXT.reveal), M.t(TEXT.reveal));
      setTimeout(sold, 2200);
    });
  });

  function sold() {
    M.sounds.match();
    say(M.t(pick(SAY.yes)));
    bob('hop');
    bought.push(current.item.e);
    // the thing she bought drops into its place in the basket row
    const slot = $('progress').children[done], thing = current.item.e;
    M.fly($('item'), slot, { html: thing, size: 44, scale: 0.45, ms: 600 }).then(() => {
      slot.textContent = thing;
      slot.classList.add('full');
    });
    done++;
    setTimeout(done === ROUND ? finish : next, 900);
  }

  function finish() {
    const stars = round.stars();
    const a = album();
    bought.forEach((e) => { a[e] = Math.max(a[e] || 0, stars === 3 ? 2 : 1); });
    M.store.set(ALBUM_KEY, a);
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('bag').innerHTML = bought.map((e) => `<span class="${stars === 3 ? 'gold' : ''}">${e}</span>`).join('');
    $('win').hidden = false;
    renderText();
    M.sounds.win();
    M.confetti();
    M.speak(M.t(TEXT.win).replace(/[¡!]/g, ''), M.lang);
  }

  // ---------- Album ----------
  function openAlbum() {
    const a = album();
    $('album-grid').innerHTML = ITEMS.map((i) =>
      `<button class="${a[i.e] ? (a[i.e] === 2 ? 'gold' : '') : 'empty'}" data-e="${i.e}">${i.e}</button>`).join('');
    $('album-name').textContent = ownedCount() ? '👆' : '🧺 ?';
    $('album').hidden = false;
  }
  $('album-grid').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.classList.contains('empty')) return;
    const i = itemOf(b.dataset.e);
    M.sounds.pop();
    $('album-name').textContent = `${i.e} ${M.t(i)}`;
    M.speak(M.t(i), M.lang);
  });

  function showLevels() {
    $('play').hidden = true; $('win').hidden = true; $('album').hidden = true; $('levels').hidden = false;
    renderText();
  }

  // ---------- Text ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    $('ask').textContent = M.t(TEXT.ask);
    [1, 2, 3, 4].forEach((i) => { $(`l${i}-name`).textContent = M.t(TEXT['l' + i]); });
    $('l2-sub').textContent = `50 c · ${priceText(130)}`;
    $('win-text').textContent = M.t(TEXT.win);
    $('album-label').textContent = M.t(TEXT.album);
    $('album-title').textContent = M.t(TEXT.album);
    const count = `${ownedCount()}/${ITEMS.length}`;
    $('album-count').textContent = count;
    $('album-count2').textContent = count;
    if (current && !$('play').hidden) { renderQuestion(false); renderTray(); }
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  $('pig-levels').innerHTML = PIG_SVG;
  M.music.button($('music'));
  M.music.button($('music-levels'));
  M.music.play('spring');

  document.querySelectorAll('.level').forEach((b) =>
    b.addEventListener('click', () => { M.sounds.pop(); start(+b.dataset.level); }));
  $('again').addEventListener('click', () => { M.sounds.pop(); start(level); });
  $('other').addEventListener('click', () => { M.sounds.pop(); showLevels(); });
  $('to-album').addEventListener('click', () => { M.sounds.pop(); showLevels(); openAlbum(); });
  $('open-album').addEventListener('click', () => { M.sounds.pop(); openAlbum(); });
  $('close-album').addEventListener('click', () => { M.sounds.pop(); $('album').hidden = true; });

  renderText();
  // test hook
  window.__shop = () => ({ current, level, done, busy, tray, makeQuestion, fewest });
})();
