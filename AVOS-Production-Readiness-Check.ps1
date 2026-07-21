#requires -Version 5.1
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiRoot = Join-Path $repoRoot "apps\api"
$webRoot = Join-Path $repoRoot "apps\web"

$checks = [ordered]@{
    apiRoot = Test-Path $apiRoot
    webRoot = Test-Path $webRoot
    envTemplate = Test-Path (Join-Path $repoRoot ".env.production.example")
    apiDockerfile = Test-Path (Join-Path $repoRoot "Dockerfile.api")
    webDockerfile = Test-Path (Join-Path $repoRoot "Dockerfile.web")
    compose = Test-Path (Join-Path $repoRoot "docker-compose.production.yml")
    nginx = Test-Path (Join-Path $repoRoot "deployment\nginx\avos.conf")
    databasePolicy = Test-Path (Join-Path $repoRoot "deployment\database\database-policy.json")
    securityPolicy = Test-Path (Join-Path $repoRoot "deployment\security\security-policy.json")
    observabilityPolicy = Test-Path (Join-Path $repoRoot "deployment\observability\observability-policy.json")
    backupPolicy = Test-Path (Join-Path $repoRoot "deployment\recovery\backup-policy.json")
    goLiveChecklist = Test-Path (Join-Path $repoRoot "deployment\production\go-live-checklist.md")
    zeroDowntimeBlueprint = Test-Path (Join-Path $repoRoot "deployment\production\zero-downtime-blueprint.json")
    ciWorkflow = Test-Path (Join-Path $repoRoot ".github\workflows\avos-production-ci.yml")
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

[pscustomobject]@{
    name = "AVOS Production Readiness Static Check"
    version = "PDGL-UMP1-1.0.0"
    status = if ($failed.Count -eq 0) { "passed" } else { "failed" }
    score = [math]::Round((($checks.Count - $failed.Count) / $checks.Count) * 100)
    checks = [pscustomobject]$checks
    checkedAt = (Get-Date).ToUniversalTime().ToString("o")
} | Format-List

if ($failed.Count -gt 0) {
    $names = ($failed | ForEach-Object { $_.Key }) -join ", "
    throw "Production readiness failed. Root-cause resolution required for: $names"
}
