Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

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
    param([string]$RepoRoot)

    $apiRoot = Join-Path $RepoRoot "apps/api"

    if (-not (Test-Path -LiteralPath (Join-Path $apiRoot "tsconfig.json"))) {
        throw "Missing API tsconfig."
    }

    Invoke-AvosNative `
        -Command "pnpm" `
        -Arguments @("--dir",$apiRoot,"exec","tsc","--noEmit") `
        -Name "API TypeScript"
}

function Invoke-AvosBuild {
    param([string]$RepoRoot)

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
}

function Invoke-AvosFlutterAnalyze {
    param(
        [string]$RepoRoot,
        [switch]$Skip
    )

    if ($Skip) {
        return [pscustomobject]@{
            status = "SKIPPED"
            errors = 0
            warnings = 0
            infos = 0
        }
    }

    $mobileRoot = Join-Path $RepoRoot "apps/mobile"
    $pubspec = Join-Path $mobileRoot "pubspec.yaml"

    if (-not (Test-Path -LiteralPath $pubspec)) {
        return [pscustomobject]@{
            status = "NOT_APPLICABLE"
            errors = 0
            warnings = 0
            infos = 0
        }
    }

    Push-Location $mobileRoot
    try {
        $output = & flutter analyze 2>&1
        $exitCode = $LASTEXITCODE
    }
    finally {
        Pop-Location
    }

    $text = ($output | Out-String)
    $errors = ([regex]::Matches($text,'(?im)^\s*error\s+-')).Count
    $warnings = ([regex]::Matches($text,'(?im)^\s*warning\s+-')).Count
    $infos = ([regex]::Matches($text,'(?im)^\s*info\s+-')).Count

    $output | ForEach-Object { Write-Host $_ }

    if ($errors -gt 0 -or $warnings -gt 0) {
        throw "Flutter Analyze failed: errors=$errors warnings=$warnings infos=$infos"
    }

    return [pscustomobject]@{
        status = if ($exitCode -eq 0 -or ($errors -eq 0 -and $warnings -eq 0)) {
            "PASS"
        }
        else {
            "PASS_WITH_INFO"
        }
        errors = $errors
        warnings = $warnings
        infos = $infos
    }
}

function Invoke-AvosWorkspaceTests {
    param(
        [string]$RepoRoot,
        [switch]$Skip
    )

    if ($Skip) {
        return "SKIPPED"
    }

    Push-Location $RepoRoot
    try {
        Invoke-AvosNative `
            -Command "pnpm" `
            -Arguments @("-r","test","--if-present") `
            -Name "Workspace tests"
    }
    finally {
        Pop-Location
    }

    return "PASS"
}

function Invoke-AvosScriptGate {
    param(
        [string]$RepoRoot,
        [string]$ScriptPath,
        [string]$Name
    )

    $resolved = Join-Path $RepoRoot $ScriptPath

    if (-not (Test-Path -LiteralPath $resolved)) {
        return [pscustomobject]@{
            status = "NOT_APPLICABLE"
            name = $Name
        }
    }

    & $resolved -RepoRoot $RepoRoot

    return [pscustomobject]@{
        status = "PASS"
        name = $Name
    }
}

function Invoke-AvosGitFinalize {
    param(
        [string]$RepoRoot,
        [string]$CommitMessage,
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
                -Arguments @("commit","-m",$CommitMessage) `
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