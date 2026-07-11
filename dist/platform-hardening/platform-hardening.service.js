"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningService = void 0;
const common_1 = require("@nestjs/common");
let PlatformHardeningService = class PlatformHardeningService {
    status() {
        const production = String(process.env.NODE_ENV ??
            "development").toLowerCase() ===
            "production";
        return {
            success: true,
            system: "AVOS Platform Hardening",
            version: "v1",
            environment: process.env.NODE_ENV ??
                "development",
            protections: {
                requestId: true,
                structuredErrors: true,
                securityHeaders: true,
                databaseErrorMapping: true,
                internalErrorMasking: production,
                hsts: production,
                poweredByHidden: true,
            },
            recommendations: [
                production
                    ? null
                    : "Set NODE_ENV=production before public deployment.",
                String(process.env
                    .WEBHOOK_SIGNATURE_REQUIRED ??
                    "false").toLowerCase() ===
                    "true"
                    ? null
                    : "Enable mandatory webhook signatures before production.",
                String(process.env
                    .PUBLISHER_DELIVERY_MODE ??
                    "mock").toLowerCase() ===
                    "production"
                    ? null
                    : "Replace mock publisher credentials before production.",
            ].filter(Boolean),
            checkedAt: new Date(),
        };
    }
};
exports.PlatformHardeningService = PlatformHardeningService;
exports.PlatformHardeningService = PlatformHardeningService = __decorate([
    (0, common_1.Injectable)()
], PlatformHardeningService);
//# sourceMappingURL=platform-hardening.service.js.map