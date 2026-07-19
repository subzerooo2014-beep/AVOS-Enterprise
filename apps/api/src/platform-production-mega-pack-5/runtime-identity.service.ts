import { Injectable } from "@nestjs/common";
import { RuntimeIdentity } from "./platform-production-mega-pack-5.types";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";
import { SecurityAuditService } from "./security-audit.service";

@Injectable()
export class RuntimeIdentityService {
  constructor(
    private readonly store: PlatformSecurityFileStoreService,
    private readonly audit: SecurityAuditService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    const defaults = [
      {
        runtimeKey: "unified-platform-runtime",
        serviceName: "Unified Platform Runtime",
        environment: "production",
        trustDomain: "avos.platform",
        status: "active" as const,
        publicKeyId: "key:platform-runtime:1",
        capabilities: ["runtime.execute", "runtime.health"],
      },
      {
        runtimeKey: "enterprise-service-mesh",
        serviceName: "Enterprise Service Mesh",
        environment: "production",
        trustDomain: "avos.platform",
        status: "active" as const,
        publicKeyId: "key:service-mesh:1",
        capabilities: ["service.route", "service.discover"],
      },
      {
        runtimeKey: "platform-event-mesh",
        serviceName: "Platform Event Mesh",
        environment: "production",
        trustDomain: "avos.platform",
        status: "active" as const,
        publicKeyId: "key:event-mesh:1",
        capabilities: ["event.publish", "event.consume"],
      },
    ];

    for (const identity of defaults) {
      this.register(identity, "human:khalifa");
    }
  }

  register(
    input: Omit<RuntimeIdentity, "id" | "createdAt" | "updatedAt">,
    approvedBy: string,
  ): RuntimeIdentity {
    if (!approvedBy.startsWith("human:")) {
      throw new Error("Runtime identity registration requires Human Final Authority.");
    }

    const existing = this.list().find(
      (identity) => identity.runtimeKey === input.runtimeKey,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const identity: RuntimeIdentity = {
      ...input,
      id: this.id("runtime-identity"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`identities/${identity.id}.json`, identity);
    this.audit.record({
      category: "identity",
      action: "register",
      actor: approvedBy,
      subject: identity.id,
      outcome: "success",
      metadata: { runtimeKey: identity.runtimeKey },
    });

    return identity;
  }

  list(): RuntimeIdentity[] {
    return this.store.listJson<RuntimeIdentity>("identities");
  }

  get(id: string): RuntimeIdentity {
    const identity = this.list().find((item) => item.id === id);

    if (!identity) {
      throw new Error(`Runtime identity not found: ${id}`);
    }

    return identity;
  }
}