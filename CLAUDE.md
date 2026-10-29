# Chat-Bot — Agent protocol

A **portable** agent setup: everything needed lives inside this folder. Copy it elsewhere,
run `./bootstrap.sh`, and the agent behaves the same.

Project context: [`PROJECT.md`](./PROJECT.md). Read it before working.

## Standing rules (apply to every task, without the user restating them)

### R1 — Look for an existing skill first
1. Check the local skills in `.claude/skills/`.
2. If none covers the task, search online: `npx skills find <query>`, https://skills.sh,
   `anthropics/skills`, `vercel-labs/skills`, the vendor's own repo.
3. If a good one exists → install it **into this folder** and use it.
4. If nothing fits → do the work by hand; if the task recurs, see R6.

Spend one search round, not five. "Nothing suitable, doing it by hand" is a valid outcome —
say it in one line rather than silently skipping the step.
Full protocol: `.claude/skills/skill-scout/SKILL.md`.

### R2 — On technical tasks, read the docs online first
For code, config, APIs, libraries, CLIs, standards, security, deployment: read the current
official documentation **before** acting. Never work from memory — versions and APIs change.
Write the findings to `docs/research/YYYY-MM-DD-<slug>.md` and index them in `INDEX.md`.
Protocol: `.claude/skills/web-research/SKILL.md`.

### R3 — Portability
- Install skills project-scoped and copied: never `-g`, always `--copy`.
- No absolute paths in project files — only paths relative to the root.
- Every installed skill appears in `skills-lock.json` (restorable with `./bootstrap.sh`).
- No secrets in the repo: `.env` (ignored) plus `.env.example` as the record.

### R4 — Traceability
Installed skills → `skills-lock.json` and `docs/research/INDEX.md`. Research → `docs/research/`.
Non-trivial decisions → `docs/JOURNAL.md`. If it isn't written down, it didn't happen.

### R5 — Verify before saying "done"
No "should work". Run the code, execute the command, open the file, show the real output.
If verification was impossible, say so plainly and give the command the user can run.
Report failures with their output, unsoftened.
Protocol: `.claude/skills/verify-work/SKILL.md`.

### R6 — Capitalize
After a non-trivial task, ask: will this happen again? If yes, turn it into a local skill in
`.claude/skills/`. The kit should get better with every task.
Protocol: `.claude/skills/retro/SKILL.md`.

### R7 — Safety and caution
- Third-party skills run with the agent's full permissions: **read the `SKILL.md` before
  installing it**, every time, including on updates.
- Never put secrets in files, logs, or messages.
- Destructive or irreversible actions — deletions, pushes, deployments, sends, spending,
  anything touching keys or funds, and any change to **shared system configuration**
  (reverse proxy, service manager, firewall) — need confirmation first, unless the user
  has explicitly said otherwise. Prefer handing over ready-to-run commands to running them.

### R8 — Memory lives in the folder
- Auto memory is stored in `.claude/memory/` (`MEMORY.md` index + one file per fact), not in the
  home directory: `./bootstrap.sh` points `autoMemoryDirectory` there via the git-ignored
  `.claude/settings.local.json`, because Claude Code only accepts an absolute path.
  If `./bootstrap.sh --check` flags it, run `./bootstrap.sh` and restart the session.
- Subagents with `memory: project` keep their notes in `.claude/agent-memory/<agent>/`.
- Memory is for facts that are not in the code, in `PROJECT.md` or in `docs/JOURNAL.md`:
  user preferences, corrections, context. Rules go in this file, procedures in skills (R6).
- Never store secrets in memory. Keep `MEMORY.md` under 200 lines, one line per entry.

## Task order

```
1. Classify     → technical? recurring? irreversible?
2. R1 scout     → local skill ▸ online skill ▸ install ▸ otherwise by hand
3. R2 research  → official docs (technical tasks) ▸ note in docs/research/
4. Execute
5. R5 verify    → real run, real output
6. R4+R6 record → JOURNAL/INDEX ▸ is this worth a skill?
```

**Allowed exceptions** (state them in one line, never skip silently): conversational questions,
reading files, trivial edits to code already in context. When in doubt, apply the rules.

## Working style
Answer in the language the user writes in. Keep answers compact; skip process narration unless
asked. Raise doubts when they appear, not at the end. If a request has two very different
readings, ask; otherwise pick one and state the assumption.

## Chat-Bot — project notes
Stack and reasons: `PROJECT.md` and `docs/research/2026-09-17-stack-widget-chat.md`.

| When you are… | Use |
|---|---|
| writing `streamText`/`useChat`/providers/tools | skill `ai-sdk`, then subagent `ai-sdk-reviewer` |
| building the chat UI | skills `ai-elements`, `shadcn`, `frontend-design`, `vercel-react-best-practices` |
| designing tables, queries, migrations | skill `supabase-postgres-best-practices` (applies to any Postgres) |
| touching widget.js, /embed, /api/chat, headers, prompts | skills `llm-security`, `security-best-practices`, then subagent `widget-security-reviewer` |
| testing the widget inside a host page | skill `widget-embed-test`; E2E style: `playwright-best-practices` |
| containerising or deploying | subagent `vps-deployer` |

Caveats on third-party skills:
- `ai-sdk` and `ai-elements` recommend the Vercel AI Gateway. This project runs on the VPS with
  provider packages (`@ai-sdk/openai`, …) and server-side keys: ignore the gateway parts.
- `ai-elements/references/stack-trace.md` shows a tool that runs `eval(code)`: never copy it.
- Online AI SDK examples are mostly v5/v6; the installed version in `package.json` decides.
