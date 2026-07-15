import { Module } from "@nestjs/common";
import { AuditPlatformController } from "./audit-platform.controller";
import { AuditPlatformService } from "./audit-platform.service";

@Module({
  controllers: [AuditPlatformController],
  providers: [AuditPlatformService],
  exports: [AuditPlatformService],
})
export class AuditPlatformModule {}