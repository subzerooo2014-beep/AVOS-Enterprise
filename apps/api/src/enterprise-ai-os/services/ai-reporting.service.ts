import { Injectable } from "@nestjs/common";
@Injectable()
export class AiReportingService {
  create(input: Record<string, unknown>) {
    return { id: `ai_report_${Date.now()}`, ...input, generatedAt: new Date().toISOString() };
  }
}
