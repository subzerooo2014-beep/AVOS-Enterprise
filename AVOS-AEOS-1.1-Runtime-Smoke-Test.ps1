param(
  [string]$ApiBaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

$status = Invoke-RestMethod -Method Get -Uri "$ApiBaseUrl/avos/aeos/production/status"
if ($status.version -ne "AEOS-1.1.0") {
  throw "AEOS-1.1 status test failed."
}

$telemetry = Invoke-RestMethod `
  -Method Post `
  -Uri "$ApiBaseUrl/avos/aeos/production/telemetry" `
  -ContentType "application/json" `
  -Body (@{
    unit = "unified-runtime-platform"
    healthy = $true
    latencyMs = 120
    errorRate = 0
    throughput = 100
    capacityUsed = 0.42
    slaTargetMs = 1000
  } | ConvertTo-Json)

if ($telemetry.health.score -ne 100) {
  throw "AEOS-1.1 telemetry health test failed."
}

$verification = Invoke-RestMethod `
  -Method Post `
  -Uri "$ApiBaseUrl/avos/aeos/production/verification/run" `
  -ContentType "application/json" `
  -Body "{}"

if ($verification.status -ne "passed" -or $verification.score -ne 100) {
  throw "AEOS-1.1 verification test failed."
}

$certificate = Invoke-RestMethod `
  -Method Post `
  -Uri "$ApiBaseUrl/avos/aeos/production/certification/certify" `
  -ContentType "application/json" `
  -Body (@{ approvedBy = "human:khalifa" } | ConvertTo-Json)

if ($certificate.status -ne "certified" -or $certificate.score -ne 100) {
  throw "AEOS-1.1 certification test failed."
}

Write-Host "AEOS-1.1 Runtime Smoke Test : passed" -ForegroundColor Green
Write-Host "Status                      : operational" -ForegroundColor Green
Write-Host "Verification                : passed" -ForegroundColor Green
Write-Host "Certification               : certified" -ForegroundColor Green