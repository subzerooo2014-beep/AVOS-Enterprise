$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): services platform v2 mega pack 4"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path
$VerifyScript = Join-Path $ScriptRoot "verify-services-platform-v2-mega-pack-4.mjs"
$SmokeScript = Join-Path $ScriptRoot "smoke-services-platform-v2-mega-pack-4.mjs"

Set-Location $RepoRoot

Write-Host "=== AVOS SERVICES PLATFORM V2 - MEGA PACK 4 ===" -ForegroundColor Cyan
Write-Host "Repository: $RepoRoot" -ForegroundColor DarkGray

$currentBranch = (git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) {
    throw "Unable to read the current Git branch."
}
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but current branch is '$currentBranch'."
}

git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    throw "The Git index already contains staged changes. Commit or unstage them before running Mega Pack 4."
}
if ($LASTEXITCODE -gt 1) {
    throw "Unable to inspect staged Git changes."
}

$requiredFiles = @(
    "apps/web/src/app/service-operations/page.tsx",
    "apps/web/src/components/service-operations/service-operations-dashboard.tsx",
    "apps/web/src/components/service-operations/service-operations.module.css",
    "apps/web/src/data/service-operations.ts",
    "apps/web/src/store/service-operations-store.ts",
    "apps/web/scripts/verify-services-platform-v2-mega-pack-4.mjs",
    "apps/web/scripts/smoke-services-platform-v2-mega-pack-4.mjs",
    "apps/web/scripts/execute-services-platform-v2-mega-pack-4.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $file))) {
        throw "Required Mega Pack 4 file is missing: $file"
    }
}

Write-Host "`n=== BUILD ===" -ForegroundColor Cyan
Set-Location $WebRoot
pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 4 build failed."
}

Write-Host "`n=== VERIFICATION ===" -ForegroundColor Cyan
$verificationJson = & node $VerifyScript
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 4 verification failed."
}
$verification = $verificationJson | ConvertFrom-Json
$verification | Format-List

Write-Host "`n=== SMOKE TEST ===" -ForegroundColor Cyan
$smokeJson = & node $SmokeScript
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 4 smoke test failed."
}
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

if (-not $verification.success -or -not $smoke.success) {
    throw "Mega Pack 4 quality gates did not pass."
}

Write-Host "`n=== GIT COMMIT ===" -ForegroundColor Cyan
Set-Location $RepoRoot
git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage Mega Pack 4 files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    git reset -- $requiredFiles | Out-Null
    throw "Git whitespace validation failed. Mega Pack 4 files were unstaged."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 4 Git commit failed."
}

Write-Host "`n=== GIT PUSH ===" -ForegroundColor Cyan
git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 4 Git push failed. The local commit was preserved."
}

$commitHash = (git rev-parse --short HEAD).Trim()

Write-Host "`n=== SERVICES PLATFORM V2 MEGA PACK 4 COMPLETED ===" -ForegroundColor Green
[PSCustomObject]@{
    success                    = $true
    system                     = "AVOS Web Platform"
    megaPack                   = "Services Platform V2 - Mega Pack 4"
    version                    = "2.4.0"
    branch                     = $currentBranch
    commit                     = $commitHash
    buildExecutions            = 1
    verificationExecutions     = 1
    smokeTestExecutions        = 1
    requests                   = $smoke.requests
    insights                   = $smoke.insights
    cities                     = $smoke.cities
    serviceOperationsReady     = $smoke.serviceOperationsReady
    slaControlReady            = $smoke.slaControlReady
    escalationEngineReady      = $smoke.escalationEngineReady
    aiNextBestActionReady      = $smoke.aiNextBestActionReady
    omniChannelQueueReady      = $smoke.omniChannelQueueReady
    qualityScore               = $smoke.qualityScore
    healthStatus               = $smoke.healthStatus
    pushed                     = $true
} | Format-List
