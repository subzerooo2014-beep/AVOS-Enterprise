"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportTradeModule = void 0;
const common_1 = require("@nestjs/common");
const export_trade_controller_1 = require("./export-trade.controller");
const export_trade_service_1 = require("./export-trade.service");
let ExportTradeModule = class ExportTradeModule {
};
exports.ExportTradeModule = ExportTradeModule;
exports.ExportTradeModule = ExportTradeModule = __decorate([
    (0, common_1.Module)({
        controllers: [export_trade_controller_1.ExportTradeController],
        providers: [export_trade_service_1.ExportTradeService],
        exports: [export_trade_service_1.ExportTradeService],
    })
], ExportTradeModule);
//# sourceMappingURL=export-trade.module.js.map