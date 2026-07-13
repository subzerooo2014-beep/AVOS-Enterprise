import { BadRequestException, Injectable } from "@nestjs/common";
import type { FlowTenantContext } from "./core-flow-enterprise.types";

@Injectable()
export class CoreFlowTenancyService {
  validate(context: FlowTenantContext) {
    const tenantId = String(context?.tenantId ?? "").trim();
    if (!tenantId) {
      throw new BadRequestException("tenantId is required.");
    }

    return {
      tenantId,
      organizationId: context?.organizationId,
      region: context?.region ?? "global",
      dataResidency: context?.dataResidency ?? "default",
      validatedAt: new Date().toISOString(),
    };
  }

  scope<T extends Record<string, unknown>>(
    context: FlowTenantContext,
    payload: T,
  ) {
    const tenant = this.validate(context);
    return {
      ...payload,
      tenantId: tenant.tenantId,
      organizationId: tenant.organizationId,
      region: tenant.region,
      dataResidency: tenant.dataResidency,
    };
  }
}
