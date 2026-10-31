// Taller Mellis: real paper crafts, IKEA-style. Tisoreta shows each step, she builds it on the table
// and taps ✅ Fet!; at the end a photo of her craft is pinned on the cork board.
// A creative activity: no hearts, no wrong answers (CLAUDE.md, Mellis rule exception 8).
(() => {
  const M = window.Mellis;
  const ART = window.CRAFT_ART;
  const L = (ca, es, en) => ({ ca, es, en });
  const BOARD_KEY = 'mellis.crafts.board';
  const MAX_PINS = 40;

  const TEXT = {
    title: L('Taller Mellis', 'Taller Mellis', 'Mellis Craft Workshop'),
    halloween: L('Halloween', 'Halloween', 'Halloween'),
    xmas: L('Nadal', 'Navidad', 'Christmas'),
    need: L('Què necessites?', '¿Qué necesitas?', 'What you need'),
    go: L('Som-hi!', '¡Vamos!', "Let's go!"),
    done: L('Fet!', '¡Hecho!', 'Done!'),
    finished: L('Ho has fet tu sola!', '¡Lo has hecho tú sola!', 'You made it yourself!'),
    photo: L('Fes-li una foto', 'Hazle una foto', 'Take a photo'),
    noPhoto: L('Penja-ho sense foto', 'Cuélgalo sin foto', 'Pin it without a photo'),
    board: L('El nostre suro', 'Nuestro corcho', 'Our cork board'),
    empty: L('Encara no hi ha res penjat. Fes una manualitat!', 'Todavía no hay nada colgado. ¡Haz una manualidad!', 'Nothing pinned yet. Make a craft!'),
    remove: L('Treure-la del suro?', '¿Quitarla del corcho?', 'Take it off the board?'),
    noRoom: L("No hi cap la foto: l'hem penjada amb un dibuix.", 'No cabe la foto: la hemos colgado con un dibujo.', "The photo didn't fit: we pinned a drawing instead."),
  };
  const SAY = {
    hello: L('Hola! Sóc la Tisoreta. Què fem avui?', '¡Hola! Soy Tijereta. ¿Qué hacemos hoy?', "Hi! I'm Snippy. What shall we make today?"),
    ready: L('Primer, prepara-ho tot a la taula!', '¡Primero, prepáralo todo en la mesa!', 'First, get everything ready on the table!'),
    cheers: [
      L('Snip-snap, perfecte!', '¡Snip-snap, perfecto!', 'Snip-snap, perfect!'),
      L('Molt bé!', '¡Muy bien!', 'Great job!'),
      L('Quina traça!', '¡Qué maña!', 'So crafty!'),
      L('Ets una artista!', '¡Eres una artista!', "You're an artist!"),
      L('Genial, la següent!', '¡Genial, la siguiente!', 'Awesome, next one!'),
    ],
    photo: L('Fes-li una foto i la penjarem al suro!', '¡Hazle una foto y la colgaremos en el corcho!', "Take a photo and we'll pin it on the board!"),
    pinned: L('Penjada! Que bonica!', '¡Colgada! ¡Qué bonita!', 'Pinned! So pretty!'),
  };
  const NAME = { ca: 'Tisoreta', es: 'Tijereta', en: 'Snippy' };

  // materials: emoji + name (paper ones get a colour swatch)
  const MAT = {
    white: { paper: '#ffffff', t: L('Paper blanc', 'Papel blanco', 'White paper') },
    yellow: { paper: '#ffd23f', t: L('Paper groc (millor si és gruixut, o una capsa de cereals)', 'Papel amarillo (mejor si es grueso, o una caja de cereales)', 'Yellow paper (thick is best, or a cereal box)') },
    scissors: { e: '✂️', t: L('Tisores', 'Tijeras', 'Scissors') },
    pencil: { e: '✏️', t: L('Llapis', 'Lápiz', 'Pencil') },
    marker: { e: '🖊️', t: L('Retolador negre', 'Rotulador negro', 'Black marker') },
    glue: { e: '🧴', t: L('Barra de cola', 'Barra de pegamento', 'Glue stick') },
    roll: { e: '🧻', t: L('Un rotllo de paper de vàter (buit!)', 'Un rollo de papel higiénico (¡vacío!)', 'An empty toilet roll') },
  };

  const CRAFTS = [
    {
      id: 'ghosts', season: 'halloween', emoji: '👻', color: '#9b5de5', mins: 15, view: 'sway',
      name: L('Garlanda de fantasmes', 'Guirnalda de fantasmas', 'Ghost garland'),
      need: ['white', 'scissors', 'pencil', 'marker'],
      steps: [
        L('Talla un full per la meitat, pel costat llarg.', 'Corta un folio por la mitad, por el lado largo.', 'Cut a sheet in half the long way.'),
        L('Doblega la tira per la meitat.', 'Dobla la tira por la mitad.', 'Fold the strip in half.'),
        L('Gira la punta de dalt enrere fins al plec, i la de sota cap a l\'altre costat: fa una ziga-zaga.', 'Dobla la punta de arriba hacia atrás hasta el pliegue, y la de abajo hacia el otro lado: hace un zigzag.', 'Fold the top end back to the fold, and the bottom end the other way: it makes a zigzag.'),
        L('Dibuixa un fantasma. Les mans han de tocar les dues vores!', 'Dibuja un fantasma. ¡Las manos tienen que tocar los dos bordes!', 'Draw a ghost. Its hands must touch both edges!'),
        L('Retalla el fantasma. No tallis les mans!', 'Recorta el fantasma. ¡No cortes las manos!', "Cut out the ghost. Don't cut the hands!"),
        L('Desplega a poc a poc… quants fantasmes!', 'Despliega poco a poco… ¡cuántos fantasmas!', 'Unfold slowly… so many ghosts!'),
        L('Dibuixa\'ls les cares: buuu!', 'Dibújales las caras: ¡buuu!', 'Draw their faces: boooo!'),
      ],
    },
    {
      id: 'mummy', season: 'halloween', emoji: '🧻', color: '#e76f51', mins: 15, view: 'wobble',
      name: L('Mòmia de rotllo', 'Momia de rollo', 'Toilet-roll mummy'),
      need: ['roll', 'white', 'scissors', 'glue', 'marker'],
      steps: [
        L('Retalla tires llargues de paper blanc.', 'Recorta tiras largas de papel blanco.', 'Cut long strips of white paper.'),
        L('Posa cola per tot el rotllo.', 'Pon pegamento por todo el rollo.', 'Put glue all over the roll.'),
        L('Enrotlla les tires, una mica tortes. Deixa un forat pels ulls!', 'Enrolla las tiras, un poco torcidas. ¡Deja un hueco para los ojos!', 'Wrap the strips around, a bit wonky. Leave a gap for the eyes!'),
        L('Retalla dos cercles blancs i pinta-hi un punt negre.', 'Recorta dos círculos blancos y pinta un punto negro.', 'Cut two white circles and draw a black dot on each.'),
        L('Enganxa els ulls al forat. Hola, mòmia!', 'Pega los ojos en el hueco. ¡Hola, momia!', 'Glue the eyes in the gap. Hello, mummy!'),
      ],
    },
    {
      id: 'snow', season: 'xmas', emoji: '❄️', color: '#3a86ff', mins: 10, view: 'twirl',
      name: L('Floc de neu', 'Copo de nieve', 'Paper snowflake'),
      need: ['white', 'scissors'],
      steps: [
        L('Fes un quadrat: doblega una punta fins a l\'altra vora i talla la tira que sobra.', 'Haz un cuadrado: dobla una esquina hasta el otro borde y corta la tira que sobra.', 'Make a square: fold a corner to the other edge and cut off the extra strip.'),
        L('Doblega el quadrat en triangle.', 'Dobla el cuadrado en triángulo.', 'Fold the square into a triangle.'),
        L('Doblega el triangle per la meitat.', 'Dobla el triángulo por la mitad.', 'Fold the triangle in half.'),
        L('Una altra vegada per la meitat!', '¡Otra vez por la mitad!', 'In half one more time!'),
        L('Retalla formetes als costats i arrodoneix la punta. No tallis tot el costat!', 'Recorta formas en los lados y redondea la punta. ¡No cortes todo el lado!', "Snip little shapes on the sides and round the end. Don't cut the whole side!"),
        L('Desplega a poc a poc… sorpresa!', 'Despliega poco a poco… ¡sorpresa!', 'Unfold slowly… surprise!'),
      ],
    },
    {
      id: 'star', season: 'xmas', emoji: '⭐', color: '#f4a261', mins: 20, view: 'spin',
      name: L('Estrella 3D', 'Estrella 3D', '3D star'),
      need: ['yellow', 'pencil', 'scissors'],
      steps: [
        L('Doblega el paper per la meitat.', 'Dobla el papel por la mitad.', 'Fold the paper in half.'),
        L('Dibuixa 5 punts com a un rellotge: a les 12, les 2, les 5, les 7 i les 10.', 'Dibuja 5 puntos como en un reloj: en las 12, las 2, las 5, las 7 y las 10.', 'Draw 5 dots like on a clock: at 12, 2, 5, 7 and 10.'),
        L('Uneix els punts saltant-ne un cada vegada: surt una estrella!', 'Une los puntos saltándote uno cada vez: ¡sale una estrella!', 'Join the dots, skipping one each time: a star appears!'),
        L('Retalla l\'estrella per la vora, amb el paper doblegat: en surten dues d\'iguals!', 'Recorta la estrella por el borde, con el papel doblado: ¡salen dos iguales!', 'Cut around the star with the paper still folded: you get two the same!'),
        L('Estrella 1: talla des de la punta de dalt fins al mig.', 'Estrella 1: corta desde la punta de arriba hasta el centro.', 'Star 1: cut from the top point to the middle.'),
        L('Estrella 2: talla des de baix, entre les dues potes, fins al mig.', 'Estrella 2: corta desde abajo, entre las dos patas, hasta el centro.', 'Star 2: cut from the bottom, between the two legs, to the middle.'),
        L('Encaixa-les creuades… i ja s\'aguanta dreta!', 'Encájalas cruzadas… ¡y ya se sostiene de pie!', 'Slide them together crosswise… and it stands up!'),
      ],
    },
  ];

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const say = (t) => M.speak(M.t(t).replace(/[¡!¿…]/g, ''), M.lang);
  let craft = null, step = 0, cheer = 0, lastPin = null;

  // ---------- Cork board (localStorage: small JPEGs) ----------
  function loadBoard() { try { return JSON.parse(localStorage.getItem(BOARD_KEY)) || []; } catch (e) { return []; } }
  function saveBoard(list) { localStorage.setItem(BOARD_KEY, JSON.stringify(list.slice(0, MAX_PINS))); }
  function pin(photo) {
    const list = loadBoard();
    const item = { id: 'p' + Date.now(), craft: craft.id, date: new Date().toISOString(), photo };
    list.unshift(item);
    try { saveBoard(list); } catch (e) {
      item.photo = null;                             // no room for the photo: pin the drawing instead
      try { saveBoard(list); } catch (e2) { /* storage blocked */ }
      if (photo) M.speak(M.t(TEXT.noRoom), M.lang);
    }
    lastPin = item.id;
  }

  // ---------- Tisoreta ----------
  function tisoSay(line, speak = true) {
    document.querySelectorAll('.tiso-say').forEach((b) => { b.textContent = M.t(line); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); });
    document.querySelectorAll('.tiso-host').forEach((h) => { h.classList.remove('snip'); void h.offsetWidth; h.classList.add('snip'); });
    if (speak) say(line);
  }

  // ---------- 3D-ish model of the finished craft ----------
  function model(c) {
    if (c.view === 'spin') {
      const half = [ART.star.half(), ART.star.half('#f2b705')];  // the crossing star is a shade darker
      return `<div class="p3d"><div class="spin">${[0, 90, 180, 270].map((a, i) => `<div class="hp" style="transform:rotateY(${a}deg)">${half[i % 2]}</div>`).join('')}</div></div>`;
    }
    return `<div class="p3d"><div class="${c.view}">${ART[c.id].preview()}</div></div>`;
  }

  // ---------- Screens ----------
  const SCREENS = ['home', 'intro', 'build', 'done'];
  function show(name) {
    SCREENS.forEach((s) => { $(s).hidden = s !== name; });
    window.scrollTo(0, 0);
  }

  function renderHome() {
    const pins = loadBoard();
    const card = (c) => {
      const n = pins.filter((p) => p.craft === c.id).length;
      return `<button class="craft" data-id="${c.id}" style="--c:${c.color}">
        <span class="c-pic">${ART[c.id].preview()}</span>
        <b>${M.t(c.name)}</b>
        <small>⏱️ ${c.mins}′ · ${stepsLabel(c)}${n ? ` · 📌${n}` : ''}</small></button>`;
    };
    $('crafts').innerHTML = [['halloween', '🎃', TEXT.halloween], ['xmas', '🎄', TEXT.xmas]].map(([s, e, t]) =>
      `<h2 class="season">${e} ${M.t(t)}</h2><div class="craft-row">${CRAFTS.filter((c) => c.season === s).map(card).join('')}</div>`).join('');
    $('board-count').textContent = pins.length || '';
  }
  const stepsLabel = (c) => `${c.steps.length} ${M.t(L('passos', 'pasos', 'steps'))}`;

  function openIntro(c) {
    craft = c;
    show('intro');
    renderIntro();
    tisoSay(SAY.ready);
  }
  function renderIntro() {
    $('intro-title').textContent = `${craft.emoji} ${M.t(craft.name)}`;
    $('intro-model').innerHTML = model(craft);
    $('need-title').textContent = M.t(TEXT.need);
    $('need').innerHTML = craft.need.map((k) => {
      const m = MAT[k];
      const icon = m.paper ? `<span class="swatch" style="background:${m.paper}"></span>` : `<span class="m-e">${m.e}</span>`;
      return `<li>${icon}<span>${M.t(m.t)}</span></li>`;
    }).join('');
    $('go').textContent = `✂️ ${M.t(TEXT.go)}`;
  }

  function openStep(i, speak = true, keepCheer = false) {
    step = i;
    show('build');
    if (!keepCheer) document.querySelector('.fet-row .tiso-say').textContent = '';
    renderStep();
    if (speak) say(craft.steps[step]);
  }
  function renderStep() {
    const n = craft.steps.length;
    $('step-num').textContent = step + 1;
    $('step-of').textContent = `/ ${n}`;
    $('progress').innerHTML = craft.steps.map((_, k) => `<span class="${k < step ? 'on' : k === step ? 'now' : ''}"></span>`).join('');
    $('art').innerHTML = ART[craft.id].steps[step]();
    $('caption').textContent = M.t(craft.steps[step]);
    $('fet').textContent = `✅ ${M.t(TEXT.done)}`;
  }
  function finish() {
    show('done');
    renderDone();
    M.sounds.win();
    M.confetti();
    tisoSay(SAY.photo, false);
    M.speak(`${M.t(TEXT.finished)} ${M.t(SAY.photo)}`.replace(/[¡!¿]/g, ''), M.lang);
  }
  function renderDone() {
    $('done-model').innerHTML = model(craft);
    $('done-text').textContent = M.t(TEXT.finished);
    $('photo-btn').textContent = `📷 ${M.t(TEXT.photo)}`;
    $('nophoto-btn').textContent = `📌 ${M.t(TEXT.noPhoto)}`;
  }

  // ---------- Cork board overlay ----------
  function openBoard() {
    $('board').hidden = false;
    renderBoard();
  }
  function renderBoard() {
    const pins = loadBoard();
    $('board-title').textContent = `📌 ${M.t(TEXT.board)}`;
    $('pins').innerHTML = pins.length ? pins.map((p, i) => {
      const c = CRAFTS.find((x) => x.id === p.craft) || CRAFTS[0];
      const pic = p.photo ? `<img src="${p.photo}" alt="">` : `<span class="pin-art" style="background:${c.color}22">${ART[c.id].preview()}</span>`;
      return `<button class="polaroid${p.id === lastPin ? ' new' : ''}" data-id="${p.id}" style="--r:${[-4, 3, -2, 5, -5, 2][i % 6]}deg">
        <span class="tack"></span>${pic}<small>${c.emoji} ${esc(M.t(c.name))}<br>${new Date(p.date).toLocaleDateString()}</small></button>`;
    }).join('') : `<p class="empty">${M.t(TEXT.empty)}</p>`;
    lastPin = null;
  }
  function openZoom(id) {
    const p = loadBoard().find((x) => x.id === id);
    if (!p) return;
    const c = CRAFTS.find((x) => x.id === p.craft) || CRAFTS[0];
    $('zoom-pic').innerHTML = p.photo ? `<img src="${p.photo}" alt="">` : `<span class="pin-art big" style="background:${c.color}22">${ART[c.id].preview()}</span>`;
    $('zoom-name').textContent = `${c.emoji} ${M.t(c.name)} · ${new Date(p.date).toLocaleDateString()}`;
    $('zoom').dataset.id = id;
    $('zoom').hidden = false;
  }

  // ---------- Wiring ----------
  $('crafts').addEventListener('click', (e) => {
    const b = e.target.closest('.craft');
    if (!b) return;
    M.sounds.pop();
    openIntro(CRAFTS.find((c) => c.id === b.dataset.id));
  });
  $('intro-back').addEventListener('click', () => { M.sounds.pop(); show('home'); renderHome(); });
  $('go').addEventListener('click', () => { M.sounds.pop(); openStep(0); });
  $('step-back').addEventListener('click', () => {
    M.sounds.pop();
    if (step === 0) { show('intro'); renderIntro(); } else openStep(step - 1);
  });
  $('step-say').addEventListener('click', () => say(craft.steps[step]));
  $('fet').addEventListener('click', () => {
    if ($('fet').disabled) return;
    $('fet').disabled = true;
    M.sounds.match();
    tisoSay(SAY.cheers[cheer++ % SAY.cheers.length], false);
    $('progress').children[step].className = 'on';
    setTimeout(() => {
      $('fet').disabled = false;
      if (step + 1 < craft.steps.length) openStep(step + 1, true, true); else finish();
    }, 900);
  });

  // a photo of the real craft, shrunk so many fit on the device
  $('photo-btn').addEventListener('click', () => { M.sounds.pop(); $('photo-in').click(); });
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
      URL.revokeObjectURL(url);
      $('photo-in').value = '';
      pinAndShow(c.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => { URL.revokeObjectURL(url); $('photo-in').value = ''; };
    img.src = url;
  });
  $('nophoto-btn').addEventListener('click', () => { M.sounds.pop(); pinAndShow(null); });
  function pinAndShow(photo) {
    pin(photo);
    M.sounds.match();
    show('home');
    renderHome();
    openBoard();
    tisoSay(SAY.pinned);
  }

  $('board-btn').addEventListener('click', () => { M.sounds.pop(); openBoard(); });
  $('board-close').addEventListener('click', () => { M.sounds.pop(); $('board').hidden = true; renderHome(); });
  $('pins').addEventListener('click', (e) => {
    const b = e.target.closest('.polaroid');
    if (b) { M.sounds.pop(); openZoom(b.dataset.id); }
  });
  $('zoom-close').addEventListener('click', () => { M.sounds.pop(); $('zoom').hidden = true; });
  $('zoom-del').addEventListener('click', () => {
    if (!confirm(M.t(TEXT.remove))) return;
    try { saveBoard(loadBoard().filter((p) => p.id !== $('zoom').dataset.id)); } catch (e) { /* ignore */ }
    $('zoom').hidden = true;
    renderBoard();
    renderHome();
  });

  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    document.querySelectorAll('.tiso-name').forEach((el) => { el.textContent = NAME[M.lang]; });
    if (!$('home').hidden) renderHome();
    if (!$('intro').hidden) renderIntro();
    if (!$('build').hidden) renderStep();
    if (!$('done').hidden) renderDone();
    if (!$('board').hidden) renderBoard();
  }
  document.querySelectorAll('.tiso-host').forEach((h) => { h.innerHTML = window.TISORETA_SVG; });
  M.mountControls($('controls'));
  M.onLang(renderText);
  M.music.button($('music'));
  M.music.play('workshop');
  show('home');
  renderText();
  tisoSay(SAY.hello, false);
  window.__crafts = () => ({ craft, step, CRAFTS, board: loadBoard(), openStep, finish }); // for automated testing
})();
