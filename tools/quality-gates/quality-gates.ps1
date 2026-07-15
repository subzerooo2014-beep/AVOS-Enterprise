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

    & $Command @Arguments
    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0) {
        throw "$Name failed with exit code $exitCode"
    }
}

function Invoke-AvosTypeScript {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)

    $apiRoot = Join-Path $RepoRoot "apps/api"

    Invoke-AvosNative `
        -Command "pnpm" `
        -Arguments @("--dir", $apiRoot, "exec", "tsc", "--noEmit") `
        -Name "API TypeScript"

    return [pscustomobject]@{
        status = "PASS"
        project = "apps/api"
    }
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

    return [pscustomobject]@{ status = "PASS" }
}

function Invoke-AvosFlutterAnalyze {
    param(
        [Parameter(Mandatory=$true)][string]$RepoRoot,
        [switch]$Skip
    )

    if ($Skip) {
        return [pscustomobject]@{
            status = "SKIPPED"
            exitCode = 0
            errors = 0
            warnings = 0
            infos = 0
        }
    }

    $mobileRoot = Join-Path $RepoRoot "apps/mobile"

    if (-not (Test-Path -LiteralPath (Join-Path $mobileRoot "pubspec.yaml"))) {
        return [pscustomobject]@{
            status = "NOT_APPLICABLE"
            exitCode = 0
            errors = 0
            warnings = 0
            infos = 0
        }
    }

    Push-Location $mobileRoot

    try {
        $previousErrorAction = $ErrorActionPreference
        $ErrorActionPreference = "Continue"

        try {
            $output = @(& flutter analyze 2>&1)
            $exitCode = $LASTEXITCODE
        }
        finally {
            $ErrorActionPreference = $previousErrorAction
        }
    }
    finally {
        Pop-Location
    }

    foreach ($line in $output) {
        Write-Host $line
    }

    $text = $output -join [Environment]::NewLine
    $errors = ([regex]::Matches($text, '(?im)^\s*error\s+-')).Count
    $warnings = ([regex]::Matches($text, '(?im)^\s*warning\s+-')).Count
    $infos = ([regex]::Matches($text, '(?im)^\s*info\s+-')).Count

    if ($errors -gt 0 -or $warnings -gt 0) {
        throw "Flutter Analyze failed: exitCode=$exitCode errors=$errors warnings=$warnings infos=$infos"
    }

    return [pscustomobject]@{
        status = if ($infos -gt 0) { "PASS_WITH_INFO" } else { "PASS" }
        exitCode = $exitCode
        errors = $errors
        warnings = $warnings
        infos = $infos
    }
}

function Get-AvosWorkspacePackages {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)

    Push-Location $RepoRoot

    try {
        $previousErrorAction = $ErrorActionPreference
        $ErrorActionPreference = "Continue"

        try {
            $output = @(& pnpm -r list --depth -1 --json 2>&1)
            $exitCode = $LASTEXITCODE
        }
        finally {
            $ErrorActionPreference = $previousErrorAction
        }
    }
    finally {
        Pop-Location
    }

    if ($exitCode -ne 0) {
        throw "Unable to enumerate workspace packages. Exit code: $exitCode"
    }

    return @(($output -join [Environment]::NewLine) | ConvertFrom-Json)
}

function Invoke-AvosWorkspaceTests {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)

    $packages = Get-AvosWorkspacePackages -RepoRoot $RepoRoot
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
            $skipped += 1
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

        if ($null -eq $testProperty -or [string]::IsNullOrWhiteSpace([string]$testProperty.Value)) {
            $skipped += 1
            continue
        }

        Write-Host "`nTesting workspace package: $packageName" -ForegroundColor Cyan

        Push-Location $packagePath

        try {
            $previousErrorAction = $ErrorActionPreference
            $ErrorActionPreference = "Continue"

            try {
                $output = @(& pnpm test 2>&1)
                $exitCode = $LASTEXITCODE
            }
            finally {
                $ErrorActionPreference = $previousErrorAction
            }
        }
        finally {
            Pop-Location
        }

        foreach ($line in $output) {
            Write-Host $line
        }

        $tested += 1

        if ($exitCode -ne 0) {
            throw "Workspace test failed: package=$packageName path=$packagePath exitCode=$exitCode script=$($testProperty.Value)"
        }
    }

    return [pscustomobject]@{
        status = "PASS"
        tested = $tested
        skipped = $skipped
        failed = 0
    }
}

function Invoke-AvosGitFinalize {
    param(
        [Parameter(Mandatory=$true)][string]$RepoRoot,
        [Parameter(Mandatory=$true)][string]$CommitMessage,
        [switch]$SkipCommit,
        [switch]$Push
    )

    Push-Location $RepoRoot

    try {
        git add --all

        if ($LASTEXITCODE -ne 0) {
            throw "git add failed"
        }

        $staged = @(git diff --cached --name-only)

        if ($staged.Count -gt 0) {
            if ($SkipCommit) {
                return "STAGED"
            }

            Invoke-AvosNative `
                -Command "git" `
                -Arguments @("commit", "-m", $CommitMessage) `
                -Name "Git commit"

            if ($Push) {
                Invoke-AvosNative `
                    -Command "git" `
                    -Arguments @("push") `
                    -Name "Git push"
            }
        }

        $status = @(git status --porcelain)

        if ($status.Count -gt 0) {
            git status --short
            throw "Working tree is not clean."
        }

        return "working tree clean"
    }
    finally {
        Pop-Location
    }
}