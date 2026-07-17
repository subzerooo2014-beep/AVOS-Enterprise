import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { IncentiveType, KnowledgeIncentive } from "./knowledge-economy.types";

@Injectable()
export class KnowledgeIncentiveService {
  private readonly incentives: KnowledgeIncentive[] = [];

  grant(stakeholderId: string, assetId: string, type: IncentiveType, points: number, reason: string): KnowledgeIncentive {
    const incentive: KnowledgeIncentive = { id: randomUUID(), stakeholderId, assetId, type, points: Math.max(0, points), reason, createdAt: new Date().toISOString() };
    this.incentives.push(incentive);
    return structuredClone(incentive);
  }

  score(stakeholderId: string): number {
    return this.incentives.filter((item) => item.stakeholderId === stakeholderId).reduce((sum, item) => sum + item.points, 0);
  }

  list(stakeholderId?: string): KnowledgeIncentive[] {
    return this.incentives.filter((item) => !stakeholderId || item.stakeholderId === stakeholderId).map((item) => structuredClone(item));
  }
}