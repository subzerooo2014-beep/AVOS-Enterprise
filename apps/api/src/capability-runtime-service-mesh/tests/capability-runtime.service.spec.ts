import { Test } from '@nestjs/testing';
import { CapabilityRuntimeServiceMeshModule } from '../capability-runtime-service-mesh.module';
import { CapabilityRuntimeOrchestratorService } from '../services/capability-runtime-orchestrator.service';
import { CapabilityDependencyGraphService } from '../services/capability-dependency-graph.service';
import { CapabilityDiscoveryRegistryService } from '../services/capability-discovery-registry.service';

describe('Capability Runtime & Service Mesh', () => {
  it('boots with the known AVOS capabilities', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CapabilityRuntimeServiceMeshModule],
    }).compile();

    await moduleRef.init();

    const discovery = moduleRef.get(
      CapabilityDiscoveryRegistryService,
    );
    const capabilities = discovery.list();

    expect(capabilities.length).toBeGreaterThanOrEqual(5);
    expect(
      capabilities.some(
        (item) =>
          item.id ===
          'avos.apcp.production-certification',
      ),
    ).toBe(true);
    expect(
      capabilities.some(
        (item) => item.id === 'avos.factory',
      ),
    ).toBe(true);
    expect(
      capabilities.some(
        (item) => item.id === 'avos.knowledge-fabric',
      ),
    ).toBe(true);
    expect(
      capabilities.some(
        (item) => item.id === 'avos.intelligence-fabric',
      ),
    ).toBe(true);
  });

  it('validates capability dependencies', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CapabilityRuntimeServiceMeshModule],
    }).compile();

    await moduleRef.init();

    const graph = moduleRef.get(
      CapabilityDependencyGraphService,
    );

    expect(graph.validate()).toEqual({
      valid: true,
      missingDependencies: [],
      cyclicCapabilities: [],
    });
  });

  it('passes the integrated runtime smoke flow', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CapabilityRuntimeServiceMeshModule],
    }).compile();

    await moduleRef.init();

    const orchestrator = moduleRef.get(
      CapabilityRuntimeOrchestratorService,
    );
    const result = orchestrator.smoke();

    expect(result.status).toBe('passed');
    expect(result.runtime.status).toBe('operational');
    expect(result.route.routed).toBe(true);
    expect(result.permission.allowed).toBe(true);
  });
});