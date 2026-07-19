import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateDocumentationRecordDto } from "../dto/create-documentation-record.dto";
import { UpdateDocumentationRecordDto } from "../dto/update-documentation-record.dto";
import { AvosDocumentRecord } from "../interfaces/documentation.types";

@Injectable()
export class DocumentationRegistryService {
  private readonly records = new Map<string, AvosDocumentRecord>();

  constructor() {
    this.seedFoundationDocuments();
  }

  list(): AvosDocumentRecord[] {
    return Array.from(this.records.values()).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
  }

  findById(id: string): AvosDocumentRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`Documentation record '${id}' was not found.`);
    }
    return record;
  }

  create(dto: CreateDocumentationRecordDto): AvosDocumentRecord {
    const id = dto.id?.trim() || this.generateId(dto.category);
    if (this.records.has(id)) {
      throw new ConflictException(`Documentation record '${id}' already exists.`);
    }

    const now = new Date().toISOString();
    const record: AvosDocumentRecord = {
      id,
      title: dto.title.trim(),
      version: dto.version?.trim() || "1.0.0",
      status: dto.status || "draft",
      category: dto.category,
      classification: dto.classification?.trim() || "internal",
      authority: dto.authority?.trim() || "AVOS Constitutional Foundation",
      owner: dto.owner.trim(),
      approver: dto.approver?.trim(),
      appliesTo: dto.appliesTo || [],
      dependsOn: dto.dependsOn || [],
      relatedDocuments: dto.relatedDocuments || [],
      filePath: dto.filePath?.trim(),
      checksum: dto.checksum?.trim(),
      createdAt: now,
      updatedAt: now,
      approvedAt: dto.status === "approved" || dto.status === "active" ? now : undefined,
      metadata: dto.metadata || {},
    };

    this.records.set(id, record);
    return record;
  }

  update(id: string, dto: UpdateDocumentationRecordDto): AvosDocumentRecord {
    const current = this.findById(id);
    const now = new Date().toISOString();
    const nextStatus = dto.status ?? current.status;

    const updated: AvosDocumentRecord = {
      ...current,
      ...dto,
      title: dto.title?.trim() ?? current.title,
      version: dto.version?.trim() ?? current.version,
      classification: dto.classification?.trim() ?? current.classification,
      authority: dto.authority?.trim() ?? current.authority,
      owner: dto.owner?.trim() ?? current.owner,
      approver: dto.approver?.trim() ?? current.approver,
      filePath: dto.filePath?.trim() ?? current.filePath,
      checksum: dto.checksum?.trim() ?? current.checksum,
      status: nextStatus,
      updatedAt: now,
      approvedAt:
        (nextStatus === "approved" || nextStatus === "active") &&
        !current.approvedAt
          ? now
          : current.approvedAt,
      metadata: {
        ...current.metadata,
        ...(dto.metadata || {}),
      },
    };

    this.records.set(id, updated);
    return updated;
  }

  search(query: string): AvosDocumentRecord[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return this.list();
    }

    return this.list().filter((record) => {
      const searchable = [
        record.id,
        record.title,
        record.version,
        record.status,
        record.category,
        record.authority,
        record.owner,
        ...record.appliesTo,
        ...record.dependsOn,
        ...record.relatedDocuments,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalized);
    });
  }

  private generateId(category: string): string {
    const prefix = category.toUpperCase().replace(/[^A-Z0-9]/g, "-");
    const count = this.list().filter((item) => item.category === category).length + 1;
    return `AVOS-${prefix}-${String(count).padStart(3, "0")}`;
  }

  private seedFoundationDocuments(): void {
    const seed: CreateDocumentationRecordDto[] = [
      {
        id: "AVOS-CONST-001",
        title: "AVOS Constitution",
        version: "1.0.0",
        status: "active",
        category: "constitution",
        classification: "internal",
        authority: "AVOS Constitutional Foundation",
        owner: "AVOS Foundation",
        approver: "human:khalifa",
        appliesTo: ["Entire AVOS Platform"],
        filePath: "docs/constitution/AVOS-Constitution.md",
        metadata: { foundational: true },
      },
      {
        id: "AVOS-GOV-001",
        title: "AVOS Lifecycle and Evolution Governance",
        version: "1.0.0",
        status: "active",
        category: "governance",
        classification: "internal",
        authority: "AVOS Constitutional Foundation",
        owner: "AVOS Foundation",
        approver: "human:khalifa",
        appliesTo: ["Entire AVOS Platform"],
        dependsOn: ["AVOS-CONST-001"],
        filePath:
          "docs/governance/AVOS-Lifecycle-and-Evolution-Governance.md",
        metadata: { foundational: true },
      },
      {
        id: "AVOS-STD-ACDS-001",
        title: "AVOS Constitutional Documentation Standard",
        version: "1.0.0",
        status: "active",
        category: "standard",
        classification: "internal",
        authority: "AVOS Constitutional Foundation",
        owner: "AVOS Documentation Framework",
        approver: "human:khalifa",
        appliesTo: ["All AVOS constitutional documents"],
        dependsOn: ["AVOS-CONST-001"],
        filePath:
          "docs/templates/AVOS-Constitutional-Document-Template.md",
        metadata: { foundational: true, standardCode: "ACDS" },
      },
    ];

    for (const item of seed) {
      this.create(item);
    }
  }
}
