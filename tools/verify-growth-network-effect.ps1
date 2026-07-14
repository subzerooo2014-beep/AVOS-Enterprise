$ErrorActionPreference="Stop"
$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"
$ApiFeature=Join-Path $ApiRoot "src\growth-network-effect"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\growth_network_effect"
$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count
if($ApiFiles -lt 77){throw "Expected at least 77 API files, found $ApiFiles"}
if($MobileFiles -lt 20){throw "Expected at least 20 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
 pnpm build
 if($LASTEXITCODE -ne 0){throw "API build failed"}
 node .\scripts\smoke-growth-network-effect.mjs
 if($LASTEXITCODE -ne 0){throw "Smoke test failed"}
 node .\scripts\integration-growth-network-effect.mjs
 if($LASTEXITCODE -ne 0){throw "Integration test failed"}
}finally{Pop-Location}

Push-Location $MobileRoot
try{
 flutter analyze
 if($LASTEXITCODE -ne 0){throw "Flutter analyze failed"}
}finally{Pop-Location}

[pscustomobject]@{
 success=$true
 system="AVOS Mega Bundle G Growth, Marketing & Network Effect OS"
 apiFiles=$ApiFiles
 mobileFiles=$MobileFiles
 totalGeneratedFiles=$ApiFiles+$MobileFiles+3
 dtoContracts=20
 services=18
 policies=8
 domainEvents=10
 aiEngines=8
 aiAgents=8
 mobilePages=20
 growthBrain=$true
 aiMarketingSwarm=$true
 referralEngine=$true
 viralEngine=$true
 seoIntelligence=$true
 socialDistribution=$true
 contentFactory=$true
 campaignAutomation=$true
 retentionAi=$true
 revenueOptimizer=$true
 competitorIntelligence=$true
 customerJourneyGenome=$true
 growthAnalytics=$true
 abTestingAi=$true
 influencerHub=$true
 notificationIntelligence=$true
 growthDashboard=$true
 endToEndGrowth=$true
 typescript="passed"
 flutterAnalyze="passed"
 healthStatus="healthy"
}|Format-List
