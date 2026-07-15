import { Module } from "@nestjs/common";
import { DecisionPlatformController } from "./decision-platform.controller";
import { DecisionPlatformService } from "./decision-platform.service";

@Module({
  controllers: [DecisionPlatformController],
  providers: [DecisionPlatformService],
  exports: [DecisionPlatformService],
})
export class DecisionPlatformModule {}