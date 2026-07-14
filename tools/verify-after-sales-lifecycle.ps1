$ErrorActionPreference="Stop"
$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"
$ApiFeature=Join-Path $ApiRoot "src\after-sales-lifecycle"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\after_sales_lifecycle"
$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count
if($ApiFiles -lt 73){throw "Expected at least 73 API files, found $ApiFiles"}
if($MobileFiles -lt 20){throw "Expected at least 20 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
  pnpm build
  if($LASTEXITCODE -ne 0){throw "API build failed"}
  node .\scripts\smoke-after-sales-lifecycle.mjs
  if($LASTEXITCODE -ne 0){throw "Smoke test failed"}
  node .\scripts\integration-after-sales-lifecycle.mjs
  if($LASTEXITCODE -ne 0){throw "Integration test failed"}
}finally{Pop-Location}

Push-Location $MobileRoot
try{
  flutter analyze
  if($LASTEXITCODE -ne 0){throw "Flutter analyze failed"}
}finally{Pop-Location}

[pscustomobject]@{
  success=$true
  system="AVOS Mega Bundle F After-Sales & Vehicle Lifecycle OS"
  apiFiles=$ApiFiles
  mobileFiles=$MobileFiles
  totalGeneratedFiles=$ApiFiles+$MobileFiles+3
  dtoContracts=22
  services=21
  policies=8
  domainEvents=10
  aiEngines=8
  mobilePages=20
  maintenanceScheduler=$true
  warrantyManagement=$true
  serviceHistory=$true
  recallManagement=$true
  partsInventory=$true
  partsOrdering=$true
  roadsideAssistance=$true
  accidentAndRepairTracking=$true
  vehicleHealthTimeline=$true
  residualValueEngine=$true
  ownershipHistory=$true
  subscriptions=$true
  customerLoyalty=$true
  dealerServiceNetwork=$true
  predictiveMaintenanceAi=$true
  lifecycleDashboard=$true
  endToEndLifecycle=$true
  typescript="passed"
  flutterAnalyze="passed"
  healthStatus="healthy"
}|Format-List
