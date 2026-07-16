import { Module } from "@nestjs/common";
import { EnterpriseFederationPlatformController } from "./enterprise-federation-platform.controller";
import { EnterpriseFederationPlatformService } from "./enterprise-federation-platform.service";

@Module({
  controllers: [EnterpriseFederationPlatformController],
  providers: [EnterpriseFederationPlatformService],
  exports: [EnterpriseFederationPlatformService],
})
export class EnterpriseFederationPlatformModule {}