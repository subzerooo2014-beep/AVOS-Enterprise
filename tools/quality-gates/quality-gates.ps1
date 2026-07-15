Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

function Invoke-AvosNative {
    param(
        [Parameter(Mandatory=$true)][string]$Command,
        [string[]]$Arguments = @(),
        [string]$Name = $Command
    )

    & $Command @Arguments | Out-Host
    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0) {
        throw "$Name failed with exit code $exitCode"
    }
}

function Invoke-AvosTypeScript {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)

    Invoke-AvosNative `
        -Command "pnpm" `
        -Arguments @(
            "--dir",
            (Join-Path $RepoRoot "apps/api"),
            "exec",
            "tsc",
            "--noEmit"
        ) `
        -Name "API TypeScript"

    Write-Output -NoEnumerate ([pscustomobject]@{
        status = "PASS"
        project = "apps/api"
    })
}

function Invoke-AvosBuild {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)

    Push-Location $RepoRoot
    try {
        Invoke-AvosNative `
            -Command "pnpm" `
            -Arguments @("build") `
            -Name "Workspace build"
    }
    finally {
        Pop-Location
    }

    Write-Output -NoEnumerate ([pscustomobject]@{
        status = "PASS"
    })
}

function Invoke-AvosFlutterAnalyze {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)

    $mobileRoot = Join-Path $RepoRoot "apps/mobile"

    if (-not (Test-Path -LiteralPath (Join-Path $mobileRoot "pubspec.yaml"))) {
        Write-Output -NoEnumerate ([pscustomobject]@{
            status = "NOT_APPLICABLE"
            exitCode = 0
            errors = 0
            warnings = 0
            infos = 0
        })
        return
    }

    Push-Location $mobileRoot
    try {
        $previous = $ErrorActionPreference
        $ErrorActionPreference = "Continue"

        try {
            $output = @(& flutter analyze 2>&1)
            $exitCode = $LASTEXITCODE
        }
        finally {
            $ErrorActionPreference = $previous
        }
    }
    finally {
        Pop-Location
    }

    $output | ForEach-Object { Write-Host $_ }

    $text = $output -join [Environment]::NewLine
    $errors = ([regex]::Matches($text, '(?im)^\s*error\s+-')).Count
    $warnings = ([regex]::Matches($text, '(?im)^\s*warning\s+-')).Count
    $infos = ([regex]::Matches($text, '(?im)^\s*info\s+-')).Count

    if ($errors -gt 0 -or $warnings -gt 0) {
        throw "Flutter Analyze failed: errors=$errors warnings=$warnings infos=$infos"
    }

    Write-Output -NoEnumerate ([pscustomobject]@{
        status = if ($infos -gt 0) { "PASS_WITH_INFO" } else { "PASS" }
        exitCode = $exitCode
        errors = $errors
        warnings = $warnings
        infos = $infos
    })
}

function Invoke-AvosWorkspaceTests {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)

    Push-Location $RepoRoot
    try {
        $previous = $ErrorActionPreference
        $ErrorActionPreference = "Continue"

        try {
            $raw = @(& pnpm -r list --depth -1 --json 2>&1)
            $listExit = $LASTEXITCODE
        }
        finally {
            $ErrorActionPreference = $previous
        }
    }
    finally {
        Pop-Location
    }

    if ($listExit -ne 0) {
        throw "Unable to enumerate pnpm workspace packages."
    }

    $packages = @(($raw -join [Environment]::NewLine) | ConvertFrom-Json)
    $tested = 0
    $skipped = 0

    foreach ($package in $packages) {
        $packagePath = [string]$package.path
        $packageName = [string]$package.name

        if ([string]::IsNullOrWhiteSpace($packagePath)) {
            continue
        }

        $packageJsonPath = Join-Path $packagePath "package.json"

        if (-not (Test-Path -LiteralPath $packageJsonPath)) {
            $skipped++
            continue
        }

        $packageJson = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
        $testProperty = $null

        if (
            $packageJson.PSObject.Properties.Name -contains "scripts" -and
            $null -ne $packageJson.scripts
        ) {
            $testProperty = $packageJson.scripts.PSObject.Properties["test"]
        }

        if ($null -eq $testProperty) {
            $skipped++
            continue
        }

        Write-Host "`nTesting workspace package: $packageName" -ForegroundColor Cyan

        Push-Location $packagePath
        try {
            $previous = $ErrorActionPreference
            $ErrorActionPreference = "Continue"

            try {
                $output = @(& pnpm test 2>&1)
                $exitCode = $LASTEXITCODE
            }
            finally {
                $ErrorActionPreference = $previous
            }
        }
        finally {
            Pop-Location
        }

        $output | ForEach-Object { Write-Host $_ }
        $tested++

        if ($exitCode -ne 0) {
            throw "Workspace test failed: package=$packageName path=$packagePath exitCode=$exitCode script=$($testProperty.Value)"
        }
    }

    Write-Output -NoEnumerate ([pscustomobject]@{
        status = "PASS"
        tested = $tested
        skipped = $skipped
        failed = 0
    })
}