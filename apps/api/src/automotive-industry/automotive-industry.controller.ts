import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AutomotiveIndustryService } from "./automotive-industry.service";
import {
  AutomotiveAiAssessment,
  AutomotiveFinanceApplication,
  AutomotiveLogisticsCase,
  ServiceRecord,
  TradeInRequest,
  VehicleListing,
  VehicleRecord,
  VehicleStatus,
} from "./automotive-industry.types";

@Controller("automotive-industry")
export class AutomotiveIndustryController {
  constructor(
    private readonly automotive: AutomotiveIndustryService,
  ) {}

  @Get("capabilities")
  capabilities() {
    return this.automotive.capabilities();
  }

  @Post("vehicles")
  createVehicle(
    @Body()
    input: Omit<VehicleRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.automotive.createVehicle(input);
  }

  @Patch("vehicles/:id/status")
  updateVehicleStatus(
    @Param("id") id: string,
    @Body() body: { status: VehicleStatus },
  ) {
    return this.automotive.updateVehicleStatus(id, body.status);
  }

  @Patch("vehicles/:id/owner")
  assignOwner(
    @Param("id") id: string,
    @Body() body: { ownerId: string },
  ) {
    return this.automotive.assignOwner(id, body.ownerId);
  }

  @Post("listings")
  createListing(
    @Body()
    input: Omit<
      VehicleListing,
      "id" | "published" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.automotive.createListing(input);
  }

  @Patch("listings/:id/publish")
  publishListing(@Param("id") id: string) {
    return this.automotive.publishListing(id);
  }

  @Post("trade-ins")
  createTradeIn(
    @Body()
    input: Omit<
      TradeInRequest,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.automotive.createTradeIn(input);
  }

  @Patch("trade-ins/:id/assess")
  assessTradeIn(
    @Param("id") id: string,
    @Body() body: { estimatedValue: number },
  ) {
    return this.automotive.assessTradeIn(
      id,
      body.estimatedValue,
    );
  }

  @Post("service-records")
  createServiceRecord(
    @Body()
    input: Omit<
      ServiceRecord,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.automotive.createServiceRecord(input);
  }

  @Patch("service-records/:id/status")
  updateServiceStatus(
    @Param("id") id: string,
    @Body() body: { status: ServiceRecord["status"] },
  ) {
    return this.automotive.updateServiceStatus(id, body.status);
  }

  @Post("finance-applications")
  createFinanceApplication(
    @Body()
    input: Omit<
      AutomotiveFinanceApplication,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.automotive.createFinanceApplication(input);
  }

  @Patch("finance-applications/:id/status")
  updateFinanceStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: AutomotiveFinanceApplication["status"];
    },
  ) {
    return this.automotive.updateFinanceStatus(
      id,
      body.status,
    );
  }

  @Post("logistics")
  createLogisticsCase(
    @Body()
    input: Omit<
      AutomotiveLogisticsCase,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.automotive.createLogisticsCase(input);
  }

  @Patch("logistics/:id/status")
  updateLogisticsStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: AutomotiveLogisticsCase["status"];
      trackingNumber?: string;
    },
  ) {
    return this.automotive.updateLogisticsStatus(
      id,
      body.status,
      body.trackingNumber,
    );
  }

  @Post("ai/assessments")
  assessVehicle(
    @Body()
    body: {
      tenantId: string;
      vehicleId: string;
      type: AutomotiveAiAssessment["type"];
      score: number;
      recommendation: string;
      factors: string[];
    },
  ) {
    return this.automotive.assessVehicle(
      body.tenantId,
      body.vehicleId,
      body.type,
      body.score,
      body.recommendation,
      body.factors,
    );
  }

  @Get("search")
  search(
    @Query("q") query = "",
    @Query("minPrice") minPrice?: string,
    @Query("maxPrice") maxPrice?: string,
  ) {
    return this.automotive.search(
      query,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
    );
  }

  @Get("dashboard")
  dashboard() {
    return this.automotive.dashboard();
  }
}