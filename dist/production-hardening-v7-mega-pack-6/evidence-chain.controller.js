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
exports.EvidenceChainController = void 0;
const common_1 = require("@nestjs/common");
const append_evidence_chain_dto_1 = require("./dto/append-evidence-chain.dto");
const evidence_chain_service_1 = require("./evidence-chain.service");
let EvidenceChainController = class EvidenceChainController {
    constructor(evidence) {
        this.evidence = evidence;
    }
    append(dto) {
        return this.evidence.append(dto);
    }
    list() {
        return this.evidence.list();
    }
    latest() {
        return this.evidence.latest();
    }
    verify() {
        return this.evidence.verify();
    }
};
exports.EvidenceChainController = EvidenceChainController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [append_evidence_chain_dto_1.AppendEvidenceChainDto]),
    __metadata("design:returntype", void 0)
], EvidenceChainController.prototype, "append", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvidenceChainController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("latest"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvidenceChainController.prototype, "latest", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvidenceChainController.prototype, "verify", null);
exports.EvidenceChainController = EvidenceChainController = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6/evidence-chain"),
    __metadata("design:paramtypes", [evidence_chain_service_1.EvidenceChainService])
], EvidenceChainController);
//# sourceMappingURL=evidence-chain.controller.js.map