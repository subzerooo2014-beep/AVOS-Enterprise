import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AvosCommand } from "./command.interface";
import { CommandHandler } from "./command-handler.interface";

@Injectable()
export class CommandBusService {
  private handlers: CommandHandler[] = [];

  constructor(private readonly prisma: PrismaService) {}

  register(handler: CommandHandler) {
    this.handlers.push(handler);
  }

  async execute(command: AvosCommand) {
    if (!command?.type) {
      throw new BadRequestException("Command type is required");
    }

    await this.logCommand(command, "received");

    const handler = this.handlers.find((h) => h.supports(command));

    if (!handler) {
      await this.logCommand(command, "no_handler");
      return {
        status: "no_handler",
        commandType: command.type,
        message: "No handler registered for this command yet.",
      };
    }

    try {
      const result = await handler.handle(command);
      await this.logCommand(command, "completed", result);
      return result;
    } catch (error: unknown) {
      await this.logCommand(command, "failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  private async logCommand(command: AvosCommand, status: string, result: any = {}) {
    try {
      await (this.prisma as any).platformEvent.create({
        data: {
          type: `Command:${command.type}`,
          source: command.source || "command-bus",
          entityType: command.metadata?.entityType,
          entityId: command.metadata?.entityId,
          status,
          payload: command.payload || {},
          result: {
            correlationId: command.correlationId || null,
            metadata: command.metadata || {},
            ...result,
          },
        },
      });
    } catch (error: unknown) {
      console.error("Command log failed:", error instanceof Error ? error.message : String(error));
    }
  }
}
