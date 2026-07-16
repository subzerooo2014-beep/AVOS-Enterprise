import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { F3_CAPABILITIES } from "./enterprise-ultimate-f3.registry";
import {
  F3Advertisement,
  F3BuyerIntent,
  F3MarketSignal,
  F3TimelineEvent,
} from "./enterprise-ultimate-f3.types";

@Injectable()
export class EnterpriseUltimateF3Service {
  private readonly advertisements = new Map<string, F3Advertisement>();
  private readonly signals = new Map<string, F3MarketSignal>();
  private readonly buyerIntents = new Map<string, F3BuyerIntent>();
  private readonly timeline = new Map<string, F3TimelineEvent>();

  framework() {
    return {
      system: "AVOS Enterprise Ultimate Mega Bundle F3",
      version: "1.0.0",
      status: "READY",
      capabilityCount: Object.keys(F3_CAPABILITIES).length,
      capabilities: structuredClone(F3_CAPABILITIES),
    };
  }

  createAdvertisement(
    input: Omit<
      F3Advertisement,
      | "id"
      | "status"
      | "views"
      | "favorites"
      | "messages"
      | "calls"
      | "healthScore"
      | "trustScore"
      | "salesProbability"
      | "marketRank"
      | "createdAt"
      | "updatedAt"
    >,
  ) {
    if (input.price < 0) throw new Error("Price cannot be negative");

    const now = new Date().toISOString();
    const item: F3Advertisement = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      views: 0,
      favorites: 0,
      messages: 0,
      calls: 0,
      healthScore: 60,
      trustScore: 50,
      salesProbability: 35,
      marketRank: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.advertisements.set(item.id, item);
    this.addTimeline(item.tenantId, "ADVERTISEMENT", item.id, "CREATED", "Advertisement created");
    return { ...item };
  }

  publishAdvertisement(id: string) {
    const item = this.requireAdvertisement(id);
    item.status = "PUBLISHED";
    item.updatedAt = new Date().toISOString();
    this.recalculate(item);
    this.advertisements.set(id, item);
    this.addTimeline(item.tenantId, "ADVERTISEMENT", id, "PUBLISHED", "Advertisement published");
    return { ...item };
  }

  recordEngagement(
    id: string,
    input: { views?: number; favorites?: number; messages?: number; calls?: number },
  ) {
    const item = this.requireAdvertisement(id);
    item.views += input.views ?? 0;
    item.favorites += input.favorites ?? 0;
    item.messages += input.messages ?? 0;
    item.calls += input.calls ?? 0;
    item.updatedAt = new Date().toISOString();
    this.recalculate(item);
    this.advertisements.set(id, item);
    return { ...item };
  }

  updatePrice(id: string, price: number) {
    if (price < 0) throw new Error("Price cannot be negative");
    const item = this.requireAdvertisement(id);
    const oldPrice = item.price;
    item.price = price;
    item.updatedAt = new Date().toISOString();
    this.recalculate(item);
    this.advertisements.set(id, item);
    this.addTimeline(
      item.tenantId,
      "ADVERTISEMENT",
      id,
      "PRICE_CHANGED",
      `Price changed from ${oldPrice} to ${price}`,
      { oldPrice, newPrice: price },
    );
    return { ...item };
  }

  createMarketSignal(input: Omit<F3MarketSignal, "id" | "createdAt">) {
    if (input.score < 0 || input.score > 100) {
      throw new Error("Signal score must be between 0 and 100");
    }

    const signal: F3MarketSignal = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.signals.set(signal.id, signal);
    return { ...signal };
  }

  createBuyerIntent(
    input: Omit<F3BuyerIntent, "id" | "matchedAdvertisementIds" | "createdAt" | "updatedAt">,
  ) {
    if (input.intentScore < 0 || input.intentScore > 100) {
      throw new Error("Intent score must be between 0 and 100");
    }

    const matches = Array.from(this.advertisements.values())
      .filter((item) => item.tenantId === input.tenantId)
      .filter((item) => item.price >= input.budgetMin && item.price <= input.budgetMax)
      .map((item) => item.id);

    const now = new Date().toISOString();
    const intent: F3BuyerIntent = {
      ...input,
      id: randomUUID(),
      matchedAdvertisementIds: matches,
      createdAt: now,
      updatedAt: now,
    };

    this.buyerIntents.set(intent.id, intent);
    return { ...intent, matchedAdvertisementIds: [...intent.matchedAdvertisementIds] };
  }

