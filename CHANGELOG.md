# Changelog

All notable changes to Laboratorio Mellis. Format: [Keep a Changelog](https://keepachangelog.com/), versions: [SemVer](https://semver.org/) — new game or feature = minor, fix = patch.

The kid-friendly version of this list lives in `news.js` (shown on the hub's 🎁 button).

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
