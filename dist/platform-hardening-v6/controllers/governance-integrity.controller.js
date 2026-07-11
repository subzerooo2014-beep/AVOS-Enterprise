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
exports.GovernanceIntegrityController = void 0;
const common_1 = require("@nestjs/common");
const run_integrity_scan_dto_1 = require("../dto/run-integrity-scan.dto");
const governance_integrity_scanner_service_1 = require("../services/governance-integrity-scanner.service");
const governance_signature_backfill_service_1 = require("../services/governance-signature-backfill.service");
const v6_diagnostics_token_guard_1 = require("../services/v6-diagnostics-token.guard");
let GovernanceIntegrityController = class GovernanceIntegrityController {
    constructor(scanner, backfill) {
        this.scanner = scanner;
        this.backfill = backfill;
    }
    async summary() {
        return {
            success: true,
            integrity: await this.scanner.getSummary(),
        };
    }
    async history(limit) {
        return {
            success: true,
            scans: await this.scanner.getHistory(Number(limit) || 100),
        };
    }
    async scan(dto, request) {
        return {
            success: true,
            result: await this.scanner.run({
                scope: dto.scope ?? "all",
                executedBy: dto.executedBy ??
                    request.headers?.["x-avos-actor"] ??
                    "platform-owner",
                correlationId: request.headers?.["x-correlation-id"],
                traceId: request.headers?.["x-trace-id"],
            }),
        };
    }
    async backfillSignatures() {
        return {
            success: true,
            result: await this.backfill
                .backfillAll(),
        };
    }
};
exports.GovernanceIntegrityController = GovernanceIntegrityController;
__decorate([
    (0, common_1.Get)("summary"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceIntegrityController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)("history"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceIntegrityController.prototype, "history", null);
__decorate([
    (0, common_1.Post)("scan"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [run_integrity_scan_dto_1.RunIntegrityScanDto, Object]),
    __metadata("design:returntype", Promise)
], GovernanceIntegrityController.prototype, "scan", null);
__decorate([
    (0, common_1.Post)("signatures/backfill"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceIntegrityController.prototype, "backfillSignatures", null);
exports.GovernanceIntegrityController = GovernanceIntegrityController = __decorate([
    (0, common_1.Controller)("platform-hardening/v6/integrity"),
    (0, common_1.UseGuards)(v6_diagnostics_token_guard_1.V6DiagnosticsTokenGuard),
    __metadata("design:paramtypes", [governance_integrity_scanner_service_1.GovernanceIntegrityScannerService,
        governance_signature_backfill_service_1.GovernanceSignatureBackfillService])
], GovernanceIntegrityController);
//# sourceMappingURL=governance-integrity.controller.js.map