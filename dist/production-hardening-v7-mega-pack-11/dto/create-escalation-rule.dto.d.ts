export declare class CreateEscalationRuleDto {
    name: string;
    severity: "sev1" | "sev2" | "sev3" | "sev4";
    acknowledgeWithinMinutes?: number;
    escalateAfterMinutes?: number;
    targetRole: string;
    notifyExecutive?: boolean;
}
