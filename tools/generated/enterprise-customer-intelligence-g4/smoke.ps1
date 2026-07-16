$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-customer-intelligence-g4/enterprise-customer-intelligence-g4.module.ts",
  "apps/web/src/app/enterprise-customer-intelligence-g4/page.tsx",
  "apps/mobile/lib/features/enterprise_customer_intelligence_g4/enterprise_customer_intelligence_g4_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Customer Intelligence Mega Bundle G4"; smoke="PASS" } | Format-List