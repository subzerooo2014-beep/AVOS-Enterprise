param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$Root = "$BaseUrl/avos/platform/control-plane"

Write-Host "1. Status"
$Status = Invoke-RestMethod -Method Get -Uri "$Root/status"
$Status | Format-List

Write-Host "2. Environments"
$Environments = Invoke-RestMethod -Method Get -Uri "$Root/environments"
$Environments | Format-Table id, name, kind, region, status

$Development = $Environments | Where-Object { $_.kind -eq "development" } | Select-Object -First 1
if (-not $Development) {
    throw "Development environment was not found."
}

Write-Host "3. Register platform resource"
$ResourceBody = @{
    id = "platform-pack-1a-smoke-resource"
    name = "Platform Pack 1A Smoke Resource"
    kind = "service"
    version = "1.0.0"
    environmentId = $Development.id
    status = "running"
    owner = "AVOS"
    dependencies = @("enterprise-intelligence-mesh")
    endpoints = @("/smoke/platform-pack-1a")
    tags = @("smoke-test", "platform")
    metadata = @{
        test = $true
    }
} | ConvertTo-Json -Depth 10

try {
    $Resource = Invoke-RestMethod `
        -Method Post `
        -Uri "$Root/resources?actorId=Khalifa" `
        -ContentType "application/json" `
        -Body $ResourceBody
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        $Resource = Invoke-RestMethod `
            -Method Get `
            -Uri "$Root/resources/platform-pack-1a-smoke-resource"
    }
    else {
        throw
    }
}

$Resource | Format-List

Write-Host "4. Set configuration"
$ConfigBody = @{
    namespace = "platform"
    key = "pack1a.smoke.enabled"
    value = $true
    environmentId = $Development.id
    sensitive = $false
    description = "Platform Pack 1A smoke-test configuration."
    updatedBy = "Khalifa"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Method Post `
    -Uri "$Root/configurations" `
    -ContentType "application/json" `
    -Body $ConfigBody | Format-List

Write-Host "5. Dependency graph"
$Graph = Invoke-RestMethod -Method Get -Uri "$Root/dependency-graph"
$Graph | ConvertTo-Json -Depth 10

Write-Host "6. Health"
Invoke-RestMethod -Method Get -Uri "$Root/health" | Format-List

Write-Host "7. Final review"
Invoke-RestMethod -Method Post -Uri "$Root/final-review/run" | Format-List

Write-Host "8. Certification"
Invoke-RestMethod -Method Post -Uri "$Root/certification/certify" | Format-List