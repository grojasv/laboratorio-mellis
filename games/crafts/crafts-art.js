// Taller Mellis: the drawings. IKEA-style line art, one action per step, animated with SMIL
// (works on iOS too). Every step loops on the same clock (D seconds) so its pieces stay in sync.
(() => {
  const INK = '#3a3a5c';
  const D = 4;                                       // seconds per animation loop
  const LOOP = `dur="${D}s" repeatCount="indefinite"`;
  const ST = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
  const f = (n) => Math.round(n * 10) / 10;

  // ---------- building blocks ----------
  let uid = 0;                                       // each drawing gets its own ids (several share a page)
  const svg = (body, vb = '0 0 200 200') => { const id = `c${++uid}`; return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="__ID__ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 Z" fill="${INK}"/></marker></defs>${body}</svg>`.replace(/__ID__/g, id); };
  const rect = (x, y, w, h, fill = '#fff') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}" ${ST}/>`;
  const poly = (pts, fill = '#fff') => `<polygon points="${pts.map((p) => p.map(f).join(',')).join(' ')}" fill="${fill}" ${ST}/>`;
  const dash = (d, color = INK) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round"/>`;
  const arrow = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" marker-end="url(#__ID__ah)"/>`;
  // shown only between two moments of the loop (fractions 0–1)
  const during = (body, a, b = 1) => `<g opacity="0">${body}<animate attributeName="opacity" ${LOOP}
    values="0;0;1;1${b < 1 ? ';0;0' : ''}" keyTimes="0;${a};${Math.min(a + 0.05, b)};${b < 1 ? `${b};${Math.min(b + 0.02, 1)};1` : '1'}"/></g>`;
  // draws a line little by little
  const draw = (d, a = 0.05, b = 0.6, color = INK, w = 2.5) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}"
    stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100">
    <animate attributeName="stroke-dashoffset" ${LOOP} values="100;100;0;0" keyTimes="0;${a};${b};1"/></path>`;
  // scissors travelling along a cut line (a red dashed line marks where to cut)
  const cut = (d, a = 0.05, b = 0.75) => `${dash(d, '#e5383b')}
    <g><text font-size="22" x="0" y="0" text-anchor="middle" dominant-baseline="central">✂️</text>
    <animateMotion ${LOOP} path="${d}" keyPoints="0;0;1;1" keyTimes="0;${a};${b};1" calcMode="linear"/></g>`;
  // a flap of paper folding over the crease through (ox, oy) at angle deg (0 = horizontal crease)
  const fold = (body, ox, oy, deg, a = 0.15, b = 0.6) => `<g transform="translate(${ox} ${oy}) rotate(${deg})"><g>
    <animateTransform attributeName="transform" type="scale" ${LOOP} values="1 1;1 1;1 -1;1 -1" keyTimes="0;${a};${b};1"/>
    <g transform="rotate(${-deg}) translate(${-ox} ${-oy})">${body}</g></g></g>`;
  // slides something in from (dx, dy)
  const slide = (body, dx, dy, a = 0.1, b = 0.6) => `<g>${body}<animateTransform attributeName="transform" type="translate" ${LOOP}
    values="${dx} ${dy};${dx} ${dy};0 0;0 0" keyTimes="0;${a};${b};1"/></g>`;
  const pulse = (x, y, r = 12) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd23f" opacity=".7">
    <animate attributeName="r" ${LOOP} values="${r};${r * 1.5};${r}"/></circle>`;
  const label = (x, y, t, size = 16) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" fill="${INK}" text-anchor="middle" font-family="Fredoka, sans-serif">${t}</text>`;

  // ---------- 👻 ghost garland ----------
  // a ghost whose hands reach both edges of its panel (that's where the chain holds together)
  function ghost(cx, top, w, h) {
    const L = cx - w / 2, R = cx + w / 2, ay = top + h * 0.42, bw = w * 0.3, bot = top + h, s = (2 * bw) / 3;
    const head = `M${f(L)} ${f(ay - 7)} L${f(cx - bw)} ${f(ay - 9)} C${f(cx - bw)} ${f(top - 4)} ${f(cx + bw)} ${f(top - 4)} ${f(cx + bw)} ${f(ay - 9)} L${f(R)} ${f(ay - 7)}`;
    const body = `L${f(cx + bw)} ${f(ay + 6)} L${f(cx + bw)} ${f(bot)} Q${f(cx + bw - s / 2)} ${f(bot - 10)} ${f(cx + bw - s)} ${f(bot)}
      Q${f(cx)} ${f(bot - 10)} ${f(cx - bw + s)} ${f(bot)} Q${f(cx - bw + s / 2)} ${f(bot - 10)} ${f(cx - bw)} ${f(bot)} L${f(cx - bw)} ${f(ay + 6)} L${f(L)} ${f(ay + 7)}`;
    return {
      outline: `${head} L${f(R)} ${f(ay + 7)} ${body} Z`,
      cut: `${head} M${f(R)} ${f(ay + 7)} ${body}`,      // the hands stay uncut
      hands: [[L, ay], [R, ay]],
      face: (o = 1) => `<ellipse cx="${f(cx - w * 0.11)}" cy="${f(top + h * 0.26)}" rx="${f(w * 0.05)}" ry="${f(w * 0.08)}" fill="${INK}" opacity="${o}"/>
        <ellipse cx="${f(cx + w * 0.11)}" cy="${f(top + h * 0.26)}" rx="${f(w * 0.05)}" ry="${f(w * 0.08)}" fill="${INK}" opacity="${o}"/>
        <ellipse cx="${f(cx)}" cy="${f(top + h * 0.5)}" rx="${f(w * 0.06)}" ry="${f(w * 0.09)}" fill="${INK}" opacity="${o}"/>`,
    };
  }
  const chain = (faces) => [0, 1, 2, 3].map((i) => {
    const g = ghost(32.5 + i * 45, 50, 45, 80);
    return `<path d="${g.outline}" fill="#fff" ${ST}/>${faces ? g.face() : ''}`;
  }).join('');
  const ghostBlock = () => `${rect(56, 26, 100, 150, '#eee')}${rect(53, 23, 100, 150, '#f6f6f6')}${rect(50, 20, 100, 150)}`;
  const GHOSTS = [
    () => svg(`${rect(20, 45, 160, 110)}${cut('M20 100 H180')}`),
    () => svg(`${rect(20, 75, 80, 50)}${fold(rect(100, 75, 80, 50), 100, 100, 90)}${arrow('M160 65 Q100 25 45 62')}`),
    () => svg(`${rect(60, 45, 80, 50)}${fold(rect(100, 45, 40, 50), 100, 70, 90)}${arrow('M128 38 Q100 15 74 36')}
      ${during(`<g transform="translate(0 6)"><text x="100" y="128" font-size="18" text-anchor="middle">👁️</text>
        <path d="M50 140 H150 Q158 144 150 148 H50 Q42 152 50 156 H150 Q158 160 150 164 H50" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>`, 0.6)}`),
    () => { const g = ghost(100, 40, 100, 120); return svg(`${ghostBlock()}${draw(g.outline, 0.05, 0.65)}${during(pulse(50, g.hands[0][1]) + pulse(150, g.hands[1][1]) + label(100, 192, '✋ ✋'), 0.7)}`); },
    () => { const g = ghost(100, 40, 100, 120); return svg(`${ghostBlock()}${pulse(50, g.hands[0][1])}${pulse(150, g.hands[1][1])}
      <path d="${g.outline}" fill="none" stroke="${INK}" stroke-width="2"/>${cut(g.cut, 0.05, 0.85)}`); },
    () => svg([0, 1, 2, 3].map((i) => { const g = ghost(32.5 + i * 45, 60, 45, 80); return during(`<path d="${g.outline}" fill="#fff" ${ST}/>`, 0.05 + i * 0.15); }).join('')),
    () => svg(`${[0, 1, 2, 3].map((i) => { const g = ghost(32.5 + i * 45, 60, 45, 80); return `<path d="${g.outline}" fill="#fff" ${ST}/>${during(g.face(), 0.1 + i * 0.15)}`; }).join('')}
      ${during(label(100, 175, 'BUUU!', 22), 0.75)}`),
  ];
  const ghostsPreview = () => svg(`${chain(true)}`, '0 40 200 100');

  // ---------- 🧻 toilet-roll mummy ----------
  const roll = (body = '') => `<clipPath id="__ID__rc"><path d="M70 40 V160 A30 8 0 0 0 130 160 V40 Z"/></clipPath>
    <path d="M70 40 V160 A30 8 0 0 0 130 160 V40" fill="#d9b48a" ${ST}/>
    <g clip-path="url(#__ID__rc)">${body}</g>
    <ellipse cx="100" cy="40" rx="30" ry="8" fill="#8b6b4a" ${ST}/>`;
  const BANDS = [52, 64, 76, 112, 124, 136, 148, 160];
  const band = (y, i) => `<rect x="60" y="${y - 6}" width="80" height="11" fill="#fff" stroke="${INK}" stroke-width="1.5" transform="rotate(${i % 2 ? 7 : -7} 100 ${y})"/>`;
  const eyes = (dy = 0) => `<g transform="translate(0 ${dy})"><circle cx="88" cy="94" r="9" fill="#fff" ${ST}/><circle cx="112" cy="94" r="9" fill="#fff" ${ST}/>
    <circle cx="90" cy="95" r="4" fill="${INK}"/><circle cx="110" cy="95" r="4" fill="${INK}"/></g>`;
  const wrapped = () => roll(BANDS.map(band).join(''));
  const glue = `<g><rect x="138" y="70" width="18" height="44" rx="3" fill="#9b5de5" ${ST}/><rect x="138" y="62" width="18" height="12" rx="2" fill="#fff" ${ST}/>
    <animateTransform attributeName="transform" type="translate" ${LOOP} values="0 -20;-40 10;0 40;-40 10;0 -20"/></g>`;
  const MUMMY = [
    () => svg(`${rect(45, 25, 110, 150)}${cut('M67 25 V175 M89 25 V175 M111 25 V175 M133 25 V175', 0.05, 0.85)}`),
    () => svg(`${roll(during('<rect x="70" y="40" width="60" height="125" fill="#fff" opacity=".45"/>', 0.3))}${glue}`),
    () => svg(`${roll(BANDS.map((y, i) => during(band(y, i), 0.05 + i * 0.08)).join(''))}
      ${during(`<rect x="66" y="84" width="68" height="20" rx="6" fill="none" stroke="#e5383b" stroke-width="2.5" stroke-dasharray="5 4"/>${label(100, 192, '👀')}`, 0.75)}`),
    () => svg(`<g transform="translate(-40 0)"><circle cx="100" cy="100" r="22" fill="#fff" ${ST}/></g><g transform="translate(40 0)"><circle cx="100" cy="100" r="22" fill="#fff" ${ST}/></g>
      ${cut('M82 100 A22 22 0 1 1 38 100 A22 22 0 1 1 82 100', 0.02, 0.45)}${during(`<circle cx="62" cy="102" r="8" fill="${INK}"/><circle cx="138" cy="102" r="8" fill="${INK}"/>`, 0.55)}
      ${during('<text x="100" y="150" font-size="26" text-anchor="middle">🖊️</text>', 0.5)}`),
    () => svg(`${wrapped()}${slide(eyes(), 0, -70, 0.1, 0.55)}`),
  ];
  const mummyPreview = () => svg(`${wrapped()}${eyes()}<path d="M128 140 q14 6 10 22" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`, '30 25 140 150');

  // ---------- ❄️ paper snowflake ----------
  // the unfolded snowflake: 16 mirrored half-wedges = 8 arms, with holes along the folds
  function flakePath(cx = 100, cy = 100, R = 80) {
    const prof = [[0, 1], [4, 1], [6, 0.75], [10, 0.82], [13, 0.6], [17, 0.66], [22.5, 0.46]];
    const pts = [];
    for (let k = 0; k < 16; k++) {
      const half = k % 2 ? prof.slice().reverse().map(([a, r]) => [22.5 - a, r]) : prof;
      half.forEach(([a, r]) => { const t = (k * 22.5 + a - 90) * Math.PI / 180; pts.push([cx + R * r * Math.cos(t), cy + R * r * Math.sin(t)]); });
    }
    let d = `M${pts.map((p) => p.map(f).join(' ')).join(' L')} Z`;
    for (let k = 0; k < 8; k++) {
      const t = (k * 45 - 90) * Math.PI / 180, r = R * 0.55, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t), q = R * 0.08;
      d += ` M${f(x + q)} ${f(y)} A${f(q)} ${f(q)} 0 1 0 ${f(x - q)} ${f(y)} A${f(q)} ${f(q)} 0 1 0 ${f(x + q)} ${f(y)} Z`;
      const t2 = (k * 45 - 67.5) * Math.PI / 180, r2 = R * 0.3, x2 = cx + r2 * Math.cos(t2), y2 = cy + r2 * Math.sin(t2), s = R * 0.08;
      d += ` M${f(x2)} ${f(y2 - s)} L${f(x2 + s)} ${f(y2)} L${f(x2)} ${f(y2 + s)} L${f(x2 - s)} ${f(y2)} Z`;
    }
    return d;
  }
  const flake = (body = '') => `<path d="${flakePath()}" fill="#fff" fill-rule="evenodd" ${ST}/>${body}`;
  // the folded wedge, enlarged: apex = the middle of the paper, bottom = the outer edge
  function wedgeCuts() {
    const A = [100, 20], Lb = [34, 180], Rb = [166, 180];
    const P = (B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
    const nL = [0.925, -0.38], nR = [-0.925, -0.38];
    const notch = (B, n, t1, t2, depth) => { const p1 = P(B, t1), p2 = P(B, t2), m = P(B, (t1 + t2) / 2); return [p1, [m[0] + n[0] * depth, m[1] - n[1] * depth], p2]; };
    const n1 = notch(Lb, [nL[0], -nL[1]], 0.35, 0.5, 16), n2 = notch(Rb, [nR[0], -nR[1]], 0.55, 0.72, 18), n3 = notch(Lb, [nL[0], -nL[1]], 0.68, 0.8, 12);
    const tri = (n) => `M${n.map((p) => p.map(f).join(' ')).join(' L')}`;
    const k = 160 / Math.hypot(Lb[0] - A[0], Lb[1] - A[1]), e1 = P(Lb, k), e2 = P(Rb, k);   // round the end: same distance from the middle
    const edge = `M${f(e1[0])} ${f(e1[1])} Q100 192 ${f(e2[0])} ${f(e2[1])}`;
    const corners = [[e1, Lb, [100, 180], [70, 177]], [e2, Rb, [100, 180], [130, 177]]];
    return { A, Lb, Rb, pieces: [n1, n2, n3, ...corners], path: `${tri(n1)} ${tri(n3)} ${tri(n2)} ${edge}` };
  }
  const SNOW = [
    () => svg(`${poly([[50, 20], [150, 120], [150, 160], [50, 160]])}${fold(poly([[50, 20], [150, 20], [150, 120]]), 50, 20, 45, 0.1, 0.45)}${during(cut('M50 120 H150', 0.5, 0.9), 0.48)}`),
    () => svg(`${poly([[160, 40], [160, 160], [40, 160]])}${fold(poly([[40, 40], [160, 40], [40, 160]]), 40, 160, -45)}`),
    () => svg(`${poly([[40, 160], [160, 160], [100, 100]])}${fold(poly([[160, 40], [160, 160], [100, 100]]), 100, 100, 45)}`),
    () => svg(`<g transform="translate(-30 -40) scale(1.3)">${poly([[40, 160], [100, 160], [100, 100]])}${fold(poly([[100, 100], [160, 160], [100, 160]]), 100, 100, 90)}</g>`),
    () => { const w = wedgeCuts(); return svg(`${poly([w.A, w.Lb, w.Rb])}${w.pieces.map((n, i) => during(poly(n, '#ffb3b3'), 0.12 + i * 0.2)).join('')}${cut(w.path, 0.05, 0.85)}`); },
    () => svg(`<g><g>${flake()}<animateTransform attributeName="transform" type="scale" ${LOOP} values="0.15;0.15;1;1" keyTimes="0;0.05;0.55;1" additive="sum"/></g>
      <animateTransform attributeName="transform" type="translate" ${LOOP} values="85 85;85 85;0 0;0 0" keyTimes="0;0.05;0.55;1"/></g>
      ${during(label(100, 196, '✨', 18), 0.6)}`),
  ];
  const snowPreview = () => svg(flake());

  // ---------- ⭐ slot-together 3D star ----------
  // 5 dots on a clock face (12, 2, 5, 7, 10), joined skipping one: the outline is the star
  function star(cx = 100, cy = 100, r = 42) {
    const P = [0, 2, 5, 7, 10].map((h) => { const a = h * Math.PI / 6; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; });
    const meet = (p1, p2, p3, p4) => {
      const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
      const t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d;
      return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
    };
    const I = P.map((_, i) => meet(P[i], P[(i + 2) % 5], P[(i + 1) % 5], P[(i + 4) % 5]));
    const outline = P.flatMap((p, i) => [p, I[i]]);
    const c = [I.reduce((s, p) => s + p[0], 0) / 5, I.reduce((s, p) => s + p[1], 0) / 5];
    const pt = (p) => p.map(f).join(' ');
    return {
      P, outline, c,
      d: `M${outline.map(pt).join(' L')} Z`,
      lines: `M${[0, 2, 4, 1, 3, 0].map((i) => pt(P[i])).join(' L')}`,
      top: `M${pt(P[0])} L${pt(c)}`,
      bottom: `M${pt(I[2])} L${pt(c)}`,              // the notch between the two bottom legs (5 and 7)
    };
  }
  const YEL = '#ffd23f';
  const starShape = (s, fill = YEL) => `<path d="${s.d}" fill="${fill}" ${ST}/>`;
  const STAR = [
    () => svg(`${rect(20, 45, 80, 110, YEL)}${fold(rect(100, 45, 80, 110, YEL), 100, 100, 90)}${arrow('M160 35 Q100 0 45 32')}`),
    () => {
      const s = star(), nums = ['12', '2', '5', '7', '10'];
      return svg(`${rect(50, 30, 110, 140, YEL)}<line x1="50" y1="30" x2="50" y2="170" stroke="${INK}" stroke-width="5"/>
        <g transform="translate(5 0)">${s.P.map((p, i) => during(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="4.5" fill="${INK}"/>
        <text x="${f(100 + (p[0] - 100) * 1.35)}" y="${f(100 + (p[1] - 100) * 1.35 + 5)}" font-size="13" font-weight="700" text-anchor="middle" fill="#a0522d">${nums[i]}</text>`, 0.05 + i * 0.15)).join('')}</g>`);
    },
    () => { const s = star(); return svg(`${rect(50, 30, 110, 140, YEL)}<line x1="50" y1="30" x2="50" y2="170" stroke="${INK}" stroke-width="5"/>
      <g transform="translate(5 0)">${s.P.map((p) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="4.5" fill="${INK}"/>`).join('')}${draw(s.lines, 0.05, 0.8)}</g>`); },
    () => {
      const s = star(105, 98, 56), paper = `<g opacity=".5">${rect(42, 22, 126, 150, YEL)}</g><line x1="42" y1="22" x2="42" y2="172" stroke="${INK}" stroke-width="5" opacity=".5"/>`;
      return svg(`${during(paper, 0, 0.66)}${during(`<g>${starShape(s, '#f2b705')}<animateTransform attributeName="transform" type="translate" ${LOOP}
        values="0 0;0 0;-28 -6;-28 -6" keyTimes="0;0.7;0.9;1"/></g>`, 0.66)}${during(starShape(s), 0, 0.66)}
        ${during(`<g>${starShape(s)}<animateTransform attributeName="transform" type="translate" ${LOOP} values="0 0;0 0;34 30;34 30" keyTimes="0;0.7;0.9;1"/></g>`, 0.66)}
        <path d="${s.lines}" fill="none" stroke="${INK}" stroke-width="1" opacity=".3"/>${cut(s.d, 0.02, 0.65)}`);
    },
    () => { const s = star(100, 100, 70); return svg(`${starShape(s)}${label(40, 40, '1', 26)}${cut(s.top, 0.05, 0.6)}${pulse(f(s.c[0]), f(s.c[1]), 6)}`); },
    () => { const s = star(100, 100, 70); return svg(`${starShape(s)}${label(40, 40, '2', 26)}${cut(s.bottom, 0.05, 0.6)}${pulse(f(s.c[0]), f(s.c[1]), 6)}`); },
    () => {
      const s = star(100, 100, 70), top = s.P[0][1], bot = s.outline[5][1];
      const edge = `<rect x="96" y="${f(top)}" width="8" height="${f(bot - top)}" rx="3" fill="#f2b705" ${ST}/>`;
      return svg(`${starShape(s)}${slide(edge, 0, -95, 0.1, 0.6)}${during(label(100, 196, '3D!', 22), 0.7)}`);
    },
  ];
  const starPreview = () => { const s = star(100, 100, 80); return svg(starShape(s)); };
  // the right half of the star, for the spinning 3D model (4 half-planes meeting at the middle)
  const starHalf = (fill) => { const s = star(100, 100, 80); return svg(starShape(s, fill), '100 0 100 200'); };

  window.CRAFT_ART = {
    ghosts: { steps: GHOSTS, preview: ghostsPreview },
    mummy: { steps: MUMMY, preview: mummyPreview },
    snow: { steps: SNOW, preview: snowPreview },
    star: { steps: STAR, preview: starPreview, half: starHalf },
  };

  // Tisoreta, the chatty scissors: two halves that open and close around the screw
  window.TISORETA_SVG = `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" class="tiso">
    <g class="half a"><path d="M55 74 L65 74 L62 10 Q59 3 56 10 Z" fill="#cfd8e3" ${ST}/>
      <path d="M62 76 L78 100" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><ellipse cx="86" cy="110" rx="17" ry="13" fill="#ff6fb5" ${ST}/><ellipse cx="86" cy="110" rx="8" ry="5" fill="#fff8dc" ${ST}/></g>
    <g class="half b"><path d="M55 74 L65 74 L62 10 Q59 3 56 10 Z" fill="#e6edf5" ${ST}/>
      <path d="M58 76 L42 100" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><ellipse cx="34" cy="110" rx="17" ry="13" fill="#ff6fb5" ${ST}/><ellipse cx="34" cy="110" rx="8" ry="5" fill="#fff8dc" ${ST}/></g>
    <circle cx="49" cy="68" r="10" fill="#fff" ${ST}/><circle cx="71" cy="68" r="10" fill="#fff" ${ST}/>
    <circle class="pupil" cx="51" cy="70" r="4.5" fill="${INK}"/><circle class="pupil" cx="73" cy="70" r="4.5" fill="${INK}"/>
    <circle cx="42" cy="82" r="4" fill="#ff6fb5" opacity=".5"/><circle cx="78" cy="82" r="4" fill="#ff6fb5" opacity=".5"/>
    <path d="M53 84 Q60 91 67 84" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/></svg>`;
})();
