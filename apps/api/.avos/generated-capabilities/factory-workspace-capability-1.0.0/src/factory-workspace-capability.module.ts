import { Module } from "@nestjs/common";
import { FactoryWorkspaceCapabilityService } from "./factory-workspace-capability.service";

@Module({
  providers: [FactoryWorkspaceCapabilityService],
  exports: [FactoryWorkspaceCapabilityService]
})
export class FactoryWorkspaceCapabilityModule {}