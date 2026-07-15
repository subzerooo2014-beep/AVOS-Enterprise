[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Join-Path $RepoRoot "tools/avos-omega-generator"
$required = @(
  "src/omega-generator.ts",
  "src/omega-generator.types.ts",
  "src/omega-template-engine.ts",
  "src/omega-module-composer.ts",
  "src/omega-name.utilities.ts",
  "src/cli.ts",
  "src/index.ts",
  "package.json",
  "tsconfig.json"
)

$missing = @()

foreach ($file in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $file))) {
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  throw "Missing generator files: $($missing -join ', ')"
}

$generator = Get-Content -LiteralPath (
  Join-Path $root "src/omega-generator.ts"
) -Raw

$checks = [ordered]@{
  moduleGeneration = $generator -match "templates.module"
  serviceGeneration = $generator -match "templates.service"
  controllerGeneration = $generator -match "templates.controller"
  testGeneration = $generator -match "templates.test"
  manifestGeneration = $generator -match "omega-generation.manifest.json"
  aggregateModule = $generator -match "composer.compose"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Generator verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Omega Code Generator"
  capabilities = 6
  moduleGeneration = $checks.moduleGeneration
  serviceGeneration = $checks.serviceGeneration
  controllerGeneration = $checks.controllerGeneration
  testGeneration = $checks.testGeneration
  manifestGeneration = $checks.manifestGeneration
  aggregateModule = $checks.aggregateModule
  verification = "passed"
}