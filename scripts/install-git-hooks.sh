#!/usr/bin/env sh
# Point this repo at tracked hooks under githooks/ (no copy into .git/hooks).
set -eu
repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"
if [ ! -d githooks ]; then
  echo "Missing githooks/ directory in $repo_root" >&2
  exit 1
fi
git config --local core.hooksPath githooks
# Unix: hooks must be executable when using hooksPath
chmod +x githooks/* 2>/dev/null || true
echo "Installed: core.hooksPath=githooks (this repo only)."
