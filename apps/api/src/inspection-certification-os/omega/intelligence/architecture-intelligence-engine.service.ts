import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import {
  OmegaIntelligenceFinding,
  OmegaIntelligenceSection,
} from "./omega-intelligence.types";

@Injectable()
export class ArchitectureIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(apiRoot: string): OmegaIntelligenceSection {
    const files = this.fileSystem
      .listFiles(apiRoot, 6000)
      .filter((file: string) => file.endsWith(".ts"));

    const modules = files.filter((file: string) => file.endsWith(".module.ts"));
    const controllers = files.filter((file: string) =>
      file.endsWith(".controller.ts"),
    );
    const services = files.filter((file: string) => file.endsWith(".service.ts"));
    const guards = files.filter((file: string) => file.endsWith(".guard.ts"));
    const interceptors = files.filter((file: string) =>
      file.endsWith(".interceptor.ts"),
    );

    const findings: OmegaIntelligenceFinding[] = [];

    if (modules.length === 0) {
      findings.push({
        id: `omega.architecture.${randomUUID()}`,
        category: "architecture",
        severity: "critical",
        title: "No NestJS modules discovered",
        description: "The API source tree does not expose any NestJS module.",
        evidence: [{ modules: modules.length }],
        recommendations: ["Verify the API source root and module structure."],
      });
    }

    const score = modules.length > 0 ? 100 : 0;

    return {
      name: "architecture-intelligence",
      status: score >= 90 ? "healthy" : "critical",
      score,
      findings,
      metrics: {
        files: files.length,
        modules: modules.length,
        controllers: controllers.length,
        services: services.length,
        guards: guards.length,
        interceptors: interceptors.length,
        foundationFirstSignal: modules.length > 0,
      },
    };
  }
}

