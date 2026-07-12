export interface ResourcePool {
  key: string;
  type: "compute" | "memory" | "storage" | "agents" | "budget";
  available: number;
  reserved: number;
  unitCost: number;
}

export interface ResourceDemand {
  key: string;
  poolKey: string;
  requested: number;
  priority: number;
  minimum: number;
  maximum: number;
}

export interface ResourceAllocation {
  demandKey: string;
  poolKey: string;
  allocated: number;
  cost: number;
  fullySatisfied: boolean;
}

export interface ResourceAllocationResult {
  allocations: ResourceAllocation[];
  remainingCapacity: Record<string, number>;
  totalCost: number;
  generatedAt: string;
}

export class AutonomousResourceAllocator {
  allocate(
    pools: readonly ResourcePool[],
    demands: readonly ResourceDemand[],
  ): ResourceAllocationResult {
    const remainingCapacity = Object.fromEntries(
      pools.map((pool) => [pool.key, Math.max(0, pool.available - pool.reserved)]),
    );

    const poolMap = new Map(pools.map((pool) => [pool.key, pool]));
    const allocations: ResourceAllocation[] = [];

    for (const demand of [...demands].sort((a, b) => b.priority - a.priority)) {
      const pool = poolMap.get(demand.poolKey);
      if (!pool) continue;

      const available = remainingCapacity[demand.poolKey] ?? 0;
      const desired = Math.max(demand.minimum, Math.min(demand.maximum, demand.requested));
      const allocated = Math.max(0, Math.min(available, desired));

      remainingCapacity[demand.poolKey] = available - allocated;

      allocations.push({
        demandKey: demand.key,
        poolKey: demand.poolKey,
        allocated,
        cost: Math.round(allocated * pool.unitCost * 100) / 100,
        fullySatisfied: allocated >= desired,
      });
    }

    return {
      allocations,
      remainingCapacity,
      totalCost: Math.round(
        allocations.reduce((sum, allocation) => sum + allocation.cost, 0) * 100,
      ) / 100,
      generatedAt: new Date().toISOString(),
    };
  }
}
