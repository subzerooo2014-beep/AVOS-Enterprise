$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): services platform v2 mega pack 6"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path
$VerifyScript = Join-Path $ScriptRoot "verify-services-platform-v2-mega-pack-6.mjs"
$SmokeScript = Join-Path $ScriptRoot "smoke-services-platform-v2-mega-pack-6.mjs"

Set-Location $RepoRoot

Write-Host "=== AVOS SERVICES PLATFORM V2 - MEGA PACK 6 ===" -ForegroundColor Cyan
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
    throw "The Git index already contains staged changes."
}

if ($LASTEXITCODE -gt 1) {
    throw "Unable to inspect staged Git changes."
}

$requiredFiles = @(
    "apps/web/src/app/service-provider-performance/page.tsx",
    "apps/web/src/components/service-provider-performance/service-provider-performance-dashboard.tsx",
    "apps/web/src/components/service-provider-performance/service-provider-performance.module.css",
    "apps/web/src/data/service-provider-performance.ts",
    "apps/web/src/store/service-provider-performance-store.ts",
    "apps/web/scripts/verify-services-platform-v2-mega-pack-6.mjs",
    "apps/web/scripts/smoke-services-platform-v2-mega-pack-6.mjs",
    "apps/web/scripts/execute-services-platform-v2-mega-pack-6.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $file))) {
        throw "Required Mega Pack 6 file is missing: $file"
    }
}

Write-Host "`n=== BUILD ===" -ForegroundColor Cyan
Set-Location $WebRoot
pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 6 build failed."
}

Write-Host "`n=== VERIFICATION ===" -ForegroundColor Cyan
$verificationJson = & node $VerifyScript
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 6 verification failed."
}

$verification = $verificationJson | ConvertFrom-Json
$verification | Format-List

Write-Host "`n=== SMOKE TEST ===" -ForegroundColor Cyan
$smokeJson = & node $SmokeScript
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 6 smoke test failed."
}

$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

if (-not $verification.success -or -not $smoke.success) {
    throw "Mega Pack 6 quality gates did not pass."
}

Write-Host "`n=== GIT COMMIT ===" -ForegroundColor Cyan
Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage Mega Pack 6 files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    git reset -- $requiredFiles | Out-Null
    throw "Git whitespace validation failed. Mega Pack 6 files were unstaged."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 6 Git commit failed."
}

Write-Host "`n=== GIT PUSH ===" -ForegroundColor Cyan
git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 6 Git push failed. The local commit was preserved."
}

$commitHash = (git rev-parse --short HEAD).Trim()

Write-Host "`n=== SERVICES PLATFORM V2 MEGA PACK 6 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success                    = $true
    system                     = "AVOS Web Platform"
    megaPack                   = "Services Platform V2 - Mega Pack 6"
    version                    = "2.6.0"
    branch                     = $ExpectedBranch
    commit                     = $commitHash
    buildExecutions            = 1
    verificationExecutions     = 1
    smokeTestExecutions        = 1
    providers                  = $smoke.providers
    incidents                  = $smoke.incidents
    cities                     = $smoke.cities
    providerCommandCenterReady = $smoke.providerCommandCenterReady
    slaIntelligenceReady       = $smoke.slaIntelligenceReady
    escalationCenterReady      = $smoke.escalationCenterReady
    financialIntelligenceReady = $smoke.financialIntelligenceReady
    aiProviderDecisionReady    = $smoke.aiProviderDecisionReady
    qualityScore               = $smoke.qualityScore
    healthStatus               = $smoke.healthStatus
} | Format-List
