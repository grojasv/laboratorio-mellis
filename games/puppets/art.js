// Drawings for the Puppet Show: the paper-bag puppet, scene windows and school things.
(function () {
  const INK = '#3a3a5c';
  const line = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

  const COLOURS = {
    red: '#ff5a5a', orange: '#ff9f1c', yellow: '#ffd23f', green: '#5ccf7a',
    blue: '#4aa3ff', purple: '#a86bea', pink: '#ff8cc6',
  };
  const shade = (hex, f) => {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * f));
    return `rgb(${c.join(',')})`;
  };

  // ---------- Puppet ----------
  // p = { colour, eyes, hair, extra }, feel = happy|sad|angry|scared|null
  function puppetSVG(p, feel) {
    const c = COLOURS[p.colour] || COLOURS.blue;
    const dark = shade(c, 0.8);

    const body = `
      <rect x="42" y="132" width="116" height="122" rx="10" fill="${dark}" ${line}/>
      <path d="M62 140 v108 M138 140 v108" stroke="rgba(0,0,0,.12)" stroke-width="5"/>
      <rect class="arm-l" x="24" y="150" width="26" height="62" rx="13" fill="${c}" ${line}/>
      <rect class="arm-r" x="150" y="150" width="26" height="62" rx="13" fill="${c}" ${line}/>`;

    // mouth cavity (shows when the jaw drops) + jaw flap
    const cavity = `<rect class="cavity" x="58" y="112" width="84" height="4" rx="4" fill="#5a1a3a"/>`;
    const jaw = `<g class="jaw">
      <rect x="48" y="110" width="104" height="30" rx="14" fill="${c}" ${line}/>
      <ellipse cx="100" cy="114" rx="18" ry="5" fill="#ff7aa8" opacity=".0" class="tongue"/>
    </g>`;

    const head = `<rect x="34" y="26" width="132" height="92" rx="34" fill="${c}" ${line}/>
      <ellipse cx="62" cy="96" rx="9" ry="6" fill="#ff9ec7" opacity=".75"/>
      <ellipse cx="138" cy="96" rx="9" ry="6" fill="#ff9ec7" opacity=".75"/>`;

    return `<svg class="puppet${feel === 'scared' ? ' shiver' : ''}" viewBox="0 -24 200 282" xmlns="http://www.w3.org/2000/svg">
      ${p.hair === 'pigtails' ? hairSVG(p.hair, c, 'back') : ''}
      ${body}${cavity}${jaw}${head}
      <g class="hair">${hairSVG(p.hair, c, 'front')}</g>
      ${eyesSVG(p.eyes, feel)}
      ${feelSVG(feel)}
      <g class="extra">${extraSVG(p.extra)}</g>
    </svg>`;
  }

  function eyesSVG(type, feel) {
    const L = 74, R = 126, Y = 66;
    if (feel === 'dizzy') {
      return [L, R].map((x) => `<circle cx="${x}" cy="${Y}" r="14" fill="#fff" ${line}/><path d="M${x} ${Y} m-2 0 a2 2 0 1 1 4 0 a4 4 0 1 1 -8 0 a6 6 0 1 1 12 0 a8 8 0 1 1 -16 0" fill="none" stroke="${INK}" stroke-width="2.5"/>`).join('');
    }
    if (feel === 'scared') {
      return [L, R].map((x) => `<circle cx="${x}" cy="${Y}" r="15" fill="#fff" ${line}/><circle cx="${x}" cy="${Y}" r="4" fill="${INK}"/>`).join('');
    }
    if (type === 'googly') {
      return [L, R].map((x, i) => `<circle cx="${x}" cy="${Y}" r="16" fill="#fff" ${line}/><circle cx="${x + (i ? -5 : 5)}" cy="${Y + 5}" r="7" fill="${INK}"/>`).join('');
    }
    if (type === 'sleepy') {
      return [L, R].map((x) => `<circle cx="${x}" cy="${Y}" r="12" fill="#fff" ${line}/><path d="M${x - 13} ${Y - 1} h26 a13 13 0 0 0 -26 0 z" fill="${shade('#888888', 1)}" opacity=".0"/><path d="M${x - 12} ${Y} q12 -14 24 0 z" fill="${INK}" opacity=".85"/><circle cx="${x}" cy="${Y + 4}" r="5" fill="${INK}"/>`).join('');
    }
    if (type === 'lashes') {
      return [L, R].map((x) => `<ellipse cx="${x}" cy="${Y}" rx="9" ry="12" fill="${INK}"/><circle cx="${x + 3}" cy="${Y - 4}" r="3" fill="#fff"/><path d="M${x - 9} ${Y - 10} l-6 -6 M${x} ${Y - 13} v-8 M${x + 9} ${Y - 10} l6 -6" ${line} stroke-width="3"/>`).join('');
    }
    // round (default)
    return [L, R].map((x) => `<circle cx="${x}" cy="${Y}" r="12" fill="#fff" ${line}/><circle cx="${x + 2}" cy="${Y + 2}" r="6" fill="${INK}"/><circle cx="${x + 4}" cy="${Y - 1}" r="2" fill="#fff"/>`).join('');
  }

  // Feelings drawn on the face (brows + mouth line + extras)
  function feelSVG(feel) {
    if (!feel) return '';
    if (feel === 'dizzy') return `<path d="M78 104 q5 -6 10 0 t10 0 t10 0 t10 0 t10 0" fill="none" ${line}/>`;
    const brows = {
      happy: 'M60 44 q14 -10 28 0 M112 44 q14 -10 28 0',
      sad: 'M60 46 l26 -8 M140 46 l-26 -8',
      angry: 'M60 38 l26 10 M140 38 l-26 10',
      scared: 'M58 38 q16 -14 32 0 M110 38 q16 -14 32 0',
    }[feel];
    const mouth = {
      happy: `<path d="M78 98 q22 22 44 0" fill="#5a1a3a" ${line}/>`,
      sad: `<path d="M80 108 q20 -16 40 0" fill="none" ${line}/>`,
      angry: `<rect x="80" y="96" width="40" height="12" rx="3" fill="#fff" ${line}/><path d="M90 96 v12 M100 96 v12 M110 96 v12" stroke="${INK}" stroke-width="2"/>`,
      scared: `<ellipse cx="100" cy="102" rx="9" ry="11" fill="#5a1a3a" ${line}/>`,
    }[feel];
    const extra = {
      happy: '',
      sad: `<path d="M126 80 q-6 10 0 14 q6 -4 0 -14 z" fill="#7ec8ff" stroke="${INK}" stroke-width="2"/>`,
      angry: `<path d="M44 20 q-6 -10 2 -16 M156 20 q6 -10 -2 -16" fill="none" stroke="#999" stroke-width="4" stroke-linecap="round"/><ellipse cx="62" cy="96" rx="11" ry="7" fill="#ff5a5a" opacity=".7"/><ellipse cx="138" cy="96" rx="11" ry="7" fill="#ff5a5a" opacity=".7"/>`,
      scared: `<path d="M150 46 q-6 10 0 14 q6 -4 0 -14 z" fill="#7ec8ff" stroke="${INK}" stroke-width="2"/>`,
    }[feel];
    return `<path d="${brows}" fill="none" ${line} stroke-width="5"/>${mouth}${extra}`;
  }

  function hairSVG(type, c, layer) {
    const hair = '#6b3f2a';
    if (type === 'spiky' && layer === 'front') {
      return `<path d="M44 40 l10 -26 l12 20 l12 -28 l12 26 l12 -30 l12 28 l12 -26 l10 24 l10 -18 l4 30 z" fill="${hair}" ${line}/>`;
    }
    if (type === 'curly' && layer === 'front') {
      return [52, 74, 96, 118, 140].map((x, i) => `<circle cx="${x + 4}" cy="${30 - (i % 2) * 6}" r="16" fill="#f2a541" ${line}/>`).join('');
    }
    if (type === 'tuft' && layer === 'front') {
      return `<path d="M100 28 q-6 -26 -22 -28 q14 8 10 28 M100 28 q4 -30 22 -32 q-14 10 -10 32" fill="#2ec4b6" ${line}/>`;
    }
    if (type === 'pigtails') {
      if (layer === 'back') return `<ellipse cx="28" cy="64" rx="18" ry="30" fill="${hair}" ${line}/><ellipse cx="172" cy="64" rx="18" ry="30" fill="${hair}" ${line}/>`;
      return `<path d="M40 52 q4 -36 60 -34 q56 -2 60 34 q-20 -16 -60 -14 q-40 -2 -60 14 z" fill="${hair}" ${line}/>`;
    }
    return '';
  }

  function extraSVG(type) {
    if (type === 'bow') return `<g transform="translate(140 22) rotate(15)"><path d="M0 0 L-20 -13 L-20 13 Z M0 0 L20 -13 L20 13 Z" fill="#ff6fb5" ${line}/><circle r="6" fill="#ff6fb5" ${line}/></g>`;
    if (type === 'hat') return `<g transform="rotate(-6 100 20)"><rect x="62" y="-20" width="76" height="40" rx="6" fill="${INK}"/><rect x="62" y="8" width="76" height="8" fill="#ff5a5a"/><rect x="44" y="18" width="112" height="10" rx="5" fill="${INK}"/></g>`;
    if (type === 'glasses') return `<g fill="rgba(255,255,255,.25)" ${line}><circle cx="74" cy="66" r="19"/><circle cx="126" cy="66" r="19"/><path d="M93 64 h14" fill="none"/></g>`;
    if (type === 'crown') return `<path d="M64 24 l6 -32 l16 18 l14 -26 l14 26 l16 -18 l6 32 z" fill="#ffd23f" ${line}/><circle cx="100" cy="6" r="5" fill="#ff5a5a"/>`;
    return '';
  }

  // ---------- Scene windows ----------
  function windowSVG(kind) {
    const skies = {
      sunny: '#8fd3ff', windy: '#b9d7ea', rainy: '#8e9aaf', snowy: '#c9d6e3', hot: '#ffd79a', cold: '#bfe3ff',
      spring: '#bfe8ff', summer: '#7fd0ff', autumn: '#ffd8a8', winter: '#d9e4ee',
    };
    const ground = { snowy: '#ffffff', winter: '#ffffff', autumn: '#d9a066', hot: '#f4d35e', summer: '#f4e1a1', cold: '#e6f2ff' }[kind] || '#7bd389';
    let scene = '';
    const em = (x, y, s, e, cls) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle"${cls ? ` class="${cls}"` : ''}>${e}</text>`;
    switch (kind) {
      case 'sunny': scene = em(150, 52, 44, '☀️', 'spin-slow') + em(60, 112, 30, '🌳') + em(110, 118, 22, '🌼'); break;
      case 'windy': scene = em(60, 50, 30, '☁️', 'drift') + em(110, 100, 34, '🌬️') + em(160, 60, 26, '🪁', 'drift') + em(70, 92, 18, '🍃', 'blow') + em(40, 70, 16, '🍃', 'blow2') + em(30, 116, 32, '🌳', 'bend'); break;
      case 'rainy': scene = em(70, 44, 40, '🌧️') + em(150, 44, 40, '🌧️') + [30, 60, 90, 120, 150, 180].map((x, i) => `<path class="drop d${i % 3}" d="M${x} 60 v12" stroke="#2f6fd6" stroke-width="4" stroke-linecap="round"/>`).join('') + em(110, 118, 30, '☔'); break;
      case 'snowy': scene = em(100, 40, 34, '☁️') + [25, 55, 85, 115, 145, 175].map((x, i) => em(x, 60, 14, '❄️', 'flake f' + (i % 3))).join('') + em(150, 120, 38, '⛄'); break;
      case 'hot': scene = `<rect x="22" y="22" width="16" height="80" rx="8" fill="#fff" ${line} stroke-width="3"/><rect x="25" y="28" width="10" height="72" rx="5" fill="#ff3b3b"/><circle cx="30" cy="104" r="12" fill="#ff3b3b" ${line} stroke-width="3"/>` + em(110, 92, 50, '🥵') + em(170, 70, 30, '🍦', 'melt') + `<path d="M70 30 q8 -8 0 -16 M90 30 q8 -8 0 -16 M110 30 q8 -8 0 -16" fill="none" stroke="#ff7a00" stroke-width="3"/>`; break;
      case 'cold': scene = `<rect x="22" y="22" width="16" height="80" rx="8" fill="#fff" ${line} stroke-width="3"/><rect x="25" y="84" width="10" height="16" rx="5" fill="#3a86ff"/><circle cx="30" cy="104" r="12" fill="#3a86ff" ${line} stroke-width="3"/>` + em(110, 92, 50, '🥶', 'shiver') + em(165, 92, 34, '🧣') + `<path d="M60 22 l6 14 l6 -14 M140 22 l5 12 l5 -12" fill="#e0f4ff" stroke="#7ec8ff" stroke-width="2"/>`; break;
      case 'spring': scene = em(50, 116, 28, '🌷') + em(90, 118, 24, '🌸') + em(130, 116, 28, '🌷') + em(150, 50, 26, '🦋', 'drift') + em(60, 50, 26, '🐣'); break;
      case 'summer': scene = em(160, 46, 40, '☀️', 'spin-slow') + `<rect x="0" y="80" width="200" height="22" fill="#4aa3ff"/>` + em(60, 118, 30, '🏖️') + em(130, 118, 26, '🍉'); break;
      case 'autumn': scene = em(60, 100, 40, '🌳') + em(120, 50, 20, '🍂', 'fall f0') + em(150, 40, 20, '🍁', 'fall f1') + em(90, 40, 18, '🍂', 'fall f2') + em(160, 118, 22, '🍄') + em(130, 120, 18, '🌰'); break;
      case 'winter': scene = em(60, 118, 40, '⛄') + em(150, 116, 38, '🌲') + [30, 80, 120, 170].map((x, i) => em(x, 40, 14, '❄️', 'flake f' + (i % 3))).join(''); break;
    }
    return `<svg class="window" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="win-clip"><rect x="8" y="8" width="184" height="124" rx="10"/></clipPath></defs>
      <g clip-path="url(#win-clip)">
        <rect x="0" y="0" width="200" height="140" fill="${skies[kind]}"/>
        <rect x="0" y="104" width="200" height="40" fill="${ground}"/>
        ${scene}
      </g>
      <rect x="8" y="8" width="184" height="124" rx="10" fill="none" stroke="#8a4b1f" stroke-width="10"/>
      <path d="M100 8 v124 M8 70 h184" stroke="#8a4b1f" stroke-width="6"/>
    </svg>`;
  }

  // ---------- School things (British English, like the school sheet) ----------
  const THINGS = {
    desk: `<svg viewBox="0 0 100 100"><rect x="10" y="30" width="80" height="12" rx="3" fill="#4aa3ff" ${line}/><path d="M18 42 v44 M82 42 v44 M30 42 v30 M70 42 v30" ${line} stroke="#3a3a5c"/></svg>`,
    jumper: `<svg viewBox="0 0 100 100"><path d="M32 16 q18 12 36 0 l18 8 l8 50 h-14 l-6 -36 v50 h-48 v-50 l-6 36 h-14 l8 -50 z" fill="#4aa3ff" ${line}/><rect x="6" y="72" width="14" height="8" rx="2" fill="#2f6fd6" ${line} stroke-width="3"/><rect x="80" y="72" width="14" height="8" rx="2" fill="#2f6fd6" ${line} stroke-width="3"/><rect x="26" y="80" width="48" height="8" rx="2" fill="#2f6fd6" ${line} stroke-width="3"/><path d="M40 17 q10 9 20 0" fill="none" ${line} stroke-width="3"/><path d="M38 40 h24 M38 52 h24" stroke="#fff" stroke-width="3" opacity=".6"/></svg>`,
    rubber: `<svg viewBox="0 0 100 100"><g transform="rotate(-18 50 50)"><rect x="18" y="36" width="64" height="30" rx="5" fill="#fff" ${line}/><rect x="48" y="36" width="34" height="30" rx="4" fill="#ff5a5a" ${line}/></g></svg>`,
    pencilcase: `<svg viewBox="0 0 100 100"><path d="M24 26 l6 -14 l4 14 M40 26 l8 -18 l4 18" fill="#ffd23f" ${line} stroke-width="3"/><rect x="10" y="26" width="80" height="52" rx="22" fill="#3a86ff" ${line}/><path d="M18 34 h64" stroke="#ffd23f" stroke-width="4" stroke-dasharray="4 4"/><circle cx="80" cy="34" r="4" fill="#ffd23f" ${line} stroke-width="2"/></svg>`,
  };
  const EMOJI_THINGS = { chair: '🪑', ruler: '📏', pencil: '✏️', pen: '🖊️', book: '📕', bag: '🎒' };
  function thingHTML(id) {
    return THINGS[id] || `<span class="thing-emoji">${EMOJI_THINGS[id]}</span>`;
  }

  // ---------- Colour pencils on the table (rows of 5 so up to 20 can be counted) ----------
  function pencilsSVG(n) {
    const cols = ['#ff5a5a', '#ff9f1c', '#ffd23f', '#5ccf7a', '#4aa3ff', '#a86bea', '#ff8cc6'];
    let out = '';
    for (let i = 0; i < n; i++) {
      const g = Math.floor(i / 5), k = i % 5;
      const x = 14 + g * 48 + k * 8, col = cols[i % cols.length];
      out += `<g transform="translate(${x} 10)"><rect width="6" height="62" rx="2" fill="${col}" stroke="${INK}" stroke-width="1.5"/><path d="M0 62 l3 10 l3 -10 z" fill="#f2d1a0" stroke="${INK}" stroke-width="1.5"/></g>`;
    }
    return `<svg class="table" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="196" height="96" rx="12" fill="#e9c88f" stroke="#8a4b1f" stroke-width="4"/>
      ${out}</svg>`;
  }

  window.PuppetArt = { COLOURS, puppetSVG, windowSVG, thingHTML, pencilsSVG };
})();
