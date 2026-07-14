param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$MobileRoot = Join-Path $RepoRoot "apps\mobile"

$requiredFiles = @(
  "lib\src\features\ai\presentation\ai_experience_page.dart",
  "lib\src\features\voice\presentation\voice_assistant_page.dart",
  "lib\src\features\vision\presentation\vehicle_vision_page.dart",
  "lib\src\features\recommendations\presentation\recommendations_page.dart",
  "lib\src\features\market\presentation\market_intelligence_page.dart",
  "lib\src\features\azm\presentation\azm_assistant_page.dart",
  "test\mobile_mega_pack_4_smoke_test.dart"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $MobileRoot $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing Mobile Mega Pack 4 file: $path"
  }
}

Push-Location $MobileRoot
try {
  flutter analyze
  if ($LASTEXITCODE -ne 0) {
    throw "flutter analyze failed with exit code $LASTEXITCODE"
  }

  flutter test test/mobile_mega_pack_4_smoke_test.dart
  if ($LASTEXITCODE -ne 0) {
    throw "Mobile Mega Pack 4 smoke failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

[pscustomobject]@{
  success = $true
  system = "AVOS Mobile Mega Pack 4 AI Experience"
  requiredFiles = $requiredFiles.Count
  aiAssistant = $true
  voiceConversation = $true
  imageAnalysis = $true
  recommendations = $true
  marketIntelligence = $true
  flutterAnalyze = "passed"
  tests = "passed"
  healthStatus = "healthy"
}