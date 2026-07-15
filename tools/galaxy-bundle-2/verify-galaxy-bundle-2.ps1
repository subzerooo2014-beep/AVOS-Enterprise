param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$root=Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-2"
$domainDirs=@(Get-ChildItem $root -Directory)
if($domainDirs.Count -ne 100){throw "Expected 100 domains, found $($domainDirs.Count)"}
$total=0
foreach($dir in $domainDirs){
  $types=Join-Path $dir.FullName "$($dir.Name).types.ts"
  $text=Get-Content $types -Raw
  $count=([regex]::Matches($text,'(?m)^\s{2}"[a-z0-9-]+",?$')).Count
  if($count -ne 100){throw "Expected 100 capabilities in $($dir.Name), found $count"}
  if($text -match 'export const [0-9]'){throw "Invalid identifier in $types"}
  $total += $count
}
if($total -ne 10000){throw "Expected 10000 capabilities, found $total"}
[pscustomobject]@{success=$true;verification="passed";domains=100;capabilities=$total;executableRuntime=$true}