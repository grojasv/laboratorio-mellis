// Guide for parents and teachers: the idea behind the lab and what each game does.
// Per-game texts come from the `guide` field in games.js, so new games show up here.
(function () {
  const M = window.Mellis;
  const L = (ca, es, en) => ({ ca, es, en });
  const $ = (id) => document.getElementById(id);

  const T = {
    title: L('Famílies i mestres', 'Familias y docentes', 'Parents & teachers'),
    h: L('Guia per a famílies i mestres', 'Guía para familias y docentes', 'A guide for parents & teachers'),
    lead: L(
      'El Laboratorio Mellis és una col·lecció de jocs per aprendre per a infants de 6 a 8 anys, en català, castellà i anglès. Aquí teniu què fa cada joc i què treballa.',
      'El Laboratorio Mellis es una colección de juegos para aprender para niños y niñas de 6 a 8 años, en catalán, castellano e inglés. Aquí tenéis qué hace cada juego y qué trabaja.',
      'Laboratorio Mellis is a collection of learning games for children aged 6 to 8, in Catalan, Spanish and English. Here is what each game does and what it practises.'),
    open: L('Obre el laboratori', 'Abre el laboratorio', 'Open the lab'),
    share: L('Comparteix', 'Comparte', 'Share'),
    copied: L('Enllaç copiat! ✅', '¡Enlace copiado! ✅', 'Link copied! ✅'),
    shareText: L(
      'Laboratorio Mellis: jocs per aprendre en català, castellà i anglès. Guia per a famílies i mestres:',
      'Laboratorio Mellis: juegos para aprender en catalán, castellano e inglés. Guía para familias y docentes:',
      'Laboratorio Mellis: learning games in Catalan, Spanish and English. A guide for parents & teachers:'),
    idea: L('La idea', 'La idea', 'The idea'),
    games: L('🎮 Jocs', '🎮 Juegos', '🎮 Games'),
    read: L('📚 Llegim', '📚 Leemos', '📚 We read'),
    learn: L('🔬 Aprenem', '🔬 Aprendemos', '🔬 We learn'),
    learnNote: L(
      "Unitats que segueixen el que s'estudia a l'escola. Cada lliçó: explorar (tocar i escoltar) → fer → comprovar → recompensa (cromos per a l'àlbum de la unitat).",
      'Unidades que siguen lo que se estudia en la escuela. Cada lección: explorar (tocar y escuchar) → hacer → comprobar → recompensa (cromos para el álbum de la unidad).',
      'Units that follow what they study at school. Each lesson: explore (tap and listen) → do → check → reward (cards for the unit album).'),
    tips: L('Consells per als adults', 'Consejos para los adultos', 'Tips for adults'),
  };

  const IDEA = [
    ['🧒', L(
      'Va néixer per a dues germanes bessones de 7 anys (les Mellis) i el compartim amb qui el vulgui fer servir.',
      'Nació para dos hermanas gemelas de 7 años (las Mellis) y lo compartimos con quien quiera usarlo.',
      'It was made for 7-year-old twin sisters (the Mellis) and is shared with anyone who wants to use it.')],
    ['🏫', L(
      "Molts jocs segueixen el que es treballa a l'escola (en català), amb castellà i anglès sempre a un toc.",
      'Muchos juegos siguen lo que se trabaja en la escuela (en catalán), con castellano e inglés siempre a un toque.',
      'Many games follow what is done at school (in Catalan), with Spanish and English always one tap away.')],
    ['🧠', L(
      'Endevinar no surt a compte: no hi ha pistes, i les estrelles es guanyen pensant. Si s\'equivoca dues vegades, el joc ensenya la resposta i continua.',
      'Adivinar no sale a cuenta: no hay pistas, y las estrellas se ganan pensando. Si se equivoca dos veces, el juego enseña la respuesta y sigue.',
      "Guessing doesn't pay: there are no hints, and stars are earned by thinking. After two misses, the game shows the answer and moves on.")],
    ['🔒', L(
      "Sense anuncis, sense comptes i sense compres. Fotos, gravacions i progrés es queden al dispositiu; no s'envia res enlloc.",
      'Sin anuncios, sin cuentas y sin compras. Fotos, grabaciones y progreso se quedan en el dispositivo; no se envía nada a ningún sitio.',
      'No ads, no accounts, no purchases. Photos, recordings and progress stay on the device; nothing is sent anywhere.')],
    ['📲', L(
      "Funciona sense connexió i es pot instal·lar com una app: a l'iPhone, Safari → Compartir → Afegeix a la pantalla d'inici; a Android, el botó 📲 del laboratori.",
      'Funciona sin conexión y se puede instalar como una app: en iPhone, Safari → Compartir → Añadir a pantalla de inicio; en Android, el botón 📲 del laboratorio.',
      'Works offline and can be installed as an app: on iPhone, Safari → Share → Add to Home Screen; on Android, the lab\'s 📲 button.')],
  ];

  const TIPS = [
    ['👀', L(
      "Els primers cops, seieu al costat i demaneu-li que us expliqui què fa: explicar-ho també és aprendre.",
      'Las primeras veces, sentaos al lado y pedidle que os explique qué hace: explicarlo también es aprender.',
      'The first few times, sit alongside and ask them to explain what they are doing: explaining is learning too.')],
    ['📻', L(
      'Ràdio Mellis i el Passaport lector són per jugar-hi en família, amb llibres de paper de veritat.',
      'Radio Mellis y el Pasaporte lector son para jugar en familia, con libros de papel de verdad.',
      'Radio Mellis and the Reading passport are made for the whole family, with real paper books.')],
    ['💛', L(
      'Després de Bons amics, pregunteu: "I tu, què hauries fet?". Les històries són un bon punt de partida per parlar d\'emocions.',
      'Después de Buenos amigos, preguntad: "¿Y tú qué habrías hecho?". Las historias son un buen punto de partida para hablar de emociones.',
      'After Good friends, ask: "What would you have done?". The stories are a good way into talking about feelings.')],
    ['🌍', L(
      "Canvieu la llengua amb les banderes de dalt: textos i veus canvien alhora. Jugar en una altra llengua és una bona pràctica.",
      'Cambiad el idioma con las banderas de arriba: textos y voces cambian a la vez. Jugar en otro idioma es una buena práctica.',
      'Switch language with the flags at the top: texts and voices change together. Playing in another language is good practice.')],
    ['⏱️', L(
      'Les partides són curtes (5–10 minuts). Millor una estona cada dia que una sessió llarga.',
      'Las partidas son cortas (5–10 minutos). Mejor un rato cada día que una sesión larga.',
      'Rounds are short (5–10 minutes). A little every day works better than one long session.')],
  ];

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const points = (list) => list.map(([icon, text]) =>
    `<li><span class="pi">${icon}</span><span>${esc(M.t(text))}</span></li>`).join('');
  const card = (g) => `
    <a class="card" href="../${g.path}" style="border-left-color:${g.color}">
      <span class="icon">${g.icon}</span>
      <div>
        <h4>${esc(M.t(g.name))}</h4>
        <p class="tag">${esc(M.t(g.tagline))}</p>
        <p>${esc(M.t(g.guide || g.tagline))}</p>
      </div>
    </a>`;

  function render() {
    document.title = `${M.t(T.title)} · Laboratorio Mellis`;
    $('title').textContent = M.t(T.title);
    $('h-title').textContent = M.t(T.h);
    $('lead').textContent = M.t(T.lead);
    ['open-label', 'open-label-2'].forEach((id) => { $(id).textContent = M.t(T.open); });
    ['share-label', 'share-label-2'].forEach((id) => { $(id).textContent = M.t(T.share); });
    $('idea-title').textContent = M.t(T.idea);
    $('idea').innerHTML = points(IDEA);
    $('games-title').textContent = M.t(T.games);
    $('read-title').textContent = M.t(T.read);
    $('learn-title').textContent = M.t(T.learn);
    $('learn-note').textContent = M.t(T.learnNote);
    $('games').innerHTML = window.MELLIS_GAMES.filter((g) => !g.section).map(card).join('');
    $('read').innerHTML = window.MELLIS_GAMES.filter((g) => g.section === 'reading').map(card).join('');
    $('learn').innerHTML = window.MELLIS_LEARN.map(card).join('');
    $('tips-title').textContent = M.t(T.tips);
    $('tips').innerHTML = points(TIPS);
  }

  // Share this page's link (the native share sheet: WhatsApp, mail…), or copy it.
  async function share() {
    const url = new URL('./', location.href).href;
    const text = M.t(T.shareText);
    if (navigator.share) {
      try { await navigator.share({ title: 'Laboratorio Mellis', text, url }); } catch (e) { /* cancelled */ }
      return;
    }
    try { await navigator.clipboard.writeText(`${text} ${url}`); } catch (e) { prompt('', url); return; }
    $('copied').textContent = M.t(T.copied);
    $('copied').hidden = false;
    setTimeout(() => { $('copied').hidden = true; }, 2500);
  }
  $('share').addEventListener('click', share);
  $('share-2').addEventListener('click', share);

  M.mountControls($('controls'));
  $('mascots').innerHTML = M.mascotsSVG('wave');
  M.onLang(render);
  render();
})();
