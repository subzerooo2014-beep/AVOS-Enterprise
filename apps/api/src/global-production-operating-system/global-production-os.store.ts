import { Injectable } from "@nestjs/common";
import {
  CertificationRecord,
  ComplianceEvaluation,
  DisasterRecoveryPlan,
  DigitalTwinSnapshot,
  EconomySnapshot,
  EvolutionProposal,
  FinalReviewRecord,
  GlobalFactoryNode,
  IntelligenceForecast,
  MarketplaceOffer,
  ProductionWorkload,
  ReplicationPlan,
  RoutingDecision
} from "./global-production-os.types";

@Injectable()
export class GlobalProductionOsStore {
  readonly factories = new Map<string, GlobalFactoryNode>();
  readonly workloads = new Map<string, ProductionWorkload>();
  readonly complianceEvaluations = new Map<string, ComplianceEvaluation>();
  readonly routingDecisions = new Map<string, RoutingDecision>();
  readonly replicationPlans = new Map<string, ReplicationPlan>();
  readonly recoveryPlans = new Map<string, DisasterRecoveryPlan>();
  readonly forecasts = new Map<string, IntelligenceForecast>();
  readonly marketplaceOffers = new Map<string, MarketplaceOffer>();
  readonly economySnapshots = new Map<string, EconomySnapshot>();
  readonly digitalTwinSnapshots = new Map<string, DigitalTwinSnapshot>();
  readonly evolutionProposals = new Map<string, EvolutionProposal>();
  readonly finalReviews = new Map<string, FinalReviewRecord>();
  readonly certifications = new Map<string, CertificationRecord>();

  nextId(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(16).slice(2, 10)}`;
  }

  now(): string {
    return new Date().toISOString();
  }
}