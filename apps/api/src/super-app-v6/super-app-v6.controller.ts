import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SuperAppV6RuntimeService } from "./super-app-v6.runtime.service";

@Controller("super-app-v6")
export class SuperAppV6Controller {
  constructor(private readonly runtime: SuperAppV6RuntimeService) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Super App Phase 6 Unified Runtime",
      status: "healthy",
      capabilities: [
        "deal_creation",
        "negotiation_link",
        "integration_orchestration",
        "job_queue_link",
        "idempotent_execution",
        "notifications_link",
        "audit_link",
        "end_to_end_runtime",
        "runtime_dashboard",
      ],
    };
  }

  @Post("runtimes")
  start(
    @Body()
    body: {
      buyerId: string;
      sellerId: string;
      vehicleId: string;
      userId: string;
      askingPrice: number;
      acceptedPrice?: number;
      financingRequired: boolean;
      insuranceRequired: boolean;
      inspectionRequired: boolean;
      paymentRequired: boolean;
      shippingRequired?: boolean;
      exportRequired?: boolean;
    },
  ) {
    return {
      success: true,
      ...this.runtime.start(body),
    };
  }

  @Post("runtimes/:id/process")
  process(@Param("id") id: string) {
    return {
      success: true,
      ...this.runtime.process(id),
    };
  }

  @Get("runtimes")
  list() {
    return {
      success: true,
      runtimes: this.runtime.list(),
    };
  }

  @Get("runtimes/:id")
  get(@Param("id") id: string) {
    return {
      success: true,
      runtime: this.runtime.get(id),
    };
  }

  @Get("operations/dashboard")
  dashboard() {
    return {
      success: true,
      dashboard: this.runtime.dashboard(),
    };
  }
}
