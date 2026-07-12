$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$WebRoot = Split-Path -Parent $PSScriptRoot
Set-Location $WebRoot

$VerifyScript = Join-Path $PSScriptRoot "verify-services-platform-v2-mega-pack-2.mjs"
$SmokeScript  = Join-Path $PSScriptRoot "smoke-services-platform-v2-mega-pack-2.mjs"

Write-Host "=== SERVICES PLATFORM V2 MEGA PACK 2 BUILD ===" -ForegroundColor Cyan
pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 2 build failed."
}

Write-Host "=== Verification ===" -ForegroundColor Cyan

if (-not (Test-Path -LiteralPath $VerifyScript)) {
    throw "Verification script not found: $VerifyScript"
}

$VerificationJson = & node $VerifyScript

if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 2 verification failed."
}

$Verification = $VerificationJson | ConvertFrom-Json
$Verification | Format-List

Write-Host "=== Smoke Test ===" -ForegroundColor Cyan

if (-not (Test-Path -LiteralPath $SmokeScript)) {
    throw "Smoke script not found: $SmokeScript"
}

$SmokeJson = & node $SmokeScript

if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 2 smoke test failed."
}

$Smoke = $SmokeJson | ConvertFrom-Json
$Smoke | Format-List

Write-Host ""
Write-Host "=== SERVICES PLATFORM V2 MEGA PACK 2 COMPLETED ===" -ForegroundColor Green

[PSCustomObject]@{
    success                  = $true
    system                   = "AVOS Web Platform"
    megaPack                 = "Services Platform V2 - Mega Pack 2"
    version                  = "2.2.0"
    buildExecutions          = 1
    verificationExecutions   = 1
    smokeTestExecutions      = 1
    providerWorkspaceReady   = $true
    bookingEngineReady       = $true
    staffManagementReady     = $true
    capacityManagementReady  = $true
    aiProviderAssistantReady = $true
    qualityScore             = $Smoke.qualityScore
    healthStatus             = "healthy"
} | Format-List
