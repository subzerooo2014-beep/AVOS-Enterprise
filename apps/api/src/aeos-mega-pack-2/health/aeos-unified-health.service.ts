import { Injectable } from '@nestjs/common';
import { AeosUnifiedRegistryService } from '../runtime/aeos-unified-registry.service';
import { AeosUnifiedRuntimeService } from '../runtime/aeos-unified-runtime.service';

@Injectable()
export class AeosUnifiedHealthService {
  constructor(
    private readonly registry: AeosUnifiedRegistryService,
    private readonly runtime: AeosUnifiedRuntimeService,
  ) {}

  report(): Record<string, unknown> {
    const registry = this.registry.status();
    const integrations = this.runtime.integrationHealth();
    const stages = this.registry.stages();
    const checks = {
      stageCoverage: stages.length === 7,
      allStagesOperational: stages.every((stage) => stage.status === 'operational'),
      integrationsReady: integrations.every((item) => item['status'] === 'adapter-ready'),
      humanFinalAuthority: stages.every((stage) => stage.humanFinalAuthority),
      globalComplianceReadinessGate: stages.every((stage) => stage.globalComplianceReadinessGate),
    };
    const passed = Object.values(checks).filter(Boolean).length;
    return {
      name: 'AEOS Mega Pack 2 Unified Health',
      version: 'AEOS-2.0.0',
      status: passed === Object.keys(checks).length ? 'healthy' : 'degraded',
      score: Math.round((passed / Object.keys(checks).length) * 100),
      checks,
      registry,
      integrations,
      assessedAt: new Date().toISOString(),
    };
  }
}
