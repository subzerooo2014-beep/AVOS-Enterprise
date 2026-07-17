$ErrorActionPreference = "Stop"

$Root = "C:\Users\User\Desktop\AVOS"
$FabricRoot = Join-Path $Root "apps\api\src\capability-fabric"
$RegistryFile = Join-Path $FabricRoot "capability-registry.service.ts"
$ModuleFile = Join-Path $FabricRoot "capability-fabric.module.ts"

if (-not (Test-Path $RegistryFile)) {
    throw "Missing registry file: $RegistryFile"
}

if (-not (Test-Path $ModuleFile)) {
    throw "Missing module file: $ModuleFile"
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$Backup = "$ModuleFile.backup-$Timestamp"
Copy-Item $ModuleFile $Backup -Force

$Registry = Get-Content $RegistryFile -Raw
$Module = Get-Content $ModuleFile -Raw

$RequiredServices = @(
    "CapabilityFoundationValidatorService",
    "CapabilityDependencyGraphService",
    "CapabilityRegistryService"
)

# ============================================================
# Resolve imports from CapabilityRegistryService
# ============================================================

foreach ($ServiceName in @(
    "CapabilityFoundationValidatorService",
    "CapabilityDependencyGraphService"
)) {
    $ImportMatch = [regex]::Match(
        $Registry,
        "import\s*\{\s*$ServiceName\s*\}\s*from\s*[""']([^""']+)[""']\s*;"
    )

    if (-not $ImportMatch.Success) {
        throw "Import for $ServiceName was not found in capability-registry.service.ts"
    }

    $ImportPath = $ImportMatch.Groups[1].Value

    if ($Module -notmatch "import\s*\{\s*$ServiceName\s*\}") {
        $ImportLine = "import { $ServiceName } from `"$ImportPath`";"

        $ImportMatches = [regex]::Matches(
            $Module,
            '(?m)^import\s+.*?;\s*$'
        )

        if ($ImportMatches.Count -eq 0) {
            throw "No imports found in CapabilityFabricModule."
        }

        $LastImport = $ImportMatches[$ImportMatches.Count - 1]

        $Module = $Module.Insert(
            $LastImport.Index + $LastImport.Length,
            "`r`n$ImportLine"
        )
    }
}

# Ensure CapabilityRegistryService import
if ($Module -notmatch 'import\s*\{\s*CapabilityRegistryService\s*\}') {
    $ImportMatches = [regex]::Matches(
        $Module,
        '(?m)^import\s+.*?;\s*$'
    )

    if ($ImportMatches.Count -eq 0) {
        throw "No imports found in CapabilityFabricModule."
    }

    $LastImport = $ImportMatches[$ImportMatches.Count - 1]
    $ImportLine = 'import { CapabilityRegistryService } from "./capability-registry.service";'

    $Module = $Module.Insert(
        $LastImport.Index + $LastImport.Length,
        "`r`n$ImportLine"
    )
}

# ============================================================
# Ensure providers array
# ============================================================

$ProvidersMatch = [regex]::Match(
    $Module,
    'providers\s*:\s*\[(?<items>[\s\S]*?)\]'
)

if (-not $ProvidersMatch.Success) {
    $Module = [regex]::Replace(
        $Module,
        '@Module\s*\(\s*\{',
        "@Module({`r`n  providers: [],",
        1
    )
}

foreach ($ServiceName in $RequiredServices) {
    $ProvidersMatch = [regex]::Match(
        $Module,
        'providers\s*:\s*\[(?<items>[\s\S]*?)\]'
    )

    if (
        -not $ProvidersMatch.Success -or
        $ProvidersMatch.Groups["items"].Value -notmatch "\b$ServiceName\b"
    ) {
        $Module = [regex]::Replace(
            $Module,
            'providers\s*:\s*\[',
            "providers: [`r`n    $ServiceName,",
            1
        )
    }
}

# ============================================================
# Ensure CapabilityRegistryService is exported
# ============================================================

$ExportsMatch = [regex]::Match(
    $Module,
    'exports\s*:\s*\[(?<items>[\s\S]*?)\]'
)

if ($ExportsMatch.Success) {
    if ($ExportsMatch.Groups["items"].Value -notmatch '\bCapabilityRegistryService\b') {
        $Module = [regex]::Replace(
            $Module,
            'exports\s*:\s*\[',
            "exports: [`r`n    CapabilityRegistryService,",
            1
        )
    }
}
else {
    $Module = [regex]::Replace(
        $Module,
        '(\r?\n\s*)\}\s*\)\s*export\s+class\s+CapabilityFabricModule',
        "`r`n  exports: [CapabilityRegistryService],`r`n})`r`nexport class CapabilityFabricModule",
        1
    )
}

[IO.File]::WriteAllText(
    $ModuleFile,
    $Module,
    [Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "CapabilityFabricModule patched." -ForegroundColor Green
Write-Host "Backup: $Backup" -ForegroundColor DarkGray
Write-Host ""

Select-String `
    -Path $ModuleFile `
    -Pattern "CapabilityFoundationValidatorService|CapabilityDependencyGraphService|CapabilityRegistryService|providers:|exports:"

Set-Location (Join-Path $Root "apps\api")

pnpm exec tsc --noEmit -p tsconfig.json

if ($LASTEXITCODE -ne 0) {
    throw "TypeScript check failed."
}

pnpm build

if ($LASTEXITCODE -ne 0) {
    throw "Build failed."
}

Write-Host ""
Write-Host "Build passed. Starting NestJS..." -ForegroundColor Green

pnpm start:dev
