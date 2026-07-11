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
exports.RuntimeExecutionLockController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeExecutionLockController = class RuntimeExecutionLockController {
    constructor(locks) {
        this.locks = locks;
    }
    acquire(dto) {
        return this.locks.acquire(dto);
    }
    list() {
        return this.locks.list();
    }
    get(id) {
        return this.locks.get(id);
    }
    release(id, dto) {
        return this.locks.release(id, dto);
    }
    forceRelease(id, dto) {
        return this.locks
            .forceRelease(id, dto);
    }
};
exports.RuntimeExecutionLockController = RuntimeExecutionLockController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AcquireRuntimeLockDto]),
    __metadata("design:returntype", void 0)
], RuntimeExecutionLockController.prototype, "acquire", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeExecutionLockController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeExecutionLockController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/release"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ReleaseRuntimeLockDto]),
    __metadata("design:returntype", void 0)
], RuntimeExecutionLockController.prototype, "release", null);
__decorate([
    (0, common_1.Post)(":id/force-release"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ReleaseRuntimeLockDto]),
    __metadata("design:returntype", void 0)
], RuntimeExecutionLockController.prototype, "forceRelease", null);
exports.RuntimeExecutionLockController = RuntimeExecutionLockController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/execution-locks"),
    __metadata("design:paramtypes", [services_1.RuntimeExecutionLockService])
], RuntimeExecutionLockController);
//# sourceMappingURL=runtime-execution-lock.controller.js.map