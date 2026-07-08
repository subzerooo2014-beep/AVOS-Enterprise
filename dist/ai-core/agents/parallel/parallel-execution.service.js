"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelExecutionService = void 0;
const common_1 = require("@nestjs/common");
let ParallelExecutionService = class ParallelExecutionService {
    async execute(tasks) {
        return Promise.all(tasks.map(async (t) => ({
            task: t,
            status: "DONE"
        })));
    }
};
exports.ParallelExecutionService = ParallelExecutionService;
exports.ParallelExecutionService = ParallelExecutionService = __decorate([
    (0, common_1.Injectable)()
], ParallelExecutionService);
//# sourceMappingURL=parallel-execution.service.js.map