// El calendari d'en Full: missions on a real month page of the real year (Monday first).
// Levels: the week → the month → jumps (in 3 days, a week ago) → the year.
// Important dates: Mallorca + Spain (EVENTS). Mellis rule via Mellis.round().
(function () {
  const M = window.Mellis;
  const { pick, shuffle } = M;
  const $ = (id) => document.getElementById(id);
  const L = (ca, es, en) => ({ ca, es, en });
  const tx = (ca, es, en) => ({ ca, es, en })[M.lang];
  const ROUND = 8;
  const ALBUM_KEY = 'mellis.memory.calendar';   // { 'month-sticker': 1 | 2 (golden) }: the album started in the old Memory
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ---------- Words ----------
  const DAYS = {
    ca: ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge'],
    es: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  };
  const DAYS_PL = {
    ca: ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabtes', 'diumenges'],
    es: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados', 'domingos'],
    en: ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'],
  };
  const DOW = { ca: ['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'], es: ['L', 'M', 'X', 'J', 'V', 'S', 'D'], en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] };
  const MONTHS = {
    ca: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  const SEASONS = ['winter', 'spring', 'summer', 'autumn'];
  const SEASON_NAME = { winter: L('hivern', 'invierno', 'winter'), spring: L('primavera', 'primavera', 'spring'), summer: L('estiu', 'verano', 'summer'), autumn: L('tardor', 'otoño', 'autumn') };
  const SEASON_ICON = { winter: '❄️', spring: '🌸', summer: '☀️', autumn: '🍂' };
  const MONTH_SEASON = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
  const ORD = { ca: ['primer', 'segon', 'tercer', 'quart'], es: ['primer', 'segundo', 'tercer', 'cuarto'], en: ['first', 'second', 'third', 'fourth'] };
  const day = (i) => DAYS[M.lang][i];
  const month = (m) => MONTHS[M.lang][m];
  // "de març" / "d'abril" / "de marzo" / "March"
  const ofMonth = (m) => tx((/^[aeiou]/.test(MONTHS.ca[m]) ? "d'" : 'de ') + MONTHS.ca[m], 'de ' + MONTHS.es[m], MONTHS.en[m]);
  const nth = (n) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
  const theDay = (d) => tx(`el ${d}`, `el ${d}`, `the ${nth(d)}`);
  const pretend = (d) => tx(`Fem veure que avui és el ${d}.`, `Imagina que hoy es el ${d}.`, `Let's pretend today is the ${nth(d)}.`);

  // ---------- Important dates (Mallorca + Spain) ----------
  // [month 1-12, day, emoji, name, tells?]. Names fit after "fins a …" / "hasta …" / "until …".
  const FIXED = [
    [1, 1, '🎉', L("Cap d'Any", 'Año Nuevo', "New Year's Day")],
    [1, 6, '👑', L('Reis', 'Reyes', "Three Kings' Day")],
    [1, 17, '🔥', L('Sant Antoni', 'Sant Antoni', 'Sant Antoni')],
    [3, 1, '🏝️', L('el Dia de les Illes Balears', 'el Día de las Islas Baleares', 'Balearic Islands Day')],
    [3, 20, '🌸', L('el primer dia de primavera', 'el primer día de primavera', 'the first day of spring')],
    [4, 23, '📚', L('Sant Jordi', 'Sant Jordi', 'Sant Jordi, Book Day')],
    [5, 1, '💪', L('la Festa del Treball', 'el Día del Trabajo', 'Labour Day')],
    [6, 21, '☀️', L("el primer dia d'estiu", 'el primer día de verano', 'the first day of summer')],
    [6, 24, '🎆', L('Sant Joan', 'San Juan', 'Sant Joan')],
    [8, 15, '🏖️', L("la Mare de Déu d'Agost", 'la Virgen de Agosto', 'the August holiday'), true],
    [9, 23, '🍂', L('el primer dia de tardor', 'el primer día de otoño', 'the first day of autumn')],
    [10, 12, '🇪🇸', L('la Festa Nacional', 'la Fiesta Nacional', "Spain's National Day")],
    [10, 21, '🍩', L('les Verges', 'las Vírgenes', 'Les Verges')],
    [10, 31, '🎃', L('Halloween', 'Halloween', 'Halloween')],
    [11, 1, '🌼', L('Tots Sants', 'Todos los Santos', "All Saints' Day")],
    [12, 6, '📜', L('el Dia de la Constitució', 'el Día de la Constitución', 'Constitution Day')],
    [12, 21, '❄️', L("el primer dia d'hivern", 'el primer día de invierno', 'the first day of winter')],
    [12, 25, '🎄', L('Nadal', 'Navidad', 'Christmas Day')],
    [12, 31, '🕛', L("la Nit de Cap d'Any", 'Nochevieja', "New Year's Eve")],
  ];
  // Easter Sunday (Gregorian), for the dates that move
  function easter(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mo - 1, da);
  }
  function eventsOf(y) {
    const list = FIXED.map(([m, d, e, name, tells]) => ({ m: m - 1, d, e, name, tells }));   // tells: the name gives the month away
    const E = easter(y);
    const carnival = new Date(y, E.getMonth(), E.getDate() - 49);   // the Sunday of sa Rua
    list.push({ m: E.getMonth(), d: E.getDate(), e: '🐣', name: L('Pasqua', 'Pascua', 'Easter Sunday') });
    list.push({ m: carnival.getMonth(), d: carnival.getDate(), e: '🎭', name: L('Carnaval', 'Carnaval', 'Carnival') });
    return list;
  }
  const until = (ev) => tx(`fins a ${ev.name.ca}`.replace('a el ', 'al '), `hasta ${ev.name.es}`, `until ${ev.name.en}`);

  // ---------- The page ----------
  const NOW = new Date();
  const YEAR = NOW.getFullYear();
  const EVENTS = eventsOf(YEAR);
  let pageM = NOW.getMonth();          // month of the page she plays on
  const daysIn = (m) => new Date(YEAR, m + 1, 0).getDate();
  const firstDow = (m) => (new Date(YEAR, m, 1).getDay() + 6) % 7;   // Monday = 0
  const dowOf = (d) => (firstDow(pageM) + d - 1) % 7;
  const eventsIn = (m) => EVENTS.filter((ev) => ev.m === m);
  const tail = () => (7 - (firstDow(pageM) + daysIn(pageM)) % 7) % 7;   // next month's days that fit in the last row

  // ---------- Missions ----------
  // { key, text(), kind: 'grid' | 'opts', right: [ids], ids?: [option ids], label?(id), mark?: day, next?: true }
  const sample = (list, n) => shuffle(list.slice()).slice(0, n);
  const weekOpts = { ids: [0, 1, 2, 3, 4, 5, 6], label: (i) => cap(day(i)) };
  const monthOpts = (m) => ({ ids: [m, ...sample(MONTHS.ca.map((_, i) => i).filter((i) => i !== m), 3)].sort((a, b) => a - b), label: (i) => cap(month(i)) });
  const numOpts = (n, pool) => ({ ids: [n, ...sample((pool || [n - 2, n - 1, n + 1, n + 2, n + 3]).filter((v) => v > 0 && v !== n), 3)].sort((a, b) => a - b), label: (i) => String(i) });
  const seasonOpts = { ids: SEASONS, label: (s) => `${SEASON_ICON[s]} ${cap(M.t(SEASON_NAME[s]))}` };
  const D = (d) => 'd' + d;

  const MAKERS = {
    // The week: yesterday, today, tomorrow, weekend
    1: [
      () => { const i = rand(0, 6), fwd = Math.random() < 0.5;
        return { key: `seq${fwd}${i}`, kind: 'opts', ...weekOpts, right: [(i + (fwd ? 1 : 6)) % 7],
          text: () => (fwd ? tx(`Quin dia ve després de ${day(i)}?`, `¿Qué día viene después del ${day(i)}?`, `Which day comes after ${day(i)}?`)
            : tx(`Quin dia ve abans de ${day(i)}?`, `¿Qué día viene antes del ${day(i)}?`, `Which day comes before ${day(i)}?`)) }; },
      () => { const i = rand(0, 6), fwd = Math.random() < 0.5;
        return { key: `rel${fwd}${i}`, kind: 'opts', ...weekOpts, right: [(i + (fwd ? 1 : 6)) % 7],
          text: () => (fwd ? tx(`Avui és ${day(i)}. Quin dia serà demà?`, `Hoy es ${day(i)}. ¿Qué día será mañana?`, `Today is ${day(i)}. What day is tomorrow?`)
            : tx(`Avui és ${day(i)}. Quin dia era ahir?`, `Hoy es ${day(i)}. ¿Qué día fue ayer?`, `Today is ${day(i)}. What day was yesterday?`)) }; },
      () => { const d = rand(3, daysIn(pageM) - 2), k = pick([1, -1, 2]);
        return { key: `near${k}:${d}`, kind: 'grid', mark: d, right: [D(d + k)],
          text: () => `${pretend(d)} ` + (k === 1 ? tx('Toca demà.', 'Toca mañana.', 'Tap tomorrow.') : k === -1 ? tx('Toca ahir.', 'Toca ayer.', 'Tap yesterday.')
            : tx('Toca demà passat.', 'Toca pasado mañana.', 'Tap the day after tomorrow.')) }; },
      () => { const i = rand(0, 6);
        return { key: `any${i}`, kind: 'grid', right: range(1, daysIn(pageM)).filter((d) => dowOf(d) === i).map(D),
          text: () => tx(`Toca un ${day(i)}.`, `Toca un ${day(i)}.`, `Tap a ${day(i)}.`) }; },
      () => ({ key: 'weekend', kind: 'grid', right: range(1, daysIn(pageM)).filter((d) => dowOf(d) > 4).map(D),
        text: () => tx('Toca un dia del cap de setmana.', 'Toca un día del fin de semana.', 'Tap a weekend day.') }),
    ],
    // The month: dates and days of the week
    2: [
      () => { const d = rand(1, daysIn(pageM));
        return { key: `dow${d}`, kind: 'opts', ...weekOpts, right: [dowOf(d)],
          text: () => tx(`Quin dia de la setmana és el ${d}?`, `¿Qué día de la semana es el ${d}?`, `What day of the week is the ${nth(d)}?`) }; },
      () => { const i = rand(0, 6), k = rand(0, 3), d = 1 + ((i - firstDow(pageM) + 7) % 7) + 7 * k;
        return { key: `nth${k}:${i}`, kind: 'grid', right: [D(d)],
          text: () => tx(`Toca el ${ORD.ca[k]} ${day(i)} del mes.`, `Toca el ${ORD.es[k]} ${day(i)} del mes.`, `Tap the ${ORD.en[k]} ${day(i)} of the month.`) }; },
      () => ({ key: 'last', kind: 'grid', right: [D(daysIn(pageM))],
        text: () => tx("Toca l'últim dia del mes.", 'Toca el último día del mes.', 'Tap the last day of the month.') }),
      () => { const i = rand(0, 6), n = range(1, daysIn(pageM)).filter((d) => dowOf(d) === i).length;
        return { key: `count${i}`, kind: 'opts', ...numOpts(n, [3, 4, 5, 6]), right: [n],
          text: () => tx(`Quants ${DAYS_PL.ca[i]} té aquest mes?`, `¿Cuántos ${DAYS_PL.es[i]} tiene este mes?`, `How many ${DAYS_PL.en[i]} are there this month?`) }; },
      () => ({ key: 'len', kind: 'opts', ...numOpts(daysIn(pageM), [28, 29, 30, 31]), right: [daysIn(pageM)],
        text: () => tx('Quants dies té aquest mes?', '¿Cuántos días tiene este mes?', 'How many days does this month have?') }),
      () => { const ev = pick(eventsIn(pageM)); if (!ev) return null;
        return { key: `evdow${ev.d}`, kind: 'opts', ...weekOpts, right: [dowOf(ev.d)],
          text: () => tx(`${ev.e} ${cap(ev.name.ca)}: quin dia de la setmana és?`, `${ev.e} ${cap(ev.name.es)}: ¿qué día de la semana es?`, `${ev.e} ${cap(ev.name.en)}: what day of the week is it?`) }; },
      () => { const ev = pick(eventsIn(pageM)); if (!ev) return null;
        return { key: `evtap${ev.d}`, kind: 'grid', right: [D(ev.d)],
          text: () => tx(`Troba al calendari: ${ev.name.ca}.`, `Busca en el calendario: ${ev.name.es}.`, `Find on the calendar: ${ev.name.en}.`) }; },
    ],
    // Jumps: in 3 days, 4 days ago, one week later
    3: [
      () => { const k = rand(2, 6), d = rand(1, daysIn(pageM) - k);
        return { key: `in${k}:${d}`, kind: 'grid', mark: d, right: [D(d + k)],
          text: () => `${pretend(d)} ` + tx(`Toca el dia d'aquí a ${k} dies.`, `Toca el día de dentro de ${k} días.`, `Tap the day ${k} days from now.`) }; },
      () => { const k = rand(2, 6), d = rand(k + 1, daysIn(pageM));
        return { key: `ago${k}:${d}`, kind: 'grid', mark: d, right: [D(d - k)],
          text: () => `${pretend(d)} ` + tx(`Toca el dia de fa ${k} dies.`, `Toca el día de hace ${k} días.`, `Tap the day ${k} days ago.`) }; },
      () => { const w = pick([1, 1, 2]), fwd = Math.random() < 0.6, d = fwd ? rand(1, daysIn(pageM) - 7 * w) : rand(7 * w + 1, daysIn(pageM));
        const weeks = () => (w === 1 ? tx('una setmana', 'una semana', 'one week') : tx('dues setmanes', 'dos semanas', 'two weeks'));
        return { key: `week${fwd}${w}:${d}`, kind: 'grid', mark: d, right: [D(d + (fwd ? 7 : -7) * w)],
          text: () => `${pretend(d)} ` + (fwd ? tx(`Toca el dia d'aquí a ${weeks()}.`, `Toca el día de dentro de ${weeks()}.`, `Tap the day ${weeks()} from now.`)
            : tx(`Toca el dia de fa ${weeks()}.`, `Toca el día de hace ${weeks()}.`, `Tap the day ${weeks()} ago.`)) }; },
      () => { const k = rand(2, 9), d = rand(1, daysIn(pageM) - k);
        return { key: `left${k}:${d}`, kind: 'opts', mark: d, ...numOpts(k), right: [k],
          text: () => `${pretend(d)} ` + tx(`Quants dies falten per al dia ${d + k}?`, `¿Cuántos días faltan para el día ${d + k}?`, `How many days until the ${nth(d + k)}?`) }; },
      () => { const ev = pick(eventsIn(pageM).filter((e) => e.d > 2)); if (!ev) return null;
        const k = rand(2, Math.min(9, ev.d - 1)), d = ev.d - k;
        return { key: `evleft${ev.d}:${k}`, kind: 'opts', mark: d, ...numOpts(k), right: [k],
          text: () => `${pretend(d)} ` + tx(`Quants dies falten ${until(ev)}?`, `¿Cuántos días faltan ${until(ev)}?`, `How many days ${until(ev)}?`) }; },
    ],
    // The year: months, seasons, how long each month is, jumps into the next month
    4: [
      () => { const m = rand(0, 11), fwd = Math.random() < 0.6, r = (m + (fwd ? 1 : 11)) % 12;
        return { key: `mseq${fwd}${m}`, kind: 'opts', ...monthOpts(r), right: [r],
          text: () => (fwd ? tx(`Quin mes ve després ${ofMonth(m)}?`, `¿Qué mes viene después ${ofMonth(m)}?`, `Which month comes after ${ofMonth(m)}?`)
            : tx(`Quin mes ve abans ${ofMonth(m)}?`, `¿Qué mes viene antes ${ofMonth(m)}?`, `Which month comes before ${ofMonth(m)}?`)) }; },
      () => { const m = rand(0, 11), d = rand(1, 28), date = `${d}/${String(m + 1).padStart(2, '0')}`;
        return { key: `mnum${m}`, kind: 'opts', ...monthOpts(m), right: [m],
          text: () => tx(`La data ${date} és de quin mes?`, `La fecha ${date}, ¿de qué mes es?`, `The date ${date}: which month is it?`) }; },
      () => { const m = rand(0, 11);
        return { key: `mlen${m}`, kind: 'opts', ...numOpts(daysIn(m), [28, 29, 30, 31]), right: [daysIn(m)],
          text: () => tx(`Quants dies té el mes ${ofMonth(m)}?`, `¿Cuántos días tiene el mes ${ofMonth(m)}?`, `How many days does ${ofMonth(m)} have?`) }; },
      () => { const ev = pick(EVENTS.filter((e) => !e.tells));
        return { key: `evm${ev.m}:${ev.d}`, kind: 'opts', ...monthOpts(ev.m), right: [ev.m],
          text: () => tx(`${ev.e} En quin mes és ${ev.name.ca}?`, `${ev.e} ¿En qué mes es ${ev.name.es}?`, `${ev.e} Which month is ${ev.name.en} in?`) }; },
      () => { const m = pick([0, 1, 3, 4, 6, 7, 9, 10]);   // only months that sit fully inside one season
        return { key: `season${m}`, kind: 'opts', ...seasonOpts, right: [MONTH_SEASON[m]],
          text: () => tx(`El mes ${ofMonth(m)}, de quina estació és?`, `El mes ${ofMonth(m)}, ¿de qué estación es?`, `Which season is ${ofMonth(m)} in?`) }; },
      () => { const t = tail(); if (t < 2) return null;
        const n = daysIn(pageM), into = rand(1, t), k = rand(into + 1, into + 4), d = n - (k - into);
        return { key: `cross${k}:${d}`, kind: 'grid', next: true, mark: d, right: ['n' + into],
          text: () => `${pretend(d)} ` + tx(`Toca el dia d'aquí a ${k} dies.`, `Toca el día de dentro de ${k} días.`, `Tap the day ${k} days from now.`) }; },
    ],
  };
  function range(a, b) { return Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i); }
  // The first mission of a visit, on this month's page: find the real today
  const todayMission = () => ({ key: 'today', kind: 'grid', right: [D(NOW.getDate())],
    text: () => tx("Quin dia és avui de veritat? Toca'l!", '¿Qué día es hoy de verdad? ¡Tócalo!', 'What day is it today for real? Tap it!') });

  const TEXT = {
    title: L("El calendari d'en Full", 'El calendario de Hojita', "Paige's Calendar"),
    l1: L('La setmana', 'La semana', 'The week'), l1s: L('ahir · avui · demà', 'ayer · hoy · mañana', 'yesterday · today · tomorrow'),
    l2: L('El mes', 'El mes', 'The month'), l2s: L('dies i dates', 'días y fechas', 'days and dates'),
    l3: L('Salts', 'Saltos', 'Jumps'), l3s: L("d'aquí a 3 dies…", 'dentro de 3 días…', 'in 3 days…'),
    l4: L("L'any", 'El año', 'The year'), l4s: L('mesos i estacions', 'meses y estaciones', 'months and seasons'),
    win: L('Missions fetes!', '¡Misiones hechas!', 'Missions done!'),
    album: L('El meu calendari', 'Mi calendario', 'My calendar'),
    prize: L('Adhesiu nou per al calendari!', '¡Pegatina nueva para el calendario!', 'A new sticker for the calendar!'),
    prizeGold: L('Adhesius daurats per al calendari!', '¡Pegatinas doradas para el calendario!', 'Golden stickers for the calendar!'),
    reveal: L('Era aquest!', '¡Era este!', 'It was this one!'),
  };
  // Full the tear-off calendar page: funny, never a hint
  const SAY = {
    yes: [L('Full arrencat!', '¡Hoja arrancada!', 'Page torn off!'), L('Quin ull!', '¡Qué ojo!', 'Sharp eyes!'), L('Ben trobat!', '¡Bien encontrado!', 'Well found!'), L('Just aquest dia!', '¡Justo ese día!', 'That very day!')],
    no: [L('Ui, se m’ha girat el full!', '¡Uy, se me ha girado la hoja!', 'Oops, my page flipped!'), L('Hmm, quin dia més estrany!', 'Hmm, ¡qué día más raro!', 'Hmm, what an odd day!'), L('Aquest full no era!', '¡Esa hoja no era!', 'Not that page!')],
  };
  // El meu calendari: 3 stickers per month
  const STICKERS = [
    ['👑', '⛄', '🎿'], ['🎭', '🥞', '💌'], ['🌱', '🪁', '🐣'], ['🌹', '📚', '☔'],
    ['🌼', '🐝', '🍓'], ['🔥', '🎆', '🍒'], ['🏖️', '🍦', '🏊'], ['🍉', '⛱️', '🌻'],
    ['🎒', '🍇', '✏️'], ['🎃', '🍄', '🦇'], ['🌰', '🍠', '🍂'], ['🎄', '🎁', '⭐'],
  ];

  // ---------- Full ----------
  function fullSVG() {
    const abbr = month(pageM).slice(0, 3).toUpperCase();
    return `<svg viewBox="0 0 100 108" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M36 94 v9 h-7 M64 94 v9 h7" fill="none" stroke="#3a3a5c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="12" y="14" width="76" height="82" rx="11" fill="#fff" stroke="#3a3a5c" stroke-width="3"/>
      <path d="M12 40 V25 a11 11 0 0 1 11 -11 H77 a11 11 0 0 1 11 11 V40 Z" fill="#e5383b" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
      <text x="50" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Fredoka, sans-serif">${abbr}</text>
      <rect x="29" y="5" width="7" height="17" rx="3.5" fill="#cfd4db" stroke="#3a3a5c" stroke-width="2.5"/>
      <rect x="64" y="5" width="7" height="17" rx="3.5" fill="#cfd4db" stroke="#3a3a5c" stroke-width="2.5"/>
      <path d="M88 78 L72 96 H77 a11 11 0 0 0 11 -11 Z" fill="#ffe08a" stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round"/>
      <g class="eyes"><ellipse cx="37" cy="59" rx="4.5" ry="6" fill="#3a3a5c"/><ellipse cx="63" cy="59" rx="4.5" ry="6" fill="#3a3a5c"/>
        <circle cx="38.5" cy="57" r="1.7" fill="#fff"/><circle cx="64.5" cy="57" r="1.7" fill="#fff"/></g>
      <path d="M40 73 q10 9 20 0" fill="none" stroke="#3a3a5c" stroke-width="3" stroke-linecap="round"/>
      <circle cx="27" cy="70" r="5" fill="#ff9ec7" opacity=".7"/><circle cx="73" cy="70" r="5" fill="#ff9ec7" opacity=".7"/>
    </svg>`;
  }
  function drawFull() { ['full-levels', 'full', 'full-win'].forEach((id) => { $(id).innerHTML = fullSVG(); }); }

  // ---------- Album ----------
  const album = () => M.store.get(ALBUM_KEY, {});
  // One sticker of this month per round (two, golden, on ⭐⭐⭐), missing ones first.
  function award(m, gold) {
    const a = album(), got = [];
    const slots = STICKERS[m].map((_, s) => `${m}-${s}`);
    for (let n = 0; n < (gold ? 2 : 1); n++) {
      const missing = slots.filter((k) => !a[k]);
      const notGold = slots.filter((k) => a[k] !== 2 && !got.includes(k));
      const k = missing.length ? pick(missing) : gold && notGold.length ? pick(notGold) : null;
      if (!k) break;
      a[k] = Math.max(a[k] || 0, gold ? 2 : 1);
      got.push(k);
    }
    M.store.set(ALBUM_KEY, a);
    return got;
  }
  function openAlbum() {
    const a = album();
    $('album-count').textContent = `${Object.keys(a).length} / 36`;
    $('cal-grid').innerHTML = STICKERS.map((list, m) => `
      <div class="cal-month ${MONTH_SEASON[m]}">
        <span class="cal-name">${cap(month(m))}</span>
        <span class="cal-stickers">${list.map((st, s) => {
          const v = a[`${m}-${s}`];
          return v ? `<button class="sticker${v === 2 ? ' gold' : ''}" data-m="${m}">${st}</button>` : '<span class="sticker empty">·</span>';
        }).join('')}</span>
      </div>`).join('');
    $('album').hidden = false;
  }
  $('cal-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.sticker[data-m]');
    if (!b) return;
    b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle');
    M.sounds.pop();
    M.speak(cap(month(+b.dataset.m)), M.lang);
  });
  $('album-btn').addEventListener('click', () => { M.sounds.pop(); openAlbum(); });
  $('album-close').addEventListener('click', () => { M.sounds.pop(); $('album').hidden = true; });

  // ---------- Picker ----------
  function setMonth(m) {
    pageM = m;
    const s = MONTH_SEASON[m];
    document.body.classList.remove(...SEASONS);
    document.body.classList.add(s);
    M.music.play(s);
    drawFull();
    renderMonths();
  }
  function renderMonths() {
    const a = album();
    $('months').innerHTML = MONTHS[M.lang].map((name, m) => {
      const have = STICKERS[m].filter((_, s) => a[`${m}-${s}`]).length;
      return `<button class="${m === pageM ? 'on' : ''}${m === NOW.getMonth() ? ' now' : ''}${have === 3 ? ' done' : ''}" data-m="${m}">${cap(name).slice(0, 3)}</button>`;
    }).join('');
  }
  $('months').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) { M.sounds.pop(); setMonth(+b.dataset.m); }
  });

  // ---------- Round ----------
  let level = 1, done = 0, q = null, busy = false, seen = new Set(), greeted = false;
  const round = M.round({ heartsEl: $('hearts'), onOut: () => start(level) });

  function start(lvl) {
    level = lvl; done = 0; seen = new Set();
    round.start();
    $('levels').hidden = true; $('win').hidden = true; $('play').hidden = false;
    $('progress').innerHTML = '<span></span>'.repeat(ROUND);
    next();
  }
  function make() {
    if (!greeted && pageM === NOW.getMonth()) { greeted = true; return todayMission(); }
    for (let i = 0; i < 60; i++) {
      const m = pick(MAKERS[level])();
      if (m && !seen.has(m.key) && m.right.length) return m;
    }
    return pick(MAKERS[level].map((f) => f()).filter(Boolean));
  }
  function next() {
    q = make();
    seen.add(q.key);
    busy = false;
    renderMission(true);
  }
  function say(line, speak) {
    $('mission').textContent = line;
    if (speak) M.speak(line.replace(/[¡!¿]/g, '').replace(/\p{Extended_Pictographic}️?/gu, ''), M.lang);
  }
  function renderMission(speak) {
    say(q.text(), speak);
    $('cal-title').textContent = `${cap(month(pageM))} ${YEAR}`;
    $('dow').innerHTML = DOW[M.lang].map((d, i) => `<span class="${i > 4 ? 'we' : ''}">${d}</span>`).join('');
    const cells = [];
    for (let i = 0; i < firstDow(pageM); i++) cells.push('<span class="cell off"></span>');
    for (let d = 1; d <= daysIn(pageM); d++) {
      const ev = eventsIn(pageM).find((e) => e.d === d);
      cells.push(`<button class="cell${dowOf(d) > 4 ? ' we' : ''}${q.mark === d ? ' mark' : ''}" data-id="${D(d)}">${d}${ev ? `<i>${ev.e}</i>` : ''}</button>`);
    }
    for (let d = 1; d <= tail(); d++) cells.push(q.next ? `<button class="cell other" data-id="n${d}">${d}</button>` : '<span class="cell off"></span>');
    const g = $('grid');
    g.innerHTML = cells.join('');
    g.className = 'grid' + (q.kind === 'grid' ? ' live' : '') + (cells.length > 35 ? ' six' : '');
    $('opts').innerHTML = q.kind === 'opts' ? q.ids.map((id) => `<button data-id="${id}">${q.label(id)}</button>`).join('') : '';
    $('opts').className = 'opts n' + (q.kind === 'opts' ? q.ids.length : 0);
  }
  $('bubble').addEventListener('click', () => { if (q && !busy) say(q.text(), true); });

  function answer(el, id) {
    if (busy || !q || round.busy) return;
    busy = true;
    if (q.right.map(String).includes(String(id))) { right(el); return; }
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
    say(M.t(pick(SAY.no)));
    round.wrong(q.key).then(({ reveal }) => {
      if (!reveal) { busy = false; say(q.text()); return; }
      // 2nd miss: show the right day (or answer) and move on
      document.querySelectorAll('#grid [data-id], #opts [data-id]').forEach((x) => { if (q.right.map(String).includes(x.dataset.id)) x.classList.add('reveal'); });
      say(M.t(TEXT.reveal), true);
      setTimeout(advance, 2200);
    });
  }
  function right(el) {
    el.classList.add('ok');
    M.sounds.match();
    say(M.t(pick(SAY.yes)));
    // a page is torn off and lands on the progress row
    const slot = $('progress').children[done];
    M.fly(el, slot, { html: '📄', size: 30, scale: 0.6, spin: 200, ms: 560 }).then(() => { slot.classList.add('full'); });
    setTimeout(advance, 1000);
  }
  function advance() {
    const slot = $('progress').children[done];
    if (slot) slot.classList.add('full');
    done++;
    if (done === ROUND) finish(); else next();
  }
  $('grid').addEventListener('click', (e) => {
    const b = e.target.closest('button.cell');
    if (b && q && q.kind === 'grid') answer(b, b.dataset.id);
  });
  $('opts').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) answer(b, b.dataset.id);
  });

  function finish() {
    const stars = round.stars();
    $('win-stars').innerHTML = M.starsHTML(stars);
    const got = award(pageM, stars === 3);
    const a = album();
    $('prize').innerHTML = got.length ? `<p>${M.t(stars === 3 ? TEXT.prizeGold : TEXT.prize)}</p>` +
      `<div class="prize-stickers">${got.map((k) => {
        const s = +k.split('-')[1];
        return `<span class="prize-one"><span class="sticker big${a[k] === 2 ? ' gold' : ''}">${STICKERS[pageM][s]}</span>${cap(month(pageM))}</span>`;
      }).join('')}</div>` : '';
    $('win').hidden = false;
    M.sounds.win();
    M.confetti(['📅', '📄', ...got.map((k) => STICKERS[pageM][+k.split('-')[1]])]);
    M.speak(M.t(TEXT.win).replace(/[¡!]/g, ''), M.lang);
  }
  function showLevels() {
    $('play').hidden = true; $('win').hidden = true; $('levels').hidden = false;
    renderMonths();
  }
  document.querySelectorAll('.level').forEach((b) => b.addEventListener('click', () => { M.sounds.pop(); start(+b.dataset.level); }));
  $('again').addEventListener('click', () => { M.sounds.pop(); start(level); });
  $('other').addEventListener('click', () => { M.sounds.pop(); showLevels(); });
  $('back').addEventListener('click', () => { M.sounds.pop(); showLevels(); });

  // ---------- Text ----------
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    [1, 2, 3, 4].forEach((i) => { $(`l${i}-name`).textContent = M.t(TEXT['l' + i]); $(`l${i}-sub`).textContent = M.t(TEXT[`l${i}s`]); });
    $('win-text').textContent = M.t(TEXT.win);
    $('album-title').textContent = M.t(TEXT.album);
    drawFull();
    renderMonths();
    if (q && !$('play').hidden) renderMission(false);
    if (!$('album').hidden) openAlbum();
  }
  M.mountControls($('controls'));
  M.onLang(renderText);
  M.music.button($('music-levels'));
  setMonth(pageM);
  renderText();

  // test hook
  window.__calendar = () => ({ q, level, done, busy, pageM, YEAR, EVENTS, MAKERS, setMonth, daysIn, firstDow, tail, show: (m) => { q = m; busy = false; renderMission(false); } });
})();
