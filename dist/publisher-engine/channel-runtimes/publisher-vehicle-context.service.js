"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherVehicleContextService = void 0;
const common_1 = require("@nestjs/common");
let PublisherVehicleContextService = class PublisherVehicleContextService {
    vehicleId(context) {
        const value = context?.vehicleId ??
            context?.result?.vehicleId ??
            context?.result?.entityId ??
            context?.result?.metadata?.vehicleId ??
            null;
        if (typeof value !== "string" ||
            !value.trim()) {
            throw new Error("Publisher runtime requires a vehicleId");
        }
        return value.trim();
    }
    async loadVehicle(prisma, context) {
        const vehicleId = this.vehicleId(context);
        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: vehicleId,
            },
            include: {
                inventory: true,
                brand: true,
                vehicleModel: true,
                trim: true,
                dealer: true,
                showroom: true,
            },
        });
        if (!vehicle) {
            throw new Error(`Vehicle "${vehicleId}" was not found`);
        }
        return vehicle;
    }
    title(vehicle) {
        return [
            vehicle?.year,
            vehicle?.make,
            vehicle?.model,
            vehicle?.trim?.name,
        ]
            .filter(Boolean)
            .join(" ");
    }
    price(vehicle, context) {
        const value = vehicle?.inventory?.price ??
            context?.result?.recommendedPrice ??
            context?.result?.creative?.price ??
            null;
        const numeric = Number(value);
        return Number.isFinite(numeric)
            ? numeric
            : null;
    }
};
exports.PublisherVehicleContextService = PublisherVehicleContextService;
exports.PublisherVehicleContextService = PublisherVehicleContextService = __decorate([
    (0, common_1.Injectable)()
], PublisherVehicleContextService);
//# sourceMappingURL=publisher-vehicle-context.service.js.map