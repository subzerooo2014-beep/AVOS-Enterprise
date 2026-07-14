import { Injectable } from "@nestjs/common";

@Injectable()
export class ProviderMetricsService {
  private readonly records: Array<{ code: string; success: boolean; latencyMs: number }> = [];

  record(code: string, success: boolean, latencyMs: number) {
    this.records.push({ code, success, latencyMs });
  }

  summary() {
    const byProvider: Record<string, { total: number; success: number; latency: number }> = {};
    for (const row of this.records) {
      byProvider[row.code] ??= { total: 0, success: 0, latency: 0 };
      byProvider[row.code].total += 1;
      byProvider[row.code].success += row.success ? 1 : 0;
      byProvider[row.code].latency += row.latencyMs;
    }
    return Object.fromEntries(Object.entries(byProvider).map(([code, v]) => [code, {
      total: v.total,
      successRate: v.total ? Math.round((v.success / v.total) * 100) : 0,
      averageLatencyMs: v.total ? Math.round(v.latency / v.total) : 0,
    }]));
  }
}
