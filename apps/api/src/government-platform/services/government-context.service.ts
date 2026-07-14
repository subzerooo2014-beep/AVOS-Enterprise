import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentContextService {
  create(provider: string) {
    return {
      provider,
      correlationId: `gov_corr_${Date.now()}`,
      idempotencyKey: `gov_idem_${Date.now()}`,
      requestedAt: new Date().toISOString(),
    };
  }
}
