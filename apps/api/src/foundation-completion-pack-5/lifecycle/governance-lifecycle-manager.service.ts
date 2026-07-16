import { Injectable } from "@nestjs/common";
import {
  CapabilityLifecycleStage,
  IdeaLifecycleStage,
  LifecycleAssetType,
  LifecycleRecord,
  ProductLifecycleStage
} from "../foundation-pack-5.types";

@Injectable()
export class GovernanceLifecycleManagerService {
  private readonly records: LifecycleRecord[] = [];

  list() {
    return [...this.records];
  }

  transition(input: {
    assetId: string;
    assetType: LifecycleAssetType;
    stage:
      | CapabilityLifecycleStage
      | ProductLifecycleStage
      | IdeaLifecycleStage;
    previousStage?: string;
    reason: string;
    changedByIdentityId: string;
    humanApprovalRequired: boolean;
  }) {
    const record: LifecycleRecord = {
      id: `lifecycle:${Date.now()}:${this.records.length + 1}`,
      ...input,
      changedAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  history(assetId: string) {
    return this.records
      .filter((record) => record.assetId === assetId)
      .sort((left, right) => left.changedAt.localeCompare(right.changedAt));
  }

  summary() {
    return {
      totalTransitions: this.records.length,
      capabilities: this.records.filter(
        (record) => record.assetType === "capability"
      ).length,
      products: this.records.filter(
        (record) => record.assetType === "product"
      ).length,
      ideas: this.records.filter((record) => record.assetType === "idea")
        .length,
      humanApprovalRequired: this.records.filter(
        (record) => record.humanApprovalRequired
      ).length
    };
  }
}
