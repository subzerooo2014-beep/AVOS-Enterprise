import { Module } from "@nestjs/common";
import { LivingBlueprintSyncService } from "./living-blueprint-sync.service";
import { LivingBlueprintSyncController } from "./living-blueprint-sync.controller";

@Module({
  providers:[LivingBlueprintSyncService],
  controllers:[LivingBlueprintSyncController],
  exports:[LivingBlueprintSyncService]
})
export class LivingBlueprintSyncModule {}
