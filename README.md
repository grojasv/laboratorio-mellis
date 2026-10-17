# Laboratorio Mellis 🧪

Simple learning games for 7-year-olds, in Catalan, Spanish and English. Built for phones and tablets, and hosted on GitHub Pages.

**Play:** https://grojasv.github.io/laboratorio-mellis/

## Games

| Game | What it practises |
|---|---|
| 🗓️ Memory dels mesos | Months and seasons: match a picture with a word in a mix of CA/ES/EN |
| 🧪 Laboratori de pocions | Adding and subtracting up to 100 (3 levels), with a collection of creatures |
| 🎃 Laboratori de monstres | Halloween English: build the monster you hear (colours, numbers, body parts). Spoken with text-to-speech, plus a 💡 translation hint |
| 🕵️ Agència de detectives | Cases in 4 steps: footprint → secret code (symbols or A=1) → rule out suspects with clues (logic, reading "NOT") → fingerprint match. Earns badges and detective ranks |
| 📖 Contes en veu alta | Funny branching stories to read **out loud** (short/long). A voice meter fills while she reads, she can play back her own voice, and a question at the end adds the book to her shelf. Stories live in `games/reading/stories.js` |

## Game rules

Every interactive game follows **the Mellis rule** (see `CLAUDE.md`): 3 hearts ❤️❤️❤️, a wrong answer = 💔 + "oh oh!" + a 2-second pause, no hints, the 2nd miss on a question reveals the answer, hearts left = stars, ⭐⭐⭐ = golden reward, 0 hearts = the round restarts with new questions. Memory uses stars only.

## Structure

Plain HTML/CSS/JS, with no build step.

```
index.html          hub
games.js            game catalogue shown on the hub
shared/app.js       language, sounds, mascots, confetti (window.Mellis)
shared/styles.css   colours, flags, mascots
shared/game.css     top bar, level picker, win screen for game pages
games/<id>/         one folder per game
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
