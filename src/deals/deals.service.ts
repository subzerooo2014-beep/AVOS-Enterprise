import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return (this.prisma as any).dealRoom.create({ data });
  }

  findAll() {
    return (this.prisma as any).dealRoom.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const item = await (this.prisma as any).dealRoom.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Deal room not found");
    return item;
  }

  async calculateDealScore(id: string) {
    const deal = await this.findOne(id);

    let score = 50;
    if (deal.vehicleId) score += 10;
    if (deal.sellerId) score += 10;
    if (deal.buyerId) score += 10;
    if (deal.dealType === "export") score += 5;

    score = Math.max(0, Math.min(100, score));
    const riskScore = 100 - score;

    return (this.prisma as any).dealRoom.update({
      where: { id },
      data: {
        aiDealScore: score,
        riskScore,
        metadata: {
          ...(deal.metadata || {}),
          aiDealReason: "Calculated from vehicle, seller, buyer and deal type readiness.",
        },
      },
    });
  }

  async calculateCommission(id: string, amount: number, percent = 1.5) {
    await this.findOne(id);
    const commission = Number(((amount * percent) / 100).toFixed(2));

    return (this.prisma as any).dealRoom.update({
      where: { id },
      data: {
        commission,
        metadata: {
          saleAmount: amount,
          commissionPercent: percent,
          commissionReason: "Success fee calculated only when deal is completed through AVOS.",
        },
      },
    });
  }
}
