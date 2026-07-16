$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-ecosystem-marketplace-g9/enterprise-ecosystem-marketplace-g9.module.ts",
  "apps/web/src/app/enterprise-ecosystem-marketplace-g9/page.tsx",
  "apps/mobile/lib/features/enterprise_ecosystem_marketplace_g9/enterprise_ecosystem_marketplace_g9_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Ecosystem and Marketplace Mega Bundle G9"; smoke="PASS" } | Format-List