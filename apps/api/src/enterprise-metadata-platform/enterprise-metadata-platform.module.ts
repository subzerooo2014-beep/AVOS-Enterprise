import { Module } from "@nestjs/common";
import { EnterpriseMetadataPlatformController } from "./enterprise-metadata-platform.controller";
import { EnterpriseMetadataPlatformService } from "./enterprise-metadata-platform.service";

@Module({
  controllers: [EnterpriseMetadataPlatformController],
  providers: [EnterpriseMetadataPlatformService],
  exports: [EnterpriseMetadataPlatformService],
})
export class EnterpriseMetadataPlatformModule {}