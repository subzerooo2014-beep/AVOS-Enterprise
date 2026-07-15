[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$webPage = Join-Path $RepoRoot "apps/web/src/app/enterprise-ecosystem/page.tsx"
$registry = Join-Path $RepoRoot "apps/api/src/enterprise-ecosystem/enterprise-ecosystem.registry.ts"
$mobile = Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_ecosystem/enterprise_ecosystem_screen.dart"

foreach ($path in @($webPage,$registry,$mobile)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing ecosystem artifact: $path"
    }
}

$webContent = Get-Content -LiteralPath $webPage -Raw
$registryContent = Get-Content -LiteralPath $registry -Raw

$webHubCount = ([regex]::Matches($webContent,'title:\s*"')).Count
$registryHubCount = ([regex]::Matches($registryContent,'key:\s*"')).Count

if ($webHubCount -ne 10) {
    throw "Expected 10 web hubs, found $webHubCount"
}

if ($registryHubCount -ne 10) {
    throw "Expected 10 registry hubs, found $registryHubCount"
}

[pscustomobject]@{
    success = $true
    verification = "passed"
    webHubs = $webHubCount
    registryHubs = $registryHubCount
    mobileExperience = $true
}