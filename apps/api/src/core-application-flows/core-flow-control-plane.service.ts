import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowControlPlaneCommand } from "./core-flow-federation.types";
import { CoreFlowFederationService } from "./core-flow-federation.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";

@Injectable()
export class CoreFlowControlPlaneService {
  private readonly commands = new Map<string, FlowControlPlaneCommand>();

  constructor(
    private readonly federation: CoreFlowFederationService,
    private readonly audit: CoreFlowAuditService,
  ) {}

  issue(command: string, target: string, payload: Record<string, unknown> = {}) {
    const item: FlowControlPlaneCommand = {
      id: `command_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      command,
      target,
      status: "accepted",
      payload,
      createdAt: new Date().toISOString(),
    };

    this.commands.set(item.id, item);
    this.audit.write(item.id, "control-plane.command.accepted", {
      command,
      target,
    });
    return item;
  }

  findAll() {
    return Array.from(this.commands.values()).slice().reverse();
  }

  findOne(id: string) {
    const command = this.commands.get(id);
    if (!command) throw new NotFoundException("Control plane command not found");
    return command;
  }

  execute(id: string) {
    const command = this.findOne(id);

    try {
      if (command.command === "isolate-node") {
        this.federation.isolate(command.target);
      } else if (command.command === "retire-node") {
        this.federation.retire(command.target);
      } else if (command.command === "heartbeat-node") {
        this.federation.heartbeat(command.target, command.payload);
      }

      command.status = "completed";
      command.completedAt = new Date().toISOString();
      this.audit.write(id, "control-plane.command.completed");
      return command;
    } catch (error) {
      command.status = "failed";
      command.completedAt = new Date().toISOString();
      this.audit.write(id, "control-plane.command.failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  dashboard() {
    const commands = Array.from(this.commands.values());
    return {
      total: commands.length,
      accepted: commands.filter((item) => item.status === "accepted").length,
      completed: commands.filter((item) => item.status === "completed").length,
      failed: commands.filter((item) => item.status === "failed").length,
      federation: this.federation.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
