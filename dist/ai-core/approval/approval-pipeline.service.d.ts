export declare class ApprovalPipelineService {
    evaluate(item: any): {
        approved: boolean;
        stage: string;
        confidence: number;
        item: any;
    };
}
