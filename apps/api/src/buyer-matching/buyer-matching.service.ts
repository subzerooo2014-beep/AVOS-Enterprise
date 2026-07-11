import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BuyerMatchingService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  async createLead(data: any) {
    let qualityScore = 50;

    if (data.phone) qualityScore += 10;
    if (data.email) qualityScore += 10;
    if (data.country) qualityScore += 10;
    if (data.interest) qualityScore += 10;
    if (data.readyToBuy) qualityScore += 20;
    if (data.exportBuyer) qualityScore += 10;

    qualityScore = this.clamp(qualityScore);

    return (this.prisma as any).buyerLead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        city: data.city,
        interest: data.interest,
        targetType: data.targetType,
        targetId: data.targetId,
        qualityScore,
        status: qualityScore >= 75 ? "qualified" : "new",
        metadata: data.metadata || {},
      },
    });
  }

  listLeads() {
    return (this.prisma as any).buyerLead.findMany({ orderBy: { createdAt: "desc" } });
  }

  async matchBuyer(leadId: string, data: any) {
    const lead = await (this.prisma as any).buyerLead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException("Buyer lead not found");

    let score = Number(lead.qualityScore || 50);

    if (lead.targetType === data.targetType) score += 10;
    if (lead.targetId === data.targetId) score += 20;
    if (data.sameCountry) score += 10;
    if (data.exportMatch) score += 15;
    if (data.budgetMatch) score += 15;
    if (data.urgentDemand) score += 10;

    score = this.clamp(score);

    return (this.prisma as any).buyerMatch.create({
      data: {
        buyerLeadId: leadId,
        targetType: data.targetType,
        targetId: data.targetId,
        matchScore: score,
        reason:
          score >= 80
            ? "Strong buyer match detected by AVOS AI."
            : score >= 60
              ? "Medium buyer match; recommended for follow-up."
              : "Weak buyer match; collect more data before sending to seller.",
        status: score >= 75 ? "high_match" : "suggested",
        metadata: {
          leadCountry: lead.country,
          buyerInterest: lead.interest,
          aiReason: "Calculated from lead quality, target match, export demand and budget fit.",
        },
      },
    });
  }

  listMatches() {
    return (this.prisma as any).buyerMatch.findMany({ orderBy: { createdAt: "desc" } });
  }
}
