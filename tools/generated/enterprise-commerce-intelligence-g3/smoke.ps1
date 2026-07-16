$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-commerce-intelligence-g3/enterprise-commerce-intelligence-g3.module.ts",
  "apps/web/src/app/enterprise-commerce-intelligence-g3/page.tsx",
  "apps/mobile/lib/features/enterprise_commerce_intelligence_g3/enterprise_commerce_intelligence_g3_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Commerce Intelligence Mega Bundle G3"; smoke="PASS" } | Format-List