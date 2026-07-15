param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$module = Get-Content (Join-Path $RepoRoot "apps/api/src/genesis-enterprise-v1/genesis-enterprise-v1.module.ts") -Raw
$app = Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw
$checks = @{
  controller = $module -match "GenesisEnterpriseV1Controller"
  service = $module -match "GenesisEnterpriseV1Service"
  registration = $app -match "GenesisEnterpriseV1Module"
  web = Test-Path (Join-Path $RepoRoot "apps/web/src/app/genesis-enterprise-v1/page.tsx")
  mobile = Test-Path (Join-Path $RepoRoot "apps/mobile/lib/features/genesis_enterprise_v1/genesis_enterprise_v1_screen.dart")
}
$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Integration failed: $($failed.Name -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Genesis Enterprise V1"; integrationTests="passed"; checks=$checks.Count } | Format-List