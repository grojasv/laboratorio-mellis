// Shared helpers for the hub and every game: language, sound, mascots.
// Classic script (no modules) so pages also work when opened straight from disk.
(function () {
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
    raspberry() { tone(140, 0, 0.45, 'sawtooth', 0.12, 90); },
    sneeze() { tone(600, 0, 0.25, 'sine', 0.12, 900); tone(1400, 0.3, 0.12, 'square', 0.1, 300); },
    win() {
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
        tone(f, i * 0.12, 0.22, 'square', 0.12));
    },
  };

  // ---------- Speech (device text-to-speech) ----------
  let voices = [];
  function loadVoices() { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
  if (window.speechSynthesis) {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }
  // Accepts 'ca' / 'es' / 'en' or a full tag like 'en-GB'.
  const VOICE_TAGS = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB' };
  function voiceFor(tag) {
    const norm = (v) => v.lang.replace('_', '-');
    return voices.find((v) => norm(v) === tag) ||
      voices.find((v) => norm(v).startsWith(tag.slice(0, 2))) || null;
  }
  // False only when we know the device has no voice for that language
  // (never read Catalan with an English voice).
  function canSpeak(lang) {
    if (!window.speechSynthesis) return false;
    if (!voices.length) return true;
    return !!voiceFor(VOICE_TAGS[lang] || lang);
  }
  function speak(text, voiceLang) {
    if (muted || !window.speechSynthesis) return;
    const tag = VOICE_TAGS[voiceLang] || voiceLang || 'en-GB';
    const voice = voiceFor(tag);
    if (voices.length && !voice) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = tag;
    u.voice = voice;
    u.rate = 0.85;
    u.pitch = 1.1;
    speechSynthesis.speak(u);
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
        <g class="face">${faceSVG(x, cheer ? 'laugh' : 'happy')}</g>
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

  window.Mellis = {
    LANGS, get lang() { return lang; }, setLang, t, onLang: (fn) => langListeners.push(fn),
    sounds, speak, canSpeak, isMuted, setMuted, mountControls, mascotsSVG, playfulMascots, confetti,
  };
  document.documentElement.lang = lang;
})();
