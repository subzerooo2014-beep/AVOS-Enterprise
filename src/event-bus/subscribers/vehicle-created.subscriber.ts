import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AvosEvent } from "../contracts/avos-event.interface";
import { EventSubscriber } from "./event-subscriber.interface";

@Injectable()
export class VehicleCreatedSubscriber implements EventSubscriber {
  constructor(private prisma: PrismaService) {}

  supports(event: AvosEvent) {
    return event.type === "VehicleCreated" || event.entityType === "vehicle";
  }

  async handle(event: AvosEvent) {
    const tasks = [
      "vehicle_valuation",
      "fraud_assessment",
      "trust_profile",
      "buyer_matching",
      "marketing_campaign",
      "export_opportunity_check",
    ];

    for (const taskType of tasks) {
      await (this.prisma as any).brainTask.create({
        data: {
          eventId: event.id,
          taskType,
          entityType: event.entityType,
          entityId: event.entityId,
          status: "queued",
          priority: taskType === "fraud_assessment" ? "high" : "medium",
          input: event.payload || {},
          reason: `${event.type} triggered ${taskType}.`,
        },
      });
    }
  }
}
