export interface KnowledgeFabricLayerReview {
  pack: "KF-1" | "KF-2" | "KF-3" | "KF-4" | "KF-5";
  name: string;
  ready: boolean;
  score: number;
  evidence: Record<string, unknown>;
}

export interface KnowledgeFabricReviewReport {
  id: string;
  system: "AVOS Knowledge Fabric";
  status: "certified" | "review-required";
  score: number;
  architectureScore: number;
  integrationScore: number;
  governanceScore: number;
  humanFinalAuthority: true;
  foundationFirst: true;
  blockingFindings: string[];
  layers: KnowledgeFabricLayerReview[];
  reviewedAt: string;
}

export interface KnowledgeFabricCertificate {
  id: string;
  reviewReportId: string;
  status: "certified";
  score: number;
  certifiedBy: string;
  approvedBy: string;
  scope: string[];
  issuedAt: string;
}