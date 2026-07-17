param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$memory = Join-Path $RepoRoot 'apps/api/src/memory-architecture'
$backup = Join-Path $RepoRoot '.avos/rollback/memory-architecture-final-mega-bundle/app.module.ts.before-memory-architecture'
$app = Join-Path $RepoRoot 'apps/api/src/app.module.ts'
Remove-Item $memory -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path -LiteralPath $backup) { Copy-Item $backup $app -Force }
Write-Host 'AVOS Memory Architecture rollback completed.' -ForegroundColor Green