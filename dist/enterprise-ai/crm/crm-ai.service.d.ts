export declare class CrmAiService {
    analyze(customer: any): {
        score: number;
        churnRisk: string;
        nextAction: string;
    };
}
