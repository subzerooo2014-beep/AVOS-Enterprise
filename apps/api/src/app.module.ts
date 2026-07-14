import { ProductionHardeningV8MegaPack3Module } from "./production-hardening-v8-mega-pack-3";
import { PlatformHardeningV6Module } from "./platform-hardening-v6/platform-hardening-v6.module";
import { PlatformHardeningV5Module } from "./platform-hardening-v5/platform-hardening-v5.module";
import { PlatformHardeningV4Module } from "./platform-hardening-v4/platform-hardening-v4.module";
import { PlatformHardeningV3Module } from "./platform-hardening-v3/platform-hardening-v3.module";
import { PlatformHardeningV2Module } from "./platform-hardening-v2/platform-hardening-v2.module";
import { QueryBusModule } from "./avos-os/query-bus/query-bus.module";
import { PlatformHardeningModule } from "./platform-hardening/platform-hardening.module";
import { AiCampaignManagerModule } from "./ai-campaign-manager/ai-campaign-manager.module";
import { CommandBusModule } from "./avos-os/command-bus/command-bus.module";
import { AvosIntegrationModule } from "./avos-integration/avos-integration.module";
import { AvosKernelModule } from "./avos-kernel/avos-kernel.module";
import { AvosDnaModule } from "./avos-dna/avos-dna.module";
import { AvosBrainModule } from "./avos-brain/avos-brain.module";
import { AvosRuntimeModule } from "./avos-runtime/avos-runtime.module";
import { AiResultsModule } from "./ai-results/ai-results.module";
import { AiDecisionModule } from "./ai-decision/ai-decision.module";
import { AiDecisionHistoryModule } from "./ai-decision-history/ai-decision-history.module";
import { AiActionModule } from "./ai-action/ai-action.module";
import { AiActionLogModule } from "./ai-action-log/ai-action-log.module";
import { PublishJobsModule } from "./publish-jobs/publish-jobs.module";
import { AiPublishingPipelineModule } from "./ai-publishing-pipeline/ai-publishing-pipeline.module";
import { AiCampaignEngineModule } from "./ai-campaign-engine/ai-campaign-engine.module";
import { AiDistributionEngineModule } from "./ai-distribution-engine/ai-distribution-engine.module";
import { AiJobQueueModule } from "./ai-job-queue/ai-job-queue.module";
import { PublisherEngineModule } from "./publisher-engine/publisher-engine.module";
import { CommissionEngineModule } from "./commission-engine/commission-engine.module";
import { NegotiationEngineModule } from "./negotiation-engine/negotiation-engine.module";
import { ExportAdvisorModule } from "./export-advisor/export-advisor.module";
import { FraudEngineModule } from "./fraud-engine/fraud-engine.module";
import { VehicleIntelligenceModule } from "./vehicle-intelligence/vehicle-intelligence.module";
import { BusinessProvidersModule } from "./business-providers/business-providers.module";
import { BuyerMatchingModule } from "./buyer-matching/buyer-matching.module";
import { DistributionEngineModule } from "./distribution-engine/distribution-engine.module";
import { GrowthEngineModule } from "./growth-engine/growth-engine.module";
import { MarketingEngineModule } from "./marketing-engine/marketing-engine.module";
import { ReputationModule } from "./reputation/reputation.module";
import { TrustEngineModule } from "./trust-engine/trust-engine.module";
import { DealsModule } from "./deals/deals.module";
import { ExportTradeModule } from "./export-trade/export-trade.module";
import { PartnersModule } from "./partners/partners.module";
import { TrustModule } from "./trust/trust.module";
import { PlatformEnterpriseModule } from "./platform-enterprise/platform-enterprise.module";
import { AiCoreModule } from "./ai-core/ai-core.module";
import { RiskEngineModule } from "./risk-engine/risk-engine.module";
import { RecommendationEngineModule } from "./recommendation-engine/recommendation-engine.module";
import { DecisionEngineModule } from "./decision-engine/decision-engine.module";
import { SalesIntelligenceModule } from "./sales-intelligence/sales-intelligence.module";
import { CrmIntelligenceModule } from "./crm-intelligence/crm-intelligence.module";
import { InventoryIntelligenceModule } from "./inventory-intelligence/inventory-intelligence.module";
import { VehicleValuationModule } from "./vehicle-valuation/vehicle-valuation.module";
import { VehicleSearchModule } from "./vehicle-search/vehicle-search.module";
import { VehicleCatalogModule } from "./vehicle-catalog/vehicle-catalog.module";
import { DevicesModule } from "./devices/devices.module";
import { SessionsModule } from "./sessions/sessions.module";
import { ApikeysModule } from "./apikeys/apikeys.module";
import { WebhooksModule } from "./webhooks/webhooks.module";
import { SecurityModule } from "./security/security.module";
import { ComplianceModule } from "./compliance/compliance.module";
import { RiskModule } from "./risk/risk.module";
import { RecommendationsModule } from "./recommendations/recommendations.module";
import { AiagentsModule } from "./aiagents/aiagents.module";
import { ValuationsModule } from "./valuations/valuations.module";
import { TransfersModule } from "./transfers/transfers.module";
import { WarehousesModule } from "./warehouses/warehouses.module";
import { StockModule } from "./stock/stock.module";
import { CommissionsModule } from "./commissions/commissions.module";
import { DiscountsModule } from "./discounts/discounts.module";
import { PricingModule } from "./pricing/pricing.module";
import { ExportsModule } from "./exports/exports.module";
import { ImportsModule } from "./imports/imports.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { TicketsModule } from "./tickets/tickets.module";
import { ClaimsModule } from "./claims/claims.module";
import { WarrantyModule } from "./warranty/warranty.module";
import { DeliveryModule } from "./delivery/delivery.module";
import { TestdrivesModule } from "./testdrives/testdrives.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { LeadsModule } from "./leads/leads.module";
import { QuotesModule } from "./quotes/quotes.module";
import { ContractsModule } from "./contracts/contracts.module";
import { BanksModule } from "./banks/banks.module";
import { FinanceModule } from "./finance/finance.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { BranchesModule } from "./branches/branches.module";
import { VehiclesModule } from "./vehicles/vehicles.module";
import { SalesModule } from "./sales/sales.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { InventoryModule } from "./inventory/inventory.module";
import { CustomersModule } from "./customers/customers.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { PurchaseOrdersModule } from "./purchase-orders/purchase-orders.module";
import { InventoryTransactionsModule } from "./inventory-transactions/inventory-transactions.module";
import { SalesOrdersModule } from "./sales-orders/sales-orders.module";
import { SalesOrderItemsModule } from "./sales-order-items/sales-order-items.module";
import { PurchaseOrderItemsModule } from "./purchase-order-items/purchase-order-items.module";
import { OrdersModule } from "./orders/orders.module";
import { ReservationsModule } from "./reservations/reservations.module";
import { AccountingModule } from "./accounting/accounting.module";
import { PaymentsModule } from "./payments/payments.module";
import { ExpensesModule } from "./expenses/expenses.module";
import { RevenuesModule } from "./revenues/revenues.module";
import { TaxesModule } from "./taxes/taxes.module";
import { WalletsModule } from "./wallets/wallets.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { EmployeesModule } from "./employees/employees.module";
import { RolesModule } from "./roles/roles.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { MaintenanceModule } from "./maintenance/maintenance.module";
import { WorkordersModule } from "./workorders/workorders.module";
import { InspectionsModule } from "./inspections/inspections.module";
import { InsuranceModule } from "./insurance/insurance.module";
import { DocumentsModule } from "./documents/documents.module";
import { AttachmentsModule } from "./attachments/attachments.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { ReportsModule } from "./reports/reports.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { HrModule } from "./hr/hr.module";
import { CrmModule } from "./crm/crm.module";
import { AiModule } from "./ai/ai.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { SettingsModule } from "./settings/settings.module";
import { AuditModule } from "./audit/audit.module";
import { LogsModule } from "./logs/logs.module";
import { FilesModule } from "./files/files.module";
import { MediaModule } from "./media/media.module";
import { SearchModule } from "./search/search.module";
import { TasksModule } from "./tasks/tasks.module";
import { CalendarModule } from "./calendar/calendar.module";
import { MessagesModule } from "./messages/messages.module";
import { SupportModule } from "./support/support.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { PricingEngineModule } from "./pricing-engine/pricing-engine.module";
import { DiscountEngineModule } from "./discount-engine/discount-engine.module";
import { TaxEngineModule } from "./tax-engine/tax-engine.module";
import { CustomerLifecycleModule } from "./customer-lifecycle/customer-lifecycle.module";
import { LeadConversionModule } from "./lead-conversion/lead-conversion.module";
import { SalesPipelineModule } from "./sales-pipeline/sales-pipeline.module";
import { SalesWorkflowModule } from "./sales-workflow/sales-workflow.module";
import { ReservationEngineModule } from "./reservation-engine/reservation-engine.module";
import { VehicleAvailabilityModule } from "./vehicle-availability-engine/vehicle-availability.module";
import { StockLockModule } from "./stock-lock-engine/stock-lock.module";
import { AutoReleaseModule } from "./auto-release-engine/auto-release.module";
import { EventBusModule } from "./event-bus/event-bus.module";
import { ReserveVehicleModule } from "./application/reservations/reserve-vehicle/reserve-vehicle.module";
import { CancelReservationModule } from "./application/reservations/cancel-reservation/cancel-reservation.module";

