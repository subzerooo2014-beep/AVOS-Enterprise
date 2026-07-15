import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  IndustryExceptionRecord,
  IndustryFulfillmentTask,
  IndustryInventoryItem,
  IndustryOperationOrder,
  IndustryOperationsDashboard,
  IndustryReservation,
  IndustrySlaPolicy,
  OperationStatus,
} from "./industry-operations.types";
import {
  INDUSTRY_OPERATIONS_COMPONENTS,
  SUPPORTED_OPERATION_INDUSTRIES,
} from "./industry-operations.registry";

@Injectable()
export class IndustryOperationsService {
  private readonly orders = new Map<string, IndustryOperationOrder>();
  private readonly inventory = new Map<string, IndustryInventoryItem>();
  private readonly reservations = new Map<string, IndustryReservation>();
  private readonly tasks = new Map<string, IndustryFulfillmentTask>();
  private readonly slaPolicies = new Map<string, IndustrySlaPolicy>();
  private readonly exceptions = new Map<string, IndustryExceptionRecord>();

  components() {
    return {
      system: "AVOS Industry Operations & Fulfillment Core",
      architecture: "INDUSTRY_BASED",
      components: [...INDUSTRY_OPERATIONS_COMPONENTS],
      industries: [...SUPPORTED_OPERATION_INDUSTRIES],
      status: "READY",
    };
  }

