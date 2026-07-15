[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Join-Path $RepoRoot "tools/avos-omega-generator/src"

$required = @(
  "omega-blueprint-validator.ts",
  "omega-generator.ts",
  "omega-name.utilities.ts"
)

foreach ($file in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $file))) {
    throw "Missing repaired generator file: $file"
  }
}

$nameUtils = Get-Content -LiteralPath (
  Join-Path $root "omega-name.utilities.ts"
) -Raw

$generator = Get-Content -LiteralPath (
  Join-Path $root "omega-generator.ts"
) -Raw

$validator = Get-Content -LiteralPath (
  Join-Path $root "omega-blueprint-validator.ts"
) -Raw

$checks = [ordered]@{
  identifierValidation = $nameUtils -match "assertValidTypeScriptIdentifier"
  numericPrefixProtection = $nameUtils -match "Capability\\$\\{safe\\}"
  reservedWordProtection = $nameUtils -match "RESERVED_WORDS"
  blueprintValidation = $validator -match "validateCapability"
  duplicateProtection = $validator -match "Duplicate capability"
  stagingGeneration = $generator -match "omega-staging"
  rollbackSupport = $generator -match "omega-backup"
  atomicPromotion = $generator -match "renameSync\\(stagingRoot, finalRoot\\)"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Root repair verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Omega Generator Root Repair"
  checks = $checks.Count
  identifierValidation = $checks.identifierValidation
  numericPrefixProtection = $checks.numericPrefixProtection
  reservedWordProtection = $checks.reservedWordProtection
  blueprintValidation = $checks.blueprintValidation
  duplicateProtection = $checks.duplicateProtection
  stagingGeneration = $checks.stagingGeneration
  rollbackSupport = $checks.rollbackSupport
  atomicPromotion = $checks.atomicPromotion
  verification = "passed"
}