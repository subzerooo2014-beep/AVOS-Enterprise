import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentReportingService {
  create(input: Record<string, unknown>) {
    return {
      id: `gov_report_${Date.now()}`,
      ...input,
      generatedAt: new Date().toISOString(),
    };
  }
}
