# Feasty (local dev)

Two projects live in here:

- `FeastyBackend/` - NestJS + Mongoose API, runs on port `3001`
- `FeastyFrontend/` - the website (Vite + React + react-router), dev server on `127.0.0.1:5173`

I've only run this on Windows 11 with Node 24 and PowerShell, so adjust paths if you're elsewhere.

## Backend

Install:

```powershell
cd C:\Users\Admin\Documents\Feasty\FeastyBackend
npm install --legacy-peer-deps
```

You need `--legacy-peer-deps` here. `@nestjs/schedule@4.1.2` says it wants `@nestjs/common` v8-10 but we're on v11, and npm will refuse to install otherwise.

### .env

Nest picks up `FeastyBackend\.env` on its own through `@nestjs/config`. Copy the example and edit it:

```powershell
Copy-Item key.env.example .env
notepad .env
```

What goes in it:

| key              | example                                         | notes                                                     |
| ---------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `MONGO_URI`      | `mongodb://shard-00-00.xxx:27017,shard-00-01…`  | use the shard hosts directly. `mongodb+srv://` fails locally because the SRV DNS lookup times out |
| `JWT_SECRET`     | any long random string                          | required                                                  |
| `JWT_EXPIRES_IN` | `7d`                                            | optional, defaults to `7d`                                |
| `PORT`           | `3001`                                          | optional, defaults to `3001`                              |
| `NODE_ENV`       | `development`                                   | controls the cookie `secure` flag                         |
| `ALLOWED_ORIGINS`| leave empty, or `http://localhost:5173`         | comma-separated. empty = allow everything                 |
| `USE_PROD_DB`    | `false`                                         | switches between the prod and test db on the same cluster |

### Running it

```powershell
npm run start:dev
```

That's `nest start --watch`, so it rebuilds and restarts whenever you save. When it's up you'll see:

```
[Nest] LOG [NestApplication] Nest application successfully started
listening on http://localhost:3001
```

Swagger's at `http://localhost:3001/docs` if you want to poke at the API.

### When it won't start

`MongooseServerSelectionError: ECONNREFUSED 127.0.0.1:27017` - you're missing `.env`, or `MONGO_URI` is wrong. With no URI it falls back to a local Mongo that probably isn't there.

`Found N errors. Watching for file changes.` and then nothing - a fresh `npm install` sometimes grabs newer `@types/*` than the lockfile expected. If `src/main.ts` and `src/auth/auth.module.ts` are already patched you won't hit this. If you do:

- change `import * as cookieParser` to `import cookieParser` (default import)
- `signOptions.expiresIn: process.env.X || '7d'` needs an `as any` cast now, since newer `@types/jsonwebtoken` wants `StringValue | number`

## Frontend

Install:

```powershell
cd C:\Users\Admin\Documents\Feasty\FeastyFrontend
npm install --legacy-peer-deps
```

Same `--legacy-peer-deps` story: `recharts` declares old peer versions. `react-is` is pinned in `package.json` to cover the one it'd otherwise skip.

Run:

```powershell
npm run dev
```

You should get something like:

```
VITE v6  ready in … ms
➜  Local:   http://127.0.0.1:5173/
```

Open `http://127.0.0.1:5173/` (or `localhost:5173`) in a browser.

One thing worth knowing: `vite.config.ts` forces the dev server onto `127.0.0.1:5173`. Vite 6 binds to IPv6 by default, but Chrome resolves `localhost` to IPv4 on Windows, so without this pin you get a "can't connect" page even though the server's running.

### Routes

| route        | lives in          | what it is                          |
| ------------ | ----------------- | ----------------------------------- |
| `/`          | `src/sidepanel/`  | the dashboard - 7-tab full app      |
| `/overview`  | `src/newtab/`     | wider summary view                  |
| `/quick-add` | `src/popup/`      | small quick-add card                |
| `/settings`  | `src/options/`    | profile / reminders / custom foods  |

There's a basic top nav in `src/Router.tsx` that hops between them.

### Pointing at a different API

Make a `FeastyFrontend\.env`:

```
VITE_API_URL=http://localhost:3001/api
```

If you don't, it defaults to `http://localhost:3001/api` anyway.

### Editing

HMR is on for everything, so normal edits show up without a reload. The only time you need to restart Vite is when you touch `vite.config.ts`.

### When the frontend misbehaves

CORS error coming from `http://localhost:5173` - the backend's `ALLOWED_ORIGINS` is set to a list that doesn't include your dev URL. Either empty it out in `FeastyBackend\.env` (empty allows all) or add `http://localhost:5173` / `http://127.0.0.1:5173`.

`Port 5173 is already in use` - an old Vite is still alive. Find it with `netstat -ano | findstr :5173`, then `taskkill /PID <pid> /F`.

API calls failing with `ERR_CONNECTION_REFUSED` - backend's not running. Go start it (see above).

Blank page after refreshing `/settings` - you're on `npm run preview` or some static host with no SPA fallback. `npm run dev` handles this for you; for prod you have to tell the host to serve `index.html` on unknown routes.

## Production build

Backend:

```powershell
cd C:\Users\Admin\Documents\Feasty\FeastyBackend
npm run build         # spits out dist/
npm run start:prod    # node dist/main
```

This auto-deploys off the `prod-2-beforepush` branch (Zerops).

Frontend:

```powershell
cd C:\Users\Admin\Documents\Feasty\FeastyFrontend
npm run build         # type-checks, then builds dist/
npm run preview       # serve the built files locally to sanity-check
```

Drop `dist/` on any static host - Vercel, Netlify, Zerops static, S3 + CloudFront, whatever. Just remember to set up the `index.html` fallback for unknown paths or client-side routing breaks.

## URLs once it's all running

| thing    | url                          |
| -------- | ---------------------------- |
| Website  | `http://localhost:5173`      |
| API      | `http://localhost:3001/api`  |
| Swagger  | `http://localhost:3001/docs` |
