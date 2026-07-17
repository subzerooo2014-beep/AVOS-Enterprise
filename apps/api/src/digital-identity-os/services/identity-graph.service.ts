import { BadRequestException, Injectable } from "@nestjs/common";
import { IdentityRelationship } from "../contracts/digital-identity.contracts";
import { LinkIdentityDto } from "../dto/digital-identity.dto";
import { IdentityAuditService } from "./identity-audit.service";
import { IdentityRegistryService } from "./identity-registry.service";

@Injectable()
export class IdentityGraphService {
  private readonly relationships: IdentityRelationship[] = [];

  constructor(private readonly registry: IdentityRegistryService, private readonly audit: IdentityAuditService) {}

  link(dto: LinkIdentityDto): IdentityRelationship {
    if (dto.sourceIdentityId === dto.targetIdentityId) throw new BadRequestException("An identity cannot link to itself");
    this.registry.get(dto.sourceIdentityId);
    this.registry.get(dto.targetIdentityId);
    const existing = this.relationships.find((item) => item.sourceIdentityId === dto.sourceIdentityId && item.targetIdentityId === dto.targetIdentityId && item.type === dto.type);
    if (existing) return existing;
    const relationship: IdentityRelationship = {
      id: `identity-link:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      sourceIdentityId: dto.sourceIdentityId,
      targetIdentityId: dto.targetIdentityId,
      type: dto.type.trim() || "related-to",
      strength: Math.max(0, Math.min(dto.strength ?? 0.5, 1)),
      metadata: { ...(dto.metadata ?? {}) },
      createdAt: new Date().toISOString(),
    };
    this.relationships.unshift(relationship);
    this.audit.record({ identityId: dto.sourceIdentityId, action: "identity.link", actor: "system", outcome: "recorded", details: { targetIdentityId: dto.targetIdentityId, type: relationship.type } });
    return relationship;
  }

  list(identityId?: string): readonly IdentityRelationship[] {
    if (!identityId) return [...this.relationships];
    this.registry.get(identityId);
    return this.relationships.filter((item) => item.sourceIdentityId === identityId || item.targetIdentityId === identityId);
  }

  count(): number { return this.relationships.length; }
}
