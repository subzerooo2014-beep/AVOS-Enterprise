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
exports.RuntimeGovernanceRestoreController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceRestoreController = class RuntimeGovernanceRestoreController {
    constructor(restores) {
        this.restores = restores;
    }
    create(dto) {
        return this.restores.create(dto);
    }
    list() {
        return this.restores.list();
    }
    get(id) {
        return this.restores.get(id);
    }
    validate(id) {
        return this.restores.validate(id);
    }
    execute(id, dto) {
        return this.restores.execute(id, dto);
    }
};
exports.RuntimeGovernanceRestoreController = RuntimeGovernanceRestoreController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGovernanceRestorePlanDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRestoreController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRestoreController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRestoreController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/validate"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRestoreController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)(":id/execute"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ExecuteGovernanceRestorePlanDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceRestoreController.prototype, "execute", null);
exports.RuntimeGovernanceRestoreController = RuntimeGovernanceRestoreController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/restores"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceRestoreService])
], RuntimeGovernanceRestoreController);
//# sourceMappingURL=runtime-governance-restore.controller.js.map