import { Module } from "@nestjs/common";
import { CapabilityFabricReviewController } from "./capability-fabric-review.controller";
import { CapabilityFabricReviewService } from "./capability-fabric-review.service";
import { CapabilityFabricScannerService } from "./capability-fabric-scanner.service";
import { CapabilityFabricConsolidationService } from "./capability-fabric-consolidation.service";

@Module({
  controllers: [CapabilityFabricReviewController],
  providers: [
    CapabilityFabricReviewService,
    CapabilityFabricScannerService,
    CapabilityFabricConsolidationService,
  ],
  exports: [
    CapabilityFabricReviewService,
    CapabilityFabricScannerService,
    CapabilityFabricConsolidationService,
  ],
})
export class CapabilityFabricReviewModule {}