import { Injectable } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";
import type {
  SecurityComponentRecord,
  SecurityComponentType,
} from "./enterprise-security-governance-control-plane.types";

@Injectable()
export class SecurityDiscoveryService {
  discover(sourceRoot: string): SecurityComponentRecord[] {
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
      value.includes("/security/") ||
      value.includes("/compliance/") ||
      value.includes("/risk/") ||
      value.includes("/auth/") ||
      value.includes("/roles/") ||
      value.includes("/permissions/") ||
      value.includes("/audit/") ||
      value.includes("/enterprise-zero-trust-security/")
    ) && value.endsWith(".ts");
  }

  private toRecord(
    sourceRoot: string,
    filePath: string,
  ): SecurityComponentRecord {
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
      content.includes("auth") || content.includes("Auth")
        ? "AUTHENTICATE"
        : undefined,
      content.includes("permission") || content.includes("Permission")
        ? "AUTHORIZE"
        : undefined,
      content.includes("risk") || content.includes("Risk")
        ? "RISK_SCORE"
        : undefined,
      content.includes("compliance") || content.includes("Compliance")
        ? "COMPLIANCE"
        : undefined,
      content.includes("audit") || content.includes("Audit")
        ? "AUDIT"
        : undefined,
      content.includes("encrypt") || content.includes("Encrypt")
        ? "ENCRYPT"
        : undefined,
      content.includes("threat") || content.includes("Threat")
        ? "THREAT_DETECTION"
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
      domain: segments[0] ?? "security",
      version: "1.0.0",
      capabilities,
      dependencies,
      status: "DISCOVERED",
      discoveredAt: new Date().toISOString(),
    };
  }

  private detectType(relativePath: string): SecurityComponentType {
    const value = relativePath.toLowerCase();

    if (value.includes("zero-trust")) return "ZERO_TRUST";
    if (value.includes("/auth/")) return "AUTHENTICATION";
    if (value.includes("permission")) return "PERMISSION";
    if (value.includes("role")) return "ROLE";
    if (value.includes("policy")) return "POLICY";
    if (value.includes("risk")) return "RISK";
    if (value.includes("compliance")) return "COMPLIANCE";
    if (value.includes("audit")) return "AUDIT";
    if (value.includes("secret")) return "SECRETS";
    if (value.includes("encrypt") || value.includes("crypto")) return "ENCRYPTION";
    if (value.includes("threat")) return "THREAT";
    if (value.includes("security")) return "AUTHORIZATION";

    return "UNKNOWN";
  }
}
