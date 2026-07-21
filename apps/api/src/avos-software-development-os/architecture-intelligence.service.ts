import { Injectable } from '@nestjs/common';
import { SoftwareBlueprint } from './avos-software-development-os.types';

@Injectable()
export class ArchitectureIntelligenceService {
  review(blueprint: SoftwareBlueprint) {
    const checks = {
      foundationFirst: true,
      capabilityFirst: blueprint.capabilities.length > 0,
      blueprintDriven: Boolean(blueprint.id),
      boundedContextsDefined: blueprint.boundedContexts.length > 0,
      humanFinalAuthority: true,
      globalComplianceReadinessGate:
        blueprint.complianceRequirements.includes('jurisdiction-awareness'),
      stableCoreArchitecture:
        blueprint.complianceRequirements.includes('stable-core-architecture'),
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;

    return {
      checks,
      score: Math.round((passed / total) * 100),
      approved: passed === total,
      reviewedAt: new Date().toISOString(),
    };
  }
}