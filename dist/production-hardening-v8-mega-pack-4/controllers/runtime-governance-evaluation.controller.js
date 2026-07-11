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
exports.RuntimeGovernanceEvaluationController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceEvaluationController = class RuntimeGovernanceEvaluationController {
    constructor(evaluations) {
        this.evaluations = evaluations;
    }
    evaluate(id, dto) {
        return this.evaluations
            .evaluate(id, dto);
    }
};
exports.RuntimeGovernanceEvaluationController = RuntimeGovernanceEvaluationController;
__decorate([
    (0, common_1.Post)("requests/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.EvaluateGovernanceRequestDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceEvaluationController.prototype, "evaluate", null);
exports.RuntimeGovernanceEvaluationController = RuntimeGovernanceEvaluationController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/evaluations"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceEvaluationService])
], RuntimeGovernanceEvaluationController);
//# sourceMappingURL=runtime-governance-evaluation.controller.js.map