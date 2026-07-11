$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

node -e @"
const {
  CodeGenIncrementalRuntime,
  CodeGenWriteMode,
  CodeGenArtifactType
} = require('./dist');

(async () => {
  const runtime =
    new CodeGenIncrementalRuntime();

  const result =
    await runtime.execute({
      workspaceRoot:
        process.cwd(),
      targetRoot:
        process.cwd(),
      snapshotPath:
        require('path').join(
          process.cwd(),
          '.avos-codegen',
          'incremental-smoke-snapshot.json'
        ),
      artifacts: [
        {
          id: 'smoke-1',
          key: 'smoke.one',
          type: CodeGenArtifactType.SOURCE,
          relativePath:
            'generated/smoke-one.ts',
          content:
            'export const smokeOne = true;\n',
          writeMode:
            CodeGenWriteMode.CREATE,
          dependencies: [],
          tags: ['smoke'],
          metadata: {}
        },
        {
          id: 'smoke-2',
          key: 'smoke.two',
          type: CodeGenArtifactType.TEST,
          relativePath:
            'generated/smoke-two.spec.ts',
          content:
            'export const smokeTwo = true;\n',
          writeMode:
            CodeGenWriteMode.CREATE,
          dependencies: ['smoke.one'],
          tags: ['smoke'],
          metadata: {}
        }
      ]
    });

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

  if (
    result.run.status !==
    'completed'
  ) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"@
