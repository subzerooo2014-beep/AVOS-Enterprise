$ErrorActionPreference = "Stop"

function Assert-True([bool]$Condition, [string]$Message) {
    if (-not $Condition) { throw "[FAIL] $Message" }
    Write-Host "[PASS] $Message" -ForegroundColor Green
}

Write-Host ("=" * 112) -ForegroundColor Cyan
Write-Host "AVOS Digital Workplace Advanced Mega Pack 31-40 Smoke Test" -ForegroundColor Cyan
Write-Host ("=" * 112) -ForegroundColor Cyan

$page = Invoke-WebRequest `
    -Uri "http://localhost:3001/digital-workplace/advanced" `
    -UseBasicParsing `
    -TimeoutSec 30

Assert-True ($page.StatusCode -eq 200) "Advanced Digital Workplace page HTTP 200"

$status = Invoke-RestMethod `
    -Uri "http://localhost:3000/avos/digital-workplace/advanced/status" `
    -TimeoutSec 30

Assert-True ($status.status -eq "operational") "Advanced workplace operational"
Assert-True ($status.healthScore -eq 100) "Health score 100"
Assert-True ([bool]$status.advancedWindowManager) "Advanced Window Manager"
Assert-True ([bool]$status.dragAndDrop) "Window drag and drop"
Assert-True ([bool]$status.resizeWindows) "Window resizing"
Assert-True ([bool]$status.autoLayout) "Automatic window layout"
Assert-True ([bool]$status.multiDisplaySupport) "Multi-display support"
Assert-True ([bool]$status.dynamicMicroFrontendRuntime) "Dynamic Micro-Frontend Runtime"
Assert-True ([bool]$status.applicationIsolation) "Application isolation"
Assert-True ([bool]$status.sharedRuntimeServices) "Shared runtime services"
Assert-True ([bool]$status.enterpriseEventBus) "Enterprise Event Bus"
Assert-True ([bool]$status.realtimeUpdates) "Real-time application updates"
Assert-True ([bool]$status.universalCommandCenter) "Universal Command Center"
Assert-True ([bool]$status.unifiedIdentity) "Unified Identity"
Assert-True ([bool]$status.roleBasedAccessControl) "Role-Based Access Control"
Assert-True ([bool]$status.singleSignOnFoundation) "SSO foundation"
Assert-True ([bool]$status.persistentWorkspaces) "Persistent Workspaces"
Assert-True ([bool]$status.sessionRestore) "Session Restore"
Assert-True ([bool]$status.aiDesktopAssistant) "AI Desktop Assistant"
Assert-True ([bool]$status.liveSystemMonitor) "Live System Monitor"
Assert-True ([bool]$status.humanFinalAuthority) "Human Final Authority"
Assert-True ([bool]$status.globalComplianceReadinessGate) "Global Compliance Readiness Gate"

$identity = Invoke-RestMethod `
    -Uri "http://localhost:3000/avos/digital-workplace/advanced/identity" `
    -TimeoutSec 30

Assert-True ($identity.userId -eq "human:khalifa") "Unified identity resolved"
Assert-True ($identity.permissions.Count -gt 0) "Permissions loaded"

$certification = Invoke-RestMethod `
    -Uri "http://localhost:3000/avos/digital-workplace/advanced/certification" `
    -TimeoutSec 30

Assert-True ($certification.status -eq "certified") "Certification status certified"
Assert-True ($certification.score -eq 100) "Final certification score 100"

Write-Host "AVOS DIGITAL WORKPLACE ADVANCED MEGA PACK 31-40 SUCCESS" -ForegroundColor Green