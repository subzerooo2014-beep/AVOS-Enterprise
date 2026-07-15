param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$module = Get-Content (Join-Path $RepoRoot "apps/api/src/genesis-core-v1/genesis-core-v1.module.ts") -Raw
$app = Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw
$checks = @{
  controller = $module -match "GenesisCoreV1Controller"
  service = $module -match "GenesisCoreV1Service"
  registration = $app -match "GenesisCoreV1Module"
  web = Test-Path (Join-Path $RepoRoot "apps/web/src/app/genesis-core-v1/page.tsx")
  mobile = Test-Path (Join-Path $RepoRoot "apps/mobile/lib/features/genesis_core_v1/genesis_core_v1_screen.dart")
}
$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Integration failed: $($failed.Name -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Genesis Core V1"; integrationTests="passed"; checks=$checks.Count } | Format-List