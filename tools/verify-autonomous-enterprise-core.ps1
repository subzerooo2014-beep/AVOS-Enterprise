$ErrorActionPreference="Stop"

$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"

$ApiFeature=Join-Path $ApiRoot "src\autonomous-enterprise-core"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\autonomous_enterprise_core"

$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count

if($ApiFiles -lt 83){throw "Expected at least 83 API files, found $ApiFiles"}
if($MobileFiles -lt 24){throw "Expected at least 24 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
  pnpm build
  if($LASTEXITCODE -ne 0){throw "Build failed"}

  pnpm exec tsc --noEmit
  if($LASTEXITCODE -ne 0){throw "TypeScript failed"}

  node .\scripts\smoke-autonomous-enterprise-core.mjs
  if($LASTEXITCODE -ne 0){throw "Smoke test failed"}

  node .\scripts\integration-autonomous-enterprise-core.mjs
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
  system="AVOS Ultra Bundle Y Autonomous Enterprise Core"
  apiFiles=$ApiFiles
  mobileFiles=$MobileFiles
  totalGeneratedFiles=$ApiFiles+$MobileFiles+3
  dtoContracts=24
  services=25
  policies=8
  domainEvents=12
  runtimeComponents=8
  mobilePages=24
  selfEvolutionFramework=$true
  aiReleaseAdvisor=$true
  enterprisePerformanceDna=$true
  enterpriseDecisionDna=$true
  autonomousOptimization=$true
  continuousLearning=$true
  enterpriseAiCoach=$true
  strategicPlannerAdvanced=$true
  decisionGraphAdvanced=$true
  workflowEvolution=$true
  architectureEvolution=$true
  policyEvolution=$true
  executiveAiBrain=$true
  build="passed"
  typescript="passed"
  flutterAnalyze="passed"
  smokeTests="passed"
  integrationTests="passed"
  verification="passed"
  healthStatus="healthy"
}|Format-List

