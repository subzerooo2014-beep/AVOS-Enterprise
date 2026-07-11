export interface SignedRecordVerification {
  valid: boolean;
  checksumValid: boolean;
  signatureValid: boolean;
  recordId: string;
  recordType:
    | "compliance_snapshot"
    | "evidence_package";
  checkedAt: string;
}
