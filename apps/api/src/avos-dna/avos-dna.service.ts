import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AvosDnaService {
  constructor(private prisma: PrismaService) {}

  async seedDefaults() {
    const rules = [
      {
        key: "trust-first",
        category: "trust",
        title: "Trust First",
        description: "Every decision must increase user trust or reduce risk.",
        priority: 100,
      },
      {
        key: "ai-first",
        category: "ai",
        title: "AI First",
        description: "Every major workflow should be AI-ready, explainable, and measurable.",
        priority: 95,
      },
      {
        key: "global-first",
        category: "global",
        title: "Global First",
        description: "The platform must support export, multi-country, multi-language and multi-currency growth.",
        priority: 90,
      },
      {
        key: "business-first",
        category: "business",
        title: "Business First",
        description: "Every feature should improve revenue, speed, trust, automation or ecosystem value.",
        priority: 90,
      },
      {
        key: "explainable-ai",
        category: "ai",
        title: "Explainable AI",
        description: "AI must explain why it recommends, blocks, ranks or promotes something.",
        priority: 95,
      },
    ];

    const saved = [];

    for (const rule of rules) {
      const existing = await (this.prisma as any).avosDnaRule.findUnique({
        where: { key: rule.key },
      });

      if (existing) {
        saved.push(existing);
      } else {
        saved.push(await (this.prisma as any).avosDnaRule.create({ data: rule }));
      }
    }

    return saved;
  }

  list() {
    return (this.prisma as any).avosDnaRule.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });
  }
}
