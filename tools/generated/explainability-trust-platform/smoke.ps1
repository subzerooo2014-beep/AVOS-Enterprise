$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/explainability-trust-platform/explainability-trust-platform.module.ts",
  "apps/web/src/app/explainability-trust-platform/page.tsx",
  "apps/mobile/lib/features/explainability_trust_platform/explainability_trust_platform_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Explainability and Trust Platform"; smoke="PASS" } | Format-List