[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
  [Parameter(Mandatory)][string]$BlueprintPath,
  [switch]$DryRun,
  [switch]$AllowReplace
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$EngineRoot = Join-Path $PSScriptRoot "engine"
$TemplateRoot = Join-Path $PSScriptRoot "templates-v2"

. (Join-Path $EngineRoot "blueprint-engine-v2.ps1")
. (Join-Path $EngineRoot "safe-merge-engine-v2.ps1")
. (Join-Path $EngineRoot "template-registry-v2.ps1")
. (Join-Path $EngineRoot "validation-engine-v2.ps1")

function Pascal([string]$v) {
  (($v -split '[-_\s]+' | Where-Object { $_ }) | ForEach-Object {
    $_.Substring(0,1).ToUpperInvariant() + $_.Substring(1).ToLowerInvariant()
  }) -join ''
}

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$BlueprintPath = (Resolve-Path -LiteralPath $BlueprintPath).Path
$bp = Read-BlueprintV2 -Path $BlueprintPath
$plan = Get-BlueprintExecutionPlanV2 -Blueprint $bp
$registry = Get-TemplateRegistryV2 -TemplateRoot $TemplateRoot

if ($DryRun) {
  $plan | Format-List
  return
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $PSScriptRoot "backups\generation-$stamp"
$moduleSlug = [string]$bp.moduleSlug
$pascal = Pascal $moduleSlug
$mobileSlug = $moduleSlug.Replace("-","_")

$capUnion = (@($bp.capabilities) | ForEach-Object { "  | `"$_`"" }) -join "`r`n"
$capRegistry = (@($bp.capabilities) | ForEach-Object {
  $label = (Get-Culture).TextInfo.ToTitleCase(($_ -replace "_"," ").ToLowerInvariant())
  "  $_`: `"$label`","
}) -join "`r`n"
$webCaps = (@($bp.capabilities) | ForEach-Object {
  $label = (Get-Culture).TextInfo.ToTitleCase(($_ -replace "_"," ").ToLowerInvariant())
  "  `"$label`","
}) -join "`r`n"
$flutterCaps = (@($bp.capabilities) | ForEach-Object {
  $label = (Get-Culture).TextInfo.ToTitleCase(($_ -replace "_"," ").ToLowerInvariant())
  "    `"$label`","
}) -join "`r`n"

$entityExports = New-Object System.Collections.Generic.List[string]
$dtoExports = New-Object System.Collections.Generic.List[string]
$generated = New-Object System.Collections.Generic.List[object]

$tokens = @{
  TITLE = [string]$bp.title
  CODE = [string]$bp.code
  MODULE_SLUG = $moduleSlug
  PASCAL = $pascal
  MODULE_NAME = "${pascal}Module"
  CONTROLLER_NAME = "${pascal}Controller"
  SERVICE_NAME = "${pascal}Service"
  TYPE_NAME = "${pascal}Capability"
  RECORD_NAME = "${pascal}Record"
  REGISTRY_NAME = "$($moduleSlug.Replace('-','_').ToUpperInvariant())_CAPABILITIES"
  MOBILE_CLASS = "${pascal}Screen"
  CAPABILITY_UNION = $capUnion
  CAPABILITY_REGISTRY = $capRegistry
  WEB_CAPABILITIES = $webCaps
  FLUTTER_CAPABILITIES = $flutterCaps
  CAPABILITY_COUNT = @($bp.capabilities).Count
  ENTITY_COUNT = @($bp.entities).Count
  ENTITY_NAMES_JSON = (@($bp.entities.name) | ConvertTo-Json -Compress)
}

$apiRoot = Join-Path $RepoRoot "apps/api/src/$moduleSlug"
$webRoot = Join-Path $RepoRoot "apps/web/src/app/$moduleSlug"
$mobileRoot = Join-Path $RepoRoot "apps/mobile/lib/features/$mobileSlug"
$docsRoot = Join-Path $RepoRoot "docs/generated/$moduleSlug"
$toolsRoot = Join-Path $RepoRoot "tools/generated/$moduleSlug"

foreach ($entity in @($bp.entities)) {
  $entityName = Pascal ([string]$entity.name)
  $entitySlug = ([string]$entity.name -replace '([a-z0-9])([A-Z])','$1-$2').ToLowerInvariant()
  $fields = New-Object System.Collections.Generic.List[string]
  $dtoFields = New-Object System.Collections.Generic.List[string]

  foreach ($field in @($entity.fields)) {
    $optional = if ($field.required -eq $false) { "?" } else { "" }
    $tsType = switch ([string]$field.type) {
      "number" { "number" }
      "boolean" { "boolean" }
      "date" { "string" }
      "json" { "Record<string, unknown>" }
      default { "string" }
    }
    $fields.Add("  $($field.name)$optional`: $tsType;")
    if ($field.required -eq $false) { $dtoFields.Add("  @IsOptional()") }
    $dtoFields.Add("  @IsString()")
    $dtoFields.Add("  $($field.name)$optional`: string;")
  }

  $entityTokens = $tokens.Clone()
  $entityTokens.ENTITY_NAME = $entityName
  $entityTokens.ENTITY_FIELDS = $fields -join "`r`n"
  $entityTokens.DTO_FIELDS = $dtoFields -join "`r`n"

  $entityPath = Join-Path $apiRoot "entities/$entitySlug.entity.ts"
  $dtoPath = Join-Path $apiRoot "dto/$entitySlug.dto.ts"

  $generated.Add((Write-GeneratedFileV2 -Path $entityPath -Content (Expand-TemplateV2 $registry["entity.ts.tpl"] $entityTokens) -RepoRoot $RepoRoot -BackupRoot $backupRoot -AllowReplace:$AllowReplace))
  $generated.Add((Write-GeneratedFileV2 -Path $dtoPath -Content (Expand-TemplateV2 $registry["dto.ts.tpl"] $entityTokens) -RepoRoot $RepoRoot -BackupRoot $backupRoot -AllowReplace:$AllowReplace))

  $entityExports.Add("export * from `"./entities/$entitySlug.entity`";")
  $dtoExports.Add("export * from `"./dto/$entitySlug.dto`";")
}

$tokens.ENTITY_EXPORTS = $entityExports -join "`r`n"
$tokens.DTO_EXPORTS = $dtoExports -join "`r`n"

$fileMap = @(
  @("types.ts.tpl", (Join-Path $apiRoot "$moduleSlug.types.ts")),
  @("registry.ts.tpl", (Join-Path $apiRoot "$moduleSlug.registry.ts")),
  @("service.ts.tpl", (Join-Path $apiRoot "$moduleSlug.service.ts")),
  @("controller.ts.tpl", (Join-Path $apiRoot "$moduleSlug.controller.ts")),
  @("module.ts.tpl", (Join-Path $apiRoot "$moduleSlug.module.ts")),
  @("index.ts.tpl", (Join-Path $apiRoot "index.ts")),
  @("test.spec.ts.tpl", (Join-Path $apiRoot "$moduleSlug.service.spec.ts")),
  @("web-page.tsx.tpl", (Join-Path $webRoot "page.tsx")),
  @("flutter-screen.dart.tpl", (Join-Path $mobileRoot "${mobileSlug}_screen.dart")),
  @("readme.md.tpl", (Join-Path $docsRoot "README.md"))
)

foreach ($mapping in $fileMap) {
  $generated.Add((Write-GeneratedFileV2 `
    -Path $mapping[1] `
    -Content (Expand-TemplateV2 -TemplatePath $registry[$mapping[0]] -Tokens $tokens) `
    -RepoRoot $RepoRoot `
    -BackupRoot $backupRoot `
    -AllowReplace:$AllowReplace))
}

$generated.Add((Write-GeneratedFileV2 `
  -Path (Join-Path $mobileRoot "${mobileSlug}.dart") `
  -Content "export `"${mobileSlug}_screen.dart`";`r`n" `
  -RepoRoot $RepoRoot `
  -BackupRoot $backupRoot `
  -AllowReplace:$AllowReplace))

$smoke = @"
`$ErrorActionPreference = "Stop"
`$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent `$PSScriptRoot))
`$required = @(
  "apps/api/src/$moduleSlug/$moduleSlug.module.ts",
  "apps/web/src/app/$moduleSlug/page.tsx",
  "apps/mobile/lib/features/$mobileSlug/${mobileSlug}_screen.dart"
)
`$missing = @(`$required | Where-Object { -not (Test-Path (Join-Path `$root `$_)) })
if (`$missing.Count -gt 0) { throw "Smoke missing: `$(`$missing -join ', ')" }
[pscustomobject]@{ success=`$true; system="$($bp.title)"; smoke="PASS"; required=`$required.Count } | Format-List
"@

$verify = @"
`$ErrorActionPreference = "Stop"
`$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent `$PSScriptRoot))
`$app = Get-Content (Join-Path `$root "apps/api/src/app.module.ts") -Raw
if (`$app -notmatch "$($tokens.MODULE_NAME)") { throw "Module registration missing." }
`$status = Get-Content (Join-Path `$root "apps/api/src/$moduleSlug/$moduleSlug.service.ts") -Raw
if (`$status -notmatch "AVOS Pack Builder V2") { throw "Generator marker missing." }
[pscustomobject]@{ success=`$true; system="$($bp.title)"; verification="PASS"; capabilities=$(@($bp.capabilities).Count); entities=$(@($bp.entities).Count) } | Format-List
"@

$integration = @"
`$ErrorActionPreference = "Stop"
`$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent `$PSScriptRoot))
& (Join-Path `$PSScriptRoot "smoke.ps1")
& (Join-Path `$PSScriptRoot "verify.ps1")
[pscustomobject]@{ success=`$true; system="$($bp.title)"; integration="PASS" } | Format-List
"@

foreach ($item in @(
  @("smoke.ps1",$smoke),
  @("verify.ps1",$verify),
  @("integration.ps1",$integration)
)) {
  $generated.Add((Write-GeneratedFileV2 -Path (Join-Path $toolsRoot $item[0]) -Content $item[1] -RepoRoot $RepoRoot -BackupRoot $backupRoot -AllowReplace:$AllowReplace))
}

$evidence = [pscustomobject]@{
  generator = "AVOS Pack Builder V2"
  generatedAt = (Get-Date).ToString("o")
  blueprint = $bp
  plan = $plan
  generated = $generated
}
Write-GeneratedFileV2 `
  -Path (Join-Path $docsRoot "generation-evidence.json") `
  -Content ($evidence | ConvertTo-Json -Depth 30) `
  -RepoRoot $RepoRoot `
  -BackupRoot $backupRoot `
  -AllowReplace:$AllowReplace | Out-Null

[pscustomobject]@{
  success = $true
  system = "AVOS Pack Builder V2"
  generatedPack = $bp.title
  module = $moduleSlug
  capabilities = @($bp.capabilities).Count
  entities = @($bp.entities).Count
  files = $generated.Count
  backupRoot = $backupRoot
} | Format-List