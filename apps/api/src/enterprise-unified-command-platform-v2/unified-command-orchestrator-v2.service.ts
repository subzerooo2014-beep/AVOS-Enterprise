import { Injectable, NotFoundException } from "@nestjs/common";
import { CommandSourceRegistryV2Service } from "./command-source-registry-v2.service";
import type { UnifiedCommandV2 } from "./unified-command-v2.types";

@Injectable()
export class UnifiedCommandOrchestratorV2Service {
  private readonly commands = new Map<string, UnifiedCommandV2>();

  constructor(private readonly sources: CommandSourceRegistryV2Service) {}

  create(
    sourceId: string,
    commandType: string,
    target: string,
    priority: number,
    payload: Record<string, unknown>,
    approvalRequired: boolean,
  ): UnifiedCommandV2 {
    const source = this.sources.get(sourceId);

    if (source.status === "OFFLINE") {
      throw new Error(`Command source '${sourceId}' is offline.`);
    }

    const now = new Date().toISOString();

    const command: UnifiedCommandV2 = {
      id: `unified-command-v2-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      sourceId,
      commandType,
      target,
      status: approvalRequired ? "APPROVAL_REQUIRED" : "CREATED",
      priority,
      payload: { ...payload },
      createdAt: now,
      updatedAt: now,
    };

    this.commands.set(command.id, command);
    return this.clone(command);
  }

  markApproved(id: string): UnifiedCommandV2 {
    const command = this.requireCommand(id);
    command.status = "APPROVED";
    command.updatedAt = new Date().toISOString();
    return this.clone(command);
  }

  execute(id: string): UnifiedCommandV2 {
    const command = this.requireCommand(id);

    if (
      command.status !== "CREATED" &&
      command.status !== "APPROVED"
    ) {
      throw new Error(
        `Command '${id}' cannot execute from status '${command.status}'.`,
      );
    }

    command.status = "COMPLETED";
    command.completedAt = new Date().toISOString();
    command.updatedAt = command.completedAt;

    return this.clone(command);
  }

  fail(id: string, error: string): UnifiedCommandV2 {
    const command = this.requireCommand(id);
    command.status = "FAILED";
    command.error = error;
    command.updatedAt = new Date().toISOString();
    return this.clone(command);
  }

  get(id: string): UnifiedCommandV2 {
    return this.clone(this.requireCommand(id));
  }

  list(): UnifiedCommandV2[] {
    return Array.from(this.commands.values())
      .map((command) => this.clone(command))
      .sort((left, right) => right.priority - left.priority);
  }

  count(): number {
    return this.commands.size;
  }

  executingCount(): number {
    return this.list().filter((command) => command.status === "EXECUTING").length;
  }

  completedCount(): number {
    return this.list().filter((command) => command.status === "COMPLETED").length;
  }

  failedCount(): number {
    return this.list().filter((command) => command.status === "FAILED").length;
  }

  private requireCommand(id: string): UnifiedCommandV2 {
    const command = this.commands.get(id);

    if (!command) {
      throw new NotFoundException(`Unified command '${id}' was not found.`);
    }

    return command;
  }

  private clone(command: UnifiedCommandV2): UnifiedCommandV2 {
    return {
      ...command,
      payload: { ...command.payload },
    };
  }
}
