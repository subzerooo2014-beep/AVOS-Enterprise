import { Injectable } from "@nestjs/common";
import { CodeArtifactRequest } from "../types/code-generation-os.types";

@Injectable()
export class DuplicateQualityService {
  validate(artifacts: CodeArtifactRequest[]): { valid: boolean; duplicates: string[] } {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const artifact of artifacts) {
      if (seen.has(artifact.relativePath)) duplicates.add(artifact.relativePath);
      seen.add(artifact.relativePath);
    }
    return { valid: duplicates.size === 0, duplicates: [...duplicates] };
  }
}
