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
exports.PublishJobsController = void 0;
const common_1 = require("@nestjs/common");
const publish_jobs_service_1 = require("./publish-jobs.service");
let PublishJobsController = class PublishJobsController {
    constructor(service) {
        this.service = service;
    }
    all() {
        return this.service.all();
    }
    forVehicle(vehicleId) {
        return this.service.forVehicle(vehicleId);
    }
    test(vehicleId) {
        return this.service.create(vehicleId);
    }
};
exports.PublishJobsController = PublishJobsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublishJobsController.prototype, "all", null);
__decorate([
    (0, common_1.Get)("vehicle/:vehicleId"),
    __param(0, (0, common_1.Param)("vehicleId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublishJobsController.prototype, "forVehicle", null);
__decorate([
    (0, common_1.Post)("test/:vehicleId"),
    __param(0, (0, common_1.Param)("vehicleId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublishJobsController.prototype, "test", null);
exports.PublishJobsController = PublishJobsController = __decorate([
    (0, common_1.Controller)("publish-jobs"),
    __metadata("design:paramtypes", [publish_jobs_service_1.PublishJobsService])
], PublishJobsController);
//# sourceMappingURL=publish-jobs.controller.js.map