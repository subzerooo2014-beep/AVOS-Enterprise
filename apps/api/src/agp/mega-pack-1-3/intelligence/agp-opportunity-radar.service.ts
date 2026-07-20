import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GrowthOpportunity,
  GrowthSignal,
} from "../contracts/agp-intelligence.contracts";
import { AgpEventBusService } from "../events/agp-event-bus.service";
import { AgpRuntimeService } from "../runtime/agp-runtime.service";

@Injectable()
export class AgpOpportunityRadarService {
  private readonly opportunities: GrowthOpportunity[] = [];

  constructor(
    private readonly events: AgpEventBusService,
    private readonly runtime: AgpRuntimeService,
  ) {}

  scan(input: {
    title: string;
    category: string;
    description: string;
    signals: GrowthSignal[];
  }): GrowthOpportunity {
    const confidence =
      input.signals.length === 0
        ? 0.5
        : input.signals.reduce((sum, signal) => sum + signal.confidence, 0) /
          input.signals.length;

    const expectedImpact =
      input.signals.reduce((sum, signal) => sum + signal.value, 0) /
      Math.max(input.signals.length, 1);

    const score = Math.max(
      0,
      Math.min(100, Math.round(confidence * 60 + expectedImpact * 0.4)),
    );

    const priority: GrowthOpportunity["priority"] =
      score >= 85
        ? "critical"
        : score >= 70
          ? "high"
          : score >= 50
            ? "medium"
            : "low";

    const opportunity: GrowthOpportunity = {
      id: `agp-opportunity:${randomUUID()}`,
      title: input.title,
      category: input.category,
      description: input.description,
      score,
      priority,
      confidence: Number(confidence.toFixed(4)),
      expectedImpact: Number(expectedImpact.toFixed(2)),
      risk: confidence >= 0.8 ? "low" : confidence >= 0.6 ? "medium" : "high",
      evidence: input.signals.flatMap((signal) => signal.evidence),
      recommendedActions: [
        "Validate evidence quality.",
        "Run controlled experiment.",
        "Require human approval before production execution.",
      ],
      requiresHumanApproval: true,
      status: "identified",
      createdAt: new Date().toISOString(),
    };

    this.opportunities.push(opportunity);
    this.runtime.increment("opportunities");
    this.events.publish("agp.opportunity.identified", opportunity, {
      aggregateId: opportunity.id,
    });

    return JSON.parse(JSON.stringify(opportunity)) as GrowthOpportunity;
  }

  list(): GrowthOpportunity[] {
    return this.opportunities.map(
      (item) => JSON.parse(JSON.stringify(item)) as GrowthOpportunity,
    );
  }
}