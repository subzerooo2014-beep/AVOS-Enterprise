param(
    [string]$BaseUrl = "http://localhost:3000"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ControlRoot = "$BaseUrl/avos/platform/control-plane"
$Root = "$BaseUrl/avos/platform/dependency-topology"

function Ensure-Resource(
    [string]$Id,
    [string]$Name,
    [string]$EnvironmentId
) {
    $Body = @{
        id = $Id
        name = $Name
        kind = "service"
        version = "1.0.0"
        environmentId = $EnvironmentId
        status = "registered"
        owner = "AVOS"
        dependencies = @()
        endpoints = @("/smoke/$Id")
        tags = @("smoke-test", "platform", "pack-2")
        metadata = @{
            pack = "2"
        }
    } | ConvertTo-Json -Depth 10

    try {
        return Invoke-RestMethod `
            -Method Post `
            -Uri "$ControlRoot/resources?actorId=Khalifa" `
            -ContentType "application/json" `
            -Body $Body
    }
    catch {
        $StatusCode = $null
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $StatusCode = [int]$_.Exception.Response.StatusCode
        }

        if ($StatusCode -eq 409) {
            return Invoke-RestMethod `
                -Method Get `
                -Uri "$ControlRoot/resources/$Id"
        }

        throw
    }
}

function Ensure-Dependency(
    [string]$Source,
    [string]$Target
) {
    $Existing = Invoke-RestMethod -Method Get -Uri "$Root/dependencies"
    $Found = $Existing | Where-Object {
        $_.sourceServiceId -eq $Source -and
        $_.targetServiceId -eq $Target -and
        $_.type -eq "required"
    } | Select-Object -First 1

    if ($Found) {
        return $Found
    }

    $Body = @{
        sourceServiceId = $Source
        targetServiceId = $Target
        type = "required"
        status = "active"
        metadata = @{
            smokeTest = $true
        }
    } | ConvertTo-Json -Depth 10

    return Invoke-RestMethod `
        -Method Post `
        -Uri "$Root/dependencies?actorId=Khalifa" `
        -ContentType "application/json" `
        -Body $Body
}

Write-Host "1. Status"
Invoke-RestMethod -Method Get -Uri "$Root/status" | Format-List

Write-Host "2. Resolve development environment"
$Environments = Invoke-RestMethod -Method Get -Uri "$ControlRoot/environments"
$Development = $Environments |
    Where-Object { $_.kind -eq "development" } |
    Select-Object -First 1

if (-not $Development) {
    throw "Development environment was not found."
}

Write-Host "3. Register smoke resources"
Ensure-Resource "platform-pack-2-database" "Pack 2 Database" $Development.id | Format-List
Ensure-Resource "platform-pack-2-event-bus" "Pack 2 Event Bus" $Development.id | Format-List
Ensure-Resource "platform-pack-2-ai-core" "Pack 2 AI Core" $Development.id | Format-List
Ensure-Resource "platform-pack-2-marketplace" "Pack 2 Marketplace" $Development.id | Format-List

Write-Host "4. Register dependencies"
Ensure-Dependency "platform-pack-2-event-bus" "platform-pack-2-database" | Format-List
Ensure-Dependency "platform-pack-2-ai-core" "platform-pack-2-event-bus" | Format-List
Ensure-Dependency "platform-pack-2-marketplace" "platform-pack-2-ai-core" | Format-List

Write-Host "5. Dependency graph"
Invoke-RestMethod -Method Get -Uri "$Root/graph" |
    ConvertTo-Json -Depth 10

Write-Host "6. Validation"
$Validation = Invoke-RestMethod -Method Post -Uri "$Root/validate"
$Validation | Format-List

if ($Validation.status -ne "passed" -or $Validation.score -ne 100) {
    throw "Dependency validation failed. Status=$($Validation.status), Score=$($Validation.score)"
}

Write-Host "7. Startup plan"
$Startup = Invoke-RestMethod -Method Get -Uri "$Root/plans/startup"
$Startup | ConvertTo-Json -Depth 10

if (-not $Startup.valid) {
    throw "Startup plan is invalid."
}

Write-Host "8. Shutdown plan"
$Shutdown = Invoke-RestMethod -Method Get -Uri "$Root/plans/shutdown"
$Shutdown | ConvertTo-Json -Depth 10

if (-not $Shutdown.valid) {
    throw "Shutdown plan is invalid."
}

Write-Host "9. Impact analysis"
Invoke-RestMethod `
    -Method Get `
    -Uri "$Root/impact/platform-pack-2-database" |
    Format-List

Write-Host "10. Topology"
$Topology = Invoke-RestMethod -Method Get -Uri "$Root/topology"
$Topology | Format-List

if ($Topology.topologyScore -ne 100) {
    throw "Topology score is not 100. Score=$($Topology.topologyScore)"
}

Write-Host "11. Health"
$Health = Invoke-RestMethod -Method Get -Uri "$Root/health"
$Health | Format-List

if ($Health.score -ne 100) {
    throw "Platform Pack 2 health score is not 100. Score=$($Health.score)"
}

Write-Host "12. Final review"
$Review = Invoke-RestMethod -Method Post -Uri "$Root/final-review/run"
$Review | Format-List

if ($Review.status -ne "passed" -or $Review.score -ne 100) {
    throw "Platform Pack 2 final review failed. Status=$($Review.status), Score=$($Review.score)"
}

Write-Host "13. Certification"
$Certification = Invoke-RestMethod `
    -Method Post `
    -Uri "$Root/certification/certify"

$Certification | Format-List

if ($Certification.status -ne "certified" -or $Certification.score -ne 100) {
    throw "Platform Pack 2 certification failed. Status=$($Certification.status), Score=$($Certification.score)"
}

Write-Host ""
Write-Host "AVOS Platform Pack 2 smoke test completed successfully." -ForegroundColor Green