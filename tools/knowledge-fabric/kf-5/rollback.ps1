param([string]$RepoRoot="C:\Users\User\Desktop\AVOS")
Set-StrictMode -Version Latest
$ErrorActionPreference="Stop"
$root=(Resolve-Path -LiteralPath $RepoRoot).Path
$knowledge=Join-Path $root "apps/api/src/knowledge-fabric"
$backup=Join-Path $root ".avos/rollback/knowledge-fabric-kf-5"
Remove-Item (Join-Path $knowledge "evolution") -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item (Join-Path $backup "knowledge-fabric.module.ts.before-kf-5") (Join-Path $knowledge "knowledge-fabric.module.ts") -Force
Copy-Item (Join-Path $backup "index.ts.before-kf-5") (Join-Path $knowledge "index.ts") -Force
Write-Host "KF-5 rollback completed." -ForegroundColor Green