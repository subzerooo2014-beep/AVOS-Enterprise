[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

$generatedRoot = Join-Path $RepoRoot "tools\generated"
$manifestRoot = Join-Path $RepoRoot "tools\pack-builder\manifests"

$generatedModules = if (Test-Path -LiteralPath $generatedRoot) {
  @(Get-ChildItem -LiteralPath $generatedRoot -Directory).Count
}
else {
  0
}

$blueprints = if (Test-Path -LiteralPath $manifestRoot) {
  @(Get-ChildItem -LiteralPath $manifestRoot -File -Filter "*.json").Count
}
else {
  0
}

[pscustomobject]@{
  generatedModules = $generatedModules
  blueprints = $blueprints
  measuredAt = (Get-Date).ToString("o")
} | Format-List