import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";

export interface CodeGenGenerationCacheEntry {
  key: string;
  fingerprint: string;
  artifact: CodeGenArtifactDescriptor;
  metadata: CodeGenMetadata;
  createdAt: string;
  updatedAt: string;
  hits: number;
}

export interface CodeGenGenerationCacheStats {
  entries: number;
  hits: number;
  misses: number;
  hitRatio: number;
  generatedAt: string;
}
