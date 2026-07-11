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
exports.RuntimeChangeWindowController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeChangeWindowController = class RuntimeChangeWindowController {
    constructor(changeWindows) {
        this.changeWindows = changeWindows;
    }
    create(dto) {
        return this.changeWindows.create(dto);
    }
    list() {
        return this.changeWindows.list();
    }
    get(id) {
        return this.changeWindows.get(id);
    }
    updateStatus(id, dto) {
        return this.changeWindows
            .updateStatus(id, dto);
    }
};
exports.RuntimeChangeWindowController = RuntimeChangeWindowController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateChangeWindowDto]),
    __metadata("design:returntype", void 0)
], RuntimeChangeWindowController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeChangeWindowController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeChangeWindowController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateChangeWindowStatusDto]),
    __metadata("design:returntype", void 0)
], RuntimeChangeWindowController.prototype, "updateStatus", null);
exports.RuntimeChangeWindowController = RuntimeChangeWindowController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/change-windows"),
    __metadata("design:paramtypes", [services_1.RuntimeChangeWindowService])
], RuntimeChangeWindowController);
//# sourceMappingURL=runtime-change-window.controller.js.map