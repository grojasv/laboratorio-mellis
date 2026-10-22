// Animals unit data, shared by every lesson of the unit (and the card album).
// Later lessons add fields (diet, birth, habitat, move) to the same animals.
(function () {
  const L = (ca, es, en) => ({ ca, es, en });

  // A salamander (no emoji for it): orange, black spots, four little legs
  const SALAMANDER = `<svg viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#3a3a5c" stroke-width="3" stroke-linejoin="round" fill="#ff8a1c">
      <path d="M22 44 l-10 14 M40 46 l-6 16 M74 46 l6 16 M92 44 l12 12" fill="none" stroke-linecap="round"/>
      <path d="M8 36 Q10 22 26 24 Q50 18 80 28 Q100 34 116 22 Q112 44 84 46 Q56 52 30 48 Q10 48 8 36 Z"/>
    </g>
    <g fill="#3a3a5c"><circle cx="40" cy="32" r="4"/><circle cx="58" cy="36" r="3.5"/><circle cx="74" cy="32" r="4"/><circle cx="92" cy="36" r="3"/></g>
    <circle cx="18" cy="32" r="3.5" fill="#fff"/><circle cx="18" cy="32" r="2" fill="#3a3a5c"/>
  </svg>`;

  // group: mammal | bird | fish | reptile | amphibian | invertebrate
  // why: the funny "trick" explanation for animals that look like another group
  window.ANIMALS = [
    { id: 'dog', e: '🐕', group: 'mammal', name: L('el gos', 'el perro', 'the dog') },
    { id: 'cow', e: '🐄', group: 'mammal', name: L('la vaca', 'la vaca', 'the cow') },
    { id: 'elephant', e: '🐘', group: 'mammal', name: L("l'elefant", 'el elefante', 'the elephant') },
    { id: 'lion', e: '🦁', group: 'mammal', name: L('el lleó', 'el león', 'the lion') },
    { id: 'rabbit', e: '🐇', group: 'mammal', name: L('el conill', 'el conejo', 'the rabbit') },
    { id: 'giraffe', e: '🦒', group: 'mammal', name: L('la girafa', 'la jirafa', 'the giraffe') },
    { id: 'monkey', e: '🐒', group: 'mammal', name: L('el mico', 'el mono', 'the monkey') },
    { id: 'whale', e: '🐋', group: 'mammal', name: L('la balena', 'la ballena', 'the whale'), look: 'fish',
      why: L('Viu al mar, però és un mamífer: els seus petits prenen llet!', 'Vive en el mar, pero es un mamífero: ¡sus crías toman leche!', 'It lives in the sea, but it is a mammal: its babies drink milk!') },
    { id: 'dolphin', e: '🐬', group: 'mammal', name: L('el dofí', 'el delfín', 'the dolphin'), look: 'fish',
      why: L('Neda com un peix, però respira aire i pren llet: és un mamífer!', 'Nada como un pez, pero respira aire y toma leche: ¡es un mamífero!', 'It swims like a fish, but breathes air and drinks milk: a mammal!') },
    { id: 'bat', e: '🦇', group: 'mammal', name: L('el ratpenat', 'el murciélago', 'the bat'), look: 'bird',
      why: L('Vola, però no té plomes: té pèl! És un mamífer.', 'Vuela, pero no tiene plumas: ¡tiene pelo! Es un mamífero.', 'It flies, but it has fur, not feathers! It is a mammal.') },
    { id: 'penguin', e: '🐧', group: 'bird', name: L('el pingüí', 'el pingüino', 'the penguin'), look: 'fish',
      why: L('No vola i neda molt bé, però té plomes i bec: és un ocell!', 'No vuela y nada muy bien, pero tiene plumas y pico: ¡es un ave!', "It can't fly and swims well, but it has feathers and a beak: a bird!") },
    { id: 'eagle', e: '🦅', group: 'bird', name: L("l'àliga", 'el águila', 'the eagle') },
    { id: 'owl', e: '🦉', group: 'bird', name: L('el mussol', 'el búho', 'the owl') },
    { id: 'hen', e: '🐔', group: 'bird', name: L('la gallina', 'la gallina', 'the hen') },
    { id: 'parrot', e: '🦜', group: 'bird', name: L('el lloro', 'el loro', 'the parrot') },
    { id: 'flamingo', e: '🦩', group: 'bird', name: L('el flamenc', 'el flamenco', 'the flamingo') },
    { id: 'duck', e: '🦆', group: 'bird', name: L("l'ànec", 'el pato', 'the duck') },
    { id: 'shark', e: '🦈', group: 'fish', name: L('el tauró', 'el tiburón', 'the shark'),
      why: L('És enorme i fa por, però té aletes i brànquies: és un peix!', 'Es enorme y da miedo, pero tiene aletas y branquias: ¡es un pez!', 'It is huge and scary, but it has fins and gills: a fish!') },
    { id: 'fish', e: '🐟', group: 'fish', name: L('la sardina', 'la sardina', 'the sardine') },
    { id: 'clownfish', e: '🐠', group: 'fish', name: L('el peix pallasso', 'el pez payaso', 'the clownfish') },
    { id: 'blowfish', e: '🐡', group: 'fish', name: L('el peix globus', 'el pez globo', 'the pufferfish') },
    { id: 'turtle', e: '🐢', group: 'reptile', name: L('la tortuga', 'la tortuga', 'the turtle') },
    { id: 'crocodile', e: '🐊', group: 'reptile', name: L('el cocodril', 'el cocodrilo', 'the crocodile') },
    { id: 'lizard', e: '🦎', group: 'reptile', name: L('la sargantana', 'la lagartija', 'the lizard'), look: 'amphibian' },
    { id: 'snake', e: '🐍', group: 'reptile', name: L('la serp', 'la serpiente', 'the snake'),
      why: L("No té potes, però té escates seques i ossos: és un rèptil!", 'No tiene patas, pero tiene escamas secas y huesos: ¡es un reptil!', 'It has no legs, but dry scales and bones: a reptile!') },
    { id: 'frog', e: '🐸', group: 'amphibian', name: L('la granota', 'la rana', 'the frog'), look: 'reptile' },
    { id: 'salamander', svg: SALAMANDER, group: 'amphibian', name: L('la salamandra', 'la salamandra', 'the salamander'), look: 'reptile',
      why: L('Sembla una sargantana, però té la pell humida i sense escates: és un amfibi!', 'Parece una lagartija, pero tiene la piel húmeda y sin escamas: ¡es un anfibio!', 'It looks like a lizard, but its skin is wet with no scales: an amphibian!') },
    { id: 'snail', e: '🐌', group: 'invertebrate', name: L('el cargol', 'el caracol', 'the snail') },
    { id: 'butterfly', e: '🦋', group: 'invertebrate', name: L('la papallona', 'la mariposa', 'the butterfly'), look: 'bird',
      why: L('Té ales i vola, però no té ossos: és un invertebrat!', 'Tiene alas y vuela, pero no tiene huesos: ¡es un invertebrado!', 'It has wings and flies, but no bones: an invertebrate!') },
    { id: 'bee', e: '🐝', group: 'invertebrate', name: L("l'abella", 'la abeja', 'the bee') },
    { id: 'spider', e: '🕷️', group: 'invertebrate', name: L("l'aranya", 'la araña', 'the spider') },
    { id: 'octopus', e: '🐙', group: 'invertebrate', name: L('el pop', 'el pulpo', 'the octopus'), look: 'fish',
      why: L('Viu al mar, però no té ni un sol os: és un invertebrat!', 'Vive en el mar, pero no tiene ni un hueso: ¡es un invertebrado!', 'It lives in the sea, but has no bones at all: an invertebrate!') },
    { id: 'ant', e: '🐜', group: 'invertebrate', name: L('la formiga', 'la hormiga', 'the ant') },
    { id: 'crab', e: '🦀', group: 'invertebrate', name: L('el cranc', 'el cangrejo', 'the crab') },
    { id: 'worm', e: '🪱', group: 'invertebrate', name: L('el cuc', 'el gusano', 'the worm') },
  ];

  window.ANIMAL_GROUPS = {
    mammal: { icon: '🐾', color: '#ff9f1c', ex: '🐕', name: L('Mamífers', 'Mamíferos', 'Mammals'),
      fact: L('Els mamífers tenen pèl i els seus petits prenen llet de la mare.', 'Los mamíferos tienen pelo y sus crías toman leche de su madre.', "Mammals have fur and their babies drink their mother's milk.") },
    bird: { icon: '🪶', color: '#3a86ff', ex: '🦜', name: L('Ocells', 'Aves', 'Birds'),
      fact: L('Els ocells tenen plomes, bec, dues potes i dues ales.', 'Las aves tienen plumas, pico, dos patas y dos alas.', 'Birds have feathers, a beak, two legs and two wings.') },
    fish: { icon: '🌊', color: '#2ec4b6', ex: '🐟', name: L('Peixos', 'Peces', 'Fish'),
      fact: L("Els peixos viuen a l'aigua, tenen escates i aletes i respiren per brànquies.", 'Los peces viven en el agua, tienen escamas y aletas y respiran por branquias.', 'Fish live in water, have scales and fins and breathe with gills.') },
    reptile: { icon: '🦎', color: '#3fb36b', ex: '🐊', name: L('Rèptils', 'Reptiles', 'Reptiles'),
      fact: L("Els rèptils tenen la pell coberta d'escates seques i s'arrosseguen o caminen amb potes curtes.", 'Los reptiles tienen la piel cubierta de escamas secas y se arrastran o caminan con patas cortas.', 'Reptiles have dry, scaly skin and crawl or walk on short legs.') },
    amphibian: { icon: '💧', color: '#9b5de5', ex: '🐸', name: L('Amfibis', 'Anfibios', 'Amphibians'),
      fact: L("Els amfibis tenen la pell nua i humida. De petits viuen a l'aigua!", 'Los anfibios tienen la piel desnuda y húmeda. ¡De pequeños viven en el agua!', 'Amphibians have bare, wet skin. When they are little they live in water!') },
    invertebrate: { icon: '🚫', color: '#e5383b', ex: '🐌', name: L('Invertebrats', 'Invertebrados', 'Invertebrates'),
      fact: L('Els invertebrats no tenen ossos ni columna vertebral.', 'Los invertebrados no tienen huesos ni columna vertebral.', 'Invertebrates have no bones and no backbone.') },
  };
})();

