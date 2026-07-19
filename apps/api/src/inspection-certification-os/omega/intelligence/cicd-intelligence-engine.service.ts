import { Injectable } from "@nestjs/common";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class CiCdIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(repositoryRoot: string): OmegaIntelligenceSection {
    const candidates = [
      ".github/workflows",
      "azure-pipelines.yml",
      ".gitlab-ci.yml",
      "Jenkinsfile",
    ];

    const found = candidates.filter((file: string) =>
      this.fileSystem.exists(
        this.fileSystem.resolve(repositoryRoot, file),
      ),
    );

    return {
      name: "cicd-intelligence",
      status: found.length > 0 ? "healthy" : "not-configured",
      score: found.length > 0 ? 100 : 70,
      findings: [],
      metrics: {
        configured: found.length > 0,
        providers: found,
      },
    };
  }
}

