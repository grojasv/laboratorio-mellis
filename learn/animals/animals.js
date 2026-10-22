(function () {
  const M = window.Mellis;
  const L = (ca, es, en) => ({ ca, es, en });
  const ANIMALS = window.ANIMALS;
  const GROUPS = window.ANIMAL_GROUPS;
  const CARDS_KEY = 'mellis.animals.cards';     // { animalId: { g: 1 } } — what she has learned per animal
  const LESSONS_KEY = 'mellis.animals.lessons'; // { lessonId: best stars }
  const SORT_N = 8;     // animals to classify per lesson
  const CHECK_N = 3;    // odd-one-out questions

  const LESSONS = [
    { id: 1, icon: '🦴', name: L('Vertebrats i invertebrats', 'Vertebrados e invertebrados', 'Vertebrates & invertebrates') },
    { id: 2, icon: '🥕', name: L('Què mengen?', '¿Qué comen?', 'What do they eat?'), soon: true },
    { id: 3, icon: '🥚', name: L('Com neixen?', '¿Cómo nacen?', 'How are they born?'), soon: true },
    { id: 4, icon: '🌍', name: L('On viuen i com es mouen?', '¿Dónde viven y cómo se mueven?', 'Where do they live and move?'), soon: true },
  ];
  // singular, for "is a mammal" / "is NOT a mammal"
  const ONE = {
    mammal: L('un mamífer', 'un mamífero', 'a mammal'), bird: L('un ocell', 'un ave', 'a bird'),
    fish: L('un peix', 'un pez', 'a fish'), reptile: L('un rèptil', 'un reptil', 'a reptile'),
    amphibian: L('un amfibi', 'un anfibio', 'an amphibian'), invertebrate: L('un invertebrat', 'un invertebrado', 'an invertebrate'),
  };
  const TEXT = {
    title: L('Aprenem: els animals', 'Aprendemos: los animales', "Let's learn: animals"),
    unit: L('Els animals', 'Los animales', 'Animals'),
    soon: L('Aviat!', '¡Pronto!', 'Soon!'),
    album: L('Àlbum dels animals', 'Álbum de los animales', 'Animal album'),
    exploreIntro: L('Els animals vertebrats tenen ossos i columna vertebral 🦴. Els invertebrats, no! Toca cada grup per descobrir-lo.',
      'Los animales vertebrados tienen huesos y columna vertebral 🦴. ¡Los invertebrados, no! Toca cada grupo para descubrirlo.',
      'Vertebrates have bones and a backbone 🦴. Invertebrates don\'t! Tap each group to find out more.'),
    sortAsk: L('De quin grup és?', '¿De qué grupo es?', 'Which group is it?'),
    isA: { ca: (n, g) => `${cap(n)} és ${g}!`, es: (n, g) => `¡${cap(n)} es ${g}!`, en: (n, g) => `${cap(n)} is ${g}!` },
    notA: { ca: (g) => `Quin d'aquests NO és ${g}?`, es: (g) => `¿Cuál de estos NO es ${g}?`, en: (g) => `Which one is NOT ${g}?` },
    win: L('Lliçó acabada!', '¡Lección terminada!', 'Lesson done!'),
    newCards: L('Cromos nous per a l\'àlbum:', 'Cromos nuevos para el álbum:', 'New cards for your album:'),
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
  const say = (text, opts) => M.speak(text.replace(/[🦴¡!¿]/gu, '').replace(/\bNO\b/g, 'no'), M.lang, opts);

  // ---------- Screens ----------
  const SCREENS = ['unit', 'explore', 'sort', 'check', 'album'];
  let screen = 'unit';
  function show(name) {
    SCREENS.forEach((s) => { $(s).hidden = s !== name; });
    $('win').hidden = true;
    $('lesson-bar').hidden = !['explore', 'sort', 'check'].includes(name);
    document.querySelectorAll('#lesson-steps span').forEach((el) => {
      const i = ['explore', 'sort', 'check'].indexOf(name), me = +el.dataset.i;
      el.classList.toggle('now', me === i);
      el.classList.toggle('done', me < i);
    });
    screen = name;
    window.scrollTo(0, 0);
  }

  function renderUnit() {
    const best = load(LESSONS_KEY);
    $('unit-title').textContent = M.t(TEXT.unit);
    $('lessons').innerHTML = LESSONS.map((l) => `
      <button class="lesson${l.soon ? ' soon' : ''}" data-id="${l.id}">
        <span class="l-num">${l.id}</span><span class="l-icon">${l.icon}</span>
        <span class="l-name">${M.t(l.name)}</span>
        <span class="l-stars">${l.soon ? M.t(TEXT.soon) : best[l.id] ? (best[l.id] === 3 ? '🥇' : '⭐'.repeat(best[l.id])) : ''}</span>
      </button>`).join('');
    const cards = load(CARDS_KEY);
    $('album-count').textContent = `${Object.keys(cards).length}/${ANIMALS.length}`;
  }

  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    $('album-label').textContent = M.t(TEXT.album);
    $('album-title').textContent = M.t(TEXT.album);
    renderUnit();
    if (screen === 'explore') renderExplore();
    if (screen === 'sort') renderSort();
    if (screen === 'check') renderCheck();
    if (screen === 'album') renderAlbum();
  }

  // ---------- The lesson: explore → sort → check ----------
  // The Mellis rule: 3 hearts for sort + check; 0 hearts = new animals (no need to explore again)
  const round = M.round({ heartsEl: $('hearts'), onOut: () => startSort() });
  let heard = new Set(), sortList = [], sortIdx = 0, checks = [], checkIdx = 0, learned = [], busy = false;

  function startLesson() {
    heard = new Set();
    show('explore');
    renderExplore();
    say(M.t(TEXT.exploreIntro));
  }

  function renderExplore() {
    $('explore-intro').textContent = M.t(TEXT.exploreIntro);
    $('groups').innerHTML = Object.keys(GROUPS).map((g) => {
      const G = GROUPS[g];
      return `<button class="group${heard.has(g) ? ' heard' : ''}" data-g="${g}" style="--c:${G.color}">
        <span class="g-ex">${G.ex}</span><span class="g-name">${G.icon} ${M.t(G.name)}</span></button>`;
    }).join('');
    $('explore-next').hidden = heard.size < Object.keys(GROUPS).length;
  }
  $('groups').addEventListener('click', (e) => {
    const b = e.target.closest('.group');
    if (!b) return;
    const g = b.dataset.g;
    heard.add(g);
    M.sounds.pop();
    $('explore-fact').innerHTML = `<b style="color:${GROUPS[g].color}">${M.t(GROUPS[g].name)}</b> ${M.t(GROUPS[g].fact)}`;
    $('explore-fact').hidden = false;
    say(M.t(GROUPS[g].fact));
    renderExplore();
  });
  $('explore-next').addEventListener('click', () => { M.sounds.pop(); startSort(); });

  function startSort() {
    round.start();
    learned = [];
    // 2 trick animals + 6 others, at least one invertebrate
    const tricks = shuffle(ANIMALS.filter((a) => a.why)).slice(0, 2);
    const inv = pick(ANIMALS.filter((a) => a.group === 'invertebrate' && !tricks.includes(a)));
    const rest = shuffle(ANIMALS.filter((a) => !tricks.includes(a) && a !== inv)).slice(0, SORT_N - 3);
    sortList = shuffle(tricks.concat(inv, rest));
    sortIdx = 0;
    busy = false;
    show('sort');
    renderSort();
    sayAnimal();
  }

  function renderSort() {
    const a = sortList[sortIdx];
    $('sort-ask').textContent = M.t(TEXT.sortAsk);
    $('sort-progress').innerHTML = sortList.map((x, i) => `<span class="${i < sortIdx ? 'done' : i === sortIdx ? 'now' : ''}">●</span>`).join('');
    $('sort-animal').innerHTML = `<div class="big-face">${face(a)}</div><p class="a-name">${cap(M.t(a.name))}</p>`;
    $('sort-msg').hidden = true;
    $('houses').innerHTML = Object.keys(GROUPS).map((g) =>
      `<button class="house" data-g="${g}" style="--c:${GROUPS[g].color}"><span>${GROUPS[g].icon}</span>${M.t(GROUPS[g].name)}</button>`).join('');
  }
  function sayAnimal() { say(cap(M.t(sortList[sortIdx].name)) + '. ' + M.t(TEXT.sortAsk)); }

  function explain(a) {
    return a.why ? M.t(a.why) : TEXT.isA[M.lang](M.t(a.name), M.t(ONE[a.group]));
  }

  $('houses').addEventListener('click', (e) => {
    const b = e.target.closest('.house');
    if (!b || busy) return;
    const a = sortList[sortIdx];
    if (b.dataset.g !== a.group) {
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      busy = true;
      round.wrong('sort' + sortIdx).then(({ reveal }) => {
        busy = false;
        if (reveal) sorted(a, true);
      });
      return;
    }
    sorted(a, false);
  });

  function sorted(a, revealed) {
    busy = true;
    const house = document.querySelector(`.house[data-g="${a.group}"]`);
    house.classList.add(revealed ? 'reveal' : 'right');
    $('sort-animal').classList.remove('jump'); void $('sort-animal').offsetWidth; $('sort-animal').classList.add('jump');
    if (!revealed) M.sounds.match();
    learned.push(a);
    const msg = explain(a);
    $('sort-msg').textContent = msg;
    $('sort-msg').hidden = false;
    say(msg, {
      onend: () => setTimeout(() => {
        busy = false;
        sortIdx++;
        if (sortIdx < sortList.length) { renderSort(); sayAnimal(); } else startCheck();
      }, 600),
    });
  }

  // Odd one out: 3 animals of a group + 1 that only looks like it
  function makeCheck(g) {
    const same = shuffle(ANIMALS.filter((a) => a.group === g)).slice(0, 3);
    const lookAlikes = ANIMALS.filter((a) => a.look === g && a.group !== g);
    const odd = lookAlikes.length ? pick(lookAlikes) : pick(ANIMALS.filter((a) => a.group !== g));
    return { g, odd, opts: shuffle(same.concat(odd)) };
  }
  function startCheck() {
    const groups = shuffle(['mammal', 'bird', 'fish', 'reptile', 'amphibian']).slice(0, CHECK_N);
    checks = groups.map(makeCheck);
    checkIdx = 0;
    show('check');
    renderCheck();
    say(TEXT.notA[M.lang](M.t(ONE[checks[0].g])));
  }
  function renderCheck() {
    const c = checks[checkIdx];
    $('check-ask').textContent = TEXT.notA[M.lang](M.t(ONE[c.g]));
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
    learned.push(c.odd);
    const msg = explain(c.odd);
    $('check-msg').textContent = msg;
    $('check-msg').hidden = false;
    say(msg, {
      onend: () => setTimeout(() => {
        busy = false;
        checkIdx++;
        if (checkIdx < checks.length) {
          renderCheck();
          say(TEXT.notA[M.lang](M.t(ONE[checks[checkIdx].g])));
        } else finish();
      }, 600),
    });
  }

  function finish() {
    const stars = round.stars();
    const best = load(LESSONS_KEY);
    best[1] = Math.max(best[1] || 0, stars);
    save(LESSONS_KEY, best);
    const cards = load(CARDS_KEY);
    const fresh = [];
    learned.forEach((a) => {
      if (!cards[a.id]) fresh.push(a);
      cards[a.id] = { ...(cards[a.id] || {}), g: 1 };
    });
    save(CARDS_KEY, cards);
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
  function renderAlbum() {
    const cards = load(CARDS_KEY);
    $('album-grid').innerHTML = ANIMALS.map((a) => {
      const c = cards[a.id];
      if (!c) return `<div class="card unknown"><span class="emoji">❓</span></div>`;
      const G = GROUPS[a.group];
      return `<button class="card" data-id="${a.id}" style="--c:${G.color}">${face(a)}
        <span class="c-name">${cap(M.t(a.name))}</span><span class="c-chip">${G.icon} ${M.t(G.name)}</span></button>`;
    }).join('');
  }
  $('album-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.card[data-id]');
    if (!b) return;
    const a = ANIMALS.find((x) => x.id === b.dataset.id);
    b.classList.remove('jump'); void b.offsetWidth; b.classList.add('jump');
    M.sounds.pop();
    say(explain(a));
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
    if (b.classList.contains('soon')) { M.sounds.boing(); return; }
    M.sounds.pop();
    startLesson();
  });
  $('album-btn').addEventListener('click', () => { M.sounds.pop(); show('album'); renderAlbum(); });
  $('album-back').addEventListener('click', () => { M.sounds.pop(); show('unit'); renderUnit(); });
  $('to-album').addEventListener('click', () => { M.sounds.pop(); show('album'); renderAlbum(); });
  $('again').addEventListener('click', () => { M.sounds.pop(); startSort(); });
  $('to-unit').addEventListener('click', () => { M.sounds.pop(); show('unit'); renderUnit(); });
  $('say-explore').addEventListener('click', () => { M.sounds.pop(); say(M.t(TEXT.exploreIntro)); });
  $('say-sort').addEventListener('click', () => { M.sounds.pop(); sayAnimal(); });
  $('say-check').addEventListener('click', () => { M.sounds.pop(); say($('check-ask').textContent); });

  window.__lesson = () => ({ screen, sortList, sortIdx, checks, checkIdx }); // for automated testing
})();
