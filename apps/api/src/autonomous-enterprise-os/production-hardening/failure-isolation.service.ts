import { Injectable } from "@nestjs/common";

@Injectable()
export class FailureIsolationService {
  isolate(unit: string, reason: string) {
    return {
      unit,
      status: "isolated",
      reason,
      isolationId: `aeos-isolation:${Date.now()}`,
      isolatedAt: new Date().toISOString(),
      humanFinalAuthority: true,
    };
  }
}