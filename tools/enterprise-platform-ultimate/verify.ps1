param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/enterprise-platform-ultimate"

$files = @(
  "enterprise-platform-ultimate.types.ts",
  "enterprise-platform-ultimate.registry.ts",
  "enterprise-platform-ultimate.service.ts",
  "enterprise-platform-ultimate.controller.ts",
  "enterprise-platform-ultimate.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path -LiteralPath (Join-Path $base $file))) {
    throw "Missing file: $file"
  }
}

$registry = Get-Content -LiteralPath (Join-Path $base "enterprise-platform-ultimate.registry.ts") -Raw
$service = Get-Content -LiteralPath (Join-Path $base "enterprise-platform-ultimate.service.ts") -Raw

$domains = @(
  "AI_AGENTS_OS",
  "KNOWLEDGE_DIGITAL_TWIN",
  "AUTOMATION_OS",
  "SECURITY_OS",
  "CLOUD_OS",
  "MARKETPLACE_OS"
)

foreach ($domain in $domains) {
  if ($registry -notmatch "(?m)^\s*$domain\s*:") {
    throw "Missing domain: $domain"
  }
}

$methods = @(
  "framework",
  "registerCapability",
  "activateCapability",
  "execute",
  "registerPolicy",
  "publishMarketplaceItem",
  "listCapabilities",
  "commandCenter"
)

foreach ($method in $methods) {
  if ($service -notmatch $method) {
    throw "Missing runtime method: $method"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Enterprise Platform Ultimate Bundle V1"
  verification = "passed"
  requiredFiles = $files.Count
  domains = $domains.Count
  runtimeMethods = $methods.Count
} | Format-List