import { Injectable } from "@nestjs/common";
import type { TenantContextRecord } from "./enterprise-platform-services-control-plane.types";

@Injectable()
export class TenantContextService {
  private readonly tenants = new Map<string, TenantContextRecord>();

  register(tenant: TenantContextRecord): TenantContextRecord {
    this.tenants.set(tenant.tenantId, {
      ...tenant,
      metadata: { ...tenant.metadata },
    });

    return { ...tenant, metadata: { ...tenant.metadata } };
  }

  get(tenantId: string): TenantContextRecord | undefined {
    const tenant = this.tenants.get(tenantId);
    return tenant ? { ...tenant, metadata: { ...tenant.metadata } } : undefined;
  }

  list(): TenantContextRecord[] {
    return Array.from(this.tenants.values()).map((tenant) => ({
      ...tenant,
      metadata: { ...tenant.metadata },
    }));
  }

  count(): number {
    return this.tenants.size;
  }
}
