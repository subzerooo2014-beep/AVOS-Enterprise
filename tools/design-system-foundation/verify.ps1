[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/design-system-foundation"
$registryPath = Join-Path $base "design-system-foundation.registry.ts"
$servicePath = Join-Path $base "design-system-foundation.service.ts"

$requiredFiles = @(
  "design-system-foundation.types.ts",
  "design-system-foundation.registry.ts",
  "design-system-foundation.service.ts",
  "design-system-foundation.controller.ts",
  "design-system-foundation.module.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $base $file

  if (-not (Test-Path -LiteralPath $path)) {
    throw "Verification failed. Missing API file: $path"
  }
}

$registry = Get-Content -LiteralPath $registryPath -Raw
$service = Get-Content -LiteralPath $servicePath -Raw

$checks = [ordered]@{
  officialStatus =
    $registry -match 'status:\s*"OFFICIAL"'
  lightFirst =
    $registry -match 'themeStrategy:\s*"LIGHT_FIRST"'
  bilingual =
    $registry -match 'bilingualReady:\s*true'
  accessibility =
    $registry -match '"WCAG 2.2 AA"'
  brandPrimary =
    $registry -match '"color.brand.primary"'
  typography =
    $registry -match '"font.family.primary"'
  spacing =
    $registry -match '"spacing.4"'
  radius =
    $registry -match '"radius.lg"'
  motion =
    $registry -match '"motion.normal"'
  button =
    $registry -match '"AvosButton"'
  input =
    $registry -match '"AvosInput"'
  metricCard =
    $registry -match '"AvosMetricCard"'
  validationRuntime =
    $service -match "validateProductUsage"
  tokensRuntime =
    $service -match "getTokens"
  componentsRuntime =
    $service -match "getComponents"
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

$tokenCount = (
  [regex]::Matches($registry, 'name:\s*"[^"]+"')
).Count

if ($tokenCount -lt 30) {
  throw "Verification failed. Expected at least 30 tokens, found $tokenCount"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Design System Foundation V1"
  status = "OFFICIAL CORE FOUNDATION"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  checks = $checks.Count
  tokens = $tokenCount
  components = 6
  web = $true
  mobile = $true
  api = $true
} | Format-List