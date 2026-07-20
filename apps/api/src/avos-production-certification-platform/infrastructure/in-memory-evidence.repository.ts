import { Injectable } from '@nestjs/common';
import {
  CertificationRecord,
  EvidenceManifest,
  PlatformRegistration,
  ProductionEvidence,
} from '../domain/certification.types';
import { EvidenceRepositoryPort } from '../ports/evidence-repository.port';

@Injectable()
export class InMemoryEvidenceRepository implements EvidenceRepositoryPort {
  private readonly evidence = new Map<string, ProductionEvidence[]>();
  private readonly manifests = new Map<string, EvidenceManifest>();
  private readonly certifications = new Map<string, CertificationRecord>();
  private readonly platforms = new Map<string, PlatformRegistration>();

  async saveEvidence(items: ProductionEvidence[]): Promise<void> {
    for (const item of items) {
      const existing = this.evidence.get(item.platformId) ?? [];
      const withoutSameDomain = existing.filter((candidate) => candidate.domain !== item.domain);
      this.evidence.set(item.platformId, [...withoutSameDomain, item]);
    }
  }

  async getEvidence(platformId: string): Promise<ProductionEvidence[]> {
    return [...(this.evidence.get(platformId) ?? [])];
  }

  async saveManifest(manifest: EvidenceManifest): Promise<void> {
    this.manifests.set(manifest.id, manifest);
  }

  async getManifest(manifestId: string): Promise<EvidenceManifest | undefined> {
    return this.manifests.get(manifestId);
  }

  async saveCertification(record: CertificationRecord): Promise<void> {
    this.certifications.set(record.platformId, record);
  }

  async getLatestCertification(platformId: string): Promise<CertificationRecord | undefined> {
    return this.certifications.get(platformId);
  }

  async registerPlatform(registration: PlatformRegistration): Promise<void> {
    this.platforms.set(registration.platformId, registration);
  }

  async getPlatform(platformId: string): Promise<PlatformRegistration | undefined> {
    return this.platforms.get(platformId);
  }

  async listPlatforms(): Promise<PlatformRegistration[]> {
    return [...this.platforms.values()];
  }
}
