import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import {
  OmegaIntelligenceFinding,
  OmegaIntelligenceSection,
} from "./omega-intelligence.types";

@Injectable()
export class SecurityIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(repositoryRoot: string): OmegaIntelligenceSection {
    const files = this.fileSystem
      .listFiles(repositoryRoot, 8000)
      .filter((file: string) =>
        [".ts", ".js", ".json", ".yaml", ".yml", ".env"].some((extension) =>
          file.endsWith(extension),
        ),
      );

    const patterns = [
      {
        name: "private-key",
        expression: /BEGIN\s+(RSA\s+)?PRIVATE\s+KEY/i,
        severity: "critical" as const,
      },
      {
        name: "hardcoded-password",
        expression: /password\s*[:=]\s*["'][^"'${}\s]{8,}["']/i,
        severity: "high" as const,
      },
      {
        name: "hardcoded-api-key",
        expression: /api[_-]?key\s*[:=]\s*["'][^"'${}\s]{12,}["']/i,
        severity: "high" as const,
      },
      {
        name: "eval-usage",
        expression: /\beval\s*\(/,
        severity: "high" as const,
      },
    ];

    const findings: OmegaIntelligenceFinding[] = [];

    for (const file of files) {
      const content = this.fileSystem.readText(
        this.fileSystem.resolve(repositoryRoot, file),
      );

      for (const pattern of patterns) {
        if (pattern.expression.test(content)) {
          findings.push({
            id: `omega.security.${randomUUID()}`,
            category: "security",
            severity: pattern.severity,
            title: `Security pattern detected: ${pattern.name}`,
            description: `Potential ${pattern.name} was detected in ${file}.`,
            evidence: [{ file, pattern: pattern.name }],
            recommendations: [
              "Review the finding manually and remove secrets or unsafe code.",
            ],
          });
        }
      }
    }

    const critical = findings.filter(
      (finding) => finding.severity === "critical",
    ).length;

    const high = findings.filter(
      (finding) => finding.severity === "high",
    ).length;

    const score = Math.max(0, 100 - critical * 30 - high * 10);

    return {
      name: "security-intelligence",
      status:
        critical > 0 ? "critical" : high > 0 ? "attention" : "healthy",
      score,
      findings: findings.slice(0, 100),
      metrics: {
        filesAnalyzed: files.length,
        findings: findings.length,
        critical,
        high,
      },
    };
  }
}

