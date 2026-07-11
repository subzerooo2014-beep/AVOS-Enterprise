"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherContextBuilderService = void 0;
const common_1 = require("@nestjs/common");
const publisher_id_util_1 = require("../utils/publisher-id.util");
const publisher_object_util_1 = require("../utils/publisher-object.util");
let PublisherContextBuilderService = class PublisherContextBuilderService {
    build(job) {
        const result = (0, publisher_object_util_1.safeObject)(job.result);
        const channel = result.channel ?? result.publisher?.channel ?? this.channelFromTitle(job.title);
        return {
            jobId: job.id,
            vehicleId: result.entityId ?? result.vehicleId ?? this.vehicleFromContent(job.content),
            campaignId: job.campaignId ?? null,
            channelId: job.channelId ?? null,
            channel,
            title: job.title,
            content: job.content,
            result,
            attempt: Number(job.retryCount ?? 0) + 1,
            correlationId: job.correlationId ?? (0, publisher_id_util_1.makeCorrelationId)(job.id),
            metadata: result.metadata ?? {},
        };
    }
    channelFromTitle(title) {
        const lower = String(title ?? "").toLowerCase();
        const known = ["website", "dealer_network", "crm_leads", "matched_buyers", "gcc_export", "internal"];
        return known.find((k) => lower.includes(k)) ?? "internal";
    }
    vehicleFromContent(content) {
        const match = String(content ?? "").match(/cmr[a-z0-9]+/i);
        return match ? match[0] : null;
    }
};
exports.PublisherContextBuilderService = PublisherContextBuilderService;
exports.PublisherContextBuilderService = PublisherContextBuilderService = __decorate([
    (0, common_1.Injectable)()
], PublisherContextBuilderService);
//# sourceMappingURL=publisher-context-builder.service.js.map