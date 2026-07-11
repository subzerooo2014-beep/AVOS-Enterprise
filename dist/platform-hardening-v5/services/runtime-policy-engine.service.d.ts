import { PolicyEnforcementMode } from "../enums/policy-enforcement-mode.enum";
import { RiskLevel } from "../enums/risk-level.enum";
import { PolicyEvaluation } from "../interfaces/policy-evaluation.interface";
import { RuntimePolicy } from "../interfaces/runtime-policy.interface";
export declare class RuntimePolicyEngineService {
    private mode;
    private readonly policies;
    constructor();
    evaluate(input: {
        method: string;
        path: string;
        approvalToken?: string;
        environment?: string;
    }): PolicyEvaluation;
    getMode(): PolicyEnforcementMode;
    setMode(mode: PolicyEnforcementMode): PolicyEnforcementMode;
    findAll(): RuntimePolicy[];
    setEnabled(id: string, enabled: boolean): RuntimePolicy | null;
    getSecurityRiskSummary(): {
        enforcementMode: PolicyEnforcementMode;
        totalPolicies: number;
        enabledPolicies: number;
        disabledPolicies: number;
        maximumConfiguredRiskLevel: RiskLevel;
    };
    private seedPolicies;
    private severityScore;
    private calculateRiskLevel;
    private readMode;
}
