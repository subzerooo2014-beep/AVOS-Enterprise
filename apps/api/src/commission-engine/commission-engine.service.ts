import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CommissionEngineService {
  constructor(private prisma: PrismaService) {}

  createPolicy(data: any) {
    return (this.prisma as any).commissionPolicy.create({
      data: {
        name: data.name,
        dealType: data.dealType || "standard",
        percent: Number(data.percent || 1.5),
        minFee: Number(data.minFee || 0),
        maxFee: data.maxFee ? Number(data.maxFee) : null,
        active: data.active !== false,
        metadata: data.metadata || {},
      },
    });
  }

  listPolicies() {
    return (this.prisma as any).commissionPolicy.findMany({ orderBy: { createdAt: "desc" } });
  }

  async calculate(data: any) {
    const saleAmount = Number(data.saleAmount || 0);
    let percent = Number(data.percent || 1.5);
    let minFee = Number(data.minFee || 0);
    let maxFee = data.maxFee ? Number(data.maxFee) : null;
    let policyId = data.policyId;

    if (policyId) {
      const policy = await (this.prisma as any).commissionPolicy.findUnique({ where: { id: policyId } });
      if (policy) {
        percent = Number(policy.percent || percent);
        minFee = Number(policy.minFee || minFee);
        maxFee = policy.maxFee ? Number(policy.maxFee) : maxFee;
      }
    }

    let commission = (saleAmount * percent) / 100;
    if (commission < minFee) commission = minFee;
    if (maxFee !== null && commission > maxFee) commission = maxFee;

    commission = Number(commission.toFixed(2));

    return (this.prisma as any).commissionRecord.create({
      data: {
        dealId: data.dealId,
        policyId,
        saleAmount,
        commission,
        currency: data.currency || "AED",
        status: "pending",
        reason: "Success fee calculated when AVOS contributes to completing the deal.",
      },
    });
  }

  listRecords() {
    return (this.prisma as any).commissionRecord.findMany({ orderBy: { createdAt: "desc" } });
  }
}
