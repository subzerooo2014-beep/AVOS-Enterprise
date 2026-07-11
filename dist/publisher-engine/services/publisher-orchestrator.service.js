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
exports.PublisherOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const publisher_dispatcher_service_1 = require("../publisher-dispatcher.service");
const publisher_watchdog_service_1 = require("./publisher-watchdog.service");
const publisher_system_service_1 = require("./publisher-system.service");
let PublisherOrchestratorService = class PublisherOrchestratorService {
    constructor(dispatcher, watchdog, system) {
        this.dispatcher = dispatcher;
        this.watchdog = watchdog;
        this.system = system;
    }
    async execute(limit = 20) {
        await this.watchdog.run();
        const dispatch = await this.dispatcher.dispatchQueued(limit);
        return {
            success: true,
            dispatch,
            system: await this.system.status(),
            finishedAt: new Date(),
        };
    }
};
exports.PublisherOrchestratorService = PublisherOrchestratorService;
exports.PublisherOrchestratorService = PublisherOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_dispatcher_service_1.PublisherDispatcherService,
        publisher_watchdog_service_1.PublisherWatchdogService,
        publisher_system_service_1.PublisherSystemService])
], PublisherOrchestratorService);
//# sourceMappingURL=publisher-orchestrator.service.js.map