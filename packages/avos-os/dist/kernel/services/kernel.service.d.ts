import { AvosDecision, AvosDecisionInput } from "../contracts/decision";
export declare class AvosKernelService {
    private readonly rules;
    constructor();
    decide(input: AvosDecisionInput): AvosDecision;
    private vehicleCreatedRule;
}
