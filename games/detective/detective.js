(function () {
  const M = window.Mellis;
  const INK = '#3a3a5c';
  const SOLVED_KEY = 'mellis.detective.solved';

  // ---------- Content ----------
  const ANIMALS = ['🦊', '🐱', '🐰', '🐻', '🐭', '🐸', '🐷', '🐼', '🐵', '🐶', '🐯', '🐨'];
  const SHOES = ['boots', 'trainers', 'paws'];
  const SHOE_ICON = { boots: '👢', trainers: '👟', paws: '🐾' };
  const SCARVES = {
    red: { hex: '#e5383b', ca: 'VERMELLA', es: 'ROJA', en: 'RED' },
    blue: { hex: '#3a86ff', ca: 'BLAVA', es: 'AZUL', en: 'BLUE' },
    green: { hex: '#2fbf71', ca: 'VERDA', es: 'VERDE', en: 'GREEN' },
    pink: { hex: '#ff6fb5', ca: 'ROSA', es: 'ROSA', en: 'PINK' },
  };
  const CRIMES = [
    { item: '🎂', ca: 'Qui s\'ha menjat el pastís?', es: '¿Quién se ha comido la tarta?', en: 'Who ate the cake?' },
    { item: '👑', ca: 'Qui ha robat la corona?', es: '¿Quién ha robado la corona?', en: 'Who stole the crown?' },
    { item: '🍪', ca: 'Qui s\'ha endut les galetes?', es: '¿Quién se ha llevado las galletas?', en: 'Who took the cookies?' },
    { item: '💎', ca: 'Qui ha robat el diamant?', es: '¿Quién ha robado el diamante?', en: 'Who stole the diamond?' },
    { item: '🧸', ca: 'Qui s\'ha endut l\'osset de peluix?', es: '¿Quién se ha llevado el osito de peluche?', en: 'Who took the teddy bear?' },
    { item: '🏆', ca: 'Qui ha amagat el trofeu?', es: '¿Quién ha escondido el trofeo?', en: 'Who hid the trophy?' },
  ];
  // **word** is shown in bold red and spoken in lower case.
  const CLUES = {
    shoes: {
      boots: { ca: 'El lladre porta **botes**.', es: 'El ladrón lleva **botas**.', en: 'The thief wears **boots**.' },
      trainers: { ca: 'El lladre porta **bambes**.', es: 'El ladrón lleva **zapatillas**.', en: 'The thief wears **trainers**.' },
      paws: { ca: 'El lladre va **descalç**.', es: 'El ladrón va **descalzo**.', en: 'The thief has **no shoes**.' },
    },
    scarf: (c) => ({
      ca: `La bufanda del lladre és **${SCARVES[c].ca}**.`,
      es: `La bufanda del ladrón es **${SCARVES[c].es}**.`,
      en: `The thief's scarf is **${SCARVES[c].en}**.`,
    }),
    hat: {
      true: { ca: 'El lladre **porta barret**.', es: 'El ladrón **lleva sombrero**.', en: 'The thief **wears a hat**.' },
      false: { ca: 'El lladre **NO porta barret**.', es: 'El ladrón **NO lleva sombrero**.', en: 'The thief does **NOT wear a hat**.' },
    },
    glasses: {
      true: { ca: 'El lladre **porta ulleres**.', es: 'El ladrón **lleva gafas**.', en: 'The thief **wears glasses**.' },
      false: { ca: 'El lladre **NO porta ulleres**.', es: 'El ladrón **NO lleva gafas**.', en: 'The thief does **NOT wear glasses**.' },
    },
  };
  const CLUE_ICON = { shoes: '👣', scarf: '🧣', hat: '🎩', glasses: '👓' };

  const TEXT = {
    title: { ca: 'Agència de detectives Mellis', es: 'Agencia de detectives Mellis', en: 'Mellis Detective Agency' },
    newCase: { ca: 'Nou cas', es: 'Nuevo caso', en: 'New case' },
    caseNo: { ca: 'CAS', es: 'CASO', en: 'CASE' },
    start: { ca: 'Comencem!', es: '¡Empecemos!', en: "Let's go!" },
    foot: { ca: 'Hem trobat una petjada! Qui l\'ha deixat?', es: '¡Hemos encontrado una huella! ¿Quién la ha dejado?', en: 'We found a footprint! What made it?' },
    code: { ca: 'El lladre ha deixat una nota secreta. Desxifra-la!', es: 'El ladrón ha dejado una nota secreta. ¡Descífrala!', en: 'The thief left a secret note. Crack the code!' },
    suspects: { ca: 'Ratlla els sospitosos que no encaixen amb les pistes!', es: '¡Tacha a los sospechosos que no encajan con las pistas!', en: "Cross out the suspects who don't match the clues!" },
    notYet: { ca: 'Mira bé les pistes!', es: '¡Mira bien las pistas!', en: 'Check the clues!' },
    print: { ca: 'Demostra-ho! Quina empremta és igual?', es: '¡Demuéstralo! ¿Qué huella es igual?', en: 'Prove it! Which fingerprint is the same?' },
    newClue: { ca: 'Nova pista!', es: '¡Nueva pista!', en: 'New clue!' },
    caught: { ca: 'Cas resolt!', es: '¡Caso resuelto!', en: 'Case solved!' },
  };
  const RANKS = [
    [0, { ca: 'Detectiva en pràctiques', es: 'Detective en prácticas', en: 'Trainee detective' }],
    [3, { ca: 'Detectiva', es: 'Detective', en: 'Detective' }],
    [6, { ca: 'Superdetectiva', es: 'Superdetective', en: 'Super detective' }],
    [10, { ca: 'Detectiva llegendària', es: 'Detective legendaria', en: 'Legendary detective' }],
  ];
  const SYMBOLS = ['⭐', '🌙', '❤️', '🍀', '💎', '🔺', '⚡', '🍄', '🌸', '🎈', '🔑', '🎵', '🍭', '🐟'];

  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const bold = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const plain = (s) => s.replace(/\*\*(.+?)\*\*/g, (_, w) => w.toLowerCase());
  function say(text) { M.speak(plain(text), M.lang); }
  function bump(el) { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); }

  function solvedCount() {
    try { return parseInt(localStorage.getItem(SOLVED_KEY), 10) || 0; } catch (e) { return 0; }
  }
  function setSolved(n) {
    try { localStorage.setItem(SOLVED_KEY, String(n)); } catch (e) { /* ignore */ }
  }
  function rankFor(n) { return RANKS.filter(([min]) => n >= min).pop()[1]; }

  // ---------- Case generator ----------
  const keyOf = (s) => [s.shoes, s.scarf, s.hat, s.glasses].join('|');
  const matches = (s, c) => s[c.attr] === c.val;

  function randomLook() {
    return { shoes: pick(SHOES), scarf: pick(Object.keys(SCARVES)), hat: Math.random() < 0.5, glasses: Math.random() < 0.5 };
  }

  // Six suspects; clues revealed in order, each one rules out somebody new,
  // and together they leave only the thief.
  function makeCase() {
    for (;;) {
      const animals = shuffle(ANIMALS.slice()).slice(0, 6);
      const thief = randomLook();
      const looks = [thief];
      // a look-alike: same shoes & scarf, so hat / glasses clues are needed
      const twin = { ...thief };
      if (Math.random() < 0.5) twin.hat = !twin.hat; else twin.glasses = !twin.glasses;
      looks.push(twin);
      while (looks.length < 6) {
        const l = randomLook();
        if (!looks.some((x) => keyOf(x) === keyOf(l))) looks.push(l);
      }
      const suspects = shuffle(looks.map((l, i) => ({ ...l, animal: animals[i], thief: i === 0 })));

      const clues = [{ attr: 'shoes', val: thief.shoes }, { attr: 'scarf', val: thief.scarf }];
      shuffle(['hat', 'glasses']).forEach((attr) => clues.push({ attr, val: thief[attr] }));

      // keep only clues that rule someone out; check the result is unique
      let left = suspects;
      const used = [];
      for (const c of clues) {
        const next = left.filter((s) => matches(s, c));
        if (next.length < left.length) { used.push(c); left = next; }
        else if (used.length < 2) break; // footprint & note clues must both count
      }
      if (used.length < 3 || left.length !== 1 || !left[0].thief) continue;
      if (used[0].attr !== 'shoes' || used[1].attr !== 'scarf') continue;
      return {
        crime: pick(CRIMES),
        suspects,
        clues: used,
        codeType: Math.random() < 0.5 ? 'symbols' : 'numbers',
        print: makePrint(),
      };
    }
  }
  window.__makeCase = makeCase; // for testing in the console

  // ---------- Drawings ----------
  function suspectSVG(s) {
    const sc = SCARVES[s.scarf].hex;
    const hat = s.hat
      ? `<g><rect x="30" y="2" width="40" height="26" rx="4" fill="${INK}"/><rect x="30" y="20" width="40" height="6" fill="#e9c88f"/><rect x="20" y="26" width="60" height="7" rx="3.5" fill="${INK}"/></g>`
      : '';
    const glasses = s.glasses
      ? `<g fill="rgba(255,255,255,.35)" stroke="${INK}" stroke-width="4"><circle cx="38" cy="64" r="10"/><circle cx="62" cy="64" r="10"/><path d="M48 63 h4" fill="none"/></g>`
      : '';
    return `<svg viewBox="0 0 100 146" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="90" font-size="58" text-anchor="middle">${s.animal}</text>
      ${hat}${glasses}
      <path d="M22 96 Q50 108 78 96 L80 106 Q50 118 20 106 Z" fill="${sc}" stroke="${INK}" stroke-width="3"/>
      <path d="M62 106 l4 16 l10 -2 l-6 -16 z" fill="${sc}" stroke="${INK}" stroke-width="3"/>
      <text x="50" y="143" font-size="26" text-anchor="middle">${SHOE_ICON[s.shoes]}</text>
    </svg>`;
  }

  function footprintSVG(type) {
    const mud = '#7a5233';
    if (type === 'paws') {
      return `<svg viewBox="0 0 60 120"><g fill="${mud}">
        <ellipse cx="30" cy="78" rx="18" ry="16"/><ellipse cx="12" cy="52" rx="6" ry="8"/>
        <ellipse cx="24" cy="42" rx="6" ry="8"/><ellipse cx="36" cy="42" rx="6" ry="8"/><ellipse cx="48" cy="52" rx="6" ry="8"/></g></svg>`;
    }
    if (type === 'boots') {
      let tread = '';
      for (let y = 14; y < 74; y += 10) tread += `<path d="M12 ${y} l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5" fill="none" stroke="#fffaf0" stroke-width="3"/>`;
      return `<svg viewBox="0 0 60 120"><path d="M30 4 C48 4 54 24 52 46 C50 62 46 70 46 78 L14 78 C14 70 10 62 8 46 C6 24 12 4 30 4 Z" fill="${mud}"/>
        ${tread}<rect x="15" y="86" width="30" height="30" rx="6" fill="${mud}"/>
        <path d="M19 94 h22 M19 102 h22 M19 110 h22" stroke="#fffaf0" stroke-width="3"/></svg>`;
    }
    let waves = '';
    for (let y = 16; y < 110; y += 9) waves += `<path d="M10 ${y} q5 -4 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#fffaf0" stroke-width="2.5"/>`;
    return `<svg viewBox="0 0 60 120"><path d="M30 2 C50 2 54 26 52 50 C50 70 50 90 48 104 C46 118 14 118 12 104 C10 90 10 70 8 50 C6 26 10 2 30 2 Z" fill="${mud}"/>${waves}</svg>`;
  }

  // Fingerprints: three ridge patterns, optionally crossed by a scar.
  const PRINT_TYPES = ['whorl', 'loop', 'arch'];
  let printId = 0;
  function makePrint() {
    return { type: pick(PRINT_TYPES), scar: Math.random() < 0.5, tilt: pick([-15, 0, 15]) };
  }
  function printSVG(p) {
    const id = 'fp' + (printId++);
    let ridges = '';
    if (p.type === 'whorl') {
      for (let r = 5; r < 64; r += 6) ridges += `<ellipse cx="50" cy="58" rx="${r}" ry="${r * 1.25}"/>`;
    } else if (p.type === 'loop') {
      for (let r = 4; r < 56; r += 6) ridges += `<path d="M${50 - r} 130 L${50 - r} 52 A${r} ${r} 0 0 1 ${50 + r} 52 L${50 + r} 130"/>`;
    } else {
      for (let y = 8; y < 125; y += 7) {
        const bump = Math.max(0, 1 - Math.abs(y - 60) / 70) * 26;
        ridges += `<path d="M-10 ${y} Q50 ${y - bump} 110 ${y}"/>`;
      }
    }
    const scar = p.scar ? `<path d="M10 40 L90 78" stroke="#fffdf5" stroke-width="7"/>` : '';
    return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="${id}"><ellipse cx="50" cy="60" rx="40" ry="54"/></clipPath></defs>
      <g clip-path="url(#${id})"><g transform="rotate(${p.tilt} 50 60)" fill="none" stroke="${INK}" stroke-width="2.6">${ridges}</g>${scar}</g>
      <ellipse cx="50" cy="60" rx="40" ry="54" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="3 4" opacity=".5"/>
    </svg>`;
  }
  // Wrong options differ clearly: another pattern, or the scar added/removed.
  function printOptions(p) {
    const others = PRINT_TYPES.filter((t) => t !== p.type);
    return shuffle([
      { ...p, ok: true },
      { ...p, type: others[0] },
      { ...p, type: others[1], scar: !p.scar },
      { ...p, scar: !p.scar },
    ]);
  }

  // ---------- Screens ----------
  let kase = null, step = 'lobby', revealed = 0, codeIdx = 0, codeWord = '', codeMap = {};
  const STEPS = ['intro', 'foot', 'code', 'suspects', 'print'];

  function show(name) {
    $('lobby').hidden = name !== 'lobby';
    $('case').hidden = name === 'lobby';
    $('win').hidden = true;
    STEPS.forEach((s) => { $('step-' + s).hidden = s !== name; });
    const now = STEPS.indexOf(name);
    document.querySelectorAll('#steps span').forEach((el, i) => {
      el.classList.toggle('now', i === now);
      el.classList.toggle('done', i < now);
    });
    step = name;
    renderSayButtons();
  }

  function renderSayButtons() {
    document.querySelectorAll('.say').forEach((b) => { b.hidden = !M.canSpeak(M.lang); });
  }

  function renderLobby() {
    const n = solvedCount();
    $('rank').textContent = '🕵️ ' + M.t(rankFor(n));
    $('badges').innerHTML = n
      ? '🏅'.repeat(Math.min(n, 20)) + (n > 20 ? ` +${n - 20}` : '')
      : '<span class="empty">🏅🏅🏅</span>';
    $('new-case-label').textContent = M.t(TEXT.newCase);
  }

  // Re-render every text of the current screen (also used when the language changes).
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    renderLobby();
    renderSayButtons();
    if (!kase) return;
    $('case-no').textContent = `${M.t(TEXT.caseNo)} #${solvedCount() + 1}`;
    $('case-item').textContent = kase.crime.item;
    $('case-q').textContent = M.t(kase.crime);
    $('start-label').textContent = M.t(TEXT.start);
    $('foot-task').textContent = M.t(TEXT.foot);
    $('code-task').textContent = M.t(TEXT.code);
    $('sus-task').textContent = M.t(TEXT.suspects);
    $('print-task').textContent = M.t(TEXT.print);
    renderClues();
    if (step === 'code') startCode(); // the secret word changes with the language
    if (!$('clue-pop').hidden) $('clue-text').innerHTML = bold(clueText(kase.clues[revealed - 1]));
  }

  function clueText(c) {
    const set = c.attr === 'scarf' ? CLUES.scarf(c.val) : CLUES[c.attr][c.val];
    return M.t(set);
  }

  function renderClues() {
    $('clues').innerHTML = kase.clues.slice(0, revealed).map((c, i) =>
      `<li class="${i === revealed - 1 && step === 'suspects' ? 'fresh' : ''}"><span class="ci">${CLUE_ICON[c.attr]}</span><span>${bold(clueText(c))}</span></li>`).join('');
  }

  // Shows a clue card; `then` runs when she taps ➡️.
  let afterClue = null;
  function giveClue(then) {
    revealed++;
    const c = kase.clues[revealed - 1];
    $('clue-head').textContent = '📝 ' + M.t(TEXT.newClue);
    $('clue-text').innerHTML = bold(clueText(c));
    $('clue-pop').hidden = false;
    M.sounds.match();
    say(clueText(c));
    afterClue = then;
  }
  $('clue-next').addEventListener('click', () => {
    M.sounds.pop();
    $('clue-pop').hidden = true;
    if (afterClue) { const f = afterClue; afterClue = null; f(); }
  });

  // ---------- Steps ----------
  function newCase() {
    kase = makeCase();
    revealed = 0;
    show('intro');
    renderText();
    say(M.t(kase.crime));
  }

  function startFoot() {
    show('foot');
    const thiefShoes = kase.clues[0].val;
    $('footprint').innerHTML = footprintSVG(thiefShoes);
    $('foot-choices').innerHTML = shuffle(SHOES.slice()).map((s) =>
      `<button class="choice" data-shoe="${s}">${SHOE_ICON[s]}</button>`).join('');
    say(M.t(TEXT.foot));
  }
  $('foot-choices').addEventListener('click', (e) => {
    const b = e.target.closest('.choice');
    if (!b) return;
    if (b.dataset.shoe !== kase.clues[0].val) { M.sounds.miss(); bump(b); return; }
    giveClue(startCode);
  });

  function startCode() {
    show('code');
    codeWord = SCARVES[kase.clues[1].val][M.lang];
    codeIdx = 0;
    const letters = [...new Set(codeWord.split(''))];
    const pool = 'ABCDEFGHIJKLMNOPRSTUVZ'.split('').filter((l) => !letters.includes(l));
    const keyLetters = shuffle(letters.concat(shuffle(pool).slice(0, Math.max(0, 8 - letters.length))));
    const syms = shuffle(SYMBOLS.slice());
    codeMap = {};
    keyLetters.forEach((l, i) => {
      codeMap[l] = kase.codeType === 'numbers' ? String(l.charCodeAt(0) - 64) : syms[i];
    });
    $('note').classList.remove('solved');
    $('note').innerHTML = codeWord.split('').map((l, i) =>
      `<span class="slot${i === 0 ? ' now' : ''}"><span class="sym">${codeMap[l]}</span><span class="let"></span></span>`).join('');
    const keyOrder = kase.codeType === 'numbers'
      ? keyLetters.slice().sort()
      : keyLetters;
    $('key').innerHTML = keyOrder.map((l) =>
      `<button class="keybtn" data-l="${l}"><span class="sym">${codeMap[l]}</span><span class="let">${l}</span></button>`).join('');
  }
  $('key').addEventListener('click', (e) => {
    const b = e.target.closest('.keybtn');
    if (!b || codeIdx >= codeWord.length) return;
    if (b.dataset.l !== codeWord[codeIdx]) { M.sounds.miss(); bump(b); return; }
    M.sounds.flip();
    const slots = $('note').children;
    slots[codeIdx].querySelector('.let').textContent = b.dataset.l;
    slots[codeIdx].classList.remove('now');
    codeIdx++;
    if (codeIdx < codeWord.length) { slots[codeIdx].classList.add('now'); return; }
    $('note').classList.add('solved');
    setTimeout(() => giveClue(startSuspects), 600);
  });

  function startSuspects() {
    show('suspects');
    $('suspects').innerHTML = kase.suspects.map((s, i) =>
      `<button class="suspect" data-i="${i}">${suspectSVG(s)}</button>`).join('');
    renderClues();
    say(M.t(TEXT.suspects));
  }

  // A cross-out only counts if a clue she already has rules that suspect out.
  $('suspects').addEventListener('click', (e) => {
    const b = e.target.closest('.suspect');
    if (!b || b.classList.contains('out') || !$('clue-pop').hidden) return;
    const s = kase.suspects[+b.dataset.i];
    const known = kase.clues.slice(0, revealed);
    if (known.every((c) => matches(s, c))) {
      M.sounds.miss();
      b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
      say(M.t(TEXT.notYet));
      return;
    }
    b.classList.add('out');
    M.sounds.pop();
    const standing = kase.suspects.filter((x, i) => !$('suspects').children[i].classList.contains('out'));
    const pending = standing.filter((x) => !known.every((c) => matches(x, c)));
    if (pending.length) return;
    if (standing.length === 1) { setTimeout(startPrint, 700); return; }
    setTimeout(() => giveClue(renderClues), 500);
  });

  function startPrint() {
    show('print');
    $('print-scene').innerHTML = printSVG(kase.print);
    $('prints').innerHTML = printOptions(kase.print).map((p) =>
      `<button class="print" data-ok="${p.ok ? 1 : 0}">${printSVG(p)}</button>`).join('');
    say(M.t(TEXT.print));
  }
  $('prints').addEventListener('click', (e) => {
    const b = e.target.closest('.print');
    if (!b) return;
    if (b.dataset.ok !== '1') { M.sounds.miss(); bump(b); return; }
    solved();
  });

  function solved() {
    const n = solvedCount() + 1;
    setSolved(n);
    const thief = kase.suspects.find((s) => s.thief);
    $('win-text').textContent = M.t(TEXT.caught);
    $('caught').innerHTML = `${thief.animal}<small>${kase.crime.item}</small>`;
    $('win-rank').textContent = `🏅 ${n} · ${M.t(rankFor(n))}`;
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    say(M.t(TEXT.caught));
  }

  // ---------- Wiring ----------
  M.mountControls($('controls'));
  M.onLang(renderText);
  $('mascots').innerHTML = M.mascotsSVG('wave');
  show('lobby');
  renderText();
  if (window.speechSynthesis) speechSynthesis.addEventListener('voiceschanged', renderSayButtons);

  $('new-case').addEventListener('click', () => { M.sounds.pop(); newCase(); });
  $('start-case').addEventListener('click', () => { M.sounds.pop(); startFoot(); });
  $('again').addEventListener('click', () => { M.sounds.pop(); newCase(); });
  $('to-lobby').addEventListener('click', () => { M.sounds.pop(); kase = null; show('lobby'); renderText(); });
  document.querySelectorAll('.say').forEach((b) => b.addEventListener('click', () => {
    M.sounds.pop();
    if (b.dataset.say === 'clues') say(kase.clues.slice(0, revealed).map(clueText).join(' '));
    else say($(b.dataset.say).textContent);
  }));
})();
