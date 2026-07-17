param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$metadata = Join-Path $RepoRoot 'apps/api/src/enterprise-metadata-layer'
$backup = Join-Path $RepoRoot '.avos/rollback/enterprise-metadata-layer-final-mega-bundle/app.module.ts.before-enterprise-metadata-layer'
$app = Join-Path $RepoRoot 'apps/api/src/app.module.ts'
Remove-Item $metadata -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path -LiteralPath $backup) { Copy-Item $backup $app -Force }
Write-Host 'AVOS Enterprise Metadata Layer rollback completed.' -ForegroundColor Green