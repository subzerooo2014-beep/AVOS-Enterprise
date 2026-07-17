param(
 [string]$BaseUrl="http://localhost:3000",
 [string]$RepoRoot="C:\Users\User\Desktop\AVOS"
)
$ErrorActionPreference="Stop"

$checks=@(
 @{name="status"; method="Get"; uri="$BaseUrl/avos/runtime/status"},
 @{name="health"; method="Get"; uri="$BaseUrl/avos/runtime/health"},
 @{name="diagnostics"; method="Get"; uri="$BaseUrl/avos/runtime/diagnostics"},
 @{name="capabilities"; method="Get"; uri="$BaseUrl/avos/runtime/capabilities"},
 @{name="events"; method="Get"; uri="$BaseUrl/avos/runtime/events"},
 @{name="jobs"; method="Get"; uri="$BaseUrl/avos/runtime/jobs"},
 @{name="approvals"; method="Get"; uri="$BaseUrl/avos/runtime/approvals"}
)

$results=@()
foreach($check in $checks){
 try{
  $response=Invoke-RestMethod -Method $check.method -Uri $check.uri -TimeoutSec 20
  $results += [ordered]@{
   name=$check.name
   success=$true
   uri=$check.uri
  }
 }catch{
  $results += [ordered]@{
   name=$check.name
   success=$false
   uri=$check.uri
   error=$_.Exception.Message
  }
 }
}

$passed=($results|Where-Object success).Count
[ordered]@{
 success=($passed -eq $results.Count)
 stage="runtime-smoke"
 tested=$results.Count
 passed=$passed
 failed=$results.Count-$passed
 results=$results
}|ConvertTo-Json -Depth 10