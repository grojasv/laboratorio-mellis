(function () {
  const M = window.Mellis;
  const L = (ca, es, en) => ({ ca, es, en });
  const STORIES = window.RADIO_STORIES;
  const FAMILY_KEY = 'mellis.passport.family';     // shared with the passport, so member ids match
  const PENDING_KEY = 'mellis.passport.pending';   // a book for the passport to pre-fill
  const MAX_SHOWS = 5;
  const RATE = 22050;                              // final show: mono, 22 kHz WAV (plays everywhere)
  // No hearts here: reading aloud is creative, there are no wrong answers.

  const TEXT = {
    title: L('Ràdio Mellis', 'Radio Mellis', 'Radio Mellis'),
    pick: L('Tria una història!', '¡Elige una historia!', 'Pick a story!'),
    mine: L('Les nostres emissions', 'Nuestras emisiones', 'Our shows'),
    who: L('Qui llegeix?', '¿Quién lee?', "Who's reading?"),
    roles: L('Repartim els papers!', '¡Repartimos los papeles!', "Let's hand out the parts!"),
    spin: L('Gira!', '¡Gira!', 'Spin!'),
    start: L('Som-hi!', '¡Vamos!', "Let's go!"),
    yourTurn: { ca: (n) => `${n}, et toca!`, es: (n) => `¡${n}, te toca!`, en: (n) => `${n}, your turn!` },
    hold: L('Mantén premut i llegeix', 'Mantén pulsado y lee', 'Hold and read'),
    holdMore: L('Mantén premut mentre llegeixes!', '¡Mantén pulsado mientras lees!', 'Keep holding while you read!'),
    recording: L('Gravant...', 'Grabando...', 'Recording...'),
    noMic: L('Sense micròfon: llegiu en veu alta i el telèfon farà les veus al final.', 'Sin micrófono: leed en voz alta y el teléfono hará las voces al final.', 'No microphone: read aloud and the phone will do the voices at the end.'),
    next: L('Següent', 'Siguiente', 'Next'),
    making: L("Preparant l'emissió...", 'Preparando la emisión...', 'Getting the show ready...'),
    onAir: L('EN DIRECTE', 'EN DIRECTO', 'ON AIR'),
    done: L('Fi de l\'emissió!', '¡Fin de la emisión!', "That's the show!"),
    share: L('Compartir', 'Compartir', 'Share'),
    passport: L('Al passaport', 'Al pasaporte', 'To the passport'),
    again: L('Una altra', 'Otra', 'Another'),
    empty: L('Encara no heu gravat cap emissió.', 'Todavía no habéis grabado ninguna emisión.', "You haven't recorded a show yet."),
    reader: L('Lector', 'Lector', 'Reader'),
    cast: L('Repartiment', 'Reparto', 'Starring'),
  };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const say = (t, o) => M.speak(t.replace(/[¡!¿«»]/g, ''), M.lang, o);
  function family() {
    let f = null;
    try { f = JSON.parse(localStorage.getItem(FAMILY_KEY)); } catch (e) { /* ignore */ }
    return f && f.length ? f : [{ id: 'm1', e: '👧', name: '' }, { id: 'm2', e: '👧🏻', name: '' }, { id: 'm3', e: '👩', name: '' }, { id: 'm4', e: '👨', name: '' }];
  }
  const memberName = (m) => m.name || m.e;
  const memberLabel = (m) => (m.name ? `${m.e} ${m.name}` : m.e);
  const words = (t) => t.split(/\s+/).filter(Boolean).length;

  // ---------- Saved shows (IndexedDB: audio is too big for localStorage) ----------
  function db() {
    return new Promise((res, rej) => {
      if (!window.indexedDB) { rej(new Error('no idb')); return; }
      const r = indexedDB.open('mellis-radio', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('shows', { keyPath: 'id' });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function idb(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => {
      const tx = d.transaction('shows', mode);
      const out = fn(tx.objectStore('shows'));
      tx.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
      tx.onerror = () => rej(tx.error);
    });
  }
  const allShows = () => idb('readonly', (s) => s.getAll()).catch(() => []);
  async function saveShow(show) {
    try {
      await idb('readwrite', (s) => s.put(show));
      const list = (await allShows()).sort((a, b) => b.date.localeCompare(a.date));
      for (const old of list.slice(MAX_SHOWS)) await idb('readwrite', (s) => s.delete(old.id));
    } catch (e) { /* storage full or blocked: the show still plays now */ }
  }

  // ---------- Screens ----------
  const SCREENS = ['home', 'who', 'roles', 'read', 'show'];
  function show(name) {
    SCREENS.forEach((s) => { $(s).hidden = s !== name; });
    window.scrollTo(0, 0);
  }

  // ---------- Home: stories + our shows ----------
  let story = null, readers = [], parts = {}, takes = [], idx = 0, saved = [];
  async function renderHome() {
    $('pick').textContent = M.t(TEXT.pick);
    $('mine-title').textContent = M.t(TEXT.mine);
    $('stories').innerHTML = STORIES.map((s) => {
      const w = s.lines.reduce((n, x) => n + words(x.t[M.lang]), 0);
      return `<button class="story" data-id="${s.id}" style="--c:${s.color}">
        <span class="s-emoji">${s.emoji}</span>
        <span class="s-text"><b>${M.t(s.title)}</b><small>${M.t(s.blurb)}</small>
        <span class="s-cast">${s.cast.map((c) => c.e).join('')} · ⏱️ ${Math.round(w / 75)}′</span></span></button>`;
    }).join('');
    saved = (await allShows()).sort((a, b) => b.date.localeCompare(a.date));
    $('mine').innerHTML = saved.length ? saved.map((sh) => {
      const s = STORIES.find((x) => x.id === sh.storyId);
      const fam = family();
      const who = sh.readers.map((id) => (fam.find((m) => m.id === id) || {}).e || '🙂').join('');
      return s ? `<button class="saved" data-id="${sh.id}"><span class="s-emoji small">${s.emoji}</span><span><b>${M.t(s.title)}</b><small>${new Date(sh.date).toLocaleDateString()} · ${who}</small></span><span class="play">▶️</span></button>` : '';
    }).join('') : `<p class="empty">${M.t(TEXT.empty)}</p>`;
  }
  $('stories').addEventListener('click', (e) => {
    const b = e.target.closest('.story');
    if (!b) return;
    M.sounds.pop();
    story = STORIES.find((s) => s.id === b.dataset.id);
    readers = [];
    show('who');
    renderWho();
    say(M.t(TEXT.who));
  });
  $('mine').addEventListener('click', async (e) => {
    const b = e.target.closest('.saved');
    if (!b) return;
    M.sounds.pop();
    const sh = saved.find((x) => x.id === b.dataset.id);
    story = STORIES.find((s) => s.id === sh.storyId);
    readers = sh.readers;
    parts = sh.parts;
    takes = sh.takes;
    lastShowLang = sh.lang;
    await playShow(false);
  });

  // ---------- Who's reading? (1 … cast size) ----------
  function renderWho() {
    $('who-ask').textContent = M.t(TEXT.who);
    $('who-story').textContent = `${story.emoji} ${M.t(story.title)}`;
    $('members').innerHTML = family().map((m) =>
      `<button class="member${readers.includes(m.id) ? ' on' : ''}" data-m="${m.id}"><span class="m-e">${m.e}</span><span>${esc(m.name)}</span></button>`).join('');
    $('who-max').textContent = `👥 ${readers.length} / ${story.cast.length}`;
    $('who-next').disabled = !readers.length;
  }
  $('members').addEventListener('click', (e) => {
    const b = e.target.closest('.member');
    if (!b) return;
    const id = b.dataset.m;
    if (readers.includes(id)) readers = readers.filter((x) => x !== id);
    else if (readers.length < story.cast.length) readers.push(id);
    else { M.sounds.boing(); return; }
    M.sounds.pop();
    renderWho();
  });
  $('who-next').addEventListener('click', () => {
    if (!readers.length) return;
    M.sounds.pop();
    assignParts();
    show('roles');
    renderRoles(0);
    say(M.t(TEXT.roles));
  });
  $('who-back').addEventListener('click', () => { M.sounds.pop(); show('home'); renderHome(); });

  // ---------- Roles: fair by words (the narrator has the most), shown with a roulette ----------
  function assignParts() {
    const wordsOf = (c) => story.lines.filter((x) => x.who === c.id).reduce((n, x) => n + words(x.t[M.lang]), 0);
    const load = {};
    readers.forEach((r) => { load[r] = 0; });
    parts = {};
    const order = readers.slice().sort(() => Math.random() - 0.5);
    const cast = story.cast.slice().sort((a, b) => wordsOf(b) - wordsOf(a));
    cast.forEach((c, i) => {
      // with as many readers as characters, one each; otherwise the reader with the fewest words so far
      const r = i < order.length ? order[i] : Object.keys(load).sort((a, b) => load[a] - load[b])[0];
      parts[c.id] = r;
      load[r] += wordsOf(c);
    });
  }
  let rolling = false, revealed = 0;
  function renderRoles(n) {
    revealed = n;
    const fam = family();
    $('roles-ask').textContent = M.t(TEXT.roles);
    $('cast').innerHTML = story.cast.map((c, i) => {
      const m = fam.find((x) => x.id === parts[c.id]);
      return `<div class="role${i < n ? ' set' : ''}" style="--c:${c.color}"><span class="r-char">${c.e}</span><span class="r-name">${M.t(c.name)}</span>
        <span class="r-who" id="rw-${i}">${i < n ? `${m.e} ${esc(m.name)}` : '❔'}</span></div>`;
    }).join('');
    $('spin').hidden = n >= story.cast.length;
    $('spin').textContent = '🎡 ' + M.t(TEXT.spin);
    $('roles-go').hidden = n < story.cast.length;
    $('roles-go').textContent = '🎙️ ' + M.t(TEXT.start);
  }
  // the reader faces flicker like a roulette, slowing down, then land on the chosen one
  async function spinOne() {
    if (rolling) return;
    rolling = true;
    const i = revealed;
    const fam = family().filter((m) => readers.includes(m.id));
    const el = $('rw-' + i);
    el.parentElement.classList.add('spinning');
    let delay = 60;
    for (let k = 0; k < 14; k++) {
      const m = fam[k % fam.length];
      el.textContent = m.e;
      M.sounds.flip();
      await wait(delay);
      delay *= 1.18;
    }
    M.sounds.match();
    rolling = false;
    renderRoles(i + 1);
    const c = story.cast[i];
    const m = family().find((x) => x.id === parts[c.id]);
    say(`${M.t(c.name)}: ${memberName(m)}`);
  }
  $('spin').addEventListener('click', spinOne);
  $('roles-go').addEventListener('click', async () => {
    M.sounds.pop();
    takes = [];
    idx = 0;
    await openMic();
    show('read');
    renderLine();
  });

  // ---------- Reading: hold the 🎙️ while reading each line ----------
  let stream = null, actx = null, analyser = null, recorder = null, chunks = [], holdStart = 0, holding = false, raf = 0;
  async function openMic() {
    if (stream || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) return !!stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: true } });
      const AC = window.AudioContext || window.webkitAudioContext;
      actx = new AC();
      analyser = actx.createAnalyser();
      analyser.fftSize = 512;
      actx.createMediaStreamSource(stream).connect(analyser);
      return true;
    } catch (e) { stream = null; return false; }
  }
  function closeMic() {
    if (stream) stream.getTracks().forEach((t) => t.stop());   // so iOS plays the show through the speaker
    if (actx) actx.close();
    stream = actx = analyser = null;
  }

  let lastReader = null;
  function renderLine() {
    const line = story.lines[idx];
    const c = story.cast.find((x) => x.id === line.who);
    const m = family().find((x) => x.id === parts[c.id]);
    $('bar').style.width = `${(idx / story.lines.length) * 100}%`;
    $('l-count').textContent = `${idx + 1}/${story.lines.length}`;
    $('l-card').style.setProperty('--c', c.color);
    $('l-char').textContent = c.e;
    $('l-name').textContent = M.t(c.name);
    $('l-who').textContent = TEXT.yourTurn[M.lang](memberLabel(m));
    $('l-text').textContent = line.t[M.lang];
    $('l-back').disabled = idx === 0;
    $('l-tip').textContent = stream ? M.t(TEXT.hold) : M.t(TEXT.noMic);
    $('mic').hidden = !stream;
    $('l-next').hidden = !!stream;
    $('l-next').textContent = '➡️ ' + M.t(TEXT.next);
    $('l-done').hidden = !takes[idx];
    $('l-card').classList.remove('new'); void $('l-card').offsetWidth; $('l-card').classList.add('new');
    if (m.id !== lastReader) { $('l-who').classList.remove('flash'); void $('l-who').offsetWidth; $('l-who').classList.add('flash'); M.sounds.ding && M.sounds.ding(); }
    lastReader = m.id;
    if (line.sfx) sfxLive(line.sfx);
  }

  const mic = $('mic');
  mic.addEventListener('contextmenu', (e) => e.preventDefault());
  mic.addEventListener('pointerdown', (e) => {
    if (!stream || holding) return;
    e.preventDefault();
    try { mic.setPointerCapture(e.pointerId); } catch (err) { /* not a real pointer */ }
    if (window.speechSynthesis) speechSynthesis.cancel();
    holding = true;
    holdStart = performance.now();
    chunks = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (ev) => { if (ev.data && ev.data.size) chunks.push(ev.data); };
    recorder.start();
    mic.classList.add('rec');
    $('l-tip').textContent = '🔴 ' + M.t(TEXT.recording);
    const buf = new Float32Array(analyser.fftSize);
    const loop = () => {
      analyser.getFloatTimeDomainData(buf);
      let s = 0;
      for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
      mic.style.setProperty('--lvl', Math.min(1, Math.sqrt(s / buf.length) * 8).toFixed(2));
      raf = requestAnimationFrame(loop);
    };
    loop();
  });
  const release = async () => {
    if (!holding) return;
    holding = false;
    cancelAnimationFrame(raf);
    mic.classList.remove('rec');
    mic.style.setProperty('--lvl', 0);
    const held = performance.now() - holdStart;
    const rec = recorder;
    await wait(200);                         // don't cut the last word
    const blob = await new Promise((res) => {
      rec.onstop = () => res(new Blob(chunks, { type: rec.mimeType || (chunks[0] && chunks[0].type) || 'audio/webm' }));
      rec.stop();
    });
    if (held < 400) {                        // a tap, not a hold
      $('l-tip').textContent = '✋ ' + M.t(TEXT.holdMore);
      M.sounds.boing();
      return;
    }
    takes[idx] = blob;
    M.sounds.pop();
    nextLine();
  };
  mic.addEventListener('pointerup', release);
  mic.addEventListener('pointercancel', release);
  $('l-next').addEventListener('click', () => { M.sounds.pop(); nextLine(); });
  $('l-back').addEventListener('click', () => { if (idx > 0) { M.sounds.pop(); idx--; renderLine(); } });
  function nextLine() {
    idx++;
    if (idx < story.lines.length) { renderLine(); return; }
    closeMic();
    lastShowLang = M.lang;
    playShow(true);
  }

  // ---------- Sound effects (live while reading, and inside the final show) ----------
  // Each effect is drawn onto any AudioContext (live or offline) at time t.
  function sfx(ctx, name, t, out) {
    const tone = (f, s, d, type, vol, to) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(f, t + s);
      if (to) o.frequency.exponentialRampToValueAtTime(to, t + s + d);
      g.gain.setValueAtTime(0.0001, t + s);
      g.gain.exponentialRampToValueAtTime(vol || 0.3, t + s + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + s + d);
      o.connect(g).connect(out);
      o.start(t + s); o.stop(t + s + d + 0.05);
    };
    const noise = (s, d, f, vol) => {
      const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * d), ctx.sampleRate);
      const ch = b.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
      const src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = b; fl.type = 'bandpass'; fl.frequency.value = f; g.gain.value = vol;
      src.connect(fl).connect(g).connect(out);
      src.start(t + s);
    };
    ({
      knock: () => [0, 0.22, 0.44].forEach((s) => tone(130, s, 0.12, 'triangle', 0.6, 70)),
      door: () => tone(220, 0, 0.9, 'sawtooth', 0.12, 120),
      bubble: () => [0, 0.15, 0.3, 0.42].forEach((s, i) => tone(300 + i * 90, s, 0.12, 'sine', 0.3, 700 + i * 90)),
      tada: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, i === 3 ? 0.6 : 0.2, 'triangle', 0.3)),
      whoosh: () => noise(0, 0.6, 900, 0.8),
      ding: () => tone(1320, 0, 0.8, 'sine', 0.3),
      boing: () => tone(180, 0, 0.45, 'sine', 0.4, 520),
      magic: () => [880, 1175, 1568, 2093, 1568].forEach((f, i) => tone(f, i * 0.08, 0.25, 'sine', 0.18)),
      splash: () => noise(0, 0.7, 2500, 0.9),
      roar: () => tone(110, 0, 0.9, 'sawtooth', 0.25, 60),
      alarm: () => [0, 0.3, 0.6].forEach((s) => tone(880, s, 0.22, 'square', 0.12, 660)),
      jingle: () => [392, 523, 659, 784, 659, 784].forEach((f, i) => tone(f, i * 0.14, 0.22, 'triangle', 0.22)),
      // the sign-off: the opening jingle walking back down, ending on a long low note
      outro: () => [784, 659, 784, 659, 523, 392].forEach((f, i) => tone(f, i * 0.16, i === 5 ? 0.9 : 0.22, 'triangle', 0.22)),
    }[name] || (() => {}))();
  }
  const SFX_LEN = { knock: 0.7, door: 1, bubble: 0.6, tada: 1, whoosh: 0.6, ding: 0.8, boing: 0.5, magic: 0.7, splash: 0.7, roar: 1, alarm: 0.9, jingle: 1.1, outro: 1.8 };
  let liveCtx = null;
  function sfxLive(name) {
    if (M.isMuted()) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!liveCtx) liveCtx = new AC();
    if (liveCtx.state === 'suspended') liveCtx.resume();
    sfx(liveCtx, name, liveCtx.currentTime + 0.05, liveCtx.destination);
  }

  // ---------- The show: decode the takes, add the silly voices, render one WAV ----------
  // the silly voices: squeaky ones (faster + higher) and robots (ring modulation), in a few flavours
  const FX = {
    normal: { rate: 1 },
    squeak: { rate: 1.38 },
    squeakHi: { rate: 1.6 },
    squeakLo: { rate: 1.22 },
    robot: { rate: 1, ring: 45 },
    robotFast: { rate: 1.15, ring: 70 },
    robotSqueak: { rate: 1.3, ring: 55 },
  };
  const fxOf = (c) => FX[c.fx] || FX.normal;
  let lastShowLang = 'ca', wavBlob = null, timeline = [], audioEl = null, timer = 0;
  async function decodeAll() {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const out = [];
    for (let i = 0; i < story.lines.length; i++) {
      out[i] = null;
      if (!takes[i]) continue;
      try { out[i] = trim(ctx, await ctx.decodeAudioData(await takes[i].arrayBuffer())); } catch (e) { /* skip a broken take */ }
      $('make-bar').style.width = `${(i / story.lines.length) * 60}%`;
    }
    ctx.close();
    return out;
  }
  // cut the silence before and after the voice (the hold starts before reading and ends after it)
  function trim(ctx, b) {
    const d = b.getChannelData(0), pad = Math.round(b.sampleRate * 0.08);
    const peak = d.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
    const th = Math.max(0.015, peak * 0.12);
    let a = 0, z = d.length - 1;
    while (a < d.length && Math.abs(d[a]) < th) a++;
    while (z > a && Math.abs(d[z]) < th) z--;
    a = Math.max(0, a - pad);
    z = Math.min(d.length, z + pad);
    if (z - a < b.sampleRate * 0.2) return b;     // nothing loud enough: keep it as it is
    const out = ctx.createBuffer(1, z - a, b.sampleRate);
    out.copyToChannel(d.subarray(a, z), 0);
    return out;
  }
  async function render(buffers) {
    const GAP = 0.25;
    timeline = [];
    let t = 1.3;                                       // after the jingle
    story.lines.forEach((line, i) => {
      if (line.sfx) t += SFX_LEN[line.sfx] || 0.6;
      const b = buffers[i];
      const c = story.cast.find((x) => x.id === line.who);
      const dur = b ? b.duration / fxOf(c).rate : 0;
      timeline.push({ i, at: t, sfxAt: line.sfx ? t - (SFX_LEN[line.sfx] || 0.6) : null, dur });
      t += dur + (b ? GAP : 0);
    });
    const outroAt = t + 0.3;
    const total = outroAt + SFX_LEN.outro + 0.3;
    const ctx = new OfflineAudioContext(1, Math.ceil(total * RATE), RATE);
    const master = ctx.createDynamicsCompressor();
    master.connect(ctx.destination);
    sfx(ctx, 'jingle', 0.1, master);
    timeline.forEach((ev) => {
      const line = story.lines[ev.i];
      if (ev.sfxAt != null) sfx(ctx, line.sfx, ev.sfxAt, master);
      const b = buffers[ev.i];
      if (!b) return;
      const c = story.cast.find((x) => x.id === line.who);
      const src = ctx.createBufferSource();
      src.buffer = b;
      src.playbackRate.value = fxOf(c).rate;
      const g = ctx.createGain();
      g.gain.value = 1.2;
      src.connect(g);
      if (fxOf(c).ring) {                              // ring modulation: a buzzy robot voice
        const ring = ctx.createGain();
        ring.gain.value = 0;
        const osc = ctx.createOscillator();
        osc.frequency.value = fxOf(c).ring;
        osc.connect(ring.gain);
        osc.start(ev.at); osc.stop(ev.at + ev.dur + 0.1);
        g.connect(ring).connect(master);
      } else g.connect(master);
      src.start(ev.at);
    });
    sfx(ctx, 'outro', outroAt, master);
    $('make-bar').style.width = '80%';
    return ctx.startRendering();
  }
  function wav(buffer) {
    const data = buffer.getChannelData(0);
    const len = data.length;
    const out = new DataView(new ArrayBuffer(44 + len * 2));
    const str = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); out.setUint32(4, 36 + len * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
    out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true);
    out.setUint32(24, buffer.sampleRate, true); out.setUint32(28, buffer.sampleRate * 2, true);
    out.setUint16(32, 2, true); out.setUint16(34, 16, true); str(36, 'data'); out.setUint32(40, len * 2, true);
    for (let i = 0; i < len; i++) out.setInt16(44 + i * 2, Math.max(-1, Math.min(1, data[i])) * 0x7fff, true);
    return new Blob([out], { type: 'audio/wav' });
  }

  async function playShow(isNew) {
    show('show');
    $('on-air').textContent = M.t(TEXT.onAir);
    $('show-title').textContent = `${story.emoji} ${M.t(story.title)}`;
    $('show-end').hidden = true;
    $('show-ctrl').hidden = true;
    const recorded = takes.some(Boolean);
    if (!recorded) { speakShow(); return; }
    $('making').hidden = false;
    $('making-text').textContent = M.t(TEXT.making);
    $('make-bar').style.width = '0%';
    const buffers = await decodeAll();
    const out = await render(buffers);
    wavBlob = wav(out);
    $('make-bar').style.width = '100%';
    $('making').hidden = true;
    if (isNew) saveShow({ id: 's' + Date.now(), date: new Date().toISOString(), storyId: story.id, lang: lastShowLang, readers, parts, takes });
    $('share').disabled = false;
    playWav();
  }
  function playWav() {
    if (audioEl) { audioEl.pause(); URL.revokeObjectURL(audioEl.src); }
    audioEl = new Audio(URL.createObjectURL(wavBlob));
    $('show-ctrl').hidden = false;
    $('stage').hidden = false;
    $('credits').hidden = true;
    $('pause').textContent = '⏸️';
    audioEl.onended = endShow;
    audioEl.play().catch(() => { $('pause').textContent = '▶️'; });
    clearInterval(timer);
    timer = setInterval(syncStage, 120);
    syncStage();
  }
  // show the character who is talking right now
  function syncStage() {
    if (!audioEl) return;
    const t = audioEl.currentTime;
    let cur = null;
    timeline.forEach((ev) => { if (ev.dur && t >= ev.at) cur = ev; });
    const line = cur && story.lines[cur.i];
    const c = line && story.cast.find((x) => x.id === line.who);
    $('stage-char').textContent = c ? c.e : '📻';
    const m = c && family().find((x) => x.id === parts[c.id]);
    $('stage-name').textContent = c ? `${M.t(c.name)}${m ? ' · ' + memberLabel(m) : ''}` : '';
    $('stage-text').textContent = line ? line.t[lastShowLang] : '';
    $('stage').style.setProperty('--c', c ? c.color : '#3a3a5c');
    $('stage-char').classList.toggle('talking', !!(cur && t < cur.at + cur.dur));
  }
  function endShow() {
    clearInterval(timer);
    $('stage-char').classList.remove('talking');
    $('show-ctrl').hidden = true;
    $('show-end').hidden = false;
    $('end-text').textContent = M.t(TEXT.done);
    $('share').textContent = '📤 ' + M.t(TEXT.share);
    $('to-passport').textContent = '🛂 ' + M.t(TEXT.passport);
    $('again').textContent = '🔁 ' + M.t(TEXT.again);
    rollCredits();
    M.confetti();
  }
  // movie-style credits: the title, who played each character, and the radio's name, sliding up
  function rollCredits() {
    $('stage').hidden = true;
    $('credits').hidden = false;
    const cast = story.cast.map((c) => {
      const m = family().find((x) => x.id === parts[c.id]);
      return `<p class="cr-line"><span class="cr-e">${c.e}</span><b style="color:${c.color}">${esc(M.t(c.name))}</b>${m ? `<span>${esc(memberLabel(m))}</span>` : ''}</p>`;
    }).join('');
    $('credits-roll').innerHTML = `<p class="cr-title">${story.emoji} ${esc(M.t(story.title))}</p>`
      + `<p class="cr-head">🎭 ${M.t(TEXT.cast)}</p>${cast}<p class="cr-radio">📻 ${M.t(TEXT.title)}</p>`;
    const view = $('credits').clientHeight, h = $('credits-roll').offsetHeight;
    const end = Math.min(0, view - h - 12);           // stop when the last line is in view
    $('credits-roll').animate([{ transform: `translateY(${view}px)` }, { transform: `translateY(${end}px)` }],
      { duration: Math.max(3000, (view - end) * 18), easing: 'ease-out', fill: 'forwards' });
  }
  $('pause').addEventListener('click', () => {
    if (!audioEl) return;
    if (audioEl.paused) { audioEl.play(); $('pause').textContent = '⏸️'; } else { audioEl.pause(); $('pause').textContent = '▶️'; }
  });
  $('stop').addEventListener('click', () => { if (audioEl) { audioEl.pause(); endShow(); } });
  $('replay').addEventListener('click', () => { M.sounds.pop(); $('show-end').hidden = true; playWav(); });

  // no microphone: the phone reads every line with a different pitch per character
  const FX_PITCH = { normal: 1, squeak: 1.7, squeakHi: 2, squeakLo: 1.4, robot: 0.8, robotFast: 1.1, robotSqueak: 1.5 };
  async function speakShow() {
    $('making').hidden = true;
    $('share').disabled = true;
    for (let i = 0; i < story.lines.length; i++) {
      const line = story.lines[i];
      const c = story.cast.find((x) => x.id === line.who);
      $('stage-char').textContent = c.e;
      $('stage-name').textContent = M.t(c.name);
      $('stage-text').textContent = line.t[M.lang];
      $('stage').style.setProperty('--c', c.color);
      if (line.sfx) { sfxLive(line.sfx); await wait(600); }
      await new Promise((r) => say(line.t[M.lang], { pitch: FX_PITCH[c.fx] || 1, rate: 1.1, onend: r }));
      if ($('show').hidden) return;
    }
    sfxLive('outro');
    endShow();
  }

  // ---------- Share the show / send the book to the passport ----------
  $('share').addEventListener('click', async () => {
    if (!wavBlob) return;
    M.sounds.pop();
    const name = `radio-mellis-${story.id}.wav`;
    const file = new File([wavBlob], name, { type: 'audio/wav' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `📻 ${M.t(story.title)}` });
        return;
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(wavBlob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  });
  $('to-passport').addEventListener('click', () => {
    M.sounds.pop();
    const r = {};
    readers.forEach((id) => { r[id] = 2; });
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify({ title: M.t(story.title), emoji: story.emoji, color: story.color, lang: lastShowLang, readers: r }));
    } catch (e) { /* ignore */ }
    if (audioEl) audioEl.pause();
    location.href = '../passport/index.html';
  });
  $('again').addEventListener('click', () => { M.sounds.pop(); if (audioEl) audioEl.pause(); show('home'); renderHome(); });

  // ---------- Wiring ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    if (!$('home').hidden) renderHome();
    if (!$('who').hidden) renderWho();
    if (!$('roles').hidden) renderRoles(revealed);
    if (!$('read').hidden) renderLine();
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  $('mascots').innerHTML = M.mascotsSVG('wave');
  show('home');
  renderText();
  window.__radio = () => ({ story, readers, parts, takes, idx, timeline, wavBlob }); // for automated testing
})();
