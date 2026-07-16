$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-factory-v2/enterprise-factory-v2.module.ts",
  "apps/web/src/app/enterprise-factory-v2/page.tsx",
  "apps/mobile/lib/features/enterprise_factory_v2/enterprise_factory_v2_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Factory V2"; smoke="PASS" } | Format-List