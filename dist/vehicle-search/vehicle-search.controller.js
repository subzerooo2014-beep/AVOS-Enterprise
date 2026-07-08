"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleSearchController = void 0;
const common_1 = require("@nestjs/common");
const vehicle_search_service_1 = require("./vehicle-search.service");
const vehicle_search_dto_1 = require("./dto/vehicle-search.dto");
let VehicleSearchController = class VehicleSearchController {
    constructor(service) {
        this.service = service;
    }
    search(dto) {
        return this.service.search(dto);
    }
};
exports.VehicleSearchController = VehicleSearchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_search_dto_1.VehicleSearchDto]),
    __metadata("design:returntype", void 0)
], VehicleSearchController.prototype, "search", null);
exports.VehicleSearchController = VehicleSearchController = __decorate([
    (0, common_1.Controller)("vehicle-search"),
    __metadata("design:paramtypes", [vehicle_search_service_1.VehicleSearchService])
], VehicleSearchController);
//# sourceMappingURL=vehicle-search.controller.js.map