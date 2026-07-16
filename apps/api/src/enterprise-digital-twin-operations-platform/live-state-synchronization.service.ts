import { Injectable } from "@nestjs/common";
import { OperationalTwinRegistryService } from "./operational-twin-registry.service";
import type { TwinStateEventRecord } from "./enterprise-digital-twin-operations.types";

@Injectable()
export class LiveStateSynchronizationService {
  private readonly events: TwinStateEventRecord[] = [];

  constructor(private readonly twins: OperationalTwinRegistryService) {}

  synchronize(
    twinId: string,
    source: string,
    patch: Record<string, unknown>,
  ): TwinStateEventRecord {
    const result = this.twins.applyPatch(twinId, patch);

    const event: TwinStateEventRecord = {
      id: `twin-state-event-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      twinId,
      source,
      patch: { ...patch },
      previousVersion: result.previousVersion,
      currentVersion: result.twin.version,
      createdAt: new Date().toISOString(),
    };

    this.events.unshift(event);
    return this.clone(event);
  }

  list(twinId?: string): TwinStateEventRecord[] {
    return this.events
      .filter((event) => (twinId ? event.twinId === twinId : true))
      .map((event) => this.clone(event));
  }

  count(): number {
    return this.events.length;
  }

  private clone(event: TwinStateEventRecord): TwinStateEventRecord {
    return {
      ...event,
      patch: { ...event.patch },
    };
  }
}
