import { Test } from '@nestjs/testing';
import { ApcpProductionCapabilityIntegrationModule } from '../apcp-production-capability-integration.module';
import { ApcpProductionE2eOrchestratorService } from '../services/apcp-production-e2e-orchestrator.service';

describe('APCP Production Capability Integration', () => {
  it('passes Factory and Unified Certification integration', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ApcpProductionCapabilityIntegrationModule],
    }).compile();

    await moduleRef.init();

    const orchestrator = moduleRef.get(
      ApcpProductionE2eOrchestratorService,
    );
    const result = orchestrator.run('human:khalifa');

    expect(result.status).toBe('passed');
    expect(result.factoryIntegration.accepted).toBe(true);
    expect(result.unifiedCertification.certified).toBe(true);
    expect(result.unifiedCertification.blockingIssues).toEqual([]);
    expect(result.checks.evidenceDomains).toBe(12);
    expect(result.checks.certificationScore).toBe(100);
    expect(result.checks.zeroRisk).toBe(true);
    expect(result.checks.deploymentAllowed).toBe(true);
    expect(result.checks.digitalTwinReady).toBe(true);
    expect(result.checks.humanFinalAuthority).toBe(true);
    expect(result.checks.globalComplianceReadinessGate).toBe(true);
  });

  it('blocks Factory execution without human approval', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ApcpProductionCapabilityIntegrationModule],
    }).compile();

    await moduleRef.init();

    const orchestrator = moduleRef.get(
      ApcpProductionE2eOrchestratorService,
    );
    const result = orchestrator.run('');

    expect(result.factoryIntegration.accepted).toBe(false);
    expect(result.factoryIntegration.humanFinalAuthority).toBe(true);
  });
});