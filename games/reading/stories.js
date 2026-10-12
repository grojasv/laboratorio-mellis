// Read-aloud stories. Each node is one paragraph; choices let the reader decide
// what happens next. Every path ends on an `end` node, then a question about
// the start of the story (so the answer is the same whichever path she took).
(function () {
  const L = (ca, es, en) => ({ ca, es, en });
  const C = (icon, to, ca, es, en) => ({ icon, to, label: L(ca, es, en) });

  window.MELLIS_STORIES = [
    // ---------------------------------------------------------------- short
    {
      id: 'dragon', level: 'short', icon: '🐉', color: '#2fbf71',
      title: L('El drac que feia rots', 'El dragón que eructaba', 'The Burping Dragon'),
      nodes: {
        start: {
          scene: '🐉💨',
          text: L(
            'En Drac era un drac petit i verd. Volia treure foc com el seu pare. Però cada vegada que ho provava, només li sortia un rot! BUUURP! Els altres dracs reien i reien.',
            'Drac era un dragón pequeño y verde. Quería echar fuego como su papá. Pero cada vez que lo intentaba, ¡solo le salía un eructo! ¡BUUURP! Los otros dragones se reían sin parar.',
            'Drac was a little green dragon. He wanted to breathe fire like his dad. But every time he tried, he just burped! BURRRP! The other dragons laughed and laughed.'),
          choices: [
            C('🌶️', 'a', 'Menjar un pebrot picant', 'Comer un pimiento picante', 'Eat a spicy pepper'),
            C('🦉', 'b', "Preguntar a l'òliba sàvia", 'Preguntar a la lechuza sabia', 'Ask the wise owl'),
          ],
        },
        a: {
          scene: '🌶️🐉🎈',
          text: L(
            'En Drac es va menjar un pebrot vermell molt picant. Se li va posar la cara vermella. Li sortia fum per les orelles. Llavors va obrir la boca i... va sortir una bombolla gegant de color rosa!',
            'Drac se comió un pimiento rojo muy picante. Se le puso la cara roja. Le salía humo por las orejas. Entonces abrió la boca y... ¡salió una burbuja gigante de color rosa!',
            'Drac ate a red, very spicy pepper. His face turned red. Smoke came out of his ears. Then he opened his mouth and... out came a giant pink bubble!'),
          choices: 'jokes',
        },
        b: {
          scene: '🦉📖',
          text: L(
            "L'òliba sàvia es va posar les ulleres i va llegir un llibre gros i ple de pols. —És fàcil —va dir—. Si rius molt fort, el foc sortirà.",
            'La lechuza sabia se puso las gafas y leyó un libro grande y lleno de polvo. —Es fácil —dijo—. Si te ríes muy fuerte, el fuego saldrá.',
            "The wise owl put on her glasses and read a big, dusty book. 'It's easy,' she said. 'If you laugh really hard, the fire will come out.'"),
          choices: 'jokes',
        },
        e1: {
          scene: '🐌🔥🍞', end: true,
          text: L(
            "Un cargol li va explicar l'acudit més ximple del món. En Drac va riure i riure fins que... FUUUM! Va sortir foc de veritat! Ara en Drac fa torrades per a tot el poble.",
            'Un caracol le contó el chiste más tonto del mundo. Drac se rio y se rio hasta que... ¡FUUUM! ¡Salió fuego de verdad! Ahora Drac hace tostadas para todo el pueblo.',
            'A snail told Drac the silliest joke in the world. Drac laughed and laughed until... WHOOOSH! Real fire came out! Now Drac makes toast for the whole village.'),
        },
        e2: {
          scene: '🦶😂🔵🔥', end: true,
          text: L(
            'Tothom li va fer pessigolles als peus. En Drac reia tant que rodolava per terra. FUUUM! Va sortir foc, però era blau! Ara és l\'únic drac del món amb foc blau.',
            'Todos le hicieron cosquillas en los pies. Drac se reía tanto que rodaba por el suelo. ¡FUUUM! Salió fuego, ¡pero era azul! Ahora es el único dragón del mundo con fuego azul.',
            "Everybody tickled Drac's feet. He laughed so much that he rolled on the floor. WHOOOSH! Fire came out, but it was blue! Now he is the only dragon in the world with blue fire."),
        },
      },
      choiceSets: {
        jokes: [
          C('🐌', 'e1', "Explicar-li un acudit", 'Contarle un chiste', 'Tell him a joke'),
          C('🪶', 'e2', 'Fer-li pessigolles', 'Hacerle cosquillas', 'Tickle him'),
        ],
      },
      question: {
        q: L('Què passava quan en Drac intentava treure foc?', '¿Qué pasaba cuando Drac intentaba echar fuego?', 'What happened when Drac tried to breathe fire?'),
        options: [L('Li sortia un rot', 'Le salía un eructo', 'He burped'), L('Cantava una cançó', 'Cantaba una canción', 'He sang a song'), L('Esternudava', 'Estornudaba', 'He sneezed')],
      },
    },

    {
      id: 'sock', level: 'short', icon: '🧦', color: '#ff6fb5',
      title: L('On és el mitjó?', '¿Dónde está el calcetín?', 'Where Is the Sock?'),
      nodes: {
        start: {
          scene: '👴🧦❓',
          text: L(
            "Cada matí, l'avi Pep té dos mitjons. Però avui només en té un! —On és l'altre mitjó? —crida. La gata Mixa es posa el barret de detectiva.",
            'Cada mañana, el abuelo Pep tiene dos calcetines. ¡Pero hoy solo tiene uno! —¿Dónde está mi otro calcetín? —grita. La gata Mixa se pone su sombrero de detective.',
            "Every morning, Grandpa Pep has two socks. But today he only has one! 'Where is my other sock?' he shouts. Mixa the cat puts on her detective hat."),
          choices: [
            C('🛏️', 'a', 'Mirar sota el llit', 'Mirar debajo de la cama', 'Look under the bed'),
            C('🧺', 'b', 'Mirar al cistell de la roba', 'Mirar en el cesto de la ropa', 'Look in the laundry basket'),
          ],
        },
        a: {
          scene: '🛏️🐭🧦',
          text: L(
            'Sota el llit hi ha molta pols... i un ratolí! El ratolí porta un barret vermell i llarg. Un moment. Això no és un barret. És el mitjó!',
            'Debajo de la cama hay mucho polvo... ¡y un ratón! El ratón lleva un gorro rojo y largo. Un momento. Eso no es un gorro. ¡Es el calcetín!',
            "Under the bed there is a lot of dust... and a mouse! The mouse is wearing a long red hat. Wait a minute. That's not a hat. That's the sock!"),
          choices: 'end',
        },
        b: {
          scene: '🧺🐶💤',
          text: L(
            'Al cistell hi ha samarretes i tovalloles. Alguna cosa es mou! A dins hi ha un gosset adormit. Fa servir el mitjó de coixí.',
            'En el cesto hay camisetas y toallas. ¡Algo se mueve! Dentro hay un perrito dormido. Usa el calcetín como almohada.',
            'In the basket there are shirts and towels. Something is moving! A sleepy puppy is inside. He is using the sock as a pillow.'),
          choices: 'end',
        },
        e1: {
          scene: '🍪🧦😋', end: true,
          text: L(
            "La Mixa ofereix una galeta. El petit lladre somriu i torna el mitjó. L'avi Pep està molt content. Però el mitjó està ple de molles! Cruix, cruix, cruix.",
            'Mixa ofrece una galleta. El pequeño ladrón sonríe y devuelve el calcetín. El abuelo Pep está muy contento. ¡Pero el calcetín está lleno de migas! Cronch, cronch, cronch.',
            'Mixa offers a cookie. The little thief smiles and gives back the sock. Grandpa Pep is very happy. But the sock is full of crumbs! Crunch, crunch, crunch.'),
        },
        e2: {
          scene: '🐱🎤🙉', end: true,
          text: L(
            "La Mixa canta una cançó molt forta. MEEEUUU! El petit lladre es tapa les orelles i deixa anar el mitjó. L'avi Pep se'l posa. Cas resolt, detectiva Mixa!",
            'Mixa canta una canción muy fuerte. ¡MIAAAUUU! El pequeño ladrón se tapa las orejas y suelta el calcetín. El abuelo Pep se lo pone. ¡Caso resuelto, detective Mixa!',
            'Mixa sings a very loud song. MEEEOOOW! The little thief covers its ears and drops the sock. Grandpa Pep puts it on. Case solved, Detective Mixa!'),
        },
      },
      choiceSets: {
        end: [
          C('🍪', 'e1', 'Canviar-lo per una galeta', 'Cambiarlo por una galleta', 'Swap it for a cookie'),
          C('🎤', 'e2', 'Cantar una cançó', 'Cantar una canción', 'Sing a song'),
        ],
      },
      question: {
        q: L("Què havia perdut l'avi Pep?", '¿Qué había perdido el abuelo Pep?', 'What did Grandpa Pep lose?'),
        options: [L('Un mitjó', 'Un calcetín', 'A sock'), L('Les ulleres', 'Las gafas', 'His glasses'), L('Una galeta', 'Una galleta', 'A cookie')],
      },
    },

    {
      id: 'alien', level: 'short', icon: '👽', color: '#9b5de5',
      title: L("La pizza de l'espai", 'La pizza del espacio', 'The Pizza from Space'),
      nodes: {
        start: {
          scene: '🍕🛸👽',
          text: L(
            'Una nit, una pizza voladora va aterrar al jardí. A sobre de la pizza hi havia un extraterrestre petitó. Tenia tres ulls i molta gana. —Teniu formatge? —va preguntar.',
            'Una noche, una pizza voladora aterrizó en el jardín. Encima de la pizza había un extraterrestre pequeñito. Tenía tres ojos y mucha hambre. —¿Tenéis queso? —preguntó.',
            "One night, a flying pizza landed in the garden. On top of the pizza there was a tiny alien. He had three eyes and he was very hungry. 'Do you have any cheese?' he asked."),
          choices: [
            C('🧀', 'a', 'Donar-li formatge', 'Darle queso', 'Give him cheese'),
            C('🍦', 'b', 'Donar-li un gelat', 'Darle un helado', 'Give him ice cream'),
          ],
        },
        a: {
          scene: '🧀👽⚽',
          text: L(
            "L'extraterrestre es va menjar tot el formatge de la nevera. Després es va menjar també el formatge dels veïns! La panxa se li va posar rodona com una pilota.",
            'El extraterrestre se comió todo el queso de la nevera. ¡Después se comió también el queso de los vecinos! La barriga se le puso redonda como una pelota.',
            "The alien ate all the cheese in the fridge. Then he ate the neighbours' cheese too! His belly grew round like a football."),
          choices: 'end',
        },
        b: {
          scene: '🍦👽🥶',
          text: L(
            "L'extraterrestre no havia vist mai un gelat. El va llepar i els tres ulls se li van tornar rosa. —Brrr, que fred! —va dir, i va començar a tremolar i a riure.",
            'El extraterrestre nunca había visto un helado. Lo lamió y sus tres ojos se volvieron rosas. —¡Brrr, qué frío! —dijo, y empezó a temblar y a reírse.',
            "The alien had never seen ice cream. He licked it and his three eyes turned pink. 'Brrr, it's cold!' he said, and he started to shiver and giggle."),
          choices: 'end',
        },
        e1: {
          scene: '🚀✨🌙', end: true,
          text: L(
            "Tots junts van empènyer la nau pizza. Un, dos i tres! La pizza va volar fins a les estrelles. Ara, cada nit, l'extraterrestre els saluda des de la lluna.",
            'Todos juntos empujaron la nave pizza. ¡Una, dos y tres! La pizza voló hasta las estrellas. Ahora, cada noche, el extraterrestre los saluda desde la luna.',
            'Everybody pushed the pizza ship together. One, two, three! The pizza flew up into the stars. Now, every night, the alien waves at them from the moon.'),
        },
        e2: {
          scene: '🐶🛏️👽🎺', end: true,
          text: L(
            "L'extraterrestre va dormir al llit del gos. Va roncar com una trompeta tota la nit. Al matí, tota la família estava cansada... però molt i molt contenta.",
            'El extraterrestre durmió en la cama del perro. Roncó como una trompeta toda la noche. Por la mañana, toda la familia estaba cansada... pero muy, muy contenta.',
            "The alien slept in the dog's bed. He snored like a trumpet all night long. In the morning the whole family was tired... but very, very happy."),
        },
      },
      choiceSets: {
        end: [
          C('🚀', 'e1', 'Ajudar-lo a tornar a casa', 'Ayudarlo a volver a casa', 'Help him go home'),
          C('🛏️', 'e2', 'Convidar-lo a dormir', 'Invitarlo a dormir', 'Invite him to sleep over'),
        ],
      },
      question: {
        q: L("Quants ulls tenia l'extraterrestre?", '¿Cuántos ojos tenía el extraterrestre?', 'How many eyes did the alien have?'),
        options: [L('Tres', 'Tres', 'Three'), L('Dos', 'Dos', 'Two'), L('Cinc', 'Cinco', 'Five')],
      },
    },

    {
      id: 'umbrella', level: 'short', icon: '☂️', color: '#3a86ff',
      title: L("El paraigua de l'àvia", 'El paraguas de la abuela', "Grandma's Umbrella"),
      nodes: {
        start: {
          scene: '👵☂️🌧️',
          text: L(
            "L'àvia Rosa té un paraigua lila. Quan plou, l'obre... i vola! Avui plou molt. —Veniu amb mi! —diu l'àvia.",
            'La abuela Rosa tiene un paraguas morado. Cuando llueve, lo abre... ¡y vuela! Hoy llueve mucho. —¡Venid conmigo! —dice la abuela.',
            "Grandma Rosa has a purple umbrella. When it rains, she opens it... and she flies! Today it is raining a lot. 'Come with me!' says Grandma."),
          choices: [
            C('⛰️', 'a', 'Volar a les muntanyes', 'Volar a las montañas', 'Fly to the mountains'),
            C('🌊', 'b', 'Volar al mar', 'Volar al mar', 'Fly to the sea'),
          ],
        },
        a: {
          scene: '⛰️🐐☂️',
          text: L(
            "Volen per sobre de les muntanyes. Les cabres miren amunt i diuen: —Beeee! Una cabra salta molt alt i s'agafa a la sabata de l'àvia. Ara són tres viatgers!",
            'Vuelan por encima de las montañas. Las cabras miran hacia arriba y dicen: —¡Beeee! Una cabra salta muy alto y se agarra al zapato de la abuela. ¡Ahora son tres viajeros!',
            "They fly over the mountains. The goats look up and say 'Maaa!'. One goat jumps very high and grabs Grandma's shoe. Now there are three travellers!"),
          choices: 'end',
        },
        b: {
          scene: '🌊🐋💦',
          text: L(
            "Volen per sobre del mar. Una balena salta fora de l'aigua. XAPLAF! Tothom queda xop, però l'àvia riu. —Per això serveixen els paraigües!",
            'Vuelan por encima del mar. Una ballena salta fuera del agua. ¡PLAF! Todos quedan empapados, pero la abuela se ríe. —¡Para eso sirven los paraguas!',
            "They fly over the sea. A whale jumps out of the water. SPLASH! Everybody is soaking wet, but Grandma laughs. 'That's what umbrellas are for!'"),
          choices: 'end',
        },
        e1: {
          scene: '☀️🏡☕', end: true,
          text: L(
            "Para de ploure i surt el sol. El paraigua es tanca a poc a poc i aterren suaument al jardí. L'àvia fa xocolata calenta per a tothom.",
            'Deja de llover y sale el sol. El paraguas se cierra poco a poco y aterrizan suavemente en el jardín. La abuela hace chocolate caliente para todos.',
            'The rain stops and the sun comes out. The umbrella closes slowly, and they land softly in the garden. Grandma makes hot chocolate for everyone.'),
        },
        e2: {
          scene: '🌈👵💚', end: true,
          text: L(
            "Apareix un arc de Sant Martí enorme. Hi baixen com si fos un tobogan. IUUUHUUU! Aterren al jardí amb els cabells de colors. Ara l'àvia té els cabells verds!",
            'Aparece un arcoíris enorme. Bajan por él como si fuera un tobogán. ¡IUUUJUUU! Aterrizan en el jardín con el pelo de colores. ¡Ahora la abuela tiene el pelo verde!',
            "A huge rainbow appears. They slide down it like a slide. WHEEEE! They land in the garden with colourful hair. Now Grandma's hair is green!"),
        },
      },
      choiceSets: {
        end: [
          C('☀️', 'e1', 'Esperar que surti el sol', 'Esperar a que salga el sol', 'Wait for the sun'),
          C('🌈', 'e2', "Baixar per l'arc de Sant Martí", 'Bajar por el arcoíris', 'Slide down the rainbow'),
        ],
      },
      question: {
        q: L("De quin color és el paraigua de l'àvia?", '¿De qué color es el paraguas de la abuela?', "What colour is Grandma's umbrella?"),
        options: [L('Lila', 'Morado', 'Purple'), L('Groc', 'Amarillo', 'Yellow'), L('Vermell', 'Rojo', 'Red')],
      },
    },

    // ----------------------------------------------------------------- long
    {
      id: 'fridge', level: 'long', icon: '🧊', color: '#ff9f1c',
      title: L('El misteri de la nevera que parlava', 'El misterio de la nevera que hablaba', 'The Mystery of the Talking Fridge'),
      nodes: {
        start: {
          scene: '🏠🌙🔦',
          text: L(
            'A casa de les Mellis passava una cosa molt estranya. Cada nit, a les dotze en punt, algú deia «Hola!» des de la cuina. Una nit, les bessones es van llevar sense fer soroll, amb les llanternes i la lupa.',
            'En casa de las Mellis pasaba algo muy extraño. Cada noche, a las doce en punto, alguien decía «¡Hola!» desde la cocina. Una noche, las gemelas se levantaron sin hacer ruido, con sus linternas y su lupa.',
            "In the Mellis' house, something very strange was happening. Every night at midnight, someone said 'Hello!' from the kitchen. One night, the twins got out of bed very quietly, with their torches and their magnifying glass."),
          next: 'p2',
        },
        p2: {
          scene: '🧊🗨️😮',
          text: L(
            'La cuina estava fosca i silenciosa. De sobte, una veu va sortir de la nevera: —Hola! Tinc gana! Les bessones es van mirar. Una nevera que parla? Això era impossible... o no?',
            'La cocina estaba oscura y silenciosa. De repente, una voz salió de la nevera: —¡Hola! ¡Tengo hambre! Las gemelas se miraron. ¿Una nevera que habla? Eso era imposible... ¿o no?',
            "The kitchen was dark and silent. Suddenly, a voice came from the fridge: 'Hello! I'm hungry!' The twins looked at each other. A talking fridge? That was impossible... or was it?"),
          choices: [
            C('🚪', 'a1', 'Obrir la nevera', 'Abrir la nevera', 'Open the fridge'),
            C('🔦', 'b1', 'Mirar darrere la nevera', 'Mirar detrás de la nevera', 'Look behind the fridge'),
          ],
        },
        a1: {
          scene: '🥛🦜🧀',
          text: L(
            'Van obrir la porta molt a poc a poc. A dins, entre la llet i els iogurts, hi havia un lloro! Era verd i groc, i tenia un tros de formatge enorme al bec.',
            'Abrieron la puerta muy despacio. Dentro, entre la leche y los yogures, ¡había un loro! Era verde y amarillo, y tenía un trozo enorme de queso en el pico.',
            'They opened the door very slowly. Inside, between the milk and the yogurts, there was a parrot! It was green and yellow, and it had a big piece of cheese in its beak.'),
          next: 'a2',
        },
        a2: {
          scene: '🦜🪟🌙',
          text: L(
            '—Hola! Tinc gana! —va repetir el lloro. Era en Paco, el lloro dels veïns. Cada nit entrava volant per la finestra per buscar un berenar de mitjanit.',
            '—¡Hola! ¡Tengo hambre! —repitió el loro. Era Paco, el loro de los vecinos. Cada noche entraba volando por la ventana para buscar una merienda de medianoche.',
            "'Hello! I'm hungry!' said the parrot again. It was Paco, the neighbours' parrot. Every night he flew in through the window to look for a midnight snack."),
          choices: 'end',
        },
        b1: {
          scene: '🕳️👀🔦',
          text: L(
            'Darrere la nevera hi havia un forat petit a la paret. Del forat sortia una veueta molt fina. Les bessones hi van enfocar les llanternes i van veure dos ulls brillants.',
            'Detrás de la nevera había un agujero pequeño en la pared. Del agujero salía una vocecita muy fina. Las gemelas apuntaron con sus linternas y vieron dos ojos brillantes.',
            'Behind the fridge there was a little hole in the wall. A tiny voice was coming out of the hole. The twins pointed their torches and saw two shiny eyes.'),
          next: 'b2',
        },
        b2: {
          scene: '🐭☎️😂',
          text: L(
            'Era un ratolí amb un telèfon de joguina! Estava jugant a un joc: deia «Hola!» i després s\'amagava. Reia tant que li tremolaven els bigotis.',
            '¡Era un ratón con un teléfono de juguete! Estaba jugando a un juego: decía «¡Hola!» y luego se escondía. Se reía tanto que le temblaban los bigotes.',
            "It was a mouse with a toy telephone! He was playing a game: he said 'Hello!' and then hid. He laughed so much that his whiskers shook."),
          choices: 'end',
        },
        e1: {
          scene: '🍪🎉🌙', end: true,
          text: L(
            "Les bessones es van asseure a terra i van compartir unes galetes amb el seu nou amic. Van prometre guardar el secret. Des d'aquella nit, cada divendres hi ha una festa de mitjanit a la cuina.",
            'Las gemelas se sentaron en el suelo y compartieron unas galletas con su nuevo amigo. Prometieron guardar el secreto. Desde aquella noche, cada viernes hay una fiesta de medianoche en la cocina.',
            'The twins sat on the floor and shared some cookies with their new friend. They promised to keep the secret. Since that night, there has been a midnight party in the kitchen every Friday.'),
        },
        e2: {
          scene: '👨🍌💥', end: true,
          text: L(
            'Les bessones van cridar: —Mama! Papa! Els pares van entrar corrents a la cuina en pijama. El papa va relliscar amb una pell de plàtan i va caure de cul. Tothom va riure, fins i tot el petit visitant.',
            'Las gemelas gritaron: —¡Mamá! ¡Papá! Sus padres entraron corriendo en la cocina en pijama. Papá resbaló con una piel de plátano y se cayó de culo. Todos se rieron, incluso el pequeño visitante.',
            "The twins shouted: 'Mum! Dad!' Their parents ran into the kitchen in their pyjamas. Dad slipped on a banana skin and landed on his bottom. Everybody laughed, even the little visitor."),
        },
      },
      choiceSets: {
        end: [
          C('🍪', 'e1', 'Fer-se amigues', 'Hacerse amigas', 'Make friends'),
          C('📣', 'e2', 'Despertar els pares', 'Despertar a los padres', 'Wake up Mum and Dad'),
        ],
      },
      question: {
        q: L('Quan se sentia la veu a la cuina?', '¿Cuándo se oía la voz en la cocina?', 'When did someone say hello in the kitchen?'),
        options: [L('A mitjanit', 'A medianoche', 'At midnight'), L("A l'hora de dinar", 'A la hora de comer', 'At lunchtime'), L('Al matí', 'Por la mañana', 'In the morning')],
      },
    },

    {
      id: 'robot', level: 'long', icon: '🤖', color: '#2ec4b6',
      title: L('El robot que no sabia ballar', 'El robot que no sabía bailar', "The Robot Who Couldn't Dance"),
      nodes: {
        start: {
          scene: '🏫🤖🔢',
          text: L(
            'En una escola plena de robots, hi havia un robot petit que es deia Bolt. En Bolt sabia comptar fins a un milió i escriure qualsevol paraula del món. Però hi havia una cosa que no sabia fer: ballar.',
            'En una escuela llena de robots, había un robot pequeño que se llamaba Bolt. Bolt sabía contar hasta un millón y escribir cualquier palabra del mundo. Pero había una cosa que no sabía hacer: bailar.',
            "In a school full of robots, there was a little robot called Bolt. Bolt could count to a million and spell any word in the world. But there was one thing he couldn't do: dance."),
          next: 'p2',
        },
        p2: {
          scene: '🪩🎶🤖💥',
          text: L(
            'Divendres hi havia una gran festa amb música i llums. Tots els robots ballaven. En Bolt va intentar moure els braços, però van fer BIP, CLANC, CLONC! i va caure a terra.',
            'El viernes había una gran fiesta con música y luces. Todos los robots bailaban. Bolt intentó mover los brazos, pero hicieron ¡BIP, CLANC, CLONC! y se cayó al suelo.',
            'On Friday there was a big party with music and lights. All the robots were dancing. Bolt tried to move his arms, but they went BEEP, CLANK, CLONK! and he fell over.'),
          choices: [
            C('🐱', 'a1', 'Practicar amb la gata', 'Practicar con la gata', 'Practise with the cat'),
            C('🔧', 'b1', 'Arreglar-se les cames', 'Arreglarse las piernas', 'Fix his legs'),
          ],
        },
        a1: {
          scene: '🐱🤖🔌',
          text: L(
            'En Bolt va anar a casa i va demanar ajuda a la seva gata, la Nina. La Nina saltava, feia la croqueta i bellugava la cua. En Bolt la imitava. Saltava, feia la croqueta i bellugava un cable que no sabia que tenia!',
            'Bolt fue a casa y le pidió ayuda a su gata, Nina. Nina saltaba, rodaba y movía la cola. Bolt la imitaba. ¡Saltaba, rodaba y movía un cable que no sabía que tenía!',
            "Bolt went home and asked his cat, Nina, for help. Nina jumped, rolled and wiggled her tail. Bolt copied her. He jumped, rolled and wiggled a cable he didn't know he had!"),
          next: 'a2',
        },
        a2: {
          scene: '💡🍽️🦋',
          text: L(
            'Van practicar cada tarda. Al principi, en Bolt va trencar un llum i dos plats. Però a poc a poc, els seus moviments es van tornar suaus, com els d\'una gata que persegueix una papallona.',
            'Practicaron todas las tardes. Al principio, Bolt rompió una lámpara y dos platos. Pero poco a poco, sus movimientos se volvieron suaves, como los de una gata que persigue una mariposa.',
            'They practised every afternoon. At first, Bolt broke a lamp and two plates. But little by little, his moves became smooth, like a cat chasing a butterfly.'),
          choices: 'end',
        },
        b1: {
          scene: '🧰🛢️🤖',
          text: L(
            "En Bolt va obrir la caixa d'eines i va trobar una llauna d'oli. Se'n va posar una mica als genolls, una mica als colzes i una mica al nas, per si de cas.",
            'Bolt abrió su caja de herramientas y encontró una lata de aceite. Se puso un poco en las rodillas, un poco en los codos y un poco en la nariz, por si acaso.',
            'Bolt opened his toolbox and found a can of oil. He put a little on his knees, a little on his elbows, and a little on his nose, just in case.'),
          next: 'b2',
        },
        b2: {
          scene: '⛸️🤖💨',
          text: L(
            'Ara tenia les cames molt i molt relliscoses. Quan va intentar caminar, va lliscar per tota la cuina com un patinador sobre gel. ZUUUM! —Ei, això és divertit! —va dir en Bolt.',
            'Ahora tenía las piernas muy, muy resbaladizas. Cuando intentó caminar, se deslizó por toda la cocina como un patinador sobre hielo. ¡ZUUUM! —¡Eh, esto es divertido! —dijo Bolt.',
            "Now his legs were very, very slippery. When he tried to walk, he slid across the kitchen like an ice skater. ZOOOM! 'Hey, this is fun!' said Bolt."),
          choices: 'end',
        },
        e1: {
          scene: '🤖💃🕺', end: true,
          text: L(
            'En Bolt va tornar a la festa amb un gran somriure. Ballava tan bé que tots els robots van fer una rotllana al seu voltant. Fins i tot la mestra, una robot vella i rondinaire, es va posar a ballar.',
            'Bolt volvió a la fiesta con una gran sonrisa. Bailaba tan bien que todos los robots hicieron un corro a su alrededor. Incluso la maestra, una robot vieja y gruñona, se puso a bailar.',
            'Bolt went back to the party with a big smile. He danced so well that all the robots made a circle around him. Even the teacher, a grumpy old robot, started to dance.'),
        },
        e2: {
          scene: '🏆🤖😂', end: true,
          text: L(
            'En Bolt es va apuntar al gran concurs de ball. No va guanyar el primer premi. Va guanyar el premi al ball més divertit! I per a en Bolt, aquest era el millor premi del món.',
            'Bolt se apuntó al gran concurso de baile. No ganó el primer premio. ¡Ganó el premio al baile más divertido! Y para Bolt, ese era el mejor premio del mundo.',
            "Bolt entered the big dance contest. He didn't win first prize. He won the prize for the funniest dance! And for Bolt, that was the best prize in the world."),
        },
      },
      choiceSets: {
        end: [
          C('🎶', 'e1', 'Tornar a la festa', 'Volver a la fiesta', 'Go back to the party'),
          C('🏆', 'e2', 'Apuntar-se al concurs de ball', 'Apuntarse al concurso de baile', 'Enter the dance contest'),
        ],
      },
      question: {
        q: L('Què no sabia fer en Bolt?', '¿Qué no sabía hacer Bolt?', "What couldn't Bolt do?"),
        options: [L('Ballar', 'Bailar', 'Dance'), L('Comptar', 'Contar', 'Count'), L('Escriure paraules', 'Escribir palabras', 'Spell words')],
      },
    },
  ];
})();
