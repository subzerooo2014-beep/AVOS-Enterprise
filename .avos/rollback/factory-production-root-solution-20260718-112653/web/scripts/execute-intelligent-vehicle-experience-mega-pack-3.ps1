$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Set-Location $PSScriptRoot\..

Write-Host "=== AVOS Web Intelligence Build ===" -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "AVOS Web Intelligence build failed."
}

Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node ".\scripts\verify-intelligent-vehicle-experience.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Intelligent vehicle verification failed."
}

$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List

Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node ".\scripts\smoke-intelligent-vehicle-experience.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Intelligent vehicle smoke test failed."
}

$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List

Write-Host "=== MEGA PACK 3 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success = $true
    system = "AVOS Web Platform"
    megaPack = "Intelligent Vehicle Experience - Mega Pack 3"
    version = "1.3.0"
    buildExecutions = 1
    verificationExecutions = 1
    smokeTestExecutions = 1
    intelligenceCapabilities = $Smoke.intelligenceCapabilities
    plateListings = $Smoke.plateListings
    qualityScore = $Smoke.qualityScore
} | Format-List
