param(
    [string]$BaseUrl = "http://localhost:3000",
    [switch]$UseExistingServer,
    [int]$RetryCount = 24,
    [int]$DelaySeconds = 5
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "AVOS-SDOS-Pipeline.Common.ps1")

Write-Section "AVOS SDOS Pipeline v2 — Pack 05 Runtime"

$repoRoot = Resolve-AvosRepoRoot
$state = Read-SdosState -RepoRoot $repoRoot

Assert-SdosGate -State $state -Gate "verified"

if (-not $UseExistingServer) {
    throw "Start the API in the server window, then run Pack 05 with -UseExistingServer."
}

$statusUri = "$BaseUrl/$($state.baseRoute)/ultimate/status"

$status = Wait-JsonEndpoint `
    -Uri $statusUri `
    -RetryCount $RetryCount `
    -DelaySeconds $DelaySeconds

$checks = [ordered]@{
    operationalStatus             = ($status.status -eq "operational")
    score                         = ([int]$status.score -eq 100)
    organizationOS                = ($status.organizationOS -eq $true)
    engineeringBrain              = ($status.engineeringBrain -eq $true)
    autonomousSoftwareFactory     = ($status.autonomousSoftwareFactory -eq $true)
    livingVisionIntegrated        = ($status.livingVisionIntegrated -eq $true)
    livingBlueprintIntegrated     = ($status.livingBlueprintIntegrated -eq $true)
    crossProjectLearning          = ($status.crossProjectLearning -eq $true)
    continuousSelfEvolution       = ($status.continuousSelfEvolution -eq $true)
    foundationFirst               = ($status.foundationFirst -eq $true)
    capabilityFirst               = ($status.capabilityFirst -eq $true)
    blueprintDriven               = ($status.blueprintDriven -eq $true)
    humanFinalAuthority           = ($status.humanFinalAuthority -eq $true)
    globalComplianceReadinessGate = ($status.globalComplianceReadinessGate -eq $true)
}

$failedChecks = @(
    $checks.GetEnumerator() |
        Where-Object { $_.Value -ne $true } |
        ForEach-Object { $_.Key }
)

if ($failedChecks.Count -gt 0) {
    throw "Runtime checks failed: $($failedChecks -join ', ')"
}

$status |
    ConvertTo-Json -Depth 50 |
    Set-Content (Join-Path $state.reportRoot "runtime-status.json") -Encoding UTF8

$checks |
    ConvertTo-Json -Depth 20 |
    Set-Content (Join-Path $state.reportRoot "runtime-health-checks.json") -Encoding UTF8

$state.baseUrl = $BaseUrl

Set-SdosGate -State $state -Gate "runtime" -Value $true
Save-SdosState -RepoRoot $repoRoot -State $state

Write-Host "Runtime and health checks passed." -ForegroundColor Green
Write-Host "Next: Pack 06" -ForegroundColor Cyan
