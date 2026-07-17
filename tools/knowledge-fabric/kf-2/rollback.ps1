param([string]$RepoRoot="C:\Users\User\Desktop\AVOS")
Set-StrictMode -Version Latest
$ErrorActionPreference="Stop"
$runtime=Join-Path $RepoRoot "apps/api/src/knowledge-fabric/runtime"
$backup=Join-Path $RepoRoot ".avos/rollback/knowledge-fabric-kf-2"
$module=Join-Path $RepoRoot "apps/api/src/knowledge-fabric/knowledge-fabric.module.ts"
$index=Join-Path $RepoRoot "apps/api/src/knowledge-fabric/index.ts"
if(Test-Path $runtime){Remove-Item $runtime -Recurse -Force}
Copy-Item (Join-Path $backup "knowledge-fabric.module.ts.before-kf-2") $module -Force
Copy-Item (Join-Path $backup "index.ts.before-kf-2") $index -Force
Write-Host "KF-2 rollback completed." -ForegroundColor Green