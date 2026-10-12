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
    win() {
      [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
        tone(f, i * 0.12, 0.22, 'square', 0.12));
    },
  };

  function isMuted() { return muted; }
  function setMuted(value) {
    muted = value;
    save(MUTE_KEY, value ? '1' : '0');
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
    function kid(x, hair, goggles, flip) {
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
      <g class="kid${flip ? ' kid-b' : ''}">
        ${arm}
        <path d="M${x - 30} 190 q0 -62 30 -64 q30 2 30 64 z" fill="#ffffff" stroke="#3a3a5c" stroke-width="3"/>
        <path d="M${x - 9} 128 l9 18 l9 -18" fill="none" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="${x + 14}" cy="160" r="3" fill="#ff6fb5"/>
        <circle cx="${x}" cy="88" r="38" fill="#ffd9b8" stroke="#3a3a5c" stroke-width="3"/>
        <path d="${hair}" fill="#6b3f2a" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
        <rect x="${x - 38}" y="62" width="76" height="8" rx="4" fill="#3a3a5c"/>
        <circle cx="${x - 14}" cy="64" r="11" fill="${goggles}" stroke="#3a3a5c" stroke-width="3"/>
        <circle cx="${x + 14}" cy="64" r="11" fill="${goggles}" stroke="#3a3a5c" stroke-width="3"/>
        <circle cx="${x - 17}" cy="61" r="3" fill="#fff"/><circle cx="${x + 11}" cy="61" r="3" fill="#fff"/>
        <g class="eyes"><ellipse cx="${x - 12}" cy="92" rx="4" ry="5" fill="#3a3a5c"/><ellipse cx="${x + 12}" cy="92" rx="4" ry="5" fill="#3a3a5c"/></g>
        <circle cx="${x - 22}" cy="104" r="6" fill="#ff9ec7" opacity=".7"/><circle cx="${x + 22}" cy="104" r="6" fill="#ff9ec7" opacity=".7"/>
        <path d="M${x - 10} 106 q10 ${cheer ? 14 : 10} 20 0" fill="${cheer ? '#ff6f91' : 'none'}" stroke="#3a3a5c" stroke-width="3" stroke-linecap="round"/>
      </g>`;
    }
    const hairA = 'M62 72 q-4 -34 38 -38 q38 0 40 34 q-10 -10 -20 -8 q-10 -12 -22 -4 q-14 -8 -36 16 z';
    const hairB = 'M142 74 q-6 -36 36 -40 q40 2 40 38 q-18 -18 -40 -12 q-18 -4 -36 14 z M212 66 q22 4 18 26 q-12 -6 -18 -26 z M146 66 q-22 4 -18 26 q12 -6 18 -26 z';
    return `<svg class="mascots" viewBox="40 20 220 175" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${kid(100, hairA, '#7ef0e6', false)}
      ${kid(180, hairB, '#ffb3d9', true)}
    </svg>`;
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

  window.Mellis = {
    LANGS, get lang() { return lang; }, setLang, t, onLang: (fn) => langListeners.push(fn),
    sounds, isMuted, setMuted, mountControls, mascotsSVG, confetti,
  };
  document.documentElement.lang = lang;
})();
