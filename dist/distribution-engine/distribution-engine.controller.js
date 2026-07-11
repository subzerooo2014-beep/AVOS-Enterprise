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
exports.DistributionEngineController = void 0;
const common_1 = require("@nestjs/common");
const distribution_engine_service_1 = require("./distribution-engine.service");
let DistributionEngineController = class DistributionEngineController {
    constructor(service) {
        this.service = service;
    }
    createChannel(body) {
        return this.service.createChannel(body);
    }
    listChannels() {
        return this.service.listChannels();
    }
    createJob(body) {
        return this.service.createPublishJob(body);
    }
    listJobs() {
        return this.service.listJobs();
    }
    published(id, body) {
        return this.service.markPublished(id, body);
    }
    republish(id, body) {
        return this.service.autoRepublish(id, body);
    }
};
exports.DistributionEngineController = DistributionEngineController;
__decorate([
    (0, common_1.Post)("channels"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DistributionEngineController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Get)("channels"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DistributionEngineController.prototype, "listChannels", null);
__decorate([
    (0, common_1.Post)("publish-jobs"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DistributionEngineController.prototype, "createJob", null);
__decorate([
    (0, common_1.Get)("publish-jobs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DistributionEngineController.prototype, "listJobs", null);
__decorate([
    (0, common_1.Patch)("publish-jobs/:id/published"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DistributionEngineController.prototype, "published", null);
__decorate([
    (0, common_1.Post)("publish-jobs/:id/auto-republish"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DistributionEngineController.prototype, "republish", null);
exports.DistributionEngineController = DistributionEngineController = __decorate([
    (0, common_1.Controller)("distribution-engine"),
    __metadata("design:paramtypes", [distribution_engine_service_1.DistributionEngineService])
], DistributionEngineController);
//# sourceMappingURL=distribution-engine.controller.js.map