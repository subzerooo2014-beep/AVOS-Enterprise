import { Injectable } from "@nestjs/common";

@Injectable()
export class UnifiedIdentityAccessService {
  private readonly identities = new Map<string, { id: string; type: "user" | "service" | "machine"; roles: string[]; active: boolean }>();

  register(id: string, type: "user" | "service" | "machine", roles: string[] = []) {
    const identity = { id, type, roles: [...new Set(roles)], active: true };
    this.identities.set(id, identity);
    return identity;
  }

  authorize(id: string, requiredRole: string) {
    const identity = this.identities.get(id);
    return {
      identityId: id,
      authenticated: Boolean(identity?.active),
      authorized: Boolean(identity?.active && identity.roles.includes(requiredRole)),
      requiredRole,
      evaluatedAt: new Date().toISOString()
    };
  }

  summary() {
    const values = [...this.identities.values()];
    return {
      total: values.length,
      users: values.filter((item) => item.type === "user").length,
      services: values.filter((item) => item.type === "service").length,
      machines: values.filter((item) => item.type === "machine").length
    };
  }
}