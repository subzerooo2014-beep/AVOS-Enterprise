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
exports.V5AuditPersistenceBridgeService = void 0;
const common_1 = require("@nestjs/common");
const audit_event_type_enum_1 = require("../../platform-hardening-v5/enums/audit-event-type.enum");
const audit_severity_enum_1 = require("../../platform-hardening-v5/enums/audit-severity.enum");
const persistent_audit_ledger_service_1 = require("./persistent-audit-ledger.service");
let V5AuditPersistenceBridgeService = class V5AuditPersistenceBridgeService {
    constructor(ledger) {
        this.ledger = ledger;
    }
    async onModuleInit() {
        const summary = await this.ledger.getSummary();
        if (summary.total > 0) {
            return;
        }
        await this.ledger.append({
            eventType: audit_event_type_enum_1.AuditEventType.SYSTEM,
            severity: audit_severity_enum_1.AuditSeverity.INFO,
            action: "persistent-audit-ledger-initialized",
            message: "AVOS persistent database audit ledger was initialized",
            actor: "platform",
            metadata: {
                hardeningVersion: "v6",
                sourceVersion: "v5",
            },
        });
    }
};
exports.V5AuditPersistenceBridgeService = V5AuditPersistenceBridgeService;
exports.V5AuditPersistenceBridgeService = V5AuditPersistenceBridgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [persistent_audit_ledger_service_1.PersistentAuditLedgerService])
], V5AuditPersistenceBridgeService);
//# sourceMappingURL=v5-audit-persistence-bridge.service.js.map