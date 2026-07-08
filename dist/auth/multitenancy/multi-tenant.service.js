"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiTenantService = void 0;
const common_1 = require("@nestjs/common");
let MultiTenantService = class MultiTenantService {
    resolve(tenantId) {
        return {
            tenantId,
            resolved: true,
        };
    }
};
exports.MultiTenantService = MultiTenantService;
exports.MultiTenantService = MultiTenantService = __decorate([
    (0, common_1.Injectable)()
], MultiTenantService);
//# sourceMappingURL=multi-tenant.service.js.map