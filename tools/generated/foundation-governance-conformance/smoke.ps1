$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/foundation-governance-conformance/foundation-governance-conformance.module.ts",
  "apps/web/src/app/foundation-governance-conformance/page.tsx",
  "apps/mobile/lib/features/foundation_governance_conformance/foundation_governance_conformance_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Foundation Governance and Conformance"; smoke="PASS" } | Format-List