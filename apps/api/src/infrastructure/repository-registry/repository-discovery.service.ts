import { Injectable } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import type { RepositoryMetadata } from "./repository-registry.types";

@Injectable()
export class RepositoryDiscoveryService {
  discover(sourceRoot: string): RepositoryMetadata[] {
    if (!existsSync(sourceRoot)) {
      return [];
    }

    const files = this.walk(sourceRoot).filter((filePath) =>
      filePath.endsWith(".repository.ts"),
    );

    return files.map((filePath) => this.toMetadata(sourceRoot, filePath));
  }

  private walk(directory: string): string[] {
    const entries = readdirSync(directory);
    const files: string[] = [];

    for (const entry of entries) {
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

  private toMetadata(sourceRoot: string, filePath: string): RepositoryMetadata {
    const content = readFileSync(filePath, "utf8");
    const relativePath = relative(sourceRoot, filePath).split(sep).join("/");
    const segments = relativePath.split("/");
    const domain = segments.length > 1 ? segments[0] : "common";
    const classMatch = content.match(/export\s+class\s+([A-Za-z0-9_]+)/);
    const interfaceMatch = content.match(/implements\s+([A-Za-z0-9_]+)/);
    const importMatches = Array.from(
      content.matchAll(/from\s+["']([^"']+)["']/g),
    ).map((match) => match[1]);
    const name = classMatch?.[1] ?? this.pascalCase(relativePath.replace(".ts", ""));
    const id = relativePath
      .replace(/\.ts$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase();

    const capabilities = [
      content.includes("findMany") ? "READ_MANY" : undefined,
      content.includes("findUnique") || content.includes("findFirst")
        ? "READ_ONE"
        : undefined,
      content.includes("create(") ? "CREATE" : undefined,
      content.includes("update(") ? "UPDATE" : undefined,
      content.includes("delete(") ? "DELETE" : undefined,
      content.includes("$transaction") ? "TRANSACTIONAL" : undefined,
    ].filter((item): item is string => Boolean(item));

    const now = new Date().toISOString();

    return {
      id,
      name,
      token: name,
      filePath: relativePath,
      domain,
      version: "1.0.0",
      implementation: classMatch?.[1] ?? name,
      interfaceName: interfaceMatch?.[1],
      dependencies: importMatches,
      capabilities,
      healthStatus: classMatch ? "HEALTHY" : "UNKNOWN",
      discoveredAt: now,
      updatedAt: now,
    };
  }

  private pascalCase(value: string): string {
    return value
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }
}
