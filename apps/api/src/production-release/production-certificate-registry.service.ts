import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductionCertificateRegistryService {
  private readonly certificates = new Map<
    string,
    {
      id: string;
      releaseVersion: string;
      score: number;
      status: string;
      issuedAt: string;
    }
  >();

  register(input: {
    id: string;
    releaseVersion: string;
    score: number;
    status: string;
  }) {
    const certificate = {
      ...input,
      issuedAt: new Date().toISOString(),
    };

    this.certificates.set(input.releaseVersion, certificate);
    return { ...certificate };
  }

  get(releaseVersion: string) {
    const certificate = this.certificates.get(releaseVersion);
    return certificate ? { ...certificate } : null;
  }
}