"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditEventType = void 0;
var AuditEventType;
(function (AuditEventType) {
    AuditEventType["REQUEST"] = "request";
    AuditEventType["POLICY_DECISION"] = "policy_decision";
    AuditEventType["SECURITY_VIOLATION"] = "security_violation";
    AuditEventType["CONFIGURATION_CHANGE"] = "configuration_change";
    AuditEventType["ADMIN_ACTION"] = "admin_action";
    AuditEventType["AUTHENTICATION"] = "authentication";
    AuditEventType["AUTHORIZATION"] = "authorization";
    AuditEventType["SYSTEM"] = "system";
})(AuditEventType || (exports.AuditEventType = AuditEventType = {}));
//# sourceMappingURL=audit-event-type.enum.js.map