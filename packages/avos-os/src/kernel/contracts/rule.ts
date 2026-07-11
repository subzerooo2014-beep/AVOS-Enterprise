import { AvosDecisionInput } from "./decision";

export interface AvosRule {
  name: string;
  supports(input: AvosDecisionInput): boolean;
  evaluate(input: AvosDecisionInput): string[];
}
