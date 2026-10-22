(function () {
  const M = window.Mellis;
  const ROUND = 5;            // monsters per party
  const INK = '#3a3a5c';
  const GREY = '#d9d9e3';     // not painted yet
  const ALBUM_KEY = 'mellis.monsters.album';
  const ALBUM_MAX = 60;

  // ---------- Vocabulary ----------
  // pl = feminine plural (for "taques liles" / "manchas moradas")
  const COLORS = [
    { id: 'green', hex: '#6fd36f', en: 'green', ca: 'verd', es: 'verde', pl: { ca: 'verdes', es: 'verdes' } },
    { id: 'purple', hex: '#a86bea', en: 'purple', ca: 'lila', es: 'morado', pl: { ca: 'liles', es: 'moradas' } },
    { id: 'orange', hex: '#ff9f1c', en: 'orange', ca: 'taronja', es: 'naranja', pl: { ca: 'taronja', es: 'naranjas' } },
    { id: 'blue', hex: '#4aa3ff', en: 'blue', ca: 'blau', es: 'azul', pl: { ca: 'blaves', es: 'azules' } },
    { id: 'pink', hex: '#ff8cc6', en: 'pink', ca: 'rosa', es: 'rosa', pl: { ca: 'roses', es: 'rosas' } },
    { id: 'red', hex: '#ff5a5a', en: 'red', ca: 'vermell', es: 'rojo', pl: { ca: 'vermelles', es: 'rojas' } },
    { id: 'yellow', hex: '#ffd23f', en: 'yellow', ca: 'groc', es: 'amarillo', pl: { ca: 'grogues', es: 'amarillas' } },
  ];
  const EYES = [
    { id: 1, en: 'one eye', ca: 'un ull', es: 'un ojo' },
    { id: 2, en: 'two eyes', ca: 'dos ulls', es: 'dos ojos' },
    { id: 3, en: 'three eyes', ca: 'tres ulls', es: 'tres ojos' },
    { id: 4, en: 'four eyes', ca: 'quatre ulls', es: 'cuatro ojos' },
    { id: 5, en: 'five eyes', ca: 'cinc ulls', es: 'cinco ojos' },
  ];
  const ARMS = [
    { id: 2, en: 'two arms', ca: 'dos braços', es: 'dos brazos' },
    { id: 4, en: 'four arms', ca: 'quatre braços', es: 'cuatro brazos' },
    { id: 6, en: 'six arms', ca: 'sis braços', es: 'seis brazos' },
  ];
  // no = the word after "NO" / "sense" / "sin"
  const TOPS = [
    { id: 'horns', en: 'horns', ca: 'banyes', es: 'cuernos', no: { en: 'horns', ca: 'banyes', es: 'cuernos' } },
    { id: 'hat', en: 'a witch hat', ca: 'un barret de bruixa', es: 'un sombrero de bruja', no: { en: 'hat', ca: 'barret', es: 'sombrero' } },
    { id: 'ears', en: 'big ears', ca: 'orelles grans', es: 'orejas grandes', no: { en: 'big ears', ca: 'orelles grans', es: 'orejas grandes' } },
    { id: 'bow', en: 'a bow', ca: 'un llaç', es: 'un lazo', no: { en: 'bow', ca: 'llaç', es: 'lazo' } },
  ];
  const MOUTHS = [
    { id: 'smile', en: 'a big smile', ca: 'un gran somriure', es: 'una gran sonrisa', no: { en: 'smile', ca: 'somriure', es: 'sonrisa' } },
    { id: 'teeth', en: 'sharp teeth', ca: 'dents punxegudes', es: 'dientes afilados', no: { en: 'sharp teeth', ca: 'dents punxegudes', es: 'dientes afilados' } },
    { id: 'tongue', en: 'a long tongue', ca: 'una llengua llarga', es: 'una lengua larga', no: { en: 'long tongue', ca: 'llengua llarga', es: 'lengua larga' } },
  ];
  const BACKS = [
    { id: 'tail', en: 'a tail', ca: 'una cua', es: 'una cola', no: { en: 'tail', ca: 'cua', es: 'cola' } },
    { id: 'wings', en: 'bat wings', ca: 'ales de ratpenat', es: 'alas de murciélago', no: { en: 'wings', ca: 'ales', es: 'alas' } },
  ];
  const PATTERNS = [
    { id: 'spots', en: 'spots', ca: 'taques', es: 'manchas', no: { en: 'spots', ca: 'taques', es: 'manchas' } },
    { id: 'stripes', en: 'stripes', ca: 'ratlles', es: 'rayas', no: { en: 'stripes', ca: 'ratlles', es: 'rayas' } },
  ];
  const SIZES = [
    { id: 'small', en: 'small', ca: 'petit', es: 'pequeño' },
    { id: 'normal' },
    { id: 'big', en: 'big', ca: 'gran', es: 'grande' },
  ];
  const PARTS = {
    color: { icon: '🎨', list: COLORS },
    pattern: { icon: '🐆', list: PATTERNS, none: true },
    eyes: { icon: '👀', list: EYES },
    arms: { icon: '💪', list: ARMS },
    top: { icon: '🎩', list: TOPS, none: true },
    mouth: { icon: '👄', list: MOUTHS, none: true },
    back: { icon: '🦇', list: BACKS, none: true },
    size: { icon: '📏', list: SIZES },
  };
  const ALL_PARTS = ['color', 'pattern', 'eyes', 'arms', 'top', 'mouth', 'back', 'size'];
  const LEVEL_PARTS = { 1: ['color', 'eyes', 'top', 'mouth'], 2: ALL_PARTS, 3: ALL_PARTS, 4: ALL_PARTS };
  const DEFAULTS = { arms: 2, size: 'normal' };
  const NEGATABLE = ['top', 'mouth', 'back', 'pattern'];

  const TEXT = {
    title: { ca: 'Laboratori de monstres', es: 'Laboratorio de monstruos', en: 'Monster Lab' },
    ask: { ca: 'Tria un nivell!', es: '¡Elige un nivel!', en: 'Pick a level!' },
    l1: { ca: 'Fàcil', es: 'Fácil', en: 'Easy' },
    l2: { ca: 'Mitjà', es: 'Medio', en: 'Medium' },
    l3: { ca: 'Difícil', es: 'Difícil', en: 'Hard' },
    l4: { ca: 'Experta', es: 'Experta', en: 'Expert' },
    listen: { ca: 'Escolta bé!', es: '¡Escucha bien!', en: 'Listen carefully!' },
    win: { ca: 'Quina festa de monstres!', es: '¡Qué fiesta de monstruos!', en: 'What a monster party!' },
    album: { ca: 'Els meus monstres', es: 'Mis monstruos', en: 'My monsters' },
    empty: { ca: 'Encara no hi ha cap monstre. A treballar!', es: 'Todavía no hay monstruos. ¡A trabajar!', en: 'No monsters yet. Get to work!' },
    noVoice: { ca: 'Cal so en anglès! 🔊', es: '¡Hace falta sonido en inglés! 🔊', en: 'This needs English sound! 🔊' },
  };
  // Doctora Bombolles: short lines, never about what is wrong (no hints)
  const DR = {
    hello: [
      { ca: 'Mwahaha! Un client nou!', es: '¡Mwahaha! ¡Un cliente nuevo!', en: 'Mwahaha! A new customer!' },
      { ca: 'Ding-dong! Una comanda!', es: '¡Ding-dong! ¡Un pedido!', en: 'Ding-dong! An order!' },
      { ca: 'Som-hi, ajudanta!', es: '¡Vamos, ayudante!', en: "Let's go, helper!" },
      { ca: 'Bombolles i llamps!', es: '¡Burbujas y rayos!', en: 'Bubbles and lightning!' },
    ],
    alive: {
      wings: { ca: 'Mira, mira! Vola!', es: '¡Mira, mira! ¡Vuela!', en: 'Look, look! It flies!' },
      tail: { ca: 'Quina cua més bonica!', es: '¡Qué cola más bonita!', en: 'What a lovely tail!' },
      teeth: { ca: 'Compte, que mossega!', es: '¡Cuidado, que muerde!', en: 'Careful, it bites!' },
      tongue: { ca: 'Puaj, quina llepada!', es: '¡Puaj, qué lametón!', en: 'Yuck, what a lick!' },
      big: { ca: 'Uau, que gegant!', es: '¡Uau, qué gigante!', en: 'Wow, a giant!' },
      small: { ca: 'Que petitó i que mono!', es: '¡Qué chiquitín y qué mono!', en: 'So tiny and cute!' },
      arms6: { ca: 'Sis braços per fer pessigolles!', es: '¡Seis brazos para hacer cosquillas!', en: 'Six arms for tickling!' },
      hat: { ca: 'Un monstre bruixot!', es: '¡Un monstruo brujo!', en: 'A wizard monster!' },
      any: { ca: 'Està viu! Mwahaha!', es: '¡Está vivo! ¡Mwahaha!', en: "It's alive! Mwahaha!" },
    },
    party: { ca: 'Sou les millors ajudants!', es: '¡Sois las mejores ayudantes!', en: 'Best helpers ever!' },
  };

  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const find = (part, id) => PARTS[part].list.find((o) => o.id === id);
  const colorOf = (id) => COLORS.find((c) => c.id === id);
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Drawing ----------
  const EYE_LAYOUT = {
    1: [[100, 92, 22]],
    2: [[76, 92, 15], [124, 92, 15]],
    3: [[68, 98, 13], [100, 80, 13], [132, 98, 13]],
    4: [[62, 100, 11], [87, 84, 11], [113, 84, 11], [138, 100, 11]],
    5: [[60, 104, 10], [80, 86, 10], [100, 76, 10], [120, 86, 10], [140, 104, 10]],
  };
  const ARM_Y = { 2: [148], 4: [126, 160], 6: [112, 140, 168] };
  const BODY = 'M45 205 C30 150 25 80 60 50 C85 28 115 28 140 50 C175 80 170 150 155 205 ' +
    'Q141 194 127 205 Q114 194 100 205 Q86 194 73 205 Q59 194 45 205 Z';
  let svgId = 0;   // unique clipPath ids: many monsters share one page

  function monsterSVG(s, viewBox) {
    const fill = s.color ? colorOf(s.color).hex : GREY;
    const line = `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
    let behind = '', front = '';

    // wings / tail
    if (s.back === 'wings') {
      const wing = 'M64 92 Q30 40 -6 52 Q8 66 4 80 Q16 78 22 92 Q32 86 40 100 Q50 92 64 112 Z';
      behind += `<g class="wing wl"><path d="${wing}" fill="#4b3a6e" ${line}/></g>` +
        `<g class="wing wr"><path d="${wing}" transform="translate(200 0) scale(-1 1)" fill="#4b3a6e" ${line}/></g>`;
    } else if (s.back === 'tail') {
      behind += `<g class="tail"><path d="M140 190 Q186 196 190 160 Q192 140 178 134" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
        `<path d="M140 190 Q186 196 190 160 Q192 140 178 134" fill="none" stroke="${fill}" stroke-width="7" stroke-linecap="round"/>` +
        `<path d="M178 134 l-10 -14 l18 2 z" fill="${fill}" ${line}/></g>`;
    }

    // arms
    (ARM_Y[s.arms || 2]).forEach((y, i) => {
      const r = 28 + i * 8;
      behind += `<g class="arm al"><ellipse cx="34" cy="${y}" rx="12" ry="22" transform="rotate(${r} 34 ${y})" fill="${fill}" ${line}/></g>` +
        `<g class="arm ar"><ellipse cx="166" cy="${y}" rx="12" ry="22" transform="rotate(${-r} 166 ${y})" fill="${fill}" ${line}/></g>`;
    });

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

    // body + pattern + belly
    let pattern = '';
    if (s.pattern) {
      const id = 'mb' + (++svgId);
      const pc = s.pcolor ? colorOf(s.pcolor).hex : 'rgba(255,255,255,.7)';
      const marks = s.pattern === 'spots'
        ? [[70, 70, 11], [128, 62, 9], [52, 130, 12], [150, 120, 10], [96, 196, 9], [140, 176, 11], [62, 182, 8]]
          .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${pc}" stroke="${INK}" stroke-width="2"/>`).join('')
        : [62, 108, 150, 192].map((y) =>
          `<path d="M20 ${y} Q60 ${y - 10} 100 ${y} T180 ${y} v13 Q140 ${y + 3} 100 ${y + 13} T20 ${y + 13} Z" fill="${pc}" stroke="${INK}" stroke-width="2"/>`).join('');
      pattern = `<clipPath id="${id}"><path d="${BODY}"/></clipPath><g clip-path="url(#${id})">${marks}</g>` +
        `<path d="${BODY}" fill="none" ${line}/>`;
    }
    const body = `<path d="${BODY}" fill="${fill}" ${line}/>` + pattern +
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
      mouth = `<g class="chomp"><path d="M70 130 Q100 166 130 130 Z" fill="#5a1a3a" ${line}/>${teeth}</g>`;
    } else if (s.mouth === 'tongue') {
      mouth = `<path class="tongue" d="M92 138 v18 a9 9 0 0 0 18 0 v-18 z" fill="#ff7aa8" ${line}/>` +
        `<path d="M78 134 q22 12 44 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    } else {
      mouth = `<path d="M86 138 q14 6 28 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    }
    const cheeks = `<circle cx="58" cy="128" r="7" fill="#ff9ec7" opacity=".6"/><circle cx="142" cy="128" r="7" fill="#ff9ec7" opacity=".6"/>`;

    const k = { small: 0.7, big: 1.14 }[s.size] || 1;
    return `<svg viewBox="${viewBox || '0 -30 200 250'}" xmlns="http://www.w3.org/2000/svg">` +
      `<g transform="translate(100 210) scale(${k}) translate(-100 -210)">` +
      behind + body + cheeks + eyes + mouth + front + '</g></svg>';
  }

  // Doctora Bombolles: pink cloud hair, goggles, lab coat
  function drSVG() {
    const line = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"`;
    return `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 130 Q24 96 60 94 Q96 96 98 130 Z" fill="#fff" ${line}/>
      <path d="M60 94 L50 130 M60 94 L70 130" stroke="${INK}" stroke-width="3"/>
      <circle cx="52" cy="112" r="3" fill="${INK}"/>
      <g class="dr-hair" fill="#ff8cc6" ${line}>
        <circle cx="26" cy="46" r="16"/><circle cx="94" cy="46" r="16"/><circle cx="34" cy="24" r="16"/>
        <circle cx="86" cy="24" r="16"/><circle cx="60" cy="14" r="18"/>
      </g>
      <ellipse cx="60" cy="56" rx="32" ry="34" fill="#ffd9b8" ${line}/>
      <g fill="#bfe9ff" ${line}><circle cx="46" cy="52" r="12"/><circle cx="74" cy="52" r="12"/></g>
      <path d="M58 52 h4" stroke="${INK}" stroke-width="4"/>
      <circle cx="47" cy="54" r="4" fill="${INK}"/><circle cx="75" cy="54" r="4" fill="${INK}"/>
      <path d="M46 72 Q60 86 74 72 Z" fill="#5a1a3a" ${line}/>
      <circle cx="34" cy="70" r="5" fill="#ff9ec7" opacity=".7"/><circle cx="86" cy="70" r="5" fill="#ff9ec7" opacity=".7"/>
    </svg>`;
  }

  // ---------- Orders ----------
  // order = { need: { part: id, pcolor? }, never: { part: id } }; parts in neither are free
  function joinList(items, and) {
    return items.length < 2 ? items.join('') : items.slice(0, -1).join(', ') + ` ${and} ` + items[items.length - 1];
  }

  // html: words bold & UPPERCASE; spoken text stays lower case (voices read "NO" as "number")
  function orderText(order, lang, html) {
    const { need, never } = order;
    const b = (w, hex) => html ? `<b${hex ? ` style="background:${hex}"` : ''}>${w.toUpperCase()}</b>` : w;
    const color = b(colorOf(need.color)[lang], colorOf(need.color).hex);
    const size = need.size ? b(find('size', need.size)[lang]) : '';
    const extras = ['eyes', 'pattern', 'arms', 'top', 'mouth', 'back'].filter((p) => need[p] !== undefined).map((p) => {
      if (p !== 'pattern') return b(find(p, need[p])[lang]);
      const pc = colorOf(need.pcolor);
      const word = find('pattern', need.pattern)[lang];
      return lang === 'en' ? b(`${pc.en} ${word}`, pc.hex) : b(`${word} ${pc.pl[lang]}`, pc.hex);
    });
    const negs = Object.keys(never || {}).map((p) => b(find(p, never[p]).no[lang]));
    const NO = { en: html ? '<b class="no">NO</b>' : 'no', ca: html ? '<b class="no">SENSE</b>' : 'sense', es: html ? '<b class="no">SIN</b>' : 'sin' }[lang];
    if (lang === 'en') {
      const first = need.size ? find('size', need.size).en : colorOf(need.color).en;
      const article = /^[aeiou]/.test(first) ? 'An' : 'A';
      const no = negs.length ? `, but ${negs.map((n) => `${NO} ${n}`).join(' and ')}` : '';
      return `${article} ${size ? size + ' ' : ''}${color} monster with ${joinList(extras, 'and')}${no}!`;
    }
    if (lang === 'ca') {
      const no = negs.length ? `, però ${NO} ${joinList(negs, 'ni')}` : '';
      return `Un monstre ${color}${size ? ' ' + size : ''} amb ${joinList(extras, 'i')}${no}!`;
    }
    const no = negs.length ? `, pero ${NO} ${joinList(negs, 'ni')}` : '';
    return `¡Un monstruo ${color}${size ? ' ' + size : ''} con ${joinList(extras, 'y')}${no}!`;
  }

  function randomValue(part, need) {
    if (part === 'arms') return pick([4, 6]);
    if (part === 'size') return pick(['small', 'big']);
    if (part === 'pattern') need.pcolor = pick(COLORS.filter((c) => c.id !== need.color)).id;
    return pick(PARTS[part].list).id;
  }

  function newOrder(lvl, prev) {
    let order;
    do {
      const need = { color: pick(COLORS).id }, never = {};
      if (lvl === 1) {
        ['eyes', 'top', 'mouth'].forEach((p) => { need[p] = randomValue(p, need); });
      } else {
        const extras = shuffle(['eyes', 'pattern', 'arms', 'top', 'mouth', 'back', 'size'])
          .slice(0, lvl === 2 ? 4 + Math.round(Math.random()) : 4);
        extras.forEach((p) => { need[p] = randomValue(p, need); });
        if (lvl >= 3) {
          const free = shuffle(NEGATABLE.filter((p) => need[p] === undefined));
          free.slice(0, Math.random() < 0.5 ? 1 : 2).forEach((p) => { never[p] = pick(PARTS[p].list).id; });
        }
      }
      order = { need, never };
    } while (prev && JSON.stringify(order.need) === JSON.stringify(prev.need));
    return order;
  }

  // parts she got wrong (for the reveal on the 2nd miss)
  function wrongParts(order, s) {
    const bad = Object.keys(order.need).filter((p) => p !== 'pcolor' && s[p] !== order.need[p]);
    if (order.need.pattern && s.pcolor !== order.need.pcolor && !bad.includes('pattern')) bad.push('pattern');
    Object.keys(order.never).forEach((p) => { if (s[p] === order.never[p]) bad.push(p); });
    return bad;
  }

  // a finished monster described as an order (album: tap to hear it)
  function describe(s) {
    const need = { color: s.color };
    ['eyes', 'pattern', 'arms', 'top', 'mouth', 'back', 'size'].forEach((p) => {
      if (s[p] !== undefined && s[p] !== DEFAULTS[p]) need[p] = s[p];
    });
    if (need.pattern) need.pcolor = s.pcolor || s.color;
    if (Object.keys(need).length === 1 || (Object.keys(need).length === 2 && need.size)) need.arms = s.arms || 2;
    return orderText({ need, never: {} }, 'en', false);
  }

  // ---------- Album ----------
  function album() {
    try { return JSON.parse(localStorage.getItem(ALBUM_KEY)) || []; } catch (e) { return []; }
  }
  function saveAlbum(list) {
    try { localStorage.setItem(ALBUM_KEY, JSON.stringify(list.slice(0, ALBUM_MAX))); } catch (e) { /* ignore */ }
  }

  // ---------- Text ----------
  function hintLang() { return M.lang === 'en' ? 'ca' : M.lang; }
  const listenOnly = () => level === 4;
  function renderOrder() {
    if (!order) return;
    $('order-en').innerHTML = listenOnly()
      ? `<span class="listen">👂 ${M.t(TEXT.listen)}</span>`
      : orderText(order, 'en', true);
    $('order-hint').textContent = orderText(order, hintLang(), false);
  }
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    $('ask').textContent = M.t(TEXT.ask);
    ['l1', 'l2', 'l3', 'l4'].forEach((k) => { $(k + '-name').textContent = M.t(TEXT[k]); });
    $('win-text').textContent = M.t(TEXT.win);
    $('album-title').textContent = M.t(TEXT.album);
    renderOrder();
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  $('mascots-levels').innerHTML = M.mascotsSVG('wave');
  $('dr-face').innerHTML = drSVG();
  $('win-dr').innerHTML = drSVG();
  M.music.button($('music'));
  M.music.button($('music-levels'));
  M.music.play('spooky');

  // ---------- Game ----------
  let level = 1, order = null, built = {}, made = [], busy = false, tab = 'color', drTimer = 0;
  let flagged = new Set();   // parts shown as wrong after the 2nd miss
  renderText();

  // The Mellis rule: 3 hearts, "oh oh" + pause on mistakes, 0 hearts = new round
  const round = M.round({ heartsEl: $('hearts'), onOut: () => start(level) });

  function drSay(text, speak, then) {
    const el = $('dr-say');
    el.textContent = text;
    el.hidden = false;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    $('dr').classList.remove('talk'); void $('dr').offsetWidth; $('dr').classList.add('talk');
    clearTimeout(drTimer);
    const hide = () => { drTimer = setTimeout(() => { el.hidden = true; }, 1800); };
    if (speak) M.speak(text.replace(/[¡!]/g, ''), M.lang, { onend: () => { hide(); if (then) then(); } });
    else { hide(); if (then) then(); }
  }

  function start(lvl) {
    level = lvl;
    round.start();
    made = [];
    order = null;
    document.body.classList.add('lab');
    $('levels').hidden = true;
    $('win').hidden = true;
    $('play').hidden = false;
    $('hint').hidden = listenOnly();
    $('progress').innerHTML = '<span>🎃</span>'.repeat(ROUND);
    next();
  }

  function next() {
    order = newOrder(level, order);
    built = { ...DEFAULTS };
    busy = false;
    tab = 'color';
    flagged = new Set();
    $('order-hint').hidden = true;
    renderOrder();
    drawMonster();
    renderTabs();
    M.sounds.giggle();
    drSay(M.t(pick(DR.hello)), false);
    setTimeout(sayOrder, 300);
  }

  function sayOrder() { M.speak(orderText(order, 'en', false), 'en', { rate: listenOnly() ? 0.75 : 0.85 }); }

  function drawMonster(anim) {
    const el = $('monster');
    el.innerHTML = monsterSVG(built);
    el.className = 'monster';
    if (anim) { void el.offsetWidth; el.classList.add(anim); }
  }

  // ---------- Part tabs + options ----------
  const NONE = '✖️';
  function optionFace(part, o) {
    if (part === 'eyes') return String(o.id);
    if (part === 'top') return monsterSVG({ top: o.id }, '15 -32 170 110');
    if (part === 'mouth') return monsterSVG({ mouth: o.id, eyes: null }, '62 118 76 50');
    if (part === 'pattern') return monsterSVG({ pattern: o.id, color: 'green', pcolor: 'purple' }, '30 30 140 180');
    return monsterSVG({ [part]: o.id }, part === 'size' ? '-10 -40 220 260' : '-10 -30 220 250');
  }
  const isSet = (p) => built[p] !== undefined && built[p] !== DEFAULTS[p];

  function renderTabs() {
    const parts = LEVEL_PARTS[level];
    $('tabs').hidden = parts.length < 2;
    $('tabs').innerHTML = parts.map((p) =>
      `<button class="tab${p === tab ? ' on' : ''}${isSet(p) ? ' set' : ''}${flagged.has(p) ? ' wrong' : ''}" data-tab="${p}" aria-label="${p}">${PARTS[p].icon}</button>`).join('');
    renderPanel();
  }

  function optButton(part, o, on) {
    const swatch = part === 'color' || part === 'pcolor';
    const face = o.id === 'none' ? NONE : swatch ? '' : optionFace(part, o);
    return `<button class="opt${swatch ? ' swatch' : ''}${on ? ' on' : ''}" data-part="${part}" data-id="${o.id}"
      aria-label="${o.en || o.id}" ${swatch ? `style="background:${o.hex}"` : ''}>${face}</button>`;
  }

  function renderPanel() {
    const part = tab;
    const list = (PARTS[part].none ? [{ id: 'none' }] : []).concat(PARTS[part].list);
    let html = `<div class="opts">${list.map((o) =>
      optButton(part, o, o.id === 'none' ? built[part] === undefined : String(built[part]) === String(o.id))).join('')}</div>`;
    if (part === 'pattern' && built.pattern) {
      html += `<div class="opts">${COLORS.map((c) => optButton('pcolor', c, built.pcolor === c.id)).join('')}</div>`;
    }
    $('panel').innerHTML = html;
  }

  $('tabs').addEventListener('click', (e) => {
    const b = e.target.closest('.tab');
    if (!b) return;
    M.sounds.flip();
    tab = b.dataset.tab;
    renderTabs();
  });

  $('panel').addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (!b || busy) return;
    const part = b.dataset.part;
    flagged.delete(part === 'pcolor' ? 'pattern' : part);
    const raw = b.dataset.id;
    const id = /^\d+$/.test(raw) ? +raw : raw;
    if (id === 'none') {
      delete built[part];
      if (part === 'pattern') delete built.pcolor;
    } else {
      built[part] = id;
      const word = part === 'pcolor' ? colorOf(id).en : find(part, id).en;
      if (word) M.speak(word, 'en');
    }
    M.sounds.pop();
    drawMonster('pop');
    renderTabs();
  });

  // ---------- It's alive! ----------
  function showOff(s) {
    const cls = [];
    if (s.back) cls.push('has-' + s.back);
    if (s.arms > 2) cls.push('has-arms');
    if (s.mouth === 'tongue') cls.push('has-tongue');
    if (s.mouth === 'teeth') cls.push('has-teeth');
    if (s.size !== 'normal') cls.push('is-' + s.size);
    cls.forEach((c) => $('monster').classList.add(c));
    if (s.size === 'big') [0, 0.5, 1].forEach((d) => setTimeout(() => M.sounds.miss(), d * 1000));
    if (s.size === 'small') setTimeout(() => M.sounds.giggle(), 400);
    if (s.back === 'wings') setTimeout(() => M.sounds.flip(), 300);
    if (s.mouth === 'teeth') setTimeout(() => M.sounds.pop(), 500);
    const keys = [s.back === 'wings' && 'wings', s.mouth === 'teeth' && 'teeth', s.mouth === 'tongue' && 'tongue',
      s.size === 'big' && 'big', s.size === 'small' && 'small', s.arms === 6 && 'arms6', s.top === 'hat' && 'hat',
      s.back === 'tail' && 'tail'].filter(Boolean);
    return DR.alive[keys.length ? pick(keys) : 'any'];
  }

  $('alive').addEventListener('click', () => {
    if (busy) return;
    const wrong = wrongParts(order, built);
    if (wrong.length) {
      drawMonster('nope');
      busy = true;
      round.wrong('monster' + made.length).then(({ reveal }) => {
        busy = false;
        if (!reveal) return;
        // 2nd miss on this monster: now show which parts are wrong
        flagged = new Set(wrong);
        if (!flagged.has(tab)) tab = wrong[0];
        renderTabs();
      });
      return;
    }
    busy = true;
    const flash = $('flash');
    flash.hidden = false;
    flash.style.animation = 'none'; void flash.offsetWidth; flash.style.animation = '';
    setTimeout(() => { flash.hidden = true; }, 650);
    M.sounds.match();
    drawMonster('alive');
    const line = showOff(built);
    made.push({ ...built });
    saveAlbum([{ s: { ...built } }].concat(album()));
    $('progress').children[made.length - 1].classList.add('done');
    const done = () => setTimeout(made.length === ROUND ? party : next, 700);
    M.speak("It's alive!", 'en', { onend: () => drSay(M.t(line), true, done) });
  });

  function party() {
    const stars = round.stars();
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('parade').classList.toggle('gold', stars === 3);
    $('parade').innerHTML = made.map((s) => `<div>${monsterSVG(s)}</div>`).join('');
    if (stars === 3) saveAlbum(album().map((m, i) => (i < made.length ? { ...m, g: 1 } : m)));
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    M.speak(M.t(DR.party).replace(/[¡!]/g, ''), M.lang);
  }

  // ---------- Album screen ----------
  function openAlbum() {
    const list = album();
    $('album-grid').innerHTML = list.length
      ? list.map((m, i) => `<button class="album-item${m.g ? ' gold' : ''}" data-i="${i}">${monsterSVG(m.s)}</button>`).join('')
      : `<p class="album-empty">${M.t(TEXT.empty)}</p>`;
    $('album').hidden = false;
  }
  $('album-btn').addEventListener('click', () => { M.sounds.pop(); openAlbum(); });
  $('album-close').addEventListener('click', () => { M.sounds.pop(); $('album').hidden = true; });
  $('album-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.album-item');
    if (!b) return;
    const m = album()[+b.dataset.i];
    if (!m) return;
    b.classList.remove('dance'); void b.offsetWidth; b.classList.add('dance');
    M.sounds.boing();
    M.speak(describe(m.s), 'en');
  });

  // ---------- Buttons ----------
  $('say').addEventListener('click', () => { M.sounds.pop(); sayOrder(); });
  $('hint').addEventListener('click', () => {
    M.sounds.pop();
    $('order-hint').hidden = !$('order-hint').hidden;
  });
  document.querySelectorAll('.level').forEach((b) =>
    b.addEventListener('click', () => {
      const lvl = +b.dataset.level;
      if (lvl === 4 && (M.isMuted() || !M.canSpeak('en'))) { M.sounds.miss(); drSayLevels(); return; }
      M.sounds.pop();
      start(lvl);
    }));
  function drSayLevels() { $('ask').textContent = M.t(TEXT.noVoice); setTimeout(renderText, 2500); }
  function toLevels() {
    $('play').hidden = true;
    $('win').hidden = true;
    $('levels').hidden = false;
    document.body.classList.remove('lab');
  }
  $('again').addEventListener('click', () => { M.sounds.pop(); start(level); });
  $('other').addEventListener('click', () => { M.sounds.pop(); toLevels(); });

  // test hook
  window.__order = () => ({ order, built, level });
})();
