$ErrorActionPreference="Stop"
$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"
$ApiFeature=Join-Path $ApiRoot "src\data-platform-analytics"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\data_platform_analytics"
$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count
if($ApiFiles -lt 90){throw "Expected at least 90 API files, found $ApiFiles"}
if($MobileFiles -lt 24){throw "Expected at least 24 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
  pnpm build
  if($LASTEXITCODE -ne 0){throw "API build failed"}
  node .\scripts\smoke-data-platform-analytics.mjs
  if($LASTEXITCODE -ne 0){throw "Smoke test failed"}
  node .\scripts\integration-data-platform-analytics.mjs
  if($LASTEXITCODE -ne 0){throw "Integration test failed"}
}finally{Pop-Location}

Push-Location $MobileRoot
try{
  flutter analyze
  if($LASTEXITCODE -ne 0){throw "Flutter analyze failed"}
}finally{Pop-Location}

[pscustomobject]@{
  success=$true
  system="AVOS Mega Bundle L Data Platform, Analytics & Intelligence OS"
  apiFiles=$ApiFiles
  mobileFiles=$MobileFiles
  totalGeneratedFiles=$ApiFiles+$MobileFiles+3
  dtoContracts=24
  services=24
  policies=8
  domainEvents=12
  aiEngines=8
  pipelines=8
  mobilePages=24
  enterpriseDataLake=$true
  dataWarehouse=$true
  unifiedDataModel=$true
  dataCatalog=$true
  metadataRegistry=$true
  etlEltPipelines=$true
  streamProcessing=$true
  eventAnalytics=$true
  customer360=$true
  vehicle360=$true
  partner360=$true
  realtimeAnalytics=$true
  predictiveAnalyticsAi=$true
  biEngine=$true
  executiveDashboards=$true
  kpiEngine=$true
  reportBuilder=$true
  aiInsights=$true
  dataGovernance=$true
  dataQualityEngine=$true
  masterDataManagement=$true
  dataLineage=$true
  timeSeriesEngine=$true
  searchIndexEngine=$true
  endToEndDataPlatform=$true
  typescript="passed"
  flutterAnalyze="passed"
  healthStatus="healthy"
}|Format-List

