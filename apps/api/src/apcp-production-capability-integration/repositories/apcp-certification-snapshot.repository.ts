import { Injectable } from '@nestjs/common';
import { CertificationEvidenceSummary } from '../domain/apcp-production-capability.types';

@Injectable()
export class ApcpCertificationSnapshotRepository {
  private latest: CertificationEvidenceSummary | null = null;

  save(snapshot: CertificationEvidenceSummary): CertificationEvidenceSummary {
    this.latest = structuredClone(snapshot);
    return this.get()!;
  }

  get(): CertificationEvidenceSummary | null {
    return this.latest ? structuredClone(this.latest) : null;
  }
}