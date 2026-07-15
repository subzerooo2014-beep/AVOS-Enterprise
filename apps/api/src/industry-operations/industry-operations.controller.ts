import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { IndustryOperationsService } from "./industry-operations.service";
import {
  IndustryExceptionRecord,
  IndustryFulfillmentTask,
  IndustryInventoryItem,
  IndustryOperationOrder,
  IndustrySlaPolicy,
  OperationStatus,
} from "./industry-operations.types";

@Controller("industry-operations")
export class IndustryOperationsController {
  constructor(private readonly operations: IndustryOperationsService) {}

  @Get("components")
  components() {
    return this.operations.components();
  }

  @Post("orders")
  createOrder(
    @Body()
    input: Omit<
      IndustryOperationOrder,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.operations.createOrder(input);
  }

  @Patch("orders/:id/status")
  updateOrderStatus(
    @Param("id") id: string,
    @Body() body: { status: OperationStatus },
  ) {
    return this.operations.updateOrderStatus(id, body.status);
  }

  @Post("inventory")
  upsertInventory(
    @Body()
    input: Omit<
      IndustryInventoryItem,
      "id" | "createdAt" | "updatedAt"
    > & { id?: string },
  ) {
    return this.operations.upsertInventory(input);
  }

  @Post("reservations")
  reserveInventory(
    @Body()
    body: {
      orderId: string;
      inventoryItemId: string;
      quantity: number;
      expiresAt: string;
    },
  ) {
    return this.operations.reserveInventory(
      body.orderId,
      body.inventoryItemId,
      body.quantity,
      body.expiresAt,
    );
  }

  @Patch("reservations/:id/release")
  releaseReservation(@Param("id") id: string) {
    return this.operations.releaseReservation(id);
  }

  @Post("tasks")
  createTask(
    @Body()
    input: Omit<
      IndustryFulfillmentTask,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.operations.createTask(input);
  }

  @Patch("tasks/:id/status")
  updateTaskStatus(
    @Param("id") id: string,
    @Body() body: { status: OperationStatus },
  ) {
    return this.operations.updateTaskStatus(id, body.status);
  }

  @Post("sla-policies")
  createSlaPolicy(
    @Body()
    input: Omit<IndustrySlaPolicy, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.operations.createSlaPolicy(input);
  }

  @Post("exceptions")
  createException(
    @Body()
    input: Omit<
      IndustryExceptionRecord,
      "id" | "resolved" | "createdAt"
    >,
  ) {
    return this.operations.createException(input);
  }

  @Patch("exceptions/:id/resolve")
  resolveException(@Param("id") id: string) {
    return this.operations.resolveException(id);
  }

  @Get("dashboard")
  dashboard() {
    return this.operations.dashboard();
  }
}