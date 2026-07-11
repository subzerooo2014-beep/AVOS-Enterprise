export interface GovernanceIntegrityScanResult {
  status: "healthy" | "warning" | "compromised";
  scope: "all" | "audit" | "policies";
  audit: {
    total: number;
    verified: number;
    hashChainValid: boolean;
    signaturesValid: boolean;
    unsignedRecords: number;
  };
  policies: {
    total: number;
    verified: number;
    checksumsValid: boolean;
    signaturesValid: boolean;
    unsignedRecords: number;
  };
  compromised?: {
    recordType: "audit" | "policy";
    recordId: string;
    sequence?: number;
    reason: string;
  };
  startedAt: string;
  completedAt: string;
}
