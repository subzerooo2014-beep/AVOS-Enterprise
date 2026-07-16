import { Injectable } from "@nestjs/common";
import { KernelIdentity } from "../enterprise-kernel-mega-pack-1.types";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelIdentityService {
  private readonly identity: KernelIdentity;

  constructor(
    private readonly audit: KernelAuditService
  ) {
    this.identity = {
      id: "avos:enterprise-kernel",
      name: "AVOS Enterprise Kernel",
      version: "1.0.0",
      instanceId: `kernel-instance:${Date.now()}`,
      environment: process.env.NODE_ENV ?? "development",
      organizationIdentityId: "avos:enterprise",
      createdAt: new Date().toISOString()
    };
  }

  get() {
    return this.identity;
  }

  verify(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const valid =
      this.identity.id.trim().length > 0 &&
      this.identity.version.trim().length > 0 &&
      this.identity.instanceId.trim().length > 0;

    this.audit.record({
      correlationId: input.correlationId,
      category: "identity",
      action: "kernel-identity-verified",
      subjectId: this.identity.id,
      actorIdentityId: input.actorIdentityId,
      outcome: valid ? "success" : "failure",
      metadata: {
        instanceId: this.identity.instanceId,
        version: this.identity.version
      }
    });

    return {
      valid,
      identity: this.identity,
      checkedAt: new Date().toISOString()
    };
  }
}
