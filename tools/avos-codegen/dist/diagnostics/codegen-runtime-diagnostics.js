"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRuntimeDiagnostics = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_contracts_1 = require("../core/codegen.contracts");
class CodeGenRuntimeDiagnostics {
    records = [];
    sequence = 0;
    write(input) {
        this.sequence += 1;
        const record = {
            id: (0, node_crypto_1.randomUUID)(),
            sequence: this.sequence,
            level: input.level,
            code: input.code,
            message: input.message,
            source: input.source,
            ...(input.executionId
                ? {
                    executionId: input.executionId,
                }
                : {}),
            details: input.details ?? {},
            createdAt: new Date().toISOString(),
        };
        this.records.push(record);
        return structuredClone(record);
    }
    debug(code, message, source, details = {}) {
        return this.write({
            level: codegen_contracts_1.CodeGenDiagnosticLevel.DEBUG,
            code,
            message,
            source,
            details,
        });
    }
    info(code, message, source, details = {}) {
        return this.write({
            level: codegen_contracts_1.CodeGenDiagnosticLevel.INFORMATIONAL,
            code,
            message,
            source,
            details,
        });
    }
    warning(code, message, source, details = {}) {
        return this.write({
            level: codegen_contracts_1.CodeGenDiagnosticLevel.WARNING,
            code,
            message,
            source,
            details,
        });
    }
    error(code, message, source, details = {}) {
        return this.write({
            level: codegen_contracts_1.CodeGenDiagnosticLevel.ERROR,
            code,
            message,
            source,
            details,
        });
    }
    critical(code, message, source, details = {}) {
        return this.write({
            level: codegen_contracts_1.CodeGenDiagnosticLevel.CRITICAL,
            code,
            message,
            source,
            details,
        });
    }
    list() {
        return this.records.map((record) => structuredClone(record));
    }
    snapshot() {
        const records = this.list();
        const count = (level) => records.filter((record) => record.level === level).length;
        const errors = count(codegen_contracts_1.CodeGenDiagnosticLevel.ERROR);
        const critical = count(codegen_contracts_1.CodeGenDiagnosticLevel.CRITICAL);
        return {
            total: records.length,
            debug: count(codegen_contracts_1.CodeGenDiagnosticLevel.DEBUG),
            informational: count(codegen_contracts_1.CodeGenDiagnosticLevel.INFORMATIONAL),
            warnings: count(codegen_contracts_1.CodeGenDiagnosticLevel.WARNING),
            errors,
            critical,
            healthy: errors === 0 &&
                critical === 0,
            generatedAt: new Date().toISOString(),
        };
    }
    clear() {
        this.records.splice(0, this.records.length);
        this.sequence = 0;
    }
}
exports.CodeGenRuntimeDiagnostics = CodeGenRuntimeDiagnostics;
//# sourceMappingURL=codegen-runtime-diagnostics.js.map