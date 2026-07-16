. "$PSScriptRoot\common.ps1"

function Complete-PackGit {
  param(
    [Parameter(Mandatory)][string]$RepoRoot,
    [Parameter(Mandatory)][string]$CommitMessage,
    [switch]$Push
  )

  Push-Location $RepoRoot
  try {
    git add --all
    if ($LASTEXITCODE -ne 0) {
      throw "git add failed."
    }

    $staged = @(git diff --cached --name-only)

    if ($staged.Count -eq 0) {
      return "NO_NEW_CHANGES"
    }

    Invoke-External `
      -Command "git" `
      -Arguments @("commit","-m",$CommitMessage) `
      -Name "Git Commit"

    if ($Push) {
      Invoke-External `
        -Command "git" `
        -Arguments @("push") `
        -Name "Git Push"
    }

    Assert-CleanGit -RepoRoot $RepoRoot
    return "COMMITTED"
  }
  finally {
    Pop-Location
  }
}