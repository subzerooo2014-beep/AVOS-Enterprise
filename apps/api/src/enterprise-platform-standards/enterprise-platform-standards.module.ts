import { Module } from "@nestjs/common";
import { EnterprisePlatformStandardsController } from "./enterprise-platform-standards.controller";
import { EnterprisePlatformStandardsService } from "./enterprise-platform-standards.service";

@Module({
  controllers: [EnterprisePlatformStandardsController],
  providers: [EnterprisePlatformStandardsService],
  exports: [EnterprisePlatformStandardsService],
})
export class EnterprisePlatformStandardsModule {}