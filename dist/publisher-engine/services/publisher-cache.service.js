"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherCacheService = void 0;
const common_1 = require("@nestjs/common");
let PublisherCacheService = class PublisherCacheService {
    constructor() {
        this.cache = new Map();
    }
    get(key) {
        return this.cache.get(key);
    }
    set(key, value) {
        this.cache.set(key, value);
        return value;
    }
    has(key) {
        return this.cache.has(key);
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    stats() {
        return {
            keys: this.cache.size,
        };
    }
};
exports.PublisherCacheService = PublisherCacheService;
exports.PublisherCacheService = PublisherCacheService = __decorate([
    (0, common_1.Injectable)()
], PublisherCacheService);
//# sourceMappingURL=publisher-cache.service.js.map