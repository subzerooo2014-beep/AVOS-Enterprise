import { Controller, Get, Post } from "@nestjs/common";
import { KnowledgeFabricFinalReviewService } from "./knowledge-fabric-final-review.service";

@Controller("avos/knowledge-fabric/final-review")
export class KnowledgeFabricFinalReviewController {
  constructor(private readonly service: KnowledgeFabricFinalReviewService) {}

  @Post("run")
  run() { return this.service.runReview(); }

  @Post("certify")
  certify() { return this.service.issueCertificate("human:khalifa"); }

  @Get("status")
  status() { return this.service.status(); }

  @Get("health")
  health() { return this.service.health(); }

  @Get("report")
  report() { return this.service.runReview(); }

  @Get("verification")
  verification() { return this.service.verification(); }

  @Get("smoke")
  smoke() { return this.service.smoke(); }
}