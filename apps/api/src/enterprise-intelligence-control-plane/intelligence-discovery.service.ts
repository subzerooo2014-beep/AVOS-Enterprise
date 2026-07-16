import { Injectable } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import type {
  IntelligenceComponentRecord,
  IntelligenceComponentType,
} from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class IntelligenceDiscoveryService {
  discover(sourceRoot: string): IntelligenceComponentRecord[] {
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
      value.includes("/ai-core/") ||
      value.includes("/decision-engine/") ||
      value.includes("/ai-decision/") ||
      value.includes("/recommendation-engine/") ||
      value.includes("/risk-engine/") ||
      value.includes("/aiagents/") ||
      value.includes("/enterprise-ai")
    ) && value.endsWith(".ts");
  }

  private toRecord(
    sourceRoot: string,
    filePath: string,
  ): IntelligenceComponentRecord {
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
      content.includes("decid") ? "DECIDE" : undefined,
      content.includes("recommend") ? "RECOMMEND" : undefined,
      content.includes("risk") ? "RISK" : undefined,
      content.includes("predict") ? "PREDICT" : undefined,
      content.includes("score") ? "SCORE" : undefined,
      content.includes("model") ? "MODEL" : undefined,
      content.includes("prompt") ? "PROMPT" : undefined,
      content.includes("agent") ? "AGENT" : undefined,
      content.includes("explain") ? "EXPLAIN" : undefined,
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
      domain: segments[0] ?? "intelligence",
      version: "1.0.0",
      capabilities,
      dependencies,
      status: "DISCOVERED",
      discoveredAt: new Date().toISOString(),
    };
  }

  private detectType(relativePath: string): IntelligenceComponentType {
    const value = relativePath.toLowerCase();

    if (value.includes("recommend")) return "RECOMMENDATION";
    if (value.includes("risk")) return "RISK";
    if (value.includes("decision")) return "DECISION";
    if (value.includes("rule")) return "RULE";
    if (value.includes("model")) return "MODEL";
    if (value.includes("prompt")) return "PROMPT";
    if (value.includes("feature")) return "FEATURE";
    if (value.includes("agent")) return "AGENT";
    if (value.includes("analytics")) return "ANALYTICS";
    if (value.includes("ai-core")) return "AI_CORE";

    return "UNKNOWN";
  }
}
