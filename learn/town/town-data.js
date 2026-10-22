// "El meu poble": places of a made-up Catalan town and the people who work there.
(function () {
  const L = (ca, es, en) => ({ ca, es, en });
  // in = "a l'escola" (for "La mestra treballa a l'escola"); kind = for the odd-one-out check
  const P = (id, e, kind, name, inn, fact, sit, job) => ({ id, e, kind, name, in: inn, fact, sit, job });
  const J = (e, the, does, toolE, tool) => ({ e, the, does, tool: { e: toolE, the: tool } });

  window.TOWN = {
    PLACES: [
      P('school', '🏫', 'fun', L('Escola', 'Colegio', 'School'), L("a l'escola", 'en el colegio', 'at the school'),
        L("A l'escola aprenem a llegir, escriure i comptar, i fem amics.", 'En el colegio aprendemos a leer, escribir y contar, y hacemos amigos.', 'At school we learn to read, write and count, and make friends.'),
        L('Dilluns al matí toca anar a classe.', 'El lunes por la mañana toca ir a clase.', "On Monday morning it's time for class."),
        J('👩‍🏫', L('la mestra', 'la maestra', 'the teacher'), L('ensenya a llegir i a comptar', 'enseña a leer y a contar', 'teaches reading and counting'), '✏️', L('el llapis i la pissarra', 'el lápiz y la pizarra', 'pencils and the board'))),
      P('health', '🏥', 'help', L('CAP', 'Centro de salud', 'Health centre'), L('al CAP', 'en el centro de salud', 'at the health centre'),
        L('Al CAP i a l\'hospital ens curen quan estem malalts o ens fem mal.', 'En el centro de salud y en el hospital nos curan cuando estamos enfermos o nos hacemos daño.', 'At the health centre and the hospital they help us when we are ill or hurt.'),
        L('Tens febre i et fa mal la panxa.', 'Tienes fiebre y te duele la barriga.', 'You have a fever and a tummy ache.'),
        J('👩‍⚕️', L('la metgessa', 'la médica', 'the doctor'), L('cura la gent malalta', 'cura a la gente enferma', 'helps sick people get better'), '🩺', L('el fonendoscopi', 'el estetoscopio', 'a stethoscope'))),
      P('townhall', '🏛️', 'help', L('Ajuntament', 'Ayuntamiento', 'Town hall'), L("a l'ajuntament", 'en el ayuntamiento', 'at the town hall'),
        L("A l'ajuntament es decideix com cuidar el poble: carrers, parcs, escoles...", 'En el ayuntamiento se decide cómo cuidar el pueblo: calles, parques, colegios...', 'At the town hall they decide how to look after the town: streets, parks, schools...'),
        L('Vols demanar que posin més bancs al parc.', 'Quieres pedir que pongan más bancos en el parque.', 'You want to ask for more benches in the park.'),
        J('🧑‍💼', L("l'alcaldessa", 'la alcaldesa', 'the mayor'), L('organitza el poble', 'organiza el pueblo', 'runs the town'), '📋', L('els documents', 'los documentos', 'documents'))),
      P('bakery', '🥖', 'shop', L('Forn de pa', 'Panadería', 'Bakery'), L('al forn de pa', 'en la panadería', 'at the bakery'),
        L('Al forn de pa hi comprem pa, coques i croissants.', 'En la panadería compramos pan, bollos y cruasanes.', 'At the bakery we buy bread, cakes and croissants.'),
        L('Vols una barra de pa per esmorzar.', 'Quieres una barra de pan para desayunar.', 'You want a loaf of bread for breakfast.'),
        J('👨‍🍳', L('el forner', 'el panadero', 'the baker'), L('fa el pa cada matí', 'hace el pan cada mañana', 'bakes bread every morning'), '🌾', L('la farina', 'la harina', 'flour'))),
      P('market', '🧺', 'shop', L('Mercat', 'Mercado', 'Market'), L('al mercat', 'en el mercado', 'at the market'),
        L('Al mercat hi ha parades de fruita, verdura, carn i peix fresc.', 'En el mercado hay puestos de fruta, verdura, carne y pescado fresco.', 'The market has stalls with fresh fruit, veg, meat and fish.'),
        L('Necessites pomes i peix fresc per dinar.', 'Necesitas manzanas y pescado fresco para comer.', 'You need apples and fresh fish for lunch.'),
        J('👩‍🌾', L('la venedora', 'la vendedora', 'the stallholder'), L('ven fruita i verdura', 'vende fruta y verdura', 'sells fruit and veg'), '⚖️', L('la balança', 'la balanza', 'scales'))),
      P('pharmacy', '⚕️', 'shop', L('Farmàcia', 'Farmacia', 'Pharmacy'), L('a la farmàcia', 'en la farmacia', 'at the pharmacy'),
        L('A la farmàcia hi comprem els medicaments que ens recepta la metgessa.', 'En la farmacia compramos las medicinas que nos receta la médica.', 'At the pharmacy we get the medicine the doctor prescribes.'),
        L('Necessites un xarop per a la tos.', 'Necesitas un jarabe para la tos.', 'You need cough syrup.'),
        J('🧑‍⚕️', L('el farmacèutic', 'el farmacéutico', 'the pharmacist'), L('ens dona els medicaments', 'nos da las medicinas', 'gives us our medicine'), '💊', L('els medicaments', 'las medicinas', 'medicine'))),
      P('library', '📚', 'fun', L('Biblioteca', 'Biblioteca', 'Library'), L('a la biblioteca', 'en la biblioteca', 'at the library'),
        L('A la biblioteca hi agafem llibres en préstec. Després els hem de tornar!', 'En la biblioteca cogemos libros prestados. ¡Luego hay que devolverlos!', 'At the library we borrow books. Then we must bring them back!'),
        L('Vols un llibre de dracs per llegir a casa.', 'Quieres un libro de dragones para leer en casa.', 'You want a dragon book to read at home.'),
        J('👩‍💼', L('la bibliotecària', 'la bibliotecaria', 'the librarian'), L('cuida els llibres i ens ajuda a trobar-ne', 'cuida los libros y nos ayuda a encontrarlos', 'looks after the books and helps us find them'), '📖', L('els llibres', 'los libros', 'books'))),
      P('park', '🌳', 'fun', L('Parc', 'Parque', 'Park'), L('al parc', 'en el parque', 'in the park'),
        L('Al parc hi juguem, correm i passegem entre arbres i flors.', 'En el parque jugamos, corremos y paseamos entre árboles y flores.', 'At the park we play, run and walk among trees and flowers.'),
        L('Vols tirar-te pel tobogan.', 'Quieres tirarte por el tobogán.', 'You want to go down the slide.'),
        J('👨‍🌾', L('el jardiner', 'el jardinero', 'the gardener'), L('cuida les plantes del parc', 'cuida las plantas del parque', 'looks after the plants in the park'), '🌷', L('les flors i les plantes', 'las flores y las plantas', 'flowers and plants'))),
      P('fire', '🚒', 'help', L('Bombers', 'Bomberos', 'Fire station'), L('al parc de bombers', 'en el parque de bomberos', 'at the fire station'),
        L('Al parc de bombers hi ha els bombers, que apaguen focs i rescaten la gent.', 'En el parque de bomberos están los bomberos, que apagan fuegos y rescatan a la gente.', 'Firefighters work at the fire station: they put out fires and rescue people.'),
        L('Surt fum d\'una casa!', '¡Sale humo de una casa!', 'Smoke is coming out of a house!'),
        J('👩‍🚒', L('la bombera', 'la bombera', 'the firefighter'), L('apaga focs i rescata la gent', 'apaga fuegos y rescata a la gente', 'puts out fires and rescues people'), '🧯', L("l'extintor i la mànega", 'el extintor y la manguera', 'the extinguisher and the hose'))),
      P('police', '🚓', 'help', L('Comissaria', 'Comisaría', 'Police station'), L('a la comissaria', 'en la comisaría', 'at the police station'),
        L('A la comissaria hi treballa la policia, que ajuda la gent i vigila que tot vagi bé.', 'En la comisaría trabaja la policía, que ayuda a la gente y vigila que todo vaya bien.', 'The police work at the police station: they help people and keep everyone safe.'),
        L("Algú s'ha endut la teva bicicleta!", '¡Alguien se ha llevado tu bicicleta!', 'Someone took your bike!'),
        J('👮', L('el policia', 'el policía', 'the police officer'), L('ajuda la gent i vigila', 'ayuda a la gente y vigila', 'helps people and keeps them safe'), '🚨', L('el cotxe amb sirena', 'el coche con sirena', 'the car with a siren'))),
      P('post', '📮', 'shop', L('Correus', 'Correos', 'Post office'), L('a correus', 'en correos', 'at the post office'),
        L('A correus hi enviem cartes i paquets.', 'En correos enviamos cartas y paquetes.', 'At the post office we send letters and parcels.'),
        L("Vols enviar una carta a l'àvia.", 'Quieres enviar una carta a la abuela.', 'You want to send a letter to Grandma.'),
        J('🧑‍🦱', L('el carter', 'el cartero', 'the postman'), L('porta les cartes a les cases', 'lleva las cartas a las casas', 'brings letters to people\'s homes'), '✉️', L('les cartes', 'las cartas', 'letters'))),
      P('station', '🚉', 'fun', L('Estació', 'Estación', 'Station'), L("a l'estació", 'en la estación', 'at the station'),
        L("A l'estació hi agafem el tren per anar a altres pobles i ciutats.", 'En la estación cogemos el tren para ir a otros pueblos y ciudades.', 'At the station we catch the train to other towns and cities.'),
        L('Vols anar a la platja amb tren.', 'Quieres ir a la playa en tren.', 'You want to take the train to the beach.'),
        J('👩‍✈️', L('la maquinista', 'la maquinista', 'the train driver'), L('condueix el tren', 'conduce el tren', 'drives the train'), '🚆', L('el tren', 'el tren', 'the train'))),
    ],
    // odd-one-out groups for lesson 1 (post office counts as a shop-like service)
    KINDS: {
      shop: L("Quin d'aquests NO és un lloc per comprar o enviar coses?", '¿Cuál de estos NO es un sitio para comprar o enviar cosas?', 'Which one is NOT a place to buy or send things?'),
      help: L("Quin d'aquests NO ens ajuda en una emergència o a cuidar el poble?", '¿Cuál de estos NO nos ayuda en una emergencia o a cuidar el pueblo?', 'Which one does NOT help in an emergency or look after the town?'),
      fun: L("Quin d'aquests NO és per aprendre, jugar o viatjar?", '¿Cuál de estos NO es para aprender, jugar o viajar?', 'Which one is NOT for learning, playing or travelling?'),
    },
    LESSONS: [
      { id: 1, icon: '🗺️', name: L('Els llocs del poble', 'Los sitios del pueblo', 'Places in town'),
        intro: L('Benvinguda al Poble Mellis! Toca cada edifici per saber què s\'hi fa.', '¡Bienvenida al Pueblo Mellis! Toca cada edificio para saber qué se hace allí.', 'Welcome to Mellis Town! Tap each building to find out what happens there.'),
        acts: [{ type: 'walk', mode: 'sit', n: 7, icon: '🚶' }], check: { mode: 'kind', n: 2 } },
      { id: 2, icon: '👩‍🚒', name: L('Els oficis', 'Los oficios', 'Jobs'),
        intro: L('Al poble hi treballa molta gent. Toca cada persona per conèixer el seu ofici!', 'En el pueblo trabaja mucha gente. ¡Toca cada persona para conocer su oficio!', 'Lots of people work in town. Tap each person to learn their job!'),
        acts: [{ type: 'walk', mode: 'job', n: 6, icon: '🚶' }, { type: 'tool', n: 5, icon: '🧰' }], check: { mode: 'who', n: 2 } },
    ],
  };
})();
