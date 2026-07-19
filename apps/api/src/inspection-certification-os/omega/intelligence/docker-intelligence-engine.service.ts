import { Injectable } from "@nestjs/common";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class DockerIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(repositoryRoot: string): OmegaIntelligenceSection {
    const candidates = [
      "Dockerfile",
      "docker-compose.yml",
      "docker-compose.yaml",
      "apps/api/Dockerfile",
    ];

    const found = candidates.filter((file: string) =>
      this.fileSystem.exists(
        this.fileSystem.resolve(repositoryRoot, file),
      ),
    );

    return {
      name: "docker-intelligence",
      status: found.length > 0 ? "available" : "not-configured",
      score: found.length > 0 ? 100 : 70,
      findings: [],
      metrics: {
        found,
        containerReady: found.length > 0,
      },
    };
  }
}

