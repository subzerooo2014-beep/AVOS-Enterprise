"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditEvent = void 0;
class AuditEvent {
    constructor(action, entity, entityId, userId) {
        this.action = action;
        this.entity = entity;
        this.entityId = entityId;
        this.userId = userId;
    }
}
exports.AuditEvent = AuditEvent;
//# sourceMappingURL=audit-event.js.map