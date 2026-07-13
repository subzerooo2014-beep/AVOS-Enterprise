import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { VehicleEventPersistenceStoreService } from "./vehicle-event-persistence-store.service";
import { VehicleEventProcessingService } from "./vehicle-event-processing.service";
import { VehicleEventStatus } from "./vehicle-event-persistence.types";

@Controller("vehicle-event-persistence")
export class VehicleEventPersistenceController {
  constructor(
    private readonly store: VehicleEventPersistenceStoreService,
    private readonly processor: VehicleEventProcessingService,
  ) {}

  @Post("events")
  create(
    @Body()
    input: {
      vehicleId: string;
      eventType: string;
      payload?: Record<string, unknown>;
      maxAttempts?: number;
    },
  ) {
    return {
      success: true,
      event: this.store.create(input),
    };
  }

  @Post("events/:id/process")
  async process(@Param("id") id: string) {
    return {
      success: true,
      event: await this.processor.process(id),
    };
  }

  @Post("events/:id/retry")
  async retry(@Param("id") id: string) {
    return {
      success: true,
      event: await this.processor.retry(id),
    };
  }

  @Post("events/:id/replay")
  async replay(@Param("id") id: string) {
    return {
      success: true,
      event: await this.processor.replay(id),
    };
  }

  @Post("process-pending")
  async processPending(@Query("limit") limit?: string) {
    const events = await this.processor.processPending(
      limit ? Number(limit) : 20,
    );

    return {
      success: true,
      processed: events.length,
      events,
    };
  }

  @Get("events")
  list(@Query("status") status?: VehicleEventStatus) {
    return {
      success: true,
      events: this.store.list(status),
    };
  }

  @Get("events/:id")
  get(@Param("id") id: string) {
    const event = this.store.get(id);

    return {
      success: Boolean(event),
      event: event ?? null,
    };
  }

  @Get("events/:id/audit")
  audit(@Param("id") id: string) {
    return {
      success: true,
      entries: this.store.auditTrail(id),
    };
  }

  @Get("status")
  status() {
    const events = this.store.list();

    return {
      success: true,
      system: "AVOS Vehicle Event Persistence",
      status: "running",
      total: events.length,
      pending: events.filter(
        (item) => item.status === "PENDING",
      ).length,
      completed: events.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      failed: events.filter(
        (item) => item.status === "FAILED",
      ).length,
      auditEntries: this.store.auditTrail().length,
    };
  }
}
