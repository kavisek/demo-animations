# demo-animations

A [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com) playground for building web animation demos. The app lives in [`frontend_tailwind/`](frontend_tailwind/).

It's laid out like a cloud console: pick a project from the header, browse its demos in the sidebar, or search across every project. There are four projects:

| Project | URL | What's in it |
| --- | --- | --- |
| **Web Applications** | `/web` | Motion basics (fades, slides, bounce, spinners, pulse, wave, 3D flips, orbit, typewriter, gradients) and tables & data (row add/remove, animated sorting, live cells, an Excel-style spreadsheet, expandable rows, skeleton loading, data bars and heatmaps, filtering). |
| **iOS Animations** | `/ios` | Everyday iOS workflows inside a phone frame: Dynamic Island, notification banners, app launch and jiggle mode, alerts and action sheets, push navigation, a draggable bottom sheet, swipe actions, pull to refresh, switches and controls, and chat bubbles. |
| **Data Visualizations** | `/charts` | Animated charts with tooltips and table views: morphing columns, stacked ↔ grouped bars, a bar chart race, line draw with crosshair, a live streaming line, a donut sweep, scatter transitions, and KPI tiles with gauges. |
| **Video** | `/video` | Video-platform UI around a real sample video: a custom player with frame previews and double-click skip, chapters and captions, a mini player, an autoplay countdown, hover-preview cards, filter chips, a vertical clip feed, like and subscribe, and live chat. |

![The Scatter transitions demo: points drop into place, glide when the x-axis switches from latency to cost and back, fade out when the Mobile group is filtered from the legend, and show a tooltip on hover](docs/images/chart-scatter.gif)

Every demo page has a **Code** button that shows the demo's rendered HTML and the exact CSS it uses, with buttons to copy either one or download a standalone `.html` file.

## Stack

### Tools you run

| Tool | Version | Used for |
| --- | --- | --- |
| [Docker](https://docs.docker.com/get-docker/) | Any recent version with Compose v2 (`docker compose`) | Running the dev server (`compose.yaml`) and building the production image |
| [GNU Make](https://www.gnu.org/software/make/) | 3.81 or later (ships with macOS) | The `make start`, `make stop`, and other shortcuts in the [`Makefile`](Makefile) |
| [curl](https://curl.se/) | Any (ships with macOS and most Linux distributions) | Downloading the sample video in `make start` / `make fetch-video` |
| [Node.js](https://nodejs.org/) | 26 in the Docker images (`node:26-alpine`); 20.9 or later if you run without Docker | Running Next.js and npm |
| npm | Bundled with Node.js | Installing dependencies from `package-lock.json` |

Every demo animates with CSS: Tailwind utilities, CSS keyframes, and transitions. There's no animation library. JavaScript is only used for state and gestures, such as dragging a sheet or sorting a table.

### Packages

Versions are pinned in [`frontend_tailwind/package-lock.json`](frontend_tailwind/package-lock.json).

| Package | Version | Role |
| --- | --- | --- |
| [`next`](https://nextjs.org/) | 16.4.6 | React framework: App Router, static generation of every demo page, and Turbopack for `next dev` and `next build` |
| [`react`](https://react.dev/), `react-dom` | 19.3.1 | UI library |
| [`tailwindcss`](https://tailwindcss.com/) | 4.3.5 | Utility CSS. The theme, keyframes, and easing curves live in [`globals.css`](frontend_tailwind/src/app/globals.css) under `@theme` |
| `@tailwindcss/postcss` | 4.3.5 | Tailwind's PostCSS plugin ([`postcss.config.mjs`](frontend_tailwind/postcss.config.mjs)) |
| `postcss` | 8.5 | CSS processing pipeline that runs Tailwind |
| [`eslint`](https://eslint.org/) | 10.15 | Linting with `npm run lint`, using the flat config in [`eslint.config.mjs`](frontend_tailwind/eslint.config.mjs) |
| `eslint-config-next` | 16.4.6 | Next.js, React, React hooks, and accessibility lint rules |

The Geist and Geist Mono fonts are bundled in the repo (`src/app/fonts/`) and loaded with `next/font`, so the app doesn't depend on an external font service.

### Sample video

The Video project plays a real video file, which is **not committed** to this repo. `make start` downloads it on first run (about 4.4 MB) into `frontend_tailwind/public/videos/sample.mp4`, which is gitignored. Later runs skip the download because the file already exists.

| | |
| --- | --- |
| File | The [Sintel](https://durian.blender.org/) trailer, 480p H.264, 52 seconds |
| Source | <https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4> |
| License | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), © Blender Foundation. The app shows this credit under each video demo. |

If the file is missing, for example in CI, the Video demos show a "Sample video not downloaded" message instead of the video, and everything else still works.

### CI and automation

| Tool | Version | Used for |
| --- | --- | --- |
| GitHub Actions: `actions/checkout`, `actions/setup-node` | v7, v7 | [`ci.yml`](.github/workflows/ci.yml) runs `npm ci`, `npm run lint`, and `npm run build` on Node.js 22, and builds the production Docker image, for every pull request and push to `main` |
| Dependabot | — | [`dependabot.yml`](.github/dependabot.yml) opens weekly update PRs for npm packages, the Docker base image, and GitHub Actions |

## Quick start

You need [Docker](https://docs.docker.com/get-docker/) with Compose v2.

```sh
git clone https://github.com/kavisek/demo-animations.git
cd demo-animations
make start
```

Open <http://localhost:3000>. The source folder is mounted into the container, so edits under `frontend_tailwind/` hot-reload in the browser.

| Command | What it does |
| --- | --- |
| `make start` | Download the sample video if it's missing, then build the dev image and start the app in the background |
| `make fetch-video` | Only download the sample video (skipped if it already exists) |
| `make stop` | Stop and remove the dev container |
| `make logs` | Follow the dev server's output |
| `make attach` | Open a shell in the running dev container |
| `make build-prod` | Build the production image (`next build`, served with `next start`) |
| `make run-prod` | Build and run the production image on <http://localhost:3000> |

If you add a dependency, run `make start` again so the image installs it.

### Without Docker

You need Node.js 20.9 or later. The Docker images use Node.js 26.

```sh
make fetch-video   # optional: the sample video for the Video project
cd frontend_tailwind
npm ci
npm run dev
```

## Project layout

```text
.
├── compose.yaml          # dev environment with hot reloading
├── Dockerfile.dev        # dev image (next dev)
├── Dockerfile            # production image (next build + next start)
├── Makefile
└── frontend_tailwind/    # Next.js app (App Router, Tailwind CSS)
    └── src/app/
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Report security issues privately as described in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
