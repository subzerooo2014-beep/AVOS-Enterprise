import { Injectable } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import type {
  BusinessComponentRecord,
  BusinessComponentType,
} from "./enterprise-business-operations.types";

@Injectable()
export class BusinessOperationsDiscoveryService {
  discover(sourceRoot: string): BusinessComponentRecord[] {
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

      if (stats.isDirectory()) {
        files.push(...this.walk(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  private isRelevant(filePath: string): boolean {
    const value = filePath.replace(/\\/g, "/").toLowerCase();

    return (
      value.includes("/business-operations/") ||
      value.includes("/sales/") ||
      value.includes("/inventory/") ||
      value.includes("/customers/") ||
      value.includes("/finance/") ||
      value.includes("/orders/") ||
      value.includes("/purchases/") ||
      value.includes("/purchase-orders/") ||
      value.includes("/analytics/") ||
      value.includes("/enterprise-workflow/")
    ) && value.endsWith(".ts");
  }

  private toRecord(
    sourceRoot: string,
    filePath: string,
  ): BusinessComponentRecord {
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
      content.includes("create") ? "CREATE" : undefined,
      content.includes("update") ? "UPDATE" : undefined,
      content.includes("delete") ? "DELETE" : undefined,
      content.includes("find") ? "QUERY" : undefined,
      content.includes("process") ? "PROCESS" : undefined,
      content.includes("workflow") ? "WORKFLOW" : undefined,
      content.includes("metric") || content.includes("analytics")
        ? "ANALYTICS"
        : undefined,
      content.includes("approve") ? "APPROVAL" : undefined,
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
      domain: segments[0] ?? "business",
      version: "1.0.0",
      capabilities,
      dependencies,
      status: "DISCOVERED",
      discoveredAt: new Date().toISOString(),
    };
  }

  private detectType(relativePath: string): BusinessComponentType {
    const value = relativePath.toLowerCase();

    if (value.includes("/sales/")) return "SALES";
    if (value.includes("/inventory/")) return "INVENTORY";
    if (value.includes("/customers/")) return "CUSTOMER";
    if (value.includes("/finance/")) return "FINANCE";
    if (value.includes("/orders/")) return "ORDER";
    if (value.includes("/purchases/") || value.includes("/purchase-orders/")) {
      return "PROCUREMENT";
    }
    if (value.includes("workflow")) return "WORKFLOW";
    if (value.includes("analytics") || value.includes("metric")) {
      return "ANALYTICS";
    }
    if (value.includes("business-operations")) return "OPERATIONS";

    return "UNKNOWN";
  }
}
