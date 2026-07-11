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
exports.AiCoreController = void 0;
const common_1 = require("@nestjs/common");
const ai_core_service_1 = require("./ai-core.service");
let AiCoreController = class AiCoreController {
    constructor(service) {
        this.service = service;
    }
    createAgent(body) {
        return this.service.createAgent(body);
    }
    listAgents() {
        return this.service.listAgents();
    }
    createEvent(body) {
        return this.service.createEvent(body);
    }
    listEvents() {
        return this.service.listEvents();
    }
    explain(body) {
        return this.service.explainDecision(body);
    }
};
exports.AiCoreController = AiCoreController;
__decorate([
    (0, common_1.Post)("agents"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiCoreController.prototype, "createAgent", null);
__decorate([
    (0, common_1.Get)("agents"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiCoreController.prototype, "listAgents", null);
__decorate([
    (0, common_1.Post)("events"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiCoreController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiCoreController.prototype, "listEvents", null);
__decorate([
    (0, common_1.Post)("explain"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiCoreController.prototype, "explain", null);
exports.AiCoreController = AiCoreController = __decorate([
    (0, common_1.Controller)("ai-core"),
    __metadata("design:paramtypes", [ai_core_service_1.AiCoreService])
], AiCoreController);
//# sourceMappingURL=ai-core.controller.js.map