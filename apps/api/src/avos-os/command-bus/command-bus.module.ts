import { Module } from "@nestjs/common";
import { CommandBusController } from "./command-bus.controller";
import { CommandBusService } from "./command-bus.service";

@Module({
  controllers: [CommandBusController],
  providers: [CommandBusService],
  exports: [CommandBusService],
})
export class CommandBusModule {}
