import { Body, Controller, Post } from "@nestjs/common";
import { CommandBusService } from "./command-bus.service";
import { AvosCommand } from "./command.interface";

@Controller("avos-os/commands")
export class CommandBusController {
  constructor(private readonly commandBus: CommandBusService) {}

  @Post("execute")
  execute(@Body() command: AvosCommand) {
    return this.commandBus.execute(command);
  }
}
