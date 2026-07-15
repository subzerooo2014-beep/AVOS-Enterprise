import { Module } from "@nestjs/common";
import { PolicyPlatformController } from "./policy-platform.controller";
import { PolicyPlatformService } from "./policy-platform.service";

@Module({
  controllers: [PolicyPlatformController],
  providers: [PolicyPlatformService],
  exports: [PolicyPlatformService],
})
export class PolicyPlatformModule {}