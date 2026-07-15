[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/ultimate-platform-completion"

$requiredFiles = @(
  "ultimate-platform-completion.types.ts",
  "ultimate-platform-completion.registry.ts",
  "ultimate-platform-completion.service.ts",
  "ultimate-platform-completion.controller.ts",
  "ultimate-platform-completion.module.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $base $file

  if (-not (Test-Path -LiteralPath $path)) {
    throw "Verification failed. Missing file: $path"
  }
}

$registry = Get-Content -LiteralPath `
  (Join-Path $base "ultimate-platform-completion.registry.ts") -Raw

$service = Get-Content -LiteralPath `
  (Join-Path $base "ultimate-platform-completion.service.ts") -Raw

$checks = [ordered]@{
  digitalTwin =
    $registry -match "ENTERPRISE_DIGITAL_TWIN"
  simulation =
    $registry -match "SIMULATION_CENTER"
  research =
    $registry -match "AI_RESEARCH_LAB"
  innovation =
    $registry -match "INNOVATION_MARKETPLACE"
  portfolio =
    $registry -match "STRATEGIC_PORTFOLIO_MANAGER"
  investment =
    $registry -match "ENTERPRISE_INVESTMENT_ANALYZER"
  executive =
    $registry -match "EXECUTIVE_COCKPIT"
  board =
    $registry -match "BOARD_INTELLIGENCE"
  planning =
    $registry -match "CORPORATE_PLANNING_CENTER"
  missionControl =
    $registry -match "ENTERPRISE_MISSION_CONTROL"
  transformation =
    $registry -match "TRANSFORMATION_OFFICE"
  ultimateCommand =
    $registry -match "ULTIMATE_COMMAND_CENTER"
  createRuntime =
    $service -match "createPortfolioItem"
  scenarioRuntime =
    $service -match "createScenario"
  scorecardRuntime =
    $service -match "recordScorecard"
  completionRuntime =
    $service -match "completePortfolioItem"
  commandRuntime =
    $service -match "commandCenter"
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

$capabilityCount = (
  [regex]::Matches(
    $registry,
    '^[ ]{2}[A-Z_]+:\s*\{',
    "Multiline"
  )
).Count

if ($capabilityCount -lt 30) {
  throw "Verification failed. Expected at least 30 capabilities, found $capabilityCount"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Ultimate Platform Completion Bundle V1"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  checks = $checks.Count
  capabilities = $capabilityCount
} | Format-List