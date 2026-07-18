import { Injectable } from "@nestjs/common";
import { GeneratedCodeArtifact } from "../types/code-generation-os.types";

@Injectable()
export class CodeArtifactRegistry {
  private readonly artifacts = new Map<string, GeneratedCodeArtifact>();

  register(artifact: GeneratedCodeArtifact): void {
    this.artifacts.set(artifact.id, artifact);
  }

  list(): GeneratedCodeArtifact[] {
    return [...this.artifacts.values()];
  }

  count(): number {
    return this.artifacts.size;
  }
}
