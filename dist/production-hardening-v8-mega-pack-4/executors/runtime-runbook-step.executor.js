"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeRunbookStepExecutor = void 0;
const common_1 = require("@nestjs/common");
let RuntimeRunbookStepExecutor = class RuntimeRunbookStepExecutor {
    async execute(input) {
        if (input.step.parameters
            .forceFailure === true) {
            return {
                succeeded: false,
                output: {
                    stepType: input.step.type,
                    dryRun: input.dryRun,
                },
                error: "Forced runbook step failure",
            };
        }
        return {
            succeeded: true,
            output: {
                stepType: input.step.type,
                dryRun: input.dryRun,
                parameters: input.step.parameters,
                runtimeContext: input.runtimeContext,
                executedAt: new Date().toISOString(),
            },
        };
    }
};
exports.RuntimeRunbookStepExecutor = RuntimeRunbookStepExecutor;
exports.RuntimeRunbookStepExecutor = RuntimeRunbookStepExecutor = __decorate([
    (0, common_1.Injectable)()
], RuntimeRunbookStepExecutor);
//# sourceMappingURL=runtime-runbook-step.executor.js.map