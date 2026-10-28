@AGENTS.md

# Project context

Learning project: Next.js fullstack app, a **job aggregator with a daily AI digest** (see "The app" below). Developed ad hoc; auth comes first, app features after.
Backend is decided: a separate Node app in `../backend-part`, called with `fetch` from the Next server only (server components/actions), never from the browser, so it doesn't show in the browser Network tab and needs no CORS. Ask before adding backend-specific code.
Current state: login and signup work end to end against the separate backend (`API_URL` in `.env.local`).

- `services/auth/authService.ts` calls the backend `/login` and `/signup` with `fetch`.
- `actions/auth/authActions.ts` validates input (`lib/validation/`), calls the service, and on login sets an httpOnly `session` cookie from the backend's `{ id, expiresAt }` (the cookie expiry follows the BE; sessions last 20 minutes).
- Routes live in `app/(auth)/login` and `app/(auth)/signup`. Types are in `types/auth.ts`.
- Logout: `logoutAction` calls the BE `/logout` (sends `Authorization: Bearer <id>`), deletes the cookie, redirects to `/login`.
- `src/proxy.ts`: optimistic check only, "does a `session` cookie exist?". Public routes list: `/login`, `/signup`, `/forgot-password`; everything else is protected by default. Matcher skips `api`, `_next/static`, `_next/image`, `favicon.ico`, `.png`. Has debug `console.log`s on redirects. I decided NOT to call the backend from the proxy.
- Real session check: `getMe(sessionId)` in `authService.ts` calls BE `GET /users/me` (null on 401). `app/page.tsx` uses it and shows "Hello, <username>". If the BE rejects the session (fake/expired/logged out), the page redirects to `app/session-expired/route.ts`, which deletes the cookie and redirects to `/login` (without that, the proxy would bounce the user back to `/`: redirect loop).
- `app/user/page.tsx` is a second protected page; it has the same `getMe` check as the home page (copy-pasted for now, to be replaced by the central helper below). Shows a placeholder TODO for the real user details (needs a BE endpoint).
- Dev runs with `next dev --experimental-https` (self-signed cert, `https://localhost:3000`). `API_URL` stays plain http to the BE.

# The app: job aggregator with a daily AI digest

