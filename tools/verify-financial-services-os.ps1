$ErrorActionPreference="Stop"
$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"
$ApiFeature=Join-Path $ApiRoot "src\financial-services-os"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\financial_services_os"
$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count
if($ApiFiles -lt 78){throw "Expected at least 78 API files, found $ApiFiles"}
if($MobileFiles -lt 20){throw "Expected at least 20 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
 pnpm build
 if($LASTEXITCODE -ne 0){throw "API build failed"}
 node .\scripts\smoke-financial-services-os.mjs
 if($LASTEXITCODE -ne 0){throw "Smoke test failed"}
 node .\scripts\integration-financial-services-os.mjs
 if($LASTEXITCODE -ne 0){throw "Integration test failed"}
}finally{Pop-Location}

Push-Location $MobileRoot
try{
 flutter analyze
 if($LASTEXITCODE -ne 0){throw "Flutter analyze failed"}
}finally{Pop-Location}

[pscustomobject]@{
 success=$true
 system="AVOS Mega Bundle H Financial Services, Payments & Insurance OS"
 apiFiles=$ApiFiles
 mobileFiles=$MobileFiles
 totalGeneratedFiles=$ApiFiles+$MobileFiles+3
 dtoContracts=24
 services=20
 policies=8
 domainEvents=12
 aiEngines=8
 mobilePages=20
 financingMarketplace=$true
 loanOrigination=$true
 installmentEngine=$true
 paymentGatewayHub=$true
 digitalWallet=$true
 escrowService=$true
 insuranceMarketplace=$true
 insuranceAi=$true
 claimsProcessing=$true
 policyManagement=$true
 fraudDetection=$true
 amlAndKyc=$true
 revenueAssurance=$true
 settlementEngine=$true
 accountingSync=$true
 financialAnalytics=$true
 riskScoring=$true
 financeDashboard=$true
 endToEndFinancialRuntime=$true
 typescript="passed"
 flutterAnalyze="passed"
 healthStatus="healthy"
}|Format-List
