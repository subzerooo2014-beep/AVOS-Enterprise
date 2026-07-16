$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-global-operations-g2/enterprise-global-operations-g2.module.ts",
  "apps/web/src/app/enterprise-global-operations-g2/page.tsx",
  "apps/mobile/lib/features/enterprise_global_operations_g2/enterprise_global_operations_g2_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Global Operations Mega Bundle G2"; smoke="PASS" } | Format-List