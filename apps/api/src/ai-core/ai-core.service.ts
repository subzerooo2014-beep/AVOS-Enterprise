import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AiCoreService {
  constructor(private prisma: PrismaService) {}

  createAgent(data: any) {
    return (this.prisma as any).aiAgent.create({ data });
  }

  listAgents() {
    return (this.prisma as any).aiAgent.findMany({ orderBy: { createdAt: "desc" } });
  }

  createEvent(data: any) {
    return (this.prisma as any).aiEvent.create({ data });
  }

  listEvents() {
    return (this.prisma as any).aiEvent.findMany({ orderBy: { createdAt: "desc" } });
  }

  async explainDecision(data: any) {
    return (this.prisma as any).aiAuditLog.create({
      data: {
        action: data.action || "AI_DECISION",
        entity: data.entity,
        entityId: data.entityId,
        reason: data.reason || "AI decision recorded for transparency.",
        payload: data.payload || {},
      },
    });
  }
}
