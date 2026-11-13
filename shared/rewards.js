// What she has collected in every game, read from what the games already save.
// Used by the hub (progress rings on the cards) and the trophy room (trophies/).
//   MELLIS_REWARDS.read(id) → { name, have, total, gold, items: [{ e, g }] } or null (nothing to collect)
//   total = 0 means an open collection with no end (monsters, books, photos).
// The totals and lists below repeat what each game defines; when a game's collection
// changes (new creature, new sticker...), update its reader here too.
(function () {
  const S = window.Mellis.store;
  const L = (ca, es, en) => ({ ca, es, en });
  const keys = (o) => Object.keys(o || {});
  const repeat = (e, n, golden) => Array.from({ length: n }, (_, i) => ({ e, g: i < golden }));

  // Memory: Nou's pantry, 8 decks × 5 jars (same order as DECKS in games/memory/memory.js)
  const PANTRY = {
    classic: ['🌰', '🥜', '🍄', '🫐', '🍯'], sums: ['🍎', '🍐', '🍊', '🍋', '🍇'], friends: ['🍓', '🍒', '🍑', '🥝', '🍌'],
    doubles: ['🥕', '🌽', '🥦', '🎃', '🫛'], clock: ['🧀', '🥖', '🥐', '🥨', '🧇'], money: ['🍪', '🍩', '🧁', '🍫', '🍬'],
    english: ['🥞', '🍰', '🥧', '🍮', '🍭'], mix: ['🍉', '🍍', '🥥', '🥭', '🍈'],
  };
  // Chita's wardrobe: [emoji, stars needed]
  const WARDROBE = [['🧣', 3], ['💖', 4], ['🎀', 6], ['🧢', 10], ['⭐', 12], ['🦸‍♀️', 15], ['🌈', 18], ['👑', 21]];

  const READERS = {
    memory() {
      const a = S.get('mellis.memory.pantry', {});
      const items = keys(a).map((k) => { const [d, i] = k.split('-'); return { e: (PANTRY[d] || [])[i], g: a[k] === 2 }; }).filter((i) => i.e);
      return { name: L('El rebost de la Nou', 'La despensa de Nou', "Nou's pantry"), total: 40, items };
    },
    potions() {
      const gold = S.get('mellis.potions.gold', []);
      const items = S.get('mellis.potions.creatures', []).map((e) => ({ e, g: gold.includes(e) }));
      return { name: L('El jardí màgic', 'El jardín mágico', 'The magic garden'), total: 30, items };
    },
    shop() {
      const a = S.get('mellis.shop.items', {});
      return { name: L('El meu cistell', 'Mi cesta', 'My basket'), total: 24, items: keys(a).map((e) => ({ e, g: a[e] === 2 })) };
    },
    monsters() {
      const list = S.get('mellis.monsters.album', []);
      return { name: L('Àlbum de monstres', 'Álbum de monstruos', 'Monster album'), total: 0, items: list.map((m) => ({ e: '👾', g: !!m.g })) };
    },
    detective() {
      const solved = +S.get('mellis.detective.solved', 0) || 0, gold = +S.get('mellis.detective.gold', 0) || 0;
      // 10 solved cases = the top rank (legendary detective)
      return { name: L('Lladres atrapats', 'Ladrones atrapados', 'Caught thieves'), total: 10, have: Math.min(solved, 10), items: repeat('🦹', solved, gold) };
    },
    clock() {
      const a = S.get('mellis.clock.album', {});
      return { name: L('Els cucuts', 'Los cucos', 'The cuckoos'), total: 20, items: keys(a).map((k) => ({ e: '🐦', g: a[k] === 2 })) };
    },
    cheetah() {
      const s = S.get('mellis.cheetah', {});
      const items = WARDROBE.filter(([, need]) => (s.stars || 0) >= need).map(([e]) => ({ e }));
      if (s.gold) items.push({ e: '🥇', g: true });
      return { name: L("L'armari de la Chita", 'El armario de Chita', "Chita's wardrobe"), total: WARDROBE.length + 1, items };
    },
    reading() {
      const gold = S.get('mellis.reading.gold', []);
      return { name: L('Contes llegits', 'Cuentos leídos', 'Stories read'), total: 6, items: S.get('mellis.reading.done', []).map((id) => ({ e: '📕', g: gold.includes(id) })) };
    },
    puppets() {
      const list = S.get('mellis.puppets', []);
      const stars = list.reduce((n, p) => n + (p.stickers || 0), 0);
      return { name: L('Adhesius dels titelles', 'Pegatinas de los títeres', 'Puppet stickers'), total: 0, items: repeat('🎭', list.length, 0).concat(repeat('⭐', stars, stars)) };
    },
    passport() {
      const books = S.get('mellis.passport.books', []);
      return { name: L('Llibres segellats', 'Libros sellados', 'Stamped books'), total: 0, items: books.map((b) => ({ e: b.emoji || '📗' })) };
    },
    crafts() {
      return { name: L('El suro de manualitats', 'El corcho de manualidades', 'The craft board'), total: 0, items: repeat('📌', S.get('mellis.crafts.board', []).length, 0) };
    },
    animals() {
      return { name: L("Cartes d'animals", 'Cartas de animales', 'Animal cards'), total: 35, items: repeat('🐾', keys(S.get('mellis.animals.cards', {})).length, 0) };
    },
    body() {
      return { name: L('Adhesius del cos', 'Pegatinas del cuerpo', 'Body stickers'), total: 53, items: repeat('🫀', keys(S.get('mellis.body.stickers', {})).length, 0) };
    },
    town() {
      const st = S.get('mellis.town.learned', {});
      return { name: L('El poble pintat', 'El pueblo pintado', 'The coloured town'), total: 24, items: repeat('🏠', keys(st.places).length, 0).concat(repeat('👷', keys(st.jobs).length, 0)) };
    },
    friends() {
      return { name: L("El racó de l'amistat", 'El rincón de la amistad', 'The friendship corner'), total: 9, items: repeat('💛', keys(S.get('mellis.friends.stickers', {})).length, 0) };
    },
  };

  function read(id) {
    if (!READERS[id]) return null;
    let r;
    try { r = READERS[id](); } catch (e) { return null; }   // odd saved data never breaks the hub
    r.id = id;
    if (r.have == null) r.have = r.total ? Math.min(r.items.length, r.total) : r.items.length;
    r.gold = r.items.filter((i) => i.g).length;
    r.full = !!r.total && r.have >= r.total;
    return r;
  }

  window.MELLIS_REWARDS = { read, ids: Object.keys(READERS) };
})();
