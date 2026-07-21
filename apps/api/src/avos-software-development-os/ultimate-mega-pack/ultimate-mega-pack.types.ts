export interface UltimateCertificationRecord {
  id: string;
  name: string;
  version: string;
  status: 'certified' | 'rejected';
  score: number;
  approvedBy: string;
  certifiedAt: string;
  checks: Record<string, boolean>;
  domainScores: Record<string, number>;
}
