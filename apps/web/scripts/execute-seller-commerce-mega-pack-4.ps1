$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Set-Location $PSScriptRoot\..

Write-Host "=== AVOS Seller Commerce Build ===" -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "AVOS Seller Commerce build failed."
}

Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node ".\scripts\verify-seller-commerce.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Seller Commerce verification failed."
}

$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List

Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node ".\scripts\smoke-seller-commerce.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Seller Commerce smoke test failed."
}

$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List

Write-Host "=== MEGA PACK 4 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success = $true
    system = "AVOS Web Platform"
    megaPack = "Seller Commerce Lead Intelligence - Mega Pack 4"
    version = "1.4.0"
    buildExecutions = 1
    verificationExecutions = 1
    smokeTestExecutions = 1
    leads = $Smoke.leads
    commerceCapabilities = $Smoke.commerceCapabilities
    qualityScore = $Smoke.qualityScore
} | Format-List
