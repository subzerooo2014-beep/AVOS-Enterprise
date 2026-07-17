import { Module } from "@nestjs/common";
import { DigitalDnaEventsController } from "./events.controller";
import { DigitalDnaEventsService } from "./events.service";

@Module({
  controllers: [DigitalDnaEventsController],
  providers: [DigitalDnaEventsService],
  exports: [DigitalDnaEventsService],
})
export class DigitalDnaEventsModule {}