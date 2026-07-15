import { Module } from "@nestjs/common";
import { DesignSystemFoundationController } from "./design-system-foundation.controller";
import { DesignSystemFoundationService } from "./design-system-foundation.service";

@Module({
  controllers: [DesignSystemFoundationController],
  providers: [DesignSystemFoundationService],
  exports: [DesignSystemFoundationService],
})
export class DesignSystemFoundationModule {}