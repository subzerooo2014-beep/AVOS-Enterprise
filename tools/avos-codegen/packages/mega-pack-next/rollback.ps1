& {
    # ============================================================
    # AVOS MEGA PACK PACKAGE — PRODUCTION ROLLBACK
    # ============================================================

    $ErrorActionPreference = "Stop"

    $PackageRoot =
        if ($PSScriptRoot) {
            $PSScriptRoot
        }
        else {
            (Get-Location).Path
        }

    $ManifestPath =
        Join-Path $PackageRoot "manifest.json"

    if (-not (Test-Path $ManifestPath)) {
        throw "manifest.json is missing."
    }

    $Manifest =
        Get-Content `
            -Path $ManifestPath `
            -Raw |
        ConvertFrom-Json

    $ProjectRoot =
        [string]$Manifest.installation.projectRoot

    $BackupRoot =
        Join-Path $PackageRoot "backup"

    $BackupSessionRoot =
        if (
            $Manifest.installation.PSObject.Properties.Name -contains
            "lastBackup"
        ) {
            [string]$Manifest.installation.lastBackup
        }
        else {
            ""
        }

    if (
        -not $BackupSessionRoot -or
        -not (Test-Path $BackupSessionRoot)
    ) {
        $LatestBackup =
            Get-ChildItem `
                -Path $BackupRoot `
                -Directory `
                -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            Select-Object -First 1

        if (-not $LatestBackup) {
            throw "No backup session was found."
        }

        $BackupSessionRoot =
            $LatestBackup.FullName
    }

    $BackupManifestPath =
        Join-Path `
            $BackupSessionRoot `
            "backup-manifest.json"

    if (-not (Test-Path $BackupManifestPath)) {
        throw "backup-manifest.json was not found."
    }

    $BackupManifest =
        Get-Content `
            -Path $BackupManifestPath `
            -Raw |
        ConvertFrom-Json

    foreach ($Entry in $BackupManifest) {
        if ($Entry.existed) {
            New-Item `
                -ItemType Directory `
                -Path (Split-Path -Parent $Entry.targetPath) `
                -Force |
                Out-Null

            Copy-Item `
                -Path $Entry.backupPath `
                -Destination $Entry.targetPath `
                -Force
        }
        elseif (Test-Path $Entry.targetPath) {
            Remove-Item `
                -Path $Entry.targetPath `
                -Force
        }
    }

    $IndexBackup =
        Join-Path `
            $BackupSessionRoot `
            "src\index.ts"

    $MainIndex =
        Join-Path `
            $ProjectRoot `
            "src\index.ts"

    if (Test-Path $IndexBackup) {
        Copy-Item `
            -Path $IndexBackup `
            -Destination $MainIndex `
            -Force
    }

    Push-Location $ProjectRoot

    try {
        pnpm build

        if ($LASTEXITCODE -ne 0) {
            throw "Build failed after rollback."
        }
    }
    finally {
        Pop-Location
    }

    $Manifest.status =
        "rolled-back"

    $Manifest |
        ConvertTo-Json -Depth 20 |
        Set-Content `
            -Path $ManifestPath `
            -Encoding UTF8

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "AVOS MEGA PACK ROLLBACK COMPLETED" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Restored backup:" -ForegroundColor Yellow
    Write-Host $BackupSessionRoot -ForegroundColor White
}