  createOrder(
    input: Omit<
      IndustryOperationOrder,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): IndustryOperationOrder {
    this.requireIndustry(input.industryKey);

    if (
      !input.tenantId?.trim() ||
      !input.customerId?.trim() ||
      !input.capabilityKey?.trim() ||
      !input.entityId?.trim()
    ) {
      throw new Error(
        "tenantId, customerId, capabilityKey and entityId are required",
      );
    }

    if (input.quantity <= 0) {
      throw new Error("Order quantity must be positive");
    }

    const now = new Date().toISOString();
    const order: IndustryOperationOrder = {
      ...input,
      id: randomUUID(),
      status: "CREATED",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.orders.set(order.id, order);
    return this.cloneOrder(order);
  }

  updateOrderStatus(
    id: string,
    status: OperationStatus,
  ): IndustryOperationOrder {
    const order = this.requireOrder(id);
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.orders.set(id, order);
    return this.cloneOrder(order);
  }

  upsertInventory(
    input: Omit<IndustryInventoryItem, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    },
  ): IndustryInventoryItem {
    this.requireIndustry(input.industryKey);

    if (
      !input.tenantId?.trim() ||
      !input.sku?.trim() ||
      !input.entityId?.trim() ||
      !input.location?.trim()
    ) {
      throw new Error(
        "tenantId, sku, entityId and location are required",
      );
    }

    if (input.available < 0 || input.reserved < 0) {
      throw new Error("Inventory quantities cannot be negative");
    }

    const now = new Date().toISOString();
    const existing = input.id ? this.inventory.get(input.id) : undefined;

    const item: IndustryInventoryItem = {
      id: input.id ?? randomUUID(),
      industryKey: input.industryKey,
      tenantId: input.tenantId,
      sku: input.sku,
      entityId: input.entityId,
      available: input.available,
      reserved: input.reserved,
      location: input.location,
      metadata: { ...input.metadata },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.inventory.set(item.id, item);
    return this.cloneInventory(item);
  }

  reserveInventory(
    orderId: string,
    inventoryItemId: string,
    quantity: number,
    expiresAt: string,
  ): IndustryReservation {
    const order = this.requireOrder(orderId);
    const item = this.requireInventory(inventoryItemId);

    if (order.industryKey !== item.industryKey) {
      throw new Error("Order and inventory industry mismatch");
    }

    if (quantity <= 0 || item.available - item.reserved < quantity) {
      throw new Error("Insufficient inventory availability");
    }

    item.reserved += quantity;
    item.updatedAt = new Date().toISOString();
    this.inventory.set(item.id, item);

    const now = new Date().toISOString();
    const reservation: IndustryReservation = {
      id: randomUUID(),
      industryKey: order.industryKey,
      tenantId: order.tenantId,
      orderId,
      inventoryItemId,
      quantity,
      expiresAt,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    this.reservations.set(reservation.id, reservation);

    order.status = "RESERVED";
    order.updatedAt = now;
    this.orders.set(order.id, order);

    return { ...reservation };
  }

  releaseReservation(id: string): IndustryReservation {
    const reservation = this.requireReservation(id);

    if (reservation.status !== "ACTIVE") {
      return { ...reservation };
    }

    const item = this.requireInventory(reservation.inventoryItemId);
    item.reserved = Math.max(item.reserved - reservation.quantity, 0);
    item.updatedAt = new Date().toISOString();
    this.inventory.set(item.id, item);

    reservation.status = "RELEASED";
    reservation.updatedAt = new Date().toISOString();
    this.reservations.set(id, reservation);

    return { ...reservation };
  }

  createTask(
    input: Omit<
      IndustryFulfillmentTask,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): IndustryFulfillmentTask {
    this.requireIndustry(input.industryKey);
    this.requireOrder(input.orderId);

    const now = new Date().toISOString();
    const task: IndustryFulfillmentTask = {
      ...input,
      id: randomUUID(),
      status: "CREATED",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return this.cloneTask(task);
  }

  updateTaskStatus(
    id: string,
    status: OperationStatus,
  ): IndustryFulfillmentTask {
    const task = this.requireTask(id);
    task.status = status;
    task.updatedAt = new Date().toISOString();
    this.tasks.set(id, task);
    return this.cloneTask(task);
  }

  createSlaPolicy(
    input: Omit<IndustrySlaPolicy, "id" | "createdAt" | "updatedAt">,
  ): IndustrySlaPolicy {
    this.requireIndustry(input.industryKey);

    if (input.targetMinutes <= 0 || input.escalationMinutes <= 0) {
      throw new Error("SLA minutes must be positive");
    }

    const now = new Date().toISOString();
    const policy: IndustrySlaPolicy = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.slaPolicies.set(policy.id, policy);
    return { ...policy };
  }

  createException(
    input: Omit<IndustryExceptionRecord, "id" | "resolved" | "createdAt">,
  ): IndustryExceptionRecord {
    this.requireIndustry(input.industryKey);

    if (!input.tenantId?.trim() || !input.code?.trim()) {
      throw new Error("tenantId and exception code are required");
    }

    const record: IndustryExceptionRecord = {
      ...input,
      id: randomUUID(),
      resolved: false,
      createdAt: new Date().toISOString(),
    };

    this.exceptions.set(record.id, record);
    return { ...record };
  }

  resolveException(id: string): IndustryExceptionRecord {
    const record = this.requireException(id);
    record.resolved = true;
    record.resolvedAt = new Date().toISOString();
    this.exceptions.set(id, record);
    return { ...record };
  }

  dashboard(): IndustryOperationsDashboard {
    const orders = Array.from(this.orders.values());
    const reservations = Array.from(this.reservations.values());
    const tasks = Array.from(this.tasks.values());
    const exceptions = Array.from(this.exceptions.values());

    return {
      orders: orders.length,
      activeOrders: orders.filter((order) =>
        ["CREATED", "RESERVED", "SCHEDULED", "IN_PROGRESS", "ON_HOLD"].includes(
          order.status,
        ),
      ).length,
      inventoryItems: this.inventory.size,
      reservations: reservations.length,
      activeReservations: reservations.filter(
        (reservation) => reservation.status === "ACTIVE",
      ).length,
      tasks: tasks.length,
      openTasks: tasks.filter((task) =>
        ["CREATED", "SCHEDULED", "IN_PROGRESS", "ON_HOLD"].includes(task.status),
      ).length,
      exceptions: exceptions.length,
      criticalExceptions: exceptions.filter(
        (record) => record.severity === "CRITICAL" && !record.resolved,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireIndustry(key: string) {
    if (
      !SUPPORTED_OPERATION_INDUSTRIES.includes(
        key as (typeof SUPPORTED_OPERATION_INDUSTRIES)[number],
      )
    ) {
      throw new Error(`Unsupported industry: ${key}`);
    }
  }

  private requireOrder(id: string): IndustryOperationOrder {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error(`Order not found: ${id}`);
    }
    return order;
  }

  private requireInventory(id: string): IndustryInventoryItem {
    const item = this.inventory.get(id);
    if (!item) {
      throw new Error(`Inventory item not found: ${id}`);
    }
    return item;
  }

  private requireReservation(id: string): IndustryReservation {
    const reservation = this.reservations.get(id);
    if (!reservation) {
      throw new Error(`Reservation not found: ${id}`);
    }
    return reservation;
  }

  private requireTask(id: string): IndustryFulfillmentTask {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }
    return task;
  }

  private requireException(id: string): IndustryExceptionRecord {
    const record = this.exceptions.get(id);
    if (!record) {
      throw new Error(`Exception not found: ${id}`);
    }
    return record;
  }

  private cloneOrder(order: IndustryOperationOrder): IndustryOperationOrder {
    return {
      ...order,
      metadata: { ...order.metadata },
    };
  }

  private cloneInventory(
    item: IndustryInventoryItem,
  ): IndustryInventoryItem {
    return {
      ...item,
      metadata: { ...item.metadata },
    };
  }

  private cloneTask(
    task: IndustryFulfillmentTask,
  ): IndustryFulfillmentTask {
    return {
      ...task,
      metadata: { ...task.metadata },
    };
  }
}