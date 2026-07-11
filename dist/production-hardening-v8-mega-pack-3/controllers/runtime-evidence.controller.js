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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeEvidenceController = void 0;
const common_1 = require("@nestjs/common");
const runtime_evidence_chain_service_1 = require("../services/runtime-evidence-chain.service");
let RuntimeEvidenceController = class RuntimeEvidenceController {
    constructor(evidence) {
        this.evidence = evidence;
    }
    list() {
        return this.evidence.list();
    }
    verify() {
        return this.evidence.verify();
    }
};
exports.RuntimeEvidenceController = RuntimeEvidenceController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeEvidenceController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RuntimeEvidenceController.prototype, "verify", null);
exports.RuntimeEvidenceController = RuntimeEvidenceController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/evidence"),
    __metadata("design:paramtypes", [runtime_evidence_chain_service_1.RuntimeEvidenceChainService])
], RuntimeEvidenceController);
//# sourceMappingURL=runtime-evidence.controller.js.map