  compareAdvertisements(firstId: string, secondId: string) {
    const first = this.requireAdvertisement(firstId);
    const second = this.requireAdvertisement(secondId);

    return {
      first: { ...first },
      second: { ...second },
      winner:
        first.healthScore + first.trustScore + first.salesProbability >=
        second.healthScore + second.trustScore + second.salesProbability
          ? first.id
          : second.id,
      comparison: {
        priceDifference: first.price - second.price,
        healthDifference: first.healthScore - second.healthScore,
        trustDifference: first.trustScore - second.trustScore,
        probabilityDifference: first.salesProbability - second.salesProbability,
      },
    };
  }

  advertisement360(id: string) {
    const item = this.requireAdvertisement(id);
    const events = Array.from(this.timeline.values()).filter(
      (event) => event.entityType === "ADVERTISEMENT" && event.entityId === id,
    );

    const matchingBuyers = Array.from(this.buyerIntents.values()).filter(
      (intent) => intent.matchedAdvertisementIds.includes(id),
    );

    return {
      advertisement: { ...item },
      timeline: events.map((event) => ({ ...event, metadata: { ...event.metadata } })),
      buyerRadar: {
        matchingBuyers: matchingBuyers.length,
        highIntentBuyers: matchingBuyers.filter((buyer) => buyer.intentScore >= 80).length,
      },
      intelligence: {
        healthScore: item.healthScore,
        trustScore: item.trustScore,
        salesProbability: item.salesProbability,
        marketRank: item.marketRank,
      },
    };
  }

  marketplaceCommandCenter(tenantId?: string) {
    const advertisements = this.filterTenant(
      Array.from(this.advertisements.values()),
      tenantId,
    );
    const signals = this.filterTenant(Array.from(this.signals.values()), tenantId);
    const intents = this.filterTenant(Array.from(this.buyerIntents.values()), tenantId);

    return {
      system: "AVOS Enterprise Ultimate Mega Bundle F3",
      tenantId: tenantId ?? "ALL",
      advertisements: advertisements.length,
      published: advertisements.filter((item) => item.status === "PUBLISHED").length,
      sold: advertisements.filter((item) => item.status === "SOLD").length,
      averageHealthScore: this.average(advertisements.map((item) => item.healthScore)),
      averageTrustScore: this.average(advertisements.map((item) => item.trustScore)),
      averageSalesProbability: this.average(
        advertisements.map((item) => item.salesProbability),
      ),
      marketSignals: signals.length,
      buyerIntents: intents.length,
      highIntentBuyers: intents.filter((item) => item.intentScore >= 80).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private recalculate(item: F3Advertisement) {
    const engagement = item.views + item.favorites * 5 + item.messages * 10 + item.calls * 15;
    item.healthScore = Math.min(100, 60 + Math.floor(engagement / 100));
    item.trustScore = Math.min(100, 50 + Math.floor((item.messages + item.calls) / 2));
    item.salesProbability = Math.min(
      99,
      Math.max(5, Math.round(item.healthScore * 0.45 + item.trustScore * 0.35 + Math.min(20, item.favorites))),
    );
    item.marketRank = Math.max(1, 100 - Math.round(item.salesProbability));
  }

  private addTimeline(
    tenantId: string,
    entityType: F3TimelineEvent["entityType"],
    entityId: string,
    eventType: string,
    title: string,
    metadata: Record<string, string | number | boolean> = {},
  ) {
    const event: F3TimelineEvent = {
      id: randomUUID(),
      tenantId,
      entityType,
      entityId,
      eventType,
      title,
      description: title,
      metadata: { ...metadata },
      createdAt: new Date().toISOString(),
    };
    this.timeline.set(event.id, event);
  }

  private requireAdvertisement(id: string) {
    const item = this.advertisements.get(id);
    if (!item) throw new Error(`Advertisement not found: ${id}`);
    return item;
  }

  private filterTenant<T extends { tenantId: string }>(items: T[], tenantId?: string) {
    return tenantId ? items.filter((item) => item.tenantId === tenantId) : items;
  }

  private average(values: number[]) {
    if (values.length === 0) return 0;
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
  }
}