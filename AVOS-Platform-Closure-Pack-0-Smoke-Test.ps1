param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

Write-Host "AVOS Platform Closure Pack 0 - Smoke Test" -ForegroundColor Cyan

$status = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-0/status"

Assert-True `
    ($status.status -eq "operational") `
    "Pack 0 status is not operational."

Assert-True `
    ($status.rules.humanFinalAuthority -eq $true) `
    "Human Final Authority rule is missing."

Assert-True `
    ($status.rules.noDuplicatesBeforeInventoryReview -eq $true) `
    "No duplicates before inventory review rule is missing."

$scan = Invoke-RestMethod `
    -Method Post `
    -Uri "$BaseUrl/avos/platform-closure/pack-0/full-scan" `
    -ContentType "application/json" `
    -Body "{}"

Assert-True `
    ($scan.status -eq "completed") `
    "Full architecture scan did not complete."

Assert-True `
    ($scan.inventory.totalComponents -gt 0) `
    "Architecture inventory is empty."

Assert-True `
    ($scan.governance.humanApprovalGate -eq $true) `
    "Human Approval Gate is missing."

$health = Invoke-RestMethod `
    -Method Get `
    -Uri "$BaseUrl/avos/platform-closure/pack-0/health"

Assert-True `
    ($null -ne $health.score) `
    "Architecture health score was not returned."

Write-Host ""
Write-Host "Smoke Test Passed" -ForegroundColor Green
Write-Host ("Components : {0}" -f $scan.inventory.totalComponents)
Write-Host ("Duplicates : {0}" -f @($scan.duplicates).Count)
Write-Host ("Health     : {0} / 100" -f $health.score)
Write-Host ("Status     : {0}" -f $health.status)