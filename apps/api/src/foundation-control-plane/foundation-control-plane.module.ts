import { Module } from "@nestjs/common";
import { FoundationControlPlaneController } from "./foundation-control-plane.controller";
import { FoundationControlPlaneService } from "./foundation-control-plane.service";

@Module({
  controllers: [FoundationControlPlaneController],
  providers: [FoundationControlPlaneService],
  exports: [FoundationControlPlaneService]
})
export class FoundationControlPlaneModule {}
