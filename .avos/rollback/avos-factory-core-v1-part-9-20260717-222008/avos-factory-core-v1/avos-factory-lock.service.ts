import {
  ConflictException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  FactoryExecutionLease
} from "./avos-factory-operational.contracts";
import {
  AvosFactoryGovernanceService
} from "./avos-factory-governance.service";

@Injectable()
export class AvosFactoryLockService {
  private readonly leases =
    new Map<string, FactoryExecutionLease>();

  constructor(
    private readonly governance:
      AvosFactoryGovernanceService
  ) {}

  acquire(
    resourceKey: string,
    owner: string
  ): FactoryExecutionLease {
    this.removeExpired();

    const existing =
      this.leases.get(resourceKey);

    if (existing?.active) {
      throw new ConflictException(
        `Factory resource is already locked: ${resourceKey}`
      );
    }

    const now = new Date();
    const timeoutSeconds =
      this.governance.getPolicy().lockTimeoutSeconds;

    const lease: FactoryExecutionLease = {
      id: randomUUID(),
      resourceKey,
      owner,
      acquiredAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() + timeoutSeconds * 1000
      ).toISOString(),
      active: true
    };

    this.leases.set(
      resourceKey,
      lease
    );

    return structuredClone(lease);
  }

  release(
    resourceKey: string,
    owner?: string
  ): FactoryExecutionLease | undefined {
    const lease =
      this.leases.get(resourceKey);

    if (!lease) {
      return undefined;
    }

    if (
      owner &&
      lease.owner !== owner
    ) {
      throw new ConflictException(
        "Only the lease owner may release the factory resource."
      );
    }

    lease.active = false;
    lease.releasedAt =
      new Date().toISOString();

    this.leases.set(
      resourceKey,
      lease
    );

    return structuredClone(lease);
  }

  active(): FactoryExecutionLease[] {
    this.removeExpired();

    return [...this.leases.values()]
      .filter((lease) => lease.active)
      .map((lease) => structuredClone(lease));
  }

  countActive(): number {
    return this.active().length;
  }

  private removeExpired(): void {
    const now = Date.now();

    for (const [key, lease] of this.leases.entries()) {
      if (
        lease.active &&
        new Date(lease.expiresAt).getTime() <= now
      ) {
        lease.active = false;
        lease.releasedAt =
          new Date().toISOString();
        this.leases.set(key, lease);
      }
    }
  }
}
