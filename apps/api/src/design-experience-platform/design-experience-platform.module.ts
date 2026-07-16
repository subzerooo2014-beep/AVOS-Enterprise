import { Module } from "@nestjs/common";
import { DesignExperiencePlatformController } from "./design-experience-platform.controller";
import { DesignExperiencePlatformService } from "./design-experience-platform.service";

@Module({
  controllers: [DesignExperiencePlatformController],
  providers: [DesignExperiencePlatformService],
  exports: [DesignExperiencePlatformService],
})
export class DesignExperiencePlatformModule {}