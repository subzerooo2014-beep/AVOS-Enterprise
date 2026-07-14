import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MarketplaceEcosystemService } from "./marketplace-ecosystem.service";
import { EntityRepositoryService } from "./services/entity-repository.service";
import { ListingRepositoryService } from "./services/listing-repository.service";
import { MarketplaceDashboardService } from "./services/marketplace-dashboard.service";
import { MarketplaceAuditService } from "./services/marketplace-audit.service";
import { MarketplaceReportingService } from "./services/marketplace-reporting.service";
import { MarketplaceRankingEngine } from "./ai/marketplace-ranking.engine";
import { ProviderMatchingEngine } from "./ai/provider-matching.engine";
import { PricingIntelligenceEngine } from "./ai/pricing-intelligence.engine";
import { MarketplaceFraudDetectionEngine } from "./ai/fraud-detection.engine";
import { MarketplaceDemandForecastEngine } from "./ai/demand-forecast.engine";
import { CommissionOptimizationEngine } from "./ai/commission-optimization.engine";
import { ReviewIntelligenceEngine } from "./ai/review-intelligence.engine";
import { InventoryOptimizationEngine } from "./ai/inventory-optimization.engine";

@Controller("marketplace-ecosystem")
export class MarketplaceEcosystemController {
  constructor(
    private readonly marketplace: MarketplaceEcosystemService,
    private readonly entityRepo: EntityRepositoryService,
    private readonly listingRepo: ListingRepositoryService,
    private readonly dashboard: MarketplaceDashboardService,
    private readonly audit: MarketplaceAuditService,
    private readonly reports: MarketplaceReportingService,
    private readonly rankingAi: MarketplaceRankingEngine,
    private readonly matchingAi: ProviderMatchingEngine,
    private readonly pricingAi: PricingIntelligenceEngine,
    private readonly fraudAi: MarketplaceFraudDetectionEngine,
    private readonly demandAi: MarketplaceDemandForecastEngine,
    private readonly commissionAi: CommissionOptimizationEngine,
    private readonly reviewAi: ReviewIntelligenceEngine,
    private readonly inventoryAi: InventoryOptimizationEngine,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Marketplace Ecosystem",
      status: "healthy",
    };
  }

  @Post("entities")
  createEntity(@Body() body: any) {
    return { success: true, entity: this.marketplace.entities.create(body) };
  }

  @Post("entities/:id/verify")
  verifyEntity(@Param("id") id: string, @Body() body: any) {
    return { success: true, entity: this.marketplace.entities.verify(id, body.approved) };
  }

  @Get("entities")
  entities() {
    return { success: true, entities: this.entityRepo.list() };
  }

  @Post("listings")
  createListing(@Body() body: any) {
    return { success: true, listing: this.marketplace.listings.create(body) };
  }

  @Get("listings")
  listings() {
    return { success: true, listings: this.listingRepo.list() };
  }

  @Post("memberships")
  membership(@Body() body: any) {
    return { success: true, membership: this.marketplace.memberships.create(body) };
  }

  @Post("commissions")
  commission(@Body() body: any) {
    return { success: true, commission: this.marketplace.commissions.create(body) };
  }

  @Post("reviews")
  review(@Body() body: any) {
    return { success: true, review: this.marketplace.reviews.create(body) };
  }

  @Post("bookings")
  booking(@Body() body: any) {
    return { success: true, booking: this.marketplace.bookings.create(body) };
  }

  @Post("orders")
  order(@Body() body: any) {
    return { success: true, order: this.marketplace.orders.create(body) };
  }

  @Post("workshop-jobs")
  workshopJob(@Body() body: any) {
    return { success: true, job: this.marketplace.workshopJobs.create(body) };
  }

  @Post("dealership-leads")
  dealershipLead(@Body() body: any) {
    return { success: true, lead: this.marketplace.dealershipLeads.create(body) };
  }

  @Post("search")
  search(@Body() body: any) {
    return { success: true, results: this.marketplace.search.search(body) };
  }

  @Post("ai/ranking")
  ranking(@Body() body: any) {
    return this.rankingAi.rank(body.items ?? []);
  }

  @Post("ai/provider-matching")
  providerMatching(@Body() body: any) {
    return this.matchingAi.match(body);
  }

  @Post("ai/pricing")
  pricing(@Body() body: any) {
    return this.pricingAi.analyze(body);
  }

  @Post("ai/fraud")
  fraud(@Body() body: any) {
    return this.fraudAi.evaluate(body);
  }

  @Post("ai/demand")
  demand(@Body() body: any) {
    return this.demandAi.forecast(body.values ?? []);
  }

  @Post("ai/commission")
  commissionOptimization(@Body() body: any) {
    return this.commissionAi.recommend(body);
  }

  @Post("ai/reviews")
  reviewIntelligence(@Body() body: any) {
    return this.reviewAi.summarize(body.scores ?? []);
  }

  @Post("ai/inventory")
  inventory(@Body() body: any) {
    return this.inventoryAi.evaluate(body);
  }

  @Post("reports")
  report(@Body() body: any) {
    return { success: true, report: this.reports.create(body) };
  }

  @Get("operations/dashboard")
  operations() {
    return { success: true, dashboard: this.dashboard.summary() };
  }

  @Get("operations/audit")
  auditEntries() {
    return { success: true, entries: this.audit.list() };
  }
}
