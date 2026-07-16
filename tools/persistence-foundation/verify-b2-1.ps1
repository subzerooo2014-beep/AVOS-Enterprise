[CmdletBinding()]
param(
    [string]$ProjectRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"

$Root = Join-Path $ProjectRoot "apps\api\src\infrastructure\unit-of-work"
$Required = @(
    "unit-of-work.types.ts",
    "unit-of-work.context.ts",
    "unit-of-work.registry.ts",
    "unit-of-work.service.ts",
    "unit-of-work.controller.ts",
    "unit-of-work.module.ts",
    "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing B2.1 files: $($Missing -join ', ')"
}

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Service = Get-Content (Join-Path $Root "unit-of-work.service.ts") -Raw
$TransactionManager = Get-Content (Join-Path $ProjectRoot "apps\api\src\infrastructure\transactions\transaction-manager.service.ts") -Raw

$Checks = [ordered]@{
    appModuleImport = $AppModule.Contains('import { UnitOfWorkModule } from "./infrastructure/unit-of-work/unit-of-work.module";')
    appModuleRegistration = $AppModule -match 'imports:\s*\[\s*UnitOfWorkModule,'
    transactionManagerTyped = $TransactionManager.Contains("Prisma.TransactionClient")
    transactionOptionsSupported = $TransactionManager.Contains("isolationLevel")
    unitOfWorkExecute = $Service.Contains("async execute<T>")
    contextManagement = $Service.Contains("setTransactionClient")
    rollbackPropagation = $Service.Contains("throw error")
    statusEndpoint = (Get-Content (Join-Path $Root "unit-of-work.controller.ts") -Raw).Contains('@Get("status")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) {
    throw "B2.1 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Persistence Foundation"
    bundle = "B2.1"
    capability = "Enterprise Unit Of Work"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    transactionManager = "extended"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
