# Calorie Tracker (Feasty)

a calorie + workout tracker i've been building. you log what you eat, your water, weight, and workouts, and it shows you a kcal ring, macros, streaks, etc.

started this as a chrome extension but it didnt really make sense as one (you dont need calorie tracking glued to your tab bar), so i moved it to a normal website.

backend repo is here, you need it running for anything to work:
https://github.com/leviathanxdofficial-source/Feasty-backend

stack is react + vite + typescript + tailwind. routing with react-router. radix for the components i didnt want to rewrite.

## running locally

```
npm install --legacy-peer-deps
npm run dev
```

then go to http://127.0.0.1:5173

the legacy-peer-deps thing is because recharts has old react peer ranges. wasnt worth fixing.

if the backend isnt running you'll get connection refused on every api call. start that first.

## pages

- `/` the dashboard, this is where most of the app lives. tabs for diary, exercise, weight, recipes, settings, badges
- `/overview` a wider summary view, same data just spread out more
- `/quick-add` small card for logging one food fast
- `/settings` profile, goals, reminders, custom foods

most stuff is under `/`. the others exist because i originally had separate extension surfaces and i kept them as routes when i ported.

## env

only one var and its optional:

```
VITE_API_URL=http://localhost:3001/api
```

defaults to that anyway. only set it if your backend is somewhere else.

## build

```
npm run build
```

emits to `dist/`. for hosting on vercel/netlify/whatever, make sure unknown routes fall back to `index.html` or refreshing `/settings` will 404. its a normal SPA fallback rule.

## known issues / todo

- custom food form only takes kcal, not protein/carbs/fat. need to add fields
- if you backfill a weight for a past date it overwrites `currentWeightKg` to that old number which is wrong
- popup page is kinda pointless now since its just a route, might just delete it
- no offline mode yet
- the food search is just a regex against the db, nothing fancy like usda or openfoodfacts integration

## structure

```
src/
  sidepanel/    main dashboard pages (this is the bulk of the app)
  popup/        the quick add page
  newtab/       the overview page
  options/      the settings page
  components/   shared ui + per-feature stuff
  lib/          api client, storage helper, calorie math
  context/      auth + profile providers
  Router.tsx    routes
  main.tsx      entry
```

## why a separate backend

so i can host the frontend statically (vercel) and the api on something with a real node runtime. also lets me reuse the same api if i ever do make the extension version again.
