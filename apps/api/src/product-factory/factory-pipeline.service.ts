import { Injectable } from '@nestjs/common';
import { FactoryBuild } from './product-factory.types';
import { FactoryRegistryService } from './factory-registry.service';
import { FactoryAuditService } from './factory-audit.service';

@Injectable()
export class FactoryPipelineService {
  constructor(
    private readonly registry: FactoryRegistryService,
    private readonly audit: FactoryAuditService,
  ) {}

  transition(build: FactoryBuild, stage: FactoryBuild['stage'], progress: number) {
    const updated: FactoryBuild = {
      ...build,
      stage,
      progress,
      updatedAt: new Date().toISOString(),
    };
    this.audit.record('factory.stage.changed', {
      buildId: build.id,
      stage,
      progress,
    });
    return this.registry.saveBuild(updated);
  }

  fail(build: FactoryBuild, error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    this.audit.record('factory.build.failed', { buildId: build.id, message });
    return this.registry.saveBuild({
      ...build,
      stage: 'failed',
      errors: [...build.errors, message],
      updatedAt: new Date().toISOString(),
    });
  }

  rollback(build: FactoryBuild) {
    this.audit.record('factory.build.rolled-back', { buildId: build.id });
    return this.registry.saveBuild({
      ...build,
      stage: 'rolled-back',
      progress: 0,
      updatedAt: new Date().toISOString(),
    });
  }
}