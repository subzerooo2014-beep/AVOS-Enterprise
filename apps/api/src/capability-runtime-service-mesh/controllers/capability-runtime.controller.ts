import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CapabilityDiscoveryRegistryService } from '../services/capability-discovery-registry.service';
import { CapabilityHealthMonitorService } from '../services/capability-health-monitor.service';
import { CapabilityDependencyGraphService } from '../services/capability-dependency-graph.service';
import { DynamicCapabilityLoaderService } from '../services/dynamic-capability-loader.service';
import { CapabilityLifecycleManagerService } from '../services/capability-lifecycle-manager.service';
import { CapabilityServiceMeshService } from '../services/capability-service-mesh.service';
import { CapabilityEventBusService } from '../services/capability-event-bus.service';
import { CapabilityPermissionsService } from '../services/capability-permissions.service';
import { CapabilityVersionManagerService } from '../services/capability-version-manager.service';
import { ZeroDowntimeCapabilityUpdateService } from '../services/zero-downtime-capability-update.service';
import { CapabilityRuntimeOrchestratorService } from '../services/capability-runtime-orchestrator.service';
import {
  CapabilityDescriptor,
  CapabilityState,
} from '../domain/capability-runtime.types';

@Controller('avos/capability-runtime')
export class CapabilityRuntimeController {
  constructor(
    private readonly discovery: CapabilityDiscoveryRegistryService,
    private readonly health: CapabilityHealthMonitorService,
    private readonly dependencies: CapabilityDependencyGraphService,
    private readonly loader: DynamicCapabilityLoaderService,
    private readonly lifecycle: CapabilityLifecycleManagerService,
    private readonly mesh: CapabilityServiceMeshService,
    private readonly events: CapabilityEventBusService,
    private readonly permissions: CapabilityPermissionsService,
    private readonly versions: CapabilityVersionManagerService,
    private readonly zeroDowntime: ZeroDowntimeCapabilityUpdateService,
    private readonly orchestrator: CapabilityRuntimeOrchestratorService,
  ) {}

  @Get('status')
  status() {
    return this.orchestrator.status();
  }

  @Post('smoke')
  smoke() {
    return this.orchestrator.smoke();
  }

  @Get('capabilities')
  capabilities() {
    return this.discovery.list();
  }

  @Get('capabilities/:id')
  capability(@Param('id') id: string) {
    return this.discovery.get(id);
  }

  @Post('capabilities/register')
  register(
    @Body()
    body: Omit<
      CapabilityDescriptor,
      'registeredAt' | 'updatedAt'
    >,
  ) {
    return this.discovery.register(body);
  }

  @Post('capabilities/load')
  load(
    @Body()
    body: Omit<
      CapabilityDescriptor,
      'registeredAt' | 'updatedAt'
    >,
  ) {
    return this.loader.load(body);
  }

  @Post('capabilities/:id/lifecycle/:state')
  lifecycleTransition(
    @Param('id') id: string,
    @Param('state') state: CapabilityState,
  ) {
    return this.lifecycle.transition(id, state);
  }

  @Get('health')
  healthSummary() {
    return this.health.summary();
  }

  @Get('health/:id')
  healthCheck(@Param('id') id: string) {
    return this.health.check(id);
  }

  @Get('dependencies')
  dependencyGraph() {
    return {
      graph: this.dependencies.graph(),
      validation: this.dependencies.validate(),
    };
  }

  @Post('mesh/route')
  route(
    @Body()
    body: {
      sourceCapabilityId: string;
      targetCapabilityId: string;
      action: string;
      payload?: unknown;
    },
  ) {
    return this.mesh.route(
      body.sourceCapabilityId,
      body.targetCapabilityId,
      body.action,
      body.payload,
    );
  }

  @Post('events/publish')
  publish(
    @Body()
    body: {
      topic: string;
      source: string;
      payload?: unknown;
    },
  ) {
    return this.events.publish(
      body.topic,
      body.source,
      body.payload,
    );
  }

  @Get('events')
  eventList() {
    return this.events.list();
  }

  @Get('permissions/:capabilityId/:permission')
  permission(
    @Param('capabilityId') capabilityId: string,
    @Param('permission') permission: string,
  ) {
    return this.permissions.evaluate(
      capabilityId,
      permission,
    );
  }

  @Get('versions/:capabilityId')
  versionHistory(
    @Param('capabilityId') capabilityId: string,
  ) {
    return this.versions.history(capabilityId);
  }

  @Post('versions/:capabilityId/update')
  zeroDowntimeUpdate(
    @Param('capabilityId') capabilityId: string,
    @Body() body: { version: string },
  ) {
    return this.zeroDowntime.update(
      capabilityId,
      body.version,
    );
  }
}