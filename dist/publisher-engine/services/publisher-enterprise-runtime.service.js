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
exports.PublisherEnterpriseRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const publisher_engine_runtime_v2_service_1 = require("./publisher-engine-runtime-v2.service");
const publisher_production_service_1 = require("./publisher-production.service");
let PublisherEnterpriseRuntimeService = class PublisherEnterpriseRuntimeService {
    constructor(runtime, production) {
        this.runtime = runtime;
        this.production = production;
    }
    async report(limit = 20) {
        return {
            runtime: await this.runtime.status(),
            production: await this.production.execute(limit),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherEnterpriseRuntimeService = PublisherEnterpriseRuntimeService;
exports.PublisherEnterpriseRuntimeService = PublisherEnterpriseRuntimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_engine_runtime_v2_service_1.PublisherEngineRuntimeV2Service,
        publisher_production_service_1.PublisherProductionService])
], PublisherEnterpriseRuntimeService);
//# sourceMappingURL=publisher-enterprise-runtime.service.js.map