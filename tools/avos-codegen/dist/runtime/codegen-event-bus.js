"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEventBus = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_contracts_1 = require("../core/codegen.contracts");
class CodeGenEventBus {
    handlers = new Map();
    history = [];
    sequence = 0;
    subscribe(type, handler) {
        const existing = this.handlers.get(type) ??
            new Set();
        existing.add(handler);
        this.handlers.set(type, existing);
        return () => {
            existing.delete(handler);
            if (existing.size === 0) {
                this.handlers.delete(type);
            }
        };
    }
    async emit(input) {
        this.sequence +=
            1;
        const event = {
            id: (0, node_crypto_1.randomUUID)(),
            sequence: this.sequence,
            type: input.type,
            severity: input.severity ??
                codegen_contracts_1.CodeGenEventSeverity.INFORMATIONAL,
            source: input.source,
            ...(input.executionId
                ? {
                    executionId: input.executionId,
                }
                : {}),
            payload: input.payload,
            metadata: input.metadata ?? {},
            createdAt: new Date().toISOString(),
        };
        this.history.push(event);
        const handlers = [
            ...(this.handlers.get(event.type) ?? []),
            ...(this.handlers.get("*") ?? []),
        ];
        for (const handler of handlers) {
            await handler(event);
        }
        return event;
    }
    list() {
        return this.history.map((event) => structuredClone(event));
    }
    clear() {
        this.history.splice(0, this.history.length);
        this.sequence =
            0;
    }
}
exports.CodeGenEventBus = CodeGenEventBus;
//# sourceMappingURL=codegen-event-bus.js.map