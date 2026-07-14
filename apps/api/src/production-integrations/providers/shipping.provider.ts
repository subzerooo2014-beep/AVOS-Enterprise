import { Injectable } from "@nestjs/common";
import { ProviderExecutorService } from "../core/provider-executor.service";

@Injectable()
export class ShippingProvider {
  constructor(private readonly executor: ProviderExecutorService) {}
  execute(operation: string, payload: Record<string, unknown>) {
    return this.executor.execute("SHIPPING", operation, payload);
  }
}
