import { Injectable } from '@nestjs/common';
import {
  CapacityPool,
  GlobalOperation,
  ServiceNode,
} from './global-autonomous-operations.types';

@Injectable()
export class EnterpriseOperationalDigitalTwinService {
  create(
    operations: GlobalOperation[],
    pools: CapacityPool[],
    nodes: ServiceNode[],
  ) {
    return {
      generatedAt: new Date().toISOString(),
      operations: operations.map((operation) => ({ ...operation })),
      capacityPools: pools.map((pool) => ({ ...pool })),
      serviceNodes: nodes.map((node) => ({ ...node })),
      regions: [
        ...new Set([
          ...operations.map((operation) => operation.region),
          ...pools.map((pool) => pool.region),
          ...nodes.map((node) => node.region),
        ]),
      ],
    };
  }
}