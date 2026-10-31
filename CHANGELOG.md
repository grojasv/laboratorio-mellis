# Changelog

All notable changes to Laboratorio Mellis. Format: [Keep a Changelog](https://keepachangelog.com/), versions: [SemVer](https://semver.org/) — new game or feature = minor, fix = patch.

The kid-friendly version of this list lives in `news.js` (shown on the hub's 🎁 button).

## [1.30.0] — 2026-10-31
### Changed
- La cursa de la Chita is now a real action game: the gate no longer stops at a think line. Whatever lane she is in when it arrives is her answer, and ⚡ is an optional sprint.
  - To leave time to read, the 3 answers also show in big type over the sky, left / middle / right like the lanes, with her current lane highlighted. The signs on the track only become readable in the last second.
  - The pace adapts within a race: it starts at about 5–6 s per gate, gets faster (+0.8) after each right gate and slower (−2.5, down to about 8 s per gate) after each miss.
  - The Mellis rule still applies: a lane she never chose costs a heart when it's wrong. Service worker cache `mellis-v32`.

## [1.29.0] — 2026-10-31
### Changed
- Hub restructured into **shelves by school subject**, replacing 🎮 Jocs / 📚 Llegim / 🎒 Aprenem: 🔢 Números (Memory, Potions, Clock, Chita), 🔤 Lletres i contes (Detectives, Read-aloud stories, Reading passport), 🇬🇧 English (Monsters, Puppets), 🌍 El món (the four Aprenem units), 🎨 Fem en família (Ràdio, Taller).
  - Each game and lesson has a `shelf` in `games.js` (`section` is gone), and `MELLIS_SHELVES` sets the order, icon and colour.
  - A **⭐ Avui** row on top shows new games, then the last 3 played (`mellis.recent`, kept by `shared/app.js`), up to 4 cards.
  - Phones show two smaller cards per row.
  - The families guide uses the same shelves.
- README: Ràdio row updated (7 stories, no speed-up). Service worker cache `mellis-v31`.

## [1.28.1] — 2026-10-31
### Fixed
- La cursa de la Chita:
  - A heard-word gate is now checked when it appears, not at race start. On a phone whose Catalan voice turns out to be the Spanish fallback (or when sound is muted mid-race), it becomes a picture question instead of a dictation in the wrong voice.
  - Changing language mid-race restarts the race with questions in the new language.
  - Spelling traps that were too close or possibly real words were replaced: CA SERB → SARP, FLÓR → FLUR, PLATAN → PLÀNTAN. Service worker cache `mellis-v30`.

## [1.28.0] — 2026-10-31
### Added
- **La cursa de la Chita** (`games/cheetah/`), a 3-lane savanna runner with Chita the cheetah. Canvas pseudo-3D track (acacias, savanna animals, lane lines), Chita drawn in SVG from behind (galloping legs, swinging tail).
  - Tap a lane or swipe to switch lanes; tap Chita or swipe up to jump the rocks and logs, which only cost time. Each race has 10 answer gates, one per lane. A gate waits at a "think line" until she presses ⚡ *Corre!*, so a slow reader is never forced into an answer, and the time record rewards quick ones.
  - 🔢 Numbers rise during the race: sums to 10, then sums to 20 and doubles, then take-aways and missing numbers. 🔤 Letters: picture → spelling, and a heard word (only when the language has its own voice, never Catalan read by the Spanish fallback). 🎲 Mixed. The spelling traps are never real words.
  - Mellis rule: a wrong gate makes Chita trip and costs a heart, the same question comes back, the 2nd miss shows the full answer, and 0 hearts restarts with new questions. ⭐⭐⭐ = golden Chita and the gold coat.
  - Stars unlock wardrobe items: scarf, bow, cap, superhero cape and crown, plus heart, star and rainbow trails. Best time per race type.
- Shared: `M.ownVoice(lang)` (true when the language has its own voice, not the Catalan → Spanish fallback) and the `savanna` music theme. Service worker cache `mellis-v29`.

## [1.27.0] — 2026-10-31
### Added
- Ràdio Mellis: three new Detective Lupa scripts (theme 🔎), with recurring characters from *The Zoo Cake Mystery*: *Lupa and the Giraffe's Scarf* (🦒 Gina, Pep as Lupa's assistant, Piu the bird), *Lupa and the Dinosaur's Bone* (🦉 Ot the night guard, Bru the monkey, Bimbo the dog) and *Lupa and the Library Noise* (Rosa the librarian, Pep, 🐭 Mia the mouse). 43–45 lines each, ≤ 15 words per line, CA/ES/EN. Service worker cache `mellis-v28`.

## [1.26.2] — 2026-10-31
### Added
- Families guide (`families/`): a 🗣️ tip on installing a Catalan text-to-speech voice (Android: Speech Services by Google → Install voice data → Catalan, Samsung engine switch; iPhone/iPad: Accessibility → Spoken Content → Voices → Catalan), for devices where Catalan falls back to the Spanish voice. Service worker cache `mellis-v27`.

## [1.26.1] — 2026-10-31
### Fixed
- Spoken voice in Catalan stayed silent on devices without a Catalan TTS voice (many Android / Samsung phones, some iPhones), in every game. `Mellis.speak()` now reads Catalan with the Spanish voice (`es-ES`, utterance `lang` set to the voice's own) when no Catalan voice exists, and when a listed Catalan voice fails (not downloaded) it retries once with Spanish and keeps using Spanish for the session. `canSpeak('ca')` is true when that fallback exists. Voice matching ignores case and `_`/`-`, and re-reads the voice list when it is still empty (no `voiceschanged`). English/Spanish stay strict: never read with another language's voice. Service worker cache `mellis-v26`.

## [1.26.0] — 2026-10-31
### Added
- New game **Taller Mellis** (`games/crafts/`, in 🎮 Jocs): real paper crafts explained like IKEA/LEGO instructions. Four crafts: 👻 ghost garland and 🧻 toilet-roll mummy (Halloween), ❄️ paper snowflake and ⭐ slot-together 3D star (Christmas). Each starts with the finished craft turning in 3D (the star is 4 half-planes spinning) and a "what you need" list; every step is an animated SMIL line drawing (folds, scissors following the cut line, slides) with a spoken caption, a 🔊 repeat, ⬅️ back and a big ✅ Fet! that fills a LEGO-style progress bar. Host: Tisoreta, the chatty scissors. At the end she photographs her craft (or pins the drawing) onto a cork board of polaroids (`mellis.crafts.board`, small JPEGs, max 40). No hearts (creative activity). New `workshop` music theme in `shared/app.js`. Service worker cache `mellis-v25`.

## [1.25.0] — 2026-10-31
### Changed
- Ràdio Mellis: the show plays at normal speed again (the 1.5× pitch-preserving playback made voices and effects sound doubled/phasey). Silence trimming between lines stays.
- Ràdio Mellis ending: one radio sign-off jingle (the opening jingle walking back down) baked into the recording, replacing the tada + the live win fanfare that played on top of each other. The no-microphone (phone voices) show ends with the same jingle.
### Added
- Ràdio Mellis: movie-style credits roll at the end of the show (title, each character with who played it, 📻 Ràdio Mellis). Service worker cache `mellis-v24`.

## [1.24.1] — 2026-10-25
### Removed
- Hub: the "Aviat, més experiments!" placeholder card at the end of 🎮 Jocs (and its styles). Service worker cache `mellis-v23`.

## [1.24.0] — 2026-10-25
### Added
- **Laboratori de pocions revamp.** Hosts: Bruixa Xiruca (a young witch whose hat jumps on mistakes) and her cat Bigotis (miaus, sneezes), with short lines that never hint; coloured smoke puffs on wrong answers. Three new levels (6 in a 2-column picker): 🔍 *Ingredient secret* (missing number, within 20 or in tens; decoy: doing the other operation), 🪞 *Doble i meitat* (doubles to 50, halves to 100; decoys: forgot to double, doubled instead of halving), 🦘 *Salts màgics* (counting by 2, 5, 10, gap at the end or in the middle; decoys: the wrong step). Decoys never repeat a number already shown. 30 named creatures (was 16 unnamed) living in 🌳 *El jardí màgic*: they wander on a loose grid, jump and say their name when tapped, golden ones glow. Xiruca's hut look (teal walls, jar shelf).
- Shared: `M.music.play('potion')` bubbly waltz with a new `plop` voice.
### Fixed
- Potion Lab: the pour no longer stalls when the phone pauses animations (timeout fallback). Service worker cache `mellis-v22`.

## [1.23.0] — 2026-10-25
### Added
- **Memory dels mesos revamp.** Host: Nou, a forgetful squirrel (speech bubble, hops on matches, scratches her head on misses; never hints), acorn card backs and a 🌰 found counter. New levels: *Dies* (7 days of the week, pictures from the sky names — 🌙 dilluns, 🔴 dimarts… — plus a week strip with the weekend marked) and *Difícil* (all 12 months, 24 square cards; long words shrink to fit). Seasonal scene: background, falling ❄️/🌸/🦋/🍂 and music follow the season of each pair found (starts on the real season). 📅 *El meu calendari*: 12 months × 3 stickers; every game awards one from the board's months (missing ones first), two golden ones on ⭐⭐⭐.
- Shared: seasonal music `M.music.play('winter' | 'spring' | 'summer' | 'autumn')` — one folk tune in four arrangements.
### Changed
- Memory toasts no longer block taps. Service worker cache `mellis-v21`.

## [1.22.0] — 2026-10-25
### Added
- **Guide for parents & teachers** (`families/`): its own page (CA/ES/EN, readable adult text, same look) with the idea behind the lab (age, school link, no-guessing scoring, no ads/accounts, data stays on the device, offline + install), every game and Aprenem unit with 2–3 lines on what she does and what it practises, and tips for adults. 📤 *Comparteix* shares the guide's link through the native share sheet (copy-link fallback), so the person receiving it lands on the guide first; 🧪 *Obre el laboratori* goes to the hub.
- Hub footer: 👪 *Per a famílies i mestres* button.
- `guide` field (CA/ES/EN) on every entry in `games.js`; the guide page renders from the catalogue, so new games appear automatically.
### Changed
- Service worker cache `mellis-v20`.

## [1.21.0] — 2026-10-25
### Added
- **Rellotgeria Tic-Tac** (`games/clock/`, 🎮 Jocs): learn to tell the time. Senyor Tic-Tac (moustache dances on right answers) serves 5 customers per round, each with their own reason and hour (bear, rooster, vampire, princess, dinosaur, astronaut, tortoise, owl, witch, pig, dog, robot). Three answer modes mixed per round: set the clock by dragging the hands (minute hand carries the hour past 12, snaps to the level's step; starts on a wrong time so ✅ alone never wins), pick the right clock out of 3, pick the right words for a clock. Decoys are the real traps: hour before/after (the *quarts* count towards the next hour), swapped hands, other minute marks, 15:00 read as 5. Levels: Easy (*en punt*, *dos quarts*) and Medium (all *quarts*) on a **pizza clock** whose eaten quarters follow the minute hand; Hard: 5-minute steps on a classic clock with minute labels, requests in 24 h digits and part-of-day answers (shop window sky: dawn/day/dusk/night); Expert: time passing (pizza in the oven, cake, train, nap, film, Moon trip; 15 min to 2 h). Mellis rule (3 hearts, reveal on 2nd miss, restart at 0). Each right answer pops one of 20 silly cuckoos (sneezy, sleepy, opera, pirate, pizza…) with its own call; 🐦 album, golden on ⭐⭐⭐. 🍕 free play: move the hands and hear the time (pizza/classic face, ☀️/🌙 for 24 h). CA uses the traditional *quarts* system; ES/EN their usual forms.
- Shared: `Mellis.sounds.cuckoo()` and `tick()`; `M.music.play('clock')` tick-tock music box (new `wood` voice).
### Changed
- Service worker cache `mellis-v19`.

## [1.20.0] — 2026-10-25
### Changed
- **Updates reach installed phones.** The service worker now serves pages and code (HTML/JS/CSS/manifest) network-first, revalidating with the server (`cache: 'no-cache'`), with the cache as fallback when offline or after a 3 s timeout; images and fonts stay cache-first. Precaching bypasses the HTTP cache (`cache: 'reload'`), so a new version never stores stale files.
- The app checks for a new version (`registration.update()`) every time it comes back to the screen. When a new version takes over, the hub reloads itself silently; games and Ràdio never reload mid-play and get the new code on the next page open.
- Service worker cache `mellis-v18`.
### Added
- Version stamp (`Mellis.VERSION`, e.g. `v1.20.0`) in small grey text at the bottom of the hub, to check which version a phone runs.
### Fixed
- Offline: folder URLs (`games/memory/`) fall back to their precached `index.html`.

## [1.19.1] — 2026-10-25
### Changed
- Ràdio Mellis: the show plays at 1.5× (pitch preserved) and each take's leading/trailing silence is trimmed (shorter 0.25 s gaps), so the show no longer drags. The giant and echo voices are gone; characters now use squeaky (normal / high / low) and robot (normal / fast / squeaky) variants. Saved shows re-render with the new voices. Service worker cache `mellis-v17`.

## [1.19.0] — 2026-10-25
### Added
- **Ràdio Mellis** (`games/radio/`, 📚 Llegim): family radio play on one device. 4 stories (El llop cuiner, La nau Mandarina, El misteri del pastís del zoo, La granja on ningú dormia), each 41 lines ≤ 15 words, ~380 words per language. Readers come from the passport family (1 … cast size); parts are handed out by a roulette, balanced by words. Hold-to-talk 🎙️ per line (one mic stream, a MediaRecorder per hold, 200 ms tail, holds under 400 ms ignored, ⬅️ to redo), live sound effects and a turn badge. The show decodes every take and renders it with an OfflineAudioContext (22 kHz mono) — chipmunk/giant via playbackRate, robot via ring modulation, echo via a feedback delay, synth jingle + sound effects — into one WAV, played with the speaking character on stage (⏸️/⏹️). Last 5 shows saved in IndexedDB (takes + parts) and re-rendered on replay; 📤 shares the WAV (download fallback); without a microphone the phone reads the show with a pitch per character.
- Passaport lector: accepts a pre-filled book (`mellis.passport.pending`) and opens the wizard at the rating step.
### Changed
- `CLAUDE.md`: Mellis-rule exception for creative / family activities. Service worker cache `mellis-v16`.

## [1.18.0] — 2026-10-25
### Added
- Passaport lector: 🎲 *En parlem?* on each book's page — a CSS 3D die bounces and spins (tick sounds), lands on a face (🦸 characters, ✏️ change the story, 💗 feelings & me; opposite faces share a kind) and pops out one of 6 questions of that kind, read aloud. No repeats within a kind until all have come up; 🎲 rolls again, 🔊 repeats. Everyone answers out loud.
### Changed
- Service worker cache `mellis-v15`.

## [1.17.0] — 2026-10-25
### Added
- Hub section **📚 Llegim** (games with `section: 'reading'` in `games.js`); *Contes en veu alta* moves there from 🎮 Jocs.
- **Passaport lector** (`games/passport/`): the family's passport for real books. Wizard: cover (camera photo resized to 300×400 JPEG, or emoji + colour) → title + language → who read it → each reader's face rating (🥱 😐 🙂 😃 🤩) → up to 3 stickers. Stamp animation + medals (first stamp, 5/10/20 books, family book, 3 languages, all the feelings). Book page with edit, delete (tap twice) and 📤 share: a 720×960 recommendation card via the Web Share API (download fallback). Editable family (emoji + name). Data and photos only in localStorage; if a photo doesn't fit, the book is saved with its emoji cover.
### Changed
- Service worker cache `mellis-v14`.

## [1.16.0] — 2026-10-22
### Added
- Aprenem **El meu poble** (`learn/town/`): a drawn map of the made-up *Poble Mellis* with 12 places. Lesson 1 *Places*: tap every building, then "where would you go if…?" (a walker strolls to the place) and odd-one-out by kind (shops, help, learn/play). Lesson 2 *Jobs*: meet 12 workers, walk each one to their workplace, "what do they work with?", "who works at…?". Album = the town map, which colours in as she learns places and jobs. Mellis rule as usual.
- Aprenem **Bons amics** (`learn/friends/`): 9 short stories with the Mellis and classmates (Nur, Jan, Laia, Biel, Aina, Pol) in 3 lessons — *Being a good friend*, *Is it fair?*, *When we get angry* — plus "How does … feel?" questions. No hearts: a wrong choice shows the consequence (the friend's mood + why) and she picks again; stars from first-try choices. Friendship-corner stickers.
### Changed
- `CLAUDE.md`: Mellis-rule exception for social-emotional stories. Service worker cache `mellis-v13`.

## [1.15.0] — 2026-10-22
### Added
- Aprenem: **Human body unit** (`learn/body/`), 4 lessons with explore → activities → odd-one-out check (Mellis rule) → stickers:
  1. *The five senses*: which sense for each action (smell stinky socks, taste a sour lemon…), then tap the right organ on a big drawn face.
  2. *Body & skeleton*: tap head, neck, trunk, arm, elbow, hand, leg, knee, foot on a drawn kid; build the skeleton top to bottom (skull, ribs, hip, leg bone, foot).
  3. *Food & digestion*: sort foods on the healthy plate (fruit & veg, bread/pasta/rice, meat/fish/eggs/beans, only sometimes), then the sandwich's journey (mouth → food pipe → stomach → intestines).
  4. *Healthy habits*: good habit or not, then order hand-washing and teeth-brushing steps.
- 📒 Sticker album grouped by lesson; tap a sticker to hear it again. The hub card is now live.
### Changed
- Service worker cache `mellis-v12` (precaches the body unit).

## [1.14.0] — 2026-10-22
### Added
- Animals unit, lessons 2–4: *What do they eat?* (feed each animal the right plate: plants / animals / everything, then build food chains in order), *How are they born?* (egg or mother's tummy, then order life cycles: frog, butterfly, chicken), *Where do they live and how do they move?* (send each animal to the sky, land or water of a scene, then pick how it moves and watch it walk/fly/swim/crawl/jump). Each ends with odd-one-out questions under the Mellis rule.
- Animal data: diet, birth, habitat and movement per animal (left out when it isn't clear-cut), CA/ES adjective agreement, food chains and life cycles (tadpole and chrysalis drawn as SVG).
- Album cards gain icons for each fact learned; tapping a card reads everything she knows about it.
### Changed
- `learn/animals/animals.js` is now a small lesson engine (explore → choose / order activities → check); cards store facts per field (old `g` migrates to `group`). Explanations overlay the animal so the answer buttons never move off small screens.
- Service worker cache `mellis-v11`.

## [1.13.0] — 2026-10-22
### Added
- New hub section **🎒 Aprenem**: school subjects as short lessons (explore → do → check with the Mellis rule → album cards). Catalogue `MELLIS_LEARN` in `games.js`; pages under `learn/<unit>/` (also counted as "played" for the NOU! sticker); news items can link with `path`.
- Animals unit (`learn/animals/`): lesson 1 *Vertebrates & invertebrates* — tap the 6 groups to hear what defines them, sort 8 animals (2 trick ones: whale, bat, penguin, shark, octopus…) into group houses with a spoken explanation, then 3 odd-one-out questions; 📒 album of 35 animal cards that later lessons will fill in. Lessons 2–4 shown as "Soon".
- Human body unit announced as "Soon" on the hub.
### Changed
- Hub: section titles 🎮 Jocs / 🎒 Aprenem. Service worker cache `mellis-v10` (precaches the animals unit).

## [1.12.1] — 2026-10-22
### Changed
- README: "Ideas & references" section (Marble curriculum); `CLAUDE.md` points to it when brainstorming new games.

## [1.12.0] — 2026-10-22
### Added
- Detective: case levels unlocked by rank — Easy (today's case), Medium after 3 solved cases (8 suspects; bag, shoe colour, ear shape and carried item; mirror-writing or symbol key with decoys; 4–5 clues shown as chips on a cork board), Hard after 6 (+ alibis on a 4-room map: tap a suspect to hear where they were, the room shows on the card; letter-shift code with an alphabet strip; 5 clues).
- Detective: Agent Mussol, a sleepy owl boss who briefs every case and wakes up shocked at the end; talking suspects (tap → own excuse and voice pitch, then ✖️ to cross out or ↩️); arrest scene with a net, the thief's confession and the item given back.
- Detective: 🚔 gallery of the last 60 caught thieves ("CAUGHT" stamp, 👑 for ⭐⭐⭐); tap one to hear the confession.
- Detective plays the soft swing loop (🎵 in the lobby and next to the hearts). `speak()` accepts `opts.pitch`.
### Changed
- Detective restyled as a noir office (dark wall, desk-lamp glow, rainy window, cork board).
- Service worker cache `mellis-v9`.

## [1.11.0] — 2026-10-22
### Added
- Shared background music (`Mellis.music`): synthesized WebAudio loops (spooky music-box waltz, soft swing jazz), quiet, ducks while a voice speaks, its own 🎵 on/off (`mellis.music`), silenced by 🔇 and when the tab is hidden. `speak()` accepts `opts.rate`. Monster Lab plays the spooky waltz (detective jazz comes with the detective update).
- Monster Lab: harder levels. Easy = the old Hard (🎨 👀 🎩 👄); Medium adds spots/stripes in a second colour, 2/4/6 arms, tail or bat wings and big/small, with orders naming 5–6 random parts (the rest are free); Hard adds "NO …" parts (✖️ option to remove them); new Expert level is listen-only (no text, no 💡, slower voice, off when muted or the device has no English voice).
- Monster Lab: Doctora Bombolles, a mad scientist who greets every order and reacts when the monster comes alive (never on mistakes); monsters show off their parts (wings flap and fly, tails wag, arms wave, teeth chomp, big ones stomp, small ones hop).
- Monster Lab: 📒 album of the last 60 monsters (👑 for ⭐⭐⭐ parties); tap one to hear it described in English.
### Changed
- Monster Lab: part tabs instead of one row per part (fits any phone); the 2nd-miss reveal marks the wrong tabs. Play screen restyled as a lab (tiled wall, bench, bubbling flasks, clipboard order).
- Service worker cache `mellis-v8`.

## [1.10.3] — 2026-10-17
### Changed
- `CLAUDE.md`: new "Small phones" rule for every current and future game (test at 320×568 and 390×844, main action always on screen, `.stick-bottom`, no scroll lock, scrollable overlays).

## [1.10.2] — 2026-10-17
### Fixed
- Continue buttons stay in reach on short phones: shared `.stick-bottom` (sticky to the bottom of the screen) on the Puppet Show ➡️ (builder, *All about me*), ▶️ *Watch the show*, the detective 🕵️/🔎 buttons and the hub news 👍.
- Puppet Show name step: ➡️ sits beside the typed name so it never covers the keyboard; compact keyboard, answer grids, stage and finale on short screens (`max-height: 700px`) so 🎙️ and the answers stay on screen.
- Level pickers (Memory, Potions, Monsters): compact cards on phones so every level is visible without scrolling.
- Detective: suspects grid leaves room for the 3rd clue on short screens; clue pop-up and win overlays scroll when taller than the screen.
- Stories: 2 books per row on 320 px phones; tighter reading page on short screens so 🎙️ is under the text.
- Hub news pop-up no longer overflows 320 px phones; smaller top-bar buttons under 370 px wide.
- Service worker cache `mellis-v7`.

## [1.10.1] — 2026-10-17
### Fixed
- Game pages could not scroll vertically on small phones (`body { overflow: hidden }` in `shared/game.css`), so e.g. the Puppet Show builder's ➡️ button was unreachable. Now only horizontal overflow is hidden.
- Service worker cache `mellis-v6`.

## [1.10.0] — 2026-10-17
### Added
- Puppet Show finale is much sillier:
  - Voice-driven body motion during playback (bounce, sway, squash, arms waving) and a little wiggle while recording.
  - Her recording plays back as a squeaky "puppet voice" (`playbackRate` 1.3, pitch not preserved).
  - A random dance move between lines (hop, wiggle, twirl, squash).
  - A random surprise ending, never the same twice in a row: bow (hair/accessory fly off), giant sneeze + confetti, dizzy triple spin, burp 💨, jump out of the stage.
  - Audience row that bounces along and cheers; flowers thrown onto the stage.
- `art.js`: animatable arms (`.arm-l/.arm-r`), hair/accessory groups, `dizzy` face.

## [1.9.0] — 2026-10-17
### Added
- `CHANGELOG.md` (this file) and `news.js`: kid-facing news, shown on the hub's 🎁 button with an unread counter; the twins read the news aloud.
- "NOU!" sticker on hub cards of new games until the game is played once (`mellis.played`, recorded by `shared/app.js` on every game page).
- News tracking per device: `mellis.news.seen` (last news id seen). First visit shows nothing; devices with earlier progress see the latest 3 items.

## [1.8.0] — 2026-10-17
### Added
- 🎭 **Puppet Show** (`games/puppets/`), English from the school's *Back to School* unit: paper-bag puppet builder, *All about me* profile (one per twin, up to 4, accented name keyboard), 6 stage scenes (feelings, weather, seasons, school things, numbers to 20) and a read-aloud finale where the puppet lip-syncs to her recording (`MediaElementSource` → analyser).
### Changed
- `Mellis.speak(text, lang, { onstart, onend })`: optional callbacks; `onend` always fires once (muted, no voice, engine never reports end).

## [1.7.0] — 2026-10-17
### Added
- **The Mellis rule** (`Mellis.round()`, `Mellis.starsHTML()`): 3 hearts, wrong answer = 💔 + "oh oh" + 2 s pause, no hints, reveal on 2nd miss of the same question, hearts left = stars, ⭐⭐⭐ = golden reward, 0 hearts = round restarts with new questions. Applied to Potions, Monsters, Detective and the Stories quiz; Memory gets mismatch-based stars. Documented in `CLAUDE.md`.
- Golden rewards: golden creatures, 🥇 detective badges, golden books, crowned monster party.
### Changed
- Monster Lab only shows the wrong rows after the 2nd failed attempt.
- Service worker cache `mellis-v2`.

## [1.6.0] — 2026-10-13
### Added
- Installable PWA: `manifest.webmanifest`, icons (any + maskable, apple-touch-icon), offline `sw.js` (precache + stale-while-revalidate, Google Fonts cached at runtime), "Install the lab" button on Chrome/Android.

## [1.5.1] — 2026-10-12
### Fixed
- Hub speech-bubble tail misaligned; redrawn as a seamless outlined diamond.

## [1.5.0] — 2026-10-12
### Added
- Hub: tappable twins with 8 funny expressions, jumps and sounds; speech bubble with random welcomes, jokes and fun facts read aloud; secret party after 7 quick taps. `Mellis.playfulMascots()`.

## [1.4.0] — 2026-10-12
### Added
- 📖 **Read-aloud Stories** (`games/reading/`): 6 funny branching stories (short/long) in CA/ES/EN, mic voice meter with recording and playback, comprehension question, bookshelf.

## [1.3.0] — 2026-10-12
### Added
- 🕵️ **Detective Agency** (`games/detective/`): cases with footprint → secret code → clue-gated suspect elimination → fingerprint proof; ranks and badges.
- Per-language TTS voices with `Mellis.canSpeak()`; iOS speech unlock on first tap.

## [1.2.0] — 2026-10-12
### Added
- 🎃 **Monster Lab** (`games/monsters/`): Halloween English, build the monster from a spoken order (colours, numbers, body parts).
- `Mellis.speak()` text-to-speech helper.

## [1.1.0] — 2026-10-12
### Added
- 🧪 **Potion Lab** (`games/potions/`): addition and subtraction up to 100 in 3 levels, collectible creatures.
### Changed
- Both twin mascots are girls (pink and purple goggles).

## [1.0.0] — 2026-10-12
### Added
- Hub with CA/ES/EN flags, sound + mute, twin mascots, game catalogue (`games.js`).
- 🗓️ **Memory dels mesos** (`games/memory/`): months and seasons, picture ↔ word in mixed languages.
- GitHub Pages hosting.
