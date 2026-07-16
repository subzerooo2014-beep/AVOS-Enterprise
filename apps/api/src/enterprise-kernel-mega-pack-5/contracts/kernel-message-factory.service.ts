import { Injectable } from "@nestjs/common";
import {
  KernelMessageEnvelope,
  KernelMessageKind
} from "../enterprise-kernel-mega-pack-5.types";
import { KernelMessageContractRegistryService } from "../contracts/kernel-message-contract-registry.service";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelMessageFactoryService {
  constructor(
    private readonly contracts: KernelMessageContractRegistryService,
    private readonly audit: KernelMessagingAuditService
  ) {}

  create(input: {
    contractId: string;
    payload: Record<string, unknown>;
    headers?: Record<string, string>;
    correlationId: string;
    causationId?: string;
    traceId?: string;
    producerId: string;
    actorIdentityId: string;
  }) {
    const contract = this.contracts.get(input.contractId);
    const validation = this.contracts.validatePayload(
      contract.id,
      input.payload
    );

    if (!validation.valid) {
      throw new Error(
        `Kernel message payload is invalid. Missing: ${validation.missingFields.join(", ")}`
      );
    }

    const now = new Date().toISOString();

    const envelope: KernelMessageEnvelope = {
      id: `kernel-message:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`,
      contractId: contract.id,
      kind: contract.kind as KernelMessageKind,
      name: contract.name,
      version: contract.version,
      payload: input.payload,
      headers: input.headers ?? {},
      correlationId: input.correlationId,
      causationId: input.causationId,
      traceId: input.traceId ?? `trace:${Date.now()}`,
      producerId: input.producerId,
      status: "created",
      createdAt: now,
      updatedAt: now
    };

    this.audit.record({
      correlationId: input.correlationId,
      category:
        envelope.kind === "event"
          ? "event"
          : envelope.kind === "command"
            ? "command"
            : "query",
      action: "kernel-message-created",
      subjectId: envelope.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        contractId: contract.id,
        kind: contract.kind,
        traceId: envelope.traceId
      }
    });

    return envelope;
  }
}
