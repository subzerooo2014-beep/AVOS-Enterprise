import { Module } from "@nestjs/common";
import { EnterprisePlatformUltimateController } from "./enterprise-platform-ultimate.controller";
import { EnterprisePlatformUltimateService } from "./enterprise-platform-ultimate.service";

@Module({
  controllers: [EnterprisePlatformUltimateController],
  providers: [EnterprisePlatformUltimateService],
  exports: [EnterprisePlatformUltimateService],
})
export class EnterprisePlatformUltimateModule {}