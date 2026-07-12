param(
    [Parameter(Mandatory = $true)]
    [string]$SpecificationPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory,

    [string]$CurrentVersion = "1.0.0",

    [ValidateSet("major", "minor", "patch")]
    [string]$VersionBump = "minor",

    [switch]$Overwrite
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$ResolvedSpecificationPath = Resolve-Path $SpecificationPath
$RunnerPath = Join-Path $env:TEMP "avos-genesis-final-runner.cjs"

@'
const fs = require("node:fs");
const {
  GenesisFinalExecutionOrchestrator,
} = require(process.cwd() + "/dist/genesis-engine-final-execution");

const specificationPath = process.argv[2];
const outputDirectory = process.argv[3];
const currentVersion = process.argv[4];
const versionBump = process.argv[5];
const overwrite = process.argv[6] === "true";

const raw = fs.readFileSync(specificationPath, "utf8").replace(/^\uFEFF/, "");
const specification = JSON.parse(raw);

(async () => {
  const result = await new GenesisFinalExecutionOrchestrator().execute({
    specification,
    outputDirectory,
    currentVersion,
    versionBump,
    previousVersion: currentVersion,
    overwrite,
  });

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
'@ | Set-Content `
    -Path $RunnerPath `
    -Encoding UTF8

try {
    node `
        $RunnerPath `
        $ResolvedSpecificationPath `
        $OutputDirectory `
        $CurrentVersion `
        $VersionBump `
        $Overwrite.IsPresent.ToString().ToLowerInvariant()

    if ($LASTEXITCODE -ne 0) {
        throw "AVOS Genesis Final Execution failed."
    }
}
finally {
    Remove-Item $RunnerPath -Force -ErrorAction SilentlyContinue
}
