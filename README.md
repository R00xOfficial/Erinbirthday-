# Erin's birthday scrapbook 💌

A single-page, mobile-first scrapbook: an envelope opening, a little photo story,
four mini-games (sliding puzzle, memory match, hidden hearts, relationship quiz),
a tappable photo collage and a final letter.

Built with React + Vite, plain CSS, no backend.

## Personalise it (≈20 min)

1. **Photos** – drop JPEG/WebP files into `public/photos/`. The `.svg` files
   there are placeholders; each one says which file it's standing in for.
   - `puzzle` should be **square**, with a clear subject that's recognisable in 9 tiles.
   - Matching-card photos should be square and visually distinct from each other.
   - Keep photos reasonably sized (~1200px on the long edge is plenty).
2. **Words** – edit `src/content/birthdayContent.js`. Every caption, memory,
   quiz question, hidden-heart note and the final letter live there. Update
   the `src` paths if you change file names/extensions.
3. If you move the hidden hearts (`x`/`y` are % of the garden), re-test them on a phone.

> Anything in `src/content` or `public/` is visible to anyone with the link.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173 (add --host to open it on your phone)
npm run build      # static files in docs/
npm run preview    # serve the production build
```

## Deploy

- **GitHub Pages (current setup):** the built site is committed in `docs/`.
  In the repo settings → Pages choose "Deploy from a branch", pick this
  branch and the `/docs` folder. Run `npm run build` and commit `docs/`
  after every change. (Alternatively set the source to "GitHub Actions";
  pushing to `main` runs `.github/workflows/deploy.yml`.)
- **Cloudflare Pages:** build command `npm run build`, output directory `docs`.

The build uses relative paths, so it works from a sub-path or a domain root.

## Notes

- Progress (games finished, envelope opened…) is saved in `localStorage`; the
  site works fine if storage is blocked. "start over" in the footer resets it.
  Change `storageKey` in the content file to reset everyone's saved progress.
- Nothing is locked: she can scroll straight to the scrapbook and letter.
- The puzzle is scrambled using only legal moves, so it is always solvable;
  after 25 moves a "Finish it for me" button appears.
- Respects `prefers-reduced-motion`.
- `node scripts/make-placeholders.mjs` regenerates the placeholder images.

## Before you send the link

Test on a real iPhone: open the envelope, solve each game, open/close a photo,
open the final letter, refresh to check progress, and try a private tab.
