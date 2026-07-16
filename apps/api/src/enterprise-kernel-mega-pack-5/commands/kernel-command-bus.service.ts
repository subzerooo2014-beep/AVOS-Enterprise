import { Injectable } from "@nestjs/common";
import {
  KernelCommandResult,
  KernelMessageEnvelope
} from "../enterprise-kernel-mega-pack-5.types";
import { KernelMessageFactoryService } from "../contracts/kernel-message-factory.service";
import { KernelDeliveryService } from "../delivery/kernel-delivery.service";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelCommandBusService {
  private readonly commands = new Map<string, KernelMessageEnvelope>();
  private readonly results = new Map<string, KernelCommandResult>();

  constructor(
    private readonly factory: KernelMessageFactoryService,
    private readonly delivery: KernelDeliveryService,
    private readonly audit: KernelMessagingAuditService
  ) {}

  dispatch(input: {
    contractId: string;
    payload: Record<string, unknown>;
    producerId: string;
    actorIdentityId: string;
    correlationId: string;
    causationId?: string;
    traceId?: string;
    headers?: Record<string, string>;
    simulateFailure?: boolean;
  }) {
    const command = this.factory.create(input);

    if (command.kind !== "command") {
      throw new Error(`Kernel contract is not a command contract: ${command.contractId}`);
    }

    command.status = "processing";
    command.updatedAt = new Date().toISOString();
    this.commands.set(command.id, command);

    const delivery = this.delivery.deliver({
      message: command,
      actorIdentityId: input.actorIdentityId,
      simulateFailureForConsumerIds: input.simulateFailure
        ? ["kernel:execution"]
        : []
    });

    const success = delivery.deadLettered === 0 && delivery.failed === 0;

    const result: KernelCommandResult = {
      id: `kernel-command-result:${Date.now()}:${this.results.size + 1}`,
      commandMessageId: command.id,
      handledBy: "kernel:execution",
      success,
      result: success
        ? {
            executed: true,
            payload: command.payload
          }
        : undefined,
      error: success ? undefined : "Kernel command delivery failed.",
      completedAt: new Date().toISOString()
    };

    command.status = success ? "completed" : "failed";
    command.updatedAt = new Date().toISOString();

    this.commands.set(command.id, command);
    this.results.set(result.id, result);

    this.audit.record({
      correlationId: input.correlationId,
      category: "command",
      action: "kernel-command-dispatched",
      subjectId: command.id,
      actorIdentityId: input.actorIdentityId,
      outcome: success ? "success" : "failure",
      metadata: {
        contractId: command.contractId,
        resultId: result.id
      }
    });

    return {
      command,
      result,
      delivery
    };
  }

  listCommands() {
    return Array.from(this.commands.values());
  }

  listResults() {
    return Array.from(this.results.values());
  }

  summary() {
    const results = this.listResults();

    return {
      commands: this.commands.size,
      results: results.length,
      successful: results.filter((x) => x.success).length,
      failed: results.filter((x) => !x.success).length
    };
  }
}
