import { Injectable } from "@nestjs/common";

@Injectable()
export class MultiTenantService {
  resolve(tenantId: string) {
    return {
      tenantId,
      resolved: true,
    };
  }
}
