# feasty extension

cute calorie + fitness tracker living in your browser. chrome mv3, react, ts.

## dev

```bash
npm install
npm run dev
```

then go to `chrome://extensions`, enable developer mode, "load unpacked", point at `dist/`.

## build

```bash
npm run build
```

zips the extension into `dist/`. drag and drop into chrome to install.

## surfaces

- **popup** — quick add + today summary
- **side panel** — full dashboard
- **new tab** — overview, streak, water
- **options** — profile, goals, reminders

## backend

points at `http://localhost:3001` by default. set `VITE_API_URL` to override.