import { ProductionHardeningV7Module } from "./production-hardening-v7/production-hardening-v7.module";
import { ProductionHardeningV7MegaPack6Module } from "./production-hardening-v7-mega-pack-6/production-hardening-v7-mega-pack-6.module";
import { ProductionHardeningV7MegaPack7Module } from "./production-hardening-v7-mega-pack-7/production-hardening-v7-mega-pack-7.module";
import { ProductionHardeningV7MegaPack8Module } from "./production-hardening-v7-mega-pack-8/production-hardening-v7-mega-pack-8.module";
import { ProductionHardeningV7MegaPack9Module } from "./production-hardening-v7-mega-pack-9/production-hardening-v7-mega-pack-9.module";
import { ProductionHardeningV7MegaPack10Module } from "./production-hardening-v7-mega-pack-10/production-hardening-v7-mega-pack-10.module";
import { ProductionHardeningV7MegaPack11Module } from "./production-hardening-v7-mega-pack-11/production-hardening-v7-mega-pack-11.module";
import { ProductionHardeningV7MegaPack12Module } from "./production-hardening-v7-mega-pack-12/production-hardening-v7-mega-pack-12.module";
import { ProductionHardeningV7MegaPack13Module } from "./production-hardening-v7-mega-pack-13/production-hardening-v7-mega-pack-13.module";
import { ProductionHardeningV7MegaPack14Module } from "./production-hardening-v7-mega-pack-14/production-hardening-v7-mega-pack-14.module";
import { ProductionHardeningV7MegaPack15Module } from "./production-hardening-v7-mega-pack-15/production-hardening-v7-mega-pack-15.module";
import { ProductionHardeningV7MegaPack16Module } from "./production-hardening-v7-mega-pack-16/production-hardening-v7-mega-pack-16.module";
import { ProductionHardeningV8MegaPack1Module } from "./production-hardening-v8-mega-pack-1/production-hardening-v8-mega-pack-1.module";
import { ProductionHardeningV8MegaPack2Module } from "./production-hardening-v8-mega-pack-2/production-hardening-v8-mega-pack-2.module";

