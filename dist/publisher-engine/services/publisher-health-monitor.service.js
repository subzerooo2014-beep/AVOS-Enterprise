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
exports.PublisherHealthMonitorService = void 0;
const common_1 = require("@nestjs/common");
const publisher_registry_service_1 = require("../publisher-registry.service");
let PublisherHealthMonitorService = class PublisherHealthMonitorService {
    constructor(registry) {
        this.registry = registry;
    }
    async status() {
        const output = [];
        for (const channel of this.registry.list()) {
            const adapter = this.registry.get(channel);
            output.push({
                channel,
                status: await adapter.health(),
            });
        }
        return {
            success: true,
            engine: "PublisherEngineV2",
            channels: output,
            checkedAt: new Date(),
        };
    }
};
exports.PublisherHealthMonitorService = PublisherHealthMonitorService;
exports.PublisherHealthMonitorService = PublisherHealthMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_registry_service_1.PublisherRegistryService])
], PublisherHealthMonitorService);
//# sourceMappingURL=publisher-health-monitor.service.js.map