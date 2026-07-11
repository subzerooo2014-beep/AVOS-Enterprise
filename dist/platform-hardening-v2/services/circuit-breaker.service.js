"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CircuitBreakerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreakerService = void 0;
const common_1 = require("@nestjs/common");
const circuit_state_enum_1 = require("../enums/circuit-state.enum");
const with_timeout_util_1 = require("../utils/with-timeout.util");
let CircuitBreakerService = CircuitBreakerService_1 = class CircuitBreakerService {
    constructor() {
        this.logger = new common_1.Logger(CircuitBreakerService_1.name);
        this.circuits = new Map();
    }
    async execute(circuitName, operation, options = {}) {
        const configuration = {
            failureThreshold: this.normalizeInteger(options.failureThreshold, 5, 1, 100),
            successThreshold: this.normalizeInteger(options.successThreshold, 2, 1, 100),
            openDurationMs: this.normalizeInteger(options.openDurationMs, 30_000, 1_000, 3_600_000),
            executionTimeoutMs: this.normalizeInteger(options.executionTimeoutMs, 10_000, 100, 600_000),
        };
        const circuit = this.getOrCreateCircuit(circuitName);
        this.refreshOpenCircuit(circuit, configuration.openDurationMs);
        if (circuit.state === circuit_state_enum_1.CircuitState.OPEN) {
            circuit.rejectedExecutions += 1;
            throw new common_1.ServiceUnavailableException({
                success: false,
                code: "CIRCUIT_OPEN",
                message: `Circuit ${circuitName} is temporarily open`,
                circuit: this.toSnapshot(circuit),
            });
        }
        circuit.totalExecutions += 1;
        try {
            const result = await (0, with_timeout_util_1.withTimeout)(operation(), configuration.executionTimeoutMs, `circuit:${circuitName}`);
            this.recordSuccess(circuit, configuration.successThreshold);
            return result;
        }
        catch (error) {
            this.recordFailure(circuit, configuration.failureThreshold);
            throw error;
        }
    }
    getSnapshot(circuitName) {
        const circuit = this.circuits.get(circuitName);
        return circuit ? this.toSnapshot(circuit) : null;
    }
    getAllSnapshots() {
        return Array.from(this.circuits.values())
            .map((circuit) => this.toSnapshot(circuit))
            .sort((left, right) => left.name.localeCompare(right.name));
    }
    reset(circuitName) {
        const circuit = this.getOrCreateCircuit(circuitName);
        circuit.state = circuit_state_enum_1.CircuitState.CLOSED;
        circuit.failures = 0;
        circuit.successesInHalfOpen = 0;
        circuit.openedAt = null;
        this.logger.log(`Circuit ${circuitName} was manually reset`);
        return this.toSnapshot(circuit);
    }
    getOrCreateCircuit(name) {
        const existing = this.circuits.get(name);
        if (existing) {
            return existing;
        }
        const created = {
            name,
            state: circuit_state_enum_1.CircuitState.CLOSED,
            failures: 0,
            successesInHalfOpen: 0,
            openedAt: null,
            lastFailureAt: null,
            lastSuccessAt: null,
            totalExecutions: 0,
            totalFailures: 0,
            totalSuccesses: 0,
            rejectedExecutions: 0,
        };
        this.circuits.set(name, created);
        return created;
    }
    refreshOpenCircuit(circuit, openDurationMs) {
        if (circuit.state !== circuit_state_enum_1.CircuitState.OPEN ||
            circuit.openedAt === null) {
            return;
        }
        if (Date.now() - circuit.openedAt >= openDurationMs) {
            circuit.state = circuit_state_enum_1.CircuitState.HALF_OPEN;
            circuit.successesInHalfOpen = 0;
            this.logger.warn(`Circuit ${circuit.name} moved from OPEN to HALF_OPEN`);
        }
    }
    recordSuccess(circuit, successThreshold) {
        circuit.lastSuccessAt = Date.now();
        circuit.totalSuccesses += 1;
        if (circuit.state === circuit_state_enum_1.CircuitState.HALF_OPEN) {
            circuit.successesInHalfOpen += 1;
            if (circuit.successesInHalfOpen >= successThreshold) {
                circuit.state = circuit_state_enum_1.CircuitState.CLOSED;
                circuit.failures = 0;
                circuit.successesInHalfOpen = 0;
                circuit.openedAt = null;
                this.logger.log(`Circuit ${circuit.name} recovered and moved to CLOSED`);
            }
            return;
        }
        circuit.failures = 0;
    }
    recordFailure(circuit, failureThreshold) {
        circuit.failures += 1;
        circuit.totalFailures += 1;
        circuit.lastFailureAt = Date.now();
        if (circuit.state === circuit_state_enum_1.CircuitState.HALF_OPEN ||
            circuit.failures >= failureThreshold) {
            circuit.state = circuit_state_enum_1.CircuitState.OPEN;
            circuit.openedAt = Date.now();
            circuit.successesInHalfOpen = 0;
            this.logger.error(`Circuit ${circuit.name} moved to OPEN after failure`);
        }
    }
    toSnapshot(circuit) {
        return {
            name: circuit.name,
            state: circuit.state,
            failures: circuit.failures,
            successesInHalfOpen: circuit.successesInHalfOpen,
            openedAt: this.toIsoDate(circuit.openedAt),
            lastFailureAt: this.toIsoDate(circuit.lastFailureAt),
            lastSuccessAt: this.toIsoDate(circuit.lastSuccessAt),
            totalExecutions: circuit.totalExecutions,
            totalFailures: circuit.totalFailures,
            totalSuccesses: circuit.totalSuccesses,
            rejectedExecutions: circuit.rejectedExecutions,
        };
    }
    toIsoDate(value) {
        return value === null ? null : new Date(value).toISOString();
    }
    normalizeInteger(value, fallback, minimum, maximum) {
        if (!Number.isFinite(value)) {
            return fallback;
        }
        return Math.min(maximum, Math.max(minimum, Math.floor(value)));
    }
};
exports.CircuitBreakerService = CircuitBreakerService;
exports.CircuitBreakerService = CircuitBreakerService = CircuitBreakerService_1 = __decorate([
    (0, common_1.Injectable)()
], CircuitBreakerService);
//# sourceMappingURL=circuit-breaker.service.js.map