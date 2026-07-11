"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseSessionManagerV2 = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_enterprise_runtime_contracts_1 = require("../contracts/codegen-enterprise-runtime.contracts");
const codegen_enterprise_session_store_1 = require("./codegen-enterprise-session-store");
class CodeGenEnterpriseSessionManagerV2 {
    store;
    constructor(store = new codegen_enterprise_session_store_1.CodeGenEnterpriseSessionStore()) {
        this.store = store;
    }
    create(request) {
        const now = new Date().toISOString();
        const session = {
            id: (0, node_crypto_1.randomUUID)(),
            request: structuredClone(request),
            status: codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CREATED,
            artifacts: structuredClone(request.artifacts),
            warnings: [],
            errors: [],
            timeline: [
                {
                    status: codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CREATED,
                    message: "Enterprise generation session created",
                    metadata: {},
                    occurredAt: now,
                },
            ],
            metrics: {
                artifacts: request.artifacts.length,
                generated: 0,
                skipped: 0,
                failed: 0,
                cacheHits: 0,
                cacheMisses: 0,
            },
            createdAt: now,
            updatedAt: now,
        };
        return this.store.save(session);
    }
    transition(sessionId, status, message, metadata = {}) {
        const session = this.store.get(sessionId);
        this.assertTransition(session.status, status);
        const now = new Date().toISOString();
        session.status =
            status;
        session.timeline.push({
            status,
            message,
            metadata: structuredClone(metadata),
            occurredAt: now,
        });
        session.updatedAt =
            now;
        if (status ===
            codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.EXECUTING &&
            !session.startedAt) {
            session.startedAt =
                now;
        }
        if ([
            codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.COMPLETED,
            codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
            codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CANCELLED,
            codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.ROLLED_BACK,
        ].includes(status)) {
            session.completedAt =
                now;
        }
        return this.store.save(session);
    }
    addWarning(sessionId, warning) {
        const session = this.store.get(sessionId);
        session.warnings.push(warning);
        session.updatedAt =
            new Date().toISOString();
        return this.store.save(session);
    }
    addError(sessionId, error) {
        const session = this.store.get(sessionId);
        session.errors.push(error);
        session.metrics.failed +=
            1;
        session.updatedAt =
            new Date().toISOString();
        return this.store.save(session);
    }
    updateMetrics(sessionId, input) {
        const session = this.store.get(sessionId);
        session.metrics = {
            ...session.metrics,
            ...input,
        };
        session.updatedAt =
            new Date().toISOString();
        return this.store.save(session);
    }
    cancel(sessionId, reason = "Session cancelled") {
        return this.transition(sessionId, codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CANCELLED, reason);
    }
    assertTransition(from, to) {
        const allowed = {
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CREATED]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.INITIALIZING,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CANCELLED,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.INITIALIZING]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.READY,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CANCELLED,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.READY]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.PLANNING,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CANCELLED,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.PLANNING]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.SCHEDULING,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.SCHEDULING]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.EXECUTING,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.EXECUTING]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.VALIDATING,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.ROLLING_BACK,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.VALIDATING]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.COMMITTING,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.ROLLING_BACK,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.COMMITTING]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.COMPLETED,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.ROLLING_BACK,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.COMPLETED]: [],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.ROLLING_BACK,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.CANCELLED]: [],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.ROLLING_BACK]: [
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.ROLLED_BACK,
                codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.FAILED,
            ],
            [codegen_enterprise_runtime_contracts_1.CodeGenEnterpriseSessionStatus.ROLLED_BACK]: [],
        };
        if (!allowed[from].includes(to)) {
            throw new codegen_errors_1.CodeGenValidationError(`Invalid enterprise session transition: ${from} -> ${to}`);
        }
    }
}
exports.CodeGenEnterpriseSessionManagerV2 = CodeGenEnterpriseSessionManagerV2;
//# sourceMappingURL=codegen-enterprise-session-manager-v2.js.map