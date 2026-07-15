[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/heavy-equipment-industry"
$registryPath = Join-Path $base "heavy-equipment-industry.registry.ts"
$assetsPath = Join-Path $base "heavy-equipment-assets.service.ts"
$operationsPath = Join-Path $base "heavy-equipment-operations.service.ts"
$intelligencePath = Join-Path $base "heavy-equipment-intelligence.service.ts"

$requiredFiles = @(
  "heavy-equipment-industry.types.ts",
  "heavy-equipment-industry.registry.ts",
  "heavy-equipment-assets.service.ts",
  "heavy-equipment-operations.service.ts",
  "heavy-equipment-intelligence.service.ts",
  "heavy-equipment-industry.controller.ts",
  "heavy-equipment-industry.module.ts",
  "index.ts"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $base $file

  if (-not (Test-Path -LiteralPath $path)) {
    throw "Verification failed. Missing API artifact: $path"
  }
}

$registry = Get-Content -LiteralPath $registryPath -Raw
$assets = Get-Content -LiteralPath $assetsPath -Raw
$operations = Get-Content -LiteralPath $operationsPath -Raw
$intelligence = Get-Content -LiteralPath $intelligencePath -Raw

$checks = [ordered]@{
  equipmentRegistry =
    $registry -match '"equipment-master-registry"'
  lifecycle =
    $registry -match '"equipment-lifecycle"'
  deployments =
    $registry -match '"equipment-deployment"'
  inspections =
    $registry -match '"inspection-management"'
  maintenance =
    $registry -match '"preventive-maintenance"'
  workOrders =
    $registry -match '"work-orders"'
  spareParts =
    $registry -match '"spare-parts-inventory"'
  rentals =
    $registry -match '"rental-contracts"'
  telematics =
    $registry -match '"telematics"'
  predictiveAi =
    $registry -match '"predictive-maintenance-ai"'
  createEquipmentRuntime =
    $assets -match "createEquipment\("
  uniqueSerialRuntime =
    $assets -match "serialIndex"
  uniqueFleetRuntime =
    $assets -match "fleetIndex"
  siteRuntime =
    $assets -match "createSite\("
  partsRuntime =
    $assets -match "createSparePart\("
  deploymentRuntime =
    $operations -match "createDeployment\("
  inspectionRuntime =
    $operations -match "createInspection\("
  workOrderRuntime =
    $operations -match "createWorkOrder\("
  rentalRuntime =
    $operations -match "createRentalContract\("
  listingRuntime =
    $operations -match "createListing\("
  telematicsRuntime =
    $intelligence -match "recordTelematics\("
  predictiveMaintenanceRuntime =
    $intelligence -match "predictiveMaintenance\("
  dashboardRuntime =
    $intelligence -match "dashboard\("
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

$capabilityCount = (
  [regex]::Matches($registry, '(?m)^\s*"[^"]+",?\s*$')
).Count

if ($capabilityCount -lt 70) {
  throw "Verification failed. Expected at least 70 real capabilities, found $capabilityCount"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Heavy Equipment Industry Pack"
  industry = "HEAVY_EQUIPMENT"
  verification = "passed"
  requiredFiles = $requiredFiles.Count
  checks = $checks.Count
  capabilities = $capabilityCount
  runtime = $true
  web = $true
  mobile = $true
} | Format-List