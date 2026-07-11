"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerLifecycleService = void 0;
const common_1 = require("@nestjs/common");
let CustomerLifecycleService = class CustomerLifecycleService {
    calculateStage(score) {
        if (score >= 90)
            return "VIP";
        if (score >= 70)
            return "CUSTOMER";
        if (score >= 40)
            return "PROSPECT";
        return "LEAD";
    }
};
exports.CustomerLifecycleService = CustomerLifecycleService;
exports.CustomerLifecycleService = CustomerLifecycleService = __decorate([
    (0, common_1.Injectable)()
], CustomerLifecycleService);
//# sourceMappingURL=customer-lifecycle.service.js.map