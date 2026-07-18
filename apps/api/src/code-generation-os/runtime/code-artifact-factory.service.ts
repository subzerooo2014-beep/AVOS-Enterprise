import { Injectable } from "@nestjs/common";
import {
  CodeArtifactRequest,
  GeneratedCodeArtifact,
} from "../types/code-generation-os.types";
import { ChecksumService } from "./checksum.service";
import { ModuleGeneratorService } from "../generators/module-generator.service";
import { ControllerGeneratorService } from "../generators/controller-generator.service";
import { ServiceGeneratorService } from "../generators/service-generator.service";
import { DtoGeneratorService } from "../generators/dto-generator.service";
import { InterfaceGeneratorService } from "../generators/interface-generator.service";
import { RepositoryGeneratorService } from "../generators/repository-generator.service";
import { ValidatorGeneratorService } from "../generators/validator-generator.service";
import { GuardGeneratorService } from "../generators/guard-generator.service";
import { InterceptorGeneratorService } from "../generators/interceptor-generator.service";
import { PrismaModelGeneratorService } from "../generators/prisma-model-generator.service";
import { TestGeneratorService } from "../generators/test-generator.service";
import { DocumentationGeneratorService } from "../generators/documentation-generator.service";
import { DeploymentGeneratorService } from "../generators/deployment-generator.service";

@Injectable()
export class CodeArtifactFactoryService {
  constructor(
    private readonly checksum: ChecksumService,
    private readonly moduleGenerator: ModuleGeneratorService,
    private readonly controllerGenerator: ControllerGeneratorService,
    private readonly serviceGenerator: ServiceGeneratorService,
    private readonly dtoGenerator: DtoGeneratorService,
    private readonly interfaceGenerator: InterfaceGeneratorService,
    private readonly repositoryGenerator: RepositoryGeneratorService,
    private readonly validatorGenerator: ValidatorGeneratorService,
    private readonly guardGenerator: GuardGeneratorService,
    private readonly interceptorGenerator: InterceptorGeneratorService,
    private readonly prismaGenerator: PrismaModelGeneratorService,
    private readonly testGenerator: TestGeneratorService,
    private readonly documentationGenerator: DocumentationGeneratorService,
    private readonly deploymentGenerator: DeploymentGeneratorService,
  ) {}

  create(request: CodeArtifactRequest): GeneratedCodeArtifact {
    const content = this.generateContent(request);
    return {
      id: request.id,
      kind: request.kind,
      path: request.relativePath,
      content,
      checksum: this.checksum.calculate(content),
      dependencies: request.dependencies,
      generatedAt: new Date().toISOString(),
    };
  }

  private generateContent(request: CodeArtifactRequest): string {
    switch (request.kind) {
      case "module": return this.moduleGenerator.generate(request.name, request.options);
      case "controller": return this.controllerGenerator.generate(request.name, request.options);
      case "service": return this.serviceGenerator.generate(request.name, request.options);
      case "dto": return this.dtoGenerator.generate(request.name, request.options);
      case "interface": return this.interfaceGenerator.generate(request.name, request.options);
      case "repository": return this.repositoryGenerator.generate(request.name);
      case "validator": return this.validatorGenerator.generate(request.name);
      case "guard": return this.guardGenerator.generate(request.name);
      case "interceptor": return this.interceptorGenerator.generate(request.name);
      case "prisma-model": return this.prismaGenerator.generate(request.name);
      case "test": return this.testGenerator.generate(request.name, request.options);
      case "documentation": return this.documentationGenerator.generate(request.name, request.options);
      case "deployment": return this.deploymentGenerator.generate(request.name);
      default: throw new Error(`Unsupported artifact kind: ${String(request.kind)}`);
    }
  }
}
