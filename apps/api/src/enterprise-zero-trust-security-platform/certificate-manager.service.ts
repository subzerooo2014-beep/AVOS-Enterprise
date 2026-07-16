import { Injectable, NotFoundException } from "@nestjs/common";
import type { CertificateRecord } from "./zero-trust-security.types";

@Injectable()
export class CertificateManagerService {
  private readonly certificates = new Map<string, CertificateRecord>();

  register(certificate: CertificateRecord): CertificateRecord {
    this.certificates.set(certificate.id, { ...certificate });
    return { ...certificate };
  }

  validate(id: string) {
    const certificate = this.certificates.get(id);
    if (!certificate) {
      throw new NotFoundException(`Certificate '${id}' was not found.`);
    }

    const now = Date.now();
    const valid =
      certificate.status === "ACTIVE" &&
      new Date(certificate.validFrom).getTime() <= now &&
      new Date(certificate.validTo).getTime() >= now;

    return {
      certificate: { ...certificate },
      valid,
      checkedAt: new Date().toISOString(),
    };
  }

  revoke(id: string): CertificateRecord {
    const certificate = this.certificates.get(id);
    if (!certificate) {
      throw new NotFoundException(`Certificate '${id}' was not found.`);
    }
    certificate.status = "REVOKED";
    return { ...certificate };
  }

  list(): CertificateRecord[] {
    return Array.from(this.certificates.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.certificates.size;
  }
}
