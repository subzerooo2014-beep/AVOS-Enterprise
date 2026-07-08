"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCacheService = void 0;
const common_1 = require("@nestjs/common");
let AiCacheService = class AiCacheService {
    constructor() {
        this.cache = new Map();
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    get(key) {
        return this.cache.get(key);
    }
    has(key) {
        return this.cache.has(key);
    }
    clear() {
        this.cache.clear();
    }
};
exports.AiCacheService = AiCacheService;
exports.AiCacheService = AiCacheService = __decorate([
    (0, common_1.Injectable)()
], AiCacheService);
//# sourceMappingURL=ai-cache.service.js.map