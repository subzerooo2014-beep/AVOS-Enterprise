param([string]$RepoRoot="C:\Users\User\Desktop\AVOS")
Set-StrictMode -Version Latest
$ErrorActionPreference="Stop"
$root=Join-Path $RepoRoot "apps/api/src/knowledge-fabric/governance"
$backup=Join-Path $RepoRoot ".avos/rollback/knowledge-fabric-kf-4"
$module=Join-Path $RepoRoot "apps/api/src/knowledge-fabric/knowledge-fabric.module.ts"
$index=Join-Path $RepoRoot "apps/api/src/knowledge-fabric/index.ts"
if(Test-Path $root){Remove-Item $root -Recurse -Force}
Copy-Item (Join-Path $backup "knowledge-fabric.module.ts.before-kf-4") $module -Force
Copy-Item (Join-Path $backup "index.ts.before-kf-4") $index -Force
Write-Host "KF-4 rollback completed." -ForegroundColor Green