param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$Root = "$BaseUrl/avos/enterprise-intelligence-mesh"

Write-Host "1. Status"
$Status = Invoke-RestMethod -Method Get -Uri "$Root/status"
$Status | Format-List

Write-Host "2. Execute governed mesh request"
$Body = @{
    route = "decision"
    action = "evaluate"
    payload = @{
        subject = "Select the best inventory action"
        warehouse = "DXB-01"
    }
    context = @{
        source = "pack-9-smoke-test"
        priority = "critical"
        identity = @{
            actorId = "Khalifa"
            actorType = "human"
            roles = @("owner", "critical-operations")
        }
        metadata = @{
            test = $true
        }
    }
} | ConvertTo-Json -Depth 10

$Result = Invoke-RestMethod `
    -Method Post `
    -Uri "$Root/execute" `
    -ContentType "application/json" `
    -Body $Body

$Result | Format-List
$RequestId = $Result.requestId

Write-Host "3. Read request trace"
Invoke-RestMethod -Method Get -Uri "$Root/requests/$RequestId" | ConvertTo-Json -Depth 20

Write-Host "4. Final review"
Invoke-RestMethod -Method Post -Uri "$Root/final-review/run" | Format-List

Write-Host "5. Certification"
Invoke-RestMethod -Method Post -Uri "$Root/certification/certify" | Format-List