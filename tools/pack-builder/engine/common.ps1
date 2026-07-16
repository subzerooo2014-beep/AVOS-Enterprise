Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Utf8 {
  param(
    [Parameter(Mandatory)][string]$Path,
    [Parameter(Mandatory)][string]$Content
  )

  $parent = Split-Path -Parent $Path
  if ($parent) {
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
  }

  [System.IO.File]::WriteAllText(
    $Path,
    $Content,
    (New-Object System.Text.UTF8Encoding($false))
  )
}

function Convert-ToPascalCase {
  param([Parameter(Mandatory)][string]$Value)

  return (($Value -split '[-_\s]+' | Where-Object { $_ }) | ForEach-Object {
    $_.Substring(0,1).ToUpperInvariant() + $_.Substring(1).ToLowerInvariant()
  }) -join ''
}

function Assert-CleanGit {
  param([Parameter(Mandatory)][string]$RepoRoot)

  Push-Location $RepoRoot
  try {
    $status = @(git status --porcelain)
    if ($LASTEXITCODE -ne 0) {
      throw "Unable to read Git status."
    }

    if ($status.Count -gt 0) {
      git status --short | Out-Host
      throw "Working tree must be clean."
    }
  }
  finally {
    Pop-Location
  }
}

function Invoke-External {
  param(
    [Parameter(Mandatory)][string]$Command,
    [Parameter(Mandatory)][string[]]$Arguments,
    [Parameter(Mandatory)][string]$Name
  )

  & $Command @Arguments | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "$Name failed with exit code $LASTEXITCODE"
  }
}