$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Set-Location $PSScriptRoot\..

Write-Host "=== AVOS Buyer Experience Build ===" -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "AVOS Buyer Experience build failed."
}

Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node ".\scripts\verify-buyer-messaging-booking.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Buyer Experience verification failed."
}

$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List

Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node ".\scripts\smoke-buyer-messaging-booking.mjs"

if ($LASTEXITCODE -ne 0) {
    throw "Buyer Experience smoke test failed."
}

$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List

Write-Host "=== MEGA PACK 5 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success = $true
    system = "AVOS Web Platform"
    megaPack = "Buyer Messaging Booking - Mega Pack 5"
    version = "1.5.0"
    buildExecutions = 1
    verificationExecutions = 1
    smokeTestExecutions = 1
    conversations = $Smoke.conversations
    bookings = $Smoke.bookings
    activities = $Smoke.activities
    buyerCapabilities = $Smoke.buyerCapabilities
    qualityScore = $Smoke.qualityScore
} | Format-List
