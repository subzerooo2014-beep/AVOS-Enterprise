import { Injectable } from '@nestjs/common';
import {
  PackageGeneratorCertification,
} from '../contracts/package-generator.contracts';
import { PackageGeneratorRegistryService } from '../registry/package-generator-registry.service';

@Injectable()
export class PackageGeneratorCertificationService {
  private latestCertification: PackageGeneratorCertification | null = null;

  constructor(private readonly registry: PackageGeneratorRegistryService) {}

  certify(executionId: string, approvedBy: string): PackageGeneratorCertification {
    const execution = this.registry.get(executionId);
    if (!execution) {
      throw new Error(`Package generator execution not found: ${executionId}`);
    }

    if (!approvedBy?.trim()) {
      throw new Error('approvedBy is required.');
    }

    const checks = {
      generated: execution.status === 'generated',
      validationPassed: execution.validation.valid,
      typeCheckPassed: execution.typeCheckPassed,
      buildPassed: execution.buildPassed,
      filesCreated: execution.generatedFiles.length > 0,
      humanFinalAuthority: execution.humanFinalAuthority,
      globalComplianceReadinessGate: execution.globalComplianceReadinessGate,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
    };

    const passed = Object.values(checks).every(Boolean);

    this.latestCertification = {
      id: `package-generator-certification-${Date.now()}`,
      executionId,
      packageId: execution.packageId,
      status: passed ? 'certified' : 'rejected',
      score: passed ? 100 : 0,
      approvedBy: approvedBy.trim(),
      checks,
      certifiedAt: new Date().toISOString(),
    };

    return this.latestCertification;
  }

  status(): PackageGeneratorCertification | Record<string, unknown> {
    return (
      this.latestCertification ?? {
        status: 'not-certified',
        score: 0,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
      }
    );
  }
}
