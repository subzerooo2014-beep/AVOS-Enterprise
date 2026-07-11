export interface AuditIntegrityResult {
  valid: boolean;
  totalEvents: number;
  verifiedEvents: number;
  invalidSequence?: number;
  expectedHash?: string;
  actualHash?: string;
  checkedAt: string;
}
