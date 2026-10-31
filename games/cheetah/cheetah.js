// La cursa de la Chita: a 3-lane savanna runner. Each race has 10 answer gates;
// she picks a lane and taps ⚡ to sprint through. Mellis rule on the gates; rocks only cost time.
(function () {
  const M = window.Mellis;
  const $ = (id) => document.getElementById(id);
  const L = (ca, es, en) => ({ ca, es, en });
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const GATES = 10;

  const TEXT = {
    title: L('La cursa de la Chita', 'La carrera de Chita', "Chita's Dash"),
    hello: L('Hola! Sóc la Chita. Corro més que el vent!', '¡Hola! Soy Chita. ¡Corro más que el viento!', "Hi! I'm Chita. I run faster than the wind!"),
    num: L('Números', 'Números', 'Numbers'),
    abc: L('Lletres', 'Letras', 'Letters'),
    mix: L('Barreja', 'Mezcla', 'Mixed'),
    dash: L('Corre!', '¡Corre!', 'Run!'),
    ready: L('Preparades, llestes... ja!', '¡Preparadas, listas... ya!', 'Ready, steady... go!'),
    go: L('Ja!', '¡Ya!', 'Go!'),
    spell: L("Com s'escriu?", '¿Cómo se escribe?', 'How do you spell it?'),
    listen: L('Escolta i tria!', '¡Escucha y elige!', 'Listen and pick!'),
    finish: L('Meta!', '¡Meta!', 'Finish!'),
    record: L('Nou rècord!', '¡Nuevo récord!', 'New record!'),
    gold: L('Chita daurada!', '¡Chita dorada!', 'Golden Chita!'),
    unlocked: L('Nou al vestidor:', 'Nuevo en el vestidor:', 'New in the wardrobe:'),
    wardrobe: L('Vestidor', 'Vestidor', 'Wardrobe'),
    acc: L('Complements', 'Complementos', 'Accessories'),
    trail: L('Rastre', 'Rastro', 'Trail'),
    coat: L('Pelatge', 'Pelaje', 'Coat'),
    plus: L('més', 'más', 'plus'),
    minus: L('menys', 'menos', 'minus'),
    makes: L('fan', 'son', 'is'),
    what: (a, c) => L(`${a} més quants fan ${c}?`, `¿${a} más cuántos son ${c}?`, `${a} plus what makes ${c}?`),
  };

  // Unlocked by the total stars won (gold coat: any ⭐⭐⭐ race).
  const ITEMS = {
    acc: [
      { id: 'none', e: '🐆', need: 0, name: L('Res', 'Nada', 'Nothing') },
      { id: 'scarf', e: '🧣', need: 3, name: L('Bufanda', 'Bufanda', 'Scarf') },
      { id: 'bow', e: '🎀', need: 6, name: L('Llaç', 'Lazo', 'Bow') },
      { id: 'cap', e: '🧢', need: 10, name: L('Gorra', 'Gorra', 'Cap') },
      { id: 'cape', e: '🦸‍♀️', need: 15, name: L('Capa de superheroïna', 'Capa de superheroína', 'Superhero cape') },
      { id: 'crown', e: '👑', need: 21, name: L('Corona', 'Corona', 'Crown') },
    ],
    trail: [
      { id: 'dust', e: '💨', need: 0, name: L('Pols', 'Polvo', 'Dust') },
      { id: 'hearts', e: '💖', need: 4, name: L('Cors', 'Corazones', 'Hearts') },
      { id: 'stars', e: '⭐', need: 12, name: L('Estrelles', 'Estrellas', 'Stars') },
      { id: 'rainbow', e: '🌈', need: 18, name: L('Arc de Sant Martí', 'Arcoíris', 'Rainbow') },
    ],
    coat: [
      { id: 'normal', e: '🐆', need: 0, name: L('Clapat', 'Con manchas', 'Spotty') },
      { id: 'gold', e: '🥇', gold: true, name: L('Daurat', 'Dorado', 'Golden') },
    ],
  };

  // Picture → word and heard word. [right, trap, trap]: the traps are never real words in that language.
  const WORDS = [
    { e: '🦓', ca: ['ZEBRA', 'SEBRA', 'ZEVRA'], es: ['CEBRA', 'SEBRA', 'CEVRA'], en: ['ZEBRA', 'ZEBBRA', 'ZEEBRA'] },
    { e: '🦁', ca: ['LLEÓ', 'LEÓ', 'YEÓ'], es: ['LEÓN', 'LLEÓN', 'LEÓM'], en: ['LION', 'LIUN', 'LAION'] },
    { e: '🦒', ca: ['GIRAFA', 'JIRAFA', 'GIRAFFA'], es: ['JIRAFA', 'GIRAFA', 'JIRRAFA'], en: ['GIRAFFE', 'GIRAFE', 'JIRAFFE'] },
    { e: '🐆', ca: ['GUEPARD', 'GEPARD', 'GUEPART'], es: null, en: ['CHEETAH', 'CHETAH', 'CHEETA'] },
    { e: '🐒', ca: ['MICO', 'MIKO', 'MICU'], es: ['MONO', 'MONNO', 'NOMO'], en: ['MONKEY', 'MUNKEY', 'MONKY'] },
    { e: '🐍', ca: ['SERP', 'SERB', 'CERP'], es: null, en: ['SNAKE', 'SNAIK', 'SNAK'] },
    { e: '🐢', ca: ['TORTUGA', 'TURTUGA', 'TORTUCA'], es: ['TORTUGA', 'TORTUJA', 'TURTUGA'], en: ['TURTLE', 'TURTEL', 'TURTL'] },
    { e: '🌳', ca: ['ARBRE', 'ARBE', 'ALBRE'], es: ['ÁRBOL', 'ÁRBOR', 'ÁLBOL'], en: ['TREE', 'TRE', 'TREA'] },
    { e: '☀️', ca: ['SOL', 'SOLL', 'SUL'], es: ['SOL', 'ZOL', 'SOLL'], en: ['SUN', 'SAN', 'SUNN'] },
    { e: '🌙', ca: ['LLUNA', 'LUNA', 'LLUMA'], es: ['LUNA', 'LLUNA', 'LUMA'], en: ['MOON', 'MUNE', 'MON'] },
    { e: '💧', ca: ['AIGUA', 'AYGUA', 'AIGA'], es: ['AGUA', 'AJUA', 'AGÜA'], en: ['WATER', 'WOTER', 'WATTER'] },
    { e: '🐟', ca: ['PEIX', 'PEIG', 'PEX'], es: ['PEZ', 'PEZZ', 'PEC'], en: ['FISH', 'FICH', 'FISCH'] },
    { e: '🐦', ca: ['OCELL', 'OSELL', 'OCEL'], es: ['PÁJARO', 'PÁGARO', 'PÁHARO'], en: ['BIRD', 'BURD', 'BERD'] },
    { e: '🏠', ca: ['CASA', 'KASA', 'CAZA'], es: ['CASA', 'KASA', 'CASSA'], en: ['HOUSE', 'HOWSE', 'HAUSE'] },
    { e: '🌸', ca: ['FLOR', 'FLÓR', 'FLLOR'], es: ['FLOR', 'FLORR', 'FOLR'], en: ['FLOWER', 'FLOWR', 'FLAWER'] },
    { e: '🍎', ca: ['POMA', 'POME', 'POMMA'], es: ['MANZANA', 'MANSANA', 'MAZANA'], en: ['APPLE', 'APPEL', 'APLE'] },
    { e: '🐸', ca: ['GRANOTA', 'GRANUTA', 'GRANOTE'], es: ['RANA', 'RRANA', 'RANNA'], en: ['FROG', 'FROGG', 'FRAG'] },
    { e: '🐝', ca: ['ABELLA', 'AVELLA', 'ABELA'], es: ['ABEJA', 'AVEJA', 'ABEGA'], en: null },
    { e: '🐱', ca: ['GAT', 'GATT', 'GAD'], es: ['GATO', 'GATTO', 'GATU'], en: ['CAT', 'KAT', 'CATT'] },
    { e: '🐶', ca: ['GOS', 'GOSS', 'GOZ'], es: ['PERRO', 'PERRU', 'PEROO'], en: ['DOG', 'DOGG', 'DAG'] },
    { e: '🍌', ca: ['PLÀTAN', 'PLATAN', 'PLÀTEN'], es: ['PLÁTANO', 'PLÁTAÑO', 'PLATANNO'], en: ['BANANA', 'BANANNA', 'BANAANA'] },
    { e: '🦉', ca: ['MUSSOL', 'MUSOL', 'MUSSUL'], es: ['BÚHO', 'BÚO', 'BÚJO'], en: ['OWL', 'OWEL', 'OUL'] },
    { e: '🐄', ca: ['VACA', 'VAKA', 'VACCA'], es: ['VACA', 'VAKA', 'VACCA'], en: ['COW', 'KOW', 'COWW'] },
    { e: '🦊', ca: ['GUINEU', 'GINEU', 'GUINEO'], es: ['ZORRO', 'SORRO', 'ZORO'], en: ['FOX', 'FOKS', 'FOXX'] },
    { e: '🐻', ca: null, es: ['OSO', 'OZO', 'HOSO'], en: ['BEAR', 'BAIR', 'BEAER'] },
  ];

  // ---------- Saved progress (one device, shared by the twins) ----------
  const STORE = 'mellis.cheetah';
  let S = { stars: 0, best: {}, gold: false, wear: { acc: 'none', trail: 'dust', coat: 'normal' } };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(STORE)) || {}); } catch (e) { /* ignore */ }
  const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  const owned = (kind, it) => (it.gold ? S.gold : S.stars >= it.need);
  const fmt = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const say = (t, opts) => M.speak(String(typeof t === 'string' ? t : M.t(t)).replace(/[¡!¿]/g, ''), M.lang, opts);

  // ---------- Questions ----------
  function numQ(i) {
    let a, b, ans, op = '+', missing = false;
    if (i < 3) { a = rnd(1, 8); b = rnd(1, 10 - a); ans = a + b; }
    else if (i < 7) {
      if (i % 2) { a = b = rnd(2, 10); } else { a = rnd(3, 9); b = rnd(Math.max(2, 11 - a), 9); }
      ans = a + b;
    } else if (i % 2 === 0) { op = '−'; a = rnd(8, 20); b = rnd(2, Math.min(9, a)); ans = a - b; }
    else { missing = true; a = rnd(2, 9); b = rnd(2, Math.min(9, 20 - a)); ans = b; }
    const c = op === '+' ? a + b : a - b;
    const near = shuffle([ans + 1, ans - 1, ans + 2, ans - 2]).concat([ans + 10, ans - 10, ans + 3]).filter((n) => n >= 0 && n <= 20 && n !== ans);
    const opts = [ans, ...near.slice(0, 2)].map(String);
    const word = op === '+' ? TEXT.plus : TEXT.minus;
    return {
      kind: 'num', answer: String(ans), opts,
      show: missing ? `${a} + ? = ${c}` : `${a} ${op} ${b} = ?`,
      say: () => (missing ? M.t(TEXT.what(a, c)) : `${a} ${M.t(word)} ${b}`),
      full: `${a} ${op} ${b} = ${c}`,
      fullSay: () => `${a} ${M.t(word)} ${b} ${M.t(TEXT.makes)} ${c}`,
    };
  }
  function abcQ(w, heard) {
    const set = w[M.lang];
    return { kind: heard ? 'heard' : 'pic', e: w.e, answer: set[0], opts: set.slice(), full: `${w.e} ${set[0]}`, fullSay: () => set[0].toLowerCase(), say: () => set[0].toLowerCase() };
  }
  // Heard words only when the language has its own voice (not Catalan read by the Spanish one).
  const canHear = () => !M.isMuted() && M.canSpeak(M.lang) && M.ownVoice(M.lang);
  function makeRace(mode) {
    const words = shuffle(WORDS.filter((w) => w[M.lang]));
    const hear = canHear();
    let wi = 0;
    return Array.from({ length: GATES }, (_, i) => {
      const letters = mode === 'abc' || (mode === 'mix' && i % 2 === 1);
      const q = letters ? abcQ(words[wi++], hear && (mode === 'abc' ? i % 2 === 1 : wi % 2 === 0)) : numQ(i);
      q.key = 'q' + i;
      return q;
    });
  }

  // ---------- Screens ----------
  function show(id) {
    ['home', 'race'].forEach((s) => { $(s).hidden = s !== id; });
    $('win').hidden = true;
    $('wardrobe').hidden = true;
  }
  const MODES = [
    { id: 'num', e: '🔢', sub: '7 + 5 · 12 − 4', color: '#ff9f1c' },
    { id: 'abc', e: '🔤', sub: '🦓 ZEBRA · 🔊', color: '#9b5de5' },
    { id: 'mix', e: '🎲', sub: '🔢 + 🔤', color: '#2ec4b6' },
  ];
  function renderHome() {
    $('title').textContent = M.t(TEXT.title);
    document.title = `${M.t(TEXT.title)} · Laboratorio Mellis`;
    $('home-chita').innerHTML = CHITA.front(S.wear, 'happy');
    $('home-say').textContent = M.t(TEXT.hello);
    $('star-count').textContent = S.stars ? `⭐${S.stars}` : '';
    $('modes').innerHTML = MODES.map((m) => `<button class="mode" data-mode="${m.id}" style="--c:${m.color}">
      <span class="m-e">${m.e}</span><span class="m-text"><b>${M.t(TEXT[m.id])}</b><small>${m.sub}</small></span>
      <span class="m-rec">${S.best[m.id] ? `🏆 ${fmt(S.best[m.id])}` : ''}</span></button>`).join('');
  }
  $('modes').addEventListener('click', (e) => {
    const b = e.target.closest('.mode');
    if (!b) return;
    M.sounds.pop();
    startRace(b.dataset.mode);
  });

  // ---------- The world (canvas) ----------
  const cv = $('world'), cx = cv.getContext('2d');
  const K = 12, CH = 2, THINK = 7, FAR = 70, RUN = 18, TROT = 3, SPRINT = 46, TURBO = 36;
  let W = 300, H = 300, HY = 60, RW = 80;
  const sc = (d) => K / (K + Math.max(d, -K * 0.8));
  const gy = (d) => HY + (H - HY) * sc(d);
  const LW = () => (W / 3) * 1.2;
  const lx = (lane, d) => W / 2 + lane * LW() * sc(d);

  let R = null; // the current race
  function resize() {
    const r = $('track').getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height; HY = H * 0.2;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    RW = Math.min(W * 0.27, H * 0.34);
    $('runner').style.width = `${RW}px`;
    placeRunner();
  }
  window.addEventListener('resize', resize);
  function placeRunner() {
    if (!R) return;
    const el = $('runner');
    el.style.left = `${lx(R.lane, CH) - RW / 2}px`;
    el.style.top = `${gy(CH) - RW * 1.12}px`;
  }

  function drawSky() {
    const g = cx.createLinearGradient(0, 0, 0, HY);
    g.addColorStop(0, '#ffc777'); g.addColorStop(1, '#ffe9c4');
    cx.fillStyle = g; cx.fillRect(0, 0, W, HY + 1);
    cx.fillStyle = '#fff3b0'; cx.beginPath(); cx.arc(W * 0.78, HY * 0.45, HY * 0.28, 0, 7); cx.fill();
    // far hills
    cx.fillStyle = '#d9a35b';
    cx.beginPath(); cx.moveTo(0, HY);
    for (let x = 0; x <= W; x += W / 6) cx.quadraticCurveTo(x + W / 12, HY - HY * (0.18 + 0.12 * Math.sin(x)), x + W / 6, HY);
    cx.fill();
    // ground
    const gg = cx.createLinearGradient(0, HY, 0, H);
    gg.addColorStop(0, '#d8c26a'); gg.addColorStop(1, '#b5a24a');
    cx.fillStyle = gg; cx.fillRect(0, HY, W, H - HY);
    // the track: 3 lanes of red earth
    const e = -1.5, f = 1.5;
    cx.fillStyle = '#d98b4f';
    cx.beginPath();
    cx.moveTo(lx(e, FAR), gy(FAR)); cx.lineTo(lx(f, FAR), gy(FAR));
    cx.lineTo(lx(f, -K * 0.8 + 0.5), H + 40); cx.lineTo(lx(e, -K * 0.8 + 0.5), H + 40);
    cx.fill();
    // lane lines, moving with the run
    cx.fillStyle = 'rgba(255, 248, 220, .75)';
    const step = 4, start = Math.ceil((R ? R.dist : 0) / step) * step;
    for (let z = start; z < (R ? R.dist : 0) + FAR; z += step) {
      const d1 = z - (R ? R.dist : 0), d2 = d1 + 1.6;
      if (d1 < -2) continue;
      [-0.5, 0.5].forEach((b) => {
        const w1 = 3 * sc(d1), w2 = 3 * sc(d2);
        cx.beginPath();
        cx.moveTo(lx(b, d1) - w1, gy(d1)); cx.lineTo(lx(b, d1) + w1, gy(d1));
        cx.lineTo(lx(b, d2) + w2, gy(d2)); cx.lineTo(lx(b, d2) - w2, gy(d2));
        cx.fill();
      });
    }
  }
  function acacia(x, y, s) {
    cx.strokeStyle = '#6b4423'; cx.lineWidth = 6 * s; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x, y - 70 * s); cx.lineTo(x - 20 * s, y - 100 * s);
    cx.moveTo(x, y - 70 * s); cx.lineTo(x + 22 * s, y - 104 * s); cx.stroke();
    cx.fillStyle = '#5f8a3a';
    cx.beginPath(); cx.ellipse(x, y - 110 * s, 64 * s, 16 * s, 0, 0, 7); cx.fill();
    cx.fillStyle = '#7aa64a';
    cx.beginPath(); cx.ellipse(x - 10 * s, y - 116 * s, 44 * s, 10 * s, 0, 0, 7); cx.fill();
  }
  function emoji(ch, x, y, size, alpha) {
    cx.globalAlpha = alpha == null ? 1 : alpha;
    cx.font = `${Math.max(4, size)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    cx.textAlign = 'center'; cx.textBaseline = 'alphabetic';
    cx.fillText(ch, x, y);
    cx.globalAlpha = 1;
  }
  function roundRect(x, y, w, h, r) {
    cx.beginPath();
    cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r);
    cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath();
  }
  const fade = (d) => Math.max(0, Math.min(1, (FAR - d) / 8));
  function drawGate(g) {
    const s = sc(g.d), base = gy(g.d), a = fade(g.d);
    const w = LW() * s * 0.9, h = 62 * s, bottom = base - 112 * s, top = bottom - h;
    cx.globalAlpha = a;
    g.opts.forEach((txt, i) => {
      const lane = i - 1, x = lx(lane, g.d);
      cx.fillStyle = '#6b4423'; cx.fillRect(x - 3 * s, bottom, 6 * s, base - bottom);
      let fill = '#fffdf5';
      if (g.result) {
        if (txt === g.q.answer && (g.result === 'right' || g.reveal)) fill = '#8be08b';
        else if (lane === g.picked && g.result === 'wrong') fill = '#ff8f8f';
      }
      const mine = !g.result && lane === R.lane && g.d <= THINK + 6;
      roundRect(x - w / 2, top, w, h, 10 * s);
      cx.fillStyle = fill; cx.fill();
      cx.lineWidth = Math.max(1.5, (mine ? 6 : 3.5) * s);
      cx.strokeStyle = mine ? '#ffb400' : '#3a3a5c'; cx.stroke();
      let fs = 34 * s;
      cx.font = `700 ${fs}px Fredoka, sans-serif`;
      while (fs > 6 && cx.measureText(txt).width > w * 0.86) { fs -= 1; cx.font = `700 ${fs}px Fredoka, sans-serif`; }
      cx.fillStyle = '#3a3a5c'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
      cx.fillText(txt, x, top + h / 2 + fs * 0.04);
    });
    cx.globalAlpha = 1;
  }
  function drawFinish(f) {
    const s = sc(f.d), base = gy(f.d), x1 = lx(-1.5, f.d), x2 = lx(1.5, f.d), top = base - 150 * s, bh = 34 * s;
    cx.globalAlpha = fade(f.d);
    cx.fillStyle = '#6b4423'; cx.fillRect(x1, top, 7 * s, base - top); cx.fillRect(x2 - 7 * s, top, 7 * s, base - top);
    const n = 12, cw = (x2 - x1) / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) {
      cx.fillStyle = (i + j) % 2 ? '#3a3a5c' : '#fff';
      cx.fillRect(x1 + i * cw, top + j * bh / 2, cw + 0.5, bh / 2 + 0.5);
    }
    cx.globalAlpha = 1;
  }
  function draw() {
    cx.clearRect(0, 0, W, H);
    drawSky();
    if (!R) return;
    const things = [];
    R.scenery.forEach((o) => { const d = o.z - R.dist; if (d > -K * 0.6 && d < FAR) things.push({ d, o }); });
    R.rocks.forEach((o) => things.push({ d: o.d, rock: o }));
    if (R.gate) things.push({ d: R.gate.d, gate: R.gate });
    if (R.finishLine) things.push({ d: R.finishLine.d, fin: R.finishLine });
    things.sort((a, b) => b.d - a.d).forEach((t) => {
      const s = sc(t.d);
      if (t.gate) drawGate(t.gate);
      else if (t.fin) drawFinish(t.fin);
      else if (t.rock) emoji(t.rock.e, lx(t.rock.lane, t.d), gy(t.d) + 6 * s, 58 * s, fade(t.d));
      else if (t.o.kind === 'tree') acacia(lx(t.o.x, t.d), gy(t.d), s);
      else if (t.o.kind === 'grass') {
        cx.strokeStyle = '#8a9a3a'; cx.lineWidth = Math.max(1, 2.5 * s);
        const x = lx(t.o.x, t.d), y = gy(t.d);
        cx.beginPath(); cx.moveTo(x - 8 * s, y); cx.lineTo(x - 12 * s, y - 16 * s); cx.moveTo(x, y); cx.lineTo(x, y - 20 * s);
        cx.moveTo(x + 8 * s, y); cx.lineTo(x + 12 * s, y - 16 * s); cx.stroke();
      } else emoji(t.o.e, lx(t.o.x, t.d), gy(t.d), 70 * s, fade(t.d));
    });
    // trail behind Chita
    R.parts.forEach((p) => {
      const a = Math.max(0, p.life);
      if (p.kind === 'dust') { cx.globalAlpha = a * 0.6; cx.fillStyle = '#f3dfb5'; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); cx.globalAlpha = 1; }
      else if (p.kind === 'rainbow') { cx.globalAlpha = a * 0.8; cx.fillStyle = `hsl(${p.h},90%,62%)`; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); cx.globalAlpha = 1; }
      else emoji(p.ch, p.x, p.y, p.r * 2.2, a);
    });
  }

  // ---------- The race ----------
  const round = M.round({ heartsEl: $('hearts'), onOut: () => startRace(R.mode) });
  let raf = 0, last = 0, hidden = false;

  function startRace(mode) {
    show('race');
    R = {
      mode, qs: makeRace(mode), qi: 0, lane: 0, dist: 0, speed: 0, target: 0, turboT: 0,
      gate: null, rocks: [], finishLine: null, rockNext: false, scenery: [], nextScene: 0, parts: [], partT: 0,
      time: 0, phase: 'count', frozen: false, jumpT: 0, tripT: 0, results: [], done: false,
    };
    round.start();
    $('gates').innerHTML = Array.from({ length: GATES }, () => '<span></span>').join('');
    $('timer').textContent = '0:00';
    $('question').innerHTML = '';
    $('question').className = 'question';
    $('runner-body').innerHTML = CHITA.back(S.wear);
    $('runner').className = 'runner idle';
    renderDash();
    resize();
    countdown();
    cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function countdown() {
    const el = $('count-down'), me = R;
    el.hidden = false;
    say(TEXT.ready);
    const seq = ['3', '2', '1', M.t(TEXT.go)];
    seq.forEach((n, i) => setTimeout(() => {
      if (R !== me || R.phase !== 'count') return;
      el.textContent = n;
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
      if (i < 3) M.sounds.tick(); else M.sounds.match();
      if (i === 3) setTimeout(() => { el.hidden = true; R.phase = 'run'; R.target = RUN; $('runner').className = 'runner'; }, 450);
    }, 300 + i * 650));
  }

  function renderProgress() {
    [...$('gates').children].forEach((s, i) => {
      s.className = R.results[i] || (i === R.qi && !R.done ? 'now' : '');
    });
  }
  function renderQuestion(q) {
    const el = $('question');
    el.className = 'question pop';
    if (q.kind === 'num') el.innerHTML = `<b class="q-big">${q.show}</b>`;
    else if (q.kind === 'pic') el.innerHTML = `<span class="q-emoji">${q.e}</span><span class="q-small">${M.t(TEXT.spell)}</span>`;
    else el.innerHTML = `<button class="q-listen" id="q-listen" aria-label="listen">🔊</button><span class="q-small">${M.t(TEXT.listen)}</span>`;
    const lb = $('q-listen');
    if (lb) lb.onclick = () => say(q.say());
  }
  function renderDash() {
    const g = R && R.gate;
    const ok = g && !g.result && !g.committed && !g.waiting && !R.frozen;
    $('dash').disabled = !ok;
    $('dash').classList.toggle('ready', !!(ok && g.d <= THINK + 0.5));
    $('dash').innerHTML = `⚡ ${M.t(TEXT.dash)}`;
  }
  function spawnGate(again) {
    const q = R.qs[R.qi];
    q.opts = shuffle(q.opts.slice());
    R.gate = { q, opts: q.opts, d: again ? 34 : FAR, committed: false, waiting: false, result: null, picked: null };
    renderQuestion(q);
    renderProgress();
    if (q.kind === 'heard') {
      R.gate.waiting = true;
      const g = R.gate;
      say(q.say(), { onend: () => { g.waiting = false; renderDash(); } });
    } else if (q.kind === 'num') say(q.say());
    renderDash();
  }
  function spawnRocks() {
    const two = R.qi >= 5 && Math.random() < 0.4;
    const lanes = shuffle([-1, 0, 1]).slice(0, two ? 2 : 1);
    lanes.forEach((lane) => R.rocks.push({ lane, d: 52, e: Math.random() < 0.5 ? '🪨' : '🪵', hit: false }));
  }
  function commit() {
    const g = R && R.gate;
    if (!g || g.committed || g.waiting || g.result || R.frozen) return;
    g.committed = true;
    R.target = SPRINT;
    M.sounds.flip();
    renderDash();
  }
  function setLane(l) {
    if (!R || R.phase === 'count' || R.frozen || R.tripT > 0) return;
    const n = Math.max(-1, Math.min(1, l));
    if (n === R.lane) return;
    R.lane = n;
    M.sounds.pop();
    placeRunner();
  }
  function jump() {
    if (!R || R.phase !== 'run' || R.frozen || R.jumpT > 0 || R.tripT > 0) return;
    R.jumpT = 0.7;
    M.sounds.boing();
    const el = $('runner');
    el.classList.remove('jump'); void el.offsetWidth; el.classList.add('jump');
  }

  function resolve(g) {
    const lane = R.lane;
    g.picked = lane;
    const right = g.opts[lane + 1] === g.q.answer;
    if (right) {
      g.result = 'right';
      R.results[R.qi] = R.results[R.qi] || 'on';
      M.sounds.match();
      R.turboT = 1.2;
      R.target = TURBO;
      $('question').className = 'question good';
      next();
      return;
    }
    g.result = 'wrong';
    R.frozen = true;
    R.speed = 0; R.target = 0;
    $('runner').className = 'runner trip';
    renderDash();
    round.wrong(g.q.key).then(({ reveal }) => {
      $('runner').className = 'runner';
      if (!reveal) { R.frozen = false; R.target = RUN; R.gate = null; spawnGate(true); return; }
      // 2nd miss: show the whole answer, then move on
      const q = g.q;
      g.reveal = true;
      $('question').className = 'question reveal';
      $('question').innerHTML = `<b class="q-big">${q.full}</b>`;
      say(q.fullSay());
      R.results[R.qi] = 'shown';
      setTimeout(() => { R.frozen = false; R.target = RUN; R.gate = null; next(); }, 2600);
    });
  }
  function next() {
    R.qi++;
    renderProgress();
    if (R.qi >= GATES) { R.finishLine = { d: 60 }; return; }
    R.rockNext = R.qi >= 1 && Math.random() < 0.6;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (hidden || !R) return;
    if (!R.frozen && R.phase === 'run') {
      R.time += dt * 1000;
      $('timer').textContent = fmt(R.time);
    }
    // speed
    if (R.turboT > 0) { R.turboT -= dt; if (R.turboT <= 0 && R.target === TURBO) R.target = RUN; }
    if (R.tripT > 0) { R.tripT -= dt; R.speed = 0; if (R.tripT <= 0) { $('runner').className = 'runner'; R.target = RUN; } }
    else R.speed += (R.target - R.speed) * Math.min(1, dt * 4);
    if (R.jumpT > 0) R.jumpT -= dt;
    const move = R.frozen ? 0 : R.speed * dt;
    R.dist += move;

    // scenery ahead
    while (R.nextScene < R.dist + FAR) {
      const side = Math.random() < 0.5 ? -1 : 1, r = Math.random();
      if (r < 0.35) R.scenery.push({ z: R.nextScene, kind: 'tree', x: side * (2.4 + Math.random() * 1.2) });
      else if (r < 0.45) R.scenery.push({ z: R.nextScene, kind: 'emoji', x: side * (2.6 + Math.random()), e: ['🦓', '🦒', '🐘', '🦛', '🦩', '🐃'][rnd(0, 5)] });
      else R.scenery.push({ z: R.nextScene, kind: 'grass', x: side * (1.9 + Math.random() * 1.6) });
      R.nextScene += 3 + Math.random() * 4;
    }
    R.scenery = R.scenery.filter((o) => o.z - R.dist > -K * 0.6);

    if (R.phase === 'run' && !R.frozen) {
      // what comes next on the track
      if (!R.gate && !R.rocks.length && !R.finishLine && R.qi < GATES) {
        if (R.rockNext) { R.rockNext = false; spawnRocks(); } else spawnGate(false);
      }
      R.rocks.forEach((k) => {
        k.d -= move;
        if (!k.hit && k.d <= CH + 0.4 && k.d > CH - 1.2 && k.lane === R.lane && R.jumpT <= 0) {
          k.hit = true;
          R.tripT = 0.9;
          $('runner').className = 'runner trip';
          M.sounds.raspberry();
        }
      });
      R.rocks = R.rocks.filter((k) => k.d > -3);
      const g = R.gate;
      if (g) {
        if (!g.waiting && !g.result) {
          g.d -= move;
          if (!g.committed && g.d <= THINK) { g.d = THINK; R.target = TROT; }
          if (g.d <= CH) resolve(g);
        } else if (g.result === 'right') {
          g.d -= move;
          if (g.d < -3) R.gate = null;
        }
        renderDash();
      }
      if (R.finishLine) {
        R.finishLine.d -= move;
        if (R.target === RUN) R.target = TURBO;
        if (R.finishLine.d <= CH && !R.done) finish();
      }
    }
    // trail
    R.partT -= dt;
    if (R.speed > 4 && R.partT <= 0 && !R.frozen) {
      R.partT = 0.05;
      const x = lx(R.lane, CH) + (Math.random() - 0.5) * RW * 0.4, y = gy(CH) - RW * 0.08;
      const kind = S.wear.trail;
      const p = { x, y, vx: (Math.random() - 0.5) * 50, vy: 70 + Math.random() * 60, life: 1, r: 4 + Math.random() * 5, kind: kind === 'dust' || kind === 'rainbow' ? kind : 'emoji', h: (now / 4) % 360 };
      if (kind === 'hearts') p.ch = '💖';
      if (kind === 'stars') p.ch = '⭐';
      if (S.wear.coat === 'gold' && Math.random() < 0.3) { p.kind = 'emoji'; p.ch = '✨'; }
      R.parts.push(p);
    }
    R.parts.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 1.6; p.r += dt * 6; });
    R.parts = R.parts.filter((p) => p.life > 0);
    $('runner').classList.toggle('fast', R.speed > RUN + 6);
    draw();
  }
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; last = performance.now(); });

  function finish() {
    R.done = true;
    R.phase = 'end';
    R.target = 0;
    $('runner').className = 'runner idle';
    renderProgress();
    const stars = round.stars();
    const before = S.stars, firstGold = stars === 3 && !S.gold;
    S.stars += stars;
    if (stars === 3) S.gold = true;
    const prev = S.best[R.mode];
    const rec = !prev || R.time < prev;
    if (rec) S.best[R.mode] = Math.round(R.time);
    persist();
    const fresh = [...ITEMS.acc, ...ITEMS.trail].filter((it) => it.need > before && it.need <= S.stars);
    if (firstGold) fresh.push(ITEMS.coat[1]);
    $('win-text').textContent = stars === 3 ? `🥇 ${M.t(TEXT.gold)}` : `🏁 ${M.t(TEXT.finish)}`;
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('win-chita').innerHTML = CHITA.front(Object.assign({}, S.wear, stars === 3 ? { coat: 'gold' } : {}), 'wow');
    $('win-chita').classList.toggle('gold', stars === 3);
    $('win-time').textContent = `⏱️ ${fmt(R.time)}`;
    $('win-record').hidden = !rec;
    $('win-record').textContent = `🏆 ${M.t(TEXT.record)}`;
    $('win-unlock').hidden = !fresh.length;
    $('win-unlock').textContent = `🎁 ${M.t(TEXT.unlocked)} ${fresh.map((it) => `${it.e} ${M.t(it.name)}`).join(', ')}`;
    setTimeout(() => {
      $('win').hidden = false;
      M.sounds.win();
      M.confetti();
      say(`${M.t(stars === 3 ? TEXT.gold : TEXT.finish)} ${rec ? M.t(TEXT.record) : ''}`);
    }, 700);
  }
  $('again').onclick = () => { M.sounds.pop(); startRace(R.mode); };
  $('to-home').onclick = () => { M.sounds.pop(); goHome(); };
  $('to-wardrobe').onclick = () => { M.sounds.pop(); goHome(); openWardrobe(); };
  function goHome() {
    cancelAnimationFrame(raf);
    R = null;
    show('home');
    renderHome();
  }

  // ---------- Controls: tap a lane, swipe, ⚡ ----------
  let down = null;
  $('track').addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
  $('track').addEventListener('pointerup', (e) => {
    if (!down || !R) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    down = null;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) { setLane(R.lane + Math.sign(dx)); return; }
    if (dy < -30) { jump(); return; }
    const r = $('track').getBoundingClientRect();
    const lane = Math.max(-1, Math.min(1, Math.round((e.clientX - r.left - W / 2) / (LW() * sc(CH)))));
    if (lane === R.lane) jump(); else setLane(lane);
  });
  $('track').addEventListener('pointercancel', () => { down = null; });
  $('dash').addEventListener('click', commit);
  document.addEventListener('keydown', (e) => {
    if (!R || $('race').hidden) return;
    if (e.key === 'ArrowLeft') setLane(R.lane - 1);
    else if (e.key === 'ArrowRight') setLane(R.lane + 1);
    else if (e.key === 'ArrowUp' || e.key === ' ') jump();
    else if (e.key === 'Enter') commit();
    else return;
    e.preventDefault();
  });

  // ---------- Wardrobe ----------
  function openWardrobe() {
    $('wardrobe').hidden = false;
    renderWardrobe();
  }
  function renderWardrobe() {
    $('ward-title').textContent = `👗 ${M.t(TEXT.wardrobe)}`;
    $('ward-stars').textContent = `⭐ ${S.stars}`;
    $('ward-chita').innerHTML = CHITA.front(S.wear, 'happy');
    $('ward-items').innerHTML = ['acc', 'trail', 'coat'].map((kind) => `<p class="ward-h">${M.t(TEXT[kind])}</p>
      <div class="ward-row">${ITEMS[kind].map((it) => {
        const has = owned(kind, it), on = S.wear[kind] === it.id;
        const lock = it.gold ? '⭐⭐⭐' : `⭐${it.need}`;
        return `<button class="item${on ? ' on' : ''}${has ? '' : ' locked'}" data-kind="${kind}" data-id="${it.id}" aria-label="${M.t(it.name)}">
          <span class="i-e">${it.e}</span><small>${has ? M.t(it.name) : `🔒 ${lock}`}</small></button>`;
      }).join('')}</div>`).join('');
  }
  $('ward-items').addEventListener('click', (e) => {
    const b = e.target.closest('.item');
    if (!b) return;
    const it = ITEMS[b.dataset.kind].find((x) => x.id === b.dataset.id);
    if (!owned(b.dataset.kind, it)) { M.sounds.miss(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
    S.wear[b.dataset.kind] = it.id;
    persist();
    M.sounds.pop();
    renderWardrobe();
  });
  $('wardrobe-btn').onclick = () => { M.sounds.pop(); openWardrobe(); };
  $('ward-close').onclick = () => { M.sounds.pop(); $('wardrobe').hidden = true; renderHome(); };

  // ---------- Start ----------
  M.mountControls($('controls'));
  M.onLang(() => { if (!$('home').hidden) renderHome(); if (!$('wardrobe').hidden) renderWardrobe(); });
  M.music.button($('music'));
  M.music.play('savanna');
  show('home');
  renderHome();
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { if (R) draw(); });

  // Test hook: answer the current gate (true = right lane) and sprint.
  window.__chita = {
    get race() { return R; },
    answer(ok) {
      const g = R && R.gate;
      if (!g) return 'no gate';
      const i = g.opts.indexOf(g.q.answer);
      R.lane = ok ? i - 1 : (i === 0 ? 0 : i - 2);
      placeRunner();
      g.waiting = false;
      commit();
      return g.q.answer;
    },
  };
})();
