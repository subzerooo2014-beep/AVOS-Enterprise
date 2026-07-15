[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-pack-integration"

$requiredFiles = @(
  "industry-pack-integration.types.ts",
  "industry-pack-integration.registry.ts",
  "industry-pack-integration.service.ts",
  "industry-pack-integration.controller.ts",
  "industry-pack-integration.module.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content -LiteralPath (Join-Path $base "industry-pack-integration.registry.ts") -Raw
$service = Get-Content -LiteralPath (Join-Path $base "industry-pack-integration.service.ts") -Raw

$packs = @(
  "AUTOMOTIVE",
  "HEAVY_EQUIPMENT",
  "INDUSTRY_MEGA_BUNDLE_1",
  "INDUSTRY_ULTRA_BUNDLE_2_3",
  "INDUSTRY_ULTRA_BUNDLE_4_5"
)

foreach ($pack in $packs) {
  if ($registry -notmatch "(?m)^\s*$pack\s*:") {
    throw "Missing pack catalog entry: $pack"
  }
}

$methods = @(
  "catalog",
  "discoverPack",
  "recordCompatibility",
  "createAdapter",
  "activateAdapter",
  "createMigration",
  "executeMigration",
  "listPacks",
  "listAdapters",
  "listMigrations",
  "commandCenter"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) {
    throw "Missing runtime method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Pack Integration & Migration V1"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  sourcePacks = $packs.Count
  runtimeMethods = $methods.Count
} | Format-List