(function () {
  const M = window.Mellis;
  const ROUND = 5;             // customers per round
  const INK = '#3a3a5c';
  const ALBUM_KEY = 'mellis.clock.album';

  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const mod = (n, d) => ((n % d) + d) % d;
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Telling the time ----------
  // A time is { h: 1…12, m: 0…55, H: 0…23 (24 h, for the sky and Hard) }.
  const HOURS = {
    ca: ['dotze', 'una', 'dues', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou', 'deu', 'onze', 'dotze'],
    es: ['doce', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'],
    en: ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
  };
  const caArt = (h) => (h === 1 ? 'la una' : 'les ' + HOURS.ca[h]);
  const caDe = (h) => (h === 1 || h === 11 ? "d'" : 'de ') + HOURS.ca[h];
  const esArt = (h) => (h === 1 ? 'la una' : 'las ' + HOURS.es[h]);
  const en = (h) => HOURS.en[h];
  // One form per 5-minute mark (index m / 5); h = this hour, n = the next one.
  // Catalan uses the quarts, counted towards the next hour (un quart de cinc = 4:15).
  const PHRASES = {
    ca: [
      (h) => `${caArt(h)} en punt`,
      (h) => `${caArt(h)} i cinc`,
      (h) => `${caArt(h)} i deu`,
      (h, n) => `un quart ${caDe(n)}`,
      (h, n) => `un quart i cinc ${caDe(n)}`,
      (h, n) => `dos quarts menys cinc ${caDe(n)}`,
      (h, n) => `dos quarts ${caDe(n)}`,
      (h, n) => `dos quarts i cinc ${caDe(n)}`,
      (h, n) => `dos quarts i deu ${caDe(n)}`,
      (h, n) => `tres quarts ${caDe(n)}`,
      (h, n) => `tres quarts i cinc ${caDe(n)}`,
      (h, n) => `${caArt(n)} menys cinc`,
    ],
    es: [
      (h) => `${esArt(h)} en punto`,
      (h) => `${esArt(h)} y cinco`,
      (h) => `${esArt(h)} y diez`,
      (h) => `${esArt(h)} y cuarto`,
      (h) => `${esArt(h)} y veinte`,
      (h) => `${esArt(h)} y veinticinco`,
      (h) => `${esArt(h)} y media`,
      (h, n) => `${esArt(n)} menos veinticinco`,
      (h, n) => `${esArt(n)} menos veinte`,
      (h, n) => `${esArt(n)} menos cuarto`,
      (h, n) => `${esArt(n)} menos diez`,
      (h, n) => `${esArt(n)} menos cinco`,
    ],
    en: [
      (h) => `${en(h)} o'clock`,
      (h) => `five past ${en(h)}`,
      (h) => `ten past ${en(h)}`,
      (h) => `quarter past ${en(h)}`,
      (h) => `twenty past ${en(h)}`,
      (h) => `twenty-five past ${en(h)}`,
      (h) => `half past ${en(h)}`,
      (h, n) => `twenty-five to ${en(n)}`,
      (h, n) => `twenty to ${en(n)}`,
      (h, n) => `quarter to ${en(n)}`,
      (h, n) => `ten to ${en(n)}`,
      (h, n) => `five to ${en(n)}`,
    ],
  };
  // Part of the day for a 24 h hour
  const PERIODS = {
    ca: (H) => (H >= 5 && H < 12 ? 'del matí' : H < 14 && H >= 12 ? 'del migdia' : H >= 14 && H < 20 ? 'de la tarda' : H >= 20 && H < 22 ? 'del vespre' : 'de la nit'),
    es: (H) => (H >= 5 && H < 12 ? 'de la mañana' : H >= 12 && H < 14 ? 'del mediodía' : H >= 14 && H < 21 ? 'de la tarde' : 'de la noche'),
    en: (H) => (H >= 5 && H < 12 ? 'in the morning' : H >= 12 && H < 18 ? 'in the afternoon' : H >= 18 && H < 21 ? 'in the evening' : 'at night'),
  };
  function words(t, withPeriod, lang) {
    const l = lang || M.lang;
    const s = PHRASES[l][t.m / 5](t.h, t.h % 12 + 1);
    return withPeriod ? `${s} ${PERIODS[l](t.H)}` : s;
  }
  const pad = (m) => String(m).padStart(2, '0');
  const digital = (t, h24) => `${h24 ? (t.H || '00') : t.h}:${pad(t.m)}`;
  // "21:30" inside a sentence: shown as digits, spoken in a form the voice reads well
  // (change SPOKEN_24 if a voice reads it badly).
  const ART_24 = { ca: (H) => (H === 1 ? 'la' : 'les'), es: (H) => (H === 1 ? 'la' : 'las'), en: () => '' };
  const SPOKEN_24 = {
    ca: (t) => `${ART_24.ca(t.H)} ${t.H}${t.m ? ' i ' + t.m : ' en punt'}`,
    es: (t) => `${ART_24.es(t.H)} ${t.H}${t.m ? ' y ' + t.m : ' en punto'}`,
    en: (t) => `${t.H}:${pad(t.m)}`,
  };
  const key = (t) => (t.h % 12) * 60 + t.m;           // what the clock face shows
  const fromKey = (k, H) => {
    const h = Math.floor(mod(k, 720) / 60) || 12, m = mod(k, 60);
    return { h, m, H: H === undefined ? h : H };
  };
  const durWords = {
    15: { ca: "un quart d'hora", es: 'un cuarto de hora', en: 'a quarter of an hour' },
    30: { ca: 'mitja hora', es: 'media hora', en: 'half an hour' },
    45: { ca: "tres quarts d'hora", es: 'tres cuartos de hora', en: 'three quarters of an hour' },
    60: { ca: 'una hora', es: 'una hora', en: 'one hour' },
    90: { ca: 'una hora i mitja', es: 'una hora y media', en: 'an hour and a half' },
    120: { ca: 'dues hores', es: 'dos horas', en: 'two hours' },
  };

  // ---------- Levels ----------
  // step: how the minute hand snaps; mins: which minute marks the questions use.
  const LEVELS = {
    1: { style: 'pizza', step: 30, mins: [0, 30, 0, 30] },
    2: { style: 'pizza', step: 15, mins: [15, 45, 15, 45, 30, 0] },
    3: { style: 'classic', step: 5, mins: [5, 10, 20, 25, 35, 40, 50, 55, 15, 45, 30, 0], h24: true },
    4: { style: 'classic', step: 15, mins: [0, 15, 30, 45], expert: true },
  };
  const onGrid = (t, lv) => (lv.expert || lv.step === 5 ? t.m % lv.step === 0 : lv.mins.includes(t.m));

  // ---------- Customers ----------
  // hours: the 24 h hours they come for (so the window shows their sky).
  const CUSTOMERS = [
    { e: '🐻', hours: [7, 8, 9, 10], say: { ca: "Desperta'm a {t}, que vull esmorzar mel!", es: '¡Despiértame a {t}, que quiero desayunar miel!', en: 'Wake me up at {t}, I want honey for breakfast!' } },
    { e: '🐓', hours: [5, 6, 7], say: { ca: 'Haig de cantar a {t}! Quiquiriquí!', es: '¡Tengo que cantar a {t}! ¡Quiquiriquí!', en: 'I must sing at {t}! Cock-a-doodle-doo!' } },
    { e: '🧛', hours: [20, 21, 22, 23], say: { ca: "Desperta'm a {t}, que de dia dormo!", es: '¡Despiértame a {t}, que de día duermo!', en: 'Wake me at {t}, I sleep all day!' } },
    { e: '👸', hours: [18, 19, 20], say: { ca: 'El ball comença a {t}. No vull fer tard!', es: 'El baile empieza a {t}. ¡No quiero llegar tarde!', en: "The ball starts at {t}. I can't be late!" } },
    { e: '🦖', hours: [15, 16, 17], say: { ca: 'Tinc dentista a {t}. Quina por!', es: 'Tengo dentista a {t}. ¡Qué miedo!', en: 'I see the dentist at {t}. Eek!' } },
    { e: '👩‍🚀', hours: [9, 10, 11, 14, 15], say: { ca: 'El meu coet surt a {t}!', es: '¡Mi cohete sale a {t}!', en: 'My rocket leaves at {t}!' } },
    { e: '🐢', hours: [8, 9, 10, 11], say: { ca: "Sempre faig tard! Posa'm l'alarma a {t}.", es: '¡Siempre llego tarde! Ponme la alarma a {t}.', en: "I'm always late! Set my alarm for {t}." } },
    { e: '🦉', hours: [20, 21, 22, 23], say: { ca: 'Surto a caçar a {t}. Uuu-uuu!', es: 'Salgo a cazar a {t}. ¡Uuu-uuu!', en: 'I go hunting at {t}. Hoo-hoo!' } },
    { e: '🧙‍♀️', hours: [18, 19, 20, 21], say: { ca: 'La meva poció bull a {t}!', es: '¡Mi poción hierve a {t}!', en: 'My potion boils at {t}!' } },
    { e: '🐷', hours: [12, 13, 14], say: { ca: 'Dino a {t}. Pizza!', es: 'Como a {t}. ¡Pizza!', en: 'Lunch is at {t}. Pizza!' } },
    { e: '🐶', hours: [16, 17, 18, 19], say: { ca: 'El meu passeig és a {t}. Bup, bup!', es: 'Mi paseo es a {t}. ¡Guau!', en: 'My walk is at {t}. Woof!' } },
    { e: '🤖', hours: [9, 13, 16, 22], say: { ca: "M'endollo a {t}. Bip-bup!", es: 'Me enchufo a {t}. ¡Bip-bup!', en: 'I plug in at {t}. Beep-boop!' } },
  ];
  // Expert: something that takes a while
  const WAITS = [
    { e: '🐷', thing: '🍕', say: { ca: 'La meva pizza triga {d} al forn.', es: 'Mi pizza tarda {d} en el horno.', en: 'My pizza needs {d} in the oven.' } },
    { e: '🐻', thing: '🎂', say: { ca: 'El meu pastís triga {d} a coure’s.', es: 'Mi pastel tarda {d} en hacerse.', en: 'My cake needs {d} to bake.' } },
    { e: '🐢', thing: '🚂', say: { ca: 'El meu tren triga {d} a arribar.', es: 'Mi tren tarda {d} en llegar.', en: 'My train takes {d} to get there.' } },
    { e: '🧛', thing: '😴', say: { ca: 'La meva migdiada dura {d}.', es: 'Mi siesta dura {d}.', en: 'My nap lasts {d}.' } },
    { e: '🦖', thing: '🎬', say: { ca: 'La pel·lícula dura {d}.', es: 'La película dura {d}.', en: 'The film lasts {d}.' } },
    { e: '👩‍🚀', thing: '🌙', say: { ca: 'El viatge a la Lluna dura {d}.', es: 'El viaje a la Luna dura {d}.', en: 'The trip to the Moon takes {d}.' } },
  ];

  const TEXT = {
    title: { ca: 'Rellotgeria Tic-Tac', es: 'Relojería Tic-Tac', en: 'Tic-Tac Clock Shop' },
    ask: { ca: 'Tria un nivell!', es: '¡Elige un nivel!', en: 'Pick a level!' },
    l1: { ca: 'Fàcil', es: 'Fácil', en: 'Easy' },
    l2: { ca: 'Mitjà', es: 'Medio', en: 'Medium' },
    l3: { ca: 'Difícil', es: 'Difícil', en: 'Hard' },
    l4: { ca: 'Experta', es: 'Experta', en: 'Expert' },
    s1: { ca: '🍕 en punt i dos quarts', es: '🍕 en punto y media', en: "🍕 o'clock & half past" },
    s2: { ca: '🍕 un quart, tres quarts', es: '🍕 y cuarto, menos cuarto', en: '🍕 quarter past & to' },
    s3: { ca: '🕐 de 5 en 5 · 🌙 21:00', es: '🕐 de 5 en 5 · 🌙 21:00', en: '🕐 5 minutes · 🌙 21:00' },
    s4: { ca: '⏲️ Quan estarà llest?', es: '⏲️ ¿Cuándo estará listo?', en: '⏲️ When will it be ready?' },
    free: { ca: '🍕 Juga amb el rellotge', es: '🍕 Juega con el reloj', en: '🍕 Play with the clock' },
    clocks: { ca: 'Busco el rellotge que marca {t}!', es: '¡Busco el reloj que marca {t}!', en: "I'm looking for the clock that says {t}!" },
    wordsAsk: { ca: 'Quina hora marca el meu rellotge?', es: '¿Qué hora marca mi reloj?', en: 'What time does my clock say?' },
    now: { ca: 'Ara el rellotge marca {t}.', es: 'Ahora el reloj marca {t}.', en: 'The clock says {t} now.' },
    when: { ca: 'A quina hora acabarà?', es: '¿A qué hora terminará?', en: 'What time will it be done?' },
    nowLabel: { ca: 'Ara', es: 'Ahora', en: 'Now' },
    album: { ca: 'Els meus cucuts', es: 'Mis cucos', en: 'My cuckoos' },
    win: { ca: 'Quina rellotgeria més feliç!', es: '¡Qué relojería más feliz!', en: 'What a happy clock shop!' },
  };
  // Senyor Tic-Tac: short lines, never about what is wrong (no hints)
  const TT = {
    hello: [
      { ca: 'Tic-tac! Un client!', es: '¡Tic-tac! ¡Un cliente!', en: 'Tick-tock! A customer!' },
      { ca: 'Endavant, endavant!', es: '¡Adelante, adelante!', en: 'Come in, come in!' },
      { ca: 'Ai, quina gana de pizza…', es: 'Ay, qué hambre de pizza…', en: 'Oh, I fancy a pizza…' },
      { ca: 'Rellotges com nous!', es: '¡Relojes como nuevos!', en: 'Clocks good as new!' },
    ],
    yes: [
      { ca: 'Perfecte! Em ballen els bigotis!', es: '¡Perfecto! ¡Me bailan los bigotes!', en: 'Perfect! My moustache is dancing!' },
      { ca: 'Bravo, ajudanta!', es: '¡Bravo, ayudante!', en: 'Bravo, helper!' },
      { ca: 'Tic-tac, feina ben feta!', es: '¡Tic-tac, trabajo bien hecho!', en: 'Tick-tock, job well done!' },
      { ca: 'Això es mereix una pizza!', es: '¡Esto se merece una pizza!', en: 'That deserves a pizza!' },
    ],
    reveal: { ca: 'Mira, era així.', es: 'Mira, era así.', en: 'Look, it was like this.' },
  };

  // ---------- The silly cuckoos (album) ----------
  // acc: an emoji on the bird at (ax, ay, size); fx: extra sound
  const CUCKOOS = [
    { id: 'classic', c: '#a0522d', name: { ca: 'Cucut clàssic', es: 'Cuco clásico', en: 'Classic cuckoo' }, call: { ca: 'Cucut!', es: '¡Cucú!', en: 'Cuckoo!' } },
    { id: 'sneezy', c: '#7fb069', acc: '💦', ax: 88, ay: 30, as: 18, fx: 'sneeze', name: { ca: 'Cucut esternudador', es: 'Cuco estornudador', en: 'Sneezy cuckoo' }, call: { ca: 'Cu-cu… ATXIM!', es: 'Cu-cu… ¡ACHÍS!', en: 'Cuck… ACHOO!' } },
    { id: 'sleepy', c: '#8e9aaf', acc: '💤', ax: 82, ay: 12, as: 20, fx: 'yawn', name: { ca: 'Cucut dormilega', es: 'Cuco dormilón', en: 'Sleepy cuckoo' }, call: { ca: 'Cu… cut… zzz', es: 'Cu… cú… zzz', en: 'Cuck… oo… zzz' } },
    { id: 'opera', c: '#e56b6f', acc: '🎤', ax: 86, ay: 46, as: 20, fx: 'opera', name: { ca: 'Cucut cantant', es: 'Cuco cantante', en: 'Opera cuckoo' }, call: { ca: 'Cuuuuu-cuuuuut!', es: '¡Cuuuuu-cúúúú!', en: 'Cuuuuck-ooooo!' } },
    { id: 'pirate', c: '#5c4d7d', acc: '🏴‍☠️', ax: 50, ay: 14, as: 22, name: { ca: 'Cucut pirata', es: 'Cuco pirata', en: 'Pirate cuckoo' }, call: { ca: 'Cucut, arr!', es: '¡Cucú, arr!', en: 'Cuckoo, arr!' } },
    { id: 'king', c: '#ff9f1c', acc: '👑', ax: 50, ay: 16, as: 24, name: { ca: 'Cucut rei', es: 'Cuco rey', en: 'King cuckoo' }, call: { ca: 'Cucut reial!', es: '¡Cucú real!', en: 'Royal cuckoo!' } },
    { id: 'cool', c: '#3a86ff', acc: '🕶️', ax: 56, ay: 36, as: 22, name: { ca: 'Cucut molt guai', es: 'Cuco muy guay', en: 'Cool cuckoo' }, call: { ca: 'Cucut, yeah!', es: '¡Cucú, yeah!', en: 'Cuckoo, yeah!' } },
    { id: 'pizza', c: '#f4a261', acc: '🍕', ax: 88, ay: 44, as: 20, fx: 'yum', name: { ca: 'Cucut pizzer', es: 'Cuco pizzero', en: 'Pizza cuckoo' }, call: { ca: 'Cucut… nyam!', es: 'Cucú… ¡ñam!', en: 'Cuckoo… yum!' } },
    { id: 'party', c: '#ff6fb5', acc: '🎉', ax: 50, ay: 14, as: 22, fx: 'giggle', name: { ca: 'Cucut de festa', es: 'Cuco de fiesta', en: 'Party cuckoo' }, call: { ca: 'Cucut, festa!', es: '¡Cucú, fiesta!', en: 'Cuckoo, party!' } },
    { id: 'wizard', c: '#6a4c93', acc: '🪄', ax: 20, ay: 66, as: 22, fx: 'magic', name: { ca: 'Cucut mag', es: 'Cuco mago', en: 'Wizard cuckoo' }, call: { ca: 'Abracadacucut!', es: '¡Abracadacucú!', en: 'Abracadacuckoo!' } },
    { id: 'space', c: '#90a4ae', acc: '🚀', ax: 18, ay: 60, as: 22, name: { ca: 'Cucut astronauta', es: 'Cuco astronauta', en: 'Astronaut cuckoo' }, call: { ca: 'Cucut… des de la Lluna!', es: 'Cucú… ¡desde la Luna!', en: 'Cuckoo… from the Moon!' } },
    { id: 'detective', c: '#bc6c25', acc: '🔍', ax: 84, ay: 62, as: 20, name: { ca: 'Cucut detectiu', es: 'Cuco detective', en: 'Detective cuckoo' }, call: { ca: 'Cucut! Pista trobada!', es: '¡Cucú! ¡Pista encontrada!', en: 'Cuckoo! Clue found!' } },
    { id: 'fancy', c: '#d4a373', acc: '🎩', ax: 50, ay: 14, as: 24, name: { ca: 'Cucut elegant', es: 'Cuco elegante', en: 'Fancy cuckoo' }, call: { ca: 'Cucut, senyores!', es: '¡Cucú, señoritas!', en: 'Cuckoo, ladies!' } },
    { id: 'rock', c: '#2b2d42', acc: '🎸', ax: 22, ay: 70, as: 24, fx: 'rock', name: { ca: 'Cucut rocker', es: 'Cuco rockero', en: 'Rock cuckoo' }, call: { ca: 'Cucuuut! Rock and roll!', es: '¡Cucúúú! ¡Rock and roll!', en: 'Cuckooo! Rock and roll!' } },
    { id: 'baby', c: '#ffc8dd', acc: '🍼', ax: 86, ay: 50, as: 18, name: { ca: 'Cucut nadó', es: 'Cuco bebé', en: 'Baby cuckoo' }, call: { ca: 'Cucutet!', es: '¡Cuquito!', en: 'Cuckoo-coo!' } },
    { id: 'ghost', c: '#eef0ff', ghost: true, name: { ca: 'Cucut fantasma', es: 'Cuco fantasma', en: 'Ghost cuckoo' }, call: { ca: 'Cucuuuuu-uuuu!', es: '¡Cucúúúú-uuuu!', en: 'Cuckooooo-oooo!' } },
    { id: 'rainbow', c: 'url(#rainbow)', rainbow: true, acc: '🌈', ax: 50, ay: 12, as: 20, name: { ca: 'Cucut de colors', es: 'Cuco arcoíris', en: 'Rainbow cuckoo' }, call: { ca: 'Cucut de colors!', es: '¡Cucú de colores!', en: 'Colourful cuckoo!' } },
    { id: 'frog', c: '#6fd36f', fx: 'boing', name: { ca: 'Cucut granota', es: 'Cuco rana', en: 'Frog cuckoo' }, call: { ca: 'Cuc-rac! Cuc-rac!', es: '¡Cuc-rac! ¡Cuc-rac!', en: 'Cuck-ribbit!' } },
    { id: 'robot', c: '#9aa5b1', acc: '⚙️', ax: 50, ay: 14, as: 20, fx: 'beep', name: { ca: 'Cucut robot', es: 'Cuco robot', en: 'Robot cuckoo' }, call: { ca: 'CU-CUT. BIP.', es: 'CU-CÚ. BIP.', en: 'CUCK-OO. BEEP.' } },
    { id: 'vampire', c: '#3d405b', acc: '🦇', ax: 50, ay: 12, as: 22, name: { ca: 'Cucut vampir', es: 'Cuco vampiro', en: 'Vampire cuckoo' }, call: { ca: 'Cucut… muahaha!', es: 'Cucú… ¡muajaja!', en: 'Cuckoo… mwahaha!' } },
  ];
  const cuckooOf = (id) => CUCKOOS.find((c) => c.id === id);
  function album() {
    try { return JSON.parse(localStorage.getItem(ALBUM_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveAlbum(a) {
    try { localStorage.setItem(ALBUM_KEY, JSON.stringify(a)); } catch (e) { /* private mode */ }
  }

  // ---------- Drawing ----------
  function birdSVG(c, gold) {
    const fill = gold ? '#ffd23f' : c.c;
    const line = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
    const defs = c.rainbow && !gold ? `<defs><linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff595e"/><stop offset=".3" stop-color="#ffca3a"/><stop offset=".55" stop-color="#8ac926"/>
      <stop offset=".8" stop-color="#1982c4"/><stop offset="1" stop-color="#6a4c93"/></linearGradient></defs>` : '';
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="bird-svg${gold ? ' gold' : ''}"${c.ghost && !gold ? ' opacity=".85"' : ''}>${defs}
      <path d="M26 66 l-16 8 l10 -14 z" fill="${fill}" ${line}/>
      <ellipse cx="48" cy="64" rx="28" ry="24" fill="${fill}" ${line}/>
      <ellipse cx="54" cy="70" rx="15" ry="12" fill="#fff" opacity=".55"/>
      <path d="M30 60 q14 -10 26 4 q-12 10 -26 -4 z" fill="#000" opacity=".15"/>
      <circle cx="54" cy="36" r="19" fill="${fill}" ${line}/>
      <path class="beak" d="M70 32 L88 37 L70 43 Z" fill="#ff9f1c" ${line}/>
      <circle cx="60" cy="32" r="4.5" fill="${INK}"/><circle cx="61.5" cy="30.5" r="1.6" fill="#fff"/>
      <path d="M40 86 v8 M54 87 v8" stroke="#ff9f1c" stroke-width="4" stroke-linecap="round"/>
      ${c.acc ? `<text x="${c.ax}" y="${c.ay}" font-size="${c.as}" text-anchor="middle" dominant-baseline="middle">${c.acc}</text>` : ''}
      ${gold ? '<text x="16" y="24" font-size="16">✨</text>' : ''}
    </svg>`;
  }

  const TT_SVG = `<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22 110 q2 -34 38 -36 q36 2 38 36 z" fill="#8d5a2b" stroke="${INK}" stroke-width="3"/>
    <path d="M50 76 l10 14 l10 -14" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="60" cy="46" r="32" fill="#ffd9b8" stroke="${INK}" stroke-width="3"/>
    <path d="M28 40 q-8 -14 4 -20 q2 10 6 12 z M92 40 q8 -14 -4 -20 q-2 10 -6 12 z" fill="#f2f2f2" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="47" cy="40" r="9" fill="#e8fbff" stroke="${INK}" stroke-width="3"/><circle cx="73" cy="40" r="9" fill="#e8fbff" stroke="${INK}" stroke-width="3"/>
    <path d="M56 40 h8" stroke="${INK}" stroke-width="3"/>
    <circle cx="47" cy="41" r="3" fill="${INK}"/><circle cx="73" cy="41" r="3" fill="${INK}"/>
    <ellipse cx="60" cy="52" rx="6" ry="5" fill="#ff9e9e" stroke="${INK}" stroke-width="2.5"/>
    <g class="stache"><path d="M60 58 q-10 -6 -22 0 q-10 6 -14 -2 q2 12 14 10 q12 -1 22 -6 q10 5 22 6 q12 2 14 -10 q-4 8 -14 2 q-12 -6 -22 0 z" fill="#f2f2f2" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></g>
    <path d="M52 70 q8 5 16 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="80" cy="14" r="9" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/><path d="M80 9 v5 h4" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`;

  // Toppings on the pizza clock (fixed, so the pizza never changes under her fingers)
  const PEPPERONI = [[-40, -45], [38, -50], [55, 10], [-58, 8], [-25, 48], [30, 50], [0, -25], [10, 22], [-30, -10], [60, -30]];
  const BASIL = [[-12, -60, 20], [48, -18, -30], [-48, 34, 60], [14, 64, 10], [-60, -30, -50]];
  const polar = (deg, r) => [Math.sin(deg * Math.PI / 180) * r, -Math.cos(deg * Math.PI / 180) * r];
  // Pizza-ish crumbs in the eaten quarters
  const CRUMBS = [[20, 60], [35, 80], [60, 40], [70, 70], [110, 55], [130, 80], [150, 45], [200, 60], [215, 82],
    [240, 40], [255, 70], [290, 55], [305, 82], [330, 40], [345, 66]];

  // Inner markup of a clock (viewBox -125…125). t = minutes since 12:00 (0…719).
  function clockInner(t, o) {
    const mins = mod(t, 60), hourDeg = mod(t, 720) / 2, minDeg = mins * 6;
    let s = '';
    if (o.style === 'pizza') {
      s += `<circle r="118" fill="#f4f1ea" stroke="${INK}" stroke-width="3"/><circle r="110" fill="none" stroke="#9ec5e8" stroke-width="4"/>
        <circle r="102" fill="#e9a94b" stroke="${INK}" stroke-width="3"/><circle r="88" fill="#e05a3a"/><circle r="84" fill="#ffd66b"/>`;
      s += PEPPERONI.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#c0392b" stroke="#8e2a1e" stroke-width="2"/><circle cx="${x - 3}" cy="${y - 3}" r="2.5" fill="#e8705f"/>`).join('');
      s += BASIL.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4" fill="#3fa34d" transform="rotate(${r} ${x} ${y})"/>`).join('');
      // the quarters already eaten (from 12 to the minute hand)
      if (mins > 0) {
        const [ex, ey] = polar(minDeg, 104);
        s += `<path d="M0 0 L0 -104 A104 104 0 ${minDeg > 180 ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)} Z" fill="#f4f1ea"/>`;
        s += CRUMBS.filter(([a]) => a < minDeg - 6).map(([a, r]) => {
          const [x, y] = polar(a, r);
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#e9a94b"/>`;
        }).join('');
      }
      s += [0, 90, 180, 270].map((a) => {
        const [x, y] = polar(a, 102);
        return `<line x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#a0522d" stroke-width="3" stroke-dasharray="7 5"/>`;
      }).join('');
      for (let h = 1; h <= 12; h++) {
        const [x, y] = polar(h * 30, 95);
        s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="num pizza-num">${h}</text>`;
      }
    } else {
      s += `<circle r="106" fill="#fffaf0" stroke="#8d5a2b" stroke-width="9"/><circle r="111" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
      for (let i = 0; i < 60; i++) {
        const big = i % 5 === 0;
        const [x1, y1] = polar(i * 6, big ? 86 : 92), [x2, y2] = polar(i * 6, 98);
        s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="${big ? 3.5 : 1.5}"/>`;
      }
      for (let h = 1; h <= 12; h++) {
        const [x, y] = polar(h * 30, 70);
        s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="num">${h}</text>`;
      }
      if (o.labels) {
        for (let i = 0; i < 12; i++) {
          const [x, y] = polar(i * 30, 119);
          s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="mnum">${pad(i * 5)}</text>`;
        }
      }
    }
    // hands: short fat hour hand, long thin red minute hand
    s += `<g transform="rotate(${hourDeg})"><path d="M-7 12 L-6 -46 Q0 -58 6 -46 L7 12 Z" fill="${INK}" stroke="#fff" stroke-width="2.5"/>${o.knobs ? `<circle cy="-50" r="11" fill="#3a86ff" stroke="${INK}" stroke-width="3"/>` : ''}</g>`;
    s += `<g transform="rotate(${minDeg})"><path d="M-3.5 16 L-3 -80 Q0 -88 3 -80 L3.5 16 Z" fill="#e63946" stroke="${INK}" stroke-width="1.5"/>${o.knobs ? `<circle cy="-82" r="11" fill="#e63946" stroke="${INK}" stroke-width="3"/>` : ''}</g>`;
    s += o.style === 'pizza'
      ? `<circle r="10" fill="#333" stroke="${INK}" stroke-width="2"/><circle r="4" fill="#c0392b"/>`
      : `<circle r="8" fill="${INK}"/>`;
    return s;
  }
  const clockSVG = (t, o) => `<svg class="clock" viewBox="-125 -125 250 250" xmlns="http://www.w3.org/2000/svg">${clockInner(t, o)}</svg>`;

  // A clock whose hands can be dragged. Keeps one continuous "minutes since 12:00",
  // so turning the minute hand past 12 moves the hour on (or back), like a real clock.
  function makeClock(svg, o) {
    let raw = 0, drag = null, prevA = 0;
    const st = { style: o.style, step: o.step, labels: o.labels, knobs: !!o.interactive };
    const snapped = () => mod(Math.round(raw / st.step) * st.step, 720);
    const draw = () => { svg.innerHTML = clockInner(snapped(), st); };
    function angleOf(e) {
      const r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 250 - 125, y = (e.clientY - r.top) / r.height * 250 - 125;
      return { a: mod(Math.atan2(x, -y) * 180 / Math.PI, 360), d: Math.hypot(x, y) };
    }
    const gap = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
    svg.addEventListener('pointerdown', (e) => {
      if (!st.knobs || (o.locked && o.locked())) return;
      const { a, d } = angleOf(e), t = snapped();
      if (d < 14) return;
      const gm = gap(a, mod(t, 60) * 6), gh = gap(a, t / 2);
      drag = gm + 12 < gh ? 'min' : gh + 12 < gm ? 'hour' : d > 62 ? 'min' : 'hour';
      prevA = a;
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* synthetic event */ }
      move(e);
      e.preventDefault();
    });
    function move(e) {
      if (!drag) return;
      const { a } = angleOf(e), before = snapped();
      if (drag === 'min') {
        let delta = a - prevA;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        raw += delta / 6;
        prevA = a;
      } else {
        const mm = mod(snapped(), 60);
        raw = mod(Math.round(a / 30 - mm / 60), 12) * 60 + mm;
      }
      if (snapped() !== before) { M.sounds.tick(); draw(); if (o.onChange) o.onChange(); }
    }
    svg.addEventListener('pointermove', move);
    const up = () => { if (!drag) return; drag = null; raw = snapped(); if (o.onRelease) o.onRelease(); };
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    return {
      set(t) { raw = mod(t, 720); draw(); },
      get: snapped,
      config(c) { Object.assign(st, c); draw(); },
    };
  }

  // ---------- Game state ----------
  let level = 1, lv = LEVELS[1], served = 0, earned = [], customers = [], modes = [], q = null, busy = false;
  const round = M.round({ heartsEl: $('hearts'), onOut: () => start(level) });
  const clock = makeClock($('clock'), { style: 'pizza', step: 30, interactive: true, locked: () => busy });

  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    $('ask').textContent = M.t(TEXT.ask);
    [1, 2, 3, 4].forEach((i) => {
      $(`l${i}-name`).textContent = M.t(TEXT['l' + i]);
      $(`l${i}-sub`).textContent = M.t(TEXT['s' + i]);
    });
    $('free-btn').textContent = M.t(TEXT.free);
    $('album-title').textContent = M.t(TEXT.album);
    $('win-text').textContent = M.t(TEXT.win);
    if (q && !$('play').hidden) { renderRequest(); if (!$('now-label').hidden) nowLabel(); }
    if (!$('free').hidden) freeRead();
  }

  M.mountControls($('controls'));
  M.onLang(renderText);
  ['tictac-levels', 'tictac', 'win-tt'].forEach((id) => { $(id).innerHTML = TT_SVG; });
  M.music.button($('music'));
  M.music.button($('music-levels'));
  M.music.play('clock');
  renderText();

  // ---------- Questions ----------
  function timeFor(customer) {
    const H = pick(customer.hours), m = pick(lv.mins);
    return { h: H % 12 || 12, m, H };
  }
  // Wrong options a child would really pick: the hour before/after (the quarts trap),
  // swapped hands, another minute mark, and in Hard 15:00 read as 5.
  function decoys(ans, n, extra) {
    const out = [], seen = new Set([key(ans)]);
    const add = (t) => {
      if (!t || out.length >= n) return;
      const k = key(t);
      if (seen.has(k) || !onGrid(t, lv)) return;
      seen.add(k);
      out.push({ ...t, H: (t.h % 12) + (ans.H >= 12 ? 12 : 0) });   // same half of the day as the answer
    };
    const near = (dh, m) => fromKey((ans.h + dh) * 60 + (m === undefined ? ans.m : m), ans.H);
    const pool = [
      ...(extra || []),
      lv.h24 && ans.H > 12 && ans.H - 10 <= 12 ? { h: ans.H - 10, m: ans.m, H: ans.H } : null,
      near(pick([1, -1])),
      ans.m % 5 === 0 && ans.m > 0 ? { h: ans.m / 5, m: (ans.h % 12) * 5 } : null,
      near(0, pick(lv.mins.filter((m) => m !== ans.m))),
      near(pick([1, -1]), pick(lv.mins)),
      near(1), near(-1), near(2), near(0, mod(ans.m + 30, 60)),
    ].filter(Boolean);
    pool.forEach(add);
    for (let i = 0; out.length < n && i < 40; i++) add(near(pick([-3, -2, -1, 0, 1, 2, 3]), pick(lv.mins)));
    return out;
  }

  let used = new Set();   // no repeated answers within a round
  function newQuestion(i) {
    let q1;
    for (let tries = 0; tries < 12; tries++) {
      q1 = makeQuestion(i);
      if (!used.has(key(q1.ans))) break;
    }
    used.add(key(q1.ans));
    return q1;
  }
  function makeQuestion(i) {
    const mode = modes[i];
    if (lv.expert) {
      const w = customers[i], d = pick([15, 30, 45, 60, 90, 120]);
      const H0 = pick([9, 10, 11, 15, 16, 17, 18]), now = { h: H0 % 12 || 12, m: pick(lv.mins), H: H0 };
      const end = fromKey(key(now) + d, H0 + Math.floor((now.m + d) / 60));
      const extra = [fromKey(key(end) + 15), fromKey(key(end) - 15), now, fromKey(key(now) - d), fromKey(key(end) + 60)];
      return { mode, who: w, ans: end, now, d, decoys: decoys(end, 2, shuffle(extra)) };
    }
    const c = customers[i], ans = timeFor(c);
    return { mode, who: c, ans, decoys: decoys(ans, 2) };
  }

  // The time as said in the request: words, or 24 h digits in Hard
  function reqTime(lang) {
    if (lv.h24 && q.mode !== 'words') {
      return { show: `${ART_24[lang](q.ans.H)} <b class="dig">${q.ans.H}:${pad(q.ans.m)}</b>`.trim(), say: SPOKEN_24[lang](q.ans) };
    }
    const w = words(q.ans, false, lang);
    return { show: `<b>${w}</b>`, say: w };
  }
  function requestText(lang) {
    const T = (o) => o[lang];
    if (lv.expert) {
      const now = words(q.now, false, lang);
      const a = T(q.who.say).replace('{d}', T(durWords[q.d]));
      const b = T(TEXT.now).replace('{t}', now);
      const showNow = q.mode === 'clocks' ? ` ${b.replace(now, `<b>${now}</b>`)}` : '';
      return {
        show: `${a.replace(T(durWords[q.d]), `<b>${T(durWords[q.d])}</b>`)}${showNow} ${T(TEXT.when)}`,
        say: `${a} ${b} ${T(TEXT.when)}`,
      };
    }
    if (q.mode === 'words') return { show: T(TEXT.wordsAsk), say: T(TEXT.wordsAsk) };
    const tpl = q.mode === 'clocks' ? T(TEXT.clocks) : T(q.who.say);
    const t = reqTime(lang);
    return { show: tpl.replace('{t}', t.show), say: tpl.replace('{t}', t.say) };
  }
  function renderRequest() { $('req').innerHTML = requestText(M.lang).show; }
  function sayRequest() { M.speak(requestText(M.lang).say, M.lang); }

  // Sky in the shop window for the customer's hour
  function sky(H) {
    const cls = H >= 6 && H < 8 ? 'dawn' : H >= 8 && H < 18 ? 'day' : H >= 18 && H < 21 ? 'dusk' : 'night';
    $('window').className = 'window ' + cls;
    $('sky-body').textContent = cls === 'night' ? '🌙' : '☀️';
    return cls;
  }

  // ---------- Round flow ----------
  function start(lvl) {
    level = lvl;
    lv = LEVELS[lvl];
    round.start();
    served = 0;
    earned = [];
    used = new Set();
    customers = shuffle((lv.expert ? WAITS : CUSTOMERS).slice()).slice(0, ROUND);
    modes = lv.expert
      ? ['set'].concat(shuffle(['clocks', 'words', 'set', 'clocks']))
      : ['set'].concat(shuffle(['clocks', 'words', 'set', pick(['clocks', 'words'])]));
    clock.config({ style: lv.style, step: lv.step, labels: !!lv.h24 || !!lv.expert });
    $('levels').hidden = true;
    $('win').hidden = true;
    $('play').hidden = false;
    $('progress').innerHTML = '<span>🕰️</span>'.repeat(ROUND);
    next();
  }

  function next() {
    q = newQuestion(served);
    busy = false;
    $('bird').innerHTML = '';
    $('house').classList.remove('open', 'oops');
    $('call').hidden = true;
    const cust = $('customer');
    $('who').textContent = q.who.e;
    $('thing').textContent = q.who.thing || '';
    cust.className = 'customer';
    void cust.offsetWidth;
    cust.classList.add('arrive');
    sky(lv.expert ? q.now.H : q.ans.H);
    renderRequest();
    renderWork();
    M.sounds.boing();
    setTimeout(sayRequest, 350);
  }

  function renderWork() {
    const wrap = $('clock-wrap'), opts = $('opts');
    const all = shuffle([q.ans].concat(q.decoys));
    wrap.className = 'clock-wrap' + (lv.expert ? ' with-now' : '');
    opts.className = 'opts';
    opts.innerHTML = '';
    $('badge').hidden = true;
    $('now-label').hidden = true;
    if (q.mode === 'set') {
      wrap.hidden = false;
      $('done').hidden = false;
      clock.config({ knobs: true });
      // never start on the answer, so ✅ without moving can't win
      let startT = lv.expert ? key(q.now) : key(pick(q.decoys));
      if (startT === key(q.ans)) startT = key(q.ans) + lv.step * 2;
      clock.set(startT);
      if (lv.expert) nowLabel();
    } else if (q.mode === 'clocks') {
      wrap.hidden = true;
      $('done').hidden = true;
      opts.classList.add('clock-opts');
      const o = { style: lv.style, labels: false };
      opts.innerHTML = all.map((t) => `<button class="opt-clock" data-k="${key(t)}">${clockSVG(key(t), o)}</button>`).join('');
    } else {
      wrap.hidden = false;
      wrap.classList.add('small');
      $('done').hidden = true;
      clock.config({ knobs: false });
      const shown = lv.expert ? q.now : q.ans;
      clock.set(key(shown));
      if (lv.expert) nowLabel();
      let list = all.map((t) => ({ t, w: words(t, !!lv.h24) }));
      if (lv.h24) {
        // Hard: the sky tells morning from night, so one option is the right time at the wrong part of the day
        const flip = { ...q.ans, H: mod(q.ans.H + 12, 24) };
        list = shuffle([{ t: q.ans, w: words(q.ans, true) }, { t: flip, w: words(flip, true), bad: true },
          { t: q.decoys[0], w: words(q.decoys[0], true) }]);
        $('badge').hidden = false;
        $('badge').textContent = $('sky-body').textContent;
      }
      opts.classList.add('word-opts');
      opts.innerHTML = list.map((x) => `<button class="opt-word" data-k="${x.bad ? -1 : key(x.t)}">${x.w}</button>`).join('');
    }
  }

  function nowLabel() {
    $('now-label').hidden = false;
    $('now-label').textContent = `${M.t(TEXT.nowLabel)}: ${words(q.now)}`;
  }

  $('done').addEventListener('click', () => {
    if (busy || q.mode !== 'set') return;
    answer(clock.get() === key(q.ans), null);
  });
  $('opts').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || busy) return;
    answer(+b.dataset.k === key(q.ans), b);
  });

  function answer(ok, btn) {
    busy = true;
    if (ok) {
      if (btn) btn.classList.add('right');
      happy();
      return;
    }
    if (btn) btn.classList.add('wrong');
    $('customer').classList.remove('arrive', 'nope'); void $('customer').offsetWidth;
    $('customer').classList.add('nope');
    $('house').classList.add('oops');
    round.wrong('c' + served).then(({ reveal }) => {
      $('house').classList.remove('oops');
      if (btn) btn.classList.remove('wrong');
      if (!reveal) { busy = false; return; }
      // 2nd miss: show the right answer, then the customer leaves
      if (q.mode === 'set') { clock.set(key(q.ans)); $('clock-wrap').classList.add('reveal'); }
      $('opts').querySelectorAll('button').forEach((b) => { if (+b.dataset.k === key(q.ans)) b.classList.add('right'); });
      $('req').innerHTML = `${M.t(TT.reveal)} <b>${lv.h24 ? `${q.ans.H}:${pad(q.ans.m)} · ` : ''}${words(q.ans, !!lv.h24)}</b>`;
      M.speak(M.t(TT.reveal), M.lang);
      setTimeout(() => leave(false), 3200);
    });
  }

  // Right answer: the cuckoo pops out, Tic-Tac's moustache dances
  function happy() {
    const c = pick(CUCKOOS);
    earned.push(c.id);
    const a = album();
    a[c.id] = Math.max(a[c.id] || 0, 1);
    saveAlbum(a);
    M.sounds.match();
    $('customer').classList.remove('arrive'); void $('customer').offsetWidth;
    $('customer').classList.add('yay');
    $('tictac').classList.add('dance');
    $('bird').innerHTML = birdSVG(c);
    $('house').classList.add('open');
    setTimeout(() => { M.sounds.cuckoo(); cuckooFx(c); }, 250);
    $('call').textContent = M.t(c.call);
    $('call').hidden = false;
    $('req').innerHTML = M.t(pick(TT.yes));
    M.speak(M.t(c.call), M.lang, { pitch: 1.9, rate: 1.05 });
    $('progress').children[served].classList.add('done');
    setTimeout(() => leave(true), 2600);
  }
  function cuckooFx(c) {
    const fx = { sneeze: 'sneeze', giggle: 'giggle', boing: 'boing', yum: 'pop', magic: 'match', rock: 'raspberry', beep: 'flip', yawn: 'miss', opera: 'win' }[c.fx];
    if (fx) setTimeout(() => M.sounds[fx](), 500);
  }
  function leave(won) {
    $('tictac').classList.remove('dance');
    $('clock-wrap').classList.remove('reveal');
    if (!won) $('progress').children[served].classList.add('done', 'missed');
    served++;
    if (served === ROUND) party(); else next();
  }

  function party() {
    const stars = round.stars();
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('parade').innerHTML = earned.map((id) => `<div>${birdSVG(cuckooOf(id), stars === 3)}</div>`).join('');
    if (stars === 3) {
      const a = album();
      earned.forEach((id) => { a[id] = 2; });
      saveAlbum(a);
    }
    $('win-tt').classList.add('dance');
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    M.speak(M.t(TEXT.win).replace(/[¡!]/g, ''), M.lang);
  }

  // ---------- Album ----------
  function openAlbum() {
    const a = album();
    const have = CUCKOOS.filter((c) => a[c.id]).length;
    $('album-count').textContent = `${have} / ${CUCKOOS.length}`;
    $('album-name').textContent = '';
    $('album-grid').innerHTML = CUCKOOS.map((c) => (a[c.id]
      ? `<button class="album-item${a[c.id] === 2 ? ' gold' : ''}" data-id="${c.id}">${birdSVG(c, a[c.id] === 2)}</button>`
      : '<div class="album-item locked">❔</div>')).join('');
    $('album').hidden = false;
  }
  $('album-btn').addEventListener('click', () => { M.sounds.pop(); openAlbum(); });
  $('album-close').addEventListener('click', () => { M.sounds.pop(); $('album').hidden = true; });
  $('album-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.album-item[data-id]');
    if (!b) return;
    const c = cuckooOf(b.dataset.id);
    b.classList.remove('hop'); void b.offsetWidth; b.classList.add('hop');
    $('album-name').textContent = M.t(c.name);
    M.sounds.cuckoo();
    cuckooFx(c);
    M.speak(M.t(c.call), M.lang, { pitch: 1.9, rate: 1.05 });
  });

  // ---------- Free play ----------
  let freeStyle = 'pizza', pm = false;
  const freeClock = makeClock($('free-clock'), {
    style: 'pizza', step: 5, interactive: true, labels: false,
    onChange: freeRead, onRelease: () => freeSay(),
  });
  function freeTime() {
    const t = fromKey(freeClock.get());
    t.H = (t.h % 12) + (pm ? 12 : 0);
    return t;
  }
  function freeRead() {
    const t = freeTime();
    $('free-digital').textContent = `${digital(t, true)}  ${pm ? '🌙' : '☀️'}`;
    $('free-words').textContent = words(t, true);
  }
  function freeSay() { M.speak(words(freeTime(), true), M.lang); }
  $('free-btn').addEventListener('click', () => {
    M.sounds.pop();
    $('levels').hidden = true;
    $('free').hidden = false;
    freeClock.set(0);
    freeRead();
  });
  $('free-back').addEventListener('click', () => { M.sounds.pop(); $('free').hidden = true; $('levels').hidden = false; });
  $('free-style').addEventListener('click', () => {
    M.sounds.flip();
    freeStyle = freeStyle === 'pizza' ? 'classic' : 'pizza';
    $('free-style').textContent = freeStyle === 'pizza' ? '🕐' : '🍕';
    freeClock.config({ style: freeStyle, labels: freeStyle === 'classic' });
  });
  $('free-half').addEventListener('click', () => {
    M.sounds.flip();
    pm = !pm;
    $('free-half').textContent = pm ? '☀️' : '🌙';
    freeRead();
    freeSay();
  });
  $('free-say').addEventListener('click', () => { M.sounds.pop(); freeSay(); });

  // ---------- Buttons ----------
  $('say').addEventListener('click', () => { M.sounds.pop(); if (!busy) sayRequest(); });
  document.querySelectorAll('.level').forEach((b) =>
    b.addEventListener('click', () => { M.sounds.pop(); start(+b.dataset.level); }));
  function toLevels() {
    $('play').hidden = true;
    $('win').hidden = true;
    $('levels').hidden = false;
    $('win-tt').classList.remove('dance');
  }
  $('again').addEventListener('click', () => { M.sounds.pop(); start(level); });
  $('other').addEventListener('click', () => { M.sounds.pop(); toLevels(); });

  // test hook
  window.__clock = () => ({ q, level, served, busy, t: clock.get(), key, words, PHRASES });
})();
