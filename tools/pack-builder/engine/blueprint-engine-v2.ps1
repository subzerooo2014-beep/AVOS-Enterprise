function Read-BlueprintV2 {
  param([Parameter(Mandatory)][string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) { throw "Blueprint not found: $Path" }
  $bp = Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json

  foreach ($required in @("schemaVersion","code","title","moduleSlug","capabilities","entities","targets")) {
    if ($null -eq $bp.$required) { throw "Blueprint missing required property: $required" }
  }

  if ([string]$bp.schemaVersion -ne "2.0") { throw "Unsupported blueprint schemaVersion: $($bp.schemaVersion)" }
  if (@($bp.capabilities).Count -eq 0) { throw "Blueprint capabilities cannot be empty." }
  if (@($bp.entities).Count -eq 0) { throw "Blueprint entities cannot be empty." }

  return $bp
}

function Get-BlueprintExecutionPlanV2 {
  param([Parameter(Mandatory)]$Blueprint)

  $outputs = New-Object System.Collections.Generic.List[string]
  if ($Blueprint.targets.api) {
    $outputs.Add("apps/api/src/$($Blueprint.moduleSlug)")
  }
  if ($Blueprint.targets.web) {
    $outputs.Add("apps/web/src/app/$($Blueprint.moduleSlug)")
  }
  if ($Blueprint.targets.flutter) {
    $outputs.Add("apps/mobile/lib/features/$($Blueprint.moduleSlug.Replace('-','_'))")
  }
  if ($Blueprint.targets.tests) {
    $outputs.Add("tools/generated/$($Blueprint.moduleSlug)")
  }
  if ($Blueprint.targets.docs) {
    $outputs.Add("docs/generated/$($Blueprint.moduleSlug)")
  }

  [pscustomobject]@{
    code = $Blueprint.code
    moduleSlug = $Blueprint.moduleSlug
    capabilities = @($Blueprint.capabilities).Count
    entities = @($Blueprint.entities).Count
    outputs = $outputs
  }
}