(function () {
  const M = window.Mellis;
  const ROUND = 10;                       // correct answers needed per potion
  const STORE_KEY = 'mellis.potions.creatures';
  const GOLD_KEY = 'mellis.potions.gold';      // creatures won with ⭐⭐⭐

  // The creatures that hatch from finished potions and live in the garden
  const CREATURES = [
    { e: '🐉', ca: 'Drac Flamet', es: 'Dragón Llamita', en: 'Flamey the Dragon' },
    { e: '🦄', ca: 'Unicorn Purpurina', es: 'Unicornio Purpurina', en: 'Glitter the Unicorn' },
    { e: '🐙', ca: 'Pop Gargot', es: 'Pulpo Garabato', en: 'Squiggle the Octopus' },
    { e: '🦖', ca: 'Rex Ronc', es: 'Rex Ronquido', en: 'Snory Rex' },
    { e: '🐸', ca: 'Gripau Saltiri', es: 'Sapo Saltarín', en: 'Hoppy the Toad' },
    { e: '🦊', ca: 'Guineu Llumí', es: 'Zorra Cerilla', en: 'Matchstick the Fox' },
    { e: '🐼', ca: 'Panda Mandra', es: 'Panda Pereza', en: 'Lazy the Panda' },
    { e: '🦋', ca: 'Papallona Ventall', es: 'Mariposa Abanico', en: 'Flutter the Butterfly' },
    { e: '🐢', ca: 'Tortuga Calma', es: 'Tortuga Calma', en: 'Easy the Turtle' },
    { e: '🦉', ca: 'Òliba Ulleres', es: 'Lechuza Gafitas', en: 'Specs the Owl' },
    { e: '🐳', ca: 'Balena Esquitx', es: 'Ballena Salpicón', en: 'Splash the Whale' },
    { e: '👾', ca: 'Marcià Bip', es: 'Marciano Bip', en: 'Beep the Alien' },
    { e: '🐝', ca: 'Abella Zum', es: 'Abeja Zum', en: 'Buzz the Bee' },
    { e: '🦩', ca: 'Flamenc Rosa', es: 'Flamenco Rosa', en: 'Rosy the Flamingo' },
    { e: '🐧', ca: 'Pingüí Patí', es: 'Pingüino Patín', en: 'Skate the Penguin' },
    { e: '🦔', ca: 'Eriçó Punxa', es: 'Erizo Pincho', en: 'Prickle the Hedgehog' },
    { e: '🦕', ca: 'Bronto Coll-llarg', es: 'Bronto Cuellilargo', en: 'Longneck the Dino' },
    { e: '🐨', ca: 'Koala Son', es: 'Koala Sueño', en: 'Sleepy the Koala' },
    { e: '🦥', ca: 'Peresós Mandrós', es: 'Perezoso Remolón', en: 'Dozy the Sloth' },
    { e: '🦦', ca: 'Llúdriga Remolí', es: 'Nutria Remolino', en: 'Swirl the Otter' },
    { e: '🦭', ca: 'Foca Pilota', es: 'Foca Pelota', en: 'Bouncy the Seal' },
    { e: '🦜', ca: 'Lloro Xerraire', es: 'Loro Charlatán', en: 'Chatty the Parrot' },
    { e: '🐞', ca: 'Marieta Puntets', es: 'Mariquita Puntitos', en: 'Dotty the Ladybird' },
    { e: '🦀', ca: 'Cranc Pinça', es: 'Cangrejo Pinza', en: 'Pinchy the Crab' },
    { e: '🐌', ca: 'Cargol Bavós', es: 'Caracol Babosín', en: 'Slimy the Snail' },
    { e: '🦚', ca: 'Paó Plomes', es: 'Pavo Plumas', en: 'Feathers the Peacock' },
    { e: '🐡', ca: 'Peix Globus', es: 'Pez Globo', en: 'Puffy the Pufferfish' },
    { e: '🦈', ca: 'Tauró Dentetes', es: 'Tiburón Dientecitos', en: 'Toothy the Shark' },
    { e: '👻', ca: 'Fantasmet Buh', es: 'Fantasmita Bu', en: 'Boo the Ghost' },
    { e: '🐇', ca: 'Conill Saltó', es: 'Conejo Saltón', en: 'Bounce the Bunny' },
  ];
  const COLORS = ['#ff6fb5', '#2ec4b6', '#ffd23f', '#9b5de5', '#ff9f1c', '#3a86ff', '#7bd389'];

  const TEXT = {
    title: { ca: 'Laboratori de pocions', es: 'Laboratorio de pociones', en: 'Potion Lab' },
    ask: { ca: 'Tria un nivell!', es: '¡Elige un nivel!', en: 'Pick a level!' },
    l1: { ca: 'Fins a 20', es: 'Hasta 20', en: 'Up to 20' },
    l2: { ca: 'Fins a 100', es: 'Hasta 100', en: 'Up to 100' },
    l3: { ca: 'Repte 100', es: 'Reto 100', en: '100 Challenge' },
    l4: { ca: 'Ingredient secret', es: 'Ingrediente secreto', en: 'Secret ingredient' },
    l5: { ca: 'Doble i meitat', es: 'Doble y mitad', en: 'Double & half' },
    l5sub: { ca: '🪞 doble · meitat', es: '🪞 doble · mitad', en: '🪞 double · half' },
    l6: { ca: 'Salts màgics', es: 'Saltos mágicos', en: 'Magic hops' },
    double: { ca: 'El doble de {n}', es: 'El doble de {n}', en: 'Double {n}' },
    half: { ca: 'La meitat de {n}', es: 'La mitad de {n}', en: 'Half of {n}' },
    win: { ca: 'Poció a punt! Un nou amic!', es: '¡Poción lista! ¡Un nuevo amigo!', en: 'Potion ready! A new friend!' },
    garden: { ca: 'El jardí màgic', es: 'El jardín mágico', en: 'The magic garden' },
  };
  // Bruixa Xiruca and her cat Bigotis: funny, never a hint
  const XI = {
    hello: [
      { ca: 'Sóc la Xiruca! Fem una poció?', es: '¡Soy Xiruca! ¿Hacemos una poción?', en: "I'm Xiruca! Shall we brew a potion?" },
      { ca: 'Xup-xup! El calder ja bull!', es: '¡Chup-chup! ¡El caldero ya hierve!', en: 'Bubble-bubble! The cauldron is boiling!' },
      { ca: 'Avui farem una poció nova!', es: '¡Hoy haremos una poción nueva!', en: "Let's make a brand new potion!" },
    ],
    yes: [
      { ca: 'Bombolles!', es: '¡Burbujas!', en: 'Bubbles!' },
      { ca: 'Perfecte!', es: '¡Perfecto!', en: 'Perfect!' },
      { ca: 'Xup-xup!', es: '¡Chup-chup!', en: 'Bubble-bubble!' },
      { ca: 'Quin color més maco!', es: '¡Qué color más bonito!', en: 'What a lovely colour!' },
      { ca: 'Abracadabra!', es: '¡Abracadabra!', en: 'Abracadabra!' },
    ],
    no: [
      { ca: 'Uix, quin fum!', es: '¡Uy, qué humo!', en: 'Oops, what smoke!' },
      { ca: 'Puf! Fum de colors!', es: '¡Puf! ¡Humo de colores!', en: 'Poof! Coloured smoke!' },
      { ca: 'Ai, ai, ai… el meu barret!', es: 'Ay, ay, ay… ¡mi sombrero!', en: 'Oh dear… my hat!' },
    ],
    reveal: { ca: 'Era aquesta ampolla!', es: '¡Era esta botella!', en: 'It was this bottle!' },
  };
  const CAT = {
    yes: [{ ca: 'Miau!', es: '¡Miau!', en: 'Meow!' }, { ca: 'Rrrrr…', es: 'Rrrrr…', en: 'Purrr…' }, { ca: 'Fa olor de peix?', es: '¿Huele a pescado?', en: 'Smells like fish?' }],
    no: [{ ca: 'Atxim!', es: '¡Achís!', en: 'Achoo!' }, { ca: 'Miiiau!', es: '¡Miiiau!', en: 'Meeeow!' }],
  };

  const $ = (id) => document.getElementById(id);
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Questions ----------
  // 1: within 20. 2: up to 100, no carrying. 3: up to 100, carrying.
  // 4: missing number. 5: doubles & halves. 6: counting by 2, 5, 10.
  function sumQuestion(level) {
    const add = Math.random() < 0.5;
    let a, b;
    if (level === 1) {
      if (add) { a = rand(1, 19); b = rand(1, 20 - a); }
      else { a = rand(5, 20); b = rand(1, a); }
    } else if (level === 2) {
      const kind = pick(['ones', 'tens', 'both']);
      if (add) {
        const t1 = rand(1, 8), u1 = rand(0, 8);
        const t2 = kind === 'ones' ? 0 : rand(1, 9 - t1);
        const u2 = kind === 'tens' ? 0 : rand(1, 9 - u1);
        a = 10 * t1 + u1; b = 10 * t2 + u2;
      } else {
        const t1 = rand(2, 9), u1 = rand(1, 9);
        const t2 = kind === 'ones' ? 0 : rand(1, t1 - 1);
        const u2 = kind === 'tens' ? 0 : rand(1, u1);
        a = 10 * t1 + u1; b = 10 * t2 + u2;
      }
    } else {
      if (add) {
        const u1 = rand(1, 9), u2 = rand(Math.max(1, 10 - u1), 9);
        const t1 = rand(1, 8), t2 = Math.random() < 0.5 ? 0 : rand(0, 8 - t1);
        a = 10 * t1 + u1; b = 10 * t2 + u2;
      } else {
        const u1 = rand(0, 8), u2 = rand(u1 + 1, 9);
        const t1 = rand(2, 9), t2 = Math.random() < 0.5 ? 0 : rand(0, t1 - 1);
        a = 10 * t1 + u1; b = 10 * t2 + u2;
      }
    }
    const op = add ? '+' : '−';
    return { kind: 'sum', parts: [a, op, b, '=', '?'], answer: add ? a + b : a - b, slips: [1, -1, level === 1 ? 2 : 10, level === 1 ? -2 : -10], key: `${a}${op}${b}` };
  }
  function missingQuestion() {
    const add = Math.random() < 0.6;
    let a, b;
    if (Math.random() < 0.5) {          // within 20
      if (add) { a = rand(1, 15); b = rand(1, 20 - a); } else { a = rand(6, 20); b = rand(1, a - 1); }
    } else {                            // tens
      if (add) { a = rand(1, 8) * 10; b = rand(1, 9 - a / 10) * 10; } else { a = rand(3, 10) * 10; b = rand(1, a / 10 - 1) * 10; }
    }
    const c = add ? a + b : a - b;
    const op = add ? '+' : '−';
    // the hidden one: either term of a sum, or what was taken away
    const hideFirst = add && Math.random() < 0.4;
    const parts = hideFirst ? ['?', op, b, '=', c] : [a, op, '?', '=', c];
    const answer = hideFirst ? a : b;
    const big = a >= 10 && a % 10 === 0;
    // a real slip: doing the sum the other way round (adding when it should take away)
    const other = add ? c + (hideFirst ? b : a) : a + c;
    return { kind: 'missing', parts, answer, slips: [1, -1, big ? 10 : 2, big ? -10 : -2], extra: [other], key: parts.join('') };
  }
  function doubleQuestion() {
    if (Math.random() < 0.5) {
      const n = Math.random() < 0.75 ? rand(1, 20) : pick([25, 30, 35, 40, 45, 50]);
      return { kind: 'double', n, answer: n * 2, slips: [1, -1, 2, -2, 10], extra: [n + 2, n], key: 'd' + n };
    }
    const n = Math.random() < 0.75 ? rand(1, 20) * 2 : pick([50, 60, 70, 80, 90, 100]);
    return { kind: 'half', n, answer: n / 2, slips: [1, -1, 2, -2, 5], extra: [n * 2, n - 2], key: 'h' + n };
  }
  function hopQuestion() {
    const step = pick([2, 5, 10]);
    const start = step === 10 ? (Math.random() < 0.5 ? rand(1, 5) * 10 : rand(1, 9) + rand(0, 3) * 10)
      : step * rand(1, step === 2 ? 40 : 14);
    const seq = [0, 1, 2, 3].map((i) => start + i * step).filter((n) => n <= 100);
    if (seq.length < 4) return hopQuestion();
    const hole = Math.random() < 0.7 ? 3 : pick([1, 2]);
    const answer = seq[hole];
    const parts = seq.map((n, i) => (i === hole ? '?' : n));
    const others = [2, 5, 10].filter((s) => s !== step).map((s) => seq[hole - 1 >= 0 ? hole - 1 : 0] + s);
    return { kind: 'hop', parts, answer, slips: [1, -1, step, -step], extra: others, key: parts.join(',') };
  }
  function makeQuestion(level) {
    if (level <= 3) return sumQuestion(level);
    if (level === 4) return missingQuestion();
    if (level === 5) return doubleQuestion();
    return hopQuestion();
  }

  // Wrong options look like real slips: off by one, off by ten, the wrong step…
  function options(q) {
    const wrong = shuffle((q.extra || []).concat(shuffle(q.slips).map((d) => q.answer + d)))
      // never a number already written in the question
      .filter((n, i, all) => n >= 0 && n <= 100 && n !== q.answer && all.indexOf(n) === i && !(q.parts || []).includes(n));
    return shuffle([q.answer, wrong[0], wrong[1]]);
  }
  function questionHTML(q) {
    const hole = '<span class="q">?</span>';
    if (q.kind === 'double' || q.kind === 'half') {
      return `🪞 ${M.t(q.kind === 'double' ? TEXT.double : TEXT.half).replace('{n}', q.n)} = ${hole}`;
    }
    const sep = q.kind === 'hop' ? ', ' : ' ';
    return (q.kind === 'hop' ? '🦘 ' : '') + q.parts.map((p) => (p === '?' ? hole : p)).join(sep);
  }

  // ---------- Collection ----------
  function owned() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function golden() {
    try { return JSON.parse(localStorage.getItem(GOLD_KEY)) || []; } catch (e) { return []; }
  }
  function addTo(key, c) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { /* ignore */ }
    if (!list.includes(c)) list.push(c);
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }
  const creatureOf = (e) => CREATURES.find((c) => c.e === e);

  // ---------- Characters ----------
  const XIRUCA_SVG = `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M24 130 q2 -36 26 -38 q24 2 26 38 z" fill="#7b4fd6" stroke="#3a3a5c" stroke-width="3"/>
    <path d="M44 96 l6 10 l6 -10" fill="#ffd23f" stroke="#3a3a5c" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M22 66 q-10 18 -4 30 l8 -4 q-4 -12 6 -22 z M78 66 q10 18 4 30 l-8 -4 q4 -12 -6 -22 z" fill="#ff7b3a" stroke="#3a3a5c" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="50" cy="68" r="24" fill="#ffd9b8" stroke="#3a3a5c" stroke-width="3"/>
    <g fill="#d9824a"><circle cx="38" cy="74" r="1.6"/><circle cx="42" cy="77" r="1.6"/><circle cx="58" cy="77" r="1.6"/><circle cx="62" cy="74" r="1.6"/></g>
    <g class="eyes"><ellipse cx="41" cy="66" rx="3.6" ry="4.6" fill="#3a3a5c"/><ellipse cx="59" cy="66" rx="3.6" ry="4.6" fill="#3a3a5c"/>
      <circle cx="42.4" cy="64.4" r="1.4" fill="#fff"/><circle cx="60.4" cy="64.4" r="1.4" fill="#fff"/></g>
    <path d="M41 80 q9 8 18 0" fill="#ff6f91" stroke="#3a3a5c" stroke-width="2.5" stroke-linejoin="round"/>
    <g class="hat"><path d="M14 52 q36 -12 72 0 q-4 6 -36 8 q-32 -2 -36 -8 z" fill="#5b2a86" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
      <path d="M28 50 L48 6 q6 -6 14 2 q-6 -2 -8 4 L72 50 z" fill="#6a35a0" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
      <rect x="28" y="40" width="44" height="8" fill="#2ec4b6" stroke="#3a3a5c" stroke-width="2.5"/>
      <path d="M52 22 l2.5 5 5.5 .8 -4 3.8 1 5.4 -5 -2.6 -5 2.6 1 -5.4 -4 -3.8 5.5 -.8 z" fill="#ffd23f" stroke="#3a3a5c" stroke-width="1.5"/></g>
  </svg>`;
  const CAT_SVG = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cat-tail" d="M56 70 q22 -4 16 -26 q-2 -8 -8 -6" fill="none" stroke="#2b2b3a" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="40" cy="62" rx="20" ry="16" fill="#2b2b3a" stroke="#3a3a5c" stroke-width="2.5"/>
    <path d="M22 34 l2 -18 l12 10 z M58 34 l-2 -18 l-12 10 z" fill="#2b2b3a" stroke="#3a3a5c" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M25 30 l1.5 -9 l6 5 z M55 30 l-1.5 -9 l-6 5 z" fill="#ff9ec7"/>
    <circle cx="40" cy="38" r="18" fill="#2b2b3a" stroke="#3a3a5c" stroke-width="2.5"/>
    <g class="cat-eyes"><ellipse cx="33" cy="36" rx="4" ry="5" fill="#ffd23f"/><ellipse cx="47" cy="36" rx="4" ry="5" fill="#ffd23f"/>
      <ellipse cx="33" cy="36" rx="1.4" ry="4" fill="#2b2b3a"/><ellipse cx="47" cy="36" rx="1.4" ry="4" fill="#2b2b3a"/></g>
    <path d="M38 43 h4 l-2 2.5 z" fill="#ff9ec7"/>
    <path d="M28 44 h-12 M28 47 l-11 3 M52 44 h12 M52 47 l11 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
  let sayTimer;
  function xiSay(line, speak) {
    const el = $('say');
    el.textContent = M.t(line);
    el.hidden = false;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    if (speak) M.speak(M.t(line), M.lang);
  }
  function catSay(line) {
    const el = $('cat-say');
    el.textContent = M.t(line);
    el.hidden = false;
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => { el.hidden = true; }, 1600);
  }
  function bob(id, cls) {
    const el = $(id);
    el.classList.remove('hop', 'oops'); void el.offsetWidth; el.classList.add(cls);
  }

  // ---------- Text ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    $('ask').textContent = M.t(TEXT.ask);
    [1, 2, 3, 4, 5, 6].forEach((i) => { $(`l${i}-name`).textContent = M.t(TEXT['l' + i]); });
    $('l5-sub').textContent = M.t(TEXT.l5sub);
    $('win-text').textContent = M.t(TEXT.win);
    $('garden-label').textContent = M.t(TEXT.garden);
    $('garden-title').textContent = M.t(TEXT.garden);
    const count = `${owned().filter(creatureOf).length}/${CREATURES.length}`;
    $('garden-count').textContent = count;
    $('garden-count2').textContent = count;
    if (current && !$('play').hidden) $('question').innerHTML = questionHTML(current);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  ['xiruca-levels', 'xiruca'].forEach((id) => { $(id).innerHTML = XIRUCA_SVG; });
  $('cat').insertAdjacentHTML('afterbegin', CAT_SVG);
  M.music.button($('music'));
  M.music.button($('music-levels'));
  M.music.play('potion');

  // ---------- Cauldron ----------
  const liquid = $('liquid');
  const potBubbles = $('pot-bubbles');
  potBubbles.innerHTML = Array.from({ length: 6 }, (_, i) =>
    `<circle cx="${50 + i * 20}" cy="${8 + (i % 3) * 6}" r="${4 + (i % 3) * 2}" style="animation-delay:${-i * 0.27}s"/>`).join('');

  function setLevel(n, color) {
    const y = 145 - n * ((145 - 62) / ROUND);
    liquid.style.transform = potBubbles.style.transform = `translateY(${y}px)`;
    if (color) liquid.setAttribute('fill', color);
  }

  function splash(color) {
    const s = $('splash');
    s.innerHTML = Array.from({ length: 10 }, () => {
      const dx = rand(-70, 70), dy = rand(-90, -20);
      return `<i style="background:${color};--dx:${dx}px;--dy:${dy}px"></i>`;
    }).join('');
  }
  function smoke() {
    const s = $('smoke');
    s.hidden = false;
    s.style.animation = 'none'; void s.offsetWidth; s.style.animation = '';
    setTimeout(() => { s.hidden = true; }, 1500);
  }

  // ---------- Game ----------
  let level = 1, done = 0, current = null, busy = false, seen = new Set();

  // The Mellis rule: 3 hearts, "oh oh" + pause on mistakes, 0 hearts = new round
  const round = M.round({ heartsEl: $('hearts'), onOut: () => start(level) });

  function start(lvl) {
    level = lvl;
    round.start();
    done = 0;
    seen = new Set();
    $('levels').hidden = true;
    $('win').hidden = true;
    $('garden').hidden = true;
    $('play').hidden = false;
    $('progress').innerHTML = '<span></span>'.repeat(ROUND);
    liquid.style.transition = 'none';
    setLevel(0, '#7ef0e6');
    void liquid.getBoundingClientRect();
    liquid.style.transition = '';
    xiSay(pick(XI.hello), true);
    next();
  }

  function next() {
    let q;
    do { q = makeQuestion(level); } while (seen.has(q.key) && seen.size < 60);
    seen.add(q.key);
    current = q;
    busy = false;
    const qel = $('question');
    qel.innerHTML = questionHTML(q);
    qel.classList.toggle('long', q.kind === 'hop' || q.kind === 'double' || q.kind === 'half');
    const colors = shuffle(COLORS.slice());
    $('answers').innerHTML = options(q).map((n, i) =>
      `<button class="bottle" data-n="${n}" style="background:${colors[i]}">${n}</button>`).join('');
  }

  $('answers').addEventListener('click', (e) => {
    const btn = e.target.closest('.bottle');
    if (!btn || busy) return;
    if (+btn.dataset.n !== current.answer) {
      btn.classList.add('wrong');
      busy = true;
      smoke();
      xiSay(pick(XI.no));
      catSay(pick(CAT.no));
      bob('xiruca', 'oops');
      round.wrong(current.key).then(({ reveal }) => {
        if (!reveal) { busy = false; return; }
        // 2nd miss: show the right bottle, then pour it
        const right = [...$('answers').children].find((b) => +b.dataset.n === current.answer);
        right.classList.add('reveal');
        xiSay(XI.reveal);
        setTimeout(() => pour(right), 1400);
      });
      return;
    }
    busy = true;
    xiSay(pick(XI.yes));
    if (Math.random() < 0.4) catSay(pick(CAT.yes));
    bob('xiruca', 'hop');
    pour(btn);
  });

  function pour(btn) {
    const color = btn.style.background;
    $('question').querySelector('.q').textContent = current.answer;
    M.sounds.pop();
    flyInto(btn, color, () => {
      done++;
      M.sounds.match();
      splash(color);
      setLevel(done, color);
      const dot = $('progress').children[done - 1];
      dot.style.background = color;
      dot.classList.add('full');
      const pot = $('cauldron');
      pot.classList.remove('stir'); void pot.offsetWidth; pot.classList.add('stir');
      if (done === ROUND) setTimeout(finish, 600);
      else setTimeout(next, 700);
    });
  }

  // A drop of the bottle's colour arcs into the cauldron.
  function flyInto(btn, color, then) {
    const from = btn.getBoundingClientRect();
    const to = $('cauldron').getBoundingClientRect();
    const drop = document.createElement('div');
    drop.className = 'flyer';
    drop.style.background = color;
    drop.style.left = from.left + from.width / 2 - 20 + 'px';
    drop.style.top = from.top + 'px';
    document.body.appendChild(drop);
    btn.classList.add('gone');
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height * 0.3 - from.top;
    const anim = drop.animate([
      { transform: 'translate(0,0) scale(1)' },
      { transform: `translate(${dx * 0.5}px, ${dy - 80}px) scale(1.3)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.6)` },
    ], { duration: 550, easing: 'ease-in' });
    // fallback: some phones pause animations (low-power mode, hidden tab) and never finish them
    let landed = false;
    const land = () => { if (landed) return; landed = true; drop.remove(); then(); };
    anim.onfinish = land;
    setTimeout(land, 900);
  }

  function finish() {
    const pot = $('cauldron');
    pot.classList.remove('stir', 'boom'); void pot.offsetWidth; pot.classList.add('boom');
    M.sounds.boing();
    setTimeout(() => {
      const have = owned();
      const fresh = CREATURES.filter((c) => !have.includes(c.e));
      const creature = pick(fresh.length ? fresh : CREATURES);
      addTo(STORE_KEY, creature.e);
      const stars = round.stars();
      if (stars === 3) addTo(GOLD_KEY, creature.e);
      $('win-stars').innerHTML = M.starsHTML(stars);
      const el = $('creature');
      el.textContent = creature.e;
      el.classList.toggle('golden', stars === 3);
      el.style.background = stars === 3 ? 'radial-gradient(circle, #fff6c9, #ffd23f)' : pick(COLORS);
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
      $('creature-name').textContent = M.t(creature);
      $('win').hidden = false;
      renderText();
      M.sounds.win();
      M.confetti();
      M.speak(`${M.t(TEXT.win).replace(/[¡!]/g, '')} ${M.t(creature)}`, M.lang);
    }, 800);
  }

  // ---------- The magic garden ----------
  function openGarden() {
    const have = owned().map(creatureOf).filter(Boolean), gold = golden();
    const field = $('garden-field');
    const shuffled = shuffle(have.map((_, i) => i));
    field.innerHTML = have.map((c, i) => {
      // each creature wanders around its own spot on a loose grid, so they don't pile up
      const cols = 4, rows = Math.max(3, Math.ceil(have.length / cols)), cell = shuffled[i];
      const x = 2 + ((cell % cols) + 0.15 + Math.random() * 0.5) / cols * 82;
      const y = 2 + (Math.floor(cell / cols) + 0.1 + Math.random() * 0.5) / rows * 80;
      return `<button class="critter${gold.includes(c.e) ? ' gold' : ''}" data-e="${c.e}"
        style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--dx:${rand(-30, 30)}px;--dy:${rand(-20, 20)}px;animation-duration:${(3 + Math.random() * 3).toFixed(1)}s;animation-delay:${(-Math.random() * 3).toFixed(1)}s">${c.e}</button>`;
    }).join('');
    $('garden-name').textContent = have.length ? '👆' : '🥚 ?';
    renderText();
    $('garden').hidden = false;
  }
  $('garden-field').addEventListener('click', (e) => {
    const b = e.target.closest('.critter');
    if (!b) return;
    const c = creatureOf(b.dataset.e);
    b.classList.remove('jump'); void b.offsetWidth; b.classList.add('jump');
    M.sounds[pick(['boing', 'giggle', 'pop'])]();
    $('garden-name').textContent = `${c.e} ${M.t(c)}`;
    M.speak(M.t(c), M.lang);
  });

  function showLevels() {
    $('play').hidden = true;
    $('win').hidden = true;
    $('garden').hidden = true;
    $('levels').hidden = false;
    renderText();
  }

  document.querySelectorAll('.level').forEach((b) =>
    b.addEventListener('click', () => { M.sounds.pop(); start(+b.dataset.level); }));
  $('again').addEventListener('click', () => { M.sounds.pop(); start(level); });
  $('other').addEventListener('click', () => { M.sounds.pop(); showLevels(); });
  $('to-garden').addEventListener('click', () => { M.sounds.pop(); showLevels(); openGarden(); });
  $('open-garden').addEventListener('click', () => { M.sounds.pop(); openGarden(); });
  $('close-garden').addEventListener('click', () => { M.sounds.pop(); $('garden').hidden = true; });

  renderText();
  // test hook
  window.__potions = () => ({ current, level, done, busy, makeQuestion, options });
})();
