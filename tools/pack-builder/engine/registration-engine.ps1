. "$PSScriptRoot\common.ps1"

function Register-NestModule {
  param(
    [Parameter(Mandatory)][string]$AppModulePath,
    [Parameter(Mandatory)][string]$ModuleName,
    [Parameter(Mandatory)][string]$ImportPath
  )

  $content = Get-Content -LiteralPath $AppModulePath -Raw
  $escaped = [regex]::Escape($ModuleName)
  $importLine = "import { $ModuleName } from `"$ImportPath`";"

  if ($content -notmatch "(?m)^import \{ $escaped \} from ") {
    $lastImport = [regex]::Matches(
      $content,
      '(?m)^import\s.+?;\s*$'
    ) | Select-Object -Last 1

    if (-not $lastImport) {
      throw "Cannot locate imports in app.module.ts"
    }

    $content = $content.Insert(
      $lastImport.Index + $lastImport.Length,
      "`r`n$importLine"
    )
  }

  if ($content -notmatch "(?m)^\s*$escaped,\s*$") {
    $match = [regex]::Match(
      $content,
      '(?s)(@Module\s*\(\s*\{.*?\bimports\s*:\s*\[)(.*?)(\])'
    )

    if (-not $match.Success) {
      throw "Cannot locate imports array in app.module.ts"
    }

    $body = $match.Groups[2].Value.TrimEnd()
    if ($body -and -not $body.EndsWith(",")) {
      $body += ","
    }

    $replacement =
      $match.Groups[1].Value +
      $body +
      "`r`n    $ModuleName,`r`n  " +
      $match.Groups[3].Value

    $content =
      $content.Substring(0,$match.Index) +
      $replacement +
      $content.Substring($match.Index + $match.Length)
  }

  Write-Utf8 -Path $AppModulePath -Content $content
}