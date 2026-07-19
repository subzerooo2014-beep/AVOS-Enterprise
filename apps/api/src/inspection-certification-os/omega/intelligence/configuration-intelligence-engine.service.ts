import { Injectable } from "@nestjs/common";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class ConfigurationIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(apiRoot: string): OmegaIntelligenceSection {
    const required = [
      "package.json",
      "tsconfig.json",
      "nest-cli.json",
      "prisma/schema.prisma",
    ];

    const present = required.filter((file: string) =>
      this.fileSystem.exists(this.fileSystem.resolve(apiRoot, file)),
    );

    const missing = required.filter((file: string) => !present.includes(file));
    const score = Number(
      ((present.length / required.length) * 100).toFixed(2),
    );

    return {
      name: "configuration-intelligence",
      status: missing.length === 0 ? "healthy" : "critical",
      score,
      findings: [],
      metrics: {
        required: required.length,
        present: present.length,
        missing,
      },
    };
  }
}

