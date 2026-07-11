$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

node -e @"
const {
  CodeGenGeneratorV3Runtime
} = require('./dist');

const runtime =
  new CodeGenGeneratorV3Runtime();

const result =
  runtime.execute({
    moduleName:
      'Inventory Control',
    entityName:
      'Inventory Item',
    routeName:
      'inventory-items',
    workspaceRoot:
      process.cwd(),
    targetRoot:
      process.cwd(),
    fields: [
      {
        name:
          'name',
        type:
          'string',
        required:
          true,
        maxLength:
          200
      },
      {
        name:
          'quantity',
        type:
          'number',
        required:
          true,
        indexed:
          true
      },
      {
        name:
          'active',
        type:
          'boolean',
        required:
          true,
        defaultValue:
          true
      }
    ],
    includeController:
      true,
    includeService:
      true,
    includeDtos:
      true,
    includePrisma:
      true,
    includeTests:
      true,
    includeManifest:
      true,
    includeIndex:
      true,
    metadata: {
      owner:
        'AVOS',
      classification:
        'production-smoke'
    }
  });

console.log(
  JSON.stringify(
    result,
    null,
    2
  )
);

if (
  !result.success ||
  result.artifacts.length < 8
) {
  process.exit(1);
}
"@
