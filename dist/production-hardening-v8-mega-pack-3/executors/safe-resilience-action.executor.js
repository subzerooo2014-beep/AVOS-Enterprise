"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeResilienceActionExecutor = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
let SafeResilienceActionExecutor = class SafeResilienceActionExecutor {
    supports(type) {
        return Object.values(runtime_resilience_enums_1.ResilienceActionType).includes(type);
    }
    async execute(context) {
        const action = context.action;
        if (action.dryRun) {
            return {
                succeeded: true,
                output: {
                    executionMode: "dry_run",
                    actionType: action.type,
                    target: action.target,
                    parameters: action.parameters,
                    runtimeContext: context.runtimeContext,
                    executedAt: new Date().toISOString(),
                },
            };
        }
        switch (action.type) {
            case runtime_resilience_enums_1.ResilienceActionType.NOTIFY:
                return this.success(action, {
                    operation: "notification_dispatched",
                });
            case runtime_resilience_enums_1.ResilienceActionType.THROTTLE:
                return this.success(action, {
                    operation: "runtime_throttle_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.ISOLATE:
                return this.success(action, {
                    operation: "service_isolation_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.DISABLE_FEATURE:
                return this.success(action, {
                    operation: "feature_disable_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.PAUSE_WORKFLOW:
                return this.success(action, {
                    operation: "workflow_pause_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.SWITCH_DEPENDENCY:
                return this.success(action, {
                    operation: "dependency_switch_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.SCALE_OUT:
                return this.success(action, {
                    operation: "scale_out_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.SCALE_IN:
                return this.success(action, {
                    operation: "scale_in_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.ROLLBACK:
                return this.success(action, {
                    operation: "rollback_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.RESTORE_BASELINE:
                return this.success(action, {
                    operation: "baseline_restore_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.LOCKDOWN:
                return this.success(action, {
                    operation: "runtime_lockdown_requested",
                });
            case runtime_resilience_enums_1.ResilienceActionType.CUSTOM:
                return this.success(action, {
                    operation: "custom_action_requested",
                });
            default:
                return {
                    succeeded: false,
                    output: {},
                    error: `Unsupported action type: ${String(action.type)}`,
                };
        }
    }
    success(action, values) {
        return {
            succeeded: true,
            output: {
                ...values,
                actionId: action.id,
                actionType: action.type,
                target: action.target,
                parameters: action.parameters,
                executedAt: new Date().toISOString(),
            },
        };
    }
};
exports.SafeResilienceActionExecutor = SafeResilienceActionExecutor;
exports.SafeResilienceActionExecutor = SafeResilienceActionExecutor = __decorate([
    (0, common_1.Injectable)()
], SafeResilienceActionExecutor);
//# sourceMappingURL=safe-resilience-action.executor.js.map