import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  DependencyCheckExecutor,
  RegisteredDependencyCheck,
} from "../contracts/dependency-check.contract";
import { DependencyStatus } from "../enums/dependency-status.enum";
import { DependencyCheckResult } from "../interfaces/dependency-check.interface";
import { withTimeout } from "../utils/with-timeout.util";

@Injectable()
export class DependencyHealthRegistryService implements OnModuleInit {
  private readonly logger =
    new Logger(DependencyHealthRegistryService.name);

  private readonly checks =
    new Map<string, RegisteredDependencyCheck>();

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit(): void {
    this.register({
      name: "database",
      critical: true,
      timeoutMs: 3_000,
      executor: async () => {
        await this.prisma.$queryRawUnsafe("SELECT 1");

        return {
          name: "database",
          status: DependencyStatus.HEALTHY,
          critical: true,
          message: "Database connection is operational",
        };
      },
    });

    this.register({
      name: "runtime-memory",
      critical: true,
      timeoutMs: 1_000,
      executor: async () => {
        const memory = process.memoryUsage();
        const heapUsagePercent =
          memory.heapTotal > 0
            ? (memory.heapUsed / memory.heapTotal) * 100
            : 0;

        let status = DependencyStatus.HEALTHY;
        let message = "Runtime memory usage is within limits";

        if (heapUsagePercent >= 95) {
          status = DependencyStatus.UNHEALTHY;
          message = "Runtime heap usage is critically high";
        } else if (heapUsagePercent >= 85) {
          status = DependencyStatus.DEGRADED;
          message = "Runtime heap usage is elevated";
        }

        return {
          name: "runtime-memory",
          status,
          critical: true,
          message,
          metadata: {
            heapUsedBytes: memory.heapUsed,
            heapTotalBytes: memory.heapTotal,
            heapUsagePercent: Number(heapUsagePercent.toFixed(2)),
            rssBytes: memory.rss,
          },
        };
      },
    });

    this.register({
      name: "event-loop",
      critical: false,
      timeoutMs: 2_000,
      executor: async () => {
        const startedAt = process.hrtime.bigint();

        await new Promise<void>((resolve) => {
          setImmediate(resolve);
        });

        const elapsedNanoseconds =
          process.hrtime.bigint() - startedAt;

        const delayMs =
          Number(elapsedNanoseconds) / 1_000_000;

        const status =
          delayMs >= 250
            ? DependencyStatus.DEGRADED
            : DependencyStatus.HEALTHY;

        return {
          name: "event-loop",
          status,
          critical: false,
          message:
            status === DependencyStatus.HEALTHY
              ? "Event loop response is healthy"
              : "Event loop response is delayed",
          metadata: {
            sampledDelayMs: Number(delayMs.toFixed(3)),
            degradedThresholdMs: 250,
          },
        };
      },
    });
  }

  register(configuration: {
    name: string;
    critical: boolean;
    timeoutMs?: number;
    executor: DependencyCheckExecutor;
  }): void {
    const name = configuration.name.trim().toLowerCase();

    if (!name) {
      throw new Error("Dependency check name is required");
    }

    this.checks.set(name, {
      name,
      critical: configuration.critical,
      timeoutMs: configuration.timeoutMs ?? 5_000,
      executor: configuration.executor,
    });
  }

  unregister(name: string): boolean {
    return this.checks.delete(name.trim().toLowerCase());
  }

  listRegisteredChecks(): Array<{
    name: string;
    critical: boolean;
    timeoutMs: number;
  }> {
    return Array.from(this.checks.values())
      .map((check) => ({
        name: check.name,
        critical: check.critical,
        timeoutMs: check.timeoutMs,
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  async runAll(): Promise<DependencyCheckResult[]> {
    const checks = Array.from(this.checks.values());

    const results = await Promise.all(
      checks.map((check) => this.executeCheck(check)),
    );

    return results.sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }

  async runOne(name: string): Promise<DependencyCheckResult | null> {
    const check = this.checks.get(name.trim().toLowerCase());

    if (!check) {
      return null;
    }

    return this.executeCheck(check);
  }

  private async executeCheck(
    check: RegisteredDependencyCheck,
  ): Promise<DependencyCheckResult> {
    const startedAt = process.hrtime.bigint();

    try {
      const result = await withTimeout(
        check.executor(),
        check.timeoutMs,
        `dependency-check:${check.name}`,
      );

      return {
        ...result,
        name: check.name,
        critical: check.critical,
        latencyMs: this.elapsedMilliseconds(startedAt),
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown dependency health-check failure";

      this.logger.error(
        `Dependency check ${check.name} failed: ${message}`,
      );

      return {
        name: check.name,
        status: DependencyStatus.UNHEALTHY,
        critical: check.critical,
        latencyMs: this.elapsedMilliseconds(startedAt),
        checkedAt: new Date().toISOString(),
        message,
      };
    }
  }

  private elapsedMilliseconds(startedAt: bigint): number {
    const elapsedNanoseconds =
      process.hrtime.bigint() - startedAt;

    return Number(
      (Number(elapsedNanoseconds) / 1_000_000).toFixed(3),
    );
  }
}
