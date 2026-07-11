& {
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

    $PayloadPath =
        Join-Path $PackageRoot "payload.zip"

    $InstallPath =
        Join-Path $PackageRoot "install.ps1"

    $RollbackPath =
        Join-Path $PackageRoot "rollback.ps1"

    if (-not (Test-Path $ManifestPath)) {
        throw "manifest.json is missing."
    }

    if (-not (Test-Path $PayloadPath)) {
        throw "payload.zip is missing."
    }

    $Manifest =
        Get-Content `
            -Path $ManifestPath `
            -Raw |
        ConvertFrom-Json

    $ActualHash =
        (
            Get-FileHash `
                -Path $PayloadPath `
                -Algorithm SHA256
        ).Hash

    $ChecksumMatches =
        $ActualHash -eq
        [string]$Manifest.payload.checksum

    if (-not $ChecksumMatches) {
        throw "payload checksum mismatch."
    }

    $ProjectRoot =
        [string]$Manifest.installation.projectRoot

    $InstalledRuntime =
        Join-Path `
            $ProjectRoot `
            "src\template-engine-v2\compiler\codegen-template-compiler-v2.ts"

    [PSCustomObject]@{
        success           = $true
        system            = $Manifest.system
        packageId         = $Manifest.packageId
        status            = $Manifest.status
        payloadPresent    = Test-Path $PayloadPath
        checksumMatches   = $ChecksumMatches
        installerPresent  = Test-Path $InstallPath
        rollbackPresent   = Test-Path $RollbackPath
        installedRuntime  = Test-Path $InstalledRuntime
        payloadFiles      = $Manifest.payload.files
        payloadSourceLines= $Manifest.payload.sourceLines
        healthStatus      = "package-ready"
    } | Format-List
}
