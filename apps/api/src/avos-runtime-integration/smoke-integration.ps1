param([string]$BaseUrl="http://localhost:3000")
$ErrorActionPreference="Stop"

$checks=@(
 @{name="integration-status"; uri="$BaseUrl/avos/runtime-integration/status"},
 @{name="integration-health"; uri="$BaseUrl/avos/runtime-integration/health"},
 @{name="integration-validation"; uri="$BaseUrl/avos/runtime-integration/validation"},
 @{name="kernel"; uri="$BaseUrl/avos/runtime-integration/kernel"},
 @{name="records"; uri="$BaseUrl/avos/runtime-integration/records?namespace=capabilities"},
 @{name="runtime-status"; uri="$BaseUrl/avos/runtime/status"},
 @{name="runtime-health"; uri="$BaseUrl/avos/runtime/health"}
)

$results=@()
foreach($check in $checks){
 try{
  $response=Invoke-RestMethod -Method Get -Uri $check.uri -TimeoutSec 20
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
 stage="runtime-integration-smoke"
 tested=$results.Count
 passed=$passed
 failed=$results.Count-$passed
 results=$results
}|ConvertTo-Json -Depth 10