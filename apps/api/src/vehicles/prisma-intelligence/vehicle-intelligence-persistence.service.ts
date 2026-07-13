import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { VehicleIntelligencePersistenceInput } from "./vehicle-intelligence-persistence.types";

@Injectable()
export class VehicleIntelligencePersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(input: VehicleIntelligencePersistenceInput) {
    const intelligence = input.intelligence ?? {};
    const decision = input.decision ?? {};

    return (this.prisma as any).vehicleIntelligenceRecord.upsert({
      where: {
        lifecycleId: input.lifecycleId,
      },
      create: {
        lifecycleId: input.lifecycleId,
        vehicleId: input.vehicleId,
        source: input.source,
        stage: input.stage,
        intelligenceVersion: this.asString(intelligence.version),
        brainCommandStatus: this.asString(
          intelligence.brainCommandStatus,
        ),
        finalStatus: this.asString(decision.finalStatus),
        releaseApproved: this.asBoolean(decision.releaseApproved),
        commandMode: this.asString(decision.commandMode),
        controlStatus: this.asString(decision.controlStatus),
        payloadJson: this.stringify(input.payload),
        intelligenceJson: this.stringify(input.intelligence),
        decisionJson: this.stringify(input.decision),
        error: input.error,
      },
      update: {
        vehicleId: input.vehicleId,
        source: input.source,
        stage: input.stage,
        intelligenceVersion: this.asString(intelligence.version),
        brainCommandStatus: this.asString(
          intelligence.brainCommandStatus,
        ),
        finalStatus: this.asString(decision.finalStatus),
        releaseApproved: this.asBoolean(decision.releaseApproved),
        commandMode: this.asString(decision.commandMode),
        controlStatus: this.asString(decision.controlStatus),
        payloadJson: this.stringify(input.payload),
        intelligenceJson: this.stringify(input.intelligence),
        decisionJson: this.stringify(input.decision),
        error: input.error,
      },
    });
  }

  async findByVehicleId(vehicleId: string) {
    return (this.prisma as any).vehicleIntelligenceRecord.findMany({
      where: { vehicleId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByLifecycleId(lifecycleId: string) {
    return (this.prisma as any).vehicleIntelligenceRecord.findUnique({
      where: { lifecycleId },
    });
  }

  async list(limit = 50) {
    return (this.prisma as any).vehicleIntelligenceRecord.findMany({
      orderBy: { createdAt: "desc" },
      take: Math.max(1, Math.min(limit, 200)),
    });
  }

  async stats() {
    const [total, decided, failed] = await Promise.all([
      (this.prisma as any).vehicleIntelligenceRecord.count(),
      (this.prisma as any).vehicleIntelligenceRecord.count({
        where: { stage: "DECIDED" },
      }),
      (this.prisma as any).vehicleIntelligenceRecord.count({
        where: { stage: "FAILED" },
      }),
    ]);

    return { total, decided, failed };
  }

  private stringify(value: unknown): string | undefined {
    return value === undefined ? undefined : JSON.stringify(value);
  }

  private asString(value: unknown): string | undefined {
    return typeof value === "string" ? value : undefined;
  }

  private asBoolean(value: unknown): boolean | undefined {
    return typeof value === "boolean" ? value : undefined;
  }
}
