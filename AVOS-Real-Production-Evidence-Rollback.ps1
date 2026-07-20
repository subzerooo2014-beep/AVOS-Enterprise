param(
    [string]$BackupPath = ""
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$RepoRoot = $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($BackupPath)) {
    $LatestBackup = Get-ChildItem 
        (Join-Path $RepoRoot ".avos\rollback") 
        -Directory |
        Where-Object {
            $_.Name -like "real-production-evidence-*"
        } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if ($null -eq $LatestBackup) {
        throw "No rollback snapshot was found."
    }

    $BackupPath = $LatestBackup.FullName
}

Get-ChildItem $BackupPath -Recurse -File |
    ForEach-Object {
        $Relative = $_.FullName.Substring(
            $BackupPath.Length
        ).TrimStart("\")

        $Destination = Join-Path 
            $RepoRoot 
            $Relative

        $Parent = Split-Path $Destination -Parent

        if (-not (Test-Path $Parent)) {
            New-Item 
                -ItemType Directory 
                -Path $Parent 
                -Force |
                Out-Null
        }

        Copy-Item 
            $_.FullName 
            $Destination 
            -Force
    }

Write-Host "Rollback completed from: $BackupPath" 
    -ForegroundColor Green
