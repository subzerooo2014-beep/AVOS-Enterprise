import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExecuteGlobalOperationDto } from './dto/execute-global-operation.dto';
import { ServiceOrchestrationDto } from './dto/service-orchestration.dto';
import { GlobalOperationsOrchestratorService } from './global-operations-orchestrator.service';
import { EnterpriseServiceOrchestrationEngineService } from './enterprise-service-orchestration-engine.service';
import { OperationsIntelligenceDashboardService } from './operations-intelligence-dashboard.service';
import { GLOBAL_AUTONOMOUS_OPERATIONS_CAPABILITIES } from './global-autonomous-operations.types';

@Controller('global-autonomous-operations')
export class GlobalAutonomousOperationsController {
  constructor(
    private readonly orchestrator: GlobalOperationsOrchestratorService,
    private readonly services: EnterpriseServiceOrchestrationEngineService,
    private readonly dashboard: OperationsIntelligenceDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle J — Enterprise Autonomous Operations & Global Orchestration',
      count: GLOBAL_AUTONOMOUS_OPERATIONS_CAPABILITIES.length,
      capabilities: GLOBAL_AUTONOMOUS_OPERATIONS_CAPABILITIES,
    };
  }

  @Post('operations/execute')
  execute(@Body() input: ExecuteGlobalOperationDto) {
    return this.orchestrator.run(
      {
        id: input.id,
        name: input.name,
        region: input.region,
        priority: input.priority,
        requiredCapacity: input.requiredCapacity,
        requiredServices: input.requiredServices,
        dependencies: input.dependencies,
        status: 'planned',
      },
      input.capacityPools,
      input.requiredServices.map((service, index) => ({
        id: `${input.region}-${service}-${index + 1}`,
        service,
        region: input.region,
        health: 90,
        latency: 25,
        capacity: 100,
      })),
    );
  }

  @Post('services/orchestrate')
  orchestrateServices(@Body() input: ServiceOrchestrationDto) {
    return this.services.orchestrate(input.nodes);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}