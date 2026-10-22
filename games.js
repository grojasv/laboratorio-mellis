// The game catalogue shown on the hub. To add a game: create games/<id>/index.html
// and add one entry here.
window.MELLIS_GAMES = [
  {
    id: 'memory',
    path: 'games/memory/index.html',
    icon: '🗓️',
    color: '#ff6fb5',
    name: { ca: 'Memory dels mesos', es: 'Memory de los meses', en: 'Months Memory' },
    tagline: { ca: 'Mesos i estacions', es: 'Meses y estaciones', en: 'Months & seasons' },
  },
  {
    id: 'potions',
    path: 'games/potions/index.html',
    icon: '🧪',
    color: '#2ec4b6',
    name: { ca: 'Laboratori de pocions', es: 'Laboratorio de pociones', en: 'Potion Lab' },
    tagline: { ca: 'Sumes i restes', es: 'Sumas y restas', en: 'Adding & taking away' },
  },
  {
    id: 'monsters',
    path: 'games/monsters/index.html',
    icon: '🎃',
    color: '#9b5de5',
    name: { ca: 'Laboratori de monstres', es: 'Laboratorio de monstruos', en: 'Monster Lab' },
    tagline: { ca: 'Anglès de Halloween', es: 'Inglés de Halloween', en: 'Halloween English' },
  },
  {
    id: 'detective',
    path: 'games/detective/index.html',
    icon: '🕵️',
    color: '#ff9f1c',
    name: { ca: 'Agència de detectives', es: 'Agencia de detectives', en: 'Detective Agency' },
    tagline: { ca: 'Pistes, codis i empremtes', es: 'Pistas, códigos y huellas', en: 'Clues, codes & prints' },
  },
  {
    id: 'reading',
    path: 'games/reading/index.html',
    icon: '📖',
    color: '#3a86ff',
    name: { ca: 'Contes en veu alta', es: 'Cuentos en voz alta', en: 'Read-aloud Stories' },
    tagline: { ca: 'Llegeix i tria què passa', es: 'Lee y elige qué pasa', en: 'Read and choose what happens' },
  },
  {
    id: 'puppets',
    path: 'games/puppets/index.html',
    icon: '🎭',
    color: '#c0392b',
    name: { ca: 'Teatre de titelles', es: 'Teatro de títeres', en: 'Puppet Show' },
    tagline: { ca: 'Anglès: Back to School', es: 'Inglés: Back to School', en: 'English: Back to School' },
  },
];

// "Aprenem" (we learn): school subjects as short interactive lessons, one card per unit.
window.MELLIS_LEARN = [
  {
    id: 'animals',
    path: 'learn/animals/index.html',
    icon: '🐾',
    color: '#3fb36b',
    name: { ca: 'Els animals', es: 'Los animales', en: 'Animals' },
    tagline: { ca: 'Vertebrats, què mengen, com neixen…', es: 'Vertebrados, qué comen, cómo nacen…', en: 'Groups, food, babies…' },
  },
  {
    id: 'body',
    path: 'learn/body/index.html',
    icon: '🫀',
    color: '#ff6fb5',
    name: { ca: 'El cos humà', es: 'El cuerpo humano', en: 'The human body' },
    tagline: { ca: 'Sentits, esquelet, menjar, hàbits', es: 'Sentidos, esqueleto, comida, hábitos', en: 'Senses, skeleton, food, habits' },
  },
];
