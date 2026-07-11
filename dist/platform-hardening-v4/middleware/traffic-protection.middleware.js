"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficProtectionMiddleware = void 0;
const common_1 = require("@nestjs/common");
const traffic_decision_enum_1 = require("../enums/traffic-decision.enum");
const resilience_state_service_1 = require("../services/resilience-state.service");
const traffic_protection_service_1 = require("../services/traffic-protection.service");
let TrafficProtectionMiddleware = class TrafficProtectionMiddleware {
    constructor(traffic, resilience) {
        this.traffic = traffic;
        this.resilience = resilience;
    }
    use(request, response, next) {
        const path = request.originalUrl ??
            request.url ??
            "/";
        const decision = this.traffic.evaluate(path);
        response.setHeader("x-avos-resilience-mode", this.resilience.getMode());
        response.setHeader("x-avos-traffic-decision", decision);
        if (decision !== traffic_decision_enum_1.TrafficDecision.ALLOW) {
            this.reject(response, decision, path);
            return;
        }
        this.traffic.beginRequest();
        let completed = false;
        const finish = () => {
            if (completed) {
                return;
            }
            completed = true;
            this.traffic.finishRequest();
        };
        response.on("finish", finish);
        response.on("close", finish);
        next();
    }
    reject(response, decision, path) {
        const statusCode = decision === traffic_decision_enum_1.TrafficDecision.MAINTENANCE
            ? 503
            : decision ===
                traffic_decision_enum_1.TrafficDecision.EMERGENCY_BLOCK
                ? 503
                : 429;
        response.statusCode = statusCode;
        response.setHeader("content-type", "application/json; charset=utf-8");
        response.setHeader("retry-after", decision === traffic_decision_enum_1.TrafficDecision.MAINTENANCE
            ? "300"
            : "60");
        response.end(JSON.stringify({
            success: false,
            system: "AVOS Enterprise Production",
            message: this.getMessage(decision),
            decision,
            path,
            resilienceMode: this.resilience.getMode(),
            timestamp: new Date().toISOString(),
        }));
    }
    getMessage(decision) {
        switch (decision) {
            case traffic_decision_enum_1.TrafficDecision.RATE_LIMIT:
                return "Request rate limit exceeded";
            case traffic_decision_enum_1.TrafficDecision.CONCURRENCY_LIMIT:
                return "Maximum concurrent request capacity reached";
            case traffic_decision_enum_1.TrafficDecision.LOAD_SHED:
                return "Request temporarily rejected to protect platform stability";
            case traffic_decision_enum_1.TrafficDecision.MAINTENANCE:
                return (this.resilience.getMaintenanceReason() ??
                    "Platform maintenance is active");
            case traffic_decision_enum_1.TrafficDecision.EMERGENCY_BLOCK:
                return "Emergency platform protection is active";
            default:
                return "Request rejected by AVOS traffic protection";
        }
    }
};
exports.TrafficProtectionMiddleware = TrafficProtectionMiddleware;
exports.TrafficProtectionMiddleware = TrafficProtectionMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [traffic_protection_service_1.TrafficProtectionService,
        resilience_state_service_1.ResilienceStateService])
], TrafficProtectionMiddleware);
//# sourceMappingURL=traffic-protection.middleware.js.map