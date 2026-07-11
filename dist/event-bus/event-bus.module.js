"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusModule = void 0;
const common_1 = require("@nestjs/common");
const avos_brain_module_1 = require("../avos-brain/avos-brain.module");
const event_bus_service_1 = require("./event-bus.service");
const event_dispatcher_service_1 = require("./dispatcher/event-dispatcher.service");
let EventBusModule = class EventBusModule {
};
exports.EventBusModule = EventBusModule;
exports.EventBusModule = EventBusModule = __decorate([
    (0, common_1.Module)({
        imports: [avos_brain_module_1.AvosBrainModule],
        providers: [event_bus_service_1.EventBusService, event_dispatcher_service_1.EventDispatcherService],
        exports: [event_bus_service_1.EventBusService, event_dispatcher_service_1.EventDispatcherService],
    })
], EventBusModule);
//# sourceMappingURL=event-bus.module.js.map