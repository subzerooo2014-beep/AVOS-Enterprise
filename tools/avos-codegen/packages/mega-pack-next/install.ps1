& {
    # ============================================================
    # AVOS MEGA PACK PACKAGE — PRODUCTION INSTALLER
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

    $PayloadZip =
        Join-Path $PackageRoot "payload.zip"

    $BackupRoot =
        Join-Path $PackageRoot "backup"

    $LogsRoot =
        Join-Path $PackageRoot "logs"

    $ExtractRoot =
        Join-Path $PackageRoot ".extract"

    if (-not (Test-Path $ManifestPath)) {
        throw "manifest.json is missing."
    }

    if (-not (Test-Path $PayloadZip)) {
        throw "payload.zip is missing."
    }

    $Manifest =
        Get-Content `
            -Path $ManifestPath `
            -Raw |
        ConvertFrom-Json

    $ProjectRoot =
        [string]$Manifest.installation.projectRoot

    if (-not (Test-Path (Join-Path $ProjectRoot "package.json"))) {
        throw "Target AVOS CodeGen project was not found: $ProjectRoot"
    }

    New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
    New-Item -ItemType Directory -Force -Path $LogsRoot | Out-Null

    $Timestamp =
        Get-Date -Format "yyyyMMdd-HHmmss"

    $BackupSessionRoot =
        Join-Path $BackupRoot $Timestamp

    $LogPath =
        Join-Path $LogsRoot "install-$Timestamp.log"

    function Write-InstallLog {
        param(
            [Parameter(Mandatory = $true)]
            [string]$Message
        )

        $Line =
            "[{0}] {1}" -f `
            (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), `
            $Message

        $Line |
            Tee-Object `
                -FilePath $LogPath `
                -Append
    }

    try {
        Write-InstallLog "AVOS Mega Pack installation started."

        $ActualHash =
            (
                Get-FileHash `
                    -Path $PayloadZip `
                    -Algorithm SHA256
            ).Hash

        $ExpectedHash =
            [string]$Manifest.payload.checksum

        if ($ActualHash -ne $ExpectedHash) {
            throw "payload.zip checksum does not match manifest.json."
        }

        Write-InstallLog "Payload checksum verified."

        if (Test-Path $ExtractRoot) {
            Remove-Item `
                -Path $ExtractRoot `
                -Recurse `
                -Force
        }

        New-Item `
            -ItemType Directory `
            -Path $ExtractRoot `
            -Force |
            Out-Null

        Expand-Archive `
            -Path $PayloadZip `
            -DestinationPath $ExtractRoot `
            -Force

        Write-InstallLog "Payload extracted."

        $PayloadFiles =
            Get-ChildItem `
                -Path $ExtractRoot `
                -Recurse `
                -File

        if ($PayloadFiles.Count -eq 0) {
            throw "Payload archive contains no files."
        }

        New-Item `
            -ItemType Directory `
            -Path $BackupSessionRoot `
            -Force |
            Out-Null

        $BackupManifest = @()

        foreach ($File in $PayloadFiles) {
            $RelativePath =
                $File.FullName.Substring(
                    $ExtractRoot.Length
                ).TrimStart(
                    [char[]]"\/"
                )

            $TargetPath =
                Join-Path `
                    $ProjectRoot `
                    $RelativePath

            $BackupPath =
                Join-Path `
                    $BackupSessionRoot `
                    $RelativePath

            $Existed =
                Test-Path $TargetPath

            if ($Existed) {
                New-Item `
                    -ItemType Directory `
                    -Path (Split-Path -Parent $BackupPath) `
                    -Force |
                    Out-Null

                Copy-Item `
                    -Path $TargetPath `
                    -Destination $BackupPath `
                    -Force
            }

            $BackupManifest +=
                [PSCustomObject]@{
                    relativePath = $RelativePath
                    targetPath   = $TargetPath
                    backupPath   = $BackupPath
                    existed      = $Existed
                }
        }

        $BackupManifest |
            ConvertTo-Json -Depth 10 |
            Set-Content `
                -Path (Join-Path $BackupSessionRoot "backup-manifest.json") `
                -Encoding UTF8

        Write-InstallLog "Backup completed for $($PayloadFiles.Count) payload files."

        foreach ($File in $PayloadFiles) {
            $RelativePath =
                $File.FullName.Substring(
                    $ExtractRoot.Length
                ).TrimStart(
                    [char[]]"\/"
                )

            $TargetPath =
                Join-Path `
                    $ProjectRoot `
                    $RelativePath

            New-Item `
                -ItemType Directory `
                -Path (Split-Path -Parent $TargetPath) `
                -Force |
                Out-Null

            Copy-Item `
                -Path $File.FullName `
                -Destination $TargetPath `
                -Force
        }

        Write-InstallLog "Payload files installed."

        $MainIndex =
            Join-Path $ProjectRoot "src\index.ts"

        if (-not (Test-Path $MainIndex)) {
            throw "src/index.ts was not found."
        }

        $IndexBackupPath =
            Join-Path `
                $BackupSessionRoot `
                "src\index.ts"

        if (-not (Test-Path $IndexBackupPath)) {
            New-Item `
                -ItemType Directory `
                -Path (Split-Path -Parent $IndexBackupPath) `
                -Force |
                Out-Null

            Copy-Item `
                -Path $MainIndex `
                -Destination $IndexBackupPath `
                -Force
        }

        $IndexContent =
            Get-Content `
                -Path $MainIndex `
                -Raw

        $ExportLine =
            'export * from "./template-engine-v2";'

        if (-not $IndexContent.Contains($ExportLine)) {
            $IndexContent =
                $IndexContent.TrimEnd() +
                "`r`n" +
                $ExportLine +
                "`r`n"

            $IndexContent |
                Set-Content `
                    -Path $MainIndex `
                    -Encoding UTF8
        }

        Write-InstallLog "Root export updated."

        Push-Location $ProjectRoot

        try {
            Write-InstallLog "Running pnpm build."

            pnpm build

            if ($LASTEXITCODE -ne 0) {
                throw "pnpm build failed."
            }
        }
        finally {
            Pop-Location
        }

        Write-InstallLog "Build passed."

        $Manifest.status =
            "installed"

        if (
            -not (
                $Manifest.installation.PSObject.Properties.Name -contains
                "lastBackup"
            )
        ) {
            $Manifest.installation |
                Add-Member `
                    -MemberType NoteProperty `
                    -Name "lastBackup" `
                    -Value $BackupSessionRoot
        }
        else {
            $Manifest.installation.lastBackup =
                $BackupSessionRoot
        }

        if (
            -not (
                $Manifest.installation.PSObject.Properties.Name -contains
                "installedAt"
            )
        ) {
            $Manifest.installation |
                Add-Member `
                    -MemberType NoteProperty `
                    -Name "installedAt" `
                    -Value (Get-Date).ToString("o")
        }
        else {
            $Manifest.installation.installedAt =
                (Get-Date).ToString("o")
        }

        $Manifest |
            ConvertTo-Json -Depth 20 |
            Set-Content `
                -Path $ManifestPath `
                -Encoding UTF8

        Write-InstallLog "Manifest updated."
        Write-InstallLog "AVOS Mega Pack installation completed successfully."

        Write-Host ""
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host "AVOS MEGA PACK INSTALLED SUCCESSFULLY" -ForegroundColor Green
        Write-Host "============================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Installed files:" -ForegroundColor Yellow
        Write-Host $PayloadFiles.Count -ForegroundColor White
        Write-Host "Backup:" -ForegroundColor Yellow
        Write-Host $BackupSessionRoot -ForegroundColor White
        Write-Host "Log:" -ForegroundColor Yellow
        Write-Host $LogPath -ForegroundColor White
    }
    catch {
        Write-InstallLog "Installation failed: $($_.Exception.Message)"

        if (Test-Path $BackupSessionRoot) {
            Write-InstallLog "Starting automatic rollback."

            $BackupManifestPath =
                Join-Path `
                    $BackupSessionRoot `
                    "backup-manifest.json"

            if (Test-Path $BackupManifestPath) {
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

                Write-InstallLog "Automatic rollback completed."
            }
        }

        throw
    }
    finally {
        if (Test-Path $ExtractRoot) {
            Remove-Item `
                -Path $ExtractRoot `
                -Recurse `
                -Force `
                -ErrorAction SilentlyContinue
        }
    }
}

