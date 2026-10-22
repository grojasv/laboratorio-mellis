(function () {
  const M = window.Mellis;
  const L = (ca, es, en) => ({ ca, es, en });
  const { KIDS, FEELINGS, LESSONS } = window.FRIENDS;
  const STICKERS_KEY = 'mellis.friends.stickers'; // { "lesson-story": 1 }
  const LESSONS_KEY = 'mellis.friends.lessons';   // { lessonId: best stars }

  // No hearts in this unit (feelings, not penalties): a wrong choice shows what happens and she picks again.
  // Stars come from first-try choices, like Memory.
  const TEXT = {
    title: L('Aprenem: bons amics', 'Aprendemos: buenos amigos', "Let's learn: good friends"),
    unit: L('Bons amics', 'Buenos amigos', 'Good friends'),
    album: L("Racó de l'amistat", 'Rincón de la amistad', 'Friendship corner'),
    ask: L('Què fas?', '¿Qué haces?', 'What do you do?'),
    again: L('Tria una altra opció.', 'Elige otra opción.', 'Pick another option.'),
    feelAsk: { ca: (t) => `Com se sent ${t}?`, es: (t) => `¿Cómo se siente ${t}?`, en: (t) => `How does ${t} feel?` },
    feelIs: { ca: (t, a) => `${cap(t)} està ${a}.`, es: (t, a) => `${cap(t)} está ${a}.`, en: (t, a) => `${cap(t)} feels ${a}.` },
    feelWrong: L("Mmm... fixa't bé en què li passa.", 'Mmm... fíjate bien en lo que le pasa.', 'Hmm... think about what is happening.'),
    win: L('Lliçó acabada!', '¡Lección terminada!', 'Lesson done!'),
    newStickers: L('Adhesius nous:', 'Pegatinas nuevas:', 'New stickers:'),
  };

  const $ = (id) => document.getElementById(id);
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
  const say = (text, opts) => M.speak(text.replace(/[¡!¿«»“”]/g, ''), M.lang, opts);
  const adj = (mood, kid) => (M.lang === 'en' ? FEELINGS[mood].adj.en : FEELINGS[mood].adj[M.lang][kid.f ? 1 : 0]);

  // ---------- Screens ----------
  const SCREENS = ['unit', 'explore', 'story', 'feel', 'album'];
  let screen = 'unit', lesson = null;
  function show(name) {
    SCREENS.forEach((s) => { $(s).hidden = s !== name; });
    $('win').hidden = true;
    $('lesson-bar').hidden = !lesson || ['unit', 'album'].includes(name);
    screen = name;
    window.scrollTo(0, 0);
  }
  function renderSteps(now) {
    $('lesson-steps').innerHTML = ['🔍', '📖', '😊'].map((ic, i) => `<span class="${i < now ? 'done' : i === now ? 'now' : ''}">${ic}</span>`).join('');
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
    const total = LESSONS.reduce((n, l) => n + l.stories.length, 0);
    $('album-count').textContent = `${Object.keys(load(STICKERS_KEY)).length}/${total}`;
  }
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    $('album-label').textContent = M.t(TEXT.album);
    $('album-title').textContent = M.t(TEXT.album);
    renderUnit();
    if (screen === 'explore') renderExplore();
    if (screen === 'story') renderStory();
    if (screen === 'feel') renderFeel();
    if (screen === 'album') renderAlbum();
  }

  // ---------- Lesson ----------
  let heard = new Set(), idx = 0, misses = 0, busy = false, tried = new Set(), order = [], mood = null, got = [];

  function startLesson(l) {
    lesson = l;
    heard = new Set();
    show('explore');
    renderSteps(0);
    renderExplore();
    say(M.t(l.intro));
  }

  // explore: feelings (lesson 1) or ideas (lessons 2–3)
  function renderExplore() {
    $('explore-intro').textContent = M.t(lesson.intro);
    $('groups').innerHTML = lesson.tiles.map((t) =>
      `<button class="group${heard.has(t.key) ? ' heard' : ''}" data-k="${t.key}" style="--c:${t.color}"><span class="g-ex">${t.e}</span><span class="g-name">${M.t(t.name)}</span></button>`).join('');
    $('explore-next').hidden = heard.size < lesson.tiles.length;
  }
  $('groups').addEventListener('click', (e) => {
    const b = e.target.closest('.group');
    if (!b) return;
    const t = lesson.tiles.find((x) => x.key === b.dataset.k);
    heard.add(t.key);
    M.sounds.pop();
    $('explore-fact').innerHTML = `<b style="color:${t.color}">${M.t(t.name)}</b> ${M.t(t.fact)}`;
    $('explore-fact').hidden = false;
    say(M.t(t.fact));
    renderExplore();
  });
  $('explore-next').addEventListener('click', () => { M.sounds.pop(); startStories(); });

  function startStories() {
    misses = 0;
    got = [];
    idx = 0;
    show('story');
    renderSteps(1);
    startStory();
  }

  // ---------- Stories ----------
  function startStory() {
    const s = lesson.stories[idx];
    tried = new Set();
    mood = null;
    busy = false;
    order = shuffle(s.choices.map((c, i) => i));
    renderStory();
    say(M.t(s.text) + ' ' + M.t(TEXT.ask));
  }
  function renderStory() {
    const s = lesson.stories[idx];
    const kid = KIDS[s.kid];
    $('story-progress').innerHTML = lesson.stories.map((x, i) => `<span class="${i < idx ? 'done' : i === idx ? 'now' : ''}">●</span>`).join('');
    $('scene').innerHTML = `<span class="sc-place">${s.place}</span><span class="sc-kid">${kid.e}</span><span class="sc-mood${mood ? ' show' : ''}">${mood ? FEELINGS[mood].e : '💭'}</span>`;
    $('story-text').textContent = M.t(s.text);
    $('story-ask').textContent = M.t(TEXT.ask);
    $('choices').innerHTML = order.map((i) => {
      const c = s.choices[i];
      return `<button class="choice${tried.has(i) ? ' tried' : ''}" data-i="${i}"><span class="ch-e">${c.e}</span><span>${M.t(c.t)}</span></button>`;
    }).join('');
  }
  $('choices').addEventListener('click', (e) => {
    const b = e.target.closest('.choice');
    if (!b || busy || b.classList.contains('tried')) return;
    const s = lesson.stories[idx];
    const i = +b.dataset.i;
    const c = s.choices[i];
    mood = c.mood;
    if (!c.ok) {
      misses++;
      tried.add(i);
      M.sounds.miss();
      renderStory();
      $('story-msg').textContent = M.t(c.res);
      $('story-msg').className = 'fact result over bad';
      $('story-msg').hidden = false;
      say(M.t(c.res) + ' ' + M.t(TEXT.again));
      return;
    }
    busy = true;
    renderStory();
    $('choices').querySelector(`.choice[data-i="${i}"]`).classList.add('right');
    M.sounds.match();
    got.push(`${lesson.id}-${idx}`);
    const text = M.t(c.res) + ' ' + M.t(s.end);
    $('story-msg').textContent = text;
    $('story-msg').className = 'fact result over good';
    $('story-msg').hidden = false;
    say(text, {
      onend: () => setTimeout(() => {
        busy = false;
        $('story-msg').hidden = true;
        idx++;
        if (idx < lesson.stories.length) startStory(); else startFeel();
      }, 900),
    });
  });

  // ---------- How do they feel? ----------
  function startFeel() {
    idx = 0;
    show('feel');
    renderSteps(2);
    startFeelQ();
  }
  function feelAsk(q) { return TEXT.feelAsk[M.lang](M.t(KIDS[q.kid].the)); }
  function startFeelQ() {
    tried = new Set();
    busy = false;
    renderFeel();
    const q = lesson.feel[idx];
    say(M.t(q.text) + ' ' + feelAsk(q));
  }
  function renderFeel() {
    const q = lesson.feel[idx];
    $('feel-kid').textContent = KIDS[q.kid].e;
    $('feel-text').textContent = M.t(q.text);
    $('feel-ask').textContent = feelAsk(q);
    $('feel-msg').hidden = true;
    $('feelings').innerHTML = Object.keys(FEELINGS).map((k) =>
      `<button class="feeling${tried.has(k) ? ' tried' : ''}" data-k="${k}" style="--c:${FEELINGS[k].color}"><span class="ch-e">${FEELINGS[k].e}</span><span>${cap(adj(k, KIDS[q.kid]))}</span></button>`).join('');
  }
  $('feelings').addEventListener('click', (e) => {
    const b = e.target.closest('.feeling');
    if (!b || busy || b.classList.contains('tried')) return;
    const q = lesson.feel[idx];
    if (b.dataset.k !== q.mood) {
      misses++;
      tried.add(b.dataset.k);
      M.sounds.miss();
      renderFeel();
      $('feel-msg').textContent = M.t(TEXT.feelWrong);
      $('feel-msg').hidden = false;
      say(M.t(TEXT.feelWrong));
      return;
    }
    busy = true;
    b.classList.add('right');
    M.sounds.match();
    const text = TEXT.feelIs[M.lang](M.t(KIDS[q.kid].the), adj(q.mood, KIDS[q.kid]));
    $('feel-msg').textContent = text;
    $('feel-msg').hidden = false;
    say(text, {
      onend: () => setTimeout(() => {
        idx++;
        if (idx < lesson.feel.length) startFeelQ(); else finish();
      }, 800),
    });
  });

  function finish() {
    const stars = misses === 0 ? 3 : misses <= 2 ? 2 : 1;
    const best = load(LESSONS_KEY);
    best[lesson.id] = Math.max(best[lesson.id] || 0, stars);
    save(LESSONS_KEY, best);
    const st = load(STICKERS_KEY);
    const fresh = got.filter((k) => !st[k]);
    fresh.forEach((k) => { st[k] = 1; });
    save(STICKERS_KEY, st);
    renderSteps(3);
    $('win-text').textContent = M.t(TEXT.win);
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('win-new').textContent = fresh.length ? M.t(TEXT.newStickers) : '';
    $('win-cards').innerHTML = fresh.map((k) => `<div class="mini-card${stars === 3 ? ' gold' : ''}">${stickerOf(k).place}</div>`).join('');
    $('win-twins').innerHTML = M.mascotsSVG('cheer');
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    say(M.t(TEXT.win));
  }

  // ---------- Album: one sticker per story, with its lesson ----------
  function stickerOf(k) {
    const [l, i] = k.split('-').map(Number);
    return LESSONS.find((x) => x.id === l).stories[i];
  }
  function renderAlbum() {
    const st = load(STICKERS_KEY);
    $('album-grid').innerHTML = LESSONS.map((l) => `
      <h3 class="album-sec">${l.icon} ${M.t(l.name)}</h3>
      <div class="sticker-grid">${l.stories.map((s, i) => (st[`${l.id}-${i}`]
        ? `<button class="sticker" data-k="${l.id}-${i}"><span class="emoji">${s.place}</span><span>${KIDS[s.kid].e} ${s.choices.find((c) => c.ok).e}</span></button>`
        : '<div class="sticker unknown"><span class="emoji">❓</span></div>')).join('')}</div>`).join('');
  }
  $('album-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.sticker[data-k]');
    if (!b) return;
    b.classList.remove('jump'); void b.offsetWidth; b.classList.add('jump');
    M.sounds.pop();
    say(M.t(stickerOf(b.dataset.k).end));
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
  $('again').addEventListener('click', () => { M.sounds.pop(); startStories(); });
  $('to-unit').addEventListener('click', toUnit);
  $('say-explore').addEventListener('click', () => { M.sounds.pop(); say(M.t(lesson.intro)); });
  $('say-story').addEventListener('click', () => { M.sounds.pop(); say(M.t(lesson.stories[idx].text) + ' ' + M.t(TEXT.ask)); });
  $('say-feel').addEventListener('click', () => { M.sounds.pop(); const q = lesson.feel[idx]; say(M.t(q.text) + ' ' + feelAsk(q)); });

  window.__lesson = () => ({ screen, lesson: lesson && lesson.id, idx, misses, stories: lesson && lesson.stories, feel: lesson && lesson.feel }); // for automated testing
})();
