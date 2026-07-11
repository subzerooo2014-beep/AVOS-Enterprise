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
exports.RuntimeGovernanceSimulationController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const services_1 = require("../services");
let RuntimeGovernanceSimulationController = class RuntimeGovernanceSimulationController {
    constructor(simulations) {
        this.simulations = simulations;
    }
    simulate(requestId, dto) {
        return this.simulations
            .simulate(requestId, dto);
    }
    list() {
        return this.simulations.list();
    }
    get(id) {
        return this.simulations.get(id);
    }
};
exports.RuntimeGovernanceSimulationController = RuntimeGovernanceSimulationController;
__decorate([
    (0, common_1.Post)("requests/:requestId"),
    __param(0, (0, common_1.Param)("requestId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SimulateGovernanceRequestDto]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceSimulationController.prototype, "simulate", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceSimulationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeGovernanceSimulationController.prototype, "get", null);
exports.RuntimeGovernanceSimulationController = RuntimeGovernanceSimulationController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-4/simulations"),
    __metadata("design:paramtypes", [services_1.RuntimeGovernanceSimulationService])
], RuntimeGovernanceSimulationController);
//# sourceMappingURL=runtime-governance-simulation.controller.js.map