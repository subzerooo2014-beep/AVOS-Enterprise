"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AiWorkerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiWorkerService = void 0;
const common_1 = require("@nestjs/common");
let AiWorkerService = AiWorkerService_1 = class AiWorkerService {
    constructor() {
        this.logger = new common_1.Logger(AiWorkerService_1.name);
    }
    async onModuleInit() {
        this.logger.log("AI Worker temporarily paused during Prisma sync.");
    }
};
exports.AiWorkerService = AiWorkerService;
exports.AiWorkerService = AiWorkerService = AiWorkerService_1 = __decorate([
    (0, common_1.Injectable)()
], AiWorkerService);
//# sourceMappingURL=ai-worker.service.js.map