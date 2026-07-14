import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionReportingService {
  private readonly reports: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const report = { id: `report_${Date.now()}`, ...input, status: "OPEN" };
    this.reports.push(report);
    return report;
  }
  list() { return [...this.reports]; }
}
