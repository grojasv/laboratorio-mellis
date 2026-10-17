# Laboratorio Mellis — project rules

Learning games for 7-year-old twin girls ("les Mellis"). Plain HTML/CSS/JS, no build step, GitHub Pages under `/laboratorio-mellis/` (relative paths only). See README for structure.

## The Mellis rule (every interactive game, current and future)

Guessing must never pay. Use the shared `Mellis.round()` from `shared/app.js`; don't re-implement it per game.

1. **3 hearts per round** (`round.start()`, hearts shown via `heartsEl`).
2. **Wrong answer** → `round.wrong(key)`: a heart breaks 💔, funny "oh oh!" (sound + voice), everything pauses 2 s. **No hints.**
3. **2nd miss on the same question** (same `key`) → `{ reveal: true }`: the game shows the right answer (or, for build-type games, *which part* is wrong) and moves on. Never reveal on the 1st miss.
4. **Hearts left = stars** (`round.stars()`, render with `Mellis.starsHTML(n)`). **⭐⭐⭐ = golden reward** (golden creature / 🥇 badge / golden book / crowned monsters…).
5. **0 hearts** → silly-sad twins + "Oh, oh! No queden cors!" → the **whole round restarts with new questions** (`onOut`), never the same ones.
6. Exception — **Memory-style games** (exploring is the mechanic): no hearts, stars from the number of mismatches.

## Small phones (every screen, current and future)

She must never need to know she has to scroll to continue.

1. **Test every flow at 320×568 and 390×844** (start → each step → win/overlays), not just the first screen.
2. **Main action always on screen**: the continue / ➡️ / ▶️ button, the 🎙️ and the answer options must be visible without scrolling. Prefer compact layouts on short screens (`@media (max-height: 700–760px)`) over relying on scroll.
3. If a screen can be taller than the phone (pickers, long lists), give its continue button `class="stick-bottom"` (shared, sticky to the bottom). Never let a floating button cover something she must tap (e.g. a keyboard) — put the button beside it instead (see the puppet name step).
4. Never lock page scroll (`overflow: hidden` on `body`); only `overflow-x`. Overlays/pop-ups (`position: fixed`) must scroll inside when taller than the screen (`display: flex; overflow-y: auto` + `margin: auto` on the box).
5. No horizontal overflow at 320 px (grids use `minmax(min(100%, Npx), 1fr)` with N small enough for 2 columns).

## Changelogs (update on every change, in the same commit)
- **`CHANGELOG.md`** — technical, Keep a Changelog + SemVer (new game/feature = minor, fix = patch). Add a new version section at the top.
- **`news.js`** — kid-facing news for the hub's 🎁: only changes the girls would notice, a few words, emoji + CA/ES/EN, `id` always increasing, `type: 'game'` + `game: '<id>'` for new games (adds the "NOU!" card sticker until played). Pure technical changes don't go here.
- Add `news.js`/new files to `PRECACHE` and bump `CACHE` in `sw.js` when needed.

## Other conventions
- Languages CA / ES / EN everywhere (`Mellis.t({ca, es, en})`); Catalan forms are feminine where they refer to the girls.
- Touch-first: big targets, no keyboard, works at 375 px wide.
- New game: folder `games/<id>/`, entry in `games.js`, files added to `PRECACHE` in `sw.js` (bump `CACHE`).
- Commits use the GitHub noreply email (repo-local git config), never a work address.
