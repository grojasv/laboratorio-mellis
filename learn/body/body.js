(function () {
  const M = window.Mellis;
  const L = (ca, es, en) => ({ ca, es, en });
  const U = window.BODY_UNIT;
  const { CATS, ITEMS, PUZZLES, LESSONS } = U;
  const STICKERS_KEY = 'mellis.body.stickers'; // { itemId: 1 }
  const LESSONS_KEY = 'mellis.body.lessons';   // { lessonId: best stars }

  const TEXT = {
    title: L('Aprenem: el cos humà', 'Aprendemos: el cuerpo humano', "Let's learn: the human body"),
    unit: L('El cos humà', 'El cuerpo humano', 'The human body'),
    album: L('Els meus adhesius', 'Mis pegatinas', 'My stickers'),
    ask: {
      sense: L('Quin sentit fas servir?', '¿Qué sentido usas?', 'Which sense do you use?'),
      food: L('A quin grup del plat va?', '¿En qué grupo del plato va?', 'Which part of the plate?'),
      good: L('És un bon hàbit?', '¿Es un buen hábito?', 'Is it a good habit?'),
    },
    tapSense: { ca: (v) => `Toca el que fem servir per ${v}!`, es: (v) => `¡Toca lo que usamos para ${v}!`, en: (v) => `Tap what we use to ${v}!` },
    tapPart: { ca: (p) => `Toca ${p}!`, es: (p) => `¡Toca ${p}!`, en: (p) => `Tap ${p}!` },
    notWith: { ca: (o) => `Quin d'aquests NO fem amb ${o}?`, es: (o) => `¿Cuál de estos NO hacemos con ${o}?`, en: (o) => `Which one do we NOT do with ${o}?` },
    order: {
      skeleton: L("Munta l'esquelet de dalt a baix!", '¡Monta el esqueleto de arriba abajo!', 'Build the skeleton from top to bottom!'),
      digestion: L("El viatge de l'entrepà: per on passa primer?", 'El viaje del bocadillo: ¿por dónde pasa primero?', "The sandwich's journey: where does it go first?"),
      routines: L('Posa els passos en ordre!', '¡Pon los pasos en orden!', 'Put the steps in order!'),
    },
    win: L('Lliçó acabada!', '¡Lección terminada!', 'Lesson done!'),
    newStickers: L('Adhesius nous:', 'Pegatinas nuevas:', 'New stickers:'),
  };

  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function load(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  const pic = (p) => (p.startsWith('<svg') ? p : `<span class="emoji">${p}</span>`);
  const say = (text, opts) => M.speak(text.replace(/[¡!¿«»"]/g, '').replace(/\bNO\b/g, 'no').replace(/\bSÍ\b/g, 'sí'), M.lang, opts);
  const nameOf = (it) => M.t(it.name || it.the);

  // the sentence after an answer
  function explain(it, cat) {
    const n = nameOf(it), lang = M.lang;
    if (cat === 'sense') {
      const s = CATS.sense[it.v];
      return { ca: `Per ${n} fem servir ${M.t(s.the)}: ${M.t(s.organ)}!`, es: `¡Para ${n} usamos ${M.t(s.the)}: ${M.t(s.organ)}!`, en: `To ${n} we use our sense of ${M.t(s.the)}: ${M.t(s.organ)}!` }[lang];
    }
    if (cat === 'food') {
      const g = CATS.food[it.v];
      if (it.v === 'sometimes') return { ca: `${cap(n)}: només de tant en tant!`, es: `¡${cap(n)}: solo de vez en cuando!`, en: `${cap(n)}: only once in a while!` }[lang];
      return { ca: `${cap(n)} va a «${M.t(g.name)}»: ${M.t(g.why)}!`, es: `¡${cap(n)} va en «${M.t(g.name)}»: ${M.t(g.why)}!`, en: `${cap(n)} goes in "${M.t(g.name)}": ${M.t(g.why)}!` }[lang];
    }
    if (cat === 'good') {
      return it.v === 'yes'
        ? { ca: `${cap(n)} és un bon hàbit!`, es: `¡${cap(n)} es un buen hábito!`, en: `${cap(n)} is a good habit!` }[lang]
        : { ca: `${cap(n)} no és bo per al cos!`, es: `¡${cap(n)} no es bueno para el cuerpo!`, en: `${cap(n)} is not good for your body!` }[lang];
    }
    if (cat === 'part') return M.t(it.fact);
    return cap(n) + '!';
  }

  // ---------- Screens ----------
  const SCREENS = ['unit', 'explore', 'choose', 'tap', 'order', 'check', 'album'];
  let screen = 'unit', lesson = null;
  function show(name) {
    SCREENS.forEach((s) => { $(s).hidden = s !== name; });
    $('win').hidden = true;
    $('lesson-bar').hidden = !lesson || ['unit', 'album'].includes(name);
    screen = name;
    window.scrollTo(0, 0);
  }
  function renderSteps(now) {
    if (!lesson) return;
    const icons = ['🔍'].concat(lesson.acts.map((a) => a.icon), '🤔');
    $('lesson-steps').innerHTML = icons.map((ic, i) => `<span class="${i < now ? 'done' : i === now ? 'now' : ''}">${ic}</span>`).join('');
  }

  function renderUnit() {
    const best = load(LESSONS_KEY);
    $('unit-title').textContent = M.t(TEXT.unit);
    $('lessons').innerHTML = LESSONS.map((l) => `
      <button class="lesson" data-id="${l.id}">
        <span class="l-num">${l.id}</span><span class="l-icon">${l.icon}</span>
        <span class="l-name">${M.t(l.name)}</span>
        <span class="l-stars">${best[l.id] ? (best[l.id] === 3 ? '🥇' : '⭐'.repeat(best[l.id])) : ''}</span>
      </button>`).join('');
    const total = LESSONS.reduce((n, l) => n + ITEMS[l.stickers].length, 0);
    $('album-count').textContent = `${Object.keys(load(STICKERS_KEY)).length}/${total}`;
  }

  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    $('album-label').textContent = M.t(TEXT.album);
    $('album-title').textContent = M.t(TEXT.album);
    renderUnit();
    if (screen === 'explore') renderExplore();
    if (screen === 'choose') renderChoose();
    if (screen === 'tap') renderTap();
    if (screen === 'order') renderOrder();
    if (screen === 'check') renderCheck();
    if (screen === 'album') renderAlbum();
  }

  // ---------- Lesson state ----------
  // The Mellis rule: 3 hearts from the first activity to the check; 0 hearts = start the activities again with new questions
  const round = M.round({ heartsEl: $('hearts'), onOut: () => startActs() });
  let heard = new Set(), actIdx = 0, learned = [], busy = false, act = null;
  let list = [], idx = 0, placed = 0, pool = [], checks = [], checkIdx = 0;

  function startLesson(l) {
    lesson = l;
    heard = new Set();
    show('explore');
    renderSteps(0);
    renderExplore();
    say(M.t(l.intro));
  }

  // ---------- Explore ----------
  const tiles = () => lesson.explore.flatMap((c) => Object.keys(CATS[c]).map((v) => ({ key: c + ':' + v, t: CATS[c][v] })));
  function renderExplore() {
    $('explore-intro').textContent = M.t(lesson.intro);
    const all = tiles();
    $('groups').innerHTML = all.map(({ key, t }) =>
      `<button class="group${heard.has(key) ? ' heard' : ''}" data-k="${key}" style="--c:${t.color}">
        <span class="g-ex">${t.ex}</span><span class="g-name">${t.icon} ${M.t(t.name)}</span></button>`).join('');
    $('explore-next').hidden = heard.size < all.length;
  }
  $('groups').addEventListener('click', (e) => {
    const b = e.target.closest('.group');
    if (!b) return;
    const [c, v] = b.dataset.k.split(':');
    const t = CATS[c][v];
    heard.add(b.dataset.k);
    M.sounds.pop();
    $('explore-fact').innerHTML = `<b style="color:${t.color}">${M.t(t.name)}</b> ${M.t(t.fact)}`;
    $('explore-fact').hidden = false;
    say(M.t(t.fact));
    renderExplore();
  });
  $('explore-next').addEventListener('click', () => { M.sounds.pop(); startActs(); });

  function startActs() {
    round.start();
    learned = [];
    actIdx = 0;
    runAct();
  }
  function runAct() {
    busy = false;
    renderSteps(actIdx + 1);
    if (actIdx >= lesson.acts.length) { startCheck(); return; }
    act = lesson.acts[actIdx];
    ({ choose: startChoose, tap: startTap, order: startOrder })[act.type]();
  }
  function nextAct() { actIdx++; runAct(); }
  // every answer shows up at least once, then random
  function pickItems(items, n) {
    const values = [...new Set(items.map((i) => i.v))];
    const chosen = shuffle(values).map((v) => pick(items.filter((i) => i.v === v)));
    const rest = shuffle(items.filter((i) => !chosen.includes(i))).slice(0, Math.max(0, n - chosen.length));
    return shuffle(chosen.concat(rest)).slice(0, Math.max(n, values.length));
  }
  function wrongThen(el, key, onReveal) {
    el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong');
    busy = true;
    round.wrong(key).then(({ reveal }) => {
      busy = false;
      if (reveal) onReveal();
    });
  }
  function explainThen(msgEl, text, next) {
    msgEl.textContent = text;
    msgEl.hidden = false;
    say(text, { onend: () => setTimeout(() => { busy = false; next(); }, 600) });
  }

  // ---------- Choose: an item → its category ----------
  function startChoose() {
    list = pickItems(ITEMS[act.items], act.n);
    idx = 0;
    show('choose');
    renderChoose(true);
    sayItem();
  }
  function renderChoose(fresh) {
    const it = list[idx];
    $('choose-ask').textContent = M.t(TEXT.ask[act.cat]);
    $('choose-progress').innerHTML = list.map((x, i) => `<span class="${i < idx ? 'done' : i === idx ? 'now' : ''}">●</span>`).join('');
    $('choose-item').innerHTML = `<div class="big-face">${pic(it.e)}</div><p class="a-name">${cap(M.t(it.name))}</p>`;
    $('choose-item').className = 'choose-item';
    $('choose-msg').hidden = true;
    const values = Object.keys(CATS[act.cat]).filter((v) => ITEMS[act.items].some((i) => i.v === v));
    $('options').className = 'options opts-' + act.cat;
    $('options').innerHTML = values.map((v) => {
      const t = CATS[act.cat][v];
      return `<button class="option" data-v="${v}" style="--c:${t.color}"><span class="o-icon">${t.icon}</span><span class="o-name">${M.t(t.name)}</span></button>`;
    }).join('');
  }
  function sayItem() { say(cap(M.t(list[idx].name)) + '. ' + M.t(TEXT.ask[act.cat])); }
  $('options').addEventListener('click', (e) => {
    const b = e.target.closest('.option');
    if (!b || busy) return;
    const it = list[idx];
    if (b.dataset.v !== it.v) { wrongThen(b, act.cat + idx, () => chosen(it, true)); return; }
    chosen(it, false);
  });
  function chosen(it, revealed) {
    busy = true;
    document.querySelector(`.option[data-v="${it.v}"]`).classList.add(revealed ? 'reveal' : 'right');
    const el = $('choose-item');
    el.classList.remove('jump'); void el.offsetWidth; el.classList.add('jump');
    if (!revealed) M.sounds.match();
    learned.push(it);
    explainThen($('choose-msg'), explain(it, act.cat), () => {
      idx++;
      if (idx < list.length) { renderChoose(false); sayItem(); } else nextAct();
    });
  }

  // ---------- Tap: find it on the face / body ----------
  function startTap() {
    list = act.items
      ? shuffle(ITEMS[act.items].slice()).slice(0, act.n)
      : shuffle(Object.keys(CATS[act.cat])).slice(0, act.n).map((v) => ({ id: v, v }));
    idx = 0;
    show('tap');
    $('drawing').innerHTML = U[act.drawing];
    $('drawing').className = 'drawing ' + act.drawing.toLowerCase();
    renderTap();
    say($('tap-ask').textContent);
  }
  function tapAsk(t) {
    if (act.items) return TEXT.tapPart[M.lang](M.t(t.the));
    return TEXT.tapSense[M.lang](M.t(CATS.sense[t.v].verb));
  }
  function renderTap() {
    $('tap-ask').textContent = tapAsk(list[idx]);
    $('tap-progress').innerHTML = list.map((x, i) => `<span class="${i < idx ? 'done' : i === idx ? 'now' : ''}">●</span>`).join('');
    $('tap-msg').hidden = true;
    $('drawing').querySelectorAll('.tap').forEach((g) => g.classList.remove('right', 'reveal', 'wrong'));
  }
  $('drawing').addEventListener('click', (e) => {
    const g = e.target.closest('[data-p]');
    if (!g || busy) return;
    const t = list[idx];
    const all = $('drawing').querySelectorAll(`[data-p="${t.id}"]`);
    if (g.dataset.p !== t.id) {
      wrongThen(g, 'tap' + idx, () => tapped(t, all, true));
      return;
    }
    tapped(t, all, false);
  });
  function tapped(t, all, revealed) {
    busy = true;
    all.forEach((g) => g.classList.add(revealed ? 'reveal' : 'right'));
    if (!revealed) M.sounds.match();
    let text;
    if (act.items) { learned.push(t); text = explain(t, 'part'); } else {
      const s = CATS.sense[t.v];
      text = { ca: `${cap(M.t(s.organ))}! Per ${M.t(s.verb)} fem servir ${M.t(s.the)}.`, es: `¡${cap(M.t(s.organ))}! Para ${M.t(s.verb)} usamos ${M.t(s.the)}.`, en: `${cap(M.t(s.organ))}! To ${M.t(s.verb)} we use our sense of ${M.t(s.the)}.` }[M.lang];
    }
    explainThen($('tap-msg'), text, () => {
      idx++;
      if (idx < list.length) { renderTap(); say($('tap-ask').textContent); } else nextAct();
    });
  }

  // ---------- Order: skeleton, sandwich journey, routines ----------
  function startOrder() {
    list = shuffle(PUZZLES[act.set].slice()).slice(0, act.n);
    idx = 0;
    show('order');
    startPuzzle();
  }
  function startPuzzle() {
    placed = 0;
    pool = shuffle(list[idx].steps.map((s, i) => i));
    renderOrder();
    say(M.t(TEXT.order[act.set]));
  }
  function renderOrder() {
    const p = list[idx];
    $('order-ask').textContent = M.t(TEXT.order[act.set]);
    $('order-msg').hidden = placed < p.steps.length;
    $('slots').className = 'slots' + (act.set === 'skeleton' ? ' vertical' : '');
    $('pieces').className = 'pieces' + (p.steps.length > 4 ? ' five' : '');
    $('slots').innerHTML = p.steps.map((s, i) => (i < placed
      ? `<div class="slot full">${pic(s[0])}<span>${M.t(s[1])}</span></div>`
      : `<div class="slot${i === placed ? ' next' : ''}">?</div>`)).join('');
    $('pieces').innerHTML = pool.map((i) =>
      `<button class="piece" data-i="${i}">${pic(p.steps[i][0])}<span>${M.t(p.steps[i][1])}</span></button>`).join('');
  }
  $('pieces').addEventListener('click', (e) => {
    const b = e.target.closest('.piece');
    if (!b || busy) return;
    if (+b.dataset.i !== placed) {
      wrongThen(b, `order${idx}-${placed}`, () => {
        document.querySelector(`.piece[data-i="${placed}"]`).classList.add('reveal');
        busy = true;
        setTimeout(() => { busy = false; place(); }, 1200);
      });
      return;
    }
    place();
  });
  function place() {
    M.sounds.pop();
    pool = pool.filter((i) => i !== placed);
    placed++;
    renderOrder();
    const p = list[idx];
    if (placed < p.steps.length) return;
    busy = true;
    M.sounds.match();
    explainThen($('order-msg'), M.t(p.say), () => {
      idx++;
      if (idx < list.length) startPuzzle(); else nextAct();
    });
  }

  // ---------- Check: odd one out ----------
  function partByKey(k) {
    const p = ITEMS.part.find((x) => x.id === k);
    return p ? { id: k, e: p.e, name: p.the, fact: p.fact } : { id: k, ...U.EXTRA_PARTS[k] };
  }
  function makeCheck(used) {
    const c = lesson.check;
    if (c.parts) {
      const pc = pick(U.PART_CHECKS.filter((x) => !used.includes(x.q)));
      const odd = partByKey(pick(pc.odd));
      return { key: pc.q, q: M.t(pc.q), qObj: pc.q, odd, opts: shuffle(shuffle(pc.same.slice()).slice(0, 3).map(partByKey).concat(odd)) };
    }
    const items = ITEMS[c.items];
    const values = [...new Set(items.map((i) => i.v))].filter((v) => items.filter((i) => i.v === v).length >= 3 && !used.includes(v));
    const v = pick(values);
    const same = shuffle(items.filter((i) => i.v === v)).slice(0, 3);
    const odd = pick(items.filter((i) => i.v !== v));
    return { key: v, v, cat: c.cat, odd, opts: shuffle(same.concat(odd)) };
  }
  function checkAsk(ch) {
    if (ch.qObj) return M.t(ch.qObj);
    if (ch.cat === 'sense') return TEXT.notWith[M.lang](M.t(CATS.sense[ch.v].organ));
    return M.t(CATS[ch.cat][ch.v].q);
  }
  function startCheck() {
    checks = [];
    while (checks.length < lesson.check.n) checks.push(makeCheck(checks.map((x) => x.key)));
    checkIdx = 0;
    show('check');
    renderSteps(lesson.acts.length + 1);
    renderCheck();
    say(checkAsk(checks[0]));
  }
  function renderCheck() {
    const ch = checks[checkIdx];
    $('check-ask').textContent = checkAsk(ch);
    $('check-msg').hidden = true;
    $('check-opts').className = 'odds' + (ch.cat === 'sense' || ch.cat === 'good' ? ' wordy' : '');
    $('check-opts').innerHTML = ch.opts.map((it) =>
      `<button class="odd" data-id="${it.id}">${pic(it.e)}<span>${cap(nameOf(it))}</span></button>`).join('');
  }
  $('check-opts').addEventListener('click', (e) => {
    const b = e.target.closest('.odd');
    if (!b || busy) return;
    const ch = checks[checkIdx];
    if (b.dataset.id !== ch.odd.id) { wrongThen(b, 'check' + checkIdx, () => checked(ch, true)); return; }
    checked(ch, false);
  });
  function checked(ch, revealed) {
    busy = true;
    document.querySelector(`.odd[data-id="${ch.odd.id}"]`).classList.add(revealed ? 'reveal' : 'right');
    if (!revealed) M.sounds.match();
    const text = ch.qObj ? (ch.odd.fact ? M.t(ch.odd.fact) : cap(nameOf(ch.odd)) + '!') : explain(ch.odd, ch.cat);
    if (!ch.qObj) learned.push(ch.odd);
    explainThen($('check-msg'), text, () => {
      checkIdx++;
      if (checkIdx < checks.length) { renderCheck(); say(checkAsk(checks[checkIdx])); } else finish();
    });
  }

  function finish() {
    const stars = round.stars();
    const best = load(LESSONS_KEY);
    best[lesson.id] = Math.max(best[lesson.id] || 0, stars);
    save(LESSONS_KEY, best);
    const got = load(STICKERS_KEY);
    const fresh = [];
    learned.forEach((it) => { if (!got[it.id]) { got[it.id] = 1; fresh.push(it); } });
    save(STICKERS_KEY, got);
    renderSteps(lesson.acts.length + 2);
    $('win-text').textContent = M.t(TEXT.win);
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('win-new').textContent = fresh.length ? M.t(TEXT.newStickers) : '';
    $('win-cards').innerHTML = fresh.map((it) => `<div class="sticker${stars === 3 ? ' gold' : ''}">${pic(it.e)}</div>`).join('');
    $('win-twins').innerHTML = M.mascotsSVG('cheer');
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    say(M.t(TEXT.win));
  }

  // ---------- Sticker album ----------
  function renderAlbum() {
    const got = load(STICKERS_KEY);
    $('album-grid').innerHTML = LESSONS.map((l) => `
      <h3 class="album-sec">${l.icon} ${M.t(l.name)}</h3>
      <div class="sticker-grid">${ITEMS[l.stickers].map((it) => (got[it.id]
        ? `<button class="sticker" data-id="${it.id}" data-s="${l.stickers}">${pic(it.e)}<span>${cap(nameOf(it))}</span></button>`
        : '<div class="sticker unknown"><span class="emoji">❓</span></div>')).join('')}</div>`).join('');
  }
  $('album-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.sticker[data-id]');
    if (!b) return;
    const s = b.dataset.s;
    const it = ITEMS[s].find((x) => x.id === b.dataset.id);
    b.classList.remove('jump'); void b.offsetWidth; b.classList.add('jump');
    M.sounds.pop();
    say(explain(it, { sense: 'sense', part: 'part', food: 'food', habit: 'good' }[s]));
  });

  // ---------- Wiring ----------
  M.mountControls($('controls'));
  M.onLang(renderText);
  $('mascots').innerHTML = M.mascotsSVG('wave');
  show('unit');
  renderText();

  $('lessons').addEventListener('click', (e) => {
    const b = e.target.closest('.lesson');
    if (!b) return;
    M.sounds.pop();
    startLesson(LESSONS.find((l) => l.id === +b.dataset.id));
  });
  const toUnit = () => { M.sounds.pop(); lesson = null; show('unit'); renderUnit(); };
  $('album-btn').addEventListener('click', () => { M.sounds.pop(); show('album'); renderAlbum(); });
  $('album-back').addEventListener('click', toUnit);
  $('to-album').addEventListener('click', () => { M.sounds.pop(); lesson = null; show('album'); renderAlbum(); });
  $('again').addEventListener('click', () => { M.sounds.pop(); startActs(); });
  $('to-unit').addEventListener('click', toUnit);
  $('say-explore').addEventListener('click', () => { M.sounds.pop(); say(M.t(lesson.intro)); });
  $('say-choose').addEventListener('click', () => { M.sounds.pop(); sayItem(); });
  $('say-tap').addEventListener('click', () => { M.sounds.pop(); say($('tap-ask').textContent); });
  $('say-order').addEventListener('click', () => { M.sounds.pop(); say($('order-ask').textContent); });
  $('say-check').addEventListener('click', () => { M.sounds.pop(); say($('check-ask').textContent); });

  window.__lesson = () => ({ screen, lesson: lesson && lesson.id, actIdx, act, list, idx, placed, checks, checkIdx }); // for automated testing
})();
