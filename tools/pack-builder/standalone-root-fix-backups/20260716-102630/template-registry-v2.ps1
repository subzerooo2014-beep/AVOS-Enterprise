function Get-TemplateRegistryV2 {
  param([Parameter(Mandatory)][string]$TemplateRoot)

  $required = @(
    "entity.ts.tpl",
    "dto.ts.tpl",
    "types.ts.tpl",
    "registry.ts.tpl",
    "service.ts.tpl",
    "controller.ts.tpl",
    "module.ts.tpl",
    "index.ts.tpl",
    "web-page.tsx.tpl",
    "flutter-screen.dart.tpl",
    "test.spec.ts.tpl",
    "readme.md.tpl"
  )

  $registry = @{}

  foreach ($name in $required) {
    $path = Join-Path $TemplateRoot $name

    if (-not (Test-Path -LiteralPath $path)) {
      throw "Missing V2 template: $name"
    }

    $registry[$name] = $path
  }

  return $registry
}

function Expand-TemplateV2 {
  param(
    [Parameter(Mandatory)][string]$TemplatePath,
    [Parameter(Mandatory)][hashtable]$Tokens
  )

  $content = Get-Content -LiteralPath $TemplatePath -Raw

  foreach ($key in $Tokens.Keys) {
    $token = "{{" + $key + "}}"
    $content = $content.Replace($token, [string]$Tokens[$key])
  }

  $unresolved = [regex]::Matches(
    $content,
    '\{\{[A-Z0-9_]+\}\}'
  )

  if ($unresolved.Count -gt 0) {
    $message =
      "Unresolved template token(s) in " +
      $TemplatePath +
      ": " +
      ($unresolved.Value -join ", ")

    throw $message
  }

  return $content
}