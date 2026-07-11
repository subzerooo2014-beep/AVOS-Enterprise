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
exports.ControlSchedulerController = void 0;
const common_1 = require("@nestjs/common");
const control_scheduler_service_1 = require("./control-scheduler.service");
const create_control_schedule_dto_1 = require("./dto/create-control-schedule.dto");
const set_enabled_dto_1 = require("./dto/set-enabled.dto");
let ControlSchedulerController = class ControlSchedulerController {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }
    create(dto) {
        return this.scheduler.create(dto);
    }
    list() {
        return this.scheduler.list();
    }
    get(id) {
        return this.scheduler.get(id);
    }
    runDue() {
        return this.scheduler.runDue();
    }
    runNow(id) {
        return this.scheduler.runNow(id);
    }
    setEnabled(id, dto) {
        return this.scheduler.enable(id, dto.enabled);
    }
};
exports.ControlSchedulerController = ControlSchedulerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_control_schedule_dto_1.CreateControlScheduleDto]),
    __metadata("design:returntype", void 0)
], ControlSchedulerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlSchedulerController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ControlSchedulerController.prototype, "get", null);
__decorate([
    (0, common_1.Post)("run-due"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ControlSchedulerController.prototype, "runDue", null);
__decorate([
    (0, common_1.Post)(":id/run"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ControlSchedulerController.prototype, "runNow", null);
__decorate([
    (0, common_1.Patch)(":id/enabled"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_enabled_dto_1.SetEnabledDto]),
    __metadata("design:returntype", void 0)
], ControlSchedulerController.prototype, "setEnabled", null);
exports.ControlSchedulerController = ControlSchedulerController = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6/scheduler"),
    __metadata("design:paramtypes", [control_scheduler_service_1.ControlSchedulerService])
], ControlSchedulerController);
//# sourceMappingURL=control-scheduler.controller.js.map