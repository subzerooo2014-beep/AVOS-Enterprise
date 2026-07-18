import { Injectable } from "@nestjs/common";
import { CodeArtifactRequest } from "../types/code-generation-os.types";

@Injectable()
export class DependencyQualityService {
  validate(artifacts: CodeArtifactRequest[]): { valid: boolean; unresolved: string[] } {
    const ids = new Set(artifacts.map((item) => item.id));
    const unresolved = artifacts.flatMap((item) =>
      item.dependencies.filter((dependency) => !ids.has(dependency)),
    );
    return { valid: unresolved.length === 0, unresolved: [...new Set(unresolved)] };
  }
}
