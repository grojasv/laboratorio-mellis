(function () {
  const M = window.Mellis;
  const ROUND = 10;                       // correct answers needed per potion
  const STORE_KEY = 'mellis.potions.creatures';

  const CREATURES = ['🐉', '🦄', '🐙', '🦖', '🐸', '🦊', '🐼', '🦋',
    '🐢', '🦉', '🐳', '👾', '🐝', '🦩', '🐧', '🦔'];
  const COLORS = ['#ff6fb5', '#2ec4b6', '#ffd23f', '#9b5de5', '#ff9f1c', '#3a86ff', '#7bd389'];

  const TEXT = {
    title: { ca: 'Laboratori de pocions', es: 'Laboratorio de pociones', en: 'Potion Lab' },
    ask: { ca: 'Tria un nivell!', es: '¡Elige un nivel!', en: 'Pick a level!' },
    l1: { ca: 'Fins a 20', es: 'Hasta 20', en: 'Up to 20' },
    l2: { ca: 'Fins a 100', es: 'Hasta 100', en: 'Up to 100' },
    l3: { ca: 'Repte 100', es: 'Reto 100', en: '100 Challenge' },
    win: { ca: 'Poció a punt! Un nou amic!', es: '¡Poción lista! ¡Un nuevo amigo!', en: 'Potion ready! A new friend!' },
    shelf: { ca: 'La meva col·lecció', es: 'Mi colección', en: 'My collection' },
  };

  const $ = (id) => document.getElementById(id);
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Questions ----------
  // Level 1: within 20. Level 2: up to 100, no carrying. Level 3: up to 100, carrying.
  function makeQuestion(level) {
    const add = Math.random() < 0.5;
    let a, b;
    if (level === 1) {
      if (add) { a = rand(1, 19); b = rand(1, 20 - a); }
      else { a = rand(5, 20); b = rand(1, a); }
    } else if (level === 2) {
      const kind = pick(['ones', 'tens', 'both']);
      if (add) {
        const t1 = rand(1, 8), u1 = rand(0, 8);
        const t2 = kind === 'ones' ? 0 : rand(1, 9 - t1);
        const u2 = kind === 'tens' ? 0 : rand(1, 9 - u1);
        a = 10 * t1 + u1; b = 10 * t2 + u2;
      } else {
        const t1 = rand(2, 9), u1 = rand(1, 9);
        const t2 = kind === 'ones' ? 0 : rand(1, t1 - 1);
        const u2 = kind === 'tens' ? 0 : rand(1, u1);
        a = 10 * t1 + u1; b = 10 * t2 + u2;
      }
    } else {
      if (add) {
        const u1 = rand(1, 9), u2 = rand(Math.max(1, 10 - u1), 9);
        const t1 = rand(1, 8), t2 = Math.random() < 0.5 ? 0 : rand(0, 8 - t1);
        a = 10 * t1 + u1; b = 10 * t2 + u2;
      } else {
        const u1 = rand(0, 8), u2 = rand(u1 + 1, 9);
        const t1 = rand(2, 9), t2 = Math.random() < 0.5 ? 0 : rand(0, t1 - 1);
        a = 10 * t1 + u1; b = 10 * t2 + u2;
      }
    }
    const answer = add ? a + b : a - b;
    return { a, b, op: add ? '+' : '−', answer, key: `${a}${add ? '+' : '-'}${b}` };
  }

  // Wrong options look like real slips: off by one, off by ten.
  function options(answer, level) {
    const near = level === 1 ? [1, -1, 2, -2, 3] : [1, -1, 10, -10, 2, -2];
    const wrong = shuffle(near.map((d) => answer + d).filter((n) => n >= 0 && n <= 100));
    return shuffle([answer, wrong[0], wrong[1]]);
  }

  // ---------- Collection ----------
  function owned() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function addCreature(c) {
    const list = owned();
    if (!list.includes(c)) list.push(c);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  // ---------- Text ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    $('ask').textContent = M.t(TEXT.ask);
    $('l1-name').textContent = M.t(TEXT.l1);
    $('l2-name').textContent = M.t(TEXT.l2);
    $('l3-name').textContent = M.t(TEXT.l3);
    $('win-text').textContent = M.t(TEXT.win);
    $('shelf-label').textContent = M.t(TEXT.shelf);
    $('shelf-title').textContent = M.t(TEXT.shelf);
    $('shelf-count').textContent = `${owned().length}/${CREATURES.length}`;
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  renderText();
  $('mascots-levels').innerHTML = M.mascotsSVG('wave');

  // ---------- Cauldron ----------
  const liquid = $('liquid');
  const potBubbles = $('pot-bubbles');
  potBubbles.innerHTML = Array.from({ length: 6 }, (_, i) =>
    `<circle cx="${50 + i * 20}" cy="${8 + (i % 3) * 6}" r="${4 + (i % 3) * 2}" style="animation-delay:${-i * 0.27}s"/>`).join('');

  function setLevel(n, color) {
    const y = 145 - n * ((145 - 62) / ROUND);
    liquid.style.transform = potBubbles.style.transform = `translateY(${y}px)`;
    if (color) liquid.setAttribute('fill', color);
  }

  function splash(color) {
    const s = $('splash');
    s.innerHTML = Array.from({ length: 10 }, () => {
      const dx = rand(-70, 70), dy = rand(-90, -20);
      return `<i style="background:${color};--dx:${dx}px;--dy:${dy}px"></i>`;
    }).join('');
  }

  // ---------- Game ----------
  let level = 1, done = 0, current = null, busy = false, seen = new Set();

  function start(lvl) {
    level = lvl;
    done = 0;
    seen = new Set();
    $('levels').hidden = true;
    $('win').hidden = true;
    $('play').hidden = false;
    $('progress').innerHTML = '<span></span>'.repeat(ROUND);
    liquid.style.transition = 'none';
    setLevel(0, '#7ef0e6');
    void liquid.getBoundingClientRect();
    liquid.style.transition = '';
    next();
  }

  function next() {
    let q;
    do { q = makeQuestion(level); } while (seen.has(q.key) && seen.size < 60);
    seen.add(q.key);
    current = q;
    busy = false;
    $('question').innerHTML = `${q.a} ${q.op} ${q.b} = <span class="q">?</span>`;
    const colors = shuffle(COLORS.slice());
    $('answers').innerHTML = options(q.answer, level).map((n, i) =>
      `<button class="bottle" data-n="${n}" style="background:${colors[i]}">${n}</button>`).join('');
  }

  $('answers').addEventListener('click', (e) => {
    const btn = e.target.closest('.bottle');
    if (!btn || busy) return;
    if (+btn.dataset.n !== current.answer) {
      btn.classList.add('wrong');
      M.sounds.miss();
      return;
    }
    busy = true;
    const color = btn.style.background;
    $('question').querySelector('.q').textContent = current.answer;
    M.sounds.pop();
    flyInto(btn, color, () => {
      done++;
      M.sounds.match();
      splash(color);
      setLevel(done, color);
      const dot = $('progress').children[done - 1];
      dot.style.background = color;
      dot.classList.add('full');
      const pot = $('cauldron');
      pot.classList.remove('stir'); void pot.offsetWidth; pot.classList.add('stir');
      if (done === ROUND) setTimeout(finish, 600);
      else setTimeout(next, 700);
    });
  });

  // A drop of the bottle's colour arcs into the cauldron.
  function flyInto(btn, color, then) {
    const from = btn.getBoundingClientRect();
    const to = $('cauldron').getBoundingClientRect();
    const drop = document.createElement('div');
    drop.className = 'flyer';
    drop.style.background = color;
    drop.style.left = from.left + from.width / 2 - 20 + 'px';
    drop.style.top = from.top + 'px';
    document.body.appendChild(drop);
    btn.classList.add('gone');
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height * 0.3 - from.top;
    const anim = drop.animate([
      { transform: 'translate(0,0) scale(1)' },
      { transform: `translate(${dx * 0.5}px, ${dy - 80}px) scale(1.3)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.6)` },
    ], { duration: 550, easing: 'ease-in' });
    anim.onfinish = () => { drop.remove(); then(); };
  }

  function finish() {
    const pot = $('cauldron');
    pot.classList.remove('stir', 'boom'); void pot.offsetWidth; pot.classList.add('boom');
    M.sounds.boing();
    setTimeout(() => {
      const have = owned();
      const fresh = CREATURES.filter((c) => !have.includes(c));
      const creature = pick(fresh.length ? fresh : CREATURES);
      addCreature(creature);
      const el = $('creature');
      el.textContent = creature;
      el.style.background = pick(COLORS);
      el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
      $('win').hidden = false;
      renderText();
      M.sounds.win();
      M.confetti();
    }, 800);
  }

  function showShelf() {
    const have = owned();
    $('shelf-grid').innerHTML = CREATURES.map((c) =>
      `<span class="${have.includes(c) ? '' : 'locked'}"><i>${c}</i></span>`).join('');
    $('shelf').hidden = false;
  }

  function showLevels() {
    $('play').hidden = true;
    $('win').hidden = true;
    $('levels').hidden = false;
    renderText();
  }

  document.querySelectorAll('.level').forEach((b) =>
    b.addEventListener('click', () => { M.sounds.pop(); start(+b.dataset.level); }));
  $('again').addEventListener('click', () => { M.sounds.pop(); start(level); });
  $('to-shelf').addEventListener('click', () => { M.sounds.pop(); showLevels(); showShelf(); });
  $('open-shelf').addEventListener('click', () => { M.sounds.pop(); showShelf(); });
  $('close-shelf').addEventListener('click', () => { M.sounds.pop(); $('shelf').hidden = true; });
})();
