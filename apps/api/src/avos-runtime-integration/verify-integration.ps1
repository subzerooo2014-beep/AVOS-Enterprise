param([string]$RepoRoot="C:\Users\User\Desktop\AVOS")
$ErrorActionPreference="Stop"

$root=Join-Path $RepoRoot "apps\api\src\avos-runtime-integration"
$manifestPath=Join-Path $root "integration.manifest.json"
$schemaPath=Join-Path $RepoRoot "apps\api\prisma\schema.prisma"
$appModulePath=Join-Path $RepoRoot "apps\api\src\app.module.ts"

$required=@(
 "avos-runtime-integration.module.ts",
 "runtime-integration.controller.ts",
 "runtime-integration-bootstrap.service.ts",
 "runtime-integration-snapshot.service.ts",
 "contracts\integration.contracts.ts",
 "kernel\enterprise-kernel-bridge.service.ts",
 "events\runtime-event-bridge.service.ts",
 "persistence\runtime-persistence.repository.ts",
 "persistence\memory-runtime-persistence.repository.ts",
 "persistence\prisma-runtime-persistence.repository.ts",
 "persistence\runtime-persistence.service.ts",
 "capabilities\capability-persistence-bridge.service.ts",
 "automation\durable-runtime-queue-bridge.service.ts",
 "startup\runtime-startup-validation.service.ts",
 "startup\runtime-graceful-shutdown.service.ts",
 "observability\integration-health-aggregator.service.ts"
)

$missing=@()
foreach($relative in $required){
 $path=Join-Path $root $relative
 if(-not(Test-Path $path)){ $missing += $path }
}

if($missing.Count -gt 0){
 throw "Missing integration files:`n$($missing -join "`n")"
}

if(-not(Test-Path $manifestPath)){
 throw "Integration manifest missing."
}

$appModule=Get-Content $appModulePath -Raw
if($appModule -notmatch '\bAvosRuntimeIntegrationModule\b'){
 throw "AvosRuntimeIntegrationModule is not registered in AppModule."
}

$schemaModel=$false
if(Test-Path $schemaPath){
 $schema=Get-Content $schemaPath -Raw
 $schemaModel=$schema -match '\bmodel\s+RuntimeIntegrationRecord\b'
}

$manifest=Get-Content $manifestPath -Raw | ConvertFrom-Json

[ordered]@{
 success=$true
 classification="enterprise-runtime-integration-mega-pack"
 integrationLayers=$manifest.integrationLayers.Count
 services=$manifest.services.Count
 endpoints=$manifest.endpoints.Count
 requiredFiles=$required.Count
 missingFiles=0
 appModuleRegistered=$true
 prismaModelPresent=$schemaModel
 architecture="integration-validated"
}|ConvertTo-Json -Depth 10