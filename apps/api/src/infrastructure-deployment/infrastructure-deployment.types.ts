export const INFRASTRUCTURE_DEPLOYMENT_CAPABILITIES = [
  'container-readiness-engine',
  'kubernetes-readiness-engine',
  'cicd-readiness-engine',
  'redis-readiness-engine',
  'queue-readiness-engine',
  'database-deployment-engine',
  'object-storage-readiness-engine',
  'cdn-readiness-engine',
  'ssl-tls-readiness-engine',
  'waf-ddos-readiness-engine',
  'backup-rotation-engine',
  'autoscaling-readiness-engine',
  'monitoring-stack-readiness-engine',
  'logging-readiness-engine',
  'tracing-readiness-engine',
  'deployment-strategy-engine',
  'infrastructure-deployment-orchestrator',
  'infrastructure-deployment-dashboard',
] as const;

export type InfrastructureDeploymentCapability =
  (typeof INFRASTRUCTURE_DEPLOYMENT_CAPABILITIES)[number];

export interface ContainerDefinition {
  id: string;
  image: string;
  healthcheck: boolean;
  nonRootUser: boolean;
  readOnlyFilesystem: boolean;
  cpuLimit: string;
  memoryLimit: string;
}

export interface KubernetesWorkload {
  id: string;
  replicas: number;
  readinessProbe: boolean;
  livenessProbe: boolean;
  resourceRequests: boolean;
  resourceLimits: boolean;
  podDisruptionBudget: boolean;
}

export interface DeploymentPipeline {
  id: string;
  build: boolean;
  test: boolean;
  securityScan: boolean;
  artifactPublish: boolean;
  stagingDeploy: boolean;
  productionApproval: boolean;
  productionDeploy: boolean;
  rollback: boolean;
}

export interface InfrastructureDependency {
  id: string;
  type:
    | 'database'
    | 'redis'
    | 'queue'
    | 'object-storage'
    | 'cdn'
    | 'monitoring';
  configured: boolean;
  healthy: boolean;
  highlyAvailable: boolean;
}

export interface DeploymentStrategy {
  id: string;
  type: 'rolling' | 'blue-green' | 'canary';
  zeroDowntime: boolean;
  rollbackReady: boolean;
  trafficControlReady: boolean;
}

export interface InfrastructureDeploymentDashboardSnapshot {
  generatedAt: string;
  containerScore: number;
  kubernetesScore: number;
  cicdScore: number;
  dependencyScore: number;
  securityEdgeScore: number;
  observabilityScore: number;
  deploymentScore: number;
  capabilityStatus: Record<
    InfrastructureDeploymentCapability,
    'operational'
  >;
}