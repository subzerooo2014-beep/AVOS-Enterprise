import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ArchitectureGeneratorService } from './architecture-generator.service';
import { BackendCodeGeneratorService } from './backend-code-generator.service';
import { DatabaseApiCompilerService } from './database-api-compiler.service';
import { DeploymentFactoryService } from './deployment-factory.service';
import { FrontendGeneratorService } from './frontend-generator.service';
import { ProductCompilerCoreService } from './product-compiler-core.service';
import { ProductGenerationStore } from './product-generation.store';
import { ProductGenerationRequest } from './product-generation.types';
import { RuntimeIntegrationCertificationService } from './runtime-integration-certification.service';
import { TestRepairEngineService } from './test-repair-engine.service';

@Injectable()
export class ProductGenerationOrchestratorService {
  private readonly outputRoot = join(process.cwd(), '..', '..', '.avos', 'generated-products');

  constructor(
    private readonly store: ProductGenerationStore,
    private readonly compiler: ProductCompilerCoreService,
    private readonly architecture: ArchitectureGeneratorService,
    private readonly backend: BackendCodeGeneratorService,
    private readonly databaseApi: DatabaseApiCompilerService,
    private readonly frontend: FrontendGeneratorService,
    private readonly testing: TestRepairEngineService,
    private readonly deployment: DeploymentFactoryService,
    private readonly integration: RuntimeIntegrationCertificationService,
  ) {}

  async generate(request: ProductGenerationRequest) {
    const specification = this.compiler.compile(request);
    const architecture = this.architecture.generate(request.namespace);

    const manifest = {
      id: `manifest:${Date.now()}:${randomUUID().slice(0, 8)}`,
      namespace: request.namespace,
      name: request.name,
      outputRoot: join(this.outputRoot, request.namespace),
      backendFiles: [] as string[],
      databaseFiles: [] as string[],
      apiFiles: [] as string[],
      frontendFiles: [] as string[],
      testFiles: [] as string[],
      deploymentFiles: [] as string[],
      integrationFiles: [] as string[],
      generatedAt: new Date().toISOString(),
    };
    this.store.manifests.set(request.namespace, manifest);

    manifest.backendFiles.push(
      ...(await this.backend.generate(request.namespace, this.outputRoot)),
    );

    const databaseApiFiles = await this.databaseApi.compile(
      request.namespace,
      this.outputRoot,
    );
    manifest.databaseFiles.push(
      ...databaseApiFiles.filter((file) => file.includes('prisma') || file.includes('.env')),
    );
    manifest.apiFiles.push(
      ...databaseApiFiles.filter((file) => file.includes('openapi')),
    );

    manifest.frontendFiles.push(
      ...(await this.frontend.generate(request.namespace, this.outputRoot)),
    );

    const repair = await this.testing.generateAndVerify(
      request.namespace,
      this.outputRoot,
    );

    await this.deployment.generate(request.namespace, this.outputRoot);
    await this.integration.integrate(request.namespace, this.outputRoot);

    const certification = this.integration.certify(
      request.namespace,
      request.approvedBy,
    );

    return {
      specification,
      architecture,
      manifest,
      repair,
      certification,
      productFactoryRealGenerationComplete: certification.status === 'certified',
      nextPlatform: certification.status === 'certified' ? 'AVOS Enterprise Factory' : null,
    };
  }

  get(namespace: string) {
    return {
      specification: this.store.specifications.get(namespace) ?? null,
      architecture: this.store.architectures.get(namespace) ?? null,
      manifest: this.store.manifests.get(namespace) ?? null,
      repair: this.store.repairs.get(namespace) ?? null,
      certification: this.store.certifications.get(namespace) ?? null,
    };
  }
}