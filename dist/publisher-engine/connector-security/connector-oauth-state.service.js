"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorOAuthStateService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let ConnectorOAuthStateService = class ConnectorOAuthStateService {
    constructor() {
        this.states = new Map();
        this.ttlMs = this.positiveInteger(process.env.CONNECTOR_OAUTH_STATE_TTL_MS, 10 * 60 * 1000);
    }
    create(input) {
        this.cleanup();
        const state = (0, node_crypto_1.randomBytes)(32)
            .toString("hex");
        const now = Date.now();
        const record = {
            state,
            channel: input.channel,
            redirectUri: input.redirectUri,
            createdAt: now,
            expiresAt: now + this.ttlMs,
            used: false,
        };
        this.states.set(state, record);
        return {
            state,
            channel: record.channel,
            redirectUri: record.redirectUri,
            expiresAt: new Date(record.expiresAt),
        };
    }
    consume(state, channel) {
        this.cleanup();
        const record = this.states.get(state);
        if (!record) {
            throw new common_1.BadRequestException("OAuth state is invalid or expired.");
        }
        if (record.used) {
            throw new common_1.BadRequestException("OAuth state has already been used.");
        }
        if (record.channel !== channel) {
            throw new common_1.BadRequestException("OAuth state channel mismatch.");
        }
        record.used = true;
        this.states.delete(state);
        return {
            valid: true,
            channel: record.channel,
            redirectUri: record.redirectUri,
            createdAt: new Date(record.createdAt),
        };
    }
    status() {
        this.cleanup();
        return {
            activeStates: this.states.size,
            ttlMs: this.ttlMs,
        };
    }
    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.states) {
            if (record.used ||
                record.expiresAt <= now) {
                this.states.delete(key);
            }
        }
    }
    positiveInteger(value, fallback) {
        const numeric = Number(value);
        return Number.isInteger(numeric) &&
            numeric > 0
            ? numeric
            : fallback;
    }
};
exports.ConnectorOAuthStateService = ConnectorOAuthStateService;
exports.ConnectorOAuthStateService = ConnectorOAuthStateService = __decorate([
    (0, common_1.Injectable)()
], ConnectorOAuthStateService);
//# sourceMappingURL=connector-oauth-state.service.js.map