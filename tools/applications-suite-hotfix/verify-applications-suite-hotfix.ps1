[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$registryPath = Join-Path $RepoRoot "apps/api/src/applications-suite/applications-suite.registry.ts"
$registry = Get-Content -LiteralPath $registryPath -Raw

if ($registry -match '\.replace\(') {
    throw "Invalid replace call found in registry."
}

$applications = ([regex]::Matches($registry,'key:\s*"')).Count
$capabilityArrays = ([regex]::Matches($registry,'capabilities:\s*\[')).Count
$capabilityValues = ([regex]::Matches($registry,'(?m)^\s{4}capabilities:\s*\[[^\]]+\],$')).Count

if ($applications -ne 8) {
    throw "Expected 8 applications, found $applications"
}

if ($capabilityArrays -ne 8) {
    throw "Expected 8 capability arrays, found $capabilityArrays"
}

if ($capabilityValues -ne 8) {
    throw "Expected 8 valid capability lines, found $capabilityValues"
}

[pscustomobject]@{
    success = $true
    verification = "passed"
    applications = $applications
    capabilityArrays = $capabilityArrays
    invalidReplaceCalls = 0
}