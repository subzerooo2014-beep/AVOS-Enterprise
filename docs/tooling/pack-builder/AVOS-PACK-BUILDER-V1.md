# AVOS Pack Builder V1

Pack Builder V1 generates consistent AVOS modules from JSON manifests.

## Included engines

- Blueprint and manifest engine
- Template engine
- API module generator
- Web page generator
- Flutter screen generator
- NestJS registration engine
- Build and validation engine
- Git commit and push engine

## Generate a pack

```powershell
cd C:\Users\User\Desktop\AVOS

.\tools\pack-builder\generate.ps1 `
  -ManifestPath .\tools\pack-builder\manifests\example-f6.manifest.json `
  -Validate `
  -Commit
```

Add `-Push` to publish the generated commit.