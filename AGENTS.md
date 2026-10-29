# AGENTS.md

This folder uses a portable agent protocol. The full rules are in [`CLAUDE.md`](./CLAUDE.md)
and apply to **any** agent (Claude Code, Codex, Cursor, others). Project context lives in
[`PROJECT.md`](./PROJECT.md).

In short:
1. **Look for an existing skill first** (`.claude/skills/`, then `npx skills find`, skills.sh,
   GitHub). If one fits, install it here project-scoped with `--copy` and use it.
2. **On technical tasks, read the current official docs before acting**; save the note in
   `docs/research/`.
3. **Verify before declaring done**: real output, not promises.
4. **Everything stays inside the folder**: no global installs, no absolute paths.
5. **Be careful**: read third-party skills before running them; confirm irreversible actions
   and never change shared system configuration on your own.
6. **Memory stays in the folder**: `.claude/memory/MEMORY.md` is the index of what earlier
   sessions learned (one file per fact). Read it at the start; write new durable facts there,
   never secrets.

Skills in `.claude/skills/` use the standard `SKILL.md` format: another agent can read them
directly or install them into its own directory with `npx skills add . -a <agent> --copy`.
