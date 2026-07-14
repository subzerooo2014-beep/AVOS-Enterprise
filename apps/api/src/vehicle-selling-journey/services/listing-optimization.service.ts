import { Injectable } from "@nestjs/common";
@Injectable()
export class ListingOptimizationService {
  optimize(input: {
    title: string;
    description: string;
    keywords?: string[];
    targetAudience?: string;
  }) {
    const keywords = input.keywords ?? [];
    return {
      optimizedTitle: `${input.title} | موثقة من AVOS`,
      optimizedDescription:
        `${input.description}\n\nمميزات: ${keywords.join("، ")}`,
      seoScore: Math.min(100, 70 + keywords.length * 4),
      targetAudience: input.targetAudience ?? "general",
    };
  }
}
