$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Set-Location $PSScriptRoot\..

Write-Host "=== AVOS Services Platform V2 - Mega Pack 1 Build ===" -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "Services Platform V2 Mega Pack 1 build failed."
}

Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node ".\scripts\verify-services-platform-v2-mega-pack-1.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Services Platform V2 Mega Pack 1 verification failed."
}

$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List

Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node ".\scripts\smoke-services-platform-v2-mega-pack-1.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Services Platform V2 Mega Pack 1 smoke test failed."
}

$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List

Write-Host "=== SERVICES PLATFORM V2 MEGA PACK 1 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success = $true
    system = "AVOS Web Platform"
    megaPack = "Services Platform V2 - Mega Pack 1"
    version = "2.1.0"
    buildExecutions = 1
    verificationExecutions = 1
    smokeTestExecutions = 1
    services = $Smoke.services
    categories = $Smoke.categories
    smartSearchReady = $Smoke.smartSearchReady
    aiRecommendationsReady = $Smoke.aiRecommendationsReady
    advancedFiltersReady = $Smoke.advancedFiltersReady
    intelligentSortingReady = $Smoke.intelligentSortingReady
    qualityScore = $Smoke.qualityScore
    healthStatus = $Smoke.healthStatus
} | Format-List
