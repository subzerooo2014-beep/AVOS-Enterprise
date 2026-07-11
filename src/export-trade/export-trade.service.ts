import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ExportTradeService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return (this.prisma as any).exportVehicle.create({ data });
  }

  findAll() {
    return (this.prisma as any).exportVehicle.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const item = await (this.prisma as any).exportVehicle.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Export vehicle not found");
    return item;
  }

  async scoreExportReadiness(id: string) {
    const item = await this.findOne(id);
    let score = 40;

    if (item.shippingReady) score += 20;
    if (item.documentsReady) score += 20;
    if (item.targetCountries && Array.isArray(item.targetCountries)) score += 10;
    if (item.condition) score += 10;

    score = Math.max(0, Math.min(100, score));

    return (this.prisma as any).exportVehicle.update({
      where: { id },
      data: {
        aiScore: score,
        demandScore: Math.max(50, score - 5),
        metadata: {
          ...(item.metadata || {}),
          exportReadinessReason: "Calculated from shipping readiness, documents, target countries and vehicle condition.",
        },
      },
    });
  }
}
