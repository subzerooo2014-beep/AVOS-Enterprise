$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega pack 6"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot
$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but current branch is '$currentBranch'."
}

$requiredFiles = @(
    "apps/web/src/app/dashboard-widgets/page.tsx",
    "apps/web/src/components/dashboard-widgets/dashboard-widgets-center.tsx",
    "apps/web/src/components/dashboard-widgets/dashboard-widgets.module.css",
    "apps/web/src/data/dashboard-widgets.ts",
    "apps/web/src/store/dashboard-widgets-store.ts",
    "apps/web/scripts/verify-web-platform-v3-mega-pack-6.mjs",
    "apps/web/scripts/smoke-web-platform-v3-mega-pack-6.mjs",
    "apps/web/scripts/execute-web-platform-v3-mega-pack-6.ps1"
)

Write-Host "=== WEB PLATFORM V3 MEGA PACK 6 BUILD ===" -ForegroundColor Cyan
Set-Location $WebRoot
pnpm build
if ($LASTEXITCODE -ne 0) { throw "Build failed." }

Write-Host "=== VERIFICATION ===" -ForegroundColor Cyan
$verification = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-pack-6.mjs")
if ($LASTEXITCODE -ne 0) { throw "Verification failed." }
$verification | ConvertFrom-Json | Format-List

Write-Host "=== SMOKE TEST ===" -ForegroundColor Cyan
$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-pack-6.mjs")
if ($LASTEXITCODE -ne 0) { throw "Smoke test failed." }
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

Set-Location $RepoRoot
git add -- $requiredFiles
git diff --cached --check
if ($LASTEXITCODE -ne 0) { throw "Git validation failed." }

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) { throw "Commit failed." }

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) { throw "Push failed." }

[PSCustomObject]@{
    success = $true
    system = "AVOS Web Platform V3"
    megaPack = "Mega Pack 6"
    version = "3.6.0"
    branch = $ExpectedBranch
    commit = (git rev-parse --short HEAD).Trim()
    widgets = $smoke.widgets
    categories = $smoke.categories
    qualityScore = $smoke.qualityScore
    healthStatus = $smoke.healthStatus
} | Format-List
