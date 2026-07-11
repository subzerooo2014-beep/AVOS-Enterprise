"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const production_hardening_v8_mega_pack_3_1 = require("./production-hardening-v8-mega-pack-3");
const platform_hardening_v6_module_1 = require("./platform-hardening-v6/platform-hardening-v6.module");
const platform_hardening_v5_module_1 = require("./platform-hardening-v5/platform-hardening-v5.module");
const platform_hardening_v4_module_1 = require("./platform-hardening-v4/platform-hardening-v4.module");
const platform_hardening_v3_module_1 = require("./platform-hardening-v3/platform-hardening-v3.module");
const platform_hardening_v2_module_1 = require("./platform-hardening-v2/platform-hardening-v2.module");
const query_bus_module_1 = require("./avos-os/query-bus/query-bus.module");
const platform_hardening_module_1 = require("./platform-hardening/platform-hardening.module");
const ai_campaign_manager_module_1 = require("./ai-campaign-manager/ai-campaign-manager.module");
const command_bus_module_1 = require("./avos-os/command-bus/command-bus.module");
const avos_integration_module_1 = require("./avos-integration/avos-integration.module");
const avos_kernel_module_1 = require("./avos-kernel/avos-kernel.module");
const avos_dna_module_1 = require("./avos-dna/avos-dna.module");
const avos_brain_module_1 = require("./avos-brain/avos-brain.module");
const avos_runtime_module_1 = require("./avos-runtime/avos-runtime.module");
const ai_results_module_1 = require("./ai-results/ai-results.module");
const ai_decision_module_1 = require("./ai-decision/ai-decision.module");
const ai_decision_history_module_1 = require("./ai-decision-history/ai-decision-history.module");
const ai_action_module_1 = require("./ai-action/ai-action.module");
const ai_action_log_module_1 = require("./ai-action-log/ai-action-log.module");
const publish_jobs_module_1 = require("./publish-jobs/publish-jobs.module");
const ai_publishing_pipeline_module_1 = require("./ai-publishing-pipeline/ai-publishing-pipeline.module");
const ai_campaign_engine_module_1 = require("./ai-campaign-engine/ai-campaign-engine.module");
const ai_distribution_engine_module_1 = require("./ai-distribution-engine/ai-distribution-engine.module");
const ai_job_queue_module_1 = require("./ai-job-queue/ai-job-queue.module");
const publisher_engine_module_1 = require("./publisher-engine/publisher-engine.module");
const fraud_engine_module_1 = require("./fraud-engine/fraud-engine.module");
const vehicle_intelligence_module_1 = require("./vehicle-intelligence/vehicle-intelligence.module");
const business_providers_module_1 = require("./business-providers/business-providers.module");
const buyer_matching_module_1 = require("./buyer-matching/buyer-matching.module");
const distribution_engine_module_1 = require("./distribution-engine/distribution-engine.module");
const growth_engine_module_1 = require("./growth-engine/growth-engine.module");
const marketing_engine_module_1 = require("./marketing-engine/marketing-engine.module");
const reputation_module_1 = require("./reputation/reputation.module");
const trust_engine_module_1 = require("./trust-engine/trust-engine.module");
const deals_module_1 = require("./deals/deals.module");
const export_trade_module_1 = require("./export-trade/export-trade.module");
const partners_module_1 = require("./partners/partners.module");
const trust_module_1 = require("./trust/trust.module");
const platform_enterprise_module_1 = require("./platform-enterprise/platform-enterprise.module");
const ai_core_module_1 = require("./ai-core/ai-core.module");
const risk_engine_module_1 = require("./risk-engine/risk-engine.module");
const sales_intelligence_module_1 = require("./sales-intelligence/sales-intelligence.module");
const crm_intelligence_module_1 = require("./crm-intelligence/crm-intelligence.module");
const inventory_intelligence_module_1 = require("./inventory-intelligence/inventory-intelligence.module");
const vehicle_valuation_module_1 = require("./vehicle-valuation/vehicle-valuation.module");
const vehicle_search_module_1 = require("./vehicle-search/vehicle-search.module");
const vehicle_catalog_module_1 = require("./vehicle-catalog/vehicle-catalog.module");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const organizations_module_1 = require("./organizations/organizations.module");
const branches_module_1 = require("./branches/branches.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const sales_module_1 = require("./sales/sales.module");
const purchases_module_1 = require("./purchases/purchases.module");
const invoices_module_1 = require("./invoices/invoices.module");
const inventory_module_1 = require("./inventory/inventory.module");
const customers_module_1 = require("./customers/customers.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const purchase_orders_module_1 = require("./purchase-orders/purchase-orders.module");
const inventory_transactions_module_1 = require("./inventory-transactions/inventory-transactions.module");
const sales_orders_module_1 = require("./sales-orders/sales-orders.module");
const sales_order_items_module_1 = require("./sales-order-items/sales-order-items.module");
const purchase_order_items_module_1 = require("./purchase-order-items/purchase-order-items.module");
const orders_module_1 = require("./orders/orders.module");
const reservations_module_1 = require("./reservations/reservations.module");
const accounting_module_1 = require("./accounting/accounting.module");
const payments_module_1 = require("./payments/payments.module");
const expenses_module_1 = require("./expenses/expenses.module");
const revenues_module_1 = require("./revenues/revenues.module");
const taxes_module_1 = require("./taxes/taxes.module");
const wallets_module_1 = require("./wallets/wallets.module");
const transactions_module_1 = require("./transactions/transactions.module");
const employees_module_1 = require("./employees/employees.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_module_1 = require("./permissions/permissions.module");
const maintenance_module_1 = require("./maintenance/maintenance.module");
const workorders_module_1 = require("./workorders/workorders.module");
const inspections_module_1 = require("./inspections/inspections.module");
const insurance_module_1 = require("./insurance/insurance.module");
const documents_module_1 = require("./documents/documents.module");
const attachments_module_1 = require("./attachments/attachments.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reports_module_1 = require("./reports/reports.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const hr_module_1 = require("./hr/hr.module");
const crm_module_1 = require("./crm/crm.module");
const ai_module_1 = require("./ai/ai.module");
const analytics_module_1 = require("./analytics/analytics.module");
const settings_module_1 = require("./settings/settings.module");
const audit_module_1 = require("./audit/audit.module");
const logs_module_1 = require("./logs/logs.module");
const files_module_1 = require("./files/files.module");
const media_module_1 = require("./media/media.module");
const search_module_1 = require("./search/search.module");
const tasks_module_1 = require("./tasks/tasks.module");
const calendar_module_1 = require("./calendar/calendar.module");
const messages_module_1 = require("./messages/messages.module");
const support_module_1 = require("./support/support.module");
const integrations_module_1 = require("./integrations/integrations.module");
const pricing_engine_module_1 = require("./pricing-engine/pricing-engine.module");
const discount_engine_module_1 = require("./discount-engine/discount-engine.module");
const tax_engine_module_1 = require("./tax-engine/tax-engine.module");
const customer_lifecycle_module_1 = require("./customer-lifecycle/customer-lifecycle.module");
const lead_conversion_module_1 = require("./lead-conversion/lead-conversion.module");
const sales_pipeline_module_1 = require("./sales-pipeline/sales-pipeline.module");
const sales_workflow_module_1 = require("./sales-workflow/sales-workflow.module");
const reservation_engine_module_1 = require("./reservation-engine/reservation-engine.module");
const vehicle_availability_module_1 = require("./vehicle-availability-engine/vehicle-availability.module");
const stock_lock_module_1 = require("./stock-lock-engine/stock-lock.module");
const auto_release_module_1 = require("./auto-release-engine/auto-release.module");
const event_bus_module_1 = require("./event-bus/event-bus.module");
const reserve_vehicle_module_1 = require("./application/reservations/reserve-vehicle/reserve-vehicle.module");
const cancel_reservation_module_1 = require("./application/reservations/cancel-reservation/cancel-reservation.module");
const production_hardening_v7_module_1 = require("./production-hardening-v7/production-hardening-v7.module");
const production_hardening_v7_mega_pack_6_module_1 = require("./production-hardening-v7-mega-pack-6/production-hardening-v7-mega-pack-6.module");
const production_hardening_v7_mega_pack_7_module_1 = require("./production-hardening-v7-mega-pack-7/production-hardening-v7-mega-pack-7.module");
const production_hardening_v7_mega_pack_8_module_1 = require("./production-hardening-v7-mega-pack-8/production-hardening-v7-mega-pack-8.module");
const production_hardening_v7_mega_pack_9_module_1 = require("./production-hardening-v7-mega-pack-9/production-hardening-v7-mega-pack-9.module");
const production_hardening_v7_mega_pack_10_module_1 = require("./production-hardening-v7-mega-pack-10/production-hardening-v7-mega-pack-10.module");
const production_hardening_v7_mega_pack_11_module_1 = require("./production-hardening-v7-mega-pack-11/production-hardening-v7-mega-pack-11.module");
const production_hardening_v7_mega_pack_12_module_1 = require("./production-hardening-v7-mega-pack-12/production-hardening-v7-mega-pack-12.module");
const production_hardening_v7_mega_pack_13_module_1 = require("./production-hardening-v7-mega-pack-13/production-hardening-v7-mega-pack-13.module");
const production_hardening_v7_mega_pack_14_module_1 = require("./production-hardening-v7-mega-pack-14/production-hardening-v7-mega-pack-14.module");
const production_hardening_v7_mega_pack_15_module_1 = require("./production-hardening-v7-mega-pack-15/production-hardening-v7-mega-pack-15.module");
const production_hardening_v7_mega_pack_16_module_1 = require("./production-hardening-v7-mega-pack-16/production-hardening-v7-mega-pack-16.module");
const production_hardening_v8_mega_pack_1_module_1 = require("./production-hardening-v8-mega-pack-1/production-hardening-v8-mega-pack-1.module");
const production_hardening_v8_mega_pack_2_module_1 = require("./production-hardening-v8-mega-pack-2/production-hardening-v8-mega-pack-2.module");
const production_hardening_v8_mega_pack_4_module_1 = require("./production-hardening-v8-mega-pack-4/production-hardening-v8-mega-pack-4.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            production_hardening_v8_mega_pack_4_module_1.ProductionHardeningV8MegaPack4Module,
            production_hardening_v8_mega_pack_3_1.ProductionHardeningV8MegaPack3Module,
            production_hardening_v8_mega_pack_2_module_1.ProductionHardeningV8MegaPack2Module,
            production_hardening_v8_mega_pack_1_module_1.ProductionHardeningV8MegaPack1Module,
            production_hardening_v7_mega_pack_16_module_1.ProductionHardeningV7MegaPack16Module,
            production_hardening_v7_mega_pack_15_module_1.ProductionHardeningV7MegaPack15Module,
            production_hardening_v7_mega_pack_14_module_1.ProductionHardeningV7MegaPack14Module,
            production_hardening_v7_mega_pack_13_module_1.ProductionHardeningV7MegaPack13Module,
            production_hardening_v7_mega_pack_12_module_1.ProductionHardeningV7MegaPack12Module,
            production_hardening_v7_mega_pack_11_module_1.ProductionHardeningV7MegaPack11Module,
            production_hardening_v7_mega_pack_10_module_1.ProductionHardeningV7MegaPack10Module,
            production_hardening_v7_mega_pack_9_module_1.ProductionHardeningV7MegaPack9Module,
            production_hardening_v7_mega_pack_8_module_1.ProductionHardeningV7MegaPack8Module,
            production_hardening_v7_mega_pack_7_module_1.ProductionHardeningV7MegaPack7Module,
            platform_hardening_v6_module_1.PlatformHardeningV6Module,
            platform_hardening_v5_module_1.PlatformHardeningV5Module,
            platform_hardening_v4_module_1.PlatformHardeningV4Module,
            platform_hardening_v3_module_1.PlatformHardeningV3Module,
            platform_hardening_v2_module_1.PlatformHardeningV2Module, query_bus_module_1.QueryBusModule, command_bus_module_1.CommandBusModule, avos_brain_module_1.AvosBrainModule, avos_runtime_module_1.AvosRuntimeModule, ai_results_module_1.AiResultsModule, ai_decision_module_1.AiDecisionModule, ai_decision_history_module_1.AiDecisionHistoryModule, ai_action_module_1.AiActionModule, ai_action_log_module_1.AiActionLogModule, publish_jobs_module_1.PublishJobsModule, ai_publishing_pipeline_module_1.AiPublishingPipelineModule, ai_campaign_engine_module_1.AiCampaignEngineModule, ai_distribution_engine_module_1.AiDistributionEngineModule, ai_job_queue_module_1.AiJobQueueModule, publisher_engine_module_1.PublisherEngineModule, avos_dna_module_1.AvosDnaModule, avos_kernel_module_1.AvosKernelModule, avos_integration_module_1.AvosIntegrationModule, deals_module_1.DealsModule, export_trade_module_1.ExportTradeModule, partners_module_1.PartnersModule, trust_module_1.TrustModule, reputation_module_1.ReputationModule, risk_engine_module_1.RiskEngineModule, trust_engine_module_1.TrustEngineModule, growth_engine_module_1.GrowthEngineModule, marketing_engine_module_1.MarketingEngineModule, buyer_matching_module_1.BuyerMatchingModule, distribution_engine_module_1.DistributionEngineModule, business_providers_module_1.BusinessProvidersModule, fraud_engine_module_1.FraudEngineModule, vehicle_intelligence_module_1.VehicleIntelligenceModule,
            platform_enterprise_module_1.PlatformEnterpriseModule,
            ai_core_module_1.AiCoreModule,
            sales_intelligence_module_1.SalesIntelligenceModule,
            crm_intelligence_module_1.CrmIntelligenceModule,
            inventory_intelligence_module_1.InventoryIntelligenceModule,
            vehicle_valuation_module_1.VehicleValuationModule,
            vehicle_search_module_1.VehicleSearchModule,
            vehicle_catalog_module_1.VehicleCatalogModule,
            prisma_module_1.PrismaModule, users_module_1.UsersModule, auth_module_1.AuthModule,
            organizations_module_1.OrganizationsModule, branches_module_1.BranchesModule, vehicles_module_1.VehiclesModule,
            sales_module_1.SalesModule, purchases_module_1.PurchasesModule, invoices_module_1.InvoicesModule,
            inventory_module_1.InventoryModule, customers_module_1.CustomersModule, suppliers_module_1.SuppliersModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            inventory_transactions_module_1.InventoryTransactionsModule,
            sales_orders_module_1.SalesOrdersModule,
            sales_order_items_module_1.SalesOrderItemsModule,
            purchase_order_items_module_1.PurchaseOrderItemsModule,
            orders_module_1.OrdersModule, reservations_module_1.ReservationsModule,
            accounting_module_1.AccountingModule, payments_module_1.PaymentsModule, expenses_module_1.ExpensesModule,
            revenues_module_1.RevenuesModule, taxes_module_1.TaxesModule, wallets_module_1.WalletsModule, transactions_module_1.TransactionsModule,
            employees_module_1.EmployeesModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            maintenance_module_1.MaintenanceModule,
            workorders_module_1.WorkordersModule,
            inspections_module_1.InspectionsModule,
            insurance_module_1.InsuranceModule,
            documents_module_1.DocumentsModule,
            attachments_module_1.AttachmentsModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            dashboard_module_1.DashboardModule,
            hr_module_1.HrModule,
            crm_module_1.CrmModule,
            ai_module_1.AiModule,
            analytics_module_1.AnalyticsModule,
            settings_module_1.SettingsModule,
            audit_module_1.AuditModule,
            logs_module_1.LogsModule,
            files_module_1.FilesModule,
            media_module_1.MediaModule,
            search_module_1.SearchModule,
            tasks_module_1.TasksModule,
            calendar_module_1.CalendarModule,
            messages_module_1.MessagesModule,
            support_module_1.SupportModule,
            integrations_module_1.IntegrationsModule,
            pricing_engine_module_1.PricingEngineModule,
            discount_engine_module_1.DiscountEngineModule,
            tax_engine_module_1.TaxEngineModule,
            customer_lifecycle_module_1.CustomerLifecycleModule,
            lead_conversion_module_1.LeadConversionModule,
            sales_pipeline_module_1.SalesPipelineModule,
            sales_workflow_module_1.SalesWorkflowModule,
            reservation_engine_module_1.ReservationEngineModule,
            vehicle_availability_module_1.VehicleAvailabilityModule,
            stock_lock_module_1.StockLockModule,
            auto_release_module_1.AutoReleaseModule,
            event_bus_module_1.EventBusModule,
            reserve_vehicle_module_1.ReserveVehicleModule,
            cancel_reservation_module_1.CancelReservationModule,
            ai_campaign_manager_module_1.AiCampaignManagerModule,
            platform_hardening_module_1.PlatformHardeningModule,
            production_hardening_v7_module_1.ProductionHardeningV7Module,
            production_hardening_v7_mega_pack_6_module_1.ProductionHardeningV7MegaPack6Module,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map