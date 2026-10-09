# Elemental Clash

Card battler that runs in the browser, works offline as a PWA, and has online play on Cloudflare Pages + D1.

```
public/            static site (served as-is)
  index.html       page and styles
  engine.js        game rules, shared by the browser AND the server
  client.js        offline game, UI, settings, decks, history, offline ladder
  online.js        accounts, queue, rooms, live match sync
  sw.js, manifest.webmanifest, icons
functions/api/[[path]].js   the whole backend (Pages Function)
shared/engine.mjs           GENERATED from public/engine.js (commit it)
schema.sql                  D1 tables
scripts/build.mjs           regenerates shared/engine.mjs and dist/elemental-clash.html
```

## One-time setup

1. **Database**
   ```
   npx wrangler d1 create elemental-clash
   ```
   Copy the `database_id` it prints into `wrangler.toml`, then create the tables:
   ```
   npx wrangler d1 execute elemental-clash --remote --file=schema.sql
   ```
2. **Discord (optional, needed for Discord login / linking / password recovery)**
   - https://discord.com/developers/applications -> New Application -> OAuth2.
   - Add redirect: `https://YOUR-DOMAIN/api/discord/callback` (and `http://localhost:8788/api/discord/callback` for local dev).
   - Copy the Client ID and Client Secret.
3. **Pages project**
   - Push this repo to GitHub, then Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> connect the repo.
   - Framework preset: none. Build command: leave empty. Build output directory: `public`.
   - Settings -> Bindings: add a **D1 database** binding named `DB` pointing at `elemental-clash` (not needed if `wrangler.toml` is used, but harmless).
   - Settings -> Variables and Secrets: add `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` (secret). Optional `DISCORD_REDIRECT` to override the callback URL.
   - Deploy. Or from your machine: `npm run deploy`.

Without the Discord variables everything else works; the Discord buttons just report an error.

## Local development

```
npm i -D wrangler
npm run db:local
echo DISCORD_CLIENT_ID=... > .dev.vars   # optional
npm run dev                                # http://localhost:8788
```

## Editing the rules

`public/engine.js` is the single source for game rules. After changing it run `npm run build` and commit the regenerated `shared/engine.mjs` so the server and the browser never disagree. Matches in progress keep working across deploys because the match state is plain data.

## How online play works

- **Server-authoritative.** The server runs the same engine; the browser only sends intents (play this card, attack that creature). Hidden information (opponent hand, deck order, face-down traps) is never sent to the other player.
- **Polling, not WebSockets.** Clients poll every ~1s on the opponent's turn and ~2.5s on their own. Actions use a version number so stale clicks are rejected. This keeps the whole thing on Pages + D1 with no Durable Object. If you outgrow it, a Durable Object per match is the natural upgrade; only `functions/api/[[path]].js` needs to change.
- **Matchmaking.** Ranked pairs players within 100 rating points, widening by 50 every 10 seconds. Casual ignores rating. Private rooms use a 6 character code.
- **Rating.** Elo with K=32 starting at 1000; casual and room games do not change it.
- **Clock.** 120 seconds per turn (180 for the first). Running out forfeits. Leaving a ranked match counts as a loss.
- **Accounts.** Username + password (PBKDF2-SHA256, 100k iterations, per-user salt), 30 day session cookie. Discord can be linked afterwards; a linked account can log in with Discord and reset its password through Discord. Unlinked accounts have no recovery.

## Things to know

- There is no rate limiting on login/register. Add a Cloudflare rate-limiting rule for `/api/login` and `/api/register` before inviting the public.
- Workers free plan allows 100k requests/day; one active match polls roughly 2 requests per second, so budget accordingly or move to the paid plan.
- Pack opening and currency are not built yet; the `set` and `rar` fields on every card are ready for it.
