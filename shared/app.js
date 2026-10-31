// Shared helpers for the hub and every game: language, sound, mascots.
// Classic script (no modules) so pages also work when opened straight from disk.
(function () {
  const VERSION = '1.28.1'; // bump on every release (shown in the hub footer), with CACHE in sw.js
  const LANGS = ['ca', 'es', 'en'];
  const LANG_KEY = 'mellis.lang';
  const MUTE_KEY = 'mellis.muted';

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode: ignore */ }
  }

  // ---------- Language ----------
  function guessLang() {
    const nav = (navigator.language || '').slice(0, 2);
    return LANGS.includes(nav) ? nav : 'ca';
  }
  let lang = LANGS.includes(load(LANG_KEY)) ? load(LANG_KEY) : guessLang();
  const langListeners = [];

  function setLang(next) {
    if (!LANGS.includes(next)) return;
    lang = next;
    save(LANG_KEY, next);
    document.documentElement.lang = next;
    langListeners.forEach((fn) => fn(next));
  }

  // t({ca:'…', es:'…', en:'…'}) -> string in the current language
  function t(texts) {
    return texts[lang] || texts.ca || texts.en;
  }

  // ---------- Sound (synthesized, no files) ----------
  let ctx = null;
  let muted = load(MUTE_KEY) === '1';

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  // iOS only allows audio after a user gesture
  window.addEventListener('pointerdown', audio, { once: true });

  function tone(freq, start, dur, type, vol, slideTo) {
    const ac = audio();
    if (!ac || muted) return;
    const t0 = ac.currentTime + start;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.25, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  const sounds = {
    pop() { tone(500, 0, 0.12, 'sine', 0.3, 900); },
    flip() { tone(700, 0, 0.08, 'triangle', 0.2, 1100); },
    boing() { tone(220, 0, 0.35, 'sine', 0.3, 520); },
    match() {
      [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.18, 'triangle', 0.25));
    },
    miss() { tone(330, 0, 0.25, 'sine', 0.18, 200); },
    giggle() { [880, 1047, 880, 1175, 988].forEach((f, i) => tone(f, i * 0.07, 0.07, 'sine', 0.2)); },
    ohoh() { tone(520, 0, 0.2, 'triangle', 0.25, 500); tone(380, 0.24, 0.35, 'triangle', 0.25, 330); },
    raspberry() { tone(140, 0, 0.45, 'sawtooth', 0.12, 90); },
    sneeze() { tone(600, 0, 0.25, 'sine', 0.12, 900); tone(1400, 0.3, 0.12, 'square', 0.1, 300); },
    cuckoo() { tone(784, 0, 0.22, 'triangle', 0.3); tone(622, 0.28, 0.34, 'triangle', 0.3); },
    tick() { tone(1900, 0, 0.03, 'square', 0.06); },
    win() {
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
        tone(f, i * 0.12, 0.22, 'square', 0.12));
    },
  };


  // ---------- Background music (synthesized loops, no files) ----------
  // M.music.play('spooky' | 'jazz' | 'clock' | 'potion' | 'winter' | 'spring' | 'summer' | 'autumn'); quiet, ducks while a voice speaks, own on/off (🎵).
  const MUSIC_KEY = 'mellis.music';
  const NOTE_IX = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  function freq(n) {
    const m = /^([A-G][b#]?)(\d)$/.exec(n);
    return 440 * Math.pow(2, (NOTE_IX[m[1]] + (+m[2] + 1) * 12 - 69) / 12);
  }
  // A track is [[note | chord[] | null, steps], …]; compiled into events per step.
  function compile(theme) {
    const events = [];
    let total = 0;
    theme.tracks.forEach(({ voice, seq, vol }) => {
      let at = 0;
      seq.forEach(([n, len]) => {
        if (n) (events[at] = events[at] || []).push({ voice, notes: [].concat(n).map(freq), len, vol });
        at += len;
      });
      total = Math.max(total, at);
    });
    return { ...theme, events, total };
  }
    const THEMES = {
    // Spooky music-box waltz in A minor (3/4, 6 eighth-steps per bar)
    spooky: {
      step: 60 / 100 / 2,
      tracks: [
        { voice: 'box', vol: 0.16, seq: [
          ['E5', 2], ['A5', 2], ['C6', 2], ['B5', 2], ['A5', 2], ['E5', 2],
          ['F5', 2], ['A5', 2], ['D6', 2], ['C6', 2], ['B5', 2], ['G#5', 2],
          ['A5', 2], ['C6', 2], ['E6', 2], ['F6', 2], ['E6', 1], ['D6', 1], ['C6', 2],
          ['B5', 2], ['G#5', 2], ['D6', 2], ['A5', 6],
          ['C6', 2], ['B5', 1], ['A5', 1], ['E5', 2], ['D6', 2], ['C6', 1], ['B5', 1], ['G5', 2],
          ['C6', 2], ['A5', 2], ['F5', 2], ['G#5', 3], ['A5', 1], ['B5', 2],
          ['A5', 2], ['D6', 2], ['F6', 2], ['E6', 2], ['C6', 2], ['A5', 2],
          ['B5', 2], ['D6', 2], ['G#5', 2], ['A5', 6],
        ] },
        { voice: 'pluck', vol: 0.2, seq: [
          'A2 A2 D3 E2 A2 F2 E2 A2 A2 G2 F2 E2 D3 A2 E2 A2'.split(' ').map((n) => [n, 6]),
        ].flat() },
        { voice: 'soft', vol: 0.06, seq: [
          ['C4', 'E4'], ['C4', 'E4'], ['D4', 'F4'], ['G#3', 'D4'], ['C4', 'E4'], ['A3', 'C4'], ['G#3', 'D4'], ['A3', 'C4'],
          ['C4', 'E4'], ['B3', 'D4'], ['A3', 'C4'], ['G#3', 'D4'], ['D4', 'F4'], ['C4', 'E4'], ['G#3', 'D4'], ['A3', 'C4'],
        ].flatMap((c) => [[null, 2], [c, 2], [c, 2]]) },
      ],
    },
    // Soft swing in F (4/4, triplet steps: 12 per bar, swung eighths on steps 0 and 2)
    jazz: {
      step: 60 / 104 / 3,
      tracks: [
        { voice: 'vibes', vol: 0.12, seq: [
          ['D5', 3], ['F5', 2], ['A5', 4], [null, 3],
          ['G5', 3], ['E5', 2], ['C5', 4], [null, 3],
          ['A5', 6], ['G5', 2], ['F5', 4],
          ['F#5', 3], ['A5', 2], ['C6', 4], [null, 3],
          ['Bb5', 3], ['A5', 2], ['G5', 2], ['F5', 2], ['D5', 3],
          ['E5', 3], ['G5', 2], ['Bb5', 4], [null, 3],
          ['A5', 9], [null, 3],
          [null, 6], ['C5', 2], ['D5', 2], ['F5', 2],
        ] },
        { voice: 'bass', vol: 0.22, seq: (
          'G2 A2 Bb2 B2 C3 Bb2 A2 G2 F2 A2 C3 C#3 D3 F#2 A2 Ab2 ' +
          'G2 Bb2 D3 Db3 C3 Bb2 G2 E2 F2 E2 D2 C2 F2 A2 C3 F#2').split(' ').map((n) => [n, 3]) },
        { voice: 'keys', vol: 0.05, seq: [
          ['Bb3', 'D4', 'F4'], ['Bb3', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['A3', 'C4', 'F#4'],
          ['Bb3', 'D4', 'F4'], ['Bb3', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['A3', 'C4', 'E4'],
        ].flatMap((c) => [[c, 5], [c, 7]]) },
        { voice: 'brush', vol: 0.05, seq: Array(8).fill([[null, 3], ['C4', 2], ['C4', 1], [null, 3], ['C4', 2], ['C4', 1]]).flat() },
      ],
    },
    // Tick-tock music box in C (4/4, 8 eighth-steps per bar), a woodblock ticking every quarter
    clock: {
      step: 60 / 96 / 2,
      tracks: [
        { voice: 'box', vol: 0.13, seq: [
          ['E5', 2], ['G5', 2], ['C6', 2], ['G5', 2], ['A5', 2], ['G5', 2], ['E5', 4],
          ['F5', 2], ['A5', 2], ['D6', 2], ['A5', 2], ['G5', 2], ['F5', 2], ['D5', 4],
          ['E5', 2], ['G5', 2], ['C6', 2], ['E6', 2], ['D6', 2], ['C6', 2], ['A5', 2], ['F5', 2],
          ['G5', 2], ['B5', 2], ['D6', 2], ['B5', 2], ['C6', 6], [null, 2],
        ] },
        { voice: 'pluck', vol: 0.16, seq: 'C3 G2 F2 C3 D3 A2 G2 B2 C3 E3 F2 A2 G2 D3 C3 G2'.split(' ').map((n) => [n, 4]) },
        { voice: 'wood', vol: 0.05, seq: Array(16).fill([['C7', 2], ['G6', 2]]).flat() },
      ],
    },
  };
  // Memory's folk tune in G (3/4, 6 eighth-steps per bar), dressed differently each season
  function seasonTune(voice, bpm, more) {
    return {
      step: 60 / bpm / 2,
      tracks: [
        { voice, vol: voice === 'box' ? 0.13 : 0.12, seq: [
          ['G5', 2], ['B5', 2], ['D6', 2], ['C6', 2], ['B5', 2], ['A5', 2], ['G5', 2], ['A5', 2], ['B5', 2], ['A5', 6],
          ['B5', 2], ['D6', 2], ['G6', 2], ['F#6', 2], ['E6', 2], ['D6', 2], ['C6', 2], ['A5', 2], ['F#5', 2], ['G5', 6],
        ] },
        { voice: 'pluck', vol: 0.16, seq: 'G2 C3 G2 D3 G2 B2 D3 G2'.split(' ').map((n) => [n, 6]) },
        { voice: 'soft', vol: 0.05, seq: [['B3', 'D4'], ['C4', 'E4'], ['B3', 'D4'], ['A3', 'F#4'], ['B3', 'D4'], ['B3', 'D4'], ['A3', 'F#4'], ['B3', 'D4']]
          .flatMap((c) => [[null, 2], [c, 2], [c, 2]]) },
      ].concat(more || []),
    };
  }
  THEMES.winter = seasonTune('box', 80);
  THEMES.spring = seasonTune('vibes', 100);
  THEMES.summer = seasonTune('vibes', 116, [{ voice: 'brush', vol: 0.04, seq: Array(8).fill([[null, 2], ['C4', 1], ['C4', 1], [null, 2]]).flat() }]);
  THEMES.autumn = seasonTune('box', 92, [{ voice: 'wood', vol: 0.035, seq: Array(8).fill([['G6', 2], ['D6', 2], ['D6', 2]]).flat() }]);
  // Potion Lab: bubbly waltz in F (3/4, 6 eighth-steps per bar) with bubble plops on beats 2 and 3
  THEMES.potion = {
    step: 60 / 132 / 2,
    tracks: [
      { voice: 'vibes', vol: 0.11, seq: [
        ['C5', 2], ['F5', 2], ['A5', 2], ['G5', 2], ['F5', 2], ['E5', 2], ['F5', 2], ['A5', 2], ['C6', 2], ['Bb5', 6],
        ['A5', 2], ['C6', 2], ['F6', 2], ['E6', 2], ['D6', 2], ['C6', 2], ['Bb5', 2], ['G5', 2], ['E5', 2], ['F5', 6],
      ] },
      { voice: 'pluck', vol: 0.17, seq: 'F2 C3 F2 Bb2 F2 Bb2 C3 F2'.split(' ').map((n) => [n, 6]) },
      { voice: 'plop', vol: 0.07, seq: Array(8).fill([[null, 2], ['A5', 2], ['C6', 2]]).flat() },
    ],
  };
  // Taller Mellis: a cosy, unhurried tune in D for building things (4/4, 8 eighth-steps per bar)
  THEMES.workshop = {
    step: 60 / 84 / 2,
    tracks: [
      { voice: 'vibes', vol: 0.1, seq: [
        ['F#5', 2], ['A5', 2], ['D6', 2], ['A5', 2], ['B5', 2], ['A5', 2], ['F#5', 4],
        ['G5', 2], ['B5', 2], ['E6', 2], ['B5', 2], ['A5', 4], [null, 4],
        ['F#5', 2], ['A5', 2], ['D6', 2], ['F#6', 2], ['E6', 2], ['D6', 2], ['B5', 4],
        ['G5', 2], ['E5', 2], ['A5', 2], ['C#6', 2], ['D6', 6], [null, 2],
      ] },
      { voice: 'pluck', vol: 0.15, seq: 'D3 A2 G2 D3 E3 B2 A2 A2 D3 A2 G2 G2 E3 A2 D3 D3'.split(' ').map((n) => [n, 4]) },
      { voice: 'soft', vol: 0.05, seq: [['F#4', 'A4'], ['G4', 'B4'], ['G4', 'B4'], ['E4', 'A4'], ['F#4', 'A4'], ['G4', 'B4'], ['C#4', 'G4'], ['F#4', 'A4']]
        .flatMap((c) => [[null, 2], [c, 2], [null, 2], [c, 2]]) },
    ],
  };
  // Savanna run: bouncy marimba in C at a jogging tempo
  THEMES.savanna = {
    step: 60 / 128 / 2,
    tracks: [
      { voice: 'vibes', vol: 0.09, seq: [
        ['G5', 1], ['C6', 1], ['E6', 2], ['D6', 1], ['C6', 1], ['A5', 2], ['G5', 2], ['E5', 2], [null, 2], ['G5', 2],
        ['A5', 1], ['C6', 1], ['F6', 2], ['E6', 1], ['D6', 1], ['C6', 2], ['D6', 4], [null, 4],
        ['G5', 1], ['C6', 1], ['E6', 2], ['D6', 1], ['C6', 1], ['A5', 2], ['G5', 2], ['A5', 2], ['C6', 2], ['E6', 2],
        ['F6', 2], ['E6', 2], ['D6', 2], ['B5', 2], ['C6', 6], [null, 2],
      ] },
      { voice: 'bass', vol: 0.14, seq: 'C3 C3 G2 G2 F2 F2 G2 G2 C3 C3 A2 A2 F2 G2 C3 C3'.split(' ').map((n) => [n, 4]) },
      { voice: 'wood', vol: 0.04, seq: Array(16).fill([['C7', 1], ['G6', 1], ['G6', 1], ['G6', 1]]).flat() },
      { voice: 'brush', vol: 0.04, seq: Array(32).fill([[null, 1], ['C4', 1]]).flat() },
    ],
  };
  const music = (() => {
    let on = load(MUSIC_KEY) !== '0', theme = null, timer = 0, bus = null, ducked = false;
    let nextT = 0, stepIx = 0, noise = null;
    const buttons = [];
    function out() {
      if (!ctx || bus) return bus;
      bus = ctx.createGain();
      bus.gain.value = 0;
      bus.connect(ctx.destination);
      return bus;
    }
    const audible = () => on && !muted && theme && !document.hidden;
    function level() {
      if (!bus) return;
      bus.gain.setTargetAtTime(audible() ? (ducked ? 0.3 : 1) : 0, ctx.currentTime, 0.2);
    }
    function play1(voice, f, t, len, vol) {
      const dur = len * theme.step;
      const osc = ctx.createOscillator(), g = ctx.createGain();
      let src = osc, decay = dur;
      if (voice === 'brush') {
        if (!noise) {
          noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
          const d = noise.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        }
        src = ctx.createBufferSource();
        src.buffer = noise;
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass'; hp.frequency.value = 5000;
        src.connect(hp).connect(g);
        decay = 0.09;
      } else {
        osc.type = { plop: 'sine', wood: 'sine', box: 'sine', vibes: 'sine', pluck: 'triangle', bass: 'triangle', keys: 'triangle', soft: 'sine' }[voice];
        osc.frequency.value = f;
        osc.connect(g);
        decay = { plop: 0.12, wood: 0.035, box: 1.2, vibes: 1.4, pluck: 0.5, bass: dur * 0.95, keys: 0.7, soft: 0.35 }[voice];
        if (voice === 'plop') {
          osc.frequency.setValueAtTime(f * 2, t);
          osc.frequency.exponentialRampToValueAtTime(f, t + 0.08);
        }
        if (voice === 'box' || voice === 'vibes') {
          const o2 = ctx.createOscillator(), g2 = ctx.createGain();
          o2.frequency.value = f * (voice === 'box' ? 3 : 4);
          g2.gain.value = 0.18;
          o2.connect(g2).connect(g);
          o2.start(t); o2.stop(t + decay + 0.1);
        }
      }
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      g.connect(bus);
      src.start(t);
      src.stop(t + decay + 0.1);
    }
    function tick() {
      if (!ctx || ctx.state !== 'running' || !audible() || !out()) return;
      if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.1;
      while (nextT < ctx.currentTime + 0.5) {
        (theme.events[stepIx] || []).forEach((e) =>
          e.notes.forEach((f) => play1(e.voice, f, nextT, e.len, e.vol / Math.sqrt(e.notes.length))));
        nextT += theme.step;
        stepIx = (stepIx + 1) % theme.total;
      }
    }
    function refresh() {
      buttons.forEach((b) => { b.classList.toggle('off', !on); b.setAttribute('aria-pressed', on); });
      out(); level();
    }
    function play(name) {
      theme = compile(THEMES[name]);
      stepIx = 0; nextT = 0;
      clearInterval(timer);
      timer = setInterval(tick, 150);
      refresh();
    }
    function toggle() { on = !on; save(MUSIC_KEY, on ? '1' : '0'); refresh(); }
    // 🎵 button for a page (e.g. next to the hearts)
    function button(el) {
      el.classList.add('music-btn');
      el.textContent = '🎵';
      el.setAttribute('aria-label', 'music');
      el.addEventListener('click', () => { toggle(); sounds.pop(); });
      buttons.push(el);
      refresh();
    }
    document.addEventListener('visibilitychange', () => { nextT = 0; level(); });
    window.addEventListener('pointerdown', refresh);
    return { play, toggle, button, refresh, duck: (d) => { ducked = d; level(); }, get on() { return on; } };
  })();

  // ---------- Speech (device text-to-speech) ----------
  let voices = [];
  function loadVoices() { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
  if (window.speechSynthesis) {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }
  // Accepts 'ca' / 'es' / 'en' or a full tag like 'en-GB'.
  const VOICE_TAGS = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB' };
  // Many phones have no Catalan voice (or list one that is not downloaded): read
  // Catalan with a Spanish voice rather than stay silent. Only for Catalan —
  // never read a language with a voice that would teach the wrong sounds (e.g. English).
  const VOICE_FALLBACK = { ca: 'es-ES' };
  let caBroken = false;                  // the listed Catalan voice failed once: use the fallback
  const lc = (tag) => String(tag || '').replace(/_/g, '-').toLowerCase();
  function voiceFor(tag) {
    if (!voices.length) loadVoices();    // some iOS / WebViews never fire voiceschanged
    const want = lc(tag), primary = want.split('-')[0];
    return voices.find((v) => lc(v.lang) === want) ||
      voices.find((v) => lc(v.lang).split('-')[0] === primary) || null;
  }
  // The voice to use for a tag: its own, else the fallback language's. null = none.
  function pickVoice(tag) {
    const primary = lc(tag).split('-')[0];
    const fallback = VOICE_FALLBACK[primary];
    const own = primary === 'ca' && caBroken ? null : voiceFor(tag);
    return own || (fallback ? voiceFor(fallback) : null);
  }
  // False only when we know the device has no voice for that language (or its fallback).
  function canSpeak(lang) {
    if (!window.speechSynthesis) return false;
    if (!voices.length) loadVoices();
    if (!voices.length) return true;
    return !!pickVoice(VOICE_TAGS[lang] || lang);
  }
  // True when the language is read by its own voice (not the Catalan → Spanish fallback).
  function ownVoice(lang) {
    if (!window.speechSynthesis) return false;
    if (!voices.length) loadVoices();
    if (lang === 'ca' && caBroken) return false;
    return !voices.length || !!voiceFor(VOICE_TAGS[lang] || lang);
  }
  // opts (optional): { onstart, onend, rate, pitch } — onend always fires once, even when muted,
  // when there is no voice, or when the engine forgets to report the end.
  let speakDone = null;
  function speak(text, voiceLang, opts) {
    const o = opts || {};
    if (speakDone) speakDone();          // a new line cancels the previous one
    let finished = false, timer = 0;
    const done = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (speakDone === done) speakDone = null;
      music.duck(false);
      if (o.onend) o.onend();
    };
    const estimate = 600 + text.length * 75;   // fallback if onend never comes
    const tag = VOICE_TAGS[voiceLang] || voiceLang || 'en-GB';
    const voice = window.speechSynthesis ? pickVoice(tag) : null;
    if (muted || !window.speechSynthesis || (voices.length && !voice)) {
      if (o.onstart) o.onstart();
      speakDone = done;
      timer = setTimeout(done, muted ? 0 : estimate);
      return;
    }
    speechSynthesis.cancel();
    const say = (v, retry) => {
      const u = new SpeechSynthesisUtterance(text);
      // A voice and a lang that disagree make some Android engines refuse the line.
      u.lang = v ? v.lang.replace(/_/g, '-') : tag;
      if (v) u.voice = v;
      u.rate = o.rate || 0.85;
      u.pitch = o.pitch || 1.1;
      u.onend = done;
      u.onerror = (e) => {
        // A Catalan voice listed but not installed fails here: retry once with the fallback.
        const err = e && e.error;
        if (retry && err !== 'interrupted' && err !== 'canceled' && !finished && speakDone === done) {
          caBroken = true;
          const fb = pickVoice(tag);
          if (fb) { say(fb, false); return; }
        }
        done();
      };
      speechSynthesis.speak(u);
    };
    speakDone = done;
    music.duck(true);
    if (o.onstart) o.onstart();
    timer = setTimeout(done, estimate * 1.6);
    const primary = lc(tag).split('-')[0];
    say(voice, primary === 'ca' && !caBroken && (!voice || lc(voice.lang).startsWith('ca')));
  }
  // iOS only speaks after a tap: say nothing once inside the first tap to unlock it.
  window.addEventListener('pointerdown', () => {
    if (window.speechSynthesis) speechSynthesis.speak(new SpeechSynthesisUtterance(''));
  }, { once: true });

  function isMuted() { return muted; }
  function setMuted(value) {
    muted = value;
    save(MUTE_KEY, value ? '1' : '0');
    if (value && window.speechSynthesis) speechSynthesis.cancel();
    music.refresh();
  }

  // ---------- Shared UI bits ----------
  const LANG_LABELS = { ca: 'CA', es: 'ES', en: 'EN' };

  // Renders the 3 flag buttons + mute button into `el`.
  function mountControls(el) {
    el.classList.add('controls');
    el.innerHTML =
      LANGS.map((l) =>
        `<button class="flag flag-${l}" data-lang="${l}" aria-label="${l}">` +
        `<span>${LANG_LABELS[l]}</span></button>`).join('') +
      '<button class="mute" aria-label="sound"></button>';

    const mute = el.querySelector('.mute');
    function refresh() {
      el.querySelectorAll('.flag').forEach((b) =>
        b.classList.toggle('active', b.dataset.lang === lang));
      mute.textContent = muted ? '🔇' : '🔊';
    }
    el.addEventListener('click', (e) => {
      const flag = e.target.closest('.flag');
      if (flag) { setLang(flag.dataset.lang); sounds.pop(); }
      if (e.target.closest('.mute')) { setMuted(!muted); sounds.pop(); }
      refresh();
    });
    langListeners.push(refresh);
    refresh();
  }

  // The twin scientists. `mood` = 'wave' | 'cheer'
  function mascotsSVG(mood) {
    const cheer = mood === 'cheer';
    function kid(x, goggles, accent, flip) {
      // Long hair with two pigtails tied with bows in the twin's colour
      const hair =
        `M${x - 38} 78 q-6 -38 38 -42 q42 0 40 40 q-14 -18 -40 -14 q-24 -2 -38 16 z` +
        `M${x - 34} 70 q-28 8 -26 44 q4 14 16 4 q-8 -22 12 -40 z` +
        `M${x + 34} 70 q28 8 26 44 q-4 14 -16 4 q8 -22 -12 -40 z`;
      const bow = (bx) => `<path d="M${bx} 72 l-11 -8 v16 z M${bx} 72 l11 -8 v16 z" fill="${accent}" stroke="#3a3a5c" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${bx}" cy="72" r="4" fill="${accent}" stroke="#3a3a5c" stroke-width="2.5"/>`;
      const arms = cheer
        ? [`M${x - 26} 132 q-14 -30 -6 -50`, `M${x + 26} 132 q14 -30 6 -50`]
        : flip
          ? [`M${x - 26} 134 q-10 18 -4 30`]
          : [`M${x - 26} 134 q-10 18 -4 30`, `M${x + 26} 134 q12 14 8 26`];
      const wave = !cheer && flip ? `M${x + 26} 132 q22 -20 14 -48` : null;
      const armPaths = (d, cls) => `<path d="${d}" class="arm-o ${cls}"/><path d="${d}" class="arm ${cls}"/>`;
      const arm = arms.map((d) => armPaths(d, '')).join('') +
        (wave ? `<g class="wave">${armPaths(wave, '')}</g>` : '') +
        (!cheer && !flip ? `<g class="flask" transform="translate(${x + 26} 146)"><path d="M-6 -12 h12 v10 l10 16 a4 4 0 0 1 -3 6 h-26 a4 4 0 0 1 -3 -6 l10 -16 z" fill="#e8fbff" stroke="#3a3a5c" stroke-width="2.5"/><path d="M-12 8 h24 l3 4 a3 3 0 0 1 -3 4 h-24 a3 3 0 0 1 -3 -4 z" fill="#9b5de5"/><circle class="bubble" cx="0" cy="-16" r="3" fill="#9b5de5"/></g>` : '');
      return `
      <g class="kid${flip ? ' kid-b' : ''}" data-x="${x}">
        ${arm}
        <path d="M${x - 30} 190 q0 -62 30 -64 q30 2 30 64 z" fill="#ffffff" stroke="#3a3a5c" stroke-width="3"/>
        <path d="M${x - 9} 128 l9 18 l9 -18" fill="none" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="${x + 14}" cy="160" r="3" fill="#ff6fb5"/>
        <circle cx="${x}" cy="88" r="38" fill="#ffd9b8" stroke="#3a3a5c" stroke-width="3"/>
        <path d="${hair}" fill="#6b3f2a" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
        ${bow(x - 40)}${bow(x + 40)}
        <rect x="${x - 38}" y="62" width="76" height="8" rx="4" fill="#3a3a5c"/>
        <circle cx="${x - 14}" cy="64" r="11" fill="${goggles}" stroke="#3a3a5c" stroke-width="3"/>
        <circle cx="${x + 14}" cy="64" r="11" fill="${goggles}" stroke="#3a3a5c" stroke-width="3"/>
        <circle cx="${x - 17}" cy="61" r="3" fill="#fff"/><circle cx="${x + 11}" cy="61" r="3" fill="#fff"/>
        <circle cx="${x - 22}" cy="104" r="6" fill="#ff9ec7" opacity=".7"/><circle cx="${x + 22}" cy="104" r="6" fill="#ff9ec7" opacity=".7"/>
        <g class="face">${faceSVG(x, cheer ? 'laugh' : mood === 'oops' ? (flip ? 'dizzy' : 'surprised') : 'happy')}</g>
      </g>`;
    }
    return `<svg class="mascots" viewBox="40 20 220 175" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${kid(100, '#ffb3d9', '#ff6fb5', false)}
      ${kid(180, '#d4b8ff', '#9b5de5', true)}
    </svg>`;
  }

  // Facial expressions for the twins (eyes + mouth around centre x).
  const INK = '#3a3a5c';
  const EXPRESSIONS = ['laugh', 'surprised', 'tongue', 'wink', 'love', 'dizzy', 'starry', 'sneeze'];
  function faceSVG(x, e) {
    const L = x - 12, R = x + 12, Y = 92;
    const line = `fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
    const dot = (cx) => `<ellipse cx="${cx}" cy="${Y}" rx="4" ry="5" fill="${INK}"/>`;
    const closed = (cx) => `<path d="M${cx - 5} ${Y + 2} q5 -7 10 0" ${line}/>`;
    const smile = `<path d="M${x - 10} 106 q10 10 20 0" ${line}/>`;
    const open = `<path d="M${x - 12} 104 q12 18 24 0 z" fill="#ff6f91" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
    const heart = (cx) => `<path d="M${cx} ${Y + 5} l-6.5 -6.5 a3.6 3.6 0 0 1 6.5 -4.5 a3.6 3.6 0 0 1 6.5 4.5 z" fill="#ff4d6d" stroke="${INK}" stroke-width="1.5"/>`;
    const star = (cx) => `<path d="M${cx} ${Y - 7} l2.2 4.6 5 .7 -3.6 3.5 .9 5 -4.5 -2.4 -4.5 2.4 .9 -5 -3.6 -3.5 5 -.7 z" fill="#ffd23f" stroke="${INK}" stroke-width="1.5"/>`;
    const swirl = (cx) => `<circle cx="${cx}" cy="${Y}" r="5.5" ${line} stroke-width="2"/><circle cx="${cx}" cy="${Y}" r="2" fill="${INK}"/>`;
    switch (e) {
      case 'laugh': return closed(L) + closed(R) + open;
      case 'surprised': return `<ellipse cx="${L}" cy="${Y}" rx="5.5" ry="7" fill="${INK}"/><ellipse cx="${R}" cy="${Y}" rx="5.5" ry="7" fill="${INK}"/>` +
        `<circle cx="${L + 2}" cy="${Y - 3}" r="1.8" fill="#fff"/><circle cx="${R + 2}" cy="${Y - 3}" r="1.8" fill="#fff"/>` +
        `<ellipse cx="${x}" cy="111" rx="5" ry="6.5" fill="#5a1a3a" stroke="${INK}" stroke-width="2.5"/>`;
      case 'tongue': return `<path d="M${L - 5} ${Y} l9 -3 M${L - 5} ${Y} l9 3" ${line}/><path d="M${R + 5} ${Y} l-9 -3 M${R + 5} ${Y} l-9 3" ${line}/>` +
        `<path d="M${x - 10} 105 q10 8 20 0" ${line}/><path d="M${x - 3} 108 v6 a4 4 0 0 0 8 0 v-6.5" fill="#ff7aa8" stroke="${INK}" stroke-width="2.5"/>`;
      case 'wink': return dot(L) + closed(R) + `<path d="M${x - 9} 107 q11 8 19 -3" ${line}/>`;
      case 'love': return heart(L) + heart(R) + open;
      case 'dizzy': return swirl(L) + swirl(R) + `<path d="M${x - 10} 109 q2.5 -4 5 0 t5 0 t5 0 t5 0" ${line}/>`;
      case 'starry': return star(L) + star(R) + open;
      case 'sneeze': return `<path d="M${L - 5} ${Y - 3} l9 3 l-9 3" ${line}/><path d="M${R + 5} ${Y - 3} l-9 3 l9 3" ${line}/>` +
        `<ellipse cx="${x}" cy="109" rx="4" ry="3.5" fill="#5a1a3a"/>`;
      default: return `<g class="eyes">${dot(L)}${dot(R)}</g>` + smile;
    }
  }

  // Makes the twins inside `el` react to taps: a funny face + a jump.
  // onReact(expression, twinIndex) lets the page answer (e.g. in a speech bubble).
  function playfulMascots(el, onReact) {
    const timers = [];
    el.addEventListener('click', (e) => {
      const kidEl = e.target.closest('.kid');
      if (!kidEl) return;
      const kids = [...el.querySelectorAll('.kid')];
      const i = kids.indexOf(kidEl);
      const current = kidEl.dataset.expr;
      const expr = pick(EXPRESSIONS.filter((x) => x !== current));
      setFace(kidEl, expr);
      const move = pick(['boing', 'spin', 'wobble']);
      kidEl.classList.remove('boing', 'spin', 'wobble'); void kidEl.getBBox(); kidEl.classList.add(move);
      (REACTION_SOUNDS[expr] || sounds.pop)();
      clearTimeout(timers[i]);
      timers[i] = setTimeout(() => { setFace(kidEl, 'happy'); kidEl.classList.remove(move); }, 2600);
      if (onReact) onReact(expr, i);
    });
  }
  function setFace(kidEl, expr) {
    kidEl.dataset.expr = expr;
    kidEl.querySelector('.face').innerHTML = faceSVG(+kidEl.dataset.x, expr);
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  const REACTION_SOUNDS = {
    laugh: () => sounds.giggle(), surprised: () => sounds.boing(), tongue: () => sounds.raspberry(),
    sneeze: () => sounds.sneeze(), love: () => sounds.match(), starry: () => sounds.match(),
  };

  // ---------- The Mellis rule: hearts, "oh oh", stars ----------
  // Every interactive game uses this so guessing never pays:
  //  * 3 hearts per round; a wrong answer breaks one, says "oh oh!" and pauses 2 s
  //  * the 2nd miss on the same question reveals the answer (the game decides how)
  //  * hearts left at the end = stars; 3 stars = golden reward
  //  * 0 hearts: silly-sad twins, then the whole round restarts with new questions
  const RULE_TEXT = {
    ohoh: { ca: 'Oh, oh!', es: '¡Oh, oh!', en: 'Uh oh!' },
    out: { ca: 'Oh, oh! No queden cors!', es: '¡Oh, oh! ¡No quedan corazones!', en: 'Uh oh! No hearts left!' },
    again: { ca: 'Tornem-hi!', es: '¡Otra vez!', en: 'Try again!' },
  };
  const HEARTS = 3;
  const PAUSE_MS = 2000;

  function ruleLayer() {
    let el = document.getElementById('mellis-rule');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'mellis-rule';
    el.innerHTML = `
      <div class="ohoh" hidden><span class="ohoh-heart">💔</span><span class="ohoh-text"></span></div>
      <div class="out" hidden><div class="out-box">
        <div class="out-twins"></div><p class="out-text"></p>
        <button class="out-btn">🔁 <span></span></button>
      </div></div>`;
    document.body.appendChild(el);
    return el;
  }

  // round = M.round({ heartsEl, onOut }) ... round.start(), round.wrong(key), round.stars()
  function round(opts) {
    let hearts = HEARTS, misses = {}, busy = false;
    function draw(broken) {
      if (!opts.heartsEl) return;
      opts.heartsEl.classList.add('hearts');
      opts.heartsEl.innerHTML = Array.from({ length: HEARTS }, (_, i) =>
        `<span class="${i < hearts ? '' : 'lost'}${i === broken ? ' breaking' : ''}">${i < hearts ? '❤️' : '🤍'}</span>`).join('');
    }
    function start() { hearts = HEARTS; misses = {}; busy = false; draw(); }
    // Call on every wrong answer. Resolves after the pause with
    // { reveal: true } on the 2nd miss of `key`, or never if the hearts ran out.
    function wrong(key) {
      if (busy) return new Promise(() => {});
      busy = true;
      hearts--;
      misses[key] = (misses[key] || 0) + 1;
      draw(hearts);
      const layer = ruleLayer();
      const oh = layer.querySelector('.ohoh');
      layer.querySelector('.ohoh-text').textContent = t(RULE_TEXT.ohoh);
      oh.hidden = false;
      oh.style.animation = 'none'; void oh.offsetWidth; oh.style.animation = '';
      sounds.ohoh();
      speak(t(RULE_TEXT.ohoh).replace(/[¡!]/g, ''), lang);
      return new Promise((resolve) => {
        setTimeout(() => {
          oh.hidden = true;
          busy = false;
          if (hearts <= 0) { showOut(); return; }
          resolve({ reveal: misses[key] >= 2 });
        }, PAUSE_MS);
      });
    }
    function showOut() {
      const layer = ruleLayer();
      const out = layer.querySelector('.out');
      layer.querySelector('.out-twins').innerHTML = mascotsSVG('oops');
      layer.querySelector('.out-text').textContent = t(RULE_TEXT.out);
      layer.querySelector('.out-btn span').textContent = t(RULE_TEXT.again);
      out.hidden = false;
      sounds.boing();
      speak(t(RULE_TEXT.out).replace(/[¡!]/g, ''), lang);
      layer.querySelector('.out-btn').onclick = () => {
        sounds.pop();
        out.hidden = true;
        opts.onOut();
      };
    }
    return { start, wrong, stars: () => Math.max(1, hearts), get busy() { return busy; } };
  }

  // ⭐⭐☆ for win screens
  function starsHTML(n) {
    return `<span class="stars${n === 3 ? ' gold' : ''}">` +
      [0, 1, 2].map((i) => `<span class="${i < n ? '' : 'off'}">⭐</span>`).join('') + '</span>';
  }

  // Confetti burst on a full-screen canvas.
  function confetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti';
    document.body.appendChild(canvas);
    const c = canvas.getContext('2d');
    const W = (canvas.width = innerWidth);
    const H = (canvas.height = innerHeight);
    const colors = ['#ff6fb5', '#2ec4b6', '#ffd23f', '#9b5de5', '#ff9f1c', '#3a86ff'];
    const parts = Array.from({ length: 140 }, () => ({
      x: W / 2, y: H / 3,
      vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4,
      s: Math.random() * 8 + 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      color: colors[(Math.random() * colors.length) | 0],
    }));
    let frames = 0;
    (function step() {
      c.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        c.save(); c.translate(p.x, p.y); c.rotate(p.r);
        c.fillStyle = p.color; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        c.restore();
      });
      if (++frames < 180) requestAnimationFrame(step); else canvas.remove();
    })();
  }

  // ---------- Remember which games were played (removes the hub's "NOU!" sticker) ----------
  const gameMatch = location.pathname.match(/\/(?:games|learn)\/([^/]+)\//);
  if (gameMatch) {
    let played = [];
    try { played = JSON.parse(load('mellis.played')) || []; } catch (e) { /* ignore */ }
    if (!played.includes(gameMatch[1])) { played.push(gameMatch[1]); save('mellis.played', JSON.stringify(played)); }
  }

  // ---------- Installable web app (offline + home-screen icon) ----------
  const appScript = document.currentScript;
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && appScript) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register(new URL('../sw.js', appScript.src)).then((reg) => {
      // Installed apps are often resumed from memory without a new page load, so look
      // for a new version every time the app comes back to the screen.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => { /* offline */ });
      });
    }).catch(() => { /* ignore */ });
    // A new version took over. The hub reloads to show it; games never reload mid-play,
    // they get the new code on the next page open (pages are fetched network-first).
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || gameMatch || reloading) return;
      reloading = true;
      location.reload();
    });
  }
  // Chrome/Android offer an install prompt we can trigger from our own button.
  let installEvent = null;
  const installListeners = [];
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e;
    installListeners.forEach((fn) => fn(true));
  });
  window.addEventListener('appinstalled', () => { installEvent = null; installListeners.forEach((fn) => fn(false)); });
  function onInstallable(fn) { installListeners.push(fn); fn(!!installEvent); }
  async function install() {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    installEvent = null;
    installListeners.forEach((fn) => fn(false));
  }

  window.Mellis = {
    VERSION, LANGS, get lang() { return lang; }, setLang, t, onLang: (fn) => langListeners.push(fn),
    sounds, music, speak, canSpeak, ownVoice, isMuted, setMuted, mountControls, mascotsSVG, playfulMascots, confetti,
    onInstallable, install, round, starsHTML,
  };
  document.documentElement.lang = lang;
})();
