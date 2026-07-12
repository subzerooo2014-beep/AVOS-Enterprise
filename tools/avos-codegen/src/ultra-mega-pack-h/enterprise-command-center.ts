import { randomUUID } from "node:crypto";
import { UltraHEvidence, UltraHValue } from "./contracts";

export interface CommandCenterMetric {
  key: string;
  domain: "operations" | "security" | "finance" | "customers" | "ai";
  value: number;
  target: number;
  weight: number;
  metadata: Record<string, UltraHValue>;
}

export interface CommandCenterDirective {
  id: string;
  key: string;
  domain: string;
  priority: number;
  reason: string;
}

export interface EnterpriseCommandCenterResult {
  enterpriseScore: number;
  directives: CommandCenterDirective[];
  domainScores: Record<string, number>;
  evidence: UltraHEvidence[];
  evaluatedAt: string;
}

export class EnterpriseCommandCenter {
  evaluate(
    systemKey: string,
    metrics: readonly CommandCenterMetric[],
  ): EnterpriseCommandCenterResult {
    const directives: CommandCenterDirective[] = [];
    const grouped = new Map<string, CommandCenterMetric[]>();

    for (const metric of metrics) {
      const items = grouped.get(metric.domain) ?? [];
      items.push(metric);
      grouped.set(metric.domain, items);

      const ratio = metric.target <= 0 ? 1 : metric.value / metric.target;
      if (ratio < 0.8) {
        directives.push({
          id: randomUUID(),
          key: `improve-${metric.key}`,
          domain: metric.domain,
          priority: Math.max(1, Math.min(100, Math.round((1 - ratio) * metric.weight * 100))),
          reason: `Metric ${metric.key} is below target.`,
        });
      }
    }

    const domainScores: Record<string, number> = {};
    for (const [domain, items] of grouped.entries()) {
      domainScores[domain] = Math.round(
        items.reduce((sum, item) => {
          const ratio = item.target <= 0 ? 1 : item.value / item.target;
          return sum + Math.max(0, Math.min(100, ratio * 100));
        }, 0) / items.length,
      );
    }

    const enterpriseScore =
      metrics.length === 0
        ? 100
        : Math.round(
            metrics.reduce((sum, metric) => {
              const ratio = metric.target <= 0 ? 1 : metric.value / metric.target;
              return sum + Math.max(0, Math.min(100, ratio * 100));
            }, 0) / metrics.length,
          );

    return {
      enterpriseScore,
      directives: directives.sort((a, b) => b.priority - a.priority),
      domainScores,
      evidence: [
        {
          id: randomUUID(),
          systemKey,
          category: "enterprise-command-center",
          action: "command-center.evaluated",
          message: `Enterprise command center produced ${directives.length} directives.`,
          metadata: { enterpriseScore, domainScores },
          createdAt: new Date().toISOString(),
        },
      ],
      evaluatedAt: new Date().toISOString(),
    };
  }
}
