"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherIdempotencyService = void 0;
const common_1 = require("@nestjs/common");
let PublisherIdempotencyService = class PublisherIdempotencyService {
    constructor() {
        this.executed = new Set();
    }
    executedBefore(id) {
        return this.executed.has(id);
    }
    mark(id) {
        this.executed.add(id);
    }
    clear() {
        this.executed.clear();
    }
    count() {
        return this.executed.size;
    }
};
exports.PublisherIdempotencyService = PublisherIdempotencyService;
exports.PublisherIdempotencyService = PublisherIdempotencyService = __decorate([
    (0, common_1.Injectable)()
], PublisherIdempotencyService);
//# sourceMappingURL=publisher-idempotency.service.js.map