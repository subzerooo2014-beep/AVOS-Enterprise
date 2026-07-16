import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import type { FailoverTargetRecord } from "./enterprise-resilience.types";

@Injectable()
export class FailoverRouterService {
  private readonly targets = new Map<string, FailoverTargetRecord>();

  register(target: FailoverTargetRecord): FailoverTargetRecord {
    this.targets.set(target.id, {
      ...target,
      metadata: { ...target.metadata },
    });

    return this.clone(target);
  }

  resolve(group: string): FailoverTargetRecord {
    const target = this.list()
      .filter((item) => item.group === group && item.healthy)
      .sort((a, b) => a.priority - b.priority)[0];

    if (!target) {
      throw new ServiceUnavailableException(
        `No healthy failover target is available for '${group}'.`,
      );
    }

    return target;
  }

  updateHealth(id: string, healthy: boolean): FailoverTargetRecord | undefined {
    const target = this.targets.get(id);

    if (!target) {
      return undefined;
    }

    target.healthy = healthy;
    return this.clone(target);
  }

  list(): FailoverTargetRecord[] {
    return Array.from(this.targets.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.targets.size;
  }

  private clone(target: FailoverTargetRecord): FailoverTargetRecord {
    return {
      ...target,
      metadata: { ...target.metadata },
    };
  }
}
