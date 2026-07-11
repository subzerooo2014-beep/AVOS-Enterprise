"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBusModule = void 0;
const common_1 = require("@nestjs/common");
const query_bus_controller_1 = require("./query-bus.controller");
const query_bus_service_1 = require("./query-bus.service");
let QueryBusModule = class QueryBusModule {
};
exports.QueryBusModule = QueryBusModule;
exports.QueryBusModule = QueryBusModule = __decorate([
    (0, common_1.Module)({
        controllers: [query_bus_controller_1.QueryBusController],
        providers: [query_bus_service_1.QueryBusService],
        exports: [query_bus_service_1.QueryBusService],
    })
], QueryBusModule);
//# sourceMappingURL=query-bus.module.js.map