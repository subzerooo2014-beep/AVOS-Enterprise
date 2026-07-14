import { Injectable } from "@nestjs/common";
import { PartnerRegistryService } from "./partner-registry.service";
import {
  PartnerCategory,
  PartnerRequestResult,
} from "./partner-platform.types";

@Injectable()
export class PartnerClientService {
  constructor(private readonly registry: PartnerRegistryService) {}

  execute(input: {
    category: PartnerCategory;
    operation: string;
    payload: Record<string, unknown>;
    correlationId?: string;
    idempotencyKey?: string;
  }): PartnerRequestResult {
    const config = this.registry.findByCategory(input.category);
    const correlationId =
      input.correlationId ??
      `corr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const idempotencyKey =
      input.idempotencyKey ??
      `idem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return {
      success: true,
      providerReference: `provider_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      status: "ACCEPTED",
      data: {
        operation: input.operation,
        partnerCode: config.code,
        environment: config.environment,
        correlationId,
        idempotencyKey,
        payload: input.payload,
      },
      simulated: true,
      receivedAt: new Date().toISOString(),
    };
  }
}