import { ProductionHardeningV8MegaPack4Module } from "./production-hardening-v8-mega-pack-4/production-hardening-v8-mega-pack-4.module";
import { VehicleIntelligenceFinalApiModule } from "./vehicles/final-intelligence/vehicle-intelligence-final-api.module";
import { VehicleBrainIntegrationModule } from "./vehicles/brain-integration/vehicle-brain-integration.module";
import { VehicleLifecycleIntegrationModule } from "./vehicles/lifecycle-integration/vehicle-lifecycle-integration.module";
import { VehicleIntelligencePersistenceModule } from "./vehicles/prisma-intelligence/vehicle-intelligence-persistence.module";
import { VehicleLifecyclePrismaIntegrationModule } from "./vehicles/lifecycle-prisma-integration/vehicle-lifecycle-prisma-integration.module";
import { VehicleHttpPrismaLifecycleBridgeModule } from "./vehicles/http-prisma-lifecycle-bridge/vehicle-http-prisma-lifecycle-bridge.module";
import { VehicleEventPersistenceModule } from "./vehicles/event-persistence/vehicle-event-persistence.module";
import { VehicleEventOperationsModule } from "./vehicles/enterprise-bundle-b/vehicle-event-operations.module";
import { VehicleEnterpriseBundleCModule } from "./vehicles/enterprise-bundle-c/vehicle-enterprise-bundle-c.module";
import { VehicleEnterpriseBundleDModule } from "./vehicles/enterprise-bundle-d/vehicle-enterprise-bundle-d.module";
import { EnterpriseWorkflowModule } from "./enterprise-workflow/enterprise-workflow.module";
import { EnterpriseRuntimeModule } from "./enterprise-runtime/enterprise-runtime.module";
import { EnterpriseDecisionModule } from "./enterprise-decision/enterprise-decision.module";
import { EnterpriseOrchestrationModule } from "./enterprise-orchestration/enterprise-orchestration.module";
import { EnterpriseE2Module } from "./enterprise-e2/enterprise-e2.module";
import { EnterpriseE3Module } from "./enterprise-e3/enterprise-e3.module";
import { EnterpriseE4Module } from "./enterprise-e4/enterprise-e4.module";
import { EnterpriseE5Module } from "./enterprise-e5/enterprise-e5.module";
import { EnterpriseE6Module } from "./enterprise-e6/enterprise-e6.module";
import { EnterpriseE7Module } from "./enterprise-e7/enterprise-e7.module";
import { EnterpriseE8Module } from "./enterprise-e8/enterprise-e8.module";
import { EnterpriseE9Module } from "./enterprise-e9/enterprise-e9.module";
import { EnterpriseE10Module } from "./enterprise-e10/enterprise-e10.module";
import { EnterprisePhase2UltraModule } from "./enterprise-phase-2-ultra/enterprise-phase-2-ultra.module";
import { EnterprisePhase3UltraModule } from "./enterprise-phase-3-ultra/enterprise-phase-3-ultra.module";
import { EnterprisePhase4UltraModule } from "./enterprise-phase-4-ultra/enterprise-phase-4-ultra.module";
import { EnterprisePhase5UltraModule } from "./enterprise-phase-5-ultra/enterprise-phase-5-ultra.module";
import { EnterprisePhase6UltraModule } from "./enterprise-phase-6-ultra/enterprise-phase-6-ultra.module";
import { EnterpriseFinalUltraModule } from "./enterprise-final-ultra/enterprise-final-ultra.module";
import { AvosProductFinalModule } from "./avos-product-final/avos-product-final.module";
import { AuctionV2Module } from "./auction-v2/auction-v2.module";
import { CommerceV1Module } from "./commerce-v1/commerce-v1.module";
import { SuperAppV1Module } from "./super-app-v1/super-app-v1.module";
import { SuperAppV2Module } from "./super-app-v2/super-app-v2.module";

