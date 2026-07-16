[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$JobId,
  [Parameter(Mandatory)][string]$WorkerId,
  [ValidateRange(1,3600)][int]$LeaseSeconds = 300
)

$lease = [pscustomobject]@{
  id = [guid]::NewGuid().ToString("N")
  jobId = $JobId
  workerId = $WorkerId
  acquiredAt = (Get-Date).ToString("o")
  expiresAt = (Get-Date).AddSeconds($LeaseSeconds).ToString("o")
  active = $true
}

$lease | Format-List