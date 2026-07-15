import { Injectable } from '@nestjs/common';
import {
  INFRASTRUCTURE_DEPLOYMENT_CAPABILITIES,
  InfrastructureDeploymentDashboardSnapshot,
} from './infrastructure-deployment.types';

@Injectable()
export class InfrastructureDeploymentDashboardService {
  snapshot(
    input: Partial<InfrastructureDeploymentDashboardSnapshot> = {},
  ): InfrastructureDeploymentDashboardSnapshot {
    const clamp = (value: number) =>
      Math.max(0, Math.min(100, Math.round(value)));

    return {
      generatedAt: new Date().toISOString(),
      containerScore: clamp(input.containerScore ?? 0),
      kubernetesScore: clamp(input.kubernetesScore ?? 0),
      cicdScore: clamp(input.cicdScore ?? 0),
      dependencyScore: clamp(input.dependencyScore ?? 0),
      securityEdgeScore: clamp(input.securityEdgeScore ?? 0),
      observabilityScore: clamp(input.observabilityScore ?? 0),
      deploymentScore: clamp(input.deploymentScore ?? 0),
      capabilityStatus: Object.fromEntries(
        INFRASTRUCTURE_DEPLOYMENT_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as InfrastructureDeploymentDashboardSnapshot['capabilityStatus'],
    };
  }
}