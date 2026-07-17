param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$dependency = Join-Path $RepoRoot 'apps/api/src/enterprise-dependency-graph'
$backup = Join-Path $RepoRoot '.avos/rollback/enterprise-dependency-graph-final-mega-bundle/app.module.ts.before-enterprise-dependency-graph'
$app = Join-Path $RepoRoot 'apps/api/src/app.module.ts'
Remove-Item $dependency -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path -LiteralPath $backup) { Copy-Item $backup $app -Force }
Write-Host 'AVOS Enterprise Dependency Graph rollback completed.' -ForegroundColor Green