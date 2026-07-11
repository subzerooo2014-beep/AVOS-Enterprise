"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV8MegaPack3Module = void 0;
const common_1 = require("@nestjs/common");
const controllers_1 = require("./controllers");
const services_1 = require("./services");
const executors_1 = require("./executors");
const runtime_resilience_store_1 = require("./stores/runtime-resilience.store");
const runtime_resilience_bootstrap_service_1 = require("./bootstrap/runtime-resilience-bootstrap.service");
const runtime_resilience_verification_service_1 = require("./verification/runtime-resilience-verification.service");
let ProductionHardeningV8MegaPack3Module = class ProductionHardeningV8MegaPack3Module {
};
exports.ProductionHardeningV8MegaPack3Module = ProductionHardeningV8MegaPack3Module;
exports.ProductionHardeningV8MegaPack3Module = ProductionHardeningV8MegaPack3Module = __decorate([
    (0, common_1.Module)({
        controllers: [
            controllers_1.ResilienceConfigurationController,
            controllers_1.ResiliencePolicyController,
            controllers_1.RuntimeRiskEvaluationController,
            controllers_1.RuntimeControlModeController,
            controllers_1.RuntimeSignalController,
            controllers_1.RuntimeIncidentController,
            controllers_1.ResilienceActionController,
            controllers_1.RuntimeBaselineController,
            controllers_1.RuntimeEvidenceController,
            controllers_1.RuntimeResilienceStatusController,
            controllers_1.RuntimeResilienceVerificationController,
        ],
        providers: [
            runtime_resilience_store_1.RuntimeResilienceStore,
            services_1.RuntimeEvidenceChainService,
            services_1.ResilienceConfigurationService,
            services_1.ResiliencePolicyService,
            services_1.ResiliencePolicyEvaluatorService,
            services_1.RuntimeRiskEvaluationService,
            services_1.RuntimeControlModeService,
            services_1.RuntimeSignalService,
            services_1.RuntimeIncidentService,
            services_1.RuntimeBaselineService,
            executors_1.SafeResilienceActionExecutor,
            executors_1.ResilienceActionExecutorRegistry,
            services_1.ResilienceActionService,
            services_1.RuntimeResilienceStatusService,
            runtime_resilience_bootstrap_service_1.RuntimeResilienceBootstrapService,
            runtime_resilience_verification_service_1.RuntimeResilienceVerificationService,
        ],
        exports: [
            runtime_resilience_store_1.RuntimeResilienceStore,
            services_1.RuntimeEvidenceChainService,
            services_1.ResilienceConfigurationService,
            services_1.ResiliencePolicyService,
            services_1.RuntimeRiskEvaluationService,
            services_1.RuntimeSignalService,
            services_1.RuntimeIncidentService,
            services_1.ResilienceActionService,
            services_1.RuntimeBaselineService,
            services_1.RuntimeControlModeService,
            services_1.RuntimeResilienceStatusService,
            runtime_resilience_verification_service_1.RuntimeResilienceVerificationService,
        ],
    })
], ProductionHardeningV8MegaPack3Module);
//# sourceMappingURL=production-hardening-v8-mega-pack-3.module.js.map