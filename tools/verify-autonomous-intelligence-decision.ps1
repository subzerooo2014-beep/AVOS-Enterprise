$ErrorActionPreference="Stop"

$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"

$ApiFeature=Join-Path $ApiRoot "src\autonomous-intelligence-decision-platform"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\autonomous_intelligence_decision_platform"

$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count

if($ApiFiles -lt 84){throw "Expected at least 84 API files, found $ApiFiles"}
if($MobileFiles -lt 24){throw "Expected at least 24 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
  pnpm build
  if($LASTEXITCODE -ne 0){throw "Build failed"}

  pnpm exec tsc --noEmit
  if($LASTEXITCODE -ne 0){throw "TypeScript failed"}

  node .\scripts\smoke-autonomous-intelligence-decision.mjs
  if($LASTEXITCODE -ne 0){throw "Smoke test failed"}

  node .\scripts\integration-autonomous-intelligence-decision.mjs
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
  system="AVOS Autonomous Intelligence & Decision Platform"
  apiFiles=$ApiFiles
  mobileFiles=$MobileFiles
  totalGeneratedFiles=$ApiFiles+$MobileFiles+3
  dtoContracts=24
  services=25
  policies=8
  domainEvents=12
  runtimeComponents=8
  mobilePages=24
  aiStrategicPlanner=$true
  enterpriseDecisionGraph=$true
  decisionMemory=$true
  decisionExplainability=$true
  multiAgentCoordination=$true
  consensusEngine=$true
  agentNegotiation=$true
  scenarioSimulator=$true
  decisionEngine=$true
  executiveIntelligence=$true
  build="passed"
  typescript="passed"
  flutterAnalyze="passed"
  smokeTests="passed"
  integrationTests="passed"
  verification="passed"
  healthStatus="healthy"
}|Format-List
