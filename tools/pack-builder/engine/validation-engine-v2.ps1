function Test-PowerShellFilesV2 {
  param([Parameter(Mandatory)][string]$Root)

  $errors = New-Object System.Collections.Generic.List[object]
  Get-ChildItem -LiteralPath $Root -Recurse -Filter *.ps1 | ForEach-Object {
    $tokens = $null
    $parseErrors = $null
    [System.Management.Automation.Language.Parser]::ParseFile($_.FullName,[ref]$tokens,[ref]$parseErrors) | Out-Null
    foreach ($e in @($parseErrors)) {
      $errors.Add([pscustomobject]@{ file=$_.FullName; message=$e.Message })
    }
  }

  if ($errors.Count -gt 0) {
    $errors | Format-Table -AutoSize | Out-Host
    throw "PowerShell parser validation failed."
  }
  return $true
}

function Assert-GeneratedPackV2 {
  param(
    [Parameter(Mandatory)][string]$RepoRoot,
    [Parameter(Mandatory)][string]$ModuleSlug
  )

  $mobile = $ModuleSlug.Replace("-","_")
  $required = @(
    "apps/api/src/$ModuleSlug/$ModuleSlug.module.ts",
    "apps/api/src/$ModuleSlug/$ModuleSlug.controller.ts",
    "apps/api/src/$ModuleSlug/$ModuleSlug.service.ts",
    "apps/api/src/$ModuleSlug/$ModuleSlug.types.ts",
    "apps/api/src/$ModuleSlug/$ModuleSlug.registry.ts",
    "apps/api/src/$ModuleSlug/index.ts",
    "apps/web/src/app/$ModuleSlug/page.tsx",
    "apps/mobile/lib/features/$mobile/${mobile}_screen.dart",
    "apps/mobile/lib/features/$mobile/${mobile}.dart",
    "docs/generated/$ModuleSlug/README.md",
    "tools/generated/$ModuleSlug/smoke.ps1",
    "tools/generated/$ModuleSlug/verify.ps1",
    "tools/generated/$ModuleSlug/integration.ps1"
  )

  $missing = @($required | Where-Object { -not (Test-Path -LiteralPath (Join-Path $RepoRoot $_)) })
  if ($missing.Count -gt 0) { throw "Generated pack missing files: $($missing -join ', ')" }
  return $required
}