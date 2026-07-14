param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$GeneratorRoot = Join-Path $RepoRoot "tools\avos-web-pack-generator"
$required = @(
  "templates\page\page.tsx.tpl",
  "templates\component\component.tsx.tpl",
  "templates\hook\hook.ts.tpl",
  "templates\api\api.ts.tpl",
  "templates\type\types.ts.tpl",
  "templates\loading\loading.tsx.tpl",
  "templates\error\error.tsx.tpl",
  "blueprints\web-app-4-v2.json",
  "scripts\generate-v2.ps1"
)

foreach ($file in $required) {
  $path = Join-Path $GeneratorRoot $file
  if (-not (Test-Path $path)) {
    throw "Missing generator file: $path"
  }
}

[pscustomobject]@{
  success = $true
  system = "AVOS Web Pack Generator v2"
  templates = 7
  blueprints = 1
  generatorScript = $true
  healthStatus = "healthy"
}