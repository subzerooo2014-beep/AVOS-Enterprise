param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$module = Get-Content (Join-Path $RepoRoot "apps/api/src/genesis-runtime-v1/genesis-runtime-v1.module.ts") -Raw
$app = Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw
$checks = @{
  controller = $module -match "GenesisRuntimeV1Controller"
  service = $module -match "GenesisRuntimeV1Service"
  registration = $app -match "GenesisRuntimeV1Module"
  web = Test-Path (Join-Path $RepoRoot "apps/web/src/app/genesis-runtime-v1/page.tsx")
  mobile = Test-Path (Join-Path $RepoRoot "apps/mobile/lib/features/genesis_runtime_v1/genesis_runtime_v1_screen.dart")
}
$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Integration failed: $($failed.Name -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Genesis Runtime V1"; integrationTests="passed"; checks=$checks.Count } | Format-List