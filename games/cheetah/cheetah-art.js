// Chita the cheetah: front view (home, wardrobe, finish) and back view (running).
// wear = { acc: 'none' | 'scarf' | 'bow' | 'cap' | 'cape' | 'crown', coat: 'normal' | 'gold' }
(function () {
  const INK = '#3a3a5c';
  const COATS = {
    normal: { fur: '#f2b84b', light: '#fff1d0', spot: '#5a3b1c' },
    gold: { fur: '#ffd23f', light: '#fffbe0', spot: '#c8941a' },
  };
  const st = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const spots = (pts, c, r) => pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${r * (i % 3 === 0 ? 1.2 : 1)}" fill="${c}"/>`).join('');
  const sparkle = (x, y, s) => `<path d="M${x} ${y - s} L${x + s * .3} ${y - s * .3} L${x + s} ${y} L${x + s * .3} ${y + s * .3} L${x} ${y + s} L${x - s * .3} ${y + s * .3} L${x - s} ${y} L${x - s * .3} ${y - s * .3} Z" fill="#fff" opacity=".9"/>`;

  // ---------- Front view, sitting (viewBox 0 0 160 170) ----------
  function front(wear, mood) {
    const w = wear || {}, c = COATS[w.coat] || COATS.normal;
    const happy = mood !== 'wow';
    const cape = w.acc === 'cape' ? `<path d="M44 92 Q22 140 30 166 H130 Q138 140 116 92 Z" fill="#e5383b" ${st}/>` : '';
    const tail = `<path d="M118 150 Q150 150 148 118 Q146 96 132 92" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>
      <path d="M118 150 Q150 150 148 118 Q146 96 132 92" fill="none" stroke="${c.fur}" stroke-width="8" stroke-linecap="round"/>
      <path d="M146 112 l4 0 M147 124 l4 -1 M142 138 l3 2" stroke="${c.spot}" stroke-width="5" stroke-linecap="round"/>`;
    const body = `<path d="M50 160 Q40 110 62 92 H98 Q120 110 110 160 Z" fill="${c.fur}" ${st}/>
      <path d="M66 160 Q62 120 80 104 Q98 120 94 160 Z" fill="${c.light}"/>
      ${spots([[56, 124], [60, 144], [104, 124], [100, 144], [54, 106], [106, 106]], c.spot, 3.2)}
      <ellipse cx="64" cy="160" rx="14" ry="8" fill="${c.fur}" ${st}/><ellipse cx="96" cy="160" rx="14" ry="8" fill="${c.fur}" ${st}/>`;
    const ears = `<path d="M44 40 L40 16 L64 30 Z" fill="${c.fur}" ${st}/><path d="M116 40 L120 16 L96 30 Z" fill="${c.fur}" ${st}/>
      <path d="M46 34 L44 22 L57 30 Z" fill="${INK}"/><path d="M114 34 L116 22 L103 30 Z" fill="${INK}"/>`;
    const head = `<ellipse cx="80" cy="58" rx="40" ry="36" fill="${c.fur}" ${st}/>
      <ellipse cx="80" cy="74" rx="22" ry="16" fill="${c.light}"/>
      ${spots([[60, 34], [72, 28], [88, 28], [100, 34], [48, 52], [112, 52], [52, 66], [108, 66]], c.spot, 2.6)}`;
    const eyes = happy
      ? `<path d="M58 54 q8 -9 16 0" fill="none" ${st} stroke-width="4"/><path d="M86 54 q8 -9 16 0" fill="none" ${st} stroke-width="4"/>`
      : `<circle cx="66" cy="52" r="8" fill="#fff" ${st}/><circle cx="94" cy="52" r="8" fill="#fff" ${st}/>
         <circle cx="67" cy="53" r="4.5" fill="${INK}"/><circle cx="95" cy="53" r="4.5" fill="${INK}"/>
         <circle cx="68.5" cy="51" r="1.6" fill="#fff"/><circle cx="96.5" cy="51" r="1.6" fill="#fff"/>`;
    // The cheetah's "tear marks" from the eyes to the mouth
    const tears = `<path d="M62 58 Q60 70 68 80" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M98 58 Q100 70 92 80" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    const face = `<path d="M74 66 h12 l-6 6 z" fill="${INK}" ${st} stroke-width="2"/>
      ${happy ? `<path d="M70 76 q10 10 20 0" fill="#ff6f91" ${st} stroke-width="2.5"/>` : `<ellipse cx="80" cy="80" rx="5" ry="6" fill="#ff6f91" ${st} stroke-width="2.5"/>`}
      <circle cx="56" cy="68" r="5" fill="#ff9fb8" opacity=".6"/><circle cx="104" cy="68" r="5" fill="#ff9fb8" opacity=".6"/>`;
    const acc = {
      scarf: `<path d="M50 92 Q80 106 110 92 L112 102 Q80 116 48 102 Z" fill="#e5383b" ${st}/>
        <path d="M96 104 l6 26 l10 -4 l-6 -24" fill="#e5383b" ${st}/>
        <path d="M56 96 v8 M66 99 v8 M94 99 v8 M104 96 v8" stroke="#fff" stroke-width="3" opacity=".7"/>`,
      bow: `<g transform="translate(110 24) rotate(18)"><path d="M0 0 l-16 -10 v20 z M0 0 l16 -10 v20 z" fill="#ff6fb5" ${st}/><circle r="5" fill="#ff6fb5" ${st}/></g>`,
      cap: `<path d="M44 38 Q46 8 80 8 Q114 8 116 38 Z" fill="#3a86ff" ${st}/><path d="M44 38 Q80 30 116 38 Q120 46 110 44 Q80 38 50 44 Q40 46 44 38 Z" fill="#2a6fd6" ${st}/><circle cx="80" cy="10" r="4" fill="#ffd23f" ${st} stroke-width="2"/>`,
      cape: `<path d="M56 92 Q80 102 104 92" fill="none" stroke="#e5383b" stroke-width="7" stroke-linecap="round"/><circle cx="80" cy="99" r="6" fill="#ffd23f" ${st} stroke-width="2"/>`,
      crown: `<path d="M56 30 L58 6 L68 20 L80 2 L92 20 L102 6 L104 30 Z" fill="#ffd23f" ${st}/><circle cx="80" cy="18" r="3.5" fill="#e5383b"/><circle cx="64" cy="24" r="2.5" fill="#3a86ff"/><circle cx="96" cy="24" r="2.5" fill="#3fb36b"/>`,
    }[w.acc] || '';
    const shine = w.coat === 'gold' ? sparkle(30, 40, 9) + sparkle(134, 66, 7) + sparkle(124, 20, 6) : '';
    return `<svg class="chita front" viewBox="0 0 160 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${cape}${tail}${body}${ears}${head}${eyes}${tears}${face}${acc}${shine}</svg>`;
  }

  // ---------- Back view, running into the screen (viewBox 0 0 120 140) ----------
  // Legs are .leg-a / .leg-b so CSS can make them gallop.
  function back(wear) {
    const w = wear || {}, c = COATS[w.coat] || COATS.normal;
    const legs = `<ellipse class="leg-a" cx="38" cy="124" rx="11" ry="14" fill="${c.fur}" ${st}/>
      <ellipse class="leg-b" cx="82" cy="124" rx="11" ry="14" fill="${c.fur}" ${st}/>`;
    const tail = `<g class="tail"><path d="M60 112 Q62 132 52 138" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>
      <path d="M60 112 Q62 132 52 138" fill="none" stroke="${c.fur}" stroke-width="7" stroke-linecap="round"/>
      <path d="M58 122 l6 0 M57 130 l6 1" stroke="${c.spot}" stroke-width="4" stroke-linecap="round"/>
      ${w.acc === 'bow' ? `<g transform="translate(54 134)"><path d="M0 0 l-11 -7 v14 z M0 0 l11 -7 v14 z" fill="#ff6fb5" ${st} stroke-width="2.5"/><circle r="3.5" fill="#ff6fb5" ${st} stroke-width="2"/></g>` : ''}</g>`;
    const body = `<ellipse cx="60" cy="84" rx="36" ry="34" fill="${c.fur}" ${st}/>
      ${spots([[44, 70], [60, 64], [76, 70], [40, 88], [56, 84], [72, 88], [82, 100], [48, 102], [64, 104], [86, 80], [34, 78]], c.spot, 3.4)}`;
    const cape = w.acc === 'cape' ? `<path class="cape" d="M36 58 Q60 52 84 58 L96 112 Q60 122 24 112 Z" fill="#e5383b" ${st}/>` : '';
    const head = `<path d="M38 38 L34 14 L54 26 Z" fill="${c.fur}" ${st}/><path d="M82 38 L86 14 L66 26 Z" fill="${c.fur}" ${st}/>
      <path d="M39 31 L37 19 L49 26 Z" fill="${INK}"/><path d="M81 31 L83 19 L71 26 Z" fill="${INK}"/>
      <ellipse cx="60" cy="42" rx="26" ry="22" fill="${c.fur}" ${st}/>
      ${spots([[50, 32], [62, 28], [72, 34], [46, 46], [74, 46], [60, 40]], c.spot, 2.6)}`;
    const acc = {
      scarf: `<path d="M36 58 Q60 68 84 58 L86 66 Q60 78 34 66 Z" fill="#e5383b" ${st}/>
        <path class="flap" d="M70 68 Q84 82 98 76 L96 86 Q80 92 66 76" fill="#e5383b" ${st}/>`,
      cap: `<path d="M34 38 Q36 16 60 16 Q84 16 86 38 Z" fill="#3a86ff" ${st}/><path d="M44 36 Q60 46 76 36 L74 46 Q60 54 46 46 Z" fill="#2a6fd6" ${st}/>`,
      cape: `<path d="M38 58 Q60 64 82 58" fill="none" stroke="#e5383b" stroke-width="6" stroke-linecap="round"/>`,
      crown: `<path d="M44 26 L45 8 L53 18 L60 4 L67 18 L75 8 L76 26 Z" fill="#ffd23f" ${st}/>`,
      bow: '',
    }[w.acc] || '';
    const shine = w.coat === 'gold' ? sparkle(18, 60, 7) + sparkle(104, 40, 6) : '';
    return `<svg class="chita back" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${legs}${body}${cape}${head}${acc}${tail}${shine}</svg>`;
  }

  window.CHITA = { front, back };
})();
