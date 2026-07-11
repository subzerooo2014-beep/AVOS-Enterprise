"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherCircuitBreakerService = void 0;
const common_1 = require("@nestjs/common");
let PublisherCircuitBreakerService = class PublisherCircuitBreakerService {
    constructor() {
        this.failureThreshold = this.readPositiveInteger(process.env.PUBLISHER_CIRCUIT_FAILURE_THRESHOLD, 5);
        this.successThreshold = this.readPositiveInteger(process.env.PUBLISHER_CIRCUIT_SUCCESS_THRESHOLD, 2);
        this.openDurationMs = this.readPositiveInteger(process.env.PUBLISHER_CIRCUIT_OPEN_MS, 60_000);
        this.circuits = new Map();
    }
    canExecute(channel) {
        const circuit = this.getOrCreate(channel);
        if (circuit.state === "closed") {
            return true;
        }
        if (circuit.state === "open") {
            const openedAt = circuit.openedAt?.getTime() ?? 0;
            if (Date.now() - openedAt <
                this.openDurationMs) {
                return false;
            }
            circuit.state = "half-open";
            circuit.halfOpenProbeActive = false;
            circuit.consecutiveSuccesses = 0;
        }
        if (circuit.halfOpenProbeActive) {
            return false;
        }
        circuit.halfOpenProbeActive = true;
        return true;
    }
    recordSuccess(channel) {
        const circuit = this.getOrCreate(channel);
        circuit.lastSuccessAt = new Date();
        circuit.consecutiveFailures = 0;
        if (circuit.state === "half-open") {
            circuit.consecutiveSuccesses += 1;
            circuit.halfOpenProbeActive = false;
            if (circuit.consecutiveSuccesses >=
                this.successThreshold) {
                circuit.state = "closed";
                circuit.openedAt = undefined;
                circuit.consecutiveSuccesses = 0;
            }
            return;
        }
        circuit.state = "closed";
        circuit.consecutiveSuccesses += 1;
    }
    recordFailure(channel) {
        const circuit = this.getOrCreate(channel);
        circuit.lastFailureAt = new Date();
        circuit.consecutiveFailures += 1;
        circuit.consecutiveSuccesses = 0;
        circuit.halfOpenProbeActive = false;
        if (circuit.state === "half-open" ||
            circuit.consecutiveFailures >=
                this.failureThreshold) {
            circuit.state = "open";
            circuit.openedAt = new Date();
        }
    }
    forceOpen(channel) {
        const circuit = this.getOrCreate(channel);
        circuit.state = "open";
        circuit.openedAt = new Date();
        circuit.halfOpenProbeActive = false;
    }
    reset(channel) {
        this.circuits.delete(this.normalize(channel));
    }
    snapshot() {
        return Array.from(this.circuits.values())
            .sort((left, right) => left.channel.localeCompare(right.channel))
            .map((circuit) => ({
            channel: circuit.channel,
            state: circuit.state,
            consecutiveFailures: circuit.consecutiveFailures,
            consecutiveSuccesses: circuit.consecutiveSuccesses,
            openedAt: circuit.openedAt,
            lastFailureAt: circuit.lastFailureAt,
            lastSuccessAt: circuit.lastSuccessAt,
        }));
    }
    getOrCreate(channel) {
        const normalized = this.normalize(channel);
        const existing = this.circuits.get(normalized);
        if (existing) {
            return existing;
        }
        const created = {
            channel: normalized,
            state: "closed",
            consecutiveFailures: 0,
            consecutiveSuccesses: 0,
            halfOpenProbeActive: false,
        };
        this.circuits.set(normalized, created);
        return created;
    }
    normalize(channel) {
        return String(channel || "unknown")
            .trim()
            .toLowerCase();
    }
    readPositiveInteger(value, fallback) {
        const numeric = Number(value);
        return Number.isInteger(numeric) && numeric > 0
            ? numeric
            : fallback;
    }
};
exports.PublisherCircuitBreakerService = PublisherCircuitBreakerService;
exports.PublisherCircuitBreakerService = PublisherCircuitBreakerService = __decorate([
    (0, common_1.Injectable)()
], PublisherCircuitBreakerService);
//# sourceMappingURL=publisher-circuit-breaker.service.js.map