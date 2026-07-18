$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Set-Location $PSScriptRoot\..

Write-Host "=== AVOS Web Marketplace Build ===" -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "AVOS Web Marketplace build failed."
}

Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node ".\scripts\verify-marketplace.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Marketplace verification failed."
}

$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List

Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node ".\scripts\smoke-marketplace.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Marketplace smoke test failed."
}

$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List

Write-Host "=== MEGA PACK 2 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success = $true
    system = "AVOS Web Platform"
    megaPack = "Vehicle Marketplace Core - Mega Pack 2"
    version = "1.2.0"
    buildExecutions = 1
    verificationExecutions = 1
    smokeTestExecutions = 1
    vehicles = $Smoke.vehicles
    qualityScore = $Smoke.qualityScore
} | Format-List
