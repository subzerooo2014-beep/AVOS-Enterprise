import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeChecksumService } from "./knowledge-checksum.service";
import {
  KnowledgeRecord,
  KnowledgeRegistrySnapshot,
  RegisterKnowledgeInput,
  UpdateKnowledgeInput,
} from "./knowledge.types";
import { KnowledgeValidatorService } from "./knowledge-validator.service";

@Injectable()
export class KnowledgeRegistryService {
  private readonly records = new Map<string, KnowledgeRecord>();
  private readonly keyIndex = new Map<string, string>();

  constructor(
    private readonly checksum: KnowledgeChecksumService,
    private readonly validator: KnowledgeValidatorService,
  ) {}

  register(input: RegisterKnowledgeInput): KnowledgeRecord {
    this.validator.validateRegistration(input);

    const normalizedKey = input.key.trim().toLowerCase();
    if (this.keyIndex.has(normalizedKey)) {
      throw new ConflictException(
        `Knowledge key already exists: ${input.key}`,
      );
    }

    const id = randomUUID();
    const now = new Date().toISOString();
    const contentChecksum = this.checksum.calculate(input.content);

    const record: KnowledgeRecord = {
      dna: {
        identity: {
          id,
          key: normalizedKey,
          name: input.name.trim(),
          namespace: input.namespace?.trim() || "default",
          version: 1,
        },
        purpose: input.purpose.trim(),
        sourceType: input.sourceType,
        sourceReference: input.sourceReference,
        owners: input.owners ?? [],
        tags: input.tags ?? [],
        classification: input.classification ?? "INTERNAL",
        status: "DRAFT",
        createdAt: now,
        updatedAt: now,
        checksum: contentChecksum,
        trustScore: 50,
        provenanceScore: input.sourceReference ? 70 : 50,
        confidenceScore: 50,
      },
      metadata: {
        language: input.metadata?.language,
        region: input.metadata?.region,
        domain: input.metadata?.domain,
        capabilityIds: input.metadata?.capabilityIds ?? [],
        productIds: input.metadata?.productIds ?? [],
        policyIds: input.metadata?.policyIds ?? [],
        keywords: input.metadata?.keywords ?? [],
        custom: input.metadata?.custom ?? {},
      },
      currentContent: input.content,
      versions: [
        {
          version: 1,
          content: input.content,
          createdAt: now,
          createdBy: input.createdBy,
          reason: "Initial registration",
          checksum: contentChecksum,
        },
      ],
      relations: [],
    };

    this.records.set(id, record);
    this.keyIndex.set(normalizedKey, id);
    return structuredClone(record);
  }

  getById(id: string): KnowledgeRecord | undefined {
    const record = this.records.get(id);
    return record ? structuredClone(record) : undefined;
  }

  getByKey(key: string): KnowledgeRecord | undefined {
    const id = this.keyIndex.get(key.trim().toLowerCase());
    return id ? this.getById(id) : undefined;
  }

  list(): KnowledgeRecord[] {
    return [...this.records.values()].map((record) =>
      structuredClone(record),
    );
  }

  update(id: string, input: UpdateKnowledgeInput): KnowledgeRecord {
    this.validator.validateUpdate(input);
    const record = this.require(id);

    const nextVersion = record.dna.identity.version + 1;
    const now = new Date().toISOString();
    const contentChecksum = this.checksum.calculate(input.content);

    record.currentContent = input.content;
    record.dna.identity.version = nextVersion;
    record.dna.updatedAt = now;
    record.dna.checksum = contentChecksum;

    if (input.tags) {
      record.dna.tags = [...input.tags];
    }

    if (input.classification) {
      record.dna.classification = input.classification;
    }

    if (input.metadata) {
      record.metadata = {
        ...record.metadata,
        ...input.metadata,
        capabilityIds:
          input.metadata.capabilityIds ?? record.metadata.capabilityIds,
        productIds: input.metadata.productIds ?? record.metadata.productIds,
        policyIds: input.metadata.policyIds ?? record.metadata.policyIds,
        keywords: input.metadata.keywords ?? record.metadata.keywords,
        custom: input.metadata.custom ?? record.metadata.custom,
      };
    }

    record.versions.push({
      version: nextVersion,
      content: input.content,
      createdAt: now,
      createdBy: input.updatedBy,
      reason: input.reason,
      checksum: contentChecksum,
    });

    return structuredClone(record);
  }

  activate(id: string): KnowledgeRecord {
    const record = this.require(id);
    record.dna.status = "ACTIVE";
    record.dna.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  deprecate(id: string): KnowledgeRecord {
    const record = this.require(id);
    record.dna.status = "DEPRECATED";
    record.dna.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): KnowledgeRecord {
    const record = this.require(id);
    record.dna.status = "ARCHIVED";
    record.dna.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  replaceRecord(record: KnowledgeRecord): void {
    const id = record.dna.identity.id;
    this.records.set(id, structuredClone(record));
    this.keyIndex.set(record.dna.identity.key, id);
  }

  snapshot(): KnowledgeRegistrySnapshot {
    const records = [...this.records.values()];

    return {
      total: records.length,
      active: records.filter((record) => record.dna.status === "ACTIVE").length,
      draft: records.filter((record) => record.dna.status === "DRAFT").length,
      deprecated: records.filter(
        (record) => record.dna.status === "DEPRECATED",
      ).length,
      archived: records.filter(
        (record) => record.dna.status === "ARCHIVED",
      ).length,
      relations: records.reduce(
        (total, record) => total + record.relations.length,
        0,
      ),
      versions: records.reduce(
        (total, record) => total + record.versions.length,
        0,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private require(id: string): KnowledgeRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`Knowledge record not found: ${id}`);
    }
    return record;
  }
}