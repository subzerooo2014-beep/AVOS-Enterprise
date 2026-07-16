. "$PSScriptRoot\common.ps1"

function Invoke-PackValidation {
  param([Parameter(Mandatory)][string]$RepoRoot)

  Invoke-External `
    -Command "pnpm" `
    -Arguments @(
      "--dir",
      (Join-Path $RepoRoot "apps/api"),
      "exec",
      "tsc",
      "--noEmit"
    ) `
    -Name "API TypeScript"

  Invoke-External `
    -Command "pnpm" `
    -Arguments @("build") `
    -Name "Workspace Build"

  Push-Location (Join-Path $RepoRoot "apps/mobile")
  try {
    Invoke-External `
      -Command "flutter" `
      -Arguments @("analyze") `
      -Name "Flutter Analyze"
  }
  finally {
    Pop-Location
  }
}