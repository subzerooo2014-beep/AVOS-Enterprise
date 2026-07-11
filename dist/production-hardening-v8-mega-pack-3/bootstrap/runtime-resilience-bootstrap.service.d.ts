import { OnModuleInit } from "@nestjs/common";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { ResilienceConfigurationService } from "../services/resilience-configuration.service";
import { ResiliencePolicyService } from "../services/resilience-policy.service";
import { RuntimeRiskEvaluationService } from "../services/runtime-risk-evaluation.service";
import { RuntimeSignalService } from "../services/runtime-signal.service";
import { RuntimeBaselineService } from "../services/runtime-baseline.service";
export declare class RuntimeResilienceBootstrapService implements OnModuleInit {
    private readonly store;
    private readonly configurations;
    private readonly policies;
    private readonly risk;
    private readonly signals;
    private readonly baselines;
    constructor(store: RuntimeResilienceStore, configurations: ResilienceConfigurationService, policies: ResiliencePolicyService, risk: RuntimeRiskEvaluationService, signals: RuntimeSignalService, baselines: RuntimeBaselineService);
    onModuleInit(): void;
    bootstrap(): void;
}
