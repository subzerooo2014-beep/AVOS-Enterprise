import { Injectable } from "@nestjs/common";
import { IdentityAuditEvent } from "../contracts/digital-identity.contracts";

@Injectable()
export class IdentityAuditService {
  private readonly events: IdentityAuditEvent[] = [];

  record(input: Omit<IdentityAuditEvent, "id" | "createdAt">): IdentityAuditEvent {
    const event: IdentityAuditEvent = {
      ...input,
      id: `identity-audit:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    this.events.unshift(event);
    return event;
  }

  list(limit = 100): readonly IdentityAuditEvent[] {
    return this.events.slice(0, Math.max(1, Math.min(limit, 500)));
  }
}
