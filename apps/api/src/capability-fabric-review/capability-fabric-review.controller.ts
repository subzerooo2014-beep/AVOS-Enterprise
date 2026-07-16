import { Controller, Get, Post } from "@nestjs/common";
import { CapabilityFabricReviewService } from "./capability-fabric-review.service";

@Controller("capability-fabric/review")
export class CapabilityFabricReviewController {
  constructor(private readonly review: CapabilityFabricReviewService) {}

  @Get("status")
  status() {
    return this.review.framework();
  }

  @Post("run")
  run() {
    return this.review.run();
  }

  @Get("layers")
  layers() {
    return {
      success: true,
      reviews: this.review.getReviews(),
    };
  }

  @Get("report")
  report() {
    return {
      success: true,
      report: this.review.getReport(),
    };
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.review.snapshot(),
    };
  }

  @Post("smoke")
  smoke() {
    const result = this.review.run();
    return {
      success:
        result.report.layersReviewed === 5 &&
        result.report.architectureScore > 0 &&
        result.report.foundationFirst,
      system: "AVOS Capability Fabric",
      pack: "Architecture Review and Consolidation",
      layersReviewed: result.report.layersReviewed,
      architectureScore: result.report.architectureScore,
      blockingFindings: result.report.blockingFindings,
      decisions: result.report.decisions.length,
      knowledgeFabricReady: result.report.knowledgeFabricReady,
      pillars: this.review.framework().pillars.length,
      snapshot: this.review.snapshot(),
    };
  }
}