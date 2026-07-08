"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStoreService = void 0;
const common_1 = require("@nestjs/common");
let VectorStoreService = class VectorStoreService {
    constructor() {
        this.store = [];
    }
    add(id, vector, metadata) {
        this.store.push({ id, vector, metadata });
        return true;
    }
    search(vector) {
        return this.store.slice(0, 10);
    }
};
exports.VectorStoreService = VectorStoreService;
exports.VectorStoreService = VectorStoreService = __decorate([
    (0, common_1.Injectable)()
], VectorStoreService);
//# sourceMappingURL=vector-store.service.js.map