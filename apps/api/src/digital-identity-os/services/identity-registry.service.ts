import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  DigitalDnaProfile,
  DigitalIdentityRecord,
  IdentityKind,
} from "../contracts/digital-identity.contracts";
import { RegisterIdentityDto, UpdateIdentityDto } from "../dto/digital-identity.dto";
import { IdentityAuditService } from "./identity-audit.service";

@Injectable()
export class IdentityRegistryService {
  private readonly identities = new Map<string, DigitalIdentityRecord>();
  private sequence = 0;

  constructor(private readonly audit: IdentityAuditService) {
    this.seedSystemIdentities();
  }

  register(dto: RegisterIdentityDto): DigitalIdentityRecord {
    const displayName = dto.displayName?.trim();
    if (!displayName) throw new BadRequestException("displayName is required");
    if (!dto.kind) throw new BadRequestException("kind is required");

    const duplicate = this.findDuplicate(dto.kind, displayName, dto.externalReference);
    if (duplicate) {
      throw new BadRequestException(`Duplicate identity candidate: ${duplicate.id}`);
    }

    const now = new Date().toISOString();
    const id = `identity:${dto.kind}:${Date.now()}:${++this.sequence}`;
    const record: DigitalIdentityRecord = {
      id,
      universalId: this.createUniversalId(dto.kind),
      kind: dto.kind,
      displayName,
      description: dto.description?.trim(),
      externalReference: dto.externalReference?.trim(),
      ownerIdentityId: dto.ownerIdentityId,
      status: "active",
      verificationStatus: "unverified",
      trustLevel: "unknown",
      trustScore: 20,
      version: 1,
      tags: [...new Set(dto.tags ?? [])],
      metadata: { ...(dto.metadata ?? {}) },
      dna: this.buildDna(dto),
      createdAt: now,
      updatedAt: now,
    };
    this.identities.set(id, record);
    this.audit.record({ identityId: id, action: "identity.register", actor: "system", outcome: "recorded", details: { kind: dto.kind } });
    return record;
  }

  update(id: string, dto: UpdateIdentityDto): DigitalIdentityRecord {
    const current = this.get(id);
    const updated: DigitalIdentityRecord = {
      ...current,
      displayName: dto.displayName?.trim() || current.displayName,
      description: dto.description === undefined ? current.description : dto.description.trim(),
      tags: dto.tags ? [...new Set(dto.tags)] : current.tags,
      metadata: dto.metadata ? { ...current.metadata, ...dto.metadata } : current.metadata,
      trustLevel: dto.trustLevel ?? current.trustLevel,
      version: current.version + 1,
      dna: {
        ...current.dna,
        evolutionHistory: [...current.dna.evolutionHistory, `Updated to version ${current.version + 1} at ${new Date().toISOString()}`],
      },
      updatedAt: new Date().toISOString(),
    };
    this.identities.set(id, updated);
    this.audit.record({ identityId: id, action: "identity.update", actor: "system", outcome: "recorded", details: { version: updated.version } });
    return updated;
  }

  get(id: string): DigitalIdentityRecord {
    const identity = this.identities.get(id);
    if (!identity) throw new NotFoundException(`Identity not found: ${id}`);
    return identity;
  }

  resolve(reference: string): DigitalIdentityRecord {
    const normalized = reference.trim().toLowerCase();
    const match = [...this.identities.values()].find((item) =>
      item.id.toLowerCase() === normalized ||
      item.universalId.toLowerCase() === normalized ||
      item.externalReference?.toLowerCase() === normalized,
    );
    if (!match) throw new NotFoundException(`Identity could not be resolved: ${reference}`);
    return match;
  }

  search(query = "", kind?: IdentityKind): readonly DigitalIdentityRecord[] {
    const normalized = query.trim().toLowerCase();
    return [...this.identities.values()]
      .filter((item) => !kind || item.kind === kind)
      .filter((item) => !normalized || [item.id, item.universalId, item.displayName, item.description ?? "", item.externalReference ?? "", ...item.tags]
        .some((value) => value.toLowerCase().includes(normalized)))
      .sort((a: DigitalIdentityRecord, b: DigitalIdentityRecord) => b.updatedAt.localeCompare(a.updatedAt));
  }

  list(): readonly DigitalIdentityRecord[] {
    return this.search();
  }

  save(record: DigitalIdentityRecord): DigitalIdentityRecord {
    this.identities.set(record.id, record);
    return record;
  }

  findDuplicate(kind: IdentityKind, displayName: string, externalReference?: string): DigitalIdentityRecord | undefined {
    const name = displayName.trim().toLowerCase();
    const external = externalReference?.trim().toLowerCase();
    return [...this.identities.values()].find((item) =>
      item.status !== "merged" && item.kind === kind &&
      (item.displayName.toLowerCase() === name || (!!external && item.externalReference?.toLowerCase() === external)),
    );
  }

  private createUniversalId(kind: IdentityKind): string {
    return `AVOS-${kind.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-${Date.now()}-${this.sequence.toString().padStart(6, "0")}`;
  }

  private buildDna(dto: RegisterIdentityDto): DigitalDnaProfile {
    return {
      purpose: dto.purpose?.trim() || `Represent ${dto.displayName} inside AVOS`,
      capabilities: [...new Set(dto.capabilities ?? [])],
      policies: [...new Set(dto.policies ?? [])],
      permissions: [...new Set(dto.permissions ?? [])],
      dependencies: [...new Set(dto.dependencies ?? [])],
      contracts: [...new Set(dto.contracts ?? [])],
      provenance: [...new Set(dto.provenance ?? ["AVOS Digital Identity OS"])],
      evolutionHistory: [`Created at ${new Date().toISOString()}`],
    };
  }

  private seedSystemIdentities(): void {
    const seeds: Array<{ kind: IdentityKind; displayName: string; purpose: string }> = [
      { kind: "organization", displayName: "AVOS Enterprise", purpose: "Root organizational identity" },
      { kind: "agent", displayName: "AVOS Identity Guardian", purpose: "Govern digital identity integrity" },
      { kind: "capability", displayName: "Digital Identity OS", purpose: "Provide universal identity and Digital DNA" },
    ];
    for (const seed of seeds) this.register(seed);
  }
}
