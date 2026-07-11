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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeGovernanceOperationsController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceOperationsController = class RuntimeGovernanceOperationsController {
    constructor(timeline, status) {
        this.timeline = timeline;
        this.status = status;
    }
    appendTimeline(dto) {
        return this.timeline.append(dto);
    }
    listTimeline(aggregateType, aggregateId) {
        return this.timeline.list({
            aggregateType,
            aggregateId,
        });
    }
    snapshot() {
        return this.status.snapshot();
    }
};
exports.RuntimeGovernanceOperationsController = RuntimeGovernanceOperationsController;
__decorate([
    (0, common_1.Post)("timeline"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGovernanceTimelineEventDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceOperationsController.prototype, "appendTimeline", null);
__decorate([
    (0, common_1.Get)("timeline"),
    __param(0, (0, common_1.Query)("aggregateType")),
    __param(1, (0, common_1.Query)("aggregateId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceOperationsController.prototype, "listTimeline", null);
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceOperationsController.prototype, "snapshot", null);
exports.RuntimeGovernanceOperationsController = RuntimeGovernanceOperationsController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/operations"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceTimelineService,
        services_1.RuntimeGovernanceOperationsStatusService])
], RuntimeGovernanceOperationsController);
//# sourceMappingURL=runtime-governance-operations.controller.js.map