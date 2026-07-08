"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributedLockService = void 0;
const common_1 = require("@nestjs/common");
let DistributedLockService = class DistributedLockService {
    constructor() {
        this.locks = new Set();
    }
    acquire(key) {
        if (this.locks.has(key))
            return false;
        this.locks.add(key);
        return true;
    }
    release(key) {
        this.locks.delete(key);
        return true;
    }
};
exports.DistributedLockService = DistributedLockService;
exports.DistributedLockService = DistributedLockService = __decorate([
    (0, common_1.Injectable)()
], DistributedLockService);
//# sourceMappingURL=distributed-lock.service.js.map