import { Injectable } from "@nestjs/common";
@Injectable()
export class ProviderFailoverRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "provider-failover_"+Date.now(), input, status: "COMPLETED" };
  }
}
