import { Injectable } from "@nestjs/common";
import { CommandSourceRegistryV2Service } from "./command-source-registry-v2.service";
import type { CommandSignalV2 } from "./unified-command-v2.types";

@Injectable()
export class GlobalMonitoringV2Service {
  private readonly signals: CommandSignalV2[] = [];

  constructor(private readonly sources: CommandSourceRegistryV2Service) {}

  ingest(
    sourceId: string,
    category: string,
    severity: CommandSignalV2["severity"],
    message: string,
    data: Record<string, unknown> = {},
  ): CommandSignalV2 {
    this.sources.get(sourceId);

    const signal: CommandSignalV2 = {
      id: `command-signal-v2-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      sourceId,
      category,
      severity,
      message,
      data: { ...data },
      createdAt: new Date().toISOString(),
    };

    this.signals.unshift(signal);
    return this.clone(signal);
  }

  list(): CommandSignalV2[] {
    return this.signals.map((signal) => this.clone(signal));
  }

  count(): number {
    return this.signals.length;
  }

  criticalCount(): number {
    return this.signals.filter((signal) => signal.severity === "CRITICAL")
      .length;
  }

  private clone(signal: CommandSignalV2): CommandSignalV2 {
    return {
      ...signal,
      data: { ...signal.data },
    };
  }
}
