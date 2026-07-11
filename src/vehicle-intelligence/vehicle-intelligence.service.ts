import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class VehicleIntelligenceService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  async valueVehicle(data: any) {
    let base = Number(data.marketPrice || data.askingPrice || 50000);

    if (data.year && Number(data.year) >= 2023) base *= 1.12;
    if (data.year && Number(data.year) <= 2018) base *= 0.86;

    if (data.mileage && Number(data.mileage) > 150000) base *= 0.82;
    if (data.mileage && Number(data.mileage) < 30000) base *= 1.08;

    if (data.condition === "excellent") base *= 1.1;
    if (data.condition === "damaged") base *= 0.65;

    if (data.exportDemand) base *= 1.08;
    if (data.lowSupply) base *= 1.07;
    if (data.urgentSale) base *= 0.95;

    const suggestedPrice = Number(base.toFixed(2));

    let confidence = 50;
    if (data.make) confidence += 8;
    if (data.model) confidence += 8;
    if (data.year) confidence += 8;
    if (data.mileage) confidence += 8;
    if (data.condition) confidence += 8;
    if (data.marketPrice) confidence += 10;

    confidence = this.clamp(confidence);

    return (this.prisma as any).vehicleValuation.create({
      data: {
        vehicleId: data.vehicleId,
        title: data.title || "AI Vehicle Valuation",
        make: data.make,
        model: data.model,
        year: data.year ? Number(data.year) : null,
        mileage: data.mileage ? Number(data.mileage) : null,
        condition: data.condition,
        marketPrice: Number(data.marketPrice || 0),
        suggestedPrice,
        confidence,
        reason: "AI valuation calculated from year, mileage, condition, demand, supply and market price.",
        factors: data,
      },
    });
  }

  listValuations() {
    return (this.prisma as any).vehicleValuation.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
