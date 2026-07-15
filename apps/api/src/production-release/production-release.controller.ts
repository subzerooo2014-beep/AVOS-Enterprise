import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReleaseManifestDto } from './dto/release-manifest.dto';
import { ReleaseArtifactDto } from './dto/release-artifact.dto';
import { ReleaseManifestEngineService } from './release-manifest-engine.service';
import { ReleaseArtifactRegistryService } from './release-artifact-registry.service';
import { ProductionReleaseDashboardService } from './production-release-dashboard.service';
import { PRODUCTION_RELEASE_CAPABILITIES } from './production-release.types';

@Controller('production-release')
export class ProductionReleaseController {
  constructor(
    private readonly manifests: ReleaseManifestEngineService,
    private readonly artifacts: ReleaseArtifactRegistryService,
    private readonly dashboard: ProductionReleaseDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle: 'AVOS Enterprise Production Release Mega Bundle',
      count: PRODUCTION_RELEASE_CAPABILITIES.length,
      capabilities: PRODUCTION_RELEASE_CAPABILITIES,
    };
  }

  @Post('manifest/evaluate')
  evaluateManifest(@Body() input: ReleaseManifestDto) {
    const { status: _status, ...manifest } = input;
    return this.manifests.evaluate(manifest);
  }

  @Post('artifacts/validate')
  validateArtifacts(
    @Body() input: { artifacts: ReleaseArtifactDto[] },
  ) {
    return this.artifacts.validate(input.artifacts);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}