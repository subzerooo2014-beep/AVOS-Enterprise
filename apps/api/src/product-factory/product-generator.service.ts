import { Injectable } from '@nestjs/common';
import { ProductSurface, FactoryArtifact } from './product-factory.types';
import { BackendGeneratorService } from './backend-generator.service';
import { WebGeneratorService } from './web-generator.service';
import { MobileGeneratorService } from './mobile-generator.service';
import { DatabaseGeneratorService } from './database-generator.service';
import { ApiGeneratorService } from './api-generator.service';
import { UiGeneratorService } from './ui-generator.service';
import { WorkflowGeneratorService } from './workflow-generator.service';
import { DocumentationGeneratorService } from './documentation-generator.service';
import { DeploymentGeneratorService } from './deployment-generator.service';
import { TestingGeneratorService } from './testing-generator.service';
import { ConfigurationGeneratorService } from './configuration-generator.service';
import { ObservabilityGeneratorService } from './observability-generator.service';

@Injectable()
export class ProductGeneratorService {
  constructor(
    private readonly backend: BackendGeneratorService,
    private readonly web: WebGeneratorService,
    private readonly mobile: MobileGeneratorService,
    private readonly database: DatabaseGeneratorService,
    private readonly api: ApiGeneratorService,
    private readonly ui: UiGeneratorService,
    private readonly workflow: WorkflowGeneratorService,
    private readonly documentation: DocumentationGeneratorService,
    private readonly deployment: DeploymentGeneratorService,
    private readonly testing: TestingGeneratorService,
    private readonly configuration: ConfigurationGeneratorService,
    private readonly observability: ObservabilityGeneratorService,
  ) {}

  generate(context: Record<string, unknown>, surfaces: ProductSurface[]) {
    const enabled = new Set(surfaces);
    const artifacts: FactoryArtifact[] = [];

    if (enabled.has('api')) {
      artifacts.push(...this.backend.generate(context));
      artifacts.push(...this.api.generate(context));
      artifacts.push(...this.observability.generate(context));
    }
    if (enabled.has('web')) {
      artifacts.push(...this.web.generate(context));
      artifacts.push(...this.ui.generate(context));
    }
    if (enabled.has('mobile')) artifacts.push(...this.mobile.generate(context));
    if (enabled.has('database')) artifacts.push(...this.database.generate(context));
    if (enabled.has('worker')) artifacts.push(...this.workflow.generate(context));
    if (enabled.has('documentation')) artifacts.push(...this.documentation.generate(context));
    if (enabled.has('deployment')) {
      artifacts.push(...this.deployment.generate(context));
      artifacts.push(...this.configuration.generate(context));
    }
    if (enabled.has('tests')) artifacts.push(...this.testing.generate(context));

    return artifacts;
  }
}