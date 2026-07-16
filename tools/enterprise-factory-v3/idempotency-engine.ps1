[CmdletBinding()]
param(
  [string]$RepoRoot = "C:\Users\User\Desktop\AVOS",
  [Parameter(Mandatory)][string]$IdempotencyKey
)

$storeRoot = Join-Path $RepoRoot "tools\enterprise-factory-v3\runtime\idempotency"
New-Item -ItemType Directory -Force -Path $storeRoot | Out-Null

$recordPath = Join-Path $storeRoot ($IdempotencyKey + ".json")

if (Test-Path -LiteralPath $recordPath) {
  Get-Content -LiteralPath $recordPath -Raw
  return
}

$record = [pscustomobject]@{
  key = $IdempotencyKey
  status = "ACQUIRED"
  createdAt = (Get-Date).ToString("o")
}

[System.IO.File]::WriteAllText(
  $recordPath,
  ($record | ConvertTo-Json -Depth 10),
  (New-Object System.Text.UTF8Encoding($false))
)

$record | Format-List