import { Injectable } from "@nestjs/common";
import { MembershipPolicy } from "../policies/membership.policy";
@Injectable()
export class MembershipService {
  private readonly records: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: MembershipPolicy) {}
  create(input: { entityId: string; plan: string; durationMonths: number }) {
    this.policy.validate(input.plan, input.durationMonths);
    const record = {
      id: `membership_${Date.now()}`,
      ...input,
      status: "ACTIVE",
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + input.durationMonths * 30 * 86400000).toISOString(),
    };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}
