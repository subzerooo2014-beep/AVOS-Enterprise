param([string]$BaseUrl="http://127.0.0.1:3000")
$ErrorActionPreference="Stop"
function Assert($c,$m){if(-not $c){throw $m}}
$status=Invoke-RestMethod -Method Get -Uri "$BaseUrl/avos/mobility/status"
Assert ($status.status -eq "operational") "Status not operational"
Assert ($status.score -eq 100) "Status score not 100"
$verify=Invoke-RestMethod -Method Post -Uri "$BaseUrl/avos/mobility/verify"
Assert ($verify.status -eq "passed") "Verification failed"
$demo=Invoke-RestMethod -Method Post -Uri "$BaseUrl/avos/mobility/mvp/demo"
Assert ($null -ne $demo.vehicle.id) "Demo vehicle missing"
$body=@{approvedBy="human:khalifa";notes="Unified MVP Mega Pack 1"}|ConvertTo-Json
$cert=Invoke-RestMethod -Method Post -Uri "$BaseUrl/avos/mobility/certification/certify" -ContentType "application/json" -Body $body
Assert ($cert.status -eq "certified") "Certification failed"
Write-Host "AVOS Mobility Unified MVP Smoke Test passed." -ForegroundColor Green
$status|Format-List
$verify|Format-List
$cert|Format-List
