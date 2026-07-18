import { Injectable } from "@nestjs/common";
import {
  AvosFactoryRuntimeStatus
} from "./avos-factory-runtime.contracts";
import {
  ProjectKindRegistryService
} from "./project-kind-registry.service";

@Injectable()
export class AvosFactoryRuntimeService {
  constructor(
    private readonly projectKinds:
      ProjectKindRegistryService
  ) {}

  status(): AvosFactoryRuntimeStatus {
    return {
      system: "AVOS Factory Core V1",
      version: "1.0.0",
      status: "healthy",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      components: {
        blueprintEngine: true,
        codeGenerationEngine: true,
        templateEngine: true,
        aiGenerator: true,
        projectGenerator: true,
        projectExecution: true,
        filesystemTransaction: true,
        rollbackEngine: true,
        projectManifest: true,
        verificationEngine: true,
        smokeTest: true
      },
      registeredProjectKinds:
        this.projectKinds.count(),
      generatedAt:
        new Date().toISOString()
    };
  }
}
