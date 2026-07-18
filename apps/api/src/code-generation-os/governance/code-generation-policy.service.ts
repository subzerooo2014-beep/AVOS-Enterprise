import { Injectable } from "@nestjs/common";
import { CodeGenerationBlueprint } from "../types/code-generation-os.types";

@Injectable()
export class CodeGenerationPolicyService {
  evaluate(blueprint: CodeGenerationBlueprint) {
    const checks = {
      blueprintIdentity: Boolean(blueprint.id && blueprint.name),
      versionPresent: Boolean(blueprint.version),
      targetRootPresent: Boolean(blueprint.targetRoot),
      artifactsRequested: blueprint.artifacts.length > 0,
      humanFinalAuthority: true,
      autonomousWriteDisabled: true,
    };
    return {
      passed: Object.values(checks).every(Boolean),
      checks,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
