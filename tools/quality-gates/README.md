# AVOS Unified Quality Gates v2

## Guarantees

- TypeScript runs from `apps/api`.
- Workspace build runs once.
- Flutter output is captured without PowerShell `NativeCommandError`.
- Flutter `info` findings are reported as `PASS_WITH_INFO`.
- Flutter `warning` or `error` findings fail the gate.
- Workspace tests run one package at a time.
- A failing test reports the exact package name, path, exit code, and test script.
- No commit occurs unless every gate completes successfully.
- Final success output is never generated from uninitialized variables.

## Run all shared gates

```powershell
powershell -ExecutionPolicy Bypass -File `
  ".\tools\quality-gates\run-quality-gates.ps1"
```

## Diagnose workspace tests only

```powershell
powershell -ExecutionPolicy Bypass -File `
  ".\tools\quality-gates\diagnose-workspace-tests.ps1"
```