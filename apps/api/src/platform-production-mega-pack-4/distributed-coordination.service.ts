import { Injectable } from "@nestjs/common";
import { CoordinationLease } from "./platform-production-mega-pack-4.types";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";

@Injectable()
export class DistributedCoordinationService {
  constructor(
    private readonly store: EventMeshFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  acquire(
    resourceKey: string,
    owner: string,
    ttlMs = 30000,
  ): CoordinationLease {
    const active = this.list().find(
      (lease) =>
        lease.resourceKey === resourceKey &&
        lease.status === "active" &&
        new Date(lease.expiresAt).getTime() > Date.now(),
    );

    if (active) {
      throw new Error(
        `Resource is already leased by ${active.owner}: ${resourceKey}`,
      );
    }

    const acquiredAt = this.now();
    const lease: CoordinationLease = {
      id: this.id("coordination-lease"),
      resourceKey,
      owner,
      status: "active",
      acquiredAt,
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    };

    this.store.writeJson(`coordination/${lease.id}.json`, lease);
    return lease;
  }

  release(id: string, owner: string): CoordinationLease {
    const lease = this.get(id);

    if (lease.owner !== owner) {
      throw new Error("Only the lease owner can release the resource.");
    }

    const released: CoordinationLease = {
      ...lease,
      status: "released",
      releasedAt: this.now(),
    };

    this.store.writeJson(`coordination/${released.id}.json`, released);
    return released;
  }

  list(): CoordinationLease[] {
    return this.store.listJson<CoordinationLease>("coordination");
  }

  get(id: string): CoordinationLease {
    const lease = this.list().find((item) => item.id === id);

    if (!lease) {
      throw new Error(`Coordination lease not found: ${id}`);
    }

    return lease;
  }
}