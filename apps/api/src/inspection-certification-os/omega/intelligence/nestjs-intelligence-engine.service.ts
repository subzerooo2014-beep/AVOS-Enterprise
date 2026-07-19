import { Injectable } from "@nestjs/common";
import { InspectionFileSystemService } from "../../inspection-file-system.service";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class NestJsIntelligenceEngineService {
  constructor(private readonly fileSystem: InspectionFileSystemService) {}

  inspect(apiRoot: string): OmegaIntelligenceSection {
    const files = this.fileSystem.listFiles(apiRoot, 6000);

    const modules = files.filter((file: string) => file.endsWith(".module.ts"));
    const controllers = files.filter((file: string) =>
      file.endsWith(".controller.ts"),
    );
    const providers = files.filter((file: string) => file.endsWith(".service.ts"));
    const guards = files.filter((file: string) => file.endsWith(".guard.ts"));

    return {
      name: "nestjs-intelligence",
      status: modules.length > 0 ? "healthy" : "critical",
      score: modules.length > 0 ? 100 : 0,
      findings: [],
      metrics: {
        modules: modules.length,
        controllers: controllers.length,
        providers: providers.length,
        guards: guards.length,
      },
    };
  }
}

