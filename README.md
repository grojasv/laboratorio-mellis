# Laboratorio Mellis 🧪

Simple learning games for 7-year-olds, in Catalan, Spanish and English. Built for phones and tablets, and hosted on GitHub Pages.

**Play:** https://grojasv.github.io/laboratorio-mellis/

## The hub

`index.html` groups everything on **shelves by school subject** (`MELLIS_SHELVES` in `games.js`; each game and lesson has one `shelf`): 🔢 Numbers · 🔤 Words & stories · 🇬🇧 English · 🌍 Our world · 🎨 Family time. A **⭐ Today** row on top shows new games (NOU!) and the last ones played (`mellis.recent`, written by `shared/app.js` when a game opens). Phones show two cards per row. `families/` uses the same shelves.

## Games

| Game | What it practises |
|---|---|
| 🗓️ Memory dels mesos | Match a picture with its word (mix of CA/ES/EN), hosted by Nou the forgetful squirrel (acorn card backs, 🌰 counter). Levels: 4 seasons → 7 days of the week (sky-named: 🌙 dilluns…, week strip on the card) → 8 months → all 12 months. The scene (background, falling snow/petals/butterflies/leaves and the music) changes to the season of each pair found. Each game earns stickers for 📅 *El meu calendari* (12 months × 3 stickers, golden pair on ⭐⭐⭐) |
| 🧪 Laboratori de pocions | Bruixa Xiruca and her cat Bigotis (funny lines, smoke puffs on mistakes, never hints): pick the bottle with the right number, 10 per potion. 6 levels: up to 20 · up to 100 · carrying · 🔍 secret ingredient (? + 4 = 9, 70 − ? = 40) · 🪞 doubles & halves · 🦘 counting by 2, 5, 10 (gap at the end or in the middle). Decoys are real slips (±1, ±10, the wrong step, adding instead of taking away) and never a number already shown. Each potion hatches one of 30 named creatures that wander in 🌳 the magic garden (tap one: it jumps and says its name; golden on ⭐⭐⭐). Bubbly waltz music |
| 🎃 Laboratori de monstres | Halloween English: build the monster you hear. Easy → Medium (spots/stripes, arms, tail/wings, size) → Hard ("NO …" parts) → Expert (listen only). Doctora Bombolles, 📒 monster album, spooky music |
| 🕵️ Agència de detectives | Cases in 4 steps: footprint → secret code → rule out suspects with clues (logic, reading "NOT") → fingerprint match. Medium/Hard cases unlock by rank (more suspects and features, mirror/shift ciphers, alibis on a room map). Agent Mussol, talking suspects, arrest scene, 🚔 caught-thieves gallery, jazz music |
| 🕰️ Rellotgeria Tic-Tac | Telling the time, the Catalan way (*un quart de cinc* = 4:15). Senyor Tic-Tac's shop: customers (bear, vampire, rooster…) ask her to set their clock by dragging the hands, find the right clock out of 3, or say what time a clock shows. Easy (o'clock, *dos quarts*) and Medium (all the *quarts*) use a **pizza clock** whose eaten quarters follow the minute hand; Hard is 5-minute steps on a classic clock plus 24 h times (the shop window shows sun or moon); Expert is time passing ("the pizza needs half an hour…"). Each right answer pops a silly cuckoo out of the cuckoo clock, collected in a 🐦 album (golden on ⭐⭐⭐). 🍕 *Juga amb el rellotge*: free play that reads out any time. Tick-tock music box. Time phrases in one table in `games/clock/clock.js` (`PHRASES`) |
| ✂️ Taller Mellis | Real paper crafts, IKEA/LEGO-style: Halloween ghost garland and toilet-roll mummy, Christmas snowflake and slot-together 3D star. Finished craft turning in 3D + what you need, then one animated line drawing per step (SMIL, `games/crafts/crafts-art.js`) with spoken caption and a ✅ Fet! progress bar. Host Tisoreta the scissors. Photo of the real craft pinned on a cork board. Cosy workshop tune |
| 🐆 La cursa de la Chita | 3-lane savanna runner: tap/swipe lanes, jump rocks, ⚡ sprint through the gate with the right answer (it waits at a think line until she commits). 10 gates per race: 🔢 sums/doubles/take-aways/missing numbers rising in difficulty, 🔤 picture → spelling and heard words, 🎲 mixed. Mellis rule on gates, golden Chita at ⭐⭐⭐, wardrobe unlocks (scarf, bow, cap, cape, crown, trails) and best times. Savanna marimba tune |
| 📖 Contes en veu alta | Funny branching stories to read **out loud** (short/long). A voice meter fills while she reads, she can play back her own voice, and a question at the end adds the book to her shelf. Stories live in `games/reading/stories.js` |
| 🎭 Teatre de titelles | English from the school's *Back to School* unit: build your puppet, answer *All about me*, then the puppet hosts scenes (feelings, weather, seasons, school things, counting to 20). The finale is a puppet show where she reads her own *All about me* aloud and the puppet lip-syncs to her recording |

## Llegim (we read)

