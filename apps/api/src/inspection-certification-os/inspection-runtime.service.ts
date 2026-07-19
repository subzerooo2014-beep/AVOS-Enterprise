import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EvidenceCollectorService } from "./evidence-collector.service";
import { InspectionContextFactory } from "./inspection-context.factory";
import { InspectionPluginRegistryService } from "./inspection-plugin-registry.service";
import {
  InspectionPlugin,
  InspectionPluginResult,
  InspectionRuntimeReport,
} from "./inspection-plugin.types";

@Injectable()
export class InspectionRuntimeService {
  constructor(
    private readonly registry: InspectionPluginRegistryService,
    private readonly contextFactory: InspectionContextFactory,
    private readonly evidenceCollector: EvidenceCollectorService,
  ) {}

  async execute(): Promise<InspectionRuntimeReport> {
    const executionId = `IC-RUNTIME-${randomUUID()}`;
    const startedAtDate = new Date();
    const context = this.contextFactory.create();
    const orderedPlugins = this.resolveExecutionOrder(this.registry.enabled());
    const results: InspectionPluginResult[] = [];

    for (const plugin of orderedPlugins) {
      const missingDependency = plugin.dependencies.find(
        (dependency) =>
          !results.some(
            (result) =>
              result.pluginId === dependency &&
              result.status !== "fail" &&
              result.status !== "skipped",
          ),
      );

      if (missingDependency) {
        results.push({
          pluginId: plugin.id,
          pluginVersion: plugin.version,
          ruleId: plugin.id,
          name: plugin.name,
          category: plugin.category,
          severity: plugin.severity,
          status: "skipped",
          weight: 0,
          durationMs: 0,
          message: `Skipped because dependency did not pass: ${missingDependency}`,
          evidence: [{ key: "missingDependency", value: missingDependency }],
          metrics: [],
          recommendations: [],
          files: [],
        });
        continue;
      }

      results.push(await this.executeWithTimeout(plugin, context));
    }

    const completedAtDate = new Date();

    return {
      executionId,
      startedAt: startedAtDate.toISOString(),
      completedAt: completedAtDate.toISOString(),
      durationMs: completedAtDate.getTime() - startedAtDate.getTime(),
      pluginCount: orderedPlugins.length,
      passed: results.filter((result) => result.status === "pass").length,
      warnings: results.filter((result) => result.status === "warn").length,
      failed: results.filter((result) => result.status === "fail").length,
      skipped: results.filter((result) => result.status === "skipped").length,
      evidence: this.evidenceCollector.collect(results),
      results,
    };
  }

  private async executeWithTimeout(
    plugin: InspectionPlugin,
    context: ReturnType<InspectionContextFactory["create"]>,
  ): Promise<InspectionPluginResult> {
    const startedAt = Date.now();

    try {
      const result = await Promise.race([
        plugin.inspect(context),
        new Promise<InspectionPluginResult>((_, reject) => {
          setTimeout(
            () =>
              reject(
                new Error(
                  `Inspection plugin timed out after ${plugin.timeoutMs}ms`,
                ),
              ),
            plugin.timeoutMs,
          );
        }),
      ]);

      return {
        ...result,
        durationMs: Math.max(result.durationMs, Date.now() - startedAt),
      };
    } catch (error) {
      return {
        pluginId: plugin.id,
        pluginVersion: plugin.version,
        ruleId: plugin.id,
        name: plugin.name,
        category: plugin.category,
        severity: plugin.severity,
        status: "fail",
        weight: 0,
        durationMs: Date.now() - startedAt,
        message: error instanceof Error ? error.message : "Unknown plugin error",
        evidence: [{ key: "isolatedFailure", value: true }],
        metrics: [],
        recommendations: [
          {
            title: "Review plugin failure",
            description:
              "The runtime isolated this plugin failure. Review the evidence before retrying.",
            priority: "high",
          },
        ],
        files: [],
      };
    }
  }

  private resolveExecutionOrder(
    plugins: readonly InspectionPlugin[],
  ): InspectionPlugin[] {
    const byId = new Map(plugins.map((plugin) => [plugin.id, plugin]));
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const ordered: InspectionPlugin[] = [];

    const visit = (plugin: InspectionPlugin): void => {
      if (visited.has(plugin.id)) {
        return;
      }

      if (visiting.has(plugin.id)) {
        throw new Error(`Inspection plugin dependency cycle: ${plugin.id}`);
      }

      visiting.add(plugin.id);

      for (const dependencyId of plugin.dependencies) {
        const dependency = byId.get(dependencyId);
        if (!dependency) {
          throw new Error(
            `Inspection plugin dependency is not registered: ${dependencyId}`,
          );
        }
        visit(dependency);
      }

      visiting.delete(plugin.id);
      visited.add(plugin.id);
      ordered.push(plugin);
    };

    for (const plugin of plugins) {
      visit(plugin);
    }

    return ordered;
  }
}
