import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EnterpriseEvolutionService } from './enterprise-evolution.service';
import { CloudNode, GenesisProject } from './enterprise-evolution.types';

@Controller('avos/enterprise-evolution')
export class EnterpriseEvolutionController {
  constructor(private readonly evolution: EnterpriseEvolutionService) {}

  @Get('status')
  status() {
    return this.evolution.status();
  }

  @Get('dashboard')
  dashboard() {
    return this.evolution.dashboard();
  }

  @Post('cloud/heartbeat')
  heartbeat() {
    return this.evolution.heartbeat();
  }

  @Get('cloud/nodes')
  cloudNodes() {
    return this.evolution.getCloudNodes();
  }

  @Post('cloud/nodes')
  registerCloudNode(@Body() body: Partial<CloudNode>) {
    return this.evolution.registerCloudNode(body);
  }

  @Get('organization/agents')
  agents() {
    return this.evolution.getAgents();
  }

  @Get('organization/teams')
  teams() {
    return this.evolution.getTeams();
  }

  @Post('organization/missions')
  dispatchMission(
    @Body()
    body: {
      mission: string;
      teamId?: string;
      strategic?: boolean;
    },
  ) {
    return this.evolution.dispatchMission(body);
  }

  @Get('genesis/projects')
  genesisProjects() {
    return this.evolution.getGenesisProjects();
  }

  @Post('genesis/projects')
  createGenesisProject(
    @Body()
    body: {
      name: string;
      type?: GenesisProject['type'];
      objective: string;
    },
  ) {
    return this.evolution.createGenesisProject(body);
  }

  @Post('genesis/projects/:id/approve')
  approveGenesisProject(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.evolution.approveGenesisProject(id, body.approvedBy);
  }

  @Post('genesis/projects/:id/generate')
  generateGenesisProject(@Param('id') id: string) {
    return this.evolution.generateGenesisProject(id);
  }

  @Get('certification')
  certification() {
    return this.evolution.certification();
  }
}