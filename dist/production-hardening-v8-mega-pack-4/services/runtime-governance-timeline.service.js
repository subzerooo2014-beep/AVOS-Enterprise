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
exports.RuntimeGovernanceTimelineService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let RuntimeGovernanceTimelineService = class RuntimeGovernanceTimelineService {
    constructor(store) {
        this.store = store;
    }
    append(dto) {
        const existing = this.store
            .listGovernanceTimeline();
        const event = {
            id: (0, crypto_1.randomUUID)(),
            sequence: existing.length + 1,
            aggregateType: dto.aggregateType,
            aggregateId: dto.aggregateId,
            type: dto.type,
            title: dto.title,
            description: dto.description,
            actor: dto.actor,
            relatedResourceIds: dto.relatedResourceIds ?? [],
            payload: (dto.payload ?? {}),
            metadata: (dto.metadata ?? {}),
            createdAt: new Date().toISOString(),
        };
        return this.store
            .appendGovernanceTimelineEvent(event);
    }
    list(filters) {
        return this.store
            .listGovernanceTimeline()
            .filter((event) => (!filters?.aggregateType ||
            event.aggregateType ===
                filters.aggregateType) &&
            (!filters?.aggregateId ||
                event.aggregateId ===
                    filters.aggregateId));
    }
};
exports.RuntimeGovernanceTimelineService = RuntimeGovernanceTimelineService;
exports.RuntimeGovernanceTimelineService = RuntimeGovernanceTimelineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeGovernanceTimelineService);
//# sourceMappingURL=runtime-governance-timeline.service.js.map