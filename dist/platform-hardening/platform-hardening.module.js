"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const request_context_middleware_1 = require("./request-context.middleware");
const security_headers_middleware_1 = require("./security-headers.middleware");
const platform_exception_filter_1 = require("./platform-exception.filter");
const platform_hardening_service_1 = require("./platform-hardening.service");
const platform_hardening_controller_1 = require("./platform-hardening.controller");
let PlatformHardeningModule = class PlatformHardeningModule {
    configure(consumer) {
        consumer
            .apply(request_context_middleware_1.RequestContextMiddleware, security_headers_middleware_1.SecurityHeadersMiddleware)
            .forRoutes({
            path: "*",
            method: common_1.RequestMethod.ALL,
        });
    }
};
exports.PlatformHardeningModule = PlatformHardeningModule;
exports.PlatformHardeningModule = PlatformHardeningModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            platform_hardening_controller_1.PlatformHardeningController,
        ],
        providers: [
            platform_hardening_service_1.PlatformHardeningService,
            {
                provide: core_1.APP_FILTER,
                useClass: platform_exception_filter_1.PlatformExceptionFilter,
            },
        ],
        exports: [
            platform_hardening_service_1.PlatformHardeningService,
        ],
    })
], PlatformHardeningModule);
//# sourceMappingURL=platform-hardening.module.js.map