"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherMemoryCacheService = void 0;
const common_1 = require("@nestjs/common");
let PublisherMemoryCacheService = class PublisherMemoryCacheService {
    constructor() {
        this.data = new Map();
    }
    get(key) {
        return this.data.get(key);
    }
    set(key, value) {
        this.data.set(key, value);
    }
    remove(key) {
        this.data.delete(key);
    }
    clear() {
        this.data.clear();
    }
    size() {
        return this.data.size;
    }
};
exports.PublisherMemoryCacheService = PublisherMemoryCacheService;
exports.PublisherMemoryCacheService = PublisherMemoryCacheService = __decorate([
    (0, common_1.Injectable)()
], PublisherMemoryCacheService);
//# sourceMappingURL=publisher-memory-cache.service.js.map