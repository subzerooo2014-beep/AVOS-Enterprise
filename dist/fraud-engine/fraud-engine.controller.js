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
exports.FraudEngineController = void 0;
const common_1 = require("@nestjs/common");
const fraud_engine_service_1 = require("./fraud-engine.service");
let FraudEngineController = class FraudEngineController {
    constructor(service) {
        this.service = service;
    }
    addSignal(body) {
        return this.service.addSignal(body);
    }
    assess(body) {
        return this.service.assess(body);
    }
    list() {
        return this.service.listAssessments();
    }
};
exports.FraudEngineController = FraudEngineController;
__decorate([
    (0, common_1.Post)("signals"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FraudEngineController.prototype, "addSignal", null);
__decorate([
    (0, common_1.Post)("assess"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FraudEngineController.prototype, "assess", null);
__decorate([
    (0, common_1.Get)("assessments"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FraudEngineController.prototype, "list", null);
exports.FraudEngineController = FraudEngineController = __decorate([
    (0, common_1.Controller)("fraud-engine"),
    __metadata("design:paramtypes", [fraud_engine_service_1.FraudEngineService])
], FraudEngineController);
//# sourceMappingURL=fraud-engine.controller.js.map