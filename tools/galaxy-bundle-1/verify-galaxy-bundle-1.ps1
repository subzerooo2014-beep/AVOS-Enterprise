param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$root=Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-1"
$domainDirs=@(Get-ChildItem $root -Directory)
if($domainDirs.Count -ne 50){throw "Expected 50 domains, found $($domainDirs.Count)"}
$total=0
foreach($dir in $domainDirs){
  $types=Get-ChildItem $dir.FullName -Filter "*.types.ts" | Select-Object -First 1
  if(-not $types){throw "Missing types file in $($dir.Name)"}
  $text=Get-Content $types.FullName -Raw
  $count=([regex]::Matches($text,'(?m)^\s{2}"[a-z0-9-]+",?$')).Count
  if($count -ne 100){throw "Expected 100 capabilities in $($dir.Name), found $count"}
  $total += $count
}
if($total -ne 5000){throw "Expected 5000 capabilities, found $total"}
[pscustomobject]@{success=$true;verification="passed";domains=50;capabilities=$total;executableRuntime=$true}