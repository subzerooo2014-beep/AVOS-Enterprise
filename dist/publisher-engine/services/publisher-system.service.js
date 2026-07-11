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
exports.PublisherSystemService = void 0;
const common_1 = require("@nestjs/common");
const publisher_dashboard_v2_service_1 = require("./publisher-dashboard-v2.service");
const publisher_health_monitor_service_1 = require("./publisher-health-monitor.service");
let PublisherSystemService = class PublisherSystemService {
    constructor(dashboard, health) {
        this.dashboard = dashboard;
        this.health = health;
    }
    async status() {
        return {
            success: true,
            engine: "Publisher Engine V2",
            version: "2.0.0",
            health: await this.health.status(),
            dashboard: await this.dashboard.dashboard(),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherSystemService = PublisherSystemService;
exports.PublisherSystemService = PublisherSystemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_dashboard_v2_service_1.PublisherDashboardV2Service,
        publisher_health_monitor_service_1.PublisherHealthMonitorService])
], PublisherSystemService);
//# sourceMappingURL=publisher-system.service.js.map