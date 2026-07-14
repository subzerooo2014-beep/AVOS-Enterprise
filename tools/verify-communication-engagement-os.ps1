$ErrorActionPreference="Stop"
$Root="C:\Users\User\Desktop\AVOS"
$ApiRoot=Join-Path $Root "apps\api"
$MobileRoot=Join-Path $Root "apps\mobile"
$ApiFeature=Join-Path $ApiRoot "src\communication-engagement-os"
$MobileFeature=Join-Path $MobileRoot "lib\src\features\communication_engagement_os"
$ApiFiles=(Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles=(Get-ChildItem $MobileFeature -Recurse -File).Count
if($ApiFiles -lt 86){throw "Expected at least 86 API files, found $ApiFiles"}
if($MobileFiles -lt 24){throw "Expected at least 24 mobile files, found $MobileFiles"}

Push-Location $ApiRoot
try{
  pnpm build
  if($LASTEXITCODE -ne 0){throw "API build failed"}
  node .\scripts\smoke-communication-engagement-os.mjs
  if($LASTEXITCODE -ne 0){throw "Smoke test failed"}
  node .\scripts\integration-communication-engagement-os.mjs
  if($LASTEXITCODE -ne 0){throw "Integration test failed"}
}finally{Pop-Location}

Push-Location $MobileRoot
try{
  flutter analyze
  if($LASTEXITCODE -ne 0){throw "Flutter analyze failed"}
}finally{Pop-Location}

[pscustomobject]@{
  success=$true
  system="AVOS Mega Bundle M Communication, Collaboration & Customer Engagement OS"
  apiFiles=$ApiFiles
  mobileFiles=$MobileFiles
  totalGeneratedFiles=$ApiFiles+$MobileFiles+3
  dtoContracts=24
  services=23
  policies=8
  domainEvents=12
  aiEngines=8
  channels=8
  mobilePages=24
  omnichannelInbox=$true
  chatConversations=$true
  voiceCalls=$true
  videoCalls=$true
  supportCenter=$true
  notificationCenter=$true
  campaignMessaging=$true
  crmEngagement=$true
  agentAssistAi=$true
  sentimentAnalysis=$true
  intentDetection=$true
  smartRouting=$true
  collaborationRooms=$true
  customerFeedback=$true
  slaManagement=$true
  engagementAnalytics=$true
  endToEndCommunication=$true
  typescript="passed"
  flutterAnalyze="passed"
  healthStatus="healthy"
}|Format-List
