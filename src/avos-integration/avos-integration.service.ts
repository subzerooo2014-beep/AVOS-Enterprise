import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AvosIntegrationService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  async vehicleCreated(data: any) {
    const vehicleId = data.vehicleId || data.id || "manual-vehicle";
    const steps: string[] = [];

    const event = await (this.prisma as any).platformEvent.create({
      data: {
        type: "vehicle.created",
        source: "avos-integration",
        entityType: "vehicle",
        entityId: vehicleId,
        status: "processed",
        payload: data,
        result: { message: "Vehicle creation event integrated with AVOS AI." },
      },
    });
    steps.push("platform_event_created");

    const kernel = await (this.prisma as any).kernelDecision.create({
      data: {
        eventType: "vehicle.created",
        entityType: "vehicle",
        entityId: vehicleId,
        decision: "execute_vehicle_ai_workflow",
        confidence: 85,
        reason: "Vehicle created: run valuation, fraud, trust, marketing, buyer matching and export checks.",
        actions: [
          "run_vehicle_valuation",
          "run_fraud_assessment",
          "run_trust_profile",
          "run_marketing_campaign",
          "run_buyer_matching",
          "run_export_advisor_if_needed"
        ],
        status: "approved",
      },
    });
    steps.push("kernel_decision_created");

    const valuation = await (this.prisma as any).vehicleValuation.create({
      data: {
        vehicleId,
        title: data.title || "AI Vehicle Valuation",
        make: data.make,
        model: data.model,
        year: data.year ? Number(data.year) : null,
        mileage: data.mileage ? Number(data.mileage) : null,
        condition: data.condition,
        marketPrice: Number(data.marketPrice || data.price || 0),
        suggestedPrice: Number(data.price || data.marketPrice || 0),
        confidence: this.clamp(50 + (data.make ? 10 : 0) + (data.model ? 10 : 0) + (data.year ? 10 : 0) + (data.mileage ? 10 : 0)),
        reason: "Initial valuation created automatically when vehicle was added.",
        factors: data,
      },
    });
    steps.push("vehicle_valuation_created");

    const fraudScore = this.clamp(
      20 +
      (data.missingDocuments ? 20 : 0) +
      (data.priceTooLow ? 20 : 0) +
      (data.duplicateListing ? 25 : 0) -
      (data.verified ? 15 : 0)
    );

    const fraud = await (this.prisma as any).fraudAssessment.create({
      data: {
        entityType: "vehicle",
        entityId: vehicleId,
        fraudScore,
        level: fraudScore >= 75 ? "high" : fraudScore >= 45 ? "medium" : "low",
        decision: fraudScore >= 75 ? "manual_review" : "allow",
        reason: "Automatic fraud check after vehicle creation.",
        signals: data,
      },
    });
    steps.push("fraud_assessment_created");

    const trustScore = this.clamp(50 + (data.verified ? 20 : 0) + (data.documentsReady ? 15 : 0) - (data.missingDocuments ? 20 : 0));

    const trust = await (this.prisma as any).trustProfile.create({
      data: {
        entityType: "vehicle",
        entityId: vehicleId,
        trustScore,
        riskScore: 100 - trustScore,
        reputationScore: trustScore,
        dealScore: trustScore,
        verified: !!data.verified,
        summary: "Vehicle trust profile generated automatically.",
        factors: data,
      },
    });
    steps.push("trust_profile_created");

    const campaign = await (this.prisma as any).aiCampaign.create({
      data: {
        title: `AI Campaign for ${data.title || "Vehicle"}`,
        targetType: "vehicle",
        targetId: vehicleId,
        campaignType: "auto_vehicle_launch",
        status: "draft",
        goal: "find_best_buyer",
        audience: {
          countries: data.targetCountries || [data.country || "UAE"],
          buyerType: data.exportOnly ? "export_buyer" : "local_buyer",
        },
        channels: ["website", "social", "search"],
        budget: 0,
        expectedReach: 3000,
        expectedLeads: 75,
        performanceScore: 50,
        aiStrategy: {
          message: "If AVOS can reach the seller intelligently, it can reach the buyer intelligently.",
        },
      },
    });
    steps.push("marketing_campaign_created");

    const buyerLead = await (this.prisma as any).buyerLead.create({
      data: {
        name: "AI Suggested Buyer Segment",
        country: data.targetCountry || data.country || "UAE",
        interest: data.make || data.model || "vehicle",
        targetType: "vehicle",
        targetId: vehicleId,
        qualityScore: data.exportOnly ? 75 : 65,
        status: data.exportOnly ? "qualified" : "new",
        metadata: {
          source: "AVOS Integration",
          reason: "Buyer segment generated automatically after vehicle creation.",
        },
      },
    });
    steps.push("buyer_lead_created");

    let exportAdvice = null;
    if (data.exportOnly || data.targetCountry || data.targetCountries) {
      exportAdvice = await (this.prisma as any).exportAdvice.create({
        data: {
          vehicleId,
          targetCountry: data.targetCountry || (Array.isArray(data.targetCountries) ? data.targetCountries[0] : "global"),
          demandScore: data.exportDemand ? 80 : 60,
          readinessScore: data.documentsReady ? 75 : 50,
          estimatedCost: Number(data.estimatedExportCost || 0),
          estimatedProfit: Number(data.estimatedProfit || 0),
          recommendation: "Export vehicle detected. Start global buyer matching and shipping provider search.",
          factors: data,
        },
      });
      steps.push("export_advice_created");
    }

    const brainTaskTypes = [
      "vehicle_valuation",
      "fraud_assessment",
      "trust_profile",
      "marketing_campaign",
      "buyer_matching",
      data.exportOnly ? "export_advisor" : "local_sale_optimizer",
    ];

    for (const taskType of brainTaskTypes) {
      await (this.prisma as any).brainTask.create({
        data: {
          eventId: event.id,
          taskType,
          entityType: "vehicle",
          entityId: vehicleId,
          status: "completed",
          priority: taskType.includes("fraud") ? "high" : "medium",
          input: data,
          output: { completedBy: "avos-integration-pack-1" },
          reason: `Auto task created for ${taskType}.`,
        },
      });
    }
    steps.push("brain_tasks_created");

    return (this.prisma as any).integrationRun.create({
      data: {
        flow: "vehicle.created.ai.integration",
        entityType: "vehicle",
        entityId: vehicleId,
        status: "completed",
        steps,
        result: {
          eventId: event.id,
          kernelDecisionId: kernel.id,
          valuationId: valuation.id,
          fraudAssessmentId: fraud.id,
          trustProfileId: trust.id,
          campaignId: campaign.id,
          buyerLeadId: buyerLead.id,
          exportAdviceId: exportAdvice?.id || null,
        },
      },
    });
  }

  listRuns() {
    return (this.prisma as any).integrationRun.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
