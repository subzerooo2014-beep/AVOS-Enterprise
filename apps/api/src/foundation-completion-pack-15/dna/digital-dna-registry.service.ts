import { createHash } from "crypto";
import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  DigitalDnaRecord,
  DigitalDnaStatus
} from "../foundation-pack-15.types";
import { DigitalDnaAuditService } from "../observability/digital-dna-audit.service";

@Injectable()
export class DigitalDnaRegistryService {
  private readonly records =
    new Map<string, DigitalDnaRecord>();

  constructor(
    private readonly audit: DigitalDnaAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        `Digital DNA record not found: ${id}`
      );
    }

    return record;
  }

  register(input: {
    id?: string;
    identity: DigitalDnaRecord["identity"];
    purpose: DigitalDnaRecord["purpose"];
    contracts?: DigitalDnaRecord["contracts"];
    dependencies?: DigitalDnaRecord["dependencies"];
    policies?: DigitalDnaRecord["policies"];
    permissions?: DigitalDnaRecord["permissions"];
    events?: string[];
    metrics?: DigitalDnaRecord["metrics"];
    version: string;
    status?: DigitalDnaStatus;
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const now = new Date().toISOString();

    const draft: Omit<DigitalDnaRecord, "checksum"> = {
      id:
        input.id ??
        `digital-dna:${input.identity.assetType}:${this.slug(
          input.identity.canonicalName
        )}`,
      identity: {
        ...input.identity
      },
      purpose: {
        ...input.purpose,
        valueCreated: Array.from(
          new Set(input.purpose.valueCreated)
        ),
        intendedUsers: Array.from(
          new Set(input.purpose.intendedUsers)
        ),
        strategicAlignment: Array.from(
          new Set(input.purpose.strategicAlignment)
        )
      },
      contracts: (input.contracts ?? []).map((contract) => ({
        ...contract,
        consumerIdentityIds: Array.from(
          new Set(contract.consumerIdentityIds)
        ),
        guarantees: Array.from(new Set(contract.guarantees)),
        constraints: Array.from(new Set(contract.constraints))
      })),
      dependencies: input.dependencies ?? [],
      policies: input.policies ?? [],
      permissions: (input.permissions ?? []).map(
        (permission) => ({
          ...permission,
          actions: Array.from(new Set(permission.actions))
        })
      ),
      events: Array.from(new Set(input.events ?? [])),
      metrics: input.metrics ?? [],
      version: input.version,
      status: input.status ?? "draft",
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    const record: DigitalDnaRecord = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "dna",
      action: "digital-dna-registered",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        assetType: record.identity.assetType,
        version: record.version,
        status: record.status
      }
    });

    return record;
  }

  update(
    id: string,
    patch: {
      purpose?: DigitalDnaRecord["purpose"];
      contracts?: DigitalDnaRecord["contracts"];
      dependencies?: DigitalDnaRecord["dependencies"];
      policies?: DigitalDnaRecord["policies"];
      permissions?: DigitalDnaRecord["permissions"];
      events?: string[];
      metrics?: DigitalDnaRecord["metrics"];
      version?: string;
      status?: DigitalDnaStatus;
      metadata?: Record<string, unknown>;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const draft: Omit<DigitalDnaRecord, "checksum"> = {
      ...current,
      ...patch,
      purpose:
        patch.purpose === undefined
          ? current.purpose
          : {
              ...patch.purpose,
              valueCreated: Array.from(
                new Set(patch.purpose.valueCreated)
              ),
              intendedUsers: Array.from(
                new Set(patch.purpose.intendedUsers)
              ),
              strategicAlignment: Array.from(
                new Set(patch.purpose.strategicAlignment)
              )
            },
      contracts:
        patch.contracts === undefined
          ? current.contracts
          : patch.contracts.map((contract) => ({
              ...contract,
              consumerIdentityIds: Array.from(
                new Set(contract.consumerIdentityIds)
              ),
              guarantees: Array.from(
                new Set(contract.guarantees)
              ),
              constraints: Array.from(
                new Set(contract.constraints)
              )
            })),
      events:
        patch.events === undefined
          ? current.events
          : Array.from(new Set(patch.events)),
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    const updated: DigitalDnaRecord = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.records.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "dna",
      action: "digital-dna-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        previousVersion: current.version,
        nextVersion: updated.version
      }
    });

    return updated;
  }

  byAssetType(assetType: DigitalDnaRecord["identity"]["assetType"]) {
    return this.list().filter(
      (record) =>
        record.identity.assetType === assetType
    );
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      active: records.filter(
        (record) => record.status === "active"
      ).length,
      capabilities: records.filter(
        (record) =>
          record.identity.assetType === "capability"
      ).length,
      products: records.filter(
        (record) =>
          record.identity.assetType === "product"
      ).length,
      workflows: records.filter(
        (record) =>
          record.identity.assetType === "workflow"
      ).length,
      agents: records.filter(
        (record) =>
          record.identity.assetType === "agent"
      ).length
    };
  }

  recalculateChecksum(id: string) {
    const current = this.get(id);
    const {
      checksum,
      ...withoutChecksum
    } = current;

    const updated: DigitalDnaRecord = {
      ...withoutChecksum,
      checksum: this.checksum(withoutChecksum)
    };

    this.records.set(id, updated);
    return updated;
  }

  private checksum(value: unknown) {
    return createHash("sha256")
      .update(JSON.stringify(value))
      .digest("hex");
  }

  private slug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
