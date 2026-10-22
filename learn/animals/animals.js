(function () {
  const M = window.Mellis;
  const L = (ca, es, en) => ({ ca, es, en });
  const ANIMALS = window.ANIMALS;
  const GROUPS = window.ANIMAL_GROUPS;
  const FIELDS = Object.assign({ group: GROUPS }, window.ANIMAL_FIELDS);
  const CARDS_KEY = 'mellis.animals.cards';     // { animalId: { group: 1, diet: 1, … } } — what she has learned per animal
  const LESSONS_KEY = 'mellis.animals.lessons'; // { lessonId: best stars }

  // Each lesson: explore some tiles → one or two activities → odd-one-out check (Mellis rule from the 1st activity on)
  const LESSONS = [
    { id: 1, icon: '🦴', name: L('Vertebrats i invertebrats', 'Vertebrados e invertebrados', 'Vertebrates & invertebrates'),
      explore: ['group'],
      intro: L('Els animals vertebrats tenen ossos i columna vertebral 🦴. Els invertebrats, no! Toca cada grup per descobrir-lo.',
        'Los animales vertebrados tienen huesos y columna vertebral 🦴. ¡Los invertebrados, no! Toca cada grupo para descubrirlo.',
        "Vertebrates have bones and a backbone 🦴. Invertebrates don't! Tap each group to find out more."),
      acts: [{ type: 'choose', field: 'group', n: 8, icon: '🏠' }], check: { field: 'group', n: 3 } },
    { id: 2, icon: '🥕', name: L('Què mengen?', '¿Qué comen?', 'What do they eat?'),
      explore: ['diet'],
      intro: L('Cada animal menja coses diferents. Toca cada grup per descobrir-ho!', 'Cada animal come cosas diferentes. ¡Toca cada grupo para descubrirlo!', 'Each animal eats different things. Tap each group to find out!'),
      acts: [{ type: 'choose', field: 'diet', n: 7, icon: '🍽️' }, { type: 'order', set: 'chains', n: 2, icon: '🔗' }], check: { field: 'diet', n: 2 } },
    { id: 3, icon: '🥚', name: L('Com neixen?', '¿Cómo nacen?', 'How are they born?'),
      explore: ['birth'],
      intro: L('Tots els animals neixen... però no tots igual! Toca cada grup.', 'Todos los animales nacen... ¡pero no todos igual! Toca cada grupo.', 'All animals are born... but not all the same way! Tap each group.'),
      acts: [{ type: 'choose', field: 'birth', n: 7, icon: '🍼' }, { type: 'order', set: 'cycles', n: 2, icon: '🔄' }], check: { field: 'birth', n: 2 } },
    { id: 4, icon: '🌍', name: L('On viuen i com es mouen?', '¿Dónde viven y cómo se mueven?', 'Where do they live and move?'),
      explore: ['habitat', 'move'],
      intro: L('Els animals viuen a llocs diferents i es mouen de maneres diferents. Toca-ho tot!', 'Los animales viven en sitios diferentes y se mueven de formas diferentes. ¡Tócalo todo!', 'Animals live in different places and move in different ways. Tap them all!'),
      acts: [{ type: 'choose', field: 'habitat', n: 7, icon: '🏞️' }, { type: 'choose', field: 'move', n: 5, icon: '🏃' }], check: { field: 'habitat', n: 2 } },
  ];
  const ORDER_SETS = { chains: window.ANIMAL_CHAINS, cycles: window.ANIMAL_CYCLES };
  // singular, for "is a mammal" / "is NOT a mammal"
  const ONE = {
    mammal: L('un mamífer', 'un mamífero', 'a mammal'), bird: L('un ocell', 'un ave', 'a bird'),
    fish: L('un peix', 'un pez', 'a fish'), reptile: L('un rèptil', 'un reptil', 'a reptile'),
    amphibian: L('un amfibi', 'un anfibio', 'an amphibian'), invertebrate: L('un invertebrat', 'un invertebrado', 'an invertebrate'),
  };
  // button labels in the "choose" activities
  const LABEL = {
    diet: { herb: L('Plantes', 'Plantas', 'Plants'), carn: L('Animals', 'Animales', 'Animals'), omni: L('De tot', 'De todo', 'Everything') },
    birth: { ovi: L("D'un ou", 'De un huevo', 'From an egg'), vivi: L('De la panxa', 'De la barriga', 'From the tummy') },
  };
  const TEXT = {
    title: L('Aprenem: els animals', 'Aprendemos: los animales', "Let's learn: animals"),
    unit: L('Els animals', 'Los animales', 'Animals'),
    album: L('Àlbum dels animals', 'Álbum de los animales', 'Animal album'),
    ask: {
      group: L('De quin grup és?', '¿De qué grupo es?', 'Which group is it?'),
      diet: L('Què menja? Dona-li el plat bo!', '¿Qué come? ¡Dale el plato bueno!', 'What does it eat? Give it the right plate!'),
      birth: L('Com neix?', '¿Cómo nace?', 'How is it born?'),
      habitat: L("On viu? Porta'l a casa seva!", '¿Dónde vive? ¡Llévalo a su casa!', 'Where does it live? Take it home!'),
      move: L('Com es mou?', '¿Cómo se mueve?', 'How does it move?'),
    },
    order: {
      chains: L('Fes la cadena: qui menja qui? Comença per la planta!', 'Haz la cadena: ¿quién come a quién? ¡Empieza por la planta!', 'Build the chain: who eats whom? Start with the plant!'),
      cycles: L('Ordena el cicle de vida: què ve primer?', 'Ordena el ciclo de vida: ¿qué va primero?', 'Put the life cycle in order: what comes first?'),
    },
    isA: { ca: (n, g) => `${cap(n)} és ${g}!`, es: (n, g) => `¡${cap(n)} es ${g}!`, en: (n, g) => `${cap(n)} is ${g}!` },
    notA: { ca: (g) => `Quin d'aquests NO és ${g}?`, es: (g) => `¿Cuál de estos NO es ${g}?`, en: (g) => `Which one is NOT ${g}?` },
    win: L('Lliçó acabada!', '¡Lección terminada!', 'Lesson done!'),
    newCards: L("Cromos nous a l'àlbum:", 'Cromos nuevos en el álbum:', 'New in your album:'),
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
  const face = (a) => a.svg || `<span class="emoji">${a.e}</span>`;
  const pic = (p) => (p.startsWith('<svg') ? p : `<span class="emoji">${p}</span>`);
  const say = (text, opts) => M.speak(text.replace(/[🦴¡!¿]/gu, '').replace(/\bNO\b/g, 'no'), M.lang, opts);
  function loadCards() {
    const cards = load(CARDS_KEY);
    Object.values(cards).forEach((c) => { if (c.g) { c.group = 1; delete c.g; } }); // v1.13 stored the group as "g"
    return cards;
  }

  // "La vaca és herbívora: menja plantes." / "El gos camina!"
  function explain(a, field) {
    const name = M.t(a.name);
    if (field === 'group') return a.why ? M.t(a.why) : TEXT.isA[M.lang](name, M.t(ONE[a.group]));
    const v = FIELDS[field][a[field]];
    if (field === 'move') return `${cap(name)} ${M.t(v.verb)}!`;
    const adj = M.lang === 'en' ? v.adj.en : v.adj[M.lang][a.f ? 1 : 0];
    const is = { ca: 'és', es: 'es', en: 'is' }[M.lang];
    return `${cap(name)} ${is} ${adj}: ${M.t(v.why)}.`;
  }

  // ---------- Screens ----------
  const SCREENS = ['unit', 'explore', 'choose', 'order', 'check', 'album'];
  let screen = 'unit', lesson = null;
  function show(name) {
    SCREENS.forEach((s) => { $(s).hidden = s !== name; });
    $('win').hidden = true;
    $('lesson-bar').hidden = !lesson || ['unit', 'album'].includes(name);
    screen = name;
    window.scrollTo(0, 0);
  }
  // 🔍 explore · activity icons · 🤔 check
  function renderSteps(now) {
    if (!lesson) return;
    const icons = ['🔍'].concat(lesson.acts.map((a) => a.icon), '🤔');
    $('lesson-steps').innerHTML = icons.map((ic, i) =>
      `<span class="${i < now ? 'done' : i === now ? 'now' : ''}">${ic}</span>`).join('');
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
    $('album-count').textContent = `${Object.keys(loadCards()).length}/${ANIMALS.length}`;
  }

  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    $('album-label').textContent = M.t(TEXT.album);
    $('album-title').textContent = M.t(TEXT.album);
    renderUnit();
    if (screen === 'explore') renderExplore();
    if (screen === 'choose') renderChoose();
    if (screen === 'order') renderOrder();
    if (screen === 'check') renderCheck();
    if (screen === 'album') renderAlbum();
  }

  // ---------- Lesson state ----------
  // The Mellis rule: 3 hearts from the first activity to the check; 0 hearts = new animals (no need to explore again)
  const round = M.round({ heartsEl: $('hearts'), onOut: () => startActs() });
  let heard = new Set(), actIdx = 0, learned = [], busy = false;
  let list = [], idx = 0;              // choose: animals; order: puzzles
  let placed = 0, pool = [];           // order: next slot, shuffled pieces
  let checks = [], checkIdx = 0;

  function startLesson(l) {
    lesson = l;
    heard = new Set();
    show('explore');
    renderSteps(0);
    renderExplore();
    say(M.t(l.intro));
  }

  // ---------- Explore ----------
  const tiles = () => lesson.explore.flatMap((f) => Object.keys(FIELDS[f]).map((v) => ({ key: f + ':' + v, t: FIELDS[f][v] })));
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
    const [f, v] = b.dataset.k.split(':');
    const t = FIELDS[f][v];
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
    const act = lesson.acts[actIdx];
    if (act.type === 'choose') startChoose(act); else startOrder(act);
  }
  function nextAct() { actIdx++; runAct(); }

  // ---------- Choose: one animal at a time, tap the right group / plate / place / move ----------
  function pickAnimals(field, n) {
    const have = ANIMALS.filter((a) => a[field] !== undefined);
    let chosen;
    if (field === 'group') {
      // 2 trick animals + at least one invertebrate
      const tricks = shuffle(have.filter((a) => a.why)).slice(0, 2);
      const inv = pick(have.filter((a) => a.group === 'invertebrate' && !tricks.includes(a)));
      chosen = tricks.concat(inv);
    } else {
      // every answer shows up at least once
      chosen = Object.keys(FIELDS[field]).map((v) => pick(have.filter((a) => a[field] === v)));
    }
    const rest = shuffle(have.filter((a) => !chosen.includes(a))).slice(0, n - chosen.length);
    return shuffle(chosen.concat(rest));
  }
  let actField = 'group';
  function startChoose(act) {
    actField = act.field;
    list = pickAnimals(act.field, act.n);
    idx = 0;
    show('choose');
    renderChoose(true);
    sayAnimal();
  }
  function renderChoose(fresh) {
    const a = list[idx];
    const f = actField;
    $('choose-ask').textContent = M.t(TEXT.ask[f]);
    $('choose-progress').innerHTML = list.map((x, i) => `<span class="${i < idx ? 'done' : i === idx ? 'now' : ''}">●</span>`).join('');
    $('choose-animal').innerHTML = `<div class="big-face">${face(a)}</div><p class="a-name">${cap(M.t(a.name))}</p>`;
    $('choose-animal').className = 'choose-animal';
    $('choose-msg').hidden = true;
    const opts = $('options');
    if (fresh || opts.dataset.f !== f) {
      opts.dataset.f = f;
      opts.className = 'options opts-' + f;
      const order = f === 'habitat' ? ['air', 'land', 'water'] : Object.keys(FIELDS[f]);
      opts.innerHTML = order.map((v) => {
        const t = FIELDS[f][v];
        const label = LABEL[f] ? M.t(LABEL[f][v]) : f === 'move' ? cap(M.t(t.verb)) : M.t(t.name);
        return `<button class="option" data-v="${v}" style="--c:${t.color}"><span class="o-icon">${t.icon}</span><span class="o-name">${label}</span>${f === 'habitat' ? '<span class="placed"></span>' : ''}</button>`;
      }).join('');
    } else {
      opts.querySelectorAll('.option').forEach((b) => {
        b.classList.remove('right', 'reveal', 'wrong');
        const t = FIELDS[f][b.dataset.v];
        b.querySelector('.o-name').textContent = LABEL[f] ? M.t(LABEL[f][b.dataset.v]) : f === 'move' ? cap(M.t(t.verb)) : M.t(t.name);
      });
    }
  }
  function sayAnimal() { say(cap(M.t(list[idx].name)) + '. ' + M.t(TEXT.ask[actField])); }

  $('options').addEventListener('click', (e) => {
    const b = e.target.closest('.option');
    if (!b || busy) return;
    const a = list[idx];
    if (b.dataset.v !== a[actField]) {
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      busy = true;
      round.wrong(actField + idx).then(({ reveal }) => {
        busy = false;
        if (reveal) chosen(a, true);
      });
      return;
    }
    chosen(a, false);
  });

  function chosen(a, revealed) {
    busy = true;
    const f = actField;
    const b = document.querySelector(`.option[data-v="${a[f]}"]`);
    b.classList.add(revealed ? 'reveal' : 'right');
    const anim = f === 'move' ? 'mv-' + a.move : f === 'diet' ? 'munch' : 'jump';
    const el = $('choose-animal');
    el.classList.remove(anim); void el.offsetWidth; el.classList.add(anim);
    if (f === 'habitat') b.querySelector('.placed').insertAdjacentHTML('beforeend', `<i>${a.svg ? '🦎' : a.e}</i>`);
    if (!revealed) M.sounds.match();
    learned.push([a, f]);
    const msg = explain(a, f);
    $('choose-msg').textContent = msg;
    $('choose-msg').hidden = false;
    say(msg, {
      onend: () => setTimeout(() => {
        busy = false;
        idx++;
        if (idx < list.length) { renderChoose(false); sayAnimal(); } else nextAct();
      }, 600),
    });
  }

  // ---------- Order: food chains / life cycles, tap the pieces in order ----------
  let orderSet = 'chains';
  function startOrder(act) {
    orderSet = act.set;
    list = shuffle(ORDER_SETS[act.set].slice()).slice(0, act.n);
    idx = 0;
    show('order');
    startPuzzle();
  }
  function startPuzzle() {
    placed = 0;
    pool = shuffle(list[idx].steps.map((s, i) => i));
    renderOrder();
    say(M.t(TEXT.order[orderSet]));
  }
  function renderOrder() {
    const p = list[idx];
    $('order-ask').textContent = M.t(TEXT.order[orderSet]);
    $('order-msg').hidden = placed < p.steps.length;
    $('slots').className = 'slots' + (orderSet === 'chains' ? ' chain' : ' cycle');
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
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      busy = true;
      round.wrong(`order${idx}-${placed}`).then(({ reveal }) => {
        busy = false;
        if (!reveal) return;
        const right = document.querySelector(`.piece[data-i="${placed}"]`);
        right.classList.add('reveal');
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
    $('order-msg').textContent = M.t(p.say);
    $('order-msg').hidden = false;
    say(M.t(p.say), {
      onend: () => setTimeout(() => {
        busy = false;
        idx++;
        if (idx < list.length) startPuzzle(); else nextAct();
      }, 800),
    });
  }

  // ---------- Check: odd one out ----------
  function makeCheck(field) {
    if (field === 'group') {
      const g = pick(['mammal', 'bird', 'fish', 'reptile', 'amphibian']);
      const same = shuffle(ANIMALS.filter((a) => a.group === g)).slice(0, 3);
      const lookAlikes = ANIMALS.filter((a) => a.look === g && a.group !== g);
      const odd = lookAlikes.length ? pick(lookAlikes) : pick(ANIMALS.filter((a) => a.group !== g));
      return { field, v: g, odd, opts: shuffle(same.concat(odd)) };
    }
    const values = Object.keys(FIELDS[field]).filter((v) => ANIMALS.filter((a) => a[field] === v).length >= 3);
    const v = pick(values);
    const same = shuffle(ANIMALS.filter((a) => a[field] === v)).slice(0, 3);
    const odd = pick(ANIMALS.filter((a) => a[field] !== undefined && a[field] !== v));
    return { field, v, odd, opts: shuffle(same.concat(odd)) };
  }
  const checkAsk = (c) => (c.field === 'group' ? TEXT.notA[M.lang](M.t(ONE[c.v])) : M.t(FIELDS[c.field][c.v].q));
  function startCheck() {
    checks = [];
    while (checks.length < lesson.check.n) {
      const c = makeCheck(lesson.check.field);
      if (!checks.some((x) => x.v === c.v)) checks.push(c);
    }
    checkIdx = 0;
    show('check');
    renderSteps(lesson.acts.length + 1);
    renderCheck();
    say(checkAsk(checks[0]));
  }
  function renderCheck() {
    const c = checks[checkIdx];
    $('check-ask').textContent = checkAsk(c);
    $('check-msg').hidden = true;
    $('check-opts').innerHTML = c.opts.map((a) =>
      `<button class="odd" data-id="${a.id}">${face(a)}<span>${cap(M.t(a.name))}</span></button>`).join('');
  }
  $('check-opts').addEventListener('click', (e) => {
    const b = e.target.closest('.odd');
    if (!b || busy) return;
    const c = checks[checkIdx];
    if (b.dataset.id !== c.odd.id) {
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      busy = true;
      round.wrong('check' + checkIdx).then(({ reveal }) => {
        busy = false;
        if (reveal) checked(c, true);
      });
      return;
    }
    checked(c, false);
  });
  function checked(c, revealed) {
    busy = true;
    document.querySelector(`.odd[data-id="${c.odd.id}"]`).classList.add(revealed ? 'reveal' : 'right');
    if (!revealed) M.sounds.match();
    learned.push([c.odd, c.field]);
    const msg = explain(c.odd, c.field);
    $('check-msg').textContent = msg;
    $('check-msg').hidden = false;
    say(msg, {
      onend: () => setTimeout(() => {
        busy = false;
        checkIdx++;
        if (checkIdx < checks.length) { renderCheck(); say(checkAsk(checks[checkIdx])); } else finish();
      }, 600),
    });
  }

  function finish() {
    const stars = round.stars();
    const best = load(LESSONS_KEY);
    best[lesson.id] = Math.max(best[lesson.id] || 0, stars);
    save(LESSONS_KEY, best);
    const cards = loadCards();
    const fresh = [];
    learned.forEach(([a, f]) => {
      const c = cards[a.id] || {};
      if (!c[f] && !fresh.includes(a)) fresh.push(a);
      c[f] = 1;
      cards[a.id] = c;
    });
    save(CARDS_KEY, cards);
    renderSteps(lesson.acts.length + 2);
    $('win-text').textContent = M.t(TEXT.win);
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('win-new').textContent = fresh.length ? M.t(TEXT.newCards) : '';
    $('win-cards').innerHTML = fresh.map((a) => `<div class="mini-card${stars === 3 ? ' gold' : ''}">${face(a)}</div>`).join('');
    $('win-twins').innerHTML = M.mascotsSVG('cheer');
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    say(M.t(TEXT.win));
  }

  // ---------- Album ----------
  const CARD_FIELDS = ['diet', 'birth', 'habitat', 'move'];
  function renderAlbum() {
    const cards = loadCards();
    $('album-grid').innerHTML = ANIMALS.map((a) => {
      const c = cards[a.id];
      if (!c) return `<div class="card unknown"><span class="emoji">❓</span></div>`;
      const G = GROUPS[a.group];
      const icons = CARD_FIELDS.filter((f) => c[f] && a[f]).map((f) => FIELDS[f][a[f]].icon).join('');
      return `<button class="card" data-id="${a.id}" style="--c:${c.group ? G.color : '#9aa5b1'}">${face(a)}
        <span class="c-name">${cap(M.t(a.name))}</span>
        ${c.group ? `<span class="c-chip">${G.icon} ${M.t(G.name)}</span>` : ''}
        ${icons ? `<span class="c-icons">${icons}</span>` : ''}</button>`;
    }).join('');
  }
  $('album-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.card[data-id]');
    if (!b) return;
    const a = ANIMALS.find((x) => x.id === b.dataset.id);
    const c = loadCards()[a.id] || {};
    b.classList.remove('jump'); void b.offsetWidth; b.classList.add('jump');
    M.sounds.pop();
    say(['group'].concat(CARD_FIELDS).filter((f) => c[f] && a[f]).map((f) => explain(a, f)).join(' '));
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
  $('again').addEventListener('click', () => { M.sounds.pop(); show('choose'); startActs(); });
  $('to-unit').addEventListener('click', toUnit);
  $('say-explore').addEventListener('click', () => { M.sounds.pop(); say(M.t(lesson.intro)); });
  $('say-choose').addEventListener('click', () => { M.sounds.pop(); sayAnimal(); });
  $('say-order').addEventListener('click', () => { M.sounds.pop(); say($('order-ask').textContent); });
  $('say-check').addEventListener('click', () => { M.sounds.pop(); say($('check-ask').textContent); });

  window.__lesson = () => ({ screen, lesson: lesson && lesson.id, actIdx, list, idx, placed, checks, checkIdx, field: actField }); // for automated testing
})();
