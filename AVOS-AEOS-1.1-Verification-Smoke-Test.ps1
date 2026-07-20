param(
  [string]$ApiBaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

$verification = Invoke-RestMethod `
  -Method Post `
  -Uri "$ApiBaseUrl/avos/aeos/production/verification/run" `
  -ContentType "application/json" `
  -Body "{}" `
  -TimeoutSec 60

if ($verification.version -ne "AEOS-1.1.0") {
  throw "Unexpected AEOS verification version."
}

if ($verification.status -ne "passed" -or $verification.score -ne 100) {
  throw "AEOS-1.1 verification failed."
}

if (-not $verification.checks.humanFinalAuthority) {
  throw "Human Final Authority verification failed."
}

if (-not $verification.checks.globalComplianceReadinessGate) {
  throw "Global Compliance Readiness Gate verification failed."
}

Write-Host "AEOS-1.1 Verification Smoke Test : passed" -ForegroundColor Green
Write-Host "Version                           : AEOS-1.1.0" -ForegroundColor Green
Write-Host "Score                             : 100" -ForegroundColor Green
Write-Host "Human Final Authority             : preserved" -ForegroundColor Green
Write-Host "Global Compliance Gate            : preserved" -ForegroundColor Green