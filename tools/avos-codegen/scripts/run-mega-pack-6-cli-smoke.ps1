$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$Commands = @(
    @("help", "--json"),
    @("doctor", "--json")
)

foreach ($Command in $Commands) {
    $Result = & node `
        ".\dist\cli\codegen-cli-entrypoint.js" `
        @Command

    if ($LASTEXITCODE -ne 0) {
        throw "CLI smoke command failed: $($Command -join ' ')"
    }

    $Result
}