Goal: learn and stand out for newer roles (backend / AI automation), not beat Infostud or LinkedIn. It is a job alert service, NOT a notepad for tracking interviews (a plain CRUD tracker is a common portfolio app and doesn't stand out). Imperfect AI results are fine as long as I can explain why and how to improve them (prompting, evals).

Pitch: "My app crawls job boards like Infostud daily, AI ranks the jobs against each user's filters, and users get a digest of new matches."

Why users: users aren't strictly needed for a plain search page, but they are needed once data is personal and remembered: saved filters ("run MY search daily"), seen/saved/hidden state (what's "new" differs per person), the digest (someone to send it to), CV-based scoring, and LLM cost/abuse control. Every BE query on this data is scoped to the logged-in user (ownership checks: user A can never read user B's data). Possible later: hybrid like real job boards (public search, login unlocks alerts and digest); for now everything is behind login.

Core flow:

1. Log in (done).
2. Save filters (keywords, city, remote, category), stored per user.
3. The BE fetches jobs from the source for those filters, saves them, dedupes (the same job never shows twice).
4. Results list: title, company, link, date. User marks jobs as seen / saved / hidden.
5. Daily: a scheduled BE job (node-cron or BullMQ repeatable job) runs step 3 every 24h for every user's filters.
6. AI: cheap keyword filter first, then the LLM (BE only) parses each new job into structured data (company, role, skills, salary) and scores it against the filters/CV (structured output / tool calling).
7. Digest: the best new matches in the app (and optionally by email).

Build in slices; each slice is a working, demo-able app, and I can stop after any of them:

1. Filters + "Search now" button (manual fetch from ONE source) + results list + seen/saved/hidden + dedupe. No AI, no scheduler.
2. Scheduler: the same fetch runs daily on its own.
3. LLM parsing + scoring.
4. Digest view/email.
   Keep it to ONE source and one LLM call per job until slice 4 works. Too much = many sources, queues and RAG at once.

Job sources:

- First source: Poslovi Infostud (poslovi.infostud.com). No public API found, so it's HTML crawling of public listings (no login needed). Check its `robots.txt` and terms first, be gentle (one request per filter per day, delays between requests). The HTML will change and the parser will break sometimes: handle it and log it (good interview story).
- Second source candidate: HelloWorld.rs (also Infostud, IT-focused).
- Others: public job APIs (e.g. Adzuna, Arbeitnow), public Greenhouse/Lever board JSON, RSS feeds. NOT LinkedIn scraping (against their terms, gets blocked).

Later features:

- Optional stages on saved jobs (Saved → Applied → Interview), a small extra, not the core.
- RAG over saved jobs ("which jobs asked for Python?"), probably pgvector in the same Postgres.

Backend concepts this should show (interview talking points): crawling and parsing, scheduled background jobs, dedupe and data pipelines, Postgres schema and relations, session auth and ownership checks, REST API design, LLM calls server-side with structured output, retries and rate limits, handling failing sources, LLM cost control.

## Next steps (in order)

1. (done) `getMe` check on `app/user/page.tsx`.
2. (done) BE auth guard so every protected BE endpoint validates the session itself (see the backend CLAUDE.md). Error handling is aligned: `ServiceUnavailableError` for an unreachable BE in every service call, and `logout` treats a 401 as success.
3. Central place for BE calls (small `fetch` wrapper, server-only): base URL, auth header, error mapping, and one spot that handles a 401 by redirecting to `/session-expired` (the route handler that deletes the cookie, because pages and render can't delete cookies). `getMe` is not special: it becomes a plain call through this wrapper.
4. `verifySession()` in a data access layer (`lib/dal.ts`, `server-only`, wrapped in React `cache` so it runs once per render): the real-check counterpart of `proxy.ts`. Every page, action and BE data call goes through it, so no page copy-pastes a `getMe` block. Doc reference: "Creating a Data Access Layer (DAL)" in `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.
5. Idea to evaluate (probably overkill for two separate repos): shared zod schemas used by both FE and BE so validation rules aren't written twice. Cheaper options: zod only in each repo with the same rules, or BE as the single source of truth and FE just shows its 400 field errors. A shared package only pays off in a monorepo (pnpm workspace).
6. Interview topic, learn the concept (not necessarily implement): JWT vs server-side sessions. We use opaque session IDs looked up in the `sessions` table (stateful, instantly revocable). JWT is a signed token (`header.payload.signature`) the server can verify without a DB lookup (stateless), but it can't be revoked before expiry unless you add a denylist or short expiry + refresh token. Be ready to explain the trade-off, where to store each (httpOnly cookie vs localStorage), and why we chose sessions. Ask Claude for a short web-Claude prompt when ready.
7. Later: forgot password; signup creating a session (auto-login); roles/permissions with a data access layer (separate, more complex topic).
8. Start the app itself: slice 1 (see "The app"): filters page, "Search now" fetching from Infostud, results list with seen/saved/hidden, dedupe. Then slices 2-4.

## Still unclear to me (re-explain simply when I ask, in Serbian if I write Serbian)

- Who checks the session and when, across many clicks: proxy = cookie exists only; every BE call carries the session ID and the BE checks `sessions` itself; `/me` is just a feature that returns the user, not "the" authorization.
- Why a fake cookie passes the proxy but fails at the BE.
- What server actions send/receive (form-data envelope and React Flight response, not JSON); only the Next-to-BE call is JSON.
- Error flow across the whole chain: who returns and who throws errors, from the BE server to the Next server and then to the browser, and what each one does with an error (BE status + `{ message }`, what the service/action turns it into, what the browser finally sees: form message, redirect, or Next error page). I don't know this yet and will learn it by building (e.g. `error.tsx`, `not-found.tsx`, the central 401 handler in the fetch wrapper). Re-explain with a simple end-to-end example when I ask.

# How to work with me

- I'm learning: briefly explain the why, don't refactor or "fix" code I didn't ask about.
- Debug logging (console.log) is intentional. Don't remove it.
- Only change what I ask. Suggest improvements, don't apply them.
- When I ask for a review, list mistakes as concepts (what's wrong, why it matters, the fix), most important first.
- Web Claude prompts: ONLY print a ready-to-paste prompt for web Claude (a lesson with diagrams) when I ask for one. Don't add it automatically after tasks or reviews. When I do ask, base it on the concepts the change touches (e.g. controlled vs uncontrolled inputs, useActionState), or for reviews on the mistakes.
- Web Claude prompts are SHORT and focused: pick the ONE core concept the task hinges on (max 2 if inseparable), never a list of 4-6 topics. Ask for a single concise lesson (one or two diagrams, practical "how to implement it", no security/a11y/interview side topics unless that is the task itself). I want to implement, not dwell.
- Web Claude prompts are concept-only: never include my code snippets or project specifics (file names, my components). Web Claude should teach the concept with its own generic examples. For reviews, describe each mistake as a general concept/anti-pattern, not as my code.
- Before auth/Next.js-specific advice, check `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.

# Conventions

- Structure: everything lives under `src/` (`@/*` maps to `./src/*`): `actions/` (server actions), `services/` (backend calls), `lib/validation/`, `types/`, `components/`, `app/`, `proxy.ts`. Moved into `src/` already.
- Tailwind v4 for styling, pnpm for packages

# Decisions log

Update this section as decisions get made (e.g. "BE is now a separate app at ../backend-part").

- Goal: become confident enough to apply for full stack positions. Favor industry-standard patterns and explain how they come up in interviews.
- App (2026-10-28): job aggregator with a daily AI digest (user filters, scheduled crawl, dedupe, LLM scoring, digest), chosen over a CRUD job tracker because it stands out more and matches AI/backend roles. First source: Poslovi Infostud. Users kept (personal filters/state/digest); public search maybe later. Learning/portfolio project, not a competitor to job boards.
- AI: LLM calls happen only in the BE, never in Next or the browser. Provider not decided yet (I've used the Anthropic API before).
- Backend: separate Node + Express app (TypeScript), sibling folder `../backend-part`. `services/` in this app becomes `fetch` calls to its API.
  - Update: for now the BE is plain JavaScript (ESM) with Node's built-in `http` and the `pg` driver. No Express or TypeScript yet; both may come later.
- Database: SQL with an ORM. I know schemas, keys and joins but need a refresher, so show the generated SQL and explain relational concepts. Proposed, not yet confirmed: Drizzle + PostgreSQL. Hosting/Docker setup is undecided, don't assume it.
  - Update: PostgreSQL 16 is confirmed and running locally, currently with raw `pg` (no ORM yet). Docker deferred.
  - Note: Drizzle still the leading ORM candidate (SQL-like, lean, supports pgvector for later RAG). Prisma considered: relation-based, hides joins, less transparent.
- Next focus: authentication (login first, then sessions, route protection). Auth flow: backend verifies credentials and issues the token/session, Next.js keeps it in an httpOnly cookie.
