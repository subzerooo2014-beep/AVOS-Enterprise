import { CertificationRecord } from '../domain/certification.types';

export interface DeploymentGatePort {
  evaluate(record: CertificationRecord): Promise<{
    allowed: boolean;
    reasons: string[];
  }>;
}
