import { Injectable } from '@nestjs/common';
import {
  CapacityPool,
  GlobalOperation,
  ServiceNode,
} from './global-autonomous-operations.types';
import { EnterpriseAutonomousOperationsEngineService } from './enterprise-autonomous-operations-engine.service';
import { AutonomousOperationsSchedulerService } from './autonomous-operations-scheduler.service';
import { EnterpriseCommandExecutionEngineService } from './enterprise-command-execution-engine.service';
import { IntelligentResourceAllocationEngineService } from './intelligent-resource-allocation-engine.service';
import { EnterpriseServiceOrchestrationEngineService } from './enterprise-service-orchestration-engine.service';
import { GlobalEnterpriseOperationsCenterService } from './global-enterprise-operations-center.service';

@Injectable()
export class GlobalOperationsOrchestratorService {
  constructor(
    private readonly engine: EnterpriseAutonomousOperationsEngineService,
    private readonly scheduler: AutonomousOperationsSchedulerService,
    private readonly commands: EnterpriseCommandExecutionEngineService,
    private readonly resources: IntelligentResourceAllocationEngineService,
    private readonly services: EnterpriseServiceOrchestrationEngineService,
    private readonly operationsCenter: GlobalEnterpriseOperationsCenterService,
  ) {}

  run(
    operation: GlobalOperation,
    pools: CapacityPool[],
    nodes: ServiceNode[],
  ) {
    const evaluation = this.engine.evaluate(operation, pools);
    const allocation = this.resources.allocate(
      operation.requiredCapacity,
      pools.filter((pool) => pool.region === operation.region),
    );
    const schedule = this.scheduler.schedule([
      {
        ...operation,
        status: evaluation.executable ? 'scheduled' : 'blocked',
      },
    ]);
    const serviceRoutes = this.services.orchestrate(nodes);
    const commandExecutions = evaluation.executable
      ? this.commands.execute(operation.id, [
          ...operation.requiredServices.map(
            (service) => `activate-service:${service}`,
          ),
          'start-operation',
        ])
      : [];

    const registered = this.operationsCenter.register({
      ...operation,
      status:
        evaluation.executable && allocation.fullyAllocated
          ? 'running'
          : 'blocked',
    });

    return {
      evaluation,
      allocation,
      schedule,
      serviceRoutes,
      commandExecutions,
      registered,
      operationsCenter: this.operationsCenter.summary(),
    };
  }
}