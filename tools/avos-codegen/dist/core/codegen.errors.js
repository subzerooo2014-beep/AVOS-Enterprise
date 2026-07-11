"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenKernelStateError = exports.CodeGenDuplicateEngineError = exports.CodeGenEngineNotFoundError = exports.CodeGenValidationError = exports.CodeGenError = void 0;
class CodeGenError extends Error {
    code;
    causeValue;
    constructor(message, code = "CODEGEN_ERROR", causeValue) {
        super(message);
        this.code = code;
        this.causeValue = causeValue;
        this.name =
            new.target.name;
    }
}
exports.CodeGenError = CodeGenError;
class CodeGenValidationError extends CodeGenError {
    constructor(message, causeValue) {
        super(message, "CODEGEN_VALIDATION_ERROR", causeValue);
    }
}
exports.CodeGenValidationError = CodeGenValidationError;
class CodeGenEngineNotFoundError extends CodeGenError {
    constructor(key) {
        super(`CodeGen engine was not found: ${key}`, "CODEGEN_ENGINE_NOT_FOUND");
    }
}
exports.CodeGenEngineNotFoundError = CodeGenEngineNotFoundError;
class CodeGenDuplicateEngineError extends CodeGenError {
    constructor(key) {
        super(`CodeGen engine is already registered: ${key}`, "CODEGEN_DUPLICATE_ENGINE");
    }
}
exports.CodeGenDuplicateEngineError = CodeGenDuplicateEngineError;
class CodeGenKernelStateError extends CodeGenError {
    constructor(message) {
        super(message, "CODEGEN_KERNEL_STATE_ERROR");
    }
}
exports.CodeGenKernelStateError = CodeGenKernelStateError;
//# sourceMappingURL=codegen.errors.js.map