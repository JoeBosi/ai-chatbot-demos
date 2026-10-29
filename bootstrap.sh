#!/usr/bin/env bash
# Restore and check the portable agent kit.
# Usage: ./bootstrap.sh [--check]
set -euo pipefail
cd "$(dirname "$0")"

ok(){ printf '  \033[32m✓\033[0m %s\n' "$1"; }
ko(){ printf '  \033[31m✗\033[0m %s\n' "$1"; FAIL=1; }
FAIL=0
CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1

echo "▸ Kit $( [ -f KIT_VERSION ] && cat KIT_VERSION || echo 'version unknown' )"

echo "▸ Prerequisites"
command -v node >/dev/null && ok "node $(node -v)" || ko "node missing (required by npx skills)"
command -v git  >/dev/null && ok "git  $(git --version | awk '{print $3}')" || ko "git missing"

echo "▸ Structure"
for p in CLAUDE.md AGENTS.md PROJECT.md .claude/settings.json .claude/skills .claude/agents \
         docs/research/INDEX.md docs/JOURNAL.md; do
  [ -e "$p" ] && ok "$p" || ko "missing $p"
done

# Project memory lives in .claude/memory/ so it travels with the folder. Claude Code only
# accepts an absolute autoMemoryDirectory, so it is written per machine into the git-ignored
# .claude/settings.local.json instead of the shared settings.json.
echo "▸ Memory"
MEM_DIR="$PWD/.claude/memory"
if [ "$CHECK_ONLY" -eq 0 ]; then
  mkdir -p .claude/memory .claude/agent-memory
  [ -f .claude/memory/MEMORY.md ] || printf '# Memory index\n' > .claude/memory/MEMORY.md
fi
[ -f .claude/memory/MEMORY.md ] && ok ".claude/memory/MEMORY.md ($(($(wc -l < .claude/memory/MEMORY.md) - 1)) entries)" \
  || ko "missing .claude/memory/MEMORY.md (run ./bootstrap.sh)"
MEM_STATE=$(node -e '
  const fs=require("fs"), p=".claude/settings.local.json", dir=process.argv[1], write=process.argv[2]==="1";
  let s={};
  if (fs.existsSync(p)) { try { s=JSON.parse(fs.readFileSync(p,"utf8")); } catch { console.log("invalid"); process.exit(0); } }
  if (s.autoMemoryDirectory===dir) { console.log("ok"); process.exit(0); }
  if (!write) { console.log("stale"); process.exit(0); }
  s.autoMemoryDirectory=dir; fs.writeFileSync(p, JSON.stringify(s,null,2)+"\n"); console.log("written");
' "$MEM_DIR" "$((1 - CHECK_ONLY))" 2>/dev/null || echo "error")
case "$MEM_STATE" in
  ok)      ok "autoMemoryDirectory → .claude/memory" ;;
  written) ok "autoMemoryDirectory → .claude/memory (written to settings.local.json, restart Claude)" ;;
  stale)   ko "autoMemoryDirectory not set for this machine (run ./bootstrap.sh)" ;;
  invalid) ko ".claude/settings.local.json is not valid JSON (fix it, then re-run)" ;;
  *)       ko "could not configure autoMemoryDirectory (node missing?)" ;;
esac

