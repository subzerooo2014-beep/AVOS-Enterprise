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
exports.PublisherVersioningController = void 0;
const common_1 = require("@nestjs/common");
const publisher_versioning_service_1 = require("./publisher-versioning.service");
let PublisherVersioningController = class PublisherVersioningController {
    constructor(service) {
        this.service = service;
    }
    createVersion(eventId, body) {
        return this.service.createVersion(eventId, body);
    }
    versions(eventId) {
        return this.service.versions(eventId);
    }
    version(eventId, version) {
        return this.service.version(eventId, Number(version));
    }
    compare(eventId, left, right) {
        return this.service.compare(eventId, Number(left), Number(right));
    }
    restore(eventId, version, body) {
        return this.service.restore(eventId, Number(version), body?.reason);
    }
    restoreHistory(eventId) {
        return this.service.restoreHistory(eventId);
    }
};
exports.PublisherVersioningController = PublisherVersioningController;
__decorate([
    (0, common_1.Post)(":eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublisherVersioningController.prototype, "createVersion", null);
__decorate([
    (0, common_1.Get)(":eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherVersioningController.prototype, "versions", null);
__decorate([
    (0, common_1.Get)(":eventId/:version"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Param)("version")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PublisherVersioningController.prototype, "version", null);
__decorate([
    (0, common_1.Get)(":eventId/compare/result"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Query)("left")),
    __param(2, (0, common_1.Query)("right")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PublisherVersioningController.prototype, "compare", null);
__decorate([
    (0, common_1.Post)(":eventId/restore/:version"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Param)("version")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PublisherVersioningController.prototype, "restore", null);
__decorate([
    (0, common_1.Get)(":eventId/restores/history"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherVersioningController.prototype, "restoreHistory", null);
exports.PublisherVersioningController = PublisherVersioningController = __decorate([
    (0, common_1.Controller)("publisher-engine/enterprise/versions"),
    __metadata("design:paramtypes", [publisher_versioning_service_1.PublisherVersioningService])
], PublisherVersioningController);
//# sourceMappingURL=publisher-versioning.controller.js.map