import { SuperAppV3Module } from "./super-app-v3/super-app-v3.module";

import { SuperAppV4Module } from "./super-app-v4/super-app-v4.module";

import { SuperAppV5Module } from "./super-app-v5/super-app-v5.module";

import { SuperAppV6Module } from "./super-app-v6/super-app-v6.module";

import { SuperAppStabilizationModule } from "./super-app-stabilization/super-app-stabilization.module";

import { PartnerPlatformModule } from "./partner-platform/partner-platform.module";

import { UltraAiCommerceModule } from "./ultra-ai-commerce/ultra-ai-commerce.module";

import { ProductionIntegrationsModule } from "./production-integrations/production-integrations.module";

import { VehiclePurchaseJourneyModule } from "./vehicle-purchase-journey/vehicle-purchase-journey.module";

import { VehicleSellingJourneyModule } from "./vehicle-selling-journey/vehicle-selling-journey.module";

import { AuctionRuntimeModule } from "./auction-runtime/auction-runtime.module";

import { FleetEnterpriseModule } from "./fleet-enterprise/fleet-enterprise.module";

import { GovernmentPlatformModule } from "./government-platform/government-platform.module";

import { MarketplaceEcosystemModule } from "./marketplace-ecosystem/marketplace-ecosystem.module";

import { EnterpriseAiOsModule } from "./enterprise-ai-os/enterprise-ai-os.module";

