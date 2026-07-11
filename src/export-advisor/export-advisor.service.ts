import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ExportAdvisorService {
  constructor(private prisma: PrismaService) {}

  private clamp(v: number) {
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  async advise(data: any) {
    let demandScore = 50;
    let readinessScore = 50;

    if (data.highDemand) demandScore += 25;
    if (data.lowCompetition) demandScore += 15;
    if (data.targetCountry) demandScore += 5;
    if (data.documentsReady) readinessScore += 20;
    if (data.shippingReady) readinessScore += 20;
    if (data.inspectionReady) readinessScore += 10;

    if (data.missingDocuments) readinessScore -= 25;
    if (data.highShippingCost) demandScore -= 10;

    demandScore = this.clamp(demandScore);
    readinessScore = this.clamp(readinessScore);

    const estimatedCost = Number(data.estimatedCost || 0);
    const expectedSalePrice = Number(data.expectedSalePrice || 0);
    const purchasePrice = Number(data.purchasePrice || 0);
    const estimatedProfit = Number((expectedSalePrice - purchasePrice - estimatedCost).toFixed(2));

    return (this.prisma as any).exportAdvice.create({
      data: {
        vehicleId: data.vehicleId,
        targetCountry: data.targetCountry || "unknown",
        demandScore,
        readinessScore,
        estimatedCost,
        estimatedProfit,
        recommendation:
          demandScore >= 75 && readinessScore >= 70
            ? "Strong export opportunity. Start buyer targeting and shipping offers."
            : "Needs improvement before export campaign.",
        factors: data,
      },
    });
  }

  list() {
    return (this.prisma as any).exportAdvice.findMany({ orderBy: { createdAt: "desc" } });
  }
}
