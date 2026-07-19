import { Injectable } from "@nestjs/common";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class PrismaIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(apiRoot: string): OmegaIntelligenceSection {
    const schemaPath = this.fileSystem.resolve(
      apiRoot,
      "prisma/schema.prisma",
    );

    if (!this.fileSystem.exists(schemaPath)) {
      return {
        name: "prisma-intelligence",
        status: "critical",
        score: 0,
        findings: [],
        metrics: {
          schemaExists: false,
          models: 0,
          enums: 0,
          datasources: 0,
          generators: 0,
        },
      };
    }

    const content = this.fileSystem.readText(schemaPath);

    return {
      name: "prisma-intelligence",
      status: "healthy",
      score: 100,
      findings: [],
      metrics: {
        schemaExists: true,
        models: (content.match(/\bmodel\s+\w+/g) ?? []).length,
        enums: (content.match(/\benum\s+\w+/g) ?? []).length,
        datasources: (content.match(/\bdatasource\s+\w+/g) ?? []).length,
        generators: (content.match(/\bgenerator\s+\w+/g) ?? []).length,
      },
    };
  }
}
