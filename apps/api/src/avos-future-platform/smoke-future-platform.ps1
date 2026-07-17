param(
 [string]$BaseUrl="http://localhost:3000",
 [string]$RepoRoot="C:\Users\User\Desktop\AVOS"
)
$ErrorActionPreference="Stop"
$manifest=Get-Content (Join-Path $RepoRoot "apps\api\src\avos-future-platform\future-platform.manifest.json") -Raw | ConvertFrom-Json
$sample=$manifest.capabilities | Select-Object -First 12
$results=@()
foreach($item in $sample){
  $url="$BaseUrl$($item.route)/status"
  try{
    $response=Invoke-RestMethod -Method Get -Uri $url -TimeoutSec 15
    $results += [ordered]@{ capability=$item.capability; success=$true; status=$response.status }
  }catch{
    $results += [ordered]@{ capability=$item.capability; success=$false; error=$_.Exception.Message }
  }
}
$passed=($results|Where-Object success).Count
[ordered]@{
 success=($passed -eq $results.Count)
 tested=$results.Count
 passed=$passed
 failed=$results.Count-$passed
 results=$results
}|ConvertTo-Json -Depth 10