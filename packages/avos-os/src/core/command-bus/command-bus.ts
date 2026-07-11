import { AvosLogger } from "../../foundation/logger/avos-logger";
import { AvosError } from "../../foundation/errors/avos-error";
import { AvosCommand } from "./command";
import { AvosCommandHandler } from "./command-handler";

export class AvosCommandBus {
  private readonly handlers: AvosCommandHandler[] = [];
  private readonly logger = new AvosLogger("CommandBus");

  register(handler: AvosCommandHandler) {
    this.handlers.push(handler);
  }

  async execute(command: AvosCommand) {
    if (!command.type) {
      throw new AvosError("Command type is required", "COMMAND_TYPE_REQUIRED");
    }

    const handler = this.handlers.find((h) => h.supports(command));

    if (!handler) {
      this.logger.warn("No Command Handler", command.type);
      return {
        status: "skipped",
        reason: "NO_HANDLER",
        commandType: command.type,
      };
    }

    this.logger.info("Executing Command", command.type);

    return {
      status: "success",
      data: await handler.handle(command),
    };
  }
}
