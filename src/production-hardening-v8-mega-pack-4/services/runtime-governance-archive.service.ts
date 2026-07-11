import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceArchive,
  GovernanceArchiveStatus,
  GovernanceArchiveType,
  GovernanceArchiveVerification,
  GovernanceSnapshotSection,
  GovernanceSnapshotScope,
} from "../contracts";
import {
  CreateGovernanceArchiveDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  governanceSha256Json,
} from "../utils";
import {
  RuntimeGovernanceCheckpointService,
} from "./runtime-governance-checkpoint.service";
import {
  RuntimeGovernanceSnapshotBuilderService,
} from "./runtime-governance-snapshot-builder.service";

@Injectable()
export class RuntimeGovernanceArchiveService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly checkpoints:
      RuntimeGovernanceCheckpointService,
    private readonly snapshots:
      RuntimeGovernanceSnapshotBuilderService,
  ) {}

  create(
    dto:
      CreateGovernanceArchiveDto,
  ): GovernanceArchive {
    let sections:
      GovernanceSnapshotSection[] = [];

    if (
      dto.checkpointId
    ) {
      const checkpoint =
        this.checkpoints.get(
          dto.checkpointId,
        );

      sections =
        checkpoint.sections;

      if (
        checkpoint.status ===
          "invalid" ||
        checkpoint.status ===
          "deleted"
      ) {
        throw new BadRequestException(
          "Archive cannot be created from invalid checkpoint",
        );
      }
    } else {
      sections =
        this.resolveArchiveSections(
          dto.type,
        );
    }

    const now =
      new Date().toISOString();

    const archive:
      GovernanceArchive = {
      id:
        randomUUID(),
      archiveNumber:
        this.nextArchiveNumber(),
      type:
        dto.type,
      status:
        GovernanceArchiveStatus.READY,
      name:
        dto.name,
      description:
        dto.description,
      classification:
        dto.classification,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      sourceResourceIds:
        dto.sourceResourceIds ?? [],
      checkpointId:
        dto.checkpointId,
      sections,
      recordCount:
        sections.reduce(
          (
            total,
            section,
          ) =>
            total +
            section.count,
          0,
        ),
      rootChecksum:
        this.snapshots
          .rootChecksum(
            sections,
          ),
      compressed:
        dto.compressed,
      encrypted:
        dto.encrypted,
      immutable:
        dto.immutable,
      retentionPolicyId:
        dto.retentionPolicyId,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          import("../contracts").GovernanceJsonValue
        >,
      createdBy:
        dto.actor,
      createdAt:
        now,
      readyAt:
        now,
      expiresAt:
        dto.expiresAt,
    };

    return this.store
      .saveGovernanceArchive(
        archive,
      );
  }

  verify(
    id: string,
  ): GovernanceArchiveVerification {
    const archive =
      this.get(id);

    const invalidSections:
      string[] = [];

    for (
      const section of
      archive.sections
    ) {
      const actualChecksum =
        governanceSha256Json(
          section.data,
        );

      if (
        actualChecksum !==
        section.checksum
      ) {
        invalidSections.push(
          section.key,
        );
      }
    }

    const actualRootChecksum =
      this.snapshots.rootChecksum(
        archive.sections,
      );

    const valid =
      invalidSections.length === 0 &&
      actualRootChecksum ===
        archive.rootChecksum;

    archive.status =
      valid
        ? GovernanceArchiveStatus.VERIFIED
        : GovernanceArchiveStatus.FAILED;

    archive.verifiedAt =
      new Date().toISOString();

    archive.error =
      valid
        ? undefined
        : `Invalid archive sections: ${invalidSections.join(", ")}`;

    this.store
      .saveGovernanceArchive(
        archive,
      );

    return {
      archiveId:
        archive.id,
      valid,
      recordCount:
        archive.recordCount,
      checkedSections:
        archive.sections.length,
      invalidSections,
      expectedRootChecksum:
        archive.rootChecksum,
      actualRootChecksum,
      verifiedAt:
        archive.verifiedAt,
    };
  }

  list():
    GovernanceArchive[] {
    return this.store
      .listGovernanceArchives();
  }

  get(
    id: string,
  ): GovernanceArchive {
    const archive =
      this.store
        .getGovernanceArchive(id);

    if (!archive) {
      throw new NotFoundException(
        `Governance archive ${id} was not found`,
      );
    }

    return archive;
  }

  private resolveArchiveSections(
    type:
      GovernanceArchiveType,
  ): GovernanceSnapshotSection[] {
    switch (type) {
      case GovernanceArchiveType.AUDIT:
        return [
          this.section(
            "auditEntries",
            this.store
              .listAuditEntries(),
          ),
        ];

      case GovernanceArchiveType.EXECUTION_EVIDENCE:
        return [
          this.section(
            "executionEvidence",
            this.store
              .listExecutionEvidence(),
          ),
        ];

      case GovernanceArchiveType.TIMELINE:
        return [
          this.section(
            "timeline",
            this.store
              .listGovernanceTimeline(),
          ),
        ];

      case GovernanceArchiveType.REQUEST_HISTORY:
        return [
          this.section(
            "governanceRequests",
            this.store
              .listGovernanceRequests(),
          ),
        ];

      case GovernanceArchiveType.DECISION_HISTORY:
        return [
          this.section(
            "decisionRecords",
            this.store
              .listDecisionRecords(),
          ),
        ];

      case GovernanceArchiveType.OPERATIONS:
        return this.snapshots.build(
          GovernanceSnapshotScope.OPERATIONS,
        );

      case GovernanceArchiveType.CHECKPOINT:
      case GovernanceArchiveType.FULL_EXPORT:
      default:
        return this.snapshots.build(
          GovernanceSnapshotScope.FULL,
        );
    }
  }

  private section(
    key: string,
    data: unknown[],
  ): GovernanceSnapshotSection {
    return {
      key,
      count:
        data.length,
      checksum:
        governanceSha256Json(
          data,
        ),
      data:
        data as never,
    };
  }

  private nextArchiveNumber():
    string {
    const next =
      this.store
        .listGovernanceArchives()
        .length + 1;

    return `AVOS-ARC-${String(
      next,
    ).padStart(6, "0")}`;
  }
}

