Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Section {
    param([Parameter(Mandatory=$true)][string]$Title)
    Write-Host ""
    Write-Host ("=" * 118) -ForegroundColor DarkCyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host ("=" * 118) -ForegroundColor DarkCyan
}

function Resolve-AvosRepoRoot {
    param([string]$StartPath = (Get-Location).Path)

    $current = Get-Item -LiteralPath (Resolve-Path $StartPath).Path
    while ($null -ne $current) {
        $apiPath = Join-Path $current.FullName "apps\api"
        $gitPath = Join-Path $current.FullName ".git"

        if ((Test-Path $apiPath) -and (Test-Path $gitPath)) {
            return $current.FullName
        }

        $current = $current.Parent
    }

    throw "AVOS repository root was not found."
}

function Get-SdosPipelineRoot {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)
    Join-Path $RepoRoot ".avos\sdos-pipeline-v2"
}

function Get-SdosStatePath {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)
    Join-Path (Get-SdosPipelineRoot -RepoRoot $RepoRoot) "state.json"
}

function Read-SdosState {
    param([Parameter(Mandatory=$true)][string]$RepoRoot)

    $path = Get-SdosStatePath -RepoRoot $RepoRoot

    if (-not (Test-Path $path)) {
        throw "Pipeline state not found. Run Pack 01 first."
    }

    Get-Content $path -Raw | ConvertFrom-Json
}

function Save-SdosState {
    param(
        [Parameter(Mandatory=$true)][string]$RepoRoot,
        [Parameter(Mandatory=$true)][object]$State
    )

    $root = Get-SdosPipelineRoot -RepoRoot $RepoRoot
    New-Item -ItemType Directory -Path $root -Force | Out-Null

    $State.updatedAt = (Get-Date).ToString("o")

    $State |
        ConvertTo-Json -Depth 50 |
        Set-Content (Get-SdosStatePath -RepoRoot $RepoRoot) -Encoding UTF8
}

function Set-SdosGate {
    param(
        [Parameter(Mandatory=$true)][object]$State,
        [Parameter(Mandatory=$true)][string]$Gate,
        [Parameter(Mandatory=$true)][bool]$Value
    )

    $State.gates.$Gate = $Value
}

function Assert-SdosGate {
    param(
        [Parameter(Mandatory=$true)][object]$State,
        [Parameter(Mandatory=$true)][string]$Gate
    )

    if ($State.gates.$Gate -ne $true) {
        throw "Required pipeline gate '$Gate' is not passed."
    }
}

function Invoke-CheckedProcess {
    param(
        [Parameter(Mandatory=$true)][string]$WorkingDirectory,
        [Parameter(Mandatory=$true)][string]$FilePath,
        [Parameter(Mandatory=$true)][string[]]$Arguments,
        [Parameter(Mandatory=$true)][string]$StdOutPath,
        [Parameter(Mandatory=$true)][string]$StdErrPath
    )

    $process = Start-Process `
        -FilePath $FilePath `
        -ArgumentList $Arguments `
        -WorkingDirectory $WorkingDirectory `
        -NoNewWindow `
        -Wait `
        -PassThru `
        -RedirectStandardOutput $StdOutPath `
        -RedirectStandardError $StdErrPath

    if (Test-Path $StdOutPath) {
        Get-Content $StdOutPath | ForEach-Object { Write-Host $_ }
    }

    if (Test-Path $StdErrPath) {
        Get-Content $StdErrPath | ForEach-Object {
            Write-Host $_ -ForegroundColor DarkYellow
        }
    }

    if ($process.ExitCode -ne 0) {
        throw "$FilePath failed with exit code $($process.ExitCode)."
    }
}

function Wait-JsonEndpoint {
    param(
        [Parameter(Mandatory=$true)][string]$Uri,
        [int]$RetryCount = 24,
        [int]$DelaySeconds = 5
    )

    $lastError = $null

    for ($attempt = 1; $attempt -le $RetryCount; $attempt++) {
        try {
            return Invoke-RestMethod `
                -Method Get `
                -Uri $Uri `
                -TimeoutSec 15
        }
        catch {
            $lastError = $_

            if ($attempt -lt $RetryCount) {
                Write-Host "Runtime check $attempt/$RetryCount failed; retrying..." -ForegroundColor Yellow
                Start-Sleep -Seconds $DelaySeconds
            }
        }
    }

    throw "Endpoint did not become ready: $Uri. Last error: $($lastError.Exception.Message)"
}

function Invoke-JsonEndpoint {
    param(
        [Parameter(Mandatory=$true)][ValidateSet("GET","POST")][string]$Method,
        [Parameter(Mandatory=$true)][string]$Uri,
        [object]$Body
    )

    try {
        if ($Method -eq "GET") {
            return Invoke-RestMethod `
                -Method Get `
                -Uri $Uri `
                -TimeoutSec 20
        }

        $json = if ($null -eq $Body) {
            "{}"
        }
        else {
            $Body | ConvertTo-Json -Depth 20
        }

        return Invoke-RestMethod `
            -Method Post `
            -Uri $Uri `
            -ContentType "application/json" `
            -Body $json `
            -TimeoutSec 20
    }
    catch {
        throw "Endpoint call failed: $Method $Uri. $($_.Exception.Message)"
    }
}

function Add-NestImportSafely {
    param(
        [Parameter(Mandatory=$true)][string]$ModuleFile,
        [Parameter(Mandatory=$true)][string]$ClassName,
        [Parameter(Mandatory=$true)][string]$ImportPath
    )

    if (-not (Test-Path $ModuleFile)) {
        throw "Module file not found: $ModuleFile"
    }

    $content = Get-Content $ModuleFile -Raw
    $importLine = "import { $ClassName } from '$ImportPath';"

    if ($content -notmatch [regex]::Escape($importLine)) {
        $content = $importLine + "`r`n" + $content
    }

    $importsPattern = "(?s)imports\s*:\s*\[[^\]]*\b" + [regex]::Escape($ClassName) + "\b"

    if ($content -notmatch $importsPattern) {
        $match = [regex]::Match($content, "(?s)imports\s*:\s*\[")

        if (-not $match.Success) {
            throw "Unable to locate imports array in $ModuleFile"
        }

        $insertAt = $match.Index + $match.Length

        $content =
            $content.Substring(0, $insertAt) +
            "`r`n    $ClassName," +
            $content.Substring($insertAt)
    }

    Set-Content $ModuleFile $content -Encoding UTF8
}

