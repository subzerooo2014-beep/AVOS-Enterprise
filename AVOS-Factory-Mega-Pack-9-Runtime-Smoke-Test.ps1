$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$BaseUrl = "http://localhost:3000"
$RuntimeUrl = "$BaseUrl/avos/factory/runtime"
$PluginUrl = "$BaseUrl/avos/factory/plugins"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " AVOS Factory Mega Pack 9 - Runtime Smoke Test" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

function Invoke-AvosGet {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Uri
  )

  Invoke-RestMethod `
    -Method Get `
    -Uri $Uri `
    -ContentType "application/json"
}

function Invoke-AvosPost {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Uri,

    [Parameter(Mandatory = $true)]
    [hashtable]$Body
  )

  Invoke-RestMethod `
    -Method Post `
    -Uri $Uri `
    -ContentType "application/json" `
    -Body ($Body | ConvertTo-Json -Depth 20)
}

# ============================================================================
# API Availability
# ============================================================================

try {
  $PluginStatus =
    Invoke-AvosGet "$PluginUrl/status"
}
catch {
  throw @"
AVOS API is not reachable at $BaseUrl.

Start the server in the Server Terminal first:

cd C:\Users\User\Desktop\AVOS\apps\api
pnpm start:dev
"@
}

if (-not $PluginStatus.healthy) {
  throw "Generator Plugin Registry is not healthy."
}

if ([int]$PluginStatus.plugins -lt 1) {
  throw "No generator plugins are registered."
}

Write-Host "Plugin registry healthy." -ForegroundColor Green
Write-Host "Registered plugins: $($PluginStatus.plugins)" -ForegroundColor Green
Write-Host ""

# ============================================================================
# Runtime Status
# ============================================================================

$RuntimeStatus =
  Invoke-AvosGet "$RuntimeUrl/status"

if (-not $RuntimeStatus.healthy) {
  throw "Generator Execution Runtime is not healthy."
}

Write-Host "Runtime status:" -ForegroundColor Cyan

$RuntimeStatus |
  Format-List

# ============================================================================
# Execute Foundation Generator
# ============================================================================

$ExecutionRequest = @{
  pluginId = "avos.foundation-generator"
  target = "typescript"
  input = @{
    name = "AVOS Runtime Smoke Foundation"
    description =
      "Mega Pack 9 runtime execution verification."
    version = "1.0.0"
  }
  metadata = @{
    source = "mega-pack-9-smoke-test"
    requestedBy = "human:khalifa"
    humanFinalAuthority = $true
  }
}

Write-Host ""
Write-Host "Executing generator plugin..." -ForegroundColor Cyan

$Execution =
  Invoke-AvosPost `
    "$RuntimeUrl/execute" `
    $ExecutionRequest

$Execution |
  Format-List

if (-not $Execution.executionId) {
  throw "Runtime execution did not return an executionId."
}

if (-not $Execution.success) {
  $Errors = @($Execution.errors) -join ", "
  throw "Runtime execution failed: $Errors"
}

$ExecutionId = [string]$Execution.executionId

# ============================================================================
# Execution Details
# ============================================================================

$ExecutionDetails =
  Invoke-AvosGet `
    "$RuntimeUrl/executions/$ExecutionId"

if (
  [string]$ExecutionDetails.executionId -ne
  $ExecutionId
) {
  throw "Execution history lookup returned the wrong execution."
}

# ============================================================================
# Runtime History
# ============================================================================

$History =
  Invoke-AvosGet "$RuntimeUrl/history?limit=20"

$HistoryRecords = @($History)

$RecordedExecution =
  $HistoryRecords |
  Where-Object {
    [string]$_.executionId -eq $ExecutionId
  } |
  Select-Object -First 1

if (-not $RecordedExecution) {
  throw "Successful execution was not found in runtime history."
}

# ============================================================================
# Runtime Metrics
# ============================================================================

$Metrics =
  Invoke-AvosGet "$RuntimeUrl/metrics"

$TotalExecutions = 0
$SuccessfulExecutions = 0

if (
  $null -ne $Metrics.totalExecutions
) {
  $TotalExecutions =
    [int]$Metrics.totalExecutions
}

if (
  $null -ne $Metrics.successfulExecutions
) {
  $SuccessfulExecutions =
    [int]$Metrics.successfulExecutions
}

if ($TotalExecutions -lt 1) {
  throw "Runtime metrics did not record the execution."
}

if ($SuccessfulExecutions -lt 1) {
  throw "Runtime metrics did not record a successful execution."
}

# ============================================================================
# Final Smoke Report
# ============================================================================

$SmokeReport = [ordered]@{
  success = $true
  system =
    "AVOS Factory Generator Execution Runtime"
  megaPack = 9
  pluginRegistryHealthy =
    [bool]$PluginStatus.healthy
  registeredPlugins =
    [int]$PluginStatus.plugins
  runtimeHealthy =
    [bool]$RuntimeStatus.healthy
  executionId =
    $ExecutionId
  executionSuccessful =
    [bool]$Execution.success
  historyRecorded =
    [bool]($null -ne $RecordedExecution)
  metricsRecorded =
    ($TotalExecutions -ge 1)
  totalExecutions =
    $TotalExecutions
  successfulExecutions =
    $SuccessfulExecutions
  failedExecutions =
    [int]$Metrics.failedExecutions
  humanFinalAuthority =
    $true
  verifiedAt =
    (Get-Date).ToString("o")
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " Mega Pack 9 Runtime Smoke Test Passed" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

$SmokeReport |
  Format-List

Write-Host ""
Write-Host "AVOS Factory Mega Pack 9 completed successfully." -ForegroundColor Green

