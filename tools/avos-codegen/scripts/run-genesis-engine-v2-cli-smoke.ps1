$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SpecificationPath = Join-Path $env:TEMP "avos-genesis-v2-cli-smoke.json"
$OutputDirectory = Join-Path $env:TEMP "avos-genesis-v2-cli-output"

Remove-Item $OutputDirectory `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue

$Specification = [ordered]@{
    mode = "dry-run"
    pipeline = [ordered]@{
        outputDirectory = $OutputDirectory
        currentVersion = "1.0.0"
        versionBump = "minor"
        previousVersion = "1.0.0"
        overwrite = $true
        intent = [ordered]@{
            systemKey = "avos-cli-smoke-system"
            name = "AVOS CLI Smoke System"
            description = "CLI smoke test generated system."
            businessGoals = @(
                "validate command center"
            )
            targetUsers = @(
                "operators"
            )
            domains = @(
                "identity",
                "catalog"
            )
            constraints = @(
                "security-first"
            )
            nonFunctionalRequirements = [ordered]@{
                availability = 99.9
            }
        }
        validationGates = @()
    }
}

$Specification |
    ConvertTo-Json -Depth 20 |
    Set-Content `
        -Path $SpecificationPath `
        -Encoding UTF8

try {
    $Output = node `
        ".\dist\genesis-engine-v2-cli\cli.js" `
        $SpecificationPath

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v2 CLI smoke test failed."
    }

    $Result = $Output | ConvertFrom-Json

    if (-not $Result.success) {
        throw "Genesis Engine v2 CLI did not return success."
    }

    if ($Result.mode -ne "dry-run") {
        throw "Genesis Engine v2 CLI returned an unexpected mode."
    }

    if ($Result.pipelineExecuted) {
        throw "Dry run unexpectedly executed the pipeline."
    }

    [PSCustomObject]@{
        success          = $true
        system           = "AVOS Genesis Engine"
        bundle           = "Genesis Engine v2 Command Center & CLI"
        version          = "2.6.0"
        mode             = $Result.mode
        pipelineExecuted = $Result.pipelineExecuted
        systemKey        = $Result.summary.systemKey
        domains          = $Result.summary.domains
        validationGates  = $Result.summary.validationGates
        healthStatus     = "healthy"
    } | ConvertTo-Json -Depth 10
}
finally {
    Remove-Item $SpecificationPath -Force -ErrorAction SilentlyContinue
    Remove-Item $OutputDirectory -Recurse -Force -ErrorAction SilentlyContinue
}
