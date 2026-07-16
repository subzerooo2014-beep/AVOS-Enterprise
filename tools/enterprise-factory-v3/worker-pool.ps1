[CmdletBinding()]
param(
  [ValidateRange(1,32)][int]$WorkerCount = 4,
  [ValidateRange(1,100)][int]$CapacityPerWorker = 5
)

$workers = 1..$WorkerCount | ForEach-Object {
  [pscustomobject]@{
    id = "worker-$_"
    status = "READY"
    capacity = $CapacityPerWorker
    heartbeat = (Get-Date).ToString("o")
  }
}

$workers | Format-Table -AutoSize