echo "▸ Skills"
if [ -f skills-lock.json ]; then
  if [ "$CHECK_ONLY" -eq 0 ]; then
    # explicit restore: project-scoped, copied, into .claude/skills/
    while read -r NAME SOURCE; do
      [ -z "$NAME" ] && continue
      [ "$SOURCE" = "local" ] && continue
      if [ -f ".claude/skills/$NAME/SKILL.md" ]; then
        ok "$NAME already present"
      else
        echo "  ↓ reinstalling $NAME from $SOURCE"
        # </dev/null: npx reads stdin and would swallow the remaining lines of this loop
        npx -y skills@latest add "$SOURCE" --skill "$NAME" -a claude-code --copy -y \
          </dev/null >/dev/null 2>&1 || ko "restore of $NAME failed"
      fi
    done < <(node -e '
      const l=require("./skills-lock.json").skills||{};
      for (const [n,v] of Object.entries(l)) console.log(n, v.source||"local");
    ')
  fi
  # A locked skill that is still missing means the restore did not happen or failed.
  while read -r NAME; do
    [ -n "$NAME" ] && [ ! -f ".claude/skills/$NAME/SKILL.md" ] && ko "$NAME is locked but missing (run ./bootstrap.sh)"
  done < <(node -e '
    const l=require("./skills-lock.json").skills||{};
    for (const [n,v] of Object.entries(l)) if ((v.source||"local")!=="local") console.log(n);
  ')
else
  [ "$CHECK_ONLY" -eq 1 ] || echo "  · no skills-lock.json yet (no third-party skills installed)"
fi
for d in .claude/skills/*/; do
  [ -d "$d" ] || continue
  [ -f "$d/SKILL.md" ] && ok "$(basename "$d")" || ko "$(basename "$d") has no SKILL.md"
done

echo "▸ Portability"
if [ -n "$(find .claude -type l 2>/dev/null)" ]; then
  ko "symlinks under .claude (reinstall those skills with --copy)"
else ok "no symlinks"; fi
# Third-party skills are vendored content we do not control: their examples routinely
# contain absolute paths, and flagging them would train everyone to ignore this check.
# Locally written skills stay in scope, because those are ours to keep portable.
VENDORED=()
if [ -f skills-lock.json ]; then
  while read -r NAME; do
    [ -n "$NAME" ] && VENDORED+=(--exclude-dir="$NAME")
  done < <(node -e '
    const l=require("./skills-lock.json").skills||{};
    for (const [n,v] of Object.entries(l)) if ((v.source||"local")!=="local") console.log(n);
  ' 2>/dev/null || true)
fi
# The path must start a token: "../../root/x" is a relative path that merely passes through
# one of these names, and flagging it would be a false alarm. bootstrap.sh is excluded, so
# the pattern below does not match itself. Memory notes and settings.local.json are machine
# records (they may legitimately name paths on this VPS), so they are out of scope too; the
# file exclude sits after the includes because with grep the last matching option wins.
HITS=$(grep -rlIE --exclude-dir=docs --exclude-dir=node_modules --exclude-dir=.git \
  --exclude=bootstrap.sh \
  --exclude-dir=memory --exclude-dir=agent-memory --exclude-dir=agent-memory-local "${VENDORED[@]}" \
  -e '(^|[[:space:]"'"'"'`(=:,])/(root|home|Users)/' \
  --include='*.md' --include='*.json' --include='*.sh' --exclude=settings.local.json . 2>/dev/null || true)
if [ -n "$HITS" ]; then
  ko "absolute paths in: $(echo "$HITS" | tr '\n' ' ')"
else ok "no absolute paths"; fi

# A skill installed from a folder on this machine cannot be restored on another one.
# This is a normal state while developing a skill, so it is a note, not a failure —
# a check that fails in ordinary use is a check people learn to ignore.
if [ -f skills-lock.json ]; then
  LOCAL_SRC=$(node -e '
    const l=require("./skills-lock.json").skills||{};
    for (const [n,v] of Object.entries(l))
      if (v.sourceType==="local" || (v.source||"").includes("..")) console.log(n);
  ' 2>/dev/null || true)
  if [ -n "$LOCAL_SRC" ]; then
    printf "  · %s\n" "installed from a local path, so ./bootstrap.sh cannot restore them elsewhere: $(echo "$LOCAL_SRC" | tr '\n' ' ')"
  fi
fi

echo "▸ Secrets"
if [ -f .env ] && ! grep -q '^\.env$' .gitignore 2>/dev/null; then
  ko ".env exists but is not git-ignored"
else ok "no tracked secrets"; fi

echo
[ "$FAIL" -eq 0 ] && echo "Kit ready." || { echo "Kit incomplete: see ✗ above."; exit 1; }
