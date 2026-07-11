"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudAssessmentAgent = void 0;
class FraudAssessmentAgent {
    constructor() {
        this.name = "FraudAssessmentAgent";
    }
    supports(taskType) {
        return taskType === "fraud_assessment";
    }
    async execute(input) {
        const flags = [];
        let riskScore = 8;
        if (!input?.vin) {
            flags.push("VIN_NOT_AVAILABLE_IN_TASK_INPUT");
            riskScore += 8;
        }
        if (!input?.make || !input?.model || !input?.year) {
            flags.push("MISSING_CORE_VEHICLE_DATA");
            riskScore += 18;
        }
        if (Number(input?.year || 0) > new Date().getFullYear() + 1) {
            flags.push("FUTURE_YEAR_SUSPICIOUS");
            riskScore += 25;
        }
        if (input?.priceTooLow === true) {
            flags.push("PRICE_TOO_LOW");
            riskScore += 30;
        }
        if (input?.missingDocuments === true) {
            flags.push("MISSING_DOCUMENTS");
            riskScore += 30;
        }
        riskScore = Math.min(100, riskScore);
        const risk = riskScore >= 75 ? "HIGH" :
            riskScore >= 45 ? "MEDIUM" :
                "LOW";
        const decision = risk === "HIGH"
            ? "manual_review"
            : risk === "MEDIUM"
                ? "verify_documents"
                : "allow";
        return {
            status: "success",
            confidence: 94,
            reason: "Fraud risk assessed using vehicle data completeness, year sanity, pricing signals and document flags.",
            output: {
                risk,
                riskScore,
                decision,
                flags,
                checks: {
                    vinAvailable: Boolean(input?.vin),
                    coreDataComplete: Boolean(input?.make && input?.model && input?.year),
                    yearSanityPassed: !(Number(input?.year || 0) > new Date().getFullYear() + 1),
                    priceSignalChecked: Boolean(input?.priceTooLow !== undefined),
                    documentSignalChecked: Boolean(input?.missingDocuments !== undefined),
                },
                fraudModel: "AVOS-FRAUD-V1",
            },
        };
    }
}
exports.FraudAssessmentAgent = FraudAssessmentAgent;
//# sourceMappingURL=fraud-assessment.agent.js.map