| Game | What it does |
|---|---|
| 📖 Contes en veu alta | (see Games above) read-aloud stories with a voice meter |
| 📻 Ràdio Mellis | A family radio play on one phone: pick a story (7: fairy-tale twist, space, animals and four Detective Lupa mysteries; ~380–450 words, 41–45 lines, 4–5 characters incl. the narrator), tap who's reading (the passport family, up to the cast size), a roulette hands out the parts (fair by words), then everyone reads their lines holding the 🎙️ (each line shows the character and whose turn it is). The show plays back their real voices with a silly effect per character (squeaky and robot voices in a few flavours), silences trimmed, sound effects, an outro jingle and rolling credits, rendered offline into one WAV; the last 5 shows are kept (IndexedDB), 📤 shares the audio, 🛂 sends the book to the passport pre-filled at the rating step. Scripts in `games/radio/radio-stories.js` |
| 🛂 Passaport lector | The family's passport for **real paper books**: add a book (📷 cover photo or emoji + colour, title, language), tick who read it, each reader rates it on a funny face scale (🥱 → 🤩) and picks up to 3 "what's it like" stickers (😂 😱 😢 🥰 🤯…). The book gets **stamped**; medals for 1/5/10/20 books, a family book (3+ readers), 3 languages, all the feelings. 📤 shares a recommendation card image (WhatsApp etc.). 🎲 *En parlem?* on each book rolls a 3D book-club die (🦸 characters, ✏️ change the story, 💗 feelings & me) that picks a question for everyone to answer out loud. Family members are editable (emoji + name). Everything, photos included, stays on the device (localStorage) |

## Aprenem (we learn)

School subjects as short interactive lessons, following what the girls study this term (in Catalan). Each lesson: **explore** (tap and listen) → **do** (an interactive task) → **check** (Mellis rule) → **reward** (cards for the unit's album).

| Unit | Lessons |
|---|---|
| 🐾 Els animals | 1. Vertebrates & invertebrates (sort into the 5 groups, trick animals) · 2. What they eat (feed the right plate, build food chains) · 3. How they're born (egg or tummy, order life cycles: frog, butterfly, chicken) · 4. Where they live & how they move (sky/land/water scene, pick the move and watch it). Each ends with odd-one-out questions. 📒 animal-card album filled in by all lessons. Data in `learn/animals/animals-data.js` |
| 🫀 El cos humà | 1. The 5 senses (which sense for each action, tap the organ on a face) · 2. Body & skeleton (tap body parts on a kid figure, build the skeleton top to bottom) · 3. Food & digestion (sort foods on the healthy plate, the sandwich's journey) · 4. Healthy habits (good habit or not, order hand-washing and teeth-brushing). 📒 sticker album. Data in `learn/body/body-data.js`; shares the lesson styles in `learn/animals/animals.css` |
| 🏘️ El meu poble | Made-up *Poble Mellis* map: 1. Places (tap the 12 buildings, "where would you go if…?" and a walker strolls there, odd one out) · 2. Jobs (walk each worker to their workplace, what they work with, who works where). The map colours in as she learns (album). Data in `learn/town/town-data.js` |
| 💛 Bons amics | Short stories with the Mellis and classmates: 1. Being a good friend · 2. Is it fair? · 3. When we get angry. She picks what a good friend would do; wrong choices show the consequence (no hearts), then "How does … feel?". Friendship-corner stickers. Data in `learn/friends/friends-data.js` |

## Per a famílies i mestres

`families/` is a guide for parents and teachers (CA/ES/EN), linked from the hub footer: the idea behind the lab, each game's goal (the `guide` field in `games.js`) and tips for adults. Its 📤 button shares the guide's own link, so whoever receives it lands there first.

## Game rules

Every interactive game follows **the Mellis rule** (see `CLAUDE.md`): 3 hearts ❤️❤️❤️, a wrong answer = 💔 + "oh oh!" + a 2-second pause, no hints, the 2nd miss on a question reveals the answer, hearts left = stars, ⭐⭐⭐ = golden reward, 0 hearts = the round restarts with new questions. Memory uses stars only.

## Ideas & references

Sources to check when we brainstorm new games or more interactive lessons:

- [Marble curriculum](https://withmarble.com/curriculum/): a well-structured kids' learning curriculum. Use it to pick topics and skills for new games and lessons.

## Structure

Plain HTML/CSS/JS, with no build step.

```
index.html          hub
games.js            game catalogue shown on the hub (+ guide texts for families/)
families/           guide for parents & teachers
news.js             kid-friendly news (hub 🎁 button)
CHANGELOG.md        technical changelog (SemVer)
shared/app.js       language, sounds, mascots, confetti (window.Mellis)
shared/styles.css   colours, flags, mascots
shared/game.css     top bar, level picker, win screen for game pages
games/<id>/         one folder per game
learn/<unit>/       one folder per Aprenem unit (catalogue: MELLIS_LEARN in games.js)
```

### Installable app

It's a PWA: `manifest.webmanifest` + `sw.js` (offline cache) + `icons/`. On iPhone/iPad: Safari → Share → *Add to Home Screen*. On Android/Chrome: the hub shows an "Install" button (or menu → *Install app*).

`sw.js` serves pages and code network-first (cache fallback offline or after 3 s), so a deploy shows on the next page open. The app checks for a new version whenever it comes back to the screen; the hub then reloads itself (games never reload mid-play). The hub footer shows the running version (`VERSION` in `shared/app.js`) — bump it together with `CACHE` in `sw.js` on every release.

### Adding a game

1. Create `games/<id>/index.html`. Copy an existing game for the top bar and the shared scripts.
2. Add an entry to `games.js` and follow the Mellis rule (`Mellis.round()`).
3. Add its files to `PRECACHE` in `sw.js` so it works offline from the start.
4. Use only relative paths. Pages are served under `/laboratorio-mellis/`.

### Run locally

```bash
python3 -m http.server 8000 --directory ..
```

Then open http://localhost:8000/laboratorio-mellis/.
