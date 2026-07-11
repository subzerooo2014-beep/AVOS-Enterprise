"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseRuntimeLogger = exports.CodeGenRuntimeLogLevel = void 0;
var CodeGenRuntimeLogLevel;
(function (CodeGenRuntimeLogLevel) {
    CodeGenRuntimeLogLevel["DEBUG"] = "debug";
    CodeGenRuntimeLogLevel["INFORMATIONAL"] = "informational";
    CodeGenRuntimeLogLevel["WARNING"] = "warning";
    CodeGenRuntimeLogLevel["ERROR"] = "error";
})(CodeGenRuntimeLogLevel || (exports.CodeGenRuntimeLogLevel = CodeGenRuntimeLogLevel = {}));
class CodeGenEnterpriseRuntimeLogger {
    entries = [];
    log(level, message, context = {}) {
        const entry = {
            level,
            message,
            context: structuredClone(context),
            createdAt: new Date().toISOString(),
        };
        this.entries.push(entry);
        return structuredClone(entry);
    }
    list() {
        return structuredClone(this.entries);
    }
    clear() {
        this.entries.length = 0;
    }
}
exports.CodeGenEnterpriseRuntimeLogger = CodeGenEnterpriseRuntimeLogger;
//# sourceMappingURL=codegen-enterprise-runtime-logger.js.map