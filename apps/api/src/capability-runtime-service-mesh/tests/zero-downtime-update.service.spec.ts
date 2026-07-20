import { Test } from '@nestjs/testing';
import { CapabilityRuntimeServiceMeshModule } from '../capability-runtime-service-mesh.module';
import { ZeroDowntimeCapabilityUpdateService } from '../services/zero-downtime-capability-update.service';
import { CapabilityVersionManagerService } from '../services/capability-version-manager.service';

describe('ZeroDowntimeCapabilityUpdateService', () => {
  it('switches versions without stopping the capability', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CapabilityRuntimeServiceMeshModule],
    }).compile();

    await moduleRef.init();

    const updates = moduleRef.get(
      ZeroDowntimeCapabilityUpdateService,
    );
    const versions = moduleRef.get(
      CapabilityVersionManagerService,
    );

    const result = updates.update(
      'avos.factory',
      '1.1.0',
    );

    expect(result.status).toBe('completed');
    expect(result.shadowLoaded).toBe(true);
    expect(result.healthValidated).toBe(true);
    expect(result.trafficSwitched).toBe(true);
    expect(result.previousVersionRetained).toBe(true);

    const history = versions.history('avos.factory');
    expect(history.length).toBe(2);
    expect(history[history.length - 1]?.version).toBe('1.1.0');
    expect(history[history.length - 1]?.active).toBe(true);
  });
});