// Facts per animal for lessons 2–4: "diet birth habitat move" ('-' = left out: not clear-cut for a 7-year-old)
(function () {
  const L = (ca, es, en) => ({ ca, es, en });
  const FACTS = {
    dog: '- vivi land walk', cow: 'herb vivi land walk', elephant: 'herb vivi land walk', lion: 'carn vivi land walk',
    rabbit: 'herb vivi land jump', giraffe: 'herb vivi land walk', monkey: 'omni vivi land -', whale: 'carn vivi water swim',
    dolphin: 'carn vivi water swim', bat: '- vivi air fly', penguin: 'carn ovi - swim', eagle: 'carn ovi air fly',
    owl: 'carn ovi air fly', hen: 'omni ovi land walk', parrot: 'herb ovi air fly', flamingo: '- ovi air fly',
    duck: 'omni ovi - -', shark: 'carn - water swim', fish: '- ovi water swim', clownfish: 'omni ovi water swim',
    blowfish: '- ovi water swim', turtle: '- ovi - -', crocodile: 'carn ovi - -', lizard: 'carn ovi land -',
    snake: 'carn ovi land crawl', frog: 'carn ovi - jump', salamander: 'carn ovi - -', snail: 'herb ovi land crawl',
    butterfly: 'herb ovi air fly', bee: 'herb ovi air fly', spider: 'carn ovi land walk', octopus: 'carn ovi water swim',
    ant: 'omni ovi land walk', crab: 'omni ovi water walk', worm: '- - land crawl',
  };
  // feminine in CA and ES (for "la vaca és herbívora")
  const FEM = ['cow', 'giraffe', 'whale', 'eagle', 'hen', 'fish', 'turtle', 'lizard', 'snake', 'frog', 'salamander', 'butterfly', 'bee', 'spider', 'ant'];
  window.ANIMALS.forEach((a) => {
    const [diet, birth, habitat, move] = FACTS[a.id].split(' ').map((v) => (v === '-' ? undefined : v));
    Object.assign(a, { diet, birth, habitat, move, f: FEM.includes(a.id) });
  });

  // adj: [masculine, feminine] in CA/ES; en: noun phrase
  window.ANIMAL_FIELDS = {
    diet: {
      herb: { icon: '🥬', ex: '🐄', color: '#3fb36b', name: L('Herbívors', 'Herbívoros', 'Herbivores'),
        adj: { ca: ['herbívor', 'herbívora'], es: ['herbívoro', 'herbívora'], en: 'a herbivore' },
        why: L('menja plantes', 'come plantas', 'it eats plants'),
        fact: L('Els herbívors només mengen plantes: herba, fulles, fruita, flors...', 'Los herbívoros solo comen plantas: hierba, hojas, fruta, flores...', 'Herbivores only eat plants: grass, leaves, fruit, flowers...'),
        q: L("Quin d'aquests NO és herbívor?", '¿Cuál de estos NO es herbívoro?', 'Which one is NOT a herbivore?') },
      carn: { icon: '🍖', ex: '🦁', color: '#e5383b', name: L('Carnívors', 'Carnívoros', 'Carnivores'),
        adj: { ca: ['carnívor', 'carnívora'], es: ['carnívoro', 'carnívora'], en: 'a carnivore' },
        why: L('menja altres animals', 'come otros animales', 'it eats other animals'),
        fact: L('Els carnívors mengen altres animals.', 'Los carnívoros comen otros animales.', 'Carnivores eat other animals.'),
        q: L("Quin d'aquests NO és carnívor?", '¿Cuál de estos NO es carnívoro?', 'Which one is NOT a carnivore?') },
      omni: { icon: '🥗', ex: '🐔', color: '#ff9f1c', name: L('Omnívors', 'Omnívoros', 'Omnivores'),
        adj: { ca: ['omnívor', 'omnívora'], es: ['omnívoro', 'omnívora'], en: 'an omnivore' },
        why: L('menja plantes i animals', 'come plantas y animales', 'it eats plants and animals'),
        fact: L('Els omnívors mengen de tot: plantes i animals. Com nosaltres!', 'Los omnívoros comen de todo: plantas y animales. ¡Como nosotros!', 'Omnivores eat everything: plants and animals. Just like us!'),
        q: L("Quin d'aquests NO és omnívor?", '¿Cuál de estos NO es omnívoro?', 'Which one is NOT an omnivore?') },
    },
    birth: {
      ovi: { icon: '🥚', ex: '🐣', color: '#ffb703', name: L('Ovípars', 'Ovíparos', 'Egg-layers'),
        adj: { ca: ['ovípar', 'ovípara'], es: ['ovíparo', 'ovípara'], en: 'oviparous' },
        why: L("neix d'un ou", 'nace de un huevo', 'it hatches from an egg'),
        fact: L("Els ovípars neixen d'un ou. La mare pon els ous i, quan es trenquen, en surten les cries.", 'Los ovíparos nacen de un huevo. La madre pone los huevos y, cuando se rompen, salen las crías.', 'Egg-layers hatch from eggs. The mother lays the eggs and the babies hatch out.'),
        q: L("Quin d'aquests NO neix d'un ou?", '¿Cuál de estos NO nace de un huevo?', 'Which one does NOT hatch from an egg?') },
      vivi: { icon: '🍼', ex: '🐘', color: '#ff6fb5', name: L('Vivípars', 'Vivíparos', 'Live-born'),
        adj: { ca: ['vivípar', 'vivípara'], es: ['vivíparo', 'vivípara'], en: 'viviparous' },
        why: L('creix dins la panxa de la mare', 'crece dentro de la barriga de su madre', "it grows inside its mother's tummy"),
        fact: L('Els vivípars creixen dins la panxa de la mare fins que neixen.', 'Los vivíparos crecen dentro de la barriga de su madre hasta que nacen.', "Live-born babies grow inside their mother's tummy until they are born."),
        q: L("Quin d'aquests NO creix dins la panxa de la mare?", '¿Cuál de estos NO crece dentro de la barriga de su madre?', "Which one does NOT grow inside its mother's tummy?") },
    },
    habitat: {
      land: { icon: '🌳', ex: '🐘', color: '#7cb342', name: L('Terrestres', 'Terrestres', 'Land animals'),
        adj: { ca: ['terrestre', 'terrestre'], es: ['terrestre', 'terrestre'], en: 'a land animal' },
        why: L('viu a la terra', 'vive en la tierra', 'it lives on land'),
        fact: L('Els animals terrestres viuen a la terra: al bosc, al camp, a la selva...', 'Los animales terrestres viven en la tierra: en el bosque, en el campo, en la selva...', 'Land animals live on the ground: in forests, fields, jungles...'),
        q: L("Quin d'aquests NO viu a la terra?", '¿Cuál de estos NO vive en la tierra?', 'Which one does NOT live on land?') },
      water: { icon: '🌊', ex: '🐬', color: '#2e86de', name: L('Aquàtics', 'Acuáticos', 'Water animals'),
        adj: { ca: ['aquàtic', 'aquàtica'], es: ['acuático', 'acuática'], en: 'a water animal' },
        why: L("viu a l'aigua", 'vive en el agua', 'it lives in water'),
        fact: L("Els animals aquàtics viuen a l'aigua: al mar, als rius, als llacs...", 'Los animales acuáticos viven en el agua: en el mar, en los ríos, en los lagos...', 'Water animals live in water: seas, rivers, lakes...'),
        q: L("Quin d'aquests NO viu a l'aigua?", '¿Cuál de estos NO vive en el agua?', 'Which one does NOT live in water?') },
      air: { icon: '☁️', ex: '🦅', color: '#5bc0eb', name: L('Aeris', 'Aéreos', 'Air animals'),
        adj: { ca: ['aeri', 'aèria'], es: ['aéreo', 'aérea'], en: 'an air animal' },
        why: L("passa molta estona volant per l'aire", 'pasa mucho tiempo volando por el aire', 'it spends a lot of time flying'),
        fact: L("Els animals aeris passen molta estona volant per l'aire.", 'Los animales aéreos pasan mucho tiempo volando por el aire.', 'Air animals spend a lot of time flying through the air.'),
        q: L("Quin d'aquests NO vola per l'aire?", '¿Cuál de estos NO vuela por el aire?', 'Which one does NOT fly through the air?') },
    },
    move: {
      walk: { icon: '🦶', ex: '🦒', color: '#a0522d', name: L('Caminen', 'Caminan', 'Walk'), verb: L('camina', 'camina', 'walks'),
        fact: L('Molts animals caminen amb les potes: dues, quatre... o vuit!', 'Muchos animales caminan con las patas: dos, cuatro... ¡u ocho!', 'Many animals walk on their legs: two, four... or eight!'),
        q: L("Quin d'aquests NO camina?", '¿Cuál de estos NO camina?', 'Which one does NOT walk?') },
      fly: { icon: '🪽', ex: '🦋', color: '#5bc0eb', name: L('Volen', 'Vuelan', 'Fly'), verb: L('vola', 'vuela', 'flies'),
        fact: L('Els animals que volen tenen ales.', 'Los animales que vuelan tienen alas.', 'Animals that fly have wings.'),
        q: L("Quin d'aquests NO vola?", '¿Cuál de estos NO vuela?', 'Which one does NOT fly?') },
      swim: { icon: '🫧', ex: '🐠', color: '#2e86de', name: L('Neden', 'Nadan', 'Swim'), verb: L('neda', 'nada', 'swims'),
        fact: L('Els animals que neden es mouen per l\'aigua amb aletes o amb tot el cos.', 'Los animales que nadan se mueven por el agua con aletas o con todo el cuerpo.', 'Swimmers move through water with fins or their whole body.'),
        q: L("Quin d'aquests NO neda?", '¿Cuál de estos NO nada?', 'Which one does NOT swim?') },
      crawl: { icon: '〰️', ex: '🐍', color: '#8d6e63', name: L("S'arrosseguen", 'Se arrastran', 'Crawl'), verb: L("s'arrossega", 'se arrastra', 'crawls'),
        fact: L("Alguns animals s'arrosseguen per terra, sense potes.", 'Algunos animales se arrastran por el suelo, sin patas.', 'Some animals crawl along the ground with no legs.'),
        q: L("Quin d'aquests NO s'arrossega?", '¿Cuál de estos NO se arrastra?', 'Which one does NOT crawl?') },
      jump: { icon: '🦘', ex: '🐸', color: '#9b5de5', name: L('Salten', 'Saltan', 'Jump'), verb: L('salta', 'salta', 'jumps'),
        fact: L('Els animals que salten tenen les potes del darrere llargues i fortes.', 'Los animales que saltan tienen las patas de atrás largas y fuertes.', 'Jumpers have long, strong back legs.'),
        q: L("Quin d'aquests NO salta?", '¿Cuál de estos NO salta?', 'Which one does NOT jump?') },
    },
  };

  const TADPOLE = `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M44 30 Q64 14 74 30 T96 26" fill="none" stroke="#3a3a5c" stroke-width="6" stroke-linecap="round"/><ellipse cx="34" cy="30" rx="22" ry="17" fill="#3a3a5c"/><circle cx="24" cy="25" r="4" fill="#fff"/></svg>`;
  const CHRYSALIS = `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><path d="M6 8 H54" stroke="#8d6e63" stroke-width="6" stroke-linecap="round"/><path d="M30 8 V16" stroke="#3a3a5c" stroke-width="3"/><path d="M30 16 C48 26 48 70 30 92 C12 70 12 26 30 16 Z" fill="#7cb342" stroke="#3a3a5c" stroke-width="3"/><path d="M22 40 Q30 46 38 40 M21 56 Q30 62 39 56" fill="none" stroke="#3a3a5c" stroke-width="2"/></svg>`;

  // Ordering puzzles: food chains (lesson 2) and life cycles (lesson 3)
  window.ANIMAL_CHAINS = [
    { steps: [['🌿', L('herba', 'hierba', 'grass')], ['🐇', L('conill', 'conejo', 'rabbit')], ['🦊', L('guineu', 'zorro', 'fox')]],
      say: L('El conill menja herba, i la guineu menja el conill.', 'El conejo come hierba, y el zorro se come al conejo.', 'The rabbit eats grass, and the fox eats the rabbit.') },
    { steps: [['🌾', L('blat', 'trigo', 'wheat')], ['🐭', L('ratolí', 'ratón', 'mouse')], ['🦉', L('mussol', 'búho', 'owl')]],
      say: L('El ratolí menja blat, i el mussol menja el ratolí.', 'El ratón come trigo, y el búho se come al ratón.', 'The mouse eats wheat, and the owl eats the mouse.') },
    { steps: [['🍃', L('fulla', 'hoja', 'leaf')], ['🐛', L('eruga', 'oruga', 'caterpillar')], ['🐦', L('ocell', 'pájaro', 'bird')]],
      say: L("L'eruga menja fulles, i l'ocell menja l'eruga.", 'La oruga come hojas, y el pájaro se come a la oruga.', 'The caterpillar eats leaves, and the bird eats the caterpillar.') },
    { steps: [['🌱', L('algues', 'algas', 'seaweed')], ['🐟', L('peix petit', 'pez pequeño', 'little fish')], ['🦈', L('tauró', 'tiburón', 'shark')]],
      say: L('El peix petit menja algues, i el tauró menja el peix.', 'El pez pequeño come algas, y el tiburón se come al pez.', 'The little fish eats seaweed, and the shark eats the fish.') },
  ];
  window.ANIMAL_CYCLES = [
    { steps: [['🫧', L('ous', 'huevos', 'eggs')], [TADPOLE, L('capgròs', 'renacuajo', 'tadpole')], ['🐸', L('granota', 'rana', 'frog')]],
      say: L("Dels ous surten capgrossos, que viuen a l'aigua i després es fan granotes!", '¡De los huevos salen renacuajos, que viven en el agua y después se hacen ranas!', 'Tadpoles hatch from the eggs, live in water and then turn into frogs!') },
    { steps: [['🥚', L('ou', 'huevo', 'egg')], ['🐛', L('eruga', 'oruga', 'caterpillar')], [CHRYSALIS, L('crisàlide', 'crisálida', 'chrysalis')], ['🦋', L('papallona', 'mariposa', 'butterfly')]],
      say: L("De l'ou surt una eruga, que es fa una crisàlide... i en surt una papallona!", 'Del huevo sale una oruga, que se hace crisálida... ¡y sale una mariposa!', 'A caterpillar hatches from the egg, becomes a chrysalis... and out comes a butterfly!') },
    { steps: [['🥚', L('ou', 'huevo', 'egg')], ['🐣', L('pollet sortint', 'pollito saliendo', 'hatching')], ['🐥', L('pollet', 'pollito', 'chick')], ['🐔', L('gallina', 'gallina', 'hen')]],
      say: L("De l'ou surt un pollet, que creix i es fa una gallina!", '¡Del huevo sale un pollito, que crece y se hace gallina!', 'A chick hatches from the egg and grows into a hen!') },
  ];
})();
