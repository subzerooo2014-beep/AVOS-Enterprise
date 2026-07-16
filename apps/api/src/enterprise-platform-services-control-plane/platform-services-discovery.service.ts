import { Injectable } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import type {
  PlatformServiceRecord,
  PlatformServiceType,
} from "./enterprise-platform-services-control-plane.types";

@Injectable()
export class PlatformServicesDiscoveryService {
  discover(sourceRoot: string): PlatformServiceRecord[] {
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
      value.includes("/notifications/") ||
      value.includes("/tasks/") ||
      value.includes("/calendar/") ||
      value.includes("/search/") ||
      value.includes("/reports/") ||
      value.includes("/files/") ||
      value.includes("/media/") ||
      value.includes("/settings/") ||
      value.includes("/organizations/") ||
      value.includes("/branches/") ||
      value.includes("/analytics/")
    ) && value.endsWith(".ts");
  }

  private toRecord(
    sourceRoot: string,
    filePath: string,
  ): PlatformServiceRecord {
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
      content.includes("send") ? "SEND" : undefined,
      content.includes("schedule") ? "SCHEDULE" : undefined,
      content.includes("search") ? "SEARCH" : undefined,
      content.includes("report") ? "REPORT" : undefined,
      content.includes("upload") ? "UPLOAD" : undefined,
      content.includes("download") ? "DOWNLOAD" : undefined,
      content.includes("config") ? "CONFIGURE" : undefined,
      content.includes("tenant") ? "TENANT_AWARE" : undefined,
      content.includes("metric") || content.includes("analytics")
        ? "OBSERVE"
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
      domain: segments[0] ?? "platform",
      version: "1.0.0",
      capabilities,
      dependencies,
      status: "DISCOVERED",
      discoveredAt: new Date().toISOString(),
    };
  }

  private detectType(relativePath: string): PlatformServiceType {
    const value = relativePath.toLowerCase();

    if (value.includes("notification")) return "NOTIFICATION";
    if (value.includes("task") || value.includes("calendar")) return "SCHEDULER";
    if (value.includes("search")) return "SEARCH";
    if (value.includes("report")) return "REPORTING";
    if (value.includes("/files/")) return "FILES";
    if (value.includes("/media/")) return "MEDIA";
    if (value.includes("setting")) return "CONFIGURATION";
    if (value.includes("organization") || value.includes("branch")) return "TENANT";
    if (value.includes("analytics") || value.includes("metric")) return "MONITORING";

    return "UNKNOWN";
  }
}
