import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionAudit {
  log(event: any) {
    return {
      auditId: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event,
    };
  }
}
