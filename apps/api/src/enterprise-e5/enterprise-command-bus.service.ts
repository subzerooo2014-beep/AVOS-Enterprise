import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EnterpriseCommand,
  EnterpriseCommandStatus,
} from "./enterprise-e5.types";
import { EnterpriseEventMeshService } from "./enterprise-event-mesh.service";

@Injectable()
export class EnterpriseCommandBusService {
  private readonly commands = new Map<string, EnterpriseCommand>();

  constructor(private readonly events: EnterpriseEventMeshService) {}

  enqueue(
    name: string,
    payload: Record<string, unknown> = {},
  ): EnterpriseCommand {
    const command: EnterpriseCommand = {
      id: randomUUID(),
      name,
      payload,
      status: "QUEUED",
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    this.commands.set(command.id, command);
    this.events.publish("EnterpriseCommandQueued", {
      commandId: command.id,
      name,
    });

    return command;
  }

  execute(id: string): EnterpriseCommand {
    const command = this.requireCommand(id);
    command.status = "RUNNING";
    command.attempts += 1;

    try {
      command.status = "COMPLETED";
      command.completedAt = new Date().toISOString();
      this.events.publish("EnterpriseCommandCompleted", {
        commandId: command.id,
        name: command.name,
      });
      return command;
    } catch (error) {
      command.status = "FAILED";
      command.failedAt = new Date().toISOString();
      this.events.publish("EnterpriseCommandFailed", {
        commandId: command.id,
        name: command.name,
      });
      throw error;
    }
  }

  list(status?: EnterpriseCommandStatus): EnterpriseCommand[] {
    const values = [...this.commands.values()];
    return status ? values.filter((item) => item.status === status) : values;
  }

  count(): number {
    return this.commands.size;
  }

  private requireCommand(id: string): EnterpriseCommand {
    const command = this.commands.get(id);
    if (!command) {
      throw new NotFoundException(`Enterprise command not found: ${id}`);
    }
    return command;
  }
}