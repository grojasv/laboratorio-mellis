// "Bons amics": short stories where she chooses what a good friend would do.
// No hearts here: a wrong choice shows what happens, then she chooses again.
(function () {
  const L = (ca, es, en) => ({ ca, es, en });
  // the = name with the Catalan article; f = feminine (for "trista / trist")
  const KIDS = {
    nur: { e: '👧🏽', f: true, the: L('la Nur', 'Nur', 'Nur') },
    jan: { e: '👦', f: false, the: L('en Jan', 'Jan', 'Jan') },
    laia: { e: '👧', f: true, the: L('la Laia', 'Laia', 'Laia') },
    biel: { e: '👦🏻', f: false, the: L('en Biel', 'Biel', 'Biel') },
    aina: { e: '👧🏼', f: true, the: L("l'Aina", 'Aina', 'Aina') },
    pol: { e: '🧒', f: false, the: L('en Pol', 'Pol', 'Pol') },
    martina: { e: '👧🏻', f: true, the: L('la Martina', 'Martina', 'Martina') },
  };
  const FEELINGS = {
    happy: { e: '😊', color: '#ffd23f', name: L('Content', 'Contento', 'Happy'), adj: { ca: ['content', 'contenta'], es: ['contento', 'contenta'], en: 'happy' },
      fact: L('Quan estem contents, somriem i tenim ganes de jugar.', 'Cuando estamos contentos, sonreímos y tenemos ganas de jugar.', 'When we are happy, we smile and want to play.') },
    sad: { e: '😢', color: '#5bc0eb', name: L('Trist', 'Triste', 'Sad'), adj: { ca: ['trist', 'trista'], es: ['triste', 'triste'], en: 'sad' },
      fact: L('Quan estem tristos, potser plorem. Una abraçada ajuda molt!', 'Cuando estamos tristes, a lo mejor lloramos. ¡Un abrazo ayuda mucho!', 'When we are sad, we might cry. A hug helps a lot!') },
    angry: { e: '😠', color: '#e5383b', name: L('Enfadat', 'Enfadado', 'Angry'), adj: { ca: ['enfadat', 'enfadada'], es: ['enfadado', 'enfadada'], en: 'angry' },
      fact: L('Quan ens enfadem, el cor batega fort. Respirar a poc a poc ens calma.', 'Cuando nos enfadamos, el corazón late fuerte. Respirar despacio nos calma.', 'When we get angry, our heart beats fast. Breathing slowly calms us down.') },
    scared: { e: '😨', color: '#9b5de5', name: L('Espantat', 'Asustado', 'Scared'), adj: { ca: ['espantat', 'espantada'], es: ['asustado', 'asustada'], en: 'scared' },
      fact: L("Quan tenim por, ens agrada estar a prop d'algú que ens estima.", 'Cuando tenemos miedo, nos gusta estar cerca de alguien que nos quiere.', 'When we are scared, we like to be close to someone who loves us.') },
  };
  const C = (e, ok, mood, t, res) => ({ e, ok, mood, t, res });

  window.FRIENDS = {
    KIDS, FEELINGS,
    LESSONS: [
      { id: 1, icon: '🤝', name: L('Ser un bon amic', 'Ser un buen amigo', 'Being a good friend'),
        intro: L('Els bons amics es fixen en com se senten els altres. Toca cada cara!', 'Los buenos amigos se fijan en cómo se sienten los demás. ¡Toca cada cara!', 'Good friends notice how others feel. Tap each face!'),
        tiles: Object.keys(FEELINGS).map((k) => ({ key: k, ...FEELINGS[k] })),
        stories: [
          { kid: 'nur', place: '🏫', text: L('Avui ha arribat una nena nova a classe, la Nur. A l\'hora del pati està sola en un racó.', 'Hoy ha llegado una niña nueva a clase, Nur. A la hora del patio está sola en un rincón.', 'A new girl, Nur, joined the class today. At playtime she is alone in a corner.'),
            choices: [
              C('🤝', true, 'happy', L('La convido a jugar amb nosaltres', 'La invito a jugar con nosotros', 'Invite her to play with us'), L('La Nur somriu: «Gràcies!» Ara teniu una amiga nova.', 'Nur sonríe: «¡Gracias!» Ahora tenéis una amiga nueva.', 'Nur smiles: “Thank you!” Now you have a new friend.')),
              C('🙈', false, 'sad', L('Faig veure que no la veig', 'Hago como que no la veo', "Pretend I don't see her"), L('La Nur continua sola i trista. Com et sentiries tu el primer dia?', 'Nur sigue sola y triste. ¿Cómo te sentirías tú el primer día?', 'Nur stays alone and sad. How would you feel on your first day?')),
              C('😝', false, 'sad', L("Me'n ric perquè no coneix ningú", 'Me río de ella porque no conoce a nadie', "Laugh at her because she doesn't know anyone"), L('La Nur se sent fatal. Riure\'s dels altres fa mal per dins.', 'Nur se siente fatal. Reírse de los demás duele por dentro.', 'Nur feels awful. Laughing at others hurts inside.')),
            ],
            end: L('Convidar algú que està sol és ser un bon amic!', '¡Invitar a alguien que está solo es ser un buen amigo!', 'Inviting someone who is alone is what good friends do!') },
          { kid: 'jan', place: '🏃', text: L('Corrent pel pati, en Jan cau i es fa mal al genoll.', 'Corriendo por el patio, Jan se cae y se hace daño en la rodilla.', 'Running in the playground, Jan falls and hurts his knee.'),
            choices: [
              C('🩹', true, 'happy', L("L'ajudo a aixecar-se i aviso la mestra", 'Le ayudo a levantarse y aviso a la maestra', 'Help him up and tell the teacher'), L('En Jan diu: «Gràcies per ajudar-me!» La mestra li posa una tireta.', 'Jan dice: «¡Gracias por ayudarme!» La maestra le pone una tirita.', 'Jan says: “Thanks for helping me!” The teacher puts a plaster on.')),
              C('⚽', false, 'sad', L('Continuo jugant com si res', 'Sigo jugando como si nada', 'Keep playing as if nothing happened'), L('En Jan es queda a terra, plorant i sol.', 'Jan se queda en el suelo, llorando y solo.', 'Jan stays on the ground, crying and alone.')),
              C('🤭', false, 'sad', L('Dic: «Quin patós!»', 'Digo: «¡Qué patoso!»', 'Say: “What a klutz!”'), L('A en Jan li fa mal el genoll... i ara també està trist.', 'A Jan le duele la rodilla... y ahora también está triste.', "Jan's knee hurts... and now he feels sad too.")),
            ],
            end: L('Quan algú es fa mal, l\'ajudem i busquem un adult.', 'Cuando alguien se hace daño, le ayudamos y buscamos a un adulto.', 'When someone gets hurt, we help and find a grown-up.') },
          { kid: 'laia', place: '🥪', text: L("La Laia s'ha deixat l'esmorzar a casa i té molta gana.", 'Laia se ha dejado el almuerzo en casa y tiene mucha hambre.', 'Laia forgot her snack at home and she is very hungry.'),
            choices: [
              C('🍎', true, 'happy', L('Comparteixo una mica del meu', 'Comparto un poco del mío', 'Share some of mine'), L('La Laia està contentíssima. Compartit, encara és més bo!', 'Laia está contentísima. ¡Compartido, sabe aún mejor!', 'Laia is so happy. Shared food tastes even better!')),
              C('😋', false, 'sad', L('Menjo davant seu sense dir res', 'Como delante de ella sin decir nada', 'Eat in front of her without saying anything'), L('La Laia et mira amb gana i se sent trista.', 'Laia te mira con hambre y se siente triste.', 'Laia watches you, hungry and sad.')),
              C('👉', false, 'sad', L('Li dic que és culpa seva', 'Le digo que es culpa suya', "Tell her it's her own fault"), L('La Laia ja ho sabia... i ara encara se sent pitjor.', 'Laia ya lo sabía... y ahora se siente aún peor.', 'Laia already knew... and now she feels even worse.')),
            ],
            end: L('Compartir fa feliços els altres... i a nosaltres també!', '¡Compartir hace felices a los demás... y a nosotros también!', 'Sharing makes others happy... and us too!') },
        ],
        feel: [
          { kid: 'nur', mood: 'sad', text: L("És el primer dia de la Nur a l'escola i ningú juga amb ella.", 'Es el primer día de Nur en el cole y nadie juega con ella.', "It's Nur's first day at school and nobody plays with her.") },
          { kid: 'jan', mood: 'happy', text: L("En Jan ha guanyat la cursa i tothom l'aplaudeix.", 'Jan ha ganado la carrera y todos le aplauden.', 'Jan won the race and everyone is clapping.') },
        ] },
      { id: 2, icon: '⚖️', name: L('És just?', '¿Es justo?', 'Is it fair?'),
        intro: L('Ser just vol dir que tothom pugui jugar i tenir el mateix. Toca cada idea!', 'Ser justo quiere decir que todos puedan jugar y tener lo mismo. ¡Toca cada idea!', 'Being fair means everyone gets to play and gets the same. Tap each idea!'),
        tiles: [
          { key: 'turns', e: '⏳', color: '#ff9f1c', name: L('Fer torns', 'Hacer turnos', 'Taking turns'), fact: L('Fer torns: primer un, després l\'altre. Així tothom juga!', 'Hacer turnos: primero uno, después el otro. ¡Así todos juegan!', 'Taking turns: first one, then the other. That way everyone plays!') },
          { key: 'share', e: '🤝', color: '#3fb36b', name: L('Compartir', 'Compartir', 'Sharing'), fact: L('Compartir és repartir perquè tothom en tingui.', 'Compartir es repartir para que todos tengan.', 'Sharing means dividing things so everyone gets some.') },
          { key: 'fair', e: '🎲', color: '#3a86ff', name: L('Jugar net', 'Jugar limpio', 'Playing fair'), fact: L('Jugar net vol dir seguir les regles, encara que perdis.', 'Jugar limpio quiere decir seguir las reglas, aunque pierdas.', 'Playing fair means following the rules, even if you lose.') },
          { key: 'listen', e: '👂', color: '#9b5de5', name: L('Escoltar', 'Escuchar', 'Listening'), fact: L('Escoltar els altres: les seves idees també compten.', 'Escuchar a los demás: sus ideas también cuentan.', 'Listening to others: their ideas count too.') },
        ],
        stories: [
          { kid: 'biel', place: '🛝', text: L('Al parc només hi ha un gronxador, i en Biel i tu el voleu alhora.', 'En el parque solo hay un columpio, y Biel y tú lo queréis a la vez.', "There's only one swing at the park, and you and Biel both want it."),
            choices: [
              C('⏳', true, 'happy', L('Fem torns: una estona cadascú', 'Hacemos turnos: un rato cada uno', 'Take turns: a little while each'), L('Primer tu, després en Biel. Tots dos us gronxeu i us ho passeu bé!', 'Primero tú, después Biel. ¡Los dos os columpiáis y lo pasáis bien!', 'You first, then Biel. You both get to swing and have fun!')),
              C('🏃', false, 'angry', L("M'hi assec ràpid i no baixo mai", 'Me siento rápido y no me bajo nunca', 'Jump on first and never get off'), L("En Biel s'espera i s'espera... i s'enfada molt.", 'Biel espera y espera... y se enfada mucho.', 'Biel waits and waits... and gets really cross.')),
              C('💥', false, 'sad', L("L'empenyo perquè marxi", 'Le empujo para que se vaya', 'Push him away'), L('Empènyer fa mal i és perillós. En Biel plora.', 'Empujar hace daño y es peligroso. Biel llora.', 'Pushing hurts and is dangerous. Biel cries.')),
            ],
            end: L('Fent torns, tothom juga!', '¡Haciendo turnos, todos juegan!', 'Taking turns means everyone gets to play!') },
          { kid: 'aina', place: '🍪', text: L("Teniu sis galetes per a tres amics: l'Aina, en Pol i tu.", 'Tenéis seis galletas para tres amigos: Aina, Pol y tú.', 'There are six cookies for three friends: Aina, Pol and you.'),
            choices: [
              C('➗', true, 'happy', L('En dono dues a cadascú', 'Doy dos a cada uno', 'Give two to each of us'), L('Dues, dues i dues: és just! Tots tres esteu contents.', 'Dos, dos y dos: ¡es justo! Los tres estáis contentos.', 'Two, two and two: fair! All three of you are happy.')),
              C('🤑', false, 'angry', L("Me'n quedo quatre i els en dono una", 'Me quedo cuatro y les doy una', 'Keep four and give them one each'), L("L'Aina i en Pol diuen: «No és just!» I tenen raó.", 'Aina y Pol dicen: «¡No es justo!» Y tienen razón.', 'Aina and Pol say: “That\'s not fair!” And they\'re right.')),
              C('🙈', false, 'sad', L('Les amago totes per a mi', 'Las escondo todas para mí', 'Hide them all for myself'), L("Ningú més en té cap, i els teus amics s'entristeixen.", 'Nadie más tiene ninguna, y tus amigos se ponen tristes.', 'Nobody else gets any, and your friends feel sad.')),
            ],
            end: L('Repartir a parts iguals és ser just.', 'Repartir a partes iguales es ser justo.', 'Sharing equally is being fair.') },
          { kid: 'pol', place: '🎲', text: L('Jugues a un joc de taula amb en Pol i vas perdent. Podries moure la fitxa quan no mira...', 'Juegas a un juego de mesa con Pol y vas perdiendo. Podrías mover la ficha cuando no mira...', "You're playing a board game with Pol and you're losing. You could move your piece when he isn't looking..."),
            choices: [
              C('🎲', true, 'happy', L('Jugo net, encara que perdi', 'Juego limpio, aunque pierda', 'Play fair, even if I lose'), L('Perds aquesta partida, però en Pol vol tornar a jugar amb tu. Una altra!', 'Pierdes esta partida, pero Pol quiere volver a jugar contigo. ¡Otra!', 'You lose this game, but Pol wants to play again with you. Another round!')),
              C('🤫', false, 'angry', L('Faig trampa quan no mira', 'Hago trampa cuando no mira', "Cheat when he isn't looking"), L("En Pol se n'adona: «Has fet trampa!» Ja no vol jugar més.", 'Pol se da cuenta: «¡Has hecho trampa!» Ya no quiere jugar más.', 'Pol notices: “You cheated!” He doesn\'t want to play any more.')),
              C('💢', false, 'sad', L('Llenço el tauler a terra', 'Tiro el tablero al suelo', 'Throw the board on the floor'), L('Les fitxes volen per tot arreu i la partida s\'acaba malament.', 'Las fichas vuelan por todas partes y la partida acaba mal.', 'Pieces fly everywhere and the game ends badly.')),
            ],
            end: L('Jugar net és més important que guanyar.', 'Jugar limpio es más importante que ganar.', 'Playing fair matters more than winning.') },
        ],
        feel: [
          { kid: 'biel', mood: 'angry', text: L('Fa molta estona que en Biel espera el seu torn al gronxador, i ningú li deixa.', 'Biel lleva mucho rato esperando su turno en el columpio, y nadie se lo deja.', 'Biel has waited ages for his turn on the swing, and nobody lets him.') },
          { kid: 'laia', mood: 'happy', text: L('La Laia ha rebut les mateixes galetes que tothom.', 'Laia ha recibido las mismas galletas que todos.', 'Laia got the same number of cookies as everyone.') },
        ] },
      { id: 3, icon: '🌬️', name: L('Quan ens enfadem', 'Cuando nos enfadamos', 'When we get angry'),
        intro: L('Tothom s\'enfada a vegades. Toca cada truc per fer les paus!', 'Todo el mundo se enfada a veces. ¡Toca cada truco para hacer las paces!', 'Everyone gets angry sometimes. Tap each trick for making up!'),
        tiles: [
          { key: 'breathe', e: '🌬️', color: '#5bc0eb', name: L('Respirar', 'Respirar', 'Breathe'), fact: L("Quan t'enfades, respira fondo tres vegades.", 'Cuando te enfadas, respira hondo tres veces.', 'When you get angry, take three deep breaths.') },
          { key: 'talk', e: '🗣️', color: '#ff9f1c', name: L('Parlar', 'Hablar', 'Talk'), fact: L('Explica com et sents amb paraules, sense cridar.', 'Explica cómo te sientes con palabras, sin gritar.', 'Say how you feel with words, without shouting.') },
          { key: 'sorry', e: '🙏', color: '#3fb36b', name: L('Demanar perdó', 'Pedir perdón', 'Say sorry'), fact: L('Si fas mal a algú, encara que sigui sense voler, demana perdó.', 'Si haces daño a alguien, aunque sea sin querer, pide perdón.', 'If you hurt someone, even by accident, say sorry.') },
          { key: 'forgive', e: '💛', color: '#ffd23f', name: L('Perdonar', 'Perdonar', 'Forgive'), fact: L('Quan algú et demana perdó de veritat, el pots perdonar.', 'Cuando alguien te pide perdón de verdad, le puedes perdonar.', 'When someone really says sorry, you can forgive them.') },
        ],
        stories: [
          { kid: 'pol', place: '🎨', text: L("En Pol, sense voler, t'ha tirat aigua sobre el dibuix. T'enfades molt!", 'Pol, sin querer, te ha tirado agua encima del dibujo. ¡Te enfadas mucho!', 'Pol accidentally spilled water on your drawing. You are really cross!'),
            choices: [
              C('🌬️', true, 'happy', L('Respiro fondo i li dic com em sento', 'Respiro hondo y le digo cómo me siento', 'Take a deep breath and tell him how I feel'), L('En Pol diu: «Ho sento molt! T\'ajudo a fer-ne un altre?» Feu un dibuix nou junts.', 'Pol dice: «¡Lo siento mucho! ¿Te ayudo a hacer otro?» Hacéis un dibujo nuevo juntos.', 'Pol says: “I\'m so sorry! Shall I help you make another?” You draw a new one together.')),
              C('💦', false, 'sad', L('Li tiro aigua al seu dibuix', 'Le tiro agua a su dibujo', 'Spill water on his drawing too'), L('Ara hi ha dos dibuixos espatllats i dos amics tristos.', 'Ahora hay dos dibujos estropeados y dos amigos tristes.', 'Now there are two ruined drawings and two sad friends.')),
              C('📢', false, 'sad', L('Li crido i no li parlo mai més', 'Le grito y no le hablo nunca más', 'Shout at him and never speak to him again'), L('En Pol no ho ha fet a propòsit... i perds un amic.', 'Pol no lo ha hecho a propósito... y pierdes un amigo.', "Pol didn't do it on purpose... and you lose a friend.")),
            ],
            end: L("Quan t'enfades, respira i explica-ho amb paraules.", 'Cuando te enfadas, respira y explícalo con palabras.', "When you're angry, breathe and use your words.") },
          { kid: 'aina', place: '⚽', text: L("L'Aina vol jugar a pilota, i tu vols saltar a corda.", 'Aina quiere jugar a la pelota, y tú quieres saltar a la comba.', 'Aina wants to play ball, and you want to skip rope.'),
            choices: [
              C('🔄', true, 'happy', L('Juguem una estona a cada cosa', 'Jugamos un rato a cada cosa', 'Play a bit of each'), L('Primer pilota, després corda. Totes dues contentes!', 'Primero pelota, después comba. ¡Las dos contentas!', 'First ball, then rope. You are both happy!')),
              C('😤', false, 'sad', L('Si no fem el que jo vull, no jugo', 'Si no hacemos lo que yo quiero, no juego', "If we don't do what I want, I won't play"), L("L'Aina se'n va a jugar amb altres nens. Tu et quedes sola.", 'Aina se va a jugar con otros niños. Tú te quedas sola.', 'Aina goes off to play with others. You are left alone.')),
              C('💢', false, 'angry', L('Ens barallem tot el pati', 'Nos peleamos todo el recreo', 'Argue all through playtime'), L('Sona el timbre i no heu jugat a res!', '¡Suena el timbre y no habéis jugado a nada!', "The bell rings and you didn't play anything!")),
            ],
            end: L('Quan no estem d\'acord, busquem una solució per a tots dos.', 'Cuando no estamos de acuerdo, buscamos una solución para los dos.', 'When we disagree, we look for a solution that works for both.') },
          { kid: 'jan', place: '🏖️', text: L("Sense voler, has trepitjat el castell de sorra d'en Jan.", 'Sin querer, has pisado el castillo de arena de Jan.', "Oops! You accidentally stepped on Jan's sandcastle."),
            choices: [
              C('🙏', true, 'happy', L("Li demano perdó i l'ajudo a refer-lo", 'Le pido perdón y le ayudo a rehacerlo', 'Say sorry and help him rebuild it'), L('En Jan diu: «D\'acord!» I el castell nou és encara més gran.', 'Jan dice: «¡Vale!» Y el castillo nuevo es aún más grande.', 'Jan says: “Okay!” And the new castle is even bigger.')),
              C('🙄', false, 'angry', L('Faig veure que no he estat jo', 'Hago como que no he sido yo', "Pretend it wasn't me"), L("En Jan t'ha vist i s'enfada encara més.", 'Jan te ha visto y se enfada todavía más.', 'Jan saw you, and now he is even crosser.')),
              C('😏', false, 'sad', L('Dic: «Era lleig igualment»', 'Digo: «Era feo de todas formas»', 'Say: “It was ugly anyway”'), L('En Jan se sent molt trist. Les paraules també fan mal.', 'Jan se siente muy triste. Las palabras también hacen daño.', 'Jan feels very sad. Words can hurt too.')),
            ],
            end: L('Demanar perdó i ajudar a arreglar-ho ho fa tot més fàcil.', 'Pedir perdón y ayudar a arreglarlo lo hace todo más fácil.', 'Saying sorry and helping fix it makes everything better.') },
        ],
        feel: [
          { kid: 'martina', mood: 'scared', text: L("De nit hi ha una tempesta amb trons molt forts, i la Martina és sola a l'habitació.", 'Por la noche hay una tormenta con truenos muy fuertes, y Martina está sola en su habitación.', 'At night there is a storm with loud thunder, and Martina is alone in her room.') },
          { kid: 'pol', mood: 'sad', text: L('En Pol ha perdut el seu peluix preferit.', 'Pol ha perdido su peluche favorito.', 'Pol lost his favourite teddy.') },
        ] },
    ],
  };
})();
