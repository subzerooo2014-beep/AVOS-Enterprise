import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  createHash,
  randomUUID,
} from "node:crypto";

import { PrismaService } from "../../prisma/prisma.service";

export interface PublicationVersion {
  versionId: string;
  version: number;
  contentHash: string;
  snapshot: any;
  reason: string | null;
  createdAt: string;
  source: string;
}

@Injectable()
export class PublisherVersioningService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createVersion(
    eventId: string,
    input?: {
      reason?: string;
      content?: any;
      campaign?: any;
      metadata?: any;
    },
  ) {
    const event =
      await this.event(eventId);

    const payload =
      this.objectOf(
        event.payload,
      );

    const result =
      this.objectOf(
        event.result,
      );

    const versions =
      this.versionsOf(result);

    const currentSnapshot =
      this.snapshotOf(
        payload,
        input,
      );

    const contentHash =
      this.hash(currentSnapshot);

    const duplicate =
      versions.find(
        (item) =>
          item.contentHash ===
          contentHash,
      );

    if (duplicate) {
      return {
        success: true,
        duplicate: true,
        eventId,
        version:
          duplicate.version,
        versionId:
          duplicate.versionId,
        contentHash,
        message:
          "Identical publication version already exists.",
      };
    }

    const nextVersion =
      versions.length > 0
        ? Math.max(
            ...versions.map(
              (item) =>
                item.version,
            ),
          ) + 1
        : Number(
            payload.contentVersion ??
            1,
          );

    const now =
      new Date();

    const version: PublicationVersion = {
      versionId:
        randomUUID(),
      version:
        nextVersion,
      contentHash,
      snapshot:
        currentSnapshot,
      reason:
        input?.reason?.trim() ||
        null,
      createdAt:
        now.toISOString(),
      source:
        "publisher-versioning-api",
    };

    const updated =
      await (this.prisma as any).platformEvent.update({
        where: {
          id:
            event.id,
        },

        data: {
          payload: {
            ...payload,

            content:
              currentSnapshot.content,

            campaign:
              currentSnapshot.campaign,

            metadata:
              currentSnapshot.metadata,

            contentVersion:
              nextVersion,

            activeVersionId:
              version.versionId,
          },

          result: {
            ...result,

            versions: [
              ...versions,
              version,
            ],

            activeVersion: {
              versionId:
                version.versionId,
              version:
                version.version,
              contentHash:
                version.contentHash,
              activatedAt:
                now.toISOString(),
            },
          },

          updatedAt:
            now,
        },
      });

    await this.audit(
      "PUBLICATION_VERSION_CREATED",
      event.id,
    );

    return {
      success: true,
      duplicate: false,
      eventId:
        event.id,
      version:
        version.version,
      versionId:
        version.versionId,
      contentHash:
        version.contentHash,
      activeVersion:
        updated.payload
          ?.contentVersion ??
        nextVersion,
      createdAt:
        version.createdAt,
    };
  }

  async versions(
    eventId: string,
  ) {
    const event =
      await this.event(eventId);

    const result =
      this.objectOf(
        event.result,
      );

    const versions =
      this.versionsOf(result);

    return {
      success: true,
      eventId:
        event.id,
      activeVersion:
        Number(
          event.payload
            ?.contentVersion ??
          1,
        ),
      activeVersionId:
        event.payload
          ?.activeVersionId ??
        null,
      count:
        versions.length,
      versions:
        versions.map(
          (item) => ({
            versionId:
              item.versionId,
            version:
              item.version,
            contentHash:
              item.contentHash,
            reason:
              item.reason,
            createdAt:
              item.createdAt,
            source:
              item.source,
          }),
        ),
    };
  }

  async version(
    eventId: string,
    versionNumber: number,
  ) {
    const event =
      await this.event(eventId);

    const result =
      this.objectOf(
        event.result,
      );

    const version =
      this.versionsOf(result)
        .find(
          (item) =>
            item.version ===
            versionNumber,
        );

    if (!version) {
      throw new NotFoundException(
        `Publication version ${versionNumber} was not found.`,
      );
    }

    return {
      success: true,
      eventId:
        event.id,
      version,
    };
  }

  async compare(
    eventId: string,
    leftVersion: number,
    rightVersion: number,
  ) {
    if (
      leftVersion ===
      rightVersion
    ) {
      throw new BadRequestException(
        "Versions must be different.",
      );
    }

    const event =
      await this.event(eventId);

    const versions =
      this.versionsOf(
        this.objectOf(
          event.result,
        ),
      );

    const left =
      versions.find(
        (item) =>
          item.version ===
          leftVersion,
      );

    const right =
      versions.find(
        (item) =>
          item.version ===
          rightVersion,
      );

    if (!left || !right) {
      throw new NotFoundException(
        "One or both publication versions were not found.",
      );
    }

    return {
      success: true,
      eventId:
        event.id,
      leftVersion,
      rightVersion,

      changed:
        left.contentHash !==
        right.contentHash,

      changes:
        this.diff(
          left.snapshot,
          right.snapshot,
        ),

      left: {
        versionId:
          left.versionId,
        contentHash:
          left.contentHash,
        createdAt:
          left.createdAt,
      },

      right: {
        versionId:
          right.versionId,
        contentHash:
          right.contentHash,
        createdAt:
          right.createdAt,
      },
    };
  }

  async restore(
    eventId: string,
    versionNumber: number,
    reason?: string,
  ) {
    const event =
      await this.event(eventId);

    if (
      event.status ===
      "processing"
    ) {
      throw new ConflictException(
        "Cannot restore a version while publication is processing.",
      );
    }

    const payload =
      this.objectOf(
        event.payload,
      );

    const result =
      this.objectOf(
        event.result,
      );

    const versions =
      this.versionsOf(result);

    const selected =
      versions.find(
        (item) =>
          item.version ===
          versionNumber,
      );

    if (!selected) {
      throw new NotFoundException(
        `Publication version ${versionNumber} was not found.`,
      );
    }

    const now =
      new Date();

    const restoreRecord = {
      restoreId:
        randomUUID(),
      restoredVersion:
        selected.version,
      restoredVersionId:
        selected.versionId,
      previousVersion:
        Number(
          payload.contentVersion ??
          1,
        ),
      reason:
        reason?.trim() ||
        "Publication version restored manually.",
      restoredAt:
        now.toISOString(),
      source:
        "publisher-versioning-api",
    };

    const restores =
      Array.isArray(
        result.restores,
      )
        ? result.restores
        : [];

    const updated =
      await (this.prisma as any).platformEvent.update({
        where: {
          id:
            event.id,
        },

        data: {
          status:
            "queued",

          payload: {
            ...payload,

            content:
              selected.snapshot.content,

            campaign:
              selected.snapshot.campaign,

            metadata: {
              ...this.objectOf(
                selected.snapshot.metadata,
              ),

              restoredFromVersion:
                selected.version,

              restoredAt:
                now.toISOString(),
            },

            contentVersion:
              selected.version,

            activeVersionId:
              selected.versionId,
          },

          result: {
            ...result,

            activeVersion: {
              versionId:
                selected.versionId,
              version:
                selected.version,
              contentHash:
                selected.contentHash,
              activatedAt:
                now.toISOString(),
              restored:
                true,
            },

            restores: [
              ...restores,
              restoreRecord,
            ],

            latestRestore:
              restoreRecord,
          },

          updatedAt:
            now,
        },
      });

    await this.audit(
      "PUBLICATION_VERSION_RESTORED",
      event.id,
    );

    return {
      success: true,
      eventId:
        event.id,
      previousStatus:
        event.status,
      status:
        updated.status,
      restoredVersion:
        selected.version,
      restoredVersionId:
        selected.versionId,
      contentHash:
        selected.contentHash,
      restoredAt:
        now,
    };
  }

  async restoreHistory(
    eventId: string,
  ) {
    const event =
      await this.event(eventId);

    const result =
      this.objectOf(
        event.result,
      );

    const restores =
      Array.isArray(
        result.restores,
      )
        ? result.restores
        : [];

    return {
      success: true,
      eventId:
        event.id,
      count:
        restores.length,
      restores,
    };
  }

  private snapshotOf(
    payload: Record<string, any>,
    input?: {
      content?: any;
      campaign?: any;
      metadata?: any;
    },
  ) {
    return {
      vehicle:
        payload.vehicle ??
        null,

      content:
        input?.content ??
        payload.content ??
        null,

      campaign: {
        ...this.objectOf(
          payload.campaign,
        ),
        ...this.objectOf(
          input?.campaign,
        ),
      },

      metadata: {
        ...this.objectOf(
          payload.metadata,
        ),
        ...this.objectOf(
          input?.metadata,
        ),
      },

      publisher:
        payload.publisher ??
        null,

      correlationId:
        payload.correlationId ??
        null,
    };
  }

  private versionsOf(
    result: Record<string, any>,
  ): PublicationVersion[] {
    return Array.isArray(
      result.versions,
    )
      ? result.versions
      : [];
  }

  private hash(
    value: any,
  ): string {
    return createHash(
      "sha256",
    )
      .update(
        this.stableStringify(
          value,
        ),
      )
      .digest("hex");
  }

  private stableStringify(
    value: any,
  ): string {
    if (
      value === null ||
      typeof value !==
        "object"
    ) {
      return JSON.stringify(
        value,
      );
    }

    if (Array.isArray(value)) {
      return `[${value
        .map(
          (item) =>
            this.stableStringify(
              item,
            ),
        )
        .join(",")}]`;
    }

    const keys =
      Object.keys(value)
        .sort();

    return `{${keys
      .map(
        (key) =>
          `${JSON.stringify(
            key,
          )}:${this.stableStringify(
            value[key],
          )}`,
      )
      .join(",")}}`;
  }

  private diff(
    left: any,
    right: any,
    path = "",
  ): any[] {
    if (
      this.stableStringify(left) ===
      this.stableStringify(right)
    ) {
      return [];
    }

    if (
      left === null ||
      right === null ||
      typeof left !== "object" ||
      typeof right !== "object" ||
      Array.isArray(left) ||
      Array.isArray(right)
    ) {
      return [
        {
          path:
            path || "$",
          before:
            left ?? null,
          after:
            right ?? null,
        },
      ];
    }

    const keys =
      Array.from(
        new Set([
          ...Object.keys(left),
          ...Object.keys(right),
        ]),
      ).sort();

    const changes: any[] = [];

    for (const key of keys) {
      const nextPath =
        path
          ? `${path}.${key}`
          : key;

      changes.push(
        ...this.diff(
          left[key],
          right[key],
          nextPath,
        ),
      );
    }

    return changes;
  }

  private async event(
    eventId: string,
  ) {
    const event =
      await (this.prisma as any).platformEvent.findUnique({
        where: {
          id:
            String(eventId)
              .trim(),
        },
      });

    if (!event) {
      throw new NotFoundException(
        "PlatformEvent not found.",
      );
    }

    if (
      ![
        "InstagramVehiclePublicationRequested",
        "TikTokVehiclePublicationRequested",
        "GoogleSearchVehicleCampaignRequested",
      ].includes(
        event.type,
      )
    ) {
      throw new BadRequestException(
        "PlatformEvent does not support publication versioning.",
      );
    }

    return event;
  }

  private objectOf(
    value: any,
  ): Record<string, any> {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return value;
    }

    return {};
  }

  private async audit(
    action: string,
    entityId: string,
  ) {
    await this.prisma.auditLog.create({
      data: {
        action,
        entity:
          "PlatformEvent",
        entityId,
      },
    });
  }
}

