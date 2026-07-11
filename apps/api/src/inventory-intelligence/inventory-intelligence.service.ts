import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { InventoryInsightDto } from "./dto/inventory-insight.dto";

@Injectable()
export class InventoryIntelligenceService {
  constructor(private prisma: PrismaService) {}

  async overview(dto: InventoryInsightDto) {
    const items = await (this.prisma as any).inventory.findMany({
      where: {
        status: dto.status || undefined,
        location: dto.location || undefined,
      },
      include: { vehicle: true },
    });

    const total = items.length;
    const available = items.filter((x:any) => x.status === "AVAILABLE").length;
    const reserved = items.filter((x:any) => x.status === "RESERVED").length;
    const sold = items.filter((x:any) => x.status === "SOLD").length;

    const totalValue = items.reduce((sum:number, x:any) => sum + Number(x.price || 0), 0);

    return {
      total,
      available,
      reserved,
      sold,
      totalValue,
      averagePrice: total ? Math.round(totalValue / total) : 0,
      items,
    };
  }

  async slowMoving() {
    const items = await (this.prisma as any).inventory.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: "asc" },
    });

    return items.slice(0, 20).map((item:any) => ({
      ...item,
      risk: "SLOW_MOVING",
      recommendation: "Review price, promote listing, or transfer location",
    }));
  }
}
