#!/usr/bin/env bash
#
# deploy.sh — publish johnnohrden.com
#
#   ./deploy.sh                      → commits with the message "Update site"
#   ./deploy.sh "Add projects page"  → commits with your own message
#
# The site is served by GitHub Pages from johnnohrden/johnnohrden.github.io.
# Namecheap only points DNS at it. Pushing to `main` IS deploying.
#
set -euo pipefail

REPO="https://github.com/johnnohrden/johnnohrden.github.io.git"
BRANCH="main"
SITE="https://johnnohrden.com"

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

bold()  { printf '\033[1m%s\033[0m\n' "$*"; }
step()  { printf '\033[36m▸\033[0m %s\n' "$*"; }
ok()    { printf '\033[32m✓\033[0m %s\n' "$*"; }
fail()  { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# ── 1. Make sure the folder is wired to the repo ──────────────────────
if [ ! -d .git ]; then
  step "First run — turning this folder into a git repo"
  git init -q
  git symbolic-ref HEAD "refs/heads/$BRANCH"
  git remote add origin "$REPO"
  git config user.name  "John Nohrden"
  git config user.email "nohrdenj@gmail.com"
fi

git remote set-url origin "$REPO"

# ── 2. Pull down the existing history ─────────────────────────────────
step "Fetching current site history from GitHub"
git fetch -q origin || fail "Could not reach GitHub. Check your connection, then run this again."

# If this branch has no commits yet, adopt the remote history *without*
# touching a single one of your files.
if ! git rev-parse --verify -q HEAD >/dev/null 2>&1; then
  step "Adopting the existing site history (your files are left untouched)"
  git reset -q --mixed "origin/$BRANCH"
  git branch --set-upstream-to="origin/$BRANCH" "$BRANCH" >/dev/null 2>&1 || true
  ok "Folder is now connected to the live site's history"
fi

# ── 3. Stage everything that isn't gitignored ─────────────────────────
git add -A

# ── 4. Safety rails ───────────────────────────────────────────────────
# CNAME is what maps GitHub Pages to johnnohrden.com. Losing it takes the
# custom domain down, so refuse to publish a commit that deletes it.
if git diff --cached --name-status | grep -qE '^D[[:space:]]+CNAME$'; then
  fail "This would delete CNAME and break johnnohrden.com. Aborting.
     Restore it with:  printf 'johnnohrden.com' > CNAME"
fi

# Deleting index.html is almost certainly a mistake too.
if git diff --cached --name-status | grep -qE '^D[[:space:]]+index\.html$'; then
  fail "This would delete index.html — your homepage. Aborting."
fi

if git diff --cached --quiet; then
  ok "Nothing to publish — the live site already matches this folder."
  exit 0
fi

# ── 5. Show what's about to go live, then push ────────────────────────
bold ""
bold "About to publish:"
git diff --cached --name-status | sed 's/^A/  added   /; s/^M/  changed /; s/^D/  deleted /; s/\t/ /'
bold ""

MSG="${1:-Update site}"
git commit -q -m "$MSG"

step "Pushing to GitHub"
git push -q origin "$BRANCH"

ok "Pushed. GitHub Pages usually rebuilds within 30–60 seconds."
echo "   $SITE/projects.html"
