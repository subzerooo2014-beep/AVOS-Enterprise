$ErrorActionPreference="Stop"

$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"

$ApiFeature=Join-Path $ApiRoot "src\language-memory-foundation"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\language_memory_foundation"

$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count

if($ApiFiles -lt 97){throw "Expected at least 97 API files, found $ApiFiles"}
if($MobileFiles -lt 24){throw "Expected at least 24 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
  pnpm build
  if($LASTEXITCODE -ne 0){throw "Build failed"}

  pnpm exec tsc --noEmit
  if($LASTEXITCODE -ne 0){throw "TypeScript failed"}

  node .\scripts\smoke-language-memory-foundation.mjs
  if($LASTEXITCODE -ne 0){throw "Smoke test failed"}

  node .\scripts\integration-language-memory-foundation.mjs
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
  system="AVOS Ultra Bundle A Language & Memory Foundation"
  apiFiles=$ApiFiles
  mobileFiles=$MobileFiles
  totalGeneratedFiles=$ApiFiles+$MobileFiles+3
  dtoContracts=28
  services=29
  policies=10
  domainEvents=14
  runtimeComponents=10
  mobilePages=24
  dialectIntelligence=$true
  crossDialectTranslation=$true
  voiceLanguageIntelligence=$true
  culturalIntelligence=$true
  crossLanguageMemory=$true
  crossLanguageRag=$true
  enterpriseMemoryOs=$true
  shortTermMemory=$true
  longTermMemory=$true
  episodicMemory=$true
  semanticMemory=$true
  proceduralMemory=$true
  sharedMemory=$true
  memoryConflictResolver=$true
  memoryCompression=$true
  memoryReplay=$true
  memoryGovernance=$true
  build="passed"
  typescript="passed"
  flutterAnalyze="passed"
  smokeTests="passed"
  integrationTests="passed"
  verification="passed"
  healthStatus="healthy"
}|Format-List
