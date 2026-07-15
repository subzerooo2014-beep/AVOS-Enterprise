import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContainerDefinitionDto } from './dto/container-definition.dto';
import { KubernetesWorkloadDto } from './dto/kubernetes-workload.dto';
import { DeploymentPipelineDto } from './dto/deployment-pipeline.dto';
import { ContainerReadinessEngineService } from './container-readiness-engine.service';
import { KubernetesReadinessEngineService } from './kubernetes-readiness-engine.service';
import { CicdReadinessEngineService } from './cicd-readiness-engine.service';
import { InfrastructureDeploymentDashboardService } from './infrastructure-deployment-dashboard.service';
import { INFRASTRUCTURE_DEPLOYMENT_CAPABILITIES } from './infrastructure-deployment.types';

@Controller('infrastructure-deployment')
export class InfrastructureDeploymentController {
  constructor(
    private readonly containers: ContainerReadinessEngineService,
    private readonly kubernetes: KubernetesReadinessEngineService,
    private readonly cicd: CicdReadinessEngineService,
    private readonly dashboard: InfrastructureDeploymentDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle: 'Infrastructure & Deployment Mega Bundle',
      count: INFRASTRUCTURE_DEPLOYMENT_CAPABILITIES.length,
      capabilities: INFRASTRUCTURE_DEPLOYMENT_CAPABILITIES,
    };
  }

  @Post('containers/evaluate')
  evaluateContainers(
    @Body() input: { containers: ContainerDefinitionDto[] },
  ) {
    return this.containers.evaluate(input.containers);
  }

  @Post('kubernetes/evaluate')
  evaluateKubernetes(
    @Body() input: { workloads: KubernetesWorkloadDto[] },
  ) {
    return this.kubernetes.evaluate(input.workloads);
  }

  @Post('cicd/evaluate')
  evaluateCicd(
    @Body() input: { pipelines: DeploymentPipelineDto[] },
  ) {
    return this.cicd.evaluate(input.pipelines);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}