import { Inject, Injectable } from '@nestjs/common';
import { PlatformRegistration } from '../domain/certification.types';
import { RegisterPlatformDto } from '../dto/register-platform.dto';
import { EVIDENCE_REPOSITORY } from '../tokens';
import { EvidenceRepositoryPort } from '../ports/evidence-repository.port';

@Injectable()
export class PlatformRegistryService {
  constructor(
    @Inject(EVIDENCE_REPOSITORY)
    private readonly repository: EvidenceRepositoryPort,
  ) {}

  async register(dto: RegisterPlatformDto): Promise<PlatformRegistration> {
    const registration: PlatformRegistration = {
      platformId: dto.platformId,
      displayName: dto.displayName,
      version: dto.version,
      owner: dto.owner,
      adapterType: dto.adapterType,
      registeredAt: new Date().toISOString(),
    };

    await this.repository.registerPlatform(registration);
    return registration;
  }

  async list(): Promise<PlatformRegistration[]> {
    return this.repository.listPlatforms();
  }
}
