import { Module } from "@nestjs/common";
import { EventRuntimeService } from "./event-runtime.service";
import { EventRuntimeController } from "./event-runtime.controller";

@Module({
  providers:[EventRuntimeService],
  controllers:[EventRuntimeController],
  exports:[EventRuntimeService]
})
export class EventRuntimeModule {}
