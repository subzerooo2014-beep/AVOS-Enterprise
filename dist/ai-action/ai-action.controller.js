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
exports.AiActionController = void 0;
const common_1 = require("@nestjs/common");
const ai_action_service_1 = require("./ai-action.service");
let AiActionController = class AiActionController {
    constructor(service) {
        this.service = service;
    }
    execute(id) {
        return this.service.execute(id);
    }
};
exports.AiActionController = AiActionController;
__decorate([
    (0, common_1.Get)("vehicle/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiActionController.prototype, "execute", null);
exports.AiActionController = AiActionController = __decorate([
    (0, common_1.Controller)("ai-action"),
    __metadata("design:paramtypes", [ai_action_service_1.AiActionService])
], AiActionController);
//# sourceMappingURL=ai-action.controller.js.map