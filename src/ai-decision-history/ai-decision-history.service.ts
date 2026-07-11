import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AiDecisionHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async saveDecision(vehicleId: string, decision: any) {
    return (this.prisma as any).aiDecisionHistory.create({
      data: {
        entityType: "vehicle",
        entityId: vehicleId,
        decision,
      },
    });
  }

  async getHistory(vehicleId: string) {
    return (this.prisma as any).aiDecisionHistory.findMany({
      where: {
        entityType: "vehicle",
        entityId: vehicleId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
