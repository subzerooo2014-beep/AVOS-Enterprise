import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentCaseService {
  private readonly cases: Array<Record<string, unknown>> = [];
  create(provider: string, type: string, payload: Record<string, unknown>) {
    const item = {
      id: `gov_case_${Date.now()}`,
      provider,
      type,
      payload,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };
    this.cases.push(item);
    return item;
  }
  list() { return [...this.cases]; }
}
