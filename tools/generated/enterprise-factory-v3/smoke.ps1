$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-factory-v3/enterprise-factory-v3.module.ts",
  "apps/web/src/app/enterprise-factory-v3/page.tsx",
  "apps/mobile/lib/features/enterprise_factory_v3/enterprise_factory_v3_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Factory V3"; smoke="PASS" } | Format-List