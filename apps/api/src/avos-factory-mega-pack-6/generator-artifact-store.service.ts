import { Injectable } from "@nestjs/common";
import { GeneratedArtifact } from "./generator-runtime.contracts";

@Injectable()
export class GeneratorArtifactStoreService {
  private readonly artifacts = new Map<string, GeneratedArtifact>();

  save(artifact: GeneratedArtifact): GeneratedArtifact {
    this.artifacts.set(artifact.id, structuredClone(artifact));
    return structuredClone(artifact);
  }

  list(): GeneratedArtifact[] {
    return [...this.artifacts.values()].map((item) => structuredClone(item));
  }

  listByExecution(executionId: string): GeneratedArtifact[] {
    return this.list().filter((artifact) => artifact.executionId === executionId);
  }

  count(): number {
    return this.artifacts.size;
  }
}
