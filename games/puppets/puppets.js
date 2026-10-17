// Puppet Show — English practice from the school's "Back to School" unit.
// Build a puppet → answer "All about me" → the puppet hosts quiz scenes
// (feelings, weather, seasons, school things, numbers to 20) → finale where she
// reads her own "All about me" out loud and the puppet lip-syncs to her voice.
(function () {
  const M = window.Mellis;
  const A = window.PuppetArt;
  const STORE = 'mellis.puppets';
  const SCENES = 6;
  const MS_PER_WORD = 300;

  // ---------- Vocabulary (British English, as on the school sheets) ----------
  const FEELINGS = ['happy', 'sad', 'angry', 'scared'];
  const WEATHER = ['sunny', 'windy', 'rainy', 'snowy', 'hot', 'cold'];
  const CLASH = { sunny: 'hot', hot: 'sunny', snowy: 'cold', cold: 'snowy' }; // never offered together
  const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
  const THINGS = { desk: 'desk', jumper: 'jumper', chair: 'chair', pencilcase: 'pencil case', rubber: 'rubber', ruler: 'ruler', pencil: 'pencil', pen: 'pen', book: 'book' };
  const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

  const ABOUT = [
    { id: 'name', q: "What's your name?", sub: { ca: 'Com et dius?', es: '¿Cómo te llamas?', en: 'Type your name' } },
    { id: 'age', q: 'How old are you?', sub: { ca: 'Quants anys tens?', es: '¿Cuántos años tienes?', en: 'Pick a number' },
      opts: [5, 6, 7, 8, 9, 10].map((n) => ({ id: n, en: NUMS[n] })) },
    { id: 'colour', q: "What's your favourite colour?", sub: { ca: 'Quin és el teu color preferit?', es: '¿Cuál es tu color favorito?', en: 'Pick one' },
      opts: Object.keys(A.COLOURS).map((c) => ({ id: c, en: c, swatch: A.COLOURS[c] })) },
    { id: 'like', q: 'What food do you like?', sub: { ca: 'Quin menjar t\'agrada?', es: '¿Qué comida te gusta?', en: 'Pick one' }, opts: 'food' },
    { id: 'dislike', q: "What food don't you like?", sub: { ca: 'Quin menjar no t\'agrada?', es: '¿Qué comida no te gusta?', en: 'Pick one' }, opts: 'food' },
    { id: 'pet', q: "What's your favourite pet?", sub: { ca: 'Quin és el teu animal preferit?', es: '¿Cuál es tu mascota favorita?', en: 'Pick one' },
      opts: [['dog', '🐶'], ['cat', '🐱'], ['fish', '🐠'], ['rabbit', '🐰'], ['bird', '🐦'], ['hamster', '🐹'], ['horse', '🐴'], ['turtle', '🐢'], ['snake', '🐍']].map(([en, icon]) => ({ id: en, en, icon })) },
    { id: 'can', q: 'What can you do?', sub: { ca: 'Què saps fer?', es: '¿Qué sabes hacer?', en: 'Pick one' },
      opts: [['swim', '🏊'], ['dance', '💃'], ['sing', '🎤'], ['draw', '🎨'], ['ride a bike', '🚲'], ['jump', '🤸'], ['read', '📖'], ['run', '🏃'], ['cook', '🍳']].map(([en, icon]) => ({ id: en, en, icon })) },
  ];
  const FOOD = [['pizza', '🍕'], ['ice cream', '🍦'], ['apples', '🍎'], ['chocolate', '🍫'], ['carrots', '🥕'], ['bananas', '🍌'],
    ['broccoli', '🥦'], ['fish', '🐟'], ['tomatoes', '🍅'], ['cheese', '🧀'], ['pasta', '🍝'], ['onions', '🧅']].map(([en, icon]) => ({ id: en, en, icon }));

  const BUILD = [
    { id: 'colour', opts: Object.keys(A.COLOURS) },
    { id: 'eyes', opts: ['round', 'googly', 'sleepy', 'lashes'] },
    { id: 'hair', opts: ['none', 'spiky', 'curly', 'tuft', 'pigtails'] },
    { id: 'extra', opts: ['none', 'bow', 'hat', 'glasses', 'crown'] },
  ];

  const TEXT = {
    title: { ca: 'Teatre de titelles', es: 'Teatro de títeres', en: 'Puppet Show' },
    pick: { ca: 'Tria el teu titella', es: 'Elige tu títere', en: 'Choose your puppet' },
    newP: { ca: 'Nou titella', es: 'Nuevo títere', en: 'New puppet' },
    build: { ca: 'Fes el teu titella!', es: '¡Haz tu títere!', en: 'Make your puppet!' },
    mic: { ca: 'Llegeix en veu alta!', es: '¡Lee en voz alta!', en: 'Read it out loud!' },
    listening: { ca: "T'escolto... toca quan acabis", es: 'Te escucho... toca al terminar', en: "I'm listening... tap when done" },
    more: { ca: 'Llegeix-ho tot en veu alta!', es: '¡Léelo todo en voz alta!', en: 'Read it all out loud!' },
    noMic: { ca: 'Ja ho he llegit en veu alta!', es: '¡Ya lo he leído en voz alta!', en: 'I read it out loud!' },
    noMicNote: { ca: 'Sense micròfon: llegeix-ho en veu alta igualment!', es: 'Sin micrófono: ¡léelo en voz alta igualmente!', en: 'No microphone: read it out loud anyway!' },
    tapLine: { ca: 'Toca la frase per escoltar-la', es: 'Toca la frase para escucharla', en: 'Tap the sentence to hear it' },
    watch: { ca: "Mira l'espectacle!", es: '¡Mira el espectáculo!', en: 'Watch the show!' },
    sticker: { ca: 'Un adhesiu daurat per al teu titella!', es: '¡Una pegatina dorada para tu títere!', en: 'A golden sticker for your puppet!' },
  };

  const $ = (id) => document.getElementById(id);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const plain = (html) => html.replace(/<[^>]+>/g, '');

  // ---------- Saved puppets (one per twin) ----------
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(STORE, JSON.stringify(list)); } catch (e) { /* ignore */ } }
  let profiles = load();
  let current = null;   // the profile being built / played

  // ---------- Screens ----------
  let screen = 'wardrobe';
  function show(name) {
    screen = name;
    ['wardrobe', 'build', 'about', 'stage', 'finale'].forEach((s) => { $(s).hidden = s !== name; });
    $('win').hidden = true;
    if (name !== 'finale') releaseMic();
    window.scrollTo(0, 0);
  }

  // ---------- Puppet mouth ----------
  function setJaw(el, v) {
    const jaw = el && el.querySelector('.jaw'), cav = el && el.querySelector('.cavity');
    if (!jaw) return;
    jaw.setAttribute('transform', `translate(0 ${(v * 18).toFixed(1)})`);
    cav.setAttribute('height', (4 + v * 18).toFixed(1));
  }
  // The puppet in `el` says `text` (English voice) with a flapping mouth.
  let flap = 0;
  function talk(el, text, then) {
    clearInterval(flap);
    M.speak(plain(text), 'en', {
      onstart: () => {
        el.classList.add('talking');
        flap = setInterval(() => setJaw(el, Math.random() < 0.25 ? 0 : 0.35 + Math.random() * 0.65), 120);
      },
      onend: () => {
        clearInterval(flap);
        setJaw(el, 0);
        el.classList.remove('talking');
        if (then) then();
      },
    });
  }

  // ---------- Wardrobe ----------
  function renderWardrobe() {
    $('pick-label').textContent = M.t(TEXT.pick);
    $('cards').innerHTML = profiles.map((p, i) => `
      <button class="card" data-i="${i}">
        <span class="c-puppet">${A.puppetSVG(p.puppet)}</span>
        <span class="c-name">${p.me.name || '?'}</span>
        <span class="c-stickers">${'⭐'.repeat(Math.min(p.stickers || 0, 10))}</span>
        <span class="c-edit" data-edit="${i}">✏️</span>
      </button>`).join('') +
      (profiles.length < 4 ? `<button class="card new" id="new-card"><span class="plus">➕</span>${M.t(TEXT.newP)}</button>` : '');
  }
  $('cards').addEventListener('click', (e) => {
    const edit = e.target.closest('[data-edit]');
    const card = e.target.closest('.card');
    if (!card) return;
    M.sounds.pop();
    if (edit) { current = profiles[+edit.dataset.edit]; startBuild(); return; }
    if (card.id === 'new-card') {
      current = { id: Date.now(), puppet: { colour: pick(Object.keys(A.COLOURS)), eyes: 'round', hair: 'none', extra: 'none' }, me: { age: 7 }, stickers: 0 };
      startBuild();
      return;
    }
    current = profiles[+card.dataset.i];
    startRound();
  });

  // ---------- Builder ----------
  function startBuild() {
    show('build');
    $('build-label').textContent = M.t(TEXT.build);
    renderBuild();
  }
  function renderBuild() {
    $('build-puppet').innerHTML = A.puppetSVG(current.puppet);
    $('build-pickers').innerHTML = BUILD.map((row) => `<div class="prow">${row.opts.map((o) => {
      const on = current.puppet[row.id] === o ? ' on' : '';
      if (row.id === 'colour') return `<button class="popt swatch${on}" data-part="colour" data-v="${o}" style="background:${A.COLOURS[o]}"></button>`;
      const preview = { ...current.puppet, [row.id]: o };
      const crop = row.id === 'eyes' ? '28 34 144 64' : '6 -26 188 120';
      const svg = o === 'none' ? '✖️' : A.puppetSVG(preview).replace(/viewBox="[^"]+"/, `viewBox="${crop}"`);
      return `<button class="popt${on}" data-part="${row.id}" data-v="${o}">${svg}</button>`;
    }).join('')}</div>`).join('');
  }
  $('build-pickers').addEventListener('click', (e) => {
    const b = e.target.closest('.popt');
    if (!b) return;
    current.puppet[b.dataset.part] = b.dataset.v;
    M.sounds.pop();
    renderBuild();
    const el = $('build-puppet');
    el.classList.remove('talking'); void el.offsetWidth;
    setJaw(el, 0.8); setTimeout(() => setJaw(el, 0), 180);
  });
  $('build-next').addEventListener('click', () => { M.sounds.pop(); startAbout(); });

  // ---------- All about me ----------
  let aboutIdx = 0;
  function startAbout() {
    aboutIdx = 0;
    show('about');
    renderAbout();
  }
  function renderAbout() {
    const step = ABOUT[aboutIdx];
    $('about-dots').innerHTML = ABOUT.map((_, i) => `<span class="${i < aboutIdx ? 'done' : i === aboutIdx ? 'now' : ''}"></span>`).join('');
    $('about-puppet').innerHTML = A.puppetSVG(current.puppet);
    $('about-q').textContent = step.q;
    $('about-sub').textContent = M.t(step.sub);
    const body = $('about-body');
    if (step.id === 'name') {
      body.className = 'about-body wide';
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÈÉÍÏÒÓÚÜÇÑ'.split('');
      // ➡️ sits beside the name (not at the bottom) so it never covers the keyboard
      body.innerHTML = `<div class="name-row"><div class="name-box" id="name-box">${current.me.name || ''}&nbsp;</div>
        <button class="go name-go" id="name-go"${current.me.name ? '' : ' hidden'}>➡️</button></div>
        <div class="keys">${letters.map((l) => `<button class="key" data-k="${l}">${l}</button>`).join('')}<button class="key wide" data-k="del">⌫</button></div>`;
    } else {
      body.className = 'about-body';
      const opts = step.opts === 'food' ? FOOD : step.opts;
      body.innerHTML = opts.map((o) => {
        const on = current.me[step.id] === o.id ? ' on' : '';
        if (step.id === 'age') return `<button class="pick num${on}" data-v="${o.id}">${o.id}</button>`;
        const icon = o.swatch ? `<span class="p-swatch" style="background:${o.swatch}"></span>` : `<span class="p-icon">${o.icon}</span>`;
        return `<button class="pick${on}" data-v="${o.id}">${icon}${o.en}</button>`;
      }).join('');
    }
    $('about-next').hidden = step.id === 'name' || !current.me[step.id];
  }
  function sayAbout() { talk($('about-puppet'), ABOUT[aboutIdx].q); }
  $('about-say').addEventListener('click', () => { M.sounds.pop(); sayAbout(); });
  $('about-body').addEventListener('click', (e) => {
    const step = ABOUT[aboutIdx];
    const key = e.target.closest('.key');
    if (key) {
      M.sounds.flip();
      let n = current.me.name || '';
      if (key.dataset.k === 'del') n = n.slice(0, -1);
      else if (n.length < 12) n += key.dataset.k;
      current.me.name = n ? n[0] + n.slice(1).toLowerCase() : '';
      $('name-box').innerHTML = (current.me.name || '') + '&nbsp;';
      $('name-go').hidden = !current.me.name;
      return;
    }
    if (e.target.closest('#name-go')) { $('about-next').click(); return; }
    const b = e.target.closest('.pick');
    if (!b) return;
    const v = step.id === 'age' ? +b.dataset.v : b.dataset.v;
    current.me[step.id] = v;
    M.sounds.pop();
    renderAbout();
    talk($('about-puppet'), step.id === 'age' ? NUMS[v] : v);
  });
  $('about-next').addEventListener('click', () => {
    M.sounds.pop();
    if (aboutIdx < ABOUT.length - 1) { aboutIdx++; renderAbout(); sayAbout(); return; }
    // save and go to the wardrobe
    const i = profiles.findIndex((p) => p.id === current.id);
    if (i >= 0) profiles[i] = current; else profiles.push(current);
    save(profiles);
    show('wardrobe');
    renderWardrobe();
  });

  // ---------- Stage: quiz scenes ----------
  const round = M.round({ heartsEl: $('hearts'), onOut: () => startRound() });
  let scenes = [], sceneIdx = 0, scene = null, busy = false;

  function planScenes() {
    const topics = shuffle(['feelings', 'weather', 'season', 'bag', 'numbers']);
    let extra;
    do { extra = pick(topics); } while (extra === topics[topics.length - 1]);
    topics.push(extra);
    return topics.map(makeScene);
  }

  function makeScene(topic) {
    if (topic === 'feelings') {
      const ans = pick(FEELINGS);
      return { topic, ans, opts: shuffle(FEELINGS.slice()), q: 'How am I feeling?', a: `I am ${ans}!` };
    }
    if (topic === 'weather') {
      const ans = pick(WEATHER);
      const opts = [ans];
      for (const w of shuffle(WEATHER.slice())) {
        if (opts.length === 4) break;
        if (opts.includes(w) || opts.some((o) => CLASH[o] === w)) continue;
        opts.push(w);
      }
      return { topic, ans, opts: shuffle(opts), q: "What's the weather like today?", a: `Today, it is ${ans}!` };
    }
    if (topic === 'season') {
      const ans = pick(SEASONS);
      return { topic, ans, opts: shuffle(SEASONS.slice()), q: "What's the season?", a: `It is ${ans}!` };
    }
    if (topic === 'bag') {
      const ids = Object.keys(THINGS);
      const ans = pick(ids);
      const opts = shuffle([ans, ...shuffle(ids.filter((i) => i !== ans)).slice(0, 3)]);
      return { topic, ans, opts, q: `Put the <b>${THINGS[ans]}</b> in my bag!`, a: `I've got a ${THINGS[ans]}!` };
    }
    const n = 6 + Math.floor(Math.random() * 15);           // 6..20
    const lo = Math.min(n - 1, 18);
    const opts = shuffle([lo, lo + 1, lo + 2]);
    return { topic: 'numbers', ans: n, opts, q: 'How many colour pencils have we got?', a: `We've got ${NUMS[n]} colour pencils!` };
  }

  function startRound() {
    round.start();
    scenes = planScenes();
    sceneIdx = 0;
    show('stage');
    $('host-puppet').innerHTML = A.puppetSVG(current.puppet);
    nextScene();
  }

  function nextScene() {
    document.querySelectorAll('.flying').forEach((f) => f.remove());
    scene = scenes[sceneIdx];
    busy = false;
    $('scene-dots').innerHTML = scenes.map((_, i) => `<span class="${i < sceneIdx ? 'done' : i === sceneIdx ? 'now' : ''}"></span>`).join('');
    const sc = $('scene');
    if (scene.topic === 'feelings') sc.innerHTML = `<div class="feel-scene">${A.puppetSVG(current.puppet, scene.ans)}</div>`;
    else if (scene.topic === 'weather' || scene.topic === 'season') sc.innerHTML = A.windowSVG(scene.ans);
    else if (scene.topic === 'bag') sc.innerHTML = '<div class="bag-scene" id="bag">🎒</div>';
    else sc.innerHTML = A.pencilsSVG(scene.ans);
    $('host-puppet').style.visibility = scene.topic === 'feelings' ? 'hidden' : '';
    $('question').innerHTML = scene.q;
    const opts = $('options');
    opts.style.gridTemplateColumns = scene.topic === 'numbers' ? '1fr 1fr 1fr' : '';
    opts.innerHTML = scene.opts.map((o) => scene.topic === 'bag'
      ? `<button class="opt pic" data-v="${o}">${A.thingHTML(o)}</button>`
      : `<button class="opt" data-v="${o}">${scene.topic === 'numbers' ? NUMS[o] : o}</button>`).join('');
    speaker().classList.remove('talking');
    setTimeout(() => talk(speaker(), scene.q), 250);
  }
  // in the feelings scene the big puppet on the stage is the one talking
  window.__puppetScene = () => scene; // for automated testing
  function speaker() { return scene && scene.topic === 'feelings' ? $('scene').firstElementChild : $('host-puppet'); }

  $('say').addEventListener('click', () => { M.sounds.pop(); talk(speaker(), scene.q); });

  $('options').addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (!b || busy || round.busy || b.classList.contains('used')) return;
    const v = scene.topic === 'numbers' ? +b.dataset.v : b.dataset.v;
    if (v !== scene.ans) {
      b.classList.add('used');
      busy = true;
      round.wrong('scene' + sceneIdx).then(({ reveal }) => {
        if (!reveal) { busy = false; return; }
        right(true);
      });
      return;
    }
    busy = true;
    right(false);
  });

  // Correct (or revealed) answer: glow, the puppet says the full sentence, next scene.
  function right(revealed) {
    const btn = [...$('options').children].find((x) => String(x.dataset.v) === String(scene.ans));
    btn.classList.add('reveal');
    if (!revealed) M.sounds.match();
    if (scene.topic === 'bag') flyIntoBag(btn);
    setTimeout(() => talk(speaker(), scene.a, () => setTimeout(advance, 500)), revealed ? 600 : 300);
  }
  function advance() {
    sceneIdx++;
    if (sceneIdx < scenes.length) nextScene();
    else startFinale();
  }
  function flyIntoBag(btn) {
    const from = btn.getBoundingClientRect(), to = $('bag').getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'flying';
    f.innerHTML = btn.innerHTML;
    f.style.left = from.left + from.width / 2 - 35 + 'px';
    f.style.top = from.top + 10 + 'px';
    document.body.appendChild(f);
    const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 3 - from.top;
    f.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${dx / 2}px, ${dy - 60}px) scale(1.1)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.3)`, opacity: 0.6 }], { duration: 700, easing: 'ease-in', fill: 'forwards' });
    setTimeout(() => {
      f.remove();
      const bag = $('bag');
      if (bag) bag.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2, .85)' }, { transform: 'scale(1)' }], { duration: 300 });
    }, 720);
  }

  // ---------- Finale: All about me show ----------
  let lines = [], lineIdx = 0, recordings = [], micMode = 'unknown';

  function makeLines() {
    const me = current.me;
    return [
      `Hello! My name is <b>${me.name}</b>.`,
      `I am <b>${NUMS[me.age]}</b> years old.`,
      `My favourite colour is <b>${me.colour}</b>.`,
      `I like <b>${me.like}</b>.`,
      `I don't like <b>${me.dislike}</b>.`,
      `My favourite pet is a <b>${me.pet}</b>.`,
      `I can <b>${me.can}</b>.`,
    ];
  }

  function startFinale() {
    lines = makeLines();
    lineIdx = 0;
    recordings.forEach((u) => u && URL.revokeObjectURL(u));
    recordings = [];
    show('finale');
    $('showtime').textContent = 'Show time! 🎭';
    $('final-puppet').innerHTML = A.puppetSVG(current.puppet);
    $('watch').hidden = true;
    renderLine();
  }
  function renderLine() {
    const done = lineIdx >= lines.length;
    $('line').innerHTML = done ? '👏👏👏' : lines[lineIdx];
    $('line-sub').textContent = done ? '' : `${lineIdx + 1} / ${lines.length} · ${M.t(TEXT.tapLine)}`;
    $('mic').parentElement.hidden = done;
    $('watch').hidden = !done;
    $('watch-label').textContent = M.t(TEXT.watch);
    if (!live) {
      $('mic-label').textContent = M.t(micMode === 'none' ? TEXT.noMic : TEXT.mic);
      $('meter').hidden = true;
      $('meter-fill').style.width = '0%';
    }
    $('mic-note').textContent = M.t(TEXT.noMicNote);
    $('mic-note').hidden = micMode !== 'none';
  }
  $('line').addEventListener('click', () => { if (lineIdx < lines.length && !live) talk($('final-puppet'), lines[lineIdx]); });

  function lineRead() {
    M.sounds.match();
    lineIdx++;
    setTimeout(renderLine, 300);
  }

  // Microphone: voice meter + recording (same tested logic as Contes en veu alta)
  let stream = null, actx = null, analyser = null, recorder = null, live = false, raf = 0, meterProgress = () => 0;
  async function ensureMic() {
    if (stream) return true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: true } });
      const AC = window.AudioContext || window.webkitAudioContext;
      actx = new AC();
      if (actx.state === 'suspended') await actx.resume();
      analyser = actx.createAnalyser();
      analyser.fftSize = 1024;
      actx.createMediaStreamSource(stream).connect(analyser);
      return true;
    } catch (e) { return false; }
  }
  function releaseMic() {
    stopListening(false);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (actx) actx.close();
    stream = actx = analyser = null;
  }
  const words = (html) => plain(html).split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;

  async function startListening() {
    if (!(await ensureMic())) { micMode = 'none'; renderLine(); return; }
    micMode = 'ok';
    live = true;
    const at = lineIdx;
    const needed = Math.max(1800, words(lines[at]) * MS_PER_WORD);
    if (window.MediaRecorder) {
      try {
        const rec = recorder = new MediaRecorder(stream);
        const parts = [];
        rec.ondataavailable = (e) => { if (e.data.size) parts.push(e.data); };
        rec.onstop = () => {
          if (!parts.length) return;
          recordings[at] = URL.createObjectURL(new Blob(parts, { type: rec.mimeType || parts[0].type || 'audio/webm' }));
        };
        rec.start();
      } catch (e) { recorder = null; }
    }
    $('mic').classList.add('live');
    $('mic-label').textContent = M.t(TEXT.listening);
    $('meter').hidden = false;
    $('mic-note').hidden = true;
    const buf = new Float32Array(analyser.fftSize);
    const t0 = performance.now();
    let last = t0, floor = Infinity, threshold = 0.02, voiced = 0, lastVoice = 0, fullAt = 0, amp = 0;
    (function tick(now) {
      if (!live) return;
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);
      const dt = now - last;
      last = now;
      if (rms < floor) { floor = rms; threshold = Math.min(0.06, Math.max(0.012, floor * 3 + 0.008)); }
      if (rms > threshold) lastVoice = now;
      if (now - lastVoice < 200) voiced += dt;
      const talkNow = now - lastVoice < 120 ? Math.min(1, rms * 8) : 0;
      amp += (talkNow * 0.5 - amp) * 0.25;
      setJaw($('final-puppet'), talkNow);           // the puppet mouths along
      move($('final-puppet'), amp, now);             // ...and wiggles a little
      const progress = Math.min(1, voiced / needed);
      $('meter-fill').style.width = (progress * 100).toFixed(1) + '%';
      if (progress >= 1 && !fullAt) fullAt = now;
      if (fullAt && (now - lastVoice > 900 || now - fullAt > 5000)) { stopListening(true); return; }
      if (now - t0 > 120000) { stopListening(false); return; }
      raf = requestAnimationFrame(tick);
    })(t0);
    meterProgress = () => voiced / needed;
  }
  function stopListening(done) {
    if (!live) return;
    live = false;
    cancelAnimationFrame(raf);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    recorder = null;
    $('mic').classList.remove('live');
    setJaw($('final-puppet'), 0);
    move($('final-puppet'), 0, 0);
    if (done) lineRead(); else renderLine();
  }
  $('mic').addEventListener('click', () => {
    if (micMode === 'none') { lineRead(); return; }
    if (!live) { M.sounds.pop(); startListening(); return; }
    if (meterProgress() >= 0.8) { stopListening(true); return; }
    stopListening(false);
    M.sounds.miss();
    $('mic-note').textContent = M.t(TEXT.more);
    $('mic-note').hidden = false;
  });

  // Playback: curtains open, her recordings play in a squeaky "puppet voice",
  // the puppet bounces / sways / waves to her voice, and the show ends with a surprise.
  let playing = false;
  async function watchShow() {
    if (playing) return;
    playing = true;
    $('watch').hidden = true;
    releaseMic();          // free the mic first so iOS plays through the speaker
    const stage = $('final-curtains'), el = $('final-puppet');
    el.innerHTML = A.puppetSVG(current.puppet);
    $('audience').classList.remove('cheer');
    stage.classList.add('closed');
    await wait(900);
    stage.classList.remove('closed');
    await wait(700);
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    if (ctx.state === 'suspended') await ctx.resume();
    for (let i = 0; i < lines.length; i++) {
      $('line').innerHTML = lines[i];
      $('line-sub').textContent = '';
      if (recordings[i]) await playWithLips(ctx, recordings[i], el);
      else await new Promise((r) => talk(el, lines[i], r));   // no recording → the puppet says it
      if (i < lines.length - 1) await danceMove(el);
    }
    ctx.close();
    $('line').innerHTML = '🎉';
    await bigFinish(el);
    $('audience').classList.add('cheer');
    throwFlowers();
    M.sounds.win();
    M.confetti();
    $('line').innerHTML = '👏👏👏';
    playing = false;
    setTimeout(finish, 2600);
  }

  // Voice-driven body motion: bounce, sway, squash and arms up.
  function move(el, amp, t) {
    const svg = el.querySelector('svg.puppet');
    if (!svg) return;
    svg.style.transform = amp > 0.02
      ? `translateY(${(-amp * 22).toFixed(1)}px) rotate(${(Math.sin(t / 160) * amp * 12).toFixed(1)}deg) scale(${(1 + amp * 0.1).toFixed(3)}, ${(1 - amp * 0.06).toFixed(3)})`
      : '';
    const l = svg.querySelector('.arm-l'), r = svg.querySelector('.arm-r');
    if (l) l.setAttribute('transform', `rotate(${(amp * 70 + Math.sin(t / 120) * amp * 20).toFixed(1)} 37 154)`);
    if (r) r.setAttribute('transform', `rotate(${(-amp * 70 - Math.cos(t / 120) * amp * 20).toFixed(1)} 163 154)`);
  }

  function playWithLips(ctx, url, el) {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      // squeaky puppet voice: faster + higher (pitch is not preserved)
      audio.preservesPitch = false;
      audio.webkitPreservesPitch = false;
      audio.mozPreservesPitch = false;
      audio.playbackRate = 1.3;
      const src = ctx.createMediaElementSource(audio);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      an.connect(ctx.destination);
      const buf = new Float32Array(an.fftSize);
      let raf2 = 0, amp = 0;
      const loop = (t) => {
        an.getFloatTimeDomainData(buf);
        let s = 0;
        for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
        const target = Math.min(1, Math.sqrt(s / buf.length) * 9);
        amp += (target - amp) * 0.35;                // smooth so it wobbles instead of jitters
        setJaw(el, target);
        move(el, amp, t || performance.now());
        raf2 = requestAnimationFrame(loop);
      };
      const end = () => { cancelAnimationFrame(raf2); setJaw(el, 0); move(el, 0, 0); resolve(); };
      audio.onended = end;
      audio.onerror = end;
      audio.play().then(() => loop()).catch(end);
    });
  }

  // A quick silly move between lines
  function danceMove(el) {
    const m = pick(['move-hop', 'move-wiggle', 'move-twirl', 'move-squash']);
    el.classList.add(m);
    M.sounds.boing();
    return wait(750).then(() => el.classList.remove(m));
  }

  // ---------- The big finish: a different funny ending each time ----------
  let lastEnding = '';
  function sayP(text) { return new Promise((r) => talk($('final-puppet'), text, r)); }
  async function bigFinish(el, force) {
    const p = current.puppet;
    const options = ['sneeze', 'spin', 'burp', 'jump'];
    if (p.hair !== 'none' || p.extra !== 'none') options.push('bow', 'bow');
    let ending;
    do { ending = force || pick(options); } while (!force && ending === lastEnding && options.length > 1);
    lastEnding = ending;
    window.__lastEnding = ending; // for automated testing

    if (ending === 'bow') {
      await sayP('Thank you, thank you!');
      el.classList.add('end-bow');
      M.sounds.boing();
      await wait(1300);
      await sayP('Oops!');
      await wait(400);
    } else if (ending === 'sneeze') {
      el.classList.add('end-sneeze-build');
      await sayP('Aaah... aaah...');
      el.classList.remove('end-sneeze-build');
      el.classList.add('end-sneeze');
      M.sounds.sneeze();
      M.confetti();
      await sayP('ACHOO!');
      await wait(700);
      await sayP('Excuse me!');
    } else if (ending === 'spin') {
      el.classList.add('end-spin');
      M.sounds.giggle();
      await wait(1500);
      el.classList.remove('end-spin');
      el.innerHTML = A.puppetSVG(p, 'dizzy');
      el.classList.add('end-dizzy');
      await sayP("Wheee! I'm so dizzy!");
      await wait(600);
    } else if (ending === 'burp') {
      el.classList.add('end-burp');
      setJaw(el, 1);
      M.sounds.raspberry();
      puff(el);
      await wait(900);
      setJaw(el, 0);
      await sayP('Oh! Excuse me!');
      await wait(300);
    } else {
      el.classList.add('end-jump');
      M.sounds.boing();
      await wait(1700);
      await sayP('Ta-da!');
    }
    await wait(300);
    ['end-bow', 'end-sneeze', 'end-dizzy', 'end-burp', 'end-jump'].forEach((c) => el.classList.remove(c));
  }
  window.__bigFinish = (name) => { lastEnding = ''; return bigFinish($('final-puppet'), name); }; // for testing
  function puff(el) {
    const f = document.createElement('span');
    f.className = 'puff';
    f.textContent = '💨';
    el.appendChild(f);
    setTimeout(() => f.remove(), 1400);
  }
  function throwFlowers() {
    const stage = $('final-curtains');
    for (let i = 0; i < 9; i++) {
      const f = document.createElement('span');
      f.className = 'flower';
      f.textContent = pick(['🌹', '💐', '🌸', '⭐', '🌷']);
      f.style.left = 10 + Math.random() * 80 + '%';
      f.style.animationDelay = (Math.random() * 0.8).toFixed(2) + 's';
      stage.appendChild(f);
      setTimeout(() => f.remove(), 3200);
    }
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  $('watch').addEventListener('click', () => { M.sounds.pop(); watchShow(); });

  // ---------- End ----------
  let lastStars = 0;
  function finish() {
    lastStars = round.stars();
    if (lastStars === 3) {
      current.stickers = (current.stickers || 0) + 1;
      const i = profiles.findIndex((p) => p.id === current.id);
      if (i >= 0) { profiles[i] = current; save(profiles); }
    }
    $('win-text').textContent = 'Bravo! 👏';
    $('win-stars').innerHTML = M.starsHTML(lastStars);
    $('win-puppet').innerHTML = A.puppetSVG({ ...current.puppet, extra: lastStars === 3 ? 'crown' : current.puppet.extra }, 'happy');
    $('sticker').hidden = lastStars !== 3;
    $('sticker').textContent = '⭐ ' + M.t(TEXT.sticker);
    $('win').hidden = false;
  }
  $('replay-show').addEventListener('click', () => { M.sounds.pop(); $('win').hidden = true; watchShow(); });
  $('again').addEventListener('click', () => { M.sounds.pop(); startRound(); });
  $('to-wardrobe').addEventListener('click', () => { M.sounds.pop(); show('wardrobe'); renderWardrobe(); });

  // ---------- Language & start ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    if (screen === 'wardrobe') renderWardrobe();
    if (screen === 'build') $('build-label').textContent = M.t(TEXT.build);
    if (screen === 'about') $('about-sub').textContent = M.t(ABOUT[aboutIdx].sub);
    if (screen === 'finale') renderLine();
    if (!$('win').hidden) $('sticker').textContent = '⭐ ' + M.t(TEXT.sticker);
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  show('wardrobe');
  renderText();
})();
