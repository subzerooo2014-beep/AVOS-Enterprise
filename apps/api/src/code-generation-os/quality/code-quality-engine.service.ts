import { Injectable } from "@nestjs/common";
import {
  CodeArtifactRequest,
  GeneratedCodeArtifact,
} from "../types/code-generation-os.types";
import { DependencyQualityService } from "./dependency-quality.service";
import { DuplicateQualityService } from "./duplicate-quality.service";
import { NamingQualityService } from "./naming-quality.service";

@Injectable()
export class CodeQualityEngineService {
  constructor(
    private readonly naming: NamingQualityService,
    private readonly dependencies: DependencyQualityService,
    private readonly duplicates: DuplicateQualityService,
  ) {}

  assess(
    requests: CodeArtifactRequest[],
    generated: GeneratedCodeArtifact[],
  ) {
    const dependency = this.dependencies.validate(requests);
    const duplicate = this.duplicates.validate(requests);

    const identifierKinds = new Set([
      "module",
      "controller",
      "service",
      "dto",
      "interface",
      "repository",
      "validator",
      "guard",
      "interceptor",
      "prisma-model",
      "test",
    ]);

    const namesValid = requests
      .filter((item) => identifierKinds.has(item.kind))
      .every((item) => this.naming.validate(item.name));

    const contentsValid = generated.every(
      (item) => item.content.trim().length > 0,
    );

    const checks = {
      dependencyIntegrity: dependency.valid,
      duplicateProtection: duplicate.valid,
      namingStandards: namesValid,
      nonEmptyArtifacts: contentsValid,
    };

    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );

    return {
      passed: score === 100,
      score,
      checks,
      dependency,
      duplicate,
    };
  }
}
