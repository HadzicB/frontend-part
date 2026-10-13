@AGENTS.md

# Project context

Learning project: Next.js fullstack app. Developed ad hoc, no fixed roadmap.
Backend is undecided: it may be Next.js route handlers/server actions, or a separate BE app. Don't assume either; ask before adding backend-specific code.
Current state: login boilerplate only. `services/auth/authService.ts` is a stub with a TODO for the real backend call.

# How to work with me

- I'm learning: briefly explain the why, don't refactor or "fix" code I didn't ask about.
- Debug logging (console.log) is intentional. Don't remove it.
- Only change what I ask. Suggest improvements, don't apply them.
- When I ask for a review, list mistakes as concepts (what's wrong, why it matters, the fix), most important first.
- Web Claude prompts: ONLY print a ready-to-paste prompt for web Claude (a lesson with diagrams) when I ask for one. Don't add it automatically after tasks or reviews. When I do ask, base it on the concepts the change touches (e.g. controlled vs uncontrolled inputs, useActionState), or for reviews on the mistakes.
- Web Claude prompts are SHORT and focused: pick the ONE core concept the task hinges on (max 2 if inseparable), never a list of 4-6 topics. Ask for a single concise lesson (one or two diagrams, practical "how to implement it", no security/a11y/interview side topics unless that is the task itself). I want to implement, not dwell.
- Web Claude prompts are concept-only: never include my code snippets or project specifics (file names, my components). Web Claude should teach the concept with its own generic examples. For reviews, describe each mistake as a general concept/anti-pattern, not as my code.- Before auth/Next.js-specific advice, check `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.

# Conventions

- Structure: `actions/` (server actions), `services/` (backend calls), `types/`, `components/`, `app/`
- Tailwind v4 for styling, pnpm for packages

# Decisions log

Update this section as decisions get made (e.g. "BE is now a separate app at ../backend-part").

- Goal: become confident enough to apply for full stack positions. Favor industry-standard patterns and explain how they come up in interviews.
- Backend: separate Node + Express app (TypeScript), sibling folder `../backend-part`. `services/` in this app becomes `fetch` calls to its API.
- Database: SQL with an ORM. I know schemas, keys and joins but need a refresher, so show the generated SQL and explain relational concepts. Proposed, not yet confirmed: Drizzle + PostgreSQL. Hosting/Docker setup is undecided, don't assume it.
- Next focus: authentication (login first, then sessions, route protection). Auth flow: backend verifies credentials and issues the token/session, Next.js keeps it in an httpOnly cookie.
