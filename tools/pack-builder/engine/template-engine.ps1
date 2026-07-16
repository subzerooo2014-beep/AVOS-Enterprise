. "$PSScriptRoot\common.ps1"

function Expand-PackTemplate {
  param(
    [Parameter(Mandatory)][string]$TemplatePath,
    [Parameter(Mandatory)][hashtable]$Tokens
  )

  if (-not (Test-Path -LiteralPath $TemplatePath)) {
    throw "Template not found: $TemplatePath"
  }

  $content = Get-Content -LiteralPath $TemplatePath -Raw

  foreach ($key in $Tokens.Keys) {
    $content = $content.Replace("{{$key}}", [string]$Tokens[$key])
  }

  $unresolved = [regex]::Matches($content, '\{\{[A-Z0-9_]+\}\}')

  if ($unresolved.Count -gt 0) {
    $tokens = @($unresolved.Value | Sort-Object -Unique)
    throw "Unresolved template tokens: $($tokens -join ', ')"
  }

  return $content
}