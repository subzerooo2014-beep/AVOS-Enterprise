[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
  [Parameter(Mandatory)][string]$BlueprintPath,
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$PackV3Root = Join-Path $RepoRoot "tools\pack-builder-v3"
$GeneratorV2 = Join-Path $RepoRoot "tools\pack-builder\generate-v2.ps1"

. (Join-Path $PackV3Root "compatibility-scanner.ps1")
. (Join-Path $PackV3Root "dependency-graph-engine.ps1")
. (Join-Path $PackV3Root "impact-analysis-engine.ps1")
. (Join-Path $PackV3Root "ai-blueprint-validator.ps1")
. (Join-Path $PackV3Root "migration-plan-generator.ps1")
. (Join-Path $PackV3Root "openapi-generator.ps1")

$blueprint = Get-Content -LiteralPath $BlueprintPath -Raw | ConvertFrom-Json

$compatibility = Test-BlueprintCompatibilityV3 -Blueprint $blueprint
if (-not $compatibility.compatible) {
  throw "Blueprint compatibility failed: $($compatibility.issues -join ', ')"
}

$aiValidation = Test-AIBlueprintV3 -Blueprint $blueprint
if (-not $aiValidation.valid) {
  throw "AI blueprint validation failed."
}

$graph = New-DependencyGraphV3 -Blueprint $blueprint
$impact = Get-ImpactAnalysisV3 -Blueprint $blueprint -RepoRoot $RepoRoot
$migration = New-MigrationPlanV3 -Blueprint $blueprint
$openapi = New-OpenApiStubV3 -Title $blueprint.title -ModuleSlug $blueprint.moduleSlug

$plan = [pscustomobject]@{
  success = $true
  system = "AVOS Genesis Engine V3"
  blueprint = $blueprint.code
  compatibility = $compatibility
  aiValidation = $aiValidation
  dependencyGraph = $graph
  impact = $impact
  migration = $migration
  openapi = $openapi
}

if ($DryRun) {
  $plan | ConvertTo-Json -Depth 30
  return
}

& $GeneratorV2 -RepoRoot $RepoRoot -BlueprintPath $BlueprintPath -AllowReplace

if (-not $?) {
  throw "Pack Builder V2 generation layer failed."
}

$evidenceRoot = Join-Path $RepoRoot "tools\genesis-engine-v3\evidence"
New-Item -ItemType Directory -Force -Path $evidenceRoot | Out-Null

[System.IO.File]::WriteAllText(
  (Join-Path $evidenceRoot "$($blueprint.code.ToLowerInvariant())-genesis-evidence.json"),
  ($plan | ConvertTo-Json -Depth 30),
  (New-Object System.Text.UTF8Encoding($false))
)

$plan | Format-List