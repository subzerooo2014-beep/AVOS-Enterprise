import { Test } from '@nestjs/testing';
import { ApcpProductionCapabilityService } from '../services/apcp-production-capability.service';
import { ApcpCapabilityRegistryRepository } from '../repositories/apcp-capability-registry.repository';
import { ApcpCertificationSnapshotRepository } from '../repositories/apcp-certification-snapshot.repository';

describe('ApcpProductionCapabilityService', () => {
  it('registers APCP as a certified production capability', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApcpCapabilityRegistryRepository,
        ApcpCertificationSnapshotRepository,
        ApcpProductionCapabilityService,
      ],
    }).compile();

    const service = moduleRef.get(ApcpProductionCapabilityService);
    service.onModuleInit();

    const status = service.status();

    expect(status.registration.status).toBe('operational');
    expect(status.registration.humanFinalAuthority).toBe(true);
    expect(status.registration.globalComplianceReadinessGate).toBe(true);
    expect(status.certification.expectedDomains).toBe(12);
    expect(status.certification.verifiedDomains).toBe(12);
    expect(status.certification.score).toBe(100);
    expect(status.certification.risk).toBe(0);
    expect(status.certification.state).toBe('certified');
  });
});