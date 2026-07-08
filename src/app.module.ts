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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}










