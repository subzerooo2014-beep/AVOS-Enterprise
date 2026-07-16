import { Injectable } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import type {
  EventPlatformComponent,
  EventPlatformComponentType,
} from "./event-platform-integration.types";

@Injectable()
export class EventPlatformDiscoveryService {
  discover(sourceRoot: string): EventPlatformComponent[] {
    if (!existsSync(sourceRoot)) {
      return [];
    }

    return this.walk(sourceRoot)
      .filter((filePath) => this.isEventRelated(filePath))
      .map((filePath) => this.toComponent(sourceRoot, filePath))
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

  private isEventRelated(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, "/").toLowerCase();

    return (
      normalized.includes("/event-bus/") ||
      normalized.includes("/eventbus/") ||
      normalized.includes("/events/") ||
      normalized.includes("/infrastructure/events/")
    ) && normalized.endsWith(".ts");
  }

  private toComponent(
    sourceRoot: string,
    filePath: string,
  ): EventPlatformComponent {
    const content = readFileSync(filePath, "utf8");
    const relativePath = relative(sourceRoot, filePath).split(sep).join("/");
    const segments = relativePath.split("/");
    const domain = segments[0] ?? "core";
    const type = this.detectType(relativePath);
    const classMatch = content.match(/export\s+class\s+([A-Za-z0-9_]+)/);
    const interfaceMatch = content.match(/export\s+interface\s+([A-Za-z0-9_]+)/);
    const name =
      classMatch?.[1] ??
      interfaceMatch?.[1] ??
      relativePath.split("/").pop()?.replace(".ts", "") ??
      relativePath;
    const dependencies = Array.from(
      content.matchAll(/from\s+["']([^"']+)["']/g),
    ).map((match) => match[1]);

    const capabilities = [
      content.includes("dispatch") ? "DISPATCH" : undefined,
      content.includes("publish") ? "PUBLISH" : undefined,
      content.includes("subscribe") ? "SUBSCRIBE" : undefined,
      content.includes("register") ? "REGISTER" : undefined,
      content.includes("retry") ? "RETRY" : undefined,
      content.includes("dead") || content.includes("Dead")
        ? "DEAD_LETTER"
        : undefined,
      content.includes("emit") ? "EMIT" : undefined,
    ].filter((item): item is string => Boolean(item));

    return {
      id: relativePath
        .replace(/\.ts$/, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .toLowerCase(),
      name,
      type,
      filePath: relativePath,
      domain,
      version: "1.0.0",
      capabilities,
      dependencies,
      status: "DISCOVERED",
      discoveredAt: new Date().toISOString(),
    };
  }

  private detectType(relativePath: string): EventPlatformComponentType {
    const value = relativePath.toLowerCase();

    if (value.includes("dead-letter")) return "DEAD_LETTER";
    if (value.includes("retry")) return "RETRY_POLICY";
    if (value.includes("registry")) return "EVENT_REGISTRY";
    if (value.includes("dispatcher")) return "EVENT_DISPATCHER";
    if (value.includes("infrastructure/events")) {
      return "INFRASTRUCTURE_EVENT_BUS";
    }
    if (value.includes("event-bus") || value.includes("eventbus")) {
      return "EVENT_BUS";
    }
    if (value.includes("/events/")) return "DOMAIN_EVENTS";
    if (value.endsWith(".module.ts")) return "EVENT_MODULE";

    return "UNKNOWN";
  }
}
