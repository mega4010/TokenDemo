# Point this repo at tracked hooks under githooks/ (no copy into .git/hooks).
$ErrorActionPreference = "Stop"
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Error "Run this script from inside a Git repository."
}
Set-Location $repoRoot
$hooksDir = Join-Path $repoRoot "githooks"
if (-not (Test-Path $hooksDir)) {
    Write-Error "Missing githooks/ directory at: $hooksDir"
}
git config --local core.hooksPath "githooks"
Write-Host "Installed: core.hooksPath=githooks (this repo only)."
