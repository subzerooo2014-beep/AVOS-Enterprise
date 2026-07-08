"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const platform_enterprise_module_1 = require("./platform-enterprise/platform-enterprise.module");
const ai_core_module_1 = require("./ai-core/ai-core.module");
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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
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
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map