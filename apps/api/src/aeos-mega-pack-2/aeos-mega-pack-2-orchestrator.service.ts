import { Injectable } from '@nestjs/common';
import { AeosCertificationReport, AeosExecutionContext } from './contracts/aeos-mega-pack-2.contracts';
import { Aeos20CertificationService } from './certification/aeos-2.0-certification.service';
import { AeosUnifiedHealthService } from './health/aeos-unified-health.service';
import { AeosProductionReadinessService } from './readiness/aeos-production-readiness.service';
import { AeosUnifiedRegistryService } from './runtime/aeos-unified-registry.service';
import { AeosUnifiedRuntimeService } from './runtime/aeos-unified-runtime.service';
import { AeosUnifiedVerificationService } from './verification/aeos-unified-verification.service';

@Injectable()
export class AeosMegaPack2OrchestratorService {
  constructor(
    private readonly runtime: AeosUnifiedRuntimeService,
    private readonly registry: AeosUnifiedRegistryService,
    private readonly health: AeosUnifiedHealthService,
    private readonly verification: AeosUnifiedVerificationService,
    private readonly readiness: AeosProductionReadinessService,
    private readonly certification: Aeos20CertificationService,
  ) {}

  status(): Record<string, unknown> {
    return {
      name: 'AEOS Mega Pack 2',
      version: 'AEOS-2.0.0',
      status: 'operational',
      stages: this.registry.stages(),
      health: this.health.report(),
      certification: this.certification.status(),
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  execute(context: AeosExecutionContext): Record<string, unknown> {
    return this.runtime.execute(context);
  }

  verify(): Record<string, unknown> {
    return this.verification.run();
  }

  readinessReport(): Record<string, unknown> {
    return this.readiness.assess();
  }

  certify(approvedBy: string): AeosCertificationReport {
    return this.certification.certify(approvedBy);
  }

  certificationStatus(): AeosCertificationReport | Record<string, unknown> {
    return this.certification.status();
  }
}
