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
exports.RuntimeRunbookController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeRunbookController = class RuntimeRunbookController {
    constructor(runbooks) {
        this.runbooks = runbooks;
    }
    create(dto) {
        return this.runbooks.create(dto);
    }
    list() {
        return this.runbooks.list();
    }
    listExecutions() {
        return this.runbooks
            .listExecutions();
    }
    getExecution(id) {
        return this.runbooks
            .getExecution(id);
    }
    get(id) {
        return this.runbooks.get(id);
    }
    updateStatus(id, dto) {
        return this.runbooks
            .updateStatus(id, dto);
    }
    execute(id, dto) {
        return this.runbooks
            .execute(id, dto);
    }
};
exports.RuntimeRunbookController = RuntimeRunbookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRuntimeRunbookDto]),
    __metadata("design:returntype", void 0)
], RuntimeRunbookController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeRunbookController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("executions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeRunbookController.prototype, "listExecutions", null);
__decorate([
    (0, common_1.Get)("executions/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeRunbookController.prototype, "getExecution", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeRunbookController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateRuntimeRunbookStatusDto]),
    __metadata("design:returntype", void 0)
], RuntimeRunbookController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(":id/execute"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ExecuteRuntimeRunbookDto]),
    __metadata("design:returntype", void 0)
], RuntimeRunbookController.prototype, "execute", null);
exports.RuntimeRunbookController = RuntimeRunbookController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/runbooks"),
    __metadata("design:paramtypes", [services_1.RuntimeRunbookService])
], RuntimeRunbookController);
//# sourceMappingURL=runtime-runbook.controller.js.map