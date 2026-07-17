import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeExchangeOffer } from "./knowledge-exchange.types";

@Injectable()
export class KnowledgeExchangeRoutingService {
  private readonly offers: KnowledgeExchangeOffer[] = [];
  private cursor = 0;

  publishOffer(input: Omit<KnowledgeExchangeOffer, "id" | "createdAt">): KnowledgeExchangeOffer {
    const offer: KnowledgeExchangeOffer = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    this.offers.push(offer);
    return offer;
  }

  discover(namespace: string): KnowledgeExchangeOffer[] {
    return this.offers
      .filter((offer) => offer.enabled && offer.namespace === namespace)
      .sort((left, right) => left.priority - right.priority);
  }

  select(namespace: string): KnowledgeExchangeOffer | undefined {
    const offers = this.discover(namespace);
    if (offers.length === 0) return undefined;
    if (offers[0].strategy !== "ROUND_ROBIN") return offers[0];
    const selected = offers[this.cursor % offers.length];
    this.cursor += 1;
    return selected;
  }

  list(): KnowledgeExchangeOffer[] { return [...this.offers]; }
  count(): number { return this.offers.length; }
}