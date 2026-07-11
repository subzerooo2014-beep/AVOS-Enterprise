"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityHeadersMiddleware = void 0;
const common_1 = require("@nestjs/common");
let SecurityHeadersMiddleware = class SecurityHeadersMiddleware {
    use(_request, response, next) {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        response.setHeader("Permissions-Policy", [
            "camera=()",
            "microphone=()",
            "geolocation=()",
            "payment=()",
            "usb=()",
        ].join(", "));
        response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        response.setHeader("Cross-Origin-Resource-Policy", "same-site");
        response.setHeader("X-DNS-Prefetch-Control", "off");
        response.setHeader("X-Permitted-Cross-Domain-Policies", "none");
        response.removeHeader("X-Powered-By");
        const production = String(process.env.NODE_ENV ??
            "development").toLowerCase() ===
            "production";
        if (production) {
            response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        }
        next();
    }
};
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware;
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware = __decorate([
    (0, common_1.Injectable)()
], SecurityHeadersMiddleware);
//# sourceMappingURL=security-headers.middleware.js.map