"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclePublicUrlService = void 0;
const common_1 = require("@nestjs/common");
let VehiclePublicUrlService = class VehiclePublicUrlService {
    constructor() {
        this.websiteBaseUrl = (process.env.AVOS_WEBSITE_URL ??
            process.env.WEBSITE_BASE_URL ??
            "https://avos.ae").replace(/\/+$/, "");
    }
    vehicle(slug) {
        if (!slug?.trim()) {
            throw new Error("Vehicle slug is required to build the public URL");
        }
        return `${this.websiteBaseUrl}/vehicles/${encodeURIComponent(slug.trim())}`;
    }
    canonical(slug) {
        return this.vehicle(slug);
    }
    sitemap() {
        return `${this.websiteBaseUrl}/sitemap.xml`;
    }
};
exports.VehiclePublicUrlService = VehiclePublicUrlService;
exports.VehiclePublicUrlService = VehiclePublicUrlService = __decorate([
    (0, common_1.Injectable)()
], VehiclePublicUrlService);
//# sourceMappingURL=vehicle-public-url.service.js.map