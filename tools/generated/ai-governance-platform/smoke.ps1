$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/ai-governance-platform/ai-governance-platform.module.ts",
  "apps/web/src/app/ai-governance-platform/page.tsx",
  "apps/mobile/lib/features/ai_governance_platform/ai_governance_platform_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS AI Governance Platform"; smoke="PASS" } | Format-List