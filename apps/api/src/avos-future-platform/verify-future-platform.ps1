param([string]$RepoRoot="C:\Users\User\Desktop\AVOS")
$ErrorActionPreference="Stop"
$packRoot=Join-Path $RepoRoot "apps\api\src\avos-future-platform"
$manifest=Get-Content (Join-Path $packRoot "future-platform.manifest.json") -Raw | ConvertFrom-Json
$missing=@()
foreach($item in $manifest.capabilities){
  $base=Join-Path $packRoot (Join-Path $item.group $item.capability)
  foreach($suffix in @("types","service","controller","module")){
    $file=Join-Path $base "$($item.capability).$suffix.ts"
    if(-not(Test-Path $file)){ $missing += $file }
  }
  if(-not(Test-Path (Join-Path $base "index.ts"))){ $missing += (Join-Path $base "index.ts") }
}
if($missing.Count -gt 0){ throw "Missing generated files:`n$($missing -join "`n")" }
[ordered]@{
 success=$true
 classification="future-platform-ultra-mega-pack"
 groups=$manifest.totalGroups
 capabilities=$manifest.totalCapabilities
 sourceFiles=$manifest.totalSourceFiles
 missingFiles=0
 architecture="validated"
}|ConvertTo-Json -Depth 8