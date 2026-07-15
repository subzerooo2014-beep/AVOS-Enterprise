import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { HeavyEquipmentAssetsService } from "./heavy-equipment-assets.service";
import { HeavyEquipmentIntelligenceService } from "./heavy-equipment-intelligence.service";
import { HeavyEquipmentOperationsService } from "./heavy-equipment-operations.service";
import {
  EquipmentAiAssessment,
  EquipmentCategory,
  EquipmentDeployment,
  EquipmentInspection,
  EquipmentLifecycleStatus,
  EquipmentListing,
  EquipmentRentalContract,
  EquipmentSite,
  EquipmentTelematicsReading,
  EquipmentWorkOrder,
  HeavyEquipmentAsset,
  SparePartInventoryItem,
} from "./heavy-equipment-industry.types";

@Controller("heavy-equipment-industry")
export class HeavyEquipmentIndustryController {
  constructor(
    private readonly assets: HeavyEquipmentAssetsService,
    private readonly operations: HeavyEquipmentOperationsService,
    private readonly intelligence: HeavyEquipmentIntelligenceService,
  ) {}

  @Get("capabilities")
  capabilities() {
    return this.intelligence.capabilities();
  }

  @Post("equipment")
  createEquipment(
    @Body()
    input: Omit<
      HeavyEquipmentAsset,
      "id" | "lifecycleStatus" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.assets.createEquipment(input);
  }

  @Get("equipment")
  listEquipment(
    @Query("tenantId") tenantId?: string,
    @Query("category") category?: EquipmentCategory,
    @Query("status") status?: EquipmentLifecycleStatus,
    @Query("siteId") siteId?: string,
  ) {
    return this.assets.listEquipment({
      tenantId,
      category,
      status,
      siteId,
    });
  }

  @Get("equipment/:id")
  getEquipment(@Param("id") id: string) {
    return this.assets.getEquipment(id);
  }

  @Patch("equipment/:id/status")
  updateLifecycleStatus(
    @Param("id") id: string,
    @Body() body: { status: EquipmentLifecycleStatus },
  ) {
    return this.assets.updateLifecycleStatus(id, body.status);
  }

  @Patch("equipment/:id/owner")
  assignOwner(
    @Param("id") id: string,
    @Body() body: { ownerId: string },
  ) {
    return this.assets.assignOwner(id, body.ownerId);
  }

  @Patch("equipment/:id/valuation")
  updateValuation(
    @Param("id") id: string,
    @Body() body: { marketValue: number; bookValue: number },
  ) {
    return this.assets.updateValuation(
      id,
      body.marketValue,
      body.bookValue,
    );
  }

  @Post("sites")
  createSite(
    @Body()
    input: Omit<EquipmentSite, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.assets.createSite(input);
  }

  @Get("sites")
  listSites(@Query("tenantId") tenantId?: string) {
    return this.assets.listSites(tenantId);
  }

  @Post("deployments")
  createDeployment(
    @Body()
    input: Omit<
      EquipmentDeployment,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.operations.createDeployment(input);
  }

  @Patch("deployments/:id/status")
  updateDeploymentStatus(
    @Param("id") id: string,
    @Body() body: { status: EquipmentDeployment["status"] },
  ) {
    return this.operations.updateDeploymentStatus(id, body.status);
  }

  @Post("inspections")
  createInspection(
    @Body()
    input: Omit<EquipmentInspection, "id" | "createdAt">,
  ) {
    return this.operations.createInspection(input);
  }

  @Post("work-orders")
  createWorkOrder(
    @Body()
    input: Omit<
      EquipmentWorkOrder,
      "id" | "status" | "openedAt" | "updatedAt"
    >,
  ) {
    return this.operations.createWorkOrder(input);
  }

  @Patch("work-orders/:id/status")
  updateWorkOrderStatus(
    @Param("id") id: string,
    @Body() body: { status: EquipmentWorkOrder["status"] },
  ) {
    return this.operations.updateWorkOrderStatus(id, body.status);
  }

  @Post("rentals")
  createRental(
    @Body()
    input: Omit<
      EquipmentRentalContract,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.operations.createRentalContract(input);
  }

  @Patch("rentals/:id/status")
  updateRentalStatus(
    @Param("id") id: string,
    @Body() body: { status: EquipmentRentalContract["status"] },
  ) {
    return this.operations.updateRentalStatus(id, body.status);
  }

  @Post("listings")
  createListing(
    @Body()
    input: Omit<
      EquipmentListing,
      "id" | "published" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.operations.createListing(input);
  }

  @Patch("listings/:id/publish")
  publishListing(@Param("id") id: string) {
    return this.operations.publishListing(id);
  }

  @Post("spare-parts")
  createSparePart(
    @Body()
    input: Omit<SparePartInventoryItem, "id" | "updatedAt">,
  ) {
    return this.assets.createSparePart(input);
  }

  @Patch("spare-parts/:id/quantity")
  adjustSparePartQuantity(
    @Param("id") id: string,
    @Body() body: { adjustment: number },
  ) {
    return this.assets.adjustSparePartQuantity(id, body.adjustment);
  }

  @Get("spare-parts/low-stock")
  lowStockParts(@Query("tenantId") tenantId?: string) {
    return this.assets.listLowStockParts(tenantId);
  }

  @Post("telematics")
  recordTelematics(
    @Body()
    input: Omit<EquipmentTelematicsReading, "id">,
  ) {
    return this.intelligence.recordTelematics(input);
  }

  @Get("telematics/:equipmentId/latest")
  latestTelematics(@Param("equipmentId") equipmentId: string) {
    return this.intelligence.latestTelematics(equipmentId);
  }

  @Post("ai/assessments")
  assessEquipment(
    @Body()
    input: Omit<EquipmentAiAssessment, "id" | "createdAt">,
  ) {
    return this.intelligence.assessEquipment(input);
  }

  @Get("ai/predictive-maintenance/:equipmentId")
  predictiveMaintenance(@Param("equipmentId") equipmentId: string) {
    return this.intelligence.predictiveMaintenance(equipmentId);
  }

  @Get("dashboard")
  dashboard(@Query("tenantId") tenantId?: string) {
    return this.intelligence.dashboard(tenantId);
  }
}