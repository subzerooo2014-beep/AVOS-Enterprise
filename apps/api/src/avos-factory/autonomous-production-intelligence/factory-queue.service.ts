import { Injectable } from "@nestjs/common";
import { FactoryPriority, FactoryWorkItem } from "./factory-intelligence.contracts";

@Injectable()
export class FactoryQueueService {
  private readonly items = new Map<string, FactoryWorkItem>();

  add(item: FactoryWorkItem): void {
    this.items.set(item.id, item);
  }

  get(id: string): FactoryWorkItem | undefined {
    return this.items.get(id);
  }

  all(): FactoryWorkItem[] {
    return [...this.items.values()];
  }

  next(): FactoryWorkItem | undefined {
    const rank: Record<FactoryPriority, number> = {
      critical: 4,
      high: 3,
      normal: 2,
      low: 1,
    };

    return this.all()
      .filter((item) => item.status === "queued" || item.status === "planned")
      .sort((a, b) => {
        const priority = rank[b.priority] - rank[a.priority];
        return priority !== 0
          ? priority
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })[0];
  }

  depth(): number {
    return this.all().filter((item) =>
      ["queued", "planned", "awaiting-approval"].includes(item.status),
    ).length;
  }
}
