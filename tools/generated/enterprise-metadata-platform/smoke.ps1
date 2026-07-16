$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-metadata-platform/enterprise-metadata-platform.module.ts",
  "apps/web/src/app/enterprise-metadata-platform/page.tsx",
  "apps/mobile/lib/features/enterprise_metadata_platform/enterprise_metadata_platform_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Metadata Platform"; smoke="PASS" } | Format-List