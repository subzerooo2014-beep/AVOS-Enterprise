$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
Set-Location $PSScriptRoot\..
Write-Host "=== SERVICES PLATFORM V2 MEGA PACK 2 BUILD ===" -ForegroundColor Cyan
pnpm build
if ($LASTEXITCODE -ne 0) { throw "Mega Pack 2 build failed." }
Write-Host "=== Verification ===" -ForegroundColor Cyan
$VerificationJson = & node ".\scriptserify-services-platform-v2-mega-pack-2.mjs"
if ($LASTEXITCODE -ne 0) { throw "Mega Pack 2 verification failed." }
$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List
Write-Host "=== Smoke Test ===" -ForegroundColor Cyan
$SmokeJson = & node ".\scripts\smoke-services-platform-v2-mega-pack-2.mjs"
if ($LASTEXITCODE -ne 0) { throw "Mega Pack 2 smoke test failed." }
$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List
Write-Host "=== SERVICES PLATFORM V2 MEGA PACK 2 COMPLETED ===" -ForegroundColor Green
[PSCustomObject]@{success=$true;system="AVOS Web Platform";megaPack="Services Platform V2 - Mega Pack 2";version="2.2.0";buildExecutions=1;verificationExecutions=1;smokeTestExecutions=1;branches=$Smoke.branches;staff=$Smoke.staff;bookings=$Smoke.bookings;providerWorkspaceReady=$Smoke.providerWorkspaceReady;bookingEngineReady=$Smoke.bookingEngineReady;staffManagementReady=$Smoke.staffManagementReady;capacityManagementReady=$Smoke.capacityManagementReady;aiProviderAssistantReady=$Smoke.aiProviderAssistantReady;qualityScore=$Smoke.qualityScore;healthStatus=$Smoke.healthStatus}|Format-List
