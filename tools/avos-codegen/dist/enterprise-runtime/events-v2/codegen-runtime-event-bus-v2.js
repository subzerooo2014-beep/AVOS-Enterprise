"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRuntimeEventBusV2 = void 0;
const node_crypto_1 = require("node:crypto");
class CodeGenRuntimeEventBusV2 {
    handlers = new Map();
    subscribe(eventType, handler) {
        const current = this.handlers.get(eventType) ??
            new Set();
        current.add(handler);
        this.handlers.set(eventType, current);
        return () => {
            current.delete(handler);
            if (current.size === 0) {
                this.handlers.delete(eventType);
            }
        };
    }
    async publish(input) {
        const event = {
            id: (0, node_crypto_1.randomUUID)(),
            type: input.type,
            source: input.source,
            payload: input.payload,
            metadata: structuredClone(input.metadata ?? {}),
            createdAt: new Date().toISOString(),
        };
        const handlers = [
            ...(this.handlers.get(input.type) ??
                []),
            ...(this.handlers.get("*") ??
                []),
        ];
        for (const handler of handlers) {
            await handler(event);
        }
        return event;
    }
    clear() {
        this.handlers.clear();
    }
}
exports.CodeGenRuntimeEventBusV2 = CodeGenRuntimeEventBusV2;
//# sourceMappingURL=codegen-runtime-event-bus-v2.js.map