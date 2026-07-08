"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryOptimizerService = void 0;
const common_1 = require("@nestjs/common");
let InventoryOptimizerService = class InventoryOptimizerService {
    optimize(items) {
        return {
            optimized: true,
            suggestions: [
                "Move slow vehicles",
                "Promote high demand vehicles",
                "Reduce aged inventory",
            ],
        };
    }
};
exports.InventoryOptimizerService = InventoryOptimizerService;
exports.InventoryOptimizerService = InventoryOptimizerService = __decorate([
    (0, common_1.Injectable)()
], InventoryOptimizerService);
//# sourceMappingURL=inventory-optimizer.service.js.map