param([string]$RepoRoot="C:\Users\User\Desktop\AVOS")
$ErrorActionPreference="Stop"

$runtimeRoot=Join-Path $RepoRoot "apps\api\src\avos-enterprise-runtime"
$manifestPath=Join-Path $runtimeRoot "runtime.manifest.json"
$futureManifestPath=Join-Path $RepoRoot "apps\api\src\avos-future-platform\future-platform.manifest.json"

if(-not(Test-Path $manifestPath)){ throw "Runtime manifest missing." }
if(-not(Test-Path $futureManifestPath)){ throw "Future platform manifest missing." }

$required=@(
 "avos-enterprise-runtime.module.ts",
 "enterprise-runtime.controller.ts",
 "enterprise-runtime-bootstrap.service.ts",
 "enterprise-runtime-snapshot.service.ts",
 "contracts\runtime.contracts.ts",
 "capabilities\capability-registry.service.ts",
 "capabilities\capability-discovery.service.ts",
 "capabilities\dependency-graph.service.ts",
 "capabilities\capability-lifecycle.service.ts",
 "events\runtime-event-bus.service.ts",
 "events\runtime-event-store.service.ts",
 "events\runtime-event-replay.service.ts",
 "governance\runtime-policy.service.ts",
 "governance\runtime-permission.service.ts",
 "governance\human-approval.service.ts",
 "governance\runtime-trust.service.ts",
 "governance\runtime-audit.service.ts",
 "automation\runtime-queue.service.ts",
 "automation\runtime-job-engine.service.ts",
 "automation\runtime-scheduler.service.ts",
 "orchestration\runtime-rules-engine.service.ts",
 "orchestration\runtime-workflow.service.ts",
 "orchestration\enterprise-orchestrator.service.ts",
 "memory\runtime-memory.service.ts",
 "memory\runtime-context.service.ts",
 "observability\runtime-metrics.service.ts",
 "observability\runtime-health.service.ts",
 "observability\runtime-diagnostics.service.ts"
)

$missing=@()
foreach($relative in $required){
 $path=Join-Path $runtimeRoot $relative
 if(-not(Test-Path $path)){ $missing += $path }
}

if($missing.Count -gt 0){
 throw "Missing runtime files:`n$($missing -join "`n")"
}

$runtimeManifest=Get-Content $manifestPath -Raw | ConvertFrom-Json
$futureManifest=Get-Content $futureManifestPath -Raw | ConvertFrom-Json

if([int]$runtimeManifest.connectedCapabilities -ne [int]$futureManifest.totalCapabilities){
 throw "Capability count mismatch."
}

[ordered]@{
 success=$true
 classification="enterprise-runtime-ultra-mega-pack"
 connectedCapabilities=[int]$runtimeManifest.connectedCapabilities
 runtimeLayers=$runtimeManifest.runtimeLayers.Count
 runtimeServices=$runtimeManifest.runtimeServices.Count
 endpoints=$runtimeManifest.endpoints.Count
 requiredFiles=$required.Count
 missingFiles=0
 architecture="runtime-validated"
}|ConvertTo-Json -Depth 10