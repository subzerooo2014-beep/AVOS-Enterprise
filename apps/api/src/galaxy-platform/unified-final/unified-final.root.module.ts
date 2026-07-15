import { Module } from "@nestjs/common";
import { UnifiedFinalGalaxyController } from "./unified-final.controller";
import { UnifiedFinalGalaxyModule } from "./unified-final.module";

@Module({
  imports: [UnifiedFinalGalaxyModule],
  controllers: [UnifiedFinalGalaxyController],
  exports: [UnifiedFinalGalaxyModule],
})
export class UnifiedFinalGalaxyRootModule {}