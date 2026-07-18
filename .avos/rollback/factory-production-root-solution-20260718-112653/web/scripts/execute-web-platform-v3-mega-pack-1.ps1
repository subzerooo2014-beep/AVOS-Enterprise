$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega pack 1"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but current branch is '$currentBranch'."
}

$requiredFiles = @(
    "apps/web/src/app/enterprise-command-center/page.tsx",
    "apps/web/src/components/enterprise-command-center/enterprise-command-center.tsx",
    "apps/web/src/components/enterprise-command-center/enterprise-command-center.module.css",
    "apps/web/src/data/enterprise-command-center.ts",
    "apps/web/scripts/verify-web-platform-v3-mega-pack-1.mjs",
    "apps/web/scripts/smoke-web-platform-v3-mega-pack-1.mjs",
    "apps/web/scripts/execute-web-platform-v3-mega-pack-1.ps1"
)

Write-Host "=== BUILD ===" -ForegroundColor Cyan
Set-Location $WebRoot
pnpm build
if ($LASTEXITCODE -ne 0) { throw "Build failed." }

Write-Host "=== VERIFICATION ===" -ForegroundColor Cyan
$verify = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-pack-1.mjs")
if ($LASTEXITCODE -ne 0) { throw "Verification failed." }
$verify | ConvertFrom-Json | Format-List

Write-Host "=== SMOKE TEST ===" -ForegroundColor Cyan
$smoke = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-pack-1.mjs")
if ($LASTEXITCODE -ne 0) { throw "Smoke test failed." }
$smokeResult = $smoke | ConvertFrom-Json
$smokeResult | Format-List

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
    megaPack = "Mega Pack 1"
    version = "3.1.0"
    branch = $ExpectedBranch
    commit = (git rev-parse --short HEAD).Trim()
    modules = $smokeResult.modules
    alerts = $smokeResult.alerts
    qualityScore = $smokeResult.qualityScore
    healthStatus = $smokeResult.healthStatus
} | Format-List
