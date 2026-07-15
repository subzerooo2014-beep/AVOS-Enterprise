import { Module } from "@nestjs/common";
import { AgentPlatformController } from "./agent-platform.controller";
import { AgentPlatformService } from "./agent-platform.service";

@Module({
  controllers: [AgentPlatformController],
  providers: [AgentPlatformService],
  exports: [AgentPlatformService],
})
export class AgentPlatformModule {}