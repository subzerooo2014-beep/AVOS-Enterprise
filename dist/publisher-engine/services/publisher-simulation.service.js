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
exports.PublisherSimulationService = void 0;
const common_1 = require("@nestjs/common");
const publisher_registry_service_1 = require("../publisher-registry.service");
const publisher_context_builder_service_1 = require("./publisher-context-builder.service");
let PublisherSimulationService = class PublisherSimulationService {
    constructor(registry, contextBuilder) {
        this.registry = registry;
        this.contextBuilder = contextBuilder;
    }
    async simulate(input) {
        const job = {
            id: input.id ?? "simulation",
            title: input.title ?? "Simulation Publish",
            content: input.content ?? null,
            campaignId: input.campaignId ?? null,
            channelId: input.channelId ?? null,
            retryCount: 0,
            result: input.result ?? { channel: input.channel ?? "internal" },
        };
        const ctx = this.contextBuilder.build(job);
        const adapter = this.registry.get(ctx.channel);
        return {
            success: true,
            simulation: true,
            channelExists: this.registry.exists(ctx.channel),
            health: await adapter.health(),
            context: ctx,
            estimatedResult: {
                status: "published",
                channel: ctx.channel,
                externalId: `SIM-${ctx.channel}-${ctx.jobId}`,
                message: "Simulation only. No external publish executed.",
            },
        };
    }
};
exports.PublisherSimulationService = PublisherSimulationService;
exports.PublisherSimulationService = PublisherSimulationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_registry_service_1.PublisherRegistryService,
        publisher_context_builder_service_1.PublisherContextBuilderService])
], PublisherSimulationService);
//# sourceMappingURL=publisher-simulation.service.js.map