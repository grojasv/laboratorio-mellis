# Laboratorio Mellis 🧪

Simple learning games for 7-year-olds, in Catalan, Spanish and English. Built for phones and tablets, and hosted on GitHub Pages.

**Play:** https://grojasv.github.io/laboratorio-mellis/

## Games

| Game | What it practises |
|---|---|
| 🗓️ Memory dels mesos | Months and seasons: match a picture with a word in a mix of CA/ES/EN |
| 🧪 Laboratori de pocions | Adding and subtracting up to 100 (3 levels), with a collection of creatures |
| 🎃 Laboratori de monstres | Halloween English: build the monster you hear. Easy → Medium (spots/stripes, arms, tail/wings, size) → Hard ("NO …" parts) → Expert (listen only). Doctora Bombolles, 📒 monster album, spooky music |
| 🕵️ Agència de detectives | Cases in 4 steps: footprint → secret code → rule out suspects with clues (logic, reading "NOT") → fingerprint match. Medium/Hard cases unlock by rank (more suspects and features, mirror/shift ciphers, alibis on a room map). Agent Mussol, talking suspects, arrest scene, 🚔 caught-thieves gallery, jazz music |
| 📖 Contes en veu alta | Funny branching stories to read **out loud** (short/long). A voice meter fills while she reads, she can play back her own voice, and a question at the end adds the book to her shelf. Stories live in `games/reading/stories.js` |
| 🎭 Teatre de titelles | English from the school's *Back to School* unit: build your puppet, answer *All about me*, then the puppet hosts scenes (feelings, weather, seasons, school things, counting to 20). The finale is a puppet show where she reads her own *All about me* aloud and the puppet lip-syncs to her recording |

## Llegim (we read)

| Game | What it does |
|---|---|
| 📖 Contes en veu alta | (see Games above) read-aloud stories with a voice meter |
| 📻 Ràdio Mellis | A family radio play on one phone: pick a story (4: fairy-tale twist, space, mystery, animals; ~380 words, 41 lines, 4–5 characters incl. the narrator), tap who's reading (the passport family, up to the cast size), a roulette hands out the parts (fair by words), then everyone reads their lines holding the 🎙️ (each line shows the character and whose turn it is). The show plays back their real voices with a silly effect per character (chipmunk, giant, robot, echo) and sound effects, rendered offline into one WAV; the last 5 shows are kept (IndexedDB), 📤 shares the audio, 🛂 sends the book to the passport pre-filled at the rating step. Scripts in `games/radio/radio-stories.js` |
| 🛂 Passaport lector | The family's passport for **real paper books**: add a book (📷 cover photo or emoji + colour, title, language), tick who read it, each reader rates it on a funny face scale (🥱 → 🤩) and picks up to 3 "what's it like" stickers (😂 😱 😢 🥰 🤯…). The book gets **stamped**; medals for 1/5/10/20 books, a family book (3+ readers), 3 languages, all the feelings. 📤 shares a recommendation card image (WhatsApp etc.). 🎲 *En parlem?* on each book rolls a 3D book-club die (🦸 characters, ✏️ change the story, 💗 feelings & me) that picks a question for everyone to answer out loud. Family members are editable (emoji + name). Everything, photos included, stays on the device (localStorage) |

## Aprenem (we learn)

School subjects as short interactive lessons, following what the girls study this term (in Catalan). Each lesson: **explore** (tap and listen) → **do** (an interactive task) → **check** (Mellis rule) → **reward** (cards for the unit's album).

| Unit | Lessons |
|---|---|
| 🐾 Els animals | 1. Vertebrates & invertebrates (sort into the 5 groups, trick animals) · 2. What they eat (feed the right plate, build food chains) · 3. How they're born (egg or tummy, order life cycles: frog, butterfly, chicken) · 4. Where they live & how they move (sky/land/water scene, pick the move and watch it). Each ends with odd-one-out questions. 📒 animal-card album filled in by all lessons. Data in `learn/animals/animals-data.js` |
| 🫀 El cos humà | 1. The 5 senses (which sense for each action, tap the organ on a face) · 2. Body & skeleton (tap body parts on a kid figure, build the skeleton top to bottom) · 3. Food & digestion (sort foods on the healthy plate, the sandwich's journey) · 4. Healthy habits (good habit or not, order hand-washing and teeth-brushing). 📒 sticker album. Data in `learn/body/body-data.js`; shares the lesson styles in `learn/animals/animals.css` |
| 🏘️ El meu poble | Made-up *Poble Mellis* map: 1. Places (tap the 12 buildings, "where would you go if…?" and a walker strolls there, odd one out) · 2. Jobs (walk each worker to their workplace, what they work with, who works where). The map colours in as she learns (album). Data in `learn/town/town-data.js` |
| 💛 Bons amics | Short stories with the Mellis and classmates: 1. Being a good friend · 2. Is it fair? · 3. When we get angry. She picks what a good friend would do; wrong choices show the consequence (no hearts), then "How does … feel?". Friendship-corner stickers. Data in `learn/friends/friends-data.js` |

## Game rules

Every interactive game follows **the Mellis rule** (see `CLAUDE.md`): 3 hearts ❤️❤️❤️, a wrong answer = 💔 + "oh oh!" + a 2-second pause, no hints, the 2nd miss on a question reveals the answer, hearts left = stars, ⭐⭐⭐ = golden reward, 0 hearts = the round restarts with new questions. Memory uses stars only.

## Ideas & references

Sources to check when we brainstorm new games or more interactive lessons:

- [Marble curriculum](https://withmarble.com/curriculum/): a well-structured kids' learning curriculum. Use it to pick topics and skills for new games and lessons.

## Structure

Plain HTML/CSS/JS, with no build step.

```
index.html          hub
games.js            game catalogue shown on the hub
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

`sw.js` serves files from the cache and refreshes them in the background, so changes appear on the second open after a deploy.

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
