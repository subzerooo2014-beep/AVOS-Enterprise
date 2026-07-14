import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { SuperAppV3DealService } from "./super-app-v3.deal.service";
import { SuperAppV3MatchingService } from "./super-app-v3.matching.service";
import { SuperAppV3TrustFraudService } from "./super-app-v3.trust-fraud.service";
import {
  BuyerProfile,
  ServiceStatus,
  VehicleOffer,
} from "./super-app-v3.types";

@Controller("super-app-v3")
export class SuperAppV3Controller {
  constructor(
    private readonly matching: SuperAppV3MatchingService,
    private readonly deals: SuperAppV3DealService,
    private readonly trustFraud: SuperAppV3TrustFraudService,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Super App Phase 3",
      status: "healthy",
      capabilities: [
        "smart_matching",
        "negotiation",
        "reservation",
        "inspection",
        "financing",
        "insurance",
        "payment",
        "deal_timeline",
        "trust_fraud",
        "operations_dashboard",
      ],
    };
  }

  @Post("matching")
  match(
    @Body()
    body: {
      buyer: BuyerProfile;
      vehicles: VehicleOffer[];
    },
  ) {
    return {
      success: true,
      matches: this.matching.match(body.buyer, body.vehicles),
    };
  }

  @Post("trust-fraud/evaluate")
  evaluateTrustFraud(
    @Body()
    body: {
      buyerTrust: number;
      sellerTrust: number;
      vehicleTrust: number;
      priceDeviationPercent: number;
      suspiciousSignals?: number;
    },
  ) {
    return {
      success: true,
      ...this.trustFraud.evaluate(body),
    };
  }

  @Post("deals")
  createDeal(
    @Body()
    body: {
      buyerId: string;
      sellerId: string;
      vehicleId: string;
      askingPrice: number;
      trustScore?: number;
      fraudRisk?: number;
    },
  ) {
    return {
      success: true,
      deal: this.deals.create(body),
    };
  }

  @Get("deals")
  listDeals() {
    return {
      success: true,
      deals: this.deals.list(),
    };
  }

  @Get("deals/:id")
  getDeal(@Param("id") id: string) {
    return {
      success: true,
      deal: this.deals.get(id),
    };
  }

  @Post("deals/:id/negotiate")
  negotiate(
    @Param("id") id: string,
    @Body()
    body: {
      actor: "BUYER" | "SELLER" | "AZM";
      amount: number;
      message?: string;
      accept?: boolean;
    },
  ) {
    return {
      success: true,
      deal: this.deals.negotiate(id, body),
    };
  }

  @Patch("deals/:id/services/:service")
  updateService(
    @Param("id") id: string,
    @Param("service")
    service:
      | "reservation"
      | "inspection"
      | "financing"
      | "insurance"
      | "payment",
    @Body() body: { status: ServiceStatus },
  ) {
    return {
      success: true,
      deal: this.deals.updateService(id, service, body.status),
    };
  }

  @Get("operations/dashboard")
  dashboard() {
    return {
      success: true,
      dashboard: this.deals.dashboard(),
    };
  }
}
