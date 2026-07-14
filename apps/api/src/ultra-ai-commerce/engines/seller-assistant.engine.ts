import { Injectable } from "@nestjs/common";

@Injectable()
export class SellerAssistantEngine {
  advise(input: { askingPrice: number; marketAveragePrice: number; daysListed: number; leadCount: number }) {
    const overpriced = input.askingPrice > input.marketAveragePrice * 1.08;
    const stale = input.daysListed > 30;
    const lowLeads = input.leadCount < 3;
    const actions: string[] = [];
    if (overpriced) actions.push("reduce_price");
    if (stale) actions.push("refresh_listing");
    if (lowLeads) actions.push("boost_distribution");
    if (!actions.length) actions.push("keep_strategy");
    return { actions, priority: actions.length > 2 ? "HIGH" : actions.length > 1 ? "MEDIUM" : "LOW" };
  }
}
