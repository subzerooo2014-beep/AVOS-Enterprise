$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Set-Location $PSScriptRoot\..

Write-Host "=== AVOS Ecosystem Build ===" -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "AVOS Ecosystem build failed."
}

Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node ".\scripts\verify-services-dealers-ads.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Ecosystem verification failed."
}

$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List

Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node ".\scripts\smoke-services-dealers-ads.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Ecosystem smoke test failed."
}

$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List

Write-Host "=== MEGA PACK 6 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success = $true
    system = "AVOS Web Platform"
    megaPack = "Services Dealers Ads Ecosystem - Mega Pack 6"
    version = "1.6.0"
    buildExecutions = 1
    verificationExecutions = 1
    smokeTestExecutions = 1
    services = $Smoke.services
    providers = $Smoke.providers
    campaigns = $Smoke.campaigns
    ecosystemCapabilities = $Smoke.ecosystemCapabilities
    qualityScore = $Smoke.qualityScore
} | Format-List
