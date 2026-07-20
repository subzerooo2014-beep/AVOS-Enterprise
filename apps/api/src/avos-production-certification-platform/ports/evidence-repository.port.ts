import {
  CertificationRecord,
  EvidenceManifest,
  PlatformRegistration,
  ProductionEvidence,
} from '../domain/certification.types';

export interface EvidenceRepositoryPort {
  saveEvidence(items: ProductionEvidence[]): Promise<void>;
  getEvidence(platformId: string): Promise<ProductionEvidence[]>;
  saveManifest(manifest: EvidenceManifest): Promise<void>;
  getManifest(manifestId: string): Promise<EvidenceManifest | undefined>;
  saveCertification(record: CertificationRecord): Promise<void>;
  getLatestCertification(platformId: string): Promise<CertificationRecord | undefined>;
  registerPlatform(registration: PlatformRegistration): Promise<void>;
  getPlatform(platformId: string): Promise<PlatformRegistration | undefined>;
  listPlatforms(): Promise<PlatformRegistration[]>;
}
