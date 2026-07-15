param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/ecosystem-platform"
$files = @(
  "ecosystem-platform.types.ts",
  "ecosystem-platform.registry.ts",
  "ecosystem-platform.service.ts",
  "ecosystem-platform.controller.ts",
  "ecosystem-platform.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) {
    throw "Missing: $file"
  }
}

$registry = Get-Content (Join-Path $base "ecosystem-platform.registry.ts") -Raw
$service = Get-Content (Join-Path $base "ecosystem-platform.service.ts") -Raw

$checks = @{
  developer = $registry -match "DEVELOPER_PLATFORM"
  sdk = $registry -match "SDK_CENTER"
  api = $registry -match "PUBLIC_API_MANAGEMENT"
  webhooks = $registry -match "WEBHOOKS_PLATFORM"
  events = $registry -match "EVENT_BUS_FEDERATION"
  partners = $registry -match "PARTNER_PORTAL"
  identity = $registry -match "IDENTITY_FEDERATION"
  secrets = $registry -match "API_KEYS_SECRETS"
  plugins = $registry -match "PLUGIN_RUNTIME"
  connectors = $registry -match "CONNECTOR_FRAMEWORK"
  automation = $registry -match "LOW_CODE_AUTOMATION"
  marketplace = $registry -match "SOLUTION_MARKETPLACE"
  commandCenter = $registry -match "ECOSYSTEM_COMMAND_CENTER"
  registerRuntime = $service -match "registerApplication"
  credentialsRuntime = $service -match "issueCredential"
  rotateRuntime = $service -match "rotateCredential"
  executeRuntime = $service -match "execute"
  commandRuntime = $service -match "commandCenter"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count) {
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
  throw "Expected at least 30 capabilities, found $capabilityCount"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Ecosystem Platform Pack V1"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  capabilities = $capabilityCount
} | Format-List