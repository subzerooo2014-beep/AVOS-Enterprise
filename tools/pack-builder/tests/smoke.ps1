param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$root = Join-Path $RepoRoot "tools/pack-builder"

$required = @(
  "generate.ps1",
  "engine/common.ps1",
  "engine/manifest-engine.ps1",
  "engine/template-engine.ps1",
  "engine/registration-engine.ps1",
  "engine/build-engine.ps1",
  "engine/git-engine.ps1",
  "templates/types.ts.tpl",
  "templates/registry.ts.tpl",
  "templates/service.ts.tpl",
  "templates/controller.ts.tpl",
  "templates/module.ts.tpl",
  "templates/index.ts.tpl",
  "templates/web-page.tsx.tpl",
  "templates/mobile-screen.dart.tpl",
  "manifests/example-f6.manifest.json"
)

foreach ($item in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $item))) {
    throw "Missing Pack Builder asset: $item"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Pack Builder V1"
  smokeTests = "PASS"
  requiredAssets = $required.Count
} | Format-List