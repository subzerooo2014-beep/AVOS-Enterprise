import { Injectable } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import type {
  IntegrationComponentRecord,
  IntegrationComponentType,
} from "./enterprise-integration-control-plane.types";

@Injectable()
export class IntegrationDiscoveryService {
  discover(sourceRoot: string): IntegrationComponentRecord[] {
    if (!existsSync(sourceRoot)) return [];

    return this.walk(sourceRoot)
      .filter((filePath) => this.isRelevant(filePath))
      .map((filePath) => this.toRecord(sourceRoot, filePath))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  private walk(directory: string): string[] {
    const files: string[] = [];

    for (const entry of readdirSync(directory)) {
      const fullPath = join(directory, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) files.push(...this.walk(fullPath));
      else files.push(fullPath);
    }

    return files;
  }

  private isRelevant(filePath: string): boolean {
    const value = filePath.replace(/\\/g, "/").toLowerCase();

    return (
      value.includes("/enterprise-integration-hub/") ||
      value.includes("/production-integrations/") ||
      value.includes("/integrations/") ||
      value.includes("/webhooks/") ||
      value.includes("/gateway/")
    ) && value.endsWith(".ts");
  }

  private toRecord(
    sourceRoot: string,
    filePath: string,
  ): IntegrationComponentRecord {
    const content = readFileSync(filePath, "utf8");
    const relativePath = relative(sourceRoot, filePath).split(sep).join("/");
    const segments = relativePath.split("/");
    const classMatch = content.match(/export\s+class\s+([A-Za-z0-9_]+)/);
    const interfaceMatch = content.match(/export\s+interface\s+([A-Za-z0-9_]+)/);
    const name =
      classMatch?.[1] ??
      interfaceMatch?.[1] ??
      relativePath.split("/").pop()?.replace(".ts", "") ??
      relativePath;

    const capabilities = [
      content.includes("execute") ? "EXECUTE" : undefined,
      content.includes("health") ? "HEALTH" : undefined,
      content.includes("retry") ? "RETRY" : undefined,
      content.includes("schedule") ? "SCHEDULE" : undefined,
      content.includes("transform") ? "TRANSFORM" : undefined,
      content.includes("webhook") || content.includes("Webhook")
        ? "WEBHOOK"
        : undefined,
      content.includes("oauth") || content.includes("OAuth")
        ? "OAUTH"
        : undefined,
      content.includes("rate") || content.includes("Rate")
        ? "RATE_LIMIT"
        : undefined,
      content.includes("circuit") || content.includes("Circuit")
        ? "CIRCUIT_BREAKER"
        : undefined,
      content.includes("failover") || content.includes("Failover")
        ? "FAILOVER"
        : undefined,
    ].filter((item): item is string => Boolean(item));

    const dependencies = Array.from(
      content.matchAll(/from\s+["']([^"']+)["']/g),
    ).map((match) => match[1]);

    return {
      id: relativePath
        .replace(/\.ts$/, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .toLowerCase(),
      name,
      type: this.detectType(relativePath),
      filePath: relativePath,
      domain: segments[0] ?? "integration",
      version: "1.0.0",
      capabilities,
      dependencies,
      status: "DISCOVERED",
      discoveredAt: new Date().toISOString(),
    };
  }

  private detectType(relativePath: string): IntegrationComponentType {
    const value = relativePath.toLowerCase();

    if (value.includes("webhook")) return "WEBHOOK";
    if (value.includes("provider")) return "PROVIDER";
    if (value.includes("connector")) return "CONNECTOR";
    if (value.includes("gateway")) return "GATEWAY";
    if (
      value.includes("security") ||
      value.includes("oauth") ||
      value.includes("api-key") ||
      value.includes("signing")
    ) return "SECURITY";
    if (
      value.includes("retry") ||
      value.includes("circuit-breaker") ||
      value.includes("failover") ||
      value.includes("rate-limiter") ||
      value.includes("timeout")
    ) return "RELIABILITY";
    if (
      value.includes("monitor") ||
      value.includes("metrics") ||
      value.includes("sla") ||
      value.includes("health") ||
      value.includes("report")
    ) return "MONITORING";
    if (value.includes("scheduler")) return "SCHEDULER";
    if (value.includes("transform") || value.includes("mapping")) {
      return "TRANSFORMATION";
    }
    if (value.includes("integration-hub")) return "HUB";

    return "UNKNOWN";
  }
}
