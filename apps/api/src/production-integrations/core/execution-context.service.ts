import { Injectable } from "@nestjs/common";
import { ProviderExecutionContext } from "../production-integrations.types";

@Injectable()
export class ExecutionContextService {
  create(): ProviderExecutionContext {
    return {
      correlationId: `corr_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      idempotencyKey: `idem_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      requestTimestamp: new Date().toISOString(),
    };
  }
}
