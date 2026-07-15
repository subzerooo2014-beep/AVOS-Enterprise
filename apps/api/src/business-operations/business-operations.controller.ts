import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { BusinessOperationsService } from "./business-operations.service";
import {
  BusinessPayment,
  PartsOrder,
  ReferralRecord,
  SupportTicket,
  WarrantyClaim,
  WarrantyRecord,
  WorkshopBooking,
} from "./business-operations.types";

@Controller("business-operations")
export class BusinessOperationsController {
  constructor(private readonly operations: BusinessOperationsService) {}

  @Post("workshops/bookings")
  createWorkshopBooking(
    @Body()
    input: Omit<WorkshopBooking, "id" | "status" | "createdAt">,
  ) {
    return this.operations.createWorkshopBooking(input);
  }

  @Patch("workshops/bookings/:id/status")
  updateWorkshopBooking(
    @Param("id") id: string,
    @Body() body: { status: WorkshopBooking["status"] },
  ) {
    return this.operations.updateWorkshopBooking(id, body.status);
  }

  @Post("warranties")
  createWarranty(
    @Body()
    input: Omit<WarrantyRecord, "id" | "status" | "createdAt">,
  ) {
    return this.operations.createWarranty(input);
  }

  @Post("warranties/claims")
  createWarrantyClaim(
    @Body()
    input: Omit<WarrantyClaim, "id" | "status" | "createdAt">,
  ) {
    return this.operations.createWarrantyClaim(input);
  }

  @Patch("warranties/claims/:id/status")
  updateWarrantyClaim(
    @Param("id") id: string,
    @Body() body: { status: WarrantyClaim["status"] },
  ) {
    return this.operations.updateWarrantyClaim(id, body.status);
  }

  @Post("parts/orders")
  createPartsOrder(
    @Body()
    input: Omit<PartsOrder, "id" | "total" | "createdAt">,
  ) {
    return this.operations.createPartsOrder(input);
  }

  @Post("support/tickets")
  createSupportTicket(
    @Body()
    input: Omit<SupportTicket, "id" | "status" | "createdAt">,
  ) {
    return this.operations.createSupportTicket(input);
  }

  @Patch("support/tickets/:id/status")
  updateSupportTicket(
    @Param("id") id: string,
    @Body() body: { status: SupportTicket["status"] },
  ) {
    return this.operations.updateSupportTicket(id, body.status);
  }

  @Post("loyalty/:customerId/points")
  awardLoyaltyPoints(
    @Param("customerId") customerId: string,
    @Body() body: { points: number },
  ) {
    return this.operations.awardLoyaltyPoints(customerId, body.points);
  }

  @Post("referrals")
  createReferral(
    @Body()
    input: Omit<ReferralRecord, "id" | "createdAt">,
  ) {
    return this.operations.createReferral(input);
  }

  @Post("payments")
  createPayment(
    @Body()
    input: Omit<BusinessPayment, "id" | "status" | "createdAt">,
  ) {
    return this.operations.createPayment(input);
  }

  @Patch("payments/:id/status")
  updatePaymentStatus(
    @Param("id") id: string,
    @Body() body: { status: BusinessPayment["status"] },
  ) {
    return this.operations.updatePaymentStatus(id, body.status);
  }

  @Get("dashboard")
  dashboard() {
    return this.operations.dashboard();
  }
}