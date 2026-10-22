(function () {
  const M = window.Mellis;
  const L = (ca, es, en) => ({ ca, es, en });
  const { PLACES, KINDS, LESSONS } = window.TOWN;
  const LEARNED_KEY = 'mellis.town.learned'; // { places: {id: 1}, jobs: {id: 1} }
  const LESSONS_KEY = 'mellis.town.lessons'; // { lessonId: best stars }

  const TEXT = {
    title: L('Aprenem: el meu poble', 'Aprendemos: mi pueblo', "Let's learn: my town"),
    unit: L('El meu poble', 'Mi pueblo', 'My town'),
    map: L('El Poble Mellis', 'El Pueblo Mellis', 'Mellis Town'),
    whereGo: L('On has d\'anar? Toca el lloc!', '¿Adónde tienes que ir? ¡Toca el sitio!', 'Where do you go? Tap the place!'),
    whereWork: { ca: (j) => `On treballa ${j}?`, es: (j) => `¿Dónde trabaja ${j}?`, en: (j) => `Where does ${j} work?` },
    worksAt: { ca: (j, p) => `${cap(j)} treballa ${p}.`, es: (j, p) => `${cap(j)} trabaja ${p}.`, en: (j, p) => `${cap(j)} works ${p}.` },
    withWhat: { ca: (j) => `Amb què treballa ${j}?`, es: (j) => `¿Con qué trabaja ${j}?`, en: (j) => `What does ${j} work with?` },
    worksWith: { ca: (j, t) => `${cap(j)} treballa amb ${t}.`, es: (j, t) => `${cap(j)} trabaja con ${t}.`, en: (j, t) => `${cap(j)} works with ${t}.` },
    who: { ca: (p) => `Qui treballa ${p}?`, es: (p) => `¿Quién trabaja ${p}?`, en: (p) => `Who works ${p}?` },
    does: { ca: (j, d) => `${cap(j)} ${d}.`, es: (j, d) => `${cap(j)} ${d}.`, en: (j, d) => `${cap(j)} ${d}.` },
    win: L('Lliçó acabada!', '¡Lección terminada!', 'Lesson done!'),
    newOnes: L('Nou al teu poble:', 'Nuevo en tu pueblo:', 'New in your town:'),
  };

  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const byId = (id) => PLACES.find((p) => p.id === id);
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch (e) { return def; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  const learnedState = () => { const s = load(LEARNED_KEY, {}); s.places = s.places || {}; s.jobs = s.jobs || {}; return s; };
  const say = (text, opts) => M.speak(text.replace(/[¡!¿]/g, '').replace(/\bNO\b/g, 'no'), M.lang, opts);
  const jobAt = (p) => TEXT.worksAt[M.lang](M.t(p.job.the), M.t(p.in));

  // ---------- The town map ----------
  // opts: { album: true } shows learned places in colour and the workers she knows
  function townHTML(opts) {
    const st = learnedState();
    return PLACES.map((p) => {
      const off = opts && opts.album && !st.places[p.id];
      const job = opts && opts.album && st.jobs[p.id] ? `<span class="b-job">${p.job.e}</span>` : '';
      return `<button class="bld${off ? ' off' : ''}" data-id="${p.id}"><span class="b-e">${p.e}</span><span class="b-name">${M.t(p.name)}</span>${job}</button>`;
    }).join('') + '<div class="walker" id="walker" hidden></div>';
  }
  // the walker strolls from the bottom of the map to a building, then `then()`
  function walkTo(mapEl, id, who, then) {
    const w = mapEl.querySelector('.walker');
    const b = mapEl.querySelector(`.bld[data-id="${id}"]`);
    w.textContent = who;
    w.hidden = false;
    w.style.transition = 'none';
    w.style.left = (mapEl.clientWidth / 2 - 18) + 'px';
    w.style.top = (mapEl.clientHeight - 20) + 'px';
    void w.offsetWidth;
    w.style.transition = '';
    w.style.left = (b.offsetLeft + b.offsetWidth / 2 - 18) + 'px';
    w.style.top = (b.offsetTop + b.offsetHeight - 30) + 'px';
    setTimeout(() => { b.classList.add('visit'); then(); }, 950);
  }

  // ---------- Screens ----------
  const SCREENS = ['unit', 'explore', 'walk', 'tool', 'check', 'album'];
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
    const best = load(LESSONS_KEY, {});
    $('unit-title').textContent = M.t(TEXT.unit);
    $('lessons').innerHTML = LESSONS.map((l) => `
      <button class="lesson" data-id="${l.id}">
        <span class="l-num">${l.id}</span><span class="l-icon">${l.icon}</span>
        <span class="l-name">${M.t(l.name)}</span>
        <span class="l-stars">${best[l.id] ? (best[l.id] === 3 ? '🥇' : '⭐'.repeat(best[l.id])) : ''}</span>
      </button>`).join('');
    const st = learnedState();
    $('album-count').textContent = `${Object.keys(st.places).length + Object.keys(st.jobs).length}/${PLACES.length * 2}`;
  }
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    $('album-label').textContent = M.t(TEXT.map);
    $('album-title').textContent = M.t(TEXT.map);
    renderUnit();
    if (screen === 'explore') renderExplore();
    if (screen === 'walk') renderWalk(false);
    if (screen === 'tool') renderTool();
    if (screen === 'check') renderCheck();
    if (screen === 'album') renderAlbum();
  }

  // ---------- Lesson ----------
  // The Mellis rule: 3 hearts from the first activity to the check; 0 hearts = new questions
  const round = M.round({ heartsEl: $('hearts'), onOut: () => startActs() });
  let heard = new Set(), actIdx = 0, act = null, busy = false, list = [], idx = 0, opts = [], checks = [], checkIdx = 0;
  let gotPlaces = [], gotJobs = [];

  function startLesson(l) {
    lesson = l;
    heard = new Set();
    show('explore');
    renderSteps(0);
    renderExplore();
    say(M.t(l.intro));
  }

  // explore: lesson 1 = tap the buildings on the map, lesson 2 = tap the workers
  function renderExplore() {
    $('explore-intro').textContent = M.t(lesson.intro);
    const jobs = lesson.id === 2;
    $('explore-map').hidden = jobs;
    $('groups').hidden = !jobs;
    if (jobs) {
      $('groups').innerHTML = PLACES.map((p) =>
        `<button class="group${heard.has(p.id) ? ' heard' : ''}" data-id="${p.id}" style="--c:#ff9f1c"><span class="g-ex">${p.job.e}</span><span class="g-name">${cap(M.t(p.job.the))}</span></button>`).join('');
    } else {
      $('explore-map').innerHTML = townHTML();
      heard.forEach((id) => $('explore-map').querySelector(`.bld[data-id="${id}"]`).classList.add('heard'));
    }
    $('explore-next').hidden = heard.size < PLACES.length;
  }
  function exploreTap(id) {
    const p = byId(id);
    heard.add(id);
    M.sounds.pop();
    const text = lesson.id === 2 ? TEXT.does[M.lang](M.t(p.job.the), M.t(p.job.does)) + ' ' + jobAt(p) : M.t(p.fact);
    $('explore-fact').textContent = text;
    $('explore-fact').hidden = false;
    say(text);
    renderExplore();
  }
  $('explore-map').addEventListener('click', (e) => { const b = e.target.closest('.bld'); if (b) exploreTap(b.dataset.id); });
  $('groups').addEventListener('click', (e) => { const b = e.target.closest('.group'); if (b) exploreTap(b.dataset.id); });
  $('explore-next').addEventListener('click', () => { M.sounds.pop(); startActs(); });

  function startActs() {
    round.start();
    gotPlaces = [];
    gotJobs = [];
    actIdx = 0;
    runAct();
  }
  function runAct() {
    busy = false;
    renderSteps(actIdx + 1);
    if (actIdx >= lesson.acts.length) { startCheck(); return; }
    act = lesson.acts[actIdx];
    list = shuffle(PLACES.slice()).slice(0, act.n);
    idx = 0;
    if (act.type === 'walk') { show('walk'); $('walk-map').innerHTML = townHTML(); renderWalk(true); } else { show('tool'); renderTool(); }
    sayAsk();
  }
  function nextAct() { actIdx++; runAct(); }
  function wrongThen(el, key, onReveal) {
    el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong');
    busy = true;
    round.wrong(key).then(({ reveal }) => { busy = false; if (reveal) onReveal(); });
  }
  function explainThen(msgEl, text, next) {
    msgEl.textContent = text;
    msgEl.hidden = false;
    say(text, { onend: () => setTimeout(() => { busy = false; next(); }, 700) });
  }
  function progress(el) { el.innerHTML = list.map((x, i) => `<span class="${i < idx ? 'done' : i === idx ? 'now' : ''}">●</span>`).join(''); }

  // ---------- Walk: tap the right building, someone walks there ----------
  function walkAsk() {
    const p = list[idx];
    return act.mode === 'sit' ? `${M.t(p.sit)} ${M.t(TEXT.whereGo)}` : TEXT.whereWork[M.lang](M.t(p.job.the));
  }
  function renderWalk() {
    const p = list[idx];
    $('walk-ask').innerHTML = `${act.mode === 'job' ? `<span class="ask-e">${p.job.e}</span>` : ''}${walkAsk()}`;
    progress($('walk-progress'));
    $('walk-msg').hidden = true;
    $('walk-map').querySelectorAll('.bld').forEach((b) => b.classList.remove('right', 'reveal', 'wrong', 'visit'));
    const w = $('walk-map').querySelector('.walker');
    if (w) w.hidden = true;
  }
  function sayAsk() {
    if (screen === 'walk') say(walkAsk());
    if (screen === 'tool') say(toolAsk());
  }
  $('walk-map').addEventListener('click', (e) => {
    const b = e.target.closest('.bld');
    if (!b || busy) return;
    const p = list[idx];
    if (b.dataset.id !== p.id) { wrongThen(b, 'walk' + actIdx + '-' + idx, () => walked(p, true)); return; }
    walked(p, false);
  });
  function walked(p, revealed) {
    busy = true;
    $('walk-map').querySelector(`.bld[data-id="${p.id}"]`).classList.add(revealed ? 'reveal' : 'right');
    if (!revealed) M.sounds.match();
    walkTo($('walk-map'), p.id, act.mode === 'job' ? p.job.e : '🧒', () => {
      if (act.mode === 'sit') gotPlaces.push(p.id); else gotJobs.push(p.id);
      explainThen($('walk-msg'), act.mode === 'sit' ? M.t(p.fact) : jobAt(p), () => {
        idx++;
        if (idx < list.length) { renderWalk(); sayAsk(); } else nextAct();
      });
    });
  }

  // ---------- Tool: what does each worker use? ----------
  const toolAsk = () => TEXT.withWhat[M.lang](M.t(list[idx].job.the));
  function renderTool() {
    const p = list[idx];
    if (!opts.length || opts.correct !== p.id) {
      opts = shuffle([p].concat(shuffle(PLACES.filter((x) => x !== p)).slice(0, 2)));
      opts.correct = p.id;
    }
    $('tool-ask').textContent = toolAsk();
    progress($('tool-progress'));
    $('tool-who').innerHTML = `<div class="big-face"><span class="emoji">${p.job.e}</span></div><p class="a-name">${cap(M.t(p.job.the))}</p>`;
    $('tool-msg').hidden = true;
    $('tool-opts').innerHTML = opts.map((o) =>
      `<button class="odd" data-id="${o.id}"><span class="emoji">${o.job.tool.e}</span><span>${cap(M.t(o.job.tool.the))}</span></button>`).join('');
  }
  $('tool-opts').addEventListener('click', (e) => {
    const b = e.target.closest('.odd');
    if (!b || busy) return;
    const p = list[idx];
    if (b.dataset.id !== p.id) { wrongThen(b, 'tool' + idx, () => tooled(p, true)); return; }
    tooled(p, false);
  });
  function tooled(p, revealed) {
    busy = true;
    document.querySelector(`#tool-opts .odd[data-id="${p.id}"]`).classList.add(revealed ? 'reveal' : 'right');
    if (!revealed) M.sounds.match();
    gotJobs.push(p.id);
    explainThen($('tool-msg'), TEXT.worksWith[M.lang](M.t(p.job.the), M.t(p.job.tool.the)), () => {
      idx++;
      if (idx < list.length) { renderTool(); sayAsk(); } else nextAct();
    });
  }

  // ---------- Check ----------
  function makeCheck(used) {
    if (lesson.check.mode === 'kind') {
      const kind = pick(Object.keys(KINDS).filter((k) => !used.includes(k)));
      const same = shuffle(PLACES.filter((p) => p.kind === kind)).slice(0, 3);
      const odd = pick(PLACES.filter((p) => p.kind !== kind));
      return { key: kind, odd, opts: shuffle(same.concat(odd)) };
    }
    const p = pick(PLACES.filter((x) => !used.includes(x.id)));
    return { key: p.id, odd: p, opts: shuffle([p].concat(shuffle(PLACES.filter((x) => x !== p)).slice(0, 3))) };
  }
  const checkAsk = (c) => (lesson.check.mode === 'kind' ? M.t(KINDS[c.key]) : TEXT.who[M.lang](M.t(c.odd.in)));
  function startCheck() {
    checks = [];
    while (checks.length < lesson.check.n) checks.push(makeCheck(checks.map((c) => c.key)));
    checkIdx = 0;
    show('check');
    renderSteps(lesson.acts.length + 1);
    renderCheck();
    say(checkAsk(checks[0]));
  }
  function renderCheck() {
    const c = checks[checkIdx];
    const jobs = lesson.check.mode === 'who';
    $('check-ask').textContent = checkAsk(c);
    $('check-msg').hidden = true;
    $('check-opts').innerHTML = c.opts.map((p) =>
      `<button class="odd" data-id="${p.id}"><span class="emoji">${jobs ? p.job.e : p.e}</span><span>${cap(M.t(jobs ? p.job.the : p.name))}</span></button>`).join('');
  }
  $('check-opts').addEventListener('click', (e) => {
    const b = e.target.closest('.odd');
    if (!b || busy) return;
    const c = checks[checkIdx];
    if (b.dataset.id !== c.odd.id) { wrongThen(b, 'check' + checkIdx, () => checked(c, true)); return; }
    checked(c, false);
  });
  function checked(c, revealed) {
    busy = true;
    document.querySelector(`#check-opts .odd[data-id="${c.odd.id}"]`).classList.add(revealed ? 'reveal' : 'right');
    if (!revealed) M.sounds.match();
    const p = c.odd;
    if (lesson.check.mode === 'kind') gotPlaces.push(p.id); else gotJobs.push(p.id);
    const text = lesson.check.mode === 'kind' ? M.t(p.fact) : TEXT.does[M.lang](M.t(p.job.the), M.t(p.job.does)) + ' ' + jobAt(p);
    explainThen($('check-msg'), text, () => {
      checkIdx++;
      if (checkIdx < checks.length) { renderCheck(); say(checkAsk(checks[checkIdx])); } else finish();
    });
  }

  function finish() {
    const stars = round.stars();
    const best = load(LESSONS_KEY, {});
    best[lesson.id] = Math.max(best[lesson.id] || 0, stars);
    save(LESSONS_KEY, best);
    const st = learnedState();
    const fresh = [];
    gotPlaces.forEach((id) => { if (!st.places[id]) { st.places[id] = 1; fresh.push(byId(id).e); } });
    gotJobs.forEach((id) => { if (!st.jobs[id]) { st.jobs[id] = 1; fresh.push(byId(id).job.e); } });
    save(LEARNED_KEY, st);
    renderSteps(lesson.acts.length + 2);
    $('win-text').textContent = M.t(TEXT.win);
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('win-new').textContent = fresh.length ? M.t(TEXT.newOnes) : '';
    $('win-cards').innerHTML = fresh.map((e) => `<div class="mini-card${stars === 3 ? ' gold' : ''}">${e}</div>`).join('');
    $('win-twins').innerHTML = M.mascotsSVG('cheer');
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    say(M.t(TEXT.win));
  }

  // ---------- Album: the town colours in ----------
  function renderAlbum() { $('album-map').innerHTML = townHTML({ album: true }); }
  $('album-map').addEventListener('click', (e) => {
    const b = e.target.closest('.bld');
    if (!b || b.classList.contains('off')) return;
    const p = byId(b.dataset.id);
    const st = learnedState();
    b.classList.remove('visit'); void b.offsetWidth; b.classList.add('visit');
    M.sounds.pop();
    say(M.t(p.fact) + (st.jobs[p.id] ? ' ' + jobAt(p) : ''));
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
  $('say-walk').addEventListener('click', () => { M.sounds.pop(); sayAsk(); });
  $('say-tool').addEventListener('click', () => { M.sounds.pop(); sayAsk(); });
  $('say-check').addEventListener('click', () => { M.sounds.pop(); say($('check-ask').textContent); });

  window.__lesson = () => ({ screen, lesson: lesson && lesson.id, act, list, idx, checks, checkIdx }); // for automated testing
})();
