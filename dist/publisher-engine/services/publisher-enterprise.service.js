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
exports.PublisherEnterpriseService = void 0;
const common_1 = require("@nestjs/common");
const publisher_production_service_1 = require("./publisher-production.service");
const publisher_system_runtime_service_1 = require("./publisher-system-runtime.service");
let PublisherEnterpriseService = class PublisherEnterpriseService {
    constructor(production, runtime) {
        this.production = production;
        this.runtime = runtime;
    }
    async execute(limit = 20) {
        return {
            success: true,
            production: await this.production.execute(limit),
            runtime: this.runtime.info(),
            version: "Enterprise V2",
            generatedAt: new Date(),
        };
    }
};
exports.PublisherEnterpriseService = PublisherEnterpriseService;
exports.PublisherEnterpriseService = PublisherEnterpriseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_production_service_1.PublisherProductionService,
        publisher_system_runtime_service_1.PublisherSystemRuntimeService])
], PublisherEnterpriseService);
//# sourceMappingURL=publisher-enterprise.service.js.map