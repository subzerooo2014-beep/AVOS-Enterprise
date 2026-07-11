import { AvosError } from "../errors/avos-error";
import { AvosLogger } from "../logger/avos-logger";
import { AvosCommand } from "./command";
import { AvosCommandHandler } from "./command-handler";

export class AvosCommandBus {
  private readonly handlers: AvosCommandHandler[] = [];
  private readonly logger = new AvosLogger("CommandBus");

  register(handler: AvosCommandHandler) {
    this.handlers.push(handler);
  }

  async execute(command: AvosCommand) {
    if (!command?.type) {
      throw new AvosError("Command type is required", "COMMAND_TYPE_REQUIRED");
    }

    const handler = this.handlers.find((item) => item.supports(command));

    if (!handler) {
      this.logger.warn("No handler registered", { type: command.type });
      return {
        status: "skipped",
        metadata: {
          reason: "NO_HANDLER",
          commandType: command.type,
        },
      };
    }

    this.logger.info("Executing command", { type: command.type });
    const data = await handler.handle(command);

    return {
      status: "success",
      data,
    };
  }
}
