$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 group 1 mega packs 2-5"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot
$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but current branch is '$currentBranch'."
}

$requiredFiles = @(
    "apps/web/src/app/enterprise-workspace/page.tsx",
    "apps/web/src/components/enterprise-workspace/enterprise-workspace.tsx",
    "apps/web/src/components/enterprise-workspace/enterprise-workspace.module.css",
    "apps/web/src/data/enterprise-workspace.ts",
    "apps/web/src/store/enterprise-workspace-store.ts",
    "apps/web/scripts/verify-web-platform-v3-group-1.mjs",
    "apps/web/scripts/smoke-web-platform-v3-group-1.mjs",
    "apps/web/scripts/execute-web-platform-v3-group-1.ps1"
)

Write-Host "=== WEB PLATFORM V3 GROUP 1 BUILD ===" -ForegroundColor Cyan
Set-Location $WebRoot
pnpm build
if ($LASTEXITCODE -ne 0) { throw "Build failed." }

Write-Host "=== VERIFICATION ===" -ForegroundColor Cyan
$verification = & node (Join-Path $ScriptRoot "verify-web-platform-v3-group-1.mjs")
if ($LASTEXITCODE -ne 0) { throw "Verification failed." }
$verification | ConvertFrom-Json | Format-List

Write-Host "=== SMOKE TEST ===" -ForegroundColor Cyan
$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-group-1.mjs")
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
    group = "Group 1"
    megaPacks = "2, 3, 4, 5"
    version = "3.5.0"
    branch = $ExpectedBranch
    commit = (git rev-parse --short HEAD).Trim()
    modules = $smoke.modules
    notifications = $smoke.notifications
    activities = $smoke.activities
    qualityScore = $smoke.qualityScore
    healthStatus = $smoke.healthStatus
} | Format-List
