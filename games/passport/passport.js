(function () {
  const M = window.Mellis;
  const L = (ca, es, en) => ({ ca, es, en });
  const BOOKS_KEY = 'mellis.passport.books';   // newest first: { id, date, title, cover?, emoji, color, lang, readers: {memberId: face}, tags: [] }
  const FAMILY_KEY = 'mellis.passport.family'; // [{ id, e, name }]
  // Photos and everything else stay on this device (localStorage).

  const FACES = [
    { e: '🥱', name: L('Avorrit', 'Aburrido', 'Boring') },
    { e: '😐', name: L('Normalet', 'Normalito', 'So-so') },
    { e: '🙂', name: L('Bé', 'Bien', 'Good') },
    { e: '😃', name: L('Molt xulo', 'Muy chulo', 'Really cool') },
    { e: '🤩', name: L('Increïble!', '¡Increíble!', 'Amazing!') },
  ];
  const TAGS = [
    { id: 'funny', e: '😂', name: L('Divertit', 'Divertido', 'Funny') },
    { id: 'scary', e: '😱', name: L('Fa por', 'Da miedo', 'Scary') },
    { id: 'sad', e: '😢', name: L('Trist', 'Triste', 'Sad') },
    { id: 'sweet', e: '🥰', name: L('Tendre', 'Tierno', 'Sweet') },
    { id: 'wow', e: '🤯', name: L('Sorprenent', 'Sorprendente', 'Surprising') },
    { id: 'adventure', e: '🐉', name: L('Aventura', 'Aventura', 'Adventure') },
    { id: 'magic', e: '🪄', name: L('Màgic', 'Mágico', 'Magic') },
    { id: 'learn', e: '🧠', name: L('Aprens coses', 'Aprendes cosas', 'You learn things') },
    { id: 'animals', e: '🐾', name: L('Animals', 'Animales', 'Animals') },
  ];
  const COVER_EMOJI = ['📕', '📗', '📘', '📙', '🐉', '🦄', '🐶', '🐱', '🚀', '🏰', '🧚', '🦖', '🌈', '⚽', '👑', '🌊'];
  const COLORS = ['#ff6fb5', '#9b5de5', '#3a86ff', '#2ec4b6', '#3fb36b', '#ffd23f', '#ff9f1c', '#e5383b'];
  const LANGS = { ca: 'CA', es: 'ES', en: 'EN' };
  const MEMBER_EMOJI = ['👧', '👧🏻', '👧🏽', '👦', '👩', '👨', '👵', '👴', '🧑'];
  const MEDALS = [
    { id: 'first', e: '🎫', name: L('Primer segell', 'Primer sello', 'First stamp'), ok: (b) => b.length >= 1 },
    { id: 'five', e: '🥉', name: L('5 llibres', '5 libros', '5 books'), ok: (b) => b.length >= 5 },
    { id: 'ten', e: '🥈', name: L('10 llibres', '10 libros', '10 books'), ok: (b) => b.length >= 10 },
    { id: 'twenty', e: '🥇', name: L('20 llibres', '20 libros', '20 books'), ok: (b) => b.length >= 20 },
    { id: 'family', e: '👨‍👩‍👧‍👧', name: L('Llibre de família', 'Libro de familia', 'Family book'), ok: (b) => b.some((x) => Object.keys(x.readers).length >= 3) },
    { id: 'polyglot', e: '🌍', name: L('Poliglotes', 'Políglotas', 'Polyglots'), ok: (b) => new Set(b.map((x) => x.lang)).size >= 3 },
    { id: 'feelings', e: '🎭', name: L('Totes les emocions', 'Todas las emociones', 'All the feelings'), ok: (b) => ['funny', 'scary', 'sad', 'sweet'].every((t) => b.some((x) => x.tags.includes(t))) },
  ];

  const TEXT = {
    title: L('Passaport lector', 'Pasaporte lector', 'Reading passport'),
    head: L('Passaport lector de la família', 'Pasaporte lector de la familia', "The family's reading passport"),
    add: L('Nou llibre', 'Nuevo libro', 'New book'),
    empty: L('Encara no hi ha cap segell. Llegiu un llibre i afegiu-lo!', 'Todavía no hay ningún sello. ¡Leed un libro y añadidlo!', 'No stamps yet. Read a book and add it!'),
    family: L('La família lectora', 'La familia lectora', 'Our reading family'),
    familyHelp: L('Escriu el nom de cada lector (o deixa només la cara).', 'Escribe el nombre de cada lector (o deja solo la cara).', 'Type each reader\'s name (or just keep the face).'),
    addMember: L('Afegir lector', 'Añadir lector', 'Add reader'),
    steps: {
      cover: L('Com és la coberta?', '¿Cómo es la portada?', 'What does the cover look like?'),
      title: L('Com es diu el llibre?', '¿Cómo se llama el libro?', "What's the book called?"),
      readers: L("Qui l'ha llegit?", '¿Quién lo ha leído?', 'Who read it?'),
      rate: L("Quant t'ha agradat?", '¿Cuánto te ha gustado?', 'How much did you like it?'),
      tags: L('Com és el llibre? Tria fins a 3.', '¿Cómo es el libro? Elige hasta 3.', 'What is the book like? Pick up to 3.'),
    },
    photo: L('Fes una foto', 'Haz una foto', 'Take a photo'),
    orEmoji: L('O tria un dibuix:', 'O elige un dibujo:', 'Or pick a picture:'),
    titlePh: L('Títol del llibre', 'Título del libro', 'Book title'),
    readIn: L('El vam llegir en:', 'Lo leímos en:', 'We read it in:'),
    stamped: L('SEGELLAT!', '¡SELLADO!', 'STAMPED!'),
    newMedal: L('Medalla nova!', '¡Medalla nueva!', 'New medal!'),
    share: L('Compartir', 'Compartir', 'Share'),
    recommend: L('Et recomano aquest llibre!', '¡Te recomiendo este libro!', 'I recommend this book!'),
    del: L('Esborrar', 'Borrar', 'Delete'),
    sure: L('Segur? Toca una altra vegada', '¿Seguro? Toca otra vez', 'Sure? Tap again'),
    noRoom: L("No hi cap la foto: l'hem guardat amb un dibuix.", 'No cabe la foto: la hemos guardado con un dibujo.', "The photo didn't fit: we saved it with a picture instead."),
    untitled: L('Llibre sense títol', 'Libro sin título', 'Untitled book'),
  };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const say = (t) => M.speak(t.replace(/[¡!¿]/g, ''), M.lang);
  function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch (e) { return def; } }
  function save(key, v) { localStorage.setItem(key, JSON.stringify(v)); } // throws when full: callers handle it
  const books = () => load(BOOKS_KEY, []);
  function family() {
    const f = load(FAMILY_KEY, null);
    return f && f.length ? f : [{ id: 'm1', e: '👧', name: '' }, { id: 'm2', e: '👧🏻', name: '' }, { id: 'm3', e: '👩', name: '' }, { id: 'm4', e: '👨', name: '' }];
  }
  const memberLabel = (m) => `${m.e}${m.name ? ' ' + esc(m.name) : ''}`;
  const coverHTML = (b) => (b.cover ? `<img src="${b.cover}" alt="">` : `<span class="c-emoji" style="background:${b.color}">${b.emoji}</span>`);
  const dateLabel = (iso) => new Date(iso).toLocaleDateString({ ca: 'ca-ES', es: 'es-ES', en: 'en-GB' }[M.lang], { day: 'numeric', month: 'short' });
  const bestFace = (b) => { const v = Object.values(b.readers); return v.length ? FACES[Math.max(...v)].e : '📖'; };

  // ---------- Screens ----------
  const SCREENS = ['home', 'wizard', 'family'];
  function show(name) {
    SCREENS.forEach((s) => { $(s).hidden = s !== name; });
    window.scrollTo(0, 0);
  }

  // ---------- Home: the passport ----------
  function renderHome() {
    const list = books();
    const fam = family();
    $('head').textContent = M.t(TEXT.head);
    $('add-label').textContent = M.t(TEXT.add);
    $('members').innerHTML = fam.map((m) => {
      const n = list.filter((b) => b.readers[m.id] !== undefined).length;
      return `<span class="member">${memberLabel(m)} <b>${n}</b></span>`;
    }).join('') + '<button class="round-btn" id="family-btn" aria-label="family">✏️</button>';
    $('medals').innerHTML = MEDALS.map((md) =>
      `<button class="medal${md.ok(list) ? ' got' : ''}" data-id="${md.id}" aria-label="${M.t(md.name)}">${md.e}</button>`).join('');
    $('stamps').innerHTML = list.length
      ? list.map((b) => `<button class="stamp-card" data-id="${b.id}">
          <span class="cover">${coverHTML(b)}</span>
          <span class="stamp-mark">${bestFace(b)}<small>${dateLabel(b.date)}</small></span>
          <span class="s-title">${esc(b.title || M.t(TEXT.untitled))}</span></button>`).join('')
      : `<p class="empty">${M.t(TEXT.empty)}</p>`;
  }
  $('medals').addEventListener('click', (e) => {
    const b = e.target.closest('.medal');
    if (!b) return;
    const md = MEDALS.find((x) => x.id === b.dataset.id);
    M.sounds.pop();
    $('medal-name').textContent = `${md.e} ${M.t(md.name)}`;
    $('medal-name').hidden = false;
    say(M.t(md.name));
    clearTimeout(renderHome.t);
    renderHome.t = setTimeout(() => { $('medal-name').hidden = true; }, 2200);
  });
  $('members').addEventListener('click', (e) => { if (e.target.closest('#family-btn')) { M.sounds.pop(); openFamily(); } });
  $('stamps').addEventListener('click', (e) => { const b = e.target.closest('.stamp-card'); if (b) { M.sounds.pop(); openBook(b.dataset.id); } });
  $('add').addEventListener('click', () => { M.sounds.pop(); startWizard(null); });

  // ---------- Wizard: add / edit a book ----------
  const STEPS = ['cover', 'title', 'readers', 'rate', 'tags'];
  let draft = null, step = 0, editing = null;

  function startWizard(id) {
    editing = id;
    const b = id && books().find((x) => x.id === id);
    draft = b ? JSON.parse(JSON.stringify(b))
      : { id: 'b' + Date.now(), date: new Date().toISOString(), title: '', cover: null, emoji: COVER_EMOJI[0], color: COLORS[0], lang: M.lang, readers: {}, tags: [] };
    step = 0;
    show('wizard');
    renderStep(true);
  }
  function renderStep(speak) {
    const name = STEPS[step];
    $('w-dots').innerHTML = STEPS.map((s, i) => `<span class="${i < step ? 'done' : i === step ? 'now' : ''}">●</span>`).join('');
    $('w-ask').textContent = M.t(TEXT.steps[name]);
    $('w-back').hidden = false;
    const fam = family();
    let html = '';
    if (name === 'cover') {
      html = `<div class="w-cover"><span class="cover big">${coverHTML(draft)}</span></div>
        <button class="go-btn photo-btn" id="photo-btn">📷 ${M.t(TEXT.photo)}</button>
        <p class="w-help">${M.t(TEXT.orEmoji)}</p>
        <div class="pick-grid">${COVER_EMOJI.map((e) => `<button class="pick${!draft.cover && draft.emoji === e ? ' on' : ''}" data-emoji="${e}">${e}</button>`).join('')}</div>
        <div class="pick-row">${COLORS.map((c) => `<button class="swatch${!draft.cover && draft.color === c ? ' on' : ''}" data-color="${c}" style="background:${c}"></button>`).join('')}</div>`;
    } else if (name === 'title') {
      html = `<div class="w-cover"><span class="cover">${coverHTML(draft)}</span></div>
        <input class="title-in" id="title-in" maxlength="60" placeholder="${M.t(TEXT.titlePh)}" value="${esc(draft.title)}" autocomplete="off">
        <p class="w-help">${M.t(TEXT.readIn)}</p>
        <div class="pick-row">${Object.keys(LANGS).map((l) => `<button class="flag flag-${l}${draft.lang === l ? ' active' : ''}" data-lang="${l}"><span>${LANGS[l]}</span></button>`).join('')}</div>`;
    } else if (name === 'readers') {
      html = `<div class="readers">${fam.map((m) => `<button class="reader${draft.readers[m.id] !== undefined ? ' on' : ''}" data-m="${m.id}"><span class="r-e">${m.e}</span><span>${m.name ? esc(m.name) : ''}</span></button>`).join('')}</div>`;
    } else if (name === 'rate') {
      html = fam.filter((m) => draft.readers[m.id] !== undefined).map((m) => `
        <div class="rate-row"><span class="r-who">${memberLabel(m)}</span>
          <div class="faces">${FACES.map((f, i) => `<button class="face${draft.readers[m.id] === i ? ' on' : ''}" data-m="${m.id}" data-f="${i}" aria-label="${M.t(f.name)}">${f.e}</button>`).join('')}</div></div>`).join('')
        + `<p class="face-name" id="face-name"></p>`;
    } else {
      html = `<div class="tags">${TAGS.map((t) => `<button class="tag${draft.tags.includes(t.id) ? ' on' : ''}" data-t="${t.id}"><span class="t-e">${t.e}</span><span>${M.t(t.name)}</span></button>`).join('')}</div>`;
    }
    $('w-body').innerHTML = html;
    $('w-next').textContent = step === STEPS.length - 1 ? '🛂' : '➡️';
    $('w-next').disabled = name === 'readers' && !Object.keys(draft.readers).length;
    if (speak) say(M.t(TEXT.steps[name]));
  }

  $('w-body').addEventListener('click', (e) => {
    const t = e.target;
    const pickE = t.closest('[data-emoji]'), sw = t.closest('[data-color]'), lang = t.closest('[data-lang]');
    const reader = t.closest('.reader'), face = t.closest('.face'), tag = t.closest('.tag');
    if (t.closest('#photo-btn')) { $('photo-in').click(); return; }
    if (pickE) { draft.emoji = pickE.dataset.emoji; draft.cover = null; }
    else if (sw) { draft.color = sw.dataset.color; draft.cover = null; }
    else if (lang) { draft.title = $('title-in').value; draft.lang = lang.dataset.lang; }
    else if (reader) {
      const id = reader.dataset.m;
      if (draft.readers[id] !== undefined) delete draft.readers[id]; else draft.readers[id] = 2;
    } else if (face) {
      draft.readers[face.dataset.m] = +face.dataset.f;
      const f = FACES[+face.dataset.f];
      renderStep(false);
      $('face-name').textContent = `${f.e} ${M.t(f.name)}`;
      say(M.t(f.name));
      M.sounds.pop();
      return;
    } else if (tag) {
      const id = tag.dataset.t;
      if (draft.tags.includes(id)) draft.tags = draft.tags.filter((x) => x !== id);
      else if (draft.tags.length < 3) { draft.tags.push(id); say(M.t(TAGS.find((x) => x.id === id).name)); }
      else { M.sounds.boing(); return; }
    } else return;
    M.sounds.pop();
    renderStep(false);
  });
  $('w-body').addEventListener('input', (e) => { if (e.target.id === 'title-in') draft.title = e.target.value; });

  // a photo of the cover, shrunk so many fit on the device
  $('photo-in').addEventListener('change', () => {
    const file = $('photo-in').files[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const W = 300, H = 400;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const k = Math.max(W / img.width, H / img.height);
      const w = img.width * k, h = img.height * k;
      c.getContext('2d').drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      draft.cover = c.toDataURL('image/jpeg', 0.7);
      URL.revokeObjectURL(url);
      $('photo-in').value = '';
      M.sounds.match();
      renderStep(false);
    };
    img.src = url;
  });

  $('w-back').addEventListener('click', () => {
    M.sounds.pop();
    if (step === 0) { show('home'); renderHome(); return; }
    step--;
    renderStep(true);
  });
  $('w-next').addEventListener('click', () => {
    if ($('w-next').disabled) return;
    M.sounds.pop();
    if (STEPS[step] === 'title' && $('title-in')) draft.title = $('title-in').value.trim();
    if (step < STEPS.length - 1) { step++; renderStep(true); return; }
    stampIt();
  });

  function stampIt() {
    const before = books();
    const hadMedals = MEDALS.filter((m) => m.ok(before)).map((m) => m.id);
    const list = editing ? before.map((b) => (b.id === editing ? draft : b)) : [draft].concat(before);
    let note = '';
    try { save(BOOKS_KEY, list); } catch (e) {
      draft.cover = null;
      note = M.t(TEXT.noRoom);
      try { save(BOOKS_KEY, editing ? before.map((b) => (b.id === editing ? draft : b)) : [draft].concat(before)); } catch (e2) { /* still full */ }
    }
    const fresh = MEDALS.filter((m) => m.ok(books()) && !hadMedals.includes(m.id));
    show('home');
    renderHome();
    if (editing) return;
    $('stamp-cover').innerHTML = coverHTML(draft);
    $('stamp-word').textContent = M.t(TEXT.stamped);
    $('stamp-note').textContent = note;
    $('stamp-medals').innerHTML = fresh.map((m) => `<span>${m.e} ${M.t(m.name)}</span>`).join('');
    $('stamp-head').textContent = fresh.length ? M.t(TEXT.newMedal) : '';
    $('stamp').hidden = false;
    M.sounds.win();
    M.confetti();
    say(M.t(TEXT.stamped) + (fresh.length ? ' ' + M.t(TEXT.newMedal) + ' ' + fresh.map((m) => M.t(m.name)).join(', ') : ''));
  }
  $('stamp-ok').addEventListener('click', () => { M.sounds.pop(); $('stamp').hidden = true; });

  // ---------- A book's page ----------
  let openId = null, delArmed = false;
  function openBook(id) {
    openId = id;
    delArmed = false;
    renderBook();
    $('book').hidden = false;
    const b = books().find((x) => x.id === id);
    if (b && b.title) say(b.title);
  }
  function renderBook() {
    const b = books().find((x) => x.id === openId);
    if (!b) { $('book').hidden = true; return; }
    const fam = family();
    $('b-cover').innerHTML = coverHTML(b);
    $('b-title').textContent = b.title || M.t(TEXT.untitled);
    $('b-meta').textContent = `${dateLabel(b.date)} · ${LANGS[b.lang]}`;
    $('b-readers').innerHTML = fam.filter((m) => b.readers[m.id] !== undefined).map((m) =>
      `<div class="rate-row small"><span class="r-who">${memberLabel(m)}</span><span class="r-face">${FACES[b.readers[m.id]].e} ${M.t(FACES[b.readers[m.id]].name)}</span></div>`).join('');
    $('b-tags').innerHTML = b.tags.map((id) => { const t = TAGS.find((x) => x.id === id); return `<span class="chip">${t.e} ${M.t(t.name)}</span>`; }).join('');
    $('b-share').textContent = '📤 ' + M.t(TEXT.share);
    $('b-del').textContent = delArmed ? '🗑️ ' + M.t(TEXT.sure) : '🗑️';
  }
  $('b-close').addEventListener('click', () => { M.sounds.pop(); $('book').hidden = true; });
  $('b-edit').addEventListener('click', () => { M.sounds.pop(); $('book').hidden = true; startWizard(openId); });
  $('b-del').addEventListener('click', () => {
    M.sounds.pop();
    if (!delArmed) { delArmed = true; renderBook(); return; }
    save(BOOKS_KEY, books().filter((b) => b.id !== openId));
    $('book').hidden = true;
    renderHome();
  });
  $('b-share').addEventListener('click', () => { M.sounds.pop(); shareBook(books().find((x) => x.id === openId)); });

  // ---------- Share: a recommendation card as an image ----------
  function wrap(ctx, text, max) {
    const words = text.split(' '), lines = [];
    let line = '';
    words.forEach((w) => {
      const tryL = line ? line + ' ' + w : w;
      if (ctx.measureText(tryL).width > max && line) { lines.push(line); line = w; } else line = tryL;
    });
    if (line) lines.push(line);
    return lines.slice(0, 3);
  }
  function cardCanvas(b, coverImg) {
    const c = document.createElement('canvas');
    c.width = 720; c.height = 960;
    const x = c.getContext('2d');
    x.fillStyle = '#fff8ef'; x.fillRect(0, 0, 720, 960);
    x.strokeStyle = '#3a3a5c'; x.lineWidth = 12; x.strokeRect(18, 18, 684, 924);
    x.textAlign = 'center';
    x.fillStyle = '#c2185b'; x.font = 'bold 46px Fredoka, sans-serif';
    x.fillText(M.t(TEXT.recommend), 360, 96);
    // cover
    const cx = 230, cy = 130, cw = 260, ch = 346;
    if (coverImg) x.drawImage(coverImg, cx, cy, cw, ch);
    else {
      x.fillStyle = b.color; x.fillRect(cx, cy, cw, ch);
      x.font = '150px sans-serif'; x.fillText(b.emoji, 360, cy + ch / 2 + 52);
    }
    x.lineWidth = 6; x.strokeRect(cx, cy, cw, ch);
    // title
    x.fillStyle = '#3a3a5c'; x.font = 'bold 44px Fredoka, sans-serif';
    wrap(x, b.title || M.t(TEXT.untitled), 620).forEach((l, i) => x.fillText(l, 360, 540 + i * 52));
    // ratings + tags
    const fam = family();
    const rates = fam.filter((m) => b.readers[m.id] !== undefined).map((m) => m.e + FACES[b.readers[m.id]].e).join('   ');
    x.font = '56px sans-serif';
    x.fillText(rates, 360, 680);
    x.font = 'bold 34px Fredoka, sans-serif';
    x.fillText(b.tags.map((id) => { const t = TAGS.find((y) => y.id === id); return `${t.e} ${M.t(t.name)}`; }).join("  "), 360, 770);
    x.fillStyle = '#2a9d8f'; x.font = 'bold 28px Fredoka, sans-serif';
    x.fillText('🛂 ' + M.t(TEXT.title) + ' · Laboratorio Mellis', 360, 900);
    return c;
  }
  function shareBook(b) {
    const go = (img) => {
      cardCanvas(b, img).toBlob(async (blob) => {
        const file = new File([blob], 'llibre.png', { type: 'image/png' });
        try {
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: b.title || M.t(TEXT.recommend), text: M.t(TEXT.recommend) });
            return;
          }
        } catch (e) { if (e && e.name === 'AbortError') return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'llibre.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, 'image/png');
    };
    if (!b.cover) { go(null); return; }
    const img = new Image();
    img.onload = () => go(img);
    img.src = b.cover;
  }

  // ---------- Family ----------
  let famDraft = [];
  function openFamily() {
    famDraft = family().map((m) => ({ ...m }));
    show('family');
    renderFamily();
  }
  function renderFamily() {
    $('f-title').textContent = M.t(TEXT.family);
    $('f-help').textContent = M.t(TEXT.familyHelp);
    $('f-add').textContent = '➕ ' + M.t(TEXT.addMember);
    $('f-list').innerHTML = famDraft.map((m, i) => `
      <div class="f-row" data-i="${i}">
        <button class="f-emoji" data-i="${i}">${m.e}</button>
        <input class="f-name" data-i="${i}" maxlength="16" value="${esc(m.name)}" autocomplete="off">
        ${famDraft.length > 1 ? `<button class="f-del" data-i="${i}">✖️</button>` : ''}
      </div>`).join('');
  }
  $('f-list').addEventListener('click', (e) => {
    const em = e.target.closest('.f-emoji'), del = e.target.closest('.f-del');
    if (em) { const m = famDraft[+em.dataset.i]; m.e = MEMBER_EMOJI[(MEMBER_EMOJI.indexOf(m.e) + 1) % MEMBER_EMOJI.length]; M.sounds.pop(); renderFamily(); }
    if (del) { famDraft.splice(+del.dataset.i, 1); M.sounds.pop(); renderFamily(); }
  });
  $('f-list').addEventListener('input', (e) => { if (e.target.classList.contains('f-name')) famDraft[+e.target.dataset.i].name = e.target.value; });
  $('f-add').addEventListener('click', () => {
    M.sounds.pop();
    famDraft.push({ id: 'm' + Date.now(), e: MEMBER_EMOJI[famDraft.length % MEMBER_EMOJI.length], name: '' });
    renderFamily();
  });
  $('f-ok').addEventListener('click', () => {
    M.sounds.pop();
    famDraft.forEach((m) => { m.name = m.name.trim(); });
    try { save(FAMILY_KEY, famDraft); } catch (e) { /* ignore */ }
    show('home');
    renderHome();
  });

  // ---------- Wiring ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    if (!$('home').hidden) renderHome();
    if (!$('wizard').hidden) { if ($('title-in')) draft.title = $('title-in').value; renderStep(false); }
    if (!$('family').hidden) renderFamily();
    if (!$('book').hidden) renderBook();
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  show('home');
  renderText();
  window.__passport = () => ({ draft, step, books: books(), family: family() }); // for automated testing
})();
