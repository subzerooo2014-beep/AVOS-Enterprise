export interface RuntimeNode {
  id: string;
  name: string;
  region: string;
  zone: string;
  status: string;
  cpuCapacity: number;
  memoryCapacityMb: number;
  cpuAllocated: number;
  memoryAllocatedMb: number;
}

export interface RuntimeWorkload {
  id: string;
  name: string;
  capabilityId: string;
  nodeId: string | null;
  status: string;
  replicas: number;
  desiredReplicas: number;
  priority: number;
  version: string;
}

export interface RuntimeDashboard {
  status: {
    name: string;
    version: string;
    status: string;
    healthScore: number;
    nodes: number;
    workloads: number;
    policies: number;
    events: number;
  };
  cluster: {
    nodes: RuntimeNode[];
    cpu: {
      total: number;
      allocated: number;
      utilizationPercent: number;
    };
    memory: {
      totalMb: number;
      allocatedMb: number;
      utilizationPercent: number;
    };
  };
  workloads: RuntimeWorkload[];
  policies: Array<{
    id: string;
    name: string;
    category: string;
    enabled: boolean;
    enforcement: string;
  }>;
  recentEvents: Array<{
    id: string;
    topic: string;
    source: string;
    severity: string;
    timestamp: string;
  }>;
}