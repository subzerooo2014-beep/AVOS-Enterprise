#requires -Version 5.1
[CmdletBinding()]
param(
    [string]$ApprovedBy = "human:khalifa"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$checks = [ordered]@{}

try {
    $web = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 30
    $checks.webAvailable = $web.StatusCode -eq 200
}
catch {
    $checks.webAvailable = $false
}

try {
    $apiHealth = Invoke-RestMethod `
        -Method Get `
        -Uri "http://localhost:3000/avos/production-deployment/health" `
        -TimeoutSec 30
    $checks.apiOperational = $apiHealth.state -eq "operational"
}
catch {
    $checks.apiOperational = $false
}

try {
    $verification = Invoke-RestMethod `
        -Method Post `
        -Uri "http://localhost:3000/avos/production-deployment/verify" `
        -ContentType "application/json" `
        -Body "{}" `
        -TimeoutSec 30
    $checks.verificationPassed = $verification.status -eq "passed"
}
catch {
    $checks.verificationPassed = $false
}

try {
    $body = @{
        approvedBy = $ApprovedBy
        deploymentTarget = "local-production"
    } | ConvertTo-Json

    $certification = Invoke-RestMethod `
        -Method Post `
        -Uri "http://localhost:3000/avos/production-deployment/certification/certify" `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec 30

    $checks.certificationCertified = $certification.status -eq "certified"
    $checks.certificationScore100 = [int]$certification.score -eq 100
    $checks.zeroUnresolvedErrors = [int]$certification.unresolvedErrors -eq 0
    $checks.zeroUnjustifiedWarnings = [int]$certification.unjustifiedWarnings -eq 0
}
catch {
    $checks.certificationCertified = $false
    $checks.certificationScore100 = $false
    $checks.zeroUnresolvedErrors = $false
    $checks.zeroUnjustifiedWarnings = $false
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

[pscustomobject]@{
    name = "AVOS Local Production Runtime"
    version = "LPR-UMP1-1.0.0"
    status = if ($failed.Count -eq 0) { "passed" } else { "failed" }
    score = [math]::Round((($checks.Count - $failed.Count) / $checks.Count) * 100)
    checks = [pscustomobject]$checks
    testedAt = (Get-Date).ToUniversalTime().ToString("o")
} | Format-List

if ($failed.Count -gt 0) {
    $names = ($failed | ForEach-Object { $_.Key }) -join ", "
    throw "Local production smoke test failed: $names"
}

Write-Host ""
Write-Host "AVOS local production runtime passed with score 100." -ForegroundColor Green
