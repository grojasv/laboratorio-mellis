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

### Adding a game

1. Create `games/<id>/index.html`. Copy an existing game for the top bar and the shared scripts.
2. Add an entry to `games.js`.
3. Use only relative paths. Pages are served under `/laboratorio-mellis/`.

### Run locally

```bash
python3 -m http.server 8000 --directory ..
```

Then open http://localhost:8000/laboratorio-mellis/.
