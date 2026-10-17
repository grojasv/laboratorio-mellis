(function () {
  const M = window.Mellis;
  const STORIES = window.MELLIS_STORIES;
  const DONE_KEY = 'mellis.reading.done';
  const GOLD_KEY = 'mellis.reading.gold';      // stories finished with ⭐⭐⭐
  const MS_PER_WORD = 300;   // voiced time needed per word (pauses don't count)
  const PATH_LEN = { short: 3, long: 5 };

  const TEXT = {
    title: { ca: 'Contes en veu alta', es: 'Cuentos en voz alta', en: 'Read-aloud Stories' },
    short: { ca: '📗 Contes curts', es: '📗 Cuentos cortos', en: '📗 Short stories' },
    long: { ca: '📘 Contes llargs', es: '📘 Cuentos largos', en: '📘 Long stories' },
    mic: { ca: 'Llegeix en veu alta!', es: '¡Lee en voz alta!', en: 'Read it out loud!' },
    listening: { ca: "T'escolto... toca quan acabis", es: 'Te escucho... toca al terminar', en: "I'm listening... tap when done" },
    more: { ca: 'Llegeix-ho tot en veu alta!', es: '¡Léelo todo en voz alta!', en: 'Read it all out loud!' },
    noMic: { ca: 'Ja ho he llegit en veu alta!', es: '¡Ya lo he leído en voz alta!', en: 'I read it out loud!' },
    noMicNote: { ca: 'Sense micròfon: llegeix-ho en veu alta igualment!', es: 'Sin micrófono: ¡léelo en voz alta igualmente!', en: 'No microphone: read it out loud anyway!' },
    great: { ca: 'Molt bé! 🎉', es: '¡Muy bien! 🎉', en: 'Great reading! 🎉' },
    listen: { ca: "Escolta't", es: 'Escúchate', en: 'Listen to yourself' },
    whatNow: { ca: 'Què passa ara?', es: '¿Qué pasa ahora?', en: 'What happens next?' },
    qHead: { ca: '🔎 Pregunta de detectiva', es: '🔎 Pregunta de detective', en: '🔎 Detective question' },
    win: { ca: 'Conte acabat! Un llibre nou!', es: '¡Cuento terminado! ¡Un libro nuevo!', en: 'Story finished! A new book!' },
    listenAll: { ca: 'Escolta tot el conte', es: 'Escucha todo el cuento', en: 'Listen to your whole story' },
  };

  const $ = (id) => document.getElementById(id);
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function doneList() {
    try { return JSON.parse(localStorage.getItem(DONE_KEY)) || []; } catch (e) { return []; }
  }
  function goldList() {
    try { return JSON.parse(localStorage.getItem(GOLD_KEY)) || []; } catch (e) { return []; }
  }
  function markGold(id) {
    const list = goldList();
    if (!list.includes(id)) list.push(id);
    try { localStorage.setItem(GOLD_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }
  function markDone(id) {
    const list = doneList();
    if (!list.includes(id)) list.push(id);
    try { localStorage.setItem(DONE_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  // ---------- State ----------
  let level = 'short';
  let story = null, nodeId = null, path = [], recordings = {}, quizOrder = [];
  let screen = 'shelf';

  function show(name) {
    screen = name;
    ['shelf', 'read', 'quiz'].forEach((s) => { $(s).hidden = s !== name; });
    $('win').hidden = true;
    if (name === 'shelf') releaseMic();
  }

  // ---------- Shelf ----------
  function bookHTML(s, done, gold) {
    return `<button class="book${gold ? ' golden' : ''}" data-id="${s.id}" style="background:${s.color}">
      <span class="b-icon">${s.icon}</span><span class="b-title">${M.t(s.title)}</span>
      ${done ? `<span class="b-done">${gold ? '🌟' : '⭐'}</span>` : ''}</button>`;
  }
  function renderShelf() {
    const done = doneList(), gold = goldList();
    $('tab-short').textContent = M.t(TEXT.short);
    $('tab-long').textContent = M.t(TEXT.long);
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t.dataset.level === level));
    $('books').innerHTML = STORIES.filter((s) => s.level === level)
      .map((s) => bookHTML(s, done.includes(s.id), gold.includes(s.id))).join('');
  }
  document.querySelector('.tabs').addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    M.sounds.pop();
    level = t.dataset.level;
    renderShelf();
  });
  $('books').addEventListener('click', (e) => {
    const b = e.target.closest('.book');
    if (!b) return;
    M.sounds.pop();
    startStory(STORIES.find((s) => s.id === b.dataset.id));
  });

  // ---------- Reading ----------
  function startStory(s) {
    story = s;
    Object.values(s.nodes).forEach((n) => { delete n.read; });
    path = [];
    Object.values(recordings).forEach((u) => URL.revokeObjectURL(u));
    recordings = {};
    goTo('start');
  }

  function goTo(id) {
    nodeId = id;
    path.push(id);
    show('read');
    renderNode();
    window.scrollTo(0, 0);
  }

  function choicesFor(node) {
    if (!node.choices) return null;
    return typeof node.choices === 'string' ? story.choiceSets[node.choices] : node.choices;
  }

  function renderNode() {
    const node = story.nodes[nodeId];
    const total = PATH_LEN[story.level];
    $('chapter').innerHTML = Array.from({ length: total }, (_, i) =>
      `<span class="${i < path.length - 1 ? 'done' : i === path.length - 1 ? 'now' : ''}"></span>`).join('');
    $('scene').textContent = node.scene;
    $('text').textContent = M.t(node.text);
    $('mic-label').textContent = M.t(live ? TEXT.listening : micMode === 'none' ? TEXT.noMic : TEXT.mic);
    $('mic-note').textContent = M.t(TEXT.noMicNote);
    $('great').textContent = M.t(TEXT.great);
    $('listen-label').textContent = M.t(TEXT.listen);
    $('what-now').textContent = M.t(TEXT.whatNow);
    const read = node.read;
    $('mic-panel').hidden = !!read;
    $('after').hidden = !read;
    if (!read && !live) resetMeter();
    $('listen').hidden = !recordings[nodeId];
    const choices = choicesFor(node);
    $('what-now').hidden = !choices;
    $('choices').innerHTML = choices
      ? choices.map((c) => `<button class="choice" data-to="${c.to}"><span class="c-icon">${c.icon}</span>${M.t(c.label)}</button>`).join('')
      : `<button class="choice single" data-to="${node.end ? '#quiz' : node.next}">➡️</button>`;
  }

  // Marks the current paragraph as read and shows what comes next.
  function paragraphRead() {
    story.nodes[nodeId].read = true;
    M.sounds.match();
    renderNode();
    $('after').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  $('choices').addEventListener('click', (e) => {
    const b = e.target.closest('.choice');
    if (!b) return;
    M.sounds.pop();
    if (b.dataset.to === '#quiz') startQuiz();
    else goTo(b.dataset.to);
  });

  // ---------- Microphone: voice meter + recording ----------
  let micMode = 'unknown';  // 'ok' | 'none'
  let stream = null, actx = null, analyser = null, recorder = null, chunks = [];
  let live = false, raf = 0;

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
    } catch (e) {
      return false;
    }
  }

  function releaseMic() {
    stopListening(false);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (actx) actx.close();
    stream = actx = analyser = null;
  }

  function resetMeter() {
    $('meter').hidden = true;
    $('meter-fill').style.width = '0%';
    $('mic').classList.remove('live');
    $('mic-note').hidden = micMode !== 'none';
  }

  function wordCount(text) { return text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length; }

  async function startListening() {
    const ok = await ensureMic();
    if (!ok) {
      micMode = 'none';
      $('mic-label').textContent = M.t(TEXT.noMic);
      $('mic-note').hidden = false;
      return;
    }
    micMode = 'ok';
    live = true;
    const id = nodeId;
    const needed = Math.max(4000, wordCount(M.t(story.nodes[id].text)) * MS_PER_WORD);

    chunks = [];
    if (window.MediaRecorder) {
      try {
        const rec = recorder = new MediaRecorder(stream);
        const parts = chunks;
        rec.ondataavailable = (e) => { if (e.data.size) parts.push(e.data); };
        rec.onstop = () => {
          if (!parts.length) return;
          if (recordings[id]) URL.revokeObjectURL(recordings[id]);
          recordings[id] = URL.createObjectURL(new Blob(parts, { type: rec.mimeType || parts[0].type || 'audio/webm' }));
          if (nodeId === id) $('listen').hidden = false;
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
    let last = t0, floor = Infinity, threshold = 0.02;
    let voiced = 0, lastVoice = 0, fullAt = 0;

    (function tick(now) {
      if (!live) return;
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const rms = Math.sqrt(sum / buf.length);
      const dt = now - last;
      last = now;
      // Background noise = the quietest moment so far (works even if she
      // starts reading straight away: there are tiny gaps between words).
      if (rms < floor) {
        floor = rms;
        threshold = Math.min(0.06, Math.max(0.012, floor * 3 + 0.008));
      }
      if (rms > threshold) lastVoice = now;
      if (now - lastVoice < 200) voiced += dt; // short gaps between syllables still count
      const progress = Math.min(1, voiced / needed);
      $('meter-fill').style.width = (progress * 100).toFixed(1) + '%';
      if (progress >= 1 && !fullAt) fullAt = now;
      // finished: meter full and she has stopped talking (or kept going a while)
      if (fullAt && (now - lastVoice > 1200 || now - fullAt > 6000)) { stopListening(true); return; }
      if (now - t0 > 180000) { stopListening(false); return; }
      raf = requestAnimationFrame(tick);
    })(t0);

    meterProgress = () => voiced / needed;
  }
  let meterProgress = () => 0;

  function stopListening(done) {
    if (!live) return;
    live = false;
    cancelAnimationFrame(raf);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    recorder = null;
    $('mic').classList.remove('live');
    $('mic-label').textContent = M.t(TEXT.mic);
    if (done) paragraphRead();
  }

  $('mic').addEventListener('click', () => {
    if (micMode === 'none') { paragraphRead(); return; }
    if (!live) { M.sounds.pop(); startListening(); return; }
    // tapped "done": accept if she read most of it, otherwise encourage
    if (meterProgress() >= 0.8) { stopListening(true); return; }
    stopListening(false);
    M.sounds.miss();
    $('mic-note').textContent = M.t(TEXT.more);
    $('mic-note').hidden = false;
    $('meter-fill').style.width = '0%';
  });

  // ---------- Playback ----------
  let player = null;
  function play(urls) {
    if (player) { player.pause(); player = null; }
    if (live) stopListening(false);
    const queue = urls.filter(Boolean);
    (function next() {
      const url = queue.shift();
      if (!url) return;
      player = new Audio(url);
      player.onended = next;
      player.play().catch(() => {});
    })();
  }
  $('listen').addEventListener('click', () => { M.sounds.pop(); play([recordings[nodeId]]); });
  $('listen-all').addEventListener('click', () => { M.sounds.pop(); play(path.map((id) => recordings[id])); });

  // ---------- Quiz & finish ----------
  // The Mellis rule: hearts on the question, "oh oh" + pause, 2nd miss shows the answer
  const round = M.round({ heartsEl: $('hearts'), onOut: () => startStory(story) });

  function startQuiz() {
    show('quiz');
    round.start();
    quizOrder = shuffle(story.question.options.map((o, i) => i));
    renderQuiz();
  }
  function renderQuiz() {
    $('q-head').textContent = M.t(TEXT.qHead);
    $('q').textContent = M.t(story.question.q);
    $('answers').innerHTML = quizOrder.map((i) =>
      `<button class="answer" data-i="${i}">${M.t(story.question.options[i])}</button>`).join('');
  }
  $('answers').addEventListener('click', (e) => {
    const b = e.target.closest('.answer');
    if (!b || round.busy || b.classList.contains('wrong')) return;
    if (b.dataset.i !== '0') {
      b.classList.add('wrong');
      round.wrong('quiz').then(({ reveal }) => {
        if (!reveal) return;
        document.querySelector('.answer[data-i="0"]').classList.add('reveal');
        setTimeout(finish, 1600);
      });
      return;
    }
    finish();
  });

  function finish() {
    markDone(story.id);
    const stars = round.stars();
    if (stars === 3) markGold(story.id);
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('win-text').textContent = M.t(TEXT.win);
    $('new-book').innerHTML = bookHTML(story, true, stars === 3);
    $('listen-all-label').textContent = M.t(TEXT.listenAll);
    $('listen-all').hidden = !path.some((id) => recordings[id]);
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
  }

  $('again').addEventListener('click', () => { M.sounds.pop(); startStory(story); });
  $('to-shelf').addEventListener('click', () => { M.sounds.pop(); show('shelf'); renderShelf(); });

  // ---------- Language & setup ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    renderShelf();
    if (screen === 'read' && story) renderNode();
    if (screen === 'quiz' && story) renderQuiz();
    if (!$('win').hidden) {
      $('win-text').textContent = M.t(TEXT.win);
      $('new-book').innerHTML = bookHTML(story, true, goldList().includes(story.id));
      $('listen-all-label').textContent = M.t(TEXT.listenAll);
    }
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  show('shelf');
  renderText();
})();
