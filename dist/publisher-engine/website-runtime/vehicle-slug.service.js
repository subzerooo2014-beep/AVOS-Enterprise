"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleSlugService = void 0;
const common_1 = require("@nestjs/common");
let VehicleSlugService = class VehicleSlugService {
    create(vehicle) {
        if (!vehicle?.id) {
            throw new Error("Vehicle id is required to generate a public slug");
        }
        const base = [
            vehicle.year,
            vehicle.make,
            vehicle.model,
            vehicle.trim?.name,
            vehicle.color,
        ]
            .filter(Boolean)
            .map((value) => String(value))
            .join(" ");
        const normalized = this.slugify(base);
        const suffix = String(vehicle.id).slice(-8).toLowerCase();
        return normalized
            ? `${normalized}-${suffix}`
            : `vehicle-${suffix}`;
    }
    slugify(value) {
        return value
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .replace(/-{2,}/g, "-")
            .slice(0, 120);
    }
};
exports.VehicleSlugService = VehicleSlugService;
exports.VehicleSlugService = VehicleSlugService = __decorate([
    (0, common_1.Injectable)()
], VehicleSlugService);
//# sourceMappingURL=vehicle-slug.service.js.map