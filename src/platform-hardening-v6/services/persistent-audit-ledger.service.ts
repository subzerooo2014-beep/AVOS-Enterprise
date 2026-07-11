import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PersistentAuditInput } from "../interfaces/persistent-audit-input.interface";
import { PersistentIntegrityResult } from "../interfaces/persistent-integrity-result.interface";
import { PersistentAuditHashUtil } from "../utils/persistent-audit-hash.util";
import { PersistentAuditRepository } from "./persistent-audit.repository";
import { GovernanceSignaturePayloadService } from "./governance-signature-payload.service";
import { GovernanceSignatureService } from "./governance-signature.service";

@Injectable()
export class PersistentAuditLedgerService {
  private writeQueue: Promise<unknown> =
    Promise.resolve();

  constructor(
    private readonly repository:
      PersistentAuditRepository,
    private readonly signatures:
      GovernanceSignatureService,
    private readonly signaturePayloads:
      GovernanceSignaturePayloadService,
  ) {}

  append(
    input: PersistentAuditInput,
  ): Promise<any> {
    const operation =
      this.writeQueue.then(() =>
        this.appendInternal(input),
      );

    this.writeQueue = operation.catch(
      () => undefined,
    );

    return operation;
  }

  private async appendInternal(
    input: PersistentAuditInput,
  ): Promise<any> {
    const latest =
      await this.repository.findLatest();

    const sequence =
      latest ? latest.sequence + 1 : 1;

    const previousHash =
      latest?.hash ?? "GENESIS";

    const createdAt = new Date();

    const hash =
      PersistentAuditHashUtil.create({
        sequence,
        eventType: input.eventType,
        severity: input.severity,
        action: input.action,
        message: input.message,
        actor: input.actor,
        correlationId: input.correlationId,
        traceId: input.traceId,
        method: input.method,
        path: input.path,
        statusCode: input.statusCode,
        metadata: input.metadata,
        previousHash,
        createdAt,
      });

    const unsignedRecord = {
      id: "pending",
      sequence,
      eventType: input.eventType,
      severity: input.severity,
      action: input.action,
      message: input.message,
      actor: input.actor ?? null,
      correlationId:
        input.correlationId ?? null,
      traceId:
        input.traceId ?? null,
      method: input.method ?? null,
      path: input.path ?? null,
      statusCode:
        input.statusCode ?? null,
      metadata:
        input.metadata ?? {},
      previousHash,
      hash,
      createdAt,
    };

    try {
      const created =
        await this.repository.create({
        sequence,
        eventType: input.eventType,
        severity: input.severity,
        action: input.action,
        message: input.message,
        actor: input.actor,
        correlationId: input.correlationId,
        traceId: input.traceId,
        method: input.method,
        path: input.path,
        statusCode: input.statusCode,
        metadata:
          input.metadata as
            | Prisma.InputJsonValue
            | undefined,
        previousHash,
        hash,
        createdAt,
      });

      const signature =
        this.signatures.signPayload(
          this.signaturePayloads.audit(
            created,
          ),
        );

      return this.repository.model.update({
        where: {
          id: created.id,
        },
        data: {
          signature:
            signature.signature,
          signatureAlgorithm:
            signature.algorithm,
          signatureKeyId:
            signature.keyId,
          signedAt:
            new Date(
              signature.signedAt,
            ),
        },
      });
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException({
          success: false,
          message:
            "Persistent audit sequence or hash conflict detected",
          sequence,
        });
      }

      throw error;
    }
  }

  async findMany(input?: {
    limit?: number;
    eventType?: string;
    severity?: string;
    actor?: string;
    correlationId?: string;
  }) {
    const limit = Math.min(
      Math.max(input?.limit ?? 100, 1),
      1000,
    );

    return this.repository.findMany({
      limit,
      eventType: input?.eventType,
      severity: input?.severity,
      actor: input?.actor,
      correlationId:
        input?.correlationId,
    });
  }

  async findOne(id: string) {
    const event =
      await this.repository.findById(id);

    if (!event) {
      throw new NotFoundException({
        success: false,
        message:
          `Persistent audit event ${id} was not found`,
      });
    }

    return event;
  }

  async findBySequence(sequence: number) {
    const event =
      await this.repository.findBySequence(
        sequence,
      );

    if (!event) {
      throw new NotFoundException({
        success: false,
        message:
          `Persistent audit sequence ${sequence} was not found`,
      });
    }

    return event;
  }

  async getSummary() {
    const [
      total,
      latest,
      first,
      severityCounts,
      typeCounts,
    ] = await Promise.all([
      this.repository.count(),
      this.repository.findLatest(),
      this.repository.findFirst(),
      this.repository.getSeverityCounts(),
      this.repository.getTypeCounts(),
    ]);

    return {
      total,
      firstSequence:
        first?.sequence ?? 0,
      latestSequence:
        latest?.sequence ?? 0,
      genesisHash:
        first?.previousHash ?? "GENESIS",
      latestHash:
        latest?.hash ?? "GENESIS",
      severityCounts:
        Object.fromEntries(
          severityCounts.map(
            (item: any) => [
              item.severity,
              item._count._all,
            ],
          ),
        ),
      eventTypeCounts:
        Object.fromEntries(
          typeCounts.map(
            (item: any) => [
              item.eventType,
              item._count._all,
            ],
          ),
        ),
    };
  }

  async verifyIntegrity(): Promise<
    PersistentIntegrityResult
  > {
    const events =
      await this.repository.findAllAscending();

    let previousHash = "GENESIS";
    let expectedSequence = 1;

    for (
      let index = 0;
      index < events.length;
      index += 1
    ) {
      const event = events[index];

      if (event.sequence !== expectedSequence) {
        return {
          valid: false,
          totalEvents: events.length,
          verifiedEvents: index,
          firstSequence:
            events[0]?.sequence,
          lastSequence:
            events[events.length - 1]?.sequence,
          invalidSequence:
            event.sequence,
          checkedAt:
            new Date().toISOString(),
        };
      }

      const expectedHash =
        PersistentAuditHashUtil.create({
          sequence: event.sequence,
          eventType: event.eventType,
          severity: event.severity,
          action: event.action,
          message: event.message,
          actor: event.actor,
          correlationId:
            event.correlationId,
          traceId: event.traceId,
          method: event.method,
          path: event.path,
          statusCode: event.statusCode,
          metadata: event.metadata,
          previousHash,
          createdAt: event.createdAt,
        });

      if (
        event.previousHash !== previousHash ||
        event.hash !== expectedHash
      ) {
        return {
          valid: false,
          totalEvents: events.length,
          verifiedEvents: index,
          firstSequence:
            events[0]?.sequence,
          lastSequence:
            events[events.length - 1]?.sequence,
          invalidSequence:
            event.sequence,
          expectedPreviousHash:
            previousHash,
          actualPreviousHash:
            event.previousHash,
          expectedHash,
          actualHash: event.hash,
          checkedAt:
            new Date().toISOString(),
        };
      }

      previousHash = event.hash;
      expectedSequence += 1;
    }

    return {
      valid: true,
      totalEvents: events.length,
      verifiedEvents: events.length,
      firstSequence:
        events[0]?.sequence,
      lastSequence:
        events.length > 0
          ? events[events.length - 1].sequence
          : undefined,
      checkedAt:
        new Date().toISOString(),
    };
  }
}

