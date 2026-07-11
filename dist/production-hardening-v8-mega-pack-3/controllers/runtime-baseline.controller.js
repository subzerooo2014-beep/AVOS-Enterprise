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
exports.RuntimeBaselineController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const runtime_baseline_service_1 = require("../services/runtime-baseline.service");
let RuntimeBaselineController = class RuntimeBaselineController {
    constructor(baselines) {
        this.baselines = baselines;
    }
    capture(dto) {
        return this.baselines.capture(dto);
    }
    list() {
        return this.baselines.list();
    }
    get(id) {
        return this.baselines.get(id);
    }
    verify(id) {
        return this.baselines.verify(id);
    }
};
exports.RuntimeBaselineController = RuntimeBaselineController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CaptureRuntimeBaselineDto]),
    __metadata("design:returntype", void 0)
], RuntimeBaselineController.prototype, "capture", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeBaselineController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeBaselineController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(":id/verify"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeBaselineController.prototype, "verify", null);
exports.RuntimeBaselineController = RuntimeBaselineController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/baselines"),
    __metadata("design:paramtypes", [runtime_baseline_service_1.RuntimeBaselineService])
], RuntimeBaselineController);
//# sourceMappingURL=runtime-baseline.controller.js.map