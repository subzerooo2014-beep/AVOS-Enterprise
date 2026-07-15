[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-factory"

$requiredFiles = @(
  "industry-factory.types.ts",
  "industry-factory.registry.ts",
  "industry-factory.service.ts",
  "industry-factory.controller.ts",
  "industry-factory.module.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content -LiteralPath (Join-Path $base "industry-factory.registry.ts") -Raw
$service = Get-Content -LiteralPath (Join-Path $base "industry-factory.service.ts") -Raw

$capabilities = @(
  "BLUEPRINT_REGISTRY",
  "SCHEMA_DESIGNER",
  "CAPABILITY_COMPOSER",
  "TEMPLATE_ENGINE",
  "CODE_GENERATOR",
  "API_GENERATOR",
  "WEB_GENERATOR",
  "MOBILE_GENERATOR",
  "TEST_GENERATOR",
  "DOCUMENTATION_GENERATOR",
  "VALIDATION_ENGINE",
  "COMPATIBILITY_ENGINE",
  "INSTALLATION_ENGINE",
  "ROLLBACK_ENGINE",
  "VERSION_MANAGER",
  "DEPENDENCY_RESOLVER",
  "MARKETPLACE_REGISTRY",
  "QUALITY_GATE",
  "RELEASE_PIPELINE",
  "FACTORY_COMMAND_CENTER"
)

foreach ($capability in $capabilities) {
  if ($registry -notmatch "(?m)^\s*$capability\s*:") {
    throw "Missing capability: $capability"
  }
}

$methods = @(
  "framework",
  "createBlueprint",
  "validateBlueprint",
  "publishBlueprint",
  "createGenerationJob",
  "executeGeneration",
  "createInstallation",
  "install",
  "rollback",
  "createMarketplaceEntry",
  "publishMarketplaceEntry",
  "listBlueprints",
  "listJobs",
  "commandCenter"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) {
    throw "Missing runtime method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Factory & Blueprint Studio V1"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  capabilities = $capabilities.Count
  runtimeMethods = $methods.Count
} | Format-List