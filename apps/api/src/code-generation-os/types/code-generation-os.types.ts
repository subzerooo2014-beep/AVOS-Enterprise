export type CodeArtifactKind =
  | "module" | "controller" | "service" | "dto" | "interface"
  | "repository" | "validator" | "guard" | "interceptor"
  | "prisma-model" | "test" | "documentation" | "deployment";

export interface CodeGenerationBlueprint {
  id: string;
  name: string;
  version: string;
  namespace: string;
  targetRoot: string;
  requestedCapabilities: string[];
  artifacts: CodeArtifactRequest[];
  metadata: Record<string, unknown>;
}

export interface CodeArtifactRequest {
  id: string;
  kind: CodeArtifactKind;
  name: string;
  relativePath: string;
  dependencies: string[];
  options: Record<string, unknown>;
}

export interface GeneratedCodeArtifact {
  id: string;
  kind: CodeArtifactKind;
  path: string;
  content: string;
  checksum: string;
  dependencies: string[];
  generatedAt: string;
}

export interface CodeGenerationManifest {
  id: string;
  blueprintId: string;
  sessionId: string;
  artifacts: GeneratedCodeArtifact[];
  qualityScore: number;
  approved: boolean;
  createdAt: string;
}

export interface CodeGenerationSession {
  id: string;
  blueprintId: string;
  stage: "created" | "compiled" | "awaiting-human-approval" | "approved" | "generated" | "failed";
  approvedBy?: string;
  artifacts: GeneratedCodeArtifact[];
  events: string[];
  createdAt: string;
  updatedAt: string;
}
