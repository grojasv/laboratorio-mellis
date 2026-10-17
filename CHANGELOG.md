# Changelog

All notable changes to Laboratorio Mellis. Format: [Keep a Changelog](https://keepachangelog.com/), versions: [SemVer](https://semver.org/) — new game or feature = minor, fix = patch.

The kid-friendly version of this list lives in `news.js` (shown on the hub's 🎁 button).

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
