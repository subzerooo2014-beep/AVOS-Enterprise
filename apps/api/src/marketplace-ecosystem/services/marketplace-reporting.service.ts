import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceReportingService {
  create(input: Record<string, unknown>) {
    return { id: `report_${Date.now()}`, ...input, generatedAt: new Date().toISOString() };
  }
}
