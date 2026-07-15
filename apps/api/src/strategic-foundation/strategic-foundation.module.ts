import { Module } from "@nestjs/common";
import { StrategicFoundationController } from "./strategic-foundation.controller";
import { StrategicFoundationService } from "./strategic-foundation.service";

@Module({
  controllers: [StrategicFoundationController],
  providers: [StrategicFoundationService],
  exports: [StrategicFoundationService],
})
export class StrategicFoundationModule {}