"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResilienceStateService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const resilience_mode_enum_1 = require("../enums/resilience-mode.enum");
let ResilienceStateService = class ResilienceStateService {
    constructor() {
        this.mode = resilience_mode_enum_1.ResilienceMode.NORMAL;
        this.maintenanceReason = null;
        this.events = [];
    }
    getMode() {
        return this.mode;
    }
    isMaintenance() {
        return this.mode === resilience_mode_enum_1.ResilienceMode.MAINTENANCE;
    }
    isBrownout() {
        return this.mode === resilience_mode_enum_1.ResilienceMode.BROWNOUT;
    }
    isEmergency() {
        return this.mode === resilience_mode_enum_1.ResilienceMode.EMERGENCY;
    }
    getMaintenanceReason() {
        return this.maintenanceReason;
    }
    setMode(mode, reason) {
        const previousMode = this.mode;
        this.mode = mode;
        if (mode === resilience_mode_enum_1.ResilienceMode.MAINTENANCE) {
            this.maintenanceReason =
                reason?.trim() ||
                    "Scheduled AVOS platform maintenance";
        }
        else {
            this.maintenanceReason = null;
        }
        this.recordEvent({
            type: "resilience.mode.changed",
            message: `Resilience mode changed from ${previousMode} to ${mode}`,
            previousMode,
            currentMode: mode,
            metadata: {
                reason: reason ?? null,
            },
        });
        return this.getSnapshot();
    }
    getSnapshot() {
        return {
            mode: this.mode,
            maintenanceReason: this.maintenanceReason,
            brownoutActive: this.isBrownout(),
            maintenanceActive: this.isMaintenance(),
            emergencyActive: this.isEmergency(),
            updatedAt: this.events[0]?.createdAt ?? null,
        };
    }
    getRecentEvents(limit = 50) {
        const normalizedLimit = Math.min(Math.max(limit, 1), 500);
        return this.events
            .slice(0, normalizedLimit)
            .map((item) => ({
            ...item,
            metadata: item.metadata
                ? { ...item.metadata }
                : undefined,
        }));
    }
    recordEvent(input) {
        this.events.unshift({
            id: (0, node_crypto_1.randomUUID)(),
            ...input,
            createdAt: new Date().toISOString(),
        });
        if (this.events.length > 1000) {
            this.events.length = 1000;
        }
    }
};
exports.ResilienceStateService = ResilienceStateService;
exports.ResilienceStateService = ResilienceStateService = __decorate([
    (0, common_1.Injectable)()
], ResilienceStateService);
//# sourceMappingURL=resilience-state.service.js.map