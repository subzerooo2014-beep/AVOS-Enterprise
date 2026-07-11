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
exports.MegaPack6Controller = void 0;
const common_1 = require("@nestjs/common");
const mega_pack_6_bootstrap_service_1 = require("./mega-pack-6-bootstrap.service");
const mega_pack_6_dashboard_service_1 = require("./mega-pack-6-dashboard.service");
let MegaPack6Controller = class MegaPack6Controller {
    constructor(bootstrapService, dashboard) {
        this.bootstrapService = bootstrapService;
        this.dashboard = dashboard;
    }
    bootstrap() {
        return this.bootstrapService
            .bootstrap();
    }
    status() {
        return this.dashboard.status();
    }
};
exports.MegaPack6Controller = MegaPack6Controller;
__decorate([
    (0, common_1.Post)("bootstrap"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MegaPack6Controller.prototype, "bootstrap", null);
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MegaPack6Controller.prototype, "status", null);
exports.MegaPack6Controller = MegaPack6Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6"),
    __metadata("design:paramtypes", [mega_pack_6_bootstrap_service_1.MegaPack6BootstrapService,
        mega_pack_6_dashboard_service_1.MegaPack6DashboardService])
], MegaPack6Controller);
//# sourceMappingURL=mega-pack-6.controller.js.map