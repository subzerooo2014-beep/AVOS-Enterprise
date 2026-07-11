$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

node -e @"
const {
  CodeGenGeneratorV3Pipeline
} = require('./dist');

(async () => {
  const pipeline =
    new CodeGenGeneratorV3Pipeline();

  const result =
    await pipeline.execute({
      moduleName:
        'Customer Accounts',
      entityName:
        'Customer Account',
      routeName:
        'customer-accounts',
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
            250
        },
        {
          name:
            'email',
          type:
            'string',
          required:
            true,
          unique:
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
      includeRepository:
        true,
      includePagination:
        true,
      includeFiltering:
        true,
      includeOpenApi:
        true,
      includeIntegrationTests:
        true,
      includePrismaAdapter:
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
      {
        success:
          result.success,
        artifacts:
          result.artifacts.length,
        qualityScore:
          result.quality?.score,
        validationScore:
          result.validation?.score,
        warnings:
          result.warnings,
        errors:
          result.errors
      },
      null,
      2
    )
  );

  if (
    result.artifacts.length < 12
  ) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"@
