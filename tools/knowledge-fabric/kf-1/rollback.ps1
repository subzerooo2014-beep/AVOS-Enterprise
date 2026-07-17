[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location $RepoRoot

$knowledgeRoot = Join-Path $RepoRoot "apps/api/src/knowledge-fabric"
$toolsRoot = Join-Path $RepoRoot "tools/knowledge-fabric/kf-1"
$backupRoot = Join-Path $RepoRoot ".avos/rollback/knowledge-fabric-kf-1"
$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$appModuleBackup = Join-Path $backupRoot "app.module.ts.before-kf-1"

Write-Host "Rolling back AVOS Knowledge Fabric KF-1..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $appModuleBackup) {
    Copy-Item -LiteralPath $appModuleBackup -Destination $appModulePath -Force
}

if (Test-Path -LiteralPath $knowledgeRoot) {
    Remove-Item -LiteralPath $knowledgeRoot -Recurse -Force
}

Write-Host "KF-1 rollback completed. Capability Fabric remains preserved." -ForegroundColor Green

if (Test-Path -LiteralPath $toolsRoot) {
    Remove-Item -LiteralPath $toolsRoot -Recurse -Force
}

if (Test-Path -LiteralPath $backupRoot) {
    Remove-Item -LiteralPath $backupRoot -Recurse -Force
}