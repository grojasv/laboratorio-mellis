// Human body unit: lessons, items (stickers) and drawings.
(function () {
  const L = (ca, es, en) => ({ ca, es, en });
  const INK = '#3a3a5c';
  const SKIN = '#ffd9b8';

  // ---------- Drawings ----------
  // Big face for the senses: eyes, ears, nose, mouth + a hand (data-p = what she taps)
  const FACE = `<svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg">
    <g data-p="hearing" class="tap"><ellipse cx="30" cy="110" rx="18" ry="28" fill="${SKIN}" stroke="${INK}" stroke-width="4"/><path d="M28 98 q-8 12 2 24" fill="none" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="170" cy="110" rx="18" ry="28" fill="${SKIN}" stroke="${INK}" stroke-width="4"/><path d="M172 98 q8 12 -2 24" fill="none" stroke="${INK}" stroke-width="3"/></g>
    <path d="M30 70 Q100 -20 170 70 Q150 30 100 32 Q50 30 30 70 Z" fill="#7b4a2d"/>
    <circle cx="100" cy="110" r="72" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
    <path d="M32 84 Q60 30 100 38 Q140 30 168 84 Q150 52 100 54 Q50 52 32 84 Z" fill="#7b4a2d" stroke="${INK}" stroke-width="3"/>
    <g data-p="sight" class="tap"><ellipse cx="72" cy="98" rx="17" ry="14" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="74" cy="100" r="8" fill="#4a7bd0"/><circle cx="74" cy="100" r="4" fill="${INK}"/>
      <ellipse cx="128" cy="98" rx="17" ry="14" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="130" cy="100" r="8" fill="#4a7bd0"/><circle cx="130" cy="100" r="4" fill="${INK}"/></g>
    <g data-p="smell" class="tap"><path d="M100 104 Q90 128 92 136 Q100 142 110 136 Q112 128 100 104 Z" fill="#ffc4a0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></g>
    <g data-p="taste" class="tap"><path d="M70 150 Q100 182 130 150 Z" fill="#7a2a3a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M88 160 Q100 190 112 160 Z" fill="#ff7aa8" stroke="${INK}" stroke-width="3"/></g>
    <circle cx="58" cy="132" r="9" fill="#ff9ec7" opacity=".6"/><circle cx="142" cy="132" r="9" fill="#ff9ec7" opacity=".6"/>
    <g data-p="touch" class="tap" transform="translate(178 186) rotate(-15)">
      <rect x="-22" y="-8" width="44" height="40" rx="16" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
      <g fill="${SKIN}" stroke="${INK}" stroke-width="4"><rect x="-21" y="-34" width="10" height="32" rx="5"/><rect x="-9" y="-40" width="10" height="38" rx="5"/><rect x="3" y="-37" width="10" height="35" rx="5"/><rect x="14" y="-28" width="9" height="28" rx="4.5"/></g>
      <rect x="-21" y="-8" width="44" height="14" fill="${SKIN}"/></g>
  </svg>`;

  // A kid standing: head, neck, trunk, arms (elbow, hand), legs (knee, foot)
  const limb = (d, p) => `<path data-p="${p}" class="tap" d="${d}" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path class="no" d="${d}" fill="none" stroke="${SKIN}" stroke-width="13" stroke-linecap="round" pointer-events="none"/>`;
  const leg = (d) => `<path data-p="leg" class="tap" d="${d}" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#3a86ff" stroke-width="15" stroke-linecap="round" pointer-events="none"/>`;
  const BODY = `<svg viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg">
    ${limb('M68 98 L46 146', 'arm')}${limb('M46 146 L38 192', 'arm')}${limb('M132 98 L154 146', 'arm')}${limb('M154 146 L162 192', 'arm')}
    <circle data-p="elbow" class="tap" cx="46" cy="146" r="10" fill="#ffc4a0" stroke="${INK}" stroke-width="3.5"/>
    <circle data-p="elbow" class="tap" cx="154" cy="146" r="10" fill="#ffc4a0" stroke="${INK}" stroke-width="3.5"/>
    <circle data-p="hand" class="tap" cx="37" cy="204" r="13" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
    <circle data-p="hand" class="tap" cx="163" cy="204" r="13" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
    ${leg('M84 182 L80 238')}${leg('M80 238 L80 290')}${leg('M116 182 L120 238')}${leg('M120 238 L120 290')}
    <circle data-p="knee" class="tap" cx="80" cy="238" r="11" fill="#7fb2ff" stroke="${INK}" stroke-width="3.5"/>
    <circle data-p="knee" class="tap" cx="120" cy="238" r="11" fill="#7fb2ff" stroke="${INK}" stroke-width="3.5"/>
    <ellipse data-p="foot" class="tap" cx="72" cy="300" rx="18" ry="10" fill="#ff6fb5" stroke="${INK}" stroke-width="4"/>
    <ellipse data-p="foot" class="tap" cx="128" cy="300" rx="18" ry="10" fill="#ff6fb5" stroke="${INK}" stroke-width="4"/>
    <rect data-p="trunk" class="tap" x="62" y="86" width="76" height="102" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>
    <rect data-p="neck" class="tap" x="86" y="68" width="28" height="22" rx="7" fill="${SKIN}" stroke="${INK}" stroke-width="3.5"/>
    <g data-p="head" class="tap"><circle cx="100" cy="42" r="32" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
      <path d="M70 34 Q100 0 130 34 Q118 18 100 20 Q82 18 70 34 Z" fill="#7b4a2d" stroke="${INK}" stroke-width="3"/>
      <circle cx="89" cy="44" r="4" fill="${INK}"/><circle cx="111" cy="44" r="4" fill="${INK}"/><path d="M90 56 q10 8 20 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>
  </svg>`;

  const RIBS = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"><path d="M40 6 V74" stroke-width="7"/>${[16, 28, 40, 52].map((y) => `<path d="M40 ${y} Q12 ${y + 2} 14 ${y + 14}"/><path d="M40 ${y} Q68 ${y + 2} 66 ${y + 14}"/>`).join('')}</g></svg>`;
  const PELVIS = `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg"><path d="M40 10 Q22 0 8 14 Q4 34 22 44 Q30 52 40 46 Q50 52 58 44 Q76 34 72 14 Q58 0 40 10 Z" fill="#fffaf0" stroke="${INK}" stroke-width="3.5"/><circle cx="26" cy="30" r="7" fill="${INK}" opacity=".25"/><circle cx="54" cy="30" r="7" fill="${INK}" opacity=".25"/></svg>`;
  const ESOPH = `<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg"><path d="M24 4 V86 M36 4 V86" stroke="${INK}" stroke-width="3.5"/><rect x="24" y="4" width="12" height="82" fill="#ff9ec7"/><path d="M24 4 V86 M36 4 V86" stroke="${INK}" stroke-width="3.5"/><circle cx="30" cy="34" r="5" fill="#c98a4b"/></svg>`;
  const STOMACH = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M30 6 Q34 22 28 30 Q8 44 18 62 Q32 80 56 70 Q76 60 70 38 Q66 26 52 30 Q44 32 42 22 Q40 12 42 6" fill="#ff8cc6" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></svg>`;
  const INTEST = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 14 H70 V28 H14 V42 H66 V56 H18 V70 H62" fill="none" stroke="${INK}" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/><path d="M10 14 H70 V28 H14 V42 H66 V56 H18 V70 H62" fill="none" stroke="#ffb3a0" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></svg>`;

  // ---------- Categories (explore tiles and answer buttons) ----------
  const CATS = {
    sense: {
      sight: { icon: '👁️', ex: '👀', color: '#3a86ff', name: L('Vista', 'Vista', 'Sight'), the: L('la vista', 'la vista', 'sight'), organ: L('els ulls', 'los ojos', 'the eyes'), verb: L('veure', 'ver', 'see'),
        fact: L('Amb els ulls veiem colors, formes i coses que es mouen.', 'Con los ojos vemos colores, formas y cosas que se mueven.', 'With our eyes we see colours, shapes and things that move.') },
      hearing: { icon: '👂', ex: '🎵', color: '#9b5de5', name: L('Oïda', 'Oído', 'Hearing'), the: L("l'oïda", 'el oído', 'hearing'), organ: L('les orelles', 'las orejas', 'the ears'), verb: L('sentir', 'oír', 'hear'),
        fact: L('Amb les orelles sentim sons: música, veus, sorolls...', 'Con las orejas oímos sonidos: música, voces, ruidos...', 'With our ears we hear sounds: music, voices, noises...') },
      smell: { icon: '👃', ex: '🌹', color: '#ff6fb5', name: L('Olfacte', 'Olfato', 'Smell'), the: L("l'olfacte", 'el olfato', 'smell'), organ: L('el nas', 'la nariz', 'the nose'), verb: L('olorar', 'oler', 'smell'),
        fact: L('Amb el nas notem les olors: bones... i pudents!', 'Con la nariz notamos los olores: buenos... ¡y apestosos!', 'With our nose we notice smells: nice ones... and stinky ones!') },
      taste: { icon: '👅', ex: '🍋', color: '#ff9f1c', name: L('Gust', 'Gusto', 'Taste'), the: L('el gust', 'el gusto', 'taste'), organ: L('la llengua', 'la lengua', 'the tongue'), verb: L('tastar', 'saborear', 'taste'),
        fact: L('Amb la llengua notem si el menjar és dolç, salat, àcid o amarg.', 'Con la lengua notamos si la comida es dulce, salada, ácida o amarga.', 'With our tongue we taste if food is sweet, salty, sour or bitter.') },
      touch: { icon: '✋', ex: '🧊', color: '#2ec4b6', name: L('Tacte', 'Tacto', 'Touch'), the: L('el tacte', 'el tacto', 'touch'), organ: L('la pell', 'la piel', 'the skin'), verb: L('tocar', 'tocar', 'touch'),
        fact: L('Amb la pell notem si una cosa és freda, calenta, suau... o si punxa!', 'Con la piel notamos si algo está frío, caliente, suave... ¡o si pincha!', 'With our skin we feel if something is cold, hot, soft... or prickly!') },
    },
    body: {
      head: { icon: '🙂', ex: '🧠', color: '#ff9f1c', name: L('El cap', 'La cabeza', 'The head'),
        fact: L('El cap és a dalt de tot. A dins hi ha el cervell, que pensa i ho controla tot.', 'La cabeza está arriba del todo. Dentro está el cerebro, que piensa y lo controla todo.', 'The head is at the very top. Inside is the brain, which thinks and controls everything.') },
      trunk: { icon: '👕', ex: '🫀', color: '#ffd23f', name: L('El tronc', 'El tronco', 'The trunk'),
        fact: L("El tronc és la part del mig. A dins hi ha el cor, els pulmons i l'estómac.", 'El tronco es la parte del medio. Dentro están el corazón, los pulmones y el estómago.', 'The trunk is the middle part. Inside are the heart, the lungs and the stomach.') },
      limbs: { icon: '🦵', ex: '🤸', color: '#3a86ff', name: L('Les extremitats', 'Las extremidades', 'The limbs'),
        fact: L('Els braços són les extremitats superiors i les cames, les inferiors.', 'Los brazos son las extremidades superiores y las piernas, las inferiores.', 'The arms are the upper limbs and the legs are the lower limbs.') },
      bones: { icon: '🦴', ex: '💀', color: '#9aa5b1', name: L('Els ossos', 'Los huesos', 'The bones'),
        fact: L("Els ossos formen l'esquelet: ens aguanten i protegeixen el cos. En tenim més de 200!", 'Los huesos forman el esqueleto: nos sostienen y protegen el cuerpo. ¡Tenemos más de 200!', 'Bones make up the skeleton: they hold us up and protect the body. We have more than 200!') },
      muscles: { icon: '💪', ex: '🏋️', color: '#e5383b', name: L('Els músculs', 'Los músculos', 'The muscles'),
        fact: L('Els músculs estiren els ossos i ens fan moure. El cor també és un múscul!', 'Los músculos tiran de los huesos y nos hacen mover. ¡El corazón también es un músculo!', 'Muscles pull the bones and make us move. The heart is a muscle too!') },
      joints: { icon: '🔩', ex: '🧎', color: '#9b5de5', name: L('Les articulacions', 'Las articulaciones', 'The joints'),
        fact: L('Les articulacions, com el colze i el genoll, fan que el cos es pugui doblegar.', 'Las articulaciones, como el codo y la rodilla, hacen que el cuerpo se pueda doblar.', 'Joints, like the elbow and the knee, let the body bend.') },
    },
    food: {
      veg: { icon: '🥦', ex: '🍎', color: '#3fb36b', name: L('Fruita i verdura', 'Fruta y verdura', 'Fruit & veg'), why: L('ens dona vitamines', 'nos da vitaminas', 'it gives us vitamins'),
        fact: L("La fruita i la verdura ens donen vitamines. N'hem de menjar molta cada dia!", 'La fruta y la verdura nos dan vitaminas. ¡Tenemos que comer mucha cada día!', 'Fruit and vegetables give us vitamins. We should eat lots every day!'),
        q: L("Quin d'aquests NO és fruita o verdura?", '¿Cuál de estos NO es fruta o verdura?', 'Which one is NOT fruit or veg?') },
      grain: { icon: '🍞', ex: '🍝', color: '#e0a458', name: L('Pa, pasta i arròs', 'Pan, pasta y arroz', 'Bread, pasta & rice'), why: L('ens dona energia', 'nos da energía', 'it gives us energy'),
        fact: L("El pa, la pasta i l'arròs ens donen energia per jugar i pensar.", 'El pan, la pasta y el arroz nos dan energía para jugar y pensar.', 'Bread, pasta and rice give us energy to play and think.'),
        q: L("Quin d'aquests NO és pa, pasta o arròs?", '¿Cuál de estos NO es pan, pasta o arroz?', 'Which one is NOT bread, pasta or rice?') },
      protein: { icon: '🍗', ex: '🥚', color: '#e5383b', name: L('Carn, peix, ous i llegums', 'Carne, pescado, huevos y legumbres', 'Meat, fish, eggs & beans'), why: L('ens ajuda a créixer', 'nos ayuda a crecer', 'it helps us grow'),
        fact: L('La carn, el peix, els ous i els llegums ens ajuden a créixer i a fer músculs.', 'La carne, el pescado, los huevos y las legumbres nos ayudan a crecer y a hacer músculos.', 'Meat, fish, eggs and beans help us grow and build muscles.'),
        q: L("Quin d'aquests NO ens ajuda a créixer i fer músculs?", '¿Cuál de estos NO nos ayuda a crecer y hacer músculos?', "Which one does NOT help us grow and build muscles?") },
      sometimes: { icon: '🍭', ex: '🍩', color: '#ff6fb5', name: L('De tant en tant', 'De vez en cuando', 'Only sometimes'), why: L('només de tant en tant', 'solo de vez en cuando', 'only once in a while'),
        fact: L('Els dolços, les llaminadures i els refrescos, només de tant en tant!', 'Los dulces, las chuches y los refrescos, ¡solo de vez en cuando!', 'Sweets, candy and fizzy drinks: only once in a while!'),
        q: L("Quin d'aquests SÍ que és sa per a cada dia?", '¿Cuál de estos SÍ es sano para cada día?', 'Which one IS healthy for every day?') },
      water: { icon: '💧', ex: '🚰', color: '#5bc0eb', name: L('Aigua', 'Agua', 'Water'),
        fact: L("Beure aigua és molt important: el nostre cos és ple d'aigua!", 'Beber agua es muy importante: ¡nuestro cuerpo está lleno de agua!', 'Drinking water is very important: our body is full of water!') },
    },
    habit: {
      hygiene: { icon: '🧼', ex: '🛁', color: '#2ec4b6', name: L('Higiene', 'Higiene', 'Hygiene'),
        fact: L('Rentar-se les mans i dutxar-se treu la brutícia i els microbis.', 'Lavarse las manos y ducharse quita la suciedad y los microbios.', 'Washing your hands and showering gets rid of dirt and germs.') },
      teeth: { icon: '🪥', ex: '😁', color: '#3a86ff', name: L('Les dents', 'Los dientes', 'Teeth'),
        fact: L('Ens rentem les dents després de menjar, i sobretot abans de dormir.', 'Nos lavamos los dientes después de comer, y sobre todo antes de dormir.', 'We brush our teeth after eating, and above all before bed.') },
      sleep: { icon: '😴', ex: '🛏️', color: '#9b5de5', name: L('Dormir', 'Dormir', 'Sleep'),
        fact: L('Dormir unes 10 hores fa que el cos i el cervell descansin i creixin.', 'Dormir unas 10 horas hace que el cuerpo y el cerebro descansen y crezcan.', 'Sleeping about 10 hours lets the body and brain rest and grow.') },
      exercise: { icon: '⚽', ex: '🤸', color: '#ff9f1c', name: L('Exercici', 'Ejercicio', 'Exercise'),
        fact: L('Moure\'s i jugar cada dia fa forts els músculs, els ossos i el cor.', 'Moverse y jugar cada día hace fuertes los músculos, los huesos y el corazón.', 'Moving and playing every day makes muscles, bones and heart strong.') },
      eat: { icon: '🥗', ex: '💧', color: '#3fb36b', name: L('Menjar bé', 'Comer bien', 'Eating well'),
        fact: L('Menjar de tot i beure aigua ens dona energia.', 'Comer de todo y beber agua nos da energía.', 'Eating a bit of everything and drinking water gives us energy.') },
    },
    good: {
      yes: { icon: '✅', color: '#3fb36b', name: L('Bon hàbit', 'Buen hábito', 'Good habit'),
        q: L("Quin d'aquests NO és un bon hàbit?", '¿Cuál de estos NO es un buen hábito?', 'Which one is NOT a good habit?') },
      no: { icon: '❌', color: '#e5383b', name: L('No és bo', 'No es bueno', 'Not good'),
        q: L("Quin d'aquests SÍ que és un bon hàbit?", '¿Cuál de estos SÍ es un buen hábito?', 'Which one IS a good habit?') },
    },
  };

  // ---------- Items (each one is a sticker for the album) ----------
  const I = (id, e, v, ca, es, en) => ({ id, e, v, name: L(ca, es, en) });
  const ITEMS = {
    sense: [
      I('rainbow', '🌈', 'sight', "mirar l'arc de Sant Martí", 'mirar el arcoíris', 'look at the rainbow'),
      I('book', '📖', 'sight', 'llegir un conte', 'leer un cuento', 'read a story'),
      I('stars', '✨', 'sight', 'veure les estrelles', 'ver las estrellas', 'see the stars'),
      I('bell', '🔔', 'hearing', 'sentir la campana', 'oír la campana', 'hear the bell'),
      I('music', '🎵', 'hearing', 'escoltar música', 'escuchar música', 'listen to music'),
      I('bark', '🐕', 'hearing', 'sentir el gos que borda', 'oír al perro ladrar', 'hear the dog bark'),
      I('rose', '🌹', 'smell', 'olorar una rosa', 'oler una rosa', 'smell a rose'),
      I('socks', '🧦', 'smell', 'notar la pudor de mitjons', 'notar la peste de calcetines', 'smell stinky socks'),
      I('bread', '🥖', 'smell', "notar l'olor del pa acabat de fer", 'notar el olor del pan recién hecho', 'smell fresh bread'),
      I('lemon', '🍋', 'taste', 'tastar una llimona àcida', 'probar un limón ácido', 'taste a sour lemon'),
      I('strawberry', '🍓', 'taste', 'tastar una maduixa dolça', 'probar una fresa dulce', 'taste a sweet strawberry'),
      I('salty', '🥨', 'taste', 'tastar una galeta salada', 'probar una galleta salada', 'taste a salty pretzel'),
      I('ice', '🧊', 'touch', 'tocar el gel fred', 'tocar el hielo frío', 'touch cold ice'),
      I('kitten', '🐈', 'touch', 'acariciar un gatet suau', 'acariciar un gatito suave', 'stroke a soft kitten'),
      I('cactus', '🌵', 'touch', 'tocar un cactus que punxa', 'tocar un cactus que pincha', 'touch a prickly cactus'),
    ],
    part: [ // body parts to tap; the = with article for "Toca …!"
      { id: 'head', e: '🙂', the: L('el cap', 'la cabeza', 'the head'), fact: L('Al cap hi ha el cervell, que pensa!', '¡En la cabeza está el cerebro, que piensa!', 'The brain is in the head. It thinks!') },
      { id: 'neck', e: '🦒', the: L('el coll', 'el cuello', 'the neck'), fact: L('El coll uneix el cap amb el tronc.', 'El cuello une la cabeza con el tronco.', 'The neck joins the head to the trunk.') },
      { id: 'trunk', e: '👕', the: L('el tronc', 'el tronco', 'the trunk'), fact: L('Al tronc hi ha el cor, els pulmons i la panxa.', 'En el tronco están el corazón, los pulmones y la barriga.', 'The heart, lungs and tummy are in the trunk.') },
      { id: 'arm', e: '💪', the: L('un braç', 'un brazo', 'an arm'), fact: L('Els braços són les extremitats superiors.', 'Los brazos son las extremidades superiores.', 'Arms are the upper limbs.') },
      { id: 'elbow', e: '🦾', the: L('un colze', 'un codo', 'an elbow'), fact: L('El colze és una articulació: fa que el braç es dobli.', 'El codo es una articulación: hace que el brazo se doble.', 'The elbow is a joint: it lets the arm bend.') },
      { id: 'hand', e: '✋', the: L('una mà', 'una mano', 'a hand'), fact: L('Amb les mans agafem coses. Tenim cinc dits a cada mà!', 'Con las manos cogemos cosas. ¡Tenemos cinco dedos en cada mano!', 'We hold things with our hands. Five fingers on each hand!') },
      { id: 'leg', e: '🦵', the: L('una cama', 'una pierna', 'a leg'), fact: L('Les cames són les extremitats inferiors: per caminar, córrer i saltar!', 'Las piernas son las extremidades inferiores: ¡para andar, correr y saltar!', 'Legs are the lower limbs: for walking, running and jumping!') },
      { id: 'knee', e: '🧎', the: L('un genoll', 'una rodilla', 'a knee'), fact: L('El genoll és una articulació: fa que la cama es dobli.', 'La rodilla es una articulación: hace que la pierna se doble.', 'The knee is a joint: it lets the leg bend.') },
      { id: 'foot', e: '🦶', the: L('un peu', 'un pie', 'a foot'), fact: L('Els peus ens aguanten drets.', 'Los pies nos sostienen de pie.', 'Our feet hold us up.') },
    ],
    food: [
      I('broccoli', '🥦', 'veg', 'el bròquil', 'el brócoli', 'broccoli'),
      I('carrot', '🥕', 'veg', 'la pastanaga', 'la zanahoria', 'the carrot'),
      I('apple', '🍎', 'veg', 'la poma', 'la manzana', 'the apple'),
      I('banana', '🍌', 'veg', 'el plàtan', 'el plátano', 'the banana'),
      I('tomato', '🍅', 'veg', 'el tomàquet', 'el tomate', 'the tomato'),
      I('loaf', '🍞', 'grain', 'el pa', 'el pan', 'bread'),
      I('pasta', '🍝', 'grain', 'la pasta', 'la pasta', 'pasta'),
      I('rice', '🍚', 'grain', "l'arròs", 'el arroz', 'rice'),
      I('chicken', '🍗', 'protein', 'el pollastre', 'el pollo', 'chicken'),
      I('egg', '🥚', 'protein', "l'ou", 'el huevo', 'the egg'),
      I('fish', '🐟', 'protein', 'el peix', 'el pescado', 'fish'),
      I('beans', '🫘', 'protein', 'els llegums', 'las legumbres', 'beans'),
      I('lollipop', '🍭', 'sometimes', 'la piruleta', 'la piruleta', 'the lollipop'),
      I('donut', '🍩', 'sometimes', 'el dònut', 'el dónut', 'the donut'),
      I('fries', '🍟', 'sometimes', 'les patates fregides', 'las patatas fritas', 'fries'),
      I('soda', '🥤', 'sometimes', 'el refresc', 'el refresco', 'fizzy drinks'),
      I('candy', '🍬', 'sometimes', 'els caramels', 'los caramelos', 'candy'),
    ],
    habit: [
      I('wash', '🧼', 'yes', 'rentar-se les mans abans de menjar', 'lavarse las manos antes de comer', 'washing your hands before eating'),
      I('brush', '🪥', 'yes', 'rentar-se les dents abans de dormir', 'lavarse los dientes antes de dormir', 'brushing your teeth before bed'),
      I('outside', '⚽', 'yes', "jugar a l'aire lliure", 'jugar al aire libre', 'playing outside'),
      I('drink', '💧', 'yes', 'beure aigua', 'beber agua', 'drinking water'),
      I('early', '😴', 'yes', "anar a dormir d'hora", 'irse a dormir pronto', 'going to bed early'),
      I('breakfast', '🥣', 'yes', 'esmorzar bé', 'desayunar bien', 'eating a good breakfast'),
      I('cough', '🤧', 'yes', 'tapar-se la boca quan tossim', 'taparse la boca al toser', 'covering your mouth when you cough'),
      I('late', '🌙', 'no', 'anar a dormir molt tard', 'irse a dormir muy tarde', 'going to bed very late'),
      I('screens', '📱', 'no', 'mirar pantalles tot el dia', 'mirar pantallas todo el día', 'looking at screens all day'),
      I('dirty', '🚽', 'no', 'no rentar-se les mans després del lavabo', 'no lavarse las manos después del baño', 'not washing your hands after the toilet'),
      I('sweets', '🍭', 'no', 'menjar llaminadures cada dia', 'comer chuches cada día', 'eating sweets every day'),
      I('sofa', '🛋️', 'no', 'estar tot el dia al sofà', 'estar todo el día en el sofá', 'staying on the sofa all day'),
    ],
  };

  // ---------- Ordering puzzles ----------
  const PUZZLES = {
    skeleton: [
      { steps: [['💀', L('crani', 'cráneo', 'skull')], [RIBS, L('costelles', 'costillas', 'ribs')], [PELVIS, L('maluc', 'cadera', 'hip')], ['🦴', L('os de la cama', 'hueso de la pierna', 'leg bone')], ['🦶', L('peu', 'pie', 'foot')]],
        say: L("De dalt a baix: el crani protegeix el cervell, les costelles protegeixen el cor i els pulmons, i els ossos de les cames i els peus ens aguanten!",
          '¡De arriba abajo: el cráneo protege el cerebro, las costillas protegen el corazón y los pulmones, y los huesos de las piernas y los pies nos sostienen!',
          'From top to bottom: the skull protects the brain, the ribs protect the heart and lungs, and the leg and foot bones hold us up!') },
    ],
    digestion: [
      { steps: [['👄', L('boca', 'boca', 'mouth')], [ESOPH, L('esòfag', 'esófago', 'food pipe')], [STOMACH, L('estómac', 'estómago', 'stomach')], [INTEST, L('intestins', 'intestinos', 'intestines')]],
        say: L("A la boca masteguem amb les dents, l'esòfag ho baixa, l'estómac ho barreja i els intestins agafen el que és bo per al cos!",
          '¡En la boca masticamos con los dientes, el esófago lo baja, el estómago lo mezcla y los intestinos cogen lo que es bueno para el cuerpo!',
          'We chew in the mouth, the food pipe takes it down, the stomach mixes it and the intestines take what is good for the body!') },
    ],
    routines: [
      { steps: [['💧', L('mullar-se les mans', 'mojarse las manos', 'wet your hands')], ['🧼', L('posar-hi sabó', 'poner jabón', 'add soap')], ['👐', L('fregar molt bé', 'frotar muy bien', 'scrub well')], ['🚿', L('esbandir', 'aclarar', 'rinse')], ['🧻', L('eixugar-se', 'secarse', 'dry')]],
        say: L("Per rentar-se les mans: mullar, sabó, fregar molt bé, esbandir i eixugar. Adéu, microbis!", 'Para lavarse las manos: mojar, jabón, frotar muy bien, aclarar y secar. ¡Adiós, microbios!', 'To wash your hands: wet, soap, scrub well, rinse and dry. Bye bye, germs!') },
      { steps: [['🪥', L('posar pasta', 'poner pasta', 'add toothpaste')], ['😬', L('raspallar totes les dents', 'cepillar todos los dientes', 'brush every tooth')], ['💧', L('esbandir la boca', 'enjuagar la boca', 'rinse your mouth')], ['😁', L('dents netes!', '¡dientes limpios!', 'clean teeth!')]],
        say: L('Pasta, raspallar totes les dents, esbandir... i un somriure net!', 'Pasta, cepillar todos los dientes, enjuagar... ¡y una sonrisa limpia!', 'Toothpaste, brush every tooth, rinse... and a clean smile!') },
    ],
  };

  // ---------- Lessons ----------
  // acts: choose (an item → its category), tap (find it on a drawing), order (a puzzle)
  window.BODY_UNIT = {
    CATS, ITEMS, PUZZLES, FACE, BODY,
    LESSONS: [
      { id: 1, icon: '👀', name: L('Els cinc sentits', 'Los cinco sentidos', 'The five senses'), explore: ['sense'], stickers: 'sense',
        intro: L('Coneixem el món amb els cinc sentits. Toca cada sentit per descobrir-lo!', 'Conocemos el mundo con los cinco sentidos. ¡Toca cada sentido para descubrirlo!', 'We discover the world with our five senses. Tap each one to find out!'),
        acts: [{ type: 'choose', items: 'sense', cat: 'sense', n: 7, icon: '🤔' }, { type: 'tap', drawing: 'FACE', cat: 'sense', n: 4, icon: '👆' }],
        check: { items: 'sense', cat: 'sense', n: 2 } },
      { id: 2, icon: '🦴', name: L("El cos i l'esquelet", 'El cuerpo y el esqueleto', 'Body & skeleton'), explore: ['body'], stickers: 'part',
        intro: L("El nostre cos té cap, tronc i extremitats. A dins, l'esquelet ens aguanta. Toca-ho tot!", 'Nuestro cuerpo tiene cabeza, tronco y extremidades. Dentro, el esqueleto nos sostiene. ¡Tócalo todo!', 'Our body has a head, a trunk and limbs. Inside, the skeleton holds us up. Tap everything!'),
        acts: [{ type: 'tap', drawing: 'BODY', items: 'part', n: 6, icon: '👆' }, { type: 'order', set: 'skeleton', n: 1, icon: '💀' }],
        check: { parts: true, n: 2 } },
      { id: 3, icon: '🍎', name: L('Menjar i digestió', 'Comida y digestión', 'Food & digestion'), explore: ['food'], stickers: 'food',
        intro: L('El menjar ens dona energia per créixer i jugar. Toca cada grup del plat!', 'La comida nos da energía para crecer y jugar. ¡Toca cada grupo del plato!', 'Food gives us energy to grow and play. Tap each group on the plate!'),
        acts: [{ type: 'choose', items: 'food', cat: 'food', n: 8, icon: '🍽️' }, { type: 'order', set: 'digestion', n: 1, icon: '🥪' }],
        check: { items: 'food', cat: 'food', n: 2 } },
      { id: 4, icon: '🪥', name: L('Hàbits saludables', 'Hábitos saludables', 'Healthy habits'), explore: ['habit'], stickers: 'habit',
        intro: L('Els bons hàbits ens fan créixer forts i sans. Toca cada hàbit!', 'Los buenos hábitos nos hacen crecer fuertes y sanos. ¡Toca cada hábito!', 'Good habits help us grow strong and healthy. Tap each one!'),
        acts: [{ type: 'choose', items: 'habit', cat: 'good', n: 7, icon: '✅' }, { type: 'order', set: 'routines', n: 2, icon: '🔄' }],
        check: { items: 'habit', cat: 'good', n: 2 } },
    ],
    // odd-one-out for lesson 2: three of a kind + one that isn't
    PART_CHECKS: [
      { q: L("Quin d'aquests NO és una articulació?", '¿Cuál de estos NO es una articulación?', 'Which one is NOT a joint?'), same: ['elbow', 'knee', 'wrist', 'ankle'], odd: ['head', 'trunk', 'foot', 'hand'] },
      { q: L("Quin d'aquests NO és al cap?", '¿Cuál de estos NO está en la cabeza?', 'Which one is NOT on the head?'), same: ['eyes', 'nose', 'ears', 'mouth'], odd: ['knee', 'foot', 'elbow'] },
      { q: L("Quin d'aquests NO és una extremitat?", '¿Cuál de estos NO es una extremidad?', 'Which one is NOT a limb?'), same: ['arm', 'leg', 'hand', 'foot'], odd: ['trunk', 'head', 'neck'] },
    ],
    // extra words used only in the lesson-2 check
    EXTRA_PARTS: {
      wrist: { e: '⌚', name: L('el canell', 'la muñeca', 'the wrist') },
      ankle: { e: '🧦', name: L('el turmell', 'el tobillo', 'the ankle') },
      eyes: { e: '👀', name: L('els ulls', 'los ojos', 'the eyes') },
      nose: { e: '👃', name: L('el nas', 'la nariz', 'the nose') },
      ears: { e: '👂', name: L('les orelles', 'las orejas', 'the ears') },
      mouth: { e: '👄', name: L('la boca', 'la boca', 'the mouth') },
    },
  };
})();
