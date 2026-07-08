"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountLockoutService = void 0;
const common_1 = require("@nestjs/common");
let AccountLockoutService = class AccountLockoutService {
    constructor() {
        this.attempts = new Map();
    }
    failed(email) {
        const n = (this.attempts.get(email) ?? 0) + 1;
        this.attempts.set(email, n);
        return n;
    }
    reset(email) {
        this.attempts.delete(email);
    }
};
exports.AccountLockoutService = AccountLockoutService;
exports.AccountLockoutService = AccountLockoutService = __decorate([
    (0, common_1.Injectable)()
], AccountLockoutService);
//# sourceMappingURL=account-lockout.service.js.map