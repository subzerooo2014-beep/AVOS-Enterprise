# AVOS Unified Quality Gates

Use the shared runner from future bundles:

```powershell
& ".\tools\quality-gates\run-quality-gates.ps1" `
  -RepoRoot "C:\Users\User\Desktop\AVOS" `
  -SmokeScript "tools\my-bundle\smoke.ps1" `
  -IntegrationScript "tools\my-bundle\integration.ps1" `
  -VerificationScript "tools\my-bundle\verify.ps1"
```

Rules:

- TypeScript runs from `apps/api`, not workspace root.
- Workspace build runs once.
- Flutter `info` messages do not fail the gate.
- Flutter `warning` or `error` messages fail the gate.
- Commit must happen only after all gates succeed.
- Working tree must be clean at completion.