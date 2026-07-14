import { Injectable } from "@nestjs/common";
@Injectable()
export class LeadManagementService {
  private readonly leads: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const lead = {
      id: `lead_${Date.now()}`,
      ...input,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };
    this.leads.push(lead);
    return lead;
  }
  list() { return [...this.leads]; }
}
