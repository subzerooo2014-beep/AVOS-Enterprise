import { EvidenceDomain, ProductionEvidence } from '../domain/certification.types';

export interface EvidenceCollectorPort {
  collect(platformId: string, domains: EvidenceDomain[]): Promise<ProductionEvidence[]>;
}
