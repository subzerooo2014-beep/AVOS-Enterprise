[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
  [Parameter(Mandatory)][string[]]$BlueprintPaths,
  [ValidateRange(1,8)][int]$MaxParallel = 2
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$generator = Join-Path $RepoRoot "tools\pack-builder\generate-v2.ps1"

if (-not (Test-Path -LiteralPath $generator)) {
  throw "Pack Builder generator not found."
}

$queue = [System.Collections.Queue]::new()

foreach ($path in $BlueprintPaths) {
  $queue.Enqueue($path)
}

$results = New-Object System.Collections.Generic.List[object]

while ($queue.Count -gt 0) {
  $batch = New-Object System.Collections.Generic.List[string]

  while ($queue.Count -gt 0 -and $batch.Count -lt $MaxParallel) {
    $batch.Add([string]$queue.Dequeue())
  }

  foreach ($blueprint in $batch) {
    try {
      & $generator `
        -RepoRoot $RepoRoot `
        -BlueprintPath $blueprint `
        -AllowReplace

      $results.Add([pscustomobject]@{
        blueprint = $blueprint
        status = "COMPLETED"
      })
    }
    catch {
      $results.Add([pscustomobject]@{
        blueprint = $blueprint
        status = "FAILED"
        error = $_.Exception.Message
      })

      throw
    }
  }
}

$results | Format-Table -AutoSize