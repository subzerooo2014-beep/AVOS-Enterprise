"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseSequenceService = void 0;
const common_1 = require("@nestjs/common");
let EnterpriseSequenceService = class EnterpriseSequenceService {
    constructor() {
        this.sequence = 0;
    }
    next(prefix) {
        this.sequence =
            (this.sequence + 1) % 1000000;
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:TZ.]/g, "")
            .slice(0, 14);
        const suffix = String(this.sequence).padStart(6, "0");
        return `${prefix}-${timestamp}-${suffix}`;
    }
};
exports.EnterpriseSequenceService = EnterpriseSequenceService;
exports.EnterpriseSequenceService = EnterpriseSequenceService = __decorate([
    (0, common_1.Injectable)()
], EnterpriseSequenceService);
//# sourceMappingURL=enterprise-sequence.service.js.map