# Personal Link Hub

A single-page, config-driven portfolio / link-hub. One URL, every professional link.

Built with **vanilla HTML + CSS + JavaScript** — no build step, no dependencies, no backend.

```
/
├── index.html      ← page shell + SVG icon sprite (you never edit this)
├── style.css       ← all styling & both themes (you never edit this)
├── script.js       ← renders the page from config.js (you never edit this)
├── config.js       ← ★ THE ONLY FILE YOU EDIT ★
├── assets/
│   ├── profile.jpeg ← profile photo
│   └── resume.pdf  ← drop your CV here (optional)
└── README.md
```

---

## Run it locally

Any static server works:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>. Opening `index.html` by double-clicking also works.

---

## Customize — everything happens in `config.js`

Open `config.js` and replace the placeholder values. The page rebuilds itself on
reload; **no HTML or CSS changes are ever required.**

| What to change        | Where in `config.js`                          | Example value                                  |
| --------------------- | --------------------------------------------- | ---------------------------------------------- |
| **Name**              | `name`                                        | `'Aarav Sharma'`                               |
| **Professional title**| `title`                                       | `'AI/ML Engineer \| Python Developer'`         |
| **Bio / tagline**      | `bio`                                         | `'Building intelligent solutions with AI.'`    |
| **Location**          | `location` (set `''` to hide)                  | `'Bengaluru, India'`                           |
| **Profile photo**     | save file as `assets/profile.jpeg`              | square, 600×600 px or larger                   |
| **Resume PDF**        | save file as `assets/resume.pdf`               | opens in a new tab (`action: 'open'`)          |
| **LinkedIn URL**      | `cards[]` id `linkedin` → `href` **and** `socials[]` LinkedIn `href` | `'https://www.linkedin.com/in/your-handle'` |
| **GitHub URL**        | `cards[]` id `github` → `href` **and** `socials[]` GitHub `href`     | `'https://github.com/your-username'`          |
| **Kaggle URL**        | `cards[]` id `kaggle` → `href` **and** `socials[]` Kaggle `href`     | `'https://www.kaggle.com/your-username'`      |
| **Email**             | `email` (top level)                            | `'you@gmail.com'` — powers the Email card + mail icon |
| **WhatsApp number**   | `whatsapp` (top level)                         | `'+91 98765 43210'` → becomes `https://wa.me/919876543210` |
| **Portfolio URL**     | `cards[]` id `portfolio` → `href`              | `'https://your-site.dev'`                      |
| **Instagram / X / YouTube** | `socials[]` → `href`                     | leave `''` and the icon is hidden automatically |
| **Availability badge**| `availability.show` / `availability.text`      | `false` hides it                               |
| **Default theme**     | `theme.default`                                | `'dark'` or `'light'`                          |
| **Page title / SEO**  | `seo.title`, `seo.description`, `seo.url`, `seo.ogImage` | your domain & share image           |

### Rules the page follows automatically

* **Unfilled links never break.** Any value still containing a placeholder
  (`YOUR-…`, `your@…`, `+1234567890`, `example.com`) renders as a dimmed,
  non-clickable "Not set — add it in config.js" card instead of a dead link.
* **Empty social icons disappear.** Set a `socials[]` `href` to `''` and that
  icon is simply not rendered.
* **Missing photo is fine.** If `assets/profile.jpeg` does not exist, a gradient
  monogram built from your initials is shown instead — and the browser-tab
  favicon updates to the same monogram.
* **Resume behaviour.** `action: 'open'` (default) opens the PDF in a new tab;
  change to `action: 'download'` to force a file download.
* **Adding a card** = adding one object to `cards[]`. Reorder the array to
  reorder the page. Optional fields: `tone` (`rose|sky|slate|blue|amber|green|
  violet|pink|teal`), `icon` (any id in the sprite inside `index.html`),
  `wide: true` to span both columns on desktop.

---

## Features

* **Dark / light mode** toggle, persisted in `localStorage`, respects
  `prefers-color-scheme` on first visit, no flash-of-wrong-theme on reload.
* **Fully responsive** — single column on phones (cards nearly full-width),
  two-column card grid from 720 px up.
* **Glassmorphism cards** with hover lift, sheen sweep, icon tilt and press
  feedback; all animations disabled under `prefers-reduced-motion`.
* **Accessible** — semantic landmarks, skip link, visible focus rings,
  `aria-label`s on icon-only controls, screen-reader text for the footer heart.
* **SEO ready** — title, meta description, canonical, Open Graph and Twitter
  cards, all generated from `config.js > seo`.
* **Zero network dependencies** except the Inter webfont (falls back to the
  system font stack if offline).

---

## Security notes

* There is **no backend and no admin panel**, therefore nothing to leak.
  All content lives in `config.js`, which is meant to be public.
* **Never** put passwords, API keys, tokens or database credentials in
  `config.js`, `script.js` or anywhere in this folder — everything here ships
  to the browser and is readable by anyone.
* If you later add an admin panel, keep authentication server-side, read
  secrets from environment variables, and store only password hashes.

---

## Deploy

The site is fully static. Push the folder to GitHub Pages, Netlify, Vercel,
Cloudflare Pages, or any web host — no configuration needed. Remember to set
`seo.url` to your real domain so canonical / Open Graph links are correct.
