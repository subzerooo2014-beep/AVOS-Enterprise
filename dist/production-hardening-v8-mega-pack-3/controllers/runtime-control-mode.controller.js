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
exports.RuntimeControlModeController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const runtime_control_mode_service_1 = require("../services/runtime-control-mode.service");
let RuntimeControlModeController = class RuntimeControlModeController {
    constructor(controlMode) {
        this.controlMode = controlMode;
    }
    get() {
        return this.controlMode.get();
    }
    change(dto) {
        return this.controlMode.change(dto);
    }
};
exports.RuntimeControlModeController = RuntimeControlModeController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeControlModeController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangeRuntimeControlModeDto]),
    __metadata("design:returntype", void 0)
], RuntimeControlModeController.prototype, "change", null);
exports.RuntimeControlModeController = RuntimeControlModeController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/control-mode"),
    __metadata("design:paramtypes", [runtime_control_mode_service_1.RuntimeControlModeService])
], RuntimeControlModeController);
//# sourceMappingURL=runtime-control-mode.controller.js.map