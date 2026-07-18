$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Set-Location $PSScriptRoot\..

Write-Host "=== AVOS MEGA GROUP A BUILD ===" -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "Mega Group A build failed."
}

Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node ".\scripts\verify-mega-group-a.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Mega Group A verification failed."
}

$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List

Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node ".\scripts\smoke-mega-group-a.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Mega Group A smoke test failed."
}

$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List

Write-Host "=== MEGA GROUP A COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success = $true
    system = "AVOS Web Platform"
    megaGroup = "Mega Group A - Packs 7-10"
    version = "1.10.0"
    buildExecutions = 1
    verificationExecutions = 1
    smokeTestExecutions = 1
    auctions = $Smoke.auctions
    parts = $Smoke.parts
    rentals = $Smoke.rentals
    groupCapabilities = $Smoke.groupCapabilities
    qualityScore = $Smoke.qualityScore
} | Format-List
