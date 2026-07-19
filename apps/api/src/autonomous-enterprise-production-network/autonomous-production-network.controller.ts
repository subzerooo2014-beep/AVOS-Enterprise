import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AutonomousNetworkFinalCertificationService } from './autonomous-network-final-certification.service';
import { AutonomousNetworkIntelligenceService } from './autonomous-network-intelligence.service';
import { AutonomousRoutingEngineService } from './autonomous-routing-engine.service';
import { NetworkCoordinationOrchestratorService } from './network-coordination-orchestrator.service';
import { NetworkGovernanceAuthorityService } from './network-governance-authority.service';
import { NetworkNodeRegistryService } from './network-node-registry.service';
import { NetworkResilienceEngineService } from './network-resilience-engine.service';

@Controller('avos/autonomous-enterprise-production-network')
export class AutonomousProductionNetworkController {
  constructor(
    private readonly nodes: NetworkNodeRegistryService,
    private readonly routing: AutonomousRoutingEngineService,
    private readonly coordination: NetworkCoordinationOrchestratorService,
    private readonly resilience: NetworkResilienceEngineService,
    private readonly governance: NetworkGovernanceAuthorityService,
    private readonly intelligence: AutonomousNetworkIntelligenceService,
    private readonly finalCertification: AutonomousNetworkFinalCertificationService,
  ) {}

  @Get('status')
  status() {
    return this.finalCertification.status();
  }

  @Post('nodes/synchronize')
  synchronizeNodes() {
    return this.nodes.synchronize();
  }

  @Post('nodes')
  registerNode(
    @Body() body: Parameters<NetworkNodeRegistryService['register']>[0],
  ) {
    return this.nodes.register(body);
  }

  @Get('nodes')
  listNodes() {
    return this.nodes.list();
  }

  @Post('workloads')
  submitWorkload(
    @Body() body: Parameters<AutonomousRoutingEngineService['submit']>[0],
  ) {
    return this.routing.submit(body);
  }

  @Post('workloads/:workloadId/route')
  route(
    @Param('workloadId') workloadId: string,
    @Body()
    body: {
      strategy?: 'capability-first' | 'balanced' | 'resilience-first';
    },
  ) {
    return this.routing.route(workloadId, body.strategy ?? 'balanced');
  }

  @Post('workloads/:workloadId/coordinate')
  coordinate(@Param('workloadId') workloadId: string) {
    return this.coordination.coordinate(workloadId);
  }

  @Post('workloads/:workloadId/execute')
  execute(@Param('workloadId') workloadId: string) {
    return this.coordination.execute(workloadId);
  }

  @Post('governance/decide')
  decide(
    @Body()
    body: Parameters<NetworkGovernanceAuthorityService['decide']>[0],
  ) {
    return this.governance.decide(body);
  }

  @Post('nodes/:nodeId/degrade')
  degrade(
    @Param('nodeId') nodeId: string,
    @Body()
    body: { severity: 'low' | 'medium' | 'high' | 'critical' },
  ) {
    return this.resilience.degrade(nodeId, body.severity);
  }

  @Post('nodes/:nodeId/recover')
  recover(@Param('nodeId') nodeId: string) {
    return this.resilience.recover(nodeId);
  }

  @Get('resilience/events')
  resilienceEvents() {
    return this.resilience.events();
  }

  @Get('dashboard')
  dashboard() {
    return this.intelligence.dashboard();
  }

  @Post('final-review/run')
  finalReview() {
    return this.finalCertification.review();
  }

  @Post('certification/certify')
  certify(@Body() body: { approvedBy: string }) {
    return this.finalCertification.certify(body.approvedBy);
  }
}
