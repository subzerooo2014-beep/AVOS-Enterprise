import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentEvidenceService {
  private readonly evidence: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const item = {
      id: `evidence_${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.evidence.push(item);
    return item;
  }
  list() { return [...this.evidence]; }
}
