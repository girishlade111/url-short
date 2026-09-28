# url-short

A clean, fast URL shortener web app. Paste a long URL, get a short link in seconds — with a copy button, share actions, and a session history of every link you shortened.

Built by Girish Lade — https://ladestack.in

## What it does

- **Shorten URLs** — paste any `http(s)://` link and shorten it via the [TinyURL API](https://tinyurl.com/api).
- **One-click copy** — copy the shortened link to your clipboard instantly.
- **Open in new tab** — verify the short link works right from the app.
- **Session history** — every shortened link is kept in a list with its original URL and timestamp.
- **Validation** — malformed URLs are rejected with a toast warning before any API call.
- **Dark / light mode** — theme toggle with `next-themes`.
- **Responsive** — works on mobile, tablet, and desktop.

## Tech stack

- [Vite](https://vitejs.dev/) 5 + [React](https://react.dev/) 18 + [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) + [Tailwind CSS](https://tailwindcss.com/) 3
- [TinyURL API](https://tinyurl.com/api) for the actual shortening (`api.tinyurl.com/create`)
- [lucide-react](https://lucide.dev/) icons, shadcn toast for notifications
- ESLint 9, PostCSS, SWC compiler (`@vitejs/plugin-react-swc`)

## Quick start

Requires Node.js 18+ and npm.

```sh
# 1. Clone
git clone https://github.com/girishlade111/url-short.git
cd url-short

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
# → http://localhost:8080
```

Production build:

```sh
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

Lint:

```sh
npm run lint
```

## Configuration

The TinyURL API key is currently hardcoded in `src/components/URLShortener.tsx`:

```ts
const TINYURL_API_KEY = "your-key-here";
```

For local use, replace it with your own key from [tinyurl.com/api](https://tinyurl.com/api). For a real deployment, move it into a serverless function or proxy — never ship a private API key to the browser in production.

## Project structure

```
url-short/
├── index.html                 # Entry HTML
├── vite.config.ts             # Vite config (@ alias, SWC plugin)
├── tailwind.config.ts         # Tailwind theme
├── components.json            # shadcn/ui config
├── src/
│   ├── main.tsx               # React entry
│   ├── App.tsx                # App shell + theme provider
│   ├── App.css
│   ├── index.css              # Tailwind + custom styles
│   ├── components/
│   │   ├── URLShortener.tsx   # Core: form, TinyURL API call, history list
│   │   ├── ThemeToggle.tsx    # Dark/light toggle
│   │   └── ui/                # shadcn/ui components (button, card, input, toast…)
│   ├── hooks/                 # use-toast, use-mobile
│   └── lib/                   # utils
└── public/                    # favicon, robots.txt, placeholder.svg
```

## How it works

1. User pastes a URL → validated with the `URL` constructor (must include `http://` or `https://`).
2. `POST https://api.tinyurl.com/create` with the key as a Bearer token, requesting a `tinyurl.com` domain link.
3. Response's `tiny_url` is prepended to the in-memory history with a timestamp; the input is cleared.
4. Copy/open buttons are per-item. History is in-memory only — it resets on page reload.

## Deployment notes

- **Static only** — no backend; the production `dist/` folder can be served from any static host.
- GitHub Pages deploy: `npm run build` with `--base=/url-short/` so assets resolve under the repo subpath.
- When deploying to a custom root domain or Vercel, build with the default `/` base.

## Live demo

https://girishlade111.github.io/url-short/

## Roadmap ideas

- Persist history to `localStorage`
- Custom aliases (`tinyurl.com/my-brand`)
- QR code generation per link
- Click-analytics dashboard

---

Built by Girish Lade — https://ladestack.in
