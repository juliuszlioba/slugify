# Slugify

A small, single-page tool that turns any text into a clean, URL-friendly slug.

```
Hällo Wörld & Ąžuolas!  →  haello-woerld-and-azuolas
```

Type or paste text, and the slug updates as you type. Press **Enter** to copy it or **Esc** to clear.

## Stack

- [Astro 7](https://docs.astro.build): a static site with one page, no server needed
- [Tailwind CSS v4](https://tailwindcss.com), set up through the `@tailwindcss/vite` plugin rather than the old `@astrojs/tailwind` integration
- [Noto Sans](https://fontsource.org/fonts/noto-sans), served locally via Fontsource
- [pnpm](https://pnpm.io), with Node `>=22.23.4`

## Project structure

```text
src/
├── pages/index.astro          # Page shell: dark theme, centered layout
├── components/Slugify.astro   # Input → output UI, copy/clear, keyboard shortcuts
├── utils/slugify.ts           # The slug function (pure, no DOM)
└── styles/global.css          # Tailwind import + theme tokens
```

## Slug rules

`slugify()` in `src/utils/slugify.ts` is where the real logic lives. Its rules, in order:

1. **Normalize:** composes the text first (NFC), so `a` + a separate accent mark behaves the same as `ä`. This matters for text pasted from macOS or PDFs.
2. **Lowercase.**
3. **Special letters:** looks up letters that have no plain base letter in the `SPECIAL_CHARS` table:
   - German letters are spelled out: `ä → ae`, `ö → oe`, `ü → ue`, `ß → ss`
   - `æ → ae`, `œ → oe`, `ø → o`, `ł → l`, `đ/ð → d`, `þ → th`, `ı → i`
   - `& → and`
4. **Strip accents:** removes every other Latin accent (`ą → a`, `ž → z`, `ő → o`, …).
5. **Apostrophes:** drops them (`don’t → dont`).
6. **Separators:** turns any other run of characters (spaces, punctuation, symbols) into a single `-`, then trims dashes from both ends.

| Input | Output |
|---|---|
| `Hällo Wörld` | `haello-woerld` |
| `Œuvre Ærø` | `oeuvre-aero` |
| `v1.2 release` | `v1-2-release` |
| `C++ & Rust` | `c-and-rust` |
| `50% off!` | `50-off` |

**Known limitation:** non-Latin scripts (Cyrillic, Greek, CJK, …) aren't transliterated, so they produce an empty slug.

To change how a character is handled, edit `SPECIAL_CHARS`. Everything else is handled generically.

## Design

The UI is deliberately minimal, built on a dark neutral palette:

- The page background is `gray-950`, where `gray` is mapped to Tailwind's `neutral` palette in `global.css`.
- Input and output sit one above the other in a single centered column (`max-w-2xl`).
- Green is the only accent color, and it appears only to confirm a copy.
- The empty and copied states use `data-empty` and `data-copied` attributes, styled with Tailwind's `data-*:` variants.

Keep new UI within this palette and layout so the page stays clean.

## Development

```sh
pnpm install
pnpm astro dev --background   # start dev server at http://localhost:4321
pnpm astro dev status         # check it / astro dev logs / astro dev stop
pnpm build                    # static output in ./dist
pnpm preview                  # serve the build locally
```

The build output is fully static, so `dist/` can be deployed to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, …).
