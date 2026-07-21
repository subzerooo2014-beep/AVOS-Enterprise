param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$ApprovedBy = "human:khalifa"
)

$ErrorActionPreference = "Stop"

function Invoke-Check {
    param(
        [string]$Name,
        [scriptblock]$Action
    )

    Write-Host ""
    Write-Host "==> $Name" -ForegroundColor Cyan
    & $Action
}

Invoke-Check "Production Status" {
    $status = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/software-development-os/production/status"
    $status | Format-List

    if ($status.status -ne "operational" -or $status.score -ne 100) {
        throw "Production status verification failed."
    }
}

Invoke-Check "Production Verification" {
    $verification = Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/software-development-os/production/verify"
    $verification | Format-List

    if ($verification.score -ne 100) {
        throw "Production readiness score is not 100."
    }
}

Invoke-Check "Production Certification" {
    $body = @{ approvedBy = $ApprovedBy } | ConvertTo-Json
    $certification = Invoke-RestMethod 
        -Method Post 
        -Uri "$BaseUrl/avos/software-development-os/production/certify" 
        -ContentType "application/json" 
        -Body $body

    $certification | Format-List

    if ($certification.status -ne "certified" -or $certification.score -ne 100) {
        throw "Production certification failed."
    }
}

Write-Host ""
Write-Host "AVOS Software Development OS Production Integration smoke passed." -ForegroundColor Green
