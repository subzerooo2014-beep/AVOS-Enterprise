param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$ManifestPath = "",
    [string]$ApprovedBy = "human:khalifa"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$RepoRoot = $PSScriptRoot
Set-Location $RepoRoot

if ([string]::IsNullOrWhiteSpace($ManifestPath)) {
    $LatestEvidence = Get-ChildItem 
        (Join-Path $RepoRoot ".avos\production-evidence") 
        -Directory 
        -ErrorAction Stop |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if ($null -eq $LatestEvidence) {
        throw "No production evidence directory was found."
    }

    $ManifestPath = Join-Path 
        $LatestEvidence.FullName 
        "manifest.json"
}

if (-not (Test-Path $ManifestPath)) {
    throw "Manifest does not exist: $ManifestPath"
}

$Manifest = Get-Content $ManifestPath -Raw |
    ConvertFrom-Json

$Imported = Invoke-RestMethod 
    -Method Post 
    -Uri "$BaseUrl/avos/production/real-evidence/manifest/import" 
    -ContentType "application/json" 
    -Body ($Manifest | ConvertTo-Json -Depth 40)

$Certification = Invoke-RestMethod 
    -Method Post 
    -Uri "$BaseUrl/avos/production/real-evidence/certify" 
    -ContentType "application/json" 
    -Body (@{
        approvedBy = $ApprovedBy
    } | ConvertTo-Json)

$Status = Invoke-RestMethod 
    -Method Get 
    -Uri "$BaseUrl/avos/production/real-evidence/status"

$FailedDomains = @()

if ($null -ne $Status.PSObject.Properties["failedDomains"]) {
    $FailedDomains = @($Status.failedDomains)
}

Write-Host ""
Write-Host "AVOS Real Production Evidence Smoke Test" 
    -ForegroundColor Cyan

Write-Host "Platform Status      : $($Status.status)"
Write-Host "Readiness Score      : $($Status.score)"
Write-Host "Verified Domains     : $($Status.verifiedDomains)/$($Status.totalDomains)"
Write-Host "Certification Status : $($Certification.status)"
Write-Host "Failed Domains       : $($FailedDomains -join ', ')"
Write-Host "Manifest Hash        : $($Status.manifestHash)"

if ($Certification.status -ne "certified") {
    exit 2
}

Write-Host "Smoke Test Passed" -ForegroundColor Green
