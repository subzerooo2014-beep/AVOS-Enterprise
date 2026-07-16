export type RepositoryHealthStatus = "HEALTHY" | "DEGRADED" | "UNKNOWN";

export interface RepositoryMetadata {
  id: string;
  name: string;
  token: string;
  filePath: string;
  domain: string;
  version: string;
  implementation: string;
  interfaceName?: string;
  dependencies: string[];
  capabilities: string[];
  healthStatus: RepositoryHealthStatus;
  discoveredAt: string;
  updatedAt: string;
}

export interface RepositoryDependencyEdge {
  source: string;
  target: string;
  type: "USES" | "DEPENDS_ON";
}

export interface RepositoryRegistryStats {
  totalRepositories: number;
  healthyRepositories: number;
  degradedRepositories: number;
  unknownRepositories: number;
  domains: number;
  versions: number;
}

export interface RepositoryResolution {
  success: boolean;
  repository?: RepositoryMetadata;
  reason?: string;
}

export interface RepositoryRegistryHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  statistics: RepositoryRegistryStats;
  lastDiscoveryAt?: string;
}
