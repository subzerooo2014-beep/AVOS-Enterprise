import { Injectable, NotFoundException } from "@nestjs/common";
import {
  DealRecord,
  DealStage,
  NegotiationRecord,
  ServiceStatus,
} from "./super-app-v3.types";

@Injectable()
export class SuperAppV3DealService {
  private readonly deals = new Map<string, DealRecord>();

  create(input: {
    buyerId: string;
    sellerId: string;
    vehicleId: string;
    askingPrice: number;
    trustScore?: number;
    fraudRisk?: number;
  }): DealRecord {
    const now = new Date().toISOString();
    const id = `deal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const deal: DealRecord = {
      id,
      buyerId: input.buyerId,
      sellerId: input.sellerId,
      vehicleId: input.vehicleId,
      askingPrice: input.askingPrice,
      stage: "MATCHED",
      reservationStatus: "NOT_STARTED",
      inspectionStatus: "NOT_STARTED",
      financingStatus: "NOT_STARTED",
      insuranceStatus: "NOT_STARTED",
      paymentStatus: "NOT_STARTED",
      trustScore: input.trustScore ?? 80,
      fraudRisk: input.fraudRisk ?? 10,
      timeline: [
        {
          stage: "MATCHED",
          status: "COMPLETED",
          note: "Buyer and vehicle matched by AVOS.",
          createdAt: now,
        },
      ],
      negotiations: [],
      createdAt: now,
      updatedAt: now,
    };

    this.deals.set(id, deal);
    return deal;
  }

  list(): DealRecord[] {
    return [...this.deals.values()];
  }

  get(id: string): DealRecord {
    const deal = this.deals.get(id);
    if (!deal) throw new NotFoundException(`Deal ${id} not found`);
    return deal;
  }

  negotiate(
    id: string,
    input: {
      actor: "BUYER" | "SELLER" | "AZM";
      amount: number;
      message?: string;
      accept?: boolean;
    },
  ): DealRecord {
    const deal = this.get(id);
    const now = new Date().toISOString();

    const record: NegotiationRecord = {
      id: `neg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      dealId: id,
      actor: input.actor,
      amount: input.amount,
      message: input.message ?? "Smart negotiation update",
      createdAt: now,
    };

    deal.negotiations.push(record);
    deal.stage = "NEGOTIATING";

    if (input.accept) {
      deal.agreedPrice = input.amount;
      deal.stage = "RESERVED";
      deal.reservationStatus = "PENDING";
    }

    deal.timeline.push({
      stage: deal.stage,
      status: input.accept ? "COMPLETED" : "ACTIVE",
      note: input.accept
        ? `Offer accepted at ${input.amount}`
        : `New offer submitted at ${input.amount}`,
      createdAt: now,
    });

    deal.updatedAt = now;
    return deal;
  }

  updateService(
    id: string,
    service:
      | "reservation"
      | "inspection"
      | "financing"
      | "insurance"
      | "payment",
    status: ServiceStatus,
  ): DealRecord {
    const deal = this.get(id);
    const now = new Date().toISOString();

    const stageMap: Record<typeof service, DealStage> = {
      reservation: "RESERVED",
      inspection: "INSPECTION",
      financing: "FINANCING",
      insurance: "INSURANCE",
      payment: "PAYMENT",
    };

    const fieldMap = {
      reservation: "reservationStatus",
      inspection: "inspectionStatus",
      financing: "financingStatus",
      insurance: "insuranceStatus",
      payment: "paymentStatus",
    } as const;

    deal[fieldMap[service]] = status;
    deal.stage = stageMap[service];

    if (service === "payment" && status === "COMPLETED") {
      deal.stage = "COMPLETED";
    }

    deal.timeline.push({
      stage: deal.stage,
      status:
        status === "REJECTED"
          ? "FAILED"
          : status === "COMPLETED" || status === "APPROVED"
            ? "COMPLETED"
            : "ACTIVE",
      note: `${service} status changed to ${status}`,
      createdAt: now,
    });

    deal.updatedAt = now;
    return deal;
  }

  dashboard() {
    const deals = this.list();
    return {
      totalDeals: deals.length,
      activeDeals: deals.filter(
        (deal) => !["COMPLETED", "CANCELLED"].includes(deal.stage),
      ).length,
      completedDeals: deals.filter((deal) => deal.stage === "COMPLETED").length,
      highRiskDeals: deals.filter((deal) => deal.fraudRisk >= 70).length,
      averageTrustScore:
        deals.length === 0
          ? 0
          : Math.round(
              deals.reduce((sum, deal) => sum + deal.trustScore, 0) /
                deals.length,
            ),
      stages: deals.reduce<Record<string, number>>((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }
}
