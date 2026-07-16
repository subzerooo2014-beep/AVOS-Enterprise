function Complete-GitAutomationV2 {
  param(
    [Parameter(Mandatory)][string]$RepoRoot,
    [Parameter(Mandatory)][string]$Message,
    [switch]$Commit,
    [switch]$Push
  )

  Push-Location $RepoRoot
  try {
    if (-not $Commit) { return "NOT_REQUESTED" }

    git add --all
    if ($LASTEXITCODE -ne 0) { throw "git add failed" }

    $staged = @(git diff --cached --name-only)
    if ($staged.Count -eq 0) { return "NO_NEW_CHANGES" }

    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { throw "git commit failed" }

    if ($Push) {
      git push
      if ($LASTEXITCODE -ne 0) { throw "git push failed" }
      return "COMMITTED_AND_PUSHED"
    }
    return "COMMITTED"
  }
  finally { Pop-Location }
}