import { AfterSalesLifecycleModule } from "./after-sales-lifecycle/after-sales-lifecycle.module";

import { GrowthNetworkEffectModule } from "./growth-network-effect/growth-network-effect.module";

import { FinancialServicesOsModule } from "./financial-services-os/financial-services-os.module";

import { EnterprisePlatformRuntimeModule } from "./enterprise-platform-runtime/enterprise-platform-runtime.module";

import { DataPlatformAnalyticsModule } from "./data-platform-analytics/data-platform-analytics.module";

import { CommunicationEngagementOsModule } from "./communication-engagement-os/communication-engagement-os.module";

import { DeveloperPlatformCoreModule } from "./developer-platform-core/developer-platform-core.module";

import { EnterpriseIntegrationHubModule } from "./enterprise-integration-hub/enterprise-integration-hub.module";

import { UniversalPlatformFabricModule } from "./universal-platform-fabric/universal-platform-fabric.module";

import { AiInfrastructureCoreModule } from "./ai-infrastructure-core/ai-infrastructure-core.module";

@Module({
  imports: [
    AiInfrastructureCoreModule,
    UniversalPlatformFabricModule,
    EnterpriseIntegrationHubModule,
    DeveloperPlatformCoreModule,
    CommunicationEngagementOsModule,
    DataPlatformAnalyticsModule,
    EnterprisePlatformRuntimeModule,
    FinancialServicesOsModule,
    GrowthNetworkEffectModule,
    AfterSalesLifecycleModule,
    EnterpriseAiOsModule,
    MarketplaceEcosystemModule,
    GovernmentPlatformModule,
    FleetEnterpriseModule,
    AuctionRuntimeModule,
    VehicleSellingJourneyModule,
    VehiclePurchaseJourneyModule,
    ProductionIntegrationsModule,
    UltraAiCommerceModule,
    PartnerPlatformModule,
    SuperAppStabilizationModule,
    SuperAppV6Module,
    SuperAppV5Module,
    SuperAppV4Module,
    SuperAppV3Module,
    SuperAppV2Module,
    SuperAppV1Module,
    CommerceV1Module,
    AuctionV2Module,
    AvosProductFinalModule,
    EnterpriseFinalUltraModule,
    EnterprisePhase6UltraModule,
    EnterprisePhase5UltraModule,
    EnterprisePhase4UltraModule,
    EnterprisePhase3UltraModule,
    EnterprisePhase2UltraModule,
    EnterpriseE10Module,
    EnterpriseE9Module,
    EnterpriseE8Module,
    EnterpriseE7Module,
    EnterpriseE6Module,
    EnterpriseE5Module,
    EnterpriseE4Module,
    EnterpriseE3Module,
    EnterpriseE2Module,
    EnterpriseOrchestrationModule,
    EnterpriseDecisionModule,
    EnterpriseRuntimeModule,
    EnterpriseWorkflowModule,
    VehicleEnterpriseBundleDModule,
    VehicleEnterpriseBundleCModule,
    VehicleEventOperationsModule,
    VehicleEventPersistenceModule,
    VehicleHttpPrismaLifecycleBridgeModule,
    VehicleLifecyclePrismaIntegrationModule,
    VehicleIntelligencePersistenceModule,
    VehicleLifecycleIntegrationModule,
    VehicleBrainIntegrationModule,
    VehicleIntelligenceFinalApiModule,
    ProductionHardeningV8MegaPack4Module,
    ProductionHardeningV8MegaPack3Module,
    ProductionHardeningV8MegaPack2Module,
    ProductionHardeningV8MegaPack1Module,
    ProductionHardeningV7MegaPack16Module,
    ProductionHardeningV7MegaPack15Module,
    ProductionHardeningV7MegaPack14Module,
    ProductionHardeningV7MegaPack13Module,
    ProductionHardeningV7MegaPack12Module,
    ProductionHardeningV7MegaPack11Module,
    ProductionHardeningV7MegaPack10Module,
    ProductionHardeningV7MegaPack9Module,
    ProductionHardeningV7MegaPack8Module,
    ProductionHardeningV7MegaPack7Module,
    PlatformHardeningV6Module,
    PlatformHardeningV5Module,
    PlatformHardeningV4Module,
    PlatformHardeningV3Module,
    PlatformHardeningV2Module,QueryBusModule, CommandBusModule, AvosBrainModule, AvosRuntimeModule, AiResultsModule, AiDecisionModule, AiDecisionHistoryModule, AiActionModule, AiActionLogModule, PublishJobsModule, AiPublishingPipelineModule, AiCampaignEngineModule, AiDistributionEngineModule, AiJobQueueModule, PublisherEngineModule, AvosDnaModule, AvosKernelModule, AvosIntegrationModule, DealsModule, ExportTradeModule, PartnersModule, TrustModule, ReputationModule, RiskEngineModule, TrustEngineModule, GrowthEngineModule, MarketingEngineModule, BuyerMatchingModule, DistributionEngineModule, BusinessProvidersModule, FraudEngineModule, VehicleIntelligenceModule, 
    PlatformEnterpriseModule,
    AiCoreModule,
    SalesIntelligenceModule,
    CrmIntelligenceModule,
    InventoryIntelligenceModule,
    VehicleValuationModule,
    VehicleSearchModule,
    VehicleCatalogModule,
    PrismaModule, UsersModule, AuthModule,
    OrganizationsModule, BranchesModule, VehiclesModule,
    SalesModule, PurchasesModule, InvoicesModule,
    InventoryModule, CustomersModule, SuppliersModule,
    PurchaseOrdersModule,
    InventoryTransactionsModule,
    SalesOrdersModule,
    SalesOrderItemsModule,
    PurchaseOrderItemsModule,
    OrdersModule, ReservationsModule,
    AccountingModule, PaymentsModule, ExpensesModule,
    RevenuesModule, TaxesModule, WalletsModule, TransactionsModule,
    EmployeesModule,
    RolesModule,
    PermissionsModule,
    MaintenanceModule,
    WorkordersModule,
    InspectionsModule,
    InsuranceModule,
    DocumentsModule,
    AttachmentsModule,
    NotificationsModule,
    ReportsModule,
    DashboardModule,
    HrModule,
    CrmModule,
    AiModule,
    AnalyticsModule,
    SettingsModule,
    AuditModule,
    LogsModule,
    FilesModule,
    MediaModule,
    SearchModule,
    TasksModule,
    CalendarModule,
    MessagesModule,
    SupportModule,
    IntegrationsModule,
    PricingEngineModule,
    DiscountEngineModule,
    TaxEngineModule,
    CustomerLifecycleModule,
    LeadConversionModule,
    SalesPipelineModule,
    SalesWorkflowModule,
    ReservationEngineModule,
    VehicleAvailabilityModule,
    StockLockModule,
    AutoReleaseModule,
    EventBusModule,
    ReserveVehicleModule,
    CancelReservationModule,
      AiCampaignManagerModule,
      PlatformHardeningModule,
    ProductionHardeningV7Module,
    ProductionHardeningV7MegaPack6Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}






















































































































