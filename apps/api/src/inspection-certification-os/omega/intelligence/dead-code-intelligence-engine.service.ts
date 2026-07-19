import { Injectable } from "@nestjs/common";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class DeadCodeIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(apiRoot: string): OmegaIntelligenceSection {
    const files = this.fileSystem
      .listFiles(apiRoot, 6000)
      .filter((file: string) => file.endsWith(".ts"));

    const suspects = files.filter((file: string) => {
      const content = this.fileSystem.readText(
        this.fileSystem.resolve(apiRoot, file),
      );

      return (
        /export\s+(class|function|const|interface|type)\s+/.test(content) &&
        !file.endsWith(".module.ts") &&
        !file.endsWith(".controller.ts") &&
        !file.endsWith(".service.ts") &&
        !file.endsWith(".spec.ts")
      );
    });

    const score = suspects.length === 0
      ? 100
      : Math.max(60, 100 - suspects.length);

    return {
      name: "dead-code-intelligence",
      status: "heuristic-only",
      score,
      findings: [],
      metrics: {
        filesAnalyzed: files.length,
        suspects: suspects.slice(0, 100),
        suspectCount: suspects.length,
        destructiveActionTaken: false,
      },
    };
  }
}

