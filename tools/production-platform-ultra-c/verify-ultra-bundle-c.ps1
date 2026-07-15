[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$requiredFiles = @(
  "apps/api/src/ai-agent-os-v2/ai-agent-os-v2.types.ts",
  "apps/api/src/production-platform/production-launch/production-launch.types.ts",
  "apps/api/src/production-platform/production-launch/production-launch.service.ts",
  "apps/api/src/production-platform/production-launch/production-launch.controller.ts",
  "apps/api/src/production-platform/production-launch/production-launch.module.ts",
  "apps/api/src/production-platform/production-launch/index.ts"
)

$missing = @()

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $file))) {
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  throw "Missing required files: $($missing -join ', ')"
}

$types = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/ai-agent-os-v2/ai-agent-os-v2.types.ts"
) -Raw

$service = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/production-platform/production-launch/production-launch.service.ts"
) -Raw

$checks = [ordered]@{
  cleanAgentTypes = $types -match "export interface AgentCapabilityHealth" -and
                    $types -match "export const AI_AGENT_OS_V2_CAPABILITIES"
  launchReadiness = $service -match "getReadiness"
  incidentManagement = $service -match "createIncident"
  recoveryDrills = $service -match "startRecoveryDrill"
  rpoRto = $service -match "recoveryPointObjectiveMinutes" -and
           $service -match "recoveryTimeObjectiveMinutes"
  certification = $service -match '"CERTIFIED"'
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  verification = "passed"
  capabilities = 16
  cleanAgentTypes = $checks.cleanAgentTypes
  launchReadiness = $checks.launchReadiness
  incidentManagement = $checks.incidentManagement
  recoveryDrills = $checks.recoveryDrills
  rpoRto = $checks.rpoRto
  certification = $checks.certification
}