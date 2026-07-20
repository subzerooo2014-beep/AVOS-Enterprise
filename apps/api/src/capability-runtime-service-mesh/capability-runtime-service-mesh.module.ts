import { Module } from '@nestjs/common';
import { CapabilityRuntimeController } from './controllers/capability-runtime.controller';
import { CapabilityRegistryRepository } from './repositories/capability-registry.repository';
import { CapabilityHealthRepository } from './repositories/capability-health.repository';
import { CapabilityEventRepository } from './repositories/capability-event.repository';
import { CapabilityVersionRepository } from './repositories/capability-version.repository';
import { CapabilityDiscoveryRegistryService } from './services/capability-discovery-registry.service';
import { CapabilityHealthMonitorService } from './services/capability-health-monitor.service';
import { CapabilityDependencyGraphService } from './services/capability-dependency-graph.service';
import { CapabilityEventBusService } from './services/capability-event-bus.service';
import { CapabilityPermissionsService } from './services/capability-permissions.service';
import { CapabilityLifecycleManagerService } from './services/capability-lifecycle-manager.service';
import { DynamicCapabilityLoaderService } from './services/dynamic-capability-loader.service';
import { CapabilityVersionManagerService } from './services/capability-version-manager.service';
import { ZeroDowntimeCapabilityUpdateService } from './services/zero-downtime-capability-update.service';
import { CapabilityServiceMeshService } from './services/capability-service-mesh.service';
import { CapabilityRuntimeOrchestratorService } from './services/capability-runtime-orchestrator.service';

@Module({
  controllers: [CapabilityRuntimeController],
  providers: [
    CapabilityRegistryRepository,
    CapabilityHealthRepository,
    CapabilityEventRepository,
    CapabilityVersionRepository,
    CapabilityDiscoveryRegistryService,
    CapabilityHealthMonitorService,
    CapabilityDependencyGraphService,
    CapabilityEventBusService,
    CapabilityPermissionsService,
    CapabilityLifecycleManagerService,
    DynamicCapabilityLoaderService,
    CapabilityVersionManagerService,
    ZeroDowntimeCapabilityUpdateService,
    CapabilityServiceMeshService,
    CapabilityRuntimeOrchestratorService,
  ],
  exports: [
    CapabilityDiscoveryRegistryService,
    CapabilityHealthMonitorService,
    CapabilityDependencyGraphService,
    CapabilityEventBusService,
    CapabilityPermissionsService,
    CapabilityLifecycleManagerService,
    DynamicCapabilityLoaderService,
    CapabilityVersionManagerService,
    ZeroDowntimeCapabilityUpdateService,
    CapabilityServiceMeshService,
    CapabilityRuntimeOrchestratorService,
  ],
})
export class CapabilityRuntimeServiceMeshModule {}