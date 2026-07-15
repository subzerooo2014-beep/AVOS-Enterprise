import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { FoundationGovernanceService } from "./foundation-governance.service";
import {
  FoundationEvidence,
  FoundationStage,
  ProductFoundationRegistration,
} from "./foundation-governance.types";

@Controller("foundation-governance")
export class FoundationGovernanceController {
  constructor(
    private readonly governance: FoundationGovernanceService,
  ) {}

  @Get()
  getFramework() {
    return this.governance.getFramework();
  }

  @Post("products")
  registerProduct(
    @Body()
    input: {
      productName: string;
      productType: ProductFoundationRegistration["productType"];
      owner: string;
    },
  ) {
    return this.governance.registerProduct(input);
  }

  @Get("products")
  listProducts() {
    return this.governance.listRegistrations();
  }

  @Get("products/:id")
  getProduct(@Param("id") id: string) {
    return this.governance.getRegistration(id);
  }

  @Post("products/:id/evidence")
  addEvidence(
    @Param("id") id: string,
    @Body()
    input: Omit<
      FoundationEvidence,
      "id" | "verified" | "verifiedAt"
    >,
  ) {
    return this.governance.addEvidence(id, input);
  }

  @Post("products/:id/evidence/:evidenceId/verify")
  verifyEvidence(
    @Param("id") id: string,
    @Param("evidenceId") evidenceId: string,
  ) {
    return this.governance.verifyEvidence(id, evidenceId);
  }

  @Post("products/:id/evaluate-gate")
  evaluateGate(
    @Param("id") id: string,
    @Body() body: { requestedStage: FoundationStage },
  ) {
    return this.governance.evaluateGate(
      id,
      body.requestedStage,
    );
  }

  @Post("products/:id/complete-stage")
  completeStage(
    @Param("id") id: string,
    @Body() body: { stage: FoundationStage },
  ) {
    return this.governance.completeStage(id, body.stage);
  }

  @Get("products/:id/audit")
  auditProduct(@Param("id") id: string) {
    return this.governance.auditProduct(id);
  }
}