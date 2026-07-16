$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-intelligence-layer/enterprise-intelligence-layer.module.ts",
  "apps/web/src/app/enterprise-intelligence-layer/page.tsx",
  "apps/mobile/lib/features/enterprise_intelligence_layer/enterprise_intelligence_layer_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Intelligence Layer"; smoke="PASS" } | Format-List