. "$PSScriptRoot\common.ps1"

function Read-PackManifest {
  param([Parameter(Mandatory)][string]$ManifestPath)

  if (-not (Test-Path -LiteralPath $ManifestPath)) {
    throw "Manifest not found: $ManifestPath"
  }

  $manifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json

  foreach ($required in @(
    "code",
    "title",
    "moduleSlug",
    "capabilities",
    "entities"
  )) {
    if (-not $manifest.PSObject.Properties.Name.Contains($required)) {
      throw "Manifest is missing required field: $required"
    }
  }

  if ($manifest.capabilities.Count -eq 0) {
    throw "Manifest must contain at least one capability."
  }

  return $manifest
}