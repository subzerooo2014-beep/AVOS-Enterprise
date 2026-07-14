param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
  [string]$Blueprint = "web-app-4-v2.json"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$GeneratorRoot = Join-Path $RepoRoot "tools\avos-web-pack-generator"
$TemplateRoot = Join-Path $GeneratorRoot "templates"
$BlueprintPath = Join-Path $GeneratorRoot "blueprints\$Blueprint"
$TargetRoot = Join-Path $RepoRoot "apps\web\src\app"

if (-not (Test-Path $BlueprintPath)) {
  throw "Missing blueprint: $BlueprintPath"
}

function To-PascalCase([string]$Value) {
  return (($Value -split '[-_\s]+' | ForEach-Object {
    if ($_.Length -eq 0) { return "" }
    $_.Substring(0,1).ToUpper() + $_.Substring(1)
  }) -join "")
}

function To-KebabCase([string]$Value) {
  return (($Value -replace '([a-z0-9])([A-Z])', '$1-$2') -replace '[_\s]+','-').ToLower()
}

function Render-Template {
  param(
    [string]$TemplatePath,
    [hashtable]$Tokens
  )

  $Content = Get-Content $TemplatePath -Raw

  foreach ($Key in $Tokens.Keys) {
    $Content = $Content.Replace("{{$Key}}", [string]$Tokens[$Key])
  }

  return $Content
}

function Write-Utf8 {
  param([string]$Path, [string]$Content)

  $Dir = Split-Path -Parent $Path
  if (-not (Test-Path -LiteralPath $Dir)) {
    New-Item -ItemType Directory -Path $Dir -Force | Out-Null
  }

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
}

$BlueprintData = Get-Content $BlueprintPath -Raw | ConvertFrom-Json

foreach ($Page in $BlueprintData.pages) {
  $Route = [string]$Page.route
  $PageComponent = To-PascalCase $Route
  $ComponentName = [string]$Page.component
  $ComponentFile = To-KebabCase $ComponentName
  $HookName = $ComponentName
  $HookFile = To-KebabCase $HookName
  $ApiName = $ComponentName
  $ApiFile = To-KebabCase $ApiName
  $TypeName = [string]$Page.type
  $PageRoot = Join-Path $TargetRoot $Route

  $Tokens = @{
    PageComponent = $PageComponent
    ComponentName = $ComponentName
    componentFile = $ComponentFile
    HookName = $HookName
    hookFile = $HookFile
    ApiName = $ApiName
    apiFile = $ApiFile
    TypeName = $TypeName
    Title = [string]$Page.title
    Description = [string]$Page.description
  }

  Write-Utf8 (Join-Path $PageRoot "page.tsx") (
    Render-Template (Join-Path $TemplateRoot "page\page.tsx.tpl") $Tokens
  )

  Write-Utf8 (Join-Path $PageRoot "loading.tsx") (
    Render-Template (Join-Path $TemplateRoot "loading\loading.tsx.tpl") $Tokens
  )

  Write-Utf8 (Join-Path $PageRoot "error.tsx") (
    Render-Template (Join-Path $TemplateRoot "error\error.tsx.tpl") $Tokens
  )

  Write-Utf8 (Join-Path $PageRoot "components\$ComponentFile.tsx") (
    Render-Template (Join-Path $TemplateRoot "component\component.tsx.tpl") $Tokens
  )

  Write-Utf8 (Join-Path $PageRoot "hooks\use-$HookFile.ts") (
    Render-Template (Join-Path $TemplateRoot "hook\hook.ts.tpl") $Tokens
  )

  Write-Utf8 (Join-Path $PageRoot "api\$ApiFile-api.ts") (
    Render-Template (Join-Path $TemplateRoot "api\api.ts.tpl") $Tokens
  )

  Write-Utf8 (Join-Path $PageRoot "types.ts") (
    Render-Template (Join-Path $TemplateRoot "type\types.ts.tpl") $Tokens
  )
}

[pscustomobject]@{
  success = $true
  system = "AVOS Web Pack Generator v2"
  blueprint = $BlueprintData.name
  generatedPages = $BlueprintData.pages.Count
  generatedFiles = $BlueprintData.pages.Count * 7
  status = "COMPLETED"
}