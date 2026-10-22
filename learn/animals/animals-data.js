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
