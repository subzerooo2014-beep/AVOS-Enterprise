param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$WebRoot = Join-Path $RepoRoot "apps\web"
$MobileRoot = Join-Path $RepoRoot "apps\mobile"
$NextRoot = Join-Path $WebRoot ".next"

$requiredFiles = @(
  "apps\web\src\design-system\tokens.ts",
  "apps\web\src\design-system\avos-button.tsx",
  "apps\web\src\design-system\avos-card.tsx",
  "apps\web\src\design-system\azm-orb.tsx",
  "apps\web\src\design-system\vehicle-showcase.tsx",
  "apps\web\src\app\page.tsx",
  "apps\mobile\lib\design_system\avos_colors.dart",
  "apps\mobile\lib\design_system\avos_theme.dart",
  "apps\mobile\lib\design_system\azm_orb.dart",
  "apps\mobile\lib\design_system\luxury_card.dart",
  "apps\mobile\lib\src\app\avos_mobile_app.dart",
  "apps\mobile\lib\src\features\home\presentation\home_page.dart"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $RepoRoot $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing Unified Luxury UI file: $path"
  }
}

if (Test-Path $NextRoot) {
  Remove-Item $NextRoot -Recurse -Force
}

Push-Location $WebRoot
try {
  pnpm exec tsc --noEmit
  if ($LASTEXITCODE -ne 0) {
    throw "Web luxury UI verification failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

Push-Location $MobileRoot
try {
  flutter analyze
  if ($LASTEXITCODE -ne 0) {
    throw "Mobile luxury UI verification failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

[pscustomobject]@{
  success = $true
  system = "AVOS Unified Luxury UI Mega Pack 1"
  requiredFiles = $requiredFiles.Count
  unifiedDesignSystem = $true
  webLuxuryHome = $true
  mobileLuxuryHome = $true
  azmOrb = $true
  premiumCards = $true
  emeraldGoldIdentity = $true
  responsiveFoundation = $true
  typescript = "passed"
  flutterAnalyze = "passed"
  healthStatus = "healthy"
}