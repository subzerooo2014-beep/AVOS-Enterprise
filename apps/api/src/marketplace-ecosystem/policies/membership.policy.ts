import { Injectable } from "@nestjs/common";
@Injectable()
export class MembershipPolicy {
  validate(plan: string, durationMonths: number) {
    if (!["FREE","PRO","PREMIUM","ENTERPRISE"].includes(plan)) throw new Error("Invalid membership plan");
    if (durationMonths <= 0) throw new Error("Invalid membership duration");
    return true;
  }
}
