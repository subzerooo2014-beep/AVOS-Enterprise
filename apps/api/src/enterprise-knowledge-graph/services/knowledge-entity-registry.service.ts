import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { KnowledgeEntity } from "../contracts/enterprise-knowledge-graph.contracts";
import {
  CreateKnowledgeEntityDto,
  KnowledgeSearchDto,
  UpdateKnowledgeEntityDto,
} from "../dto/enterprise-knowledge-graph.dto";

@Injectable()
export class KnowledgeEntityRegistryService {
  private readonly entities = new Map<string, KnowledgeEntity>();
  private sequence = 0;

  constructor() {
    this.seed();
  }

  create(input: CreateKnowledgeEntityDto): KnowledgeEntity {
    const key = input.key?.trim().toLowerCase();
    if (!key || !input.name?.trim()) {
      throw new BadRequestException("key and name are required");
    }

    if ([...this.entities.values()].some((entity) => entity.key === key)) {
      throw new BadRequestException(`Knowledge entity key already exists: ${key}`);
    }

    const trustScore = input.trustScore ?? 100;
    if (trustScore < 0 || trustScore > 100) {
      throw new BadRequestException("trustScore must be between 0 and 100");
    }

    const now = new Date().toISOString();
    const entity: KnowledgeEntity = {
      id: `knowledge-entity:${Date.now()}:${++this.sequence}`,
      key,
      name: input.name.trim(),
      type: input.type,
      status: input.status ?? "active",
      description: input.description ?? "",
      layer: input.layer ?? "knowledge",
      owner: input.owner ?? "AVOS Enterprise",
      tags: [...(input.tags ?? [])],
      attributes: { ...(input.attributes ?? {}) },
      provenance: {
        source: "AVOS Enterprise",
        registeredBy: "enterprise-knowledge-graph",
        ...(input.provenance ?? {}),
      },
      trustScore,
      version: input.version ?? "1.0.0",
      createdAt: now,
      updatedAt: now,
    };

    this.entities.set(entity.id, entity);
    return entity;
  }

  update(id: string, input: UpdateKnowledgeEntityDto): KnowledgeEntity {
    const current = this.get(id);
    const trustScore = input.trustScore ?? current.trustScore;
    if (trustScore < 0 || trustScore > 100) {
      throw new BadRequestException("trustScore must be between 0 and 100");
    }

    const updated: KnowledgeEntity = {
      ...current,
      name: input.name?.trim() || current.name,
      status: input.status ?? current.status,
      description: input.description ?? current.description,
      layer: input.layer ?? current.layer,
      owner: input.owner ?? current.owner,
      tags: input.tags ? [...input.tags] : current.tags,
      attributes: { ...current.attributes, ...(input.attributes ?? {}) },
      provenance: { ...current.provenance, ...(input.provenance ?? {}) },
      trustScore,
      version: input.version ?? current.version,
      updatedAt: new Date().toISOString(),
    };

    this.entities.set(id, updated);
    return updated;
  }

  get(id: string): KnowledgeEntity {
    const entity = this.entities.get(id);
    if (!entity) throw new NotFoundException(`Knowledge entity not found: ${id}`);
    return entity;
  }

  findByKey(key: string): KnowledgeEntity | undefined {
    return [...this.entities.values()].find(
      (entity) => entity.key === key.trim().toLowerCase(),
    );
  }

  list(): readonly KnowledgeEntity[] {
    return [...this.entities.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  search(input: KnowledgeSearchDto): readonly KnowledgeEntity[] {
    const query = input.query?.trim().toLowerCase();
    const tags = new Set((input.tags ?? []).map((tag) => tag.toLowerCase()));

    return this.list().filter((entity) => {
      const queryMatch =
        !query ||
        entity.key.includes(query) ||
        entity.name.toLowerCase().includes(query) ||
        entity.description.toLowerCase().includes(query) ||
        entity.tags.some((tag) => tag.toLowerCase().includes(query));

      const typeMatch = !input.types?.length || input.types.includes(entity.type);
      const tagMatch =
        tags.size === 0 ||
        [...tags].every((tag) => entity.tags.some((entityTag) => entityTag.toLowerCase() === tag));
      const trustMatch = entity.trustScore >= (input.minimumTrustScore ?? 0);

      return queryMatch && typeMatch && tagMatch && trustMatch;
    });
  }

  private seed(): void {
    this.create({
      key: "avos-enterprise",
      name: "AVOS Enterprise",
      type: "platform",
      layer: "foundation",
      description: "Canonical AVOS enterprise platform.",
      tags: ["platform", "foundation"],
      attributes: { canonical: true },
    });

    this.create({
      key: "enterprise-kernel",
      name: "AVOS Enterprise Kernel",
      type: "kernel",
      layer: "foundation",
      description: "Operational kernel for lifecycle, health, diagnostics, and orchestration.",
      tags: ["kernel", "runtime", "governance"],
    });

    this.create({
      key: "digital-identity-os",
      name: "AVOS Digital Identity OS",
      type: "capability",
      layer: "identity",
      description: "Universal digital identity and Digital DNA framework.",
      tags: ["identity", "digital-dna", "trust"],
    });

    this.create({
      key: "enterprise-metadata-graph",
      name: "AVOS Enterprise Metadata & Dependency Graph",
      type: "capability",
      layer: "metadata",
      description: "Enterprise metadata, lineage, and dependency intelligence.",
      tags: ["metadata", "dependencies", "lineage"],
      trustScore: 100,
    });

    this.create({
      key: "architecture-intelligence",
      name: "AVOS Architecture Intelligence Engine",
      type: "capability",
      layer: "architecture-intelligence",
      description: "Architecture analysis, drift detection, compatibility, and upgrade readiness.",
      tags: ["architecture", "analysis", "governance"],
    });

    this.create({
      key: "living-blueprint",
      name: "AVOS Living Blueprint",
      type: "capability",
      layer: "architecture",
      description: "Continuously synchronized architectural source of truth.",
      tags: ["blueprint", "runtime", "topology"],
    });
  }
}