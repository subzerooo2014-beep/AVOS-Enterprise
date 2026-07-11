"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherEnterpriseMonitorService = void 0;
const common_1 = require("@nestjs/common");
const publisher_enterprise_dashboard_service_1 = require("./publisher-enterprise-dashboard.service");
const publisher_health_report_service_1 = require("./publisher-health-report.service");
let PublisherEnterpriseMonitorService = class PublisherEnterpriseMonitorService {
    constructor(dashboard, health) {
        this.dashboard = dashboard;
        this.health = health;
    }
    async monitor() {
        return {
            success: true,
            dashboard: await this.dashboard.dashboard(),
            health: this.health.report(),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherEnterpriseMonitorService = PublisherEnterpriseMonitorService;
exports.PublisherEnterpriseMonitorService = PublisherEnterpriseMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_enterprise_dashboard_service_1.PublisherEnterpriseDashboardService,
        publisher_health_report_service_1.PublisherHealthReportService])
], PublisherEnterpriseMonitorService);
//# sourceMappingURL=publisher-enterprise-monitor.service.js.map