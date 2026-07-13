import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleIntelligencePlatformRegistryService {
  listCapabilities() {
    return [
      "enterprise-intelligence",
      "ultra-intelligence",
      "autonomous-intelligence",
      "evolution-intelligence",
      "buyer-intelligence",
      "dealer-intelligence",
      "recommendation-intelligence",
      "inspection-workflow",
      "smart-rules",
      "lead-intelligence",
      "marketplace-ranking",
      "trust-intelligence",
      "sales-intelligence",
      "export-intelligence",
      "financing-intelligence",
      "insurance-intelligence",
      "notification-intelligence",
      "enterprise-workflow",
      "ai-decision-flow",
      "demand-forecasting",
      "dynamic-pricing",
      "inventory-optimization",
      "fraud-orchestration",
      "compliance-intelligence",
      "logistics-intelligence",
      "auction-intelligence",
      "trade-in-intelligence",
      "warranty-intelligence",
      "partner-intelligence",
      "retention-intelligence",
      "revenue-optimization",
      "mobility-dna-graph",
      "context-memory-engine",
      "dynamic-regulation-engine",
      "scenario-simulator",
      "capability-fusion",
      "zero-touch-business-flow",
      "collaboration-mesh",
      "digital-memory-vault",
      "platform-evolution-index",
    ];
  }
}
