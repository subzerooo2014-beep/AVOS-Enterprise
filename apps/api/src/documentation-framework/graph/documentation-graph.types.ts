export type DocumentationGraphNodeKind =
  | "framework"
  | "governance"
  | "intelligence"
  | "blueprint"
  | "living-documentation"
  | "knowledge";

export type DocumentationGraphLinkKind =
  | "contains"
  | "governs"
  | "analyzes"
  | "synchronizes"
  | "semantic";

export interface DocumentationGraphNode {
  id: string;
  title: string;
  kind: DocumentationGraphNodeKind;
  description: string;
  keywords: string[];
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentationGraphLink {
  id: string;
  sourceId: string;
  targetId: string;
  kind: DocumentationGraphLinkKind;
  similarity: number;
  generatedBy: string;
  createdAt: string;
}

export interface DocumentationGraphSnapshot {
  version: string;
  nodes: DocumentationGraphNode[];
  links: DocumentationGraphLink[];
  rebuiltAt: string | null;
}

export interface DocumentationGraphVerificationCheck {
  name: string;
  passed: boolean;
  score: number;
  details: string;
}

export interface DocumentationGraphVerificationReport {
  id: string;
  status: "passed" | "failed";
  score: number;
  checks: DocumentationGraphVerificationCheck[];
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  verifiedAt: string;
}