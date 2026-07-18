$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$WebRoot = Split-Path -Parent $PSScriptRoot
Set-Location $WebRoot
$VerifyScript = Join-Path $PSScriptRoot "verify-services-platform-v2-mega-pack-3.mjs"
$SmokeScript = Join-Path $PSScriptRoot "smoke-services-platform-v2-mega-pack-3.mjs"
Write-Host "=== SERVICES PLATFORM V2 MEGA PACK 3 BUILD ===" -ForegroundColor Cyan
pnpm build
if ($LASTEXITCODE -ne 0) { throw "Mega Pack 3 build failed." }
Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node $VerifyScript
if ($LASTEXITCODE -ne 0) { throw "Mega Pack 3 verification failed." }
$VerificationJson | ConvertFrom-Json | Format-List
Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node $SmokeScript
if ($LASTEXITCODE -ne 0) { throw "Mega Pack 3 smoke test failed." }
$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List
Write-Host "=== SERVICES PLATFORM V2 MEGA PACK 3 COMPLETED ===" -ForegroundColor Green
[PSCustomObject]@{success=$true;system="AVOS Web Platform";megaPack="Services Platform V2 - Mega Pack 3";version="2.3.0";buildExecutions=1;verificationExecutions=1;smokeTestExecutions=1;bookingCenterReady=$Smoke.bookingCenterReady;queueManagementReady=$Smoke.queueManagementReady;rescheduleReady=$Smoke.rescheduleReady;cancellationReady=$Smoke.cancellationReady;aiQueueOptimizerReady=$Smoke.aiQueueOptimizerReady;qualityScore=$Smoke.qualityScore;healthStatus=$Smoke.healthStatus}|Format-List
