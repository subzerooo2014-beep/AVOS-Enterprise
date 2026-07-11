import { AvosRule } from "../contracts/rule";
import { AvosDecisionInput } from "../contracts/decision";
export declare class RuleRegistry {
    private readonly rules;
    register(rule: AvosRule): void;
    resolve(input: AvosDecisionInput): AvosRule[];
}
