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
exports.RuntimeAutonomousRecoveryController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeAutonomousRecoveryController = class RuntimeAutonomousRecoveryController {
    constructor(recovery) {
        this.recovery = recovery;
    }
    create(dto) {
        return this.recovery.create(dto);
    }
    list() {
        return this.recovery.list();
    }
    get(id) {
        return this.recovery.get(id);
    }
    approve(id, dto) {
        return this.recovery.approve(id, dto);
    }
    execute(id, dto) {
        return this.recovery.execute(id, dto);
    }
    rollback(id, actor) {
        return this.recovery.rollback(id, actor);
    }
};
exports.RuntimeAutonomousRecoveryController = RuntimeAutonomousRecoveryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRecoveryPlanDto]),
    __metadata("design:returntype", void 0)
], RuntimeAutonomousRecoveryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeAutonomousRecoveryController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeAutonomousRecoveryController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/approve"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ApproveRecoveryPlanDto]),
    __metadata("design:returntype", void 0)
], RuntimeAutonomousRecoveryController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(":id/execute"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ExecuteRecoveryPlanDto]),
    __metadata("design:returntype", void 0)
], RuntimeAutonomousRecoveryController.prototype, "execute", null);
__decorate([
    (0, common_1.Post)(":id/rollback"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.GovernanceActorDto]),
    __metadata("design:returntype", void 0)
], RuntimeAutonomousRecoveryController.prototype, "rollback", null);
exports.RuntimeAutonomousRecoveryController = RuntimeAutonomousRecoveryController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/recovery-plans"),
    __metadata("design:paramtypes", [services_1.RuntimeAutonomousRecoveryService])
], RuntimeAutonomousRecoveryController);
//# sourceMappingURL=runtime-autonomous-recovery.controller.js.map