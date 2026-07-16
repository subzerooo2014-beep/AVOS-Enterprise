function Write-GeneratedFileV2 {
  param(
    [Parameter(Mandatory)][string]$Path,
    [Parameter(Mandatory)][string]$Content,
    [Parameter(Mandatory)][string]$RepoRoot,
    [Parameter(Mandatory)][string]$BackupRoot,
    [switch]$AllowReplace
  )

  if (Test-Path -LiteralPath $Path) {
    $existing = Get-Content -LiteralPath $Path -Raw
    if ($existing -eq $Content) {
      return [pscustomobject]@{ path=$Path; action="UNCHANGED" }
    }
    if (-not $AllowReplace) {
      throw "Safe merge blocked replacement of existing file: $Path"
    }

    $relative = $Path.Substring($RepoRoot.Length).TrimStart("\")
    $backup = Join-Path $BackupRoot $relative
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backup) | Out-Null
    Copy-Item -LiteralPath $Path -Destination $backup -Force
  }

  $parent = Split-Path -Parent $Path
  New-Item -ItemType Directory -Force -Path $parent | Out-Null
  [System.IO.File]::WriteAllText($Path,$Content,(New-Object System.Text.UTF8Encoding($false)))

  [pscustomobject]@{
    path = $Path
    action = if (Test-Path -LiteralPath (Join-Path $BackupRoot ($Path.Substring($RepoRoot.Length).TrimStart("\")))) { "UPDATED" } else { "CREATED" }
  }
}