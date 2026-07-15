import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { IndustryServicesEcosystemService } from "./industry-services-ecosystem.service";
import {
  FieldServiceRequest,
  InspectionRecord,
  PartsOrder,
  ServiceBooking,
  ServiceStatus,
  WarrantyClaim,
  WarrantyRecord,
  WorkshopJob,
} from "./industry-services-ecosystem.types";

@Controller("industry-services-ecosystem")
export class IndustryServicesEcosystemController {
  constructor(
    private readonly services: IndustryServicesEcosystemService,
  ) {}

  @Get("components")
  components() {
    return this.services.components();
  }

  @Post("bookings")
  createBooking(
    @Body()
    input: Omit<ServiceBooking, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.services.createBooking(input);
  }

  @Patch("bookings/:id/status")
  updateBookingStatus(
    @Param("id") id: string,
    @Body() body: { status: ServiceStatus },
  ) {
    return this.services.updateBookingStatus(id, body.status);
  }

  @Post("workshop-jobs")
  createWorkshopJob(
    @Body()
    input: Omit<WorkshopJob, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.services.createWorkshopJob(input);
  }

  @Patch("workshop-jobs/:id/technician")
  assignTechnician(
    @Param("id") id: string,
    @Body() body: { technicianId: string },
  ) {
    return this.services.assignTechnician(id, body.technicianId);
  }

  @Post("inspections")
  createInspection(
    @Body()
    input: Omit<
      InspectionRecord,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.services.createInspection(input);
  }

  @Patch("inspections/:id/complete")
  completeInspection(
    @Param("id") id: string,
    @Body() body: { grade: string; certificateNumber: string },
  ) {
    return this.services.completeInspection(
      id,
      body.grade,
      body.certificateNumber,
    );
  }

  @Post("warranties")
  createWarranty(
    @Body()
    input: Omit<WarrantyRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.services.createWarranty(input);
  }

  @Post("warranty-claims")
  createWarrantyClaim(
    @Body()
    input: Omit<WarrantyClaim, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.services.createWarrantyClaim(input);
  }

  @Patch("warranty-claims/:id/approve")
  approveWarrantyClaim(@Param("id") id: string) {
    return this.services.approveWarrantyClaim(id);
  }

  @Post("parts-orders")
  createPartsOrder(
    @Body()
    input: Omit<
      PartsOrder,
      "id" | "total" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.services.createPartsOrder(input);
  }

  @Patch("parts-orders/:id/confirm")
  confirmPartsOrder(@Param("id") id: string) {
    return this.services.confirmPartsOrder(id);
  }

  @Post("field-services")
  createFieldService(
    @Body()
    input: Omit<
      FieldServiceRequest,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.services.createFieldService(input);
  }

  @Get("dashboard")
  dashboard() {
    return this.services.dashboard();
  }
}