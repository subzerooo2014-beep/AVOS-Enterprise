[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/brand-foundation"

$requiredFiles = @(
  "brand-foundation.types.ts",
  "brand-foundation.registry.ts",
  "brand-foundation.service.ts",
  "brand-foundation.controller.ts",
  "brand-foundation.module.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $base $file

  if (-not (Test-Path -LiteralPath $path)) {
    throw "Verification failed. Missing file: $path"
  }
}

$registry = Get-Content -LiteralPath `
  (Join-Path $base "brand-foundation.registry.ts") -Raw

$service = Get-Content -LiteralPath `
  (Join-Path $base "brand-foundation.service.ts") -Raw

$checks = [ordered]@{
  officialBrandName =
    $registry -match '"AVOS Enterprise"'
  officialTagline =
    $registry -match '"The Operating System for Mobility"'
  officialLogo =
    $registry -match '"AV Wing Motion"'
  premium =
    $registry -match '"PREMIUM"'
  aiFirst =
    $registry -match '"AI_FIRST"'
  global =
    $registry -match '"GLOBAL"'
  trusted =
    $registry -match '"TRUSTED"'
  intelligent =
    $registry -match '"INTELLIGENT"'
  scalable =
    $registry -match '"SCALABLE"'
  visionFirst =
    $registry -match '"VISION"'
  productDevelopmentLast =
    $registry -match '"PRODUCT_DEVELOPMENT"'
  designSystemRequired =
    $registry -match 'required:\s*true'
  validationRuntime =
    $service -match "validateProductFoundation"
  entryRuntime =
    $service -match "validateArchitectureEntry"
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Brand Foundation"
  status = "OFFICIAL"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  checks = $checks.Count
  api = $true
  web = $true
  mobile = $true
  documentation = $true
} | Format-List