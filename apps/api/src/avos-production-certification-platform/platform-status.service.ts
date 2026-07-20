import { Injectable } from '@nestjs/common';
import {
  PLATFORM_NAME,
  PLATFORM_VERSION,
  REQUIRED_EVIDENCE_DOMAINS,
} from './domain/platform.constants';
import { PlatformRegistryService } from './application/platform-registry.service';

@Injectable()
export class PlatformStatusService {
  constructor(private readonly registry: PlatformRegistryService) {}

  async status(): Promise<Record<string, unknown>> {
    const platforms = await this.registry.list();

    return {
      name: PLATFORM_NAME,
      version: PLATFORM_VERSION,
      status: 'operational',
      architecture: 'modular-monolith-extractable',
      registeredPlatforms: platforms.length,
      requiredEvidenceDomains: REQUIRED_EVIDENCE_DOMAINS.length,
      evidenceCollection: true,
      evidenceValidation: true,
      manifestEngine: true,
      certificationEngine: true,
      deploymentGate: true,
      continuousMonitoring: true,
      productionIntelligence: true,
      auditTraceability: true,
      universalIntegrationLayer: true,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      realEvidenceRequired: true,
      simulatedEvidenceAccepted: false,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      futureSeparationReady: true,
    };
  }
}
