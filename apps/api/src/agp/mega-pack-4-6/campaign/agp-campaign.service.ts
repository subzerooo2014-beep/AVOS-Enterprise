import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  Campaign,
  CampaignStatus,
} from "../contracts/agp-growth-commercial.contracts";

@Injectable()
export class AgpCampaignService {
  private readonly campaigns = new Map<string, Campaign>();

  create(input: Omit<Campaign, "id" | "status" | "createdAt" | "updatedAt" | "requiresHumanApproval">): Campaign {
    const now = new Date().toISOString();
    const campaign: Campaign = {
      ...input,
      id: `agp-campaign:${randomUUID()}`,
      channels: [...input.channels],
      audienceIds: [...input.audienceIds],
      metrics: input.metrics.map((metric) => ({ ...metric })),
      status: "draft",
      requiresHumanApproval: true,
      createdAt: now,
      updatedAt: now,
    };

    this.campaigns.set(campaign.id, campaign);
    return this.clone(campaign);
  }

  updateStatus(
    id: string,
    status: CampaignStatus,
    approvedBy?: string,
  ): Campaign {
    const campaign = this.require(id);

    if (["scheduled", "active"].includes(status) && !approvedBy) {
      throw new Error("Human approval is required before scheduling or activating a campaign.");
    }

    campaign.status = status;
    campaign.approvedBy = approvedBy ?? campaign.approvedBy;
    campaign.updatedAt = new Date().toISOString();
    return this.clone(campaign);
  }

  addMetric(
    id: string,
    metric: { name: string; value: number; target?: number; unit: string },
  ): Campaign {
    const campaign = this.require(id);
    const existing = campaign.metrics.find((item) => item.name === metric.name);
    if (existing) {
      Object.assign(existing, metric);
    } else {
      campaign.metrics.push({ ...metric });
    }
    campaign.updatedAt = new Date().toISOString();
    return this.clone(campaign);
  }

  get(id: string): Campaign {
    return this.clone(this.require(id));
  }

  list(): Campaign[] {
    return [...this.campaigns.values()].map((campaign) => this.clone(campaign));
  }

  health() {
    const campaigns = this.list();
    return {
      status: "operational",
      total: campaigns.length,
      active: campaigns.filter((item) => item.status === "active").length,
      scheduled: campaigns.filter((item) => item.status === "scheduled").length,
      completed: campaigns.filter((item) => item.status === "completed").length,
      humanFinalAuthority: campaigns.every(
        (item) => item.requiresHumanApproval,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private require(id: string): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new NotFoundException(`Campaign not found: ${id}`);
    }
    return campaign;
  }

  private clone(campaign: Campaign): Campaign {
    return JSON.parse(JSON.stringify(campaign)) as Campaign;
  }
}