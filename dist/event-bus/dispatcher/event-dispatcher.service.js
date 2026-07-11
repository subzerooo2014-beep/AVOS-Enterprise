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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcherService = void 0;
const common_1 = require("@nestjs/common");
const avos_brain_service_1 = require("../../avos-brain/avos-brain.service");
let EventDispatcherService = class EventDispatcherService {
    constructor(brain) {
        this.brain = brain;
    }
    async dispatch(event) {
        try {
            await this.brain.processEvent(event.id);
        }
        catch (e) {
            console.error("Dispatcher:", e);
        }
        return {
            dispatched: true,
            eventId: event.id,
        };
    }
};
exports.EventDispatcherService = EventDispatcherService;
exports.EventDispatcherService = EventDispatcherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [avos_brain_service_1.AvosBrainService])
], EventDispatcherService);
//# sourceMappingURL=event-dispatcher.service.js.map