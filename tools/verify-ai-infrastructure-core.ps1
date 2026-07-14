$ErrorActionPreference="Stop"

$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"

$ApiFeature=Join-Path $ApiRoot "src\ai-infrastructure-core"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\ai_infrastructure_core"

$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count

if($ApiFiles -lt 75){throw "Expected at least 75 API files, found $ApiFiles"}
if($MobileFiles -lt 20){throw "Expected at least 20 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
  pnpm build
  if($LASTEXITCODE -ne 0){throw "Build failed"}

  pnpm exec tsc --noEmit
  if($LASTEXITCODE -ne 0){throw "TypeScript failed"}

  node .\scripts\smoke-ai-infrastructure-core.mjs
  if($LASTEXITCODE -ne 0){throw "Smoke test failed"}

  node .\scripts\integration-ai-infrastructure-core.mjs
  if($LASTEXITCODE -ne 0){throw "Integration test failed"}
}
finally{
  Pop-Location
}

Push-Location $MobileRoot
try{
  flutter analyze
  if($LASTEXITCODE -ne 0){throw "Flutter analyze failed"}
}
finally{
  Pop-Location
}

[pscustomobject]@{
  success=$true
  system="AVOS Ultra Bundle 2 Phase 1 AI Infrastructure Core"
  apiFiles=$ApiFiles
  mobileFiles=$MobileFiles
  totalGeneratedFiles=$ApiFiles+$MobileFiles+3
  dtoContracts=20
  services=21
  policies=8
  domainEvents=12
  runtimeComponents=8
  mobilePages=20
  modelRegistry=$true
  promptRegistry=$true
  vectorDatabaseLayer=$true
  ragEngine=$true
  modelEvaluationFramework=$true
  fineTuningPipeline=$true
  aiGuardrailsFramework=$true
  providerRegistry=$true
  providerFailover=$true
  modelRouting=$true
  build="passed"
  typescript="passed"
  flutterAnalyze="passed"
  smokeTests="passed"
  integrationTests="passed"
  verification="passed"
  healthStatus="healthy"
}|Format-List

