import { Injectable } from '@nestjs/common';
import {
  PackageGeneratorCertification,
  PackageGeneratorExecutionResult,
  PackageGeneratorRequest,
} from './contracts/package-generator.contracts';
import { PackageGeneratorCertificationService } from './certification/package-generator-certification.service';
import { PackageGeneratorEngineService } from './generator/package-generator-engine.service';
import { PackageGeneratorRegistryService } from './registry/package-generator-registry.service';
import { AeosMegaPack2BlueprintService } from './templates/aeos-mega-pack-2-blueprint.service';

@Injectable()
export class PackageGeneratorOrchestratorService {
  constructor(
    private readonly engine: PackageGeneratorEngineService,
    private readonly registry: PackageGeneratorRegistryService,
    private readonly certification: PackageGeneratorCertificationService,
    private readonly aeosBlueprint: AeosMegaPack2BlueprintService,
  ) {}

  async generate(request: PackageGeneratorRequest): Promise<PackageGeneratorExecutionResult> {
    return this.engine.generate(request);
  }

  async generateAeosMegaPack2(repoRoot: string): Promise<Record<string, unknown>> {
    const request = this.aeosBlueprint.create(repoRoot);
    const execution = await this.engine.generate(request);
    const certification = this.certification.certify(
      execution.id,
      request.approvedBy ?? 'human:khalifa',
    );

    return {
      execution,
      certification,
    };
  }

  status(): Record<string, unknown> {
    return {
      name: 'AVOS Factory Package Generator',
      version: 'PG-1.0.0',
      status: 'operational',
      registry: this.registry.health(),
      certification: this.certification.status(),
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  list(): Record<string, unknown> {
    return { executions: this.registry.list() };
  }

  certify(executionId: string, approvedBy: string): PackageGeneratorCertification {
    return this.certification.certify(executionId, approvedBy);
  }
}
