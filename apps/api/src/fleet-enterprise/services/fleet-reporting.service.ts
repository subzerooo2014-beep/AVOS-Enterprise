import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetReportingService {
  create(input: Record<string, unknown>) {
    return { id: `report_${Date.now()}`, ...input, generatedAt: new Date().toISOString() };
  }
}
