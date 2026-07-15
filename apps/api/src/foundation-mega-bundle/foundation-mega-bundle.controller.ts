import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { FoundationMegaBundleService } from "./foundation-mega-bundle.service";
import {
  ArchitectureDecisionRecord,
  FoundationMasterRecord,
  LifecycleStage,
} from "./foundation-mega-bundle.types";

@Controller("foundation-mega-bundle")
export class FoundationMegaBundleController {
  constructor(private readonly foundation: FoundationMegaBundleService) {}

  @Get()
  framework() {
    return this.foundation.framework();
  }

  @Post("foundations")
  registerFoundation(
    @Body()
    input: Omit<
      FoundationMasterRecord,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.foundation.registerFoundation(input);
  }

  @Get("foundations")
  listFoundations() {
    return this.foundation.listFoundations();
  }

  @Post("decisions")
  createDecision(
    @Body()
    input: Omit<
      ArchitectureDecisionRecord,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.foundation.createDecision(input);
  }

  @Patch("decisions/:id/accept")
  acceptDecision(@Param("id") id: string) {
    return this.foundation.acceptDecision(id);
  }

  @Get("decisions")
  listDecisions() {
    return this.foundation.listDecisions();
  }

  @Post("products")
  registerProduct(
    @Body() input: { productName: string; owner: string },
  ) {
    return this.foundation.registerProduct(input);
  }

  @Get("products")
  listProducts() {
    return this.foundation.listProducts();
  }

  @Post("products/:id/foundations/:foundationId")
  attachFoundation(
    @Param("id") id: string,
    @Param("foundationId") foundationId: string,
  ) {
    return this.foundation.attachFoundation(id, foundationId);
  }

  @Post("products/:id/decisions/:decisionId")
  attachDecision(
    @Param("id") id: string,
    @Param("decisionId") decisionId: string,
  ) {
    return this.foundation.attachDecision(id, decisionId);
  }

  @Post("products/:id/stages")
  completeStage(
    @Param("id") id: string,
    @Body() body: { stage: LifecycleStage },
  ) {
    return this.foundation.completeStage(id, body.stage);
  }

  @Patch("products/:id/quality-gates")
  updateQualityGate(
    @Param("id") id: string,
    @Body() body: { gate: string; passed: boolean },
  ) {
    return this.foundation.updateQualityGate(id, body.gate, body.passed);
  }

  @Post("products/:id/evaluate-release")
  evaluateRelease(@Param("id") id: string) {
    return this.foundation.evaluateRelease(id);
  }

  @Get("command-center")
  commandCenter() {
    return this.foundation.commandCenter();
  }
}