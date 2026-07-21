param(
    [string]$ApprovedBy = "human:khalifa"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "AVOS-SDOS-Pipeline.Common.ps1")

Write-Section "AVOS SDOS Pipeline v2 — Pack 06 Review and Certification"

$repoRoot = Resolve-AvosRepoRoot
$state = Read-SdosState -RepoRoot $repoRoot

Assert-SdosGate -State $state -Gate "runtime"

$reviewUri = "$($state.baseUrl)/$($state.baseRoute)/ultimate/review"
$certifyUri = "$($state.baseUrl)/$($state.baseRoute)/ultimate/certify"

$review = Invoke-JsonEndpoint `
    -Method GET `
    -Uri $reviewUri

if ($review.status -ne "passed") {
    throw "Final Review status: $($review.status)"
}

if ([int]$review.score -ne 100) {
    throw "Final Review score: $($review.score)"
}

if (@($review.blockingIssues).Count -gt 0) {
    throw "Final Review contains blocking issues."
}

$certification = Invoke-JsonEndpoint `
    -Method POST `
    -Uri $certifyUri `
    -Body @{ approvedBy = $ApprovedBy }

if ($certification.status -ne "certified") {
    throw "Certification status: $($certification.status)"
}

if ([int]$certification.score -ne 100) {
    throw "Certification score: $($certification.score)"
}

if ($certification.approvedBy -ne $ApprovedBy) {
    throw "Certification approver mismatch."
}

$failedChecks = @(
    $certification.checks.PSObject.Properties |
        Where-Object { $_.Value -ne $true } |
        ForEach-Object { $_.Name }
)

if ($failedChecks.Count -gt 0) {
    throw "Certification checks failed: $($failedChecks -join ', ')"
}

$review |
    ConvertTo-Json -Depth 40 |
    Set-Content (Join-Path $state.reportRoot "final-review.json") -Encoding UTF8

$certification |
    ConvertTo-Json -Depth 50 |
    Set-Content (Join-Path $state.reportRoot "certification.json") -Encoding UTF8

$state.approvedBy = $ApprovedBy
$state.certificationScore = [int]$certification.score

Set-SdosGate -State $state -Gate "certified" -Value $true
Save-SdosState -RepoRoot $repoRoot -State $state

Write-Host "Certification passed with score 100." -ForegroundColor Green
Write-Host "Next: Pack 07" -ForegroundColor Cyan
