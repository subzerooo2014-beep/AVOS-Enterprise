import { Injectable } from "@nestjs/common";
@Injectable()
export class ClaimService {
  private readonly claims: Array<Record<string, unknown>> = [];
  create(input: { accidentId: string; insurer: string; estimatedAmount: number }) {
    const claim = {
      id: `claim_${Date.now()}`,
      ...input,
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
    };
    this.claims.push(claim);
    return claim;
  }
  list() { return [...this.claims]; }
}
