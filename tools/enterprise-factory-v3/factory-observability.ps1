[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$generatedRoot = Join-Path $RepoRoot "tools\generated"
$manifestRoot = Join-Path $RepoRoot "tools\pack-builder\manifests"
$factoryRoot = Join-Path $RepoRoot "tools\enterprise-factory-v3"

[pscustomobject]@{
  generatedModules = if (Test-Path $generatedRoot) {
    @(Get-ChildItem $generatedRoot -Directory).Count
  } else { 0 }
  blueprints = if (Test-Path $manifestRoot) {
    @(Get-ChildItem $manifestRoot -File -Filter "*.json").Count
  } else { 0 }
  runtimeScripts = if (Test-Path $factoryRoot) {
    @(Get-ChildItem $factoryRoot -File -Filter "*.ps1").Count
  } else { 0 }
  measuredAt = (Get-Date).ToString("o")
} | Format-List