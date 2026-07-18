$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): services platform v2 mega packs 7 to 20"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path
$VerifyScript = Join-Path $ScriptRoot "verify-services-platform-v2-mega-pack-7-to-20.mjs"
$SmokeScript = Join-Path $ScriptRoot "smoke-services-platform-v2-mega-pack-7-to-20.mjs"

Set-Location $RepoRoot

Write-Host "=== AVOS SERVICES PLATFORM V2 - MEGA PACK 7 TO 20 ===" -ForegroundColor Cyan

$currentBranch = (git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) {
    throw "Unable to read the current Git branch."
}

if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but current branch is '$currentBranch'."
}

git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    throw "The Git index already contains staged changes."
}

if ($LASTEXITCODE -gt 1) {
    throw "Unable to inspect staged Git changes."
}

$requiredFiles = @(
    "apps/web/src/components/service-platform-accelerated/service-platform-accelerated-dashboard.tsx",
    "apps/web/src/components/service-platform-accelerated/service-platform-accelerated.module.css",
    "apps/web/src/data/service-platform-accelerated.ts",
    "apps/web/src/app/service-marketplace-intelligence/page.tsx",
    "apps/web/src/app/service-pricing-revenue/page.tsx",
    "apps/web/src/app/service-capacity-dispatch/page.tsx",
    "apps/web/src/app/service-fleet-operations/page.tsx",
    "apps/web/src/app/service-parts-supply/page.tsx",
    "apps/web/src/app/service-workforce/page.tsx",
    "apps/web/src/app/service-compliance-safety/page.tsx",
    "apps/web/src/app/service-contracts-sla/page.tsx",
    "apps/web/src/app/service-customer-lifecycle/page.tsx",
    "apps/web/src/app/service-partner-growth/page.tsx",
    "apps/web/src/app/service-risk-resilience/page.tsx",
    "apps/web/src/app/service-automation-center/page.tsx",
    "apps/web/src/app/service-ai-copilot/page.tsx",
    "apps/web/src/app/service-executive-command/page.tsx",
    "apps/web/scripts/verify-services-platform-v2-mega-pack-7-to-20.mjs",
    "apps/web/scripts/smoke-services-platform-v2-mega-pack-7-to-20.mjs",
    "apps/web/scripts/execute-services-platform-v2-mega-pack-7-to-20.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $file))) {
        throw "Required file is missing: $file"
    }
}

Write-Host "`n=== BUILD ===" -ForegroundColor Cyan
Set-Location $WebRoot
pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 7 to 20 build failed."
}

Write-Host "`n=== VERIFICATION ===" -ForegroundColor Cyan
$verificationJson = & node $VerifyScript
if ($LASTEXITCODE -ne 0) {
    throw "Verification failed."
}
$verification = $verificationJson | ConvertFrom-Json
$verification | Format-List

Write-Host "`n=== SMOKE TEST ===" -ForegroundColor Cyan
$smokeJson = & node $SmokeScript
if ($LASTEXITCODE -ne 0) {
    throw "Smoke test failed."
}
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

if (-not $verification.success -or -not $smoke.success) {
    throw "Quality gates did not pass."
}

Write-Host "`n=== GIT COMMIT ===" -ForegroundColor Cyan
Set-Location $RepoRoot
git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    git reset -- $requiredFiles | Out-Null
    throw "Git whitespace validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Git commit failed."
}

Write-Host "`n=== GIT PUSH ===" -ForegroundColor Cyan
git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Git push failed. Local commit was preserved."
}

$commitHash = (git rev-parse --short HEAD).Trim()

Write-Host "`n=== MEGA PACK 7 TO 20 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success                 = $true
    system                  = "AVOS Web Platform"
    bundle                  = "Services Platform V2 - Mega Pack 7 to 20"
    version                 = "2.20.0"
    branch                  = $ExpectedBranch
    commit                  = $commitHash
    megaPacks               = $smoke.megaPacks
    routes                  = $smoke.routes
    buildExecutions         = 1
    verificationExecutions  = 1
    smokeTestExecutions      = 1
    sharedDashboardReady    = $smoke.sharedDashboardReady
    aiDecisionEngineReady   = $smoke.aiDecisionEngineReady
    qualityScore            = $smoke.qualityScore
    healthStatus            = $smoke.healthStatus
} | Format-List
