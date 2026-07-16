param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$root = Join-Path $RepoRoot "tools/pack-builder"
$generatorPath = Join-Path $root "generate.ps1"
$manifestPath = Join-Path $root "manifests/example-f6.manifest.json"

$tokens = $null
$errors = $null

[System.Management.Automation.Language.Parser]::ParseFile(
  $generatorPath,
  [ref]$tokens,
  [ref]$errors
) | Out-Null

if ($errors.Count -gt 0) {
  throw "Generator parser errors: $($errors.Message -join ' | ')"
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json

if ($manifest.capabilities.Count -ne 10) {
  throw "Example manifest capability count is incorrect."
}

if ($manifest.entities.Count -ne 5) {
  throw "Example manifest entity count is incorrect."
}

[pscustomobject]@{
  success = $true
  system = "AVOS Pack Builder V1"
  verification = "PASS"
  parserErrors = 0
  exampleCapabilities = $manifest.capabilities.Count
  exampleEntities = $manifest.entities.Count
} | Format-List