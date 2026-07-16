$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/enterprise-knowledge-memory-g7/enterprise-knowledge-memory-g7.module.ts",
  "apps/web/src/app/enterprise-knowledge-memory-g7/page.tsx",
  "apps/mobile/lib/features/enterprise_knowledge_memory_g7/enterprise_knowledge_memory_g7_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Knowledge and Memory Mega Bundle G7"; smoke="PASS" } | Format-List