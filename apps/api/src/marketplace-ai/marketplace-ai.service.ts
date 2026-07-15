import { Injectable } from "@nestjs/common";
import {
  RecommendationRequest,
  SearchItem,
  SearchRequest,
  SearchResult,
} from "./marketplace-ai.types";

@Injectable()
export class MarketplaceAiService {
  private readonly items = new Map<string, SearchItem>();

  upsertItem(item: SearchItem): SearchItem {
    this.items.set(item.id, {
      ...item,
      attributes: { ...item.attributes },
    });

    return {
      ...item,
      attributes: { ...item.attributes },
    };
  }

  search(request: SearchRequest): SearchResult[] {
    const query = request.query.trim().toLowerCase();

    return Array.from(this.items.values())
      .filter((item) => item.active)
      .filter((item) => !request.industryKey || item.industryKey === request.industryKey)
      .filter((item) => !request.entityType || item.entityType === request.entityType)
      .filter((item) => request.minPrice === undefined || item.price >= request.minPrice)
      .filter((item) => request.maxPrice === undefined || item.price <= request.maxPrice)
      .map((item) => {
        let score = item.trustScore;
        const reasons: string[] = ["trust score"];

        const haystack = `${item.title} ${item.description}`.toLowerCase();

        if (query && haystack.includes(query)) {
          score += 30;
          reasons.push("text match");
        }

        for (const [key, value] of Object.entries(request.attributes ?? {})) {
          if (item.attributes[key] === value) {
            score += 10;
            reasons.push(`attribute match: ${key}`);
          }
        }

        return {
          item: {
            ...item,
            attributes: { ...item.attributes },
          },
          score: Math.min(score, 100),
          reasons,
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  recommend(request: RecommendationRequest): SearchResult[] {
    return Array.from(this.items.values())
      .filter((item) => item.active && item.industryKey === request.industryKey)
      .map((item) => {
        let score = item.trustScore;
        const reasons: string[] = ["industry fit", "trust score"];

        for (const [key, value] of Object.entries(request.preferences)) {
          if (item.attributes[key] === value) {
            score += 12;
            reasons.push(`preference match: ${key}`);
          }
        }

        if ((request.viewedItemIds ?? []).includes(item.id)) {
          score += 5;
          reasons.push("previously viewed");
        }

        return {
          item: {
            ...item,
            attributes: { ...item.attributes },
          },
          score: Math.min(score, 100),
          reasons,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  dashboard() {
    const items = Array.from(this.items.values());

    return {
      system: "AVOS Marketplace AI",
      indexedItems: items.length,
      activeItems: items.filter((item) => item.active).length,
      industries: new Set(items.map((item) => item.industryKey)).size,
      generatedAt: new Date().toISOString(),
    };
  }
}