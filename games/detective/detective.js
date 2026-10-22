(function () {
  const M = window.Mellis;
  const INK = '#3a3a5c';
  const SOLVED_KEY = 'mellis.detective.solved';
  const GOLD_KEY = 'mellis.detective.gold';    // cases solved with ⭐⭐⭐
  const CAUGHT_KEY = 'mellis.detective.caught'; // gallery of caught thieves
  const CAUGHT_MAX = 60;
  const UNLOCK = { 1: 0, 2: 3, 3: 6 };          // solved cases needed per level

  // ---------- Content ----------
  // ears only matter from Medium up; pitch = the suspect's voice
  const ANIMALS = {
    '🦊': { ears: 'pointy', pitch: 1.3 }, '🐱': { ears: 'pointy', pitch: 1.6 }, '🐯': { ears: 'pointy', pitch: 0.7 },
    '🐺': { ears: 'pointy', pitch: 0.8 }, '🐰': { ears: 'long', pitch: 1.7 }, '🐴': { ears: 'long', pitch: 0.9 },
    '🐻': { ears: 'round', pitch: 0.5 }, '🐭': { ears: 'round', pitch: 2 }, '🐼': { ears: 'round', pitch: 0.8 },
    '🐨': { ears: 'round', pitch: 1 }, '🐵': { ears: 'round', pitch: 1.5 }, '🐷': { pitch: 1.2 }, '🐸': { pitch: 1.4 }, '🐶': { pitch: 1.1 },
  };
  const EARED = Object.keys(ANIMALS).filter((a) => ANIMALS[a].ears);
  const SHOES = ['boots', 'trainers', 'paws'];
  const SHOE_ICON = { boots: '👢', trainers: '👟', paws: '🐾' };
  const SCARVES = {
    red: { hex: '#e5383b', ca: 'VERMELLA', es: 'ROJA', en: 'RED' },
    blue: { hex: '#3a86ff', ca: 'BLAVA', es: 'AZUL', en: 'BLUE' },
    green: { hex: '#2fbf71', ca: 'VERDA', es: 'VERDE', en: 'GREEN' },
    pink: { hex: '#ff6fb5', ca: 'ROSA', es: 'ROSA', en: 'PINK' },
  };
  const SHOE_COLORS = {
    red: { hex: '#e5383b', ca: 'VERMELLES', es: 'ROJOS', en: 'RED' },
    blue: { hex: '#3a86ff', ca: 'BLAVES', es: 'AZULES', en: 'BLUE' },
    yellow: { hex: '#ffd23f', ca: 'GROGUES', es: 'AMARILLOS', en: 'YELLOW' },
  };
  const BAGS = ['backpack', 'handbag', 'none'];
  const BAG_ICON = { backpack: '🎒', handbag: '👜' };
  const HOLDS = ['umbrella', 'balloon', 'icecream', 'none'];
  const HOLD_ICON = { umbrella: '☂️', balloon: '🎈', icecream: '🍦' };
  const ROOMS = {
    kitchen: { icon: '🍳', ca: 'a la **cuina**', es: 'en la **cocina**', en: 'in the **kitchen**' },
    garden: { icon: '🌳', ca: 'al **jardí**', es: 'en el **jardín**', en: 'in the **garden**' },
    bathroom: { icon: '🛁', ca: 'al **bany**', es: 'en el **baño**', en: 'in the **bathroom**' },
    bedroom: { icon: '🛏️', ca: "a l'**habitació**", es: 'en el **dormitorio**', en: 'in the **bedroom**' },
  };
  const CRIMES = [
    { item: '🎂', ca: 'Qui s\'ha menjat el pastís?', es: '¿Quién se ha comido la tarta?', en: 'Who ate the cake?',
      why: { ca: 'Tenia tanta gana...!', es: '¡Tenía tanta hambre...!', en: 'I was sooo hungry!' } },
    { item: '👑', ca: 'Qui ha robat la corona?', es: '¿Quién ha robado la corona?', en: 'Who stole the crown?',
      why: { ca: 'Em volia fer una foto amb corona!', es: '¡Quería hacerme una foto con corona!', en: 'I wanted a selfie with a crown!' } },
    { item: '🍪', ca: 'Qui s\'ha endut les galetes?', es: '¿Quién se ha llevado las galletas?', en: 'Who took the cookies?',
      why: { ca: 'Les galetes em deien: menja\'ns!', es: '¡Las galletas me decían: cómenos!', en: 'The cookies said: eat us!' } },
    { item: '💎', ca: 'Qui ha robat el diamant?', es: '¿Quién ha robado el diamante?', en: 'Who stole the diamond?',
      why: { ca: 'Brillava tant...!', es: '¡Brillaba tanto...!', en: 'It was sooo shiny!' } },
    { item: '🧸', ca: 'Qui s\'ha endut l\'osset de peluix?', es: '¿Quién se ha llevado el osito de peluche?', en: 'Who took the teddy bear?',
      why: { ca: 'Necessitava una abraçada!', es: '¡Necesitaba un abrazo!', en: 'I needed a hug!' } },
    { item: '🏆', ca: 'Qui ha amagat el trofeu?', es: '¿Quién ha escondido el trofeo?', en: 'Who hid the trophy?',
      why: { ca: 'Jo mai guanyo res!', es: '¡Yo nunca gano nada!', en: 'I never win anything!' } },
  ];
  const SORRY = { ca: 'Ho sento! Aquí ho teniu.', es: '¡Lo siento! Aquí lo tenéis.', en: 'Sorry! Here it is.' };
  // What each suspect says when she taps them
  const EXCUSES = {
    '🦊': { ca: 'Jo? Només passava per aquí...', es: '¿Yo? Solo pasaba por aquí...', en: 'Me? I was just passing by...' },
    '🐱': { ca: 'Miau! Jo feia la migdiada.', es: '¡Miau! Yo dormía la siesta.', en: 'Meow! I was taking a nap.' },
    '🐯': { ca: 'Grrr! Sóc un tigre molt bo!', es: '¡Grrr! ¡Soy un tigre muy bueno!', en: "Grrr! I'm a very good tiger!" },
    '🐺': { ca: 'Auuu! Jo cantava a la lluna.', es: '¡Auuu! Yo le cantaba a la luna.', en: 'Awoo! I was singing to the moon.' },
    '🐰': { ca: 'Jo només menjo pastanagues!', es: '¡Yo solo como zanahorias!', en: 'I only eat carrots!' },
    '🐴': { ca: 'Hiii! Jo no hi cabo, per la porta!', es: '¡Hiii! ¡Yo no quepo por la puerta!', en: "Neigh! I don't fit through the door!" },
    '🐻': { ca: 'Jo buscava mel. Només mel!', es: 'Yo buscaba miel. ¡Solo miel!', en: 'I was looking for honey. Just honey!' },
    '🐭': { ca: 'Sóc massa petit per robar res!', es: '¡Soy demasiado pequeño para robar nada!', en: "I'm too tiny to steal anything!" },
    '🐼': { ca: 'Jo menjava bambú tot el dia.', es: 'Yo comía bambú todo el día.', en: 'I was eating bamboo all day.' },
    '🐨': { ca: 'Zzz... Què? Jo dormia!', es: 'Zzz... ¿Qué? ¡Yo dormía!', en: 'Zzz... What? I was asleep!' },
    '🐵': { ca: 'Uh-uh-ah-ah! Jo saltava pels arbres!', es: '¡Uh-uh-ah-ah! ¡Yo saltaba por los árboles!', en: 'Ooh-ooh-ah-ah! I was in the trees!' },
    '🐷': { ca: 'Oinc! Jo em banyava al fang.', es: '¡Oinc! Yo me bañaba en el barro.', en: 'Oink! I was having a mud bath.' },
    '🐸': { ca: 'Ribbit! Jo caçava mosques.', es: '¡Croac! Yo cazaba moscas.', en: 'Ribbit! I was catching flies.' },
    '🐶': { ca: 'Guau! Jo vigilava la casa!', es: '¡Guau! ¡Yo vigilaba la casa!', en: 'Woof! I was guarding the house!' },
  };
  const ALIBI = { ca: (r) => `Jo era ${r}!`, es: (r) => `¡Yo estaba ${r}!`, en: (r) => `I was ${r}!` };

  // **word** is shown in bold red and spoken in lower case.
  const CLUES = {
    shoes: {
      boots: { ca: 'El lladre porta **botes**.', es: 'El ladrón lleva **botas**.', en: 'The thief wears **boots**.' },
      trainers: { ca: 'El lladre porta **bambes**.', es: 'El ladrón lleva **zapatillas**.', en: 'The thief wears **trainers**.' },
      paws: { ca: 'El lladre va **descalç**.', es: 'El ladrón va **descalzo**.', en: 'The thief has **no shoes**.' },
    },
    scarf: (c) => ({
      ca: `La bufanda del lladre és **${SCARVES[c].ca}**.`,
      es: `La bufanda del ladrón es **${SCARVES[c].es}**.`,
      en: `The thief's scarf is **${SCARVES[c].en}**.`,
    }),
    hat: {
      true: { ca: 'El lladre **porta barret**.', es: 'El ladrón **lleva sombrero**.', en: 'The thief **wears a hat**.' },
      false: { ca: 'El lladre **NO porta barret**.', es: 'El ladrón **NO lleva sombrero**.', en: 'The thief does **NOT wear a hat**.' },
    },
    glasses: {
      true: { ca: 'El lladre **porta ulleres**.', es: 'El ladrón **lleva gafas**.', en: 'The thief **wears glasses**.' },
      false: { ca: 'El lladre **NO porta ulleres**.', es: 'El ladrón **NO lleva gafas**.', en: 'The thief does **NOT wear glasses**.' },
    },
    bag: {
      backpack: { ca: 'El lladre porta **motxilla**.', es: 'El ladrón lleva **mochila**.', en: 'The thief has a **backpack**.' },
      handbag: { ca: 'El lladre porta **bossa de mà**.', es: 'El ladrón lleva **bolso**.', en: 'The thief has a **handbag**.' },
      none: { ca: 'El lladre **NO porta bossa**.', es: 'El ladrón **NO lleva bolso**.', en: 'The thief has **NO bag**.' },
    },
    shoeColor: (c) => ({
      ca: `Les sabates del lladre són **${SHOE_COLORS[c].ca}**.`,
      es: `Los zapatos del ladrón son **${SHOE_COLORS[c].es}**.`,
      en: `The thief's shoes are **${SHOE_COLORS[c].en}**.`,
    }),
    ears: {
      pointy: { ca: 'El lladre té les orelles **punxegudes**.', es: 'El ladrón tiene las orejas **puntiagudas**.', en: 'The thief has **pointy** ears.' },
      round: { ca: 'El lladre té les orelles **rodones**.', es: 'El ladrón tiene las orejas **redondas**.', en: 'The thief has **round** ears.' },
      long: { ca: 'El lladre té les orelles **llargues**.', es: 'El ladrón tiene las orejas **largas**.', en: 'The thief has **long** ears.' },
    },
    hold: {
      umbrella: { ca: 'El lladre porta un **paraigua**.', es: 'El ladrón lleva un **paraguas**.', en: 'The thief carries an **umbrella**.' },
      balloon: { ca: 'El lladre porta un **globus**.', es: 'El ladrón lleva un **globo**.', en: 'The thief carries a **balloon**.' },
      icecream: { ca: 'El lladre porta un **gelat**.', es: 'El ladrón lleva un **helado**.', en: 'The thief carries an **ice cream**.' },
      none: { ca: 'El lladre **NO porta res a la mà**.', es: 'El ladrón **NO lleva nada en la mano**.', en: 'The thief holds **NOTHING**.' },
    },
    room: (r) => ({
      ca: `Un testimoni va veure el lladre ${ROOMS[r].ca}.`,
      es: `Un testigo vio al ladrón ${ROOMS[r].es}.`,
      en: `A witness saw the thief ${ROOMS[r].en}.`,
    }),
  };
  const CLUE_ICON = { shoes: '👣', scarf: '🧣', hat: '🎩', glasses: '👓', bag: '🎒', shoeColor: '👟', ears: '👂', hold: '🎈', room: '🏠' };

  // Per level: suspects, attributes, how many clues, look-alikes, cipher types
  const LEVELS = {
    1: { n: 6, attrs: ['shoes', 'scarf', 'hat', 'glasses'], min: 3, max: 4, twins: 1, codes: ['symbols', 'numbers'] },
    2: { n: 8, attrs: ['shoes', 'scarf', 'hat', 'glasses', 'bag', 'shoeColor', 'ears', 'hold'], min: 4, max: 5, twins: 3, codes: ['mirror', 'decoys'] },
    3: { n: 8, attrs: ['shoes', 'scarf', 'hat', 'glasses', 'bag', 'shoeColor', 'ears', 'hold', 'room'], min: 5, max: 5, twins: 4, codes: ['shift'], must: 'room' },
  };

  const TEXT = {
    title: { ca: 'Agència de detectives Mellis', es: 'Agencia de detectives Mellis', en: 'Mellis Detective Agency' },
    caseNo: { ca: 'CAS', es: 'CASO', en: 'CASE' },
    start: { ca: 'Comencem!', es: '¡Empecemos!', en: "Let's go!" },
    l1: { ca: 'Cas fàcil', es: 'Caso fácil', en: 'Easy case' },
    l2: { ca: 'Cas mitjà', es: 'Caso medio', en: 'Medium case' },
    l3: { ca: 'Cas difícil', es: 'Caso difícil', en: 'Hard case' },
    foot: { ca: 'Hem trobat una petjada! Qui l\'ha deixat?', es: '¡Hemos encontrado una huella! ¿Quién la ha dejado?', en: 'We found a footprint! What made it?' },
    code: { ca: 'El lladre ha deixat una nota secreta. Desxifra-la!', es: 'El ladrón ha dejado una nota secreta. ¡Descífrala!', en: 'The thief left a secret note. Crack the code!' },
    mirror: { ca: 'Nota en mirall! Llegeix-la del revés.', es: '¡Nota en espejo! Léela al revés.', en: 'Mirror note! Read it backwards.' },
    shift: { ca: 'Codi secret: cada lletra és la de després. Escriu la d\'abans!', es: 'Código secreto: cada letra es la siguiente. ¡Escribe la de antes!', en: 'Secret code: each letter is the next one. Write the one before!' },
    suspects: { ca: 'Toca els sospitosos i ratlla els que no encaixen!', es: '¡Toca a los sospechosos y tacha a los que no encajan!', en: "Tap the suspects and cross out the ones who don't match!" },
    print: { ca: 'Demostra-ho! Quina empremta és igual?', es: '¡Demuéstralo! ¿Qué huella es igual?', en: 'Prove it! Which fingerprint is the same?' },
    newClue: { ca: 'Nova pista!', es: '¡Nueva pista!', en: 'New clue!' },
    caught: { ca: 'Cas resolt!', es: '¡Caso resuelto!', en: 'Case solved!' },
    gallery: { ca: 'Lladres atrapats', es: 'Ladrones atrapados', en: 'Caught thieves' },
    galleryEmpty: { ca: 'Encara no n\'heu atrapat cap!', es: '¡Todavía no habéis atrapado a ninguno!', en: "You haven't caught anyone yet!" },
    stamp: { ca: 'ATRAPAT', es: 'ATRAPADO', en: 'CAUGHT' },
    locked: { ca: (k) => `Resol ${k} casos més per obrir-lo!`, es: (k) => `¡Resuelve ${k} casos más para abrirlo!`, en: (k) => `Solve ${k} more cases to open it!` },
  };
  // Agent Mussol, the sleepy owl boss
  const OWL = {
    lobby: { ca: 'Uuuh... Hi ha feina, detectives.', es: 'Uuuh... Hay trabajo, detectives.', en: 'Hoo-hoo... There is work, detectives.' },
    brief: { ca: 'Uaaah... Bon dia, detectives. Tenim un cas:', es: 'Uaaah... Buenos días, detectives. Tenemos un caso:', en: 'Yaaawn... Morning, detectives. We have a case:' },
    win: { ca: 'Eh?! Ja l\'heu atrapat? Increïble!', es: '¿¡Eh?! ¿Ya lo habéis atrapado? ¡Increíble!', en: 'Huh?! You caught them already? Amazing!' },
  };
  const RANKS = [
    [0, { ca: 'Detectiva en pràctiques', es: 'Detective en prácticas', en: 'Trainee detective' }],
    [3, { ca: 'Detectiva', es: 'Detective', en: 'Detective' }],
    [6, { ca: 'Superdetectiva', es: 'Superdetective', en: 'Super detective' }],
    [10, { ca: 'Detectiva llegendària', es: 'Detective legendaria', en: 'Legendary detective' }],
  ];
  const SYMBOLS = ['⭐', '🌙', '❤️', '🍀', '💎', '🔺', '⚡', '🍄', '🌸', '🎈', '🔑', '🎵', '🍭', '🐟'];
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const bold = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const plain = (s) => s.replace(/\*\*(.+?)\*\*/g, (_, w) => w.toLowerCase());
  function say(text, opts) { M.speak(plain(text), M.lang, opts); }
  function bump(el) { el.classList.remove('wrong'); void el.offsetWidth; el.classList.add('wrong'); }

  function loadNum(key) {
    try { return parseInt(localStorage.getItem(key), 10) || 0; } catch (e) { return 0; }
  }
  function saveVal(key, v) {
    try { localStorage.setItem(key, v); } catch (e) { /* ignore */ }
  }
  const solvedCount = () => loadNum(SOLVED_KEY);
  const goldCount = () => loadNum(GOLD_KEY);
  function caughtList() {
    try { return JSON.parse(localStorage.getItem(CAUGHT_KEY)) || []; } catch (e) { return []; }
  }
  function rankFor(n) { return RANKS.filter(([min]) => n >= min).pop()[1]; }

  // ---------- Case generator ----------
  const keyOf = (s, attrs) => attrs.map((a) => s[a]).join('|');
  const matches = (s, c) => s[c.attr] === c.val;

  function randomLook(cfg) {
    const l = { shoes: pick(SHOES), scarf: pick(Object.keys(SCARVES)), hat: Math.random() < 0.5, glasses: Math.random() < 0.5 };
    if (cfg.attrs.includes('bag')) {
      l.bag = pick(BAGS);
      l.hold = pick(HOLDS);
      if (l.shoes !== 'paws') l.shoeColor = pick(Object.keys(SHOE_COLORS));
    }
    if (cfg.attrs.includes('room')) l.room = pick(Object.keys(ROOMS));
    return l;
  }
  // a look-alike: same shoes & scarf, one or two other things changed
  function twinOf(thief, cfg) {
    const t = { ...thief };
    const free = cfg.attrs.filter((a) => !['shoes', 'scarf', 'ears'].includes(a) && t[a] !== undefined);
    shuffle(free).slice(0, cfg.n > 6 ? 1 + (Math.random() < 0.4) : 1).forEach((a) => {
      if (a === 'hat' || a === 'glasses') t[a] = !t[a];
      else {
        const opts = { bag: BAGS, hold: HOLDS, shoeColor: Object.keys(SHOE_COLORS), room: Object.keys(ROOMS) }[a];
        t[a] = pick(opts.filter((o) => o !== t[a]));
      }
    });
    return t;
  }

  // Suspects; clues revealed in order, each one rules out somebody new,
  // and together they leave only the thief.
  function makeCase(lvl) {
    const cfg = LEVELS[lvl];
    const attrs = cfg.attrs;
    for (;;) {
      const pool = shuffle((lvl > 1 ? EARED : Object.keys(ANIMALS)).slice()).slice(0, cfg.n);
      const thief = randomLook(cfg);
      const looks = [thief];
      for (let i = 0; i < cfg.twins; i++) looks.push(twinOf(thief, cfg));
      while (looks.length < cfg.n) looks.push(randomLook(cfg));
      const suspects = shuffle(looks.map((l, i) => {
        const s = { ...l, animal: pool[i], thief: i === 0 };
        if (attrs.includes('ears')) s.ears = ANIMALS[pool[i]].ears;
        return s;
      }));
      if (new Set(suspects.map((s) => keyOf(s, attrs))).size < suspects.length) continue;
      const t = suspects.find((s) => s.thief);

      const rest = shuffle(attrs.filter((a) => a !== 'shoes' && a !== 'scarf' && t[a] !== undefined));
      const clues = [{ attr: 'shoes', val: t.shoes }, { attr: 'scarf', val: t.scarf }]
        .concat(rest.map((attr) => ({ attr, val: t[attr] })));

      // keep only clues that rule someone out; check the result is unique
      let left = suspects;
      const used = [];
      for (const c of clues) {
        const next = left.filter((s) => matches(s, c));
        if (next.length < left.length) { used.push(c); left = next; }
        else if (used.length < 2) break; // footprint & note clues must both count
        if (left.length === 1) break;
      }
      if (left.length !== 1 || !left[0].thief) continue;
      if (used.length < cfg.min || used.length > cfg.max) continue;
      if (used[0].attr !== 'shoes' || used[1].attr !== 'scarf') continue;
      if (cfg.must && !used.some((c) => c.attr === cfg.must)) continue;
      return {
        level: lvl,
        crime: pick(CRIMES),
        suspects,
        clues: used,
        codeType: pick(cfg.codes),
        print: makePrint(),
      };
    }
  }
  window.__makeCase = makeCase; // for testing in the console

  // ---------- Drawings ----------
  function suspectSVG(s) {
    const sc = SCARVES[s.scarf].hex;
    const hat = s.hat
      ? `<g><rect x="30" y="2" width="40" height="26" rx="4" fill="${INK}"/><rect x="30" y="20" width="40" height="6" fill="#e9c88f"/><rect x="20" y="26" width="60" height="7" rx="3.5" fill="${INK}"/></g>`
      : '';
    const glasses = s.glasses
      ? `<g fill="rgba(255,255,255,.35)" stroke="${INK}" stroke-width="4"><circle cx="38" cy="64" r="10"/><circle cx="62" cy="64" r="10"/><path d="M48 63 h4" fill="none"/></g>`
      : '';
    const shoeBg = s.shoeColor ? `<ellipse cx="50" cy="134" rx="22" ry="12" fill="${SHOE_COLORS[s.shoeColor].hex}" stroke="${INK}" stroke-width="2.5"/>` : '';
    const bag = BAG_ICON[s.bag] ? `<text x="13" y="124" font-size="24" text-anchor="middle">${BAG_ICON[s.bag]}</text>` : '';
    const hold = HOLD_ICON[s.hold] ? `<text x="88" y="86" font-size="26" text-anchor="middle">${HOLD_ICON[s.hold]}</text>` : '';
    return `<svg viewBox="0 0 100 146" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="90" font-size="58" text-anchor="middle">${s.animal}</text>
      ${hat}${glasses}
      <path d="M22 96 Q50 108 78 96 L80 106 Q50 118 20 106 Z" fill="${sc}" stroke="${INK}" stroke-width="3"/>
      <path d="M62 106 l4 16 l10 -2 l-6 -16 z" fill="${sc}" stroke="${INK}" stroke-width="3"/>
      ${shoeBg}<text x="50" y="143" font-size="26" text-anchor="middle">${SHOE_ICON[s.shoes]}</text>${bag}${hold}
    </svg>`;
  }

  // Agent Mussol: round owl in a trench coat, sleepy eyelids (or wide awake)
  function owlSVG(awake) {
    const lid = awake ? '' : `<path d="M30 46 a12 12 0 0 1 24 0 Z M66 46 a12 12 0 0 1 24 0 Z" fill="#8a6a4a" stroke="${INK}" stroke-width="3"/>`;
    const pupil = awake ? 6 : 4;
    return `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 128 Q18 70 60 64 Q102 70 98 128 Z" fill="#c8a36e" stroke="${INK}" stroke-width="3.5"/>
      <path d="M60 70 L44 128 M60 70 L76 128" stroke="${INK}" stroke-width="3"/>
      <circle cx="51" cy="100" r="3" fill="${INK}"/><circle cx="51" cy="114" r="3" fill="${INK}"/>
      <path d="M26 22 L36 6 L44 22 Z M94 22 L84 6 L76 22 Z" fill="#8a6a4a" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="60" cy="44" rx="40" ry="34" fill="#a7825a" stroke="${INK}" stroke-width="3.5"/>
      <g fill="#fffdf2" stroke="${INK}" stroke-width="3"><circle cx="42" cy="46" r="13"/><circle cx="78" cy="46" r="13"/></g>
      <circle cx="42" cy="48" r="${pupil}" fill="${INK}"/><circle cx="78" cy="48" r="${pupil}" fill="${INK}"/>
      ${lid}
      <path d="M54 58 L66 58 L60 70 Z" fill="#ffb02e" stroke="${INK}" stroke-width="2.5"/>
      <path d="M18 18 Q60 -4 102 18 L96 24 Q60 8 24 24 Z" fill="#5a4a3a" stroke="${INK}" stroke-width="3"/>
    </svg>`;
  }

  function footprintSVG(type) {
    const mud = '#7a5233';
    if (type === 'paws') {
      return `<svg viewBox="0 0 60 120"><g fill="${mud}">
        <ellipse cx="30" cy="78" rx="18" ry="16"/><ellipse cx="12" cy="52" rx="6" ry="8"/>
        <ellipse cx="24" cy="42" rx="6" ry="8"/><ellipse cx="36" cy="42" rx="6" ry="8"/><ellipse cx="48" cy="52" rx="6" ry="8"/></g></svg>`;
    }
    if (type === 'boots') {
      let tread = '';
      for (let y = 14; y < 74; y += 10) tread += `<path d="M12 ${y} l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5" fill="none" stroke="#fffaf0" stroke-width="3"/>`;
      return `<svg viewBox="0 0 60 120"><path d="M30 4 C48 4 54 24 52 46 C50 62 46 70 46 78 L14 78 C14 70 10 62 8 46 C6 24 12 4 30 4 Z" fill="${mud}"/>
        ${tread}<rect x="15" y="86" width="30" height="30" rx="6" fill="${mud}"/>
        <path d="M19 94 h22 M19 102 h22 M19 110 h22" stroke="#fffaf0" stroke-width="3"/></svg>`;
    }
    let waves = '';
    for (let y = 16; y < 110; y += 9) waves += `<path d="M10 ${y} q5 -4 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#fffaf0" stroke-width="2.5"/>`;
    return `<svg viewBox="0 0 60 120"><path d="M30 2 C50 2 54 26 52 50 C50 70 50 90 48 104 C46 118 14 118 12 104 C10 90 10 70 8 50 C6 26 10 2 30 2 Z" fill="${mud}"/>${waves}</svg>`;
  }

  // Fingerprints: three ridge patterns, optionally crossed by a scar.
  const PRINT_TYPES = ['whorl', 'loop', 'arch'];
  let printId = 0;
  function makePrint() {
    return { type: pick(PRINT_TYPES), scar: Math.random() < 0.5, tilt: pick([-15, 0, 15]) };
  }
  function printSVG(p) {
    const id = 'fp' + (printId++);
    let ridges = '';
    if (p.type === 'whorl') {
      for (let r = 5; r < 64; r += 6) ridges += `<ellipse cx="50" cy="58" rx="${r}" ry="${r * 1.25}"/>`;
    } else if (p.type === 'loop') {
      for (let r = 4; r < 56; r += 6) ridges += `<path d="M${50 - r} 130 L${50 - r} 52 A${r} ${r} 0 0 1 ${50 + r} 52 L${50 + r} 130"/>`;
    } else {
      for (let y = 8; y < 125; y += 7) {
        const bump = Math.max(0, 1 - Math.abs(y - 60) / 70) * 26;
        ridges += `<path d="M-10 ${y} Q50 ${y - bump} 110 ${y}"/>`;
      }
    }
    const scar = p.scar ? `<path d="M10 40 L90 78" stroke="#fffdf5" stroke-width="7"/>` : '';
    return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="${id}"><ellipse cx="50" cy="60" rx="40" ry="54"/></clipPath></defs>
      <g clip-path="url(#${id})"><g transform="rotate(${p.tilt} 50 60)" fill="none" stroke="${INK}" stroke-width="2.6">${ridges}</g>${scar}</g>
      <ellipse cx="50" cy="60" rx="40" ry="54" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="3 4" opacity=".5"/>
    </svg>`;
  }
  // Wrong options differ clearly: another pattern, or the scar added/removed.
  function printOptions(p) {
    const others = PRINT_TYPES.filter((t) => t !== p.type);
    return shuffle([
      { ...p, ok: true },
      { ...p, type: others[0] },
      { ...p, type: others[1], scar: !p.scar },
      { ...p, scar: !p.scar },
    ]);
  }

  // ---------- Screens ----------
  let kase = null, step = 'lobby', revealed = 0, codeIdx = 0, codeWord = '', codeMap = {}, talking = -1;
  const asked = new Set();   // suspects she has talked to (Hard: shows their room)
  const STEPS = ['intro', 'foot', 'code', 'suspects', 'print'];
  window.__case = () => ({ kase, codeWord, revealed }); // for automated testing

  function show(name) {
    $('lobby').hidden = name !== 'lobby';
    $('case').hidden = name === 'lobby';
    $('win').hidden = true;
    STEPS.forEach((s) => { $('step-' + s).hidden = s !== name; });
    const now = STEPS.indexOf(name);
    document.querySelectorAll('#steps span').forEach((el, i) => {
      el.classList.toggle('now', i === now);
      el.classList.toggle('done', i < now);
    });
    step = name;
    renderSayButtons();
  }

  function renderSayButtons() {
    document.querySelectorAll('.say').forEach((b) => { b.hidden = !M.canSpeak(M.lang); });
  }

  function renderLobby() {
    const n = solvedCount();
    $('rank').textContent = '🕵️ ' + M.t(rankFor(n));
    const gold = Math.min(goldCount(), n);
    const shown = Math.min(n, 20);
    const g = Math.min(gold, shown);
    $('badges').innerHTML = n
      ? '🥇'.repeat(g) + '🏅'.repeat(shown - g) + (n > 20 ? ` +${n - 20}` : '')
      : '<span class="empty">🏅🏅🏅</span>';
    $('owl-lobby-say').textContent = M.t(OWL.lobby);
    [1, 2, 3].forEach((l) => {
      const b = document.querySelector(`.case-level[data-level="${l}"]`);
      b.classList.toggle('locked', n < UNLOCK[l]);
      $('cl' + l).textContent = M.t(TEXT['l' + l]);
      b.querySelector('.cl-lock').textContent = n < UNLOCK[l] ? `🔒 ${UNLOCK[l]}🏅` : '';
    });
    $('gallery-title').textContent = M.t(TEXT.gallery);
  }

  // Re-render every text of the current screen (also used when the language changes).
  function renderText() {
    $('title').textContent = M.t(TEXT.title);
    document.title = M.t(TEXT.title) + ' · Laboratorio Mellis';
    renderLobby();
    renderSayButtons();
    if (!kase) return;
    $('case-no').textContent = `${M.t(TEXT.caseNo)} #${solvedCount() + 1}`;
    $('case-item').textContent = kase.crime.item;
    $('owl-brief').textContent = M.t(OWL.brief);
    $('case-q').textContent = M.t(kase.crime);
    $('start-label').textContent = M.t(TEXT.start);
    $('foot-task').textContent = M.t(TEXT.foot);
    $('code-task').textContent = M.t(TEXT[kase.codeType] || TEXT.code);
    $('sus-task').textContent = M.t(TEXT.suspects);
    $('print-task').textContent = M.t(TEXT.print);
    renderClues();
    if (step === 'code') startCode(); // the secret word changes with the language
    if (!$('clue-pop').hidden) $('clue-text').innerHTML = bold(clueText(kase.clues[revealed - 1]));
    if (!$('talk-pop').hidden) renderTalk();
  }

  function clueText(c) {
    const set = typeof CLUES[c.attr] === 'function' ? CLUES[c.attr](c.val) : CLUES[c.attr][c.val];
    return M.t(set);
  }

  // Easy: full sentences. Medium/Hard: compact chips on the cork board (the 🔊 reads them all).
  function renderClues() {
    const chips = kase.level > 1;
    $('clues').classList.toggle('chips', chips);
    $('clues').innerHTML = kase.clues.slice(0, revealed).map((c, i) => {
      const fresh = i === revealed - 1 && step === 'suspects' ? 'fresh' : '';
      const txt = clueText(c);
      const words = chips ? (txt.match(/\*\*(.+?)\*\*/g) || []).map((w) => w.slice(2, -2)).join(' ') : '';
      return `<li class="${fresh}"><span class="ci">${CLUE_ICON[c.attr]}</span><span>${chips ? `<b>${words}</b>` : bold(txt)}</span></li>`;
    }).join('');
    const roomClue = kase.clues.slice(0, revealed).find((c) => c.attr === 'room');
    $('rooms').hidden = kase.level < 3;
    $('rooms').innerHTML = Object.keys(ROOMS).map((r) =>
      `<span class="room${roomClue && roomClue.val === r ? ' crime' : ''}">${ROOMS[r].icon}</span>`).join('');
  }

  // Shows a clue card; `then` runs when she taps ➡️.
  let afterClue = null;
  function giveClue(then) {
    revealed++;
    const c = kase.clues[revealed - 1];
    $('clue-head').textContent = '📝 ' + M.t(TEXT.newClue);
    $('clue-text').innerHTML = bold(clueText(c));
    $('clue-pop').hidden = false;
    M.sounds.match();
    say(clueText(c));
    afterClue = then;
  }
  $('clue-next').addEventListener('click', () => {
    M.sounds.pop();
    $('clue-pop').hidden = true;
    if (afterClue) { const f = afterClue; afterClue = null; f(); }
  });

  // ---------- Steps ----------
  // The Mellis rule: 3 hearts per case, "oh oh" + pause on mistakes,
  // 0 hearts = a brand-new case (so remembered answers don't help)
  const round = M.round({ heartsEl: $('hearts'), onOut: () => newCase(kase.level) });

  function newCase(lvl) {
    round.start();
    kase = makeCase(lvl);
    revealed = 0;
    asked.clear();
    show('intro');
    renderText();
    say(M.t(OWL.brief) + ' ' + M.t(kase.crime), { pitch: 0.7 });
  }

  function startFoot() {
    show('foot');
    const thiefShoes = kase.clues[0].val;
    $('footprint').innerHTML = footprintSVG(thiefShoes);
    $('foot-choices').innerHTML = shuffle(SHOES.slice()).map((s) =>
      `<button class="choice" data-shoe="${s}">${SHOE_ICON[s]}</button>`).join('');
    say(M.t(TEXT.foot));
  }
  $('foot-choices').addEventListener('click', (e) => {
    const b = e.target.closest('.choice');
    if (!b || round.busy || b.classList.contains('used')) return;
    if (b.dataset.shoe !== kase.clues[0].val) {
      bump(b);
      b.classList.add('used');
      round.wrong('foot').then(({ reveal }) => {
        if (!reveal) return;
        document.querySelector(`.choice[data-shoe="${kase.clues[0].val}"]`).classList.add('reveal');
        setTimeout(() => giveClue(startCode), 1400);
      });
      return;
    }
    giveClue(startCode);
  });

  // Ciphers: symbols / numbers (Easy), mirror writing / symbols with decoys (Medium), letter shift (Hard)
  function startCode() {
    const fresh = step !== 'code';
    show('code');
    codeWord = SCARVES[kase.clues[1].val][M.lang];
    codeIdx = 0;
    const type = kase.codeType;
    const letters = [...new Set(codeWord.split(''))];
    const pool = 'ABCDEFGHIJKLMNOPRSTUVZ'.split('').filter((l) => !letters.includes(l));
    const size = type === 'decoys' ? 12 : 8;
    const keyLetters = shuffle(letters.concat(shuffle(pool).slice(0, Math.max(0, size - letters.length))));
    const syms = shuffle(SYMBOLS.slice());
    codeMap = {};
    keyLetters.forEach((l, i) => {
      codeMap[l] = type === 'numbers' ? String(l.charCodeAt(0) - 64)
        : type === 'mirror' ? l
        : type === 'shift' ? ABC[(ABC.indexOf(l) + 1) % 26]
        : syms[i];
    });
    const lettersOnly = type === 'mirror' || type === 'shift';
    $('note').className = 'note' + (type === 'mirror' ? ' mirror' : '');
    $('note').innerHTML = codeWord.split('').map((l, i) =>
      `<span class="slot${i === 0 ? ' now' : ''}"><span class="sym">${codeMap[l]}</span><span class="let"></span></span>`).join('');
    $('abc').hidden = type !== 'shift';
    $('abc').innerHTML = ABC.split('').map((l) => `<span>${l}</span>`).join('');
    const keyOrder = type === 'numbers' || lettersOnly ? keyLetters.slice().sort() : keyLetters;
    $('key').className = 'key' + (size > 8 ? ' big' : '');
    $('key').innerHTML = keyOrder.map((l) =>
      `<button class="keybtn" data-l="${l}">${lettersOnly ? '' : `<span class="sym">${codeMap[l]}</span>`}<span class="let">${l}</span></button>`).join('');
    if (fresh) say(M.t(TEXT[type] || TEXT.code));
  }
  $('key').addEventListener('click', (e) => {
    const b = e.target.closest('.keybtn');
    if (!b || codeIdx >= codeWord.length || round.busy) return;
    if (b.dataset.l !== codeWord[codeIdx]) {
      bump(b);
      const at = codeIdx;
      round.wrong('code' + at).then(({ reveal }) => {
        if (!reveal || codeIdx !== at) return;
        const right = document.querySelector(`.keybtn[data-l="${codeWord[at]}"]`);
        right.classList.add('reveal');
        setTimeout(() => { right.classList.remove('reveal'); typeLetter(codeWord[at]); }, 1400);
      });
      return;
    }
    typeLetter(b.dataset.l);
  });

  function typeLetter(l) {
    M.sounds.flip();
    const slots = $('note').children;
    slots[codeIdx].querySelector('.let').textContent = l;
    slots[codeIdx].classList.remove('now');
    codeIdx++;
    if (codeIdx < codeWord.length) { slots[codeIdx].classList.add('now'); return; }
    $('note').classList.add('solved');
    setTimeout(() => giveClue(startSuspects), 600);
  }

  function renderSuspects() {
    $('suspects').className = 'suspects' + (kase.suspects.length > 6 ? ' eight' : '');
    $('suspects').innerHTML = kase.suspects.map((s, i) =>
      `<button class="suspect" data-i="${i}">${suspectSVG(s)}${kase.level > 2 && asked.has(i) ? `<span class="room-tag">${ROOMS[s.room].icon}</span>` : ''}</button>`).join('');
  }

  function startSuspects() {
    show('suspects');
    renderSuspects();
    renderClues();
    say(M.t(TEXT.suspects));
  }

  // ---------- Talking suspects ----------
  function talkLine(s) {
    const excuse = M.t(EXCUSES[s.animal]);
    if (kase.level < 3) return excuse;
    return ALIBI[M.lang](ROOMS[s.room][M.lang]) + ' ' + excuse;
  }
  function renderTalk() {
    const s = kase.suspects[talking];
    $('talk-face').innerHTML = suspectSVG(s);
    $('talk-text').innerHTML = bold(talkLine(s));
  }
  $('suspects').addEventListener('click', (e) => {
    const b = e.target.closest('.suspect');
    if (!b || b.classList.contains('out') || !$('clue-pop').hidden || round.busy) return;
    talking = +b.dataset.i;
    const s = kase.suspects[talking];
    renderTalk();
    $('talk-pop').hidden = false;
    M.sounds.boing();
    say(talkLine(s), { pitch: ANIMALS[s.animal].pitch });
    if (kase.level > 2 && !asked.has(talking)) {
      asked.add(talking);
      b.insertAdjacentHTML('beforeend', `<span class="room-tag">${ROOMS[s.room].icon}</span>`);
    }
  });
  $('talk-back').addEventListener('click', () => { M.sounds.pop(); $('talk-pop').hidden = true; });

  // A cross-out only counts if a clue she already has rules that suspect out.
  $('talk-out').addEventListener('click', () => {
    if (round.busy) return;
    $('talk-pop').hidden = true;
    const b = $('suspects').children[talking];
    const s = kase.suspects[talking];
    const known = kase.clues.slice(0, revealed);
    if (known.every((c) => matches(s, c))) {
      b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
      round.wrong('suspects' + revealed).then(({ reveal }) => {
        if (!reveal) return;
        // 2nd miss with these clues: show who the clues rule out
        const cards = [...$('suspects').children];
        cards.forEach((c, i) => {
          if (!c.classList.contains('out') && !known.every((k) => matches(kase.suspects[i], k))) c.classList.add('reveal');
        });
        setTimeout(() => {
          cards.forEach((c) => { if (c.classList.contains('reveal')) { c.classList.remove('reveal'); c.classList.add('out'); } });
          afterCross(known);
        }, 1600);
      });
      return;
    }
    b.classList.add('out');
    M.sounds.pop();
    afterCross(known);
  });

  function afterCross(known) {
    const standing = kase.suspects.filter((x, i) => !$('suspects').children[i].classList.contains('out'));
    const pending = standing.filter((x) => !known.every((c) => matches(x, c)));
    if (pending.length) return;
    if (standing.length === 1) { setTimeout(startPrint, 700); return; }
    setTimeout(() => giveClue(renderClues), 500);
  }

  function startPrint() {
    show('print');
    $('print-scene').innerHTML = printSVG(kase.print);
    $('prints').innerHTML = printOptions(kase.print).map((p) =>
      `<button class="print" data-ok="${p.ok ? 1 : 0}">${printSVG(p)}</button>`).join('');
    say(M.t(TEXT.print));
  }
  $('prints').addEventListener('click', (e) => {
    const b = e.target.closest('.print');
    if (!b || round.busy || b.classList.contains('used')) return;
    if (b.dataset.ok !== '1') {
      bump(b);
      b.classList.add('used');
      round.wrong('print').then(({ reveal }) => {
        if (!reveal) return;
        document.querySelector('.print[data-ok="1"]').classList.add('reveal');
        setTimeout(solved, 1400);
      });
      return;
    }
    solved();
  });

  // ---------- Arrest ----------
  function confession(c) { return M.t(c.why) + ' ' + M.t(SORRY); }
  function solved() {
    const n = solvedCount() + 1;
    saveVal(SOLVED_KEY, String(n));
    const stars = round.stars();
    if (stars === 3) saveVal(GOLD_KEY, String(goldCount() + 1));
    const thief = kase.suspects.find((s) => s.thief);
    const look = { ...thief };
    delete look.thief;
    saveVal(CAUGHT_KEY, JSON.stringify([{ s: look, item: kase.crime.item, c: CRIMES.indexOf(kase.crime), g: stars === 3 ? 1 : 0 }]
      .concat(caughtList()).slice(0, CAUGHT_MAX)));
    $('win-stars').innerHTML = M.starsHTML(stars);
    $('win-text').textContent = M.t(TEXT.caught);
    $('win-owl').innerHTML = owlSVG(true);
    $('caught').innerHTML = `<div class="caught-thief">${suspectSVG(thief)}<div class="net"></div></div><span class="caught-item">${kase.crime.item}</span>`;
    $('confess').textContent = confession(kase.crime);
    $('win-rank').textContent = `${stars === 3 ? '🥇' : '🏅'} ${n} · ${M.t(rankFor(n))}`;
    $('win').hidden = false;
    M.sounds.win();
    M.confetti();
    setTimeout(() => say(confession(kase.crime), {
      pitch: ANIMALS[thief.animal].pitch,
      onend: () => setTimeout(() => say(M.t(OWL.win), { pitch: 0.7 }), 300),
    }), 900);
  }

  // ---------- Gallery of caught thieves ----------
  function openGallery() {
    const list = caughtList();
    $('gallery-grid').innerHTML = list.length
      ? list.map((m, i) => `<button class="mug${m.g ? ' gold' : ''}" data-i="${i}">${suspectSVG(m.s)}<span class="mug-item">${m.item}</span><span class="mug-stamp">${M.t(TEXT.stamp)}</span></button>`).join('')
      : `<p class="gallery-empty">${M.t(TEXT.galleryEmpty)}</p>`;
    $('gallery').hidden = false;
  }
  $('gallery-btn').addEventListener('click', () => { M.sounds.pop(); openGallery(); });
  $('gallery-close').addEventListener('click', () => { M.sounds.pop(); $('gallery').hidden = true; });
  $('gallery-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.mug');
    if (!b) return;
    const m = caughtList()[+b.dataset.i];
    if (!m || !CRIMES[m.c]) return;
    b.classList.remove('talk'); void b.offsetWidth; b.classList.add('talk');
    M.sounds.boing();
    say(confession(CRIMES[m.c]), { pitch: (ANIMALS[m.s.animal] || {}).pitch });
  });

  // ---------- Wiring ----------
  M.mountControls($('controls'));
  M.onLang(renderText);
  $('owl-lobby').innerHTML = owlSVG(false);
  $('owl-intro').innerHTML = owlSVG(false);
  M.music.button($('music-lobby'));
  M.music.button($('music-case'));
  M.music.play('jazz');
  show('lobby');
  renderText();
  if (window.speechSynthesis) speechSynthesis.addEventListener('voiceschanged', renderSayButtons);

  document.querySelectorAll('.case-level').forEach((b) => b.addEventListener('click', () => {
    const lvl = +b.dataset.level;
    const missing = UNLOCK[lvl] - solvedCount();
    if (missing > 0) {
      M.sounds.miss();
      const msg = TEXT.locked[M.lang](missing);
      $('owl-lobby-say').textContent = msg;
      say(msg, { pitch: 0.7 });
      return;
    }
    M.sounds.pop();
    newCase(lvl);
  }));
  $('start-case').addEventListener('click', () => { M.sounds.pop(); startFoot(); });
  $('again').addEventListener('click', () => { M.sounds.pop(); newCase(kase.level); });
  $('to-lobby').addEventListener('click', () => { M.sounds.pop(); kase = null; show('lobby'); renderText(); });
  document.querySelectorAll('.say').forEach((b) => b.addEventListener('click', () => {
    M.sounds.pop();
    if (b.dataset.say === 'clues') say(kase.clues.slice(0, revealed).map(clueText).join(' '));
    else say($(b.dataset.say).textContent);
  }));
})();
