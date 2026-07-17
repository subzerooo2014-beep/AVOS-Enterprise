$ErrorActionPreference = "Stop"

$Root = "C:\Users\User\Desktop\AVOS"
$FabricModule = Join-Path $Root "apps\api\src\capability-fabric\capability-fabric.module.ts"
$RuntimeModule = Join-Path $Root "apps\api\src\capability-runtime\capability-runtime.module.ts"

if (-not (Test-Path $FabricModule)) {
    throw "Missing file: $FabricModule"
}

if (-not (Test-Path $RuntimeModule)) {
    throw "Missing file: $RuntimeModule"
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

Copy-Item $FabricModule "$FabricModule.backup-$Timestamp" -Force
Copy-Item $RuntimeModule "$RuntimeModule.backup-$Timestamp" -Force

# ============================================================
# 1. Fix CapabilityFabricModule
# ============================================================

$Fabric = Get-Content $FabricModule -Raw

# تأكد من وجود import للخدمة
if ($Fabric -notmatch 'import\s*\{\s*CapabilityRegistryService\s*\}') {
    $RegistryFile = Join-Path $Root "apps\api\src\capability-fabric\capability-registry.service.ts"

    if (-not (Test-Path $RegistryFile)) {
        throw "CapabilityRegistryService file not found: $RegistryFile"
    }

    $ImportLine = 'import { CapabilityRegistryService } from "./capability-registry.service";'
    $ImportMatches = [regex]::Matches($Fabric, '(?m)^import\s+.*?;\s*$')

    if ($ImportMatches.Count -eq 0) {
        throw "No TypeScript imports found in CapabilityFabricModule."
    }

    $LastImport = $ImportMatches[$ImportMatches.Count - 1]

    $Fabric = $Fabric.Insert(
        $LastImport.Index + $LastImport.Length,
        "`r`n$ImportLine"
    )
}

# تأكد من وجود CapabilityRegistryService داخل providers
$ProvidersMatch = [regex]::Match(
    $Fabric,
    'providers\s*:\s*\[(?<items>[\s\S]*?)\]'
)

if ($ProvidersMatch.Success) {
    if ($ProvidersMatch.Groups["items"].Value -notmatch '\bCapabilityRegistryService\b') {
        $Fabric = [regex]::Replace(
            $Fabric,
            'providers\s*:\s*\[',
            "providers: [`r`n    CapabilityRegistryService,",
            1
        )
    }
}
else {
    $Fabric = [regex]::Replace(
        $Fabric,
        '@Module\s*\(\s*\{',
        "@Module({`r`n  providers: [CapabilityRegistryService],",
        1
    )
}

# تأكد من تصدير CapabilityRegistryService
$ExportsMatch = [regex]::Match(
    $Fabric,
    'exports\s*:\s*\[(?<items>[\s\S]*?)\]'
)

if ($ExportsMatch.Success) {
    if ($ExportsMatch.Groups["items"].Value -notmatch '\bCapabilityRegistryService\b') {
        $Fabric = [regex]::Replace(
            $Fabric,
            'exports\s*:\s*\[',
            "exports: [`r`n    CapabilityRegistryService,",
            1
        )
    }
}
else {
    $Fabric = [regex]::Replace(
        $Fabric,
        '(\r?\n\s*)\}\s*\)\s*export\s+class\s+CapabilityFabricModule',
        "`r`n  exports: [CapabilityRegistryService],`r`n})`r`nexport class CapabilityFabricModule",
        1
    )
}

[IO.File]::WriteAllText(
    $FabricModule,
    $Fabric,
    [Text.UTF8Encoding]::new($false)
)

# ============================================================
# 2. Fix CapabilityRuntimeModule
# ============================================================

$Runtime = Get-Content $RuntimeModule -Raw

# حذف أي تسجيل مباشر للخدمة
$Runtime = [regex]::Replace(
    $Runtime,
    '(?m)^\s*import\s*\{\s*CapabilityRegistryService\s*\}\s*from\s*["''][^"'']+["''];\s*\r?\n?',
    ''
)

$Runtime = [regex]::Replace(
    $Runtime,
    '(?m)^\s*CapabilityRegistryService,\s*\r?\n?',
    ''
)

# تأكد من استيراد CapabilityFabricModule
if ($Runtime -notmatch 'import\s*\{\s*CapabilityFabricModule\s*\}') {
    $ImportLine = 'import { CapabilityFabricModule } from "../capability-fabric/capability-fabric.module";'
    $ImportMatches = [regex]::Matches($Runtime, '(?m)^import\s+.*?;\s*$')

    if ($ImportMatches.Count -eq 0) {
        throw "No TypeScript imports found in CapabilityRuntimeModule."
    }

    $LastImport = $ImportMatches[$ImportMatches.Count - 1]

    $Runtime = $Runtime.Insert(
        $LastImport.Index + $LastImport.Length,
        "`r`n$ImportLine"
    )
}

# تأكد من وجود CapabilityFabricModule داخل imports
$RuntimeImports = [regex]::Match(
    $Runtime,
    'imports\s*:\s*\[(?<items>[\s\S]*?)\]'
)

if ($RuntimeImports.Success) {
    if ($RuntimeImports.Groups["items"].Value -notmatch '\bCapabilityFabricModule\b') {
        $Runtime = [regex]::Replace(
            $Runtime,
            'imports\s*:\s*\[',
            "imports: [`r`n    CapabilityFabricModule,",
            1
        )
    }
}
else {
    $Runtime = [regex]::Replace(
        $Runtime,
        '@Module\s*\(\s*\{',
        "@Module({`r`n  imports: [CapabilityFabricModule],",
        1
    )
}

[IO.File]::WriteAllText(
    $RuntimeModule,
    $Runtime,
    [Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "Dependency wiring patched." -ForegroundColor Green
Write-Host ""

Write-Host "CapabilityFabricModule:" -ForegroundColor Cyan
Select-String -Path $FabricModule -Pattern "CapabilityRegistryService|providers:|exports:"

Write-Host ""
Write-Host "CapabilityRuntimeModule:" -ForegroundColor Cyan
Select-String -Path $RuntimeModule -Pattern "CapabilityFabricModule|CapabilityRegistryService|imports:|providers:"

# ============================================================
# 3. Verification
# ============================================================

Set-Location (Join-Path $Root "apps\api")

pnpm exec tsc --noEmit -p tsconfig.json

if ($LASTEXITCODE -ne 0) {
    throw "TypeScript validation failed."
}

pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "Nest build failed."
}

Write-Host ""
Write-Host "TypeScript and Nest build passed." -ForegroundColor Green
Write-Host "Starting API..." -ForegroundColor Cyan

pnpm start:dev
