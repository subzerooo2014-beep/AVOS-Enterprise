"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseSessionStore = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenEnterpriseSessionStore {
    sessions = new Map();
    save(session) {
        this.sessions.set(session.id, structuredClone(session));
        return structuredClone(session);
    }
    get(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new codegen_errors_1.CodeGenValidationError(`Enterprise generation session was not found: ${sessionId}`);
        }
        return structuredClone(session);
    }
    find(sessionId) {
        const session = this.sessions.get(sessionId);
        return session
            ? structuredClone(session)
            : undefined;
    }
    list() {
        return Array.from(this.sessions.values())
            .map((session) => structuredClone(session))
            .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    }
    remove(sessionId) {
        const session = this.get(sessionId);
        this.sessions.delete(sessionId);
        return session;
    }
    clear() {
        this.sessions.clear();
    }
}
exports.CodeGenEnterpriseSessionStore = CodeGenEnterpriseSessionStore;
//# sourceMappingURL=codegen-enterprise-session-store.js.map