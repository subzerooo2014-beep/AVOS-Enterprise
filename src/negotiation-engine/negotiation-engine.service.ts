import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NegotiationEngineService {
  constructor(private prisma: PrismaService) {}

  createSession(data: any) {
    const asking = Number(data.askingPrice || 0);
    const offer = Number(data.offerPrice || 0);
    const gap = asking > 0 ? ((asking - offer) / asking) * 100 : 0;

    return (this.prisma as any).negotiationSession.create({
      data: {
        dealId: data.dealId,
        sellerId: data.sellerId,
        buyerId: data.buyerId,
        askingPrice: asking,
        offerPrice: offer,
        status: "open",
        aiAdvice:
          gap <= 5
            ? "Offer is close. Recommend closing the deal."
            : gap <= 15
              ? "Negotiate with a small counter offer."
              : "Offer is low. Ask buyer to improve or provide financing options.",
        metadata: { gapPercent: Number(gap.toFixed(2)) },
      },
    });
  }

  async counterOffer(id: string, body: any) {
    const session = await (this.prisma as any).negotiationSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException("Negotiation session not found");

    const asking = Number(session.askingPrice || 0);
    const offer = Number(body.offerPrice || session.offerPrice || 0);
    const gap = asking > 0 ? ((asking - offer) / asking) * 100 : 0;

    return (this.prisma as any).negotiationSession.update({
      where: { id },
      data: {
        offerPrice: offer,
        aiAdvice:
          gap <= 5
            ? "Accept recommended."
            : gap <= 12
              ? "Send counter offer with value justification."
              : "Do not accept yet. Buyer quality and market demand should be checked.",
        metadata: {
          ...(session.metadata || {}),
          lastCounterOffer: body,
          gapPercent: Number(gap.toFixed(2)),
        },
      },
    });
  }

  list() {
    return (this.prisma as any).negotiationSession.findMany({ orderBy: { createdAt: "desc" } });
  }
}
