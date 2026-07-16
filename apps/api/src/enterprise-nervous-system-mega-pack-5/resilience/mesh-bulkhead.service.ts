import { ConflictException, Injectable } from "@nestjs/common";
import { MeshBulkhead } from "../enterprise-nervous-system-mega-pack-5.types";

@Injectable()
export class MeshBulkheadService {
  private readonly bulkheads =
    new Map<string, MeshBulkhead>();

  acquire(endpointId: string, limit: number) {
    const current = this.bulkheads.get(endpointId) ?? {
      id: `mesh-bulkhead:${endpointId}`,
      endpointId,
      limit: Math.max(1, limit),
      inFlight: 0,
      rejected: 0,
      updatedAt: new Date().toISOString()
    };

    if (current.inFlight >= current.limit) {
      const rejected: MeshBulkhead = {
        ...current,
        rejected: current.rejected + 1,
        updatedAt: new Date().toISOString()
      };

      this.bulkheads.set(endpointId, rejected);

      throw new ConflictException(
        `Bulkhead limit reached for endpoint: ${endpointId}`
      );
    }

    const updated: MeshBulkhead = {
      ...current,
      limit: Math.max(1, limit),
      inFlight: current.inFlight + 1,
      updatedAt: new Date().toISOString()
    };

    this.bulkheads.set(endpointId, updated);
    return updated;
  }

  release(endpointId: string) {
    const current = this.bulkheads.get(endpointId);

    if (!current) {
      return undefined;
    }

    const updated: MeshBulkhead = {
      ...current,
      inFlight: Math.max(0, current.inFlight - 1),
      updatedAt: new Date().toISOString()
    };

    this.bulkheads.set(endpointId, updated);
    return updated;
  }

  list() {
    return Array.from(this.bulkheads.values());
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      saturated: items.filter((x) => x.inFlight >= x.limit).length,
      inFlight: items.reduce((sum, item) => sum + item.inFlight, 0),
      rejected: items.reduce((sum, item) => sum + item.rejected, 0)
    };
  }
}
