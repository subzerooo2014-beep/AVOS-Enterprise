"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleImagesService = void 0;
const common_1 = require("@nestjs/common");
let VehicleImagesService = class VehicleImagesService {
    constructor() {
        this.storage = new Map();
    }
    list(vehicleId) {
        return this.storage.get(vehicleId) ?? [];
    }
    add(vehicleId, url) {
        const items = this.storage.get(vehicleId) ?? [];
        items.push(url);
        this.storage.set(vehicleId, items);
        return items;
    }
    remove(vehicleId, url) {
        const items = (this.storage.get(vehicleId) ?? []).filter(x => x !== url);
        this.storage.set(vehicleId, items);
        return items;
    }
};
exports.VehicleImagesService = VehicleImagesService;
exports.VehicleImagesService = VehicleImagesService = __decorate([
    (0, common_1.Injectable)()
], VehicleImagesService);
//# sourceMappingURL=vehicle-images.service.js.map