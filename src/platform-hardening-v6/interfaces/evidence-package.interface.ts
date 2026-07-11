export interface EvidencePackagePayload {
  packageType: string;
  title: string;
  scope: string;
  generatedAt: string;
  evidence: Array<{
    type: string;
    source: string;
    data: unknown;
  }>;
  metadata: Record<string, unknown>;
}
