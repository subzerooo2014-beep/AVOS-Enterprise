import { Body, Controller, Get, Post } from "@nestjs/common";
import { VehicleFinanceReadinessService } from "./vehicle-finance-readiness.service";
import { VehicleInsuranceReadinessService } from "./vehicle-insurance-readiness.service";
import { VehicleExportReadinessService } from "./vehicle-export-readiness.service";
import { VehicleTransactionOrchestratorService } from "./vehicle-transaction-orchestrator.service";

@Controller("vehicle-enterprise-bundle-d")
export class VehicleEnterpriseBundleDController {
  constructor(
    private readonly finance: VehicleFinanceReadinessService,
    private readonly insurance: VehicleInsuranceReadinessService,
    private readonly exportReadiness: VehicleExportReadinessService,
    private readonly transaction: VehicleTransactionOrchestratorService,
  ) {}

  @Post("evaluate")
  evaluate(@Body() input: any) {
    const finance = this.finance.evaluate(input.finance);
    const insurance = this.insurance.evaluate(input.insurance);
    const exportReadiness = this.exportReadiness.evaluate(input.export);
    const transaction = this.transaction.orchestrate({
      financeReady: finance.status === "READY",
      insuranceReady: insurance.insurable,
      transferReady: Boolean(input.transferReady),
      deliveryReady: Boolean(input.deliveryReady),
    });

    return {
      success: true,
      finance,
      insurance,
      exportReadiness,
      transaction,
    };
  }

  @Get("status")
  status() {
    return {
      success: true,
      system: "AVOS Vehicle Enterprise Bundle D",
      status: "running",
      packs: "36-50",
      capabilities: 15,
    };
  }
}
