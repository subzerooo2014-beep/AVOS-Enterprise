import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EnterpriseMetadataRecord } from "../contracts/enterprise-metadata.contracts";
import { RegisterMetadataDto, UpdateMetadataDto } from "../dto/enterprise-metadata.dto";

@Injectable()
export class MetadataRegistryService {
  private readonly records = new Map<string, EnterpriseMetadataRecord>();
  private sequence = 0;

  constructor() {
    this.seed("avos-enterprise", "product", "AVOS Enterprise", "Canonical enterprise platform metadata");
    this.seed("enterprise-kernel", "module", "AVOS Enterprise Kernel", "Operational platform core");
    this.seed("digital-identity-os", "capability", "AVOS Digital Identity OS", "Universal identity and Digital DNA");
  }

  private seed(key: string, assetType: RegisterMetadataDto["assetType"], name: string, description: string): void {
    this.register({ key, assetType, name, description, version: "1.0.0", owner: "AVOS Enterprise", tags: ["core", "foundation"] });
  }

  register(input: RegisterMetadataDto): EnterpriseMetadataRecord {
    const key = input.key.trim().toLowerCase();
    if (!key || !input.name?.trim()) throw new BadRequestException("key and name are required");
    if ([...this.records.values()].some((item) => item.key === key)) throw new BadRequestException(`Metadata key already exists: ${key}`);
    const now = new Date().toISOString();
    const record: EnterpriseMetadataRecord = {
      id: `metadata:${Date.now()}:${++this.sequence}`,
      key,
      assetType: input.assetType,
      name: input.name.trim(),
      description: input.description,
      version: input.version ?? "1.0.0",
      status: input.status ?? "active",
      owner: input.owner,
      tags: [...(input.tags ?? [])],
      attributes: { ...(input.attributes ?? {}) },
      lineage: [...(input.lineage ?? [])],
      createdAt: now,
      updatedAt: now,
    };
    this.records.set(record.id, record);
    return record;
  }

  list(): readonly EnterpriseMetadataRecord[] { return [...this.records.values()].sort((a, b) => a.name.localeCompare(b.name)); }
  get(id: string): EnterpriseMetadataRecord { const item = this.records.get(id); if (!item) throw new NotFoundException(`Metadata asset not found: ${id}`); return item; }
  findByKey(key: string): EnterpriseMetadataRecord | undefined { return [...this.records.values()].find((item) => item.key === key.trim().toLowerCase()); }

  update(id: string, input: UpdateMetadataDto): EnterpriseMetadataRecord {
    const current = this.get(id);
    const updated: EnterpriseMetadataRecord = {
      ...current,
      name: input.name?.trim() || current.name,
      description: input.description ?? current.description,
      version: input.version ?? current.version,
      status: input.status ?? current.status,
      owner: input.owner ?? current.owner,
      tags: input.tags ? [...input.tags] : current.tags,
      attributes: input.attributes ? { ...input.attributes } : current.attributes,
      lineage: input.lineage ? [...input.lineage] : current.lineage,
      updatedAt: new Date().toISOString(),
    };
    this.records.set(id, updated);
    return updated;
  }
}
