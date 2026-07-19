import { BadRequestException, Injectable } from '@nestjs/common';
import { FactoryBuild, FactoryBuildRequest } from './product-factory.types';
import { FactoryRegistryService } from './factory-registry.service';
import { FactoryTemplateCatalogService } from './factory-template-catalog.service';
import { FactoryBlueprintService } from './factory-blueprint.service';
import { ProductGeneratorService } from './product-generator.service';
import { FactoryPipelineService } from './factory-pipeline.service';
import { FactoryVerificationService } from './factory-verification.service';
import { FactorySmokeService } from './factory-smoke.service';
import { FactoryCertificationService } from './factory-certification.service';
import { FactoryIntegrationHubService } from './factory-integration-hub.service';
import { FactoryAuditService } from './factory-audit.service';

@Injectable()
export class FactoryOrchestratorService {
  constructor(
    private readonly registry: FactoryRegistryService,
    private readonly templates: FactoryTemplateCatalogService,
    private readonly blueprint: FactoryBlueprintService,
    private readonly generator: ProductGeneratorService,
    private readonly pipeline: FactoryPipelineService,
    private readonly verification: FactoryVerificationService,
    private readonly smoke: FactorySmokeService,
    private readonly certification: FactoryCertificationService,
    private readonly integrations: FactoryIntegrationHubService,
    private readonly audit: FactoryAuditService,
  ) {}

  async buildProduct(request: FactoryBuildRequest) {
    this.validate(request);
    this.templates.get(request.templateId);

    let build: FactoryBuild = {
      id: `product-factory-build:${Date.now()}`,
      request,
      stage: 'requested',
      progress: 5,
      artifacts: [],
      errors: [],
      governance: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
        approvedBy: request.approvedBy,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    build = this.registry.saveBuild(build);
    this.audit.record('factory.build.requested', {
      buildId: build.id,
      productName: request.productName,
    });

    try {
      build = this.pipeline.transition(build, 'planning', 15);
      build.blueprint = this.blueprint.create(build.id, request);
      build = this.registry.saveBuild(build);

      build = this.pipeline.transition(build, 'integrating', 25);
      build.integrationSnapshot = this.integrations.inspect(request);
      build = this.registry.saveBuild(build);

      build = this.pipeline.transition(build, 'generating', 45);
      build.artifacts = this.generator.generate(
        {
          namespace: request.namespace,
          productName: request.productName,
          entities: request.entities,
          capabilities: request.capabilities,
          integrations: request.integrations,
          workflows: request.workflows,
          parameters: request.parameters,
        },
        request.surfaces,
      );
      build = this.registry.saveBuild(build);

      build = this.pipeline.transition(build, 'assembling', 60);
      build = this.pipeline.transition(build, 'validating', 75);
      build.verification = this.verification.run(build);
      build = this.registry.saveBuild(build);

      build = this.pipeline.transition(build, 'testing', 88);
      build.smoke = this.smoke.run(build);
      build = this.registry.saveBuild(build);

      build = this.pipeline.transition(build, 'certifying', 96);
      build.certification = this.certification.certify(build);

      build = {
        ...build,
        stage: build.certification['status'] === 'certified' ? 'completed' : 'failed',
        progress: build.certification['status'] === 'certified' ? 100 : build.progress,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.audit.record('factory.build.completed', {
        buildId: build.id,
        status: build.stage,
        certification: build.certification?.['status'] ?? 'unknown',
      });

      return this.registry.saveBuild(build);
    } catch (error) {
      return this.pipeline.fail(build, error);
    }
  }

  rollback(id: string) {
    return this.pipeline.rollback(this.registry.getBuild(id));
  }

  private validate(request: FactoryBuildRequest) {
    if (!request.productName?.trim()) throw new BadRequestException('productName is required.');
    if (!request.namespace?.trim()) throw new BadRequestException('namespace is required.');
    if (!request.approvedBy?.trim()) throw new BadRequestException('approvedBy is required.');
    if (!request.surfaces?.length) throw new BadRequestException('At least one surface is required.');
  }
}
