(function () {
  const M = window.Mellis;
  const ROUND = 5;            // monsters per party
  const INK = '#3a3a5c';
  const GREY = '#d9d9e3';     // not painted yet

  // ---------- Vocabulary ----------
  const COLORS = [
    { id: 'green', hex: '#6fd36f', en: 'green', ca: 'verd', es: 'verde' },
    { id: 'purple', hex: '#a86bea', en: 'purple', ca: 'lila', es: 'morado' },
    { id: 'orange', hex: '#ff9f1c', en: 'orange', ca: 'taronja', es: 'naranja' },
    { id: 'blue', hex: '#4aa3ff', en: 'blue', ca: 'blau', es: 'azul' },
    { id: 'pink', hex: '#ff8cc6', en: 'pink', ca: 'rosa', es: 'rosa' },
    { id: 'red', hex: '#ff5a5a', en: 'red', ca: 'vermell', es: 'rojo' },
    { id: 'yellow', hex: '#ffd23f', en: 'yellow', ca: 'groc', es: 'amarillo' },
  ];
  const EYES = [
    { id: 1, en: 'one eye', ca: 'un ull', es: 'un ojo' },
    { id: 2, en: 'two eyes', ca: 'dos ulls', es: 'dos ojos' },
    { id: 3, en: 'three eyes', ca: 'tres ulls', es: 'tres ojos' },
    { id: 4, en: 'four eyes', ca: 'quatre ulls', es: 'cuatro ojos' },
    { id: 5, en: 'five eyes', ca: 'cinc ulls', es: 'cinco ojos' },
  ];
  const TOPS = [
    { id: 'horns', en: 'horns', ca: 'banyes', es: 'cuernos' },
    { id: 'hat', en: 'a witch hat', ca: 'un barret de bruixa', es: 'un sombrero de bruja' },
    { id: 'ears', en: 'big ears', ca: 'orelles grans', es: 'orejas grandes' },
    { id: 'bow', en: 'a bow', ca: 'un llaç', es: 'un lazo' },
  ];
  const MOUTHS = [
    { id: 'smile', en: 'a big smile', ca: 'un gran somriure', es: 'una gran sonrisa' },
    { id: 'teeth', en: 'sharp teeth', ca: 'dents punxegudes', es: 'dientes afilados' },
    { id: 'tongue', en: 'a long tongue', ca: 'una llengua llarga', es: 'una lengua larga' },
  ];
  const PARTS = {
    color: { icon: '🎨', list: COLORS },
    eyes: { icon: '👀', list: EYES },
    top: { icon: '🎩', list: TOPS },
    mouth: { icon: '👄', list: MOUTHS },
  };
  const LEVEL_PARTS = { 1: ['color', 'eyes'], 2: ['color', 'eyes', 'top'], 3: ['color', 'eyes', 'top', 'mouth'] };

  const TEXT = {
    title: { ca: 'Laboratori de monstres', es: 'Laboratorio de monstruos', en: 'Monster Lab' },
    ask: { ca: 'Tria un nivell!', es: '¡Elige un nivel!', en: 'Pick a level!' },
    l1: { ca: 'Fàcil', es: 'Fácil', en: 'Easy' },
    l2: { ca: 'Mitjà', es: 'Medio', en: 'Medium' },
    l3: { ca: 'Difícil', es: 'Difícil', en: 'Hard' },
    win: { ca: 'Quina festa de monstres!', es: '¡Qué fiesta de monstruos!', en: 'What a monster party!' },
  };

  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const find = (part, id) => PARTS[part].list.find((o) => o.id === id);

  // ---------- Drawing ----------
  const EYE_LAYOUT = {
    1: [[100, 92, 22]],
    2: [[76, 92, 15], [124, 92, 15]],
    3: [[68, 98, 13], [100, 80, 13], [132, 98, 13]],
    4: [[62, 100, 11], [87, 84, 11], [113, 84, 11], [138, 100, 11]],
    5: [[60, 104, 10], [80, 86, 10], [100, 76, 10], [120, 86, 10], [140, 104, 10]],
  };

  function monsterSVG(s, viewBox) {
    const fill = s.color ? find('color', s.color).hex : GREY;
    const line = `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
    let behind = '', front = '';

    // arms
    behind += `<ellipse cx="34" cy="148" rx="12" ry="24" transform="rotate(28 34 148)" fill="${fill}" ${line}/>` +
      `<ellipse cx="166" cy="148" rx="12" ry="24" transform="rotate(-28 166 148)" fill="${fill}" ${line}/>`;

    // top
    if (s.top === 'ears') {
      behind += `<ellipse cx="42" cy="70" rx="16" ry="28" transform="rotate(-35 42 70)" fill="${fill}" ${line}/>` +
        `<ellipse cx="42" cy="70" rx="7" ry="16" transform="rotate(-35 42 70)" fill="#ffb3d0"/>` +
        `<ellipse cx="158" cy="70" rx="16" ry="28" transform="rotate(35 158 70)" fill="${fill}" ${line}/>` +
        `<ellipse cx="158" cy="70" rx="7" ry="16" transform="rotate(35 158 70)" fill="#ffb3d0"/>`;
    } else if (s.top === 'horns') {
      front += `<path d="M70 56 Q50 30 56 10 Q72 32 88 46 Z" fill="#fff4d6" ${line}/>` +
        `<path d="M130 56 Q150 30 144 10 Q128 32 112 46 Z" fill="#fff4d6" ${line}/>`;
    } else if (s.top === 'hat') {
      front += `<g transform="rotate(-8 100 40)">` +
        `<path d="M72 42 L106 -26 Q110 -30 112 -24 L128 42 Z" fill="#3a2a5c" ${line}/>` +
        `<path d="M76 32 L126 32 L128 42 L72 42 Z" fill="#ff9f1c" ${line}/>` +
        `<ellipse cx="100" cy="44" rx="54" ry="9" fill="#3a2a5c" ${line}/></g>`;
    } else if (s.top === 'bow') {
      front += `<g transform="translate(140 44) rotate(15)">` +
        `<path d="M0 0 L-20 -12 L-20 12 Z M0 0 L20 -12 L20 12 Z" fill="#ff6fb5" ${line}/>` +
        `<circle r="6" fill="#ff6fb5" ${line}/></g>`;
    }

    // body + belly
    const body = `<path d="M45 205 C30 150 25 80 60 50 C85 28 115 28 140 50 C175 80 170 150 155 205 ` +
      `Q141 194 127 205 Q114 194 100 205 Q86 194 73 205 Q59 194 45 205 Z" fill="${fill}" ${line}/>` +
      `<ellipse cx="100" cy="170" rx="34" ry="24" fill="rgba(255,255,255,.28)"/>`;

    // eyes
    let eyes = '';
    if (s.eyes) {
      eyes = EYE_LAYOUT[s.eyes].map(([x, y, r]) =>
        `<g class="blink"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3.5"/>` +
        `<circle cx="${x + r * 0.15}" cy="${y + r * 0.2}" r="${r * 0.5}" fill="${INK}"/>` +
        `<circle cx="${x + r * 0.35}" cy="${y - r * 0.05}" r="${r * 0.18}" fill="#fff"/></g>`).join('');
    } else {
      eyes = `<path d="M64 94 q12 9 24 0 M112 94 q12 9 24 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    }

    // mouth
    let mouth;
    if (s.mouth === 'smile') {
      mouth = `<path d="M70 130 Q100 170 130 130 Z" fill="#5a1a3a" ${line}/>` +
        `<ellipse cx="100" cy="146" rx="12" ry="5" fill="#ff7aa8"/>`;
    } else if (s.mouth === 'teeth') {
      let teeth = '';
      for (let x = 72; x < 128; x += 9.5) teeth += `<path d="M${x} 131 l4.75 10 l4.75 -10 z" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
      mouth = `<path d="M70 130 Q100 166 130 130 Z" fill="#5a1a3a" ${line}/>` + teeth;
    } else if (s.mouth === 'tongue') {
      mouth = `<path d="M92 138 v18 a9 9 0 0 0 18 0 v-18 z" fill="#ff7aa8" ${line}/>` +
        `<path d="M78 134 q22 12 44 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    } else {
      mouth = `<path d="M86 138 q14 6 28 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    }
    const cheeks = `<circle cx="58" cy="128" r="7" fill="#ff9ec7" opacity=".6"/><circle cx="142" cy="128" r="7" fill="#ff9ec7" opacity=".6"/>`;

    return `<svg viewBox="${viewBox || '0 -30 200 250'}" xmlns="http://www.w3.org/2000/svg">` +
      behind + body + cheeks + eyes + mouth + front + '</svg>';
  }

  // ---------- Orders ----------
  function joinList(items, and) {
    return items.length < 2 ? items.join('') : items.slice(0, -1).join(', ') + ` ${and} ` + items[items.length - 1];
  }

  function orderText(order, lang, html) {
    const word = (part) => {
      const w = find(part, order[part])[lang];
      if (!html) return w;
      const style = part === 'color' ? ` style="background:${find('color', order.color).hex}"` : '';
      return `<b${style}>${w.toUpperCase()}</b>`;
    };
    const color = word('color');
    const extras = ['eyes', 'top', 'mouth'].filter((p) => order[p] !== undefined).map(word);
    if (lang === 'en') {
      const article = /^[aeiou]/.test(find('color', order.color).en) ? 'An' : 'A';
      return `${article} ${color} monster with ${joinList(extras, 'and')}!`;
    }
    if (lang === 'ca') return `Un monstre ${color} amb ${joinList(extras, 'i')}!`;
    return `¡Un monstruo ${color} con ${joinList(extras, 'y')}!`;
  }

  function newOrder(level, prev) {
    let order;
    do {
      order = {};
      LEVEL_PARTS[level].forEach((p) => { order[p] = pick(PARTS[p].list).id; });
    } while (prev && JSON.stringify(order) === JSON.stringify(prev));
    return order;
  }

  // ---------- Text ----------
  function hintLang() { return M.lang === 'en' ? 'ca' : M.lang; }
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    $('ask').textContent = M.t(TEXT.ask);
    $('l1-name').textContent = M.t(TEXT.l1);
    $('l2-name').textContent = M.t(TEXT.l2);
    $('l3-name').textContent = M.t(TEXT.l3);
    $('win-text').textContent = M.t(TEXT.win);
    if (order) $('order-hint').textContent = orderText(order, hintLang(), false);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  $('mascots-levels').innerHTML = M.mascotsSVG('wave');

  // ---------- Game ----------
  let level = 1, order = null, built = {}, made = [], busy = false;
  renderText();

  // The Mellis rule: 3 hearts, "oh oh" + pause on mistakes, 0 hearts = new round
  const round = M.round({ heartsEl: $('hearts'), onOut: () => start(level) });

  function start(lvl) {
    level = lvl;
    round.start();
    made = [];
    order = null;
    $('levels').hidden = true;
    $('win').hidden = true;
    $('play').hidden = false;
    $('progress').innerHTML = '<span>🎃</span>'.repeat(ROUND);
    renderPickers();
    next();
  }

  function next() {
    order = newOrder(level, order);
    built = {};
    busy = false;
    $('order-en').innerHTML = orderText(order, 'en', true);
    $('order-hint').hidden = true;
    renderText();
    drawMonster();
    refreshPickers();
    setTimeout(() => M.speak(orderText(order, 'en', false)), 300);
  }

  function drawMonster(anim) {
    const el = $('monster');
    el.innerHTML = monsterSVG(built);
    if (anim) { el.classList.remove('pop', 'alive', 'nope'); void el.offsetWidth; el.classList.add(anim); }
  }

  function optionFace(part, o) {
    if (part === 'color') return '';
    if (part === 'eyes') return String(o.id);
    if (part === 'top') return monsterSVG({ top: o.id }, '15 -32 170 110');
    return monsterSVG({ mouth: o.id, eyes: null }, '62 118 76 50');
  }

  function renderPickers() {
    $('pickers').innerHTML = LEVEL_PARTS[level].map((part) => `
      <div class="row" data-part="${part}">
        <span class="row-label">${PARTS[part].icon}</span>
        <div class="opts">${PARTS[part].list.map((o) => `
          <button class="opt${part === 'color' ? ' swatch' : ''}" data-part="${part}" data-id="${o.id}"
            aria-label="${o.en}" ${part === 'color' ? `style="background:${o.hex}"` : ''}>${optionFace(part, o)}</button>`).join('')}
        </div>
      </div>`).join('');
  }

  function refreshPickers() {
    if (!Object.keys(built).length) document.querySelectorAll('.row').forEach((r) => r.classList.remove('wrong'));
    document.querySelectorAll('.opt').forEach((b) =>
      b.classList.toggle('on', String(built[b.dataset.part]) === b.dataset.id));
  }

  $('pickers').addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (!b || busy) return;
    const part = b.dataset.part;
    const id = part === 'eyes' ? +b.dataset.id : b.dataset.id;
    built[part] = id;
    b.closest('.row').classList.remove('wrong');
    M.sounds.pop();
    M.speak(find(part, id).en);
    drawMonster('pop');
    refreshPickers();
  });

  $('alive').addEventListener('click', () => {
    if (busy) return;
    const wrong = Object.keys(order).filter((p) => built[p] !== order[p]);
    if (wrong.length) {
      drawMonster('nope');
      busy = true;
      round.wrong('monster' + made.length).then(({ reveal }) => {
        busy = false;
        if (!reveal) return;
        // 2nd miss on this monster: now show which parts are wrong
        wrong.forEach((p) => {
          const row = document.querySelector(`.row[data-part="${p}"]`);
          row.classList.remove('wrong'); void row.offsetWidth; row.classList.add('wrong');
        });
      });
      return;
    }
    busy = true;
    const flash = $('flash');
    flash.hidden = false;
    flash.style.animation = 'none'; void flash.offsetWidth; flash.style.animation = '';
    setTimeout(() => { flash.hidden = true; }, 650);
    M.sounds.match();
    M.speak("It's alive!");
    drawMonster('alive');
    made.push({ ...built });
    $('progress').children[made.length - 1].classList.add('done');
    if (made.length === ROUND) setTimeout(party, 2600);
    else setTimeout(next, 2800);
  });

  function party() {
    const stars = round.stars();
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('parade').classList.toggle('gold', stars === 3);
    $('parade').innerHTML = made.map((s) => `<div>${monsterSVG(s)}</div>`).join('');
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    M.speak('Happy Halloween!');
  }

  $('say').addEventListener('click', () => { M.sounds.pop(); M.speak(orderText(order, 'en', false)); });
  $('hint').addEventListener('click', () => {
    M.sounds.pop();
    $('order-hint').hidden = !$('order-hint').hidden;
  });
  document.querySelectorAll('.level').forEach((b) =>
    b.addEventListener('click', () => { M.sounds.pop(); start(+b.dataset.level); }));
  $('again').addEventListener('click', () => { M.sounds.pop(); start(level); });
  $('other').addEventListener('click', () => {
    M.sounds.pop();
    $('play').hidden = true;
    $('win').hidden = true;
    $('levels').hidden = false;
  });
})();
