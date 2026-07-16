import { Module } from "@nestjs/common";
import { FoundationFrameworkController } from "./foundation-framework.controller";
import { FoundationFrameworkService } from "./foundation-framework.service";

@Module({
  controllers: [FoundationFrameworkController],
  providers: [FoundationFrameworkService],
  exports: [FoundationFrameworkService],
})
export class FoundationFrameworkModule {}
