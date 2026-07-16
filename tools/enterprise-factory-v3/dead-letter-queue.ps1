[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
  [Parameter(Mandatory)][string]$JobId,
  [Parameter(Mandatory)][string]$ErrorMessage
)

$queueRoot = Join-Path $RepoRoot "tools\enterprise-factory-v3\runtime\dead-letter"
New-Item -ItemType Directory -Force -Path $queueRoot | Out-Null

$record = [pscustomobject]@{
  jobId = $JobId
  error = $ErrorMessage
  recordedAt = (Get-Date).ToString("o")
  status = "DEAD_LETTER"
}

$path = Join-Path $queueRoot ($JobId + ".json")

[System.IO.File]::WriteAllText(
  $path,
  ($record | ConvertTo-Json -Depth 10),
  (New-Object System.Text.UTF8Encoding($false))
)

$record | Format-List